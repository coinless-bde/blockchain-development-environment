import { combineLatest, fromEvent, merge, MonoTypeOperatorFunction, Observable } from "rxjs"
import { filter, map, mapTo, startWith, switchMap } from "rxjs/operators"
import { QueryList } from "@angular/core"

export type HTMLElementEventNames = keyof HTMLElementEventMap

export type EventMap<T extends { [key: string]: any }> = {
    [key in keyof T]: Observable<
        key extends HTMLElementEventNames ? HTMLElementEventMap[key] : T[key]
    >
}

export function fromEvents<T>(element: HTMLElement, eventNames: T): EventMap<T> {
    const observer: any = {}
    return Object.keys(eventNames)
        .filter(eventName => isNaN(Number(eventName)))
        .reduce((acc, eventName) => {
            acc[eventName] = fromEvent(element, eventName)
            return acc
        }, observer)
}

export function toggle(on: Observable<any>, off: Observable<any>) {
    return merge(mapTo(true)(on), mapTo(false)(off))
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
