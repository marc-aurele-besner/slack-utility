const buildSlackPlainTextInput = (
  tip = 'Enter your account address',
  action_id =  'plain_input'
) => {
  return {
    type: 'plain_text_input',
    action_id,
    placeholder: {
      type: 'plain_text',
      text: tip
    }
  }
}

export default buildSlackPlainTextInput
