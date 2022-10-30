const buildSimpleSlackHeaderMsg = (text: string) => {
    return {
        type: 'header',
        text: {
            type: 'plain_text',
            text
        }
    }
}

export default buildSimpleSlackHeaderMsg
