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
    console.log('settings_link_to_dapp')
    try {
        await slackUtils.slackOpenView(
            actionObject.slackToken,
            slackBuilder.buildSlackModal(
                'Link to DAPP',
                'settings_link_to_dapp',
                [
                    slackBuilder.buildSimpleSectionMsg(
                        '',
                        'Visit our DAPP to connect your wallet and share the same user settings between this app and the DAPP, this will only be for you, <@' +
                            parsedBody.user.name +
                            '>.'
                    ),
                    {
                        type: 'divider'
                    },
                    slackBuilder.buildSimpleSlackHeaderMsg(`Connect your slack account with your wallet`),
                    slackBuilder.buildSlackActionMsg(
                        {},
                        'Link to DAPP',
                        [
                            slackBuilder.buildLinkSlackButton(
                                'Link to DAPP :link:',
                                undefined,
                                'settings_link_to_dapp',
                                'primary',
                                actionObject.dappUrl + 'slackLink/' + parsedBody.team.id + '_' + parsedBody.user.id
                            )
                        ],
                        false
                    )
                ],
                'Submit',
                'Close',
                {
                    link_to_dapp: true
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
