const buildSimpleSlackButton = (
    text: string,
    value: any,
    actionId: string,
    style = undefined as string | undefined
) => {
    return {
        type: 'button',
        text: {
            type: 'plain_text',
            text
        },
        value,
        action_id: actionId,
        style
    }
}

export default buildSimpleSlackButton
