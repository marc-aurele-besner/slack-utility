import slackDeleteMessage from '../slackUtils/slackDeleteMessage'
import { TBlockElements, TBlocks, TReturnValue } from '../types'

const action = async (
    actionObject: any,
    parsedBody: any,
    messageBlocks: TBlocks,
    buttons: TBlockElements,
    returnValue: TReturnValue
) => {
    returnValue.body = JSON.stringify({
        message: 'Message deleted ' + actionObject.value
    })
    await slackDeleteMessage(actionObject.slackToken, parsedBody.container.channel_id, actionObject.value)

    return [actionObject, returnValue, messageBlocks, buttons]
}

export default action
