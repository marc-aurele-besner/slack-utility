import buildSimpleSlackButton from './buildSimpleSlackButton'
import buildSlackNetworkSelection from './buildSlackNetworkSelection'
import buildSlackContractSelection from './buildSlackContractSelection'

const buildSlackActionMsg = (env: any, block_id = 'actions1', addElements: any[] = [], addRegular = true) => {
  const elements = addElements
  if (addRegular)
    elements.push(
      buildSlackNetworkSelection(env.networks),
      buildSlackContractSelection(env.contracts),
      buildSimpleSlackButton('Search', 'search', 'query_contract_for_env')
  )
  return {
    type: 'actions',
    block_id,
    elements
  }
}

export default buildSlackActionMsg
