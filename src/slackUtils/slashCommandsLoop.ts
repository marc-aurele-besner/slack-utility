const slashCommandsLoop = async (parsedBody: any) => {
    if (parsedBody.command !== undefined) {
        // Associate a slash command with an action
        switch (parsedBody.command) {
            case '/hello':
                parsedBody.actions = [{ action_id: 'commandsList' }]
                break
            case '/ctc-recap':
                parsedBody.actions = [
                    {
                        action_id: 'query_contract_for_env',
                        selectedEnvironment: 'ethereum-prod',
                        selectedContract: 'CTC'
                    }
                ]
                break
            case '/gtd-recap':
                parsedBody.actions = [
                    {
                        action_id: 'query_contract_for_env',
                        selectedEnvironment: 'ethereum-prod',
                        selectedContract: 'GTD'
                    }
                ]
                break
            case '/gate-recap':
                parsedBody.actions = [
                    {
                        action_id: 'query_contract_for_env',
                        selectedEnvironment: 'ethereum-prod',
                        selectedContract: 'GATE'
                    }
                ]
                break
            case '/investordao-recap':
                parsedBody.actions = [
                    {
                        action_id: 'query_contract_for_env',
                        selectedEnvironment: 'goerli',
                        selectedContract: 'InvestorDAO'
                    }
                ]
                break
            case '/invest-recap':
                parsedBody.actions = [
                    { action_id: 'query_contract_for_env', selectedEnvironment: 'goerli', selectedContract: 'INVEST' }
                ]
                break
            case '/settings':
                parsedBody.actions = [{ action_id: 'settings' }]
                break
            default:
                break
        }
    }
    return parsedBody
}

export default slashCommandsLoop
