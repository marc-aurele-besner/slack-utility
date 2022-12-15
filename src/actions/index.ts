import app_home_opened from './app_home_opened'
import build_call_from_abi from './build_call_from_abi'
import delete_msg from './delete_msg'
import error from './error'
import query_all_events from './query_all_events'
import query_contract_for_env from './query_contract_for_env'
import query_contract_queryEvents from './query_contract_queryEvents'
import query_contract_readCall from './query_contract_readCall'
import query_contract_staticCall from './query_contract_staticCall'
import query_contract_writeCall from './query_contract_writeCall'
import query_event_details from './query_event_details'
import send_call_from_abi from './send_call_from_abi'
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
import settings_link_to_dapp from './settings_link_to_dapp'
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
    query_contract_for_env,
    query_contract_queryEvents,
    query_contract_readCall,
    query_contract_staticCall,
    query_contract_writeCall,
    query_event_details,
    send_call_from_abi,
    settings_abis,
    settings_abis_add,
    settings_apiKeys,
    settings_apiKeys_add,
    settings_app,
    settings_commands,
    settings_commands_add,
    settings_contracts,
    settings_contracts_add,
    settings_link_to_dapp,
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
