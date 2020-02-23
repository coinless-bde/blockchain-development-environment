import { Inject, Injectable, InjectionToken } from "@angular/core"
import { Observable, OperatorFunction, Subject, Subscriber } from "rxjs"
import { map, scan, shareReplay, startWith } from "rxjs/operators"
import { EffectAdapter } from "ng-effects"
import { JsonObject } from "./interfaces"

export const INITIAL_STATE = new InjectionToken("INITIAL_VALUE")

export function withInitialState<T extends JsonObject>(initialState: T) {
    return {
        provide: INITIAL_STATE,
        useValue: initialState,
    }
}

export function select<T, U extends keyof T>(key: U): OperatorFunction<T, T[U]>
export function select<T, U>(selector: (state: T) => U): OperatorFunction<T, U>
export function select(keyOrSelector: string | ((state: any) => any)): OperatorFunction<any, any> {
    return function(source) {
        return source.pipe(
            map(typeof keyOrSelector === "string" ? value => value[keyOrSelector] : keyOrSelector),
        )
    }
}

export type SetStateFn<T, U = unknown> = unknown extends U
    ? ((state: T) => Partial<T> | void)
    : ((state: T, context: U) => Partial<T> | void)
export type SetStateOperator<T> = <U>(
    fn: SetStateFn<T, U>,
) => OperatorFunction<U, SetStateFn<T, any>>

export function setStateFn<T extends any, U>(
    fn: SetStateFn<T, U>,
): OperatorFunction<U, SetStateFn<T, any>> {
    return function(source) {
        return source.pipe(map(value => (state: T) => fn(state, value)))
    }
}

interface Action {
    type: string
    payload?: any
}

@Injectable({ providedIn: "root" })
export class Actions extends Subject<Action> {}

export class Dispatcher {
    constructor(private actions: Actions) {}

    public dispatch(action: Action) {
        this.actions.next(action)
    }
}

@Injectable({ providedIn: "root" })
export class Dispatch implements EffectAdapter<Action> {
    constructor(private dispatcher: Dispatcher) {}

    public next(action: Action) {
        this.dispatcher.dispatch(action)
    }
}

@Injectable({ providedIn: "root" })
export class Store<T extends object> extends Observable<T> implements EffectAdapter<SetStateFn<T>> {
    public subject: Subject<SetStateFn<T>>

    constructor(@Inject(INITIAL_STATE) initialState: T) {
        super((subscriber: Subscriber<T>) => observer.subscribe(subscriber))

        this.subject = new Subject<SetStateFn<T>>()

        const observer = this.subject.pipe(
            scan((state: T, reducer: SetStateFn<any>) => {
                return Object.assign(state, reducer(state))
            }, initialState),
            startWith(initialState),
            shareReplay({ bufferSize: 1, refCount: true }),
        )
    }

    public next(valueOrSetter: SetStateFn<T> | Partial<T>) {
        this.subject.next(typeof valueOrSetter === "function" ? valueOrSetter : () => valueOrSetter)
    }

    public select<U extends keyof T>(key: U): Observable<U>
    public select<U>(selector: (state: T) => U): Observable<U>
    public select(keyOrSelector: any): Observable<any> {
        return this.pipe(select(keyOrSelector))
    }
}
