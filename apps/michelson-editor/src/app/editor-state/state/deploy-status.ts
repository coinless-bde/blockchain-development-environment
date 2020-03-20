import { DeployStatusState } from "../state"
import { Actions } from "../types"
import { DeploySmartContract, UpdateActiveEditor } from "../commands"
import { SmartContractDeployed, SmartContractDeployError } from "../events"

export const DeployStatus = {
    Initial(): DeployStatusState {
        return {
            state: "initial",
            loading: false,
            success: false,
            error: null,
        }
    }
}

export function deployStatus(state: DeployStatusState = DeployStatus.Initial(), action: Actions): DeployStatusState {
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
