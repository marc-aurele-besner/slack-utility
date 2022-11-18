import slackBuilder from '../slackBuilder'
import retrieveUserSettings from '../slackUtils/retrieveUserSettings'
import { TBlockElements, TBlocks, TNetwork, TReturnValue } from '../types'

const action = async (
    actionObject: any,
    parsedBody: any,
    messageBlocks: TBlocks,
    buttons: TBlockElements,
    returnValue: TReturnValue
) => {
    console.log('settings_networks')
    try {
        messageBlocks.push(slackBuilder.buildSimpleSlackHeaderMsg(`Current active networks:`))

        const userSettings = await retrieveUserSettings(actionObject.faunaDbToken, parsedBody.user.id)
        let networkList = ''
        if (userSettings && userSettings.networks) {
            const { networks } = userSettings
            if (networks.length > 0)
                networks
                    .filter((network: TNetwork) => network.active)
                    .map(
                        (network: TNetwork) =>
                            (networkList += `- ${network.name} (chainId: ${network.chainId}, rpcUrl: ${network.defaultRpc})\n`)
                    )
        }
        messageBlocks.push(
            slackBuilder.buildSimpleSectionMsg('', networkList),
            slackBuilder.buildSimpleSectionMsg(
                '',
                'You can change the networks settings to add, remove, or modify networks from the list.\nThis will be save as your personal settings.'
            )
        )
        buttons.push(
            slackBuilder.buildSimpleSlackButton(
                'Add network :heavy_plus_sign:',
                {
                    action: 'settings_networks_add',
                    team_settings:
                        actionObject.value === undefined
                            ? false
                            : JSON.parse(actionObject.value).team_settings !== undefined
                            ? JSON.parse(actionObject.value).team_settings
                            : false
                },
                'settings_networks_add',
                'primary'
            )
        )
        if (userSettings && userSettings.networks) {
            const { networks } = userSettings
            if (networks.length > 1)
                buttons.push(
                    slackBuilder.buildSimpleSlackSelection(
                        networks.map((network: TNetwork) => {
                            return {
                                name: network.name,
                                value: network.name
                            }
                        }),
                        'select_setting_network',
                        'Select network to remove'
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
