import { WebClient } from '@slack/web-api'

const slackUploadFile = async (
    token: string,
    channel: string,
    title: string,
    filetype: string,
    filename: string,
    file: Buffer | string,
    replyToMessageTs?: string
) => {
    const web = new WebClient(token)
    try {
        await web.files.uploadV2({
            channel,
            thread_ts: replyToMessageTs,
            title,
            filetype,
            filename,
            initial_comment: title,
            file: file
        })
        console.log('\x1b[34m%s\x1b[0m', 'File uploaded!')
    } catch (error) {
        console.log('\x1b[31m%s\x1b[0m', 'Error: ', error)
    }
}

export default slackUploadFile
