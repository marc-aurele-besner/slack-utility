import { WebClient } from '@slack/web-api'

import { TSlackViewResponse } from '../types'

const slackUpdateView = async (
    token: string,
    view: any,
    externalId?: string,
    viewId?: string
): Promise<TSlackViewResponse> => {
    const result: TSlackViewResponse = {
        ok: false,
        view: {}
    }
    if (externalId || viewId) {
        const web = new WebClient(token)
        try {
            const viewResult = externalId !== undefined ? await web.views.update({ view, external_id: externalId }) : await web.views.update({ view, view_id: viewId })
            console.log('\x1b[34m%s\x1b[0m', 'Update view: ', viewResult, viewResult.ok)
            result.ok = viewResult.ok
            // if (viewResult.ok && viewResult.view !== undefined) result.view = viewResult.view
        } catch (error) {
            console.log('\x1b[31m%s\x1b[0m', 'Error updating view: ', error)
        }
    }
    return result
}

export default slackUpdateView
