import { TCommand, TContract, TEnv, TNetwork } from '../types'

const defaultValues: TEnv = {
    networks: undefined as TNetwork[] | undefined,
    contracts: undefined as TContract[] | undefined,
    commands: undefined as TCommand[] | undefined
}

const slashCommandsLoop = async (env = defaultValues as TEnv | undefined, parsedBody: any) => {
    if (parsedBody.command !== undefined && env !== undefined && env.commands !== undefined) {
        env?.commands.forEach((command) => {
            if (command.command === parsedBody.command)
                parsedBody.actions = [
                    {
                        action_id: command.actionId,
                        ...command.actionValue
                    }
                ]
        })
    }
    return parsedBody
}

export default slashCommandsLoop
