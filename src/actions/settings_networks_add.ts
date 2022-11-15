import slackBuilder from '../slackBuilder'
import { TBlockElements, TBlocks, TReturnValue } from '../types'

const action = async (
    actionObject: any,
    parsedBody: any,
    messageBlocks: TBlocks,
    buttons: TBlockElements,
    returnValue: TReturnValue
) => {
    messageBlocks.push(slackBuilder.buildSimpleSlackHeaderMsg(`Current active networks:`))
    if (actionObject.env) {
        const { networks } = actionObject.env
        messageBlocks.push(slackBuilder.buildSimpleSectionMsg('', 'Add a new network in the slack app.'))
        buttons.push(
            slackBuilder.buildSimpleSlackButton('Save :floppy_disk:', { action: 'settings_save' }, 'settings_save'),
            slackBuilder.buildSimpleSlackButton('Cancel :x:', { action: 'settings_contracts' }, 'settings_contracts')
        )
    }

    return [actionObject, returnValue, messageBlocks, buttons]
}

export default action
