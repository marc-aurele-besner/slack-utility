import { TBlockElement, TContract, TContracts } from '../types'

import { buildSimpleSlackOption } from './buildSimpleSlackOptions'

const buildSlackContractSelection = (contracts: TContracts): TBlockElement => {
    const options = contracts
        .filter((contract: TContract) => contract.active === true)
        .map((contract: TContract) => {
            return buildSimpleSlackOption({
                text: contract.emoji + ' ' + contract.name,
                value: contract.name
            })
        })

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

export default buildSlackContractSelection
