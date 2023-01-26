import fauna from 'faunadb-utility'
import mongoose from 'mongoose'

import { TDBDetails, TTeamSettings } from '../types'

const retrieveTeamSettings = async (
    dBDetails: TDBDetails,
    slackTeamId: string | undefined
): Promise<TTeamSettings | null> => {
    if (dBDetails.db === 'fauna' && slackTeamId) {
        try {
            const getDbTeamSettings = await fauna.queryTermByFaunaIndexes(
                dBDetails.token,
                'settings_by_slackTeamUserId',
                slackTeamId + '_all'
            )
            if (JSON.parse(getDbTeamSettings.body).length > 0)
                return JSON.parse(getDbTeamSettings.body)[0].data.settings
        } catch (error) {
            console.log('error', error)
        }
    }
    if (dBDetails.db === 'mongo' && slackTeamId) {
        try {
            const db = await mongoose.connect(dBDetails.token)
            const getDbTeamSettings = await db.connection.collection('settings').findOne({
                slackTeamUserId: slackTeamId + '_all'
            })
            if (getDbTeamSettings) return getDbTeamSettings.settings
        } catch (error) {
            console.log('error', error)
        }
    }

    return null
}

export default retrieveTeamSettings
