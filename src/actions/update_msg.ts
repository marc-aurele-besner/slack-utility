import slackUpdateMessage from '../slackUtils/slackUpdateMessage'
import { TBlockElements, TBlocks, TReturnValue } from '../types'

const action = async (
    actionObject: any,
    parsedBody: any,
    messageBlocks: TBlocks,
    buttons: TBlockElements,
    returnValue: TReturnValue
) => {
    returnValue.body = JSON.stringify({
        message: 'Message updated ' + actionObject.value
    })
    await slackUpdateMessage(
        actionObject.slackToken,
        parsedBody.container.channel_id,
        'Text updated',
        actionObject.value,
        messageBlocks
    )

    return [actionObject, returnValue, messageBlocks, buttons]
}

export default action
