import { Command } from "../../store/store"
import { EditorState } from "./state"

export class TogglePreview extends Command("TogglePreview")<{
    expanded: boolean
}> {}

export class UpdateActiveEditor extends Command("UpdateActiveEditor")<EditorState> {}

export class DeploySmartContract extends Command("DeploySmartContract")<{
    id: number
}> {}

export class SaveFile extends Command("SaveFile")<EditorState> {}

export class AutoSaveFile extends Command("AutoSaveFile")<EditorState> {}

export class LoadFile extends Command("LoadFile")<{ id: number }> {}
