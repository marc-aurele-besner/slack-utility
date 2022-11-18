import slackBuilder from '../slackBuilder'
import { TBlocks, TSlackPostMessageResponse } from '../types'

import slackPostMessage from './slackPostMessage'

export interface IWaitMessage {
    action: any
    blocks: TBlocks
}

const slackPostWaitMessage = async (
    action: any,
    parsedBody: any,
    text = 'Please wait while we query the information...' as string,
    blocks: TBlocks,
    returnValue: any,
    addDeleteBtn = true as boolean,
    addSettings = false as boolean,
    addRefresh = false as boolean
): Promise<IWaitMessage> => {
    let result: IWaitMessage = {
        action,
        blocks
    }

    blocks.push(slackBuilder.buildSimpleSlackHeaderMsg(`:pray: ${text} :clock2:`))
    try {
        let replyTo = action.slackDefaultConversationId as string
        if (parsedBody && parsedBody.container && parsedBody.container.channel_id) {
            replyTo = parsedBody.container.channel_id
        } else if (parsedBody && parsedBody.channel_id) {
            replyTo = parsedBody.channel_id
        } else if (parsedBody && parsedBody.channel && parsedBody.channel.id) {
            replyTo = parsedBody.channel.id
        } else if (parsedBody && parsedBody.user && parsedBody.user.id) {
            replyTo = parsedBody.user.id
        }
        const waitMessage: TSlackPostMessageResponse = await slackPostMessage(
            action.slackToken,
            replyTo,
            returnValue.body,
            blocks,
            addDeleteBtn,
            addSettings,
            addRefresh
        )
        if (waitMessage.resultPostMessage.ok)
            action = {
                ...action,
                waitMessageTs: waitMessage.resultPostMessage.ts,
                waitMessageChannelId: replyTo
            }
        blocks.pop()
    } catch (error) {
        console.log('\x1b[31m%s\x1b[0m', 'Error posting wait message: ', error)
    }
    result = {
        action,
        blocks
    }

    return result
}

export default slackPostWaitMessage
