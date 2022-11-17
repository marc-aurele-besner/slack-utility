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
                    // {
                    //     type: 'image',
                    //     image_url: 'https://media.giphy.com/media/SVZGEcYt7brkFUyU90/giphy.gif',
                    //     alt_text: 'Yay! The modal was updated'
                    // },
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
                    {
                        type: 'actions',
                        block_id: 'network_type',
                        elements: [
                            {
                                type: 'static_select',
                                placeholder: {
                                    type: 'plain_text',
                                    text: 'Which client/provider should we use?'
                                },
                                action_id: 'networkType',
                                options: [
                                    {
                                        text: {
                                            type: 'plain_text',
                                            text: 'EVM - Ethers.js'
                                        },
                                        value: 'ethers'
                                    },
                                    {
                                        text: {
                                            type: 'plain_text',
                                            text: 'Tron - TronWeb'
                                        },
                                        value: 'tronweb'
                                    }
                                ]
                            }
                        ]
                    }
                ],
                'Submit',
                'Close'
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
