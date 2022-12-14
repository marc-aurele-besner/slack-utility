import { providers } from 'ethers'

import { TCommand, TContract, TEnv, TNetwork, TSigningType } from '../types'

const defaultValues: TEnv = {
    networks: undefined as TNetwork[] | undefined,
    contracts: undefined as TContract[] | undefined,
    commands: undefined as TCommand[] | undefined
}

const setupNetwork = async (env = defaultValues as TEnv | undefined, network: string) => {
    let networkFound = false
    let chainId = 1 as number | string
    let chainName = 'Local Node' as string
    let chainEmoji = '👨‍💻' as string
    let rpcUrl = 'http://localhost:8545'
    let provider = undefined as providers.JsonRpcProvider | undefined
    let signingType = 'appKeys' as TSigningType
    let explorer = 'etherscan.io' as string
    if (env !== undefined && env.networks !== undefined) {
        const networkConfig = env.networks.find((n: TNetwork) => n.value === network)
        if (networkConfig !== undefined) {
            chainEmoji = networkConfig.emoji
            chainName = networkConfig.name
            chainId = networkConfig.chainId
            signingType = networkConfig.signingType
            explorer = networkConfig.explorer || explorer
            rpcUrl = networkConfig.defaultRpc
            try {
                provider = new providers.JsonRpcProvider(rpcUrl)
                networkFound = true
            } catch (e) {}
        }
    }
    return {
        networkFound,
        chainId,
        chainName,
        chainEmoji,
        rpcUrl,
        provider,
        signingType,
        explorer
    }
}

export default setupNetwork
