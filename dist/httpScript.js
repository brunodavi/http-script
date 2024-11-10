var httpScript =
  (() => {
    var h =
      Object.defineProperty
    var w =
      Object.getOwnPropertyDescriptor
    var E =
      Object.getOwnPropertyNames
    var S =
      Object
        .prototype
        .hasOwnProperty
    var T =
        (
          e,
          o,
        ) => {
          for (var s in o)
            h(
              e,
              s,
              {
                get: o[
                  s
                ],
                enumerable:
                  !0,
              },
            )
        },
      g =
        (
          e,
          o,
          s,
          l,
        ) => {
          if (
            (o &&
              typeof o ==
                'object') ||
            typeof o ==
              'function'
          )
            for (let n of E(
              o,
            ))
              !S.call(
                e,
                n,
              ) &&
                n !==
                  s &&
                h(
                  e,
                  n,
                  {
                    get: () =>
                      o[
                        n
                      ],
                    enumerable:
                      !(l =
                        w(
                          o,
                          n,
                        )) ||
                      l.enumerable,
                  },
                )
          return e
        }
    var $ =
      (
        e,
      ) =>
        g(
          h(
            {},
            '__esModule',
            {
              value:
                !0,
            },
          ),
          e,
        )
    var b =
      {}
    T(
      b,
      {
        run: () =>
          A,
      },
    )
    var P =
        {
          method:
            'GET',
          url: null,
          queries:
            {},
          headers:
            {},
          body: null,
          fileToSend:
            null,
          saveFile:
            null,
          state:
            {},
          js: null,
          runJs(
            response,
          ) {
            this
              .js &&
              eval(
                this
                  .js,
              )
          },
        },
      y =
        {
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
          patch:
            'PATCH',
          delete:
            'DELETE',
          head: 'HEAD',
          options:
            'OPTIONS',
          trace:
            'TRACE',
        }
    function p(
      e,
      o,
    ) {
      let s =
          {},
        l =
          e.matchAll(
            o,
          )
      for (let [
        ,
        n,
        r,
      ] of l)
        s[
          n
        ] =
          r
      return s
    }
    function v(
      e,
    ) {
      let o =
          e.toLowerCase(),
        s =
          y[
            o
          ]
      if (
        !s
      )
        throw new Error(
          `Method '${e}' unknown!`,
        )
      return s
    }
    function O(
      e,
    ) {
      return (
        e &&
        e
          .replace(
            /^:\d+/,
            'http://localhost$&',
          )
          .replace(
            /^localhost(:\d+)?/,
            'http://$&',
          )
          .replace(
            /^(?:[\w-]+\.)+[a-zA-Z]{2,}/m,
            'https://$&',
          )
          .replace(
            /^(?:\d{1,3}\.){3}\d{1,3}/m,
            'http://$&',
          )
      )
    }
    function x(
      e,
    ) {
      let o =
          {
            runJs:
              P.runJs,
          },
        s =
          /^([a-zA-Z]+) +(.*?)$/m
      if (
        !s.test(
          e,
        )
      )
        throw new Error(
          'Method or URL not found',
        )
      let [
        ,
        l,
        n,
      ] =
        e.match(
          s,
        )
      if (
        ((e =
          e.replace(
            s,
            '',
          )),
        (o.method =
          v(
            l,
          )),
        !n)
      )
        throw new Error(
          'URL is empty',
        )
      if (
        ((o.url =
          O(
            n,
          )),
        /^\.body/m.test(
          e,
        ))
      ) {
        if (
          [
            'GET',
            'TRACE',
            'HEAD',
          ].includes(
            o.method,
          )
        )
          throw new Error(
            `Invalid ${o.method} method to send body`,
          )
        let r =
          /^\.body\s*([\s\S]+?)\s*^\./m
        if (
          !r.test(
            e,
          )
        )
          throw new Error(
            "Invalid body (check if you forgot to close it with '.')",
          )
        let [
          ,
          t,
        ] =
          e.match(
            r,
          )
        ;(o.body =
          t),
          (e =
            e.replace(
              r,
              '',
            ))
      }
      if (
        /^\.js/m.test(
          e,
        )
      ) {
        let r =
          /^.js\s*([\s\S]+?)\s*^\./m
        if (
          !r.test(
            e,
          )
        )
          throw new Error(
            "Invalid js (check if you forgot to close it with '.')",
          )
        let [
          ,
          t,
        ] =
          e.match(
            r,
          )
        ;(e =
          e.replace(
            r,
            '',
          )),
          (o.js =
            t)
      }
      if (
        ((o.queries =
          p(
            e,
            /^(\S+?) *= *(.*?)$/gm,
          )),
        (o.headers =
          p(
            e,
            /^(\S+?): *(.*?)$/gm,
          )),
        /^</m.test(
          e,
        ))
      ) {
        let r =
          /< (.+?)$/m
        if (
          !r.test(
            e,
          )
        )
          throw new Error(
            'File to send not specified',
          )
        let t =
          [
            'POST',
            'PUT',
            'PATCH',
            'OPTIONS',
            'DELETE',
          ]
        if (
          !t.includes(
            o.method,
          )
        )
          throw new Error(
            `Invalid method (${o.method}), use one this: ` +
              t.join(
                ', ',
              ),
          )
        let [
          ,
          a,
        ] =
          e.match(
            r,
          )
        o.fileToSend =
          a
      }
      if (
        /^>/m.test(
          e,
        )
      ) {
        if (
          !/^> (.+?)$/m.test(
            e,
          )
        )
          throw new Error(
            'File to save not specified',
          )
        let [
          ,
          t,
        ] =
          e.match(
            /^> (.+?)$/m,
          )
        o.saveFile =
          t
      }
      return o
    }
    function f(
      e,
    ) {
      return e
        .replace(
          /#.*$/gm,
          '',
        )
        .split(
          /^---/gm,
        )
        .map(
          x,
        )
    }
    function c(
      e,
    ) {
      let o =
          /(?<!\\)\$([_\w][_\w.]*)\b/g,
        s =
          /\\(\$[_\w][_\w.]*)\b/g
      function l(
        r,
        t,
      ) {
        let i =
            t.split(
              '.',
            ),
          a =
            e.state
        if (
          a ==
          null
        )
          throw new Error(
            `Variable 'state' is ${a}`,
          )
        for (let d of i) {
          let u =
            a[
              d
            ]
          if (
            u ==
            null
          ) {
            let m =
              JSON.stringify(
                e.state,
                null,
                2,
              )
            throw new Error(
              `Property '${d}' is ${u} on ${t} with ${m}`,
            )
          }
          a =
            u
        }
        return a
      }
      function n(
        r,
        t = !1,
      ) {
        for (let [
          i,
          a,
        ] of Object.entries(
          r,
        )) {
          if (
            i ===
              'state' &&
            t
          )
            continue
          let d =
            typeof a
          d ===
          'string'
            ? ((r[
                i
              ] =
                a.replace(
                  o,
                  l,
                )),
              (r[
                i
              ] =
                r[
                  i
                ].replace(
                  s,
                  '$1',
                )))
            : d ===
                'object' &&
              a !==
                null &&
              (r[
                i
              ] =
                n(
                  a,
                ))
        }
        return r
      }
      n(
        e,
        !0,
      )
    }
    function A(
      e,
      o = (
        s,
      ) =>
        s,
    ) {
      let s =
          f(
            e,
          ),
        l =
          {}
      l.default =
        {
          ...REST_OPTIONS,
        }
      let n =
          null,
        r =
          null
      for (let t of s)
        (t.state =
          l),
          (t =
            {
              ...t
                .state
                .default,
              ...t,
              queries:
                {
                  ...t
                    .state
                    .default
                    .queries,
                  ...t.queries,
                },
              headers:
                {
                  ...t
                    .state
                    .default
                    .headers,
                  ...t.headers,
                },
            }),
          (t.url.startsWith(
            'http',
          ) ||
            t
              .state
              .baseUrl !=
              null) &&
            (r =
              addProtocol(
                t
                  .state
                  .baseUrl,
              ) ||
              new URL(
                t.url,
              )
                .origin),
          r !=
            null &&
            t.url.startsWith(
              '/',
            ) &&
            (t.url =
              r +
              t.url),
          c(
            t,
          ),
          (n =
            o(
              t,
            )),
          t.runJs(
            n,
          ),
          (l =
            {
              ...l,
              ...t.state,
            })
      return n
    }
    return $(
      b,
    )
  })()
