import { buildSimpleSlackOption } from './buildSimpleSlackOptions'

const buildSlackContractSelection = (contracts) => {
  const options = contracts.filter((contract) => contract.active === true).map((contract) => {
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
    options: options
  }
}

export default buildSlackContractSelection
