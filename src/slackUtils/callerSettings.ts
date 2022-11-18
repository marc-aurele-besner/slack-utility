import fauna from 'faunadb-utility/src'

import { TTeamSettings, TUserSettings } from '../types'

import retrieveTeamSettings from './retrieveTeamSettings'
import retrieveUserSettings from './retrieveUserSettings'

const callerSettings = async (
    user: any,
    settings: any,
    defaultContracts = [] as any[],
    defaultNetworks = [] as any[],
    defaultApiKeys = {} as any,
    defaultSigners = [] as any[]
) => {
    const userSettings = await retrieveUserSettings(user.faunaDbToken, user.id)
    const teamSettings = await retrieveTeamSettings(user.faunaDbToken, user.teamId)
    const dbUserSettingFound = userSettings !== null ? true : false
    const dbTeamSettingFound = userSettings !== null ? true : false

    return {
        contracts: defaultContracts,
        networks: defaultNetworks,
        apiKeys: defaultApiKeys,
        signers: defaultSigners,
        dbUserSettingFound
    }
}

export default callerSettings
