import { slackBuilder } from '../slackBuilder'

const action = async (actionObject: any, parsedBody: any, messageBlocks: any[], buttons: any[], returnValue: any) => {
    console.log('error')

    messageBlocks.push(
        slackBuilder.buildSimpleSlackHeaderMsg(actionObject.error || `Error - ${actionObject.action_id} not found`)
    )

    return [actionObject, returnValue, messageBlocks, buttons]
}

export default action
