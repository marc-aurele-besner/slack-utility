import slackBuilder from '../slackBuilder'
import { TBlockElements, TBlocks, TReturnValue } from '../types'

const action = async (
    actionObject: any,
    parsedBody: any,
    messageBlocks: TBlocks,
    buttons: TBlockElements,
    returnValue: TReturnValue
) => {
    const { networks } = actionObject

    let networkList = ''
    networks.filter((network: any) => network.active).map((network: any) => (networkList += `- ${network.name}\n`))
    messageBlocks.push(
        slackBuilder.buildSimpleSlackHeaderMsg(`Current active networks:`),
        slackBuilder.buildSimpleSectionMsg('', networkList),
        slackBuilder.buildSimpleSectionMsg(
            '',
            'You can change the networks settings to add or remove networks from the list.\nThis will be save as your personal settings.'
        ),
        slackBuilder.buildSlackInput(
            'Networks settings (JSON)',
            'settings_save_input',
            slackBuilder.buildSlackMultilineInput(
                'List of networks' + networkList,
                'networks_input',
                JSON.stringify(networks),
                true
            )
        )
    )
    buttons.push(
        slackBuilder.buildSimpleSlackButton(
            'Save :floppy_disk:',
            JSON.stringify({
                action: 'settings_save',
                section: 'networks',
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
