import { TBlockElement, TBlockElements } from '../types'

import buildSimpleSlackButton from './buildSimpleSlackButton'

const addRefreshButton = (elements: TBlockElements, ts: string): TBlockElements => {
    if (elements === undefined) elements = []
    const refreshIsPresent = elements.find((element: TBlockElement) => element.action_id === 'refresh')
    if (!refreshIsPresent || refreshIsPresent === undefined)
        elements.push(
            buildSimpleSlackButton(':repeat:', JSON.stringify({ action: 'refresh', ts }), 'refresh', undefined)
        )
    return elements
}

export default addRefreshButton
