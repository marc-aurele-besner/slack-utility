import slackBuilder from '../slackBuilder'
import { TBlockElements, TBlocks, TReturnValue } from '../types'

const action = async (
    actionObject: any,
    parsedBody: any,
    messageBlocks: TBlocks,
    buttons: TBlockElements,
    returnValue: TReturnValue
) => {
    console.log('settings', actionObject)
    messageBlocks.push(slackBuilder.buildSimpleSlackHeaderMsg(`Settings:`))
    if (actionObject.env) {
        const { contracts, networks } = actionObject.env

        let contractList = ''
        let networkList = ''
        contracts
            .filter((contract: any) => contract.active)
            .map((contract: any) => (contractList += `- ${contract.name}\n`))
        networks
            .filter((network: any) => network.active)
            .map((network: any) => (networkList += `• \`${network.value}\` - ${network.name}\n`))

        messageBlocks.push(
            slackBuilder.buildSimpleSectionMsg(
                '',
                `*API Keys:*\n\`\`\`- Etherscan \n\`\`\`\n*Networks:*\n\`\`\`\n${networkList}\`\`\`\n*Contracts:*\n\`\`\`\n${contractList}\`\`\`\n*Wallets:*\n\`\`\`\n- Dummy Wallet\n\`\`\``
            )
        )
    }
    buttons.push(
        slackBuilder.buildSimpleSlackButton(
            'Edit API Keys :pencil:',
            JSON.stringify({
                action: 'settings_apiKeys'
            }),
            'settings_apiKeys',
            undefined
        ),
        slackBuilder.buildSimpleSlackButton(
            'Edit Contracts :pencil:',
            JSON.stringify({
                action: 'settings_contracts'
            }),
            'settings_contracts',
            undefined
        ),
        slackBuilder.buildSimpleSlackButton(
            'Edit Networks :pencil:',
            JSON.stringify({
                action: 'settings_networks'
            }),
            'settings_networks',
            'primary'
        ),
        slackBuilder.buildSimpleSlackButton(
            'Edit Wallets :pencil:',
            JSON.stringify({
                action: 'settings_signers'
            }),
            'settings_signers',
            undefined
        )
    )
    return [actionObject, returnValue, messageBlocks, buttons]
}

export default action
