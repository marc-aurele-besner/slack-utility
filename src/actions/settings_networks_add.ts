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
    console.log('settings_networks_add')
    try {
        await slackUtils.slackOpenView(
            actionObject.slackToken,
            slackBuilder.buildSlackModal(
                'Add network',
                'settings_validate',
                [
                    slackBuilder.buildSimpleSectionMsg(
                        '',
                        'Add a new network in your slack app that only you, <@' + parsedBody.user.name + '> will see.'
                    ),
                    {
                        type: 'divider'
                    },
                    slackBuilder.buildSimpleSlackHeaderMsg(`New network`),
                    slackBuilder.buildSlackInput(
                        'Network name',
                        'network_name',
                        slackBuilder.buildSlackPlainTextInput('Enter network name', 'networkName')
                    ),
                    slackBuilder.buildSlackInput(
                        'Network chain Id',
                        'network_chainId',
                        slackBuilder.buildSlackNumberInput('networkChainId')
                    ),
                    slackBuilder.buildSlackInput(
                        'Network RPC URL',
                        'network_rpcUrl',
                        slackBuilder.buildSlackPlainTextInput('Enter network RPC URL', 'networkRpcUrl')
                    ),
                    slackBuilder.buildSlackActionMsg({}, 'network_type', [
                        slackBuilder.buildSimpleSlackSelection(
                            [
                                {
                                    name: 'EVM - Ethers.js',
                                    value: 'ethers'
                                }
                                // {
                                //     name: 'Tron - TronWeb',
                                //     value: 'tronweb'
                                // }
                            ],
                            'networkType',
                            'Which client/provider should we use?'
                        )
                    ])
                ],
                'Submit',
                'Close',
                {
                    team_settings:
                        actionObject.value === undefined
                            ? false
                            : JSON.parse(actionObject.value).team_settings !== undefined
                            ? JSON.parse(actionObject.value).team_settings
                            : false,
                    channel_id: parsedBody.channel.id,
                    originalMessage: parsedBody.container.message_ts
                }
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
