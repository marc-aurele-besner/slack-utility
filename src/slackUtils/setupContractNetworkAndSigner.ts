import { BaseContract, Wallet } from 'ethers'

import { TCommand, TContract, TEnv, TNetwork } from '../types'

import setupContractAndNetwork from './setupContractAndNetwork'

const defaultValues: TEnv = {
    networks: undefined as TNetwork[] | undefined,
    contracts: undefined as TContract[] | undefined,
    commands: undefined as TCommand[] | undefined
}

const setupContractNetworkAndSigner = async (
    env = defaultValues as TEnv,
    abis: any,
    network: string,
    contract: string
) => {
    const {
        networkFound,
        chainId,
        chainName,
        chainEmoji,
        rpcUrl,
        provider,
        signingType,
        explorer,
        contractFound,
        contractAddress,
        contractAbi
    } = await setupContractAndNetwork(env, abis, network, contract)
    let signer
    let contractInstance = undefined as BaseContract | undefined
    let contractName = ''
    let contractVersion = ''
    let contractSymbol = ''
    let contractDecimals = 0
    if (env.signerPrivateKey && provider) signer = new Wallet(env.signerPrivateKey, provider)
    if (networkFound && contractFound) {
        try {
            contractInstance = new BaseContract(contractAddress, contractAbi, signer)
        } catch (e) {}
        if (contractInstance) {
            try {
                contractName =
                    (contractInstance as any).name !== undefined ? await (contractInstance as any).name() : ''
            } catch (e) {}
            try {
                contractVersion =
                    (contractInstance as any).version !== undefined ? await (contractInstance as any).version() : ''
            } catch (e) {}
            try {
                contractSymbol =
                    (contractInstance as any).symbol !== undefined ? await (contractInstance as any).symbol() : ''
            } catch (e) {}
            try {
                contractDecimals =
                    (contractInstance as any).decimals !== undefined ? await (contractInstance as any).decimals() : ''
            } catch (e) {}
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
        // From setupContractAndNetwork()
        contractFound,
        contractAddress,
        contractAbi,
        // Local to setupContractNetworkAndSigner()
        signer,
        contractInstance,
        contractName,
        contractVersion,
        contractSymbol,
        contractDecimals
    }
}

export default setupContractNetworkAndSigner
