import slackBuilder from '../slackBuilder'
import { TBlockElements, TBlocks, TReturnValue } from '../types'

const action = async (
    actionObject: any,
    parsedBody: any,
    messageBlocks: TBlocks,
    buttons: TBlockElements,
    returnValue: TReturnValue
) => {
    console.log('settings_signers')
    messageBlocks.push(slackBuilder.buildSimpleSlackHeaderMsg(`Signers settings:`))
    if (actionObject.env) {
        // const { contracts } = actionObject.env

        messageBlocks.push(
            slackBuilder.buildSimpleSectionMsg(
                ``,
                'Set 5 signers private keys to use for tests purposes. You can use the same private key for all signers or different ones.\n'
            ),
            slackBuilder.buildSlackInput(
                'Signers to use',
                'settings_save_input',
                slackBuilder.buildSlackMultilineInput(
                    'Signers to use',
                    'signers_input',
                    JSON.stringify({
                        Signer1: '',
                        Signer2: '',
                        Signer3: '',
                        Signer4: '',
                        Signer5: ''
                    }),
                    true
                )
            )
        )
        buttons.push(
            slackBuilder.buildSimpleSlackButton(
                'Save :floppy_disk:',
                JSON.stringify({
                    action: 'settings_save',
                    section: 'signers',
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
    }

    return [actionObject, returnValue, messageBlocks, buttons]
}

export default action
