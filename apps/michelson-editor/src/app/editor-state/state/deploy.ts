import { DeployState } from "../state"
import { Actions } from "../types"
import { ChangeNetwork, UpdateActiveEditor, ChangeDeploymentConfig } from "../commands"
import { FileLoaded, FileSaved } from "../events"

const initialState = {
    fileId: null,
    code: null,
    networkId: 2,
    storage: "",
    storageCap: 0,
    contractFee: 0,
    gasCap: 0,
}

export function deploy(state: DeployState = initialState, action: Actions): DeployState {
    switch (action.type) {
        case ChangeDeploymentConfig.type: {
            return action
        }
        case ChangeNetwork.type: {
            return { ...state, networkId: action.id }
        }
        case FileLoaded.type:
        case FileSaved.type:
        case UpdateActiveEditor.type: {
            return { ...state, fileId: action.id, code: action.code }
        }
    }
    return state
}
