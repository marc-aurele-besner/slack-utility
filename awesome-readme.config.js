module.exports = {
    figlet: `
    .d8888. db       .d8b.   .o88b. db   dD        db    db d888888b d888888b db      d888888b d888888b db    db 
    88'  YP 88      d8' \`8b d8P  Y8 88 ,8P'        88    88 \`~~88~~'   \`88'   88        \`88'   \`~~88~~' \`8b  d8' 
    \`8bo.   88      88ooo88 8P      88,8P          88    88    88       88    88         88       88     \`8bd8'  
      \`Y8b. 88      88~~~88 8b      88\`8b   C8888D 88    88    88       88    88         88       88       88    
    db   8D 88booo. 88   88 Y8b  d8 88 \`88.        88b  d88    88      .88.   88booo.   .88.      88       88    
    \`8888Y' Y88888P YP   YP  \`Y88P' YP   YD        ~Y8888P'    YP    Y888888P Y88888P Y888888P    YP       YP    `,
    root_license: `[![npm version](https://badge.fury.io/js/slack-utility.svg)](https://badge.fury.io/js/slack-utility)`,
    root_header: `
## Installation
\`\`\`
npm install slack-utility
\`\`\`
or
\`\`\`
yarn add slack-utility
\`\`\`
`,
    root_body: `
## This package export 3 main objects
- \`actions\` : A collection of general purpose actions to be trigger by slash commands, interactivity, events or input actions.
- \`slackBuilder\` : A collection of helper functions to build different components of slack blocks messages.
- \`slackUtils\` : A collection of function to perform a call to the slack API with this package context or retrieving context information from a slack request.

## Usage
\`\`\`ts
import  { slackUtils, slackBuilder, actions } from 'slack-utility'
\`\`\`

\`\`\`js
const { slackUtils, slackBuilder, actions } = require('slack-utility');
\`\`\`

### Actions

- \`addressBook\` : Show all the contract available on the selected network
- \`app_home_opened\` : Trigger when a user open the app home. (if enable in slack app configuration)
- \`build_call_from_abi\` : 
- \`delete_msg\` : Action triggered when a user click on the delete button. 
- \`error\` : Trigger when an error occur. (can be trigger by any action)
- \`explorer\` : Show information on the blockchain selected
- \`query_all_events\` : 
- \`query_contract_calls\` : 
- \`query_contract_events\` : 
- \`query_contract_for_env\` : 
- \`query_event_details\` : 
- \`send_call_from_abi\` : 
- \`settings_abis\` : 
- \`settings_abis_add\` : 
- \`settings_apiKeys\` : 
- \`settings_apiKeys_add\` : 
- \`settings_app\` : 
- \`settings_command\` : 
- \`settings_commands_add\` : 
- \`settings_contracts\` : 
- \`settings_contracts_add\` : 
- \`settings_networks\` : 
- \`settings_networks_add\` : 
- \`settings_signers\` : 
- \`settings_signers_add\` : 
- \`settings_save\` : General purpose action to save the settings. (can be trigger by any settings action)
- \`settings_validate\` : General purpose action to validate the settings. (can be trigger by any settings action)
- \`settings\` : Trigger when a user click on the settings button or use /settings command.
- \`update_msg\` : 

### SlackBuilder

- \`addDeleteButton\` : Return a slack button to delete a message when provided with a action message block and message id.
- \`addRefreshButton\` : Return a slack button to refresh a message when provided with a action message block and message id.
- \`addSettingButton\` : Return a slack button to open the settings when provided with a action message block.
- \`buildLinkSlackButton\` : Return a link button to open a link in the browser.
- \`buildEtherscanLinkSlackButton\` : Return a link button to open a blockchain explorer link in the browser.
- \`buildSimpleSlackButton\` : Return a simple slack button to trigger an action.
- \`buildSimpleSlackHeaderMsg\` : Return a simple slack header message. (only 1 per message)
- \`buildSimpleSlackOptions\` : Return options for a select menu.
- \`buildSimpleSlackOption\` : Return a simple option for a select menu.
- \`buildSimpleSectionMsg\` : Return a simple slack section message. (most used for text)
- \`buildSimpleSlackSelection\` : Return a simple select menu.
- \`buildSlackActionMsg\` : Return the action message block. (used to add buttons to a message)
- \`buildSlackContractSelection\` : Return a select menu to select a contract. (build from the env pass to the function)
- \`buildSlackNetworkSelection\` : Return a select menu to select a network. (build from the env pass to the function)
- \`buildSlackNumberInput\` : Return a number input.
- \`buildSlackPlainTextInput\` : Return a plain text input.
- \`buildSlackDatePicker\` : Return a date picker.
- \`buildSlackDateTimePicker\` : Return a date & time picker.
- \`buildSlackInput\` : Return a input block.
- \`buildSlackModal\` : Return a modal view.
- \`buildSlackMultilineInput\` : Return a multiline input.
- \`buildSlackTimePicker\` : Return a time picker.
- \`buildSlackUrlInput\` : Return a url input.

### SlackUtils

- \`actionsLoop\` : Parse the action to run and then post a slack message or update a message is messageBlock has some object
- \`callerSettings\` : Retrieve and build settings with env settings, team settings and user settings
- \`commandsLoop\` : Parse the slack slash command and trigger the right action with extra context possible to inject
- \`retrieveEnvironment\` : Retrieve the network and contract selected in the dropdown or pass on from previous interaction
- \`retrieveEvent\` : Parse events (txHash) selected from events result dropdown
- \`retrieveModule\` : Parse extra modules that can be added in the contract selection dropdown
- \`retrieveTeamSettings\` : Retrieve team settings if any is save on the db and this module is enable
- \`retrieveUserSettings\` : Retrieve user settings if any is save on the db and this module is enable
- \`setupContractAndNetwork\` : Return contract, abi, network and other object to use in your actions
- \`setupContractNetworkAndSigner\` : Return contract instance, signer, contract, abi, network and other object to use in your actions
- \`setupNetwork\` : Return provider, explorer, chainName and other object to use in your actions
- \`slackEndpoint\` : Main endpoint to import to run a Slack App

- \`slackDeleteMessage\` : Delete a message send by this slack app
- \`slackOpenView\` : 
- \`slackPostEphemeralMessage\` : Post a private message to the slack api and append the action block (or create one) with delete, settings and refresh buttons (if enable)
- \`slackPostMessage\` : Post a message to the slack api and append the action block (or create one) with delete, settings and refresh buttons (if enable)
- \`slackPostWaitMessage\` : Post a waiting message, to be updated later on in your action with the result of a long async call
- \`slackPublishView\` : 
- \`slackPushView\` : 
- \`slackUpdateMessage\` : Update a message to the slack api and append the action block (or create one) with delete, settings and refresh buttons (if enable)
- \`slackUpdateView\` : 
  `,
    root_footer: `## Don't hesitate to contribute to this project.`,
    ignore_gitFiles: true,
    ignore_gitIgnoreFiles: true,
    ignore_files: []
}