import { TBlockAction, TBlockElements } from '../types'

import buildSimpleSlackButton from './buildSimpleSlackButton'
import buildSlackContractAndModuleSelection from './buildSlackContractAndModuleSelection'
import buildSlackContractSelection from './buildSlackContractSelection'
import buildSlackNetworkSelection from './buildSlackNetworkSelection'

const buildSlackActionMsg = (
    env = {} as any,
    blockId = 'actions1' as string,
    elements = [] as TBlockElements,
    addNetworkAndContractSelector = true as boolean,
    addExplorerModule = false as boolean,
    addAddressBookModule = false as boolean
): TBlockAction => {
    if (addNetworkAndContractSelector) {
        if (env.networks) elements.push(buildSlackNetworkSelection(env.networks))
        if (addExplorerModule || addAddressBookModule)
            elements.push(buildSlackContractAndModuleSelection(env.contracts, addExplorerModule, addAddressBookModule))
        else if (env.contracts) elements.push(buildSlackContractSelection(env.contracts))
        if (env.networks || env.contracts)
            elements.push(buildSimpleSlackButton('Search', 'search', 'query_contract_for_env'))
    }
    return {
        type: 'actions',
        block_id: blockId,
        elements
    }
}

export default buildSlackActionMsg
