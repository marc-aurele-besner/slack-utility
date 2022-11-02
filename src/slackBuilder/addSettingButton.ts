import { TBlockElement, TBlockElements } from '../types'

import buildSimpleSlackButton from './buildSimpleSlackButton'

const addSettingButton = (elements: TBlockElements, ts: string): TBlockElements => {
    if (elements === undefined) elements = []
    const settingIsPresent = elements.find((element: TBlockElement) => element.action_id === 'settings')
    if (!settingIsPresent || settingIsPresent === undefined)
        elements.push(
            buildSimpleSlackButton(':gear:', JSON.stringify({ action: 'settings', ts }), 'settings', 'primary')
        )
    return elements
}

export default addSettingButton
