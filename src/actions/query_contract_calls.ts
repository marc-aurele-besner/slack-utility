import slackBuilder from '../slackBuilder'
import retrieveEnvironment from '../slackUtils/retrieveEnvironment'
import setupContractNetworkAndSigner from '../slackUtils/setupContractNetworkAndSigner'
import { TBlockElements, TBlocks, TReturnValue } from '../types'

const action = async (
    actionObject: any,
    parsedBody: any,
    messageBlocks: TBlocks,
    buttons: TBlockElements,
    returnValue: TReturnValue
) => {
    console.log('query_contract_calls')
    try {
        const { environmentFound, selectedEnvironment, selectedContract } = await retrieveEnvironment(parsedBody)
        if (environmentFound) {
            const { chainId, chainName, contractAddress, contractInstance } = await setupContractNetworkAndSigner(
                actionObject.env,
                actionObject.abis,
                selectedEnvironment,
                selectedContract
            )
            if (contractInstance !== undefined) {
                const allFunctions = Object.keys(contractInstance.callStatic).slice(
                    0,
                    Object.keys(contractInstance.callStatic).length / 2
                )
                const { functionsPadding } = JSON.parse(actionObject.value)

                const functionStart = functionsPadding > 0 ? functionsPadding : 0
                const functionEnd = functionsPadding > 0 ? functionsPadding + 16 : 16
                for (let i = functionStart; i < functionEnd; i++) {
                    buttons.push(
                        slackBuilder.buildSimpleSlackButton(
                            allFunctions[i],
                            {
                                selectedEnvironment,
                                selectedContract,
                                chainId,
                                chainName,
                                contractAddress,
                                contractName: selectedContract,
                                functionSignature: allFunctions[i],
                                functionCount: i
                            },
                            'build_call_from_abi:' + allFunctions[i]
                        )
                    )
                }

                if (allFunctions.length > functionEnd)
                    buttons.push(
                        slackBuilder.buildSimpleSlackButton(
                            'Show more',
                            {
                                selectedEnvironment,
                                selectedContract,
                                chainId,
                                chainName,
                                contractAddress,
                                contractName: selectedContract,
                                functionsPadding: (functionsPadding || 0) + 15
                            },
                            'query_contract_calls:more'
                        )
                    )
                messageBlocks.push(slackBuilder.buildSimpleSectionMsg('Select a function to call', ''))
            } else messageBlocks.push(slackBuilder.buildSimpleSectionMsg('No contract found', ''))
        } else messageBlocks.push(slackBuilder.buildSimpleSectionMsg('No environment found', ''))
    } catch (error) {
        console.log('error', error)
        messageBlocks.push(slackBuilder.buildSimpleSlackHeaderMsg(`:x: Error: ${error}`))
    }
    return [actionObject, returnValue, messageBlocks, buttons]
}

export default action
