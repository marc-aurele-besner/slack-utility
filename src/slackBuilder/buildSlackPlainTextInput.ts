import { TBlockElement } from '../types'

const buildSlackPlainTextInput = (
    tip = 'Enter your account address' as string,
    actionId = 'plain_input' as string
): TBlockElement => {
    return {
        type: 'plain_text_input',
        action_id: actionId,
        placeholder: {
            type: 'plain_text',
            text: tip
        }
    }
}

export default buildSlackPlainTextInput
