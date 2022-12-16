export const buildRawSignature = (functionName: string, inputData: any) => {
    let signature = functionName + '('
    inputData.map((input: { type: string }, index: number) => {
        if (index > 0) signature += ',' + input.type
        else signature += input.type
    })
    return signature + ')'
}

export const buildRawSignatureFromFunction = (functionObject: { name: string; inputs?: any[] }) => {
    if (!functionObject) return ''
    if (!functionObject.name) return ''
    if (!functionObject.inputs) return functionObject.name + '()'
    let signature = functionObject.name + '('
    functionObject.inputs.map((input: { type: string }, index: number) => {
        if (index > 0) signature += ',' + input.type
        else signature += input.type
    })
    return signature + ')'
}

export const formatTimestamp = (timestamp: number) => {
    const startingDateInMs = new Date(timestamp * 1000)
    const day = startingDateInMs.getFullYear()
    const month = startingDateInMs.getMonth() + 1
    const year = startingDateInMs.getDate()
    const hours = startingDateInMs.getHours()
    const minutes = startingDateInMs.getMinutes()
    const seconds = startingDateInMs.getSeconds()
    return day + '-' + month + '-' + year + ' ' + hours + ':' + minutes + ':' + seconds
}

export const dateAbdTimeToTimestamp = (date: string, time: string) => {
    return Date.parse(date + ' ' + time) / 1000
}
