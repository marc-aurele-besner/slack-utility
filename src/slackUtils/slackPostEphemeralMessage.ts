import { WebClient } from '@slack/web-api'

import slackBuilder from '../slackBuilder'
import { TBlock, TBlockElements, TBlocks, TSlackPostMessageResponse } from '../types'

import slackUpdateMessage from './slackUpdateMessage'

const slackPostEphemeralMessage = async (
    token: string,
    channel: string,
    text: string,
    user: string,
    blocks: TBlocks,
    addDeleteBtn = true as boolean,
    addSettings = true as boolean,
    addRefresh = true as boolean
): Promise<TSlackPostMessageResponse> => {
    const result: TSlackPostMessageResponse = {
        resultPostMessage: {
            ok: false,
            ts: ''
        },
        resultUpdateMessage: {
            ok: false,
            ts: ''
        }
    }
    const web = new WebClient(token)
    try {
        result.resultPostMessage = await web.chat.postEphemeral({
            channel,
            text,
            user,
            blocks
        })
        console.log('\x1b[34m%s\x1b[0m', 'Ephemeral Message sent: ', result.resultPostMessage.ts, addDeleteBtn, addSettings)

        const defaultActionBlock = {
            type: 'actions',
            block_id: 'actions1',
            elements: []
        }
        let actionBlock: TBlock[] | undefined
        let actionBlockElements: TBlockElements | undefined

        try {
            actionBlock = blocks.filter((block: TBlock) => block.type === 'actions')
            if (actionBlock.length === 0) actionBlock = [defaultActionBlock]
        } catch (err) {
            actionBlock = [defaultActionBlock]
        }

        try {
            actionBlockElements = actionBlock[0].elements
        } catch (err) {
            actionBlockElements = []
        }

        if (
            actionBlock !== undefined &&
            actionBlockElements !== undefined &&
            result.resultPostMessage.ts !== undefined
        ) {
            if (addDeleteBtn)
                actionBlockElements = slackBuilder.addDeleteButton(actionBlockElements, result.resultPostMessage.ts)
            if (addSettings)
                actionBlockElements = slackBuilder.addSettingButton(actionBlockElements, result.resultPostMessage.ts)
            if (addRefresh)
                actionBlockElements = slackBuilder.addRefreshButton(actionBlockElements, result.resultPostMessage.ts)
            if (addDeleteBtn || addSettings || addRefresh) {
                blocks = [
                    ...blocks.filter((block: TBlock) => block.type !== 'actions'),
                    {
                        type: defaultActionBlock.type,
                        block_id: actionBlock[0].block_id,
                        elements: actionBlockElements
                    }
                ]
                result.resultUpdateMessage = await slackUpdateMessage(
                    token,
                    channel,
                    text,
                    result.resultPostMessage.ts,
                    blocks
                )
            }
        }
    } catch (error) {
        console.log('\x1b[31m%s\x1b[0m', 'Error: ', error)
    }
    return result
}

export default slackPostEphemeralMessage
