import { TBlockElement } from '../types'

const buildSlackDateTimePicker = (actionId = 'date_time_input' as string): TBlockElement => {
    return {
        type: 'datetimepicker',
        action_id: actionId,
        initial_date_time: new Date()
    }
}

export default buildSlackDateTimePicker
