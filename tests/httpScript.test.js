import test from 'node:test'
import assert from 'node:assert/strict'

import { run as httpScript } from '../src/httpScript.js'

test('Auto Base Url', () => {
  assert.equal(
    httpScript('g https://httpbin.org/get' + '\n---' + '\np /post').url,

    'https://httpbin.org/post',
  )

  assert.equal(
    httpScript('g httpbin.org/get' + '\n---' + '\np /post').url,

    'https://httpbin.org/post',
  )

  assert.equal(
    httpScript(
      'g 0.0.0.0/index.html' +
        '\n---' +
        '\np /settings.html' +
        '\n---' +
        '\np /save.html',
    ).url,

    'http://0.0.0.0/save.html',
  )

  assert.equal(
    httpScript(
      'g 0.0.0.0/index.html' +
        '\n---' +
        '\np 192.168.0.1/settings.html' +
        '\n---' +
        '\np /save.html',
    ).url,

    'http://192.168.0.1/save.html',
  )

  assert.equal(
    httpScript(
      'p 0.0.0.0/index.html' +
        '\n' +
        '\n.js' +
        '\nthis.state.baseUrl = "0.0.0.0"' +
        '\n.' +
        '\n---' +
        '\np 192.168.0.1/settings.html',
    ).url,

    'http://192.168.0.1/settings.html',
  )

  assert.equal(
    httpScript(
      'p 0.0.0.0/index.html' +
        '\n' +
        '\n.js' +
        '\nthis.state.baseUrl = "0.0.0.0"' +
        '\n.' +
        '\n---' +
        '\np 192.168.0.1/settings.html' +
        '\n---' +
        '\np /save.html',
    ).url,

    'http://0.0.0.0/save.html',
  )

  assert.equal(
    httpScript(
      'p 0.0.0.0/index.html' +
        '\n' +
        '\n.js' +
        '\nthis.state.baseUrl = "https://0.0.0.0"' +
        '\n.' +
        '\n---' +
        '\np 192.168.0.1/settings.html' +
        '\n---' +
        '\np /save.html',
    ).url,

    'https://0.0.0.0/save.html',
  )

  assert.equal(
    httpScript(
      'p 0.0.0.0/index.html' +
        '\n' +
        '\n.js' +
        '\nthis.state.baseUrl = "https://0.0.0.0/config"' +
        '\n.' +
        '\n---' +
        '\np /firewall.html',
    ).url,

    'https://0.0.0.0/config/firewall.html',
  )
})

test('Variables', () => {
  function funcAuth(request) {
    const auth = request.headers['Authorization']

    if (typeof request.body === 'string') {
      const json = JSON.parse(request.body)

      if (json.user === 'demo' && json.key === '123')
        return {
          token: 'XXX',
        }
    }

    if (auth === 'Bearer XXX') {
      return {
        user: {
          id: 1,
          name: 'demo',
          key: '123',
        },
      }
    }

    return request
  }

  assert.equal(
    httpScript(
      'g :1234' +
        '\n' +
        '\n.js' +
        '\nthis.state.user = { id: 1 }' +
        '\n.' +
        '\n---' +
        '\ng :1234/$user.id',
    ).url,

    'http://localhost:1234/1',
  )

  const authResult = httpScript(
    'p :1234/auth' +
      '\n' +
      '\n.body' +
      '\n{"user": "demo", "key": "123"}' +
      '\n.' +
      '\n' +
      '\n.js' +
      '\nthis.state.token = response.token' +
      '\n.' +
      '\n---' +
      '\ng :1234/user/config' +
      '\n' +
      '\nAuthorization: Bearer $token' +
      '\n',

    funcAuth,
  )

  assert.deepEqual(authResult, {
    user: {
      id: 1,
      name: 'demo',
      key: '123',
    },
  })

  assert.equal(
    httpScript(
      'g :1234' +
        '\n' +
        '\n.js' +
        '\nthis.state.arr = [1, 2, 3]' +
        '\n.' +
        '\n---' +
        '\ng :1234/$arr.0/$arr.1',
    ).url,

    'http://localhost:1234/1/2',
  )

  assert.equal(
    httpScript(
      'g :1234' +
        '\n' +
        '\n.js' +
        '\nthis.state.user = "Test"' +
        '\n.' +
        '\n---' +
        '\ng :1234' +
        '\n' +
        '\nUser-Agent:$user' +
        '\n',
    ).headers['User-Agent'],

    'Test',
  )

  assert.equal(
    httpScript(
      'g :1234' +
        '\n' +
        '\n.js' +
        '\nthis.state.user = "Test"' +
        '\n.' +
        '\n---' +
        '\ng :1234/search' +
        '\n' +
        '\nq=$user' +
        '\n',
    ).queries.q,

    'Test',
  )

  const resultFiles = httpScript(
    'g :1234/image.png' +
      '\n' +
      '\n.js' +
      '\nthis.state.image = this.url.split("/").slice(-1)' +
      '\nthis.state.path = "/path/to"' +
      '\n.' +
      '\n---' +
      '\np :1234/galery' +
      '\n< $path/$image' +
      '\n> $path/data.json',
  )

  assert.equal(resultFiles.fileToSend, '/path/to/image.png')
  assert.equal(resultFiles.saveFile, '/path/to/data.json')

  assert.equal(
    httpScript(
      'g :1234' +
        '\n' +
        '\n.js' +
        '\nthis.state.image = "test.png"' +
        '\n.' +
        '\n---' +
        '\np :1234' +
        '\n.js' +
        '\nthis.state.image = "_$image"' +
        '\n.',
    ).state.image,

    '_test.png',
  )

  assert.equal(
    httpScript(
      'g :1234' +
        '\n' +
        '\n.js' +
        '\nthis.state.image = "test.png"' +
        '\n.' +
        '\n---' +
        '\np :1234' +
        '\n.body' +
        '\nfield=$image' +
        '\n.',
    ).body,

    'field=test.png',
  )
})

test('State', () => {
  let result

  result = httpScript(
    'g :1234' +
      '\n' +
      '\n' +
      '\n.js' +
      '\nthis.state.data = 0' +
      '\n.' +
      '\n---' +
      '\ng :1234' +
      '\n' +
      '\n' +
      '\n.js' +
      '\nthis.state.name = "John Due"' +
      '\n.',
  )

  assert.equal(result.state.data, 0)
  assert.equal(result.state.name, 'John Due')
})

test('State Default', () => {
  let result

  result = httpScript(
    'g :1234' +
      '\n' +
      '\n' +
      '\n.js' +
      '\nthis.state.default.headers.Auth = "XXX"' +
      '\n.' +
      '\n---' +
      '\ng :1234',
  )

  assert.equal(result.state.default.headers.Auth, 'XXX')

  assert.equal(result.headers.Auth, 'XXX')

  result = httpScript(
    'g :1234' +
      '\n' +
      '\n' +
      '\n.js' +
      '\nthis.state.default.headers.Auth = "XXX"' +
      '\n.' +
      '\n---' +
      '\ng :1234' +
      '\nAuth: 123' +
      '\n',
  )

  assert.equal(result.headers.Auth, '123')

  result = httpScript(
    'g :1234' +
      '\n' +
      '\n' +
      '\n.js' +
      '\nthis.state.default.headers.Auth = "XXX"' +
      '\n.' +
      '\n---' +
      '\ng :1234' +
      '\nUser-Agent: HTTP Script' +
      '\n',
  )

  assert.equal(result.headers.Auth, 'XXX')
  assert.equal(result.headers['User-Agent'], 'HTTP Script')
})
