const buildSlackNumberInput = (
  action_id = 'number_input-action'
) => {
  return {
    type: 'number_input',
    is_decimal_allowed: false,
    action_id
  }
}

export default buildSlackNumberInput
