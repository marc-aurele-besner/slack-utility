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
    console.log('query_event_details')
    try {
        if (parsedBody.view !== undefined && parsedBody.view.private_metadata !== undefined) {
            actionObject.closeView = true

            const values = JSON.parse(parsedBody.view.private_metadata)
        }
        if (parsedBody.view !== undefined) {
            messageBlocks.push(
                slackBuilder.buildSimpleSlackHeaderMsg(
                    `:mag: Querying all ${JSON.parse(parsedBody.view.private_metadata).eventName} events...`
                )
            )
        } else {
            const txHashSelected = slackUtils.retrieveEvent(parsedBody)
            if (txHashSelected !== null) {
                const { environmentFound, selectedEnvironment, selectedContract } =
                    await slackUtils.retrieveEnvironment(parsedBody)
                if (environmentFound) {
                    const { chainName, chainEmoji, contractInstance, provider } =
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
                    let txReceipt = ''
                    try {
                        const receipt = await provider.getTransactionReceipt(txHashSelected)
                        txReceipt = JSON.stringify(receipt)
                    } catch (error) {
                        txReceipt = JSON.stringify(error)
                    }
                    await slackUtils.slackOpenView(
                        actionObject.slackToken,
                        slackBuilder.buildSlackModal('Event detail', 'nothing', [
                            slackBuilder.buildSimpleSectionMsg(
                                '',
                                `${selectedContract} Info - ${chainEmoji} ${
                                    chainName.charAt(0).toUpperCase() + chainName.slice(1)
                                }`
                            ),
                            {
                                type: 'divider'
                            },
                            slackBuilder.buildSimpleSectionMsg('TxHash: ', txHashSelected),
                            slackBuilder.buildSimpleSectionMsg('', txReceipt)
                        ]),
                        parsedBody.trigger_id
                    )
                } else messageBlocks.push(slackBuilder.buildSimpleSectionMsg('', `:x: Error: Environment not found`))
            } else messageBlocks.push(slackBuilder.buildSimpleSectionMsg('', `:x: Error: TxHash not found`))
        }
    } catch (error) {
        console.log('error', error)
        messageBlocks.push(slackBuilder.buildSimpleSlackHeaderMsg(`:x: Error: ${error}`))
    }

    return [actionObject, returnValue, messageBlocks, buttons]
}

export default action
