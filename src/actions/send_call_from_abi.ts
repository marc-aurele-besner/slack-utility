import { BigNumber, utils } from 'ethers'
import fauna from 'faunadb-utility'
import mongoose from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

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
            const abiFunctions = JSON.parse(parsedBody.view.private_metadata).abiFunctions
            if (abiFunctions !== undefined && abiFunctions.length >= 1) {
                const abiFunctionsStateMutability = abiFunctions[0].stateMutability
                messageBlocks.pop()
                messageBlocks.push(
                    slackBuilder.buildSimpleSectionMsg(
                        `${JSON.parse(parsedBody.view.private_metadata).functionName}`,
                        ``
                    )
                )
                let params: string[] = []
                switch (abiFunctions[0].inputs.length) {
                    case 0:
                        params = []
                        break
                    case 1:
                        params = [
                            parsedBody.view.state.values[abiFunctions[0].inputs[0].name][abiFunctions[0].inputs[0].name]
                                .value
                        ]
                        messageBlocks.push(
                            slackBuilder.buildSimpleSectionMsg(
                                `${abiFunctions[0].inputs[0].name}`,
                                `${
                                    parsedBody.view.state.values[abiFunctions[0].inputs[0].name][
                                        abiFunctions[0].inputs[0].name
                                    ].value
                                }`
                            )
                        )
                        break
                    case 2:
                        params = [
                            parsedBody.view.state.values[abiFunctions[0].inputs[0].name][abiFunctions[0].inputs[0].name]
                                .value,
                            parsedBody.view.state.values[abiFunctions[0].inputs[1].name][abiFunctions[0].inputs[1].name]
                                .value
                        ]
                        messageBlocks.push(
                            slackBuilder.buildSimpleSectionMsg(
                                `${abiFunctions[0].inputs[0].name}`,
                                `${
                                    parsedBody.view.state.values[abiFunctions[0].inputs[0].name][
                                        abiFunctions[0].inputs[0].name
                                    ].value
                                }
                                \n${
                                    parsedBody.view.state.values[abiFunctions[0].inputs[1].name][
                                        abiFunctions[0].inputs[1].name
                                    ].value
                                }`
                            )
                        )
                        break
                    case 3:
                        params = [
                            parsedBody.view.state.values[abiFunctions[0].inputs[0].name][abiFunctions[0].inputs[0].name]
                                .value,
                            parsedBody.view.state.values[abiFunctions[0].inputs[1].name][abiFunctions[0].inputs[1].name]
                                .value,
                            parsedBody.view.state.values[abiFunctions[0].inputs[2].name][abiFunctions[0].inputs[2].name]
                                .value
                        ]
                        messageBlocks.push(
                            slackBuilder.buildSimpleSectionMsg(
                                `${abiFunctions[0].inputs[0].name}`,
                                `${
                                    parsedBody.view.state.values[abiFunctions[0].inputs[0].name][
                                        abiFunctions[0].inputs[0].name
                                    ].value
                                }
                                \n${
                                    parsedBody.view.state.values[abiFunctions[0].inputs[1].name][
                                        abiFunctions[0].inputs[1].name
                                    ].value
                                }
                                \n${
                                    parsedBody.view.state.values[abiFunctions[0].inputs[2].name][
                                        abiFunctions[0].inputs[2].name
                                    ].value
                                }`
                            )
                        )
                        break
                    case 4:
                        params = [
                            parsedBody.view.state.values[abiFunctions[0].inputs[0].name][abiFunctions[0].inputs[0].name]
                                .value,
                            parsedBody.view.state.values[abiFunctions[0].inputs[1].name][abiFunctions[0].inputs[1].name]
                                .value,
                            parsedBody.view.state.values[abiFunctions[0].inputs[2].name][abiFunctions[0].inputs[2].name]
                                .value,
                            parsedBody.view.state.values[abiFunctions[0].inputs[3].name][abiFunctions[0].inputs[3].name]
                                .value
                        ]
                        messageBlocks.push(
                            slackBuilder.buildSimpleSectionMsg(
                                `${abiFunctions[0].inputs[0].name}`,
                                `${
                                    parsedBody.view.state.values[abiFunctions[0].inputs[0].name][
                                        abiFunctions[0].inputs[0].name
                                    ].value
                                }
                                \n${
                                    parsedBody.view.state.values[abiFunctions[0].inputs[1].name][
                                        abiFunctions[0].inputs[1].name
                                    ].value
                                }
                                \n${
                                    parsedBody.view.state.values[abiFunctions[0].inputs[2].name][
                                        abiFunctions[0].inputs[2].name
                                    ].value
                                }
                                \n${
                                    parsedBody.view.state.values[abiFunctions[0].inputs[3].name][
                                        abiFunctions[0].inputs[3].name
                                    ].value
                                }`
                            )
                        )
                        break
                    case 5:
                        params = [
                            parsedBody.view.state.values[abiFunctions[0].inputs[0].name][abiFunctions[0].inputs[0].name]
                                .value,
                            parsedBody.view.state.values[abiFunctions[0].inputs[1].name][abiFunctions[0].inputs[1].name]
                                .value,
                            parsedBody.view.state.values[abiFunctions[0].inputs[2].name][abiFunctions[0].inputs[2].name]
                                .value,
                            parsedBody.view.state.values[abiFunctions[0].inputs[3].name][abiFunctions[0].inputs[3].name]
                                .value,
                            parsedBody.view.state.values[abiFunctions[0].inputs[4].name][abiFunctions[0].inputs[4].name]
                                .value
                        ]
                        messageBlocks.push(
                            slackBuilder.buildSimpleSectionMsg(
                                `${abiFunctions[0].inputs[0].name}`,
                                `${
                                    parsedBody.view.state.values[abiFunctions[0].inputs[0].name][
                                        abiFunctions[0].inputs[0].name
                                    ].value
                                }
                                \n${
                                    parsedBody.view.state.values[abiFunctions[0].inputs[1].name][
                                        abiFunctions[0].inputs[1].name
                                    ].value
                                }
                                \n${
                                    parsedBody.view.state.values[abiFunctions[0].inputs[2].name][
                                        abiFunctions[0].inputs[2].name
                                    ].value
                                }
                                \n${
                                    parsedBody.view.state.values[abiFunctions[0].inputs[3].name][
                                        abiFunctions[0].inputs[3].name
                                    ].value
                                }
                                \n${
                                    parsedBody.view.state.values[abiFunctions[0].inputs[4].name][
                                        abiFunctions[0].inputs[4].name
                                    ].value
                                }`
                            )
                        )
                        break
                    case 6:
                        params = [
                            parsedBody.view.state.values[abiFunctions[0].inputs[0].name][abiFunctions[0].inputs[0].name]
                                .value,
                            parsedBody.view.state.values[abiFunctions[0].inputs[1].name][abiFunctions[0].inputs[1].name]
                                .value,
                            parsedBody.view.state.values[abiFunctions[0].inputs[2].name][abiFunctions[0].inputs[2].name]
                                .value,
                            parsedBody.view.state.values[abiFunctions[0].inputs[3].name][abiFunctions[0].inputs[3].name]
                                .value,
                            parsedBody.view.state.values[abiFunctions[0].inputs[4].name][abiFunctions[0].inputs[4].name]
                                .value,
                            parsedBody.view.state.values[abiFunctions[0].inputs[5].name][abiFunctions[0].inputs[5].name]
                                .value
                        ]
                        messageBlocks.push(
                            slackBuilder.buildSimpleSectionMsg(
                                `${abiFunctions[0].inputs[0].name}`,
                                `${
                                    parsedBody.view.state.values[abiFunctions[0].inputs[0].name][
                                        abiFunctions[0].inputs[0].name
                                    ].value
                                }
                                \n${
                                    parsedBody.view.state.values[abiFunctions[0].inputs[1].name][
                                        abiFunctions[0].inputs[1].name
                                    ].value
                                }
                                \n${
                                    parsedBody.view.state.values[abiFunctions[0].inputs[2].name][
                                        abiFunctions[0].inputs[2].name
                                    ].value
                                }
                                \n${
                                    parsedBody.view.state.values[abiFunctions[0].inputs[3].name][
                                        abiFunctions[0].inputs[3].name
                                    ].value
                                }
                                \n${
                                    parsedBody.view.state.values[abiFunctions[0].inputs[4].name][
                                        abiFunctions[0].inputs[4].name
                                    ].value
                                }
                                \n${
                                    parsedBody.view.state.values[abiFunctions[0].inputs[5].name][
                                        abiFunctions[0].inputs[5].name
                                    ].value
                                }`
                            )
                        )
                        break
                    case 7:
                        params = [
                            parsedBody.view.state.values[abiFunctions[0].inputs[0].name][abiFunctions[0].inputs[0].name]
                                .value,
                            parsedBody.view.state.values[abiFunctions[0].inputs[1].name][abiFunctions[0].inputs[1].name]
                                .value,
                            parsedBody.view.state.values[abiFunctions[0].inputs[2].name][abiFunctions[0].inputs[2].name]
                                .value,
                            parsedBody.view.state.values[abiFunctions[0].inputs[3].name][abiFunctions[0].inputs[3].name]
                                .value,
                            parsedBody.view.state.values[abiFunctions[0].inputs[4].name][abiFunctions[0].inputs[4].name]
                                .value,
                            parsedBody.view.state.values[abiFunctions[0].inputs[5].name][abiFunctions[0].inputs[5].name]
                                .value,
                            parsedBody.view.state.values[abiFunctions[0].inputs[6].name][abiFunctions[0].inputs[6].name]
                                .value
                        ]
                        messageBlocks.push(
                            slackBuilder.buildSimpleSectionMsg(
                                `${abiFunctions[0].inputs[0].name}`,
                                `${
                                    parsedBody.view.state.values[abiFunctions[0].inputs[0].name][
                                        abiFunctions[0].inputs[0].name
                                    ].value
                                }
                                \n${
                                    parsedBody.view.state.values[abiFunctions[0].inputs[1].name][
                                        abiFunctions[0].inputs[1].name
                                    ].value
                                }
                                \n${
                                    parsedBody.view.state.values[abiFunctions[0].inputs[2].name][
                                        abiFunctions[0].inputs[2].name
                                    ].value
                                }
                                \n${
                                    parsedBody.view.state.values[abiFunctions[0].inputs[3].name][
                                        abiFunctions[0].inputs[3].name
                                    ].value
                                }
                                \n${
                                    parsedBody.view.state.values[abiFunctions[0].inputs[4].name][
                                        abiFunctions[0].inputs[4].name
                                    ].value
                                }
                                \n${
                                    parsedBody.view.state.values[abiFunctions[0].inputs[5].name][
                                        abiFunctions[0].inputs[5].name
                                    ].value
                                }
                                \n${
                                    parsedBody.view.state.values[abiFunctions[0].inputs[6].name][
                                        abiFunctions[0].inputs[6].name
                                    ].value
                                }`
                            )
                        )
                        break
                    case 8:
                        params = [
                            parsedBody.view.state.values[abiFunctions[0].inputs[0].name][abiFunctions[0].inputs[0].name]
                                .value,
                            parsedBody.view.state.values[abiFunctions[0].inputs[1].name][abiFunctions[0].inputs[1].name]
                                .value,
                            parsedBody.view.state.values[abiFunctions[0].inputs[2].name][abiFunctions[0].inputs[2].name]
                                .value,
                            parsedBody.view.state.values[abiFunctions[0].inputs[3].name][abiFunctions[0].inputs[3].name]
                                .value,
                            parsedBody.view.state.values[abiFunctions[0].inputs[4].name][abiFunctions[0].inputs[4].name]
                                .value,
                            parsedBody.view.state.values[abiFunctions[0].inputs[5].name][abiFunctions[0].inputs[5].name]
                                .value,
                            parsedBody.view.state.values[abiFunctions[0].inputs[6].name][abiFunctions[0].inputs[6].name]
                                .value,
                            parsedBody.view.state.values[abiFunctions[0].inputs[7].name][abiFunctions[0].inputs[7].name]
                                .value
                        ]
                        messageBlocks.push(
                            slackBuilder.buildSimpleSectionMsg(
                                `${abiFunctions[0].inputs[0].name}`,
                                `${
                                    parsedBody.view.state.values[abiFunctions[0].inputs[0].name][
                                        abiFunctions[0].inputs[0].name
                                    ].value
                                }
                                \n${
                                    parsedBody.view.state.values[abiFunctions[0].inputs[1].name][
                                        abiFunctions[0].inputs[1].name
                                    ].value
                                }
                                \n${
                                    parsedBody.view.state.values[abiFunctions[0].inputs[2].name][
                                        abiFunctions[0].inputs[2].name
                                    ].value
                                }
                                \n${
                                    parsedBody.view.state.values[abiFunctions[0].inputs[3].name][
                                        abiFunctions[0].inputs[3].name
                                    ].value
                                }
                                \n${
                                    parsedBody.view.state.values[abiFunctions[0].inputs[4].name][
                                        abiFunctions[0].inputs[4].name
                                    ].value
                                }
                                \n${
                                    parsedBody.view.state.values[abiFunctions[0].inputs[5].name][
                                        abiFunctions[0].inputs[5].name
                                    ].value
                                }
                                \n${
                                    parsedBody.view.state.values[abiFunctions[0].inputs[6].name][
                                        abiFunctions[0].inputs[6].name
                                    ].value
                                }
                                \n${
                                    parsedBody.view.state.values[abiFunctions[0].inputs[7].name][
                                        abiFunctions[0].inputs[7].name
                                    ].value
                                }`
                            )
                        )
                        break
                    case 9:
                        params = [
                            parsedBody.view.state.values[abiFunctions[0].inputs[0].name][abiFunctions[0].inputs[0].name]
                                .value,
                            parsedBody.view.state.values[abiFunctions[0].inputs[1].name][abiFunctions[0].inputs[1].name]
                                .value,
                            parsedBody.view.state.values[abiFunctions[0].inputs[2].name][abiFunctions[0].inputs[2].name]
                                .value,
                            parsedBody.view.state.values[abiFunctions[0].inputs[3].name][abiFunctions[0].inputs[3].name]
                                .value,
                            parsedBody.view.state.values[abiFunctions[0].inputs[4].name][abiFunctions[0].inputs[4].name]
                                .value,
                            parsedBody.view.state.values[abiFunctions[0].inputs[5].name][abiFunctions[0].inputs[5].name]
                                .value,
                            parsedBody.view.state.values[abiFunctions[0].inputs[6].name][abiFunctions[0].inputs[6].name]
                                .value,
                            parsedBody.view.state.values[abiFunctions[0].inputs[7].name][abiFunctions[0].inputs[7].name]
                                .value,
                            parsedBody.view.state.values[abiFunctions[0].inputs[8].name][abiFunctions[0].inputs[8].name]
                                .value
                        ]
                        messageBlocks.push(
                            slackBuilder.buildSimpleSectionMsg(
                                `${abiFunctions[0].inputs[0].name}`,
                                `${
                                    parsedBody.view.state.values[abiFunctions[0].inputs[0].name][
                                        abiFunctions[0].inputs[0].name
                                    ].value
                                }
                                \n${
                                    parsedBody.view.state.values[abiFunctions[0].inputs[1].name][
                                        abiFunctions[0].inputs[1].name
                                    ].value
                                }
                                \n${
                                    parsedBody.view.state.values[abiFunctions[0].inputs[2].name][
                                        abiFunctions[0].inputs[2].name
                                    ].value
                                }
                                \n${
                                    parsedBody.view.state.values[abiFunctions[0].inputs[3].name][
                                        abiFunctions[0].inputs[3].name
                                    ].value
                                }
                                \n${
                                    parsedBody.view.state.values[abiFunctions[0].inputs[4].name][
                                        abiFunctions[0].inputs[4].name
                                    ].value
                                }
                                \n${
                                    parsedBody.view.state.values[abiFunctions[0].inputs[5].name][
                                        abiFunctions[0].inputs[5].name
                                    ].value
                                }
                                \n${
                                    parsedBody.view.state.values[abiFunctions[0].inputs[6].name][
                                        abiFunctions[0].inputs[6].name
                                    ].value
                                }
                                \n${
                                    parsedBody.view.state.values[abiFunctions[0].inputs[7].name][
                                        abiFunctions[0].inputs[7].name
                                    ].value
                                }
                                \n${
                                    parsedBody.view.state.values[abiFunctions[0].inputs[8].name][
                                        abiFunctions[0].inputs[8].name
                                    ].value
                                }`
                            )
                        )
                        break
                    case 10:
                        params = [
                            parsedBody.view.state.values[abiFunctions[0].inputs[0].name][abiFunctions[0].inputs[0].name]
                                .value,
                            parsedBody.view.state.values[abiFunctions[0].inputs[1].name][abiFunctions[0].inputs[1].name]
                                .value,
                            parsedBody.view.state.values[abiFunctions[0].inputs[2].name][abiFunctions[0].inputs[2].name]
                                .value,
                            parsedBody.view.state.values[abiFunctions[0].inputs[3].name][abiFunctions[0].inputs[3].name]
                                .value,
                            parsedBody.view.state.values[abiFunctions[0].inputs[4].name][abiFunctions[0].inputs[4].name]
                                .value,
                            parsedBody.view.state.values[abiFunctions[0].inputs[5].name][abiFunctions[0].inputs[5].name]
                                .value,
                            parsedBody.view.state.values[abiFunctions[0].inputs[6].name][abiFunctions[0].inputs[6].name]
                                .value,
                            parsedBody.view.state.values[abiFunctions[0].inputs[7].name][abiFunctions[0].inputs[7].name]
                                .value,
                            parsedBody.view.state.values[abiFunctions[0].inputs[8].name][abiFunctions[0].inputs[8].name]
                                .value,
                            parsedBody.view.state.values[abiFunctions[0].inputs[9].name][abiFunctions[0].inputs[9].name]
                                .value
                        ]
                        messageBlocks.push(
                            slackBuilder.buildSimpleSectionMsg(
                                `${abiFunctions[0].inputs[0].name}`,
                                `${
                                    parsedBody.view.state.values[abiFunctions[0].inputs[0].name][
                                        abiFunctions[0].inputs[0].name
                                    ].value
                                }
                                \n${
                                    parsedBody.view.state.values[abiFunctions[0].inputs[1].name][
                                        abiFunctions[0].inputs[1].name
                                    ].value
                                }
                                \n${
                                    parsedBody.view.state.values[abiFunctions[0].inputs[2].name][
                                        abiFunctions[0].inputs[2].name
                                    ].value
                                }
                                \n${
                                    parsedBody.view.state.values[abiFunctions[0].inputs[3].name][
                                        abiFunctions[0].inputs[3].name
                                    ].value
                                }
                                \n${
                                    parsedBody.view.state.values[abiFunctions[0].inputs[4].name][
                                        abiFunctions[0].inputs[4].name
                                    ].value
                                }
                                \n${
                                    parsedBody.view.state.values[abiFunctions[0].inputs[5].name][
                                        abiFunctions[0].inputs[5].name
                                    ].value
                                }
                                \n${
                                    parsedBody.view.state.values[abiFunctions[0].inputs[6].name][
                                        abiFunctions[0].inputs[6].name
                                    ].value
                                }
                                \n${
                                    parsedBody.view.state.values[abiFunctions[0].inputs[7].name][
                                        abiFunctions[0].inputs[7].name
                                    ].value
                                }
                                \n${
                                    parsedBody.view.state.values[abiFunctions[0].inputs[8].name][
                                        abiFunctions[0].inputs[8].name
                                    ].value
                                }
                                \n${
                                    parsedBody.view.state.values[abiFunctions[0].inputs[9].name][
                                        abiFunctions[0].inputs[9].name
                                    ].value
                                }`
                            )
                        )
                        break
                }
                if (abiFunctionsStateMutability === 'view' || abiFunctionsStateMutability === 'pure') {
                    let callValue = ''
                    try {
                        callValue = await contractInstance[abiFunctions[0].name](...params)
                    } catch (e) {
                        console.log('e', e)
                    }
                    const valueArray =
                        callValue !== null &&
                        callValue !== '' &&
                        typeof callValue === 'string' &&
                        callValue.includes(',')
                            ? callValue.split(',')
                            : [callValue]
                    messageBlocks.push(slackBuilder.buildSimpleSectionMsg(`Return values:`, ``))
                    valueArray.forEach((value: any) =>
                        messageBlocks.push(
                            slackBuilder.buildSimpleSectionMsg(
                                '',
                                `${BigNumber.isBigNumber(value) ? value.toString() : value}`
                            )
                        )
                    )
                } else {
                    let tx: any
                    if (signingType === 'web3') {
                        const txId = uuidv4()
                        const dataToAdd = {
                            txId,
                            txStatus: 'pending-signing',
                            slackUserId: parsedBody.user.id,
                            slackChannelId:
                                parsedBody.channel !== undefined
                                    ? parsedBody.channel.id
                                    : actionObject.slackDefaultConversationId,
                            slackTeamId: parsedBody.team.id,
                            selectedEnvironment,
                            selectedContract,
                            chainId: chainId.toString(),
                            chainIdAndTxId: `${chainId}_${txId}`,
                            chainName,
                            contractName,
                            contractAddress,
                            method: JSON.parse(parsedBody.view.private_metadata).functionSignature,
                            params,
                            value: '0x00',
                            gasLimit: utils.hexlify(5000000)
                        }
                        if (actionObject.dBDetails.db == 'fauna') {
                            try {
                                tx = await fauna.createFaunaDocument(
                                    actionObject.faunaDbToken,
                                    'transactions',
                                    dataToAdd
                                )
                            } catch (e) {
                                console.log('e', e)
                            }
                        }
                        if (actionObject.dBDetails.db == 'mongo') {
                            try {
                                const db = await mongoose.connect(actionObject.dBDetails.token)
                                await db.connection.collection('transactions').insertOne(dataToAdd)
                            } catch (e) {
                                console.log('e', e)
                            }
                        }
                        if (tx !== undefined) {
                            messageBlocks.push(
                                slackBuilder.buildSimpleSectionMsg(
                                    `:fox_face:`,
                                    ` Sign the transaction with your wallet at ${actionObject.dappUrl}tx/${chainId}_${txId}`
                                ),
                                slackBuilder.buildSlackActionMsg(
                                    {},
                                    'actions1',
                                    [
                                        slackBuilder.buildLinkSlackButton(
                                            ':fox_face: Sign transaction',
                                            undefined,
                                            'sign_web3_tx',
                                            'primary',
                                            `${actionObject.dappUrl}tx/${chainId}_${txId}`
                                        )
                                    ],
                                    false
                                )
                            )
                        }
                    } else {
                        tx = await contractInstance[JSON.parse(parsedBody.view.private_metadata).functionSignature](
                            ...params,
                            {
                                gasLimit: 5000000
                            }
                        )
                        if (tx !== undefined) {
                            messageBlocks.push(
                                slackBuilder.buildSimpleSectionMsg(
                                    `:white_check_mark: Transaction Hash: ${tx.hash}`,
                                    ``
                                )
                            )
                            buttons.push(
                                slackBuilder.buildEtherscanLinkSlackButton(
                                    chainName,
                                    'Transaction on Etherscan',
                                    undefined,
                                    undefined,
                                    undefined,
                                    tx.hash
                                )
                            )
                        }
                    }
                }
                await slackUtils.slackUpdateMessage(
                    actionObject.slackToken,
                    JSON.parse(parsedBody.view.private_metadata).channel_id,
                    returnValue.body,
                    actionObject.waitMessageTs,
                    messageBlocks
                )
                messageBlocks = []
                buttons = []
            } else {
                messageBlocks.push(
                    slackBuilder.buildSimpleSectionMsg(
                        '',
                        `:x: Error: ABI function not found in ABI file or overloaded`
                    )
                )
            }
        } else messageBlocks.push(slackBuilder.buildSimpleSlackHeaderMsg(`:x: Environment not found`))
    } catch (error) {
        console.log('error', error)
        messageBlocks.push(slackBuilder.buildSimpleSlackHeaderMsg(`:x: Error: ${error}`))
    }

    return [action, returnValue, messageBlocks, buttons]
}

export default action
