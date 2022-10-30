import { buildSimpleSlackOption } from './buildSimpleSlackOptions'

const buildSlackContractSelection = (contracts: any[]) => {
    const options = contracts
        .filter((contract: any) => contract.active === true)
        .map((contract: any) => {
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
