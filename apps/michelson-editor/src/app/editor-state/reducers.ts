import { EditorState, PanesState } from "./state"
import { FileSaved } from "./events"
import { Actions } from "./types"
import { TogglePreview } from "./commands"

export function editor(state: EditorState, action: Actions) {
    switch(action.type) {
        case FileSaved.type: {
            if (state.id === action.id) {
                return action
            }
            break
        }
    }
}

export function panes(state: PanesState, action: Actions) {
    switch(action.type) {
        case TogglePreview.type: {
            state.expanded = action.expanded
        }
    }
}
