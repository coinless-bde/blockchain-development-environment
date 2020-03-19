import { DeployState, DeployStatus, EditorState, NetworkState, PanesState } from "./state"
import { FileLoaded, FileSaved, SmartContractDeployed, SmartContractDeployError } from "./events"
import { Actions } from "./types"
import {
    AutoSaveFile,
    ChangeNetwork,
    DeploySmartContract,
    TogglePreview,
    UpdateActiveEditor,
    UpdateDeployState,
} from "./commands"

export function activeEditor(state: EditorState, action: Actions): EditorState {
    switch (action.type) {
        case AutoSaveFile.type:
        case FileLoaded.type:
        case FileSaved.type: {
            if (action.id === state.id) {
                Object.assign(state, action)
            }
            break
        }
        case UpdateActiveEditor.type: {
            return action
        }
    }
    return state
}

export function panes(state: PanesState, action: Actions): PanesState {
    switch (action.type) {
        case TogglePreview.type: {
            state.expanded = action.expanded
        }
    }
    return state
}

export function openTabs(state: EditorState[], action: Actions): EditorState[] {
    switch (action.type) {
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

export function activeNetwork(state: number, action: Actions): number {
    switch (action.type) {
        case ChangeNetwork.type: {
            return action.id
        }
        case UpdateDeployState.type: {
            return action.networkId
        }
    }
    return state
}

export function deploy(state: DeployState, action: Actions): DeployState {
    switch (action.type) {
        case UpdateDeployState.type: {
            return action
        }
        case ChangeNetwork.type: {
            return { ...state, networkId: action.id }
        }
        case UpdateActiveEditor.type: {
            return { ...state, fileId: action.id, code: action.code }
        }
    }

    return state
}

export function deployStatus(state: DeployStatus, action: Actions): DeployStatus {
    switch (action.type) {
        case DeploySmartContract.type: {
            return {
                state: "loading",
                error: null,
                loading: true,
                success: false
            }
        }
        case SmartContractDeployed.type: {
            return {
                state: "success",
                error: null,
                loading: false,
                success: true,

            }
        }
        case SmartContractDeployError.type: {
            return {
                state: "error",
                error: action,
                success: false,
                loading: false
            }
        }
        case UpdateActiveEditor.type: {
            return {
                state: "initial",
                error: null,
                success: false,
                loading: false
            }
        }
    }
    return state
}
