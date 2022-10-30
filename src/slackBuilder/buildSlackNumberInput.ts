const buildSlackNumberInput = (actionId = 'number_input-action' as string) => {
    return {
        type: 'number_input',
        is_decimal_allowed: false,
        action_id: actionId
    }
}

export default buildSlackNumberInput
