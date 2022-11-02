import { WebClient } from '@slack/web-api'

import slackBuilder from '../slackBuilder'
import { TBlock, TBlockElements, TBlocks } from '../types'

import slackUpdateMessage from './slackUpdateMessage'

const slackPostMessage = async (
    token: string,
    channel: string,
    text: string,
    blocks: TBlocks,
    addDeleteBtn = true as boolean,
    addSettings = true as boolean,
    addRefresh = true as boolean
) => {
    const web = new WebClient(token)
    try {
        const resultPostMessage = await web.chat.postMessage({
            channel,
            text,
            blocks
        })
        console.log('\x1b[34m%s\x1b[0m', 'Message sent: ', resultPostMessage.ts, addDeleteBtn, addSettings)

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

        let resultUpdateMessage: any
        if (actionBlock !== undefined && actionBlockElements !== undefined && resultPostMessage.ts !== undefined) {
            if (addDeleteBtn)
                actionBlockElements = slackBuilder.addDeleteButton(actionBlockElements, resultPostMessage.ts)
            if (addSettings)
                actionBlockElements = slackBuilder.addSettingButton(actionBlockElements, resultPostMessage.ts)
            if (addRefresh)
                actionBlockElements = slackBuilder.addRefreshButton(actionBlockElements, resultPostMessage.ts)
            if (addDeleteBtn || addSettings || addRefresh) {
                blocks = [
                    ...blocks.filter((block: TBlock) => block.type !== 'actions'),
                    {
                        type: defaultActionBlock.type,
                        block_id: actionBlock[0].block_id,
                        elements: actionBlockElements
                    }
                ]
                resultUpdateMessage = await slackUpdateMessage(token, channel, text, resultPostMessage.ts, blocks)
            }
        }
        const result = {
            resultPostMessage,
            resultUpdateMessage
        }
        return result
    } catch (error) {
        return error
    }
}

export default slackPostMessage
