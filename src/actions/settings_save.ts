import slackBuilder from '../slackBuilder'
import { TBlockElements, TBlocks, TReturnValue } from '../types'

const action = async (
    actionObject: any,
    parsedBody: any,
    messageBlocks: TBlocks,
    buttons: TBlockElements,
    returnValue: TReturnValue
) => {
    console.log('settings_contracts')

    if (parsedBody.state.values.settings_save_input) {
        const settings: {
            apiKeys: string
            contracts: string
            networks: string
            signers: string
        } = {
            apiKeys: '',
            contracts: '',
            networks: '',
            signers: ''
        }
        if (parsedBody.state.values.settings_save_input.apiKeys_input)
            settings.apiKeys = parsedBody.state.values.settings_save_input.apiKeys_input.value || ''
        if (parsedBody.state.values.settings_save_input.contracts_input)
            settings.contracts = parsedBody.state.values.settings_save_input.contracts_input.value || ''
        if (parsedBody.state.values.settings_save_input.networks_input)
            settings.networks = parsedBody.state.values.settings_save_input.networks_input.value || ''
        if (parsedBody.state.values.settings_save_input.signers_input)
            settings.signers = parsedBody.state.values.settings_save_input.signers_input.value || ''
        console.log('newSettings', settings)
    }

    messageBlocks.push(slackBuilder.buildSimpleSlackHeaderMsg(`Settings saved!`))

    return [actionObject, returnValue, messageBlocks, buttons]
}

export default action
