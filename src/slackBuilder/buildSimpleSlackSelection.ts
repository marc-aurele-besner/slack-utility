import { TBlockElement, TNetwork, TNetworks } from '../types'

import { buildSimpleSlackOption } from './buildSimpleSlackOptions'

const buildSimpleSlackSelection = (
    _options: {
        name: string
        value: string
    }[],
    actionId = 'select' as string,
    placeholder = 'Select' as string
): TBlockElement => {
    const options = _options.map((option: { name: string; value: string }) => {
        return buildSimpleSlackOption({
            text: option.name,
            value: option.value
        })
    })
    return {
        type: 'static_select',
        placeholder: {
            type: 'plain_text',
            text: placeholder
        },
        action_id: actionId,
        options
    }
}

export default buildSimpleSlackSelection
