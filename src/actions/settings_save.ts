import fauna from 'faunadb-utility'

import slackBuilder from '../slackBuilder'
import slackUtils from '../slackUtils'
import {
    TAbi,
    TApiKey,
    TBlockElements,
    TBlocks,
    TCommand,
    TContract,
    TNetwork,
    TReturnValue,
    TSigner,
    TTeamSettings,
    TUserSettings
} from '../types'

const action = async (
    actionObject: any,
    parsedBody: any,
    messageBlocks: TBlocks,
    buttons: TBlockElements,
    returnValue: TReturnValue
) => {
    try {
        console.log('settings_save')
        if (parsedBody.view !== undefined && parsedBody.view.private_metadata !== undefined) {
            actionObject.closeView = true

            const values = JSON.parse(parsedBody.view.private_metadata)
            const userSettings: TUserSettings = {
                slackAppId: parsedBody.api_app_id,
                slackUserId: parsedBody.user.id,
                slackTeamId: parsedBody.team.id,
                networks: [],
                contracts: [],
                abis: [],
                apiKeys: [],
                signers: []
            }
            const teamSettings: TTeamSettings = {
                slackAppId: parsedBody.api_app_id,
                slackTeamId: parsedBody.team.id,
                networks: [],
                contracts: [],
                abis: [],
                apiKeys: [],
                signers: [],
                commands: []
            }
            if (
                values.network_name !== undefined &&
                values.network_chainId !== undefined &&
                values.network_rpcUrl !== undefined &&
                values.network_type !== undefined
            ) {
                const newNetwork: TNetwork = {
                    name: values.network_name.networkName.value,
                    value: values.network_name.networkName.value.toLowerCase().replace(/ /g, '_'),
                    defaultRpc: values.network_rpcUrl.networkRpcUrl.value,
                    chainId: values.network_chainId.networkChainId.value,
                    emoji: ':test_tube:',
                    active: true,
                    signingType: 'web3',
                    networkClient: values.network_type.networkType.selected_option.value
                }
                JSON.parse(actionObject.value).team_settings
                    ? teamSettings.networks.push(newNetwork)
                    : userSettings.networks.push(newNetwork)
            }
            if (values.contract_name !== undefined) {
                const newContract: TContract = {
                    name: values.contract_name.contractName.value,
                    emoji: ':test_tube:',
                    active: true,
                    addressPerNetwork: []
                }
                JSON.parse(actionObject.value).team_settings
                    ? teamSettings.contracts.push(newContract)
                    : userSettings.contracts.push(newContract)
            }
            if (values.abis_name !== undefined) {
                const newAbi: TAbi = {
                    name: values.abis_name.abisName.value,
                    active: true,
                    abi: values.abis_abi.abisABI.value,
                    byteCode: values.abis_byteCode.abisByteCode.value
                }
                JSON.parse(actionObject.value).team_settings
                    ? teamSettings.abis.push(newAbi)
                    : userSettings.abis.push(newAbi)
            }
            if (values.apiKey_name !== undefined) {
                const newApiKey: TApiKey = {
                    name: values.apiKey_name.apiKeyName.value,
                    active: true,
                    value: values.apiKey_value.apiKeyValue.value
                }
                JSON.parse(actionObject.value).team_settings
                    ? teamSettings.apiKeys.push(newApiKey)
                    : userSettings.apiKeys.push(newApiKey)
            }
            if (values.signer_name !== undefined) {
                const newSigner: TSigner = {
                    name: values.signer_name.signerName.value,
                    active: true,
                    privateKey: values.signer_pk.signerPk.value
                }
                JSON.parse(actionObject.value).team_settings
                    ? teamSettings.signers.push(newSigner)
                    : userSettings.signers.push(newSigner)
            }
            if (values.signer_name !== undefined && JSON.parse(actionObject.value).team_settings) {
                const newCommand: TCommand = {
                    command: values.command_name.commandName.value,
                    description: values.command_description.commandDescription.value,
                    active: true
                }
                teamSettings.commands.push(newCommand)
            }
            // Check if user has settings in DB
            const getDbUserSettings = await fauna.queryTermByFaunaIndexes(
                actionObject.faunaDbToken,
                'settings_by_slackTeamUserId',
                JSON.parse(actionObject.value).team_settings
                    ? parsedBody.team.id
                    : parsedBody.team.id + '_' + parsedBody.user.id
            )
            if (JSON.parse(getDbUserSettings.body).length === 0) {
                await fauna.createFaunaDocument(actionObject.faunaDbToken, 'settings', {
                    slackUserId: parsedBody.user.id,
                    slackTeamUserId: JSON.parse(actionObject.value).team_settings
                        ? teamSettings
                        : parsedBody.team.id + '_' + parsedBody.user.id,
                    settings: JSON.parse(actionObject.value).team_settings ? teamSettings : userSettings
                })
            } else {
                if (
                    JSON.parse(getDbUserSettings.body)[0].data.settings.commands &&
                    JSON.parse(actionObject.value).team_settings
                )
                    teamSettings.commands = [
                        ...teamSettings.commands,
                        ...JSON.parse(getDbUserSettings.body)[0].data.settings.commands
                    ]
                if (JSON.parse(getDbUserSettings.body)[0].data.settings.abis)
                    JSON.parse(actionObject.value).team_settings
                        ? (teamSettings.abis = [
                              ...teamSettings.abis,
                              ...JSON.parse(getDbUserSettings.body)[0].data.settings.abis
                          ])
                        : (userSettings.abis = [
                              ...userSettings.abis,
                              ...JSON.parse(getDbUserSettings.body)[0].data.settings.abis
                          ])
                if (JSON.parse(getDbUserSettings.body)[0].data.settings.networks)
                    JSON.parse(actionObject.value).team_settings
                        ? (teamSettings.networks = [
                              ...teamSettings.networks,
                              ...JSON.parse(getDbUserSettings.body)[0].data.settings.networks
                          ])
                        : (userSettings.networks = [
                              ...userSettings.networks,
                              ...JSON.parse(getDbUserSettings.body)[0].data.settings.networks
                          ])
                if (JSON.parse(getDbUserSettings.body)[0].data.settings.contracts)
                    JSON.parse(actionObject.value).team_settings
                        ? (teamSettings.contracts = [
                              ...teamSettings.contracts,
                              ...JSON.parse(getDbUserSettings.body)[0].data.settings.contracts
                          ])
                        : (userSettings.contracts = [
                              ...userSettings.contracts,
                              ...JSON.parse(getDbUserSettings.body)[0].data.settings.contracts
                          ])
                if (JSON.parse(getDbUserSettings.body)[0].data.settings.apiKeys)
                    JSON.parse(actionObject.value).team_settings
                        ? (teamSettings.apiKeys = [
                              ...teamSettings.apiKeys,
                              ...JSON.parse(getDbUserSettings.body)[0].data.settings.apiKeys
                          ])
                        : (userSettings.apiKeys = [
                              ...userSettings.apiKeys,
                              ...JSON.parse(getDbUserSettings.body)[0].data.settings.apiKeys
                          ])
                if (JSON.parse(getDbUserSettings.body)[0].data.settings.signers)
                    JSON.parse(actionObject.value).team_settings
                        ? (teamSettings.signers = [
                              ...teamSettings.signers,
                              ...JSON.parse(getDbUserSettings.body)[0].data.settings.signers
                          ])
                        : (userSettings.signers = [
                              ...userSettings.signers,
                              ...JSON.parse(getDbUserSettings.body)[0].data.settings.signers
                          ])
                await fauna.updateFaunaDocument(
                    actionObject.faunaDbToken,
                    'settings',
                    JSON.parse(getDbUserSettings.body)[0].ref['@ref'].id,
                    {
                        slackUserId: parsedBody.user.id,
                        slackTeamUserId: JSON.parse(actionObject.value).team_settings
                            ? parsedBody.team.id
                            : parsedBody.team.id + '_' + parsedBody.user.id,
                        settings: JSON.parse(actionObject.value).team_settings ? teamSettings : userSettings
                    }
                )
            }
        } else if (actionObject.value !== undefined) {
            await slackUtils.slackDeleteMessage(actionObject.slackToken, parsedBody.channel.id, parsedBody.message.ts)
            if (actionObject.value) {
                const { subAction, value, originalMessage } = JSON.parse(actionObject.value)

                const getDbUserSettings = await fauna.queryTermByFaunaIndexes(
                    actionObject.faunaDbToken,
                    'settings_by_slackTeamUserId',
                    parsedBody.team.id + '_' + parsedBody.user.id
                )
                if (JSON.parse(getDbUserSettings.body).length > 0) {
                    const newSettings = JSON.parse(getDbUserSettings.body)[0].data.settings
                    if (subAction === 'delete_network')
                        newSettings.networks = newSettings.networks.filter(
                            (network: TNetwork) => network.value !== value
                        )
                    if (subAction === 'delete_contract')
                        newSettings.contracts = newSettings.contracts.filter(
                            (contract: TContract) => contract.name !== value
                        )
                    if (subAction === 'delete_abi')
                        newSettings.abis = newSettings.abis.filter((contract: TAbi) => contract.name !== value)
                    if (subAction === 'delete_apiKey')
                        newSettings.apiKeys = newSettings.apiKeys.filter((contract: TApiKey) => contract.name !== value)
                    if (subAction === 'delete_signer')
                        newSettings.signers = newSettings.signers.filter((contract: TSigner) => contract.name !== value)
                    await fauna.updateFaunaDocument(
                        actionObject.faunaDbToken,
                        'settings',
                        JSON.parse(getDbUserSettings.body)[0].ref['@ref'].id,
                        { settings: newSettings }
                    )
                }
                await slackUtils.slackDeleteMessage(actionObject.slackToken, parsedBody.channel.id, originalMessage)
            }
        }
        parsedBody.channel_id = JSON.parse(parsedBody.view.private_metadata).channel_id
        actionObject.waitMessageTs = JSON.parse(parsedBody.view.private_metadata).originalMessage
        messageBlocks.push(slackBuilder.buildSimpleSlackHeaderMsg(`Settings saved!`))
    } catch (error) {
        console.log('error', error)
        messageBlocks.push(slackBuilder.buildSimpleSlackHeaderMsg(`:x: Error: ${error}`))
    }

    return [actionObject, returnValue, messageBlocks, buttons]
}

export default action
