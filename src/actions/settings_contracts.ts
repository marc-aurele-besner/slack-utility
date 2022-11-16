import slackBuilder from '../slackBuilder'
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
        if (actionObject.env) {
            const { contracts } = actionObject.env
            let contractsList = ''
            contracts
                .filter((contract: any) => contract.active)
                .map((contract: any) => (contractsList += `- ${contract.name} (default)\n`))
            console.log('contractsList', JSON.stringify(contracts))
            messageBlocks.push(
                slackBuilder.buildSimpleSectionMsg('', contractsList),
                slackBuilder.buildSimpleSectionMsg(
                    '',
                    'You can change the contracts settings to add, remove, or modify from the list.\nThis will be save as your personal settings.'
                )
            )
            buttons.push(
                slackBuilder.buildSimpleSlackButton(
                    'Add contract :heavy_plus_sign:',
                    { action: 'settings_contracts_add' },
                    'settings_contracts_add'
                ),
                // To-Do: Change the data for user networks
                slackBuilder.buildSimpleSlackSelection(
                    contracts.map((contract: TContract) => {
                        return {
                            name: contract.name,
                            value: contract.name
                        }
                    }),
                    'select_setting_contract',
                    'Select contract to remove or edit'
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
