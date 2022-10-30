const buildSlackInput = (
  text = 'Date and Time',
  block_id = 'actions1',
  element: any
) => {
  return {
    type: 'input',
    block_id,
    label: {
      type: 'plain_text',
      text
    },
    element
  }
}

export default buildSlackInput
