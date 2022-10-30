const buildSimpleSlackButton = (
  text: string,
  value: any,
  action_id: string,
  style = undefined as string | undefined
) => {
  return {
    type: 'button',
    text: {
      type: 'plain_text',
      text
    },
    value,
    action_id,
    style
  }
}

export default buildSimpleSlackButton
