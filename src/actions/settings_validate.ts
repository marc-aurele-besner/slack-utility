import slackBuilder from '../slackBuilder'
import slackUtils from '../slackUtils'
import { TBlockElements, TBlocks, TReturnValue, TSettings } from '../types'

const action = async (
    actionObject: any,
    parsedBody: any,
    messageBlocks: TBlocks,
    buttons: TBlockElements,
    returnValue: TReturnValue
) => {
    console.log(
        'settings_validate',
        parsedBody.view.state.values,
        parsedBody.view.state.values.network_type.networkType.selected_option.value
    )
    try {
        const viewBlocks = []
        viewBlocks.push(slackBuilder.buildSimpleSectionMsg('', 'Please validate the information.'), { type: 'divider' })
        if (
            parsedBody.view.state.values.network_name !== undefined &&
            parsedBody.view.state.values.network_chainId !== undefined &&
            parsedBody.view.state.values.network_rpcUrl !== undefined &&
            parsedBody.view.state.values.network_type !== undefined
        )
            viewBlocks.push(
                slackBuilder.buildSimpleSectionMsg('Name', parsedBody.view.state.values.network_name.networkName.value),
                slackBuilder.buildSimpleSectionMsg(
                    'Chain Id',
                    parsedBody.view.state.values.network_chainId.networkChainId.value
                ),
                slackBuilder.buildSimpleSectionMsg(
                    'RPC URL',
                    parsedBody.view.state.values.network_rpcUrl.networkRpcUrl.value
                ),
                slackBuilder.buildSimpleSectionMsg(
                    'Provider type',
                    parsedBody.view.state.values.network_type.networkType.selected_option.value
                )
            )
        if (viewBlocks.length > 0)
            await slackUtils.slackOpenView(
                actionObject.slackToken,
                slackBuilder.buildSlackModal(
                    'Add network',
                    'settings_save',
                    viewBlocks,
                    'Submit',
                    'Close',
                    parsedBody.view.state.values
                ),
                parsedBody.trigger_id
            )
    } catch (error) {
        console.log('error', error)
        messageBlocks.push(slackBuilder.buildSimpleSlackHeaderMsg(`:x: Error: ${error}`))
    }

    return [actionObject, returnValue, messageBlocks, buttons]
}

export default action
