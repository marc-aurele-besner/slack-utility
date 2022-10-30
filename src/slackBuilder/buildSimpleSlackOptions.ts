import { TBlockElementOption, TBlockElementOptions, TSlackOption, TSlackOptions } from '../types'

export const buildSimpleSlackOption = (option: TSlackOption): TBlockElementOption => {
    return {
        text: {
            type: 'plain_text',
            text: option.text
        },
        value: option.value
    }
}

const buildSimpleSlackOptions = (options: TSlackOptions): TBlockElementOptions => {
    return options.map((option: TSlackOption) => {
        return buildSimpleSlackOption(option)
    })
}

export default buildSimpleSlackOptions
