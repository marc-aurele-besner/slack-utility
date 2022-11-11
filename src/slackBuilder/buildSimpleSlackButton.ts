import { TBlockElement, TSlackButtonStyle } from '../types'

const buildSimpleSlackButton = (
    text: string,
    value: string | number | { [key: string]: any },
    actionId: string,
    style = undefined as TSlackButtonStyle
): TBlockElement => {
    let valueAsString: string
    if (typeof value === 'number') valueAsString = value.toString()
    else if (typeof value === 'string') valueAsString = value
    else valueAsString = JSON.stringify(value)
    return {
        type: 'button',
        text: {
            type: 'plain_text',
            text
        },
        value: valueAsString,
        action_id: actionId,
        style
    }
}

export default buildSimpleSlackButton
