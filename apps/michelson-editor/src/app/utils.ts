import { filter } from "rxjs/operators"

export type Falsy = "" | false | 0 | 0n | null | undefined

export function isTruthy<T>() {
    // tslint:disable-next-line:triple-equals
    return filter((value: T): value is Exclude<T, false | null | undefined | '' | 0> => Boolean(value))
}
