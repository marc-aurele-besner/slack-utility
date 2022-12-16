import slackBuilder from '../slackBuilder'
import { TBlockElements, TBlocks, TReturnValue } from '../types'

import retrieveModule from './retrieveModule'
import slackPostMessage from './slackPostMessage'
import slackUpdateMessage from './slackUpdateMessage'

const actionsLoop = async (
    token: string,
    actionsList: any,
    action: any,
    parsedBody: any,
    messageBlocks: TBlocks,
    buttons: TBlockElements,
    returnValue: TReturnValue
) => {
    try {
        if (action.localSettings && action.localSettings.useModules && retrieveModule(parsedBody) !== null)
            action.action_id = retrieveModule(parsedBody)
        if (action.localSettings && action.localSettings.logLevel > 1)
            console.log('retrieveModule: ', retrieveModule(parsedBody))
        if (action.action_id.includes(':')) action.action_id = action.action_id.split(':')[0]
        if (action !== undefined && action.action_id !== undefined && actionsList[action.action_id] !== undefined)
            [action, returnValue, messageBlocks, buttons] = await actionsList[action.action_id](
                action,
                parsedBody,
                [],
                [],
                returnValue
            )
        returnValue.body = 'Message to action_id: ' + action.action_id + ' sent'
        let replyTo = action.slackDefaultConversationId as string
        if (parsedBody && parsedBody.container && parsedBody.container.channel_id)
            replyTo = parsedBody.container.channel_id
        else if (parsedBody && parsedBody.channel_id) replyTo = parsedBody.channel_id
        else if (parsedBody && parsedBody.channel && parsedBody.channel.id) replyTo = parsedBody.channel.id
        else if (parsedBody && parsedBody.user && parsedBody.user.id) replyTo = parsedBody.user.id
        if (action.localSettings && action.localSettings.logLevel > 0) console.log('replyTo', replyTo)
        if (messageBlocks.length > 0 && returnValue.body && replyTo) {
            messageBlocks.push(
                slackBuilder.buildSlackActionMsg(
                    {
                        networks: action.env ? (action.env.networks ? action.env.networks : []) : [],
                        contracts: action.env ? (action.env.contracts ? action.env.contracts : []) : []
                    },
                    undefined,
                    [...buttons],
                    action.localSettings && action.localSettings.addNetworkAndContractSelector ? true : false,
                    action.localSettings && action.localSettings.useExplorerModule ? true : false,
                    action.localSettings && action.localSettings.useAddressBookModule ? true : false
                )
            )
            if (action.localSettings && action.localSettings.logLevel > 1) console.log('messageBlocks', messageBlocks)
            if (action.waitMessageTs)
                await slackUpdateMessage(
                    token,
                    action.waitMessageChannelId || replyTo,
                    returnValue.body,
                    action.waitMessageTs,
                    messageBlocks,
                    action.localSettings && action.localSettings.addDeleteButtons ? true : false,
                    action.localSettings && action.localSettings.addSettingsButton ? true : false,
                    action.localSettings && action.localSettings.addRefreshButton ? true : false
                )
            else if (!action.closeView)
                await slackPostMessage(
                    token,
                    replyTo,
                    returnValue.body,
                    messageBlocks,
                    action.localSettings && action.localSettings.addDeleteButtons ? true : false,
                    action.localSettings && action.localSettings.addSettingsButton ? true : false,
                    action.localSettings && action.localSettings.addRefreshButton ? true : false
                )
        }
    } catch (error) {
        if (action.localSettings && action.localSettings.logLevel > 0) console.log('error', error)
        messageBlocks.push(slackBuilder.buildSimpleSlackHeaderMsg(`:x: Error: ${error}`))
        await slackPostMessage(
            token,
            parsedBody.channel_id,
            returnValue.body,
            messageBlocks,
            action.localSettings && action.localSettings.addDeleteButtons ? true : false,
            action.localSettings && action.localSettings.addSettingsButton ? true : false,
            action.localSettings && action.localSettings.addRefreshButton ? true : false
        )
    }
    return [action, returnValue, messageBlocks, buttons]
}

export default actionsLoop
