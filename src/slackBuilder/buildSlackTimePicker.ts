import { TBlockElement } from '../types'

const buildSlackTimePicker = (
    tip = 'Select a date' as string,
    actionId = 'date_input' as string,
    initialTime = (
        ('0' + new Date().getUTCHours()).substr(-2) +
        ':' +
        ('0' + new Date().getUTCMinutes()).substr(-2)
    ).toString() as string
): TBlockElement => {
    return {
        type: 'timepicker',
        action_id: actionId,
        initial_time: initialTime,
        placeholder: {
            type: 'plain_text',
            text: tip
        }
    }
}

export default buildSlackTimePicker
