import { slackBuilder } from '../slackBuilder'
  
const action = async (action, parsedBody, messageBlocks, buttons, returnValue) => {
    const { contracts, networks } = action
    console.log('settings', action)
    
    let contractList = ''
    let networkList = ''
    contracts.filter((contract) => contract.active).map((contract) => (contractList += `- ${contract.name}\n`))
    networks.filter((network) => network.active).map((network) => (networkList += `• \`${network.value}\` - ${network.name}\n`))
    
    messageBlocks.push(
        slackBuilder.buildSimpleSlackHeaderMsg(`Settings:`),
        slackBuilder.buildSimpleSectionMsg(
            '',
            `*API Keys:*\n\`\`\`- Etherscan \n\`\`\`\n*Networks:*\n\`\`\`\n${networkList}\`\`\`\n*Contracts:*\n\`\`\`\n${contractList}\`\`\`\n*Wallets:*\n\`\`\`\n- Dummy Wallet\n\`\`\``
        )
    )
    buttons.push(
        slackBuilder.buildSimpleSlackButton(
            'Edit API Keys :pencil:',
            JSON.stringify({
                action: 'settings_apiKeys',
            }),
            'settings_apiKeys',
            undefined),
        slackBuilder.buildSimpleSlackButton(
            'Edit Contracts :pencil:',
            JSON.stringify({
                action: 'settings_contracts',
            }),
            'settings_contracts',
            undefined),
        slackBuilder.buildSimpleSlackButton(
            'Edit Networks :pencil:',
            JSON.stringify({
                action: 'settings_networks',
            }),
            'settings_networks',
            'primary'),
        slackBuilder.buildSimpleSlackButton(
            'Edit Wallets :pencil:',
            JSON.stringify({
                action: 'settings_signers',
            }),
            'settings_signers',
            undefined)
        )
    return [action, returnValue, messageBlocks, buttons]
}

export default action