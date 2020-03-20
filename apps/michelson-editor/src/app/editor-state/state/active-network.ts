import { Actions } from "../types"
import { ChangeNetwork, ChangeDeploymentConfig } from "../commands"

const initialState = 2

export function activeNetwork(state: number = initialState, action: Actions): number {
    switch (action.type) {
        case ChangeNetwork.type: {
            return action.id
        }
        case ChangeDeploymentConfig.type: {
            return action.networkId
        }
    }
    return state
}
