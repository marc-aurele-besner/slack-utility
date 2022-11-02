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
    console.log('settings_contracts')

    if (actionObject.faunaToken && parsedBody.state.values.settings_save_input) {
        const settings: TSettings = {
            apiKeys: '',
            contracts: '',
            networks: '',
            signers: ''
        }
        if (parsedBody.state.values.settings_save_input.apiKeys_input)
            settings.apiKeys = parsedBody.state.values.settings_save_input.apiKeys_input.value || ''
        if (parsedBody.state.values.settings_save_input.contracts_input)
            settings.contracts = parsedBody.state.values.settings_save_input.contracts_input.value || ''
        if (parsedBody.state.values.settings_save_input.networks_input)
            settings.networks = parsedBody.state.values.settings_save_input.networks_input.value || ''
        if (parsedBody.state.values.settings_save_input.signers_input)
            settings.signers = parsedBody.state.values.settings_save_input.signers_input.value || ''
        console.log('newSettings', settings)

        // Check if user has settings in DB
        const getDbUserSettings = await fauna.queryTermByFaunaIndexes(
            actionObject.faunaToken,
            'settings_by_slackUserId',
            parsedBody.user.id
        )
        console.log(
            'getDbUserSettings',
            getDbUserSettings,
            getDbUserSettings.body,
            JSON.parse(getDbUserSettings.body).length
        )
        if (JSON.parse(getDbUserSettings.body).length === 0) {
            console.log('create new settings')
            await fauna.createFaunaDocument(actionObject.faunaToken, 'settings', {
                slackUserId: parsedBody.user.id,
                settings
            })
        } else {
            // if yes update settings
            console.log('update settings', getDbUserSettings.body[0])
            // await fauna.updateFaunaDocument(actionObject.faunaToken, 'settings', getDbUserSettings.body[0].ref.id, {
            //     slackUserId: parsedBody.user.id,
            //     settings
            // })
        }
    }
    messageBlocks.push(slackBuilder.buildSimpleSlackHeaderMsg(`Settings saved!`))

    return [actionObject, returnValue, messageBlocks, buttons]
}

export default action
