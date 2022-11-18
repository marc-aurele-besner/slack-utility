import fauna from 'faunadb-utility/src'

import { TTeamSettings } from '../types'

const retrieveTeamSettings = async (
    faunaDbToken: string,
    slackTeamId: string | undefined
): Promise<TTeamSettings | null> => {
    if (faunaDbToken && slackTeamId) {
        try {
            const getDbTeamSettings = await fauna.queryTermByFaunaIndexes(
                faunaDbToken,
                'settings_by_slackTeamUserId',
                slackTeamId + '_all'
            )
            if (JSON.parse(getDbTeamSettings.body).length > 0)
                return JSON.parse(getDbTeamSettings.body)[0].data.settings
        } catch (error) {
            console.log('error', error)
        }
    }

    return null
}

export default retrieveTeamSettings
