import { NetworkState } from "../state"

const initialState = [
    {
        label: "Mainnet (Coming soon)",
        disabled: true,
    },
    {
        label: "Babylon (deprecated)",
        disabled: false,
    },
    {
        label: "Carthage",
        disabled: false,
    },
    {
        label: "Zeronet (Coming soon)",
        disabled: true,
    },
    {
        label: "Sandbox (Coming soon)",
        disabled: true,
    },
]

export function networks(state: NetworkState[] = initialState) {
    return state
}
