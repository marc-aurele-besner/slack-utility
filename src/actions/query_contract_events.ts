import slackBuilder from '../slackBuilder'
import retrieveEnvironment from '../slackUtils/retrieveEnvironment'
import setupContractAndNetwork from '../slackUtils/setupContractAndNetwork'
import { TBlockElements, TBlocks, TReturnValue } from '../types'

const action = async (
    actionObject: any,
    parsedBody: any,
    messageBlocks: TBlocks,
    buttons: TBlockElements,
    returnValue: TReturnValue
) => {
    console.log('query_contract_events')
    try {
        const { environmentFound, selectedEnvironment, selectedContract } = await retrieveEnvironment(parsedBody)
        if (environmentFound) {
            const { chainId, chainName, contractAbi } = await setupContractAndNetwork(
                actionObject.env,
                actionObject.abis,
                selectedEnvironment,
                selectedContract
            )
            const contractEvents = contractAbi.filter((abi: any) => abi.type === 'event')
            if (contractEvents.length > 0) {
                contractEvents.map((event: any) => {
                    buttons.push(
                        slackBuilder.buildSimpleSlackButton(
                            event.name,
                            {
                                selectedEnvironment,
                                selectedContract,
                                chainId,
                                chainName,
                                eventName: event.name,
                                channelId: parsedBody.channel.id
                            },
                            'query_all_events:' + event.name
                        )
                    )
                })
                messageBlocks.push(slackBuilder.buildSimpleSectionMsg('Select a event to query the logs', ''))
            } else
                messageBlocks.push(
                    slackBuilder.buildSimpleSectionMsg('No events found', '\nThis contract has no events')
                )
        } else messageBlocks.push(slackBuilder.buildSimpleSectionMsg('No environment found', ''))
    } catch (error) {
        console.log('error', error)
        messageBlocks.push(slackBuilder.buildSimpleSlackHeaderMsg(`:x: Error: ${error}`))
    }
    return [actionObject, returnValue, messageBlocks, buttons]
}

export default action
