import { EditorState } from "../state"
import { Actions } from "../types"
import { UpdateActiveEditor } from "../commands"
import { README } from "../../editor-content/default-documents/readme"
import { EXAMPLE } from "../../editor-content/default-documents/example"

const initialState = [
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

export function openTabs(state: EditorState[] = initialState, action: Actions): EditorState[] {
    switch (action.type) {
        case UpdateActiveEditor.type: {
            const activeFile = state.find(file => file.title === action.title)
            if (activeFile) {
                Object.assign(activeFile, action)
            }
            break
        }
    }
    return state
}
