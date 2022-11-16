import slackBuilder from '../slackBuilder'
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
        if (actionObject.env) {
            const { networks } = actionObject.env

            let networkList = ''
            networks
                .filter((network: any) => network.active)
                .map((network: any) => (networkList += `- ${network.name} (default)\n`))
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
                    { action: 'settings_networks_add' },
                    'settings_networks_add'
                ),
                // To-Do: Change the data for user networks
                slackBuilder.buildSimpleSlackSelection(
                    networks.map((network: TNetwork) => {
                        return {
                            name: network.name,
                            value: network.name
                        }
                    }),
                    'select_setting_network',
                    'Select network to remove or edit'
                ),
                slackBuilder.buildSimpleSlackButton('Modify :gear:', { action: 'settings_modify' }, 'settings_modify'),
                slackBuilder.buildSimpleSlackButton('Remove :x:', { action: 'settings_confirm' }, 'settings_confirm')
            )
        }
    } catch (error) {
        console.log('error', error)
        messageBlocks.push(slackBuilder.buildSimpleSlackHeaderMsg(`:x: Error: ${error}`))
    }

    return [actionObject, returnValue, messageBlocks, buttons]
}

export default action
