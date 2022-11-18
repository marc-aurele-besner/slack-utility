import slackBuilder from '../slackBuilder'
import retrieveEnvironment from '../slackUtils/retrieveEnvironment'
import setupContractNetworkAndSigner from '../slackUtils/setupContractNetworkAndSigner'
import slackOpenView from '../slackUtils/slackOpenView'
import { TBlockElements, TBlocks, TReturnValue } from '../types'

const action = async (
    actionObject: any,
    parsedBody: any,
    messageBlocks: TBlocks,
    buttons: TBlockElements,
    returnValue: TReturnValue
) => {
    console.log('build_call_from_abi')
    try {
        messageBlocks.push(slackBuilder.buildSimpleSlackHeaderMsg(`:mag: Building call from ABI...`))

        const { environmentFound, selectedEnvironment, selectedContract } = await retrieveEnvironment(parsedBody)
        if (environmentFound) {
            const inputArguments = [{ type: 'divider' }]
            const { chainId, chainName, contractAddress, contractInstance, contractAbi } =
                await setupContractNetworkAndSigner(
                    actionObject.env,
                    actionObject.abis,
                    selectedEnvironment,
                    selectedContract
                )
            if (contractInstance !== undefined) {
                const functionName = JSON.parse(actionObject.value).functionSignature.split('(')[0]
                let functionArgumentsCount: number = 0
                if (
                    JSON.parse(actionObject.value).functionSignature.includes('(') &&
                    JSON.parse(actionObject.value).functionSignature.includes(',')
                )
                    functionArgumentsCount =
                        JSON.parse(actionObject.value).functionSignature.split('(')[1].split(',').length + 1
                else if (JSON.parse(actionObject.value).functionSignature.split('(')[1] !== ')')
                    functionArgumentsCount = 1
                const abiFunctions = contractAbi.filter(
                    (abi: any) => abi.type === 'function' && abi.name === functionName
                    // Improve to include overloaded functions
                )
                const abiFunctionsStateMutability = abiFunctions[0].stateMutability
                if (
                    (abiFunctionsStateMutability === 'view' || abiFunctionsStateMutability === 'pure') &&
                    functionArgumentsCount === 0
                ) {
                    const callValue = await contractInstance[functionName]()
                    inputArguments.push(
                        slackBuilder.buildSimpleSectionMsg(functionName, `: ${JSON.stringify(callValue)}`)
                    )
                }

                if (abiFunctions !== undefined) {
                    if (abiFunctions.length > 1) {
                        abiFunctions.forEach((abiFunction: any) => {
                            if (abiFunction.inputs.length > 0)
                                inputArguments.push(
                                    slackBuilder.buildSimpleSectionMsg(
                                        '',
                                        'Fill the different arguments of the function'
                                    )
                                )
                            if (abiFunction.inputs.length > 0) {
                                abiFunction.inputs
                                    .filter(
                                        (functionInput: any) =>
                                            functionInput !== undefined && functionInput === functionArgumentsCount
                                    )
                                    .forEach((input: any) => {
                                        inputArguments.push(
                                            slackBuilder.buildSlackInput(
                                                input.name,
                                                input.name,
                                                slackBuilder.buildSlackPlainTextInput(
                                                    input.name + ' (' + input.type + ')',
                                                    input.name
                                                )
                                            )
                                        )
                                    })
                            }
                        })
                    } else {
                        abiFunctions.forEach((abiFunction: any) => {
                            if (abiFunction.inputs.length > 0)
                                inputArguments.push(
                                    slackBuilder.buildSimpleSectionMsg(
                                        '',
                                        'Fill the different arguments of the function'
                                    )
                                )
                            if (abiFunction.inputs.length > 0) {
                                abiFunction.inputs.forEach((input: any) => {
                                    inputArguments.push(
                                        slackBuilder.buildSlackInput(
                                            input.name,
                                            input.name,
                                            slackBuilder.buildSlackPlainTextInput(
                                                input.name + ' (' + input.type + ')',
                                                input.name
                                            )
                                        )
                                    )
                                })
                            }
                        })
                    }
                    await slackOpenView(
                        actionObject.slackToken,
                        slackBuilder.buildSlackModal(
                            'Call ' + functionName,
                            'send_call_from_abi',
                            inputArguments,
                            'Static Call',
                            'Close',
                            {
                                selectedEnvironment,
                                selectedContract,
                                chainId,
                                chainName,
                                contractAddress,
                                channel_id: parsedBody.channel.id,
                                functionName,
                                functionSignature: JSON.parse(actionObject.value).functionSignature,
                                abiFunctions
                            }
                        ),
                        parsedBody.trigger_id
                    )
                } else
                    messageBlocks.push(
                        slackBuilder.buildSimpleSlackHeaderMsg(
                            `:x: Error: No function found with the name ${functionName}`
                        )
                    )
            } else messageBlocks.push(slackBuilder.buildSimpleSlackHeaderMsg(`:x: Contract not found`))
        } else messageBlocks.push(slackBuilder.buildSimpleSlackHeaderMsg(`:x: Environment not found`))
    } catch (error) {
        console.log('error', error)
        messageBlocks.push(slackBuilder.buildSimpleSlackHeaderMsg(`:x: Error: ${error}`))
    }

    return [action, returnValue, messageBlocks, buttons]
}

export default action
