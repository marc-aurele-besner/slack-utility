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

export const buildEtherscanLinkSlackButton = (
    chainName = 'mainnet' as string,
    label = 'Etherscan' as string,
    actionId = 'buttonGoEtherscan' as string,
    domain = 'etherscan.io' as string,
    contractAddress?: string,
    txHash?: string,
    blockNumber?: string,
    style?: TSlackButtonStyle,
): TBlockElement => {
    return buildLinkSlackButton(
        '-> ' + label,
        `${chainName} ${contractAddress}`,
        actionId,
        'primary',
        `https://${chainName === 'mainnet' ? '' : chainName + '.'}${domain}/${contractAddress !== '' ? 'address/' + contractAddress : ''}${txHash !== '' ? 'tx/' + txHash : ''}${blockNumber !== '' ? 'block/' + blockNumber : ''}`
    )
}

export default buildLinkSlackButton
