import { TBlockElement } from '../types'

const buildSlackUrlInput = (
    tip = 'Enter the url' as string,
    actionId = 'url_input' as string,
    initialValue = '' as string,
): TBlockElement => {
    return {
        type: 'url_text_input',
        action_id: actionId,
        initial_value: initialValue,
        placeholder: {
            type: 'url_text',
            text: tip
        }
    }
}

export default buildSlackUrlInput
