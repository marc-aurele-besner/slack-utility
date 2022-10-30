import { buildSimpleSlackOption } from './buildSimpleSlackOptions'

const buildSlackNetworkSelection = (networks) => {
  const options = networks.filter((network) => network.active === true).map((network) => {
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
