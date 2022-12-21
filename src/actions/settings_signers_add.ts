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
    console.log('settings_signers_add')
    try {
        await slackUtils.slackOpenView(
            actionObject.slackToken,
            slackBuilder.buildSlackModal(
                'Add signer',
                'settings_validate',
                [
                    slackBuilder.buildSimpleSectionMsg(
                        '',
                        'Add a new signer in your slack app that only you, <@' + parsedBody.user.name + '> will see.'
                    ),
                    {
                        type: 'divider'
                    },
                    slackBuilder.buildSimpleSlackHeaderMsg(`New signer`),
                    slackBuilder.buildSlackInput(
                        'Signer name',
                        'signer_name',
                        slackBuilder.buildSlackPlainTextInput('Enter signer name', 'signerName')
                    ),
                    slackBuilder.buildSlackInput(
                        'Signer pk',
                        'signer_pk',
                        slackBuilder.buildSlackPlainTextInput('Enter signer pk', 'signerPk')
                    ),
                    slackBuilder.buildSlackActionMsg({}, 'actions1', [
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
                            'select_',
                            'Which client/provider should we use?'
                        )
                    ])
                ],
                'Validate',
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
