const retrieveSettings = async (body: any) => {
    // let environmentFound = false
    // let selectedEnvironment = 'goerli'
    // let selectedContract = 'InvestorDAO'
    // try {
    //     if (
    //         body.state.values.actions1 !== undefined &&
    //         body.state.values.actions1.select_env !== undefined &&
    //         body.state.values.actions1.select_contract !== undefined
    //     ) {
    //         if (
    //             body.state.values.actions1.select_env.selected_option !== undefined &&
    //             body.state.values.actions1.select_env.selected_option.value !== undefined
    //         )
    //             selectedEnvironment = body.state.values.actions1.select_env.selected_option.value
    //         if (
    //             body.state.values.actions1.select_contract.selected_option !== undefined &&
    //             body.state.values.actions1.select_contract.selected_option.value !== undefined
    //         )
    //             selectedContract = body.state.values.actions1.select_contract.selected_option.value
    //         environmentFound = true
    //     }
    // } catch (error) {
    //     null
    // }
    // try {
    //     if (
    //         !environmentFound &&
    //         body.actions[0].value &&
    //         body.actions[0].selectedEnvironment !== undefined &&
    //         body.actions[0].selectedContract !== undefined
    //     ) {
    //         selectedEnvironment = body.actions[0].selectedEnvironment
    //         selectedContract = body.actions[0].selectedContract
    //     }
    // } catch (error) {
    //     null
    // }
    // return { selectedEnvironment, selectedContract }
    return null
}

export default retrieveSettings
