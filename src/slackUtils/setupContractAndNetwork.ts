import { TAddressPerNetwork, TCommand, TContract, TEnv, TNetwork } from '../types'

import setupNetwork from './setupNetwork'

const defaultValues: TEnv = {
    networks: undefined as TNetwork[] | undefined,
    contracts: undefined as TContract[] | undefined,
    commands: undefined as TCommand[] | undefined
}

const setupContractAndNetwork = async (
    env = defaultValues as TEnv | undefined,
    abis: any,
    network: string,
    contract: string
) => {
    const { networkFound, chainId, chainName, chainEmoji, rpcUrl, provider, signingType, explorer } =
        await setupNetwork(env, network)
    // list objects in abis
    const contractsAbis = typeof abis === 'object' ? Object.keys(abis) : []
    let contractFound = false
    let contractAddress = '' as string
    let contractAbi = undefined as any | undefined
    if (env !== undefined && networkFound && env.contracts !== undefined) {
        const contractData = env.contracts.find((c: TContract) => c.name === contract)
        let contractDataOnNetwork = undefined as TAddressPerNetwork | undefined
        if (contractData !== undefined) {
            contractDataOnNetwork = contractData.addressPerNetwork.find(
                (networkObject: TAddressPerNetwork) => networkObject.network === network
            )
            if (contractDataOnNetwork) {
                const abiName = contractDataOnNetwork.abiName
                contractAddress = contractDataOnNetwork.address
                if (contractsAbis.includes(abiName)) {
                    contractAbi = abis[abiName]
                    contractFound = true
                }
            }
        }
    }
    return {
        // From setupNetwork()
        networkFound,
        chainId,
        chainName,
        chainEmoji,
        rpcUrl,
        provider,
        signingType,
        explorer,
        // Local to setupContractAndNetwork()
        contractFound,
        contractAddress,
        contractAbi
    }
}

export default setupContractAndNetwork
