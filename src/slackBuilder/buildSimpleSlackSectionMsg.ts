const buildSimpleSectionMsg = (title: string, value: string) => {
    return {
        type: 'section',
        text: {
            type: 'mrkdwn',
            text: `${title && title !== '' ? '*' + title + '*' : ''} ${value}`
        }
    }
}

export default buildSimpleSectionMsg
