import { buildSimpleSlackOption } from './buildSimpleSlackOptions'

const buildSlackNetworkSelection = (networks: any[]) => {
    const options = networks
        .filter((network: any) => network.active === true)
        .map((network: any) => {
            return buildSimpleSlackOption({
                text: network.chainEmoji + ' ' + network.name,
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
