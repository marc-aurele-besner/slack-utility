import { TBlock } from '../types'

const buildSimpleSectionMsg = (title = '' as string, value = '' as string): TBlock => {
    return {
        type: 'section',
        text: {
            type: 'mrkdwn',
            text: `${title && title !== '' ? '*' + title + '*' : ''} ${value}`
        }
    }
}

export default buildSimpleSectionMsg
