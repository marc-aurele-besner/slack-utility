import slackBuilder from '../slackBuilder'
import { TBlockElements, TBlocks, TNetwork, TReturnValue } from '../types'

const action = async (
    actionObject: any,
    parsedBody: any,
    messageBlocks: TBlocks,
    buttons: TBlockElements,
    returnValue: TReturnValue
) => {
    console.log('settings_contracts_add')
    try {
        messageBlocks.push(slackBuilder.buildSimpleSlackHeaderMsg(`Contracts settings:`))
        if (actionObject.env) {
            const { networks } = actionObject.env
            messageBlocks.push(slackBuilder.buildSimpleSectionMsg('', 'Add a new contract in the slack app.'))
            buttons.push(
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
                slackBuilder.buildSimpleSlackButton('Save :floppy_disk:', { action: 'settings_save' }, 'settings_save'),
                slackBuilder.buildSimpleSlackButton(
                    'Cancel :x:',
                    { action: 'settings_contracts' },
                    'settings_contracts'
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
