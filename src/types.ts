export type TBlockLabel = {
    type: string
    text: string
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
export type TBlocks = TBlock[]

export type TBlockAction = {
    type: string
    block_id: string
    elements: any
}

export type TBlockElement = {
    type: string
    action_id: string
    placeholder?: TPlaceholder
    options?: any
    text?: TBlockLabel
    value?: string
    url?: string
    style?: string | undefined
    initial_value?: string
    initial_date_time?: Date | string
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

export type TContract = {
    name: string
    emoji: string
    active: boolean
}
export type TContracts = TContract[]

export type TNetwork = {
    name: string
    emoji: string
    value: string
    active: boolean
}
export type TNetworks = TNetwork[]

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
