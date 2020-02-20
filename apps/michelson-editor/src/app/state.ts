import { JsonObject } from "../store/interfaces"
import { setStateFn, SetStateOperator } from "../store/store"

export interface AppState extends JsonObject {
    splitPane: SplitPaneState
    editor: EditorState
}

interface SplitPaneState extends JsonObject {
    expanded: boolean
}

interface EditorState extends JsonObject {
    id: number | null
    code: string
}

export const initialState: AppState = {
    splitPane: {
        expanded: true,
    },
    editor: {
        id: null,
        code: "",
    },
}

export const appStore: SetStateOperator<AppState> = fn => setStateFn(fn)
