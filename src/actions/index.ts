import app_home_opened from './app_home_opened'
import build_call_from_abi from './build_call_from_abi'
import delete_msg from './delete_msg'
import error from './error'
import query_all_events from './query_all_events'
import query_contract_calls from './query_contract_calls'
import query_contract_events from './query_contract_events'
import query_contract_for_env from './query_contract_for_env'
import settings from './settings'
import settings_abis from './settings_abis'
import settings_abis_add from './settings_abis_add'
import settings_apiKeys from './settings_apiKeys'
import settings_apiKeys_add from './settings_apiKeys_add'
import settings_app from './settings_app'
import settings_commands from './settings_commands'
import settings_commands_add from './settings_commands_add'
import settings_contracts from './settings_contracts'
import settings_contracts_add from './settings_contracts_add'
import settings_networks from './settings_networks'
import settings_networks_add from './settings_networks_add'
import settings_save from './settings_save'
import settings_signers from './settings_signers'
import settings_signers_add from './settings_signers_add'
import settings_validate from './settings_validate'
import update_msg from './update_msg'

const actions = {
    app_home_opened,
    build_call_from_abi,
    delete_msg,
    error,
    query_all_events,
    query_contract_calls,
    query_contract_events,
    query_contract_for_env,
    settings_abis,
    settings_abis_add,
    settings_apiKeys,
    settings_apiKeys_add,
    settings_app,
    settings_commands,
    settings_commands_add,
    settings_contracts,
    settings_contracts_add,
    settings_networks,
    settings_networks_add,
    settings_signers,
    settings_signers_add,
    settings_save,
    settings_validate,
    settings,
    update_msg
}

export default actions
