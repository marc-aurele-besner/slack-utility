import slackBuilder from '../slackBuilder'
import { TBlockElements, TBlocks, TReturnValue } from '../types'

const action = async (
    actionObject: any,
    parsedBody: any,
    messageBlocks: TBlocks,
    buttons: TBlockElements,
    returnValue: TReturnValue
) => {
    console.log('query_contract_calls')
    const allFunctions = Object.keys(actionObject.contractInstance.callStatic).slice(
        0,
        Object.keys(actionObject.contractInstance.callStatic).length / 2
    )
    console.log('allFunctions', allFunctions)
    console.log('actionObject.value.', actionObject.value)
    const { functionsPadding } = JSON.parse(actionObject.value)
    console.log('functionsPadding', actionObject)

    const functionStart = functionsPadding > 0 ? functionsPadding : 0
    const functionEnd = functionsPadding > 0 ? functionsPadding + 16 : 16
    for (let i = functionStart; i < functionEnd; i++) {
        buttons.push(
            slackBuilder.buildLinkSlackButton(
                allFunctions[i],
                JSON.stringify({
                    selectedEnvironment: actionObject.value.selectedEnvironment,
                    selectedContract: actionObject.value.selectedContract,
                    chainId: actionObject.chainId,
                    chainName: actionObject.chainName,
                    contractAddress: actionObject.contractAddress,
                    contractName: actionObject.value.selectedContract,
                    functionSignature: allFunctions[i]
                }),
                'buildFromAbi-' + allFunctions[i]
            )
        )
    }

    if (allFunctions.length > functionEnd)
        buttons.push(
            slackBuilder.buildLinkSlackButton(
                'Show more',
                JSON.stringify({
                    selectedEnvironment: actionObject.value.selectedEnvironment,
                    selectedContract: actionObject.value.selectedContract,
                    chainId: actionObject.chainId,
                    chainName: actionObject.chainName,
                    contractAddress: actionObject.contractAddress,
                    contractName: actionObject.value.selectedContract,
                    functionsPadding: (functionsPadding || 0) + 15
                }),
                'query_contract_for_env-more'
            )
        )
    messageBlocks.push(slackBuilder.buildSimpleSectionMsg('Select a function to call', ''))
    return [actionObject, returnValue, messageBlocks, buttons]
}

export default action
