const buildSlackDateTimePicker = (
  action_id = 'date_time_input'
) => {
  return {
    type: 'datetimepicker',
    action_id,
    initial_date_time: new Date()
  }
}

export default buildSlackDateTimePicker
