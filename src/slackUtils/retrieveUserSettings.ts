import fauna from 'faunadb-utility'
import mongoose from 'mongoose'

import { TUserSettings, TDBDetails } from '../types'

const retrieveUserSettings = async (
    dBDetails: TDBDetails,
    slackUserId: string | undefined,
    slackTeamId: string | undefined
): Promise<TUserSettings | null> => {
    if (dBDetails.db == 'fauna' && slackUserId) {
        try {
            const getDbUserSettings = await fauna.queryTermByFaunaIndexes(
                dBDetails.token,
                'settings_by_slackTeamUserId',
                slackTeamId + '_' + slackUserId
            )
            if (JSON.parse(getDbUserSettings.body).length > 0)
                return JSON.parse(getDbUserSettings.body)[0].data.settings
        } catch (error) {
            console.log('error', error)
        }
    }
    if (dBDetails.db == 'mongo' && slackTeamId) {
        try {
            const db = await mongoose.connect(dBDetails.token)
            const getDbUserSettings = await db.connection.collection('settings').findOne({
                slackTeamUserId: slackTeamId + '_' + slackUserId
            })
            if (getDbUserSettings) return getDbUserSettings.settings
        } catch (error) {
            console.log('error', error)
        }
    }

    return null
}

export default retrieveUserSettings
