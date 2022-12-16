import slackBuilder from '../slackBuilder'
import slackUtils from '../slackUtils'
import { TAddressPerNetwork, TBlockElements, TBlocks, TContract, TNetwork, TReturnValue } from '../types'

const action = async (
    actionObject: any,
    parsedBody: any,
    messageBlocks: TBlocks,
    buttons: TBlockElements,
    returnValue: TReturnValue
) => {
    console.log('addressBook', actionObject)
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
            messageBlocks.push(slackBuilder.buildSimpleSlackHeaderMsg(`${chainEmoji} ${chainName} - Address Book:`))
            if (actionObject.env.contracts && actionObject.env.contracts.length > 0) {
                actionObject.env.contracts
                    .filter((contract: TContract) => contract.active)
                    .map((contract: TContract) => {
                        messageBlocks.push(slackBuilder.buildSimpleSectionMsg(contract.emoji, `${contract.name}`))
                        if (contract.addressPerNetwork.length > 0)
                            contract.addressPerNetwork
                                .filter((addressPerNetwork: TAddressPerNetwork) => addressPerNetwork.address !== '')
                                .map((addressPerNetwork: TAddressPerNetwork) => {
                                    const networkName =
                                        actionObject.env.networks && actionObject.env.networks.length > 0
                                            ? actionObject.env.networks.find(
                                                  (network: TNetwork) => network.value === addressPerNetwork.network
                                              )
                                                ? `${
                                                      actionObject.env.networks.find(
                                                          (network: TNetwork) =>
                                                              network.value === addressPerNetwork.network
                                                      ).emoji
                                                  } ${
                                                      actionObject.env.networks.find(
                                                          (network: TNetwork) =>
                                                              network.value === addressPerNetwork.network
                                                      ).name
                                                  }`
                                                : addressPerNetwork.network
                                            : addressPerNetwork.network
                                    messageBlocks.push(
                                        slackBuilder.buildSimpleSectionMsg(networkName, `${addressPerNetwork.address}`)
                                    )
                                })
                    })
            } else messageBlocks.push(slackBuilder.buildSimpleSectionMsg('', `:x: Error: No contracts found`))
        } else messageBlocks.push(slackBuilder.buildSimpleSectionMsg('', `:x: Error: Environment not found`))
    } catch (error) {
        console.log('error', error)
        messageBlocks.push(slackBuilder.buildSimpleSlackHeaderMsg(`:x: Error: ${error}`))
    }

    return [actionObject, returnValue, messageBlocks, buttons]
}

export default action
