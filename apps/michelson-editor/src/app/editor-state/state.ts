import { README } from "../editor-content/default-documents/readme"
import { EXAMPLE } from "../editor-content/default-documents/example"

export interface AppState {
    panes: PanesState
    activeEditor: EditorState
    openTabs: EditorState[]
    networks: NetworkState[]
    activeNetwork: number
    deploy: DeployState
    deployStatus: DeployStatus
}

export const DeployStatus = {
    Initial(): DeployStatus {
        return {
            state: "initial",
            loading: false,
            success: false,
            error: null,
        }
    }
}

export type DeployStatus =
    | {
    state: "initial"
    loading: false
    success: false
    error: null
}
    | {
    state: "loading"
    loading: true
    success: false
    error: null
}
    | {
    state: "success"
    loading: false
    success: true
    error: null
}
    | {
    state: "error"
    loading: false
    success: false
    error: any
}

export interface DeployState {
    fileId?: null | number,
    code?: null | string,
    networkId: number
    storage: string
    contractFee: number
    storageCap: number
    gasCap: number
}

export interface NetworkState {
    label: string
    disabled: boolean
}

export interface PanesState {
    expanded: boolean
}

export interface EditorState {
    id?: number | null
    title: string
    code: string
    language: string
    readonly: boolean
}

export const initialState: AppState = {
    panes: {
        expanded: true,
    },
    activeEditor: {
        id: null,
        title: "",
        code: "",
        language: "plaintext",
        readonly: false,
    },
    openTabs: [
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
    ],
    networks: [
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
    ],
    deploy: {
        fileId: null,
        code: null,
        networkId: 2,
        storage: "",
        storageCap: 0,
        contractFee: 0,
        gasCap: 0,
    },
    activeNetwork: 2,
    deployStatus: DeployStatus.Initial()
}

