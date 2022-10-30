const buildSlackPoolsSelection = (pools: string[]) => {
  return {
    type: 'static_select',
    placeholder: {
      type: 'plain_text',
      text: 'Pool to query?'
    },
    action_id: 'select_pool',
    options: pools.map((pool) => {
      return {
        text: {
          type: 'plain_text',
          text: pool
        },
        value: pool
      }
    })
  }
}

export default buildSlackPoolsSelection
