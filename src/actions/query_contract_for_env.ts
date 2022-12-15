import slackBuilder from '../slackBuilder'
import retrieveEnvironment from '../slackUtils/retrieveEnvironment'
import setupContractAndNetwork from '../slackUtils/setupContractAndNetwork'
import { TBlockElements, TBlocks, TReturnValue } from '../types'

const action = async (
    actionObject: any,
    parsedBody: any,
    messageBlocks: TBlocks,
    buttons: TBlockElements,
    returnValue: TReturnValue
) => {
    console.log('query_contract_for_env')
    try {
        const { environmentFound, selectedEnvironment, selectedContract } = await retrieveEnvironment(parsedBody)
        if (environmentFound) {
            const { chainId, chainName, chainEmoji, explorer, contractAbi, contractAddress } =
                await setupContractAndNetwork(
                    actionObject.env,
                    actionObject.abis,
                    selectedEnvironment,
                    selectedContract
                )
            messageBlocks.push(
                slackBuilder.buildSimpleSlackHeaderMsg(
                    `${selectedContract} Info - ${chainEmoji} ${chainName.charAt(0).toUpperCase() + chainName.slice(1)}`
                )
            )
            if (contractAddress === undefined)
                messageBlocks.push(slackBuilder.buildSimpleSectionMsg('', `Contract instance not found`))
            else
                messageBlocks.push(
                    slackBuilder.buildSimpleSectionMsg('', `Contract instance found for ${selectedContract}`)
                )
            buttons.push(
                slackBuilder.buildEtherscanLinkSlackButton(
                    chainName + ' Explorer',
                    'buttonGoEtherscan',
                    explorer,
                    contractAddress
                ),
                slackBuilder.buildLinkSlackButton(
                    '-> DAPP',
                    undefined,
                    'buttonGo2Dapp',
                    'primary',
                    actionObject.dappUrl + 'contract/' + selectedContract
                )
            )
            // eslint-disable-next-line
            const contractFunctionsView = contractAbi.filter(
                (abi: any) =>
                    abi.type === 'function' &&
                    abi.inputs.length === 0 &&
                    (abi.stateMutability === 'view' || abi.stateMutability === 'pure')
            )
            // eslint-disable-next-line
            const contractFunctionsRead = contractAbi.filter(
                (abi: any) =>
                    abi.type === 'function' &&
                    abi.inputs.length > 0 &&
                    (abi.stateMutability === 'view' || abi.stateMutability === 'pure')
            )
            // eslint-disable-next-line
            const contractFunctionsWrite = contractAbi.filter(
                (abi: any) =>
                    abi.type === 'function' && abi.stateMutability !== 'view' && abi.stateMutability !== 'pure'
            )
            // eslint-disable-next-line
            const contractEvents = contractAbi.filter((abi: any) => abi.type === 'event')

            if (contractFunctionsView.length > 0)
                buttons.push(
                    slackBuilder.buildSimpleSlackButton(
                        'Read calls (no argument) (' + contractFunctionsView.length + ')',
                        {
                            selectedEnvironment,
                            selectedContract,
                            chainId,
                            chainName,
                            functionsPadding: 0
                        },
                        'query_contract_staticCall',
                        'primary'
                    )
                )
            if (contractFunctionsRead.length > 0)
                buttons.push(
                    slackBuilder.buildSimpleSlackButton(
                        'Read calls (' + contractFunctionsRead.length + ')',
                        {
                            selectedEnvironment,
                            selectedContract,
                            chainId,
                            chainName,
                            functionsPadding: 0
                        },
                        'query_contract_readCall',
                        'primary'
                    )
                )
            if (contractFunctionsWrite.length > 0)
                buttons.push(
                    slackBuilder.buildSimpleSlackButton(
                        'Write calls (' + contractFunctionsWrite.length + ')',
                        {
                            selectedEnvironment,
                            selectedContract,
                            chainId,
                            chainName,
                            functionsPadding: 0
                        },
                        'query_contract_writeCall',
                        'primary'
                    )
                )
            if (contractEvents.length > 0)
                buttons.push(
                    slackBuilder.buildSimpleSlackButton(
                        'All events (' + contractEvents.length + ')',
                        {
                            selectedEnvironment,
                            selectedContract,
                            chainId,
                            chainName
                        },
                        'query_contract_queryEvents',
                        'primary'
                    )
                )
        }
    } catch (error) {
        console.log('error', error)
    }

    return [actionObject, returnValue, messageBlocks, buttons]
}

export default action
