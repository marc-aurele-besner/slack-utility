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
    console.log('settings_apiKeys_add')
    try {
        await slackUtils.slackOpenView(
            actionObject.slackToken,
            slackBuilder.buildSlackModal(
                'Add apiKey',
                'settings_validate',
                [
                    slackBuilder.buildSimpleSectionMsg(
                        '',
                        'Add a new apiKey in your slack app that only you, <@' + parsedBody.user.name + '> will see.'
                    ),
                    {
                        type: 'divider'
                    },
                    slackBuilder.buildSimpleSlackHeaderMsg(`New apiKey`),
                    slackBuilder.buildSlackInput(
                        'ApiKey name',
                        'apiKey_name',
                        slackBuilder.buildSlackPlainTextInput('Enter apiKey name', 'apiKeyName')
                    ),
                    slackBuilder.buildSlackInput(
                        'ApiKey value',
                        'apiKey_value',
                        slackBuilder.buildSlackPlainTextInput('Enter apiKey value', 'apiKeyValue')
                    )
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
