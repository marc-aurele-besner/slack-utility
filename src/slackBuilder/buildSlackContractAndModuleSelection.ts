import { TBlockElement, TContract, TContracts } from '../types'

import { buildSimpleSlackOption } from './buildSimpleSlackOptions'

const buildSlackContractAndModuleSelection = (
    contracts: TContracts,
    addExplorerModule = false as boolean,
    addAddressBookModule = false as boolean
): TBlockElement => {
    const options = contracts
        .filter((contract: TContract) => contract.active === true)
        .map((contract: TContract) => {
            return buildSimpleSlackOption({
                text: contract.emoji + ' ' + contract.name,
                value: contract.name
            })
        })
    if (addExplorerModule)
        options.push(
            buildSimpleSlackOption({
                text: ':mag: Explorer',
                value: 'module:explorer'
            })
        )
    if (addAddressBookModule)
        options.push(
            buildSimpleSlackOption({
                text: ':notebook: Address Book',
                value: 'module:addressBook'
            })
        )

    return {
        type: 'static_select',
        placeholder: {
            type: 'plain_text',
            text: 'Contract to query?'
        },
        action_id: 'select_contract',
        options
    }
}

export default buildSlackContractAndModuleSelection
