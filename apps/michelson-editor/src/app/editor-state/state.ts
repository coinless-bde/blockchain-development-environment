import { Event } from "../../store/interfaces"
import { Type } from "@angular/core"
import { of, OperatorFunction } from "rxjs"
import { catchError, map } from "rxjs/operators"
import { Payload } from "../../store/store"
import { README } from "../editor-content/default-documents/readme"
import { EXAMPLE } from "../editor-content/default-documents/example"

export interface AppState {
    panes: PanesState
    activeEditor: EditorState
    openTabs: EditorState[]
}

export interface PanesState {
    expanded: boolean
}

export interface EditorState {
    id?: number | null
    title: string
    code: string
    language: string
    readonly: boolean
}

export const initialState: AppState = {
    panes: {
        expanded: true,
    },
    activeEditor: {
        id: null,
        title: "",
        code: "",
        language: "plaintext",
        readonly: false
    },
    openTabs: [
        {
            title: "README.md",
            code: README,
            language: "markdown",
            readonly: true,
        },
        {
            title: "example.tz",
            code: EXAMPLE,
            language: "michelson",
            readonly: false,
        },
        {
            title: "Deploy",
            code: "",
            language: "plaintext",
            readonly: true,
        },
    ]
}

export function mapToEvent<T extends Event<any>, V extends Payload<T>>(type: Type<T>): OperatorFunction<V, T> {
    return function(source) {
        return source.pipe(
            map(value => new type(value))
        )
    }
}

export function mapToErrorEvent<T extends Event<any>>(type: Type<T>): OperatorFunction<any, T> {
    return function(source) {
        return source.pipe(
            catchError(value => of(new type(value)))
        )
    }
}