import { WebClient } from '@slack/web-api'

import { TSlackViewResponse } from '../types'

const slackPushView = async (token: string, view: any, triggerId: string): Promise<TSlackViewResponse> => {
    console.log('token', token)
    console.log('view', view)
    console.log('triggerId', triggerId)
    const result: TSlackViewResponse = {
        ok: false,
        view: {}
    }
    if (triggerId) {
        const web = new WebClient(token)
        try {
            const viewResult = await web.views.push({ view, trigger_id: triggerId })
            console.log('\x1b[34m%s\x1b[0m', 'View Push: ', viewResult, viewResult.ok)
            result.ok = viewResult.ok
            // if (viewResult.ok && viewResult.view !== undefined) result.view = viewResult.view
        } catch (error) {
            console.log('\x1b[31m%s\x1b[0m', 'Error pushing view: ', error)
        }
    }
    return result
}

export default slackPushView
