const buildSimpleSlackHeaderMsg = (text) => {
  return {
    type: 'header',
    text: {
      type: 'plain_text',
      text
    }
  }
}

export default buildSimpleSlackHeaderMsg
