import slackBuilder from '../slackBuilder'
import { TBlockElements, TBlocks, TReturnValue } from '../types'

const action = async (
    actionObject: any,
    parsedBody: any,
    messageBlocks: TBlocks,
    buttons: TBlockElements,
    returnValue: TReturnValue
) => {
    messageBlocks.push(
        slackBuilder.buildSlackInput(
            'Enter account address',
            'inputAddress',
            slackBuilder.buildSlackPlainTextInput(actionObject.owner.address, 'address')
        ),
        slackBuilder.buildSlackInput(
            'Enter spender address',
            'inputSpender',
            slackBuilder.buildSlackPlainTextInput('spender', 'spender')
        )
    )
    messageBlocks.push(
        slackBuilder.buildSlackActionMsg(actionObject.env, undefined, [
            slackBuilder.buildSimpleSlackButton(
                'allowance',
                {
                    selectedEnvironment: actionObject.value.selectedEnvironment,
                    selectedContract: actionObject.value.selectedContract,
                    chainId: actionObject.chainId,
                    chainName: actionObject.chainName,
                    contractAddress: actionObject.contractAddress,
                    contractName: actionObject.value.selectedContract
                },
                'get_erc20_allowance'
            )
            // slackBuilder.buildEtherscanLinkSlackButton(actionObject.chainName, actionObject.contractAddress)
        ])
    )
    return [action, returnValue, messageBlocks, buttons]
}

export default action
