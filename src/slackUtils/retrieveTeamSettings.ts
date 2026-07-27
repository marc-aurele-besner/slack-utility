import mongoose from 'mongoose'

import { TDBDetails, TTeamSettings } from '../types'

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

    return null
}

export default retrieveTeamSettings
