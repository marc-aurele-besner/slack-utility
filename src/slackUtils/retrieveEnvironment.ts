const retrieveEnvironment = async (
    body: any,
    defaultNetwork = 'goerli' as string,
    defaultContract = 'USDC' as string
) => {
    let environmentFound = false
    let selectedEnvironment = defaultNetwork
    let selectedContract = defaultContract
    try {
        if (
            body.state.values.actions1 !== undefined &&
            body.state.values.actions1.select_env !== undefined &&
            body.state.values.actions1.select_contract !== undefined
        ) {
            if (
                body.state.values.actions1.select_env.selected_option !== undefined &&
                body.state.values.actions1.select_env.selected_option.value !== undefined
            )
                selectedEnvironment = body.state.values.actions1.select_env.selected_option.value
            if (
                body.state.values.actions1.select_contract.selected_option !== undefined &&
                body.state.values.actions1.select_contract.selected_option.value !== undefined
            )
                selectedContract = body.state.values.actions1.select_contract.selected_option.value
            environmentFound = true
        }
    } catch (error) {}
    try {
        if (
            !environmentFound &&
            body.actions[0].value &&
            body.actions[0].selectedEnvironment !== undefined &&
            body.actions[0].selectedContract !== undefined
        ) {
            selectedEnvironment = body.actions[0].selectedEnvironment
            selectedContract = body.actions[0].selectedContract
            environmentFound = true
        }
    } catch (error) {}
    try {
        if (!environmentFound && body.actions[0].value) {
            try {
                const parsedValue = JSON.parse(body.actions[0].value)
                selectedEnvironment = parsedValue.selectedEnvironment
                selectedContract = parsedValue.selectedContract
                environmentFound = true
            } catch (error) {}
        }
    } catch (error) {}
    return { environmentFound, selectedEnvironment, selectedContract }
}

export default retrieveEnvironment
