export function evalParsed(parsed) {
  const regex = /(?<!\\)\$([_\w][_\w.]*)\b/g
  const escapeRegex = /\\(\$[_\w][_\w.]*)\b/g

  function parseData(_, data) {
    const props = data.split('.')
    let state = parsed.state

    if (state == null) {
      throw new Error(`Variable 'state' is ${state}`)
    }

    for (let prop of props) {
      const tmp = state[prop]

      if (tmp == null) {
        const prettyState = JSON.stringify(parsed.state, null, 2)
        throw new Error(
          `Property '${prop}' is ${tmp} on ${data} with ${prettyState}`,
        )
      }

      state = tmp
    }

    return state
  }

  function serializeParsed(obj, isParsed = false) {
    for (const [key, value] of Object.entries(obj)) {
      if (key === 'state' && isParsed) continue

      const type = typeof value

      if (type === 'string') {
        obj[key] = value.replace(regex, parseData)
        obj[key] = obj[key].replace(escapeRegex, '$1')
      } else if (type === 'object' && value !== null)
        obj[key] = serializeParsed(value)
    }

    return obj
  }

  serializeParsed(parsed, true)
}
