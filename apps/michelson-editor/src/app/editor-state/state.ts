import { Event } from "../../store/interfaces"
import { Type } from "@angular/core"
import { OperatorFunction } from "rxjs"
import { map } from "rxjs/operators"
import { Payload } from "../../store/store"

export interface AppState {
    panes: PanesState
    editor: EditorState
}

export interface PanesState {
    expanded: boolean
}

export interface EditorState {
    id: number | null
    code: string
}

export const initialState: AppState = {
    panes: {
        expanded: true,
    },
    editor: {
        id: null,
        code: "",
    },
}

export function mapToEvent<T extends Event<any>, V extends Payload<T>>(type: Type<T>): OperatorFunction<V, T> {
    return function(source) {
        return source.pipe(
            map(value => new type(value))
        )
    }
}
