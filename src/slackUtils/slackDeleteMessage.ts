import { WebClient } from '@slack/web-api'

const slackDeleteMessage = async (token: string, channel: string, ts: string) => {
    const web = new WebClient(token)

    try {
        const result = await web.chat.delete({
            channel,
            ts
        })
        console.log('\x1b[34m%s\x1b[0m', 'Message deleted: ', result.ts)
        return result
    } catch (error) {
        return error
    }
}

export default slackDeleteMessage
