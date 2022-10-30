import addDeleteButton from './addDeleteButton'
import addRefreshButton from './addRefreshButton'
import addSettingButton from './addSettingButton'
import buildLinkSlackButton, { buildEtherscanLinkSlackButton } from './buildLinkSlackButton'
import buildSimpleSlackButton from './buildSimpleSlackButton'
import buildSimpleSlackHeaderMsg from './buildSimpleSlackHeaderMsg'
import buildSimpleSlackOptions, { buildSimpleSlackOption } from './buildSimpleSlackOptions'
import buildSimpleSectionMsg from './buildSimpleSlackSectionMsg'
import buildSlackActionMsg from './buildSlackActionMsg'
import buildSlackContractSelection from './buildSlackContractSelection'
import buildSlackDateTimePicker from './buildSlackDateTimePicker'
import buildSlackInput from './buildSlackInput'
import buildSlackMultilineInput from './buildSlackMultilineInput'
import buildSlackNetworkSelection from './buildSlackNetworkSelection'
import buildSlackNumberInput from './buildSlackNumberInput'
import buildSlackPlainTextInput from './buildSlackPlainTextInput'

const slackBuilder = {
    addDeleteButton,
    addRefreshButton,
    addSettingButton,
    buildLinkSlackButton,
    buildEtherscanLinkSlackButton,
    buildSimpleSlackButton,
    buildSimpleSlackHeaderMsg,
    buildSimpleSlackOptions,
    buildSimpleSlackOption,
    buildSimpleSectionMsg,
    buildSlackActionMsg,
    buildSlackContractSelection,
    buildSlackNetworkSelection,
    buildSlackNumberInput,
    buildSlackPlainTextInput,
    buildSlackDateTimePicker,
    buildSlackInput,
    buildSlackMultilineInput
}

export default slackBuilder
