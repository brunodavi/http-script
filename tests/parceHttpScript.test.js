import test from 'node:test'
import assert from 'node:assert/strict'
import { parseHttpScript } from '../src/lib/parseHttpScript.js'

test('Methods', () => {
  assert.equal(parseHttpScript('g :1234')[0].method, 'GET')

  assert.equal(parseHttpScript('get :1234')[0].method, 'GET')

  assert.equal(parseHttpScript('p :1234')[0].method, 'POST')

  assert.equal(parseHttpScript('post :1234')[0].method, 'POST')

  assert.equal(parseHttpScript('u :1234')[0].method, 'PUT')

  assert.equal(parseHttpScript('put :1234')[0].method, 'PUT')

  assert.equal(parseHttpScript('a :1234')[0].method, 'PATCH')

  assert.equal(parseHttpScript('patch :1234')[0].method, 'PATCH')

  assert.equal(parseHttpScript('d :1234')[0].method, 'DELETE')

  assert.equal(parseHttpScript('delete :1234')[0].method, 'DELETE')

  assert.equal(parseHttpScript('h :1234')[0].method, 'HEAD')
  assert.equal(parseHttpScript('head :1234')[0].method, 'HEAD')

  assert.equal(parseHttpScript('o :1234')[0].method, 'OPTIONS')

  assert.equal(parseHttpScript('options :1234')[0].method, 'OPTIONS')

  assert.equal(parseHttpScript('t :1234')[0].method, 'TRACE')

  assert.equal(parseHttpScript('trace :1234')[0].method, 'TRACE')

  assert.equal(parseHttpScript('G :1234')[0].method, 'GET')

  assert.equal(parseHttpScript('Get :1234')[0].method, 'GET')

  assert.equal(parseHttpScript('P :1234')[0].method, 'POST')

  assert.equal(parseHttpScript('Post :1234')[0].method, 'POST')

  assert.equal(parseHttpScript('U :1234')[0].method, 'PUT')

  assert.equal(parseHttpScript('Put :1234')[0].method, 'PUT')

  assert.equal(parseHttpScript('A :1234')[0].method, 'PATCH')

  assert.equal(parseHttpScript('Patch :1234')[0].method, 'PATCH')

  assert.equal(parseHttpScript('D :1234')[0].method, 'DELETE')

  assert.equal(parseHttpScript('Delete :1234')[0].method, 'DELETE')

  assert.equal(parseHttpScript('H :1234')[0].method, 'HEAD')
  assert.equal(parseHttpScript('Head :1234')[0].method, 'HEAD')

  assert.equal(parseHttpScript('O :1234')[0].method, 'OPTIONS')

  assert.equal(parseHttpScript('Options :1234')[0].method, 'OPTIONS')

  assert.equal(parseHttpScript('T :1234')[0].method, 'TRACE')

  assert.equal(parseHttpScript('Trace :1234')[0].method, 'TRACE')
})

test('Url', () => {
  const domain = 'httpbin.org'
  const siteUrl = `https://${domain}`

  const site = {}

  site.home = domain
  site.path = domain + '/get'
  site.query = domain + '/get?q=test'

  const ipDomain = '192.168.0.1'

  const ip = {}

  ip.port = ipDomain + ':8000'
  ip.path = ipDomain + '/index.html'
  ip.query = ipDomain + '/search.html?q=0.0.0.0'

  assert.equal(parseHttpScript('g :1234')[0].url, 'http://localhost:1234')

  assert.equal(parseHttpScript('g localhost')[0].url, 'http://localhost')

  assert.equal(
    parseHttpScript('g localhost:1234')[0].url,
    'http://localhost:1234',
  )

  assert.equal(parseHttpScript('g http://localhost')[0].url, 'http://localhost')

  assert.equal(
    parseHttpScript('g http://localhost:1234')[0].url,
    'http://localhost:1234',
  )

  assert.equal(parseHttpScript(`g ${site.home}`)[0].url, siteUrl)

  assert.equal(parseHttpScript(`g ${site.path}`)[0].url, siteUrl + '/get')

  assert.equal(
    parseHttpScript(`g ${site.query}`)[0].url,
    siteUrl + '/get?q=test',
  )

  assert.equal(
    parseHttpScript(`g ${ip.port}`)[0].url,
    `http://${ipDomain}:8000`,
  )

  assert.equal(
    parseHttpScript(`g ${ip.path}`)[0].url,
    `http://${ipDomain}/index.html`,
  )

  assert.equal(
    parseHttpScript(`g ${ip.query}`)[0].url,
    `http://${ipDomain}/search.html?q=0.0.0.0`,
  )
})

test('Queries', () => {
  const [result] = parseHttpScript(
    'g :1234/search' +
      '\n' +
      '\nq=item' +
      '\nlimit =10' +
      '\npage= 2' +
      '\ndev=' +
      '\n' +
      '\nsort = likes',
  )

  assert.deepEqual(
    result.queries,

    {
      q: 'item',
      limit: '10',
      page: '2',
      dev: '',
      sort: 'likes',
    },
  )
})

test('Headers', () => {
  const [result] = parseHttpScript(
    'g :1234/search' +
      '\n' +
      '\nContent-Type: application/json' +
      '\nAuthorization: Bearer xxx' +
      '\n' +
      '\nAccept:application/xml' +
      '\nUser-Agent:Testing' +
      '\n' +
      '\n' +
      '\n@123:321' +
      '\nX-Request-ID: 12345' +
      '\nContent-Length: ' +
      '\nNo-Value:' +
      '\nCache-Control:no-cache',
  )

  assert.deepEqual(
    result.headers,

    {
      'Content-Type': 'application/json',
      Authorization: 'Bearer xxx',
      Accept: 'application/xml',
      'User-Agent': 'Testing',
      '@123': '321',
      'X-Request-ID': '12345',
      'Content-Length': '',
      'No-Value': '',
      'Cache-Control': 'no-cache',
    },
  )
})

test('Body', () => {
  const [result] = parseHttpScript(
    'p :1234' +
      '\n' +
      '\n.body' +
      '\n' +
      '\n' +
      '\n{' +
      '\n\t"name": "user",' +
      '\n\t"password": "user12345"' +
      '\n}' +
      '\n' +
      '\n.',
  )

  const bodyExpected =
    '{' + '\n\t"name": "user",' + '\n\t"password": "user12345"' + '\n}'

  assert.equal(result.body, bodyExpected)
})

test('Js', () => {
  const [result] = parseHttpScript(
    'p :1234' +
      '\n' +
      '\n.js' +
      '\n' +
      '\n' +
      '\nconsole.log("test")' +
      '\nconsole.log(this)' +
      '\n' +
      '\n.',
  )

  const jsExpected = 'console.log("test")' + '\nconsole.log(this)'

  assert.equal(result.js, jsExpected)
})

test('Files', () => {
  const [resultConvert] = parseHttpScript(
    'p :1234/convert/png' + '\n' + '\n< ./image.jpg' + '\n> ./image.png' + '\n',
  )

  assert.equal(resultConvert.fileToSend, './image.jpg')
  assert.equal(resultConvert.saveFile, './image.png')

  const [result] = parseHttpScript(
    'g :1234/photos/png/image.png' + '\n' + '\n> ./image.png' + '\n',
  )

  assert(result.url.endsWith('.png'))
  assert.equal(result.saveFile, './image.png')
})

test('Multiples Requests Scripts', () => {
  const url = 'http://localhost:1234'

  const [getResult, postResult, putResult] = parseHttpScript(
    'g :1234' +
      '\n' +
      '\nq=item' +
      '\nContent-Type: application/json' +
      '\n---' +
      '\np :1234' +
      '\n.body' +
      '\nfield=123' +
      '\n.' +
      '\n< ./file.txt' +
      '\n---' +
      '\nu :1234' +
      '\n> ./data.json' +
      '\n.js' +
      '\nconsole.log(123)' +
      '\n.',
  )

  assert.equal(getResult.url, url)
  assert.equal(getResult.queries.q, 'item')
  assert.equal(getResult.headers['Content-Type'], 'application/json')

  assert.equal(postResult.url, url)
  assert.equal(postResult.body, 'field=123')
  assert.equal(postResult.fileToSend, './file.txt')

  assert.equal(putResult.url, url)
  assert.equal(putResult.saveFile, './data.json')
  assert.equal(putResult.js, 'console.log(123)')
})
test('Invalid Methods', () => {
  try {
    parseHttpScript('gg :1234')
    assert.fail('Not fail, invalid method')
  } catch (error) {
    assert.equal(error.message, "Method 'gg' unknown!")
  }

  try {
    parseHttpScript(' :1234')
    assert.fail('Not fail, invalid method')
  } catch (error) {
    assert.equal(error.message, 'Method or URL not found')
  }
})

test('Invalid Urls', () => {
  try {
    parseHttpScript('g ')
    assert.fail('Not fail, invalid url')
  } catch (error) {
    assert.equal(error.message, 'URL is empty')
  }

  try {
    parseHttpScript('g')
    assert.fail('Not fail, invalid url')
  } catch (error) {
    assert.equal(error.message, 'Method or URL not found')
  }

  try {
    parseHttpScript('ghttp://0.0.0.0')
    assert.fail('Not fail, invalid url')
  } catch (error) {
    assert.equal(error.message, 'Method or URL not found')
  }
})

test('Invalid Queries', () => {
  assert.deepEqual(
    parseHttpScript(
      'g :1234' +
        '\n=value123' +
        '\n = value123' +
        '\n   =value123' +
        '\n =  value123',
    )[0].queries,
    {},
  )
})

test('Invalid Headers', () => {
  assert.deepEqual(
    parseHttpScript(
      'g :1234' +
        '\n:value123' +
        '\n: value123' +
        '\n : value123' +
        '\n: value123' +
        '\n :  value123',
    )[0].headers,
    {},
  )
})

test('Invalid Body', () => {
  try {
    parseHttpScript('g :1234' + '\n' + '\n.body' + '\nfield=data' + '\n.')
    assert.fail('Not fail, invalid url')
  } catch (error) {
    assert.equal(error.message, 'Invalid GET method to send body')
  }

  try {
    parseHttpScript('p :1234' + '\n' + '\n.body' + '\nfield=data' + '\n')
    assert.fail('Not fail, invalid url')
  } catch (error) {
    assert.equal(
      error.message,
      "Invalid body (check if you forgot to close it with '.')",
    )
  }
})

test('Invalid Js', () => {
  try {
    parseHttpScript('p :1234' + '\n' + '\n.js' + '\nconsole.log(this)' + '\n')
    assert.fail('Not fail, invalid url')
  } catch (error) {
    assert.equal(
      error.message,
      "Invalid js (check if you forgot to close it with '.')",
    )
  }
})

test('Invalid Send To File', () => {
  try {
    parseHttpScript('g :1234' + '\n' + '\n< image.png')
    assert.fail('Not fail, invalid url')
  } catch (error) {
    assert.equal(
      error.message,
      'Invalid method (GET), use one this: ' +
        'POST, PUT, PATCH, OPTIONS, DELETE',
    )
  }

  try {
    parseHttpScript('p :1234' + '\n' + '\n< ')
    assert.fail('Not fail, invalid url')
  } catch (error) {
    assert.equal(error.message, 'File to send not specified')
  }

  try {
    parseHttpScript('p :1234' + '\n' + '\n<')
    assert.fail('Not fail, invalid url')
  } catch (error) {
    assert.equal(error.message, 'File to send not specified')
  }
})

test('Invalid Save File', () => {
  try {
    parseHttpScript('p :1234' + '\n' + '\n> ')
    assert.fail('Not fail, invalid url')
  } catch (error) {
    assert.equal(error.message, 'File to save not specified')
  }

  try {
    parseHttpScript('p :1234' + '\n' + '\n>')
    assert.fail('Not fail, invalid url')
  } catch (error) {
    assert.equal(error.message, 'File to save not specified')
  }
})
