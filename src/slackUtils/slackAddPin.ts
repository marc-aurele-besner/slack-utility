import { WebClient } from '@slack/web-api'

const slackAddPin = async (token: string, channel: string, messageTs: string) => {
    const web = new WebClient(token)
    try {
        await web.pins.add({
            channel,
            timestamp: messageTs
        })
        console.log('\x1b[34m%s\x1b[0m', 'Message pinned!')
    } catch (error) {
        console.log('\x1b[31m%s\x1b[0m', 'Error: ', error)
    }
}

export default slackAddPin
