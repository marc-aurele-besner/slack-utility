import { TBlock } from '../types'

const buildSimpleSlackHeaderMsg = (text: string): TBlock => {
    return {
        type: 'header',
        text: {
            type: 'plain_text',
            text
        }
    }
}

export default buildSimpleSlackHeaderMsg
