import { slackBuilder } from '../slackBuilder'

const action = async (actionObject: any, parsedBody: any, messageBlocks: any[], buttons: any[], returnValue: any) => {
    const { contracts } = actionObject
    console.log('settings_contracts')

    let contractsList = ''
    contracts
        .filter((contract: any) => contract.active)
        .map((contract: any) => (contractsList += `- ${contract.name}\n`))
    console.log('contractsList', JSON.stringify(contracts))
    messageBlocks.push(
        slackBuilder.buildSimpleSlackHeaderMsg(`Contracts settings:`),
        slackBuilder.buildSimpleSectionMsg('', 'Contracts:\n' + contractsList),
        slackBuilder.buildSimpleSectionMsg(
            '',
            'You can change the contracts settings to add or remove contracts from the list.\nThis will be save as your personal settings.'
        ),
        slackBuilder.buildSlackInput(
            'Contracts settings (JSON)',
            'settings_save_input',
            slackBuilder.buildSlackMultilineInput(
                'List of contracts' + contractsList,
                'contracts_input',
                JSON.stringify(contracts),
                true
            )
        )
    )
    buttons.push(
        slackBuilder.buildSimpleSlackButton(
            'Save :floppy_disk:',
            JSON.stringify({
                action: 'settings_save',
                section: 'contracts',
                settings: actionObject.env || {}
            }),
            'settings_save'
        ),
        slackBuilder.buildSimpleSlackButton(
            'Cancel :x:',
            JSON.stringify({
                action: 'settings'
            }),
            'settings'
        )
    )

    return [actionObject, returnValue, messageBlocks, buttons]
}

export default action
