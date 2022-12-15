import { TBlockElement, TSlackButtonStyle } from '../types'

const buildLinkSlackButton = (
    text: string,
    value: string | undefined,
    actionId?: string,
    style?: TSlackButtonStyle,
    url?: string
): TBlockElement => {
    return {
        type: 'button',
        text: {
            type: 'plain_text',
            text
        },
        value,
        action_id: actionId,
        url,
        style
    }
}

export const buildEtherscanLinkSlackButton = (
    label = 'Etherscan' as string,
    actionId = 'buttonGoEtherscan' as string,
    domain = 'etherscan.io' as string,
    contractAddress?: string,
    txHash?: string,
    blockNumber?: string,
    style?: TSlackButtonStyle
): TBlockElement => {
    return {
        type: 'button',
        text: {
            type: 'plain_text',
            text: '-> ' + label
        },
        action_id: actionId,
        url: `https://${domain}/${contractAddress ? 'address/' + contractAddress : ''}${txHash ? 'tx/' + txHash : ''}${
            blockNumber ? 'block/' + blockNumber : ''
        }`
    }
}

export default buildLinkSlackButton
