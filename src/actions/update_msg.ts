import slackBuilder from '../slackBuilder'
import slackUpdateMessage from '../slackUtils/slackUpdateMessage'
import { TBlockElements, TBlocks, TReturnValue } from '../types'

const action = async (
    actionObject: any,
    parsedBody: any,
    messageBlocks: TBlocks,
    buttons: TBlockElements,
    returnValue: TReturnValue
) => {
    console.log('update_msg', actionObject)
    try {
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
    } catch (error) {
        console.log('error', error)
        messageBlocks.push(slackBuilder.buildSimpleSlackHeaderMsg(`:x: Error: ${error}`))
    }

    return [actionObject, returnValue, messageBlocks, buttons]
}

export default action
