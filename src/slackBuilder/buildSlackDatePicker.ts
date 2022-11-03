import { TBlockElement } from '../types'

const buildSlackDatePicker = (
    tip = 'Select a date' as string,
    actionId = 'date_input' as string,
    initialDate = new Date().toISOString().split('T')[0] as Date | string
): TBlockElement => {
    return {
        type: 'datepicker',
        action_id: actionId,
        initial_date: initialDate,
        placeholder: {
            type: 'plain_text',
            text: tip
        }
    }
}

export default buildSlackDatePicker
