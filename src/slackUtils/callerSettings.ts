import fauna from 'faunadb-utility/src'

const callerSettings = async (
    user: any,
    settings: any,
    defaultContracts = [] as any[],
    defaultNetworks = [] as any[],
    defaultApiKeys = {} as any,
    defaultSigners = [] as any[]
) => {
    const getDbUserSettings = await fauna.queryTermByFaunaIndexes(
        settings.faunaToken,
        'settings_by_slackUserId',
        user.id
    )
    console.log('getDbUserSettings', getDbUserSettings)
    const dbUserSettingFound = getDbUserSettings.body.length > 0 ? true : false

    return {
        contracts: defaultContracts,
        networks: defaultNetworks,
        apiKeys: defaultApiKeys,
        signers: defaultSigners,
        dbUserSettingFound
    }
}

export default callerSettings
