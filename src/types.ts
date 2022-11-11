export type TBlockLabel = {
    type: string
    text: string
    emoji?: boolean
}

export type TPlaceholder = {
    type: string
    text: string
}

export type TBlock = {
    type: string
    block_id?: string
    text?: TBlockLabel
    element?: TBlockElement
    elements?: TBlockElements
    label?: TBlockLabel
}
export type TBlockAttachment = {
    blocks: TBlock[]
}

export type TBlocks = TBlock[]

export type TBlockAction = {
    type: string
    block_id: string
    elements: any
}

export type TBlockElement = {
    type: string
    action_id?: string
    placeholder?: TPlaceholder
    options?: any
    text?: TBlockLabel
    value?: string
    url?: string
    style?: string | undefined
    initial_value?: string
    initial_date_time?: Date | string
    initial_date?: Date | string
    initial_time?: Date | string
    is_decimal_allowed?: boolean
    multiline?: boolean
}
export type TBlockElements = TBlockElement[]

export type TBlockElementOption = {
    text: TBlockLabel
    value: string
}
export type TBlockElementOptions = TBlockElementOption[]

export type TReturnValue = {
    statusCode: number
    body: string
}

export type TSlackOption = {
    text: string
    value: string
}
export type TSlackOptions = TSlackOption[]

export type TSlackButtonStyle = 'primary' | 'danger' | undefined

export type TSigningWeb3 = 'web3'
export type TSigningAppKeys = 'appKeys'

export type TSigningType = TSigningWeb3 | TSigningAppKeys

export type TAddressPerNetwork = {
    network: string
    address: string
    abiName: string
}
export type TAddressesPerNetwork = TAddressPerNetwork[]

export type TNetwork = {
    name: string
    value: string
    defaultRpc: string
    chainId: number | string
    emoji: string
    active: boolean
    signingType: TSigningType
}
export type TNetworks = TNetwork[]

export type TContract = {
    name: string
    emoji: string
    active: boolean
    addressPerNetwork: TAddressesPerNetwork
}
export type TContracts = TContract[]

export type TEnv = {
    networks: TNetwork[] | undefined
    contracts: TContract[] | undefined
    signerPrivateKey?: string | undefined
}

export type TSettings = {
    apiKeys: string
    contracts: string
    networks: string
    signers: string
}

export type TSlackMessageResponse = {
    ok: boolean
    ts?: string | undefined
    channel?: string | undefined
}

export type TSlackPostMessageResponse = {
    resultPostMessage: TSlackMessageResponse
    resultUpdateMessage: TSlackMessageResponse
}

export type TSlackView = {
    id?: string
    team_id?: string
    app_id?: string
    app_installed_team_id?: string
    bot_id?: string
    type?: string
    blocks?: TBlocks
    state?: any
    hash?: string
    private_metadata?: string
    callback_id?: string
    root_view_id?: string
    external_id?: string
    title?: TBlockLabel
    close?: null
    submit?: null
    previous_view_id?: null
    clear_on_close?: boolean
    notify_on_close?: boolean
}

export type TSlackViewResponse = {
    ok: boolean
    view?: TSlackView | undefined
}
