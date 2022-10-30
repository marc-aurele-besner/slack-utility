const buildSimpleSectionMsg = (title, value) => {
  return {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: `${title && title !== '' ? '*' + title + '*' : ''} ${value}`
    }
  }
}

export default buildSimpleSectionMsg
