import slackBuilder from '../slackBuilder'
import slackUtils from '../slackUtils'
import { TBlockElements, TBlocks, TReturnValue } from '../types'

const action = async (
    actionObject: any,
    parsedBody: any,
    messageBlocks: TBlocks,
    buttons: TBlockElements,
    returnValue: TReturnValue
) => {
    console.log('query_all_events')
    try {
        if (parsedBody.view !== undefined) {
            messageBlocks.push(
                slackBuilder.buildSimpleSlackHeaderMsg(
                    `:mag: Querying all ${JSON.parse(parsedBody.view.private_metadata).eventName} events...`
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
                'Please wait while we query all events from the blockchain...',
                messageBlocks,
                returnValue
            )
            if (wait.action.waitMessageTs !== undefined) {
                actionObject = wait.action
                messageBlocks = wait.blocks
            }
            const { environmentFound, selectedEnvironment, selectedContract } = await slackUtils.retrieveEnvironment(
                parsedBody
            )
            if (environmentFound) {
                const { chainId, chainName, contractInstance, provider } =
                    await slackUtils.setupContractNetworkAndSigner(
                        actionObject.env,
                        actionObject.abis,
                        selectedEnvironment,
                        selectedContract
                    )
                if (contractInstance === undefined || provider === undefined) {
                    messageBlocks.push(
                        slackBuilder.buildSimpleSectionMsg('', `:x: Error: Contract instance or provider not found`)
                    )
                    return [action, returnValue, messageBlocks, buttons]
                }

                let startBlock = 0
                let endBlock = 0
                if (parsedBody.view.state.values.actions1.select_.selected_option.value === '24h') {
                    // current block number = end block
                    endBlock = await provider.getBlockNumber()
                    // start block = end block - 24h in blocks
                    startBlock = endBlock - 5760
                } else if (parsedBody.view.state.values.actions1.select_.selected_option.value === '7d') {
                    // current block number = end block
                    endBlock = await provider.getBlockNumber()
                    // start block = end block - 7d in blocks
                    startBlock = endBlock - 40320
                } else if (parsedBody.view.state.values.actions1.select_.selected_option.value === '30d') {
                    // current block number = end block
                    endBlock = await provider.getBlockNumber()
                    // start block = end block - 30d in blocks
                    startBlock = endBlock - 172800
                }

                const events: any = []
                const filterEvents = await contractInstance.filters[
                    JSON.parse(parsedBody.view.private_metadata).eventName
                ]()
                const allEvents =
                    startBlock && endBlock
                        ? await contractInstance.queryFilter(filterEvents, startBlock, endBlock)
                        : await contractInstance.queryFilter(filterEvents, startBlock)
                for (const txn of allEvents) {
                    if (txn.args) events.push(txn.args)
                }
                messageBlocks.push(
                    slackBuilder.buildSimpleSectionMsg(
                        'Quantity of events found for this time frame:',
                        `${events.length} ${
                            JSON.parse(parsedBody.view.private_metadata).eventName
                        } events in the contract`
                    )
                )
                if (events.length > 75) {
                    messageBlocks.push(
                        slackBuilder.buildSimpleSectionMsg('', `We only show the first 75 events in this section`)
                    )
                    events.splice(0, events.length - 75)
                }
                buttons.push(
                    slackBuilder.buildSimpleSlackSelection(events, 'select_pool', 'Select a pool'),
                    slackBuilder.buildSimpleSlackButton(
                        'See details',
                        {
                            selectedEnvironment,
                            selectedContract,
                            chainId,
                            chainName
                        },
                        'query_event_details'
                    )
                )
            }
        } else {
            const { environmentFound, selectedEnvironment, selectedContract } = await slackUtils.retrieveEnvironment(
                parsedBody
            )
            if (environmentFound) {
                await slackUtils.slackOpenView(
                    actionObject.slackToken,
                    slackBuilder.buildSlackModal(
                        'Query events',
                        'query_all_events',
                        [
                            slackBuilder.buildSimpleSectionMsg('', 'Select the range of the events log.'),
                            {
                                type: 'divider'
                            },
                            slackBuilder.buildSlackActionMsg({}, 'actions1', [
                                slackBuilder.buildSimpleSlackSelection(
                                    [
                                        {
                                            name: 'All',
                                            value: 'all'
                                        },
                                        {
                                            name: 'Last 24 hours',
                                            value: '24h'
                                        },
                                        {
                                            name: 'Last 7 days',
                                            value: '7d'
                                        },
                                        {
                                            name: 'Last 30 days',
                                            value: '30d'
                                        }
                                    ],
                                    'select_',
                                    'Select the range of the events to query'
                                )
                            ])
                        ],
                        'Query events',
                        'Close',
                        {
                            ...JSON.parse(actionObject.value),
                            channel_id: parsedBody.channel.id,
                            selectedEnvironment,
                            selectedContract
                        }
                    ),
                    parsedBody.trigger_id
                )
            } else messageBlocks.push(slackBuilder.buildSimpleSectionMsg('', `:x: Error: Environment not found`))
        }
    } catch (error) {
        console.log('error', error)
        messageBlocks.push(slackBuilder.buildSimpleSlackHeaderMsg(`:x: Error: ${error}`))
    }

    return [actionObject, returnValue, messageBlocks, buttons]
}

export default action
