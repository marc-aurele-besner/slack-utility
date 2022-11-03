import { WebClient } from '@slack/web-api'

import { TSlackViewResponse } from '../types'

const slackPublishView = async (
    token: string,
    userId: string,
    view: any
): Promise<TSlackViewResponse> => {
    let result: TSlackViewResponse = {
        ok: false,
        view: {}
    }
    const web = new WebClient(token)
    try {
       const viewResult = await web.views.publish({
            user_id: userId,
            view})
        console.log('\x1b[34m%s\x1b[0m', 'View Published: ', viewResult, viewResult.ok)
        result.ok = viewResult.ok
        // if (viewResult.ok && viewResult.view !== undefined) result.view = viewResult.view
    } catch (error) {
        console.log('\x1b[31m%s\x1b[0m', 'Error publishing view: ', error)
    }
    return result
}

export default slackPublishView
