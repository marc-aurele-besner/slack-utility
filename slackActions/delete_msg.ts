import { slackDeleteMessage } from '../slackBuilder'
  
const action = async (action, parsedBody, messageBlocks, buttons, returnValue) => {
  returnValue.body = JSON.stringify({
    message: 'Message deleted ' + action.value
  })
  await slackDeleteMessage(parsedBody.container.channel_id, action.value)
  return [action, returnValue, messageBlocks, buttons]
}

export default action