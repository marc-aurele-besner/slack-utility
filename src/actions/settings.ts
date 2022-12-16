import slackBuilder from '../slackBuilder'
import retrieveUserSettings from '../slackUtils/retrieveUserSettings'
import { TAbi, TApiKey, TBlockElements, TBlocks, TContract, TNetwork, TReturnValue, TSigner } from '../types'

const action = async (
    actionObject: any,
    parsedBody: any,
    messageBlocks: TBlocks,
    buttons: TBlockElements,
    returnValue: TReturnValue
) => {
    console.log('settings')
    try {
        messageBlocks.push(slackBuilder.buildSimpleSlackHeaderMsg(`User Settings:`))
        const userSettings = await retrieveUserSettings(
            actionObject.faunaDbToken,
            parsedBody.user.id,
            parsedBody.team.id
        )
        let contractList = ''
        let networkList = ''
        let abiList = ''
        let apiKeyList = ''
        let signerList = ''
        if (userSettings !== null) {
            console.log('userSettings', userSettings)
            const { contracts, networks, abis, apiKeys, signers } = userSettings

            if (networks !== undefined && networks.length > 0)
                networks
                    .filter((network: TNetwork) => network.active)
                    .map((network: TNetwork) => (networkList += `• \`${network.value}\` - ${network.name}\n`))
            else networkList = 'No user networks added yet'
            if (contracts !== undefined && contracts.length > 0)
                contracts
                    .filter((contract: TContract) => contract.active)
                    .map((contract: TContract) => (contractList += `- ${contract.name}\n`))
            else contractList = 'No user contracts added yet'
            if (abis !== undefined && abis.length > 0)
                abis.filter((abi: TAbi) => abi.active).map((abi: TAbi) => (abiList += `• \`${abi.name}\`\n`))
            else abiList = 'No user abis added yet'
            if (apiKeys !== undefined && apiKeys.length > 0)
                apiKeys
                    .filter((apiKey: TApiKey) => apiKey.active)
                    .map((apiKey: TApiKey) => (apiKeyList += `• \`${apiKey.name}\`\n`))
            else apiKeyList = 'No user apiKeys added yet'
            if (signers !== undefined && signers.length > 0)
                signers
                    .filter((signer: TSigner) => signer.active)
                    .map((signer: TSigner) => (signerList += `• \`${signer.address}\` - ${signer.name}\n`))
            else signerList = 'No user signers added yet'
        } else {
            networkList = 'No user networks added yet'
            contractList = 'No user contracts added yet'
            abiList = 'No user abis added yet'
            apiKeyList = 'No user apiKeys added yet'
            signerList = 'No user signers added yet'
        }
        messageBlocks.push(
            slackBuilder.buildSimpleSectionMsg(
                '',
                'Here are listed any settings (networks, contracts, abis, apiKeys, signers, ...) that you set for your slack account.'
            ),
            slackBuilder.buildSimpleSectionMsg(
                '',
                `*Networks:*\n\`\`\`\n${networkList}\`\`\`\n*Contracts:*\n\`\`\`\n${contractList}\`\`\`\n*Abis:*\n\`\`\`\n${abiList}\`\`\`\n*ApiKeys:*\n\`\`\`\n${apiKeyList}\`\`\`\n*Signers:*\n\`\`\`\n${signerList}\n\`\`\``
            )
        )
        if (actionObject.dappUrl !== undefined && actionObject.dappUrl !== '')
            buttons.push(
                slackBuilder.buildSimpleSlackButton(
                    'Link to DAPP :link:',
                    { action: 'settings_link_to_dapp' },
                    'settings_link_to_dapp',
                    'primary'
                )
            )

        buttons.push(
            slackBuilder.buildSimpleSlackButton(
                'Edit Networks :pencil:',
                { action: 'settings_networks' },
                'settings_networks',
                'primary'
            ),
            slackBuilder.buildSimpleSlackButton(
                'Edit Contracts :pencil:',
                { action: 'settings_contracts' },
                'settings_contracts',
                undefined
            ),
            slackBuilder.buildSimpleSlackButton(
                'Edit ABIs :pencil:',
                { action: 'settings_abis' },
                'settings_abis',
                undefined
            ),
            slackBuilder.buildSimpleSlackButton(
                'Edit API Keys :pencil:',
                { action: 'settings_apiKeys' },
                'settings_apiKeys',
                undefined
            ),
            slackBuilder.buildSimpleSlackButton(
                'Edit Wallets :pencil:',
                { action: 'settings_signers' },
                'settings_signers',
                undefined
            ),
            slackBuilder.buildSimpleSlackButton(
                'More app settings :gear:',
                { action: 'settings_app' },
                'settings_app',
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
