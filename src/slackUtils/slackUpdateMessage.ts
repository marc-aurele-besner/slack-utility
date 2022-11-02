import { WebClient } from '@slack/web-api'

import { TBlocks } from '../types'

const slackUpdateMessage = async (token: string, channel: string, text: string, ts: string, blocks: TBlocks) => {
    const web = new WebClient(token)
    try {
        const response = await web.chat.update({
            channel,
            ts,
            text,
            blocks
        })
        console.log('\x1b[34m%s\x1b[0m', 'Message updated: ', ts, response.ok)
        return response
    } catch (error) {
        return error
    }
}

export default slackUpdateMessage
