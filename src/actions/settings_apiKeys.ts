import slackBuilder from '../slackBuilder'
import { TBlockElements, TBlocks, TReturnValue } from '../types'

const action = async (
    actionObject: any,
    parsedBody: any,
    messageBlocks: TBlocks,
    buttons: TBlockElements,
    returnValue: TReturnValue
) => {
    console.log('settings_apiKeys')

    messageBlocks.push(
        slackBuilder.buildSimpleSlackHeaderMsg(`API integration settings:`),
        slackBuilder.buildSimpleSectionMsg(
            ``,
            'Etherscan: <etherscabApiKey>\nChainstack: <chainstackApiKey>\nInfura: <infuraApiKey>\nAlchemy: <alchemyApiKey>\n'
        ),
        slackBuilder.buildSlackInput(
            'API Keys to use',
            'settings_save_input',
            slackBuilder.buildSlackMultilineInput(
                'ENV to use',
                'apiKeys_input',
                JSON.stringify({
                    etherscanApiKey: 'etherscanApiKey',
                    chainStackApiKey: 'chainstackApiKey',
                    infuraApiKey: 'infuraApiKey',
                    alchemyApiKey: 'alchemy'
                }),
                true
            )
        )
    )
    buttons.push(
        slackBuilder.buildSimpleSlackButton(
            'Save :floppy_disk:',
            JSON.stringify(
                {
                    action: 'settings_save',
                    section: 'apiKeys',
                    settings: actionObject.env || {}
                },
                null,
                2
            ),
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
