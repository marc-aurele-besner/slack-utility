import { TBlockElements } from '../types'

import buildSimpleSlackButton from './buildSimpleSlackButton'

const addSettingButton = (elements: TBlockElements, ts: string): TBlockElements => {
    const settingIsPresent = elements.find((element: any) => element.action_id === 'settings')
    if (!settingIsPresent)
        elements.push(
            buildSimpleSlackButton(':gear:', JSON.stringify({ action: 'settings', ts }), 'settings', 'primary')
        )
    return elements
}

export default addSettingButton
