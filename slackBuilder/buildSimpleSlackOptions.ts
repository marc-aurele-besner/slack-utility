export type TSlackOption = {
  text: string
  value: string
}

export type TSlackOptions = TSlackOption[]

export const buildSimpleSlackOption = (option: TSlackOption) => {
  return {
    text: {
      type: 'plain_text',
      text: option.text
    },
    value: option.value
  }
}

const buildSimpleSlackOptions = (options: TSlackOptions) => {
  return options.map((option) => {
    return buildSimpleSlackOption(option)
  })
}

export default buildSimpleSlackOptions
