import { WebClient } from '@slack/web-api'

import slackBuilder from '../slackBuilder'
import { TBlock, TBlocks } from '../types'

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
        const result = await web.chat.postMessage({
            channel,
            text,
            blocks
        })
        console.log('\x1b[34m%s\x1b[0m', 'Message sent: ', result.ts, addDeleteBtn, addSettings)

        let actionBlock = blocks.filter((block: TBlock) => block.type === 'actions')
        let actionBlockElements = actionBlock[0].elements
        if (actionBlock.length === 0) actionBlock = []
        if (actionBlockElements === undefined || actionBlockElements.length === 0) actionBlockElements = []

        if (actionBlock !== undefined && actionBlockElements !== undefined && result.ts !== undefined) {
            if (addDeleteBtn) actionBlockElements.push(slackBuilder.addDeleteButton(actionBlockElements, result.ts)[0])
            if (addSettings) actionBlockElements.push(slackBuilder.addSettingButton(actionBlockElements, result.ts)[0])
            if (addRefresh) actionBlockElements.push(slackBuilder.addRefreshButton(actionBlockElements, result.ts)[0])
            if (addDeleteBtn || addSettings || addRefresh) {
                blocks = [
                    ...blocks.filter((block: TBlock) => block.type !== 'actions'),
                    {
                        type: 'actions',
                        block_id: actionBlock[0].block_id,
                        elements: actionBlockElements
                    }
                ]
                await slackUpdateMessage(token, channel, text, result.ts, blocks)
            }
        }
        return result
    } catch (error) {
        return error
    }
}

export default slackPostMessage
