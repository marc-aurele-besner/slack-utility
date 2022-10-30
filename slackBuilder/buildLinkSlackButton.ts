const buildLinkSlackButton = (text: string, value: any, action_id: string, style?: string, url?: string) => {
  return {
    type: 'button',
    text: {
      type: 'plain_text',
      text
    },
    value,
    action_id,
    url,
    style
  }
}

export const buildEtherscanLinkSlackButton = (chainName: string, contractAddress: string) => {
  return buildLinkSlackButton(
    '-> Etherscan',
    `${chainName} ${contractAddress}`,
    'buttonGoEtherscan',
    'primary',
    `https://${chainName === 'mainnet' ? '' : chainName + '.'}etherscan.io/address/${contractAddress}`
  )
}

export default buildLinkSlackButton
