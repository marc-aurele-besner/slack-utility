import slackBuilder from '../slackBuilder'
import retrieveUserSettings from '../slackUtils/retrieveUserSettings'
import { TBlockElements, TBlocks, TContract, TReturnValue } from '../types'

const action = async (
    actionObject: any,
    parsedBody: any,
    messageBlocks: TBlocks,
    buttons: TBlockElements,
    returnValue: TReturnValue
) => {
    console.log('settings_contracts')
    try {
        messageBlocks.push(slackBuilder.buildSimpleSlackHeaderMsg(`Current active contracts:`))

        const userSettings = await retrieveUserSettings(
            actionObject.faunaDbToken,
            parsedBody.user.id,
            parsedBody.team.id
        )
        let contractList = ''
        if (userSettings && userSettings.contracts) {
            const { contracts } = userSettings
            if (contracts.length > 0) {
                contracts
                    .filter((contract: TContract) => contract.active)
                    .map((contract: TContract) => (contractList += `- ${contract.name}\n`))
                messageBlocks.push(slackBuilder.buildSimpleSectionMsg('', `\n\`\`\`\n${contractList}\`\`\``))
            }
        }
        messageBlocks.push(
            slackBuilder.buildSimpleSectionMsg(
                '',
                'You can change the contracts settings to add, remove, or modify contracts from the list.\nThis will be save as your personal settings.'
            )
        )
        buttons.push(
            slackBuilder.buildSimpleSlackButton(
                'Add contract :heavy_plus_sign:',
                {
                    action: 'settings_contracts_add',
                    team_settings:
                        actionObject.value === undefined
                            ? false
                            : JSON.parse(actionObject.value).team_settings !== undefined
                            ? JSON.parse(actionObject.value).team_settings
                            : false
                },
                'settings_contracts_add',
                'primary'
            )
        )
        if (userSettings && userSettings.contracts) {
            const { contracts } = userSettings
            if (contracts.length > 1)
                buttons.push(
                    slackBuilder.buildSimpleSlackSelection(
                        contracts.map((contract: TContract) => {
                            return {
                                name: contract.name,
                                value: contract.name
                            }
                        }),
                        'select_setting_contract',
                        'Select contract to remove'
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
