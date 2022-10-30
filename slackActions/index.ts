import { Wallet, Contract, providers } from 'ethers'

import { CONTRACTS, NETWORKS } from '../../constants'
import {
  slackBuilder,
  setupContractAndNetwork,
  slackPostMessage,
  createFaunaDocument,
  callerSettings
} from '../../utils'

import buildFromAbi from './buildFromAbi'
import delete_msg from './delete_msg'
import error from './error'

import investor_dao_createPool from './investor_dao_createPool'
import investor_dao_validate_createPool from './investor_dao_validate_createPool'

import query_all_accounts_and_balances from './query_all_accounts_and_balances'
import query_all_investor_dao_account_of_address from './query_all_investor_dao_account_of_address'
import query_all_investor_dao_balance_of_balanceHash from './query_all_investor_dao_balance_of_balanceHash'
import query_all_investor_dao_balances_of_address from './query_all_investor_dao_balances_of_address'
import query_all_investor_dao_pools from './query_all_investor_dao_pools'
import query_closing_of_pool from './query_closing_of_pool'
import query_contract_calls from './query_contract_calls'
import query_contract_for_env from './query_contract_for_env'
import query_investorDAO_pool_info from './query_investorDAO_pool_info'

import settings_apiKeys from './settings_apiKeys'
import settings_contracts from './settings_contracts'
import settings_networks from './settings_networks'
import settings_save from './settings_save'
import settings_signers from './settings_signers'
import settings from './settings'

if (!process.env.PRIVATE_KEY) throw new Error('No PRIVATE_KEY in .env.development file')

const { PRIVATE_KEY, SLACK_CONVERSATION_ID, RPC_ETHEREUM } = process.env

const slackActions = async (action: any, parsedBody: any, messageBlocks: any[], buttons: any[], returnValue: any) => {
  let selectedEnvironment = 'goerli'
  let selectedContract = 'CTC'
  if (parsedBody.state.select_env && parsedBody.state.select_env.selected_option) {
    try {
      const { value } = parsedBody.state.select_env.selected_option
      selectedEnvironment = value
    } catch (error) { console.log(error) }
  }
  if (parsedBody.state.select_contract && parsedBody.state.select_contract.selected_option) {
    try {
      const { value } = parsedBody.state.select_contract.selected_option
      selectedContract = value
    } catch (error) { console.log(error) }
  }
  if (action.value) {
    selectedEnvironment = action.value.selectedEnvironment
    selectedContract = action.value.selectedContract
  }
  try {
    if (!selectedEnvironment && parsedBody.state.values.actions1.select_env.selected_option.value) selectedEnvironment = parsedBody.state.values.actions1.select_env.selected_option.value
    if (!selectedContract && parsedBody.state.values.actions1.select_contract.selected_option.value) selectedContract = parsedBody.state.values.actions1.select_contract.selected_option.value
  } catch (error) {
    console.log('error', error)
  }
  const { action_id } = action

  const env = await callerSettings(parsedBody.user)
  // const env_settings = {
  //   contracts: CONTRACTS,
  //   networks: NETWORKS,
  //   apiKeys: {
  //     etherscan: process.env.ETHERSCAN_API_KEY,
  //     chainstack: process.env.CHAINSTACK_API_KEY,
  //     infura: process.env.INFURA_API_KEY,
  //     alchemy: process.env.ALCHEMY_API_KEY
  //   },
  //   signers: {
  //     goerli: {
  //       name: 'goerli',
  //       address: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
  //       privateKey: PRIVATE_KEY
  //     }
  //   }
  // }

  if (selectedEnvironment && selectedContract) {
    const { value } = action
    const { chainId, chainName, chainEmoji, provider, contractAddress, contractAbi } = await setupContractAndNetwork(env, selectedEnvironment, selectedContract)
    let owner
    if (PRIVATE_KEY && provider) owner = new Wallet(PRIVATE_KEY, provider)
    else console.error('No PRIVATE_KEY in .env.development file')
    let ethereumProvider
    if (RPC_ETHEREUM) ethereumProvider = new providers.JsonRpcProvider(RPC_ETHEREUM)
    let contractInstance
    let contractName = ''
    let contractVersion = ''
    let contractSymbol = ''
    if (contractAddress && contractAbi && owner) {
      contractInstance = await new Contract(contractAddress, contractAbi, owner)
      try {
        contractName = await contractInstance.name()
      } catch (error) { console.error(error) }
      try {
        contractVersion = await contractInstance.version()
      } catch (error) { console.error(error) }
        try {
        contractSymbol = await contractInstance.symbol()
      } catch (error) { console.error(error) }
    }
    if (!contractName) contractName = selectedContract
    action = {
      ...action,
      env,
      selectedEnvironment, selectedContract, chainId, chainName, chainEmoji, contractAddress, 
      name: contractName, 
      version: contractVersion,
      symbol: contractSymbol,
      contractAbi, owner, contractInstance, ethereumProvider }
      // Action_id
      switch (action_id) {
        case 'select_env':
          console.log('\x1b[33m%s\x1b[0m', 'select_env')
          break
        case 'select_contract':
          console.log('\x1b[33m%s\x1b[0m', 'select_contract')
          break
        case 'buildFromAbi':
          [action, returnValue, messageBlocks, buttons] = await buildFromAbi(action, parsedBody, messageBlocks, buttons, returnValue)
          break
        case 'query_contract_for_env':
          [action, returnValue, messageBlocks, buttons] = await query_contract_for_env(action, parsedBody, messageBlocks, buttons, returnValue)
          break
        case 'query_contract_calls-more':
          action = { ...action, value: { ...action.value, functionsPadding: 15 } }
          [action, returnValue, messageBlocks, buttons] = await query_contract_calls(action, parsedBody, messageBlocks, buttons, returnValue)
          break
        case 'query_contract_calls':
          action = { ...action, value: { ...action.value, functionsPadding: 15 } }
          [action, returnValue, messageBlocks, buttons] = await query_contract_calls(action, parsedBody, messageBlocks, buttons, returnValue)
          break
        case 'delete_msg':
          [action, returnValue, messageBlocks, buttons] = await delete_msg(action, parsedBody, messageBlocks, buttons, returnValue)
          break
        case 'query_all_investor_dao_pools':
          [action, returnValue, messageBlocks, buttons] = await query_all_investor_dao_pools(action, parsedBody, messageBlocks, buttons, returnValue)
          break
        case 'query_investorDAO_pool_info':
          [action, returnValue, messageBlocks, buttons] = await query_investorDAO_pool_info(action, parsedBody, messageBlocks, buttons, returnValue)
          break
        case 'query_all_accounts_and_balances':
          [action, returnValue, messageBlocks, buttons] = await query_all_accounts_and_balances(action, parsedBody, messageBlocks, buttons, returnValue)
          break
        case 'query_closing_of_pool':
          [action, returnValue, messageBlocks, buttons] = await query_closing_of_pool(action, parsedBody, messageBlocks, buttons, returnValue)
          break
        case 'investor_dao_validate_createPool':
          [action, returnValue, messageBlocks, buttons] = await investor_dao_validate_createPool(action, parsedBody, messageBlocks, buttons, returnValue)
          break
        case 'investor_dao_createPool':
          [action, returnValue, messageBlocks, buttons] = await investor_dao_createPool(action, parsedBody, messageBlocks, buttons, returnValue)
          break
          case 'query_all_investor_dao_balances_of_address':
          [action, returnValue, messageBlocks, buttons] = await query_all_investor_dao_balances_of_address(action, parsedBody, messageBlocks, buttons, returnValue)
          break
        case 'query_all_investor_dao_account_of_address':
          [action, returnValue, messageBlocks, buttons] = await query_all_investor_dao_account_of_address(action, parsedBody, messageBlocks, buttons, returnValue)
          break
        case 'query_all_investor_dao_balance_of_balanceHash':
          [action, returnValue, messageBlocks, buttons] = await query_all_investor_dao_balance_of_balanceHash(action, parsedBody, messageBlocks, buttons, returnValue)
          break
        case 'settings_apiKeys':
          [action, returnValue, messageBlocks, buttons] = await settings_apiKeys(action, parsedBody, messageBlocks, buttons, returnValue)
          break
        case 'settings_contracts':
          [action, returnValue, messageBlocks, buttons] = await settings_contracts(action, parsedBody, messageBlocks, buttons, returnValue)
          break
        case 'settings_networks':
          [action, returnValue, messageBlocks, buttons] = await settings_networks(action, parsedBody, messageBlocks, buttons, returnValue)
          break
        case 'settings_save':
          [action, returnValue, messageBlocks, buttons] = await settings_save(action, parsedBody, messageBlocks, buttons, returnValue)
          break
        case 'settings_signers':
          [action, returnValue, messageBlocks, buttons] = await settings_signers(action, parsedBody, messageBlocks, buttons, returnValue)
          break
        case 'settings':
          [action, returnValue, messageBlocks, buttons] = await settings(action, parsedBody, messageBlocks, buttons, returnValue)
          console.log('\x1b[33m%s\x1b[0m', 'settings')
          break
        default:
          [action, returnValue, messageBlocks, buttons] = await error({
            ...action,
            value: { ...action.value, error: `Action ${action_id} not found` }
          }, parsedBody, messageBlocks, buttons, returnValue)
          break
    }
  } else {
    if (action_id) {
      switch (action_id) {
        case 'delete_msg':
          [action, returnValue, messageBlocks, buttons] = await delete_msg(action, parsedBody, messageBlocks, buttons, returnValue)
          break
        case 'select_env':
          console.log('\x1b[33m%s\x1b[0m', 'select_env')
          break
        case 'select_contract':
          console.log('\x1b[33m%s\x1b[0m', 'select_contract')
          break
        case 'investor_dao_validate_createPool':
          [action, returnValue, messageBlocks, buttons] = await investor_dao_validate_createPool(action, parsedBody, messageBlocks, buttons, returnValue)
          break
        case 'investor_dao_createPool':
          [action, returnValue, messageBlocks, buttons] = await investor_dao_createPool(action, parsedBody, messageBlocks, buttons, returnValue)
          break
        case 'query_contract_for_env':
          [action, returnValue, messageBlocks, buttons] = await query_contract_for_env(action, parsedBody, messageBlocks, buttons, returnValue)
          break
        case 'query_contract_calls-more':
          action = { ...action, value: { ...action.value, functionsPadding: 15 } }
          [action, returnValue, messageBlocks, buttons] = await query_contract_calls(action, parsedBody, messageBlocks, buttons, returnValue)
          break
        case 'query_contract_calls':
          action = { ...action, value: { ...action.value, functionsPadding: 15 } }
          [action, returnValue, messageBlocks, buttons] = await query_contract_calls(action, parsedBody, messageBlocks, buttons, returnValue)
          break
        case 'settings_apiKeys':
          [action, returnValue, messageBlocks, buttons] = await settings_apiKeys(action, parsedBody, messageBlocks, buttons, returnValue)
          break
        case 'settings_contracts':
          [action, returnValue, messageBlocks, buttons] = await settings_contracts(action, parsedBody, messageBlocks, buttons, returnValue)
          break
        case 'settings_networks':
          [action, returnValue, messageBlocks, buttons] = await settings_networks(action, parsedBody, messageBlocks, buttons, returnValue)
          break
        case 'settings_save':
          [action, returnValue, messageBlocks, buttons] = await settings_save(action, parsedBody, messageBlocks, buttons, returnValue)
          break
        case 'settings_signers':
          [action, returnValue, messageBlocks, buttons] = await settings_signers(action, parsedBody, messageBlocks, buttons, returnValue)
          break
        case 'settings':
          [action, returnValue, messageBlocks, buttons] = await settings(action, parsedBody, messageBlocks, buttons, returnValue)
          console.log('\x1b[33m%s\x1b[0m', 'settings')
          break
        default:
          [action, returnValue, messageBlocks, buttons] = await error({
            ...action,
            value: { ...action.value, error: `Action ${action_id} not found` }
          }, parsedBody, messageBlocks, buttons, returnValue)
          break
      }
    } else
    [action, returnValue, messageBlocks, buttons] = await error({
      ...action,
      value: { ...action.value, error: `Action ${action_id} not found` }
    }, parsedBody, messageBlocks, buttons, returnValue)
  }
  console.log('Now we are going to send the message', messageBlocks.length)
  if (messageBlocks.length > 0) {
    console.log('messageBlocks.length > 0')
    messageBlocks.push(
      slackBuilder.buildSlackActionMsg(env, undefined, [
        ...buttons,
        // slackBuilder.buildEtherscanLinkSlackButton(action.chainName, action.contractAddress)
    ]))
    returnValue.body = 'Message to action_id: ' + action_id + ' sent'
    if (messageBlocks.length > 0 && returnValue.body) await slackPostMessage(parsedBody.container.channel_id || SLACK_CONVERSATION_ID, returnValue.body, messageBlocks, true)
  }
  // log
  await createFaunaDocument('actions', {
    channel: parsedBody.channel,
    user: parsedBody.user,
    team: parsedBody.team,
    action: {
      ...action,
      owner: undefined,
      provider: undefined,
      ethereumProvider: undefined,
      contractInstance: undefined,
      contractAbi: undefined,
    }})

  return returnValue
}

export default slackActions