import { TBlocks } from '../types'

const buildSlackModal = (
    text = 'Modal' as string,
    callbackId = 'modal-callBack1' as string,
    blocks: any,
    submit = 'Submit' as string | undefined,
    close = 'Close' as string,
    privateMetaData = '' as string | number | { [key: string]: any }
) => {
    let privateMetaDataFormatted: string
    if (typeof privateMetaData === 'number') privateMetaDataFormatted = privateMetaData.toString()
    else if (typeof privateMetaData === 'string') privateMetaDataFormatted = privateMetaData
    else privateMetaDataFormatted = JSON.stringify(privateMetaData)
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
        submit:
            submit !== undefined
                ? {
                      type: 'plain_text',
                      text: submit
                  }
                : undefined,
        callback_id: callbackId,
        private_metadata: privateMetaDataFormatted
    }
}

export default buildSlackModal
