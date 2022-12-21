import slackBuilder from '../slackBuilder'
import retrieveTeamSettings from '../slackUtils/retrieveTeamSettings'
import { TBlockElements, TBlocks, TCommand, TReturnValue } from '../types'

const action = async (
    actionObject: any,
    parsedBody: any,
    messageBlocks: TBlocks,
    buttons: TBlockElements,
    returnValue: TReturnValue
) => {
    console.log('settings_commands')
    try {
        messageBlocks.push(slackBuilder.buildSimpleSlackHeaderMsg(`Current active commands:`))

        const teamSettings = await retrieveTeamSettings(actionObject.faunaDbToken, parsedBody.team.id)
        let commandList = ''
        if (teamSettings && teamSettings.commands) {
            const { commands } = teamSettings
            if (commands.length > 0) {
                commands
                    .filter((command: TCommand) => command.active)
                    .map((command: TCommand) => (commandList += `- ${command.command}\n`))
                messageBlocks.push(slackBuilder.buildSimpleSectionMsg('', `\n\`\`\`\n${commandList}\`\`\``))
            }
        }
        messageBlocks.push(
            slackBuilder.buildSimpleSectionMsg(
                '',
                'You can change the commands settings to add, remove, or modify commands from the list.\nThis will be save as your personal settings.'
            )
        )
        buttons.push(
            slackBuilder.buildSimpleSlackButton(
                'Add command :heavy_plus_sign:',
                {
                    action: 'settings_commands_add',
                    team_settings:
                        actionObject.value === undefined
                            ? false
                            : JSON.parse(actionObject.value).team_settings !== undefined
                            ? JSON.parse(actionObject.value).team_settings
                            : false
                },
                'settings_commands_add',
                'primary'
            )
        )
        if (teamSettings && teamSettings.commands) {
            const { commands } = teamSettings
            if (commands.length > 1)
                buttons.push(
                    slackBuilder.buildSimpleSlackSelection(
                        commands.map((command: TCommand) => {
                            return {
                                name: command.command,
                                value: command.command
                            }
                        }),
                        'select_setting_command',
                        'Select command to remove'
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
