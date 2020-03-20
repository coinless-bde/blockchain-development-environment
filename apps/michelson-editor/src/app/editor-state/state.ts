export interface AppState {
    panes: PanesState
    activeEditor: EditorState
    openTabs: EditorState[]
    networks: NetworkState[]
    activeNetwork: number
    deployStatus: DeployStatusState
}

export type DeployStatusState =
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
    hash: string
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
