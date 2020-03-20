import { EditorState } from "../state"
import { Actions } from "../types"
import { AutoSaveFile, UpdateActiveEditor } from "../commands"
import { FileLoaded, FileSaved } from "../events"

const initialState = {
    id: null,
    title: "",
    code: "",
    language: "plaintext",
    readonly: false,
}

export function activeEditor(state: EditorState = initialState, action: Actions): EditorState {
    switch (action.type) {
        case AutoSaveFile.type:
        case FileLoaded.type:
        case FileSaved.type: {
            if (action.id === state.id) {
                return Object.assign(state, action)
            }
            break
        }
        case UpdateActiveEditor.type: {
            return action
        }
    }
    return state
}


