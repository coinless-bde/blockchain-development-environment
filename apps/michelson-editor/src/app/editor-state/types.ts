import * as Commands from "./commands"
import * as Events from "./events"
import { ExtractTypes } from "./interfaces"
import { Event } from "../../store/interfaces"
import { Type } from "@angular/core"
import { of, OperatorFunction } from "rxjs"
import { catchError, map } from "rxjs/operators"
import { Payload } from "../../store/store"

export type Actions = Commands | Events
export type Commands = ExtractTypes<typeof Commands>
export type Events = ExtractTypes<typeof Events>

export function type<T extends Event<any>, V extends Payload<T>>(type: Type<T>): OperatorFunction<V, T> {
    return function(source) {
        return source.pipe(
            map(value => new type(value)),
        )
    }
}

export function errorType<T extends Event<any>>(type: Type<T>): OperatorFunction<any, T> {
    return function(source) {
        return source.pipe(
            catchError(value => of(new type(value))),
        )
    }
}
