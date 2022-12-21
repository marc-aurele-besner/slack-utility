import slackBuilder from '../slackBuilder'
import retrieveUserSettings from '../slackUtils/retrieveUserSettings'
import { TBlockElements, TBlocks, TReturnValue, TSigner } from '../types'

const action = async (
    actionObject: any,
    parsedBody: any,
    messageBlocks: TBlocks,
    buttons: TBlockElements,
    returnValue: TReturnValue
) => {
    console.log('settings_signers')
    try {
        messageBlocks.push(slackBuilder.buildSimpleSlackHeaderMsg(`Current active signers:`))

        const userSettings = await retrieveUserSettings(
            actionObject.faunaDbToken,
            parsedBody.user.id,
            parsedBody.team.id
        )
        let signerList = ''
        if (userSettings && userSettings.signers) {
            const { signers } = userSettings
            if (signers.length > 0) {
                signers
                    .filter((signer: TSigner) => signer.active)
                    .map((signer: TSigner) => (signerList += `- ${signer.name}\n`))
                messageBlocks.push(slackBuilder.buildSimpleSectionMsg('', `\n\`\`\`\n${signerList}\`\`\``))
            }
        }
        messageBlocks.push(
            slackBuilder.buildSimpleSectionMsg(
                '',
                'You can change the signers settings to add, remove, or modify signers from the list.\nThis will be save as your personal settings.'
            )
        )
        buttons.push(
            slackBuilder.buildSimpleSlackButton(
                'Add signer :heavy_plus_sign:',
                {
                    action: 'settings_signers_add',
                    team_settings:
                        actionObject.value === undefined
                            ? false
                            : JSON.parse(actionObject.value).team_settings !== undefined
                            ? JSON.parse(actionObject.value).team_settings
                            : false
                },
                'settings_signers_add',
                'primary'
            )
        )
        if (userSettings && userSettings.signers) {
            const { signers } = userSettings
            if (signers.length > 1)
                buttons.push(
                    slackBuilder.buildSimpleSlackSelection(
                        signers.map((signer: TSigner) => {
                            return {
                                name: signer.name,
                                value: signer.name
                            }
                        }),
                        'select_setting_signer',
                        'Select signer to remove'
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
