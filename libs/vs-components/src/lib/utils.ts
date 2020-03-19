import { combineLatest, fromEventPattern, merge, MonoTypeOperatorFunction, Observable, of } from "rxjs"
import { filter, map, mapTo, startWith, switchMap, tap, withLatestFrom } from "rxjs/operators"
import { QueryList, Renderer2, Type } from "@angular/core"

export type EventMap<T extends any> = {
    [key in keyof T]: T[key] extends Type<any> ? Observable<InstanceType<T[key]>> : EventMap<T[key]>
}

export function fromEvents<T extends { [key: number]: string | { [key: string]: { [key: number]: string } } }>(renderer: Renderer2, element: HTMLElement, eventMap: T): EventMap<T> {
    const observer: any = {}
    return Object.keys(eventMap).reduce((acc, eventKey) => {
        const value = eventMap[eventKey as any]

        if (typeof value === "function") {
            acc[eventKey] = fromEventPattern(handler => renderer.listen(element, eventKey, handler))
        } else {
            acc[eventKey] = fromEvents(renderer, element, value)
        }

        return acc
    }, observer)
}

export interface ToggleOptions {
    on: Observable<any>
    off: Observable<any>
    disable?: Observable<boolean>
}

export function toggle(options: ToggleOptions): Observable<boolean> {
    return merge(mapTo(true)(options.on), mapTo(false)(options.off)).pipe(
        withLatestFrom(options.disable || of(false), (toggled, disabled) =>
            disabled ? false : toggled,
        ),
    )
}

export function preventDefault<T extends Event>(): MonoTypeOperatorFunction<T> {
    return tap(event => event.preventDefault())
}

export function disable(notifier: Observable<any>): MonoTypeOperatorFunction<boolean> {
    return function(source) {
        return combineLatest([source, notifier]).pipe(
            map(([_source, _notifier]) => (_notifier ? false : _source)),
        )
    }
}

export function isDefined<T>(value: T): value is Exclude<T, undefined> {
    return value !== undefined
}

export function isUndefined(value: any): value is undefined {
    return value !== undefined
}

export function query<T>(source: Observable<T | undefined>): Observable<T> {
    return source.pipe(filter(isDefined))
}

export function queryList<T>(source: Observable<QueryList<T> | undefined>): Observable<T[]> {
    // noinspection JSDeprecatedSymbols
    return source.pipe(
        filter(isDefined),
        switchMap(list =>
            list.changes.pipe(
                startWith(list),
                map(changes => changes.toArray()),
            ),
        ),
    )
}
