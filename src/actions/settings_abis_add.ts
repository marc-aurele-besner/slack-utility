import slackBuilder from '../slackBuilder'
import slackUtils from '../slackUtils'
import { TBlockElements, TBlocks, TReturnValue } from '../types'

const action = async (
    actionObject: any,
    parsedBody: any,
    messageBlocks: TBlocks,
    buttons: TBlockElements,
    returnValue: TReturnValue
) => {
    console.log('settings_abiss_add')
    try {
        await slackUtils.slackOpenView(
            actionObject.slackToken,
            slackBuilder.buildSlackModal(
                'Add abis',
                'settings_validate',
                [
                    slackBuilder.buildSimpleSectionMsg(
                        '',
                        'Add a new abis in your slack app that only you, <@' + parsedBody.user.name + '> will see.'
                    ),
                    {
                        type: 'divider'
                    },
                    slackBuilder.buildSimpleSlackHeaderMsg(`New abis`),
                    slackBuilder.buildSlackInput(
                        'Abis name',
                        'abis_name',
                        slackBuilder.buildSlackPlainTextInput('Enter abis name', 'abisName')
                    ),
                    slackBuilder.buildSlackInput(
                        'Abis ABI',
                        'abis_abi',
                        slackBuilder.buildSlackMultilineInput('Enter abis ABI', 'abisABI')
                    ),
                    slackBuilder.buildSlackInput(
                        'Abis byteCode',
                        'abis_byteCode',
                        slackBuilder.buildSlackMultilineInput('Enter abis Byte Code', 'abisByteCode')
                    )
                ],
                'Submit',
                'Close',
                {
                    team_settings:
                        actionObject.value === undefined
                            ? false
                            : JSON.parse(actionObject.value).team_settings !== undefined
                            ? JSON.parse(actionObject.value).team_settings
                            : false
                }
            ),
            parsedBody.trigger_id
        )
    } catch (error) {
        console.log('error', error)
        messageBlocks.push(slackBuilder.buildSimpleSlackHeaderMsg(`:x: Error: ${error}`))
    }

    return [actionObject, returnValue, messageBlocks, buttons]
}

export default action
