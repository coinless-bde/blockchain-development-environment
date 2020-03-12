import { Command } from "../../store/store"
import { EditorContentState } from "../editor-content/editor-content.component"
import { EditorState } from "./state"

export class TogglePreview extends Command("TogglePreview")<{
    expanded: boolean
}> {}

export class SaveEditorState extends Command("SaveEditorState")<EditorContentState> {}

export class DeploySmartContract extends Command("DeploySmartContract")<{
    id: number
}> {}

export class SaveFile extends Command("SaveFile")<EditorState> {}
