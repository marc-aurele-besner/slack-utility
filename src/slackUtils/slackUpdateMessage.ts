import { WebClient } from '@slack/web-api'

import slackBuilder from '../slackBuilder'
import { TBlock, TBlockElements, TBlocks, TSlackMessageResponse } from '../types'

const slackUpdateMessage = async (
    token: string,
    channel: string,
    text: string,
    ts: string,
    blocks: TBlocks,
    addDeleteBtn = true as boolean,
    addSettings = true as boolean,
    addRefresh = true as boolean
): Promise<TSlackMessageResponse> => {
    console.log('slackUpdateMessage', channel, ts)
    let result: TSlackMessageResponse = {
        ok: false,
        ts: ''
    }
    const web = new WebClient(token)
    try {
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

        if (actionBlock !== undefined && actionBlockElements !== undefined && ts !== undefined) {
            if (addDeleteBtn) actionBlockElements = slackBuilder.addDeleteButton(actionBlockElements, ts)
            if (addSettings) actionBlockElements = slackBuilder.addSettingButton(actionBlockElements, ts)
            if (addRefresh) actionBlockElements = slackBuilder.addRefreshButton(actionBlockElements, ts)
            if (addDeleteBtn || addSettings || addRefresh) {
                blocks = [
                    ...blocks.filter((block: TBlock) => block.type !== 'actions'),
                    {
                        type: defaultActionBlock.type,
                        block_id: actionBlock[0].block_id,
                        elements: actionBlockElements
                    }
                ]
            }
        }

        result = await web.chat.update({
            channel,
            ts,
            text,
            blocks
        })
        console.log('\x1b[34m%s\x1b[0m', 'Message updated: ', ts, result.ok)
    } catch (error) {
        console.log('\x1b[31m%s\x1b[0m', 'Error updating message: ', error)
    }
    return result
}

export default slackUpdateMessage
