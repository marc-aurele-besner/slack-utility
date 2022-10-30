import { slackBuilder } from '../slackBuilder'
  
const action = async (action, parsedBody, messageBlocks, buttons, returnValue) => {
  console.log('error')

  messageBlocks.push(slackBuilder.buildSimpleSlackHeaderMsg(action.error || `Error - ${action.action_id} not found`))
  
  return [action, returnValue, messageBlocks, buttons]
}

export default action