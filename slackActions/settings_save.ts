import { slackBuilder } from '../slackBuilder'
// createFaunaDocument, queryTermByFaunaIndexes, 
  
const action = async (action, parsedBody, messageBlocks, buttons, returnValue) => {
  console.log('settings_contracts')

  if (parsedBody.state.values.settings_save_input) {
    const settings = {}
    if (parsedBody.state.values.settings_save_input.apiKeys_input) settings['apiKeys'] = parsedBody.state.values.settings_save_input.apiKeys_input.value || ''
    if (parsedBody.state.values.settings_save_input.contracts_input) settings['contracts'] = parsedBody.state.values.settings_save_input.contracts_input.value || ''
    if (parsedBody.state.values.settings_save_input.networks_input) settings['networks'] = parsedBody.state.values.settings_save_input.networks_input.value || ''
    if (parsedBody.state.values.settings_save_input.signers_input) settings['signers'] = parsedBody.state.values.settings_save_input.signers_input.value || ''
    console.log('newSettings', settings)

    // Check if user has settings in DB
    // const getDbUserSettings = await queryTermByFaunaIndexes('settings_by_slackUserId', parsedBody.user.id, true)
    // console.log('getDbUserSettings', getDbUserSettings, getDbUserSettings.body, JSON.parse(getDbUserSettings.body).length)
    // if (JSON.parse(getDbUserSettings.body).length === 0) {
    //   console.log('create new settings')
    //  await createFaunaDocument('settings', {
    //     slackUserId: parsedBody.user.id,
    //     settings
    //   }, true)
    // } else {
    //   // if yes update settings
    //   console.log('update settings')
    //   // await createFaunaDocument('settings', {
    //   //   slackUserId: parsedBody.user.id,
    //   //   settings
    //   // }, true)
    // }
  }

  messageBlocks.push(slackBuilder.buildSimpleSlackHeaderMsg(`Settings saved!`))

  return [action, returnValue, messageBlocks, buttons]
}

export default action