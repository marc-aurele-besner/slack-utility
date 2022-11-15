import { WebClient } from '@slack/web-api'

import { TSlackViewResponse } from '../types'

const slackOpenView = async (
    token: string,
    view: any,
    triggerId?: string,
    interactivityPointer?: string
): Promise<TSlackViewResponse> => {
    const result: TSlackViewResponse = {
        ok: false,
        view: {}
    }
    if (triggerId || interactivityPointer) {
        const web = new WebClient(token)
        try {
            const viewResult =
                triggerId !== undefined ? await web.views.open({ view, trigger_id: triggerId }) : { ok: false }
            console.log('\x1b[34m%s\x1b[0m', 'View Open: ', viewResult, viewResult.ok)
            result.ok = viewResult.ok
            // if (viewResult.ok && viewResult.view !== undefined) result.view = viewResult.view
        } catch (error) {
            console.log('\x1b[31m%s\x1b[0m', 'Error opening view: ', error)
        }
    }
    return result
}

export default slackOpenView
