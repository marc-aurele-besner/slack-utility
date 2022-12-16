import slackBuilder from '../slackBuilder'
import retrieveEnvironment from '../slackUtils/retrieveEnvironment'
import setupContractNetworkAndSigner from '../slackUtils/setupContractNetworkAndSigner'
import { TBlockElements, TBlocks, TReturnValue } from '../types'
import { buildRawSignatureFromFunction } from '../utils'

const action = async (
    actionObject: any,
    parsedBody: any,
    messageBlocks: TBlocks,
    buttons: TBlockElements,
    returnValue: TReturnValue
) => {
    console.log('query_contract_readCall')
    try {
        const { environmentFound, selectedEnvironment, selectedContract } = await retrieveEnvironment(parsedBody)
        if (environmentFound) {
            const { chainId, chainName, chainEmoji, contractAbi, contractAddress, contractInstance } =
                await setupContractNetworkAndSigner(
                    actionObject.env,
                    actionObject.abis,
                    selectedEnvironment,
                    selectedContract
                )
            if (contractInstance !== undefined) {
                messageBlocks.push(
                    slackBuilder.buildSimpleSlackHeaderMsg(
                        `${selectedContract} Info - ${chainEmoji} ${
                            chainName.charAt(0).toUpperCase() + chainName.slice(1)
                        }`
                    )
                )
                // eslint-disable-next-line
                const contractFunctionsRead = contractAbi.filter(
                    (abi: any) =>
                        abi.type === 'function' &&
                        abi.inputs.length > 0 &&
                        (abi.stateMutability === 'view' || abi.stateMutability === 'pure')
                )
                if (contractFunctionsRead.length === 0)
                    messageBlocks.push(slackBuilder.buildSimpleSectionMsg('No read calls', ''))
                else {
                    messageBlocks.push(slackBuilder.buildSimpleSectionMsg('Select a read calls', ''))
                    buttons.push(
                        slackBuilder.buildLinkSlackButton(
                            '-> DAPP',
                            undefined,
                            'buttonGo2Dapp',
                            'primary',
                            actionObject.dappUrl + 'contract/' + selectedContract + '/readCall'
                        )
                    )
                }
                const { functionsPadding } = JSON.parse(actionObject.value)

                const functionStart = functionsPadding > 0 ? functionsPadding : 0
                const functionEnd = functionsPadding > 0 ? functionsPadding + 12 : 12
                for (let i = functionStart; i < functionEnd; i++) {
                    if (contractFunctionsRead[i] !== undefined)
                        buttons.push(
                            slackBuilder.buildSimpleSlackButton(
                                buildRawSignatureFromFunction(contractFunctionsRead[i]).substring(0, 70),
                                {
                                    selectedEnvironment,
                                    selectedContract,
                                    chainId,
                                    chainName,
                                    contractAddress,
                                    contractName: selectedContract,
                                    functionSignature: buildRawSignatureFromFunction(contractFunctionsRead[i]),
                                    functionCount: i
                                },
                                'build_call_from_abi:' + buildRawSignatureFromFunction(contractFunctionsRead[i])
                            )
                        )
                }
                if (contractFunctionsRead.length > functionEnd)
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
            } else messageBlocks.push(slackBuilder.buildSimpleSectionMsg('No contract found', ''))
        } else messageBlocks.push(slackBuilder.buildSimpleSectionMsg('No environment found', ''))
    } catch (error) {
        console.log('error', error)
        messageBlocks.push(slackBuilder.buildSimpleSlackHeaderMsg(`:x: Error: ${error}`))
    }
    return [actionObject, returnValue, messageBlocks, buttons]
}

export default action
