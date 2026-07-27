import mongoose from 'mongoose'

import { TDBDetails, TUserSettings } from '../types'

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

    return null
}

export default retrieveUserSettings
