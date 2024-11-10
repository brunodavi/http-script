import { REST_METHODS } from './constants.js'

export function getMethod(method) {
  let lowerMethod = method.toLowerCase()
  const upperMethod = REST_METHODS[lowerMethod]

  if (!upperMethod) throw new Error(`Method '${method}' unknown!`)

  return upperMethod
}

export function addProtocol(url) {
  if (!url) return url

  return url
    .replace(/^:\d+/, 'http://localhost$&')
    .replace(/^localhost(:\d+)?/, 'http://$&')
    .replace(/^(?:[\w-]+\.)+[a-zA-Z]{2,}/m, 'https://$&')
    .replace(/^(?:\d{1,3}\.){3}\d{1,3}/m, 'http://$&')
}
