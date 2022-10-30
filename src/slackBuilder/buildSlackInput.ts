const buildSlackInput = (text = 'Date and Time' as string, blockId = 'actions1' as string, element: any) => {
    return {
        type: 'input',
        block_id: blockId,
        label: {
            type: 'plain_text',
            text
        },
        element
    }
}

export default buildSlackInput
