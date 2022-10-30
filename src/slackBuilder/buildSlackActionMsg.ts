import buildSimpleSlackButton from './buildSimpleSlackButton'
import buildSlackContractSelection from './buildSlackContractSelection'
import buildSlackNetworkSelection from './buildSlackNetworkSelection'

const buildSlackActionMsg = (env: any, blockId = 'actions1' as string, addElements: any[] = [], addRegular = true) => {
    const elements = addElements
    if (addRegular)
        elements.push(
            buildSlackNetworkSelection(env.networks),
            buildSlackContractSelection(env.contracts),
            buildSimpleSlackButton('Search', 'search', 'query_contract_for_env')
        )
    return {
        type: 'actions',
        block_id: blockId,
        elements
    }
}

export default buildSlackActionMsg
