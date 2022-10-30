import { slackBuilder } from '../slackBuilder'
  
const action = async (action, parsedBody, messageBlocks, buttons, returnValue) => {
  messageBlocks.push(
      slackBuilder.buildSlackInput(
        "Enter account address",
        "inputAddress",
        slackBuilder.buildSlackPlainTextInput(action.owner.address, "address")
      ),
      slackBuilder.buildSlackInput(
        "Enter spender address",
        "inputSpender",
        slackBuilder.buildSlackPlainTextInput("spender", "spender")
      )
    )
    messageBlocks.push(
      slackBuilder.buildSlackActionMsg(undefined, [
        slackBuilder.buildLinkSlackButton(
          'allowance',
          JSON.stringify({
            selectedEnvironment: action.value.selectedEnvironment,
            selectedContract: action.value.selectedContract,
            chainId: action.chainId,
            chainName: action.chainName,
            contractAddress: action.contractAddress,
            contractName: action.value.selectedContract
          }),
          'get_erc20_allowance'
        ),
        slackBuilder.buildEtherscanLinkSlackButton(action.chainName, action.contractAddress)])
    )
  return [action, returnValue, messageBlocks, buttons]
}

export default action