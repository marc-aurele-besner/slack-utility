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
    const userSettings: TUserSettings | null = await retrieveUserSettings(user.dBDetails, user.id, user.teamId)
    const teamSettings: TTeamSettings | null = await retrieveTeamSettings(user.dBDetails, user.teamId)
    const dbUserSettingFound = userSettings !== null ? true : false
    const dbTeamSettingFound = teamSettings !== null ? true : false

    return {
        contracts: defaultContracts,
        networks: defaultNetworks,
        apiKeys: defaultApiKeys,
        signers: defaultSigners,
        dbUserSettingFound,
        dbTeamSettingFound
    }
}

export default callerSettings
