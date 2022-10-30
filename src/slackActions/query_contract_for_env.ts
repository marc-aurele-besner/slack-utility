import { utils } from 'ethers'

import { slackBuilder } from '../slackBuilder'

const action = async (actionObject: any, parsedBody: any, messageBlocks: any[], buttons: any[], returnValue: any) => {
    console.log('query_contract_for_env', actionObject.selectedContract)
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
            JSON.stringify({
                selectedEnvironment: actionObject.value.selectedEnvironment,
                selectedContract: actionObject.value.selectedContract,
                chainId: actionObject.chainId,
                chainName: actionObject.chainName
            }),
            'query_contract_calls',
            'primary'
        )
    )

    return [actionObject, returnValue, messageBlocks, buttons]
}

export default action
