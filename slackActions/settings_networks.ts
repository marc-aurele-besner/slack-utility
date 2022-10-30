import { slackBuilder } from '../slackBuilder'
  
const action = async (action, parsedBody, messageBlocks, buttons, returnValue) => {
  const { networks } = action

  let networkList = ''
  networks.filter((network) => network.active).map((network) => (networkList += `- ${network.name}\n`))
  messageBlocks.push(
    slackBuilder.buildSimpleSlackHeaderMsg(`Current active networks:`),
    slackBuilder.buildSimpleSectionMsg(
      '',
      networkList
    ),
    slackBuilder.buildSimpleSectionMsg('',  'You can change the networks settings to add or remove networks from the list.\nThis will be save as your personal settings.'),
    slackBuilder.buildSlackInput(
        'Networks settings (JSON)',
        'settings_save_input',
        slackBuilder.buildSlackMultilineInput('List of networks' + networkList, 'networks_input', JSON.stringify(networks), true)
    )
  )
  buttons.push(
      slackBuilder.buildSimpleSlackButton(
        'Save :floppy_disk:',
        JSON.stringify({
          action: 'settings_save',
          section: 'networks',
          settings: action.env || {}
        }),
        'settings_save'),
      slackBuilder.buildSimpleSlackButton(
        'Cancel :x:',
        JSON.stringify({
            action: 'settings',
        }),
        'settings')
      )

  return [action, returnValue, messageBlocks, buttons]
}

export default action