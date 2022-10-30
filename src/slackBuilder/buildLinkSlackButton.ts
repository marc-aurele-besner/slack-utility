import { TBlockElement, TSlackButtonStyle } from '../types'

const buildLinkSlackButton = (
    text: string,
    value: string,
    actionId: string,
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

export const buildEtherscanLinkSlackButton = (chainName: string, contractAddress: string): TBlockElement => {
    return buildLinkSlackButton(
        '-> Etherscan',
        `${chainName} ${contractAddress}`,
        'buttonGoEtherscan',
        'primary',
        `https://${chainName === 'mainnet' ? '' : chainName + '.'}etherscan.io/address/${contractAddress}`
    )
}

export default buildLinkSlackButton
