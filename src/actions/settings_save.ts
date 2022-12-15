import fauna from 'faunadb-utility'

import slackBuilder from '../slackBuilder'
import slackUtils from '../slackUtils'
import {
    TAbi,
    TApiKey,
    TBlockElements,
    TBlocks,
    TContract,
    TNetwork,
    TReturnValue,
    TSigner,
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
            const settings: TUserSettings = {
                slackAppId: parsedBody.api_app_id,
                slackUserId: parsedBody.user.id,
                slackTeamId: parsedBody.team.id,
                networks: [],
                contracts: [],
                abis: [],
                apiKeys: [],
                signers: []
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
                settings.networks.push(newNetwork)
            }
            if (values.contract_name !== undefined) {
                const newContract: TContract = {
                    name: values.contract_name.contractName.value,
                    emoji: ':test_tube:',
                    active: true,
                    addressPerNetwork: []
                }
                settings.contracts.push(newContract)
            }
            if (values.abis_name !== undefined) {
                const newAbi: TAbi = {
                    name: values.abis_name.abisName.value,
                    active: true,
                    abi: values.abis_abi.abisABI.value,
                    byteCode: values.abis_byteCode.abisByteCode.value
                }
                settings.abis.push(newAbi)
            }
            if (values.apiKey_name !== undefined) {
                const newApiKey: TApiKey = {
                    name: values.apiKey_name.apiKeyName.value,
                    active: true,
                    value: values.apiKey_value.apiKeyValue.value
                }
                settings.apiKeys.push(newApiKey)
            }
            if (values.signer_name !== undefined) {
                const newSigner: TSigner = {
                    name: values.signer_name.signerName.value,
                    active: true,
                    privateKey: values.signer_pk.signerPk.value
                }
                settings.signers.push(newSigner)
            }
            // Check if user has settings in DB
            const getDbUserSettings = await fauna.queryTermByFaunaIndexes(
                actionObject.faunaDbToken,
                'settings_by_slackTeamUserId',
                parsedBody.user.id
            )
            if (JSON.parse(getDbUserSettings.body).length === 0) {
                await fauna.createFaunaDocument(actionObject.faunaDbToken, 'settings', {
                    slackUserId: parsedBody.user.id,
                    slackTeamUserId: parsedBody.team.id + '_' + parsedBody.user.id,
                    settings
                })
            } else {
                if (JSON.parse(getDbUserSettings.body)[0].data.settings.networks)
                    settings.networks = [
                        ...settings.networks,
                        ...JSON.parse(getDbUserSettings.body)[0].data.settings.networks
                    ]
                if (JSON.parse(getDbUserSettings.body)[0].data.settings.contracts)
                    settings.contracts = [
                        ...settings.contracts,
                        ...JSON.parse(getDbUserSettings.body)[0].data.settings.contracts
                    ]
                if (JSON.parse(getDbUserSettings.body)[0].data.settings.apiKeys)
                    settings.apiKeys = [
                        ...settings.apiKeys,
                        ...JSON.parse(getDbUserSettings.body)[0].data.settings.apiKeys
                    ]
                if (JSON.parse(getDbUserSettings.body)[0].data.settings.signers)
                    settings.signers = [
                        ...settings.signers,
                        ...JSON.parse(getDbUserSettings.body)[0].data.settings.signers
                    ]
                await fauna.updateFaunaDocument(
                    actionObject.faunaDbToken,
                    'settings',
                    JSON.parse(getDbUserSettings.body)[0].ref['@ref'].id,
                    {
                        slackUserId: parsedBody.user.id,
                        slackTeamUserId: parsedBody.team.id + '_' + parsedBody.user.id,
                        settings
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
        messageBlocks.push(slackBuilder.buildSimpleSlackHeaderMsg(`Settings saved!`))
    } catch (error) {
        console.log('error', error)
        messageBlocks.push(slackBuilder.buildSimpleSlackHeaderMsg(`:x: Error: ${error}`))
    }

    return [actionObject, returnValue, messageBlocks, buttons]
}

export default action
