const buildSlackMultilineInput = (
  tip = 'Enter your account address',
  action_id =  'plain_input',
  initial_value = undefined as string | undefined,
  multiline = true
) => {
  return {
    type: 'plain_text_input',
    action_id,
    initial_value,
    multiline,
    placeholder: {
      type: 'plain_text',
      text: tip
    }
  }
}

export default buildSlackMultilineInput
