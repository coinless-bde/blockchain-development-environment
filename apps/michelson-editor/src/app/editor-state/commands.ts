import { Command } from "../../store/store"
import { DeployState, EditorState } from "./state"
import { DeployPayload } from "../editor/editor.service"

export class TogglePreview extends Command("TogglePreview")<{
    expanded: boolean
}> {}

export class UpdateActiveEditor extends Command("UpdateActiveEditor")<EditorState> {}

export class DeploySmartContract extends Command("DeploySmartContract")<DeployPayload> {}

export class SaveFile extends Command("SaveFile")<EditorState> {}

export class AutoSaveFile extends Command("AutoSaveFile")<EditorState> {}

export class LoadFile extends Command("LoadFile")<{ id: number }> {}

export class ChangeNetwork extends Command("ChangeNetwork")<{ id: number }> {}

export class UpdateDeployState extends Command("UpdateDeploymentSettings")<DeployState> {}
