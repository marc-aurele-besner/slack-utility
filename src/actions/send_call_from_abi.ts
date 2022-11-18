import { nanoid } from 'nanoid'

import slackBuilder from '../slackBuilder'
import slackUtils from '../slackUtils'
import retrieveEnvironment from '../slackUtils/retrieveEnvironment'
import { TBlockElements, TBlocks, TReturnValue } from '../types'

const action = async (
    actionObject: any,
    parsedBody: any,
    messageBlocks: TBlocks,
    buttons: TBlockElements,
    returnValue: TReturnValue
) => {
    console.log('send_call_from_abi')
    try {
        messageBlocks.push(slackBuilder.buildSimpleSlackHeaderMsg(`:mag: Sending call from ABI...`))

        if (parsedBody.view !== undefined && parsedBody.view.private_metadata !== undefined) {
            actionObject.closeView = true
        }

        const { environmentFound, selectedEnvironment, selectedContract } = await retrieveEnvironment(parsedBody)
        if (environmentFound) {
            const { chainId, chainName, chainEmoji, contractAddress, signingType, contractInstance, contractName } =
                await slackUtils.setupContractNetworkAndSigner(
                    actionObject.env,
                    actionObject.abis,
                    selectedEnvironment,
                    selectedContract
                )

            if (contractInstance === undefined) {
                messageBlocks.push(slackBuilder.buildSimpleSectionMsg('', `:x: Error: Contract instance not found`))
                return [action, returnValue, messageBlocks, buttons]
            }

            messageBlocks.push(
                slackBuilder.buildSimpleSlackHeaderMsg(
                    `:hourglass_flowing_sand: Calling contract... - ${chainEmoji} ${
                        chainName.charAt(0).toUpperCase() + chainName.slice(1)
                    }`
                )
            )

            const wait = await slackUtils.slackPostWaitMessage(
                actionObject,
                {
                    ...parsedBody,
                    container: {
                        channel_id: JSON.parse(parsedBody.view.private_metadata).channel_id
                    }
                },
                'Please wait while we call the contract...',
                messageBlocks,
                returnValue
            )
            if (wait.action.waitMessageTs !== undefined) {
                actionObject = wait.action
                messageBlocks = wait.blocks
            }
            // let tx: any
            if (signingType === 'web3') {
                const txId = nanoid()
                // tx = await fauna.createFaunaDocument(action.faunaDbToken, 'transactions', {
                //   txId,
                //   txStatus: 'pending-signing',
                //   slackUserId: parsedBody.user.id,
                //   slackChannelId: parsedBody.channel.id,
                //   slackTeamId: parsedBody.team.id,
                //   selectedEnvironment: selectedEnvironment,
                //   selectedContract: selectedContract,
                //   chainId: chainId.toString(),
                //   chainIdAndTxId: `${chainId}_${txId}`,
                //   chainName: chainName,
                //   contractName: contractName,
                //   contractAddress: contractAddress,
                //   method: 'createPool',
                //   params: [
                //     valueParsed.poolInfo.interestRate.toString(),
                //     valueParsed.poolInfo.tenor.toString(),
                //     valueParsed.poolInfo.openingDate.toString(),
                //     valueParsed.poolInfo.closingDate.toString(),
                //     valueParsed.poolInfo.startingDate.toString(),
                //     valueParsed.poolInfo.minimumRaise.toString(),
                //     valueParsed.poolInfo.maximumRaise.toString()
                //   ],
                //   value: "0x00",
                //   gasLimit: utils.hexlify(5000000)
                // })
                // if (tx !== undefined) {
                //   messageBlocks.push(slackBuilder.buildSimpleSlackHeaderMsg(`:fox_face: Sign the transaction with your wallet at http://smc344.netlify.app/tx/${chainId}_${txId}`))
                //   buttons.push(slackBuilder.buildLinkSlackButton('Sign transaction', undefined, 'sign_web3_tx', 'primary', `http://smc344.netlify.app/tx/${chainId}_${txId}`))
                // }
            } else {
                // tx = await contractInstance.createPool(
                //   valueParsed.poolInfo.openingDate,
                //   valueParsed.poolInfo.closingDate,
                //   valueParsed.poolInfo.startingDate,
                //   valueParsed.poolInfo.interestRate,
                //   valueParsed.poolInfo.tenor,
                //   valueParsed.poolInfo.minimumRaise,
                //   valueParsed.poolInfo.maximumRaise,
                //   {
                //     gasLimit: 5000000
                //   }
                // )
                // if (tx !== undefined) {
                //   messageBlocks.push(slackBuilder.buildSimpleSlackHeaderMsg(`:white_check_mark: Transaction Hash: ${tx.hash}`))
                //   buttons.push(
                //     slackBuilder.buildEtherscanLinkSlackButton(chainName, 'Transaction on Etherscan', undefined, undefined, undefined, tx.hash)
                //   )
                // }
            }

            // const inputArguments = [{ type: 'divider' }]
            // const { chainId, chainName, contractAddress, contractInstance, contractAbi } =
            //     await setupContractNetworkAndSigner(
            //         actionObject.env,
            //         actionObject.abis,
            //         selectedEnvironment,
            //         selectedContract
            //     )
            // if (contractInstance !== undefined) {
            //     const functionName = JSON.parse(actionObject.value).functionSignature.split('(')[0]
            //     let functionArgumentsCount: number = 0
            //     if (
            //         JSON.parse(actionObject.value).functionSignature.includes('(') &&
            //         JSON.parse(actionObject.value).functionSignature.includes(',')
            //     )
            //         functionArgumentsCount =
            //             JSON.parse(actionObject.value).functionSignature.split('(')[2].split(',').length + 1
            //     else if (JSON.parse(actionObject.value).functionSignature.split('(')[1] !== ')')
            //         functionArgumentsCount = 1
            //     const abiFunctions = contractAbi.filter(
            //         (abi: any) => abi.type === 'function' && abi.name === functionName
            //     )
            //     if (abiFunctions !== undefined) {
            //         if (abiFunctions.length > 1) {
            //             abiFunctions.forEach((abiFunction: any) => {
            //                 if (abiFunction.inputs.length > 0)
            //                     inputArguments.push(
            //                         slackBuilder.buildSimpleSectionMsg(
            //                             '',
            //                             'Fill the different arguments of the function'
            //                         )
            //                     )
            //                 if (abiFunction.inputs.length > 0) {
            //                     abiFunction.inputs
            //                         .filter(
            //                             (functionInput: any) =>
            //                                 functionInput !== undefined && functionInput === functionArgumentsCount
            //                         )
            //                         .forEach((input: any) => {
            //                             inputArguments.push(
            //                                 slackBuilder.buildSlackInput(
            //                                     input.name,
            //                                     input.name,
            //                                     slackBuilder.buildSlackPlainTextInput(
            //                                         input.name + ' (' + input.type + ')',
            //                                         input.name
            //                                     )
            //                                 )
            //                             )
            //                         })
            //                 }
            //             })
            //         } else {
            //             abiFunctions.forEach((abiFunction: any) => {
            //                 if (abiFunction.inputs.length > 0)
            //                     inputArguments.push(
            //                         slackBuilder.buildSimpleSectionMsg(
            //                             '',
            //                             'Fill the different arguments of the function'
            //                         )
            //                     )
            //                 if (abiFunction.inputs.length > 0) {
            //                     abiFunction.inputs.forEach((input: any) => {
            //                         inputArguments.push(
            //                             slackBuilder.buildSlackInput(
            //                                 input.name,
            //                                 input.name,
            //                                 slackBuilder.buildSlackPlainTextInput(
            //                                     input.name + ' (' + input.type + ')',
            //                                     input.name
            //                                 )
            //                             )
            //                         )
            //                     })
            //                 }
            //             })
            //         }
            //         await slackOpenView(
            //             actionObject.slackToken,
            //             slackBuilder.buildSlackModal(
            //                 'Call ' + functionName,
            //                 'build_call_from_abi:call',
            //                 inputArguments,
            //                 'Static Call',
            //                 'Close',
            //                 {
            //                     contractAddress,
            //                     functionName,
            //                     functionSignature: JSON.parse(actionObject.value).functionSignature,
            //                     abiFunctions
            //                 }
            //             ),
            //             parsedBody.trigger_id
            //         )
            //     } else
            //         messageBlocks.push(
            //             slackBuilder.buildSimpleSlackHeaderMsg(
            //                 `:x: Error: No function found with the name ${functionName}`
            //             )
            //         )
            // } else messageBlocks.push(slackBuilder.buildSimpleSlackHeaderMsg(`:x: Contract not found`))
        } else messageBlocks.push(slackBuilder.buildSimpleSlackHeaderMsg(`:x: Environment not found`))
    } catch (error) {
        console.log('error', error)
        messageBlocks.push(slackBuilder.buildSimpleSlackHeaderMsg(`:x: Error: ${error}`))
    }

    return [action, returnValue, messageBlocks, buttons]
}

export default action
