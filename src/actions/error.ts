import slackBuilder from '../slackBuilder'
import { TBlockElements, TBlocks, TReturnValue } from '../types'

const action = async (
    actionObject: any,
    parsedBody: any,
    messageBlocks: TBlocks,
    buttons: TBlockElements,
    returnValue: TReturnValue
) => {
    console.log('error')
    messageBlocks.push(
        slackBuilder.buildSimpleSlackHeaderMsg(actionObject.error || `Error - ${actionObject.action_id} not found`)
    )
    return [actionObject, returnValue, messageBlocks, buttons]
}

export default action
