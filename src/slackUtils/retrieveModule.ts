const retrieveModule = (body: any) => {
    try {
        if (
            body !== undefined &&
            body.state !== undefined &&
            body.state.values !== undefined &&
            body.state.values.actions1 !== undefined &&
            body.state.values.actions1.select_env !== undefined &&
            body.state.values.actions1.select_contract !== undefined &&
            body.state.values.actions1.select_contract.selected_option !== undefined &&
            body.state.values.actions1.select_contract.selected_option !== null &&
            body.state.values.actions1.select_contract.selected_option.value !== undefined &&
            body.state.values.actions1.select_contract.selected_option.value !== null &&
            typeof body.state.values.actions1.select_contract.selected_option.value === 'string' &&
            body.state.values.actions1.select_contract.selected_option.value.includes('module:')
        )
            return body.state.values.actions1.select_contract.selected_option.value.split(':')[1]
        return null
    } catch (error) {
        return null
    }
}

export default retrieveModule
