import { addProtocol, getMethod } from './urlUtils.js'

function parseKeyValue(script, regex) {
  const json = {}
  const regexGroups = script.matchAll(regex)

  for (const [, key, value] of regexGroups) json[key] = value

  return json
}

function parseScript(script) {
  const options = {}

  const regexMethod = /^([a-zA-Z]+) +(.*?)$/m

  if (!regexMethod.test(script)) throw new Error('Method or URL not found')

  const [, method, url] = script.match(regexMethod)

  script = script.replace(regexMethod, '')

  options.method = getMethod(method)

  if (!url) throw new Error('URL is empty')

  options.url = addProtocol(url)

  if (/^\.body/m.test(script)) {
    if (['GET', 'TRACE', 'HEAD'].includes(options.method)) {
      throw new Error(`Invalid ${options.method} method to send body`)
    }

    const regexBody = /^\.body\s*([\s\S]+?)\s*^\./m

    if (!regexBody.test(script)) {
      throw new Error("Invalid body (check if you forgot to close it with '.')")
    }

    const [, body] = script.match(regexBody)
    options.body = body

    script = script.replace(regexBody, '')
  }

  if (/^\.js/m.test(script)) {
    const regexJs = /^.js\s*([\s\S]+?)\s*^\./m

    if (!regexJs.test(script)) {
      throw new Error("Invalid js (check if you forgot to close it with '.')")
    }

    const [, js] = script.match(regexJs)
    script = script.replace(regexJs, '')

    options.js = js
  }

  options.queries = parseKeyValue(script, /^(\S+?) *= *(.*?)$/gm)

  options.headers = parseKeyValue(script, /^(\S+?): *(.*?)$/gm)

  if (/^</m.test(script)) {
    const regexFileSend = /< (.+?)$/m

    if (!regexFileSend.test(script))
      throw new Error('File to send not specified')

    const methodSenders = ['POST', 'PUT', 'PATCH', 'OPTIONS', 'DELETE']

    const isMethodSender = methodSenders.includes(options.method)

    if (!isMethodSender) {
      throw new Error(
        `Invalid method (${options.method}), use one this: ` +
          methodSenders.join(', '),
      )
    }

    const [, sendedFile] = script.match(regexFileSend)
    options.fileToSend = sendedFile
  }

  if (/^>/m.test(script)) {
    const regexSaveFile = /^> (.+?)$/m

    if (!regexSaveFile.test(script))
      throw new Error('File to save not specified')

    const [, savedFile] = script.match(/^> (.+?)$/m)
    options.saveFile = savedFile
  }

  return options
}

export function parseHttpScript(restScript) {
  return restScript.replace(/#.*$/gm, '').split(/^---/gm).map(parseScript)
}
