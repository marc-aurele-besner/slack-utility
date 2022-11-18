import slackBuilder from '../slackBuilder'
import retrieveTeamSettings from '../slackUtils/retrieveTeamSettings'
import { TAbi, TApiKey, TBlockElements, TBlocks, TCommand, TContract, TNetwork, TReturnValue, TSigner } from '../types'

const action = async (
    actionObject: any,
    parsedBody: any,
    messageBlocks: TBlocks,
    buttons: TBlockElements,
    returnValue: TReturnValue
) => {
    console.log('settings_app', actionObject)
    try {
        messageBlocks.push(slackBuilder.buildSimpleSlackHeaderMsg(`Team Settings:`))
        const teamSettings = await retrieveTeamSettings(actionObject.faunaDbToken, parsedBody.team.id)
        let commandList = ''
        let contractList = ''
        let networkList = ''
        let abiList = ''
        let apiKeyList = ''
        let signerList = ''
        if (teamSettings !== null) {
            console.log('teamSettings', teamSettings)
            const { commands, contracts, networks, abis, apiKeys, signers } = teamSettings

            if (commands !== undefined && commands.length > 0)
                commands
                    .filter((command: TCommand) => command.active)
                    .map((command: TCommand) => (commandList += `• \`${command.command}\n`))
            else commandList = 'No team commands added yet'
            if (networks !== undefined && networks.length > 0)
                networks
                    .filter((network: TNetwork) => network.active)
                    .map((network: TNetwork) => (networkList += `• \`${network.value}\` - ${network.name}\n`))
            else networkList = 'No team networks added yet'
            if (contracts !== undefined && contracts.length > 0)
                contracts
                    .filter((contract: TContract) => contract.active)
                    .map((contract: TContract) => (contractList += `- ${contract.name}\n`))
            else contractList = 'No team contracts added yet'
            if (abis !== undefined && abis.length > 0)
                abis.filter((abi: TAbi) => abi.active).map((abi: TAbi) => (abiList += `• \`${abi.name}\`\n`))
            else abiList = 'No team abis added yet'
            if (apiKeys !== undefined && apiKeys.length > 0)
                apiKeys
                    .filter((apiKey: TApiKey) => apiKey.active)
                    .map((apiKey: TApiKey) => (apiKeyList += `• \`${apiKey.name}\`\n`))
            else apiKeyList = 'No team apiKeys added yet'
            if (signers !== undefined && signers.length > 0)
                signers
                    .filter((signer: TSigner) => signer.active)
                    .map((signer: TSigner) => (signerList += `• \`${signer.address}\` - ${signer.name}\n`))
            else signerList = 'No team signers added yet'
        } else {
            commandList = 'No team commands added yet'
            networkList = 'No team networks added yet'
            contractList = 'No team contracts added yet'
            abiList = 'No team abis added yet'
            apiKeyList = 'No team apiKeys added yet'
            signerList = 'No team signers added yet'
        }
        messageBlocks.push(
            slackBuilder.buildSimpleSectionMsg(
                '',
                'Here are listed any settings (commands, networks, contracts, abis, apiKeys, signers, ...) that are set for your slack team.'
            ),
            slackBuilder.buildSimpleSectionMsg(
                '',
                `*Commands:*\n\`\`\`\n${commandList}\`\`\`*Networks:*\n\`\`\`\n${networkList}\`\`\`\n*Contracts:*\n\`\`\`\n${contractList}\`\`\`\n*Abis:*\n\`\`\`\n${abiList}\`\`\`\n*ApiKeys:*\n\`\`\`\n${apiKeyList}\`\`\`\n*Signers:*\n\`\`\`\n${signerList}\n\`\`\``
            )
        )
        buttons.push(
            slackBuilder.buildSimpleSlackButton(
                'Edit Commands :pencil:',
                { action: 'settings_commands', team_settings: true },
                'settings_commands',
                'primary'
            ),
            slackBuilder.buildSimpleSlackButton(
                'Edit Networks :pencil:',
                { action: 'settings_networks', team_settings: true },
                'settings_networks',
                'primary'
            ),
            slackBuilder.buildSimpleSlackButton(
                'Edit Contracts :pencil:',
                { action: 'settings_contracts', team_settings: true },
                'settings_contracts',
                undefined
            ),
            slackBuilder.buildSimpleSlackButton(
                'Edit ABIs :pencil:',
                { action: 'settings_abis', team_settings: true },
                'settings_abis',
                undefined
            ),
            slackBuilder.buildSimpleSlackButton(
                'Edit API Keys :pencil:',
                { action: 'settings_apiKeys', team_settings: true },
                'settings_apiKeys',
                undefined
            ),
            slackBuilder.buildSimpleSlackButton(
                'Edit Wallets :pencil:',
                { action: 'settings_signers', team_settings: true },
                'settings_signers',
                undefined
            )
        )
    } catch (error) {
        console.log('error', error)
        messageBlocks.push(slackBuilder.buildSimpleSlackHeaderMsg(`:x: Error: ${error}`))
    }

    return [actionObject, returnValue, messageBlocks, buttons]
}

export default action
