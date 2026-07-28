import mongoose from 'mongoose'

import { TDBDetails, TUserSettings } from '../types'
import getPool from './pgPool'

const retrieveUserSettings = async (
    dBDetails: TDBDetails,
    slackUserId: string | undefined,
    slackTeamId: string | undefined
): Promise<TUserSettings | null> => {
    if (dBDetails.db === 'mongo' && slackTeamId) {
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
    if (dBDetails.db === 'postgres' && slackTeamId && slackUserId) {
        try {
            const pool = getPool(dBDetails.token)
            const { rows } = await pool.query('SELECT settings FROM settings WHERE slack_team_user_id = $1 LIMIT 1', [
                `${slackTeamId}_${slackUserId}`
            ])
            if (rows.length > 0) return rows[0].settings as TUserSettings
        } catch (error) {
            console.log('error', error)
        }
    }

    return null
}

export default retrieveUserSettings
