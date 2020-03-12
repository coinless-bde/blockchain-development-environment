import {
    BehaviorSubject,
    merge,
    Observable,
    OperatorFunction,
    queueScheduler,
    scheduled,
    Subject,
    Subscription,
} from "rxjs"
import {
    EventEmitter,
    Inject,
    Injectable,
    InjectionToken,
    isDevMode,
    ModuleWithProviders,
    NgModule,
    OnDestroy,
    Type,
} from "@angular/core"
import {
    distinctUntilChanged,
    filter,
    map,
    pairwise,
    scan,
    share,
    shareReplay,
    startWith,
    withLatestFrom,
} from "rxjs/operators"
import { Effect, EffectAdapter, EffectMetadata } from "ng-effects"
import { Command as CommandType, Event as EventType } from "./interfaces"
import { diff } from "./devtools"
import { CustomEffectDecorator } from "ng-effects/lib/internals/interfaces"

export type Event<T = any> = T & {
    type: string
}

export interface EventConstructor<TType extends string, TReturn = { type: TType }> {
    type: TType
    new<TPayload>(payload: TPayload): Readonly<TPayload> & TReturn
    new(): TReturn
}

export function Command<T extends string>(type: T) {
    const command = class extends CommandType<T> {
        static type = type
        type!: T
    } as EventConstructor<T>
    Object.defineProperty(command.prototype, "type", {
        value: type
    })
    return command
}

export function Event<T extends string>(type: T) {
    const event = class extends EventType<T> {
        static type = type
        type!: T
    } as EventConstructor<T>
    Object.defineProperty(event.prototype, "type", {
        value: type
    })
    return event
}

export function ofType<T extends Type<any>>(type: T): OperatorFunction<Event, InstanceType<T>>
export function ofType<T>(type: T): OperatorFunction<Event, Event<T>>
export function ofType<T>(type: any): OperatorFunction<Event, unknown> {
    return function(source) {
        type = typeof type === "function" ? type.type : type
        return source.pipe(
            filter(action => action.type === type)
        )
    }
}

export function Action<T extends CommandType<any>>(command: Type<T>) {
    return Effect(ActionAdapter, command) as CustomEffectDecorator<ActionEffectFn<T, EventType<any>>>
}

export type ActionEffectFn<T extends CommandType<any>, U extends EventType<any>> = (command: Observable<T>) => Observable<U>

@Injectable({ providedIn: "root" })
export class Events extends Observable<EventType<any>> {
    constructor(dispatcher: Dispatcher) {
        super(subscriber => dispatcher.subscribe(subscriber));
    }
}

@Injectable({ providedIn: "root" })
export class ActionAdapter<T extends CommandType<any>> implements EffectAdapter<ActionEffectFn<T, EventType<any>>, T> {
    constructor(private dispatcher: Dispatcher) {}

    create(effectFn: ActionEffectFn<T, EventType<any>>, metadata: EffectMetadata<T>) {
        const command = this.dispatcher.pipe(
            ofType(metadata.options)
        )

        return effectFn(command)
    }

    next(event: Event) {
        this.dispatcher.next(event)
    }
}

export function Dispatch<U extends any>(action: Type<U>) {
    return Effect(DispatchAdapter as Type<DispatchAdapter<U>>, action)
}

@Injectable({ providedIn: "root" })
export abstract class Commands extends Observable<CommandType<any>> {
    constructor(dispatcher: Dispatcher) {
        super(subscriber => dispatcher.subscribe(subscriber));
    }
}

export type Payload<T extends Event> = Omit<{
    [key in keyof T]: T[key]
}, "type">

export function select<T, U>(selector: (state: T) => U): OperatorFunction<T, U> {
    return function(source) {
        return source.pipe(map(selector), distinctUntilChanged())
    }
}

export type Select<T, U> = {
    [key in keyof U]?: (state: T) => U[key]
}

export type SelectEffectFn<T = any, U = any> = () => Select<T, U>

export function Select<T, U extends any>() {
    return Effect(SelectAdapter as Type<SelectAdapter<T, U>>)
}

@Injectable({ providedIn: "root" })
export class SelectAdapter<T, U> implements EffectAdapter<() => Select<T, U>> {
    constructor(private store: Store<any>) {}

    public create(mapState: SelectEffectFn, metadata: EffectMetadata) {
        metadata.options.assign = true
        metadata.options.markDirty = true

        const sources = Object.entries(mapState()).map(([prop, selector]) =>
            this.store.pipe(
                select(selector!),
                map(value => ({ [prop]: value })),
            ),
        )

        return merge(...sources)
    }
}

@Injectable({ providedIn: "root" })
export class DispatchAdapter<T extends Event> implements EffectAdapter<T, Type<T>> {
    // tslint:disable-next-line:no-shadowed-variable
    constructor(private store: Store<any>) {}

    public next(payload: Payload<T>, metadata: EffectMetadata<Type<T>>): void {
        const action = new metadata.options(payload)
        this.store.dispatch(action)
    }
}

@Injectable({ providedIn: "root" })
export class Dispatcher extends EventEmitter<Event> {
    constructor() {
        super(true)
    }
}

export type Reducer<T> = (state: T, action: Event) => T
export type ReducerMap<T> = [keyof T, Reducer<T[keyof T]>][]

export function reducerMap(reducers: any) {
    return Object.entries(reducers)
}


export const STATE = new InjectionToken("STATE")
export const REDUCERS = new InjectionToken("REDUCERS")

@Injectable()
export class Store<T extends {[key: string]: any}> extends Observable<T> implements OnDestroy {
    private subs: Subscription

    dispatch(action: Event) {
        this.dispatcher.next(action)
    }

    constructor(private dispatcher: Dispatcher, @Inject(STATE) initialState: T, @Inject(REDUCERS) reducers: ReducerMap<T>) {
        super(subscriber => nextState.subscribe(subscriber))

        const nextState = new BehaviorSubject(initialState)
        this.subs = new Subscription()
        this.subs.add(
            scheduled(this.dispatcher.pipe(
                scan<Event, T>((state, action) =>
                    reducers.reduce((_state, [key, reducer]) => {
                        const returnValue: any = reducer(_state[key], action)
                        const seed = Array.isArray(returnValue) ? [] : {}
                        _state[key] = returnValue !== _state[key] ? Object.assign(seed, _state[key], returnValue) : _state[key]
                        return _state
                    }, state),
                    initialState
                ),
            ), queueScheduler).subscribe(nextState)
        )

        if (isDevMode()) {
            this.subs.add(
            this.dispatcher.pipe(
                withLatestFrom(nextState.pipe(
                    map(value => JSON.parse(JSON.stringify(value))),
                    pairwise()
                )),
            ).subscribe(([action, [previous, current]]) => {
                const type = [CommandType, EventType].find(item => action instanceof item)?.name
                if (type) {
                    console.groupCollapsed(`[${type}]`, action.type)
                    console.log("[Payload]", JSON.parse(JSON.stringify(action)))
                    console.log("[Before]", previous)
                    console.log("[After]", current)
                    console.log("[Diff]", diff(previous, current))
                    console.groupEnd()
                }
            }))
        }
    }

    ngOnDestroy() {
        this.subs.unsubscribe()
    }
}

@NgModule()
export class StoreModule {
    static config(reducers: any, initialState: object): ModuleWithProviders<StoreModule> {
        return {
            ngModule: StoreModule,
            providers: [
                {
                    provide: STATE,
                    useValue: initialState
                }, {
                    provide: REDUCERS,
                    useValue: reducerMap(reducers)
                },
                Store
            ]
        }
    }
}
