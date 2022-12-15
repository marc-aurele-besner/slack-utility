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
