import { filter } from "rxjs/operators"

export function truthy<T extends any>() {
    // tslint:disable-next-line:triple-equals
    return filter((value): value is Exclude<T, "" | false | 0 | 0n | null | undefined> => Boolean(value))
}
