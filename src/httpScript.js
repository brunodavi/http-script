import { REST_OPTIONS } from './lib/constants.js'
import { addProtocol } from './lib/urlUtils.js'
import { parseHttpScript } from './lib/parseHttpScript.js'
import { evalParsed } from './lib/evalParsed.js'

export function run(script, httpRequest = (options) => options, state = {}) {
  const parsedList = parseHttpScript(script)

  state.default = {
    ...REST_OPTIONS,
  }

  let response = null
  let baseUrl = null

  for (let parsed of parsedList) {
    parsed.state = state

    parsed = {
      ...parsed.state.default,
      ...parsed,

      queries: {
        ...parsed.state.default.queries,
        ...parsed.queries,
      },

      headers: {
        ...parsed.state.default.headers,
        ...parsed.headers,
      },
    }

    if (parsed.url.startsWith('http') || parsed.state.baseUrl != null)
      baseUrl = addProtocol(parsed.state.baseUrl) || new URL(parsed.url).origin

    if (baseUrl != null && parsed.url.startsWith('/'))
      parsed.url = baseUrl + parsed.url

    evalParsed(parsed)

    response = httpRequest(parsed)

    parsed.runJs(response)
    state = {
      ...state,
      ...parsed.state,
    }
  }

  return response
}
