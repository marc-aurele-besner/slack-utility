import { TCommand, TContract, TEnv, TNetwork } from '../types'

const defaultValues: TEnv = {
    networks: undefined as TNetwork[] | undefined,
    contracts: undefined as TContract[] | undefined,
    commands: undefined as TCommand[] | undefined
}

const commandsLoop = async (env = defaultValues as TEnv | undefined, parsedBody: any) => {
    try {
        if (parsedBody.command !== undefined && env !== undefined && env.commands !== undefined) {
            env?.commands.forEach((command) => {
                if (command.command === parsedBody.command || '/' + command.command === parsedBody.command) {
                    parsedBody.actions = [
                        {
                            action_id: command.actionId,
                            ...command.actionValue
                        }
                    ]
                }
            })
        }
    } catch (error) {
        console.log('error', error)
    }
    return parsedBody
}

export default commandsLoop
