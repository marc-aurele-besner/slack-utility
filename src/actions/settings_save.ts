import fauna from 'faunadb-utility/src'

import slackBuilder from '../slackBuilder'
import slackUtils from '../slackUtils'
import { TBlockElements, TBlocks, TReturnValue, TSettings } from '../types'

const action = async (
    actionObject: any,
    parsedBody: any,
    messageBlocks: TBlocks,
    buttons: TBlockElements,
    returnValue: TReturnValue
) => {
    console.log('settings_save', parsedBody.view.state.values)
    try {
        await slackUtils.slackUpdateView(
            actionObject.slackToken,
            slackBuilder.buildSlackModal(
                'Add network',
                'settings_save',
                [
                    slackBuilder.buildSimpleSectionMsg('', 'Please validate the information.'),
                    {
                        type: 'divider'
                    },
                    slackBuilder.buildSimpleSlackHeaderMsg(`New network`),
                    {
                        type: 'image',
                        image_url: 'https://media.giphy.com/media/SVZGEcYt7brkFUyU90/giphy.gif',
                        alt_text: 'Yay! The modal was updated'
                    }
                    // slackBuilder.buildSlackInput(
                    //     'Network name',
                    //     'network_name',
                    //     slackBuilder.buildSlackPlainTextInput('Enter network name', 'networkName')
                    // ),
                    // slackBuilder.buildSlackInput(
                    //     'Network chain Id',
                    //     'network_chainId',
                    //     slackBuilder.buildSlackNumberInput('network_chnetworkChainIdainId')
                    // ),
                    // slackBuilder.buildSlackInput(
                    //     'Network RPC URL',
                    //     'network_rpcUrl',
                    //     slackBuilder.buildSlackPlainTextInput('Enter network RPC URL', 'networkRpcUrl')
                    // ),
                    // {
                    //     type: 'actions',
                    //     block_id: 'actions1',
                    //     elements: [
                    //         {
                    //             type: 'static_select',
                    //             placeholder: {
                    //                 type: 'plain_text',
                    //                 text: 'Which client/provider should we use?'
                    //             },
                    //             action_id: 'select_',
                    //             options: [
                    //                 {
                    //                     text: {
                    //                         type: 'plain_text',
                    //                         text: 'EVM - Ethers.js'
                    //                     },
                    //                     value: 'ethers'
                    //                 },
                    //                 {
                    //                     text: {
                    //                         type: 'plain_text',
                    //                         text: 'Tron - TronWeb'
                    //                     },
                    //                     value: 'tronweb'
                    //                 }
                    //             ]
                    //         }
                    //     ]
                    // }
                ],
                'Submit',
                'Close'
            ),
            undefined,
            parsedBody.view.id
        )
        // actionObject.closeView = true

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
        //     const getDbUserSettings = await fauna.queryTermByFaunaIndexes(
        //         actionObject.faunaToken,
        //         'settings_by_slackUserId',
        //         parsedBody.user.id
        //     )
        //     console.log(
        //         'getDbUserSettings',
        //         getDbUserSettings,
        //         getDbUserSettings.body,
        //         JSON.parse(getDbUserSettings.body).length
        //     )
        //     if (JSON.parse(getDbUserSettings.body).length === 0) {
        //         console.log('create new settings')
        //         await fauna.createFaunaDocument(actionObject.faunaToken, 'settings', {
        //             slackUserId: parsedBody.user.id,
        //             settings
        //         })
        //     } else {
        //         // if yes update settings
        //         console.log('update settings', getDbUserSettings.body[0])
        //         // await fauna.updateFaunaDocument(actionObject.faunaToken, 'settings', getDbUserSettings.body[0].ref.id, {
        //         //     slackUserId: parsedBody.user.id,
        //         //     settings
        //         // })
        //     }
        // }
        // messageBlocks.push(slackBuilder.buildSimpleSlackHeaderMsg(`Settings saved!`))
    } catch (error) {
        console.log('error', error)
        messageBlocks.push(slackBuilder.buildSimpleSlackHeaderMsg(`:x: Error: ${error}`))
    }

    return [actionObject, returnValue, messageBlocks, buttons]
}

export default action
