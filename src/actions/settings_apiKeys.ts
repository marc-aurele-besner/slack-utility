import slackBuilder from '../slackBuilder'
import retrieveUserSettings from '../slackUtils/retrieveUserSettings'
import { TApiKey, TBlockElements, TBlocks, TReturnValue } from '../types'

const action = async (
    actionObject: any,
    parsedBody: any,
    messageBlocks: TBlocks,
    buttons: TBlockElements,
    returnValue: TReturnValue
) => {
    console.log('settings_apiKeys')
    try {
        messageBlocks.push(slackBuilder.buildSimpleSlackHeaderMsg(`Current active apiKeys:`))

        const userSettings = await retrieveUserSettings(
            actionObject.faunaDbToken,
            parsedBody.user.id,
            parsedBody.team.id
        )
        let apiKeyList = ''
        if (userSettings && userSettings.apiKeys) {
            const { apiKeys } = userSettings
            if (apiKeys.length > 0)
                apiKeys
                    .filter((apiKey: TApiKey) => apiKey.active)
                    .map((apiKey: TApiKey) => (apiKeyList += `- ${apiKey.name}\n`))
        }
        messageBlocks.push(
            slackBuilder.buildSimpleSectionMsg('', apiKeyList),
            slackBuilder.buildSimpleSectionMsg(
                '',
                'You can change the apiKeys settings to add, remove, or modify apiKeys from the list.\nThis will be save as your personal settings.'
            )
        )
        buttons.push(
            slackBuilder.buildSimpleSlackButton(
                'Add apiKey :heavy_plus_sign:',
                {
                    action: 'settings_apiKeys_add',
                    team_settings:
                        actionObject.value === undefined
                            ? false
                            : JSON.parse(actionObject.value).team_settings !== undefined
                            ? JSON.parse(actionObject.value).team_settings
                            : false
                },
                'settings_apiKeys_add',
                'primary'
            )
        )
        if (userSettings && userSettings.apiKeys) {
            const { apiKeys } = userSettings
            if (apiKeys.length > 1)
                buttons.push(
                    slackBuilder.buildSimpleSlackSelection(
                        apiKeys.map((apiKey: TApiKey) => {
                            return {
                                name: apiKey.name,
                                value: apiKey.name
                            }
                        }),
                        'select_setting_apiKey',
                        'Select apiKey to remove'
                    ),
                    slackBuilder.buildSimpleSlackButton(
                        'Remove :x:',
                        {
                            action: 'settings_validate',
                            team_settings:
                                actionObject.value === undefined
                                    ? false
                                    : JSON.parse(actionObject.value).team_settings !== undefined
                                    ? JSON.parse(actionObject.value).team_settings
                                    : false
                        },
                        'settings_validate'
                    )
                )
        }
    } catch (error) {
        console.log('error', error)
        messageBlocks.push(slackBuilder.buildSimpleSlackHeaderMsg(`:x: Error: ${error}`))
    }

    return [actionObject, returnValue, messageBlocks, buttons]
}

export default action
