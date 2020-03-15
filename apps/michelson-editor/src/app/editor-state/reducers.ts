import { EditorState, PanesState } from "./state"
import { FileLoaded, FileSaved } from "./events"
import { Actions } from "./types"
import { AutoSaveFile, UpdateActiveEditor, TogglePreview } from "./commands"

export function activeEditor(state: EditorState, action: Actions): Partial<EditorState> {
    switch(action.type) {
        case AutoSaveFile.type:
        case FileLoaded.type:
        case FileSaved.type: {
            if (action.id === state.id) {
                return action
            }
            break
        }
        case UpdateActiveEditor.type: {
            return action
        }
    }
    return state
}

export function panes(state: PanesState, action: Actions): Partial<PanesState> {
    switch(action.type) {
        case TogglePreview.type: {
            state.expanded = action.expanded
        }
    }
    return state
}

export function openTabs(state: EditorState[], action: Actions): EditorState[] {
    switch(action.type) {
        case UpdateActiveEditor.type: {
            const activeFile = state.find(file => file.title === action.title)
            if (activeFile) {
                Object.assign(activeFile, action)
            }
            break
        }
        case FileLoaded.type: {
            state[1] = { ...state[1], ...action }
        }
    }
    return state
}
