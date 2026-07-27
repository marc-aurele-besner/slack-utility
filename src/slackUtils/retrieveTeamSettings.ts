import mongoose from 'mongoose'

import { TDBDetails, TTeamSettings } from '../types'
import getPool from './pgPool'

const retrieveTeamSettings = async (
    dBDetails: TDBDetails,
    slackTeamId: string | undefined
): Promise<TTeamSettings | null> => {
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
    if (dBDetails.db === 'postgres' && slackTeamId) {
        try {
            const pool = getPool(dBDetails.token)
            const { rows } = await pool.query('SELECT settings FROM settings WHERE slack_team_user_id = $1 LIMIT 1', [
                `${slackTeamId}_all`
            ])
            if (rows.length > 0) return rows[0].settings as TTeamSettings
        } catch (error) {
            console.log('error', error)
        }
    }

    return null
}

export default retrieveTeamSettings
