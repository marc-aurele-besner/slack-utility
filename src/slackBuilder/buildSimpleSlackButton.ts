import { TBlockElement, TSlackButtonStyle } from '../types'

const buildSimpleSlackButton = (
    text: string,
    value: string,
    actionId: string,
    style = undefined as TSlackButtonStyle
): TBlockElement => {
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
