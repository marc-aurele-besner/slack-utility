import slackBuilder from '../slackBuilder'
import { TBlockElements, TBlocks, TReturnValue } from '../types'

const action = async (
    actionObject: any,
    parsedBody: any,
    messageBlocks: TBlocks,
    buttons: TBlockElements,
    returnValue: TReturnValue
) => {
    console.log('explorer', actionObject)
    try {
        messageBlocks.push(slackBuilder.buildSimpleSlackHeaderMsg(`Explorer:`))
        messageBlocks.push(slackBuilder.buildSimpleSectionMsg('', 'Here '))
    } catch (error) {
        console.log('error', error)
        messageBlocks.push(slackBuilder.buildSimpleSlackHeaderMsg(`:x: Error: ${error}`))
    }

    return [actionObject, returnValue, messageBlocks, buttons]
}

export default action
