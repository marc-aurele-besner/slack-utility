import { TBlockElements } from '../types'

import buildSimpleSlackButton from './buildSimpleSlackButton'

const addDeleteButton = (elements: TBlockElements, ts: string): TBlockElements => {
    const deleteIsPresent = elements.find((element: any) => element.action_id === 'delete_msg')
    if (!deleteIsPresent) elements.push(buildSimpleSlackButton('Delete', ts, 'delete_msg', 'danger'))
    return elements
}

export default addDeleteButton
