import slackBuilder from '../slackBuilder'
import retrieveUserSettings from '../slackUtils/retrieveUserSettings'
import { TAbi, TBlockElements, TBlocks, TReturnValue } from '../types'

const action = async (
    actionObject: any,
    parsedBody: any,
    messageBlocks: TBlocks,
    buttons: TBlockElements,
    returnValue: TReturnValue
) => {
    console.log('settings_abis')
    try {
        messageBlocks.push(slackBuilder.buildSimpleSlackHeaderMsg(`Current active abis:`))

        const userSettings = await retrieveUserSettings(actionObject.faunaDbToken, parsedBody.user.id)
        let abiList = ''
        if (userSettings && userSettings.abis) {
            const { abis } = userSettings
            if (abis.length > 0)
                abis.filter((abi: TAbi) => abi.active).map((abi: TAbi) => (abiList += `- ${abi.name}\n`))
        }
        messageBlocks.push(
            slackBuilder.buildSimpleSectionMsg('', abiList),
            slackBuilder.buildSimpleSectionMsg(
                '',
                'You can change the abis settings to add, remove, or modify abis from the list.\nThis will be save as your personal settings.'
            )
        )
        buttons.push(
            slackBuilder.buildSimpleSlackButton(
                'Add abi :heavy_plus_sign:',
                {
                    action: 'settings_abis_add',
                    team_settings:
                        actionObject.value === undefined
                            ? false
                            : JSON.parse(actionObject.value).team_settings !== undefined
                            ? JSON.parse(actionObject.value).team_settings
                            : false
                },
                'settings_abis_add',
                'primary'
            )
        )
        if (userSettings && userSettings.abis) {
            const { abis } = userSettings
            if (abis.length > 1)
                buttons.push(
                    slackBuilder.buildSimpleSlackSelection(
                        abis.map((abi: TAbi) => {
                            return {
                                name: abi.name,
                                value: abi.name
                            }
                        }),
                        'select_setting_abi',
                        'Select abi to remove'
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
