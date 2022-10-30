const buildSlackMultilineInput = (
    tip = 'Enter your account address' as string,
    actionId = 'plain_input' as string,
    initialValue = undefined as string | undefined,
    multiline = true as boolean
) => {
    return {
        type: 'plain_text_input',
        action_id: actionId,
        initial_value: initialValue,
        multiline,
        placeholder: {
            type: 'plain_text',
            text: tip
        }
    }
}

export default buildSlackMultilineInput
