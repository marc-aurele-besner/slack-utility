import { TBlockElement, TNetwork, TNetworks } from '../types'

import { buildSimpleSlackOption } from './buildSimpleSlackOptions'

const buildSlackNetworkSelection = (networks: TNetworks): TBlockElement => {
    const options = networks
        .filter((network: TNetwork) => network.active === true)
        .map((network: TNetwork) => {
            return buildSimpleSlackOption({
                text: network.emoji + ' ' + network.name,
                value: network.value
            })
        })
    return {
        type: 'static_select',
        placeholder: {
            type: 'plain_text',
            text: 'Environment?'
        },
        action_id: 'select_env',
        options
    }
}

export default buildSlackNetworkSelection
