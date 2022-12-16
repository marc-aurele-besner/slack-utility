const retrieveEvent = (body: any) => {
    try {
        if (
            body !== undefined &&
            body.state !== undefined &&
            body.state.values !== undefined &&
            body.state.values.actions1 !== undefined &&
            body.state.values.actions1.select_event !== undefined &&
            body.state.values.actions1.select_event.selected_option !== undefined &&
            body.state.values.actions1.select_event.selected_option !== null &&
            body.state.values.actions1.select_event.selected_option.value !== undefined &&
            body.state.values.actions1.select_event.selected_option.value !== null &&
            typeof body.state.values.actions1.select_event.selected_option.value === 'string'
        )
            return body.state.values.actions1.select_event.selected_option.value
        return null
    } catch (error) {
        return null
    }
}

export default retrieveEvent
