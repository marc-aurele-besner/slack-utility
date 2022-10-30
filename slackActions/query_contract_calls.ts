// import { formatBalanceState } from '../../../Fixed-Term-Interest-Account/utils/formatBalanceResult'
import { slackBuilder } from '../slackBuilder'
  
const action = async (action, parsedBody, messageBlocks, buttons, returnValue) => {
  console.log('query_contract_calls')
  const allFunctions = Object.keys(action.contractInstance.callStatic).slice(0, Object.keys(action.contractInstance.callStatic).length / 2)
  console.log('allFunctions', allFunctions)
  console.log('action.value.', action.value)
  const { functionsPadding } = JSON.parse(action.value)
  console.log('functionsPadding', functionsPadding)

  const functionStart = functionsPadding > 0 ? functionsPadding : 0
  const functionEnd = functionsPadding > 0 ? functionsPadding + 16 : 16
  for (let i = functionStart; i < functionEnd; i++) {
    buttons.push(
      slackBuilder.buildLinkSlackButton(
        allFunctions[i],
        JSON.stringify({
          selectedEnvironment: action.value.selectedEnvironment,
          selectedContract: action.value.selectedContract,
          chainId: action.chainId,
          chainName: action.chainName,
          contractAddress: action.contractAddress,
          contractName: action.value.selectedContract,
          functionSignature: allFunctions[i]
        }),
        'buildFromAbi-' + allFunctions[i]
      )
    )
  }

  if (allFunctions.length > functionEnd)
    buttons.push(slackBuilder.buildLinkSlackButton(
      'Show more',
      JSON.stringify({
        selectedEnvironment: action.value.selectedEnvironment,
        selectedContract: action.value.selectedContract,
        chainId: action.chainId,
        chainName: action.chainName,
        contractAddress: action.contractAddress,
        contractName: action.value.selectedContract,
        functionsPadding: (functionsPadding || 0) + 15
      }),
      'query_contract_for_env-more'
    ))
  messageBlocks.push(slackBuilder.buildSimpleSectionMsg('Select a function to call', ''))
  return [action, returnValue, messageBlocks, buttons]
}

export default action