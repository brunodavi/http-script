import fs from 'fs'
import httpScript from 'http-script'

async function httpRequest(options) {
  const fileToSend = options.fileToSend
    ? fs.readFileSync(options.fileToSend)
    : undefined

  const headers = options.headers || {}
  const body = options.body || fileToSend

  const queryParams = new URLSearchParams(options.queries).toString()
  const url =
    options.queries && queryParams
      ? `${options.url}?${queryParams}`
      : options.url

  const response = await fetch(url, {
    method: options.method,
    headers: headers,
    body: body,
  })

  if (options.saveFile) {
    fs.writeFileSync(options.saveFile, await response.text())
  }

  return response
}

const restScript = `
g httpbin.org

---

p /post
`

httpScript.run(restScript, httpRequest).then(console.log)
