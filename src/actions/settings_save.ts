import fauna from 'faunadb-utility/src'

import slackBuilder from '../slackBuilder'
import { TBlockElements, TBlocks, TReturnValue, TSettings } from '../types'

const action = async (
    actionObject: any,
    parsedBody: any,
    messageBlocks: TBlocks,
    buttons: TBlockElements,
    returnValue: TReturnValue
) => {
    console.log('settings_save', parsedBody.view.private_metadata)
    try {
        actionObject.closeView = true

        const values = JSON.parse(parsedBody.view.private_metadata)
        const settings: any = {
            slackAppId: parsedBody.api_app_id,
            slackUserId: parsedBody.user.id,
            slackTeamId: parsedBody.team.id,
            networks: [],
            contracts: [],
            apiKeys: [],
            signers: []
        }
        console.log('values', values)
        if (
            values.network_name !== undefined &&
            values.network_chainId !== undefined &&
            values.network_rpcUrl !== undefined &&
            values.network_type !== undefined
        ) {
            const newNetwork = {
                name: values.network_name.networkName.value,
                chainId: values.network_chainId.networkChainId.value,
                rpcUrl: values.network_rpcUrl.networkRpcUrl.value,
                type: values.network_type.networkType.selected_option.value
            }
            console.log('newNetwork', newNetwork)
            settings.networks.push(newNetwork)
        }
        // if (actionObject.faunaToken && parsedBody.state.values.settings_save_input) {
        //     const settings: TSettings = {
        //         apiKeys: '',
        //         contracts: '',
        //         networks: '',
        //         signers: ''
        //     }
        //     if (parsedBody.state.values.settings_save_input.apiKeys_input)
        //         settings.apiKeys = parsedBody.state.values.settings_save_input.apiKeys_input.value || ''
        //     if (parsedBody.state.values.settings_save_input.contracts_input)
        //         settings.contracts = parsedBody.state.values.settings_save_input.contracts_input.value || ''
        //     if (parsedBody.state.values.settings_save_input.networks_input)
        //         settings.networks = parsedBody.state.values.settings_save_input.networks_input.value || ''
        //     if (parsedBody.state.values.settings_save_input.signers_input)
        //         settings.signers = parsedBody.state.values.settings_save_input.signers_input.value || ''
        //     console.log('newSettings', settings)
        //     // Check if user has settings in DB
        const getDbUserSettings = await fauna.queryTermByFaunaIndexes(
            actionObject.faunaDbToken,
            'settings_by_slackUserId',
            parsedBody.user.id
        )
        console.log('getDbUserSettings', getDbUserSettings)
        if (JSON.parse(getDbUserSettings.body).length === 0) {
            console.log('create new settings')
            await fauna.createFaunaDocument(actionObject.faunaDbToken, 'settings', {
                slackUserId: parsedBody.user.id,
                settings
            })
        } else {
            console.log(
                'getDbUserSettings',
                getDbUserSettings,
                getDbUserSettings.body,
                JSON.parse(getDbUserSettings.body).length
            )
            // if yes update settings
            console.log('update settings', JSON.parse(getDbUserSettings.body)[0])
            if (JSON.parse(getDbUserSettings.body)[0].data.settings.networks)
                settings.networks = JSON.parse(getDbUserSettings.body)[0].data.settings.networks
            if (JSON.parse(getDbUserSettings.body)[0].data.settings.contracts)
                settings.contracts = JSON.parse(getDbUserSettings.body)[0].data.settings.contracts
            if (JSON.parse(getDbUserSettings.body)[0].data.settings.apiKeys)
                settings.apiKeys = JSON.parse(getDbUserSettings.body)[0].data.settings.apiKeys
            if (JSON.parse(getDbUserSettings.body)[0].data.settings.signers)
                settings.signers = JSON.parse(getDbUserSettings.body)[0].data.settings.signers
            console.log('settings', settings)
            await fauna.updateFaunaDocument(
                actionObject.faunaDbToken,
                'settings',
                JSON.parse(getDbUserSettings.body)[0].ref['@ref'].id,
                {
                    slackUserId: parsedBody.user.id,
                    settings
                }
            )
        }
        messageBlocks.push(slackBuilder.buildSimpleSlackHeaderMsg(`Settings saved!`))
    } catch (error) {
        console.log('error', error)
        messageBlocks.push(slackBuilder.buildSimpleSlackHeaderMsg(`:x: Error: ${error}`))
    }

    return [actionObject, returnValue, messageBlocks, buttons]
}

export default action
