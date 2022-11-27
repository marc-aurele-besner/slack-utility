import fauna from 'faunadb-utility'

import { TUserSettings } from '../types'

const retrieveUserSettings = async (
    faunaDbToken: string,
    slackUserId: string | undefined,
    slackTeamId: string | undefined
): Promise<TUserSettings | null> => {
    if (faunaDbToken && slackUserId) {
        try {
            const getDbUserSettings = await fauna.queryTermByFaunaIndexes(
                faunaDbToken,
                'settings_by_slackTeamUserId',
                slackTeamId + '_' + slackUserId
            )
            if (JSON.parse(getDbUserSettings.body).length > 0)
                return JSON.parse(getDbUserSettings.body)[0].data.settings
        } catch (error) {
            console.log('error', error)
        }
    }

    return null
}

export default retrieveUserSettings
