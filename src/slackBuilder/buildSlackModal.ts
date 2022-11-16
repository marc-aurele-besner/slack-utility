import { TBlocks } from '../types'

const buildSlackModal = (
    text = 'Modal' as string,
    callbackId = 'modal-callBack1' as string,
    blocks: any,
    submit = 'Submit' as string,
    close = 'Close' as string
) => {
    return {
        type: 'modal',
        title: {
            type: 'plain_text',
            text
        },
        blocks,
        close: {
            type: 'plain_text',
            text: close
        },
        submit: {
            type: 'plain_text',
            text: submit
        },
        callback_id: callbackId
    }
}

export default buildSlackModal
