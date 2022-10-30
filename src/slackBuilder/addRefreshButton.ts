import { TBlockElements } from '../types'

import buildSimpleSlackButton from './buildSimpleSlackButton'

const addRefreshButton = (elements: TBlockElements, ts: string): TBlockElements => {
    const refreshIsPresent = elements.find((element: any) => element.action_id === 'refresh')
    if (!refreshIsPresent)
        elements.push(
            buildSimpleSlackButton(':repeat:', JSON.stringify({ action: 'refresh', ts }), 'refresh', undefined)
        )
    return elements
}

export default addRefreshButton
