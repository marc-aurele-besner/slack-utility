import slackBuilder from '../slackBuilder'
import { TBlockElements, TBlocks, TReturnValue } from '../types'

const action = async (
    actionObject: any,
    parsedBody: any,
    messageBlocks: TBlocks,
    buttons: TBlockElements,
    returnValue: TReturnValue
) => {
    console.log('query_contract_for_env')
    let contractInstance
    try {
        contractInstance = actionObject.contractInstance
    } catch (error) {
        console.log('error', error)
    }

    try {
        messageBlocks.push(
            slackBuilder.buildSimpleSlackHeaderMsg(
                `${actionObject.name} Info - ${actionObject.chainEmoji} ${
                    actionObject.chainName.charAt(0).toUpperCase() + actionObject.chainName.slice(1)
                }`
            )
        )
    } catch (error) {
        messageBlocks.push(
            slackBuilder.buildSimpleSlackHeaderMsg(`${actionObject.name} Info - ${actionObject.chainEmoji}`)
        )
    }

    if (contractInstance === undefined)
        messageBlocks.push(slackBuilder.buildSimpleSectionMsg('', `Contract instance not found`))
    else
        messageBlocks.push(
            slackBuilder.buildSimpleSectionMsg('', `Contract instance found for ${actionObject.selectedContract}`)
        )

    buttons.push(slackBuilder.buildEtherscanLinkSlackButton(actionObject.chainName, actionObject.contractAddress))

    // console.log('messageBlocks', messageBlocks.toString())
    buttons.push(
        slackBuilder.buildSimpleSlackButton(
            'All calls',
            {
                selectedEnvironment: actionObject.value.selectedEnvironment,
                selectedContract: actionObject.value.selectedContract,
                chainId: actionObject.chainId,
                chainName: actionObject.chainName
            },
            'query_contract_calls',
            'primary'
        ),
        slackBuilder.buildSimpleSlackButton(
            'All events',
            {
                selectedEnvironment: actionObject.value.selectedEnvironment,
                selectedContract: actionObject.value.selectedContract,
                chainId: actionObject.chainId,
                chainName: actionObject.chainName
            },
            'query_contract_events'
        )
    )

    return [actionObject, returnValue, messageBlocks, buttons]
}

export default action
