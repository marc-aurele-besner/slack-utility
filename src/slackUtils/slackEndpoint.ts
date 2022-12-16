import actions from '../actions'
import { TEnv, TLocalAppSettings, TSupportedDB } from '../types'

import actionsLoop from './actionsLoop'
import commandsLoop from './commandsLoop'
import retrieveTeamSettings from './retrieveTeamSettings'
import retrieveUserSettings from './retrieveUserSettings'

const defaultLocalSettings: TLocalAppSettings = {
    useDapp: true,
    useAppForSigner: true,
    allowTeamSettings: true,
    allowUserSettings: true,
    dbType: 'faunaDB',
    logLevel: 1,
    addDeleteButtons: true,
    addSettingsButton: true,
    addRefreshButton: true,
    addNetworkAndContractSelector: true
}

const slackEndpoint = async (
    event: any,
    env: TEnv,
    slackToken: string,
    faunaDbToken: string,
    slackDefaultConversationId: string,
    dappUrl: string,
    localActions: any,
    rpcEthereumUrl: string,
    abis: any,
    localSettings = defaultLocalSettings as TLocalAppSettings
) => {
    let parsedBody: any
    let bodyIsParsed = false
    let returnBody = 'Ok'

    try {
        const { body } = event
        const action = decodeURIComponent(body)
        // Verify action starts with 'payload=' (slack interactivity path)
        if (action.startsWith('payload=')) {
            try {
                parsedBody = JSON.parse(action.substring(8))
                bodyIsParsed = true
            } catch (error) {
                console.log('error', error)
            }
        }
        // Handle plain text (events and challenges)
        if (!bodyIsParsed && typeof event.body !== 'string') {
            try {
                parsedBody = JSON.parse(body)
                bodyIsParsed = true
            } catch (error) {
                console.log('error', error)
            }
        }
        if (!bodyIsParsed)
            try {
                // command path
                parsedBody = action.split('&').reduce((acc, item) => {
                    const [key, value] = item.split('=')
                    acc[key] = value
                    return acc
                }, {} as any)
                bodyIsParsed = true
            } catch (error) {
                console.log('error', error)
            }
        // Set up the blocks and buttons
        let messageBlocks: any[] = []
        let buttons: any[] = []
        // Set up the return value
        let returnValue = {
            statusCode: 200,
            body: 'SMC Bot'
        }
        if (bodyIsParsed) {
            // ACTIONS
            if (localSettings.logLevel > 0) console.log('parsedBody', parsedBody)
            const basicSettings = {
                contracts: env.contracts,
                networks: env.networks,
                abis: [{}],
                apiKeys: [{}],
                signers: [{}],
                commands: env.commands
            }
            try {
                if (
                    localSettings.allowTeamSettings &&
                    parsedBody.team !== undefined &&
                    parsedBody.team.id !== undefined
                ) {
                    const teamSettings = await retrieveTeamSettings(faunaDbToken, parsedBody.team.id)
                    if (localSettings.logLevel > 1) console.log('teamSettings', teamSettings)
                    if (teamSettings !== null) {
                        if (basicSettings.contracts === undefined) basicSettings.contracts = teamSettings.contracts
                        else basicSettings.contracts = [...basicSettings.contracts, ...teamSettings.contracts]
                        if (basicSettings.networks === undefined) basicSettings.networks = teamSettings.networks
                        else basicSettings.networks = [...basicSettings.networks, ...teamSettings.networks]
                        if (basicSettings.abis === undefined) basicSettings.abis = teamSettings.abis
                        else basicSettings.abis = [...basicSettings.abis, ...teamSettings.abis]
                        if (basicSettings.apiKeys === undefined) basicSettings.apiKeys = teamSettings.apiKeys
                        else basicSettings.apiKeys = [...basicSettings.apiKeys, ...teamSettings.apiKeys]
                        if (basicSettings.signers === undefined) basicSettings.signers = teamSettings.signers
                        else basicSettings.signers = [...basicSettings.signers, ...teamSettings.signers]
                    }
                }
                if (
                    localSettings.allowUserSettings &&
                    parsedBody.user !== undefined &&
                    parsedBody.user.id !== undefined
                ) {
                    const userSettings = await retrieveUserSettings(
                        faunaDbToken,
                        parsedBody.user.id,
                        parsedBody.team.id
                    )
                    if (localSettings.logLevel > 1) console.log('userSettings', userSettings)
                    if (userSettings !== null) {
                        if (basicSettings.contracts === undefined) basicSettings.contracts = userSettings.contracts
                        else basicSettings.contracts = [...basicSettings.contracts, ...userSettings.contracts]
                        if (basicSettings.networks === undefined) basicSettings.networks = userSettings.networks
                        else basicSettings.networks = [...basicSettings.networks, ...userSettings.networks]
                        if (basicSettings.abis === undefined) basicSettings.abis = userSettings.abis
                        else basicSettings.abis = [...basicSettings.abis, ...userSettings.abis]
                        if (basicSettings.apiKeys === undefined) basicSettings.apiKeys = userSettings.apiKeys
                        else basicSettings.apiKeys = [...basicSettings.apiKeys, ...userSettings.apiKeys]
                        if (basicSettings.signers === undefined) basicSettings.signers = userSettings.signers
                        else basicSettings.signers = [...basicSettings.signers, ...userSettings.signers]
                    }
                }
                if (!parsedBody.actions && parsedBody.callback_id) {
                    if (localSettings.logLevel > 0) console.log('parsedBody.callback_id', parsedBody.callback_id)
                    // Handle the callback_id (mainly use by Slack Shortcuts and Workflows)
                    // Slack can't handle multiple shortcuts with the same callback_id so we create multiple paths for each shortcut
                    if (parsedBody.callback_id.startsWith('sc-gn-'))
                        parsedBody.actions = [{ action_id: parsedBody.callback_id.substring(6) }]
                    else if (parsedBody.callback_id.startsWith('sc-msg-'))
                        parsedBody.actions = [{ action_id: parsedBody.callback_id.substring(7) }]
                    else parsedBody.actions = [{ action_id: parsedBody.callback_id }]
                }
                if (!parsedBody.actions && parsedBody.view)
                    parsedBody.actions = [{ action_id: parsedBody.view.callback_id }]
                if (!parsedBody.action && parsedBody.event) {
                    if (parsedBody.event.type && parsedBody.event.type === 'app_home_opened')
                        parsedBody.actions = [{ action_id: 'app_home_opened' }]
                }
                if (!parsedBody.actions && parsedBody.command !== undefined)
                    parsedBody = await commandsLoop(
                        {
                            networks: basicSettings.networks,
                            contracts: basicSettings.contracts,
                            commands: env.commands
                        },
                        parsedBody
                    )
                if (parsedBody.actions) {
                    if (parsedBody.actions.length > 0)
                        await parsedBody.actions.map(async (actionObject: any) => {
                            ;[, returnValue, messageBlocks, buttons] = await actionsLoop(
                                slackToken,
                                {
                                    ...actions,
                                    ...localActions
                                },
                                {
                                    ...actionObject,
                                    rpcEthereum: rpcEthereumUrl,
                                    slackToken,
                                    slackDefaultConversationId,
                                    faunaDbToken,
                                    dappUrl,
                                    env: {
                                        ...basicSettings,
                                        ...env
                                    },
                                    abis,
                                    selectedNetwork: '',
                                    selectedContract: '',
                                    localSettings
                                },
                                parsedBody,
                                messageBlocks,
                                buttons,
                                returnValue
                            )
                            if (actionObject.closeView) returnBody = ''
                        })
                }
            } catch (error) {
                if (localSettings.logLevel > 0) console.log('error', error)
            }
        } else if (localSettings.logLevel > 0) console.log('error parsing body', event.body)
    } catch (error) {
        if (localSettings.logLevel > 0) console.log('error', error)
    }
    return {
        statusCode: 200,
        returnBody
    }
}

export default slackEndpoint
