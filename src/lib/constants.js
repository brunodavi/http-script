export const REST_OPTIONS = {
  method: 'GET',
  url: null,

  queries: {},
  headers: {},
  body: null,

  fileToSend: null,
  saveFile: null,

  state: {},

  js: null,

  // eslint-disable-next-line no-unused-vars
  runJs(response) {
    if (this.js) eval(this.js)
  },
}

export const REST_METHODS = {
  g: 'GET',
  p: 'POST',
  u: 'PUT',
  a: 'PATCH',
  d: 'DELETE',
  h: 'HEAD',
  o: 'OPTIONS',
  t: 'TRACE',

  get: 'GET',
  post: 'POST',
  put: 'PUT',
  patch: 'PATCH',
  delete: 'DELETE',
  head: 'HEAD',
  options: 'OPTIONS',
  trace: 'TRACE',
}
