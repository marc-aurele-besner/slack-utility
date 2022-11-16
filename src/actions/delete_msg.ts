import slackBuilder from '../slackBuilder'
import slackDeleteMessage from '../slackUtils/slackDeleteMessage'
import { TBlockElements, TBlocks, TReturnValue } from '../types'

const action = async (
    actionObject: any,
    parsedBody: any,
    messageBlocks: TBlocks,
    buttons: TBlockElements,
    returnValue: TReturnValue
) => {
    console.log('delete_msg')
    try {
        returnValue.body = JSON.stringify({ message: 'Message deleted ' + actionObject.value })
        await slackDeleteMessage(actionObject.slackToken, parsedBody.container.channel_id, actionObject.value)
    } catch (error) {
        console.log('error', error)
        messageBlocks.push(slackBuilder.buildSimpleSlackHeaderMsg(`:x: Error: ${error}`))
    }

    return [actionObject, returnValue, messageBlocks, buttons]
}

export default action
