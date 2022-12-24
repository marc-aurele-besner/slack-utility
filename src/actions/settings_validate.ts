import slackBuilder from '../slackBuilder'
import slackUtils from '../slackUtils'
import { TBlockElements, TBlocks, TReturnValue, TSettings } from '../types'

const action = async (
    actionObject: any,
    parsedBody: any,
    messageBlocks: TBlocks,
    buttons: TBlockElements,
    returnValue: TReturnValue
) => {
    try {
        console.log('settings_validate')
        const viewBlocks = []
        let viewTitle = ''
        let privateMetaData: any = { originalMessage: parsedBody.message.ts }
        if (parsedBody.view !== undefined && parsedBody.view.state !== undefined) {
            viewTitle = 'Add'
            privateMetaData.actionType = 'add'
            viewBlocks.push(slackBuilder.buildSimpleSectionMsg('', 'Please validate the information.'), {
                type: 'divider'
            })
            if (
                parsedBody.view.state.values.network_name !== undefined &&
                parsedBody.view.state.values.network_chainId !== undefined &&
                parsedBody.view.state.values.network_rpcUrl !== undefined &&
                parsedBody.view.state.values.network_type !== undefined
            ) {
                viewTitle += ' Network'
                viewBlocks.push(
                    slackBuilder.buildSimpleSectionMsg(
                        'Network name: ',
                        parsedBody.view.state.values.network_name.networkName.value
                    ),
                    slackBuilder.buildSimpleSectionMsg(
                        'Chain Id: ',
                        parsedBody.view.state.values.network_chainId.networkChainId.value
                    ),
                    slackBuilder.buildSimpleSectionMsg(
                        'RPC URL: ',
                        parsedBody.view.state.values.network_rpcUrl.networkRpcUrl.value
                    ),
                    slackBuilder.buildSimpleSectionMsg(
                        'Provider type: ',
                        parsedBody.view.state.values.network_type.networkType.selected_option.value
                    )
                )
            }
            if (parsedBody.view.state.values.contract_name !== undefined) {
                viewTitle += ' Contract'
                viewBlocks.push(
                    slackBuilder.buildSimpleSectionMsg(
                        'Contract name: ',
                        parsedBody.view.state.values.contract_name.contractName.value
                    )
                    // To-Do: Add address per network
                )
            }
            if (parsedBody.view.state.values.abis_name !== undefined) {
                viewTitle += ' ABI'
                viewBlocks.push(
                    slackBuilder.buildSimpleSectionMsg(
                        'ABI Name: ',
                        parsedBody.view.state.values.abis_name.abisName.value
                    ),
                    slackBuilder.buildSimpleSectionMsg('ABI', parsedBody.view.state.values.abis_abi.abisABI.value),
                    slackBuilder.buildSimpleSectionMsg(
                        'Byte Code: ',
                        parsedBody.view.state.values.abis_byteCode.abisByteCode.value
                    )
                )
            }
            if (parsedBody.view.state.values.apiKey_name !== undefined) {
                viewTitle += ' Api Key'
                viewBlocks.push(
                    slackBuilder.buildSimpleSectionMsg(
                        'API Key Name: ',
                        parsedBody.view.state.values.apiKey_name.apiKeyName.value
                    ),
                    slackBuilder.buildSimpleSectionMsg(
                        'API Key Value: ',
                        parsedBody.view.state.values.apiKey_value.apiKeyValue.value
                    )
                )
            }
            if (parsedBody.view.state.values.command_name !== undefined) {
                viewTitle += ' Command'
                viewBlocks.push(
                    slackBuilder.buildSimpleSectionMsg(
                        'Command: ',
                        parsedBody.view.state.values.command_name.commandName.value
                    )
                )
            }
            if (
                parsedBody.view.state.values.signer_name !== undefined &&
                parsedBody.view.state.values.signer_pk !== undefined
            ) {
                viewTitle += ' Signer'
                viewBlocks.push(
                    slackBuilder.buildSimpleSectionMsg(
                        'Signer name: ',
                        parsedBody.view.state.values.signer_name.signerName.value
                    ),
                    slackBuilder.buildSimpleSectionMsg(
                        'Signer pk: ',
                        parsedBody.view.state.values.signer_pk.signerPk.value
                    )
                )
            }
        } else if (parsedBody.state !== undefined && parsedBody.state.values !== undefined) {
            viewTitle = 'Delete'
            privateMetaData.actionType = 'delete'
            if (actionObject.localSettings && actionObject.localSettings.logLevel > 1)
                console.log('parsedBody.state.values', parsedBody.state.values)
            viewBlocks.push(slackBuilder.buildSimpleSectionMsg('', 'Please confirm you want to delete:'))
            if (
                parsedBody.state.values.actions1 !== undefined &&
                parsedBody.state.values.actions1.select_setting_network !== undefined &&
                parsedBody.state.values.actions1.select_setting_network.selected_option !== undefined
            ) {
                viewTitle += ' Network'
                privateMetaData.collection = 'networks'
                viewBlocks.push(
                    slackBuilder.buildSimpleSectionMsg(
                        'Network: ',
                        parsedBody.state.values.actions1.select_setting_network.selected_option.value
                    )
                )
                buttons.push(
                    slackBuilder.buildSimpleSlackButton(
                        'Delete',
                        {
                            action: 'settings_save',
                            subAction: 'delete_network',
                            value: parsedBody.state.values.actions1.select_setting_network.selected_option.value,
                            originalMessage: parsedBody.message.ts
                        },
                        'settings_save',
                        'danger'
                    )
                )
            }
            if (
                parsedBody.state.values.actions1 !== undefined &&
                parsedBody.state.values.actions1.select_setting_contract !== undefined &&
                parsedBody.state.values.actions1.select_setting_contract.selected_option !== undefined
            ) {
                viewTitle += '  Contract'
                privateMetaData.collection = 'contracts'
                viewBlocks.push(
                    slackBuilder.buildSimpleSectionMsg(
                        'Contract: ',
                        parsedBody.state.values.actions1.select_setting_contract.selected_option.value
                    )
                )
                buttons.push(
                    slackBuilder.buildSimpleSlackButton(
                        'Delete',
                        {
                            action: 'settings_save',
                            subAction: 'delete_contract',
                            value: parsedBody.state.values.actions1.select_setting_contract.selected_option.value,
                            originalMessage: parsedBody.message.ts
                        },
                        'settings_save',
                        'danger'
                    )
                )
            }
            if (
                parsedBody.state.values.actions1 !== undefined &&
                parsedBody.state.values.actions1.select_setting_abi !== undefined &&
                parsedBody.state.values.actions1.select_setting_abi.selected_option !== undefined
            ) {
                viewTitle += ' ABI'
                privateMetaData.collection = 'abis'
                viewBlocks.push(
                    slackBuilder.buildSimpleSectionMsg(
                        'Contract: ',
                        parsedBody.state.values.actions1.select_setting_abi.selected_option.value
                    )
                )
                buttons.push(
                    slackBuilder.buildSimpleSlackButton(
                        'Delete',
                        {
                            action: 'settings_save',
                            subAction: 'delete_abi',
                            value: parsedBody.state.values.actions1.select_setting_abi.selected_option.value,
                            originalMessage: parsedBody.message.ts
                        },
                        'settings_save',
                        'danger'
                    )
                )
            }
            if (
                parsedBody.state.values.actions1 !== undefined &&
                parsedBody.state.values.actions1.select_setting_apiKey !== undefined &&
                parsedBody.state.values.actions1.select_setting_apiKey.selected_option !== undefined
            ) {
                viewTitle += ' Api Key'
                privateMetaData.collection = 'apiKeys'
                viewBlocks.push(
                    slackBuilder.buildSimpleSectionMsg(
                        'Contract: ',
                        parsedBody.state.values.actions1.select_setting_abi.selected_option.value
                    )
                )
                buttons.push(
                    slackBuilder.buildSimpleSlackButton(
                        'Delete',
                        {
                            action: 'settings_save',
                            subAction: 'delete_apiKey',
                            value: parsedBody.state.values.actions1.select_setting_apiKey.selected_option.value,
                            originalMessage: parsedBody.message.ts
                        },
                        'settings_save',
                        'danger'
                    )
                )
            }
            if (
                parsedBody.state.values.actions1 !== undefined &&
                parsedBody.state.values.actions1.select_setting_signer !== undefined &&
                parsedBody.state.values.actions1.select_setting_signer.selected_option !== undefined
            ) {
                viewTitle += ' Signer'
                privateMetaData.collection = 'signers'
                viewBlocks.push(
                    slackBuilder.buildSimpleSectionMsg(
                        'Contract: ',
                        parsedBody.state.values.actions1.select_setting_signer.selected_option.value
                    )
                )
                buttons.push(
                    slackBuilder.buildSimpleSlackButton(
                        'Delete',
                        {
                            action: 'settings_save',
                            subAction: 'delete_signer',
                            value: parsedBody.state.values.actions1.select_setting_signer.selected_option.value,
                            originalMessage: parsedBody.message.ts
                        },
                        'settings_save',
                        'danger'
                    )
                )
            }
            if (
                parsedBody.state.values.actions1 !== undefined &&
                parsedBody.state.values.actions1.select_setting_command !== undefined &&
                parsedBody.state.values.actions1.select_setting_command.selected_option !== undefined
            ) {
                viewTitle += ' Command'
                privateMetaData.collection = 'commands'
                viewBlocks.push(
                    slackBuilder.buildSimpleSectionMsg(
                        'Contract: ',
                        parsedBody.state.values.actions1.select_setting_command.selected_option.value
                    )
                )
                buttons.push(
                    slackBuilder.buildSimpleSlackButton(
                        'Delete',
                        {
                            action: 'settings_save',
                            subAction: 'delete_command',
                            value: parsedBody.state.values.actions1.select_setting_command.selected_option.value,
                            originalMessage: parsedBody.message.ts
                        },
                        'settings_save',
                        'danger'
                    )
                )
            }
        }
        if (viewBlocks.length > 0) {
            if (
                parsedBody.view !== undefined &&
                parsedBody.view.state !== undefined &&
                parsedBody.view.state.values !== undefined
            )
                privateMetaData = {
                    ...privateMetaData,
                    ...parsedBody.state.values
                }
            if (parsedBody.view !== undefined && parsedBody.view.private_metadata !== undefined)
                privateMetaData = {
                    ...privateMetaData,
                    ...JSON.parse(parsedBody.view.private_metadata)
                }
            console.log('keys', Object.keys(parsedBody.state.values.actions1))
            if (
                parsedBody.state !== undefined &&
                parsedBody.state.values !== undefined &&
                parsedBody.state.values.actions1 !== undefined &&
                Object.keys(parsedBody.state.values.actions1).find((item: string) =>
                    item.startsWith('select_setting_')
                ) !== undefined
            ) {
                const extraValues = Object.keys(parsedBody.state.values.actions1).find((item: string) =>
                    item.startsWith('select_setting_')
                ) as string
                privateMetaData = {
                    ...privateMetaData,
                    ...parsedBody.state.values.actions1[extraValues]
                }
            }
            await slackUtils.slackOpenView(
                actionObject.slackToken,
                slackBuilder.buildSlackModal(
                    viewTitle,
                    'settings_save',
                    viewBlocks,
                    'Submit',
                    'Close',
                    privateMetaData
                ),
                parsedBody.trigger_id
            )
        }
    } catch (error) {
        console.log('error', error)
        messageBlocks.push(slackBuilder.buildSimpleSlackHeaderMsg(`:x: Error: ${error}`))
    }

    return [actionObject, returnValue, messageBlocks, buttons]
}

export default action
