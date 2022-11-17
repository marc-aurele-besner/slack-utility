import app_home_opened from './app_home_opened'
import buildFromAbi from './buildFromAbi'
import delete_msg from './delete_msg'
import error from './error'
import query_contract_calls from './query_contract_calls'
import query_contract_for_env from './query_contract_for_env'
import settings from './settings'
import settings_apiKeys from './settings_apiKeys'
import settings_contracts from './settings_contracts'
import settings_contracts_add from './settings_contracts_add'
import settings_networks from './settings_networks'
import settings_networks_add from './settings_networks_add'
import settings_save from './settings_save'
import settings_signers from './settings_signers'
import settings_validate from './settings_validate'
import update_msg from './update_msg'

const actions = {
    app_home_opened,
    buildFromAbi,
    delete_msg,
    error,
    query_contract_calls,
    query_contract_for_env,
    settings_apiKeys,
    settings_contracts,
    settings_contracts_add,
    settings_networks,
    settings_networks_add,
    settings_save,
    settings_signers,
    settings_validate,
    settings,
    update_msg
}

export default actions
