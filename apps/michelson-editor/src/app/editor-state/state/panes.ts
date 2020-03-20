import { PanesState } from "../state"
import { Actions } from "../types"
import { TogglePreview } from "../commands"

const initialState = {
    expanded: false,
}

export function panes(state: PanesState = initialState, action: Actions): PanesState {
    switch (action.type) {
        case TogglePreview.type: {
            state.expanded = action.expanded
        }
    }
    return state
}
