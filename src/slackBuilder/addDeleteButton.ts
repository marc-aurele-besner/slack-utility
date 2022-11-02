import { TBlockElement, TBlockElements } from '../types'

import buildSimpleSlackButton from './buildSimpleSlackButton'

const addDeleteButton = (elements: TBlockElements | undefined, ts: string): TBlockElements => {
    if (elements === undefined) elements = []
    const deleteIsPresent = elements.find((element: TBlockElement) => element.action_id === 'delete_msg')
    if (!deleteIsPresent || deleteIsPresent === undefined)
        elements.push(buildSimpleSlackButton('Delete', ts, 'delete_msg', 'danger'))
    return elements
}

export default addDeleteButton
