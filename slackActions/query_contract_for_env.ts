import { utils } from 'ethers'

import { slackBuilder } from '../slackBuilder'
  
const action = async (action, parsedBody, messageBlocks, buttons, returnValue) => {
  console.log('query_contract_for_env', action.selectedContract)
  let contractInstance
  try {
    contractInstance = action.contractInstance
  } catch (error) {
    console.log('error', error)
  }
  
  try {
    messageBlocks.push(slackBuilder.buildSimpleSlackHeaderMsg(`${action.name} Info - ${action.chainEmoji} ${action.chainName.charAt(0).toUpperCase() + action.chainName.slice(1)}`))
  } catch (error) {
    messageBlocks.push(slackBuilder.buildSimpleSlackHeaderMsg(`${action.name} Info - ${action.chainEmoji}`))
  }

  if (contractInstance == undefined)
    messageBlocks.push(slackBuilder.buildSimpleSectionMsg('', `Contract instance not found`))
  else
    messageBlocks.push(slackBuilder.buildSimpleSectionMsg('', `Contract instance found for ${action.selectedContract}`))

  buttons.push(slackBuilder.buildEtherscanLinkSlackButton(action.chainName, action.contractAddress))

  // console.log('messageBlocks', messageBlocks.toString())
  buttons.push(
    slackBuilder.buildSimpleSlackButton(
      'All calls',
      JSON.stringify({
        selectedEnvironment: action.value.selectedEnvironment,
        selectedContract: action.value.selectedContract,
        chainId: action.chainId,
        chainName: action.chainName,
      }),
      'query_contract_calls',
      'primary'
    )
  )

  return [action, returnValue, messageBlocks, buttons]
}

export default action