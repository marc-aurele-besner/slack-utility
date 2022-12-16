import { BigNumber } from 'ethers'

import slackBuilder from '../slackBuilder'
import slackUtils from '../slackUtils'
import { TBlockElements, TBlocks, TReturnValue } from '../types'
import { formatTimestamp } from '../utils'

const action = async (
    actionObject: any,
    parsedBody: any,
    messageBlocks: TBlocks,
    buttons: TBlockElements,
    returnValue: TReturnValue
) => {
    console.log('explorer')
    try {
        const { environmentFound, selectedEnvironment } = await slackUtils.retrieveEnvironment(parsedBody)
        if (environmentFound) {
            const { chainName, chainEmoji, provider } = await slackUtils.setupNetwork(
                actionObject.env,
                selectedEnvironment
            )
            if (provider === undefined) {
                messageBlocks.push(slackBuilder.buildSimpleSectionMsg('', `:x: Error: provider not found`))
                return [action, returnValue, messageBlocks, buttons]
            }
            messageBlocks.push(slackBuilder.buildSimpleSlackHeaderMsg(`${chainEmoji} ${chainName} - Explorer:`))
            let lastBlock = ''
            let lastBlockTime = ''
            let lastTxCountInBlock = ''
            let blockTime = {
                last10: 0,
                last100: 0,
                last1000: 0
            }
            try {
                const currentBlockNumber = await provider.getBlockNumber()
                const currentBlock = await provider.getBlock(currentBlockNumber)
                const blockMinus10 = await provider.getBlock(currentBlockNumber - 10)
                const blockMinus100 = await provider.getBlock(currentBlockNumber - 100)
                const blockMinus1000 = await provider.getBlock(currentBlockNumber - 1000)
                lastBlock = BigNumber.from(currentBlockNumber).toString()
                lastBlockTime = BigNumber.from(currentBlock.timestamp).toString()
                lastTxCountInBlock = currentBlock.transactions.length.toString()
                blockTime = {
                    last10: (currentBlock.timestamp - blockMinus10.timestamp) / 10,
                    last100: (currentBlock.timestamp - blockMinus100.timestamp) / 100,
                    last1000: (currentBlock.timestamp - blockMinus1000.timestamp) / 1000
                }
                messageBlocks.push(
                    slackBuilder.buildSimpleSectionMsg('Last block: ', lastBlock),
                    slackBuilder.buildSimpleSectionMsg(
                        'Last block hash: ',
                        `${currentBlock.hash}\n└───Parent block hash: ${currentBlock.hash}`
                    ),
                    slackBuilder.buildSimpleSectionMsg(
                        'Last block timestamp: ',
                        lastBlockTime + ' (' + formatTimestamp(currentBlock.timestamp) + ')'
                    ),
                    slackBuilder.buildSimpleSectionMsg(
                        'Last block tx count: ',
                        `${lastTxCountInBlock}\nBase fee per gas: ${
                            currentBlock.baseFeePerGas ? currentBlock.baseFeePerGas : 'not supported'
                        }`
                    ),
                    slackBuilder.buildSimpleSectionMsg(
                        'Block time: ',
                        `\nLast 10 blocks avg: ${blockTime.last10} seconds per block\nLast 100 blocks avg: ${blockTime.last100} seconds per block\nLast 1000 blocks avg: ${blockTime.last1000} seconds per block`
                    )
                )
            } catch (error) {
                messageBlocks.push(
                    slackBuilder.buildSimpleSectionMsg('Error: ', 'Error querying the last block from the provider')
                )
            }
        } else messageBlocks.push(slackBuilder.buildSimpleSectionMsg('', `:x: Error: Environment not found`))
    } catch (error) {
        console.log('error', error)
        messageBlocks.push(slackBuilder.buildSimpleSlackHeaderMsg(`:x: Error: ${error}`))
    }

    return [actionObject, returnValue, messageBlocks, buttons]
}

export default action
