(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([
  'object' == typeof document ? document.currentScript : void 0,
  77287,
  (e) => {
    'use strict';
    var t = e.i(61129);
    let r = (...e) =>
        e
          .filter((e, t, r) => !!e && '' !== e.trim() && r.indexOf(e) === t)
          .join(' ')
          .trim(),
      n = (e) => {
        let t = e.replace(/^([A-Z])|[\s-_]+(\w)/g, (e, t, r) =>
          r ? r.toUpperCase() : t.toLowerCase(),
        );
        return t.charAt(0).toUpperCase() + t.slice(1);
      };
    var i = {
      xmlns: 'http://www.w3.org/2000/svg',
      width: 24,
      height: 24,
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: 2,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
    };
    let a = (0, t.createContext)({}),
      o = (0, t.forwardRef)(
        (
          {
            color: e,
            size: n,
            strokeWidth: o,
            absoluteStrokeWidth: l,
            className: u = '',
            children: c,
            iconNode: s,
            ...f
          },
          d,
        ) => {
          let {
              size: p = 24,
              strokeWidth: h = 2,
              absoluteStrokeWidth: v = !1,
              color: y = 'currentColor',
              className: g = '',
            } = (0, t.useContext)(a) ?? {},
            m = (l ?? v) ? (24 * Number(o ?? h)) / Number(n ?? p) : (o ?? h);
          return (0, t.createElement)(
            'svg',
            {
              ref: d,
              ...i,
              width: n ?? p ?? i.width,
              height: n ?? p ?? i.height,
              stroke: e ?? y,
              strokeWidth: m,
              className: r('lucide', g, u),
              ...(!c &&
                !((e) => {
                  for (let t in e)
                    if (t.startsWith('aria-') || 'role' === t || 'title' === t) return !0;
                  return !1;
                })(f) && { 'aria-hidden': 'true' }),
              ...f,
            },
            [...s.map(([e, r]) => (0, t.createElement)(e, r)), ...(Array.isArray(c) ? c : [c])],
          );
        },
      );
    e.s(
      [
        'default',
        0,
        (e, i) => {
          let a = (0, t.forwardRef)(({ className: a, ...l }, u) =>
            (0, t.createElement)(o, {
              ref: u,
              iconNode: i,
              className: r(
                `lucide-${n(e)
                  .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
                  .toLowerCase()}`,
                `lucide-${e}`,
                a,
              ),
              ...l,
            }),
          );
          return ((a.displayName = n(e)), a);
        },
      ],
      77287,
    );
  },
  80998,
  (e) => {
    'use strict';
    let t = (0, e.i(77287).default)('refresh-cw', [
      ['path', { d: 'M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8', key: 'v9h5vc' }],
      ['path', { d: 'M21 3v5h-5', key: '1q7to0' }],
      ['path', { d: 'M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16', key: '3uifl3' }],
      ['path', { d: 'M8 16H3v5', key: '1cv678' }],
    ]);
    e.s(['RefreshCw', 0, t], 80998);
  },
  10316,
  (e) => {
    'use strict';
    let t = (0, e.i(77287).default)('users', [
      ['path', { d: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', key: '1yyitq' }],
      ['path', { d: 'M16 3.128a4 4 0 0 1 0 7.744', key: '16gr8j' }],
      ['path', { d: 'M22 21v-2a4 4 0 0 0-3-3.87', key: 'kshegd' }],
      ['circle', { cx: '9', cy: '7', r: '4', key: 'nufk8' }],
    ]);
    e.s(['Users', 0, t], 10316);
  },
  66544,
  (e) => {
    'use strict';
    let t = (0, e.i(77287).default)('bus', [
      ['path', { d: 'M8 6v6', key: '18i7km' }],
      ['path', { d: 'M15 6v6', key: '1sg6z9' }],
      ['path', { d: 'M2 12h19.6', key: 'de5uta' }],
      [
        'path',
        {
          d: 'M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3',
          key: '1wwztk',
        },
      ],
      ['circle', { cx: '7', cy: '18', r: '2', key: '19iecd' }],
      ['path', { d: 'M9 18h5', key: 'lrx6i' }],
      ['circle', { cx: '16', cy: '18', r: '2', key: '1v4tcr' }],
    ]);
    e.s(['Bus', 0, t], 66544);
  },
  18623,
  (e) => {
    'use strict';
    let t = (0, e.i(77287).default)('credit-card', [
      ['rect', { width: '20', height: '14', x: '2', y: '5', rx: '2', key: 'ynyp8z' }],
      ['line', { x1: '2', x2: '22', y1: '10', y2: '10', key: '1b3vmo' }],
    ]);
    e.s(['CreditCard', 0, t], 18623);
  },
  89842,
  (e, t, r) => {
    'use strict';
    (Object.defineProperty(r, Symbol.toStringTag, { value: 'Module' }),
      (r.debounce = function (e, t, { signal: r, edges: n } = {}) {
        let i,
          a = null,
          o = null != n && n.includes('leading'),
          l = null == n || n.includes('trailing'),
          u = () => {
            null !== a && (e.apply(i, a), (i = void 0), (a = null));
          },
          c = null,
          s = () => {
            (null != c && clearTimeout(c),
              (c = setTimeout(() => {
                ((c = null), l && u(), f());
              }, t)));
          },
          f = () => {
            (null !== c && (clearTimeout(c), (c = null)), (i = void 0), (a = null));
          },
          d = function (...e) {
            if (r?.aborted) return;
            ((i = this), (a = e));
            let t = null == c;
            (s(), o && t && u());
          };
        return (
          (d.schedule = s),
          (d.cancel = f),
          (d.flush = () => {
            u();
          }),
          r?.addEventListener('abort', f, { once: !0 }),
          d
        );
      }));
  },
  16696,
  (e, t, r) => {
    'use strict';
    Object.defineProperty(r, Symbol.toStringTag, { value: 'Module' });
    let n = e.r(89842);
    r.debounce = function (e, t = 0, r = {}) {
      let i;
      'object' != typeof r && (r = {});
      let { leading: a = !1, trailing: o = !0, maxWait: l } = r,
        u = [, ,];
      (a && (u[0] = 'leading'), o && (u[1] = 'trailing'));
      let c = null,
        s = n.debounce(
          function (...t) {
            ((i = e.apply(this, t)), (c = null));
          },
          t,
          { edges: u },
        ),
        f = function (...t) {
          return null != l && (null === c && (c = Date.now()), Date.now() - c >= l)
            ? ((i = e.apply(this, t)), (c = Date.now()), s.cancel(), s.schedule(), i)
            : (s.apply(this, t), i);
        };
      return ((f.cancel = s.cancel), (f.flush = () => (s.flush(), i)), f);
    };
  },
  45923,
  (e, t, r) => {
    'use strict';
    Object.defineProperty(r, Symbol.toStringTag, { value: 'Module' });
    let n = e.r(16696);
    r.throttle = function (e, t = 0, r = {}) {
      let { leading: i = !0, trailing: a = !0 } = r;
      return n.debounce(e, t, { leading: i, maxWait: t, trailing: a });
    };
  },
  17029,
  (e, t, r) => {
    t.exports = e.r(45923).throttle;
  },
  62742,
  (e, t, r) => {
    'use strict';
    (Object.defineProperty(r, Symbol.toStringTag, { value: 'Module' }),
      (r.isUnsafeProperty = function (e) {
        return '__proto__' === e;
      }));
  },
  95766,
  (e, t, r) => {
    'use strict';
    (Object.defineProperty(r, Symbol.toStringTag, { value: 'Module' }),
      (r.isDeepKey = function (e) {
        switch (typeof e) {
          case 'number':
          case 'symbol':
            return !1;
          case 'string':
            return e.includes('.') || e.includes('[') || e.includes(']');
        }
      }));
  },
  83922,
  (e, t, r) => {
    'use strict';
    (Object.defineProperty(r, Symbol.toStringTag, { value: 'Module' }),
      (r.toKey = function (e) {
        return 'string' == typeof e || 'symbol' == typeof e
          ? e
          : Object.is(e?.valueOf?.(), -0)
            ? '-0'
            : String(e);
      }));
  },
  38519,
  (e, t, r) => {
    'use strict';
    (Object.defineProperty(r, Symbol.toStringTag, { value: 'Module' }),
      (r.toString = function e(t) {
        if (null == t) return '';
        if ('string' == typeof t) return t;
        if (Array.isArray(t)) return t.map(e).join(',');
        let r = String(t);
        return '0' === r && Object.is(Number(t), -0) ? '-0' : r;
      }));
  },
  42138,
  (e, t, r) => {
    'use strict';
    Object.defineProperty(r, Symbol.toStringTag, { value: 'Module' });
    let n = e.r(38519),
      i = e.r(83922);
    r.toPath = function (e) {
      if (Array.isArray(e)) return e.map(i.toKey);
      if ('symbol' == typeof e) return [e];
      e = n.toString(e);
      let t = [],
        r = e.length;
      if (0 === r) return t;
      let a = 0,
        o = '',
        l = '',
        u = !1;
      for (46 === e.charCodeAt(0) && (t.push(''), a++); a < r; ) {
        let n = e[a];
        (l
          ? '\\' === n && a + 1 < r
            ? (o += e[++a])
            : n === l
              ? (l = '')
              : (o += n)
          : u
            ? '"' === n || "'" === n
              ? (l = n)
              : ']' === n
                ? ((u = !1), t.push(o), (o = ''))
                : (o += n)
            : '[' === n
              ? ((u = !0), o && (t.push(o), (o = '')))
              : '.' === n
                ? o && (t.push(o), (o = ''))
                : (o += n),
          a++);
      }
      return (o && t.push(o), t);
    };
  },
  88251,
  (e, t, r) => {
    'use strict';
    Object.defineProperty(r, Symbol.toStringTag, { value: 'Module' });
    let n = e.r(62742),
      i = e.r(95766),
      a = e.r(83922),
      o = e.r(42138);
    r.get = function e(t, r, l) {
      if (null == t) return l;
      switch (typeof r) {
        case 'string': {
          if (n.isUnsafeProperty(r)) return l;
          let a = t[r];
          if (void 0 === a)
            if (i.isDeepKey(r)) return e(t, o.toPath(r), l);
            else return l;
          return a;
        }
        case 'number':
        case 'symbol': {
          'number' == typeof r && (r = a.toKey(r));
          let e = t[r];
          if (void 0 === e) return l;
          return e;
        }
        default: {
          if (Array.isArray(r)) {
            var u = t,
              c = r,
              s = l;
            if (0 === c.length) return s;
            let e = u;
            for (let t = 0; t < c.length; t++) {
              if (null == e || n.isUnsafeProperty(c[t])) return s;
              e = e[c[t]];
            }
            return void 0 === e ? s : e;
          }
          if (((r = Object.is(r?.valueOf(), -0) ? '-0' : String(r)), n.isUnsafeProperty(r)))
            return l;
          let e = t[r];
          if (void 0 === e) return l;
          return e;
        }
      }
    };
  },
  28539,
  (e, t, r) => {
    t.exports = e.r(88251).get;
  },
  49294,
  65601,
  (e) => {
    'use strict';
    var t = e.i(28539);
    function r(e) {
      var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 4,
        r = 10 ** t,
        n = Math.round(e * r) / r;
      return Object.is(n, -0) ? 0 : n;
    }
    e.s(
      [
        'round',
        0,
        r,
        'roundTemplateLiteral',
        0,
        function (e) {
          for (var t = arguments.length, n = Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
            n[i - 1] = arguments[i];
          return e.reduce((e, t, i) => {
            var a = n[i - 1];
            return 'string' == typeof a ? e + a + t : void 0 !== a ? e + r(a) + t : e + t;
          }, '');
        },
      ],
      65601,
    );
    var n = (e) => 'number' == typeof e && e != +e,
      i = (e) => 'string' == typeof e && e.indexOf('%') === e.length - 1,
      a = (e) => ('number' == typeof e || e instanceof Number) && !n(e),
      o = 0,
      l = (e) => null == e;
    e.s(
      [
        'findEntryInArray',
        0,
        function (e, r, n) {
          if (e && e.length)
            return e.find((e) => e && ('function' == typeof r ? r(e) : (0, t.default)(e, r)) === n);
        },
        'getPercentValue',
        0,
        function (e, t) {
          var r,
            o = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 0,
            l = arguments.length > 3 && void 0 !== arguments[3] && arguments[3];
          if (!a(e) && 'string' != typeof e) return o;
          if (i(e)) {
            if (null == t) return o;
            var u = e.indexOf('%');
            r = (t * parseFloat(e.slice(0, u))) / 100;
          } else r = +e;
          return (n(r) && (r = o), l && null != t && r > t && (r = t), r);
        },
        'hasDuplicate',
        0,
        (e) => {
          if (!Array.isArray(e)) return !1;
          for (var t = e.length, r = {}, n = 0; n < t; n++)
            if (r[String(e[n])]) return !0;
            else r[String(e[n])] = !0;
          return !1;
        },
        'interpolate',
        0,
        function (e, t, n) {
          return a(e) && a(t) ? r(e + n * (t - e)) : t;
        },
        'isNan',
        0,
        n,
        'isNotNil',
        0,
        function (e) {
          return null != e;
        },
        'isNullish',
        0,
        l,
        'isNumOrStr',
        0,
        (e) => a(e) || 'string' == typeof e,
        'isNumber',
        0,
        a,
        'isPercent',
        0,
        i,
        'mathSign',
        0,
        (e) => (0 === e ? 0 : e > 0 ? 1 : -1),
        'noop',
        0,
        function () {},
        'uniqueId',
        0,
        (e) => {
          var t = ++o;
          return ''.concat(e || '').concat(t);
        },
        'upperFirst',
        0,
        (e) => (l(e) ? e : ''.concat(e.charAt(0).toUpperCase()).concat(e.slice(1))),
      ],
      49294,
    );
  },
  20178,
  21248,
  (e) => {
    'use strict';
    e.s(
      [
        'warn',
        0,
        function (e, t) {
          for (var r = arguments.length, n = Array(r > 2 ? r - 2 : 0), i = 2; i < r; i++)
            n[i - 2] = arguments[i];
          if (
            'u' > typeof console &&
            console.warn &&
            (void 0 === t && console.warn('LogUtils requires an error message argument'), !e)
          )
            if (void 0 === t)
              console.warn(
                'Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.',
              );
            else {
              var a = 0;
              console.warn(t.replace(/%s/g, () => n[a++]));
            }
        },
      ],
      20178,
    );
    var t = e.i(49294),
      r = {
        width: '100%',
        height: '100%',
        debounce: 0,
        minWidth: 0,
        initialDimension: { width: -1, height: -1 },
      },
      n = { width: 0, height: 0, overflow: 'visible' },
      i = { width: 0, overflowX: 'visible' },
      a = { height: 0, overflowY: 'visible' },
      o = {};
    e.s(
      [
        'calculateChartDimensions',
        0,
        (e, n, i) => {
          var { width: a = r.width, height: o = r.height, aspect: l, maxHeight: u } = i,
            c = (0, t.isPercent)(a) ? e : Number(a),
            s = (0, t.isPercent)(o) ? n : Number(o);
          return (
            l && l > 0 && (c ? (s = c / l) : s && (c = s * l), u && null != s && s > u && (s = u)),
            { calculatedWidth: c, calculatedHeight: s }
          );
        },
        'defaultResponsiveContainerProps',
        0,
        r,
        'getDefaultWidthAndHeight',
        0,
        function (e) {
          var { width: t, height: n, aspect: i } = e,
            a = t,
            o = n;
          return (
            void 0 === a && void 0 === o
              ? ((a = r.width), (o = r.height))
              : void 0 === a
                ? (a = i && i > 0 ? void 0 : r.width)
                : void 0 === o && (o = i && i > 0 ? void 0 : r.height),
            { width: a, height: o }
          );
        },
        'getInnerDivStyle',
        0,
        (e) => {
          var { width: r, height: l } = e,
            u = (0, t.isPercent)(r),
            c = (0, t.isPercent)(l);
          return u && c ? n : u ? i : c ? a : o;
        },
      ],
      21248,
    );
  },
  25894,
  (e) => {
    'use strict';
    e.s([
      'isPositiveNumber',
      0,
      function (e) {
        return 'number' == typeof e && e > 0 && Number.isFinite(e);
      },
      'isWellBehavedNumber',
      0,
      function (e) {
        return Number.isFinite(e);
      },
    ]);
  },
  11381,
  (e) => {
    'use strict';
    var t = e.i(94083),
      r = e.i(61129),
      n = e.i(17029),
      i = e.i(49294),
      a = e.i(20178),
      o = e.i(21248),
      l = e.i(25894);
    function u() {
      return (u = Object.assign.bind()).apply(null, arguments);
    }
    function c(e, t) {
      var r = Object.keys(e);
      if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(e);
        (t &&
          (n = n.filter(function (t) {
            return Object.getOwnPropertyDescriptor(e, t).enumerable;
          })),
          r.push.apply(r, n));
      }
      return r;
    }
    function s(e) {
      for (var t = 1; t < arguments.length; t++) {
        var r = null != arguments[t] ? arguments[t] : {};
        t % 2
          ? c(Object(r), !0).forEach(function (t) {
              var n, i, a;
              ((n = e),
                (i = t),
                (a = r[t]),
                (i = (function (e) {
                  var t = (function (e, t) {
                    if ('object' != typeof e || !e) return e;
                    var r = e[Symbol.toPrimitive];
                    if (void 0 !== r) {
                      var n = r.call(e, t || 'default');
                      if ('object' != typeof n) return n;
                      throw TypeError('@@toPrimitive must return a primitive value.');
                    }
                    return ('string' === t ? String : Number)(e);
                  })(e, 'string');
                  return 'symbol' == typeof t ? t : t + '';
                })(i)) in n
                  ? Object.defineProperty(n, i, {
                      value: a,
                      enumerable: !0,
                      configurable: !0,
                      writable: !0,
                    })
                  : (n[i] = a));
            })
          : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
            : c(Object(r)).forEach(function (t) {
                Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t));
              });
      }
      return e;
    }
    var f = (0, r.createContext)(o.defaultResponsiveContainerProps.initialDimension);
    function d(e) {
      var { children: t, width: n, height: i } = e,
        a = (0, r.useMemo)(() => ({ width: n, height: i }), [n, i]);
      return (0, l.isPositiveNumber)(a.width) && (0, l.isPositiveNumber)(a.height)
        ? r.createElement(f.Provider, { value: a }, t)
        : null;
    }
    var p = () => (0, r.useContext)(f),
      h = (0, r.forwardRef)((e, l) => {
        var {
            aspect: u,
            initialDimension: c = o.defaultResponsiveContainerProps.initialDimension,
            width: f,
            height: p,
            minWidth: h = o.defaultResponsiveContainerProps.minWidth,
            minHeight: v,
            maxHeight: y,
            children: g,
            debounce: m = o.defaultResponsiveContainerProps.debounce,
            id: b,
            className: x,
            onResize: w,
            style: O = {},
          } = e,
          S = (0, r.useRef)(null),
          A = (0, r.useRef)();
        ((A.current = w), (0, r.useImperativeHandle)(l, () => S.current));
        var [P, _] = (0, r.useState)({ containerWidth: c.width, containerHeight: c.height }),
          E = (0, r.useCallback)((e, t) => {
            _((r) => {
              var n = Math.round(e),
                i = Math.round(t);
              return r.containerWidth === n && r.containerHeight === i
                ? r
                : { containerWidth: n, containerHeight: i };
            });
          }, []);
        (0, r.useEffect)(() => {
          if (null == S.current || 'u' < typeof ResizeObserver) return i.noop;
          var e = (e) => {
            var t,
              r = e[0];
            if (null != r) {
              var { width: n, height: i } = r.contentRect;
              (E(n, i), null == (t = A.current) || t.call(A, n, i));
            }
          };
          m > 0 && (e = (0, n.default)(e, m, { trailing: !0, leading: !1 }));
          var t = new ResizeObserver(e),
            { width: r, height: a } = S.current.getBoundingClientRect();
          return (
            E(r, a),
            t.observe(S.current),
            () => {
              t.disconnect();
            }
          );
        }, [E, m]);
        var { containerWidth: j, containerHeight: C } = P;
        (0, a.warn)(!u || u > 0, 'The aspect(%s) must be greater than zero.', u);
        var { calculatedWidth: M, calculatedHeight: k } = (0, o.calculateChartDimensions)(j, C, {
          width: f,
          height: p,
          aspect: u,
          maxHeight: y,
        });
        return (
          (0, a.warn)(
            (null != M && M > 0) || (null != k && k > 0),
            'The width(%s) and height(%s) of chart should be greater than 0,\n       please check the style of container, or the props width(%s) and height(%s),\n       or add a minWidth(%s) or minHeight(%s) or use aspect(%s) to control the\n       height and width.',
            M,
            k,
            f,
            p,
            h,
            v,
            u,
          ),
          r.createElement(
            'div',
            {
              id: b ? ''.concat(b) : void 0,
              className: (0, t.clsx)('recharts-responsive-container', x),
              style: s(
                s({}, O),
                {},
                { width: f, height: p, minWidth: h, minHeight: v, maxHeight: y },
              ),
              ref: S,
            },
            r.createElement(
              'div',
              { style: (0, o.getInnerDivStyle)({ width: f, height: p }) },
              r.createElement(d, { width: M, height: k }, g),
            ),
          )
        );
      }),
      v = (0, r.forwardRef)((e, t) => {
        var n = p();
        if ((0, l.isPositiveNumber)(n.width) && (0, l.isPositiveNumber)(n.height))
          return e.children;
        var { width: a, height: c } = (0, o.getDefaultWidthAndHeight)({
            width: e.width,
            height: e.height,
            aspect: e.aspect,
          }),
          { calculatedWidth: s, calculatedHeight: f } = (0, o.calculateChartDimensions)(
            void 0,
            void 0,
            { width: a, height: c, aspect: e.aspect, maxHeight: e.maxHeight },
          );
        return (0, i.isNumber)(s) && (0, i.isNumber)(f)
          ? r.createElement(d, { width: s, height: f }, e.children)
          : r.createElement(h, u({}, e, { width: a, height: c, ref: t }));
      });
    e.s(['ResponsiveContainer', 0, v, 'useResponsiveContainerContext', 0, p]);
  },
  46290,
  8974,
  29576,
  26960,
  (e) => {
    'use strict';
    e.i(64775);
    var t,
      r,
      n = Symbol.for('immer-nothing'),
      i = Symbol.for('immer-draftable'),
      a = Symbol.for('immer-state');
    function o(e) {
      throw Error(`[Immer] minified error nr: ${e}. Full error at: https://bit.ly/3cXEKWf`);
    }
    var l = Object,
      u = l.getPrototypeOf,
      c = 'constructor',
      s = 'prototype',
      f = 'configurable',
      d = 'enumerable',
      p = 'writable',
      h = 'value',
      v = (e) => !!e && !!e[a];
    function y(e) {
      return !!e && (b(e) || P(e) || !!e[i] || !!e[c]?.[i] || _(e) || E(e));
    }
    var g = l[s][c].toString(),
      m = new WeakMap();
    function b(e) {
      if (!e || !j(e)) return !1;
      let t = u(e);
      if (null === t || t === l[s]) return !0;
      let r = l.hasOwnProperty.call(t, c) && t[c];
      if (r === Object) return !0;
      if (!C(r)) return !1;
      let n = m.get(r);
      return (void 0 === n && ((n = Function.toString.call(r)), m.set(r, n)), n === g);
    }
    function x(e, t, r = !0) {
      0 === w(e)
        ? (r ? Reflect.ownKeys(e) : l.keys(e)).forEach((r) => {
            t(r, e[r], e);
          })
        : e.forEach((r, n) => t(n, r, e));
    }
    function w(e) {
      let t = e[a];
      return t ? t.type_ : P(e) ? 1 : _(e) ? 2 : 3 * !!E(e);
    }
    var O = (e, t, r = w(e)) => (2 === r ? e.has(t) : l[s].hasOwnProperty.call(e, t)),
      S = (e, t, r = w(e)) => (2 === r ? e.get(t) : e[t]),
      A = (e, t, r, n = w(e)) => {
        2 === n ? e.set(t, r) : 3 === n ? e.add(r) : (e[t] = r);
      },
      P = Array.isArray,
      _ = (e) => e instanceof Map,
      E = (e) => e instanceof Set,
      j = (e) => 'object' == typeof e,
      C = (e) => 'function' == typeof e,
      M = (e) => (e.modified_ ? e.copy_ : e.base_);
    function k(e, t) {
      if (_(e)) return new Map(e);
      if (E(e)) return new Set(e);
      if (P(e)) return Array[s].slice.call(e);
      let r = b(e);
      if (!0 !== t && ('class_only' !== t || r)) {
        let t = u(e);
        if (null !== t && r) return { ...e };
        let n = l.create(t);
        return l.assign(n, e);
      }
      {
        let t = l.getOwnPropertyDescriptors(e);
        delete t[a];
        let r = Reflect.ownKeys(t);
        for (let n = 0; n < r.length; n++) {
          let i = r[n],
            a = t[i];
          (!1 === a[p] && ((a[p] = !0), (a[f] = !0)),
            (a.get || a.set) && (t[i] = { [f]: !0, [p]: !0, [d]: a[d], [h]: e[i] }));
        }
        return l.create(u(e), t);
      }
    }
    function T(e, t = !1) {
      return (
        N(e) ||
          v(e) ||
          !y(e) ||
          (w(e) > 1 && l.defineProperties(e, { set: D, add: D, clear: D, delete: D }),
          l.freeze(e),
          t &&
            x(
              e,
              (e, t) => {
                T(t, !0);
              },
              !1,
            )),
        e
      );
    }
    var D = {
      [h]: function () {
        o(2);
      },
    };
    function N(e) {
      return !(null !== e && j(e)) || l.isFrozen(e);
    }
    var I = 'MapSet',
      L = 'Patches',
      R = 'ArrayMethods',
      B = {};
    function z(e) {
      let t = B[e];
      return (t || o(0, e), t);
    }
    var F = (e) => !!B[e];
    function U(e, t) {
      t &&
        ((e.patchPlugin_ = z(L)),
        (e.patches_ = []),
        (e.inversePatches_ = []),
        (e.patchListener_ = t));
    }
    function W(e) {
      ($(e), e.drafts_.forEach(K), (e.drafts_ = null));
    }
    function $(e) {
      e === r && (r = e.parent_);
    }
    var V = (e) =>
      (r = {
        drafts_: [],
        parent_: r,
        immer_: e,
        canAutoFreeze_: !0,
        unfinalizedDrafts_: 0,
        handledSet_: new Set(),
        processedForPatches_: new Set(),
        mapSetPlugin_: F(I) ? z(I) : void 0,
        arrayMethodsPlugin_: F(R) ? z(R) : void 0,
      });
    function K(e) {
      let t = e[a];
      0 === t.type_ || 1 === t.type_ ? t.revoke_() : (t.revoked_ = !0);
    }
    function H(e, t) {
      t.unfinalizedDrafts_ = t.drafts_.length;
      let r = t.drafts_[0];
      if (void 0 !== e && e !== r) {
        (r[a].modified_ && (W(t), o(4)), y(e) && (e = q(t, e)));
        let { patchPlugin_: n } = t;
        n && n.generateReplacementPatches_(r[a].base_, e, t);
      } else e = q(t, r);
      return (
        (function (e, t, r = !1) {
          !e.parent_ && e.immer_.autoFreeze_ && e.canAutoFreeze_ && T(t, r);
        })(t, e, !0),
        W(t),
        t.patches_ && t.patchListener_(t.patches_, t.inversePatches_),
        e !== n ? e : void 0
      );
    }
    function q(e, t) {
      if (N(t)) return t;
      let r = t[a];
      if (!r) return J(t, e.handledSet_, e);
      if (!X(r, e)) return t;
      if (!r.modified_) return r.base_;
      if (!r.finalized_) {
        let { callbacks_: t } = r;
        if (t) for (; t.length > 0; ) t.pop()(e);
        Q(r, e);
      }
      return r.copy_;
    }
    function Y(e) {
      ((e.finalized_ = !0), e.scope_.unfinalizedDrafts_--);
    }
    var X = (e, t) => e.scope_ === t,
      G = [];
    function Z(e, t, r, n) {
      let i = e.copy_ || e.base_,
        a = e.type_;
      if (void 0 !== n && S(i, n, a) === t) return void A(i, n, r, a);
      if (!e.draftLocations_) {
        let t = (e.draftLocations_ = new Map());
        x(i, (e, r) => {
          if (v(r)) {
            let n = t.get(r) || [];
            (n.push(e), t.set(r, n));
          }
        });
      }
      for (let n of e.draftLocations_.get(t) ?? G) A(i, n, r, a);
    }
    function Q(e, t) {
      if (
        e.modified_ &&
        !e.finalized_ &&
        (3 === e.type_ ||
          (1 === e.type_ && e.allIndicesReassigned_) ||
          (e.assigned_?.size ?? 0) > 0)
      ) {
        let { patchPlugin_: r } = t;
        if (r) {
          let n = r.getPath(e);
          n && r.generatePatches_(e, n, t);
        }
        Y(e);
      }
    }
    function J(e, t, r) {
      return (
        (!r.immer_.autoFreeze_ && r.unfinalizedDrafts_ < 1) ||
          v(e) ||
          t.has(e) ||
          !y(e) ||
          N(e) ||
          (t.add(e),
          x(e, (n, i) => {
            if (v(i)) {
              let t = i[a];
              X(t, r) && (A(e, n, M(t), e.type_), Y(t));
            } else y(i) && J(i, t, r);
          })),
        e
      );
    }
    var ee = {
        get(e, t) {
          let r;
          if (t === a) return e;
          let n = e.scope_.arrayMethodsPlugin_,
            i = 1 === e.type_ && 'string' == typeof t;
          if (i && n?.isArrayOperationMethod(t)) return n.createMethodInterceptor(e, t);
          let o = e.copy_ || e.base_;
          if (!O(o, t, e.type_)) {
            var l;
            let r;
            return ((l = e), (r = en(o, t)) ? (h in r ? r[h] : r.get?.call(l.draft_)) : void 0);
          }
          let u = o[t];
          if (
            e.finalized_ ||
            !y(u) ||
            (i &&
              e.operationMethod &&
              n?.isMutatingArrayMethod(e.operationMethod) &&
              Number.isInteger((r = +t)) &&
              String(r) === t)
          )
            return u;
          if (u === er(e.base_, t)) {
            ea(e);
            let r = 1 === e.type_ ? +t : t,
              n = eo(e.scope_, u, e, r);
            return (e.copy_[r] = n);
          }
          return u;
        },
        has: (e, t) => t in (e.copy_ || e.base_),
        ownKeys: (e) => Reflect.ownKeys(e.copy_ || e.base_),
        set(e, t, r) {
          let n = en(e.copy_ || e.base_, t);
          if (n?.set) return (n.set.call(e.draft_, r), !0);
          if (!e.modified_) {
            let n = er(e.copy_ || e.base_, t),
              i = n?.[a];
            if (i && i.base_ === r) return ((e.copy_[t] = r), e.assigned_.set(t, !1), !0);
            if (
              (r === n ? 0 !== r || 1 / r == 1 / n : r != r && n != n) &&
              (void 0 !== r || O(e.base_, t, e.type_))
            )
              return !0;
            (ea(e), ei(e));
          }
          return (
            !!(
              (e.copy_[t] === r && (void 0 !== r || t in e.copy_)) ||
              (Number.isNaN(r) && Number.isNaN(e.copy_[t]))
            ) ||
            ((e.copy_[t] = r),
            e.assigned_.set(t, !0),
            !(function (e, t, r) {
              let { scope_: n } = e;
              if (v(r)) {
                let i = r[a];
                X(i, n) &&
                  i.callbacks_.push(function () {
                    (ea(e), Z(e, r, M(i), t));
                  });
              } else
                y(r) &&
                  e.callbacks_.push(function () {
                    let i = e.copy_ || e.base_;
                    3 === e.type_
                      ? i.has(r) && J(r, n.handledSet_, n)
                      : S(i, t, e.type_) === r &&
                        n.drafts_.length > 1 &&
                        (e.assigned_.get(t) ?? !1) === !0 &&
                        e.copy_ &&
                        J(S(e.copy_, t, e.type_), n.handledSet_, n);
                  });
            })(e, t, r),
            !0)
          );
        },
        deleteProperty: (e, t) => (
          ea(e),
          void 0 !== er(e.base_, t) || t in e.base_
            ? (e.assigned_.set(t, !1), ei(e))
            : e.assigned_.delete(t),
          e.copy_ && delete e.copy_[t],
          !0
        ),
        getOwnPropertyDescriptor(e, t) {
          let r = e.copy_ || e.base_,
            n = Reflect.getOwnPropertyDescriptor(r, t);
          return n ? { [p]: !0, [f]: 1 !== e.type_ || 'length' !== t, [d]: n[d], [h]: r[t] } : n;
        },
        defineProperty() {
          o(11);
        },
        getPrototypeOf: (e) => u(e.base_),
        setPrototypeOf() {
          o(12);
        },
      },
      et = {};
    for (let e in ee) {
      let t = ee[e];
      et[e] = function () {
        let e = arguments;
        return ((e[0] = e[0][0]), t.apply(this, e));
      };
    }
    function er(e, t) {
      let r = e[a];
      return (r ? r.copy_ || r.base_ : e)[t];
    }
    function en(e, t) {
      if (!(t in e)) return;
      let r = u(e);
      for (; r; ) {
        let e = Object.getOwnPropertyDescriptor(r, t);
        if (e) return e;
        r = u(r);
      }
    }
    function ei(e) {
      !e.modified_ && ((e.modified_ = !0), e.parent_ && ei(e.parent_));
    }
    function ea(e) {
      e.copy_ ||
        ((e.assigned_ = new Map()), (e.copy_ = k(e.base_, e.scope_.immer_.useStrictShallowCopy_)));
    }
    function eo(e, t, n, i) {
      let [a, o] = _(t)
        ? z(I).proxyMap_(t, n)
        : E(t)
          ? z(I).proxySet_(t, n)
          : (function (e, t) {
              let n = P(e),
                i = {
                  type_: +!!n,
                  scope_: t ? t.scope_ : r,
                  modified_: !1,
                  finalized_: !1,
                  assigned_: void 0,
                  parent_: t,
                  base_: e,
                  draft_: null,
                  copy_: null,
                  revoke_: null,
                  isManual_: !1,
                  callbacks_: void 0,
                },
                a = i,
                o = ee;
              n && ((a = [i]), (o = et));
              let { revoke: l, proxy: u } = Proxy.revocable(a, o);
              return ((i.draft_ = u), (i.revoke_ = l), [u, i]);
            })(t, n);
      if (
        ((n?.scope_ ?? r).drafts_.push(a),
        (o.callbacks_ = n?.callbacks_ ?? []),
        (o.key_ = i),
        n && void 0 !== i)
      )
        n.callbacks_.push(function (e) {
          if (!o || !X(o, e)) return;
          e.mapSetPlugin_?.fixSetContents(o);
          let t = M(o);
          (Z(n, o.draft_ ?? o, t, i), Q(o, e));
        });
      else
        o.callbacks_.push(function (e) {
          e.mapSetPlugin_?.fixSetContents(o);
          let { patchPlugin_: t } = e;
          o.modified_ && t && t.generatePatches_(o, [], e);
        });
      return a;
    }
    function el(e) {
      return (
        v(e) || o(10, e),
        (function e(t) {
          let r;
          if (!y(t) || N(t)) return t;
          let n = t[a],
            i = !0;
          if (n) {
            if (!n.modified_) return n.base_;
            ((n.finalized_ = !0),
              (r = k(t, n.scope_.immer_.useStrictShallowCopy_)),
              (i = n.scope_.immer_.shouldUseStrictIteration()));
          } else r = k(t, !0);
          return (
            x(
              r,
              (t, n) => {
                A(r, t, e(n));
              },
              i,
            ),
            n && (n.finalized_ = !1),
            r
          );
        })(e)
      );
    }
    ((et.deleteProperty = function (e, t) {
      return et.set.call(this, e, t, void 0);
    }),
      (et.set = function (e, t, r) {
        return ee.set.call(this, e[0], t, r, e[0]);
      }));
    var eu = new (class {
      constructor(e) {
        ((this.autoFreeze_ = !0),
          (this.useStrictShallowCopy_ = !1),
          (this.useStrictIteration_ = !1),
          (this.produce = (e, t, r) => {
            let i;
            if (C(e) && !C(t)) {
              let r = t;
              t = e;
              let n = this;
              return function (e = r, ...i) {
                return n.produce(e, (e) => t.call(this, e, ...i));
              };
            }
            if ((C(t) || o(6), void 0 === r || C(r) || o(7), y(e))) {
              let n = V(this),
                a = eo(n, e, void 0),
                o = !0;
              try {
                ((i = t(a)), (o = !1));
              } finally {
                o ? W(n) : $(n);
              }
              return (U(n, r), H(i, n));
            }
            if (e && j(e)) o(1, e);
            else {
              if (
                (void 0 === (i = t(e)) && (i = e),
                i === n && (i = void 0),
                this.autoFreeze_ && T(i, !0),
                r)
              ) {
                let t = [],
                  n = [];
                (z(L).generateReplacementPatches_(e, i, { patches_: t, inversePatches_: n }),
                  r(t, n));
              }
              return i;
            }
          }),
          (this.produceWithPatches = (e, t) => {
            let r, n;
            return C(e)
              ? (t, ...r) => this.produceWithPatches(t, (t) => e(t, ...r))
              : [
                  this.produce(e, t, (e, t) => {
                    ((r = e), (n = t));
                  }),
                  r,
                  n,
                ];
          }),
          ((e) => 'boolean' == typeof e)(e?.autoFreeze) && this.setAutoFreeze(e.autoFreeze),
          ((e) => 'boolean' == typeof e)(e?.useStrictShallowCopy) &&
            this.setUseStrictShallowCopy(e.useStrictShallowCopy),
          ((e) => 'boolean' == typeof e)(e?.useStrictIteration) &&
            this.setUseStrictIteration(e.useStrictIteration));
      }
      createDraft(e) {
        (y(e) || o(8), v(e) && (e = el(e)));
        let t = V(this),
          r = eo(t, e, void 0);
        return ((r[a].isManual_ = !0), $(t), r);
      }
      finishDraft(e, t) {
        let r = e && e[a];
        (r && r.isManual_) || o(9);
        let { scope_: n } = r;
        return (U(n, t), H(void 0, n));
      }
      setAutoFreeze(e) {
        this.autoFreeze_ = e;
      }
      setUseStrictShallowCopy(e) {
        this.useStrictShallowCopy_ = e;
      }
      setUseStrictIteration(e) {
        this.useStrictIteration_ = e;
      }
      shouldUseStrictIteration() {
        return this.useStrictIteration_;
      }
      applyPatches(e, t) {
        let r;
        for (r = t.length - 1; r >= 0; r--) {
          let n = t[r];
          if (0 === n.path.length && 'replace' === n.op) {
            e = n.value;
            break;
          }
        }
        r > -1 && (t = t.slice(r + 1));
        let n = z(L).applyPatches_;
        return v(e) ? n(e, t) : this.produce(e, (e) => n(e, t));
      }
    })().produce;
    e.s(
      [
        'current',
        0,
        el,
        'freeze',
        0,
        T,
        'isDraft',
        0,
        v,
        'isDraftable',
        0,
        y,
        'original',
        0,
        function (e) {
          return (v(e) || o(15, e), e[a].base_);
        },
        'produce',
        0,
        eu,
      ],
      8974,
    );
    var ec = Symbol('NOT_FOUND'),
      es = (e) => (Array.isArray(e) ? e : [e]),
      ef = 0,
      ed = class {
        revision = ef;
        _value;
        _lastValue;
        _isEqual = ep;
        constructor(e, t = ep) {
          ((this._value = this._lastValue = e), (this._isEqual = t));
        }
        get value() {
          return this._value;
        }
        set value(e) {
          this.value !== e && ((this._value = e), (this.revision = ++ef));
        }
      };
    function ep(e, t) {
      return e === t;
    }
    function eh(e) {
      return (e instanceof ed || console.warn('Not a valid cell! ', e), e.value);
    }
    var ev = (e, t) => !1;
    function ey() {
      return (function (e = ep) {
        return new ed(null, e);
      })(ev);
    }
    var eg = (e) => {
      let t = e.collectionTag;
      (null === t && (t = e.collectionTag = ey()), eh(t));
    };
    Symbol();
    var em = 0,
      eb = Object.getPrototypeOf({}),
      ex = class {
        constructor(e) {
          ((this.value = e), (this.value = e), (this.tag.value = e));
        }
        proxy = new Proxy(this, ew);
        tag = ey();
        tags = {};
        children = {};
        collectionTag = null;
        id = em++;
      },
      ew = {
        get: (e, t) =>
          (function () {
            let { value: r } = e,
              n = Reflect.get(r, t);
            if ('symbol' == typeof t || t in eb) return n;
            if ('object' == typeof n && null !== n) {
              var i;
              let r = e.children[t];
              return (
                void 0 === r &&
                  (r = e.children[t] = Array.isArray((i = n)) ? new eO(i) : new ex(i)),
                r.tag && eh(r.tag),
                r.proxy
              );
            }
            {
              let r = e.tags[t];
              return (void 0 === r && ((r = e.tags[t] = ey()).value = n), eh(r), n);
            }
          })(),
        ownKeys: (e) => (eg(e), Reflect.ownKeys(e.value)),
        getOwnPropertyDescriptor: (e, t) => Reflect.getOwnPropertyDescriptor(e.value, t),
        has: (e, t) => Reflect.has(e.value, t),
      },
      eO = class {
        constructor(e) {
          ((this.value = e), (this.value = e), (this.tag.value = e));
        }
        proxy = new Proxy([this], eS);
        tag = ey();
        tags = {};
        children = {};
        collectionTag = null;
        id = em++;
      },
      eS = {
        get: ([e], t) => ('length' === t && eg(e), ew.get(e, t)),
        ownKeys: ([e]) => ew.ownKeys(e),
        getOwnPropertyDescriptor: ([e], t) => ew.getOwnPropertyDescriptor(e, t),
        has: ([e], t) => ew.has(e, t),
      },
      eA = (e, t) => e === t,
      eP =
        'u' > typeof WeakRef
          ? WeakRef
          : class {
              constructor(e) {
                this.value = e;
              }
              deref() {
                return this.value;
              }
            };
    function e_() {
      return { s: 0, v: void 0, o: null, p: null };
    }
    function eE(e, t = {}) {
      let r,
        n = e_(),
        { resultEqualityCheck: i } = t,
        a = 0;
      function o() {
        let t,
          o = n,
          { length: l } = arguments;
        for (let e = 0; e < l; e++) {
          let t = arguments[e];
          if ('function' == typeof t || ('object' == typeof t && null !== t)) {
            let e = o.o;
            null === e && (o.o = e = new WeakMap());
            let r = e.get(t);
            void 0 === r ? ((o = e_()), e.set(t, o)) : (o = r);
          } else {
            let e = o.p;
            null === e && (o.p = e = new Map());
            let r = e.get(t);
            void 0 === r ? ((o = e_()), e.set(t, o)) : (o = r);
          }
        }
        let u = o;
        if (1 === o.s) t = o.v;
        else if (((t = e.apply(null, arguments)), a++, i)) {
          let e = r?.deref?.() ?? r;
          (null != e && i(e, t) && ((t = e), 0 !== a && a--),
            (r = ('object' == typeof t && null !== t) || 'function' == typeof t ? new eP(t) : t));
        }
        return ((u.s = 1), (u.v = t), t);
      }
      return (
        (o.clearCache = () => {
          ((n = e_()), o.resetResultsCount());
        }),
        (o.resultsCount = () => a),
        (o.resetResultsCount = () => {
          a = 0;
        }),
        o
      );
    }
    function ej(e, ...t) {
      let r = 'function' == typeof e ? { memoize: e, memoizeOptions: t } : e,
        n = (...e) => {
          let t,
            n,
            i = 0,
            a = 0,
            o = {},
            l = e.pop();
          ('object' == typeof l && ((o = l), (l = e.pop())),
            (function (e, t = `expected a function, instead received ${typeof e}`) {
              if ('function' != typeof e) throw TypeError(t);
            })(
              l,
              `createSelector expects an output function after the inputs, but received: [${typeof l}]`,
            ));
          let {
              memoize: u,
              memoizeOptions: c = [],
              argsMemoize: s = eE,
              argsMemoizeOptions: f = [],
              devModeChecks: d = {},
            } = { ...r, ...o },
            p = es(c),
            h = es(f),
            v =
              (!(function (
                e,
                t = 'expected all items to be functions, instead received the following types: ',
              ) {
                if (!e.every((e) => 'function' == typeof e)) {
                  let r = e
                    .map((e) =>
                      'function' == typeof e ? `function ${e.name || 'unnamed'}()` : typeof e,
                    )
                    .join(', ');
                  throw TypeError(`${t}[${r}]`);
                }
              })(
                (t = Array.isArray(e[0]) ? e[0] : e),
                'createSelector expects all input-selectors to be functions, but received the following types: ',
              ),
              t),
            y = u(
              function () {
                return (i++, l.apply(null, arguments));
              },
              ...p,
            );
          return Object.assign(
            s(
              function () {
                a++;
                let e = (function (e, t) {
                  let r = [],
                    { length: n } = e;
                  for (let i = 0; i < n; i++) r.push(e[i].apply(null, t));
                  return r;
                })(v, arguments);
                return (n = y.apply(null, e));
              },
              ...h,
            ),
            {
              resultFunc: l,
              memoizedResultFunc: y,
              dependencies: v,
              dependencyRecomputations: () => a,
              resetDependencyRecomputations: () => {
                a = 0;
              },
              lastResult: () => n,
              recomputations: () => i,
              resetRecomputations: () => {
                i = 0;
              },
              memoize: u,
              argsMemoize: s,
            },
          );
        };
      return (Object.assign(n, { withTypes: () => n }), n);
    }
    var eC = ej(eE),
      eM = Object.assign(
        (e, t = eC) => {
          !(function (e, t = `expected an object, instead received ${typeof e}`) {
            if ('object' != typeof e) throw TypeError(t);
          })(
            e,
            `createStructuredSelector expects first argument to be an object where each property is a selector, instead received a ${typeof e}`,
          );
          let r = Object.keys(e);
          return t(
            r.map((t) => e[t]),
            (...e) => e.reduce((e, t, n) => ((e[r[n]] = t), e), {}),
          );
        },
        { withTypes: () => eM },
      );
    function ek(e) {
      return `Minified Redux error #${e}; visit https://redux.js.org/Errors?code=${e} for the full message or use the non-minified dev environment for full errors. `;
    }
    e.s(
      [
        'createSelector',
        0,
        eC,
        'createSelectorCreator',
        0,
        ej,
        'lruMemoize',
        0,
        function (e, t) {
          let r,
            {
              equalityCheck: n = eA,
              maxSize: i = 1,
              resultEqualityCheck: a,
            } = 'object' == typeof t ? t : { equalityCheck: t },
            o = function (e, t) {
              if (null === e || null === t || e.length !== t.length) return !1;
              let { length: r } = e;
              for (let i = 0; i < r; i++) if (!n(e[i], t[i])) return !1;
              return !0;
            },
            l = 0,
            u =
              i <= 1
                ? {
                    get: (e) => (r && o(r.key, e) ? r.value : ec),
                    put(e, t) {
                      r = { key: e, value: t };
                    },
                    getEntries: () => (r ? [r] : []),
                    clear() {
                      r = void 0;
                    },
                  }
                : (function (e, t) {
                    let r = [];
                    function n(e) {
                      let n = r.findIndex((r) => t(e, r.key));
                      if (n > -1) {
                        let e = r[n];
                        return (n > 0 && (r.splice(n, 1), r.unshift(e)), e.value);
                      }
                      return ec;
                    }
                    return {
                      get: n,
                      put: function (t, i) {
                        n(t) === ec && (r.unshift({ key: t, value: i }), r.length > e && r.pop());
                      },
                      getEntries: function () {
                        return r;
                      },
                      clear: function () {
                        r = [];
                      },
                    };
                  })(i, o);
          function c() {
            let t = u.get(arguments);
            if (t === ec) {
              if (((t = e.apply(null, arguments)), l++, a)) {
                let e = u.getEntries().find((e) => a(e.value, t));
                e && ((t = e.value), 0 !== l && l--);
              }
              u.put(arguments, t);
            }
            return t;
          }
          return (
            (c.clearCache = () => {
              (u.clear(), c.resetResultsCount());
            }),
            (c.resultsCount = () => l),
            (c.resetResultsCount = () => {
              l = 0;
            }),
            c
          );
        },
        'weakMapMemoize',
        0,
        eE,
      ],
      29576,
    );
    var eT = ('function' == typeof Symbol && Symbol.observable) || '@@observable',
      eD = () => Math.random().toString(36).substring(7).split('').join('.'),
      eN = {
        INIT: `@@redux/INIT${eD()}`,
        REPLACE: `@@redux/REPLACE${eD()}`,
        PROBE_UNKNOWN_ACTION: () => `@@redux/PROBE_UNKNOWN_ACTION${eD()}`,
      };
    function eI(e) {
      if ('object' != typeof e || null === e) return !1;
      let t = e;
      for (; null !== Object.getPrototypeOf(t); ) t = Object.getPrototypeOf(t);
      return Object.getPrototypeOf(e) === t || null === Object.getPrototypeOf(e);
    }
    function eL(e, t, r) {
      if ('function' != typeof e) throw Error(ek(2));
      if (
        ('function' == typeof t && 'function' == typeof r) ||
        ('function' == typeof r && 'function' == typeof arguments[3])
      )
        throw Error(ek(0));
      if (('function' == typeof t && void 0 === r && ((r = t), (t = void 0)), void 0 !== r)) {
        if ('function' != typeof r) throw Error(ek(1));
        return r(eL)(e, t);
      }
      let n = e,
        i = t,
        a = new Map(),
        o = a,
        l = 0,
        u = !1;
      function c() {
        o === a &&
          ((o = new Map()),
          a.forEach((e, t) => {
            o.set(t, e);
          }));
      }
      function s() {
        if (u) throw Error(ek(3));
        return i;
      }
      function f(e) {
        if ('function' != typeof e) throw Error(ek(4));
        if (u) throw Error(ek(5));
        let t = !0;
        c();
        let r = l++;
        return (
          o.set(r, e),
          function () {
            if (t) {
              if (u) throw Error(ek(6));
              ((t = !1), c(), o.delete(r), (a = null));
            }
          }
        );
      }
      function d(e) {
        if (!eI(e)) throw Error(ek(7));
        if (void 0 === e.type) throw Error(ek(8));
        if ('string' != typeof e.type) throw Error(ek(17));
        if (u) throw Error(ek(9));
        try {
          ((u = !0), (i = n(i, e)));
        } finally {
          u = !1;
        }
        return (
          (a = o).forEach((e) => {
            e();
          }),
          e
        );
      }
      return (
        d({ type: eN.INIT }),
        {
          dispatch: d,
          subscribe: f,
          getState: s,
          replaceReducer: function (e) {
            if ('function' != typeof e) throw Error(ek(10));
            ((n = e), d({ type: eN.REPLACE }));
          },
          [eT]: function () {
            return {
              subscribe(e) {
                if ('object' != typeof e || null === e) throw Error(ek(11));
                function t() {
                  e.next && e.next(s());
                }
                return (t(), { unsubscribe: f(t) });
              },
              [eT]() {
                return this;
              },
            };
          },
        }
      );
    }
    function eR(e) {
      let t,
        r = Object.keys(e),
        n = {};
      for (let t = 0; t < r.length; t++) {
        let i = r[t];
        'function' == typeof e[i] && (n[i] = e[i]);
      }
      let i = Object.keys(n);
      try {
        Object.keys(n).forEach((e) => {
          let t = n[e];
          if (void 0 === t(void 0, { type: eN.INIT })) throw Error(ek(12));
          if (void 0 === t(void 0, { type: eN.PROBE_UNKNOWN_ACTION() })) throw Error(ek(13));
        });
      } catch (e) {
        t = e;
      }
      return function (e = {}, r) {
        if (t) throw t;
        let a = !1,
          o = {};
        for (let t = 0; t < i.length; t++) {
          let l = i[t],
            u = n[l],
            c = e[l],
            s = u(c, r);
          if (void 0 === s) throw (r && r.type, Error(ek(14)));
          ((o[l] = s), (a = a || s !== c));
        }
        return (a = a || i.length !== Object.keys(e).length) ? o : e;
      };
    }
    function eB(...e) {
      return 0 === e.length
        ? (e) => e
        : 1 === e.length
          ? e[0]
          : e.reduce(
              (e, t) =>
                (...r) =>
                  e(t(...r)),
            );
    }
    function ez(...e) {
      return (t) => (r, n) => {
        let i = t(r, n),
          a = () => {
            throw Error(ek(15));
          },
          o = { getState: i.getState, dispatch: (e, ...t) => a(e, ...t) };
        return ((a = eB(...e.map((e) => e(o)))(i.dispatch)), { ...i, dispatch: a });
      };
    }
    function eF(e) {
      return eI(e) && 'type' in e && 'string' == typeof e.type;
    }
    function eU(e) {
      return ({ dispatch: t, getState: r }) =>
        (n) =>
        (i) =>
          'function' == typeof i ? i(t, r, e) : n(i);
    }
    e.s(
      [
        'applyMiddleware',
        0,
        ez,
        'combineReducers',
        0,
        eR,
        'compose',
        0,
        eB,
        'createStore',
        0,
        eL,
        'isAction',
        0,
        eF,
        'isPlainObject',
        0,
        eI,
      ],
      26960,
    );
    var eW = eU(),
      e$ =
        'u' > typeof window && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
          ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
          : function () {
              if (0 != arguments.length)
                return 'object' == typeof arguments[0] ? eB : eB.apply(null, arguments);
            };
    function eV(e, t) {
      function r(...n) {
        if (t) {
          let r = t(...n);
          if (!r) throw Error(tw(0));
          return {
            type: e,
            payload: r.payload,
            ...('meta' in r && { meta: r.meta }),
            ...('error' in r && { error: r.error }),
          };
        }
        return { type: e, payload: n[0] };
      }
      return (
        (r.toString = () => `${e}`),
        (r.type = e),
        (r.match = (t) => eF(t) && t.type === e),
        r
      );
    }
    'u' > typeof window &&
      window.__REDUX_DEVTOOLS_EXTENSION__ &&
      window.__REDUX_DEVTOOLS_EXTENSION__;
    var eK = class e extends Array {
      constructor(...t) {
        (super(...t), Object.setPrototypeOf(this, e.prototype));
      }
      static get [Symbol.species]() {
        return e;
      }
      concat(...e) {
        return super.concat.apply(this, e);
      }
      prepend(...t) {
        return 1 === t.length && Array.isArray(t[0])
          ? new e(...t[0].concat(this))
          : new e(...t.concat(this));
      }
    };
    function eH(e) {
      return y(e) ? eu(e, () => {}) : e;
    }
    function eq(e, t, r) {
      return e.has(t) ? e.get(t) : e.set(t, r(t)).get(t);
    }
    var eY = 'RTK_autoBatch',
      eX = (e) => (t) => {
        setTimeout(t, e);
      },
      eG =
        (e = { type: 'raf' }) =>
        (t) =>
        (...r) => {
          let n = t(...r),
            i = !0,
            a = !1,
            o = !1,
            l = new Set(),
            u =
              'tick' === e.type
                ? queueMicrotask
                : 'raf' === e.type
                  ? 'u' > typeof window && window.requestAnimationFrame
                    ? window.requestAnimationFrame
                    : eX(10)
                  : 'callback' === e.type
                    ? e.queueNotification
                    : eX(e.timeout),
            c = () => {
              ((o = !1), a && ((a = !1), l.forEach((e) => e())));
            };
          return Object.assign({}, n, {
            subscribe(e) {
              let t = n.subscribe(() => i && e());
              return (
                l.add(e),
                () => {
                  (t(), l.delete(e));
                }
              );
            },
            dispatch(e) {
              try {
                return ((a = !(i = !e?.meta?.[eY])) && !o && ((o = !0), u(c)), n.dispatch(e));
              } finally {
                i = !0;
              }
            },
          });
        };
    function eZ(e) {
      let t,
        r = {},
        n = [],
        i = {
          addCase(e, t) {
            let n = 'string' == typeof e ? e : e.type;
            if (!n) throw Error(tw(28));
            if (n in r) throw Error(tw(29));
            return ((r[n] = t), i);
          },
          addAsyncThunk: (e, t) => (
            t.pending && (r[e.pending.type] = t.pending),
            t.rejected && (r[e.rejected.type] = t.rejected),
            t.fulfilled && (r[e.fulfilled.type] = t.fulfilled),
            t.settled && n.push({ matcher: e.settled, reducer: t.settled }),
            i
          ),
          addMatcher: (e, t) => (n.push({ matcher: e, reducer: t }), i),
          addDefaultCase: (e) => ((t = e), i),
        };
      return (e(i), [r, n, t]);
    }
    var eQ = Symbol.for('rtk-slice-createasyncthunk'),
      eJ =
        (((t = eJ || {}).reducer = 'reducer'),
        (t.reducerWithPrepare = 'reducerWithPrepare'),
        (t.asyncThunk = 'asyncThunk'),
        t),
      e0 = (function ({ creators: e } = {}) {
        let t = e?.asyncThunk?.[eQ];
        return function (e) {
          let r,
            { name: n, reducerPath: i = n } = e;
          if (!n) throw Error(tw(11));
          let a =
              ('function' == typeof e.reducers
                ? e.reducers(
                    (function () {
                      function e(e, t) {
                        return { _reducerDefinitionType: 'asyncThunk', payloadCreator: e, ...t };
                      }
                      return (
                        (e.withTypes = () => e),
                        {
                          reducer: (e) =>
                            Object.assign({ [e.name]: (...t) => e(...t) }[e.name], {
                              _reducerDefinitionType: 'reducer',
                            }),
                          preparedReducer: (e, t) => ({
                            _reducerDefinitionType: 'reducerWithPrepare',
                            prepare: e,
                            reducer: t,
                          }),
                          asyncThunk: e,
                        }
                      );
                    })(),
                  )
                : e.reducers) || {},
            o = Object.keys(a),
            l = {},
            u = {},
            c = {},
            s = [],
            f = {
              addCase(e, t) {
                let r = 'string' == typeof e ? e : e.type;
                if (!r) throw Error(tw(12));
                if (r in u) throw Error(tw(13));
                return ((u[r] = t), f);
              },
              addMatcher: (e, t) => (s.push({ matcher: e, reducer: t }), f),
              exposeAction: (e, t) => ((c[e] = t), f),
              exposeCaseReducer: (e, t) => ((l[e] = t), f),
            };
          function d() {
            let [t = {}, r = [], n] =
                'function' == typeof e.extraReducers ? eZ(e.extraReducers) : [e.extraReducers],
              i = { ...t, ...u };
            return (function (e, t) {
              let r,
                [n, i, a] = eZ(t);
              if ('function' == typeof e) r = () => eH(e());
              else {
                let t = eH(e);
                r = () => t;
              }
              function o(e = r(), t) {
                let l = [
                  n[t.type],
                  ...i.filter(({ matcher: e }) => e(t)).map(({ reducer: e }) => e),
                ];
                return (
                  0 === l.filter((e) => !!e).length && (l = [a]),
                  l.reduce((e, r) => {
                    if (r)
                      if (v(e)) {
                        let n = r(e, t);
                        return void 0 === n ? e : n;
                      } else {
                        if (y(e)) return eu(e, (e) => r(e, t));
                        let n = r(e, t);
                        if (void 0 === n) {
                          if (null === e) return e;
                          throw Error(
                            'A case reducer on a non-draftable value must not return undefined',
                          );
                        }
                        return n;
                      }
                    return e;
                  }, e)
                );
              }
              return ((o.getInitialState = r), o);
            })(e.initialState, (e) => {
              for (let t in i) e.addCase(t, i[t]);
              for (let t of s) e.addMatcher(t.matcher, t.reducer);
              for (let t of r) e.addMatcher(t.matcher, t.reducer);
              n && e.addDefaultCase(n);
            });
          }
          o.forEach((r) => {
            let i = a[r],
              o = {
                reducerName: r,
                type: `${n}/${r}`,
                createNotation: 'function' == typeof e.reducers,
              };
            'asyncThunk' === i._reducerDefinitionType
              ? (function ({ type: e, reducerName: t }, r, n, i) {
                  if (!i) throw Error(tw(18));
                  let {
                      payloadCreator: a,
                      fulfilled: o,
                      pending: l,
                      rejected: u,
                      settled: c,
                      options: s,
                    } = r,
                    f = i(e, a, s);
                  (n.exposeAction(t, f),
                    o && n.addCase(f.fulfilled, o),
                    l && n.addCase(f.pending, l),
                    u && n.addCase(f.rejected, u),
                    c && n.addMatcher(f.settled, c),
                    n.exposeCaseReducer(t, {
                      fulfilled: o || e1,
                      pending: l || e1,
                      rejected: u || e1,
                      settled: c || e1,
                    }));
                })(o, i, f, t)
              : (function ({ type: e, reducerName: t, createNotation: r }, n, i) {
                  let a, o;
                  if ('reducer' in n) {
                    if (r && 'reducerWithPrepare' !== n._reducerDefinitionType) throw Error(tw(17));
                    ((a = n.reducer), (o = n.prepare));
                  } else a = n;
                  i.addCase(e, a)
                    .exposeCaseReducer(t, a)
                    .exposeAction(t, o ? eV(e, o) : eV(e));
                })(o, i, f);
          });
          let p = (e) => e,
            h = new Map(),
            g = new WeakMap();
          function m(e, t) {
            return (r || (r = d()), r(e, t));
          }
          function b() {
            return (r || (r = d()), r.getInitialState());
          }
          function x(t, r = !1) {
            function n(e) {
              let i = e[t];
              return (void 0 === i && r && (i = eq(g, n, b)), i);
            }
            function i(t = p) {
              let n = eq(h, r, () => new WeakMap());
              return eq(n, t, () => {
                let n = {};
                for (let [i, a] of Object.entries(e.selectors ?? {}))
                  n[i] = (function (e, t, r, n) {
                    function i(a, ...o) {
                      let l = t(a);
                      return (void 0 === l && n && (l = r()), e(l, ...o));
                    }
                    return ((i.unwrapped = e), i);
                  })(a, t, () => eq(g, t, b), r);
                return n;
              });
            }
            return {
              reducerPath: t,
              getSelectors: i,
              get selectors() {
                return i(n);
              },
              selectSlice: n,
            };
          }
          let w = {
            name: n,
            reducer: m,
            actions: c,
            caseReducers: l,
            getInitialState: b,
            ...x(i),
            injectInto(e, { reducerPath: t, ...r } = {}) {
              let n = t ?? i;
              return (e.inject({ reducerPath: n, reducer: m }, r), { ...w, ...x(n, !0) });
            },
          };
          return w;
        };
      })();
    function e1() {}
    var e2 = 'listener',
      e4 = 'completed',
      e5 = 'cancelled',
      e3 = `task-${e5}`,
      e6 = `task-${e4}`,
      e8 = `${e2}-${e5}`,
      e9 = `${e2}-${e4}`,
      e7 = class {
        constructor(e) {
          ((this.code = e), (this.message = `task ${e5} (reason: ${e})`));
        }
        name = 'TaskAbortError';
        message;
      },
      te = (e, t) => {
        if ('function' != typeof e) throw TypeError(tw(32));
      },
      tt = () => {},
      tr = (e, t = tt) => (e.catch(t), e),
      tn = (e, t) => (
        e.addEventListener('abort', t, { once: !0 }),
        () => e.removeEventListener('abort', t)
      ),
      ti = (e) => {
        if (e.aborted) throw new e7(e.reason);
      };
    function ta(e, t) {
      let r = tt;
      return new Promise((n, i) => {
        let a = () => i(new e7(e.reason));
        e.aborted ? a() : ((r = tn(e, a)), t.finally(() => r()).then(n, i));
      }).finally(() => {
        r = tt;
      });
    }
    var to = async (e, t) => {
        try {
          await Promise.resolve();
          let t = await e();
          return { status: 'ok', value: t };
        } catch (e) {
          return { status: e instanceof e7 ? 'cancelled' : 'rejected', error: e };
        } finally {
          t?.();
        }
      },
      tl = (e) => (t) => tr(ta(e, t).then((t) => (ti(e), t))),
      tu = (e) => {
        let t = tl(e);
        return (e) => t(new Promise((t) => setTimeout(t, e)));
      },
      { assign: tc } = Object,
      ts = {},
      tf = 'listenerMiddleware',
      td = (e) => {
        let { type: t, actionCreator: r, matcher: n, predicate: i, effect: a } = e;
        if (t) i = eV(t).match;
        else if (r) ((t = r.type), (i = r.match));
        else if (n) i = n;
        else if (i);
        else throw Error(tw(21));
        return (te(a, 'options.listener'), { predicate: i, type: t, effect: a });
      },
      tp = tc(
        (e) => {
          let { type: t, predicate: r, effect: n } = td(e);
          return {
            id: ((e = 21) => {
              let t = '',
                r = e;
              for (; r--; )
                t += 'ModuleSymbhasOwnPr-0123456789ABCDEFGHNRVfgctiUvz_KqYTJkLxpZXIjQW'[
                  (64 * Math.random()) | 0
                ];
              return t;
            })(),
            effect: n,
            type: t,
            predicate: r,
            pending: new Set(),
            unsubscribe: () => {
              throw Error(tw(22));
            },
          };
        },
        { withTypes: () => tp },
      ),
      th = (e, t) => {
        let { type: r, effect: n, predicate: i } = td(t);
        return Array.from(e.values()).find(
          (e) => ('string' == typeof r ? e.type === r : e.predicate === i) && e.effect === n,
        );
      },
      tv = (e) => {
        e.pending.forEach((e) => {
          e.abort(e8);
        });
      },
      ty = (e, t, r) => {
        try {
          e(t, r);
        } catch (e) {
          setTimeout(() => {
            throw e;
          }, 0);
        }
      },
      tg = tc(eV(`${tf}/add`), { withTypes: () => tg }),
      tm = eV(`${tf}/removeAll`),
      tb = tc(eV(`${tf}/remove`), { withTypes: () => tb }),
      tx = (...e) => {
        console.error(`${tf}/error`, ...e);
      };
    function tw(e) {
      return `Minified Redux Toolkit error #${e}; visit https://redux-toolkit.js.org/Errors?code=${e} for the full message or use the non-minified dev environment for full errors. `;
    }
    (Symbol.for('rtk-state-proxy-original'),
      e.s(
        [
          'autoBatchEnhancer',
          0,
          eG,
          'configureStore',
          0,
          function (e) {
            let t,
              r,
              n,
              i = function (e) {
                let {
                    thunk: t = !0,
                    immutableCheck: r = !0,
                    serializableCheck: n = !0,
                    actionCreatorCheck: i = !0,
                  } = e ?? {},
                  a = new eK();
                return (t && ('boolean' == typeof t ? a.push(eW) : a.push(eU(t.extraArgument))), a);
              },
              {
                reducer: a,
                middleware: o,
                devTools: l = !0,
                duplicateMiddlewareCheck: u = !0,
                preloadedState: c,
                enhancers: s,
              } = e || {};
            if ('function' == typeof a) t = a;
            else if (eI(a)) t = eR(a);
            else throw Error(tw(1));
            r = 'function' == typeof o ? o(i) : i();
            let f = eB;
            l && (f = e$({ trace: !1, ...('object' == typeof l && l) }));
            let d =
              ((n = ez(...r)),
              function (e) {
                let { autoBatch: t = !0 } = e ?? {},
                  r = new eK(n);
                return (t && r.push(eG('object' == typeof t ? t : void 0)), r);
              });
            return eL(t, c, f(...('function' == typeof s ? s(d) : d())));
          },
          'createAction',
          0,
          eV,
          'createListenerMiddleware',
          0,
          (e = {}) => {
            let t = new Map(),
              r = new Map(),
              { extra: n, onError: i = tx } = e;
            te(i, 'onError');
            let a = (e) => {
              var r;
              return (
                ((r = th(t, e) ?? tp(e)).unsubscribe = () => t.delete(r.id)),
                t.set(r.id, r),
                (e) => {
                  (r.unsubscribe(), e?.cancelActive && tv(r));
                }
              );
            };
            tc(a, { withTypes: () => a });
            let o = (e) => {
              let r = th(t, e);
              return (r && (r.unsubscribe(), e.cancelActive && tv(r)), !!r);
            };
            tc(o, { withTypes: () => o });
            let l = async (e, o, l, u) => {
                var c, s;
                let f,
                  d = new AbortController(),
                  p =
                    ((c = d.signal),
                    (f = async (e, t) => {
                      ti(c);
                      let r = () => {},
                        n = [
                          new Promise((t, n) => {
                            let i = a({
                              predicate: e,
                              effect: (e, r) => {
                                (r.unsubscribe(), t([e, r.getState(), r.getOriginalState()]));
                              },
                            });
                            r = () => {
                              (i(), n());
                            };
                          }),
                        ];
                      null != t && n.push(new Promise((e) => setTimeout(e, t, null)));
                      try {
                        let e = await ta(c, Promise.race(n));
                        return (ti(c), e);
                      } finally {
                        r();
                      }
                    }),
                    (e, t) => tr(f(e, t))),
                  h = [];
                try {
                  let i;
                  (e.pending.add(d),
                    (i = r.get(e) ?? 0),
                    r.set(e, i + 1),
                    await Promise.resolve(
                      e.effect(
                        o,
                        tc({}, l, {
                          getOriginalState: u,
                          condition: (e, t) => p(e, t).then(Boolean),
                          take: p,
                          delay: tu(d.signal),
                          pause: tl(d.signal),
                          extra: n,
                          signal: d.signal,
                          fork:
                            ((s = d.signal),
                            (e, t) => {
                              te(e, 'taskExecutor');
                              let r = new AbortController();
                              tn(s, () => r.abort(s.reason));
                              let n = to(
                                async () => {
                                  (ti(s), ti(r.signal));
                                  let t = await e({
                                    pause: tl(r.signal),
                                    delay: tu(r.signal),
                                    signal: r.signal,
                                  });
                                  return (ti(r.signal), t);
                                },
                                () => r.abort(e6),
                              );
                              return (
                                t?.autoJoin && h.push(n.catch(tt)),
                                {
                                  result: tl(s)(n),
                                  cancel() {
                                    r.abort(e3);
                                  },
                                }
                              );
                            }),
                          unsubscribe: e.unsubscribe,
                          subscribe: () => {
                            t.set(e.id, e);
                          },
                          cancelActiveListeners: () => {
                            e.pending.forEach((e, t, r) => {
                              e !== d && (e.abort(e8), r.delete(e));
                            });
                          },
                          cancel: () => {
                            (d.abort(e8), e.pending.delete(d));
                          },
                          throwIfCancelled: () => {
                            ti(d.signal);
                          },
                        }),
                      ),
                    ));
                } catch (e) {
                  e instanceof e7 || ty(i, e, { raisedBy: 'effect' });
                } finally {
                  let t;
                  (await Promise.all(h),
                    d.abort(e9),
                    1 === (t = r.get(e) ?? 1) ? r.delete(e) : r.set(e, t - 1),
                    e.pending.delete(d));
                }
              },
              u = () => {
                for (let e of r.keys()) tv(e);
                t.clear();
              };
            return {
              middleware: (e) => (r) => (n) => {
                let c;
                if (!eF(n)) return r(n);
                if (tg.match(n)) return a(n.payload);
                if (tm.match(n)) return void u();
                if (tb.match(n)) return o(n.payload);
                let s = e.getState(),
                  f = () => {
                    if (s === ts) throw Error(tw(23));
                    return s;
                  };
                try {
                  if (((c = r(n)), t.size > 0)) {
                    let r = e.getState();
                    for (let a of Array.from(t.values())) {
                      let t = !1;
                      try {
                        t = a.predicate(n, r, s);
                      } catch (e) {
                        ((t = !1), ty(i, e, { raisedBy: 'predicate' }));
                      }
                      t && l(a, n, e, f);
                    }
                  }
                } finally {
                  s = ts;
                }
                return c;
              },
              startListening: a,
              stopListening: o,
              clearListeners: u,
            };
          },
          'createSlice',
          0,
          e0,
          'prepareAutoBatched',
          0,
          () => (e) => ({ payload: e, meta: { [eY]: !0 } }),
        ],
        46290,
      ));
  },
  21234,
  (e, t, r) => {
    'use strict';
    var n = e.r(61129),
      i =
        'function' == typeof Object.is
          ? Object.is
          : function (e, t) {
              return (e === t && (0 !== e || 1 / e == 1 / t)) || (e != e && t != t);
            },
      a = n.useSyncExternalStore,
      o = n.useRef,
      l = n.useEffect,
      u = n.useMemo,
      c = n.useDebugValue;
    r.useSyncExternalStoreWithSelector = function (e, t, r, n, s) {
      var f = o(null);
      if (null === f.current) {
        var d = { hasValue: !1, value: null };
        f.current = d;
      } else d = f.current;
      var p = a(
        e,
        (f = u(
          function () {
            function e(e) {
              if (!l) {
                if (((l = !0), (a = e), (e = n(e)), void 0 !== s && d.hasValue)) {
                  var t = d.value;
                  if (s(t, e)) return (o = t);
                }
                return (o = e);
              }
              if (((t = o), i(a, e))) return t;
              var r = n(e);
              return void 0 !== s && s(t, r) ? ((a = e), t) : ((a = e), (o = r));
            }
            var a,
              o,
              l = !1,
              u = void 0 === r ? null : r;
            return [
              function () {
                return e(t());
              },
              null === u
                ? void 0
                : function () {
                    return e(u());
                  },
            ];
          },
          [t, r, n, s],
        ))[0],
        f[1],
      );
      return (
        l(
          function () {
            ((d.hasValue = !0), (d.value = p));
          },
          [p],
        ),
        c(p),
        p
      );
    };
  },
  88703,
  (e, t, r) => {
    'use strict';
    t.exports = e.r(21234);
  },
  11993,
  (e, t, r) => {
    'use strict';
    var n = e.r(61129),
      i = e.r(55248),
      a =
        'function' == typeof Object.is
          ? Object.is
          : function (e, t) {
              return (e === t && (0 !== e || 1 / e == 1 / t)) || (e != e && t != t);
            },
      o = i.useSyncExternalStore,
      l = n.useRef,
      u = n.useEffect,
      c = n.useMemo,
      s = n.useDebugValue;
    r.useSyncExternalStoreWithSelector = function (e, t, r, n, i) {
      var f = l(null);
      if (null === f.current) {
        var d = { hasValue: !1, value: null };
        f.current = d;
      } else d = f.current;
      var p = o(
        e,
        (f = c(
          function () {
            function e(e) {
              if (!u) {
                if (((u = !0), (o = e), (e = n(e)), void 0 !== i && d.hasValue)) {
                  var t = d.value;
                  if (i(t, e)) return (l = t);
                }
                return (l = e);
              }
              if (((t = l), a(o, e))) return t;
              var r = n(e);
              return void 0 !== i && i(t, r) ? ((o = e), t) : ((o = e), (l = r));
            }
            var o,
              l,
              u = !1,
              c = void 0 === r ? null : r;
            return [
              function () {
                return e(t());
              },
              null === c
                ? void 0
                : function () {
                    return e(c());
                  },
            ];
          },
          [t, r, n, i],
        ))[0],
        f[1],
      );
      return (
        u(
          function () {
            ((d.hasValue = !0), (d.value = p));
          },
          [p],
        ),
        s(p),
        p
      );
    };
  },
  91372,
  (e, t, r) => {
    'use strict';
    t.exports = e.r(11993);
  },
  64788,
  (e, t, r) => {
    'use strict';
    function n(e) {
      return 'symbol' == typeof e ? 1 : null === e ? 2 : void 0 === e ? 3 : 4 * (e != e);
    }
    (Object.defineProperty(r, Symbol.toStringTag, { value: 'Module' }),
      (r.compareValues = (e, t, r) => {
        if (e !== t) {
          let i = n(e),
            a = n(t);
          if (i === a && 0 === i) {
            if (e < t) return 'desc' === r ? 1 : -1;
            if (e > t) return 'desc' === r ? -1 : 1;
          }
          return 'desc' === r ? a - i : i - a;
        }
        return 0;
      }));
  },
  6817,
  (e, t, r) => {
    'use strict';
    (Object.defineProperty(r, Symbol.toStringTag, { value: 'Module' }),
      (r.isSymbol = function (e) {
        return 'symbol' == typeof e || e instanceof Symbol;
      }));
  },
  50406,
  (e, t, r) => {
    'use strict';
    Object.defineProperty(r, Symbol.toStringTag, { value: 'Module' });
    let n = e.r(6817),
      i = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
      a = /^\w*$/;
    r.isKey = function (e, t) {
      return (
        !Array.isArray(e) &&
        (!!('number' == typeof e || 'boolean' == typeof e || null == e || n.isSymbol(e)) ||
          ('string' == typeof e && (a.test(e) || !i.test(e))) ||
          (null != t && Object.hasOwn(t, e)))
      );
    };
  },
  38100,
  (e, t, r) => {
    'use strict';
    Object.defineProperty(r, Symbol.toStringTag, { value: 'Module' });
    let n = e.r(64788),
      i = e.r(50406),
      a = e.r(42138);
    r.orderBy = function (e, t, r, o) {
      if (null == e) return [];
      ((r = o ? void 0 : r),
        Array.isArray(e) || (e = Object.values(e)),
        Array.isArray(t) || (t = null == t ? [null] : [t]),
        0 === t.length && (t = [null]),
        Array.isArray(r) || (r = null == r ? [] : [r]),
        (r = r.map((e) => String(e))));
      let l = (e, t) => {
          let r = e;
          for (let e = 0; e < t.length && null != r; ++e) r = r[t[e]];
          return r;
        },
        u = t.map((e) =>
          (Array.isArray(e) && 1 === e.length && (e = e[0]),
          null == e || 'function' == typeof e || Array.isArray(e) || i.isKey(e))
            ? e
            : { key: e, path: a.toPath(e) },
        );
      return e
        .map((e) => ({
          original: e,
          criteria: u.map((t) => {
            var r, n;
            return (
              (r = t),
              null == (n = e) || null == r
                ? n
                : 'object' == typeof r && 'key' in r
                  ? Object.hasOwn(n, r.key)
                    ? n[r.key]
                    : l(n, r.path)
                  : 'function' == typeof r
                    ? r(n)
                    : Array.isArray(r)
                      ? l(n, r)
                      : 'object' == typeof n
                        ? n[r]
                        : n
            );
          }),
        }))
        .slice()
        .sort((e, t) => {
          for (let i = 0; i < u.length; i++) {
            let a = n.compareValues(e.criteria[i], t.criteria[i], r[i]);
            if (0 !== a) return a;
          }
          return 0;
        })
        .map((e) => e.original);
    };
  },
  67666,
  (e, t, r) => {
    'use strict';
    (Object.defineProperty(r, Symbol.toStringTag, { value: 'Module' }),
      (r.flatten = function (e, t = 1) {
        let r = [],
          n = Math.floor(t),
          i = (e, t) => {
            for (let a = 0; a < e.length; a++) {
              let o = e[a];
              Array.isArray(o) && t < n ? i(o, t + 1) : r.push(o);
            }
          };
        return (i(e, 0), r);
      }));
  },
  93083,
  (e, t, r) => {
    'use strict';
    Object.defineProperty(r, Symbol.toStringTag, { value: 'Module' });
    let n = /^(?:0|[1-9]\d*)$/;
    r.isIndex = function (e, t = Number.MAX_SAFE_INTEGER) {
      switch (typeof e) {
        case 'number':
          return Number.isInteger(e) && e >= 0 && e < t;
        case 'symbol':
          return !1;
        case 'string':
          return n.test(e);
      }
    };
  },
  46421,
  (e, t, r) => {
    'use strict';
    (Object.defineProperty(r, Symbol.toStringTag, { value: 'Module' }),
      (r.isLength = function (e) {
        return Number.isSafeInteger(e) && e >= 0;
      }));
  },
  78333,
  (e, t, r) => {
    'use strict';
    Object.defineProperty(r, Symbol.toStringTag, { value: 'Module' });
    let n = e.r(46421);
    r.isArrayLike = function (e) {
      return null != e && 'function' != typeof e && n.isLength(e.length);
    };
  },
  85846,
  (e, t, r) => {
    'use strict';
    (Object.defineProperty(r, Symbol.toStringTag, { value: 'Module' }),
      (r.isObject = function (e) {
        return null !== e && ('object' == typeof e || 'function' == typeof e);
      }));
  },
  94361,
  (e, t, r) => {
    'use strict';
    (Object.defineProperty(r, Symbol.toStringTag, { value: 'Module' }),
      (r.isEqualsSameValueZero = function (e, t) {
        return e === t || (Number.isNaN(e) && Number.isNaN(t));
      }));
  },
  47051,
  (e, t, r) => {
    'use strict';
    Object.defineProperty(r, Symbol.toStringTag, { value: 'Module' });
    let n = e.r(93083),
      i = e.r(78333),
      a = e.r(85846),
      o = e.r(94361);
    r.isIterateeCall = function (e, t, r) {
      return (
        !!a.isObject(r) &&
        ((!!('number' == typeof t && i.isArrayLike(r) && n.isIndex(t)) && t < r.length) ||
          ('string' == typeof t && t in r)) &&
        o.isEqualsSameValueZero(r[t], e)
      );
    };
  },
  7765,
  (e, t, r) => {
    'use strict';
    Object.defineProperty(r, Symbol.toStringTag, { value: 'Module' });
    let n = e.r(38100),
      i = e.r(67666),
      a = e.r(47051);
    r.sortBy = function (e, ...t) {
      let r = t.length;
      return (
        r > 1 && a.isIterateeCall(e, t[0], t[1])
          ? (t = [])
          : r > 2 && a.isIterateeCall(t[0], t[1], t[2]) && (t = [t[0]]),
        n.orderBy(e, i.flatten(t), ['asc'])
      );
    };
  },
  10511,
  (e, t, r) => {
    t.exports = e.r(7765).sortBy;
  },
  46116,
  37577,
  72783,
  12281,
  40826,
  45750,
  31292,
  98733,
  72302,
  32816,
  16427,
  80517,
  36018,
  8018,
  85005,
  26495,
  23683,
  28595,
  (e) => {
    'use strict';
    var t,
      r = e.i(46290),
      n = e.i(49294),
      i = (0, r.createSlice)({
        name: 'options',
        initialState: {
          chartName: '',
          tooltipPayloadSearcher: () => void 0,
          eventEmitter: void 0,
          defaultTooltipEventType: 'axis',
        },
        reducers: {
          createEventEmitter: (e) => {
            null == e.eventEmitter && (e.eventEmitter = Symbol('rechartsEventEmitter'));
          },
        },
      }),
      a = i.reducer,
      { createEventEmitter: o } = i.actions;
    (e.s(
      [
        'arrayTooltipSearcher',
        0,
        (e, t) => {
          if (t && Array.isArray(e)) {
            var r = Number.parseInt(t, 10);
            if (!(0, n.isNan)(r)) return e[r];
          }
        },
        'createEventEmitter',
        0,
        o,
        'optionsReducer',
        0,
        a,
      ],
      46116,
    ),
      e.i(64775));
    var l = e.i(61129);
    e.i(88703);
    var u = { notify() {}, get: () => [] },
      c =
        'u' > typeof window &&
        void 0 !== window.document &&
        void 0 !== window.document.createElement,
      s = 'u' > typeof navigator && 'ReactNative' === navigator.product,
      f = c || s ? l.useLayoutEffect : l.useEffect;
    function d(e, t) {
      return e === t ? 0 !== e || 0 !== t || 1 / e == 1 / t : e != e && t != t;
    }
    var p = Symbol.for('react-redux-context'),
      h = 'u' > typeof globalThis ? globalThis : {},
      v = (function () {
        if (!l.createContext) return {};
        let e = (h[p] ??= new Map()),
          t = e.get(l.createContext);
        return (t || ((t = l.createContext(null)), e.set(l.createContext, t)), t);
      })();
    function y(e = v) {
      return function () {
        return l.useContext(e);
      };
    }
    var g = y();
    e.s(
      [
        'Provider',
        0,
        function (e) {
          let { children: t, context: r, serverState: n, store: i } = e,
            a = l.useMemo(() => {
              let e = (function (e) {
                let t,
                  r = u,
                  n = 0,
                  i = !1;
                function a() {
                  c.onStateChange && c.onStateChange();
                }
                function o() {
                  if ((n++, !t)) {
                    let n, i;
                    ((t = e.subscribe(a)),
                      (n = null),
                      (i = null),
                      (r = {
                        clear() {
                          ((n = null), (i = null));
                        },
                        notify() {
                          let e = n;
                          for (; e; ) (e.callback(), (e = e.next));
                        },
                        get() {
                          let e = [],
                            t = n;
                          for (; t; ) (e.push(t), (t = t.next));
                          return e;
                        },
                        subscribe(e) {
                          let t = !0,
                            r = (i = { callback: e, next: null, prev: i });
                          return (
                            r.prev ? (r.prev.next = r) : (n = r),
                            function () {
                              t &&
                                null !== n &&
                                ((t = !1),
                                r.next ? (r.next.prev = r.prev) : (i = r.prev),
                                r.prev ? (r.prev.next = r.next) : (n = r.next));
                            }
                          );
                        },
                      }));
                  }
                }
                function l() {
                  (n--, t && 0 === n && (t(), (t = void 0), r.clear(), (r = u)));
                }
                let c = {
                  addNestedSub: function (e) {
                    o();
                    let t = r.subscribe(e),
                      n = !1;
                    return () => {
                      n || ((n = !0), t(), l());
                    };
                  },
                  notifyNestedSubs: function () {
                    r.notify();
                  },
                  handleChangeWrapper: a,
                  isSubscribed: function () {
                    return i;
                  },
                  trySubscribe: function () {
                    i || ((i = !0), o());
                  },
                  tryUnsubscribe: function () {
                    i && ((i = !1), l());
                  },
                  getListeners: () => r,
                };
                return c;
              })(i);
              return { store: i, subscription: e, getServerState: n ? () => n : void 0 };
            }, [i, n]),
            o = l.useMemo(() => i.getState(), [i]);
          return (
            f(() => {
              let { subscription: e } = a;
              return (
                (e.onStateChange = e.notifyNestedSubs),
                e.trySubscribe(),
                o !== i.getState() && e.notifyNestedSubs(),
                () => {
                  (e.tryUnsubscribe(), (e.onStateChange = void 0));
                }
              );
            }, [a, o]),
            l.createElement((r || v).Provider, { value: a }, t)
          );
        },
        'shallowEqual',
        0,
        function (e, t) {
          if (d(e, t)) return !0;
          if ('object' != typeof e || null === e || 'object' != typeof t || null === t) return !1;
          let r = Object.keys(e),
            n = Object.keys(t);
          if (r.length !== n.length) return !1;
          for (let n = 0; n < r.length; n++)
            if (!Object.prototype.hasOwnProperty.call(t, r[n]) || !d(e[r[n]], t[r[n]])) return !1;
          return !0;
        },
      ],
      37577,
    );
    var m = e.i(8974),
      b = Symbol.for('immer-nothing'),
      x = Symbol.for('immer-draftable'),
      w = Symbol.for('immer-state');
    function O(e) {
      throw Error(`[Immer] minified error nr: ${e}. Full error at: https://bit.ly/3cXEKWf`);
    }
    var S = Object.getPrototypeOf;
    function A(e) {
      return !!e && !!e[w];
    }
    function P(e) {
      return !!e && (j(e) || Array.isArray(e) || !!e[x] || !!e.constructor?.[x] || D(e) || N(e));
    }
    var _ = Object.prototype.constructor.toString(),
      E = new WeakMap();
    function j(e) {
      if (!e || 'object' != typeof e) return !1;
      let t = Object.getPrototypeOf(e);
      if (null === t || t === Object.prototype) return !0;
      let r = Object.hasOwnProperty.call(t, 'constructor') && t.constructor;
      if (r === Object) return !0;
      if ('function' != typeof r) return !1;
      let n = E.get(r);
      return (void 0 === n && ((n = Function.toString.call(r)), E.set(r, n)), n === _);
    }
    function C(e, t, r = !0) {
      0 === M(e)
        ? (r ? Reflect.ownKeys(e) : Object.keys(e)).forEach((r) => {
            t(r, e[r], e);
          })
        : e.forEach((r, n) => t(n, r, e));
    }
    function M(e) {
      let t = e[w];
      return t ? t.type_ : Array.isArray(e) ? 1 : D(e) ? 2 : 3 * !!N(e);
    }
    function k(e, t) {
      return 2 === M(e) ? e.has(t) : Object.prototype.hasOwnProperty.call(e, t);
    }
    function T(e, t, r) {
      let n = M(e);
      2 === n ? e.set(t, r) : 3 === n ? e.add(r) : (e[t] = r);
    }
    function D(e) {
      return e instanceof Map;
    }
    function N(e) {
      return e instanceof Set;
    }
    function I(e) {
      return e.copy_ || e.base_;
    }
    function L(e, t) {
      if (D(e)) return new Map(e);
      if (N(e)) return new Set(e);
      if (Array.isArray(e)) return Array.prototype.slice.call(e);
      let r = j(e);
      if (!0 !== t && ('class_only' !== t || r)) {
        let t = S(e);
        return null !== t && r ? { ...e } : Object.assign(Object.create(t), e);
      }
      {
        let t = Object.getOwnPropertyDescriptors(e);
        delete t[w];
        let r = Reflect.ownKeys(t);
        for (let n = 0; n < r.length; n++) {
          let i = r[n],
            a = t[i];
          (!1 === a.writable && ((a.writable = !0), (a.configurable = !0)),
            (a.get || a.set) &&
              (t[i] = { configurable: !0, writable: !0, enumerable: a.enumerable, value: e[i] }));
        }
        return Object.create(S(e), t);
      }
    }
    function R(e, t = !1) {
      return (
        z(e) ||
          A(e) ||
          !P(e) ||
          (M(e) > 1 && Object.defineProperties(e, { set: B, add: B, clear: B, delete: B }),
          Object.freeze(e),
          t && Object.values(e).forEach((e) => R(e, !0))),
        e
      );
    }
    var B = {
      value: function () {
        O(2);
      },
    };
    function z(e) {
      return null === e || 'object' != typeof e || Object.isFrozen(e);
    }
    var F = {};
    function U(e) {
      let t = F[e];
      return (t || O(0, e), t);
    }
    function W(e, t) {
      t && (U('Patches'), (e.patches_ = []), (e.inversePatches_ = []), (e.patchListener_ = t));
    }
    function $(e) {
      (V(e), e.drafts_.forEach(H), (e.drafts_ = null));
    }
    function V(e) {
      e === t && (t = e.parent_);
    }
    function K(e) {
      return (t = {
        drafts_: [],
        parent_: t,
        immer_: e,
        canAutoFreeze_: !0,
        unfinalizedDrafts_: 0,
      });
    }
    function H(e) {
      let t = e[w];
      0 === t.type_ || 1 === t.type_ ? t.revoke_() : (t.revoked_ = !0);
    }
    function q(e, t) {
      t.unfinalizedDrafts_ = t.drafts_.length;
      let r = t.drafts_[0];
      return (
        void 0 !== e && e !== r
          ? (r[w].modified_ && ($(t), O(4)),
            P(e) && ((e = Y(t, e)), t.parent_ || G(t, e)),
            t.patches_ &&
              U('Patches').generateReplacementPatches_(
                r[w].base_,
                e,
                t.patches_,
                t.inversePatches_,
              ))
          : (e = Y(t, r, [])),
        $(t),
        t.patches_ && t.patchListener_(t.patches_, t.inversePatches_),
        e !== b ? e : void 0
      );
    }
    function Y(e, t, r) {
      if (z(t)) return t;
      let n = e.immer_.shouldUseStrictIteration(),
        i = t[w];
      if (!i) return (C(t, (n, a) => X(e, i, t, n, a, r), n), t);
      if (i.scope_ !== e) return t;
      if (!i.modified_) return (G(e, i.base_, !0), i.base_);
      if (!i.finalized_) {
        ((i.finalized_ = !0), i.scope_.unfinalizedDrafts_--);
        let t = i.copy_,
          a = t,
          o = !1;
        (3 === i.type_ && ((a = new Set(t)), t.clear(), (o = !0)),
          C(a, (n, a) => X(e, i, t, n, a, r, o), n),
          G(e, t, !1),
          r && e.patches_ && U('Patches').generatePatches_(i, r, e.patches_, e.inversePatches_));
      }
      return i.copy_;
    }
    function X(e, t, r, n, i, a, o) {
      if (null == i || ('object' != typeof i && !o)) return;
      let l = z(i);
      if (!l || o) {
        if (A(i)) {
          let o = Y(e, i, a && t && 3 !== t.type_ && !k(t.assigned_, n) ? a.concat(n) : void 0);
          if ((T(r, n, o), !A(o))) return;
          e.canAutoFreeze_ = !1;
        } else o && r.add(i);
        if (P(i) && !l) {
          if (
            (!e.immer_.autoFreeze_ && e.unfinalizedDrafts_ < 1) ||
            (t && t.base_ && t.base_[n] === i && l)
          )
            return;
          (Y(e, i),
            (!t || !t.scope_.parent_) &&
              'symbol' != typeof n &&
              (D(r) ? r.has(n) : Object.prototype.propertyIsEnumerable.call(r, n)) &&
              G(e, i));
        }
      }
    }
    function G(e, t, r = !1) {
      !e.parent_ && e.immer_.autoFreeze_ && e.canAutoFreeze_ && R(t, r);
    }
    var Z = {
        get(e, t) {
          if (t === w) return e;
          let r = I(e);
          if (!k(r, t)) {
            var n;
            let i;
            return (
              (n = e),
              (i = ee(r, t)) ? ('value' in i ? i.value : i.get?.call(n.draft_)) : void 0
            );
          }
          let i = r[t];
          return e.finalized_ || !P(i)
            ? i
            : i === J(e.base_, t)
              ? (er(e), (e.copy_[t] = en(i, e)))
              : i;
        },
        has: (e, t) => t in I(e),
        ownKeys: (e) => Reflect.ownKeys(I(e)),
        set(e, t, r) {
          let n = ee(I(e), t);
          if (n?.set) return (n.set.call(e.draft_, r), !0);
          if (!e.modified_) {
            let n = J(I(e), t),
              i = n?.[w];
            if (i && i.base_ === r) return ((e.copy_[t] = r), (e.assigned_[t] = !1), !0);
            if (
              (r === n ? 0 !== r || 1 / r == 1 / n : r != r && n != n) &&
              (void 0 !== r || k(e.base_, t))
            )
              return !0;
            (er(e), et(e));
          }
          return (
            !!(
              (e.copy_[t] === r && (void 0 !== r || t in e.copy_)) ||
              (Number.isNaN(r) && Number.isNaN(e.copy_[t]))
            ) || ((e.copy_[t] = r), (e.assigned_[t] = !0), !0)
          );
        },
        deleteProperty: (e, t) => (
          void 0 !== J(e.base_, t) || t in e.base_
            ? ((e.assigned_[t] = !1), er(e), et(e))
            : delete e.assigned_[t],
          e.copy_ && delete e.copy_[t],
          !0
        ),
        getOwnPropertyDescriptor(e, t) {
          let r = I(e),
            n = Reflect.getOwnPropertyDescriptor(r, t);
          return n
            ? {
                writable: !0,
                configurable: 1 !== e.type_ || 'length' !== t,
                enumerable: n.enumerable,
                value: r[t],
              }
            : n;
        },
        defineProperty() {
          O(11);
        },
        getPrototypeOf: (e) => S(e.base_),
        setPrototypeOf() {
          O(12);
        },
      },
      Q = {};
    function J(e, t) {
      let r = e[w];
      return (r ? I(r) : e)[t];
    }
    function ee(e, t) {
      if (!(t in e)) return;
      let r = S(e);
      for (; r; ) {
        let e = Object.getOwnPropertyDescriptor(r, t);
        if (e) return e;
        r = S(r);
      }
    }
    function et(e) {
      !e.modified_ && ((e.modified_ = !0), e.parent_ && et(e.parent_));
    }
    function er(e) {
      e.copy_ || (e.copy_ = L(e.base_, e.scope_.immer_.useStrictShallowCopy_));
    }
    function en(e, r) {
      let n = D(e)
        ? U('MapSet').proxyMap_(e, r)
        : N(e)
          ? U('MapSet').proxySet_(e, r)
          : (function (e, r) {
              let n = Array.isArray(e),
                i = {
                  type_: +!!n,
                  scope_: r ? r.scope_ : t,
                  modified_: !1,
                  finalized_: !1,
                  assigned_: {},
                  parent_: r,
                  base_: e,
                  draft_: null,
                  copy_: null,
                  revoke_: null,
                  isManual_: !1,
                },
                a = i,
                o = Z;
              n && ((a = [i]), (o = Q));
              let { revoke: l, proxy: u } = Proxy.revocable(a, o);
              return ((i.draft_ = u), (i.revoke_ = l), u);
            })(e, r);
      return ((r ? r.scope_ : t).drafts_.push(n), n);
    }
    function ei(e) {
      return e;
    }
    (C(Z, (e, t) => {
      Q[e] = function () {
        return ((arguments[0] = arguments[0][0]), t.apply(this, arguments));
      };
    }),
      (Q.deleteProperty = function (e, t) {
        return Q.set.call(this, e, t, void 0);
      }),
      (Q.set = function (e, t, r) {
        return Z.set.call(this, e[0], t, r, e[0]);
      }),
      new (class {
        constructor(e) {
          ((this.autoFreeze_ = !0),
            (this.useStrictShallowCopy_ = !1),
            (this.useStrictIteration_ = !0),
            (this.produce = (e, t, r) => {
              let n;
              if ('function' == typeof e && 'function' != typeof t) {
                let r = t;
                t = e;
                let n = this;
                return function (e = r, ...i) {
                  return n.produce(e, (e) => t.call(this, e, ...i));
                };
              }
              if (
                ('function' != typeof t && O(6),
                void 0 !== r && 'function' != typeof r && O(7),
                P(e))
              ) {
                let i = K(this),
                  a = en(e, void 0),
                  o = !0;
                try {
                  ((n = t(a)), (o = !1));
                } finally {
                  o ? $(i) : V(i);
                }
                return (W(i, r), q(n, i));
              }
              if (e && 'object' == typeof e) O(1, e);
              else {
                if (
                  (void 0 === (n = t(e)) && (n = e),
                  n === b && (n = void 0),
                  this.autoFreeze_ && R(n, !0),
                  r)
                ) {
                  let t = [],
                    i = [];
                  (U('Patches').generateReplacementPatches_(e, n, t, i), r(t, i));
                }
                return n;
              }
            }),
            (this.produceWithPatches = (e, t) => {
              let r, n;
              return 'function' == typeof e
                ? (t, ...r) => this.produceWithPatches(t, (t) => e(t, ...r))
                : [
                    this.produce(e, t, (e, t) => {
                      ((r = e), (n = t));
                    }),
                    r,
                    n,
                  ];
            }),
            'boolean' == typeof e?.autoFreeze && this.setAutoFreeze(e.autoFreeze),
            'boolean' == typeof e?.useStrictShallowCopy &&
              this.setUseStrictShallowCopy(e.useStrictShallowCopy),
            'boolean' == typeof e?.useStrictIteration &&
              this.setUseStrictIteration(e.useStrictIteration));
        }
        createDraft(e) {
          var t;
          (P(e) || O(8),
            A(e) &&
              (A((t = e)) || O(10, t),
              (e = (function e(t) {
                let r;
                if (!P(t) || z(t)) return t;
                let n = t[w],
                  i = !0;
                if (n) {
                  if (!n.modified_) return n.base_;
                  ((n.finalized_ = !0),
                    (r = L(t, n.scope_.immer_.useStrictShallowCopy_)),
                    (i = n.scope_.immer_.shouldUseStrictIteration()));
                } else r = L(t, !0);
                return (
                  C(
                    r,
                    (t, n) => {
                      T(r, t, e(n));
                    },
                    i,
                  ),
                  n && (n.finalized_ = !1),
                  r
                );
              })(t))));
          let r = K(this),
            n = en(e, void 0);
          return ((n[w].isManual_ = !0), V(r), n);
        }
        finishDraft(e, t) {
          let r = e && e[w];
          (r && r.isManual_) || O(9);
          let { scope_: n } = r;
          return (W(n, t), q(void 0, n));
        }
        setAutoFreeze(e) {
          this.autoFreeze_ = e;
        }
        setUseStrictShallowCopy(e) {
          this.useStrictShallowCopy_ = e;
        }
        setUseStrictIteration(e) {
          this.useStrictIteration_ = e;
        }
        shouldUseStrictIteration() {
          return this.useStrictIteration_;
        }
        applyPatches(e, t) {
          let r;
          for (r = t.length - 1; r >= 0; r--) {
            let n = t[r];
            if (0 === n.path.length && 'replace' === n.op) {
              e = n.value;
              break;
            }
          }
          r > -1 && (t = t.slice(r + 1));
          let n = U('Patches').applyPatches_;
          return A(e) ? n(e, t) : this.produce(e, (e) => n(e, t));
        }
      })().produce,
      e.s(['castDraft', 0, ei], 72783));
    var ea = {
        active: !1,
        index: null,
        dataKey: void 0,
        graphicalItemId: void 0,
        coordinate: void 0,
      },
      eo = (0, r.createSlice)({
        name: 'tooltip',
        initialState: {
          itemInteraction: { click: ea, hover: ea },
          axisInteraction: { click: ea, hover: ea },
          keyboardInteraction: ea,
          syncInteraction: {
            active: !1,
            index: null,
            dataKey: void 0,
            label: void 0,
            coordinate: void 0,
            sourceViewBox: void 0,
            graphicalItemId: void 0,
          },
          tooltipItemPayloads: [],
          settings: {
            shared: void 0,
            trigger: 'hover',
            axisId: 0,
            active: !1,
            defaultIndex: void 0,
          },
        },
        reducers: {
          addTooltipEntrySettings: {
            reducer(e, t) {
              e.tooltipItemPayloads.push(ei(t.payload));
            },
            prepare: (0, r.prepareAutoBatched)(),
          },
          replaceTooltipEntrySettings: {
            reducer(e, t) {
              var { prev: r, next: n } = t.payload,
                i = (0, m.current)(e).tooltipItemPayloads.indexOf(ei(r));
              i > -1 && (e.tooltipItemPayloads[i] = ei(n));
            },
            prepare: (0, r.prepareAutoBatched)(),
          },
          removeTooltipEntrySettings: {
            reducer(e, t) {
              var r = (0, m.current)(e).tooltipItemPayloads.indexOf(ei(t.payload));
              r > -1 && e.tooltipItemPayloads.splice(r, 1);
            },
            prepare: (0, r.prepareAutoBatched)(),
          },
          setTooltipSettingsState(e, t) {
            e.settings = t.payload;
          },
          setActiveMouseOverItemIndex(e, t) {
            ((e.syncInteraction.active = !1),
              (e.syncInteraction.sourceViewBox = void 0),
              (e.keyboardInteraction.active = !1),
              (e.itemInteraction.hover.active = !0),
              (e.itemInteraction.hover.index = t.payload.activeIndex),
              (e.itemInteraction.hover.dataKey = t.payload.activeDataKey),
              (e.itemInteraction.hover.graphicalItemId = t.payload.activeGraphicalItemId),
              (e.itemInteraction.hover.coordinate = t.payload.activeCoordinate));
          },
          mouseLeaveChart(e) {
            ((e.itemInteraction.hover.active = !1), (e.axisInteraction.hover.active = !1));
          },
          mouseLeaveItem(e) {
            e.itemInteraction.hover.active = !1;
          },
          setActiveClickItemIndex(e, t) {
            ((e.syncInteraction.active = !1),
              (e.syncInteraction.sourceViewBox = void 0),
              (e.itemInteraction.click.active = !0),
              (e.keyboardInteraction.active = !1),
              (e.itemInteraction.click.index = t.payload.activeIndex),
              (e.itemInteraction.click.dataKey = t.payload.activeDataKey),
              (e.itemInteraction.click.graphicalItemId = t.payload.activeGraphicalItemId),
              (e.itemInteraction.click.coordinate = t.payload.activeCoordinate));
          },
          setMouseOverAxisIndex(e, t) {
            ((e.syncInteraction.active = !1),
              (e.syncInteraction.sourceViewBox = void 0),
              (e.axisInteraction.hover.active = !0),
              (e.keyboardInteraction.active = !1),
              (e.axisInteraction.hover.index = t.payload.activeIndex),
              (e.axisInteraction.hover.dataKey = t.payload.activeDataKey),
              (e.axisInteraction.hover.coordinate = t.payload.activeCoordinate));
          },
          setMouseClickAxisIndex(e, t) {
            ((e.syncInteraction.active = !1),
              (e.syncInteraction.sourceViewBox = void 0),
              (e.keyboardInteraction.active = !1),
              (e.axisInteraction.click.active = !0),
              (e.axisInteraction.click.index = t.payload.activeIndex),
              (e.axisInteraction.click.dataKey = t.payload.activeDataKey),
              (e.axisInteraction.click.coordinate = t.payload.activeCoordinate));
          },
          setSyncInteraction(e, t) {
            e.syncInteraction = t.payload;
          },
          setKeyboardInteraction(e, t) {
            ((e.keyboardInteraction.active = t.payload.active),
              (e.keyboardInteraction.index = t.payload.activeIndex),
              (e.keyboardInteraction.coordinate = t.payload.activeCoordinate));
          },
        },
      }),
      {
        addTooltipEntrySettings: el,
        replaceTooltipEntrySettings: eu,
        removeTooltipEntrySettings: ec,
        setTooltipSettingsState: es,
        setActiveMouseOverItemIndex: ef,
        mouseLeaveItem: ed,
        mouseLeaveChart: ep,
        setActiveClickItemIndex: eh,
        setMouseOverAxisIndex: ev,
        setMouseClickAxisIndex: ey,
        setSyncInteraction: eg,
        setKeyboardInteraction: em,
      } = eo.actions,
      eb = eo.reducer;
    e.s(
      [
        'addTooltipEntrySettings',
        0,
        el,
        'mouseLeaveChart',
        0,
        ep,
        'mouseLeaveItem',
        0,
        ed,
        'noInteraction',
        0,
        ea,
        'removeTooltipEntrySettings',
        0,
        ec,
        'replaceTooltipEntrySettings',
        0,
        eu,
        'setActiveClickItemIndex',
        0,
        eh,
        'setActiveMouseOverItemIndex',
        0,
        ef,
        'setKeyboardInteraction',
        0,
        em,
        'setMouseClickAxisIndex',
        0,
        ey,
        'setMouseOverAxisIndex',
        0,
        ev,
        'setSyncInteraction',
        0,
        eg,
        'setTooltipSettingsState',
        0,
        es,
        'tooltipReducer',
        0,
        eb,
      ],
      12281,
    );
    var ex = (0, r.createSlice)({
        name: 'chartData',
        initialState: {
          chartData: void 0,
          computedData: void 0,
          dataStartIndex: 0,
          dataEndIndex: 0,
        },
        reducers: {
          setChartData(e, t) {
            if (((e.chartData = ei(t.payload)), null == t.payload)) {
              ((e.dataStartIndex = 0), (e.dataEndIndex = 0));
              return;
            }
            t.payload.length > 0 &&
              e.dataEndIndex !== t.payload.length - 1 &&
              (e.dataEndIndex = t.payload.length - 1);
          },
          setComputedData(e, t) {
            e.computedData = t.payload;
          },
          setDataStartEndIndexes(e, t) {
            var { startIndex: r, endIndex: n } = t.payload;
            (null != r && (e.dataStartIndex = r), null != n && (e.dataEndIndex = n));
          },
        },
      }),
      { setChartData: ew, setDataStartEndIndexes: eO, setComputedData: eS } = ex.actions,
      eA = ex.reducer;
    e.s(
      [
        'chartDataReducer',
        0,
        eA,
        'setChartData',
        0,
        ew,
        'setComputedData',
        0,
        eS,
        'setDataStartEndIndexes',
        0,
        eO,
      ],
      40826,
    );
    var eP = (0, r.createSlice)({
        name: 'chartLayout',
        initialState: {
          layoutType: 'horizontal',
          width: 0,
          height: 0,
          margin: { top: 5, right: 5, bottom: 5, left: 5 },
          scale: 1,
        },
        reducers: {
          setLayout(e, t) {
            e.layoutType = t.payload;
          },
          setChartSize(e, t) {
            ((e.width = t.payload.width), (e.height = t.payload.height));
          },
          setMargin(e, t) {
            var r, n, i, a;
            ((e.margin.top = null != (r = t.payload.top) ? r : 0),
              (e.margin.right = null != (n = t.payload.right) ? n : 0),
              (e.margin.bottom = null != (i = t.payload.bottom) ? i : 0),
              (e.margin.left = null != (a = t.payload.left) ? a : 0));
          },
          setScale(e, t) {
            e.scale = t.payload;
          },
        },
      }),
      { setMargin: e_, setLayout: eE, setChartSize: ej, setScale: eC } = eP.actions,
      eM = eP.reducer;
    e.s(
      [
        'chartLayoutReducer',
        0,
        eM,
        'setChartSize',
        0,
        ej,
        'setLayout',
        0,
        eE,
        'setMargin',
        0,
        e_,
        'setScale',
        0,
        eC,
      ],
      45750,
    );
    var ek = e.i(91372),
      eT = (0, l.createContext)(null);
    e.s(['RechartsReduxContext', 0, eT], 31292);
    var eD = (e) => e,
      eN = () => {},
      eI = () => eN,
      eL = (e, t) => e === t;
    e.s(
      [
        'useAppDispatch',
        0,
        () => {
          var e = (0, l.useContext)(eT);
          return e ? e.store.dispatch : eD;
        },
        'useAppSelector',
        0,
        function (e) {
          var t = (0, l.useContext)(eT),
            r = (0, l.useMemo)(
              () =>
                t
                  ? (t) => {
                      if (null != t) return e(t);
                    }
                  : eN,
              [t, e],
            );
          return (0, ek.useSyncExternalStoreWithSelector)(
            t ? t.subscription.addNestedSub : eI,
            t ? t.store.getState : eN,
            t ? t.store.getState : eN,
            r,
            eL,
          );
        },
      ],
      98733,
    );
    var eR = e.i(29576),
      eB = e.i(10511),
      ez = (e) => e.legend.settings,
      eF = (0, eR.createSelector)([(e) => e.legend.payload, ez], (e, t) => {
        var { itemSorter: r } = t,
          n = e.flat(1);
        return r ? (0, eB.default)(n, r) : n;
      });
    function eU(e) {
      return 'object' == typeof e && 'length' in e ? e : Array.from(e);
    }
    function eW(e) {
      return function () {
        return e;
      };
    }
    function e$(e, t) {
      if ((i = e.length) > 1)
        for (var r, n, i, a = 1, o = e[t[0]], l = o.length; a < i; ++a)
          for (n = o, o = e[t[a]], r = 0; r < l; ++r)
            o[r][1] += o[r][0] = isNaN(n[r][1]) ? n[r][0] : n[r][1];
    }
    function eV(e) {
      for (var t = e.length, r = Array(t); --t >= 0; ) r[t] = t;
      return r;
    }
    function eK(e, t) {
      return e[t];
    }
    function eH(e) {
      let t = [];
      return ((t.key = e), t);
    }
    (e.s(
      [
        'selectLegendPayload',
        0,
        eF,
        'selectLegendSettings',
        0,
        ez,
        'selectLegendSize',
        0,
        (e) => e.legend.size,
      ],
      72302,
    ),
      Array.prototype.slice,
      e.s(['default', 0, eU], 32816),
      e.s(['default', 0, eW], 16427),
      e.s(
        [
          'stack',
          0,
          function () {
            var e = eW([]),
              t = eV,
              r = e$,
              n = eK;
            function i(i) {
              var a,
                o,
                l = Array.from(e.apply(this, arguments), eH),
                u = l.length,
                c = -1;
              for (let e of i)
                for (a = 0, ++c; a < u; ++a) (l[a][c] = [0, +n(e, l[a].key, c, i)]).data = e;
              for (a = 0, o = eU(t(l)); a < u; ++a) l[o[a]].index = a;
              return (r(l, o), l);
            }
            return (
              (i.keys = function (t) {
                return arguments.length
                  ? ((e = 'function' == typeof t ? t : eW(Array.from(t))), i)
                  : e;
              }),
              (i.value = function (e) {
                return arguments.length ? ((n = 'function' == typeof e ? e : eW(+e)), i) : n;
              }),
              (i.order = function (e) {
                return arguments.length
                  ? ((t = null == e ? eV : 'function' == typeof e ? e : eW(Array.from(e))), i)
                  : t;
              }),
              (i.offset = function (e) {
                return arguments.length ? ((r = null == e ? e$ : e), i) : r;
              }),
              i
            );
          },
        ],
        80517,
      ),
      e.s(
        [
          'stackOffsetExpand',
          0,
          function (e, t) {
            if ((n = e.length) > 0) {
              for (var r, n, i, a = 0, o = e[0].length; a < o; ++a) {
                for (i = r = 0; r < n; ++r) i += e[r][a][1] || 0;
                if (i) for (r = 0; r < n; ++r) e[r][a][1] /= i;
              }
              e$(e, t);
            }
          },
        ],
        36018,
      ),
      e.s(['stackOffsetNone', 0, e$], 8018),
      e.s(
        [
          'stackOffsetSilhouette',
          0,
          function (e, t) {
            if ((r = e.length) > 0) {
              for (var r, n = 0, i = e[t[0]], a = i.length; n < a; ++n) {
                for (var o = 0, l = 0; o < r; ++o) l += e[o][n][1] || 0;
                i[n][1] += i[n][0] = -l / 2;
              }
              e$(e, t);
            }
          },
        ],
        85005,
      ),
      e.s(
        [
          'stackOffsetWiggle',
          0,
          function (e, t) {
            if ((i = e.length) > 0 && (n = (r = e[t[0]]).length) > 0) {
              for (var r, n, i, a = 0, o = 1; o < n; ++o) {
                for (var l = 0, u = 0, c = 0; l < i; ++l) {
                  for (
                    var s = e[t[l]], f = s[o][1] || 0, d = (f - (s[o - 1][1] || 0)) / 2, p = 0;
                    p < l;
                    ++p
                  ) {
                    var h = e[t[p]];
                    d += (h[o][1] || 0) - (h[o - 1][1] || 0);
                  }
                  ((u += f), (c += d * f));
                }
                ((r[o - 1][1] += r[o - 1][0] = a), u && (a -= c / u));
              }
              ((r[o - 1][1] += r[o - 1][0] = a), e$(e, t));
            }
          },
        ],
        26495,
      ),
      e.s(['stackOrderNone', 0, eV], 23683),
      e.s(
        [
          'getSliced',
          0,
          function (e, t, r) {
            return Array.isArray(e) && e && t + r !== 0 ? e.slice(t, r + 1) : e;
          },
        ],
        28595,
      ));
  },
  57024,
  41469,
  4988,
  96299,
  66850,
  57632,
  61472,
  (e) => {
    'use strict';
    var t = e.i(29576),
      r = e.i(72302),
      n = e.i(10511),
      i = e.i(28539),
      a = e.i(80517),
      o = e.i(36018),
      l = e.i(8018),
      u = e.i(85005),
      c = e.i(26495),
      s = e.i(23683),
      f = e.i(49294),
      d = e.i(28595),
      p = e.i(25894);
    function h(e, t) {
      var r = Object.keys(e);
      if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(e);
        (t &&
          (n = n.filter(function (t) {
            return Object.getOwnPropertyDescriptor(e, t).enumerable;
          })),
          r.push.apply(r, n));
      }
      return r;
    }
    function v(e) {
      for (var t = 1; t < arguments.length; t++) {
        var r = null != arguments[t] ? arguments[t] : {};
        t % 2
          ? h(Object(r), !0).forEach(function (t) {
              var n, i, a;
              ((n = e),
                (i = t),
                (a = r[t]),
                (i = (function (e) {
                  var t = (function (e, t) {
                    if ('object' != typeof e || !e) return e;
                    var r = e[Symbol.toPrimitive];
                    if (void 0 !== r) {
                      var n = r.call(e, t || 'default');
                      if ('object' != typeof n) return n;
                      throw TypeError('@@toPrimitive must return a primitive value.');
                    }
                    return ('string' === t ? String : Number)(e);
                  })(e, 'string');
                  return 'symbol' == typeof t ? t : t + '';
                })(i)) in n
                  ? Object.defineProperty(n, i, {
                      value: a,
                      enumerable: !0,
                      configurable: !0,
                      writable: !0,
                    })
                  : (n[i] = a));
            })
          : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
            : h(Object(r)).forEach(function (t) {
                Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t));
              });
      }
      return e;
    }
    function y(e, t, r) {
      return (0, f.isNullish)(e) || (0, f.isNullish)(t)
        ? r
        : (0, f.isNumOrStr)(t)
          ? (0, i.default)(e, t, r)
          : 'function' == typeof t
            ? t(e)
            : r;
    }
    var g = (e, t, r) => {
        if (t && r) {
          var { width: n, height: i } = r,
            { align: a, verticalAlign: o, layout: l } = t;
          if (
            ('vertical' === l || ('horizontal' === l && 'middle' === o)) &&
            'center' !== a &&
            (0, f.isNumber)(e[a])
          )
            return v(v({}, e), {}, { [a]: e[a] + (n || 0) });
          if (
            ('horizontal' === l || ('vertical' === l && 'center' === a)) &&
            'middle' !== o &&
            (0, f.isNumber)(e[o])
          )
            return v(v({}, e), {}, { [o]: e[o] + (i || 0) });
        }
        return e;
      },
      m = {
        sign: (e) => {
          var t,
            r = e.length;
          if (!(r <= 0)) {
            var n = null == (t = e[0]) ? void 0 : t.length;
            if (null != n && !(n <= 0))
              for (var i = 0; i < n; ++i)
                for (var a = 0, o = 0, l = 0; l < r; ++l) {
                  var u = e[l],
                    c = null == u ? void 0 : u[i];
                  if (null != c) {
                    var s = c[1],
                      d = c[0],
                      p = (0, f.isNan)(s) ? d : s;
                    p >= 0
                      ? ((c[0] = a), (a += p), (c[1] = a))
                      : ((c[0] = o), (o += p), (c[1] = o));
                  }
                }
          }
        },
        expand: o.stackOffsetExpand,
        none: l.stackOffsetNone,
        silhouette: u.stackOffsetSilhouette,
        wiggle: c.stackOffsetWiggle,
        positive: (e) => {
          var t,
            r = e.length;
          if (!(r <= 0)) {
            var n = null == (t = e[0]) ? void 0 : t.length;
            if (null != n && !(n <= 0))
              for (var i = 0; i < n; ++i)
                for (var a = 0, o = 0; o < r; ++o) {
                  var l = e[o],
                    u = null == l ? void 0 : l[i];
                  if (null != u) {
                    var c = (0, f.isNan)(u[1]) ? u[0] : u[1];
                    c >= 0 ? ((u[0] = a), (a += c), (u[1] = a)) : ((u[0] = 0), (u[1] = 0));
                  }
                }
          }
        },
      };
    e.s(
      [
        'MAX_VALUE_REG',
        0,
        /^dataMax[\s]*\+[\s]*([0-9]+([.]{1}[0-9]+){0,1})$/,
        'MIN_VALUE_REG',
        0,
        /^dataMin[\s]*-[\s]*([0-9]+([.]{1}[0-9]+){0,1})$/,
        'appendOffsetOfLegend',
        0,
        g,
        'calculateCartesianTooltipPos',
        0,
        (e, t) => ('horizontal' === t ? e.relativeX : 'vertical' === t ? e.relativeY : void 0),
        'calculatePolarTooltipPos',
        0,
        (e, t) => ('centric' === t ? e.angle : e.radius),
        'getBandSizeOfAxis',
        0,
        (e, t, r) => {
          if (e && e.scale && e.scale.bandwidth) {
            var i = e.scale.bandwidth();
            if (!r || i > 0) return i;
          }
          if (e && t && t.length >= 2) {
            for (
              var a = (0, n.default)(t, (e) => e.coordinate), o = 1 / 0, l = 1, u = a.length;
              l < u;
              l++
            ) {
              var c = a[l],
                s = a[l - 1];
              o = Math.min(
                ((null == c ? void 0 : c.coordinate) || 0) -
                  ((null == s ? void 0 : s.coordinate) || 0),
                o,
              );
            }
            return o === 1 / 0 ? 0 : o;
          }
          return r ? void 0 : 0;
        },
        'getBaseValueOfBar',
        0,
        (e) => {
          var { numericAxis: t } = e,
            r = t.scale.domain();
          if ('number' === t.type) {
            var n = Math.min(r[0], r[1]),
              i = Math.max(r[0], r[1]);
            return n <= 0 && i >= 0 ? 0 : i < 0 ? i : n;
          }
          return r[0];
        },
        'getCateCoordinateOfBar',
        0,
        (e) => {
          var { axis: t, ticks: r, offset: n, bandSize: i, entry: a, index: o } = e;
          if ('category' === t.type) return r[o] ? r[o].coordinate + n : null;
          var l = y(a, t.dataKey, t.scale.domain()[o]);
          if ((0, f.isNullish)(l)) return null;
          var u = t.scale.map(l);
          return (0, f.isNumber)(u) ? u - i / 2 + n : null;
        },
        'getCateCoordinateOfLine',
        0,
        function (e) {
          var { axis: t, ticks: r, bandSize: n, entry: i, index: a, dataKey: o } = e;
          if ('category' === t.type) {
            if (!t.allowDuplicatedCategory && t.dataKey && !(0, f.isNullish)(i[t.dataKey])) {
              var l = (0, f.findEntryInArray)(r, 'value', i[t.dataKey]);
              if (l) return l.coordinate + n / 2;
            }
            return null != r && r[a] ? r[a].coordinate + n / 2 : null;
          }
          var u = y(i, (0, f.isNullish)(o) ? t.dataKey : o),
            c = t.scale.map(u);
          return (0, f.isNumber)(c) ? c : null;
        },
        'getCoordinatesOfGrid',
        0,
        (e, t, r, n) => {
          if (n) return e.map((e) => e.coordinate);
          var i,
            a,
            o = e.map(
              (e) => (e.coordinate === t && (i = !0), e.coordinate === r && (a = !0), e.coordinate),
            );
          return (i || o.push(t), a || o.push(r), o);
        },
        'getDomainOfStackGroups',
        0,
        (e, t, r) => {
          if (null != e) {
            let n;
            return [
              (n = Object.keys(e).reduce(
                (n, i) => {
                  var a = e[i];
                  if (!a) return n;
                  var { stackedData: o } = a,
                    l = o.reduce(
                      (e, n) => {
                        var i,
                          a = [
                            Math.min(...(i = (0, d.getSliced)(n, t, r).flat(2).filter(f.isNumber))),
                            Math.max(...i),
                          ];
                        return (0, p.isWellBehavedNumber)(a[0]) && (0, p.isWellBehavedNumber)(a[1])
                          ? [Math.min(e[0], a[0]), Math.max(e[1], a[1])]
                          : e;
                      },
                      [1 / 0, -1 / 0],
                    );
                  return [Math.min(l[0], n[0]), Math.max(l[1], n[1])];
                },
                [1 / 0, -1 / 0],
              ))[0] ===
              1 / 0
                ? 0
                : n[0],
              n[1] === -1 / 0 ? 0 : n[1],
            ];
          }
        },
        'getNormalizedStackId',
        0,
        function (e) {
          return null == e ? void 0 : String(e);
        },
        'getStackedData',
        0,
        (e, t, r) => {
          var n,
            i = null != (n = m[r]) ? n : l.stackOffsetNone,
            o = (0, a.stack)()
              .keys(t)
              .value((e, t) => Number(y(e, t, 0)))
              .order(s.stackOrderNone)
              .offset(i)(e);
          return (
            o.forEach((r, n) => {
              r.forEach((r, i) => {
                var a = y(e[i], t[n], 0);
                Array.isArray(a) &&
                  2 === a.length &&
                  (0, f.isNumber)(a[0]) &&
                  (0, f.isNumber)(a[1]) &&
                  ((r[0] = a[0]), (r[1] = a[1]));
              });
            }),
            o
          );
        },
        'getTicksOfAxis',
        0,
        (e, t, r) => {
          if (!e) return null;
          var {
            duplicateDomain: n,
            type: i,
            range: a,
            scale: o,
            realScaleType: l,
            isCategorical: u,
            categoricalDomain: c,
            tickCount: s,
            ticks: d,
            niceTicks: h,
            axisType: v,
          } = e;
          if (!o) return null;
          var y = 'scaleBand' === l && o.bandwidth ? o.bandwidth() / 2 : 2,
            g = (t || r) && 'category' === i && o.bandwidth ? o.bandwidth() / y : 0;
          return ((g =
            'angleAxis' === v && a && a.length >= 2 ? 2 * (0, f.mathSign)(a[0] - a[1]) * g : g),
          t && (d || h))
            ? (d || h || [])
                .map((e, t) => {
                  var r = n ? n.indexOf(e) : e,
                    i = o.map(r);
                  return (0, p.isWellBehavedNumber)(i)
                    ? { coordinate: i + g, value: e, offset: g, index: t }
                    : null;
                })
                .filter(f.isNotNil)
            : u && c
              ? c
                  .map((e, t) => {
                    var r = o.map(e);
                    return (0, p.isWellBehavedNumber)(r)
                      ? { coordinate: r + g, value: e, index: t, offset: g }
                      : null;
                  })
                  .filter(f.isNotNil)
              : o.ticks && !r && null != s
                ? o
                    .ticks(s)
                    .map((e, t) => {
                      var r = o.map(e);
                      return (0, p.isWellBehavedNumber)(r)
                        ? { coordinate: r + g, value: e, index: t, offset: g }
                        : null;
                    })
                    .filter(f.isNotNil)
                : o
                    .domain()
                    .map((e, t) => {
                      var r = o.map(e);
                      return (0, p.isWellBehavedNumber)(r)
                        ? { coordinate: r + g, value: n ? n[e] : e, index: t, offset: g }
                        : null;
                    })
                    .filter(f.isNotNil);
        },
        'getTooltipEntry',
        0,
        function (e) {
          var { tooltipEntrySettings: t, dataKey: r, payload: n, value: i, name: a } = e;
          return v(v({}, t), {}, { dataKey: r, payload: n, value: i, name: a });
        },
        'getTooltipNameProp',
        0,
        function (e, t) {
          return e ? String(e) : 'string' == typeof t ? t : void 0;
        },
        'getValueByDataKey',
        0,
        y,
        'isCategoricalAxis',
        0,
        (e, t) =>
          ('horizontal' === e && 'xAxis' === t) ||
          ('vertical' === e && 'yAxis' === t) ||
          ('centric' === e && 'angleAxis' === t) ||
          ('radial' === e && 'radiusAxis' === t),
        'truncateByDomain',
        0,
        (e, t) => {
          if (!t || 2 !== t.length || !(0, f.isNumber)(t[0]) || !(0, f.isNumber)(t[1])) return e;
          var r = Math.min(t[0], t[1]),
            n = Math.max(t[0], t[1]),
            i = [e[0], e[1]];
          return (
            (!(0, f.isNumber)(e[0]) || e[0] < r) && (i[0] = r),
            (!(0, f.isNumber)(e[1]) || e[1] > n) && (i[1] = n),
            i[0] > n && (i[0] = n),
            i[1] < r && (i[1] = r),
            i
          );
        },
      ],
      41469,
    );
    var b = (e) => e.layout.width,
      x = (e) => e.layout.height,
      w = (e) => e.layout.margin;
    e.s(
      [
        'selectChartHeight',
        0,
        x,
        'selectChartWidth',
        0,
        b,
        'selectContainerScale',
        0,
        (e) => e.layout.scale,
        'selectMargin',
        0,
        w,
      ],
      4988,
    );
    var O = (0, t.createSelector)(
        (e) => e.cartesianAxis.xAxis,
        (e) => Object.values(e),
      ),
      S = (0, t.createSelector)(
        (e) => e.cartesianAxis.yAxis,
        (e) => Object.values(e),
      );
    function A(e, t) {
      var r = Object.keys(e);
      if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(e);
        (t &&
          (n = n.filter(function (t) {
            return Object.getOwnPropertyDescriptor(e, t).enumerable;
          })),
          r.push.apply(r, n));
      }
      return r;
    }
    function P(e) {
      for (var t = 1; t < arguments.length; t++) {
        var r = null != arguments[t] ? arguments[t] : {};
        t % 2
          ? A(Object(r), !0).forEach(function (t) {
              var n, i, a;
              ((n = e),
                (i = t),
                (a = r[t]),
                (i = (function (e) {
                  var t = (function (e, t) {
                    if ('object' != typeof e || !e) return e;
                    var r = e[Symbol.toPrimitive];
                    if (void 0 !== r) {
                      var n = r.call(e, t || 'default');
                      if ('object' != typeof n) return n;
                      throw TypeError('@@toPrimitive must return a primitive value.');
                    }
                    return ('string' === t ? String : Number)(e);
                  })(e, 'string');
                  return 'symbol' == typeof t ? t : t + '';
                })(i)) in n
                  ? Object.defineProperty(n, i, {
                      value: a,
                      enumerable: !0,
                      configurable: !0,
                      writable: !0,
                    })
                  : (n[i] = a));
            })
          : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
            : A(Object(r)).forEach(function (t) {
                Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t));
              });
      }
      return e;
    }
    (e.s(['selectAllXAxes', 0, O, 'selectAllYAxes', 0, S], 96299),
      e.s(
        [
          'DATA_ITEM_GRAPHICAL_ITEM_ID_ATTRIBUTE_NAME',
          0,
          'data-recharts-item-id',
          'DATA_ITEM_INDEX_ATTRIBUTE_NAME',
          0,
          'data-recharts-item-index',
          'DEFAULT_Y_AXIS_WIDTH',
          0,
          60,
        ],
        66850,
      ));
    var _ = (0, t.createSelector)(
        [
          b,
          x,
          w,
          (e) => e.brush.height,
          function (e) {
            return S(e).reduce(
              (e, t) =>
                'left' !== t.orientation || t.mirror || t.hide
                  ? e
                  : e + ('number' == typeof t.width ? t.width : 60),
              0,
            );
          },
          function (e) {
            return S(e).reduce(
              (e, t) =>
                'right' !== t.orientation || t.mirror || t.hide
                  ? e
                  : e + ('number' == typeof t.width ? t.width : 60),
              0,
            );
          },
          function (e) {
            return O(e).reduce(
              (e, t) => ('top' !== t.orientation || t.mirror || t.hide ? e : e + t.height),
              0,
            );
          },
          function (e) {
            return O(e).reduce(
              (e, t) => ('bottom' !== t.orientation || t.mirror || t.hide ? e : e + t.height),
              0,
            );
          },
          r.selectLegendSettings,
          r.selectLegendSize,
        ],
        (e, t, r, n, i, a, o, l, u, c) => {
          var s = { left: (r.left || 0) + i, right: (r.right || 0) + a },
            f = P(P({}, { top: (r.top || 0) + o, bottom: (r.bottom || 0) + l }), s),
            d = f.bottom;
          f.bottom += n;
          var p = e - (f = g(f, u, c)).left - f.right,
            h = t - f.top - f.bottom;
          return P(P({ brushBottom: d }, f), {}, { width: Math.max(p, 0), height: Math.max(h, 0) });
        },
      ),
      E = (0, t.createSelector)(_, (e) => ({
        x: e.left,
        y: e.top,
        width: e.width,
        height: e.height,
      })),
      j = (0, t.createSelector)(b, x, (e, t) => ({ x: 0, y: 0, width: e, height: t }));
    e.s(
      ['selectAxisViewBox', 0, j, 'selectChartOffsetInternal', 0, _, 'selectChartViewBox', 0, E],
      57024,
    );
    var C = e.i(61129),
      M = (0, C.createContext)(null);
    e.s(['useIsPanorama', 0, () => null != (0, C.useContext)(M)], 57632);
    var k = (e) => e.brush,
      T = (0, t.createSelector)([k, _, w], (e, t, r) => ({
        height: e.height,
        x: (0, f.isNumber)(e.x) ? e.x : t.left,
        y: (0, f.isNumber)(e.y)
          ? e.y
          : t.top + t.height + t.brushBottom - ((null == r ? void 0 : r.bottom) || 0),
        width: (0, f.isNumber)(e.width) ? e.width : t.width,
      }));
    e.s(['selectBrushDimensions', 0, T, 'selectBrushSettings', 0, k], 61472);
  },
  57561,
  (e, t, r) => {
    'use strict';
    Object.defineProperty(r, Symbol.toStringTag, { value: 'Module' });
    let n = e.r(6817);
    r.toNumber = function (e) {
      return n.isSymbol(e) ? NaN : Number(e);
    };
  },
  52286,
  (e, t, r) => {
    'use strict';
    Object.defineProperty(r, Symbol.toStringTag, { value: 'Module' });
    let n = e.r(57561);
    r.toFinite = function (e) {
      return e
        ? (e = n.toNumber(e)) === 1 / 0 || e === -1 / 0
          ? (e < 0 ? -1 : 1) * Number.MAX_VALUE
          : e == e
            ? e
            : 0
        : 0 === e
          ? e
          : 0;
    };
  },
  84813,
  (e, t, r) => {
    'use strict';
    Object.defineProperty(r, Symbol.toStringTag, { value: 'Module' });
    let n = e.r(47051),
      i = e.r(52286);
    r.range = function (e, t, r) {
      (r && 'number' != typeof r && n.isIterateeCall(e, t, r) && (t = r = void 0),
        (e = i.toFinite(e)),
        void 0 === t ? ((t = e), (e = 0)) : (t = i.toFinite(t)),
        (r = void 0 === r ? (e < t ? 1 : -1) : i.toFinite(r)));
      let a = Math.max(Math.ceil((t - e) / (r || 1)), 0),
        o = Array(a);
      for (let t = 0; t < a; t++) ((o[t] = e), (e += r));
      return o;
    };
  },
  69981,
  (e, t, r) => {
    t.exports = e.r(84813).range;
  },
  13958,
  (e, t, r) => {
    !(function (r) {
      'use strict';
      var n,
        i = {
          precision: 20,
          rounding: 4,
          toExpNeg: -7,
          toExpPos: 21,
          LN10: '2.302585092994045684017991454684364207601101488628772976033327900967572609677352480235997205089598298341967784042286',
        },
        a = !0,
        o = '[DecimalError] ',
        l = o + 'Invalid argument: ',
        u = o + 'Exponent out of range: ',
        c = Math.floor,
        s = Math.pow,
        f = /^(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i,
        d = c(1286742750677284.5),
        p = {};
      function h(e, t) {
        var r,
          n,
          i,
          o,
          l,
          u,
          c,
          s,
          f = e.constructor,
          d = f.precision;
        if (!e.s || !t.s) return (t.s || (t = new f(e)), a ? A(t, d) : t);
        if (((c = e.d), (s = t.d), (l = e.e), (i = t.e), (c = c.slice()), (o = l - i))) {
          for (
            o < 0 ? ((n = c), (o = -o), (u = s.length)) : ((n = s), (i = l), (u = c.length)),
              o > (u = (l = Math.ceil(d / 7)) > u ? l + 1 : u + 1) && ((o = u), (n.length = 1)),
              n.reverse();
            o--;
          )
            n.push(0);
          n.reverse();
        }
        for (
          (u = c.length) - (o = s.length) < 0 && ((o = u), (n = s), (s = c), (c = n)), r = 0;
          o;
        )
          ((r = ((c[--o] = c[o] + s[o] + r) / 1e7) | 0), (c[o] %= 1e7));
        for (r && (c.unshift(r), ++i), u = c.length; 0 == c[--u]; ) c.pop();
        return ((t.d = c), (t.e = i), a ? A(t, d) : t);
      }
      function v(e, t, r) {
        if (e !== ~~e || e < t || e > r) throw Error(l + e);
      }
      function y(e) {
        var t,
          r,
          n,
          i = e.length - 1,
          a = '',
          o = e[0];
        if (i > 0) {
          for (a += o, t = 1; t < i; t++)
            ((r = 7 - (n = e[t] + '').length) && (a += w(r)), (a += n));
          (r = 7 - (n = (o = e[t]) + '').length) && (a += w(r));
        } else if (0 === o) return '0';
        for (; o % 10 == 0; ) o /= 10;
        return a + o;
      }
      ((p.absoluteValue = p.abs =
        function () {
          var e = new this.constructor(this);
          return (e.s && (e.s = 1), e);
        }),
        (p.comparedTo = p.cmp =
          function (e) {
            var t, r, n, i;
            if (((e = new this.constructor(e)), this.s !== e.s)) return this.s || -e.s;
            if (this.e !== e.e) return (this.e > e.e) ^ (this.s < 0) ? 1 : -1;
            for (t = 0, r = (n = this.d.length) < (i = e.d.length) ? n : i; t < r; ++t)
              if (this.d[t] !== e.d[t]) return (this.d[t] > e.d[t]) ^ (this.s < 0) ? 1 : -1;
            return n === i ? 0 : (n > i) ^ (this.s < 0) ? 1 : -1;
          }),
        (p.decimalPlaces = p.dp =
          function () {
            var e = this.d.length - 1,
              t = (e - this.e) * 7;
            if ((e = this.d[e])) for (; e % 10 == 0; e /= 10) t--;
            return t < 0 ? 0 : t;
          }),
        (p.dividedBy = p.div =
          function (e) {
            return g(this, new this.constructor(e));
          }),
        (p.dividedToIntegerBy = p.idiv =
          function (e) {
            var t = this.constructor;
            return A(g(this, new t(e), 0, 1), t.precision);
          }),
        (p.equals = p.eq =
          function (e) {
            return !this.cmp(e);
          }),
        (p.exponent = function () {
          return b(this);
        }),
        (p.greaterThan = p.gt =
          function (e) {
            return this.cmp(e) > 0;
          }),
        (p.greaterThanOrEqualTo = p.gte =
          function (e) {
            return this.cmp(e) >= 0;
          }),
        (p.isInteger = p.isint =
          function () {
            return this.e > this.d.length - 2;
          }),
        (p.isNegative = p.isneg =
          function () {
            return this.s < 0;
          }),
        (p.isPositive = p.ispos =
          function () {
            return this.s > 0;
          }),
        (p.isZero = function () {
          return 0 === this.s;
        }),
        (p.lessThan = p.lt =
          function (e) {
            return 0 > this.cmp(e);
          }),
        (p.lessThanOrEqualTo = p.lte =
          function (e) {
            return 1 > this.cmp(e);
          }),
        (p.logarithm = p.log =
          function (e) {
            var t,
              r = this.constructor,
              i = r.precision,
              l = i + 5;
            if (void 0 === e) e = new r(10);
            else if ((e = new r(e)).s < 1 || e.eq(n)) throw Error(o + 'NaN');
            if (this.s < 1) throw Error(o + (this.s ? 'NaN' : '-Infinity'));
            return this.eq(n)
              ? new r(0)
              : ((a = !1), (t = g(O(this, l), O(e, l), l)), (a = !0), A(t, i));
          }),
        (p.minus = p.sub =
          function (e) {
            return (
              (e = new this.constructor(e)),
              this.s == e.s ? P(this, e) : h(this, ((e.s = -e.s), e))
            );
          }),
        (p.modulo = p.mod =
          function (e) {
            var t,
              r = this.constructor,
              n = r.precision;
            if (!(e = new r(e)).s) throw Error(o + 'NaN');
            return this.s
              ? ((a = !1), (t = g(this, e, 0, 1).times(e)), (a = !0), this.minus(t))
              : A(new r(this), n);
          }),
        (p.naturalExponential = p.exp =
          function () {
            return m(this);
          }),
        (p.naturalLogarithm = p.ln =
          function () {
            return O(this);
          }),
        (p.negated = p.neg =
          function () {
            var e = new this.constructor(this);
            return ((e.s = -e.s || 0), e);
          }),
        (p.plus = p.add =
          function (e) {
            return (
              (e = new this.constructor(e)),
              this.s == e.s ? h(this, e) : P(this, ((e.s = -e.s), e))
            );
          }),
        (p.precision = p.sd =
          function (e) {
            var t, r, n;
            if (void 0 !== e && !!e !== e && 1 !== e && 0 !== e) throw Error(l + e);
            if (((t = b(this) + 1), (r = 7 * (n = this.d.length - 1) + 1), (n = this.d[n]))) {
              for (; n % 10 == 0; n /= 10) r--;
              for (n = this.d[0]; n >= 10; n /= 10) r++;
            }
            return e && t > r ? t : r;
          }),
        (p.squareRoot = p.sqrt =
          function () {
            var e,
              t,
              r,
              n,
              i,
              l,
              u,
              s = this.constructor;
            if (this.s < 1) {
              if (!this.s) return new s(0);
              throw Error(o + 'NaN');
            }
            for (
              e = b(this),
                a = !1,
                0 == (i = Math.sqrt(+this)) || i == 1 / 0
                  ? (((t = y(this.d)).length + e) % 2 == 0 && (t += '0'),
                    (i = Math.sqrt(t)),
                    (e = c((e + 1) / 2) - (e < 0 || e % 2)),
                    (n = new s(
                      (t =
                        i == 1 / 0
                          ? '5e' + e
                          : (t = i.toExponential()).slice(0, t.indexOf('e') + 1) + e),
                    )))
                  : (n = new s(i.toString())),
                i = u = (r = s.precision) + 3;
              ;
            )
              if (
                ((n = (l = n).plus(g(this, l, u + 2)).times(0.5)),
                y(l.d).slice(0, u) === (t = y(n.d)).slice(0, u))
              ) {
                if (((t = t.slice(u - 3, u + 1)), i == u && '4999' == t)) {
                  if ((A(l, r + 1, 0), l.times(l).eq(this))) {
                    n = l;
                    break;
                  }
                } else if ('9999' != t) break;
                u += 4;
              }
            return ((a = !0), A(n, r));
          }),
        (p.times = p.mul =
          function (e) {
            var t,
              r,
              n,
              i,
              o,
              l,
              u,
              c,
              s,
              f = this.constructor,
              d = this.d,
              p = (e = new f(e)).d;
            if (!this.s || !e.s) return new f(0);
            for (
              e.s *= this.s,
                r = this.e + e.e,
                (c = d.length) < (s = p.length) &&
                  ((o = d), (d = p), (p = o), (l = c), (c = s), (s = l)),
                o = [],
                n = l = c + s;
              n--;
            )
              o.push(0);
            for (n = s; --n >= 0; ) {
              for (t = 0, i = c + n; i > n; )
                ((u = o[i] + p[n] * d[i - n - 1] + t),
                  (o[i--] = (u % 1e7) | 0),
                  (t = (u / 1e7) | 0));
              o[i] = ((o[i] + t) % 1e7) | 0;
            }
            for (; !o[--l]; ) o.pop();
            return (t ? ++r : o.shift(), (e.d = o), (e.e = r), a ? A(e, f.precision) : e);
          }),
        (p.toDecimalPlaces = p.todp =
          function (e, t) {
            var r = this,
              n = r.constructor;
            return ((r = new n(r)), void 0 === e)
              ? r
              : (v(e, 0, 1e9), void 0 === t ? (t = n.rounding) : v(t, 0, 8), A(r, e + b(r) + 1, t));
          }),
        (p.toExponential = function (e, t) {
          var r,
            n = this,
            i = n.constructor;
          return (
            void 0 === e
              ? (r = _(n, !0))
              : (v(e, 0, 1e9),
                void 0 === t ? (t = i.rounding) : v(t, 0, 8),
                (r = _((n = A(new i(n), e + 1, t)), !0, e + 1))),
            r
          );
        }),
        (p.toFixed = function (e, t) {
          var r,
            n,
            i = this.constructor;
          return void 0 === e
            ? _(this)
            : (v(e, 0, 1e9),
              void 0 === t ? (t = i.rounding) : v(t, 0, 8),
              (r = _((n = A(new i(this), e + b(this) + 1, t)).abs(), !1, e + b(n) + 1)),
              this.isneg() && !this.isZero() ? '-' + r : r);
        }),
        (p.toInteger = p.toint =
          function () {
            var e = this.constructor;
            return A(new e(this), b(this) + 1, e.rounding);
          }),
        (p.toNumber = function () {
          return +this;
        }),
        (p.toPower = p.pow =
          function (e) {
            var t,
              r,
              i,
              l,
              u,
              s,
              f = this,
              d = f.constructor,
              p = +(e = new d(e));
            if (!e.s) return new d(n);
            if (!(f = new d(f)).s) {
              if (e.s < 1) throw Error(o + 'Infinity');
              return f;
            }
            if (f.eq(n)) return f;
            if (((i = d.precision), e.eq(n))) return A(f, i);
            if (((s = (t = e.e) >= (r = e.d.length - 1)), (u = f.s), s)) {
              if ((r = p < 0 ? -p : p) <= 0x1fffffffffffff) {
                for (
                  l = new d(n), t = Math.ceil(i / 7 + 4), a = !1;
                  r % 2 && E((l = l.times(f)).d, t), 0 !== (r = c(r / 2));
                )
                  E((f = f.times(f)).d, t);
                return ((a = !0), e.s < 0 ? new d(n).div(l) : A(l, i));
              }
            } else if (u < 0) throw Error(o + 'NaN');
            return (
              (u = u < 0 && 1 & e.d[Math.max(t, r)] ? -1 : 1),
              (f.s = 1),
              (a = !1),
              (l = e.times(O(f, i + 12))),
              (a = !0),
              ((l = m(l)).s = u),
              l
            );
          }),
        (p.toPrecision = function (e, t) {
          var r,
            n,
            i = this,
            a = i.constructor;
          return (
            void 0 === e
              ? ((r = b(i)), (n = _(i, r <= a.toExpNeg || r >= a.toExpPos)))
              : (v(e, 1, 1e9),
                void 0 === t ? (t = a.rounding) : v(t, 0, 8),
                (r = b((i = A(new a(i), e, t)))),
                (n = _(i, e <= r || r <= a.toExpNeg, e))),
            n
          );
        }),
        (p.toSignificantDigits = p.tosd =
          function (e, t) {
            var r = this.constructor;
            return (
              void 0 === e
                ? ((e = r.precision), (t = r.rounding))
                : (v(e, 1, 1e9), void 0 === t ? (t = r.rounding) : v(t, 0, 8)),
              A(new r(this), e, t)
            );
          }),
        (p.toString =
          p.valueOf =
          p.val =
          p.toJSON =
            function () {
              var e = b(this),
                t = this.constructor;
              return _(this, e <= t.toExpNeg || e >= t.toExpPos);
            }));
      var g = (function () {
        function e(e, t) {
          var r,
            n = 0,
            i = e.length;
          for (e = e.slice(); i--; )
            ((r = e[i] * t + n), (e[i] = (r % 1e7) | 0), (n = (r / 1e7) | 0));
          return (n && e.unshift(n), e);
        }
        function t(e, t, r, n) {
          var i, a;
          if (r != n) a = r > n ? 1 : -1;
          else
            for (i = a = 0; i < r; i++)
              if (e[i] != t[i]) {
                a = e[i] > t[i] ? 1 : -1;
                break;
              }
          return a;
        }
        function r(e, t, r) {
          for (var n = 0; r--; )
            ((e[r] -= n), (n = +(e[r] < t[r])), (e[r] = 1e7 * n + e[r] - t[r]));
          for (; !e[0] && e.length > 1; ) e.shift();
        }
        return function (n, i, a, l) {
          var u,
            c,
            s,
            f,
            d,
            p,
            h,
            v,
            y,
            g,
            m,
            x,
            w,
            O,
            S,
            P,
            _,
            E,
            j = n.constructor,
            C = n.s == i.s ? 1 : -1,
            M = n.d,
            k = i.d;
          if (!n.s) return new j(n);
          if (!i.s) throw Error(o + 'Division by zero');
          for (
            s = 0, c = n.e - i.e, _ = k.length, S = M.length, v = (h = new j(C)).d = [];
            k[s] == (M[s] || 0);
          )
            ++s;
          if (
            (k[s] > (M[s] || 0) && --c,
            (x = null == a ? (a = j.precision) : l ? a + (b(n) - b(i)) + 1 : a) < 0)
          )
            return new j(0);
          if (((x = (x / 7 + 2) | 0), (s = 0), 1 == _))
            for (f = 0, k = k[0], x++; (s < S || f) && x--; s++)
              ((w = 1e7 * f + (M[s] || 0)), (v[s] = (w / k) | 0), (f = (w % k) | 0));
          else {
            for (
              (f = (1e7 / (k[0] + 1)) | 0) > 1 &&
                ((k = e(k, f)), (M = e(M, f)), (_ = k.length), (S = M.length)),
                O = _,
                g = (y = M.slice(0, _)).length;
              g < _;
            )
              y[g++] = 0;
            ((E = k.slice()).unshift(0), (P = k[0]), k[1] >= 1e7 / 2 && ++P);
            do
              ((f = 0),
                (u = t(k, y, _, g)) < 0
                  ? ((m = y[0]),
                    _ != g && (m = 1e7 * m + (y[1] || 0)),
                    (f = (m / P) | 0) > 1
                      ? (f >= 1e7 && (f = 1e7 - 1),
                        (p = (d = e(k, f)).length),
                        (g = y.length),
                        1 == (u = t(d, y, p, g)) && (f--, r(d, _ < p ? E : k, p)))
                      : (0 == f && (u = f = 1), (d = k.slice())),
                    (p = d.length) < g && d.unshift(0),
                    r(y, d, g),
                    -1 == u &&
                      ((g = y.length), (u = t(k, y, _, g)) < 1 && (f++, r(y, _ < g ? E : k, g))),
                    (g = y.length))
                  : 0 === u && (f++, (y = [0])),
                (v[s++] = f),
                u && y[0] ? (y[g++] = M[O] || 0) : ((y = [M[O]]), (g = 1)));
            while ((O++ < S || void 0 !== y[0]) && x--);
          }
          return (v[0] || v.shift(), (h.e = c), A(h, l ? a + b(h) + 1 : a));
        };
      })();
      function m(e, t) {
        var r,
          i,
          o,
          l,
          c,
          f = 0,
          d = 0,
          p = e.constructor,
          h = p.precision;
        if (b(e) > 16) throw Error(u + b(e));
        if (!e.s) return new p(n);
        for (null == t ? ((a = !1), (c = h)) : (c = t), l = new p(0.03125); e.abs().gte(0.1); )
          ((e = e.times(l)), (d += 5));
        for (
          c += ((Math.log(s(2, d)) / Math.LN10) * 2 + 5) | 0, r = i = o = new p(n), p.precision = c;
          ;
        ) {
          if (
            ((i = A(i.times(e), c)),
            (r = r.times(++f)),
            y((l = o.plus(g(i, r, c))).d).slice(0, c) === y(o.d).slice(0, c))
          ) {
            for (; d--; ) o = A(o.times(o), c);
            return ((p.precision = h), null == t ? ((a = !0), A(o, h)) : o);
          }
          o = l;
        }
      }
      function b(e) {
        for (var t = 7 * e.e, r = e.d[0]; r >= 10; r /= 10) t++;
        return t;
      }
      function x(e, t, r) {
        if (t > e.LN10.sd())
          throw ((a = !0), r && (e.precision = r), Error(o + 'LN10 precision limit exceeded'));
        return A(new e(e.LN10), t);
      }
      function w(e) {
        for (var t = ''; e--; ) t += '0';
        return t;
      }
      function O(e, t) {
        var r,
          i,
          l,
          u,
          c,
          s,
          f,
          d,
          p,
          h = 1,
          v = e,
          m = v.d,
          w = v.constructor,
          S = w.precision;
        if (v.s < 1) throw Error(o + (v.s ? 'NaN' : '-Infinity'));
        if (v.eq(n)) return new w(0);
        if ((null == t ? ((a = !1), (d = S)) : (d = t), v.eq(10)))
          return (null == t && (a = !0), x(w, d));
        if (((w.precision = d += 10), (i = (r = y(m)).charAt(0)), !(15e14 > Math.abs((u = b(v))))))
          return (
            (f = x(w, d + 2, S).times(u + '')),
            (v = O(new w(i + '.' + r.slice(1)), d - 10).plus(f)),
            (w.precision = S),
            null == t ? ((a = !0), A(v, S)) : v
          );
        for (; (i < 7 && 1 != i) || (1 == i && r.charAt(1) > 3); )
          ((i = (r = y((v = v.times(e)).d)).charAt(0)), h++);
        for (
          u = b(v),
            i > 1 ? ((v = new w('0.' + r)), u++) : (v = new w(i + '.' + r.slice(1))),
            s = c = v = g(v.minus(n), v.plus(n), d),
            p = A(v.times(v), d),
            l = 3;
          ;
        ) {
          if (
            ((c = A(c.times(p), d)),
            y((f = s.plus(g(c, new w(l), d))).d).slice(0, d) === y(s.d).slice(0, d))
          )
            return (
              (s = s.times(2)),
              0 !== u && (s = s.plus(x(w, d + 2, S).times(u + ''))),
              (s = g(s, new w(h), d)),
              (w.precision = S),
              null == t ? ((a = !0), A(s, S)) : s
            );
          ((s = f), (l += 2));
        }
      }
      function S(e, t) {
        var r, n, i;
        for (
          (r = t.indexOf('.')) > -1 && (t = t.replace('.', '')),
            (n = t.search(/e/i)) > 0
              ? (r < 0 && (r = n), (r += +t.slice(n + 1)), (t = t.substring(0, n)))
              : r < 0 && (r = t.length),
            n = 0;
          48 === t.charCodeAt(n);
        )
          ++n;
        for (i = t.length; 48 === t.charCodeAt(i - 1); ) --i;
        if ((t = t.slice(n, i))) {
          if (
            ((i -= n),
            (e.e = c((r = r - n - 1) / 7)),
            (e.d = []),
            (n = (r + 1) % 7),
            r < 0 && (n += 7),
            n < i)
          ) {
            for (n && e.d.push(+t.slice(0, n)), i -= 7; n < i; ) e.d.push(+t.slice(n, (n += 7)));
            n = 7 - (t = t.slice(n)).length;
          } else n -= i;
          for (; n--; ) t += '0';
          if ((e.d.push(+t), a && (e.e > d || e.e < -d))) throw Error(u + r);
        } else ((e.s = 0), (e.e = 0), (e.d = [0]));
        return e;
      }
      function A(e, t, r) {
        var n,
          i,
          o,
          l,
          f,
          p,
          h,
          v,
          y = e.d;
        for (l = 1, o = y[0]; o >= 10; o /= 10) l++;
        if ((n = t - l) < 0) ((n += 7), (i = t), (h = y[(v = 0)]));
        else {
          if ((v = Math.ceil((n + 1) / 7)) >= (o = y.length)) return e;
          for (l = 1, h = o = y[v]; o >= 10; o /= 10) l++;
          ((n %= 7), (i = n - 7 + l));
        }
        if (
          (void 0 !== r &&
            ((f = ((h / (o = s(10, l - i - 1))) % 10) | 0),
            (p = t < 0 || void 0 !== y[v + 1] || h % o),
            (p =
              r < 4
                ? (f || p) && (0 == r || r == (e.s < 0 ? 3 : 2))
                : f > 5 ||
                  (5 == f &&
                    (4 == r ||
                      p ||
                      (6 == r && ((n > 0 ? (i > 0 ? h / s(10, l - i) : 0) : y[v - 1]) % 10) & 1) ||
                      r == (e.s < 0 ? 8 : 7))))),
          t < 1 || !y[0])
        )
          return (
            p
              ? ((o = b(e)),
                (y.length = 1),
                (t = t - o - 1),
                (y[0] = s(10, (7 - (t % 7)) % 7)),
                (e.e = c(-t / 7) || 0))
              : ((y.length = 1), (y[0] = e.e = e.s = 0)),
            e
          );
        if (
          (0 == n
            ? ((y.length = v), (o = 1), v--)
            : ((y.length = v + 1),
              (o = s(10, 7 - n)),
              (y[v] = i > 0 ? (((h / s(10, l - i)) % s(10, i)) | 0) * o : 0)),
          p)
        )
          for (;;)
            if (0 == v) {
              1e7 == (y[0] += o) && ((y[0] = 1), ++e.e);
              break;
            } else {
              if (((y[v] += o), 1e7 != y[v])) break;
              ((y[v--] = 0), (o = 1));
            }
        for (n = y.length; 0 === y[--n]; ) y.pop();
        if (a && (e.e > d || e.e < -d)) throw Error(u + b(e));
        return e;
      }
      function P(e, t) {
        var r,
          n,
          i,
          o,
          l,
          u,
          c,
          s,
          f,
          d,
          p = e.constructor,
          h = p.precision;
        if (!e.s || !t.s) return (t.s ? (t.s = -t.s) : (t = new p(e)), a ? A(t, h) : t);
        if (((c = e.d), (d = t.d), (n = t.e), (s = e.e), (c = c.slice()), (l = s - n))) {
          for (
            (f = l < 0) ? ((r = c), (l = -l), (u = d.length)) : ((r = d), (n = s), (u = c.length)),
              l > (i = Math.max(Math.ceil(h / 7), u) + 2) && ((l = i), (r.length = 1)),
              r.reverse(),
              i = l;
            i--;
          )
            r.push(0);
          r.reverse();
        } else {
          for ((f = (i = c.length) < (u = d.length)) && (u = i), i = 0; i < u; i++)
            if (c[i] != d[i]) {
              f = c[i] < d[i];
              break;
            }
          l = 0;
        }
        for (
          f && ((r = c), (c = d), (d = r), (t.s = -t.s)), u = c.length, i = d.length - u;
          i > 0;
          --i
        )
          c[u++] = 0;
        for (i = d.length; i > l; ) {
          if (c[--i] < d[i]) {
            for (o = i; o && 0 === c[--o]; ) c[o] = 1e7 - 1;
            (--c[o], (c[i] += 1e7));
          }
          c[i] -= d[i];
        }
        for (; 0 === c[--u]; ) c.pop();
        for (; 0 === c[0]; c.shift()) --n;
        return c[0] ? ((t.d = c), (t.e = n), a ? A(t, h) : t) : new p(0);
      }
      function _(e, t, r) {
        var n,
          i = b(e),
          a = y(e.d),
          o = a.length;
        return (
          t
            ? (r && (n = r - o) > 0
                ? (a = a.charAt(0) + '.' + a.slice(1) + w(n))
                : o > 1 && (a = a.charAt(0) + '.' + a.slice(1)),
              (a = a + (i < 0 ? 'e' : 'e+') + i))
            : i < 0
              ? ((a = '0.' + w(-i - 1) + a), r && (n = r - o) > 0 && (a += w(n)))
              : i >= o
                ? ((a += w(i + 1 - o)), r && (n = r - i - 1) > 0 && (a = a + '.' + w(n)))
                : ((n = i + 1) < o && (a = a.slice(0, n) + '.' + a.slice(n)),
                  r && (n = r - o) > 0 && (i + 1 === o && (a += '.'), (a += w(n)))),
          e.s < 0 ? '-' + a : a
        );
      }
      function E(e, t) {
        if (e.length > t) return ((e.length = t), !0);
      }
      function j(e) {
        if (!e || 'object' != typeof e) throw Error(o + 'Object expected');
        var t,
          r,
          n,
          i = ['precision', 1, 1e9, 'rounding', 0, 8, 'toExpNeg', -1 / 0, 0, 'toExpPos', 0, 1 / 0];
        for (t = 0; t < i.length; t += 3)
          if (void 0 !== (n = e[(r = i[t])]))
            if (c(n) === n && n >= i[t + 1] && n <= i[t + 2]) this[r] = n;
            else throw Error(l + r + ': ' + n);
        if (void 0 !== (n = e[(r = 'LN10')]))
          if (n == Math.LN10) this[r] = new this(n);
          else throw Error(l + r + ': ' + n);
        return this;
      }
      if (
        (((i = (function e(t) {
          var r, n, i;
          function a(e) {
            if (!(this instanceof a)) return new a(e);
            if (((this.constructor = a), e instanceof a)) {
              ((this.s = e.s), (this.e = e.e), (this.d = (e = e.d) ? e.slice() : e));
              return;
            }
            if ('number' == typeof e) {
              if (0 * e != 0) throw Error(l + e);
              if (e > 0) this.s = 1;
              else if (e < 0) ((e = -e), (this.s = -1));
              else {
                ((this.s = 0), (this.e = 0), (this.d = [0]));
                return;
              }
              if (e === ~~e && e < 1e7) {
                ((this.e = 0), (this.d = [e]));
                return;
              }
              return S(this, e.toString());
            }
            if ('string' != typeof e) throw Error(l + e);
            if (
              (45 === e.charCodeAt(0) ? ((e = e.slice(1)), (this.s = -1)) : (this.s = 1), f.test(e))
            )
              S(this, e);
            else throw Error(l + e);
          }
          if (
            ((a.prototype = p),
            (a.ROUND_UP = 0),
            (a.ROUND_DOWN = 1),
            (a.ROUND_CEIL = 2),
            (a.ROUND_FLOOR = 3),
            (a.ROUND_HALF_UP = 4),
            (a.ROUND_HALF_DOWN = 5),
            (a.ROUND_HALF_EVEN = 6),
            (a.ROUND_HALF_CEIL = 7),
            (a.ROUND_HALF_FLOOR = 8),
            (a.clone = e),
            (a.config = a.set = j),
            void 0 === t && (t = {}),
            t)
          )
            for (
              r = 0, i = ['precision', 'rounding', 'toExpNeg', 'toExpPos', 'LN10'];
              r < i.length;
            )
              t.hasOwnProperty((n = i[r++])) || (t[n] = this[n]);
          return (a.config(t), a);
        })(i)).default = i.Decimal =
          i),
        (n = new i(1)),
        'function' == typeof define && define.amd)
      ) {
        let t;
        (e.r, void 0 !== (t = i) && e.v(t));
      } else
        t.exports
          ? (t.exports = i)
          : (r ||
              (r =
                'u' > typeof self && self && self.self == self ? self : Function('return this')()),
            (r.Decimal = i));
    })(e.e);
  },
  76595,
  (e, t, r) => {
    'use strict';
    var n = Object.prototype.hasOwnProperty,
      i = '~';
    function a() {}
    function o(e, t, r) {
      ((this.fn = e), (this.context = t), (this.once = r || !1));
    }
    function l(e, t, r, n, a) {
      if ('function' != typeof r) throw TypeError('The listener must be a function');
      var l = new o(r, n || e, a),
        u = i ? i + t : t;
      return (
        e._events[u]
          ? e._events[u].fn
            ? (e._events[u] = [e._events[u], l])
            : e._events[u].push(l)
          : ((e._events[u] = l), e._eventsCount++),
        e
      );
    }
    function u(e, t) {
      0 == --e._eventsCount ? (e._events = new a()) : delete e._events[t];
    }
    function c() {
      ((this._events = new a()), (this._eventsCount = 0));
    }
    (Object.create && ((a.prototype = Object.create(null)), new a().__proto__ || (i = !1)),
      (c.prototype.eventNames = function () {
        var e,
          t,
          r = [];
        if (0 === this._eventsCount) return r;
        for (t in (e = this._events)) n.call(e, t) && r.push(i ? t.slice(1) : t);
        return Object.getOwnPropertySymbols ? r.concat(Object.getOwnPropertySymbols(e)) : r;
      }),
      (c.prototype.listeners = function (e) {
        var t = i ? i + e : e,
          r = this._events[t];
        if (!r) return [];
        if (r.fn) return [r.fn];
        for (var n = 0, a = r.length, o = Array(a); n < a; n++) o[n] = r[n].fn;
        return o;
      }),
      (c.prototype.listenerCount = function (e) {
        var t = i ? i + e : e,
          r = this._events[t];
        return r ? (r.fn ? 1 : r.length) : 0;
      }),
      (c.prototype.emit = function (e, t, r, n, a, o) {
        var l = i ? i + e : e;
        if (!this._events[l]) return !1;
        var u,
          c,
          s = this._events[l],
          f = arguments.length;
        if (s.fn) {
          switch ((s.once && this.removeListener(e, s.fn, void 0, !0), f)) {
            case 1:
              return (s.fn.call(s.context), !0);
            case 2:
              return (s.fn.call(s.context, t), !0);
            case 3:
              return (s.fn.call(s.context, t, r), !0);
            case 4:
              return (s.fn.call(s.context, t, r, n), !0);
            case 5:
              return (s.fn.call(s.context, t, r, n, a), !0);
            case 6:
              return (s.fn.call(s.context, t, r, n, a, o), !0);
          }
          for (c = 1, u = Array(f - 1); c < f; c++) u[c - 1] = arguments[c];
          s.fn.apply(s.context, u);
        } else {
          var d,
            p = s.length;
          for (c = 0; c < p; c++)
            switch ((s[c].once && this.removeListener(e, s[c].fn, void 0, !0), f)) {
              case 1:
                s[c].fn.call(s[c].context);
                break;
              case 2:
                s[c].fn.call(s[c].context, t);
                break;
              case 3:
                s[c].fn.call(s[c].context, t, r);
                break;
              case 4:
                s[c].fn.call(s[c].context, t, r, n);
                break;
              default:
                if (!u) for (d = 1, u = Array(f - 1); d < f; d++) u[d - 1] = arguments[d];
                s[c].fn.apply(s[c].context, u);
            }
        }
        return !0;
      }),
      (c.prototype.on = function (e, t, r) {
        return l(this, e, t, r, !1);
      }),
      (c.prototype.once = function (e, t, r) {
        return l(this, e, t, r, !0);
      }),
      (c.prototype.removeListener = function (e, t, r, n) {
        var a = i ? i + e : e;
        if (!this._events[a]) return this;
        if (!t) return (u(this, a), this);
        var o = this._events[a];
        if (o.fn) o.fn !== t || (n && !o.once) || (r && o.context !== r) || u(this, a);
        else {
          for (var l = 0, c = [], s = o.length; l < s; l++)
            (o[l].fn !== t || (n && !o[l].once) || (r && o[l].context !== r)) && c.push(o[l]);
          c.length ? (this._events[a] = 1 === c.length ? c[0] : c) : u(this, a);
        }
        return this;
      }),
      (c.prototype.removeAllListeners = function (e) {
        var t;
        return (
          e
            ? ((t = i ? i + e : e), this._events[t] && u(this, t))
            : ((this._events = new a()), (this._eventsCount = 0)),
          this
        );
      }),
      (c.prototype.off = c.prototype.removeListener),
      (c.prototype.addListener = c.prototype.on),
      (c.prefixed = i),
      (c.EventEmitter = c),
      (t.exports = c));
  },
  26951,
  77314,
  63203,
  76108,
  13348,
  95916,
  96288,
  83300,
  11085,
  27765,
  61427,
  34565,
  56281,
  58644,
  4601,
  70192,
  92544,
  45424,
  26547,
  89179,
  94592,
  85948,
  18344,
  94191,
  61049,
  2052,
  97943,
  54947,
  75648,
  57308,
  84773,
  37195,
  75093,
  73508,
  29589,
  47432,
  80124,
  97240,
  4605,
  25650,
  34383,
  75448,
  (e) => {
    'use strict';
    var t,
      r,
      n,
      i,
      a,
      o,
      l,
      u = e.i(61129),
      c = e.i(37577),
      s = e.i(46290),
      f = e.i(26960),
      d = e.i(46116),
      p = e.i(12281),
      h = e.i(40826),
      v = e.i(45750),
      y = e.i(29576),
      g = e.i(98733),
      m = e.i(57024),
      b = e.i(4988),
      x = e.i(57632),
      w = e.i(61472),
      O = e.i(11381),
      S = e.i(25894),
      A = () => {
        var e,
          t = (0, x.useIsPanorama)(),
          r = (0, g.useAppSelector)(m.selectChartViewBox),
          n = (0, g.useAppSelector)(w.selectBrushDimensions),
          i = null == (e = (0, g.useAppSelector)(w.selectBrushSettings)) ? void 0 : e.padding;
        return t && n && i
          ? {
              width: n.width - i.left - i.right,
              height: n.height - i.top - i.bottom,
              x: i.left,
              y: i.top,
            }
          : r;
      },
      P = { top: 0, bottom: 0, left: 0, right: 0, width: 0, height: 0, brushBottom: 0 },
      _ = () => (0, g.useAppSelector)(b.selectChartWidth),
      E = () => (0, g.useAppSelector)(b.selectChartHeight),
      j = (e) => e.layout.layoutType,
      C = () => (0, g.useAppSelector)(j),
      M = (e) => {
        var t = e.layout.layoutType;
        if ('centric' === t || 'radial' === t) return t;
      },
      k = (e) => {
        var t = (0, g.useAppDispatch)(),
          r = (0, x.useIsPanorama)(),
          { width: n, height: i } = e,
          a = (0, O.useResponsiveContainerContext)(),
          o = n,
          l = i;
        return (
          a && ((o = a.width > 0 ? a.width : n), (l = a.height > 0 ? a.height : i)),
          (0, u.useEffect)(() => {
            !r &&
              (0, S.isPositiveNumber)(o) &&
              (0, S.isPositiveNumber)(l) &&
              t((0, v.setChartSize)({ width: o, height: l }));
          }, [t, r, o, l]),
          null
        );
      };
    e.s(
      [
        'ReportChartSize',
        0,
        k,
        'cartesianViewBoxToTrapezoid',
        0,
        function (e) {
          if (e)
            return {
              x: e.x,
              y: e.y,
              upperWidth: 'upperWidth' in e ? e.upperWidth : e.width,
              lowerWidth: 'lowerWidth' in e ? e.lowerWidth : e.width,
              width: e.width,
              height: e.height,
            };
        },
        'selectChartLayout',
        0,
        j,
        'selectPolarChartLayout',
        0,
        M,
        'useCartesianChartLayout',
        0,
        () => {
          var e = C();
          if ('horizontal' === e || 'vertical' === e) return e;
        },
        'useChartHeight',
        0,
        E,
        'useChartLayout',
        0,
        C,
        'useChartWidth',
        0,
        _,
        'useIsInChartContext',
        0,
        () => void 0 !== C(),
        'useMargin',
        0,
        () => (0, g.useAppSelector)((e) => e.layout.margin),
        'useOffsetInternal',
        0,
        () => {
          var e;
          return null != (e = (0, g.useAppSelector)(m.selectChartOffsetInternal)) ? e : P;
        },
        'useViewBox',
        0,
        A,
      ],
      77314,
    );
    var T = e.i(69981),
      D = e.i(41469),
      N = (e) => e.chartData,
      I = (0, y.createSelector)([N], (e) => {
        var t = null != e.chartData ? e.chartData.length - 1 : 0;
        return {
          chartData: e.chartData,
          computedData: e.computedData,
          dataEndIndex: t,
          dataStartIndex: 0,
        };
      }),
      L = (e, t, r, n) => (n ? I(e) : N(e)),
      R = (0, y.createSelector)([L], (e) => {
        var { chartData: t, dataStartIndex: r, dataEndIndex: n } = e;
        return null != t ? t.slice(r, n + 1) : [];
      }),
      B = (0, y.createSelector)([I], (e) => {
        var { chartData: t, dataStartIndex: r, dataEndIndex: n } = e;
        return null != t ? t.slice(r, n + 1) : [];
      }),
      z = (0, y.createSelector)([N], (e) => {
        var { chartData: t, dataStartIndex: r, dataEndIndex: n } = e;
        return null != t ? t.slice(r, n + 1) : [];
      });
    e.s(
      [
        'selectChartDataAndAlwaysIgnoreIndexes',
        0,
        I,
        'selectChartDataSliceIfNotInPanorama',
        0,
        R,
        'selectChartDataSliceIgnoringIndexes',
        0,
        B,
        'selectChartDataSliceWithIndexes',
        0,
        z,
        'selectChartDataWithIndexes',
        0,
        N,
        'selectChartDataWithIndexesIfNotInPanoramaPosition3',
        0,
        (e, t, r) => (r ? I(e) : N(e)),
        'selectChartDataWithIndexesIfNotInPanoramaPosition4',
        0,
        L,
      ],
      63203,
    );
    var F = e.i(49294);
    function U(e) {
      if (Array.isArray(e) && 2 === e.length) {
        var [t, r] = e;
        if ((0, S.isWellBehavedNumber)(t) && (0, S.isWellBehavedNumber)(r)) return !0;
      }
      return !1;
    }
    function W(e, t, r) {
      return r ? e : [Math.min(e[0], t[0]), Math.max(e[1], t[1])];
    }
    function $(e, t) {
      if (t && 'function' != typeof e && Array.isArray(e) && 2 === e.length) {
        var r,
          n,
          [i, a] = e;
        if ((0, S.isWellBehavedNumber)(i)) r = i;
        else if ('function' == typeof i) return;
        if ((0, S.isWellBehavedNumber)(a)) n = a;
        else if ('function' == typeof a) return;
        var o = [r, n];
        if (U(o)) return o;
      }
    }
    var V = e.i(13958);
    function K(e) {
      return 0 === e ? 1 : Math.floor(new V.default(e).abs().log(10).toNumber()) + 1;
    }
    function H(e, t, r) {
      for (var n = new V.default(e), i = 0, a = []; n.lt(t) && i < 1e5; )
        (a.push(n.toNumber()), (n = n.add(r)), i++);
      return a;
    }
    var q = (e) => {
        var [t, r] = e,
          [n, i] = [t, r];
        return (t > r && ([n, i] = [r, t]), [n, i]);
      },
      Y = (e, t, r) => {
        if (e.lte(0)) return new V.default(0);
        var n = K(e.toNumber()),
          i = new V.default(10).pow(n),
          a = e.div(i),
          o = 1 !== n ? 0.05 : 0.1,
          l = new V.default(Math.ceil(a.div(o).toNumber())).add(r).mul(o).mul(i);
        return new V.default(t ? l.toNumber() : Math.ceil(l.toNumber()));
      },
      X = (e, t, r) => {
        if (e.lte(0)) return new V.default(0);
        var n,
          i = [1, 2, 2.5, 5],
          a = e.toNumber(),
          o = Math.floor(new V.default(a).abs().log(10).toNumber()),
          l = new V.default(10).pow(o),
          u = e.div(l).toNumber(),
          c = i.findIndex((e) => e >= u - 1e-10);
        if ((-1 === c && ((l = l.mul(10)), (c = 0)), (c += r) >= i.length)) {
          var s = Math.floor(c / i.length);
          ((c %= i.length), (l = l.mul(new V.default(10).pow(s))));
        }
        var f = null != (n = i[c]) ? n : 1,
          d = new V.default(f).mul(l);
        return t ? d : new V.default(Math.ceil(d.toNumber()));
      },
      G = function (e, t, r, n) {
        var i,
          a = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : 0,
          o = arguments.length > 5 && void 0 !== arguments[5] ? arguments[5] : Y;
        if (!Number.isFinite((t - e) / (r - 1)))
          return { step: new V.default(0), tickMin: new V.default(0), tickMax: new V.default(0) };
        var l = o(new V.default(t).sub(e).div(r - 1), n, a),
          u = Math.ceil(
            (i =
              e <= 0 && t >= 0
                ? new V.default(0)
                : (i = new V.default(e).add(t).div(2)).sub(new V.default(i).mod(l)))
              .sub(e)
              .div(l)
              .toNumber(),
          ),
          c = Math.ceil(new V.default(t).sub(i).div(l).toNumber()),
          s = u + c + 1;
        return s > r
          ? G(e, t, r, n, a + 1, o)
          : (s < r && ((c = t > 0 ? c + (r - s) : c), (u = t > 0 ? u : u + (r - s))),
            {
              step: l,
              tickMin: i.sub(new V.default(u).mul(l)),
              tickMax: i.add(new V.default(c).mul(l)),
            });
      },
      Z = function (e) {
        var [t, r] = e,
          n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 6,
          i = !(arguments.length > 2) || void 0 === arguments[2] || arguments[2],
          a = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 'auto',
          o = Math.max(n, 2),
          [l, u] = q([t, r]);
        if (l === -1 / 0 || u === 1 / 0) {
          var c =
            u === 1 / 0 ? [l, ...Array(n - 1).fill(1 / 0)] : [...Array(n - 1).fill(-1 / 0), u];
          return t > r ? c.reverse() : c;
        }
        if (l === u)
          return ((e, t, r) => {
            var n = new V.default(1),
              i = new V.default(e);
            if (!i.isint() && r) {
              var a = Math.abs(e);
              a < 1
                ? ((n = new V.default(10).pow(K(e) - 1)),
                  (i = new V.default(Math.floor(i.div(n).toNumber())).mul(n)))
                : a > 1 && (i = new V.default(Math.floor(e)));
            } else
              0 === e
                ? (i = new V.default(Math.floor((t - 1) / 2)))
                : r || (i = new V.default(Math.floor(e)));
            for (var o = Math.floor((t - 1) / 2), l = [], u = 0; u < t; u++)
              l.push(i.add(new V.default(u - o).mul(n)).toNumber());
            return l;
          })(l, n, i);
        var { step: s, tickMin: f, tickMax: d } = G(l, u, o, i, 0, 'snap125' === a ? X : Y),
          p = H(f, d.add(new V.default(0.1).mul(s)), s);
        return t > r ? p.reverse() : p;
      },
      Q = function (e, t) {
        var [r, n] = e,
          i = !(arguments.length > 2) || void 0 === arguments[2] || arguments[2],
          a = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 'auto',
          [o, l] = q([r, n]);
        if (o === -1 / 0 || l === 1 / 0) return [r, n];
        if (o === l) return [o];
        var u = Math.max(t, 2),
          c = ('snap125' === a ? X : Y)(new V.default(l).sub(o).div(u - 1), i, 0),
          s = [...H(new V.default(o), new V.default(l), c), l];
        return (!1 === i && (s = s.map((e) => Math.round(e))), r > n ? s.reverse() : s);
      },
      J = e.i(96299),
      ee = (e) => e.rootProps.barCategoryGap,
      et = (e) => e.rootProps.stackOffset,
      er = (e) => e.rootProps.reverseStackOrder,
      en = (e) => e.options.chartName,
      ei = (e) => e.rootProps.syncId,
      ea = (e) => e.rootProps.syncMethod,
      eo = (e) => e.options.eventEmitter;
    function el(e, t) {
      var r = Object.keys(e);
      if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(e);
        (t &&
          (n = n.filter(function (t) {
            return Object.getOwnPropertyDescriptor(e, t).enumerable;
          })),
          r.push.apply(r, n));
      }
      return r;
    }
    function eu(e) {
      for (var t = 1; t < arguments.length; t++) {
        var r = null != arguments[t] ? arguments[t] : {};
        t % 2
          ? el(Object(r), !0).forEach(function (t) {
              var n, i, a;
              ((n = e),
                (i = t),
                (a = r[t]),
                (i = (function (e) {
                  var t = (function (e, t) {
                    if ('object' != typeof e || !e) return e;
                    var r = e[Symbol.toPrimitive];
                    if (void 0 !== r) {
                      var n = r.call(e, t || 'default');
                      if ('object' != typeof n) return n;
                      throw TypeError('@@toPrimitive must return a primitive value.');
                    }
                    return ('string' === t ? String : Number)(e);
                  })(e, 'string');
                  return 'symbol' == typeof t ? t : t + '';
                })(i)) in n
                  ? Object.defineProperty(n, i, {
                      value: a,
                      enumerable: !0,
                      configurable: !0,
                      writable: !0,
                    })
                  : (n[i] = a));
            })
          : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
            : el(Object(r)).forEach(function (t) {
                Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t));
              });
      }
      return e;
    }
    e.s(
      [
        'selectBarCategoryGap',
        0,
        ee,
        'selectBarGap',
        0,
        (e) => e.rootProps.barGap,
        'selectChartBaseValue',
        0,
        (e) => e.rootProps.baseValue,
        'selectChartName',
        0,
        en,
        'selectEventEmitter',
        0,
        eo,
        'selectReverseStackOrder',
        0,
        er,
        'selectRootBarSize',
        0,
        (e) => e.rootProps.barSize,
        'selectRootMaxBarSize',
        0,
        (e) => e.rootProps.maxBarSize,
        'selectStackOffsetType',
        0,
        et,
        'selectSyncId',
        0,
        ei,
        'selectSyncMethod',
        0,
        ea,
      ],
      76108,
    );
    var ec = Math.PI / 180,
      es = (e, t, r, n) => ({ x: e + Math.cos(-ec * n) * r, y: t + Math.sin(-ec * n) * r }),
      ef = function (e, t) {
        var r =
          arguments.length > 2 && void 0 !== arguments[2]
            ? arguments[2]
            : { top: 0, right: 0, bottom: 0, left: 0, width: 0, height: 0, brushBottom: 0 };
        return (
          Math.min(
            Math.abs(e - (r.left || 0) - (r.right || 0)),
            Math.abs(t - (r.top || 0) - (r.bottom || 0)),
          ) / 2
        );
      },
      ed = (e, t) => {
        var r,
          { relativeX: n, relativeY: i } = e,
          { radius: a, angle: o } = ((e, t) => {
            var { x: r, y: n } = e,
              { cx: i, cy: a } = t,
              o = ((e, t) => {
                var { x: r, y: n } = e,
                  { x: i, y: a } = t;
                return Math.sqrt((r - i) ** 2 + (n - a) ** 2);
              })({ x: r, y: n }, { x: i, y: a });
            if (o <= 0) return { radius: o, angle: 0 };
            var l = Math.acos((r - i) / o);
            return (
              n > a && (l = 2 * Math.PI - l),
              { radius: o, angle: (180 * l) / Math.PI, angleInRadian: l }
            );
          })({ x: n, y: i }, t),
          { innerRadius: l, outerRadius: u } = t;
        if (a < l || a > u || 0 === a) return null;
        var { startAngle: c, endAngle: s } = ((e) => {
            var { startAngle: t, endAngle: r } = e,
              n = Math.min(Math.floor(t / 360), Math.floor(r / 360));
            return { startAngle: t - 360 * n, endAngle: r - 360 * n };
          })(t),
          f = o;
        if (c <= s) {
          for (; f > s; ) f -= 360;
          for (; f < c; ) f += 360;
          r = f >= c && f <= s;
        } else {
          for (; f > c; ) f -= 360;
          for (; f < s; ) f += 360;
          r = f >= s && f <= c;
        }
        return r
          ? eu(
              eu({}, t),
              {},
              {
                radius: a,
                angle: ((e, t) => {
                  var { startAngle: r, endAngle: n } = t;
                  return e + 360 * Math.min(Math.floor(r / 360), Math.floor(n / 360));
                })(f, t),
              },
            )
          : null;
      };
    e.s(
      ['RADIAN', 0, ec, 'getMaxRadius', 0, ef, 'inRangeOfSector', 0, ed, 'polarToCartesian', 0, es],
      13348,
    );
    var ep = {
      grid: -100,
      barBackground: -50,
      area: 100,
      cursorRectangle: 200,
      bar: 300,
      line: 400,
      axis: 500,
      scatter: 600,
      activeBar: 1e3,
      cursorLine: 1100,
      activeDot: 1200,
      label: 2e3,
    };
    e.s(['DefaultZIndexes', 0, ep], 95916);
    var eh = {
        allowDecimals: !1,
        allowDuplicatedCategory: !0,
        allowDataOverflow: !1,
        angle: 0,
        angleAxisId: 0,
        axisLine: !0,
        axisLineType: 'polygon',
        cx: 0,
        cy: 0,
        hide: !1,
        includeHidden: !1,
        label: !1,
        niceTicks: 'auto',
        orientation: 'outer',
        reversed: !1,
        scale: 'auto',
        tick: !0,
        tickLine: !0,
        tickSize: 8,
        type: 'auto',
        zIndex: ep.axis,
      },
      ev = {
        allowDataOverflow: !1,
        allowDecimals: !1,
        allowDuplicatedCategory: !0,
        angle: 0,
        axisLine: !0,
        includeHidden: !1,
        hide: !1,
        niceTicks: 'auto',
        label: !1,
        orientation: 'right',
        radiusAxisId: 0,
        reversed: !1,
        scale: 'auto',
        stroke: '#ccc',
        tick: !0,
        tickCount: 5,
        tickLine: !0,
        type: 'auto',
        zIndex: ep.axis,
      },
      ey = (e, t) => {
        if (e && t) return null != e && e.reversed ? [t[1], t[0]] : t;
      };
    function eg(e, t, r) {
      return 'auto' !== r
        ? r
        : null != e
          ? (0, D.isCategoricalAxis)(e, t)
            ? 'category'
            : 'number'
          : void 0;
    }
    function em(e, t) {
      var r = Object.keys(e);
      if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(e);
        (t &&
          (n = n.filter(function (t) {
            return Object.getOwnPropertyDescriptor(e, t).enumerable;
          })),
          r.push.apply(r, n));
      }
      return r;
    }
    function eb(e) {
      for (var t = 1; t < arguments.length; t++) {
        var r = null != arguments[t] ? arguments[t] : {};
        t % 2
          ? em(Object(r), !0).forEach(function (t) {
              var n, i, a;
              ((n = e),
                (i = t),
                (a = r[t]),
                (i = (function (e) {
                  var t = (function (e, t) {
                    if ('object' != typeof e || !e) return e;
                    var r = e[Symbol.toPrimitive];
                    if (void 0 !== r) {
                      var n = r.call(e, t || 'default');
                      if ('object' != typeof n) return n;
                      throw TypeError('@@toPrimitive must return a primitive value.');
                    }
                    return ('string' === t ? String : Number)(e);
                  })(e, 'string');
                  return 'symbol' == typeof t ? t : t + '';
                })(i)) in n
                  ? Object.defineProperty(n, i, {
                      value: a,
                      enumerable: !0,
                      configurable: !0,
                      writable: !0,
                    })
                  : (n[i] = a));
            })
          : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
            : em(Object(r)).forEach(function (t) {
                Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t));
              });
      }
      return e;
    }
    e.s(['getAxisTypeBasedOnLayout', 0, eg], 96288);
    var ex = {
        allowDataOverflow: eh.allowDataOverflow,
        allowDecimals: eh.allowDecimals,
        allowDuplicatedCategory: !1,
        dataKey: void 0,
        domain: void 0,
        id: eh.angleAxisId,
        includeHidden: !1,
        name: void 0,
        reversed: eh.reversed,
        scale: eh.scale,
        tick: eh.tick,
        tickCount: void 0,
        ticks: void 0,
        type: eh.type,
        unit: void 0,
        niceTicks: 'auto',
      },
      ew = {
        allowDataOverflow: ev.allowDataOverflow,
        allowDecimals: ev.allowDecimals,
        allowDuplicatedCategory: ev.allowDuplicatedCategory,
        dataKey: void 0,
        domain: void 0,
        id: ev.radiusAxisId,
        includeHidden: ev.includeHidden,
        name: void 0,
        reversed: ev.reversed,
        scale: ev.scale,
        tick: ev.tick,
        tickCount: ev.tickCount,
        ticks: void 0,
        type: ev.type,
        unit: void 0,
        niceTicks: 'auto',
      },
      eO = (0, y.createSelector)(
        [
          (e, t) => {
            if (null != t) return e.polarAxis.angleAxis[t];
          },
          M,
        ],
        (e, t) => {
          if (null != e) return e;
          var r,
            n = null != (r = eg(t, 'angleAxis', ex.type)) ? r : 'category';
          return eb(eb({}, ex), {}, { type: n });
        },
      ),
      eS = (0, y.createSelector)([(e, t) => e.polarAxis.radiusAxis[t], M], (e, t) => {
        if (null != e) return e;
        var r,
          n = null != (r = eg(t, 'radiusAxis', ew.type)) ? r : 'category';
        return eb(eb({}, ew), {}, { type: n });
      }),
      eA = (e) => e.polarOptions,
      eP = (0, y.createSelector)(
        [b.selectChartWidth, b.selectChartHeight, m.selectChartOffsetInternal],
        ef,
      ),
      e_ = (0, y.createSelector)([eA, eP], (e, t) => {
        if (null != e) return (0, F.getPercentValue)(e.innerRadius, t, 0);
      }),
      eE = (0, y.createSelector)([eA, eP], (e, t) => {
        if (null != e) return (0, F.getPercentValue)(e.outerRadius, t, 0.8 * t);
      }),
      ej = (0, y.createSelector)([eA], (e) => {
        if (null == e) return [0, 0];
        var { startAngle: t, endAngle: r } = e;
        return [t, r];
      });
    (0, y.createSelector)([eO, ej], ey);
    var eC = (0, y.createSelector)([eP, e_, eE], (e, t, r) => {
      if (null != e && null != t && null != r) return [t, r];
    });
    (0, y.createSelector)([eS, eC], ey);
    var eM = (0, y.createSelector)(
      [j, eA, e_, eE, b.selectChartWidth, b.selectChartHeight],
      (e, t, r, n, i, a) => {
        if (('centric' === e || 'radial' === e) && null != t && null != r && null != n) {
          var { cx: o, cy: l, startAngle: u, endAngle: c } = t;
          return {
            cx: (0, F.getPercentValue)(o, i, i / 2),
            cy: (0, F.getPercentValue)(l, a, a / 2),
            innerRadius: r,
            outerRadius: n,
            startAngle: u,
            endAngle: c,
            clockWise: !1,
          };
        }
      },
    );
    e.s(
      [
        'selectAngleAxis',
        0,
        eO,
        'selectAngleAxisRange',
        0,
        ej,
        'selectPolarViewBox',
        0,
        eM,
        'selectRadiusAxis',
        0,
        eS,
        'selectRadiusAxisRange',
        0,
        eC,
      ],
      83300,
    );
    var ek = (e, t) => t;
    e.s(['pickAxisType', 0, ek], 11085);
    var eT = (e, t, r) => r;
    e.s(['pickAxisId', 0, eT], 27765);
    var eD = e.i(66850);
    function eN(e) {
      return null == e ? void 0 : e.id;
    }
    function eI(e, t, r) {
      var { chartData: n = [] } = t,
        { allowDuplicatedCategory: i, dataKey: a } = r,
        o = new Map();
      return (
        e.forEach((e) => {
          var t,
            r = null != (t = e.data) ? t : n;
          if (null != r && 0 !== r.length) {
            var l = eN(e);
            r.forEach((t, r) => {
              var n,
                u = null == a || i ? r : String((0, D.getValueByDataKey)(t, a, null)),
                c = (0, D.getValueByDataKey)(t, e.dataKey, 0);
              (Object.assign((n = o.has(u) ? o.get(u) : {}), { [l]: c }), o.set(u, n));
            });
          }
        }),
        Array.from(o.values())
      );
    }
    function eL(e) {
      return 'stackId' in e && null != e.stackId && null != e.dataKey;
    }
    (e.s(['getStackSeriesIdentifier', 0, eN], 61427), e.s(['isStacked', 0, eL], 34565));
    var eR = (e, t) => e === t || (null != e && null != t && e[0] === t[0] && e[1] === t[1]);
    function eB(e, t) {
      return (
        (!!(Array.isArray(e) && Array.isArray(t)) && 0 === e.length && 0 === t.length) || e === t
      );
    }
    var ez = (e) => {
        var t = j(e);
        return 'horizontal' === t
          ? 'xAxis'
          : 'vertical' === t
            ? 'yAxis'
            : 'centric' === t
              ? 'angleAxis'
              : 'radiusAxis';
      },
      eF = (e) => e.tooltip.settings.axisId;
    function eU(e) {
      if (null != e) {
        var t = e.ticks,
          r = e.bandwidth,
          n = e.range(),
          i = [Math.min(...n), Math.max(...n)];
        return {
          domain: () => e.domain(),
          range: (function (e) {
            function t() {
              return e.apply(this, arguments);
            }
            return (
              (t.toString = function () {
                return e.toString();
              }),
              t
            );
          })(() => i),
          rangeMin: () => i[0],
          rangeMax: () => i[1],
          isInRange(e) {
            var t = i[0],
              r = i[1];
            return t <= r ? e >= t && e <= r : e >= r && e <= t;
          },
          bandwidth: r ? () => r.call(e) : void 0,
          ticks: t ? (r) => t.call(e, r) : void 0,
          map: (t, r) => {
            var n = e(t);
            if (null != n) {
              if (e.bandwidth && null != r && r.position) {
                var i = e.bandwidth();
                switch (r.position) {
                  case 'middle':
                    n += i / 2;
                    break;
                  case 'end':
                    n += i;
                }
              }
              return n;
            }
          },
        };
      }
    }
    var eW = (e, t) => {
      if (null != t)
        if ('linear' !== e) return t;
        else {
          if (!U(t)) {
            for (var r, n, i = 0; i < t.length; i++) {
              var a = t[i];
              (0, S.isWellBehavedNumber)(a) &&
                ((void 0 === r || a < r) && (r = a), (void 0 === n || a > n) && (n = a));
            }
            return void 0 !== r && void 0 !== n ? [r, n] : void 0;
          }
          return t;
        }
    };
    function e$(e, t) {
      switch (arguments.length) {
        case 0:
          break;
        case 1:
          this.range(e);
          break;
        default:
          this.range(t).domain(e);
      }
      return this;
    }
    function eV(e, t) {
      switch (arguments.length) {
        case 0:
          break;
        case 1:
          'function' == typeof e ? this.interpolator(e) : this.range(e);
          break;
        default:
          (this.domain(e), 'function' == typeof t ? this.interpolator(t) : this.range(t));
      }
      return this;
    }
    (e.s(['combineCheckedDomain', 0, eW], 56281),
      e.s([], 95229),
      e.i(95229),
      e.s([], 31611),
      e.i(31611));
    class eK extends Map {
      constructor(e, t = eq) {
        if (
          (super(),
          Object.defineProperties(this, { _intern: { value: new Map() }, _key: { value: t } }),
          null != e)
        )
          for (const [t, r] of e) this.set(t, r);
      }
      get(e) {
        return super.get(eH(this, e));
      }
      has(e) {
        return super.has(eH(this, e));
      }
      set(e, t) {
        return super.set(
          (function ({ _intern: e, _key: t }, r) {
            let n = t(r);
            return e.has(n) ? e.get(n) : (e.set(n, r), r);
          })(this, e),
          t,
        );
      }
      delete(e) {
        return super.delete(
          (function ({ _intern: e, _key: t }, r) {
            let n = t(r);
            return (e.has(n) && ((r = e.get(n)), e.delete(n)), r);
          })(this, e),
        );
      }
    }
    function eH({ _intern: e, _key: t }, r) {
      let n = t(r);
      return e.has(n) ? e.get(n) : r;
    }
    function eq(e) {
      return null !== e && 'object' == typeof e ? e.valueOf() : e;
    }
    let eY = Symbol('implicit');
    function eX() {
      var e = new eK(),
        t = [],
        r = [],
        n = eY;
      function i(i) {
        let a = e.get(i);
        if (void 0 === a) {
          if (n !== eY) return n;
          e.set(i, (a = t.push(i) - 1));
        }
        return r[a % r.length];
      }
      return (
        (i.domain = function (r) {
          if (!arguments.length) return t.slice();
          for (let n of ((t = []), (e = new eK()), r)) e.has(n) || e.set(n, t.push(n) - 1);
          return i;
        }),
        (i.range = function (e) {
          return arguments.length ? ((r = Array.from(e)), i) : r.slice();
        }),
        (i.unknown = function (e) {
          return arguments.length ? ((n = e), i) : n;
        }),
        (i.copy = function () {
          return eX(t, r).unknown(n);
        }),
        e$.apply(i, arguments),
        i
      );
    }
    function eG() {
      var e,
        t,
        r = eX().unknown(void 0),
        n = r.domain,
        i = r.range,
        a = 0,
        o = 1,
        l = !1,
        u = 0,
        c = 0,
        s = 0.5;
      function f() {
        var r = n().length,
          f = o < a,
          d = f ? o : a,
          p = f ? a : o;
        ((e = (p - d) / Math.max(1, r - u + 2 * c)),
          l && (e = Math.floor(e)),
          (d += (p - d - e * (r - u)) * s),
          (t = e * (1 - u)),
          l && ((d = Math.round(d)), (t = Math.round(t))));
        var h = (function (e, t, r) {
          ((e *= 1),
            (t *= 1),
            (r = (i = arguments.length) < 2 ? ((t = e), (e = 0), 1) : i < 3 ? 1 : +r));
          for (var n = -1, i = 0 | Math.max(0, Math.ceil((t - e) / r)), a = Array(i); ++n < i; )
            a[n] = e + n * r;
          return a;
        })(r).map(function (t) {
          return d + e * t;
        });
        return i(f ? h.reverse() : h);
      }
      return (
        delete r.unknown,
        (r.domain = function (e) {
          return arguments.length ? (n(e), f()) : n();
        }),
        (r.range = function (e) {
          return arguments.length ? (([a, o] = e), (a *= 1), (o *= 1), f()) : [a, o];
        }),
        (r.rangeRound = function (e) {
          return (([a, o] = e), (a *= 1), (o *= 1), (l = !0), f());
        }),
        (r.bandwidth = function () {
          return t;
        }),
        (r.step = function () {
          return e;
        }),
        (r.round = function (e) {
          return arguments.length ? ((l = !!e), f()) : l;
        }),
        (r.padding = function (e) {
          return arguments.length ? ((u = Math.min(1, (c = +e))), f()) : u;
        }),
        (r.paddingInner = function (e) {
          return arguments.length ? ((u = Math.min(1, e)), f()) : u;
        }),
        (r.paddingOuter = function (e) {
          return arguments.length ? ((c = +e), f()) : c;
        }),
        (r.align = function (e) {
          return arguments.length ? ((s = Math.max(0, Math.min(1, e))), f()) : s;
        }),
        (r.copy = function () {
          return eG(n(), [a, o]).round(l).paddingInner(u).paddingOuter(c).align(s);
        }),
        e$.apply(f(), arguments)
      );
    }
    function eZ() {
      return (function e(t) {
        var r = t.copy;
        return (
          (t.padding = t.paddingOuter),
          delete t.paddingInner,
          delete t.paddingOuter,
          (t.copy = function () {
            return e(r());
          }),
          t
        );
      })(eG.apply(null, arguments).paddingInner(1));
    }
    let eQ = Math.sqrt(50),
      eJ = Math.sqrt(10),
      e0 = Math.sqrt(2);
    function e1(e, t, r) {
      let n,
        i,
        a,
        o = (t - e) / Math.max(0, r),
        l = Math.floor(Math.log10(o)),
        u = o / Math.pow(10, l),
        c = u >= eQ ? 10 : u >= eJ ? 5 : u >= e0 ? 2 : 1;
      return (l < 0
        ? ((n = Math.round(e * (a = Math.pow(10, -l) / c))),
          (i = Math.round(t * a)),
          n / a < e && ++n,
          i / a > t && --i,
          (a = -a))
        : ((n = Math.round(e / (a = Math.pow(10, l) * c))),
          (i = Math.round(t / a)),
          n * a < e && ++n,
          i * a > t && --i),
      i < n && 0.5 <= r && r < 2)
        ? e1(e, t, 2 * r)
        : [n, i, a];
    }
    function e2(e, t, r) {
      if (((t *= 1), (e *= 1), !((r *= 1) > 0))) return [];
      if (e === t) return [e];
      let n = t < e,
        [i, a, o] = n ? e1(t, e, r) : e1(e, t, r);
      if (!(a >= i)) return [];
      let l = a - i + 1,
        u = Array(l);
      if (n)
        if (o < 0) for (let e = 0; e < l; ++e) u[e] = -((a - e) / o);
        else for (let e = 0; e < l; ++e) u[e] = (a - e) * o;
      else if (o < 0) for (let e = 0; e < l; ++e) u[e] = -((i + e) / o);
      else for (let e = 0; e < l; ++e) u[e] = (i + e) * o;
      return u;
    }
    function e4(e, t, r) {
      return e1((e *= 1), (t *= 1), (r *= 1))[2];
    }
    function e5(e, t, r) {
      ((t *= 1), (e *= 1), (r *= 1));
      let n = t < e,
        i = n ? e4(t, e, r) : e4(e, t, r);
      return (n ? -1 : 1) * (i < 0 ? -(1 / i) : i);
    }
    function e3(e, t) {
      return null == e || null == t ? NaN : e < t ? -1 : e > t ? 1 : e >= t ? 0 : NaN;
    }
    function e6(e, t) {
      return null == e || null == t ? NaN : t < e ? -1 : t > e ? 1 : t >= e ? 0 : NaN;
    }
    function e8(e) {
      let t, r, n;
      function i(e, n, a = 0, o = e.length) {
        if (a < o) {
          if (0 !== t(n, n)) return o;
          do {
            let t = (a + o) >>> 1;
            0 > r(e[t], n) ? (a = t + 1) : (o = t);
          } while (a < o);
        }
        return a;
      }
      return (
        2 !== e.length
          ? ((t = e3), (r = (t, r) => e3(e(t), r)), (n = (t, r) => e(t) - r))
          : ((t = e === e3 || e === e6 ? e : e9), (r = e), (n = e)),
        {
          left: i,
          center: function (e, t, r = 0, a = e.length) {
            let o = i(e, t, r, a - 1);
            return o > r && n(e[o - 1], t) > -n(e[o], t) ? o - 1 : o;
          },
          right: function (e, n, i = 0, a = e.length) {
            if (i < a) {
              if (0 !== t(n, n)) return a;
              do {
                let t = (i + a) >>> 1;
                0 >= r(e[t], n) ? (i = t + 1) : (a = t);
              } while (i < a);
            }
            return i;
          },
        }
      );
    }
    function e9() {
      return 0;
    }
    function e7(e) {
      return null === e ? NaN : +e;
    }
    let te = e8(e3),
      tt = te.right;
    function tr(e, t, r) {
      ((e.prototype = t.prototype = r), (r.constructor = e));
    }
    function tn(e, t) {
      var r = Object.create(e.prototype);
      for (var n in t) r[n] = t[n];
      return r;
    }
    function ti() {}
    (te.left, e8(e7).center);
    var ta = '\\s*([+-]?\\d+)\\s*',
      to = '\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*',
      tl = '\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*',
      tu = /^#([0-9a-f]{3,8})$/,
      tc = RegExp(`^rgb\\(${ta},${ta},${ta}\\)$`),
      ts = RegExp(`^rgb\\(${tl},${tl},${tl}\\)$`),
      tf = RegExp(`^rgba\\(${ta},${ta},${ta},${to}\\)$`),
      td = RegExp(`^rgba\\(${tl},${tl},${tl},${to}\\)$`),
      tp = RegExp(`^hsl\\(${to},${tl},${tl}\\)$`),
      th = RegExp(`^hsla\\(${to},${tl},${tl},${to}\\)$`),
      tv = {
        aliceblue: 0xf0f8ff,
        antiquewhite: 0xfaebd7,
        aqua: 65535,
        aquamarine: 8388564,
        azure: 0xf0ffff,
        beige: 0xf5f5dc,
        bisque: 0xffe4c4,
        black: 0,
        blanchedalmond: 0xffebcd,
        blue: 255,
        blueviolet: 9055202,
        brown: 0xa52a2a,
        burlywood: 0xdeb887,
        cadetblue: 6266528,
        chartreuse: 8388352,
        chocolate: 0xd2691e,
        coral: 0xff7f50,
        cornflowerblue: 6591981,
        cornsilk: 0xfff8dc,
        crimson: 0xdc143c,
        cyan: 65535,
        darkblue: 139,
        darkcyan: 35723,
        darkgoldenrod: 0xb8860b,
        darkgray: 0xa9a9a9,
        darkgreen: 25600,
        darkgrey: 0xa9a9a9,
        darkkhaki: 0xbdb76b,
        darkmagenta: 9109643,
        darkolivegreen: 5597999,
        darkorange: 0xff8c00,
        darkorchid: 0x9932cc,
        darkred: 9109504,
        darksalmon: 0xe9967a,
        darkseagreen: 9419919,
        darkslateblue: 4734347,
        darkslategray: 3100495,
        darkslategrey: 3100495,
        darkturquoise: 52945,
        darkviolet: 9699539,
        deeppink: 0xff1493,
        deepskyblue: 49151,
        dimgray: 6908265,
        dimgrey: 6908265,
        dodgerblue: 2003199,
        firebrick: 0xb22222,
        floralwhite: 0xfffaf0,
        forestgreen: 2263842,
        fuchsia: 0xff00ff,
        gainsboro: 0xdcdcdc,
        ghostwhite: 0xf8f8ff,
        gold: 0xffd700,
        goldenrod: 0xdaa520,
        gray: 8421504,
        green: 32768,
        greenyellow: 0xadff2f,
        grey: 8421504,
        honeydew: 0xf0fff0,
        hotpink: 0xff69b4,
        indianred: 0xcd5c5c,
        indigo: 4915330,
        ivory: 0xfffff0,
        khaki: 0xf0e68c,
        lavender: 0xe6e6fa,
        lavenderblush: 0xfff0f5,
        lawngreen: 8190976,
        lemonchiffon: 0xfffacd,
        lightblue: 0xadd8e6,
        lightcoral: 0xf08080,
        lightcyan: 0xe0ffff,
        lightgoldenrodyellow: 0xfafad2,
        lightgray: 0xd3d3d3,
        lightgreen: 9498256,
        lightgrey: 0xd3d3d3,
        lightpink: 0xffb6c1,
        lightsalmon: 0xffa07a,
        lightseagreen: 2142890,
        lightskyblue: 8900346,
        lightslategray: 7833753,
        lightslategrey: 7833753,
        lightsteelblue: 0xb0c4de,
        lightyellow: 0xffffe0,
        lime: 65280,
        limegreen: 3329330,
        linen: 0xfaf0e6,
        magenta: 0xff00ff,
        maroon: 8388608,
        mediumaquamarine: 6737322,
        mediumblue: 205,
        mediumorchid: 0xba55d3,
        mediumpurple: 9662683,
        mediumseagreen: 3978097,
        mediumslateblue: 8087790,
        mediumspringgreen: 64154,
        mediumturquoise: 4772300,
        mediumvioletred: 0xc71585,
        midnightblue: 1644912,
        mintcream: 0xf5fffa,
        mistyrose: 0xffe4e1,
        moccasin: 0xffe4b5,
        navajowhite: 0xffdead,
        navy: 128,
        oldlace: 0xfdf5e6,
        olive: 8421376,
        olivedrab: 7048739,
        orange: 0xffa500,
        orangered: 0xff4500,
        orchid: 0xda70d6,
        palegoldenrod: 0xeee8aa,
        palegreen: 0x98fb98,
        paleturquoise: 0xafeeee,
        palevioletred: 0xdb7093,
        papayawhip: 0xffefd5,
        peachpuff: 0xffdab9,
        peru: 0xcd853f,
        pink: 0xffc0cb,
        plum: 0xdda0dd,
        powderblue: 0xb0e0e6,
        purple: 8388736,
        rebeccapurple: 6697881,
        red: 0xff0000,
        rosybrown: 0xbc8f8f,
        royalblue: 4286945,
        saddlebrown: 9127187,
        salmon: 0xfa8072,
        sandybrown: 0xf4a460,
        seagreen: 3050327,
        seashell: 0xfff5ee,
        sienna: 0xa0522d,
        silver: 0xc0c0c0,
        skyblue: 8900331,
        slateblue: 6970061,
        slategray: 7372944,
        slategrey: 7372944,
        snow: 0xfffafa,
        springgreen: 65407,
        steelblue: 4620980,
        tan: 0xd2b48c,
        teal: 32896,
        thistle: 0xd8bfd8,
        tomato: 0xff6347,
        turquoise: 4251856,
        violet: 0xee82ee,
        wheat: 0xf5deb3,
        white: 0xffffff,
        whitesmoke: 0xf5f5f5,
        yellow: 0xffff00,
        yellowgreen: 0x9acd32,
      };
    function ty() {
      return this.rgb().formatHex();
    }
    function tg() {
      return this.rgb().formatRgb();
    }
    function tm(e) {
      var t, r;
      return (
        (e = (e + '').trim().toLowerCase()),
        (t = tu.exec(e))
          ? ((r = t[1].length),
            (t = parseInt(t[1], 16)),
            6 === r
              ? tb(t)
              : 3 === r
                ? new tO(
                    ((t >> 8) & 15) | ((t >> 4) & 240),
                    ((t >> 4) & 15) | (240 & t),
                    ((15 & t) << 4) | (15 & t),
                    1,
                  )
                : 8 === r
                  ? tx((t >> 24) & 255, (t >> 16) & 255, (t >> 8) & 255, (255 & t) / 255)
                  : 4 === r
                    ? tx(
                        ((t >> 12) & 15) | ((t >> 8) & 240),
                        ((t >> 8) & 15) | ((t >> 4) & 240),
                        ((t >> 4) & 15) | (240 & t),
                        (((15 & t) << 4) | (15 & t)) / 255,
                      )
                    : null)
          : (t = tc.exec(e))
            ? new tO(t[1], t[2], t[3], 1)
            : (t = ts.exec(e))
              ? new tO((255 * t[1]) / 100, (255 * t[2]) / 100, (255 * t[3]) / 100, 1)
              : (t = tf.exec(e))
                ? tx(t[1], t[2], t[3], t[4])
                : (t = td.exec(e))
                  ? tx((255 * t[1]) / 100, (255 * t[2]) / 100, (255 * t[3]) / 100, t[4])
                  : (t = tp.exec(e))
                    ? tj(t[1], t[2] / 100, t[3] / 100, 1)
                    : (t = th.exec(e))
                      ? tj(t[1], t[2] / 100, t[3] / 100, t[4])
                      : tv.hasOwnProperty(e)
                        ? tb(tv[e])
                        : 'transparent' === e
                          ? new tO(NaN, NaN, NaN, 0)
                          : null
      );
    }
    function tb(e) {
      return new tO((e >> 16) & 255, (e >> 8) & 255, 255 & e, 1);
    }
    function tx(e, t, r, n) {
      return (n <= 0 && (e = t = r = NaN), new tO(e, t, r, n));
    }
    function tw(e, t, r, n) {
      var i;
      return 1 == arguments.length
        ? ((i = e) instanceof ti || (i = tm(i)), i)
          ? new tO((i = i.rgb()).r, i.g, i.b, i.opacity)
          : new tO()
        : new tO(e, t, r, null == n ? 1 : n);
    }
    function tO(e, t, r, n) {
      ((this.r = +e), (this.g = +t), (this.b = +r), (this.opacity = +n));
    }
    function tS() {
      return `#${tE(this.r)}${tE(this.g)}${tE(this.b)}`;
    }
    function tA() {
      let e = tP(this.opacity);
      return `${1 === e ? 'rgb(' : 'rgba('}${t_(this.r)}, ${t_(this.g)}, ${t_(this.b)}${1 === e ? ')' : `, ${e})`}`;
    }
    function tP(e) {
      return isNaN(e) ? 1 : Math.max(0, Math.min(1, e));
    }
    function t_(e) {
      return Math.max(0, Math.min(255, Math.round(e) || 0));
    }
    function tE(e) {
      return ((e = t_(e)) < 16 ? '0' : '') + e.toString(16);
    }
    function tj(e, t, r, n) {
      return (
        n <= 0 ? (e = t = r = NaN) : r <= 0 || r >= 1 ? (e = t = NaN) : t <= 0 && (e = NaN),
        new tM(e, t, r, n)
      );
    }
    function tC(e) {
      if (e instanceof tM) return new tM(e.h, e.s, e.l, e.opacity);
      if ((e instanceof ti || (e = tm(e)), !e)) return new tM();
      if (e instanceof tM) return e;
      var t = (e = e.rgb()).r / 255,
        r = e.g / 255,
        n = e.b / 255,
        i = Math.min(t, r, n),
        a = Math.max(t, r, n),
        o = NaN,
        l = a - i,
        u = (a + i) / 2;
      return (
        l
          ? ((o =
              t === a ? (r - n) / l + (r < n) * 6 : r === a ? (n - t) / l + 2 : (t - r) / l + 4),
            (l /= u < 0.5 ? a + i : 2 - a - i),
            (o *= 60))
          : (l = u > 0 && u < 1 ? 0 : o),
        new tM(o, l, u, e.opacity)
      );
    }
    function tM(e, t, r, n) {
      ((this.h = +e), (this.s = +t), (this.l = +r), (this.opacity = +n));
    }
    function tk(e) {
      return (e = (e || 0) % 360) < 0 ? e + 360 : e;
    }
    function tT(e) {
      return Math.max(0, Math.min(1, e || 0));
    }
    function tD(e, t, r) {
      return (
        (e < 60
          ? t + ((r - t) * e) / 60
          : e < 180
            ? r
            : e < 240
              ? t + ((r - t) * (240 - e)) / 60
              : t) * 255
      );
    }
    function tN(e, t, r, n, i) {
      var a = e * e,
        o = a * e;
      return (
        ((1 - 3 * e + 3 * a - o) * t +
          (4 - 6 * a + 3 * o) * r +
          (1 + 3 * e + 3 * a - 3 * o) * n +
          o * i) /
        6
      );
    }
    (tr(ti, tm, {
      copy(e) {
        return Object.assign(new this.constructor(), this, e);
      },
      displayable() {
        return this.rgb().displayable();
      },
      hex: ty,
      formatHex: ty,
      formatHex8: function () {
        return this.rgb().formatHex8();
      },
      formatHsl: function () {
        return tC(this).formatHsl();
      },
      formatRgb: tg,
      toString: tg,
    }),
      tr(
        tO,
        tw,
        tn(ti, {
          brighter(e) {
            return (
              (e = null == e ? 1.4285714285714286 : Math.pow(1.4285714285714286, e)),
              new tO(this.r * e, this.g * e, this.b * e, this.opacity)
            );
          },
          darker(e) {
            return (
              (e = null == e ? 0.7 : Math.pow(0.7, e)),
              new tO(this.r * e, this.g * e, this.b * e, this.opacity)
            );
          },
          rgb() {
            return this;
          },
          clamp() {
            return new tO(t_(this.r), t_(this.g), t_(this.b), tP(this.opacity));
          },
          displayable() {
            return (
              -0.5 <= this.r &&
              this.r < 255.5 &&
              -0.5 <= this.g &&
              this.g < 255.5 &&
              -0.5 <= this.b &&
              this.b < 255.5 &&
              0 <= this.opacity &&
              this.opacity <= 1
            );
          },
          hex: tS,
          formatHex: tS,
          formatHex8: function () {
            return `#${tE(this.r)}${tE(this.g)}${tE(this.b)}${tE((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
          },
          formatRgb: tA,
          toString: tA,
        }),
      ),
      tr(
        tM,
        function (e, t, r, n) {
          return 1 == arguments.length ? tC(e) : new tM(e, t, r, null == n ? 1 : n);
        },
        tn(ti, {
          brighter(e) {
            return (
              (e = null == e ? 1.4285714285714286 : Math.pow(1.4285714285714286, e)),
              new tM(this.h, this.s, this.l * e, this.opacity)
            );
          },
          darker(e) {
            return (
              (e = null == e ? 0.7 : Math.pow(0.7, e)),
              new tM(this.h, this.s, this.l * e, this.opacity)
            );
          },
          rgb() {
            var e = (this.h % 360) + (this.h < 0) * 360,
              t = isNaN(e) || isNaN(this.s) ? 0 : this.s,
              r = this.l,
              n = r + (r < 0.5 ? r : 1 - r) * t,
              i = 2 * r - n;
            return new tO(
              tD(e >= 240 ? e - 240 : e + 120, i, n),
              tD(e, i, n),
              tD(e < 120 ? e + 240 : e - 120, i, n),
              this.opacity,
            );
          },
          clamp() {
            return new tM(tk(this.h), tT(this.s), tT(this.l), tP(this.opacity));
          },
          displayable() {
            return (
              ((0 <= this.s && this.s <= 1) || isNaN(this.s)) &&
              0 <= this.l &&
              this.l <= 1 &&
              0 <= this.opacity &&
              this.opacity <= 1
            );
          },
          formatHsl() {
            let e = tP(this.opacity);
            return `${1 === e ? 'hsl(' : 'hsla('}${tk(this.h)}, ${100 * tT(this.s)}%, ${100 * tT(this.l)}%${1 === e ? ')' : `, ${e})`}`;
          },
        }),
      ));
    let tI = (e) => () => e;
    function tL(e, t) {
      var r = t - e;
      return r
        ? function (t) {
            return e + t * r;
          }
        : tI(isNaN(e) ? t : e);
    }
    let tR = (function e(t) {
      var r,
        n =
          1 == (r = +t)
            ? tL
            : function (e, t) {
                var n, i, a;
                return t - e
                  ? ((n = e),
                    (i = t),
                    (n = Math.pow(n, (a = r))),
                    (i = Math.pow(i, a) - n),
                    (a = 1 / a),
                    function (e) {
                      return Math.pow(n + e * i, a);
                    })
                  : tI(isNaN(e) ? t : e);
              };
      function i(e, t) {
        var r = n((e = tw(e)).r, (t = tw(t)).r),
          i = n(e.g, t.g),
          a = n(e.b, t.b),
          o = tL(e.opacity, t.opacity);
        return function (t) {
          return ((e.r = r(t)), (e.g = i(t)), (e.b = a(t)), (e.opacity = o(t)), e + '');
        };
      }
      return ((i.gamma = e), i);
    })(1);
    function tB(e) {
      return function (t) {
        var r,
          n,
          i = t.length,
          a = Array(i),
          o = Array(i),
          l = Array(i);
        for (r = 0; r < i; ++r)
          ((n = tw(t[r])), (a[r] = n.r || 0), (o[r] = n.g || 0), (l[r] = n.b || 0));
        return (
          (a = e(a)),
          (o = e(o)),
          (l = e(l)),
          (n.opacity = 1),
          function (e) {
            return ((n.r = a(e)), (n.g = o(e)), (n.b = l(e)), n + '');
          }
        );
      };
    }
    function tz(e, t) {
      return (
        (e *= 1),
        (t *= 1),
        function (r) {
          return e * (1 - r) + t * r;
        }
      );
    }
    (tB(function (e) {
      var t = e.length - 1;
      return function (r) {
        var n = r <= 0 ? (r = 0) : r >= 1 ? ((r = 1), t - 1) : Math.floor(r * t),
          i = e[n],
          a = e[n + 1],
          o = n > 0 ? e[n - 1] : 2 * i - a,
          l = n < t - 1 ? e[n + 2] : 2 * a - i;
        return tN((r - n / t) * t, o, i, a, l);
      };
    }),
      tB(function (e) {
        var t = e.length;
        return function (r) {
          var n = Math.floor(((r %= 1) < 0 ? ++r : r) * t),
            i = e[(n + t - 1) % t],
            a = e[n % t],
            o = e[(n + 1) % t],
            l = e[(n + 2) % t];
          return tN((r - n / t) * t, i, a, o, l);
        };
      }));
    var tF = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,
      tU = RegExp(tF.source, 'g');
    function tW(e, t) {
      var r,
        n,
        i = typeof t;
      return null == t || 'boolean' === i
        ? tI(t)
        : ('number' === i
            ? tz
            : 'string' === i
              ? (n = tm(t))
                ? ((t = n), tR)
                : function (e, t) {
                    var r,
                      n,
                      i,
                      a,
                      o,
                      l = (tF.lastIndex = tU.lastIndex = 0),
                      u = -1,
                      c = [],
                      s = [];
                    for (e += '', t += ''; (i = tF.exec(e)) && (a = tU.exec(t)); )
                      ((o = a.index) > l &&
                        ((o = t.slice(l, o)), c[u] ? (c[u] += o) : (c[++u] = o)),
                        (i = i[0]) === (a = a[0])
                          ? c[u]
                            ? (c[u] += a)
                            : (c[++u] = a)
                          : ((c[++u] = null), s.push({ i: u, x: tz(i, a) })),
                        (l = tU.lastIndex));
                    return (
                      l < t.length && ((o = t.slice(l)), c[u] ? (c[u] += o) : (c[++u] = o)),
                      c.length < 2
                        ? s[0]
                          ? ((r = s[0].x),
                            function (e) {
                              return r(e) + '';
                            })
                          : ((n = t),
                            function () {
                              return n;
                            })
                        : ((t = s.length),
                          function (e) {
                            for (var r, n = 0; n < t; ++n) c[(r = s[n]).i] = r.x(e);
                            return c.join('');
                          })
                    );
                  }
              : t instanceof tm
                ? tR
                : t instanceof Date
                  ? function (e, t) {
                      var r = new Date();
                      return (
                        (e *= 1),
                        (t *= 1),
                        function (n) {
                          return (r.setTime(e * (1 - n) + t * n), r);
                        }
                      );
                    }
                  : !ArrayBuffer.isView((r = t)) || r instanceof DataView
                    ? Array.isArray(t)
                      ? function (e, t) {
                          var r,
                            n = t ? t.length : 0,
                            i = e ? Math.min(n, e.length) : 0,
                            a = Array(i),
                            o = Array(n);
                          for (r = 0; r < i; ++r) a[r] = tW(e[r], t[r]);
                          for (; r < n; ++r) o[r] = t[r];
                          return function (e) {
                            for (r = 0; r < i; ++r) o[r] = a[r](e);
                            return o;
                          };
                        }
                      : ('function' != typeof t.valueOf && 'function' != typeof t.toString) ||
                          isNaN(t)
                        ? function (e, t) {
                            var r,
                              n = {},
                              i = {};
                            for (r in ((null === e || 'object' != typeof e) && (e = {}),
                            (null === t || 'object' != typeof t) && (t = {}),
                            t))
                              r in e ? (n[r] = tW(e[r], t[r])) : (i[r] = t[r]);
                            return function (e) {
                              for (r in n) i[r] = n[r](e);
                              return i;
                            };
                          }
                        : tz
                    : function (e, t) {
                        t || (t = []);
                        var r,
                          n = e ? Math.min(t.length, e.length) : 0,
                          i = t.slice();
                        return function (a) {
                          for (r = 0; r < n; ++r) i[r] = e[r] * (1 - a) + t[r] * a;
                          return i;
                        };
                      })(e, t);
    }
    function t$(e, t) {
      return (
        (e *= 1),
        (t *= 1),
        function (r) {
          return Math.round(e * (1 - r) + t * r);
        }
      );
    }
    function tV(e) {
      return +e;
    }
    var tK = [0, 1];
    function tH(e) {
      return e;
    }
    function tq(e, t) {
      var r;
      return (t -= e *= 1)
        ? function (r) {
            return (r - e) / t;
          }
        : ((r = isNaN(t) ? NaN : 0.5),
          function () {
            return r;
          });
    }
    function tY(e, t, r) {
      var n = e[0],
        i = e[1],
        a = t[0],
        o = t[1];
      return (
        i < n ? ((n = tq(i, n)), (a = r(o, a))) : ((n = tq(n, i)), (a = r(a, o))),
        function (e) {
          return a(n(e));
        }
      );
    }
    function tX(e, t, r) {
      var n = Math.min(e.length, t.length) - 1,
        i = Array(n),
        a = Array(n),
        o = -1;
      for (e[n] < e[0] && ((e = e.slice().reverse()), (t = t.slice().reverse())); ++o < n; )
        ((i[o] = tq(e[o], e[o + 1])), (a[o] = r(t[o], t[o + 1])));
      return function (t) {
        var r = tt(e, t, 1, n) - 1;
        return a[r](i[r](t));
      };
    }
    function tG(e, t) {
      return t
        .domain(e.domain())
        .range(e.range())
        .interpolate(e.interpolate())
        .clamp(e.clamp())
        .unknown(e.unknown());
    }
    function tZ() {
      var e,
        t,
        r,
        n,
        i,
        a,
        o = tK,
        l = tK,
        u = tW,
        c = tH;
      function s() {
        var e,
          t,
          r,
          u = Math.min(o.length, l.length);
        return (
          c !== tH &&
            ((e = o[0]),
            (t = o[u - 1]),
            e > t && ((r = e), (e = t), (t = r)),
            (c = function (r) {
              return Math.max(e, Math.min(t, r));
            })),
          (n = u > 2 ? tX : tY),
          (i = a = null),
          f
        );
      }
      function f(t) {
        return null == t || isNaN((t *= 1)) ? r : (i || (i = n(o.map(e), l, u)))(e(c(t)));
      }
      return (
        (f.invert = function (r) {
          return c(t((a || (a = n(l, o.map(e), tz)))(r)));
        }),
        (f.domain = function (e) {
          return arguments.length ? ((o = Array.from(e, tV)), s()) : o.slice();
        }),
        (f.range = function (e) {
          return arguments.length ? ((l = Array.from(e)), s()) : l.slice();
        }),
        (f.rangeRound = function (e) {
          return ((l = Array.from(e)), (u = t$), s());
        }),
        (f.clamp = function (e) {
          return arguments.length ? ((c = !!e || tH), s()) : c !== tH;
        }),
        (f.interpolate = function (e) {
          return arguments.length ? ((u = e), s()) : u;
        }),
        (f.unknown = function (e) {
          return arguments.length ? ((r = e), f) : r;
        }),
        function (r, n) {
          return ((e = r), (t = n), s());
        }
      );
    }
    function tQ() {
      return tZ()(tH, tH);
    }
    function tJ(e, t) {
      if (!isFinite(e) || 0 === e) return null;
      var r = (e = t ? e.toExponential(t - 1) : e.toExponential()).indexOf('e'),
        n = e.slice(0, r);
      return [n.length > 1 ? n[0] + n.slice(2) : n, +e.slice(r + 1)];
    }
    function t0(e) {
      return (e = tJ(Math.abs(e))) ? e[1] : NaN;
    }
    var t1 = /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;
    function t2(e) {
      var t;
      if (!(t = t1.exec(e))) throw Error('invalid format: ' + e);
      return new t4({
        fill: t[1],
        align: t[2],
        sign: t[3],
        symbol: t[4],
        zero: t[5],
        width: t[6],
        comma: t[7],
        precision: t[8] && t[8].slice(1),
        trim: t[9],
        type: t[10],
      });
    }
    function t4(e) {
      ((this.fill = void 0 === e.fill ? ' ' : e.fill + ''),
        (this.align = void 0 === e.align ? '>' : e.align + ''),
        (this.sign = void 0 === e.sign ? '-' : e.sign + ''),
        (this.symbol = void 0 === e.symbol ? '' : e.symbol + ''),
        (this.zero = !!e.zero),
        (this.width = void 0 === e.width ? void 0 : +e.width),
        (this.comma = !!e.comma),
        (this.precision = void 0 === e.precision ? void 0 : +e.precision),
        (this.trim = !!e.trim),
        (this.type = void 0 === e.type ? '' : e.type + ''));
    }
    function t5(e, t) {
      var r = tJ(e, t);
      if (!r) return e + '';
      var n = r[0],
        i = r[1];
      return i < 0
        ? '0.' + Array(-i).join('0') + n
        : n.length > i + 1
          ? n.slice(0, i + 1) + '.' + n.slice(i + 1)
          : n + Array(i - n.length + 2).join('0');
    }
    ((t2.prototype = t4.prototype),
      (t4.prototype.toString = function () {
        return (
          this.fill +
          this.align +
          this.sign +
          this.symbol +
          (this.zero ? '0' : '') +
          (void 0 === this.width ? '' : Math.max(1, 0 | this.width)) +
          (this.comma ? ',' : '') +
          (void 0 === this.precision ? '' : '.' + Math.max(0, 0 | this.precision)) +
          (this.trim ? '~' : '') +
          this.type
        );
      }));
    let t3 = {
      '%': (e, t) => (100 * e).toFixed(t),
      b: (e) => Math.round(e).toString(2),
      c: (e) => e + '',
      d: function (e) {
        return Math.abs((e = Math.round(e))) >= 1e21
          ? e.toLocaleString('en').replace(/,/g, '')
          : e.toString(10);
      },
      e: (e, t) => e.toExponential(t),
      f: (e, t) => e.toFixed(t),
      g: (e, t) => e.toPrecision(t),
      o: (e) => Math.round(e).toString(8),
      p: (e, t) => t5(100 * e, t),
      r: t5,
      s: function (e, r) {
        var n = tJ(e, r);
        if (!n) return ((t = void 0), e.toPrecision(r));
        var i = n[0],
          a = n[1],
          o = a - (t = 3 * Math.max(-8, Math.min(8, Math.floor(a / 3)))) + 1,
          l = i.length;
        return o === l
          ? i
          : o > l
            ? i + Array(o - l + 1).join('0')
            : o > 0
              ? i.slice(0, o) + '.' + i.slice(o)
              : '0.' + Array(1 - o).join('0') + tJ(e, Math.max(0, r + o - 1))[0];
      },
      X: (e) => Math.round(e).toString(16).toUpperCase(),
      x: (e) => Math.round(e).toString(16),
    };
    function t6(e) {
      return e;
    }
    var t8 = Array.prototype.map,
      t9 = ['y', 'z', 'a', 'f', 'p', 'n', 'µ', 'm', '', 'k', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'];
    function t7(e, t, r, a) {
      var o,
        l,
        u = e5(e, t, r);
      switch ((a = t2(null == a ? ',f' : a)).type) {
        case 's':
          var c = Math.max(Math.abs(e), Math.abs(t));
          return (
            null != a.precision ||
              isNaN(
                (l = Math.max(
                  0,
                  3 * Math.max(-8, Math.min(8, Math.floor(t0(c) / 3))) - t0(Math.abs(u)),
                )),
              ) ||
              (a.precision = l),
            i(a, c)
          );
        case '':
        case 'e':
        case 'g':
        case 'p':
        case 'r':
          null != a.precision ||
            isNaN(
              (l =
                Math.max(
                  0,
                  t0(Math.abs(Math.max(Math.abs(e), Math.abs(t))) - (o = Math.abs((o = u)))) -
                    t0(o),
                ) + 1),
            ) ||
            (a.precision = l - ('e' === a.type));
          break;
        case 'f':
        case '%':
          null != a.precision ||
            isNaN((l = Math.max(0, -t0(Math.abs(u))))) ||
            (a.precision = l - ('%' === a.type) * 2);
      }
      return n(a);
    }
    function re(e) {
      var t = e.domain;
      return (
        (e.ticks = function (e) {
          var r = t();
          return e2(r[0], r[r.length - 1], null == e ? 10 : e);
        }),
        (e.tickFormat = function (e, r) {
          var n = t();
          return t7(n[0], n[n.length - 1], null == e ? 10 : e, r);
        }),
        (e.nice = function (r) {
          null == r && (r = 10);
          var n,
            i,
            a = t(),
            o = 0,
            l = a.length - 1,
            u = a[o],
            c = a[l],
            s = 10;
          for (c < u && ((i = u), (u = c), (c = i), (i = o), (o = l), (l = i)); s-- > 0; ) {
            if ((i = e4(u, c, r)) === n) return ((a[o] = u), (a[l] = c), t(a));
            if (i > 0) ((u = Math.floor(u / i) * i), (c = Math.ceil(c / i) * i));
            else if (i < 0) ((u = Math.ceil(u * i) / i), (c = Math.floor(c * i) / i));
            else break;
            n = i;
          }
          return e;
        }),
        e
      );
    }
    function rt() {
      var e = tQ();
      return (
        (e.copy = function () {
          return tG(e, rt());
        }),
        e$.apply(e, arguments),
        re(e)
      );
    }
    function rr(e) {
      var t;
      function r(e) {
        return null == e || isNaN((e *= 1)) ? t : e;
      }
      return (
        (r.invert = r),
        (r.domain = r.range =
          function (t) {
            return arguments.length ? ((e = Array.from(t, tV)), r) : e.slice();
          }),
        (r.unknown = function (e) {
          return arguments.length ? ((t = e), r) : t;
        }),
        (r.copy = function () {
          return rr(e).unknown(t);
        }),
        (e = arguments.length ? Array.from(e, tV) : [0, 1]),
        re(r)
      );
    }
    function rn(e, t) {
      e = e.slice();
      var r,
        n = 0,
        i = e.length - 1,
        a = e[n],
        o = e[i];
      return (
        o < a && ((r = n), (n = i), (i = r), (r = a), (a = o), (o = r)),
        (e[n] = t.floor(a)),
        (e[i] = t.ceil(o)),
        e
      );
    }
    function ri(e) {
      return Math.log(e);
    }
    function ra(e) {
      return Math.exp(e);
    }
    function ro(e) {
      return -Math.log(-e);
    }
    function rl(e) {
      return -Math.exp(-e);
    }
    function ru(e) {
      return isFinite(e) ? +('1e' + e) : e < 0 ? 0 : e;
    }
    function rc(e) {
      return (t, r) => -e(-t, r);
    }
    function rs(e) {
      let t,
        r,
        i = e(ri, ra),
        a = i.domain,
        o = 10;
      function l() {
        var n, l;
        return (
          (t =
            (n = o) === Math.E
              ? Math.log
              : (10 === n && Math.log10) ||
                (2 === n && Math.log2) ||
                ((n = Math.log(n)), (e) => Math.log(e) / n)),
          (r = 10 === (l = o) ? ru : l === Math.E ? Math.exp : (e) => Math.pow(l, e)),
          a()[0] < 0 ? ((t = rc(t)), (r = rc(r)), e(ro, rl)) : e(ri, ra),
          i
        );
      }
      return (
        (i.base = function (e) {
          return arguments.length ? ((o = +e), l()) : o;
        }),
        (i.domain = function (e) {
          return arguments.length ? (a(e), l()) : a();
        }),
        (i.ticks = (e) => {
          let n,
            i,
            l = a(),
            u = l[0],
            c = l[l.length - 1],
            s = c < u;
          s && ([u, c] = [c, u]);
          let f = t(u),
            d = t(c),
            p = null == e ? 10 : +e,
            h = [];
          if (!(o % 1) && d - f < p) {
            if (((f = Math.floor(f)), (d = Math.ceil(d)), u > 0)) {
              for (; f <= d; ++f)
                for (n = 1; n < o; ++n)
                  if (!((i = f < 0 ? n / r(-f) : n * r(f)) < u)) {
                    if (i > c) break;
                    h.push(i);
                  }
            } else
              for (; f <= d; ++f)
                for (n = o - 1; n >= 1; --n)
                  if (!((i = f > 0 ? n / r(-f) : n * r(f)) < u)) {
                    if (i > c) break;
                    h.push(i);
                  }
            2 * h.length < p && (h = e2(u, c, p));
          } else h = e2(f, d, Math.min(d - f, p)).map(r);
          return s ? h.reverse() : h;
        }),
        (i.tickFormat = (e, a) => {
          if (
            (null == e && (e = 10),
            null == a && (a = 10 === o ? 's' : ','),
            'function' != typeof a &&
              (o % 1 || null != (a = t2(a)).precision || (a.trim = !0), (a = n(a))),
            e === 1 / 0)
          )
            return a;
          let l = Math.max(1, (o * e) / i.ticks().length);
          return (e) => {
            let n = e / r(Math.round(t(e)));
            return (n * o < o - 0.5 && (n *= o), n <= l ? a(e) : '');
          };
        }),
        (i.nice = () =>
          a(rn(a(), { floor: (e) => r(Math.floor(t(e))), ceil: (e) => r(Math.ceil(t(e))) }))),
        i
      );
    }
    function rf() {
      let e = rs(tZ()).domain([1, 10]);
      return ((e.copy = () => tG(e, rf()).base(e.base())), e$.apply(e, arguments), e);
    }
    function rd(e) {
      return function (t) {
        return Math.sign(t) * Math.log1p(Math.abs(t / e));
      };
    }
    function rp(e) {
      return function (t) {
        return Math.sign(t) * Math.expm1(Math.abs(t)) * e;
      };
    }
    function rh(e) {
      var t = 1,
        r = e(rd(1), rp(t));
      return (
        (r.constant = function (r) {
          return arguments.length ? e(rd((t = +r)), rp(t)) : t;
        }),
        re(r)
      );
    }
    function rv() {
      var e = rh(tZ());
      return (
        (e.copy = function () {
          return tG(e, rv()).constant(e.constant());
        }),
        e$.apply(e, arguments)
      );
    }
    function ry(e) {
      return function (t) {
        return t < 0 ? -Math.pow(-t, e) : Math.pow(t, e);
      };
    }
    function rg(e) {
      return e < 0 ? -Math.sqrt(-e) : Math.sqrt(e);
    }
    function rm(e) {
      return e < 0 ? -e * e : e * e;
    }
    function rb(e) {
      var t = e(tH, tH),
        r = 1;
      return (
        (t.exponent = function (t) {
          return arguments.length
            ? 1 == (r = +t)
              ? e(tH, tH)
              : 0.5 === r
                ? e(rg, rm)
                : e(ry(r), ry(1 / r))
            : r;
        }),
        re(t)
      );
    }
    function rx() {
      var e = rb(tZ());
      return (
        (e.copy = function () {
          return tG(e, rx()).exponent(e.exponent());
        }),
        e$.apply(e, arguments),
        e
      );
    }
    function rw() {
      return rx.apply(null, arguments).exponent(0.5);
    }
    function rO(e) {
      return Math.sign(e) * e * e;
    }
    function rS() {
      var e,
        t = tQ(),
        r = [0, 1],
        n = !1;
      function i(r) {
        var i,
          a = Math.sign((i = t(r))) * Math.sqrt(Math.abs(i));
        return isNaN(a) ? e : n ? Math.round(a) : a;
      }
      return (
        (i.invert = function (e) {
          return t.invert(rO(e));
        }),
        (i.domain = function (e) {
          return arguments.length ? (t.domain(e), i) : t.domain();
        }),
        (i.range = function (e) {
          return arguments.length ? (t.range((r = Array.from(e, tV)).map(rO)), i) : r.slice();
        }),
        (i.rangeRound = function (e) {
          return i.range(e).round(!0);
        }),
        (i.round = function (e) {
          return arguments.length ? ((n = !!e), i) : n;
        }),
        (i.clamp = function (e) {
          return arguments.length ? (t.clamp(e), i) : t.clamp();
        }),
        (i.unknown = function (t) {
          return arguments.length ? ((e = t), i) : e;
        }),
        (i.copy = function () {
          return rS(t.domain(), r).round(n).clamp(t.clamp()).unknown(e);
        }),
        e$.apply(i, arguments),
        re(i)
      );
    }
    function rA(e, t) {
      let r;
      if (void 0 === t)
        for (let t of e) null != t && (r < t || (void 0 === r && t >= t)) && (r = t);
      else {
        let n = -1;
        for (let i of e)
          null != (i = t(i, ++n, e)) && (r < i || (void 0 === r && i >= i)) && (r = i);
      }
      return r;
    }
    function rP(e, t) {
      let r;
      if (void 0 === t)
        for (let t of e) null != t && (r > t || (void 0 === r && t >= t)) && (r = t);
      else {
        let n = -1;
        for (let i of e)
          null != (i = t(i, ++n, e)) && (r > i || (void 0 === r && i >= i)) && (r = i);
      }
      return r;
    }
    function r_(e, t) {
      return (null == e || !(e >= e)) - (null == t || !(t >= t)) || (e < t ? -1 : +(e > t));
    }
    function rE(e, t, r) {
      let n = e[t];
      ((e[t] = e[r]), (e[r] = n));
    }
    function rj() {
      var e,
        t = [],
        r = [],
        n = [];
      function i() {
        var e = 0,
          i = Math.max(1, r.length);
        for (n = Array(i - 1); ++e < i; )
          n[e - 1] = (function (e, t, r = e7) {
            if (!(!(n = e.length) || isNaN((t *= 1)))) {
              if (t <= 0 || n < 2) return +r(e[0], 0, e);
              if (t >= 1) return +r(e[n - 1], n - 1, e);
              var n,
                i = (n - 1) * t,
                a = Math.floor(i),
                o = +r(e[a], a, e);
              return o + (r(e[a + 1], a + 1, e) - o) * (i - a);
            }
          })(t, e / i);
        return a;
      }
      function a(t) {
        return null == t || isNaN((t *= 1)) ? e : r[tt(n, t)];
      }
      return (
        (a.invertExtent = function (e) {
          var i = r.indexOf(e);
          return i < 0
            ? [NaN, NaN]
            : [i > 0 ? n[i - 1] : t[0], i < n.length ? n[i] : t[t.length - 1]];
        }),
        (a.domain = function (e) {
          if (!arguments.length) return t.slice();
          for (let r of ((t = []), e)) null == r || isNaN((r *= 1)) || t.push(r);
          return (t.sort(e3), i());
        }),
        (a.range = function (e) {
          return arguments.length ? ((r = Array.from(e)), i()) : r.slice();
        }),
        (a.unknown = function (t) {
          return arguments.length ? ((e = t), a) : e;
        }),
        (a.quantiles = function () {
          return n.slice();
        }),
        (a.copy = function () {
          return rj().domain(t).range(r).unknown(e);
        }),
        e$.apply(a, arguments)
      );
    }
    function rC() {
      var e,
        t = 0,
        r = 1,
        n = 1,
        i = [0.5],
        a = [0, 1];
      function o(t) {
        return null != t && t <= t ? a[tt(i, t, 0, n)] : e;
      }
      function l() {
        var e = -1;
        for (i = Array(n); ++e < n; ) i[e] = ((e + 1) * r - (e - n) * t) / (n + 1);
        return o;
      }
      return (
        (o.domain = function (e) {
          return arguments.length ? (([t, r] = e), (t *= 1), (r *= 1), l()) : [t, r];
        }),
        (o.range = function (e) {
          return arguments.length ? ((n = (a = Array.from(e)).length - 1), l()) : a.slice();
        }),
        (o.invertExtent = function (e) {
          var o = a.indexOf(e);
          return o < 0 ? [NaN, NaN] : o < 1 ? [t, i[0]] : o >= n ? [i[n - 1], r] : [i[o - 1], i[o]];
        }),
        (o.unknown = function (t) {
          return (arguments.length && (e = t), o);
        }),
        (o.thresholds = function () {
          return i.slice();
        }),
        (o.copy = function () {
          return rC().domain([t, r]).range(a).unknown(e);
        }),
        e$.apply(re(o), arguments)
      );
    }
    function rM() {
      var e,
        t = [0.5],
        r = [0, 1],
        n = 1;
      function i(i) {
        return null != i && i <= i ? r[tt(t, i, 0, n)] : e;
      }
      return (
        (i.domain = function (e) {
          return arguments.length
            ? ((n = Math.min((t = Array.from(e)).length, r.length - 1)), i)
            : t.slice();
        }),
        (i.range = function (e) {
          return arguments.length
            ? ((r = Array.from(e)), (n = Math.min(t.length, r.length - 1)), i)
            : r.slice();
        }),
        (i.invertExtent = function (e) {
          var n = r.indexOf(e);
          return [t[n - 1], t[n]];
        }),
        (i.unknown = function (t) {
          return arguments.length ? ((e = t), i) : e;
        }),
        (i.copy = function () {
          return rM().domain(t).range(r).unknown(e);
        }),
        e$.apply(i, arguments)
      );
    }
    ((n = (r = (function (e) {
      var r,
        n,
        i,
        a =
          void 0 === e.grouping || void 0 === e.thousands
            ? t6
            : ((r = t8.call(e.grouping, Number)),
              (n = e.thousands + ''),
              function (e, t) {
                for (
                  var i = e.length, a = [], o = 0, l = r[0], u = 0;
                  i > 0 &&
                  l > 0 &&
                  (u + l + 1 > t && (l = Math.max(1, t - u)),
                  a.push(e.substring((i -= l), i + l)),
                  !((u += l + 1) > t));
                )
                  l = r[(o = (o + 1) % r.length)];
                return a.reverse().join(n);
              }),
        o = void 0 === e.currency ? '' : e.currency[0] + '',
        l = void 0 === e.currency ? '' : e.currency[1] + '',
        u = void 0 === e.decimal ? '.' : e.decimal + '',
        c =
          void 0 === e.numerals
            ? t6
            : ((i = t8.call(e.numerals, String)),
              function (e) {
                return e.replace(/[0-9]/g, function (e) {
                  return i[+e];
                });
              }),
        s = void 0 === e.percent ? '%' : e.percent + '',
        f = void 0 === e.minus ? '−' : e.minus + '',
        d = void 0 === e.nan ? 'NaN' : e.nan + '';
      function p(e, r) {
        var n = (e = t2(e)).fill,
          i = e.align,
          p = e.sign,
          h = e.symbol,
          v = e.zero,
          y = e.width,
          g = e.comma,
          m = e.precision,
          b = e.trim,
          x = e.type;
        ('n' === x
          ? ((g = !0), (x = 'g'))
          : t3[x] || (void 0 === m && (m = 12), (b = !0), (x = 'g')),
          (v || ('0' === n && '=' === i)) && ((v = !0), (n = '0'), (i = '=')));
        var w =
            (r && void 0 !== r.prefix ? r.prefix : '') +
            ('$' === h ? o : '#' === h && /[boxX]/.test(x) ? '0' + x.toLowerCase() : ''),
          O =
            ('$' === h ? l : /[%p]/.test(x) ? s : '') + (r && void 0 !== r.suffix ? r.suffix : ''),
          S = t3[x],
          A = /[defgprs%]/.test(x);
        function P(e) {
          var r,
            o,
            l,
            s = w,
            h = O;
          if ('c' === x) ((h = S(e) + h), (e = ''));
          else {
            var P = (e *= 1) < 0 || 1 / e < 0;
            if (
              ((e = isNaN(e) ? d : S(Math.abs(e), m)),
              b &&
                (e = (function (e) {
                  e: for (var t, r = e.length, n = 1, i = -1; n < r; ++n)
                    switch (e[n]) {
                      case '.':
                        i = t = n;
                        break;
                      case '0':
                        (0 === i && (i = n), (t = n));
                        break;
                      default:
                        if (!+e[n]) break e;
                        i > 0 && (i = 0);
                    }
                  return i > 0 ? e.slice(0, i) + e.slice(t + 1) : e;
                })(e)),
              P && 0 == +e && '+' !== p && (P = !1),
              (s = (P ? ('(' === p ? p : f) : '-' === p || '(' === p ? '' : p) + s),
              (h =
                ('s' !== x || isNaN(e) || void 0 === t ? '' : t9[8 + t / 3]) +
                h +
                (P && '(' === p ? ')' : '')),
              A)
            ) {
              for (r = -1, o = e.length; ++r < o; )
                if (48 > (l = e.charCodeAt(r)) || l > 57) {
                  ((h = (46 === l ? u + e.slice(r + 1) : e.slice(r)) + h), (e = e.slice(0, r)));
                  break;
                }
            }
          }
          g && !v && (e = a(e, 1 / 0));
          var _ = s.length + e.length + h.length,
            E = _ < y ? Array(y - _ + 1).join(n) : '';
          switch ((g && v && ((e = a(E + e, E.length ? y - h.length : 1 / 0)), (E = '')), i)) {
            case '<':
              e = s + e + h + E;
              break;
            case '=':
              e = s + E + e + h;
              break;
            case '^':
              e = E.slice(0, (_ = E.length >> 1)) + s + e + h + E.slice(_);
              break;
            default:
              e = E + s + e + h;
          }
          return c(e);
        }
        return (
          (m =
            void 0 === m
              ? 6
              : /[gprs]/.test(x)
                ? Math.max(1, Math.min(21, m))
                : Math.max(0, Math.min(20, m))),
          (P.toString = function () {
            return e + '';
          }),
          P
        );
      }
      return {
        format: p,
        formatPrefix: function (e, t) {
          var r = 3 * Math.max(-8, Math.min(8, Math.floor(t0(t) / 3))),
            n = Math.pow(10, -r),
            i = p((((e = t2(e)).type = 'f'), e), { suffix: t9[8 + r / 3] });
          return function (e) {
            return i(n * e);
          };
        },
      };
    })({ thousands: ',', grouping: [3], currency: ['$', ''] })).format),
      (i = r.formatPrefix));
    let rk = new Date(),
      rT = new Date();
    function rD(e, t, r, n) {
      function i(t) {
        return (e((t = 0 == arguments.length ? new Date() : new Date(+t))), t);
      }
      return (
        (i.floor = (t) => (e((t = new Date(+t))), t)),
        (i.ceil = (r) => (e((r = new Date(r - 1))), t(r, 1), e(r), r)),
        (i.round = (e) => {
          let t = i(e),
            r = i.ceil(e);
          return e - t < r - e ? t : r;
        }),
        (i.offset = (e, r) => (t((e = new Date(+e)), null == r ? 1 : Math.floor(r)), e)),
        (i.range = (r, n, a) => {
          let o,
            l = [];
          if (((r = i.ceil(r)), (a = null == a ? 1 : Math.floor(a)), !(r < n) || !(a > 0)))
            return l;
          do (l.push((o = new Date(+r))), t(r, a), e(r));
          while (o < r && r < n);
          return l;
        }),
        (i.filter = (r) =>
          rD(
            (t) => {
              if (t >= t) for (; e(t), !r(t); ) t.setTime(t - 1);
            },
            (e, n) => {
              if (e >= e)
                if (n < 0) for (; ++n <= 0; ) for (; t(e, -1), !r(e); );
                else for (; --n >= 0; ) for (; t(e, 1), !r(e); );
            },
          )),
        r &&
          ((i.count = (t, n) => (
            rk.setTime(+t),
            rT.setTime(+n),
            e(rk),
            e(rT),
            Math.floor(r(rk, rT))
          )),
          (i.every = (e) =>
            isFinite((e = Math.floor(e))) && e > 0
              ? e > 1
                ? i.filter(n ? (t) => n(t) % e == 0 : (t) => i.count(0, t) % e == 0)
                : i
              : null)),
        i
      );
    }
    let rN = rD(
      (e) => {
        (e.setMonth(0, 1), e.setHours(0, 0, 0, 0));
      },
      (e, t) => {
        e.setFullYear(e.getFullYear() + t);
      },
      (e, t) => t.getFullYear() - e.getFullYear(),
      (e) => e.getFullYear(),
    );
    ((rN.every = (e) =>
      isFinite((e = Math.floor(e))) && e > 0
        ? rD(
            (t) => {
              (t.setFullYear(Math.floor(t.getFullYear() / e) * e),
                t.setMonth(0, 1),
                t.setHours(0, 0, 0, 0));
            },
            (t, r) => {
              t.setFullYear(t.getFullYear() + r * e);
            },
          )
        : null),
      rN.range);
    let rI = rD(
      (e) => {
        (e.setUTCMonth(0, 1), e.setUTCHours(0, 0, 0, 0));
      },
      (e, t) => {
        e.setUTCFullYear(e.getUTCFullYear() + t);
      },
      (e, t) => t.getUTCFullYear() - e.getUTCFullYear(),
      (e) => e.getUTCFullYear(),
    );
    ((rI.every = (e) =>
      isFinite((e = Math.floor(e))) && e > 0
        ? rD(
            (t) => {
              (t.setUTCFullYear(Math.floor(t.getUTCFullYear() / e) * e),
                t.setUTCMonth(0, 1),
                t.setUTCHours(0, 0, 0, 0));
            },
            (t, r) => {
              t.setUTCFullYear(t.getUTCFullYear() + r * e);
            },
          )
        : null),
      rI.range);
    let rL = rD(
      (e) => {
        (e.setDate(1), e.setHours(0, 0, 0, 0));
      },
      (e, t) => {
        e.setMonth(e.getMonth() + t);
      },
      (e, t) => t.getMonth() - e.getMonth() + (t.getFullYear() - e.getFullYear()) * 12,
      (e) => e.getMonth(),
    );
    rL.range;
    let rR = rD(
      (e) => {
        (e.setUTCDate(1), e.setUTCHours(0, 0, 0, 0));
      },
      (e, t) => {
        e.setUTCMonth(e.getUTCMonth() + t);
      },
      (e, t) => t.getUTCMonth() - e.getUTCMonth() + (t.getUTCFullYear() - e.getUTCFullYear()) * 12,
      (e) => e.getUTCMonth(),
    );
    rR.range;
    function rB(e) {
      return rD(
        (t) => {
          (t.setDate(t.getDate() - ((t.getDay() + 7 - e) % 7)), t.setHours(0, 0, 0, 0));
        },
        (e, t) => {
          e.setDate(e.getDate() + 7 * t);
        },
        (e, t) => (t - e - (t.getTimezoneOffset() - e.getTimezoneOffset()) * 6e4) / 6048e5,
      );
    }
    let rz = rB(0),
      rF = rB(1),
      rU = rB(2),
      rW = rB(3),
      r$ = rB(4),
      rV = rB(5),
      rK = rB(6);
    function rH(e) {
      return rD(
        (t) => {
          (t.setUTCDate(t.getUTCDate() - ((t.getUTCDay() + 7 - e) % 7)), t.setUTCHours(0, 0, 0, 0));
        },
        (e, t) => {
          e.setUTCDate(e.getUTCDate() + 7 * t);
        },
        (e, t) => (t - e) / 6048e5,
      );
    }
    (rz.range, rF.range, rU.range, rW.range, r$.range, rV.range, rK.range);
    let rq = rH(0),
      rY = rH(1),
      rX = rH(2),
      rG = rH(3),
      rZ = rH(4),
      rQ = rH(5),
      rJ = rH(6);
    (rq.range, rY.range, rX.range, rG.range, rZ.range, rQ.range, rJ.range);
    let r0 = rD(
      (e) => e.setHours(0, 0, 0, 0),
      (e, t) => e.setDate(e.getDate() + t),
      (e, t) => (t - e - (t.getTimezoneOffset() - e.getTimezoneOffset()) * 6e4) / 864e5,
      (e) => e.getDate() - 1,
    );
    r0.range;
    let r1 = rD(
      (e) => {
        e.setUTCHours(0, 0, 0, 0);
      },
      (e, t) => {
        e.setUTCDate(e.getUTCDate() + t);
      },
      (e, t) => (t - e) / 864e5,
      (e) => e.getUTCDate() - 1,
    );
    r1.range;
    let r2 = rD(
      (e) => {
        e.setUTCHours(0, 0, 0, 0);
      },
      (e, t) => {
        e.setUTCDate(e.getUTCDate() + t);
      },
      (e, t) => (t - e) / 864e5,
      (e) => Math.floor(e / 864e5),
    );
    r2.range;
    let r4 = rD(
      (e) => {
        e.setTime(e - e.getMilliseconds() - 1e3 * e.getSeconds() - 6e4 * e.getMinutes());
      },
      (e, t) => {
        e.setTime(+e + 36e5 * t);
      },
      (e, t) => (t - e) / 36e5,
      (e) => e.getHours(),
    );
    r4.range;
    let r5 = rD(
      (e) => {
        e.setUTCMinutes(0, 0, 0);
      },
      (e, t) => {
        e.setTime(+e + 36e5 * t);
      },
      (e, t) => (t - e) / 36e5,
      (e) => e.getUTCHours(),
    );
    r5.range;
    let r3 = rD(
      (e) => {
        e.setTime(e - e.getMilliseconds() - 1e3 * e.getSeconds());
      },
      (e, t) => {
        e.setTime(+e + 6e4 * t);
      },
      (e, t) => (t - e) / 6e4,
      (e) => e.getMinutes(),
    );
    r3.range;
    let r6 = rD(
      (e) => {
        e.setUTCSeconds(0, 0);
      },
      (e, t) => {
        e.setTime(+e + 6e4 * t);
      },
      (e, t) => (t - e) / 6e4,
      (e) => e.getUTCMinutes(),
    );
    r6.range;
    let r8 = rD(
      (e) => {
        e.setTime(e - e.getMilliseconds());
      },
      (e, t) => {
        e.setTime(+e + 1e3 * t);
      },
      (e, t) => (t - e) / 1e3,
      (e) => e.getUTCSeconds(),
    );
    r8.range;
    let r9 = rD(
      () => {},
      (e, t) => {
        e.setTime(+e + t);
      },
      (e, t) => t - e,
    );
    function r7(e, t, r, n, i, a) {
      let o = [
        [r8, 1, 1e3],
        [r8, 5, 5e3],
        [r8, 15, 15e3],
        [r8, 30, 3e4],
        [a, 1, 6e4],
        [a, 5, 3e5],
        [a, 15, 9e5],
        [a, 30, 18e5],
        [i, 1, 36e5],
        [i, 3, 108e5],
        [i, 6, 216e5],
        [i, 12, 432e5],
        [n, 1, 864e5],
        [n, 2, 1728e5],
        [r, 1, 6048e5],
        [t, 1, 2592e6],
        [t, 3, 7776e6],
        [e, 1, 31536e6],
      ];
      function l(t, r, n) {
        let i = Math.abs(r - t) / n,
          a = e8(([, , e]) => e).right(o, i);
        if (a === o.length) return e.every(e5(t / 31536e6, r / 31536e6, n));
        if (0 === a) return r9.every(Math.max(e5(t, r, n), 1));
        let [l, u] = o[i / o[a - 1][2] < o[a][2] / i ? a - 1 : a];
        return l.every(u);
      }
      return [
        function (e, t, r) {
          let n = t < e;
          n && ([e, t] = [t, e]);
          let i = r && 'function' == typeof r.range ? r : l(e, t, r),
            a = i ? i.range(e, +t + 1) : [];
          return n ? a.reverse() : a;
        },
        l,
      ];
    }
    ((r9.every = (e) =>
      isFinite((e = Math.floor(e))) && e > 0
        ? e > 1
          ? rD(
              (t) => {
                t.setTime(Math.floor(t / e) * e);
              },
              (t, r) => {
                t.setTime(+t + r * e);
              },
              (t, r) => (r - t) / e,
            )
          : r9
        : null),
      r9.range);
    let [ne, nt] = r7(rI, rR, rq, r2, r5, r6),
      [nr, nn] = r7(rN, rL, rz, r0, r4, r3);
    function ni(e) {
      if (0 <= e.y && e.y < 100) {
        var t = new Date(-1, e.m, e.d, e.H, e.M, e.S, e.L);
        return (t.setFullYear(e.y), t);
      }
      return new Date(e.y, e.m, e.d, e.H, e.M, e.S, e.L);
    }
    function na(e) {
      if (0 <= e.y && e.y < 100) {
        var t = new Date(Date.UTC(-1, e.m, e.d, e.H, e.M, e.S, e.L));
        return (t.setUTCFullYear(e.y), t);
      }
      return new Date(Date.UTC(e.y, e.m, e.d, e.H, e.M, e.S, e.L));
    }
    function no(e, t, r) {
      return { y: e, m: t, d: r, H: 0, M: 0, S: 0, L: 0 };
    }
    var nl = { '-': '', _: ' ', 0: '0' },
      nu = /^\s*\d+/,
      nc = /^%/,
      ns = /[\\^$*+?|[\]().{}]/g;
    function nf(e, t, r) {
      var n = e < 0 ? '-' : '',
        i = (n ? -e : e) + '',
        a = i.length;
      return n + (a < r ? Array(r - a + 1).join(t) + i : i);
    }
    function nd(e) {
      return e.replace(ns, '\\$&');
    }
    function np(e) {
      return RegExp('^(?:' + e.map(nd).join('|') + ')', 'i');
    }
    function nh(e) {
      return new Map(e.map((e, t) => [e.toLowerCase(), t]));
    }
    function nv(e, t, r) {
      var n = nu.exec(t.slice(r, r + 1));
      return n ? ((e.w = +n[0]), r + n[0].length) : -1;
    }
    function ny(e, t, r) {
      var n = nu.exec(t.slice(r, r + 1));
      return n ? ((e.u = +n[0]), r + n[0].length) : -1;
    }
    function ng(e, t, r) {
      var n = nu.exec(t.slice(r, r + 2));
      return n ? ((e.U = +n[0]), r + n[0].length) : -1;
    }
    function nm(e, t, r) {
      var n = nu.exec(t.slice(r, r + 2));
      return n ? ((e.V = +n[0]), r + n[0].length) : -1;
    }
    function nb(e, t, r) {
      var n = nu.exec(t.slice(r, r + 2));
      return n ? ((e.W = +n[0]), r + n[0].length) : -1;
    }
    function nx(e, t, r) {
      var n = nu.exec(t.slice(r, r + 4));
      return n ? ((e.y = +n[0]), r + n[0].length) : -1;
    }
    function nw(e, t, r) {
      var n = nu.exec(t.slice(r, r + 2));
      return n ? ((e.y = +n[0] + (+n[0] > 68 ? 1900 : 2e3)), r + n[0].length) : -1;
    }
    function nO(e, t, r) {
      var n = /^(Z)|([+-]\d\d)(?::?(\d\d))?/.exec(t.slice(r, r + 6));
      return n ? ((e.Z = n[1] ? 0 : -(n[2] + (n[3] || '00'))), r + n[0].length) : -1;
    }
    function nS(e, t, r) {
      var n = nu.exec(t.slice(r, r + 1));
      return n ? ((e.q = 3 * n[0] - 3), r + n[0].length) : -1;
    }
    function nA(e, t, r) {
      var n = nu.exec(t.slice(r, r + 2));
      return n ? ((e.m = n[0] - 1), r + n[0].length) : -1;
    }
    function nP(e, t, r) {
      var n = nu.exec(t.slice(r, r + 2));
      return n ? ((e.d = +n[0]), r + n[0].length) : -1;
    }
    function n_(e, t, r) {
      var n = nu.exec(t.slice(r, r + 3));
      return n ? ((e.m = 0), (e.d = +n[0]), r + n[0].length) : -1;
    }
    function nE(e, t, r) {
      var n = nu.exec(t.slice(r, r + 2));
      return n ? ((e.H = +n[0]), r + n[0].length) : -1;
    }
    function nj(e, t, r) {
      var n = nu.exec(t.slice(r, r + 2));
      return n ? ((e.M = +n[0]), r + n[0].length) : -1;
    }
    function nC(e, t, r) {
      var n = nu.exec(t.slice(r, r + 2));
      return n ? ((e.S = +n[0]), r + n[0].length) : -1;
    }
    function nM(e, t, r) {
      var n = nu.exec(t.slice(r, r + 3));
      return n ? ((e.L = +n[0]), r + n[0].length) : -1;
    }
    function nk(e, t, r) {
      var n = nu.exec(t.slice(r, r + 6));
      return n ? ((e.L = Math.floor(n[0] / 1e3)), r + n[0].length) : -1;
    }
    function nT(e, t, r) {
      var n = nc.exec(t.slice(r, r + 1));
      return n ? r + n[0].length : -1;
    }
    function nD(e, t, r) {
      var n = nu.exec(t.slice(r));
      return n ? ((e.Q = +n[0]), r + n[0].length) : -1;
    }
    function nN(e, t, r) {
      var n = nu.exec(t.slice(r));
      return n ? ((e.s = +n[0]), r + n[0].length) : -1;
    }
    function nI(e, t) {
      return nf(e.getDate(), t, 2);
    }
    function nL(e, t) {
      return nf(e.getHours(), t, 2);
    }
    function nR(e, t) {
      return nf(e.getHours() % 12 || 12, t, 2);
    }
    function nB(e, t) {
      return nf(1 + r0.count(rN(e), e), t, 3);
    }
    function nz(e, t) {
      return nf(e.getMilliseconds(), t, 3);
    }
    function nF(e, t) {
      return nz(e, t) + '000';
    }
    function nU(e, t) {
      return nf(e.getMonth() + 1, t, 2);
    }
    function nW(e, t) {
      return nf(e.getMinutes(), t, 2);
    }
    function n$(e, t) {
      return nf(e.getSeconds(), t, 2);
    }
    function nV(e) {
      var t = e.getDay();
      return 0 === t ? 7 : t;
    }
    function nK(e, t) {
      return nf(rz.count(rN(e) - 1, e), t, 2);
    }
    function nH(e) {
      var t = e.getDay();
      return t >= 4 || 0 === t ? r$(e) : r$.ceil(e);
    }
    function nq(e, t) {
      return ((e = nH(e)), nf(r$.count(rN(e), e) + (4 === rN(e).getDay()), t, 2));
    }
    function nY(e) {
      return e.getDay();
    }
    function nX(e, t) {
      return nf(rF.count(rN(e) - 1, e), t, 2);
    }
    function nG(e, t) {
      return nf(e.getFullYear() % 100, t, 2);
    }
    function nZ(e, t) {
      return nf((e = nH(e)).getFullYear() % 100, t, 2);
    }
    function nQ(e, t) {
      return nf(e.getFullYear() % 1e4, t, 4);
    }
    function nJ(e, t) {
      var r = e.getDay();
      return nf((e = r >= 4 || 0 === r ? r$(e) : r$.ceil(e)).getFullYear() % 1e4, t, 4);
    }
    function n0(e) {
      var t = e.getTimezoneOffset();
      return (t > 0 ? '-' : ((t *= -1), '+')) + nf((t / 60) | 0, '0', 2) + nf(t % 60, '0', 2);
    }
    function n1(e, t) {
      return nf(e.getUTCDate(), t, 2);
    }
    function n2(e, t) {
      return nf(e.getUTCHours(), t, 2);
    }
    function n4(e, t) {
      return nf(e.getUTCHours() % 12 || 12, t, 2);
    }
    function n5(e, t) {
      return nf(1 + r1.count(rI(e), e), t, 3);
    }
    function n3(e, t) {
      return nf(e.getUTCMilliseconds(), t, 3);
    }
    function n6(e, t) {
      return n3(e, t) + '000';
    }
    function n8(e, t) {
      return nf(e.getUTCMonth() + 1, t, 2);
    }
    function n9(e, t) {
      return nf(e.getUTCMinutes(), t, 2);
    }
    function n7(e, t) {
      return nf(e.getUTCSeconds(), t, 2);
    }
    function ie(e) {
      var t = e.getUTCDay();
      return 0 === t ? 7 : t;
    }
    function it(e, t) {
      return nf(rq.count(rI(e) - 1, e), t, 2);
    }
    function ir(e) {
      var t = e.getUTCDay();
      return t >= 4 || 0 === t ? rZ(e) : rZ.ceil(e);
    }
    function ii(e, t) {
      return ((e = ir(e)), nf(rZ.count(rI(e), e) + (4 === rI(e).getUTCDay()), t, 2));
    }
    function ia(e) {
      return e.getUTCDay();
    }
    function io(e, t) {
      return nf(rY.count(rI(e) - 1, e), t, 2);
    }
    function il(e, t) {
      return nf(e.getUTCFullYear() % 100, t, 2);
    }
    function iu(e, t) {
      return nf((e = ir(e)).getUTCFullYear() % 100, t, 2);
    }
    function ic(e, t) {
      return nf(e.getUTCFullYear() % 1e4, t, 4);
    }
    function is(e, t) {
      var r = e.getUTCDay();
      return nf((e = r >= 4 || 0 === r ? rZ(e) : rZ.ceil(e)).getUTCFullYear() % 1e4, t, 4);
    }
    function id() {
      return '+0000';
    }
    function ip() {
      return '%';
    }
    function ih(e) {
      return +e;
    }
    function iv(e) {
      return Math.floor(e / 1e3);
    }
    function iy(e) {
      return new Date(e);
    }
    function ig(e) {
      return e instanceof Date ? +e : +new Date(+e);
    }
    function im(e, t, r, n, i, a, o, l, u, c) {
      var s = tQ(),
        f = s.invert,
        d = s.domain,
        p = c('.%L'),
        h = c(':%S'),
        v = c('%I:%M'),
        y = c('%I %p'),
        g = c('%a %d'),
        m = c('%b %d'),
        b = c('%B'),
        x = c('%Y');
      function w(e) {
        return (
          u(e) < e
            ? p
            : l(e) < e
              ? h
              : o(e) < e
                ? v
                : a(e) < e
                  ? y
                  : n(e) < e
                    ? i(e) < e
                      ? g
                      : m
                    : r(e) < e
                      ? b
                      : x
        )(e);
      }
      return (
        (s.invert = function (e) {
          return new Date(f(e));
        }),
        (s.domain = function (e) {
          return arguments.length ? d(Array.from(e, ig)) : d().map(iy);
        }),
        (s.ticks = function (t) {
          var r = d();
          return e(r[0], r[r.length - 1], null == t ? 10 : t);
        }),
        (s.tickFormat = function (e, t) {
          return null == t ? w : c(t);
        }),
        (s.nice = function (e) {
          var r = d();
          return (
            (e && 'function' == typeof e.range) ||
              (e = t(r[0], r[r.length - 1], null == e ? 10 : e)),
            e ? d(rn(r, e)) : s
          );
        }),
        (s.copy = function () {
          return tG(s, im(e, t, r, n, i, a, o, l, u, c));
        }),
        s
      );
    }
    function ib() {
      return e$.apply(
        im(nr, nn, rN, rL, rz, r0, r4, r3, r8, o).domain([
          new Date(2e3, 0, 1),
          new Date(2e3, 0, 2),
        ]),
        arguments,
      );
    }
    function ix() {
      return e$.apply(
        im(ne, nt, rI, rR, rq, r1, r5, r6, r8, l).domain([
          Date.UTC(2e3, 0, 1),
          Date.UTC(2e3, 0, 2),
        ]),
        arguments,
      );
    }
    function iw() {
      var e,
        t,
        r,
        n,
        i,
        a = 0,
        o = 1,
        l = tH,
        u = !1;
      function c(t) {
        return null == t || isNaN((t *= 1))
          ? i
          : l(0 === r ? 0.5 : ((t = (n(t) - e) * r), u ? Math.max(0, Math.min(1, t)) : t));
      }
      function s(e) {
        return function (t) {
          var r, n;
          return arguments.length ? (([r, n] = t), (l = e(r, n)), c) : [l(0), l(1)];
        };
      }
      return (
        (c.domain = function (i) {
          return arguments.length
            ? (([a, o] = i),
              (e = n((a *= 1))),
              (t = n((o *= 1))),
              (r = e === t ? 0 : 1 / (t - e)),
              c)
            : [a, o];
        }),
        (c.clamp = function (e) {
          return arguments.length ? ((u = !!e), c) : u;
        }),
        (c.interpolator = function (e) {
          return arguments.length ? ((l = e), c) : l;
        }),
        (c.range = s(tW)),
        (c.rangeRound = s(t$)),
        (c.unknown = function (e) {
          return arguments.length ? ((i = e), c) : i;
        }),
        function (i) {
          return ((n = i), (e = i(a)), (t = i(o)), (r = e === t ? 0 : 1 / (t - e)), c);
        }
      );
    }
    function iO(e, t) {
      return t
        .domain(e.domain())
        .interpolator(e.interpolator())
        .clamp(e.clamp())
        .unknown(e.unknown());
    }
    function iS() {
      var e = re(iw()(tH));
      return (
        (e.copy = function () {
          return iO(e, iS());
        }),
        eV.apply(e, arguments)
      );
    }
    function iA() {
      var e = rs(iw()).domain([1, 10]);
      return (
        (e.copy = function () {
          return iO(e, iA()).base(e.base());
        }),
        eV.apply(e, arguments)
      );
    }
    function iP() {
      var e = rh(iw());
      return (
        (e.copy = function () {
          return iO(e, iP()).constant(e.constant());
        }),
        eV.apply(e, arguments)
      );
    }
    function i_() {
      var e = rb(iw());
      return (
        (e.copy = function () {
          return iO(e, i_()).exponent(e.exponent());
        }),
        eV.apply(e, arguments)
      );
    }
    function iE() {
      return i_.apply(null, arguments).exponent(0.5);
    }
    function ij() {
      var e = [],
        t = tH;
      function r(r) {
        if (null != r && !isNaN((r *= 1))) return t((tt(e, r, 1) - 1) / (e.length - 1));
      }
      return (
        (r.domain = function (t) {
          if (!arguments.length) return e.slice();
          for (let r of ((e = []), t)) null == r || isNaN((r *= 1)) || e.push(r);
          return (e.sort(e3), r);
        }),
        (r.interpolator = function (e) {
          return arguments.length ? ((t = e), r) : t;
        }),
        (r.range = function () {
          return e.map((r, n) => t(n / (e.length - 1)));
        }),
        (r.quantiles = function (t) {
          return Array.from({ length: t + 1 }, (r, n) =>
            (function (e, t) {
              if (
                !(
                  !(r = (e = Float64Array.from(
                    (function* (e, t) {
                      if (void 0 === t) for (let t of e) null != t && (t *= 1) >= t && (yield t);
                      else {
                        let r = -1;
                        for (let n of e) null != (n = t(n, ++r, e)) && (n *= 1) >= n && (yield n);
                      }
                    })(e, void 0),
                  )).length) || isNaN((t *= 1))
                )
              ) {
                if (t <= 0 || r < 2) return rP(e);
                if (t >= 1) return rA(e);
                var r,
                  n = (r - 1) * t,
                  i = Math.floor(n),
                  a = rA(
                    (function e(t, r, n = 0, i = 1 / 0, a) {
                      if (
                        ((r = Math.floor(r)),
                        (n = Math.floor(Math.max(0, n))),
                        (i = Math.floor(Math.min(t.length - 1, i))),
                        !(n <= r && r <= i))
                      )
                        return t;
                      for (
                        a =
                          void 0 === a
                            ? r_
                            : (function (e = e3) {
                                if (e === e3) return r_;
                                if ('function' != typeof e)
                                  throw TypeError('compare is not a function');
                                return (t, r) => {
                                  let n = e(t, r);
                                  return n || 0 === n ? n : (0 === e(r, r)) - (0 === e(t, t));
                                };
                              })(a);
                        i > n;
                      ) {
                        if (i - n > 600) {
                          let o = i - n + 1,
                            l = r - n + 1,
                            u = Math.log(o),
                            c = 0.5 * Math.exp((2 * u) / 3),
                            s = 0.5 * Math.sqrt((u * c * (o - c)) / o) * (l - o / 2 < 0 ? -1 : 1),
                            f = Math.max(n, Math.floor(r - (l * c) / o + s)),
                            d = Math.min(i, Math.floor(r + ((o - l) * c) / o + s));
                          e(t, r, f, d, a);
                        }
                        let o = t[r],
                          l = n,
                          u = i;
                        for (rE(t, n, r), a(t[i], o) > 0 && rE(t, n, i); l < u; ) {
                          for (rE(t, l, u), ++l, --u; 0 > a(t[l], o); ) ++l;
                          for (; a(t[u], o) > 0; ) --u;
                        }
                        (0 === a(t[n], o) ? rE(t, n, u) : rE(t, ++u, i),
                          u <= r && (n = u + 1),
                          r <= u && (i = u - 1));
                      }
                      return t;
                    })(e, i).subarray(0, i + 1),
                  );
                return a + (rP(e.subarray(i + 1)) - a) * (n - i);
              }
            })(e, n / t),
          );
        }),
        (r.copy = function () {
          return ij(t).domain(e);
        }),
        eV.apply(r, arguments)
      );
    }
    function iC() {
      var e,
        t,
        r,
        n,
        i,
        a,
        o,
        l = 0,
        u = 0.5,
        c = 1,
        s = 1,
        f = tH,
        d = !1;
      function p(e) {
        return isNaN((e *= 1))
          ? o
          : ((e = 0.5 + ((e = +a(e)) - t) * (s * e < s * t ? n : i)),
            f(d ? Math.max(0, Math.min(1, e)) : e));
      }
      function h(e) {
        return function (t) {
          var r, n, i;
          return arguments.length
            ? (([r, n, i] = t),
              (f = (function (e, t) {
                void 0 === t && ((t = e), (e = tW));
                for (var r = 0, n = t.length - 1, i = t[0], a = Array(n < 0 ? 0 : n); r < n; )
                  a[r] = e(i, (i = t[++r]));
                return function (e) {
                  var t = Math.max(0, Math.min(n - 1, Math.floor((e *= n))));
                  return a[t](e - t);
                };
              })(e, [r, n, i])),
              p)
            : [f(0), f(0.5), f(1)];
        };
      }
      return (
        (p.domain = function (o) {
          return arguments.length
            ? (([l, u, c] = o),
              (e = a((l *= 1))),
              (t = a((u *= 1))),
              (r = a((c *= 1))),
              (n = e === t ? 0 : 0.5 / (t - e)),
              (i = t === r ? 0 : 0.5 / (r - t)),
              (s = t < e ? -1 : 1),
              p)
            : [l, u, c];
        }),
        (p.clamp = function (e) {
          return arguments.length ? ((d = !!e), p) : d;
        }),
        (p.interpolator = function (e) {
          return arguments.length ? ((f = e), p) : f;
        }),
        (p.range = h(tW)),
        (p.rangeRound = h(t$)),
        (p.unknown = function (e) {
          return arguments.length ? ((o = e), p) : o;
        }),
        function (o) {
          return (
            (a = o),
            (e = o(l)),
            (t = o(u)),
            (r = o(c)),
            (n = e === t ? 0 : 0.5 / (t - e)),
            (i = t === r ? 0 : 0.5 / (r - t)),
            (s = t < e ? -1 : 1),
            p
          );
        }
      );
    }
    function iM() {
      var e = re(iC()(tH));
      return (
        (e.copy = function () {
          return iO(e, iM());
        }),
        eV.apply(e, arguments)
      );
    }
    function ik() {
      var e = rs(iC()).domain([0.1, 1, 10]);
      return (
        (e.copy = function () {
          return iO(e, ik()).base(e.base());
        }),
        eV.apply(e, arguments)
      );
    }
    function iT() {
      var e = rh(iC());
      return (
        (e.copy = function () {
          return iO(e, iT()).constant(e.constant());
        }),
        eV.apply(e, arguments)
      );
    }
    function iD() {
      var e = rb(iC());
      return (
        (e.copy = function () {
          return iO(e, iD()).exponent(e.exponent());
        }),
        eV.apply(e, arguments)
      );
    }
    function iN() {
      return iD.apply(null, arguments).exponent(0.5);
    }
    ((o = (a = (function (e) {
      var t = e.dateTime,
        r = e.date,
        n = e.time,
        i = e.periods,
        a = e.days,
        o = e.shortDays,
        l = e.months,
        u = e.shortMonths,
        c = np(i),
        s = nh(i),
        f = np(a),
        d = nh(a),
        p = np(o),
        h = nh(o),
        v = np(l),
        y = nh(l),
        g = np(u),
        m = nh(u),
        b = {
          a: function (e) {
            return o[e.getDay()];
          },
          A: function (e) {
            return a[e.getDay()];
          },
          b: function (e) {
            return u[e.getMonth()];
          },
          B: function (e) {
            return l[e.getMonth()];
          },
          c: null,
          d: nI,
          e: nI,
          f: nF,
          g: nZ,
          G: nJ,
          H: nL,
          I: nR,
          j: nB,
          L: nz,
          m: nU,
          M: nW,
          p: function (e) {
            return i[+(e.getHours() >= 12)];
          },
          q: function (e) {
            return 1 + ~~(e.getMonth() / 3);
          },
          Q: ih,
          s: iv,
          S: n$,
          u: nV,
          U: nK,
          V: nq,
          w: nY,
          W: nX,
          x: null,
          X: null,
          y: nG,
          Y: nQ,
          Z: n0,
          '%': ip,
        },
        x = {
          a: function (e) {
            return o[e.getUTCDay()];
          },
          A: function (e) {
            return a[e.getUTCDay()];
          },
          b: function (e) {
            return u[e.getUTCMonth()];
          },
          B: function (e) {
            return l[e.getUTCMonth()];
          },
          c: null,
          d: n1,
          e: n1,
          f: n6,
          g: iu,
          G: is,
          H: n2,
          I: n4,
          j: n5,
          L: n3,
          m: n8,
          M: n9,
          p: function (e) {
            return i[+(e.getUTCHours() >= 12)];
          },
          q: function (e) {
            return 1 + ~~(e.getUTCMonth() / 3);
          },
          Q: ih,
          s: iv,
          S: n7,
          u: ie,
          U: it,
          V: ii,
          w: ia,
          W: io,
          x: null,
          X: null,
          y: il,
          Y: ic,
          Z: id,
          '%': ip,
        },
        w = {
          a: function (e, t, r) {
            var n = p.exec(t.slice(r));
            return n ? ((e.w = h.get(n[0].toLowerCase())), r + n[0].length) : -1;
          },
          A: function (e, t, r) {
            var n = f.exec(t.slice(r));
            return n ? ((e.w = d.get(n[0].toLowerCase())), r + n[0].length) : -1;
          },
          b: function (e, t, r) {
            var n = g.exec(t.slice(r));
            return n ? ((e.m = m.get(n[0].toLowerCase())), r + n[0].length) : -1;
          },
          B: function (e, t, r) {
            var n = v.exec(t.slice(r));
            return n ? ((e.m = y.get(n[0].toLowerCase())), r + n[0].length) : -1;
          },
          c: function (e, r, n) {
            return A(e, t, r, n);
          },
          d: nP,
          e: nP,
          f: nk,
          g: nw,
          G: nx,
          H: nE,
          I: nE,
          j: n_,
          L: nM,
          m: nA,
          M: nj,
          p: function (e, t, r) {
            var n = c.exec(t.slice(r));
            return n ? ((e.p = s.get(n[0].toLowerCase())), r + n[0].length) : -1;
          },
          q: nS,
          Q: nD,
          s: nN,
          S: nC,
          u: ny,
          U: ng,
          V: nm,
          w: nv,
          W: nb,
          x: function (e, t, n) {
            return A(e, r, t, n);
          },
          X: function (e, t, r) {
            return A(e, n, t, r);
          },
          y: nw,
          Y: nx,
          Z: nO,
          '%': nT,
        };
      function O(e, t) {
        return function (r) {
          var n,
            i,
            a,
            o = [],
            l = -1,
            u = 0,
            c = e.length;
          for (r instanceof Date || (r = new Date(+r)); ++l < c; )
            37 === e.charCodeAt(l) &&
              (o.push(e.slice(u, l)),
              null != (i = nl[(n = e.charAt(++l))])
                ? (n = e.charAt(++l))
                : (i = 'e' === n ? ' ' : '0'),
              (a = t[n]) && (n = a(r, i)),
              o.push(n),
              (u = l + 1));
          return (o.push(e.slice(u, l)), o.join(''));
        };
      }
      function S(e, t) {
        return function (r) {
          var n,
            i,
            a = no(1900, void 0, 1);
          if (A(a, e, (r += ''), 0) != r.length) return null;
          if ('Q' in a) return new Date(a.Q);
          if ('s' in a) return new Date(1e3 * a.s + ('L' in a ? a.L : 0));
          if (
            (!t || 'Z' in a || (a.Z = 0),
            'p' in a && (a.H = (a.H % 12) + 12 * a.p),
            void 0 === a.m && (a.m = 'q' in a ? a.q : 0),
            'V' in a)
          ) {
            if (a.V < 1 || a.V > 53) return null;
            ('w' in a || (a.w = 1),
              'Z' in a
                ? ((n =
                    (i = (n = na(no(a.y, 0, 1))).getUTCDay()) > 4 || 0 === i ? rY.ceil(n) : rY(n)),
                  (n = r1.offset(n, (a.V - 1) * 7)),
                  (a.y = n.getUTCFullYear()),
                  (a.m = n.getUTCMonth()),
                  (a.d = n.getUTCDate() + ((a.w + 6) % 7)))
                : ((n = (i = (n = ni(no(a.y, 0, 1))).getDay()) > 4 || 0 === i ? rF.ceil(n) : rF(n)),
                  (n = r0.offset(n, (a.V - 1) * 7)),
                  (a.y = n.getFullYear()),
                  (a.m = n.getMonth()),
                  (a.d = n.getDate() + ((a.w + 6) % 7))));
          } else
            ('W' in a || 'U' in a) &&
              ('w' in a || (a.w = 'u' in a ? a.u % 7 : +('W' in a)),
              (i = 'Z' in a ? na(no(a.y, 0, 1)).getUTCDay() : ni(no(a.y, 0, 1)).getDay()),
              (a.m = 0),
              (a.d =
                'W' in a
                  ? ((a.w + 6) % 7) + 7 * a.W - ((i + 5) % 7)
                  : a.w + 7 * a.U - ((i + 6) % 7)));
          return 'Z' in a ? ((a.H += (a.Z / 100) | 0), (a.M += a.Z % 100), na(a)) : ni(a);
        };
      }
      function A(e, t, r, n) {
        for (var i, a, o = 0, l = t.length, u = r.length; o < l; ) {
          if (n >= u) return -1;
          if (37 === (i = t.charCodeAt(o++))) {
            if (!(a = w[(i = t.charAt(o++)) in nl ? t.charAt(o++) : i]) || (n = a(e, r, n)) < 0)
              return -1;
          } else if (i != r.charCodeAt(n++)) return -1;
        }
        return n;
      }
      return (
        (b.x = O(r, b)),
        (b.X = O(n, b)),
        (b.c = O(t, b)),
        (x.x = O(r, x)),
        (x.X = O(n, x)),
        (x.c = O(t, x)),
        {
          format: function (e) {
            var t = O((e += ''), b);
            return (
              (t.toString = function () {
                return e;
              }),
              t
            );
          },
          parse: function (e) {
            var t = S((e += ''), !1);
            return (
              (t.toString = function () {
                return e;
              }),
              t
            );
          },
          utcFormat: function (e) {
            var t = O((e += ''), x);
            return (
              (t.toString = function () {
                return e;
              }),
              t
            );
          },
          utcParse: function (e) {
            var t = S((e += ''), !0);
            return (
              (t.toString = function () {
                return e;
              }),
              t
            );
          },
        }
      );
    })({
      dateTime: '%x, %X',
      date: '%-m/%-d/%Y',
      time: '%-I:%M:%S %p',
      periods: ['AM', 'PM'],
      days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      shortDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      months: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ],
      shortMonths: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ],
    })).format),
      a.parse,
      (l = a.utcFormat),
      a.utcParse,
      e.s(
        [
          'scaleBand',
          0,
          eG,
          'scaleDiverging',
          0,
          iM,
          'scaleDivergingLog',
          0,
          ik,
          'scaleDivergingPow',
          0,
          iD,
          'scaleDivergingSqrt',
          0,
          iN,
          'scaleDivergingSymlog',
          0,
          iT,
          'scaleIdentity',
          0,
          rr,
          'scaleImplicit',
          0,
          eY,
          'scaleLinear',
          0,
          rt,
          'scaleLog',
          0,
          rf,
          'scaleOrdinal',
          0,
          eX,
          'scalePoint',
          0,
          eZ,
          'scalePow',
          0,
          rx,
          'scaleQuantile',
          0,
          rj,
          'scaleQuantize',
          0,
          rC,
          'scaleRadial',
          0,
          rS,
          'scaleSequential',
          0,
          iS,
          'scaleSequentialLog',
          0,
          iA,
          'scaleSequentialPow',
          0,
          i_,
          'scaleSequentialQuantile',
          0,
          ij,
          'scaleSequentialSqrt',
          0,
          iE,
          'scaleSequentialSymlog',
          0,
          iP,
          'scaleSqrt',
          0,
          rw,
          'scaleSymlog',
          0,
          rv,
          'scaleThreshold',
          0,
          rM,
          'scaleTime',
          0,
          ib,
          'scaleUtc',
          0,
          ix,
          'tickFormat',
          0,
          t7,
        ],
        46513,
      ),
      e.i(46513),
      e.s(
        [
          'scaleBand',
          0,
          eG,
          'scaleDiverging',
          0,
          iM,
          'scaleDivergingLog',
          0,
          ik,
          'scaleDivergingPow',
          0,
          iD,
          'scaleDivergingSqrt',
          0,
          iN,
          'scaleDivergingSymlog',
          0,
          iT,
          'scaleIdentity',
          0,
          rr,
          'scaleImplicit',
          0,
          eY,
          'scaleLinear',
          0,
          rt,
          'scaleLog',
          0,
          rf,
          'scaleOrdinal',
          0,
          eX,
          'scalePoint',
          0,
          eZ,
          'scalePow',
          0,
          rx,
          'scaleQuantile',
          0,
          rj,
          'scaleQuantize',
          0,
          rC,
          'scaleRadial',
          0,
          rS,
          'scaleSequential',
          0,
          iS,
          'scaleSequentialLog',
          0,
          iA,
          'scaleSequentialPow',
          0,
          i_,
          'scaleSequentialQuantile',
          0,
          ij,
          'scaleSequentialSqrt',
          0,
          iE,
          'scaleSequentialSymlog',
          0,
          iP,
          'scaleSqrt',
          0,
          rw,
          'scaleSymlog',
          0,
          rv,
          'scaleThreshold',
          0,
          rM,
          'scaleTime',
          0,
          ib,
          'scaleUtc',
          0,
          ix,
          'tickFormat',
          0,
          t7,
        ],
        74213,
      ));
    var iI = e.i(74213);
    function iL(e, t, r) {
      if ('function' == typeof e) return e.copy().domain(t).range(r);
      if (null != e) {
        var n = (function (e) {
          if (e in iI && 'function' == typeof iI[e]) return iI[e]();
          var t = 'scale'.concat((0, F.upperFirst)(e));
          if (t in iI && 'function' == typeof iI[t]) return iI[t]();
        })(e);
        if (null != n) return (n.domain(t).range(r), n);
      }
    }
    function iR(e, t, r, n) {
      if (null != r && null != n)
        return 'function' == typeof e.scale ? iL(e.scale, r, n) : iL(t, r, n);
    }
    var iB = (e, t, r) => {
      if (null != e) {
        var { scale: n, type: i } = e;
        if ('auto' === n)
          return 'category' === i &&
            r &&
            (r.indexOf('LineChart') >= 0 ||
              r.indexOf('AreaChart') >= 0 ||
              (r.indexOf('ComposedChart') >= 0 && !t))
            ? 'point'
            : 'category' === i
              ? 'band'
              : 'linear';
        if ('string' == typeof n) return 'scale'.concat((0, F.upperFirst)(n)) in iI ? n : 'point';
      }
    };
    function iz(e, t) {
      if (e) {
        var r = null != t ? t : e.domain(),
          n = r.map((t) => {
            var r;
            return null != (r = e(t)) ? r : 0;
          }),
          i = e.range();
        if (0 !== r.length && !(i.length < 2))
          return (e) => {
            var t,
              i,
              a = (function (e, t) {
                for (var r = 0, n = e.length, i = e[0] < e[e.length - 1]; r < n; ) {
                  var a = Math.floor((r + n) / 2);
                  (i ? e[a] < t : e[a] > t) ? (r = a + 1) : (n = a);
                }
                return r;
              })(n, e);
            return a <= 0
              ? r[0]
              : a >= r.length
                ? r[r.length - 1]
                : Math.abs(e - (null != (t = n[a - 1]) ? t : 0)) <=
                    Math.abs(e - (null != (i = n[a]) ? i : 0))
                  ? r[a - 1]
                  : r[a];
          };
      }
    }
    function iF(e, t) {
      var r = Object.keys(e);
      if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(e);
        (t &&
          (n = n.filter(function (t) {
            return Object.getOwnPropertyDescriptor(e, t).enumerable;
          })),
          r.push.apply(r, n));
      }
      return r;
    }
    function iU(e) {
      for (var t = 1; t < arguments.length; t++) {
        var r = null != arguments[t] ? arguments[t] : {};
        t % 2
          ? iF(Object(r), !0).forEach(function (t) {
              var n, i, a;
              ((n = e),
                (i = t),
                (a = r[t]),
                (i = (function (e) {
                  var t = (function (e, t) {
                    if ('object' != typeof e || !e) return e;
                    var r = e[Symbol.toPrimitive];
                    if (void 0 !== r) {
                      var n = r.call(e, t || 'default');
                      if ('object' != typeof n) return n;
                      throw TypeError('@@toPrimitive must return a primitive value.');
                    }
                    return ('string' === t ? String : Number)(e);
                  })(e, 'string');
                  return 'symbol' == typeof t ? t : t + '';
                })(i)) in n
                  ? Object.defineProperty(n, i, {
                      value: a,
                      enumerable: !0,
                      configurable: !0,
                      writable: !0,
                    })
                  : (n[i] = a));
            })
          : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
            : iF(Object(r)).forEach(function (t) {
                Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t));
              });
      }
      return e;
    }
    var iW = [0, 'auto'],
      i$ = {
        allowDataOverflow: !1,
        allowDecimals: !0,
        allowDuplicatedCategory: !0,
        angle: 0,
        dataKey: void 0,
        domain: void 0,
        height: 30,
        hide: !0,
        id: 0,
        includeHidden: !1,
        interval: 'preserveEnd',
        minTickGap: 5,
        mirror: !1,
        name: void 0,
        orientation: 'bottom',
        padding: { left: 0, right: 0 },
        reversed: !1,
        scale: 'auto',
        tick: !0,
        tickCount: 5,
        tickFormatter: void 0,
        ticks: void 0,
        type: 'category',
        unit: void 0,
        niceTicks: 'auto',
      },
      iV = (e, t) => e.cartesianAxis.xAxis[t],
      iK = (e, t) => {
        var r = iV(e, t);
        return null == r ? i$ : r;
      },
      iH = {
        allowDataOverflow: !1,
        allowDecimals: !0,
        allowDuplicatedCategory: !0,
        angle: 0,
        dataKey: void 0,
        domain: iW,
        hide: !0,
        id: 0,
        includeHidden: !1,
        interval: 'preserveEnd',
        minTickGap: 5,
        mirror: !1,
        name: void 0,
        orientation: 'left',
        padding: { top: 0, bottom: 0 },
        reversed: !1,
        scale: 'auto',
        tick: !0,
        tickCount: 5,
        tickFormatter: void 0,
        ticks: void 0,
        type: 'number',
        unit: void 0,
        niceTicks: 'auto',
        width: eD.DEFAULT_Y_AXIS_WIDTH,
      },
      iq = (e, t) => e.cartesianAxis.yAxis[t],
      iY = (e, t) => {
        var r = iq(e, t);
        return null == r ? iH : r;
      },
      iX = {
        domain: [0, 'auto'],
        includeHidden: !1,
        reversed: !1,
        allowDataOverflow: !1,
        allowDuplicatedCategory: !1,
        dataKey: void 0,
        id: 0,
        name: '',
        range: [64, 64],
        scale: 'auto',
        type: 'number',
        unit: '',
      },
      iG = (e, t) => {
        var r = e.cartesianAxis.zAxis[t];
        return null == r ? iX : r;
      },
      iZ = (e, t, r) => {
        switch (t) {
          case 'xAxis':
            return iK(e, r);
          case 'yAxis':
            return iY(e, r);
          case 'zAxis':
            return iG(e, r);
          case 'angleAxis':
            return eO(e, r);
          case 'radiusAxis':
            return eS(e, r);
          default:
            throw Error('Unexpected axis type: '.concat(t));
        }
      },
      iQ = (e, t, r) => {
        switch (t) {
          case 'xAxis':
            return iK(e, r);
          case 'yAxis':
            return iY(e, r);
          case 'angleAxis':
            return eO(e, r);
          case 'radiusAxis':
            return eS(e, r);
          default:
            throw Error('Unexpected axis type: '.concat(t));
        }
      },
      iJ = (e) =>
        e.graphicalItems.cartesianItems.some((e) => 'bar' === e.type) ||
        e.graphicalItems.polarItems.some((e) => 'radialBar' === e.type);
    function i0(e, t) {
      return (r) => {
        switch (e) {
          case 'xAxis':
            return 'xAxisId' in r && r.xAxisId === t;
          case 'yAxis':
            return 'yAxisId' in r && r.yAxisId === t;
          case 'zAxis':
            return 'zAxisId' in r && r.zAxisId === t;
          case 'angleAxis':
            return 'angleAxisId' in r && r.angleAxisId === t;
          case 'radiusAxis':
            return 'radiusAxisId' in r && r.radiusAxisId === t;
          default:
            return !1;
        }
      };
    }
    var i1 = (e) => e.graphicalItems.cartesianItems,
      i2 = (0, y.createSelector)([ek, eT], i0),
      i4 = (e, t, r) =>
        e.filter(r).filter((e) => (null == t ? void 0 : t.includeHidden) === !0 || !e.hide),
      i5 = (0, y.createSelector)([i1, iZ, i2], i4, { memoizeOptions: { resultEqualityCheck: eB } }),
      i3 = (0, y.createSelector)([i5], (e) =>
        e.filter((e) => 'area' === e.type || 'bar' === e.type).filter(eL),
      ),
      i6 = (e) => e.filter((e) => !('stackId' in e) || void 0 === e.stackId),
      i8 = (0, y.createSelector)([i5], i6),
      i9 = (e) =>
        e
          .map((e) => e.data)
          .filter(Boolean)
          .flat(1),
      i7 = (0, y.createSelector)([i5], (e) => e.some((e) => !e.data)),
      ae = (0, y.createSelector)([i5], i9, { memoizeOptions: { resultEqualityCheck: eB } }),
      at = (e, t) => {
        var { chartData: r = [], dataStartIndex: n, dataEndIndex: i } = t;
        return e.length > 0 ? e : r.slice(n, i + 1);
      },
      ar = (0, y.createSelector)([ae, L], at),
      an = (e, t, r) =>
        (null == t ? void 0 : t.dataKey) != null
          ? e.map((e) => ({ value: (0, D.getValueByDataKey)(e, t.dataKey) }))
          : r.length > 0
            ? r
                .map((e) => e.dataKey)
                .flatMap((t) => e.map((e) => ({ value: (0, D.getValueByDataKey)(e, t) })))
            : e.map((e) => ({ value: e })),
      ai = (e, t, r, n, i, a) => {
        var { chartData: o = [], dataStartIndex: l, dataEndIndex: u } = n,
          c = an(e, t, r);
        return i && (null == t ? void 0 : t.dataKey) != null && a.length > 0
          ? [
              ...o
                .slice(l, u + 1)
                .map((e) => ({ value: (0, D.getValueByDataKey)(e, t.dataKey) }))
                .filter((e) => null != e.value),
              ...c,
            ]
          : c;
      },
      aa = (0, y.createSelector)([ar, iZ, i5, L, i7, ae], ai);
    function ao(e) {
      if ((0, F.isNumOrStr)(e) || e instanceof Date) {
        var t = Number(e);
        if ((0, S.isWellBehavedNumber)(t)) return t;
      }
    }
    function al(e) {
      if (Array.isArray(e)) {
        var t = [ao(e[0]), ao(e[1])];
        return U(t) ? t : void 0;
      }
      var r = ao(e);
      if (null != r) return [r, r];
    }
    function au(e) {
      return e.map(ao).filter(F.isNotNil);
    }
    function ac(e, t) {
      var r = ao(e),
        n = ao(t);
      return null == r && null == n ? 0 : null == r ? -1 : null == n ? 1 : r - n;
    }
    var as = (0, y.createSelector)([aa], (e) =>
      null == e ? void 0 : e.map((e) => e.value).sort(ac),
    );
    function af(e, t) {
      switch (e) {
        case 'xAxis':
          return 'x' === t.direction;
        case 'yAxis':
          return 'y' === t.direction;
        default:
          return !1;
      }
    }
    var ad = (e) => {
        var t = ez(e),
          r = eF(e);
        return iQ(e, t, r);
      },
      ap = (0, y.createSelector)([ad], (e) => (null == e ? void 0 : e.dataKey)),
      ah = (0, y.createSelector)([i3, L, ad], eI),
      av = (e, t, r, n) =>
        Object.fromEntries(
          Object.entries(
            t.reduce((e, t) => {
              if (null == t.stackId) return e;
              var r = e[t.stackId];
              return (null == r && (r = []), r.push(t), (e[t.stackId] = r), e);
            }, {}),
          ).map((t) => {
            var [i, a] = t,
              o = n ? [...a].reverse() : a,
              l = o.map(eN);
            return [i, { stackedData: (0, D.getStackedData)(e, l, r), graphicalItems: o }];
          }),
        ),
      ay = (0, y.createSelector)([ah, i3, et, er], av),
      ag = (e, t, r, n) => {
        var { dataStartIndex: i, dataEndIndex: a } = t;
        if (null == n && 'zAxis' !== r) {
          var o = (0, D.getDomainOfStackGroups)(e, i, a);
          if (null == o || 0 !== o[0] || 0 !== o[1]) return o;
        }
      },
      am = (0, y.createSelector)([iZ], (e) => e.allowDataOverflow),
      ab = (e) => {
        var t;
        if (null == e || !('domain' in e)) return iW;
        if (null != e.domain) return e.domain;
        if ('ticks' in e && null != e.ticks) {
          if ('number' === e.type) {
            var r = au(e.ticks);
            return [Math.min(...r), Math.max(...r)];
          }
          if ('category' === e.type) return e.ticks.map(String);
        }
        return null != (t = null == e ? void 0 : e.domain) ? t : iW;
      },
      ax = (0, y.createSelector)([iZ], ab),
      aw = (0, y.createSelector)([ax, am], $),
      aO = (0, y.createSelector)([ay, N, ek, aw], ag, {
        memoizeOptions: { resultEqualityCheck: eR },
      }),
      aS = (e) => e.errorBars,
      aA = function () {
        for (var e = arguments.length, t = Array(e), r = 0; r < e; r++) t[r] = arguments[r];
        var n = t.filter(Boolean);
        if (0 !== n.length) {
          var i = n.flat();
          return [Math.min(...i), Math.max(...i)];
        }
      },
      aP = function (e, t, r, n, i) {
        var a,
          o,
          l = arguments.length > 5 && void 0 !== arguments[5] ? arguments[5] : [];
        if (
          (r.length > 0 &&
            r.forEach((e) => {
              var r,
                u = null != e.data ? [...e.data] : l,
                c = null == (r = n[e.id]) ? void 0 : r.filter((e) => af(i, e));
              u.forEach((r) => {
                var n,
                  i = (0, D.getValueByDataKey)(r, null != (n = t.dataKey) ? n : e.dataKey),
                  l = (function (e, t, r) {
                    if (!r || !r.length) return [];
                    if ('number' != typeof t || (0, F.isNan)(t)) {
                      if (Array.isArray(t)) {
                        var n,
                          i = au(t);
                        i.length > 0 && (n = Math.max(...i));
                      }
                    } else n = t;
                    return null == n
                      ? []
                      : au(
                          r.flatMap((t) => {
                            var r,
                              i,
                              a = (0, D.getValueByDataKey)(e, t.dataKey);
                            if (
                              (Array.isArray(a) ? ([r, i] = a) : (r = i = a),
                              (0, S.isWellBehavedNumber)(r) && (0, S.isWellBehavedNumber)(i))
                            )
                              return [n - r, n + i];
                          }),
                        );
                  })(r, i, c);
                if (l.length >= 2) {
                  var u = Math.min(...l),
                    s = Math.max(...l);
                  ((null == a || u < a) && (a = u), (null == o || s > o) && (o = s));
                }
                var f = al(i);
                null != f &&
                  ((a = null == a ? f[0] : Math.min(a, f[0])),
                  (o = null == o ? f[1] : Math.max(o, f[1])));
              });
            }),
          (null == t ? void 0 : t.dataKey) != null &&
            0 === r.length &&
            e.forEach((e) => {
              var r = al((0, D.getValueByDataKey)(e, t.dataKey));
              null != r &&
                ((a = null == a ? r[0] : Math.min(a, r[0])),
                (o = null == o ? r[1] : Math.max(o, r[1])));
            }),
          (0, S.isWellBehavedNumber)(a) && (0, S.isWellBehavedNumber)(o))
        )
          return [a, o];
      },
      a_ = (0, y.createSelector)([ar, iZ, i8, aS, ek, R], aP, {
        memoizeOptions: { resultEqualityCheck: eR },
      });
    function aE(e) {
      var { value: t } = e;
      if ((0, F.isNumOrStr)(t) || t instanceof Date) return t;
    }
    var aj = (e) => e.referenceElements.dots,
      aC = (e, t, r) =>
        e
          .filter((e) => 'extendDomain' === e.ifOverflow)
          .filter((e) => ('xAxis' === t ? e.xAxisId === r : e.yAxisId === r)),
      aM = (0, y.createSelector)([aj, ek, eT], aC),
      ak = (e) => e.referenceElements.areas,
      aT = (0, y.createSelector)([ak, ek, eT], aC),
      aD = (e) => e.referenceElements.lines,
      aN = (0, y.createSelector)([aD, ek, eT], aC),
      aI = (e, t) => {
        if (null != e) {
          var r = au(e.map((e) => ('xAxis' === t ? e.x : e.y)));
          if (0 !== r.length) return [Math.min(...r), Math.max(...r)];
        }
      },
      aL = (0, y.createSelector)(aM, ek, aI),
      aR = (e, t) => {
        if (null != e) {
          var r = au(e.flatMap((e) => ['xAxis' === t ? e.x1 : e.y1, 'xAxis' === t ? e.x2 : e.y2]));
          if (0 !== r.length) return [Math.min(...r), Math.max(...r)];
        }
      },
      aB = (0, y.createSelector)([aT, ek], aR),
      az = (e, t) => {
        if (null != e) {
          var r = e.flatMap((e) =>
            'xAxis' === t
              ? (function (e) {
                  if (null != e.x) return au([e.x]);
                  var t,
                    r = null == (t = e.segment) ? void 0 : t.map((e) => e.x);
                  return null == r || 0 === r.length ? [] : au(r);
                })(e)
              : (function (e) {
                  if (null != e.y) return au([e.y]);
                  var t,
                    r = null == (t = e.segment) ? void 0 : t.map((e) => e.y);
                  return null == r || 0 === r.length ? [] : au(r);
                })(e),
          );
          if (0 !== r.length) return [Math.min(...r), Math.max(...r)];
        }
      },
      aF = (0, y.createSelector)([aN, ek], az),
      aU = (0, y.createSelector)(aL, aF, aB, (e, t, r) => aA(e, r, t)),
      aW = (e, t, r, n, i, a, o, l) =>
        null != r
          ? r
          : (function (e, t, r) {
              if (r || null != t) {
                if ('function' == typeof e && null != t)
                  try {
                    var n = e(t, r);
                    if (U(n)) return W(n, t, r);
                  } catch (e) {}
                if (Array.isArray(e) && 2 === e.length) {
                  var i,
                    a,
                    [o, l] = e;
                  if ('auto' === o) null != t && (i = Math.min(...t));
                  else if ((0, F.isNumber)(o)) i = o;
                  else if ('function' == typeof o)
                    try {
                      null != t && (i = o(null == t ? void 0 : t[0]));
                    } catch (e) {}
                  else if ('string' == typeof o && D.MIN_VALUE_REG.test(o)) {
                    var u = D.MIN_VALUE_REG.exec(o);
                    if (null == u || null == u[1] || null == t) i = void 0;
                    else {
                      var c = +u[1];
                      i = t[0] - c;
                    }
                  } else i = null == t ? void 0 : t[0];
                  if ('auto' === l) null != t && (a = Math.max(...t));
                  else if ((0, F.isNumber)(l)) a = l;
                  else if ('function' == typeof l)
                    try {
                      null != t && (a = l(null == t ? void 0 : t[1]));
                    } catch (e) {}
                  else if ('string' == typeof l && D.MAX_VALUE_REG.test(l)) {
                    var s = D.MAX_VALUE_REG.exec(l);
                    if (null == s || null == s[1] || null == t) a = void 0;
                    else {
                      var f = +s[1];
                      a = t[1] + f;
                    }
                  } else a = null == t ? void 0 : t[1];
                  var d = [i, a];
                  if (U(d)) return null == t ? d : W(d, t, r);
                }
              }
            })(
              t,
              ('vertical' === o && 'xAxis' === l) || ('horizontal' === o && 'yAxis' === l)
                ? aA(n, a, i)
                : aA(a, i),
              e.allowDataOverflow,
            ),
      a$ = (0, y.createSelector)([iZ, ax, aw, aO, a_, aU, j, ek], aW, {
        memoizeOptions: { resultEqualityCheck: eR },
      }),
      aV = [0, 1],
      aK = (e, t, r, n, i, a, o) => {
        if ((null != e && null != r && 0 !== r.length) || void 0 !== o) {
          var l,
            u,
            { dataKey: c, type: s } = e,
            f = (0, D.isCategoricalAxis)(t, a);
          return f && null == c
            ? (0, T.default)(0, null != (u = null == r ? void 0 : r.length) ? u : 0)
            : 'category' === s
              ? ((l = n.map(aE).filter((e) => null != e)),
                f && (null == e.dataKey || (e.allowDuplicatedCategory && (0, F.hasDuplicate)(l)))
                  ? (0, T.default)(0, n.length)
                  : e.allowDuplicatedCategory
                    ? l
                    : Array.from(new Set(l)))
              : 'expand' !== i || f
                ? o
                : aV;
        }
      },
      aH = (0, y.createSelector)([iZ, j, ar, aa, et, ek, a$], aK),
      aq = (0, y.createSelector)([iZ, iJ, en], iB),
      aY = (e, t, r) => {
        var { niceTicks: n } = t;
        if ('none' !== n) {
          var i = ab(t),
            a = Array.isArray(i) && ('auto' === i[0] || 'auto' === i[1]);
          if (('snap125' === n || 'adaptive' === n) && null != t && t.tickCount && U(e)) {
            if (a) return Z(e, t.tickCount, t.allowDecimals, n);
            if ('number' === t.type) return Q(e, t.tickCount, t.allowDecimals, n);
          }
          if ('auto' === n && 'linear' === r && null != t && t.tickCount) {
            if (a && U(e)) return Z(e, t.tickCount, t.allowDecimals, 'adaptive');
            if ('number' === t.type && U(e)) return Q(e, t.tickCount, t.allowDecimals, 'adaptive');
          }
        }
      },
      aX = (0, y.createSelector)([aH, iQ, aq], aY),
      aG = (e, t, r, n) => {
        if (
          'angleAxis' !== n &&
          (null == e ? void 0 : e.type) === 'number' &&
          U(t) &&
          Array.isArray(r) &&
          r.length > 0
        ) {
          var i, a;
          return [
            Math.min(t[0], null != (i = r[0]) ? i : 0),
            Math.max(t[1], null != (a = r[r.length - 1]) ? a : 0),
          ];
        }
        return t;
      },
      aZ = (0, y.createSelector)([iZ, aH, aX, ek], aG),
      aQ = (0, y.createSelector)(aa, iZ, (e, t) => {
        if (t && 'number' === t.type) {
          var r = 1 / 0,
            n = Array.from(au(e.map((e) => e.value))).sort((e, t) => e - t),
            i = n[0],
            a = n[n.length - 1];
          if (null == i || null == a) return 1 / 0;
          var o = a - i;
          if (0 === o) return 1 / 0;
          for (var l = 0; l < n.length - 1; l++) {
            var u = n[l],
              c = n[l + 1];
            null != u && null != c && (r = Math.min(r, c - u));
          }
          return r / o;
        }
      }),
      aJ = (0, y.createSelector)(
        aQ,
        j,
        ee,
        m.selectChartOffsetInternal,
        (e, t, r, n, i) => i,
        (e, t, r, n, i) => {
          if (!(0, S.isWellBehavedNumber)(e)) return 0;
          var a = 'vertical' === t ? n.height : n.width;
          if ('gap' === i) return (e * a) / 2;
          if ('no-gap' === i) {
            var o = (0, F.getPercentValue)(r, e * a),
              l = (e * a) / 2;
            return l - o - ((l - o) / a) * o;
          }
          return 0;
        },
      ),
      a0 = (0, y.createSelector)(
        iK,
        (e, t, r) => {
          var n = iK(e, t);
          return null == n || 'string' != typeof n.padding ? 0 : aJ(e, 'xAxis', t, r, n.padding);
        },
        (e, t) => {
          if (null == e) return { left: 0, right: 0 };
          var r,
            n,
            { padding: i } = e;
          return 'string' == typeof i
            ? { left: t, right: t }
            : {
                left: (null != (r = i.left) ? r : 0) + t,
                right: (null != (n = i.right) ? n : 0) + t,
              };
        },
      ),
      a1 = (0, y.createSelector)(
        iY,
        (e, t, r) => {
          var n = iY(e, t);
          return null == n || 'string' != typeof n.padding ? 0 : aJ(e, 'yAxis', t, r, n.padding);
        },
        (e, t) => {
          if (null == e) return { top: 0, bottom: 0 };
          var r,
            n,
            { padding: i } = e;
          return 'string' == typeof i
            ? { top: t, bottom: t }
            : {
                top: (null != (r = i.top) ? r : 0) + t,
                bottom: (null != (n = i.bottom) ? n : 0) + t,
              };
        },
      ),
      a2 = (0, y.createSelector)(
        [
          m.selectChartOffsetInternal,
          a0,
          w.selectBrushDimensions,
          w.selectBrushSettings,
          (e, t, r) => r,
        ],
        (e, t, r, n, i) => {
          var { padding: a } = n;
          return i ? [a.left, r.width - a.right] : [e.left + t.left, e.left + e.width - t.right];
        },
      ),
      a4 = (0, y.createSelector)(
        [
          m.selectChartOffsetInternal,
          j,
          a1,
          w.selectBrushDimensions,
          w.selectBrushSettings,
          (e, t, r) => r,
        ],
        (e, t, r, n, i, a) => {
          var { padding: o } = i;
          return a
            ? [n.height - o.bottom, o.top]
            : 'horizontal' === t
              ? [e.top + e.height - r.bottom, e.top + r.top]
              : [e.top + r.top, e.top + e.height - r.bottom];
        },
      ),
      a5 = (e, t, r, n) => {
        var i;
        switch (t) {
          case 'xAxis':
            return a2(e, r, n);
          case 'yAxis':
            return a4(e, r, n);
          case 'zAxis':
            return null == (i = iG(e, r)) ? void 0 : i.range;
          case 'angleAxis':
            return ej(e);
          case 'radiusAxis':
            return eC(e, r);
          default:
            return;
        }
      },
      a3 = (0, y.createSelector)([iZ, a5], ey),
      a6 = (0, y.createSelector)([aq, aZ], eW),
      a8 = (0, y.createSelector)([iZ, aq, a6, a3], iR),
      a9 = (e, t, r, n) => {
        if (null != r && null != r.dataKey) {
          var { type: i, scale: a } = r;
          if ((0, D.isCategoricalAxis)(e, n) && ('number' === i || 'auto' !== a))
            return t.map((e) => e.value);
        }
      },
      a7 = (0, y.createSelector)([j, aa, iQ, ek], a9),
      oe = (0, y.createSelector)([a8], eU),
      ot = (0, y.createSelector)([a8], function (e) {
        if (null != e)
          return 'invert' in e && 'function' == typeof e.invert ? e.invert.bind(e) : iz(e, void 0);
      }),
      or = (0, y.createSelector)([a8, as], iz);
    function on(e, t) {
      return e.id < t.id ? -1 : +(e.id > t.id);
    }
    (0, y.createSelector)([i5, aS, ek], (e, t, r) =>
      e
        .flatMap((e) => t[e.id])
        .filter(Boolean)
        .filter((e) => af(r, e)),
    );
    var oi = (e, t) => t,
      oa = (e, t, r) => r,
      oo = (0, y.createSelector)(J.selectAllXAxes, oi, oa, (e, t, r) =>
        e
          .filter((e) => e.orientation === t)
          .filter((e) => e.mirror === r)
          .sort(on),
      ),
      ol = (0, y.createSelector)(J.selectAllYAxes, oi, oa, (e, t, r) =>
        e
          .filter((e) => e.orientation === t)
          .filter((e) => e.mirror === r)
          .sort(on),
      ),
      ou = (e, t) => ({ width: e.width, height: t.height }),
      oc = (0, y.createSelector)(m.selectChartOffsetInternal, iK, ou),
      os = (0, y.createSelector)(
        b.selectChartHeight,
        m.selectChartOffsetInternal,
        oo,
        oi,
        oa,
        (e, t, r, n, i) => {
          var a,
            o = {};
          return (
            r.forEach((r) => {
              var l = ou(t, r);
              null == a &&
                (a = ((e, t, r) => {
                  switch (t) {
                    case 'top':
                      return e.top;
                    case 'bottom':
                      return r - e.bottom;
                    default:
                      return 0;
                  }
                })(t, n, e));
              var u = ('top' === n && !i) || ('bottom' === n && i);
              ((o[r.id] = a - Number(u) * l.height), (a += (u ? -1 : 1) * l.height));
            }),
            o
          );
        },
      ),
      of = (0, y.createSelector)(
        b.selectChartWidth,
        m.selectChartOffsetInternal,
        ol,
        oi,
        oa,
        (e, t, r, n, i) => {
          var a,
            o = {};
          return (
            r.forEach((r) => {
              var l = {
                width: 'number' == typeof r.width ? r.width : eD.DEFAULT_Y_AXIS_WIDTH,
                height: t.height,
              };
              null == a &&
                (a = ((e, t, r) => {
                  switch (t) {
                    case 'left':
                      return e.left;
                    case 'right':
                      return r - e.right;
                    default:
                      return 0;
                  }
                })(t, n, e));
              var u = ('left' === n && !i) || ('right' === n && i);
              ((o[r.id] = a - Number(u) * l.width), (a += (u ? -1 : 1) * l.width));
            }),
            o
          );
        },
      ),
      od = (0, y.createSelector)(
        [
          m.selectChartOffsetInternal,
          iK,
          (e, t) => {
            var r = iK(e, t);
            if (null != r) return os(e, r.orientation, r.mirror);
          },
          (e, t) => t,
        ],
        (e, t, r, n) => {
          if (null != t) {
            var i = null == r ? void 0 : r[n];
            return null == i ? { x: e.left, y: 0 } : { x: e.left, y: i };
          }
        },
      ),
      op = (0, y.createSelector)(
        [
          m.selectChartOffsetInternal,
          iY,
          (e, t) => {
            var r = iY(e, t);
            if (null != r) return of(e, r.orientation, r.mirror);
          },
          (e, t) => t,
        ],
        (e, t, r, n) => {
          if (null != t) {
            var i = null == r ? void 0 : r[n];
            return null == i ? { x: 0, y: e.top } : { x: i, y: e.top };
          }
        },
      ),
      oh = (0, y.createSelector)(m.selectChartOffsetInternal, iY, (e, t) => ({
        width: 'number' == typeof t.width ? t.width : eD.DEFAULT_Y_AXIS_WIDTH,
        height: e.height,
      })),
      ov = (e, t, r, n) => {
        if (null != r) {
          var { allowDuplicatedCategory: i, type: a, dataKey: o } = r,
            l = (0, D.isCategoricalAxis)(e, n),
            u = t.map((e) => e.value),
            c = u.filter((e) => null != e);
          if (o && l && 'category' === a && i && (0, F.hasDuplicate)(c)) return u;
        }
      },
      oy = (0, y.createSelector)([j, aa, iZ, ek], ov),
      og = (0, y.createSelector)(
        [
          j,
          (e, t, r) => {
            switch (t) {
              case 'xAxis':
                return iK(e, r);
              case 'yAxis':
                return iY(e, r);
              default:
                throw Error('Unexpected axis type: '.concat(t));
            }
          },
          aq,
          oe,
          oy,
          a7,
          a5,
          aX,
          ek,
        ],
        (e, t, r, n, i, a, o, l, u) => {
          if (null != t) {
            var c = (0, D.isCategoricalAxis)(e, u);
            return {
              angle: t.angle,
              interval: t.interval,
              minTickGap: t.minTickGap,
              orientation: t.orientation,
              tick: t.tick,
              tickCount: t.tickCount,
              tickFormatter: t.tickFormatter,
              ticks: t.ticks,
              type: t.type,
              unit: t.unit,
              axisType: u,
              categoricalDomain: a,
              duplicateDomain: i,
              isCategorical: c,
              niceTicks: l,
              range: o,
              realScaleType: r,
              scale: n,
            };
          }
        },
      ),
      om = (0, y.createSelector)(
        [j, iQ, aq, oe, aX, a5, oy, a7, ek],
        (e, t, r, n, i, a, o, l, u) => {
          if (null != t && null != n) {
            var c = (0, D.isCategoricalAxis)(e, u),
              { type: s, ticks: f, tickCount: d } = t,
              p = 'scaleBand' === r && 'function' == typeof n.bandwidth ? n.bandwidth() / 2 : 2,
              h = 'category' === s && n.bandwidth ? n.bandwidth() / p : 0;
            h =
              'angleAxis' === u && null != a && a.length >= 2
                ? 2 * (0, F.mathSign)(a[0] - a[1]) * h
                : h;
            var v = f || i;
            return v
              ? v
                  .map((e, t) => {
                    var r = o ? o.indexOf(e) : e,
                      i = n.map(r);
                    return (0, S.isWellBehavedNumber)(i)
                      ? { index: t, coordinate: i + h, value: e, offset: h }
                      : null;
                  })
                  .filter(F.isNotNil)
              : c && l
                ? l
                    .map((e, t) => {
                      var r = n.map(e);
                      return (0, S.isWellBehavedNumber)(r)
                        ? { coordinate: r + h, value: e, index: t, offset: h }
                        : null;
                    })
                    .filter(F.isNotNil)
                : n.ticks
                  ? n
                      .ticks(d)
                      .map((e, t) => {
                        var r = n.map(e);
                        return (0, S.isWellBehavedNumber)(r)
                          ? { coordinate: r + h, value: e, index: t, offset: h }
                          : null;
                      })
                      .filter(F.isNotNil)
                  : n
                      .domain()
                      .map((e, t) => {
                        var r = n.map(e);
                        return (0, S.isWellBehavedNumber)(r)
                          ? { coordinate: r + h, value: o ? o[e] : e, index: t, offset: h }
                          : null;
                      })
                      .filter(F.isNotNil);
          }
        },
      ),
      ob = (0, y.createSelector)([j, iQ, oe, a5, oy, a7, ek], (e, t, r, n, i, a, o) => {
        if (null != t && null != r && null != n && n[0] !== n[1]) {
          var l = (0, D.isCategoricalAxis)(e, o),
            { tickCount: u } = t,
            c = 0;
          return ((c =
            'angleAxis' === o && (null == n ? void 0 : n.length) >= 2
              ? 2 * (0, F.mathSign)(n[0] - n[1]) * c
              : c),
          l && a)
            ? a
                .map((e, t) => {
                  var n = r.map(e);
                  return (0, S.isWellBehavedNumber)(n)
                    ? { coordinate: n + c, value: e, index: t, offset: c }
                    : null;
                })
                .filter(F.isNotNil)
            : r.ticks
              ? r
                  .ticks(u)
                  .map((e, t) => {
                    var n = r.map(e);
                    return (0, S.isWellBehavedNumber)(n)
                      ? { coordinate: n + c, value: e, index: t, offset: c }
                      : null;
                  })
                  .filter(F.isNotNil)
              : r
                  .domain()
                  .map((e, t) => {
                    var n = r.map(e);
                    return (0, S.isWellBehavedNumber)(n)
                      ? { coordinate: n + c, value: i ? i[e] : e, index: t, offset: c }
                      : null;
                  })
                  .filter(F.isNotNil);
        }
      }),
      ox = (0, y.createSelector)(iZ, oe, (e, t) => {
        if (null != e && null != t) return iU(iU({}, e), {}, { scale: t });
      }),
      ow = (0, y.createSelector)([iZ, aq, aH, a3], iR),
      oO = (0, y.createSelector)([ow], eU);
    (0, y.createSelector)(
      (e, t, r) => iG(e, r),
      oO,
      (e, t) => {
        if (null != e && null != t) return iU(iU({}, e), {}, { scale: t });
      },
    );
    var oS = (0, y.createSelector)([j, J.selectAllXAxes, J.selectAllYAxes], (e, t, r) => {
        switch (e) {
          case 'horizontal':
            return t.some((e) => e.reversed) ? 'right-to-left' : 'left-to-right';
          case 'vertical':
            return r.some((e) => e.reversed) ? 'bottom-to-top' : 'top-to-bottom';
          case 'centric':
          case 'radial':
            return 'left-to-right';
          default:
            return;
        }
      }),
      oA = (e, t, r) => {
        var n;
        return null == (n = e.renderedTicks[t]) ? void 0 : n[r];
      },
      oP = (0, y.createSelector)([oA], (e) => {
        if (e && 0 !== e.length)
          return (t) => {
            var r,
              n = 1 / 0,
              i = e[0];
            for (var a of e) {
              var o = Math.abs(a.coordinate - t);
              o < n && ((n = o), (i = a));
            }
            return null == (r = i) ? void 0 : r.value;
          };
      });
    e.s(
      [
        'combineAllAppliedValues',
        0,
        ai,
        'combineAppliedValues',
        0,
        an,
        'combineAreasDomain',
        0,
        aR,
        'combineAxisDomain',
        0,
        aK,
        'combineAxisDomainWithNiceTicks',
        0,
        aG,
        'combineCategoricalDomain',
        0,
        a9,
        'combineDisplayedData',
        0,
        at,
        'combineDomainOfAllAppliedNumericalValuesIncludingErrorValues',
        0,
        aP,
        'combineDomainOfStackGroups',
        0,
        ag,
        'combineDotsDomain',
        0,
        aI,
        'combineDuplicateDomain',
        0,
        ov,
        'combineGraphicalItemsData',
        0,
        i9,
        'combineGraphicalItemsSettings',
        0,
        i4,
        'combineLinesDomain',
        0,
        az,
        'combineNiceTicks',
        0,
        aY,
        'combineNumericalDomain',
        0,
        aW,
        'combineStackGroups',
        0,
        av,
        'filterGraphicalNotStackedItems',
        0,
        i6,
        'filterReferenceElements',
        0,
        aC,
        'getDomainDefinition',
        0,
        ab,
        'implicitXAxis',
        0,
        i$,
        'implicitYAxis',
        0,
        iH,
        'itemAxisPredicate',
        0,
        i0,
        'mergeDomains',
        0,
        aA,
        'selectAllErrorBarSettings',
        0,
        aS,
        'selectAxisDomain',
        0,
        aH,
        'selectAxisInverseDataSnapScale',
        0,
        or,
        'selectAxisInverseScale',
        0,
        ot,
        'selectAxisInverseTickSnapScale',
        0,
        oP,
        'selectAxisPropsNeededForCartesianGridTicksGenerator',
        0,
        og,
        'selectAxisRange',
        0,
        a5,
        'selectAxisScale',
        0,
        oe,
        'selectAxisWithScale',
        0,
        ox,
        'selectBaseAxis',
        0,
        iZ,
        'selectCartesianAxisSize',
        0,
        (e, t, r) => {
          switch (t) {
            case 'xAxis':
              return oc(e, r).width;
            case 'yAxis':
              return oh(e, r).height;
            default:
              return;
          }
        },
        'selectChartDirection',
        0,
        oS,
        'selectDomainDefinition',
        0,
        ax,
        'selectDomainFromUserPreference',
        0,
        aw,
        'selectHasBar',
        0,
        iJ,
        'selectRealScaleType',
        0,
        aq,
        'selectReferenceAreas',
        0,
        ak,
        'selectReferenceDots',
        0,
        aj,
        'selectReferenceLines',
        0,
        aD,
        'selectRenderableAxisSettings',
        0,
        iQ,
        'selectRenderedTicksOfAxis',
        0,
        oA,
        'selectStackGroups',
        0,
        ay,
        'selectTicksOfAxis',
        0,
        om,
        'selectTicksOfGraphicalItem',
        0,
        ob,
        'selectTooltipAxis',
        0,
        ad,
        'selectTooltipAxisDataKey',
        0,
        ap,
        'selectUnfilteredCartesianItems',
        0,
        i1,
        'selectXAxisPosition',
        0,
        od,
        'selectXAxisSettings',
        0,
        iK,
        'selectXAxisSettingsNoDefaults',
        0,
        iV,
        'selectXAxisSize',
        0,
        oc,
        'selectYAxisPosition',
        0,
        op,
        'selectYAxisSettings',
        0,
        iY,
        'selectYAxisSettingsNoDefaults',
        0,
        iq,
        'selectYAxisSize',
        0,
        oh,
      ],
      58644,
    );
    var o_ = (e) => e.options.defaultTooltipEventType,
      oE = (e) => e.options.validateTooltipEventTypes;
    function oj(e, t, r) {
      if (null == e) return t;
      var n = e ? 'axis' : 'item';
      return null == r ? t : r.includes(n) ? n : t;
    }
    function oC(e, t) {
      return oj(t, o_(e), oE(e));
    }
    e.s(
      [
        'combineTooltipEventType',
        0,
        oj,
        'selectDefaultTooltipEventType',
        0,
        o_,
        'selectTooltipEventType',
        0,
        oC,
        'selectValidateTooltipEventTypes',
        0,
        oE,
        'useTooltipEventType',
        0,
        function (e) {
          return (0, g.useAppSelector)((t) => oC(t, e));
        },
      ],
      4601,
    );
    var oM = (e, t) => {
      var r,
        n = Number(t);
      if (!(0, F.isNan)(n) && null != t)
        return n >= 0 ? (null == e || null == (r = e[n]) ? void 0 : r.value) : void 0;
    };
    function ok(e, t) {
      var r = Object.keys(e);
      if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(e);
        (t &&
          (n = n.filter(function (t) {
            return Object.getOwnPropertyDescriptor(e, t).enumerable;
          })),
          r.push.apply(r, n));
      }
      return r;
    }
    function oT(e) {
      for (var t = 1; t < arguments.length; t++) {
        var r = null != arguments[t] ? arguments[t] : {};
        t % 2
          ? ok(Object(r), !0).forEach(function (t) {
              var n, i, a;
              ((n = e),
                (i = t),
                (a = r[t]),
                (i = (function (e) {
                  var t = (function (e, t) {
                    if ('object' != typeof e || !e) return e;
                    var r = e[Symbol.toPrimitive];
                    if (void 0 !== r) {
                      var n = r.call(e, t || 'default');
                      if ('object' != typeof n) return n;
                      throw TypeError('@@toPrimitive must return a primitive value.');
                    }
                    return ('string' === t ? String : Number)(e);
                  })(e, 'string');
                  return 'symbol' == typeof t ? t : t + '';
                })(i)) in n
                  ? Object.defineProperty(n, i, {
                      value: a,
                      enumerable: !0,
                      configurable: !0,
                      writable: !0,
                    })
                  : (n[i] = a));
            })
          : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
            : ok(Object(r)).forEach(function (t) {
                Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t));
              });
      }
      return e;
    }
    var oD = (e, t, r, n) => {
        if (null == t) return p.noInteraction;
        var i,
          a,
          o,
          l =
            ((i = e),
            (a = t),
            (o = r),
            'axis' === a
              ? 'click' === o
                ? i.axisInteraction.click
                : i.axisInteraction.hover
              : 'click' === o
                ? i.itemInteraction.click
                : i.itemInteraction.hover);
        if (null == l) return p.noInteraction;
        if (l.active) return l;
        if (e.keyboardInteraction.active) return e.keyboardInteraction;
        if (e.syncInteraction.active && null != e.syncInteraction.index) return e.syncInteraction;
        var u = !0 === e.settings.active;
        if (null != l.index) {
          if (u) return oT(oT({}, l), {}, { active: !0 });
        } else if (null != n)
          return {
            active: !0,
            coordinate: void 0,
            dataKey: void 0,
            index: n,
            graphicalItemId: void 0,
          };
        return oT(oT({}, p.noInteraction), {}, { coordinate: l.coordinate });
      },
      oN = (e, t, r, n) => {
        var i = null == e ? void 0 : e.index;
        if (null == i) return null;
        var a = Number(i);
        if (!(0, S.isWellBehavedNumber)(a)) return i;
        var o = Infinity;
        t.length > 0 && (o = t.length - 1);
        var l = Math.max(0, Math.min(a, o)),
          u = t[l];
        return null == u
          ? String(l)
          : !(function (e, t, r) {
                if (null == r || null == t) return !0;
                var n = (0, D.getValueByDataKey)(e, t);
                return (
                  !(null != n && U(r)) ||
                  (function (e, t) {
                    var r = (function (e) {
                        if ('number' == typeof e) return Number.isFinite(e) ? e : void 0;
                        if (e instanceof Date) {
                          var t = e.valueOf();
                          return Number.isFinite(t) ? t : void 0;
                        }
                        var r = Number(e);
                        return Number.isFinite(r) ? r : void 0;
                      })(e),
                      n = t[0],
                      i = t[1];
                    if (void 0 === r) return !1;
                    var a = Math.min(n, i),
                      o = Math.max(n, i);
                    return r >= a && r <= o;
                  })(n, r)
                );
              })(u, r, n)
            ? null
            : String(l);
      },
      oI = (e, t, r, n, i, a, o) => {
        if (null != a) {
          var l = o[0],
            u = null == l ? void 0 : l.getPosition(a);
          if (null != u) return u;
          var c = null == i ? void 0 : i[Number(a)];
          if (c)
            if ('horizontal' === r) return { x: c.coordinate, y: (n.top + t) / 2 };
            else return { x: (n.left + e) / 2, y: c.coordinate };
        }
      },
      oL = (e, t, r, n) => {
        if ('axis' === t) return e.tooltipItemPayloads;
        if (0 === e.tooltipItemPayloads.length) return [];
        if (
          ((i =
            'hover' === r
              ? e.itemInteraction.hover.graphicalItemId
              : e.itemInteraction.click.graphicalItemId),
          e.syncInteraction.active && null == i)
        )
          return e.tooltipItemPayloads;
        if (null == i && (null != n || e.keyboardInteraction.active)) {
          var i,
            a = e.tooltipItemPayloads[0];
          return null != a ? [a] : [];
        }
        return e.tooltipItemPayloads.filter((e) => {
          var t;
          return (null == (t = e.settings) ? void 0 : t.graphicalItemId) === i;
        });
      },
      oR = (e) => e.options.tooltipPayloadSearcher,
      oB = (e) => e.tooltip,
      oz = e.i(28595);
    function oF(e, t) {
      var r = Object.keys(e);
      if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(e);
        (t &&
          (n = n.filter(function (t) {
            return Object.getOwnPropertyDescriptor(e, t).enumerable;
          })),
          r.push.apply(r, n));
      }
      return r;
    }
    function oU(e) {
      for (var t = 1; t < arguments.length; t++) {
        var r = null != arguments[t] ? arguments[t] : {};
        t % 2
          ? oF(Object(r), !0).forEach(function (t) {
              var n, i, a;
              ((n = e),
                (i = t),
                (a = r[t]),
                (i = (function (e) {
                  var t = (function (e, t) {
                    if ('object' != typeof e || !e) return e;
                    var r = e[Symbol.toPrimitive];
                    if (void 0 !== r) {
                      var n = r.call(e, t || 'default');
                      if ('object' != typeof n) return n;
                      throw TypeError('@@toPrimitive must return a primitive value.');
                    }
                    return ('string' === t ? String : Number)(e);
                  })(e, 'string');
                  return 'symbol' == typeof t ? t : t + '';
                })(i)) in n
                  ? Object.defineProperty(n, i, {
                      value: a,
                      enumerable: !0,
                      configurable: !0,
                      writable: !0,
                    })
                  : (n[i] = a));
            })
          : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
            : oF(Object(r)).forEach(function (t) {
                Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t));
              });
      }
      return e;
    }
    function oW(e) {
      if ('string' == typeof e) return e;
    }
    var o$ = (e, t, r, n, i, a, o) => {
        if (null != t && null != a) {
          var { chartData: l, computedData: u, dataStartIndex: c, dataEndIndex: s } = r;
          return e.reduce((e, r) => {
            var f,
              d,
              p,
              { dataDefinedOnItem: h, settings: v } = r,
              y = null != h ? h : l,
              g = Array.isArray(y) ? (0, oz.getSliced)(y, c, s) : y,
              m = null != (f = null == v ? void 0 : v.dataKey) ? f : n,
              b = null == v ? void 0 : v.nameKey;
            return (
              Array.isArray(
                (d =
                  n && Array.isArray(g) && !Array.isArray(g[0]) && 'axis' === o
                    ? (0, F.findEntryInArray)(g, n, i)
                    : a(g, t, u, b)),
              )
                ? d.forEach((t) => {
                    var r,
                      n,
                      i = (function (e) {
                        if (null != e && 'object' == typeof e) {
                          var t,
                            r =
                              'name' in e
                                ? (function (e) {
                                    if ('string' == typeof e || 'number' == typeof e) return e;
                                  })(e.name)
                                : void 0,
                            n =
                              'unit' in e
                                ? (function (e) {
                                    if (
                                      'string' == typeof e ||
                                      'number' == typeof e ||
                                      'boolean' == typeof e
                                    )
                                      return e;
                                  })(e.unit)
                                : void 0,
                            i =
                              'dataKey' in e
                                ? 'string' == typeof (t = e.dataKey) || 'number' == typeof t
                                  ? t
                                  : 'function' == typeof t
                                    ? (e) => t(e)
                                    : void 0
                                : void 0,
                            a = 'payload' in e ? e.payload : void 0;
                          return {
                            name: r,
                            unit: n,
                            dataKey: i,
                            payload: a,
                            color: 'color' in e ? oW(e.color) : void 0,
                            fill: 'fill' in e ? oW(e.fill) : void 0,
                          };
                        }
                      })(t),
                      a = null == i ? void 0 : i.name,
                      o = null == i ? void 0 : i.dataKey,
                      l = null == i ? void 0 : i.payload,
                      u = oU(
                        oU({}, v),
                        {},
                        {
                          name: a,
                          unit: null == i ? void 0 : i.unit,
                          color:
                            null != (r = null == i ? void 0 : i.color)
                              ? r
                              : null == v
                                ? void 0
                                : v.color,
                          fill:
                            null != (n = null == i ? void 0 : i.fill)
                              ? n
                              : null == v
                                ? void 0
                                : v.fill,
                        },
                      );
                    e.push(
                      (0, D.getTooltipEntry)({
                        tooltipEntrySettings: u,
                        dataKey: o,
                        payload: l,
                        value: (0, D.getValueByDataKey)(l, o),
                        name: null == a ? void 0 : String(a),
                      }),
                    );
                  })
                : e.push(
                    (0, D.getTooltipEntry)({
                      tooltipEntrySettings: v,
                      dataKey: m,
                      payload: d,
                      value: (0, D.getValueByDataKey)(d, m),
                      name:
                        null != (p = (0, D.getValueByDataKey)(d, b))
                          ? p
                          : null == v
                            ? void 0
                            : v.name,
                    }),
                  ),
              e
            );
          }, []);
        }
      },
      oV = (0, y.createSelector)([ad, iJ, en], iB),
      oK = (0, y.createSelector)(
        [(e) => e.graphicalItems.cartesianItems, (e) => e.graphicalItems.polarItems],
        (e, t) => [...e, ...t],
      ),
      oH = (0, y.createSelector)([ez, eF], i0),
      oq = (0, y.createSelector)([oK, ad, oH], i4, { memoizeOptions: { resultEqualityCheck: eB } }),
      oY = (0, y.createSelector)([oq], (e) => e.filter(eL)),
      oX = (0, y.createSelector)([oq], i9, { memoizeOptions: { resultEqualityCheck: eB } }),
      oG = (0, y.createSelector)([oq], (e) => e.some((e) => !e.data)),
      oZ = (0, y.createSelector)([oX, N], at),
      oQ = (0, y.createSelector)([oY, N, ad], eI),
      oJ = (0, y.createSelector)([oZ, ad, oq, N, oG, oX], ai),
      o0 = (0, y.createSelector)([ad], ab),
      o1 = (0, y.createSelector)([ad], (e) => e.allowDataOverflow),
      o2 = (0, y.createSelector)([o0, o1], $),
      o4 = (0, y.createSelector)([oq], (e) => e.filter(eL)),
      o5 = (0, y.createSelector)([oQ, o4, et, er], av),
      o3 = (0, y.createSelector)([o5, N, ez, o2], ag),
      o6 = (0, y.createSelector)([oq], i6),
      o8 = (0, y.createSelector)([oZ, ad, o6, aS, ez, z], aP, {
        memoizeOptions: { resultEqualityCheck: eR },
      }),
      o9 = (0, y.createSelector)([aj, ez, eF], aC),
      o7 = (0, y.createSelector)([o9, ez], aI),
      le = (0, y.createSelector)([ak, ez, eF], aC),
      lt = (0, y.createSelector)([le, ez], aR),
      lr = (0, y.createSelector)([aD, ez, eF], aC),
      ln = (0, y.createSelector)([lr, ez], az),
      li = (0, y.createSelector)([o7, ln, lt], aA),
      la = (0, y.createSelector)([ad, o0, o2, o3, o8, li, j, ez], aW),
      lo = (0, y.createSelector)([ad, j, oZ, oJ, et, ez, la], aK),
      ll = (0, y.createSelector)([lo, ad, oV], aY),
      lu = (0, y.createSelector)([ad, lo, ll, ez], aG),
      lc = (e) => {
        var t = ez(e),
          r = eF(e);
        return a5(e, t, r, !1);
      },
      ls = (0, y.createSelector)([ad, lc], ey),
      lf = (0, y.createSelector)([ad, oV, lu, ls], iR),
      ld = (0, y.createSelector)([lf], eU),
      lp = (0, y.createSelector)([j, oJ, ad, ez], ov),
      lh = (0, y.createSelector)([j, oJ, ad, ez], a9),
      lv = (0, y.createSelector)([j, ad, oV, ld, lc, lp, lh, ez], (e, t, r, n, i, a, o, l) => {
        if (t) {
          var { type: u } = t,
            c = (0, D.isCategoricalAxis)(e, l);
          if (n) {
            var s = 'scaleBand' === r && n.bandwidth ? n.bandwidth() / 2 : 2,
              f = 'category' === u && n.bandwidth ? n.bandwidth() / s : 0;
            return ((f =
              'angleAxis' === l && null != i && (null == i ? void 0 : i.length) >= 2
                ? 2 * (0, F.mathSign)(i[0] - i[1]) * f
                : f),
            c && o)
              ? o
                  .map((e, t) => {
                    var r = n.map(e);
                    return (0, S.isWellBehavedNumber)(r)
                      ? { coordinate: r + f, value: e, index: t, offset: f }
                      : null;
                  })
                  .filter(F.isNotNil)
              : n
                  .domain()
                  .map((e, t) => {
                    var r = n.map(e);
                    return (0, S.isWellBehavedNumber)(r)
                      ? { coordinate: r + f, value: a ? a[e] : e, index: t, offset: f }
                      : null;
                  })
                  .filter(F.isNotNil);
          }
        }
      }),
      ly = (0, y.createSelector)([o_, oE, (e) => e.tooltip.settings], (e, t, r) =>
        oj(r.shared, e, t),
      ),
      lg = (e) => e.tooltip.settings.trigger,
      lm = (e) => e.tooltip.settings.defaultIndex,
      lb = (0, y.createSelector)([oB, ly, lg, lm], oD),
      lx = (0, y.createSelector)([lb, oZ, ap, lo], oN),
      lw = (0, y.createSelector)([lv, lx], oM),
      lO = (0, y.createSelector)([lb], (e) => {
        if (e) return e.dataKey;
      }),
      lS = (0, y.createSelector)([lb], (e) => {
        if (e) return e.graphicalItemId;
      }),
      lA = (0, y.createSelector)([oB, ly, lg, lm], oL),
      lP = (0, y.createSelector)(
        [b.selectChartWidth, b.selectChartHeight, j, m.selectChartOffsetInternal, lv, lm, lA],
        oI,
      ),
      l_ = (0, y.createSelector)([lb, lP], (e, t) =>
        null != e && e.coordinate ? e.coordinate : t,
      ),
      lE = (0, y.createSelector)([lb], (e) => {
        var t;
        return null != (t = null == e ? void 0 : e.active) && t;
      }),
      lj = (0, y.createSelector)([lA, lx, N, ap, lw, oR, ly], o$),
      lC = (0, y.createSelector)([lj], (e) => {
        if (null != e) return Array.from(new Set(e.map((e) => e.payload).filter((e) => null != e)));
      });
    e.s(
      [
        'selectActiveLabel',
        0,
        lw,
        'selectActiveTooltipCoordinate',
        0,
        l_,
        'selectActiveTooltipDataKey',
        0,
        lO,
        'selectActiveTooltipDataPoints',
        0,
        lC,
        'selectActiveTooltipGraphicalItemId',
        0,
        lS,
        'selectActiveTooltipIndex',
        0,
        lx,
        'selectAllGraphicalItemsSettings',
        0,
        oq,
        'selectIsTooltipActive',
        0,
        lE,
        'selectTooltipAxisDomain',
        0,
        lo,
        'selectTooltipAxisRangeWithReverse',
        0,
        ls,
        'selectTooltipAxisScale',
        0,
        ld,
        'selectTooltipAxisTicks',
        0,
        lv,
        'selectTooltipDisplayedData',
        0,
        oZ,
      ],
      70192,
    );
    var lM = e.i(10511);
    function lk(e, t) {
      var r = Object.keys(e);
      if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(e);
        (t &&
          (n = n.filter(function (t) {
            return Object.getOwnPropertyDescriptor(e, t).enumerable;
          })),
          r.push.apply(r, n));
      }
      return r;
    }
    function lT(e) {
      for (var t = 1; t < arguments.length; t++) {
        var r = null != arguments[t] ? arguments[t] : {};
        t % 2
          ? lk(Object(r), !0).forEach(function (t) {
              var n, i, a;
              ((n = e),
                (i = t),
                (a = r[t]),
                (i = (function (e) {
                  var t = (function (e, t) {
                    if ('object' != typeof e || !e) return e;
                    var r = e[Symbol.toPrimitive];
                    if (void 0 !== r) {
                      var n = r.call(e, t || 'default');
                      if ('object' != typeof n) return n;
                      throw TypeError('@@toPrimitive must return a primitive value.');
                    }
                    return ('string' === t ? String : Number)(e);
                  })(e, 'string');
                  return 'symbol' == typeof t ? t : t + '';
                })(i)) in n
                  ? Object.defineProperty(n, i, {
                      value: a,
                      enumerable: !0,
                      configurable: !0,
                      writable: !0,
                    })
                  : (n[i] = a));
            })
          : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
            : lk(Object(r)).forEach(function (t) {
                Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t));
              });
      }
      return e;
    }
    var lD = (e, t, r, n, i) => {
        var a = null != (f = null == t ? void 0 : t.length) ? f : 0;
        if (a <= 1 || null == e) return 0;
        if ('angleAxis' === n && null != i && 1e-6 >= Math.abs(Math.abs(i[1] - i[0]) - 360))
          for (var o = 0; o < a; o++) {
            var l =
                o > 0
                  ? null == (d = r[o - 1])
                    ? void 0
                    : d.coordinate
                  : null == (p = r[a - 1])
                    ? void 0
                    : p.coordinate,
              u = null == (h = r[o]) ? void 0 : h.coordinate,
              c =
                o >= a - 1
                  ? null == (v = r[0])
                    ? void 0
                    : v.coordinate
                  : null == (y = r[o + 1])
                    ? void 0
                    : y.coordinate,
              s = void 0;
            if (null != l && null != u && null != c)
              if ((0, F.mathSign)(u - l) !== (0, F.mathSign)(c - u)) {
                var f,
                  d,
                  p,
                  h,
                  v,
                  y,
                  g,
                  m = [];
                if ((0, F.mathSign)(c - u) === (0, F.mathSign)(i[1] - i[0])) {
                  s = c;
                  var b = u + i[1] - i[0];
                  ((m[0] = Math.min(b, (b + l) / 2)), (m[1] = Math.max(b, (b + l) / 2)));
                } else {
                  s = l;
                  var x = c + i[1] - i[0];
                  ((m[0] = Math.min(u, (x + u) / 2)), (m[1] = Math.max(u, (x + u) / 2)));
                }
                var w = [Math.min(u, (s + u) / 2), Math.max(u, (s + u) / 2)];
                if ((e > w[0] && e <= w[1]) || (e >= m[0] && e <= m[1]))
                  return null == (g = r[o]) ? void 0 : g.index;
              } else {
                var O,
                  S = Math.min(l, c),
                  A = Math.max(l, c);
                if (e > (S + u) / 2 && e <= (A + u) / 2)
                  return null == (O = r[o]) ? void 0 : O.index;
              }
          }
        else if (t)
          for (var P = 0; P < a; P++) {
            var _ = t[P];
            if (null != _) {
              var E = t[P + 1],
                j = t[P - 1];
              if (
                (0 === P && null != E && e <= (_.coordinate + E.coordinate) / 2) ||
                (P === a - 1 && null != j && e > (_.coordinate + j.coordinate) / 2) ||
                (P > 0 &&
                  P < a - 1 &&
                  null != j &&
                  null != E &&
                  e > (_.coordinate + j.coordinate) / 2 &&
                  e <= (_.coordinate + E.coordinate) / 2)
              )
                return _.index;
            }
          }
        return -1;
      },
      lN = (e, t) => t,
      lI = (e, t, r) => r,
      lL = (e, t, r, n) => n,
      lR = (0, y.createSelector)(lv, (e) => (0, lM.default)(e, (e) => e.coordinate)),
      lB = (0, y.createSelector)([oB, lN, lI, lL], oD),
      lz = (0, y.createSelector)([lB, oZ, ap, lo], oN),
      lF = (e, t, r) => {
        if (null != t) {
          var n = oB(e);
          return 'axis' === t
            ? 'hover' === r
              ? n.axisInteraction.hover.dataKey
              : n.axisInteraction.click.dataKey
            : 'hover' === r
              ? n.itemInteraction.hover.dataKey
              : n.itemInteraction.click.dataKey;
        }
      },
      lU = (0, y.createSelector)([oB, lN, lI, lL], oL),
      lW = (0, y.createSelector)(
        [b.selectChartWidth, b.selectChartHeight, j, m.selectChartOffsetInternal, lv, lL, lU],
        oI,
      ),
      l$ = (0, y.createSelector)([lB, lW], (e, t) => {
        var r;
        return null != (r = e.coordinate) ? r : t;
      }),
      lV = (0, y.createSelector)([lv, lz], oM),
      lK = (0, y.createSelector)([lU, lz, N, ap, lV, oR, lN], o$),
      lH = (0, y.createSelector)([lB, lz], (e, t) => ({
        isActive: e.active && null != t,
        activeIndex: t,
      })),
      lq = (e, t, r, n, i, a, o, l) => {
        if (e && t && n && i && a) {
          if ('horizontal' === t || 'vertical' === t) {
            if (!e || !n || !i || !a) return;
            if (
              (function (e, t) {
                var { relativeX: r, relativeY: n } = e;
                return r >= t.left && r <= t.left + t.width && n >= t.top && n <= t.top + t.height;
              })(e, l)
            ) {
              var u = lD((0, D.calculateCartesianTooltipPos)(e, t), o, a, n, i),
                c = ((e, t, r, n) => {
                  var i = t.find((e) => e && e.index === r);
                  if (i) {
                    if ('horizontal' === e) return { x: i.coordinate, y: n.relativeY };
                    if ('vertical' === e) return { x: n.relativeX, y: i.coordinate };
                  }
                  return { x: 0, y: 0 };
                })(t, a, u, e);
              return { activeIndex: String(u), activeCoordinate: c };
            }
            return;
          }
          if (e && n && i && a && r) {
            var s = ed(e, r);
            if (s) {
              var f = lD((0, D.calculatePolarTooltipPos)(s, t), o, a, n, i),
                d = ((e, t, r, n) => {
                  var i = t.find((e) => e && e.index === r);
                  if (i) {
                    if ('centric' === e) {
                      var a = i.coordinate,
                        { radius: o } = n;
                      return lT(lT(lT({}, n), es(n.cx, n.cy, o, a)), {}, { angle: a, radius: o });
                    }
                    var l = i.coordinate,
                      { angle: u } = n;
                    return lT(lT(lT({}, n), es(n.cx, n.cy, l, u)), {}, { angle: u, radius: l });
                  }
                  return {
                    angle: 0,
                    clockWise: !1,
                    cx: 0,
                    cy: 0,
                    endAngle: 0,
                    innerRadius: 0,
                    outerRadius: 0,
                    radius: 0,
                    startAngle: 0,
                    x: 0,
                    y: 0,
                  };
                })(t, a, f, s);
              return { activeIndex: String(f), activeCoordinate: d };
            }
            return;
          }
        }
      };
    e.s(
      [
        'combineActiveProps',
        0,
        lq,
        'selectActiveCoordinate',
        0,
        l$,
        'selectActiveLabel',
        0,
        lV,
        'selectCoordinateForDefaultIndex',
        0,
        lW,
        'selectIsTooltipActive',
        0,
        lH,
        'selectOrderedTooltipTicks',
        0,
        lR,
        'selectTooltipDataKey',
        0,
        lF,
        'selectTooltipPayload',
        0,
        lK,
        'useChartName',
        0,
        () => (0, g.useAppSelector)(en),
      ],
      92544,
    );
    var lY = (0, y.createSelector)(
      [(e, t) => t, j, eM, ez, ls, lv, lR, m.selectChartOffsetInternal],
      lq,
    );
    function lX(e) {
      var t,
        r,
        n = e.currentTarget.getBoundingClientRect();
      if ('getBBox' in e.currentTarget && 'function' == typeof e.currentTarget.getBBox) {
        var i = e.currentTarget.getBBox();
        ((t = i.width > 0 ? n.width / i.width : 1), (r = i.height > 0 ? n.height / i.height : 1));
      } else {
        var a = e.currentTarget;
        ((t = a.offsetWidth > 0 ? n.width / a.offsetWidth : 1),
          (r = a.offsetHeight > 0 ? n.height / a.offsetHeight : 1));
      }
      var o = (e, i) => ({
        relativeX: Math.round((e - n.left) / t),
        relativeY: Math.round((i - n.top) / r),
      });
      return 'touches' in e
        ? Array.from(e.touches).map((e) => o(e.clientX, e.clientY))
        : o(e.clientX, e.clientY);
    }
    var lG = (0, s.createAction)('mouseClick'),
      lZ = (0, s.createListenerMiddleware)();
    lZ.startListening({
      actionCreator: lG,
      effect: (e, t) => {
        var r = e.payload,
          n = lY(t.getState(), lX(r));
        (null == n ? void 0 : n.activeIndex) != null &&
          t.dispatch(
            (0, p.setMouseClickAxisIndex)({
              activeIndex: n.activeIndex,
              activeDataKey: void 0,
              activeCoordinate: n.activeCoordinate,
            }),
          );
      },
    });
    var lQ = (0, s.createAction)('mouseMove'),
      lJ = (0, s.createListenerMiddleware)(),
      l0 = null,
      l1 = null,
      l2 = null;
    function l4(e, t) {
      return t instanceof HTMLElement
        ? 'HTMLElement <'.concat(t.tagName, ' class="').concat(t.className, '">')
        : t === window
          ? 'global.window'
          : 'children' === e && 'object' == typeof t && null !== t
            ? '<<CHILDREN>>'
            : t;
    }
    lJ.startListening({
      actionCreator: lQ,
      effect: (e, t) => {
        var r = e.payload,
          { throttleDelay: n, throttledEvents: i } = t.getState().eventSettings,
          a = 'all' === i || (null == i ? void 0 : i.includes('mousemove'));
        (null !== l0 && (cancelAnimationFrame(l0), (l0 = null)),
          null === l1 || ('number' == typeof n && a) || (clearTimeout(l1), (l1 = null)),
          (l2 = lX(r)));
        var o = () => {
          var e = t.getState(),
            r = oC(e, e.tooltip.settings.shared);
          if (!l2) {
            ((l0 = null), (l1 = null));
            return;
          }
          if ('axis' === r) {
            var n = lY(e, l2);
            (null == n ? void 0 : n.activeIndex) != null
              ? t.dispatch(
                  (0, p.setMouseOverAxisIndex)({
                    activeIndex: n.activeIndex,
                    activeDataKey: void 0,
                    activeCoordinate: n.activeCoordinate,
                  }),
                )
              : t.dispatch((0, p.mouseLeaveChart)());
          }
          ((l0 = null), (l1 = null));
        };
        a
          ? 'raf' === n
            ? (l0 = requestAnimationFrame(o))
            : 'number' == typeof n && null === l1 && (l1 = setTimeout(o, n))
          : o();
      },
    });
    var l5 = e.i(72783);
    function l3(e, t) {
      var r = Object.keys(e);
      if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(e);
        (t &&
          (n = n.filter(function (t) {
            return Object.getOwnPropertyDescriptor(e, t).enumerable;
          })),
          r.push.apply(r, n));
      }
      return r;
    }
    function l6(e) {
      for (var t = 1; t < arguments.length; t++) {
        var r = null != arguments[t] ? arguments[t] : {};
        t % 2
          ? l3(Object(r), !0).forEach(function (t) {
              var n, i, a;
              ((n = e),
                (i = t),
                (a = r[t]),
                (i = (function (e) {
                  var t = (function (e, t) {
                    if ('object' != typeof e || !e) return e;
                    var r = e[Symbol.toPrimitive];
                    if (void 0 !== r) {
                      var n = r.call(e, t || 'default');
                      if ('object' != typeof n) return n;
                      throw TypeError('@@toPrimitive must return a primitive value.');
                    }
                    return ('string' === t ? String : Number)(e);
                  })(e, 'string');
                  return 'symbol' == typeof t ? t : t + '';
                })(i)) in n
                  ? Object.defineProperty(n, i, {
                      value: a,
                      enumerable: !0,
                      configurable: !0,
                      writable: !0,
                    })
                  : (n[i] = a));
            })
          : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
            : l3(Object(r)).forEach(function (t) {
                Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t));
              });
      }
      return e;
    }
    var l8 = (0, s.createSlice)({
        name: 'cartesianAxis',
        initialState: { xAxis: {}, yAxis: {}, zAxis: {} },
        reducers: {
          addXAxis: {
            reducer(e, t) {
              e.xAxis[t.payload.id] = (0, l5.castDraft)(t.payload);
            },
            prepare: (0, s.prepareAutoBatched)(),
          },
          replaceXAxis: {
            reducer(e, t) {
              var { prev: r, next: n } = t.payload;
              void 0 !== e.xAxis[r.id] &&
                (r.id !== n.id && delete e.xAxis[r.id], (e.xAxis[n.id] = (0, l5.castDraft)(n)));
            },
            prepare: (0, s.prepareAutoBatched)(),
          },
          removeXAxis: {
            reducer(e, t) {
              delete e.xAxis[t.payload.id];
            },
            prepare: (0, s.prepareAutoBatched)(),
          },
          addYAxis: {
            reducer(e, t) {
              e.yAxis[t.payload.id] = (0, l5.castDraft)(t.payload);
            },
            prepare: (0, s.prepareAutoBatched)(),
          },
          replaceYAxis: {
            reducer(e, t) {
              var { prev: r, next: n } = t.payload;
              void 0 !== e.yAxis[r.id] &&
                (r.id !== n.id && delete e.yAxis[r.id], (e.yAxis[n.id] = (0, l5.castDraft)(n)));
            },
            prepare: (0, s.prepareAutoBatched)(),
          },
          removeYAxis: {
            reducer(e, t) {
              delete e.yAxis[t.payload.id];
            },
            prepare: (0, s.prepareAutoBatched)(),
          },
          addZAxis: {
            reducer(e, t) {
              e.zAxis[t.payload.id] = (0, l5.castDraft)(t.payload);
            },
            prepare: (0, s.prepareAutoBatched)(),
          },
          replaceZAxis: {
            reducer(e, t) {
              var { prev: r, next: n } = t.payload;
              void 0 !== e.zAxis[r.id] &&
                (r.id !== n.id && delete e.zAxis[r.id], (e.zAxis[n.id] = (0, l5.castDraft)(n)));
            },
            prepare: (0, s.prepareAutoBatched)(),
          },
          removeZAxis: {
            reducer(e, t) {
              delete e.zAxis[t.payload.id];
            },
            prepare: (0, s.prepareAutoBatched)(),
          },
          updateYAxisWidth(e, t) {
            var { id: r, width: n } = t.payload,
              i = e.yAxis[r];
            if (i) {
              var a,
                o = i.widthHistory || [];
              if (
                3 === o.length &&
                o[0] === o[2] &&
                n === o[1] &&
                n !== i.width &&
                1 >= Math.abs(n - (null != (a = o[0]) ? a : 0))
              )
                return;
              var l = [...o, n].slice(-3);
              e.yAxis[r] = l6(l6({}, i), {}, { width: n, widthHistory: l });
            }
          },
        },
      }),
      {
        addXAxis: l9,
        replaceXAxis: l7,
        removeXAxis: ue,
        addYAxis: ut,
        replaceYAxis: ur,
        removeYAxis: un,
        addZAxis: ui,
        replaceZAxis: ua,
        removeZAxis: uo,
        updateYAxisWidth: ul,
      } = l8.actions,
      uu = l8.reducer;
    e.s(
      [
        'addXAxis',
        0,
        l9,
        'addYAxis',
        0,
        ut,
        'cartesianAxisReducer',
        0,
        uu,
        'defaultAxisId',
        0,
        0,
        'removeXAxis',
        0,
        ue,
        'removeYAxis',
        0,
        un,
        'replaceXAxis',
        0,
        l7,
        'replaceYAxis',
        0,
        ur,
        'updateYAxisWidth',
        0,
        ul,
      ],
      45424,
    );
    var uc = e.i(8974),
      us = (0, s.createSlice)({
        name: 'graphicalItems',
        initialState: { cartesianItems: [], polarItems: [] },
        reducers: {
          addCartesianGraphicalItem: {
            reducer(e, t) {
              e.cartesianItems.push((0, l5.castDraft)(t.payload));
            },
            prepare: (0, s.prepareAutoBatched)(),
          },
          replaceCartesianGraphicalItem: {
            reducer(e, t) {
              var { prev: r, next: n } = t.payload,
                i = (0, uc.current)(e).cartesianItems.indexOf((0, l5.castDraft)(r));
              i > -1 && (e.cartesianItems[i] = (0, l5.castDraft)(n));
            },
            prepare: (0, s.prepareAutoBatched)(),
          },
          removeCartesianGraphicalItem: {
            reducer(e, t) {
              var r = (0, uc.current)(e).cartesianItems.indexOf((0, l5.castDraft)(t.payload));
              r > -1 && e.cartesianItems.splice(r, 1);
            },
            prepare: (0, s.prepareAutoBatched)(),
          },
          addPolarGraphicalItem: {
            reducer(e, t) {
              e.polarItems.push((0, l5.castDraft)(t.payload));
            },
            prepare: (0, s.prepareAutoBatched)(),
          },
          removePolarGraphicalItem: {
            reducer(e, t) {
              var r = (0, uc.current)(e).polarItems.indexOf((0, l5.castDraft)(t.payload));
              r > -1 && e.polarItems.splice(r, 1);
            },
            prepare: (0, s.prepareAutoBatched)(),
          },
          replacePolarGraphicalItem: {
            reducer(e, t) {
              var { prev: r, next: n } = t.payload,
                i = (0, uc.current)(e).polarItems.indexOf((0, l5.castDraft)(r));
              i > -1 && (e.polarItems[i] = (0, l5.castDraft)(n));
            },
            prepare: (0, s.prepareAutoBatched)(),
          },
        },
      }),
      {
        addCartesianGraphicalItem: uf,
        replaceCartesianGraphicalItem: ud,
        removeCartesianGraphicalItem: up,
        addPolarGraphicalItem: uh,
        removePolarGraphicalItem: uv,
        replacePolarGraphicalItem: uy,
      } = us.actions,
      ug = us.reducer;
    e.s(
      [
        'addCartesianGraphicalItem',
        0,
        uf,
        'addPolarGraphicalItem',
        0,
        uh,
        'graphicalItemsReducer',
        0,
        ug,
        'removeCartesianGraphicalItem',
        0,
        up,
        'removePolarGraphicalItem',
        0,
        uv,
        'replaceCartesianGraphicalItem',
        0,
        ud,
        'replacePolarGraphicalItem',
        0,
        uy,
      ],
      26547,
    );
    var um = (0, s.createSlice)({
        name: 'referenceElements',
        initialState: { dots: [], areas: [], lines: [] },
        reducers: {
          addDot: (e, t) => {
            e.dots.push(t.payload);
          },
          removeDot: (e, t) => {
            var r = (0, uc.current)(e).dots.findIndex((e) => e === t.payload);
            -1 !== r && e.dots.splice(r, 1);
          },
          addArea: (e, t) => {
            e.areas.push(t.payload);
          },
          removeArea: (e, t) => {
            var r = (0, uc.current)(e).areas.findIndex((e) => e === t.payload);
            -1 !== r && e.areas.splice(r, 1);
          },
          addLine: (e, t) => {
            e.lines.push((0, l5.castDraft)(t.payload));
          },
          removeLine: (e, t) => {
            var r = (0, uc.current)(e).lines.findIndex((e) => e === t.payload);
            -1 !== r && e.lines.splice(r, 1);
          },
        },
      }),
      {
        addDot: ub,
        removeDot: ux,
        addArea: uw,
        removeArea: uO,
        addLine: uS,
        removeLine: uA,
      } = um.actions,
      uP = um.reducer,
      u_ = { x: 0, y: 0, width: 0, height: 0, padding: { top: 0, right: 0, bottom: 0, left: 0 } },
      uE = (0, s.createSlice)({
        name: 'brush',
        initialState: u_,
        reducers: { setBrushSettings: (e, t) => (null == t.payload ? u_ : t.payload) },
      }),
      { setBrushSettings: uj } = uE.actions,
      uC = uE.reducer,
      uM = (0, s.createSlice)({
        name: 'legend',
        initialState: {
          settings: {
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'middle',
            itemSorter: 'value',
          },
          size: { width: 0, height: 0 },
          payload: [],
        },
        reducers: {
          setLegendSize(e, t) {
            ((e.size.width = t.payload.width), (e.size.height = t.payload.height));
          },
          setLegendSettings(e, t) {
            ((e.settings.align = t.payload.align),
              (e.settings.layout = t.payload.layout),
              (e.settings.verticalAlign = t.payload.verticalAlign),
              (e.settings.itemSorter = t.payload.itemSorter));
          },
          addLegendPayload: {
            reducer(e, t) {
              e.payload.push((0, l5.castDraft)(t.payload));
            },
            prepare: (0, s.prepareAutoBatched)(),
          },
          replaceLegendPayload: {
            reducer(e, t) {
              var { prev: r, next: n } = t.payload,
                i = (0, uc.current)(e).payload.indexOf((0, l5.castDraft)(r));
              i > -1 && (e.payload[i] = (0, l5.castDraft)(n));
            },
            prepare: (0, s.prepareAutoBatched)(),
          },
          removeLegendPayload: {
            reducer(e, t) {
              var r = (0, uc.current)(e).payload.indexOf((0, l5.castDraft)(t.payload));
              r > -1 && e.payload.splice(r, 1);
            },
            prepare: (0, s.prepareAutoBatched)(),
          },
        },
      }),
      {
        setLegendSize: uk,
        setLegendSettings: uT,
        addLegendPayload: uD,
        replaceLegendPayload: uN,
        removeLegendPayload: uI,
      } = uM.actions,
      uL = uM.reducer;
    e.s(
      [
        'addLegendPayload',
        0,
        uD,
        'legendReducer',
        0,
        uL,
        'removeLegendPayload',
        0,
        uI,
        'replaceLegendPayload',
        0,
        uN,
        'setLegendSettings',
        0,
        uT,
        'setLegendSize',
        0,
        uk,
      ],
      89179,
    );
    var uR = {
        accessibilityLayer: !0,
        barCategoryGap: '10%',
        barGap: 4,
        barSize: void 0,
        className: void 0,
        maxBarSize: void 0,
        stackOffset: 'none',
        syncId: void 0,
        syncMethod: 'index',
        baseValue: void 0,
        reverseStackOrder: !1,
      },
      uB = (0, s.createSlice)({
        name: 'rootProps',
        initialState: uR,
        reducers: {
          updateOptions: (e, t) => {
            var r;
            ((e.accessibilityLayer = t.payload.accessibilityLayer),
              (e.barCategoryGap = t.payload.barCategoryGap),
              (e.barGap = null != (r = t.payload.barGap) ? r : uR.barGap),
              (e.barSize = t.payload.barSize),
              (e.maxBarSize = t.payload.maxBarSize),
              (e.stackOffset = t.payload.stackOffset),
              (e.syncId = t.payload.syncId),
              (e.syncMethod = t.payload.syncMethod),
              (e.className = t.payload.className),
              (e.baseValue = t.payload.baseValue),
              (e.reverseStackOrder = t.payload.reverseStackOrder));
          },
        },
      }),
      uz = uB.reducer,
      { updateOptions: uF } = uB.actions,
      uU = (0, s.createSlice)({
        name: 'polarAxis',
        initialState: { radiusAxis: {}, angleAxis: {} },
        reducers: {
          addRadiusAxis(e, t) {
            e.radiusAxis[t.payload.id] = (0, l5.castDraft)(t.payload);
          },
          removeRadiusAxis(e, t) {
            delete e.radiusAxis[t.payload.id];
          },
          addAngleAxis(e, t) {
            e.angleAxis[t.payload.id] = (0, l5.castDraft)(t.payload);
          },
          removeAngleAxis(e, t) {
            delete e.angleAxis[t.payload.id];
          },
        },
      }),
      {
        addRadiusAxis: uW,
        removeRadiusAxis: u$,
        addAngleAxis: uV,
        removeAngleAxis: uK,
      } = uU.actions,
      uH = uU.reducer,
      uq = (0, s.createSlice)({
        name: 'polarOptions',
        initialState: null,
        reducers: {
          updatePolarOptions: (e, t) =>
            null === e
              ? t.payload
              : ((e.startAngle = t.payload.startAngle),
                (e.endAngle = t.payload.endAngle),
                (e.cx = t.payload.cx),
                (e.cy = t.payload.cy),
                (e.innerRadius = t.payload.innerRadius),
                (e.outerRadius = t.payload.outerRadius),
                e),
        },
      }),
      { updatePolarOptions: uY } = uq.actions,
      uX = uq.reducer;
    e.s(['polarOptionsReducer', 0, uX, 'updatePolarOptions', 0, uY], 94592);
    var uG = (0, s.createAction)('keyDown'),
      uZ = (0, s.createAction)('focus'),
      uQ = (0, s.createAction)('blur'),
      uJ = (0, s.createListenerMiddleware)(),
      u0 = null,
      u1 = null,
      u2 = null;
    function u4(e) {
      e.persist();
      var { currentTarget: t } = e;
      return new Proxy(e, {
        get: (e, r) => {
          if ('currentTarget' === r) return t;
          var n = Reflect.get(e, r);
          return 'function' == typeof n ? n.bind(e) : n;
        },
      });
    }
    (uJ.startListening({
      actionCreator: uG,
      effect: (e, t) => {
        ((u2 = e.payload), null !== u0 && (cancelAnimationFrame(u0), (u0 = null)));
        var { throttleDelay: r, throttledEvents: n } = t.getState().eventSettings,
          i = 'all' === n || n.includes('keydown');
        null === u1 || ('number' == typeof r && i) || (clearTimeout(u1), (u1 = null));
        var a = () => {
          try {
            var e,
              r = t.getState();
            if (!1 === r.rootProps.accessibilityLayer) return;
            var { keyboardInteraction: n } = r.tooltip,
              i = u2;
            if ('ArrowRight' !== i && 'ArrowLeft' !== i && 'Enter' !== i) return;
            var a = oN(n, oZ(r), ap(r), lo(r)),
              o = null == a ? -1 : Number(a),
              l = !Number.isFinite(o) || o < 0,
              u = lv(r),
              c = oZ(r),
              s = oC(r, r.tooltip.settings.shared);
            if ('Enter' === i) {
              if (l) return;
              var f = lW(r, s, 'hover', String(n.index));
              t.dispatch(
                (0, p.setKeyboardInteraction)({
                  active: !n.active,
                  activeIndex: n.index,
                  activeCoordinate: f,
                }),
              );
              return;
            }
            var d = oS(r),
              h = 'left-to-right' === d ? 1 : -1,
              v = 'ArrowRight' === i ? 1 : -1;
            if (l) {
              var y = ap(r),
                g = lo(r),
                m = (e) => ({
                  active: !1,
                  index: String(e),
                  dataKey: void 0,
                  graphicalItemId: void 0,
                  coordinate: void 0,
                });
              if (((e = -1), v * h > 0)) {
                for (var b = 0; b < c.length; b++)
                  if (null != oN(m(b), c, y, g)) {
                    e = b;
                    break;
                  }
              } else
                for (var x = c.length - 1; x >= 0; x--)
                  if (null != oN(m(x), c, y, g)) {
                    e = x;
                    break;
                  }
              if (e < 0) return;
            } else {
              e = o + v * h;
              var w = (null == u ? void 0 : u.length) || c.length;
              if (0 === w || e >= w || e < 0) return;
            }
            var O = lW(r, s, 'hover', String(e));
            t.dispatch(
              (0, p.setKeyboardInteraction)({
                active: !0,
                activeIndex: e.toString(),
                activeCoordinate: O,
              }),
            );
          } finally {
            ((u0 = null), (u1 = null));
          }
        };
        i
          ? 'raf' === r
            ? (u0 = requestAnimationFrame(a))
            : 'number' == typeof r &&
              null === u1 &&
              (a(),
              (u2 = null),
              (u1 = setTimeout(() => {
                u2 ? a() : ((u1 = null), (u0 = null));
              }, r)))
          : a();
      },
    }),
      uJ.startListening({
        actionCreator: uZ,
        effect: (e, t) => {
          var r = t.getState();
          if (!1 !== r.rootProps.accessibilityLayer) {
            var { keyboardInteraction: n } = r.tooltip;
            if (!n.active && null == n.index) {
              var i = oC(r, r.tooltip.settings.shared),
                a = lW(r, i, 'hover', String('0'));
              t.dispatch(
                (0, p.setKeyboardInteraction)({
                  active: !0,
                  activeIndex: '0',
                  activeCoordinate: a,
                }),
              );
            }
          }
        },
      }),
      uJ.startListening({
        actionCreator: uQ,
        effect: (e, t) => {
          var r = t.getState();
          if (!1 !== r.rootProps.accessibilityLayer) {
            var { keyboardInteraction: n } = r.tooltip;
            n.active &&
              t.dispatch(
                (0, p.setKeyboardInteraction)({
                  active: !1,
                  activeIndex: n.index,
                  activeCoordinate: n.coordinate,
                }),
              );
          }
        },
      }));
    var u5 = (0, s.createAction)('externalEvent'),
      u3 = (0, s.createListenerMiddleware)(),
      u6 = new Map(),
      u8 = new Map(),
      u9 = new Map();
    u3.startListening({
      actionCreator: u5,
      effect: (e, t) => {
        var { handler: r, reactEvent: n } = e.payload;
        if (null != r) {
          var i = n.type,
            a = u4(n);
          u9.set(i, { handler: r, reactEvent: a });
          var o = u6.get(i);
          void 0 !== o && (cancelAnimationFrame(o), u6.delete(i));
          var { throttleDelay: l, throttledEvents: u } = t.getState().eventSettings,
            c = 'all' === u || (null == u ? void 0 : u.includes(i)),
            s = u8.get(i);
          void 0 === s || ('number' == typeof l && c) || (clearTimeout(s), u8.delete(i));
          var f = () => {
            var e = u9.get(i);
            try {
              if (!e) return;
              var { handler: r, reactEvent: n } = e,
                a = t.getState(),
                o = {
                  activeCoordinate: l_(a),
                  activeDataKey: lO(a),
                  activeIndex: lx(a),
                  activeLabel: lw(a),
                  activeTooltipIndex: lx(a),
                  isTooltipActive: lE(a),
                };
              r && r(o, n);
            } finally {
              (u6.delete(i), u8.delete(i), u9.delete(i));
            }
          };
          if (!c) return void f();
          if ('raf' === l) {
            var d = requestAnimationFrame(f);
            u6.set(i, d);
          } else if ('number' == typeof l) {
            if (!u8.has(i)) {
              f();
              var p = setTimeout(f, l);
              u8.set(i, p);
            }
          } else f();
        }
      },
    });
    var u7 = (0, y.createSelector)([oB], (e) => e.tooltipItemPayloads),
      ce = (0, y.createSelector)([u7, (e, t) => t, (e, t, r) => r], (e, t, r) => {
        if (null != t) {
          var n = e.find((e) => e.settings.graphicalItemId === r);
          if (null != n) {
            var { getPosition: i } = n;
            if (null != i) return i(t);
          }
        }
      }),
      ct = (0, s.createAction)('touchMove'),
      cr = (0, s.createListenerMiddleware)(),
      cn = null,
      ci = null,
      ca = null,
      co = null;
    cr.startListening({
      actionCreator: ct,
      effect: (e, t) => {
        var r = e.payload;
        if (null != r.touches && 0 !== r.touches.length) {
          co = u4(r);
          var { throttleDelay: n, throttledEvents: i } = t.getState().eventSettings,
            a = 'all' === i || i.includes('touchmove');
          (null !== cn && (cancelAnimationFrame(cn), (cn = null)),
            null === ci || ('number' == typeof n && a) || (clearTimeout(ci), (ci = null)),
            (ca = Array.from(r.touches).map((e) =>
              lX({ clientX: e.clientX, clientY: e.clientY, currentTarget: r.currentTarget }),
            )));
          var o = () => {
            if (null != co) {
              var e = t.getState(),
                r = oC(e, e.tooltip.settings.shared);
              if ('axis' === r) {
                var n,
                  i = null == (n = ca) ? void 0 : n[0];
                if (null == i) {
                  ((cn = null), (ci = null));
                  return;
                }
                var a = lY(e, i);
                (null == a ? void 0 : a.activeIndex) != null &&
                  t.dispatch(
                    (0, p.setMouseOverAxisIndex)({
                      activeIndex: a.activeIndex,
                      activeDataKey: void 0,
                      activeCoordinate: a.activeCoordinate,
                    }),
                  );
              } else if ('item' === r) {
                var o,
                  l = co.touches[0];
                if (null == document.elementFromPoint || null == l) return;
                var u = document.elementFromPoint(l.clientX, l.clientY);
                if (!u || !u.getAttribute) return;
                var c = u.getAttribute(eD.DATA_ITEM_INDEX_ATTRIBUTE_NAME),
                  s =
                    null != (o = u.getAttribute(eD.DATA_ITEM_GRAPHICAL_ITEM_ID_ATTRIBUTE_NAME))
                      ? o
                      : void 0,
                  f = oq(e).find((e) => e.id === s);
                if (null == c || null == f || null == s) return;
                var { dataKey: d } = f,
                  h = ce(e, c, s);
                t.dispatch(
                  (0, p.setActiveMouseOverItemIndex)({
                    activeDataKey: d,
                    activeIndex: c,
                    activeCoordinate: h,
                    activeGraphicalItemId: s,
                  }),
                );
              }
              ((cn = null), (ci = null));
            }
          };
          if (!a) return void o();
          'raf' === n
            ? (cn = requestAnimationFrame(o))
            : 'number' == typeof n &&
              null === ci &&
              (o(),
              (co = null),
              (ci = setTimeout(() => {
                co ? o() : ((ci = null), (cn = null));
              }, n)));
        }
      },
    });
    var cl = (0, s.createSlice)({
        name: 'errorBars',
        initialState: {},
        reducers: {
          addErrorBar: (e, t) => {
            var { itemId: r, errorBar: n } = t.payload;
            (e[r] || (e[r] = []), e[r].push(n));
          },
          replaceErrorBar: (e, t) => {
            var { itemId: r, prev: n, next: i } = t.payload;
            e[r] &&
              (e[r] = e[r].map((e) =>
                e.dataKey === n.dataKey && e.direction === n.direction ? i : e,
              ));
          },
          removeErrorBar: (e, t) => {
            var { itemId: r, errorBar: n } = t.payload;
            e[r] &&
              (e[r] = e[r].filter((e) => e.dataKey !== n.dataKey || e.direction !== n.direction));
          },
        },
      }),
      { addErrorBar: cu, replaceErrorBar: cc, removeErrorBar: cs } = cl.actions,
      cf = cl.reducer,
      cd = {
        devToolsEnabled: !0,
        isSsr: !(
          'u' > typeof window &&
          window.document &&
          window.document.createElement &&
          window.setTimeout
        ),
      };
    function cp(e, t) {
      var r = Object.keys(e);
      if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(e);
        (t &&
          (n = n.filter(function (t) {
            return Object.getOwnPropertyDescriptor(e, t).enumerable;
          })),
          r.push.apply(r, n));
      }
      return r;
    }
    function ch(e) {
      for (var t = 1; t < arguments.length; t++) {
        var r = null != arguments[t] ? arguments[t] : {};
        t % 2
          ? cp(Object(r), !0).forEach(function (t) {
              var n, i, a;
              ((n = e),
                (i = t),
                (a = r[t]),
                (i = (function (e) {
                  var t = (function (e, t) {
                    if ('object' != typeof e || !e) return e;
                    var r = e[Symbol.toPrimitive];
                    if (void 0 !== r) {
                      var n = r.call(e, t || 'default');
                      if ('object' != typeof n) return n;
                      throw TypeError('@@toPrimitive must return a primitive value.');
                    }
                    return ('string' === t ? String : Number)(e);
                  })(e, 'string');
                  return 'symbol' == typeof t ? t : t + '';
                })(i)) in n
                  ? Object.defineProperty(n, i, {
                      value: a,
                      enumerable: !0,
                      configurable: !0,
                      writable: !0,
                    })
                  : (n[i] = a));
            })
          : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
            : cp(Object(r)).forEach(function (t) {
                Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t));
              });
      }
      return e;
    }
    e.s(['Global', 0, cd], 85948);
    var cv = {
        zIndexMap: Object.values(ep).reduce(
          (e, t) =>
            ch(ch({}, e), {}, { [t]: { element: void 0, panoramaElement: void 0, consumers: 0 } }),
          {},
        ),
      },
      cy = new Set(Object.values(ep)),
      cg = (0, s.createSlice)({
        name: 'zIndex',
        initialState: cv,
        reducers: {
          registerZIndexPortal: {
            reducer: (e, t) => {
              var { zIndex: r } = t.payload;
              e.zIndexMap[r]
                ? (e.zIndexMap[r].consumers += 1)
                : (e.zIndexMap[r] = { consumers: 1, element: void 0, panoramaElement: void 0 });
            },
            prepare: (0, s.prepareAutoBatched)(),
          },
          unregisterZIndexPortal: {
            reducer: (e, t) => {
              var { zIndex: r } = t.payload;
              e.zIndexMap[r] &&
                ((e.zIndexMap[r].consumers -= 1),
                e.zIndexMap[r].consumers <= 0 && !cy.has(r) && delete e.zIndexMap[r]);
            },
            prepare: (0, s.prepareAutoBatched)(),
          },
          registerZIndexPortalElement: {
            reducer: (e, t) => {
              var { zIndex: r, element: n, isPanorama: i } = t.payload;
              e.zIndexMap[r]
                ? i
                  ? (e.zIndexMap[r].panoramaElement = (0, l5.castDraft)(n))
                  : (e.zIndexMap[r].element = (0, l5.castDraft)(n))
                : (e.zIndexMap[r] = {
                    consumers: 0,
                    element: i ? void 0 : (0, l5.castDraft)(n),
                    panoramaElement: i ? (0, l5.castDraft)(n) : void 0,
                  });
            },
            prepare: (0, s.prepareAutoBatched)(),
          },
          unregisterZIndexPortalElement: {
            reducer: (e, t) => {
              var { zIndex: r } = t.payload;
              e.zIndexMap[r] &&
                (t.payload.isPanorama
                  ? (e.zIndexMap[r].panoramaElement = void 0)
                  : (e.zIndexMap[r].element = void 0));
            },
            prepare: (0, s.prepareAutoBatched)(),
          },
        },
      }),
      {
        registerZIndexPortal: cm,
        unregisterZIndexPortal: cb,
        registerZIndexPortalElement: cx,
        unregisterZIndexPortalElement: cw,
      } = cg.actions,
      cO = cg.reducer;
    e.s(
      [
        'registerZIndexPortal',
        0,
        cm,
        'registerZIndexPortalElement',
        0,
        cx,
        'unregisterZIndexPortal',
        0,
        cb,
        'unregisterZIndexPortalElement',
        0,
        cw,
        'zIndexReducer',
        0,
        cO,
      ],
      18344,
    );
    var cS = {
        throttleDelay: 'raf',
        throttledEvents: ['mousemove', 'touchmove', 'pointermove', 'scroll', 'wheel'],
      },
      cA = (0, s.createSlice)({
        name: 'eventSettings',
        initialState: cS,
        reducers: {
          setEventSettings: (e, t) => {
            (null != t.payload.throttleDelay && (e.throttleDelay = t.payload.throttleDelay),
              null != t.payload.throttledEvents &&
                (e.throttledEvents = (0, l5.castDraft)(t.payload.throttledEvents)));
          },
        },
      }),
      { setEventSettings: cP } = cA.actions,
      c_ = cA.reducer;
    e.s(
      [
        'eventSettingsReducer',
        0,
        c_,
        'initialEventSettingsState',
        0,
        cS,
        'setEventSettings',
        0,
        cP,
      ],
      94191,
    );
    var cE = (0, s.createSlice)({
        name: 'renderedTicks',
        initialState: { xAxis: {}, yAxis: {} },
        reducers: {
          setRenderedTicks: (e, t) => {
            var { axisType: r, axisId: n, ticks: i } = t.payload;
            e[r][n] = (0, l5.castDraft)(i);
          },
          removeRenderedTicks: (e, t) => {
            var { axisType: r, axisId: n } = t.payload;
            delete e[r][n];
          },
        },
      }),
      { setRenderedTicks: cj, removeRenderedTicks: cC } = cE.actions,
      cM = cE.reducer;
    e.s(
      ['removeRenderedTicks', 0, cC, 'renderedTicksReducer', 0, cM, 'setRenderedTicks', 0, cj],
      61049,
    );
    var ck = (0, f.combineReducers)({
        brush: uC,
        cartesianAxis: uu,
        chartData: h.chartDataReducer,
        errorBars: cf,
        eventSettings: c_,
        graphicalItems: ug,
        layout: v.chartLayoutReducer,
        legend: uL,
        options: d.optionsReducer,
        polarAxis: uH,
        polarOptions: uX,
        referenceElements: uP,
        renderedTicks: cM,
        rootProps: uz,
        tooltip: p.tooltipReducer,
        zIndex: cO,
      }),
      cT = function (e) {
        var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 'Chart';
        return (0, s.configureStore)({
          reducer: ck,
          preloadedState: e,
          middleware: (e) =>
            e({
              serializableCheck: !1,
              immutableCheck: !['commonjs', 'es6', 'production'].includes('es6'),
            }).concat([lZ.middleware, lJ.middleware, uJ.middleware, u3.middleware, cr.middleware]),
          enhancers: (e) => {
            var t = e;
            return (
              'function' == typeof e && (t = e()),
              t.concat((0, s.autoBatchEnhancer)({ type: 'raf' }))
            );
          },
          devTools: cd.devToolsEnabled && {
            serialize: { replacer: l4 },
            name: 'recharts-'.concat(t),
          },
        });
      },
      cD = e.i(31292);
    (e.s(
      [
        'RechartsStoreProvider',
        0,
        function (e) {
          var { preloadedState: t, children: r, reduxStoreName: n } = e,
            i = (0, x.useIsPanorama)(),
            a = (0, u.useRef)(null);
          if (i) return r;
          null == a.current && (a.current = cT(t, n));
          var o = cD.RechartsReduxContext;
          return u.createElement(c.Provider, { context: o, store: a.current }, r);
        },
      ],
      26951,
    ),
      e.s(
        [
          'ChartDataContextProvider',
          0,
          (e) => {
            var { chartData: t } = e,
              r = (0, g.useAppDispatch)(),
              n = (0, x.useIsPanorama)();
            return (
              (0, u.useEffect)(
                () =>
                  n
                    ? () => {}
                    : (r((0, h.setChartData)(t)),
                      () => {
                        r((0, h.setChartData)(void 0));
                      }),
                [t, r, n],
              ),
              null
            );
          },
        ],
        2052,
      ));
    var cN = new Set([
      'axisLine',
      'tickLine',
      'activeBar',
      'activeDot',
      'activeLabel',
      'activeShape',
      'allowEscapeViewBox',
      'background',
      'cursor',
      'dot',
      'label',
      'line',
      'margin',
      'padding',
      'position',
      'shape',
      'style',
      'tick',
      'wrapperStyle',
      'radius',
      'throttledEvents',
    ]);
    function cI(e, t) {
      for (var r of new Set([...Object.keys(e), ...Object.keys(t)]))
        if (cN.has(r)) {
          if (null == e[r] && null == t[r]) continue;
          if (!(0, c.shallowEqual)(e[r], t[r])) return !1;
        } else {
          var n, i;
          if (
            ((n = e[r]),
            (i = t[r]),
            (null != n || null != i) &&
              ('number' == typeof n && 'number' == typeof i
                ? n !== i && (n == n || i == i)
                : n !== i))
          )
            return !1;
        }
      return !0;
    }
    e.s(['propsAreEqual', 0, cI], 97943);
    var cL = (0, u.memo)(function (e) {
      var { layout: t, margin: r } = e,
        n = (0, g.useAppDispatch)(),
        i = (0, x.useIsPanorama)();
      return (
        (0, u.useEffect)(() => {
          i || (n((0, v.setLayout)(t)), n((0, v.setMargin)(r)));
        }, [n, i, t, r]),
        null
      );
    }, cI);
    (e.s(['ReportMainChartProps', 0, cL], 54947),
      e.s(
        [
          'ReportChartProps',
          0,
          function (e) {
            var t = (0, g.useAppDispatch)();
            return (
              (0, u.useEffect)(() => {
                t(uF(e));
              }, [t, e]),
              null
            );
          },
        ],
        75648,
      ));
    var cR = (0, u.memo)((e) => {
      var t = (0, g.useAppDispatch)();
      return (
        (0, u.useEffect)(() => {
          t(cP(e));
        }, [t, e]),
        null
      );
    }, cI);
    e.s(['ReportEventSettings', 0, cR], 57308);
    var cB = () => {
      var e;
      return null == (e = (0, g.useAppSelector)((e) => e.rootProps.accessibilityLayer)) || e;
    };
    e.s(['useAccessibilityLayer', 0, cB], 84773);
    var cz = e.i(94083),
      cF = [
        'dangerouslySetInnerHTML',
        'onCopy',
        'onCopyCapture',
        'onCut',
        'onCutCapture',
        'onPaste',
        'onPasteCapture',
        'onCompositionEnd',
        'onCompositionEndCapture',
        'onCompositionStart',
        'onCompositionStartCapture',
        'onCompositionUpdate',
        'onCompositionUpdateCapture',
        'onFocus',
        'onFocusCapture',
        'onBlur',
        'onBlurCapture',
        'onChange',
        'onChangeCapture',
        'onBeforeInput',
        'onBeforeInputCapture',
        'onInput',
        'onInputCapture',
        'onReset',
        'onResetCapture',
        'onSubmit',
        'onSubmitCapture',
        'onInvalid',
        'onInvalidCapture',
        'onLoad',
        'onLoadCapture',
        'onError',
        'onErrorCapture',
        'onKeyDown',
        'onKeyDownCapture',
        'onKeyPress',
        'onKeyPressCapture',
        'onKeyUp',
        'onKeyUpCapture',
        'onAbort',
        'onAbortCapture',
        'onCanPlay',
        'onCanPlayCapture',
        'onCanPlayThrough',
        'onCanPlayThroughCapture',
        'onDurationChange',
        'onDurationChangeCapture',
        'onEmptied',
        'onEmptiedCapture',
        'onEncrypted',
        'onEncryptedCapture',
        'onEnded',
        'onEndedCapture',
        'onLoadedData',
        'onLoadedDataCapture',
        'onLoadedMetadata',
        'onLoadedMetadataCapture',
        'onLoadStart',
        'onLoadStartCapture',
        'onPause',
        'onPauseCapture',
        'onPlay',
        'onPlayCapture',
        'onPlaying',
        'onPlayingCapture',
        'onProgress',
        'onProgressCapture',
        'onRateChange',
        'onRateChangeCapture',
        'onSeeked',
        'onSeekedCapture',
        'onSeeking',
        'onSeekingCapture',
        'onStalled',
        'onStalledCapture',
        'onSuspend',
        'onSuspendCapture',
        'onTimeUpdate',
        'onTimeUpdateCapture',
        'onVolumeChange',
        'onVolumeChangeCapture',
        'onWaiting',
        'onWaitingCapture',
        'onAuxClick',
        'onAuxClickCapture',
        'onClick',
        'onClickCapture',
        'onContextMenu',
        'onContextMenuCapture',
        'onDoubleClick',
        'onDoubleClickCapture',
        'onDrag',
        'onDragCapture',
        'onDragEnd',
        'onDragEndCapture',
        'onDragEnter',
        'onDragEnterCapture',
        'onDragExit',
        'onDragExitCapture',
        'onDragLeave',
        'onDragLeaveCapture',
        'onDragOver',
        'onDragOverCapture',
        'onDragStart',
        'onDragStartCapture',
        'onDrop',
        'onDropCapture',
        'onMouseDown',
        'onMouseDownCapture',
        'onMouseEnter',
        'onMouseLeave',
        'onMouseMove',
        'onMouseMoveCapture',
        'onMouseOut',
        'onMouseOutCapture',
        'onMouseOver',
        'onMouseOverCapture',
        'onMouseUp',
        'onMouseUpCapture',
        'onSelect',
        'onSelectCapture',
        'onTouchCancel',
        'onTouchCancelCapture',
        'onTouchEnd',
        'onTouchEndCapture',
        'onTouchMove',
        'onTouchMoveCapture',
        'onTouchStart',
        'onTouchStartCapture',
        'onPointerDown',
        'onPointerDownCapture',
        'onPointerMove',
        'onPointerMoveCapture',
        'onPointerUp',
        'onPointerUpCapture',
        'onPointerCancel',
        'onPointerCancelCapture',
        'onPointerEnter',
        'onPointerEnterCapture',
        'onPointerLeave',
        'onPointerLeaveCapture',
        'onPointerOver',
        'onPointerOverCapture',
        'onPointerOut',
        'onPointerOutCapture',
        'onGotPointerCapture',
        'onGotPointerCaptureCapture',
        'onLostPointerCapture',
        'onLostPointerCaptureCapture',
        'onScroll',
        'onScrollCapture',
        'onWheel',
        'onWheelCapture',
        'onAnimationStart',
        'onAnimationStartCapture',
        'onAnimationEnd',
        'onAnimationEndCapture',
        'onAnimationIteration',
        'onAnimationIterationCapture',
        'onTransitionEnd',
        'onTransitionEndCapture',
      ];
    function cU(e) {
      return 'string' == typeof e && cF.includes(e);
    }
    e.s(['isEventKey', 0, cU], 37195);
    var cW = new Set([
      'aria-activedescendant',
      'aria-atomic',
      'aria-autocomplete',
      'aria-busy',
      'aria-checked',
      'aria-colcount',
      'aria-colindex',
      'aria-colspan',
      'aria-controls',
      'aria-current',
      'aria-describedby',
      'aria-details',
      'aria-disabled',
      'aria-errormessage',
      'aria-expanded',
      'aria-flowto',
      'aria-haspopup',
      'aria-hidden',
      'aria-invalid',
      'aria-keyshortcuts',
      'aria-label',
      'aria-labelledby',
      'aria-level',
      'aria-live',
      'aria-modal',
      'aria-multiline',
      'aria-multiselectable',
      'aria-orientation',
      'aria-owns',
      'aria-placeholder',
      'aria-posinset',
      'aria-pressed',
      'aria-readonly',
      'aria-relevant',
      'aria-required',
      'aria-roledescription',
      'aria-rowcount',
      'aria-rowindex',
      'aria-rowspan',
      'aria-selected',
      'aria-setsize',
      'aria-sort',
      'aria-valuemax',
      'aria-valuemin',
      'aria-valuenow',
      'aria-valuetext',
      'className',
      'color',
      'height',
      'id',
      'lang',
      'max',
      'media',
      'method',
      'min',
      'name',
      'style',
      'target',
      'width',
      'role',
      'tabIndex',
      'accentHeight',
      'accumulate',
      'additive',
      'alignmentBaseline',
      'allowReorder',
      'alphabetic',
      'amplitude',
      'arabicForm',
      'ascent',
      'attributeName',
      'attributeType',
      'autoReverse',
      'azimuth',
      'baseFrequency',
      'baselineShift',
      'baseProfile',
      'bbox',
      'begin',
      'bias',
      'by',
      'calcMode',
      'capHeight',
      'clip',
      'clipPath',
      'clipPathUnits',
      'clipRule',
      'colorInterpolation',
      'colorInterpolationFilters',
      'colorProfile',
      'colorRendering',
      'contentScriptType',
      'contentStyleType',
      'cursor',
      'cx',
      'cy',
      'd',
      'decelerate',
      'descent',
      'diffuseConstant',
      'direction',
      'display',
      'divisor',
      'dominantBaseline',
      'dur',
      'dx',
      'dy',
      'edgeMode',
      'elevation',
      'enableBackground',
      'end',
      'exponent',
      'externalResourcesRequired',
      'fill',
      'fillOpacity',
      'fillRule',
      'filter',
      'filterRes',
      'filterUnits',
      'floodColor',
      'floodOpacity',
      'focusable',
      'fontFamily',
      'fontSize',
      'fontSizeAdjust',
      'fontStretch',
      'fontStyle',
      'fontVariant',
      'fontWeight',
      'format',
      'from',
      'fx',
      'fy',
      'g1',
      'g2',
      'glyphName',
      'glyphOrientationHorizontal',
      'glyphOrientationVertical',
      'glyphRef',
      'gradientTransform',
      'gradientUnits',
      'hanging',
      'horizAdvX',
      'horizOriginX',
      'href',
      'ideographic',
      'imageRendering',
      'in2',
      'in',
      'intercept',
      'k1',
      'k2',
      'k3',
      'k4',
      'k',
      'kernelMatrix',
      'kernelUnitLength',
      'kerning',
      'keyPoints',
      'keySplines',
      'keyTimes',
      'lengthAdjust',
      'letterSpacing',
      'lightingColor',
      'limitingConeAngle',
      'local',
      'markerEnd',
      'markerHeight',
      'markerMid',
      'markerStart',
      'markerUnits',
      'markerWidth',
      'mask',
      'maskContentUnits',
      'maskUnits',
      'mathematical',
      'mode',
      'numOctaves',
      'offset',
      'opacity',
      'operator',
      'order',
      'orient',
      'orientation',
      'origin',
      'overflow',
      'overlinePosition',
      'overlineThickness',
      'paintOrder',
      'panose1',
      'pathLength',
      'patternContentUnits',
      'patternTransform',
      'patternUnits',
      'pointerEvents',
      'pointsAtX',
      'pointsAtY',
      'pointsAtZ',
      'preserveAlpha',
      'preserveAspectRatio',
      'primitiveUnits',
      'r',
      'radius',
      'refX',
      'refY',
      'renderingIntent',
      'repeatCount',
      'repeatDur',
      'requiredExtensions',
      'requiredFeatures',
      'restart',
      'result',
      'rotate',
      'rx',
      'ry',
      'seed',
      'shapeRendering',
      'slope',
      'spacing',
      'specularConstant',
      'specularExponent',
      'speed',
      'spreadMethod',
      'startOffset',
      'stdDeviation',
      'stemh',
      'stemv',
      'stitchTiles',
      'stopColor',
      'stopOpacity',
      'strikethroughPosition',
      'strikethroughThickness',
      'string',
      'stroke',
      'strokeDasharray',
      'strokeDashoffset',
      'strokeLinecap',
      'strokeLinejoin',
      'strokeMiterlimit',
      'strokeOpacity',
      'strokeWidth',
      'surfaceScale',
      'systemLanguage',
      'tableValues',
      'targetX',
      'targetY',
      'textAnchor',
      'textDecoration',
      'textLength',
      'textRendering',
      'to',
      'transform',
      'u1',
      'u2',
      'underlinePosition',
      'underlineThickness',
      'unicode',
      'unicodeBidi',
      'unicodeRange',
      'unitsPerEm',
      'vAlphabetic',
      'values',
      'vectorEffect',
      'version',
      'vertAdvY',
      'vertOriginX',
      'vertOriginY',
      'vHanging',
      'vIdeographic',
      'viewTarget',
      'visibility',
      'vMathematical',
      'widths',
      'wordSpacing',
      'writingMode',
      'x1',
      'x2',
      'x',
      'xChannelSelector',
      'xHeight',
      'xlinkActuate',
      'xlinkArcrole',
      'xlinkHref',
      'xlinkRole',
      'xlinkShow',
      'xlinkTitle',
      'xlinkType',
      'xmlBase',
      'xmlLang',
      'xmlns',
      'xmlnsXlink',
      'xmlSpace',
      'y1',
      'y2',
      'y',
      'yChannelSelector',
      'z',
      'zoomAndPan',
      'ref',
      'key',
      'angle',
    ]);
    function c$(e) {
      return 'string' == typeof e && cW.has(e);
    }
    function cV(e) {
      return 'string' == typeof e && e.startsWith('data-');
    }
    function cK(e) {
      if ('object' != typeof e || null === e) return {};
      var t = {};
      for (var r in e)
        Object.prototype.hasOwnProperty.call(e, r) && (c$(r) || cV(r)) && (t[r] = e[r]);
      return t;
    }
    function cH(e) {
      var t = {};
      for (var r in e)
        Object.prototype.hasOwnProperty.call(e, r) && (c$(r) || cV(r) || cU(r)) && (t[r] = e[r]);
      return t;
    }
    (e.s(
      [
        'isDataAttribute',
        0,
        cV,
        'isSvgElementPropKey',
        0,
        c$,
        'svgPropertiesNoEvents',
        0,
        cK,
        'svgPropertiesNoEventsFromUnknown',
        0,
        function (e) {
          return null == e
            ? null
            : (0, u.isValidElement)(e) && 'object' == typeof e.props && null !== e.props
              ? cK(e.props)
              : 'object' != typeof e || Array.isArray(e)
                ? null
                : cK(e);
        },
      ],
      75093,
    ),
      e.s(
        [
          'svgPropertiesAndEvents',
          0,
          cH,
          'svgPropertiesAndEventsFromUnknown',
          0,
          function (e) {
            return null == e
              ? null
              : (0, u.isValidElement)(e)
                ? cH(e.props)
                : 'object' != typeof e || Array.isArray(e)
                  ? null
                  : cH(e);
          },
        ],
        73508,
      ));
    var cq = ['children', 'width', 'height', 'viewBox', 'className', 'style', 'title', 'desc'];
    function cY() {
      return (cY = Object.assign.bind()).apply(null, arguments);
    }
    var cX = (0, u.forwardRef)((e, t) => {
      var {
          children: r,
          width: n,
          height: i,
          viewBox: a,
          className: o,
          style: l,
          title: c,
          desc: s,
        } = e,
        f = (function (e, t) {
          if (null == e) return {};
          var r,
            n,
            i = (function (e, t) {
              if (null == e) return {};
              var r = {};
              for (var n in e)
                if ({}.hasOwnProperty.call(e, n)) {
                  if (-1 !== t.indexOf(n)) continue;
                  r[n] = e[n];
                }
              return r;
            })(e, t);
          if (Object.getOwnPropertySymbols) {
            var a = Object.getOwnPropertySymbols(e);
            for (n = 0; n < a.length; n++)
              ((r = a[n]),
                -1 === t.indexOf(r) && {}.propertyIsEnumerable.call(e, r) && (i[r] = e[r]));
          }
          return i;
        })(e, cq),
        d = a || { width: n, height: i, x: 0, y: 0 },
        p = (0, cz.clsx)('recharts-surface', o);
      return u.createElement(
        'svg',
        cY({}, cH(f), {
          className: p,
          width: n,
          height: i,
          style: l,
          viewBox: ''.concat(d.x, ' ').concat(d.y, ' ').concat(d.width, ' ').concat(d.height),
          ref: t,
        }),
        u.createElement('title', null, c),
        u.createElement('desc', null, s),
        r,
      );
    });
    e.s(['Surface', 0, cX], 29589);
    var cG = (0, y.createSelector)(
        (e) => e.zIndex.zIndexMap,
        (e, t) => t,
        (e, t, r) => r,
        (e, t, r) => {
          if (null != t) {
            var n = e[t];
            if (null != n) return r ? n.panoramaElement : n.element;
          }
        },
      ),
      cZ = (0, y.createSelector)(
        (e) => e.zIndex.zIndexMap,
        (e) =>
          Array.from(
            new Set(
              Object.keys(e)
                .map((e) => parseInt(e, 10))
                .concat(Object.values(ep)),
            ),
          ).sort((e, t) => e - t),
        {
          memoizeOptions: {
            resultEqualityCheck: function (e, t) {
              if (e.length === t.length) {
                for (var r = 0; r < e.length; r++) if (e[r] !== t[r]) return !1;
                return !0;
              }
              return !1;
            },
          },
        },
      );
    function cQ(e) {
      var { zIndex: t, isPanorama: r } = e,
        n = (0, u.useRef)(null),
        i = (0, g.useAppDispatch)();
      return (
        (0, u.useLayoutEffect)(
          () => (
            n.current && i(cx({ zIndex: t, element: n.current, isPanorama: r })),
            () => {
              i(cw({ zIndex: t, isPanorama: r }));
            }
          ),
          [i, t, r],
        ),
        u.createElement('g', {
          tabIndex: -1,
          ref: n,
          className: 'recharts-zIndex-layer_'.concat(t),
        })
      );
    }
    function cJ(e) {
      var { children: t, isPanorama: r } = e,
        n = (0, g.useAppSelector)(cZ);
      if (!n || 0 === n.length) return t;
      var i = n.filter((e) => e < 0),
        a = n.filter((e) => e > 0);
      return u.createElement(
        u.Fragment,
        null,
        i.map((e) => u.createElement(cQ, { key: e, zIndex: e, isPanorama: r })),
        t,
        a.map((e) => u.createElement(cQ, { key: e, zIndex: e, isPanorama: r })),
      );
    }
    e.s(['selectAllRegisteredZIndexes', 0, cZ, 'selectZIndexPortalElement', 0, cG], 47432);
    var c0 = ['children'];
    function c1() {
      return (c1 = Object.assign.bind()).apply(null, arguments);
    }
    var c2 = { width: '100%', height: '100%', display: 'block' },
      c4 = (0, u.forwardRef)((e, t) => {
        var r,
          n,
          i = _(),
          a = E(),
          o = cB();
        if (!(0, S.isPositiveNumber)(i) || !(0, S.isPositiveNumber)(a)) return null;
        var { children: l, otherAttributes: c, title: s, desc: f } = e;
        return (
          null != c &&
            ((r = 'number' == typeof c.tabIndex ? c.tabIndex : o ? 0 : void 0),
            (n = 'string' == typeof c.role ? c.role : o ? 'application' : void 0)),
          u.createElement(
            cX,
            c1({}, c, {
              title: s,
              desc: f,
              role: n,
              tabIndex: r,
              width: i,
              height: a,
              style: c2,
              ref: t,
            }),
            l,
          )
        );
      }),
      c5 = (e) => {
        var { children: t } = e,
          r = (0, g.useAppSelector)(w.selectBrushDimensions);
        if (!r) return null;
        var { width: n, height: i, y: a, x: o } = r;
        return u.createElement(cX, { width: n, height: i, x: o, y: a }, t);
      },
      c3 = (0, u.forwardRef)((e, t) => {
        var { children: r } = e,
          n = (function (e, t) {
            if (null == e) return {};
            var r,
              n,
              i = (function (e, t) {
                if (null == e) return {};
                var r = {};
                for (var n in e)
                  if ({}.hasOwnProperty.call(e, n)) {
                    if (-1 !== t.indexOf(n)) continue;
                    r[n] = e[n];
                  }
                return r;
              })(e, t);
            if (Object.getOwnPropertySymbols) {
              var a = Object.getOwnPropertySymbols(e);
              for (n = 0; n < a.length; n++)
                ((r = a[n]),
                  -1 === t.indexOf(r) && {}.propertyIsEnumerable.call(e, r) && (i[r] = e[r]));
            }
            return i;
          })(e, c0);
        return (0, x.useIsPanorama)()
          ? u.createElement(c5, null, u.createElement(cJ, { isPanorama: !0 }, r))
          : u.createElement(c4, c1({ ref: t }, n), u.createElement(cJ, { isPanorama: !1 }, r));
      }),
      c6 = new (e.i(76595).default)(),
      c8 = 'recharts.syncEvent.tooltip',
      c9 = 'recharts.syncEvent.brush';
    function c7(e) {
      return e.tooltip.syncInteraction;
    }
    var se = ['x', 'y'];
    function st(e, t) {
      var r = Object.keys(e);
      if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(e);
        (t &&
          (n = n.filter(function (t) {
            return Object.getOwnPropertyDescriptor(e, t).enumerable;
          })),
          r.push.apply(r, n));
      }
      return r;
    }
    function sr(e) {
      for (var t = 1; t < arguments.length; t++) {
        var r = null != arguments[t] ? arguments[t] : {};
        t % 2
          ? st(Object(r), !0).forEach(function (t) {
              var n, i, a;
              ((n = e),
                (i = t),
                (a = r[t]),
                (i = (function (e) {
                  var t = (function (e, t) {
                    if ('object' != typeof e || !e) return e;
                    var r = e[Symbol.toPrimitive];
                    if (void 0 !== r) {
                      var n = r.call(e, t || 'default');
                      if ('object' != typeof n) return n;
                      throw TypeError('@@toPrimitive must return a primitive value.');
                    }
                    return ('string' === t ? String : Number)(e);
                  })(e, 'string');
                  return 'symbol' == typeof t ? t : t + '';
                })(i)) in n
                  ? Object.defineProperty(n, i, {
                      value: a,
                      enumerable: !0,
                      configurable: !0,
                      writable: !0,
                    })
                  : (n[i] = a));
            })
          : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
            : st(Object(r)).forEach(function (t) {
                Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t));
              });
      }
      return e;
    }
    function sn() {
      var e,
        t,
        r,
        n,
        i,
        a,
        o,
        l,
        c,
        s,
        f,
        v = (0, g.useAppDispatch)();
      ((0, u.useEffect)(() => {
        v((0, d.createEventEmitter)());
      }, [v]),
        (e = (0, g.useAppSelector)(ei)),
        (t = (0, g.useAppSelector)(eo)),
        (r = (0, g.useAppDispatch)()),
        (n = (0, g.useAppSelector)(ea)),
        (i = (0, g.useAppSelector)(lv)),
        (a = C()),
        (o = A()),
        (l = (0, g.useAppSelector)((e) => e.rootProps.className)),
        (0, u.useEffect)(() => {
          if (null == e) return F.noop;
          var l = (l, u, c) => {
            if (t !== c && e === l) {
              if (!1 === u.payload.active)
                return void r(
                  (0, p.setSyncInteraction)({
                    active: !1,
                    coordinate: void 0,
                    dataKey: void 0,
                    index: null,
                    label: void 0,
                    sourceViewBox: void 0,
                    graphicalItemId: void 0,
                  }),
                );
              if ('index' === n) {
                if (
                  o &&
                  null != u &&
                  null != (s = u.payload) &&
                  s.coordinate &&
                  u.payload.sourceViewBox
                ) {
                  var s,
                    f,
                    d = u.payload.coordinate,
                    { x: h, y: v } = d,
                    y = (function (e, t) {
                      if (null == e) return {};
                      var r,
                        n,
                        i = (function (e, t) {
                          if (null == e) return {};
                          var r = {};
                          for (var n in e)
                            if ({}.hasOwnProperty.call(e, n)) {
                              if (-1 !== t.indexOf(n)) continue;
                              r[n] = e[n];
                            }
                          return r;
                        })(e, t);
                      if (Object.getOwnPropertySymbols) {
                        var a = Object.getOwnPropertySymbols(e);
                        for (n = 0; n < a.length; n++)
                          ((r = a[n]),
                            -1 === t.indexOf(r) &&
                              {}.propertyIsEnumerable.call(e, r) &&
                              (i[r] = e[r]));
                      }
                      return i;
                    })(d, se),
                    { x: g, y: m, width: b, height: x } = u.payload.sourceViewBox,
                    w = sr(
                      sr({}, y),
                      {},
                      {
                        x: o.x + (b ? (h - g) / b : 0) * o.width,
                        y: o.y + (x ? (v - m) / x : 0) * o.height,
                      },
                    );
                  r(sr(sr({}, u), {}, { payload: sr(sr({}, u.payload), {}, { coordinate: w }) }));
                } else r(u);
                return;
              }
              if (null != i) {
                if ('function' == typeof n) {
                  var O = n(i, {
                    activeTooltipIndex: null == u.payload.index ? void 0 : Number(u.payload.index),
                    isTooltipActive: u.payload.active,
                    activeIndex: null == u.payload.index ? void 0 : Number(u.payload.index),
                    activeLabel: u.payload.label,
                    activeDataKey: u.payload.dataKey,
                    activeCoordinate: u.payload.coordinate,
                  });
                  f = i[O];
                } else 'value' === n && (f = i.find((e) => String(e.value) === u.payload.label));
                var { coordinate: S } = u.payload;
                if (null == S || null == o)
                  return void r(
                    (0, p.setSyncInteraction)({
                      active: !1,
                      coordinate: void 0,
                      dataKey: void 0,
                      index: null,
                      label: void 0,
                      sourceViewBox: void 0,
                      graphicalItemId: void 0,
                    }),
                  );
                if (null == f)
                  return void r(
                    (0, p.setSyncInteraction)({
                      active: !1,
                      coordinate: void 0,
                      dataKey: void 0,
                      index: null,
                      label: void 0,
                      sourceViewBox: u.payload.sourceViewBox,
                      graphicalItemId: void 0,
                    }),
                  );
                var { x: A, y: P } = S,
                  _ = Math.min(A, o.x + o.width),
                  E = Math.min(P, o.y + o.height),
                  j = {
                    x: 'horizontal' === a ? f.coordinate : _,
                    y: 'horizontal' === a ? E : f.coordinate,
                  };
                r(
                  (0, p.setSyncInteraction)({
                    active: u.payload.active,
                    coordinate: j,
                    dataKey: u.payload.dataKey,
                    index: String(f.index),
                    label: u.payload.label,
                    sourceViewBox: u.payload.sourceViewBox,
                    graphicalItemId: u.payload.graphicalItemId,
                  }),
                );
              }
            }
          };
          return (
            c6.on(c8, l),
            () => {
              c6.off(c8, l);
            }
          );
        }, [l, r, t, e, n, i, a, o]),
        (c = (0, g.useAppSelector)(ei)),
        (s = (0, g.useAppSelector)(eo)),
        (f = (0, g.useAppDispatch)()),
        (0, u.useEffect)(() => {
          if (null == c) return F.noop;
          var e = (e, t, r) => {
            s !== r && c === e && f((0, h.setDataStartEndIndexes)(t));
          };
          return (
            c6.on(c9, e),
            () => {
              c6.off(c9, e);
            }
          );
        }, [f, s, c]));
    }
    e.s(
      [
        'useSynchronisedEventsFromOtherCharts',
        0,
        sn,
        'useTooltipChartSynchronisation',
        0,
        function (e, t, r, n, i, a) {
          var o = (0, g.useAppSelector)((r) => lF(r, e, t)),
            l = (0, g.useAppSelector)(lS),
            c = (0, g.useAppSelector)(eo),
            s = (0, g.useAppSelector)(ei),
            f = (0, g.useAppSelector)(ea),
            d = (0, g.useAppSelector)(c7),
            h = (null == d ? void 0 : d.sourceViewBox) != null,
            v = A();
          (0, u.useEffect)(() => {
            if (!h && null != s && null != c) {
              var e = (0, p.setSyncInteraction)({
                active: a,
                coordinate: r,
                dataKey: o,
                index: i,
                label: 'number' == typeof n ? String(n) : n,
                sourceViewBox: v,
                graphicalItemId: l,
              });
              c6.emit(c8, s, e, c);
            }
          }, [h, r, o, l, i, n, c, s, f, a, v]);
        },
      ],
      80124,
    );
    var si = (0, u.createContext)(null);
    e.s(['TooltipPortalContext', 0, si, 'useTooltipPortal', 0, () => (0, u.useContext)(si)], 97240);
    var sa = (0, u.createContext)(null);
    function so(e, t) {
      var r = Object.keys(e);
      if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(e);
        (t &&
          (n = n.filter(function (t) {
            return Object.getOwnPropertyDescriptor(e, t).enumerable;
          })),
          r.push.apply(r, n));
      }
      return r;
    }
    function sl() {
      return (sl = Object.assign.bind()).apply(null, arguments);
    }
    e.s(['LegendPortalContext', 0, sa, 'useLegendPortal', 0, () => (0, u.useContext)(sa)], 4605);
    var su = () => (sn(), null);
    function sc(e) {
      if ('number' == typeof e) return e;
      if ('string' == typeof e) {
        var t = parseFloat(e);
        if (!Number.isNaN(t)) return t;
      }
      return 0;
    }
    var ss = (0, u.forwardRef)((e, t) => {
        var r,
          n,
          i = (0, u.useRef)(null),
          [a, o] = (0, u.useState)({
            containerWidth: sc(null == (r = e.style) ? void 0 : r.width),
            containerHeight: sc(null == (n = e.style) ? void 0 : n.height),
          }),
          l = (0, u.useCallback)((e, t) => {
            o((r) => {
              var n = Math.round(e),
                i = Math.round(t);
              return r.containerWidth === n && r.containerHeight === i
                ? r
                : { containerWidth: n, containerHeight: i };
            });
          }, []),
          c = (0, u.useCallback)(
            (e) => {
              if (
                ('function' == typeof t && t(e),
                null != i.current && (i.current.disconnect(), (i.current = null)),
                null != e && 'u' > typeof ResizeObserver)
              ) {
                var { width: r, height: n } = e.getBoundingClientRect();
                l(r, n);
                var a = new ResizeObserver((e) => {
                  var t = e[0];
                  if (null != t) {
                    var { width: r, height: n } = t.contentRect;
                    l(r, n);
                  }
                });
                (a.observe(e), (i.current = a));
              }
            },
            [t, l],
          );
        return (
          (0, u.useEffect)(
            () => () => {
              var e = i.current;
              null != e && e.disconnect();
            },
            [l],
          ),
          u.createElement(
            u.Fragment,
            null,
            u.createElement(k, { width: a.containerWidth, height: a.containerHeight }),
            u.createElement('div', sl({ ref: c }, e)),
          )
        );
      }),
      sf = (0, u.forwardRef)((e, t) => {
        var { width: r, height: n } = e,
          [i, a] = (0, u.useState)({ containerWidth: sc(r), containerHeight: sc(n) }),
          o = (0, u.useCallback)((e, t) => {
            a((r) => {
              var n = Math.round(e),
                i = Math.round(t);
              return r.containerWidth === n && r.containerHeight === i
                ? r
                : { containerWidth: n, containerHeight: i };
            });
          }, []),
          l = (0, u.useCallback)(
            (e) => {
              if (('function' == typeof t && t(e), null != e)) {
                var { width: r, height: n } = e.getBoundingClientRect();
                o(r, n);
              }
            },
            [t, o],
          );
        return u.createElement(
          u.Fragment,
          null,
          u.createElement(k, { width: i.containerWidth, height: i.containerHeight }),
          u.createElement('div', sl({ ref: l }, e)),
        );
      }),
      sd = (0, u.forwardRef)((e, t) => {
        var { width: r, height: n } = e;
        return u.createElement(
          u.Fragment,
          null,
          u.createElement(k, { width: r, height: n }),
          u.createElement('div', sl({ ref: t }, e)),
        );
      }),
      sp = (0, u.forwardRef)((e, t) => {
        var { width: r, height: n } = e;
        return 'string' == typeof r || 'string' == typeof n
          ? u.createElement(sf, sl({}, e, { ref: t }))
          : 'number' == typeof r && 'number' == typeof n
            ? u.createElement(sd, sl({}, e, { width: r, height: n, ref: t }))
            : u.createElement(
                u.Fragment,
                null,
                u.createElement(k, { width: r, height: n }),
                u.createElement('div', sl({ ref: t }, e)),
              );
      }),
      sh = (0, u.forwardRef)((e, t) => {
        var {
            children: r,
            className: n,
            height: i,
            onClick: a,
            onContextMenu: o,
            onDoubleClick: l,
            onMouseDown: c,
            onMouseEnter: s,
            onMouseLeave: f,
            onMouseMove: d,
            onMouseUp: h,
            onTouchEnd: y,
            onTouchMove: m,
            onTouchStart: x,
            style: w,
            width: A,
            responsive: P,
            dispatchTouchEvents: _ = !0,
          } = e,
          E = (0, u.useRef)(null),
          j = (0, g.useAppDispatch)(),
          [C, M] = (0, u.useState)(null),
          [k, T] = (0, u.useState)(null),
          D = (function () {
            var e = (0, g.useAppDispatch)(),
              [t, r] = (0, u.useState)(null),
              n = (0, g.useAppSelector)(b.selectContainerScale);
            return (
              (0, u.useEffect)(() => {
                if (null != t) {
                  var r = t.getBoundingClientRect().width / t.offsetWidth;
                  (0, S.isWellBehavedNumber)(r) && r !== n && e((0, v.setScale)(r));
                }
              }, [t, e, n]),
              r
            );
          })(),
          N = (0, O.useResponsiveContainerContext)(),
          I = (null == N ? void 0 : N.width) > 0 ? N.width : A,
          L = (null == N ? void 0 : N.height) > 0 ? N.height : i,
          R = (0, u.useCallback)(
            (e) => {
              (D(e), 'function' == typeof t && t(e), M(e), T(e), null != e && (E.current = e));
            },
            [D, t, M, T],
          ),
          B = (0, u.useCallback)(
            (e) => {
              (j(lG(e)), j(u5({ handler: a, reactEvent: e })));
            },
            [j, a],
          ),
          z = (0, u.useCallback)(
            (e) => {
              (j(lQ(e)), j(u5({ handler: s, reactEvent: e })));
            },
            [j, s],
          ),
          F = (0, u.useCallback)(
            (e) => {
              (j((0, p.mouseLeaveChart)()), j(u5({ handler: f, reactEvent: e })));
            },
            [j, f],
          ),
          U = (0, u.useCallback)(
            (e) => {
              (j(lQ(e)), j(u5({ handler: d, reactEvent: e })));
            },
            [j, d],
          ),
          W = (0, u.useCallback)(() => {
            j(uZ());
          }, [j]),
          $ = (0, u.useCallback)(() => {
            j(uQ());
          }, [j]),
          V = (0, u.useCallback)(
            (e) => {
              j(uG(e.key));
            },
            [j],
          ),
          K = (0, u.useCallback)(
            (e) => {
              j(u5({ handler: o, reactEvent: e }));
            },
            [j, o],
          ),
          H = (0, u.useCallback)(
            (e) => {
              j(u5({ handler: l, reactEvent: e }));
            },
            [j, l],
          ),
          q = (0, u.useCallback)(
            (e) => {
              j(u5({ handler: c, reactEvent: e }));
            },
            [j, c],
          ),
          Y = (0, u.useCallback)(
            (e) => {
              j(u5({ handler: h, reactEvent: e }));
            },
            [j, h],
          ),
          X = (0, u.useCallback)(
            (e) => {
              j(u5({ handler: x, reactEvent: e }));
            },
            [j, x],
          ),
          G = (0, u.useCallback)(
            (e) => {
              (_ && j(ct(e)), j(u5({ handler: m, reactEvent: e })));
            },
            [j, _, m],
          ),
          Z = (0, u.useCallback)(
            (e) => {
              j(u5({ handler: y, reactEvent: e }));
            },
            [j, y],
          );
        return u.createElement(
          si.Provider,
          { value: C },
          u.createElement(
            sa.Provider,
            { value: k },
            u.createElement(
              P ? ss : sp,
              {
                width: null != I ? I : null == w ? void 0 : w.width,
                height: null != L ? L : null == w ? void 0 : w.height,
                className: (0, cz.clsx)('recharts-wrapper', n),
                style: (function (e) {
                  for (var t = 1; t < arguments.length; t++) {
                    var r = null != arguments[t] ? arguments[t] : {};
                    t % 2
                      ? so(Object(r), !0).forEach(function (t) {
                          var n, i, a;
                          ((n = e),
                            (i = t),
                            (a = r[t]),
                            (i = (function (e) {
                              var t = (function (e, t) {
                                if ('object' != typeof e || !e) return e;
                                var r = e[Symbol.toPrimitive];
                                if (void 0 !== r) {
                                  var n = r.call(e, t || 'default');
                                  if ('object' != typeof n) return n;
                                  throw TypeError('@@toPrimitive must return a primitive value.');
                                }
                                return ('string' === t ? String : Number)(e);
                              })(e, 'string');
                              return 'symbol' == typeof t ? t : t + '';
                            })(i)) in n
                              ? Object.defineProperty(n, i, {
                                  value: a,
                                  enumerable: !0,
                                  configurable: !0,
                                  writable: !0,
                                })
                              : (n[i] = a));
                        })
                      : Object.getOwnPropertyDescriptors
                        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
                        : so(Object(r)).forEach(function (t) {
                            Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t));
                          });
                  }
                  return e;
                })({ position: 'relative', cursor: 'default', width: I, height: L }, w),
                onClick: B,
                onContextMenu: K,
                onDoubleClick: H,
                onFocus: W,
                onBlur: $,
                onKeyDown: V,
                onMouseDown: q,
                onMouseEnter: z,
                onMouseLeave: F,
                onMouseMove: U,
                onMouseUp: Y,
                onTouchEnd: Z,
                onTouchMove: G,
                onTouchStart: X,
                ref: R,
              },
              u.createElement(su, null),
              r,
            ),
          ),
        );
      }),
      sv = (0, y.createSelector)([m.selectChartOffsetInternal], (e) => ({
        top: e.top,
        bottom: e.bottom,
        left: e.left,
        right: e.right,
      })),
      sy = (0, y.createSelector)([sv, b.selectChartWidth, b.selectChartHeight], (e, t, r) => {
        if (e && null != t && null != r)
          return {
            x: e.left,
            y: e.top,
            width: Math.max(0, t - e.left - e.right),
            height: Math.max(0, r - e.top - e.bottom),
          };
      }),
      sg = () => (0, g.useAppSelector)(sy);
    e.s(
      ['useActiveTooltipDataPoints', 0, () => (0, g.useAppSelector)(lC), 'usePlotArea', 0, sg],
      25650,
    );
    var sm = (0, u.createContext)(void 0),
      sb = (e) => {
        var { children: t } = e,
          [r] = (0, u.useState)(''.concat((0, F.uniqueId)('recharts'), '-clip')),
          n = sg();
        if (null == n) return null;
        var { x: i, y: a, width: o, height: l } = n;
        return u.createElement(
          sm.Provider,
          { value: r },
          u.createElement(
            'defs',
            null,
            u.createElement(
              'clipPath',
              { id: r },
              u.createElement('rect', { x: i, y: a, height: l, width: o }),
            ),
          ),
          t,
        );
      },
      sx = [
        'width',
        'height',
        'responsive',
        'children',
        'className',
        'style',
        'compact',
        'title',
        'desc',
      ],
      sw = (0, u.forwardRef)((e, t) => {
        var {
            width: r,
            height: n,
            responsive: i,
            children: a,
            className: o,
            style: l,
            compact: c,
            title: s,
            desc: f,
          } = e,
          d = cK(
            (function (e, t) {
              if (null == e) return {};
              var r,
                n,
                i = (function (e, t) {
                  if (null == e) return {};
                  var r = {};
                  for (var n in e)
                    if ({}.hasOwnProperty.call(e, n)) {
                      if (-1 !== t.indexOf(n)) continue;
                      r[n] = e[n];
                    }
                  return r;
                })(e, t);
              if (Object.getOwnPropertySymbols) {
                var a = Object.getOwnPropertySymbols(e);
                for (n = 0; n < a.length; n++)
                  ((r = a[n]),
                    -1 === t.indexOf(r) && {}.propertyIsEnumerable.call(e, r) && (i[r] = e[r]));
              }
              return i;
            })(e, sx),
          );
        return c
          ? u.createElement(
              u.Fragment,
              null,
              u.createElement(k, { width: r, height: n }),
              u.createElement(c3, { otherAttributes: d, title: s, desc: f }, a),
            )
          : u.createElement(
              sh,
              {
                className: o,
                style: l,
                width: r,
                height: n,
                responsive: null != i && i,
                onClick: e.onClick,
                onMouseLeave: e.onMouseLeave,
                onMouseEnter: e.onMouseEnter,
                onMouseMove: e.onMouseMove,
                onMouseDown: e.onMouseDown,
                onMouseUp: e.onMouseUp,
                onContextMenu: e.onContextMenu,
                onDoubleClick: e.onDoubleClick,
                onTouchStart: e.onTouchStart,
                onTouchMove: e.onTouchMove,
                onTouchEnd: e.onTouchEnd,
              },
              u.createElement(
                c3,
                { otherAttributes: d, title: s, desc: f, ref: t },
                u.createElement(sb, null, a),
              ),
            );
      });
    function sO(e, t) {
      var r = Object.keys(e);
      if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(e);
        (t &&
          (n = n.filter(function (t) {
            return Object.getOwnPropertyDescriptor(e, t).enumerable;
          })),
          r.push.apply(r, n));
      }
      return r;
    }
    (e.s(['CategoricalChart', 0, sw], 34383),
      e.s(
        [
          'resolveDefaultProps',
          0,
          function (e, t) {
            var r = (function (e) {
              for (var t = 1; t < arguments.length; t++) {
                var r = null != arguments[t] ? arguments[t] : {};
                t % 2
                  ? sO(Object(r), !0).forEach(function (t) {
                      var n, i, a;
                      ((n = e),
                        (i = t),
                        (a = r[t]),
                        (i = (function (e) {
                          var t = (function (e, t) {
                            if ('object' != typeof e || !e) return e;
                            var r = e[Symbol.toPrimitive];
                            if (void 0 !== r) {
                              var n = r.call(e, t || 'default');
                              if ('object' != typeof n) return n;
                              throw TypeError('@@toPrimitive must return a primitive value.');
                            }
                            return ('string' === t ? String : Number)(e);
                          })(e, 'string');
                          return 'symbol' == typeof t ? t : t + '';
                        })(i)) in n
                          ? Object.defineProperty(n, i, {
                              value: a,
                              enumerable: !0,
                              configurable: !0,
                              writable: !0,
                            })
                          : (n[i] = a));
                    })
                  : Object.getOwnPropertyDescriptors
                    ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
                    : sO(Object(r)).forEach(function (t) {
                        Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t));
                      });
              }
              return e;
            })({}, e);
            return Object.keys(t).reduce(
              (e, r) => (void 0 === e[r] && void 0 !== t[r] && (e[r] = t[r]), e),
              r,
            );
          },
        ],
        75448,
      ));
  },
  60091,
  (e) => {
    'use strict';
    var t = e.i(61129),
      r = e.i(26951),
      n = e.i(2052),
      i = e.i(54947),
      a = e.i(75648),
      o = e.i(57308),
      l = e.i(34383),
      u = e.i(75448);
    function c() {
      return (c = Object.assign.bind()).apply(null, arguments);
    }
    function s(e, t) {
      var r = Object.keys(e);
      if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(e);
        (t &&
          (n = n.filter(function (t) {
            return Object.getOwnPropertyDescriptor(e, t).enumerable;
          })),
          r.push.apply(r, n));
      }
      return r;
    }
    var f = (function (e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? s(Object(r), !0).forEach(function (t) {
                var n, i, a;
                ((n = e),
                  (i = t),
                  (a = r[t]),
                  (i = (function (e) {
                    var t = (function (e, t) {
                      if ('object' != typeof e || !e) return e;
                      var r = e[Symbol.toPrimitive];
                      if (void 0 !== r) {
                        var n = r.call(e, t || 'default');
                        if ('object' != typeof n) return n;
                        throw TypeError('@@toPrimitive must return a primitive value.');
                      }
                      return ('string' === t ? String : Number)(e);
                    })(e, 'string');
                    return 'symbol' == typeof t ? t : t + '';
                  })(i)) in n
                    ? Object.defineProperty(n, i, {
                        value: a,
                        enumerable: !0,
                        configurable: !0,
                        writable: !0,
                      })
                    : (n[i] = a));
              })
            : Object.getOwnPropertyDescriptors
              ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
              : s(Object(r)).forEach(function (t) {
                  Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t));
                });
        }
        return e;
      })(
        {
          accessibilityLayer: !0,
          barCategoryGap: '10%',
          barGap: 4,
          layout: 'horizontal',
          margin: { top: 5, right: 5, bottom: 5, left: 5 },
          responsive: !1,
          reverseStackOrder: !1,
          stackOffset: 'none',
          syncMethod: 'index',
        },
        e.i(94191).initialEventSettingsState,
      ),
      d = (0, t.forwardRef)(function (e, s) {
        var d,
          p = (0, u.resolveDefaultProps)(e.categoricalChartProps, f),
          {
            chartName: h,
            defaultTooltipEventType: v,
            validateTooltipEventTypes: y,
            tooltipPayloadSearcher: g,
            categoricalChartProps: m,
          } = e;
        return t.createElement(
          r.RechartsStoreProvider,
          {
            preloadedState: {
              options: {
                chartName: h,
                defaultTooltipEventType: v,
                validateTooltipEventTypes: y,
                tooltipPayloadSearcher: g,
                eventEmitter: void 0,
              },
            },
            reduxStoreName: null != (d = m.id) ? d : h,
          },
          t.createElement(n.ChartDataContextProvider, { chartData: m.data }),
          t.createElement(i.ReportMainChartProps, { layout: p.layout, margin: p.margin }),
          t.createElement(o.ReportEventSettings, {
            throttleDelay: p.throttleDelay,
            throttledEvents: p.throttledEvents,
          }),
          t.createElement(a.ReportChartProps, {
            baseValue: p.baseValue,
            accessibilityLayer: p.accessibilityLayer,
            barCategoryGap: p.barCategoryGap,
            maxBarSize: p.maxBarSize,
            stackOffset: p.stackOffset,
            barGap: p.barGap,
            barSize: p.barSize,
            syncId: p.syncId,
            syncMethod: p.syncMethod,
            className: p.className,
            reverseStackOrder: p.reverseStackOrder,
          }),
          t.createElement(l.CategoricalChart, c({}, p, { ref: s })),
        );
      });
    e.s(['CartesianChart', 0, d]);
  },
  1232,
  93202,
  68078,
  (e) => {
    'use strict';
    var t = e.i(61129),
      r = e.i(32816),
      n = e.i(16427);
    function i(e) {
      this._context = e;
    }
    function a(e) {
      return new i(e);
    }
    i.prototype = {
      areaStart: function () {
        this._line = 0;
      },
      areaEnd: function () {
        this._line = NaN;
      },
      lineStart: function () {
        this._point = 0;
      },
      lineEnd: function () {
        ((this._line || (0 !== this._line && 1 === this._point)) && this._context.closePath(),
          (this._line = 1 - this._line));
      },
      point: function (e, t) {
        switch (((e *= 1), (t *= 1), this._point)) {
          case 0:
            ((this._point = 1),
              this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t));
            break;
          case 1:
            this._point = 2;
          default:
            this._context.lineTo(e, t);
        }
      },
    };
    let o = Math.PI,
      l = 2 * o,
      u = l - 1e-6;
    function c(e) {
      this._ += e[0];
      for (let t = 1, r = e.length; t < r; ++t) this._ += arguments[t] + e[t];
    }
    class s {
      constructor(e) {
        ((this._x0 = this._y0 = this._x1 = this._y1 = null),
          (this._ = ''),
          (this._append =
            null == e
              ? c
              : (function (e) {
                  let t = Math.floor(e);
                  if (!(t >= 0)) throw Error(`invalid digits: ${e}`);
                  if (t > 15) return c;
                  let r = 10 ** t;
                  return function (e) {
                    this._ += e[0];
                    for (let t = 1, n = e.length; t < n; ++t)
                      this._ += Math.round(arguments[t] * r) / r + e[t];
                  };
                })(e)));
      }
      moveTo(e, t) {
        this._append`M${(this._x0 = this._x1 = +e)},${(this._y0 = this._y1 = +t)}`;
      }
      closePath() {
        null !== this._x1 && ((this._x1 = this._x0), (this._y1 = this._y0), this._append`Z`);
      }
      lineTo(e, t) {
        this._append`L${(this._x1 = +e)},${(this._y1 = +t)}`;
      }
      quadraticCurveTo(e, t, r, n) {
        this._append`Q${+e},${+t},${(this._x1 = +r)},${(this._y1 = +n)}`;
      }
      bezierCurveTo(e, t, r, n, i, a) {
        this._append`C${+e},${+t},${+r},${+n},${(this._x1 = +i)},${(this._y1 = +a)}`;
      }
      arcTo(e, t, r, n, i) {
        if (((e *= 1), (t *= 1), (r *= 1), (n *= 1), (i *= 1) < 0))
          throw Error(`negative radius: ${i}`);
        let a = this._x1,
          l = this._y1,
          u = r - e,
          c = n - t,
          s = a - e,
          f = l - t,
          d = s * s + f * f;
        if (null === this._x1) this._append`M${(this._x1 = e)},${(this._y1 = t)}`;
        else if (d > 1e-6)
          if (Math.abs(f * u - c * s) > 1e-6 && i) {
            let p = r - a,
              h = n - l,
              v = u * u + c * c,
              y = Math.sqrt(v),
              g = Math.sqrt(d),
              m = i * Math.tan((o - Math.acos((v + d - (p * p + h * h)) / (2 * y * g))) / 2),
              b = m / g,
              x = m / y;
            (Math.abs(b - 1) > 1e-6 && this._append`L${e + b * s},${t + b * f}`,
              this
                ._append`A${i},${i},0,0,${+(f * p > s * h)},${(this._x1 = e + x * u)},${(this._y1 = t + x * c)}`);
          } else this._append`L${(this._x1 = e)},${(this._y1 = t)}`;
      }
      arc(e, t, r, n, i, a) {
        if (((e *= 1), (t *= 1), (r *= 1), (a = !!a), r < 0)) throw Error(`negative radius: ${r}`);
        let c = r * Math.cos(n),
          s = r * Math.sin(n),
          f = e + c,
          d = t + s,
          p = 1 ^ a,
          h = a ? n - i : i - n;
        (null === this._x1
          ? this._append`M${f},${d}`
          : (Math.abs(this._x1 - f) > 1e-6 || Math.abs(this._y1 - d) > 1e-6) &&
            this._append`L${f},${d}`,
          r &&
            (h < 0 && (h = (h % l) + l),
            h > u
              ? this
                  ._append`A${r},${r},0,1,${p},${e - c},${t - s}A${r},${r},0,1,${p},${(this._x1 = f)},${(this._y1 = d)}`
              : h > 1e-6 &&
                this
                  ._append`A${r},${r},0,${+(h >= o)},${p},${(this._x1 = e + r * Math.cos(i))},${(this._y1 = t + r * Math.sin(i))}`));
      }
      rect(e, t, r, n) {
        this
          ._append`M${(this._x0 = this._x1 = +e)},${(this._y0 = this._y1 = +t)}h${(r *= 1)}v${+n}h${-r}Z`;
      }
      toString() {
        return this._;
      }
    }
    function f(e) {
      let t = 3;
      return (
        (e.digits = function (r) {
          if (!arguments.length) return t;
          if (null == r) t = null;
          else {
            let e = Math.floor(r);
            if (!(e >= 0)) throw RangeError(`invalid digits: ${r}`);
            t = e;
          }
          return e;
        }),
        () => new s(t)
      );
    }
    function d(e) {
      return e[0];
    }
    function p(e) {
      return e[1];
    }
    function h(e, t) {
      var i = (0, n.default)(!0),
        o = null,
        l = a,
        u = null,
        c = f(s);
      function s(n) {
        var a,
          s,
          f,
          d = (n = (0, r.default)(n)).length,
          p = !1;
        for (null == o && (u = l((f = c()))), a = 0; a <= d; ++a)
          (!(a < d && i((s = n[a]), a, n)) === p && ((p = !p) ? u.lineStart() : u.lineEnd()),
            p && u.point(+e(s, a, n), +t(s, a, n)));
        if (f) return ((u = null), f + '' || null);
      }
      return (
        (e = 'function' == typeof e ? e : void 0 === e ? d : (0, n.default)(e)),
        (t = 'function' == typeof t ? t : void 0 === t ? p : (0, n.default)(t)),
        (s.x = function (t) {
          return arguments.length ? ((e = 'function' == typeof t ? t : (0, n.default)(+t)), s) : e;
        }),
        (s.y = function (e) {
          return arguments.length ? ((t = 'function' == typeof e ? e : (0, n.default)(+e)), s) : t;
        }),
        (s.defined = function (e) {
          return arguments.length ? ((i = 'function' == typeof e ? e : (0, n.default)(!!e)), s) : i;
        }),
        (s.curve = function (e) {
          return arguments.length ? ((l = e), null != o && (u = l(o)), s) : l;
        }),
        (s.context = function (e) {
          return arguments.length ? (null == e ? (o = u = null) : (u = l((o = e))), s) : o;
        }),
        s
      );
    }
    function v(e, t, i) {
      var o = null,
        l = (0, n.default)(!0),
        u = null,
        c = a,
        s = null,
        v = f(y);
      function y(n) {
        var a,
          f,
          d,
          p,
          h,
          y = (n = (0, r.default)(n)).length,
          g = !1,
          m = Array(y),
          b = Array(y);
        for (null == u && (s = c((h = v()))), a = 0; a <= y; ++a) {
          if (!(a < y && l((p = n[a]), a, n)) === g)
            if ((g = !g)) ((f = a), s.areaStart(), s.lineStart());
            else {
              for (s.lineEnd(), s.lineStart(), d = a - 1; d >= f; --d) s.point(m[d], b[d]);
              (s.lineEnd(), s.areaEnd());
            }
          g &&
            ((m[a] = +e(p, a, n)),
            (b[a] = +t(p, a, n)),
            s.point(o ? +o(p, a, n) : m[a], i ? +i(p, a, n) : b[a]));
        }
        if (h) return ((s = null), h + '' || null);
      }
      function g() {
        return h().defined(l).curve(c).context(u);
      }
      return (
        (e = 'function' == typeof e ? e : void 0 === e ? d : (0, n.default)(+e)),
        (t = 'function' == typeof t ? t : void 0 === t ? (0, n.default)(0) : (0, n.default)(+t)),
        (i = 'function' == typeof i ? i : void 0 === i ? p : (0, n.default)(+i)),
        (y.x = function (t) {
          return arguments.length
            ? ((e = 'function' == typeof t ? t : (0, n.default)(+t)), (o = null), y)
            : e;
        }),
        (y.x0 = function (t) {
          return arguments.length ? ((e = 'function' == typeof t ? t : (0, n.default)(+t)), y) : e;
        }),
        (y.x1 = function (e) {
          return arguments.length
            ? ((o = null == e ? null : 'function' == typeof e ? e : (0, n.default)(+e)), y)
            : o;
        }),
        (y.y = function (e) {
          return arguments.length
            ? ((t = 'function' == typeof e ? e : (0, n.default)(+e)), (i = null), y)
            : t;
        }),
        (y.y0 = function (e) {
          return arguments.length ? ((t = 'function' == typeof e ? e : (0, n.default)(+e)), y) : t;
        }),
        (y.y1 = function (e) {
          return arguments.length
            ? ((i = null == e ? null : 'function' == typeof e ? e : (0, n.default)(+e)), y)
            : i;
        }),
        (y.lineX0 = y.lineY0 =
          function () {
            return g().x(e).y(t);
          }),
        (y.lineY1 = function () {
          return g().x(e).y(i);
        }),
        (y.lineX1 = function () {
          return g().x(o).y(t);
        }),
        (y.defined = function (e) {
          return arguments.length ? ((l = 'function' == typeof e ? e : (0, n.default)(!!e)), y) : l;
        }),
        (y.curve = function (e) {
          return arguments.length ? ((c = e), null != u && (s = c(u)), y) : c;
        }),
        (y.context = function (e) {
          return arguments.length ? (null == e ? (u = s = null) : (s = c((u = e))), y) : u;
        }),
        y
      );
    }
    function y(e, t, r) {
      e._context.bezierCurveTo(
        (2 * e._x0 + e._x1) / 3,
        (2 * e._y0 + e._y1) / 3,
        (e._x0 + 2 * e._x1) / 3,
        (e._y0 + 2 * e._y1) / 3,
        (e._x0 + 4 * e._x1 + t) / 6,
        (e._y0 + 4 * e._y1 + r) / 6,
      );
    }
    function g(e) {
      this._context = e;
    }
    function m() {}
    function b(e) {
      this._context = e;
    }
    function x(e) {
      this._context = e;
    }
    (s.prototype,
      e.s(['withPath', 0, f], 93202),
      (g.prototype = {
        areaStart: function () {
          this._line = 0;
        },
        areaEnd: function () {
          this._line = NaN;
        },
        lineStart: function () {
          ((this._x0 = this._x1 = this._y0 = this._y1 = NaN), (this._point = 0));
        },
        lineEnd: function () {
          switch (this._point) {
            case 3:
              y(this, this._x1, this._y1);
            case 2:
              this._context.lineTo(this._x1, this._y1);
          }
          ((this._line || (0 !== this._line && 1 === this._point)) && this._context.closePath(),
            (this._line = 1 - this._line));
        },
        point: function (e, t) {
          switch (((e *= 1), (t *= 1), this._point)) {
            case 0:
              ((this._point = 1),
                this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t));
              break;
            case 1:
              this._point = 2;
              break;
            case 2:
              ((this._point = 3),
                this._context.lineTo((5 * this._x0 + this._x1) / 6, (5 * this._y0 + this._y1) / 6));
            default:
              y(this, e, t);
          }
          ((this._x0 = this._x1), (this._x1 = e), (this._y0 = this._y1), (this._y1 = t));
        },
      }),
      (b.prototype = {
        areaStart: m,
        areaEnd: m,
        lineStart: function () {
          ((this._x0 =
            this._x1 =
            this._x2 =
            this._x3 =
            this._x4 =
            this._y0 =
            this._y1 =
            this._y2 =
            this._y3 =
            this._y4 =
              NaN),
            (this._point = 0));
        },
        lineEnd: function () {
          switch (this._point) {
            case 1:
              (this._context.moveTo(this._x2, this._y2), this._context.closePath());
              break;
            case 2:
              (this._context.moveTo((this._x2 + 2 * this._x3) / 3, (this._y2 + 2 * this._y3) / 3),
                this._context.lineTo((this._x3 + 2 * this._x2) / 3, (this._y3 + 2 * this._y2) / 3),
                this._context.closePath());
              break;
            case 3:
              (this.point(this._x2, this._y2),
                this.point(this._x3, this._y3),
                this.point(this._x4, this._y4));
          }
        },
        point: function (e, t) {
          switch (((e *= 1), (t *= 1), this._point)) {
            case 0:
              ((this._point = 1), (this._x2 = e), (this._y2 = t));
              break;
            case 1:
              ((this._point = 2), (this._x3 = e), (this._y3 = t));
              break;
            case 2:
              ((this._point = 3),
                (this._x4 = e),
                (this._y4 = t),
                this._context.moveTo(
                  (this._x0 + 4 * this._x1 + e) / 6,
                  (this._y0 + 4 * this._y1 + t) / 6,
                ));
              break;
            default:
              y(this, e, t);
          }
          ((this._x0 = this._x1), (this._x1 = e), (this._y0 = this._y1), (this._y1 = t));
        },
      }),
      (x.prototype = {
        areaStart: function () {
          this._line = 0;
        },
        areaEnd: function () {
          this._line = NaN;
        },
        lineStart: function () {
          ((this._x0 = this._x1 = this._y0 = this._y1 = NaN), (this._point = 0));
        },
        lineEnd: function () {
          ((this._line || (0 !== this._line && 3 === this._point)) && this._context.closePath(),
            (this._line = 1 - this._line));
        },
        point: function (e, t) {
          switch (((e *= 1), (t *= 1), this._point)) {
            case 0:
              this._point = 1;
              break;
            case 1:
              this._point = 2;
              break;
            case 2:
              this._point = 3;
              var r = (this._x0 + 4 * this._x1 + e) / 6,
                n = (this._y0 + 4 * this._y1 + t) / 6;
              this._line ? this._context.lineTo(r, n) : this._context.moveTo(r, n);
              break;
            case 3:
              this._point = 4;
            default:
              y(this, e, t);
          }
          ((this._x0 = this._x1), (this._x1 = e), (this._y0 = this._y1), (this._y1 = t));
        },
      }));
    class w {
      constructor(e, t) {
        ((this._context = e), (this._x = t));
      }
      areaStart() {
        this._line = 0;
      }
      areaEnd() {
        this._line = NaN;
      }
      lineStart() {
        this._point = 0;
      }
      lineEnd() {
        ((this._line || (0 !== this._line && 1 === this._point)) && this._context.closePath(),
          (this._line = 1 - this._line));
      }
      point(e, t) {
        switch (((e *= 1), (t *= 1), this._point)) {
          case 0:
            ((this._point = 1),
              this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t));
            break;
          case 1:
            this._point = 2;
          default:
            this._x
              ? this._context.bezierCurveTo(
                  (this._x0 = (this._x0 + e) / 2),
                  this._y0,
                  this._x0,
                  t,
                  e,
                  t,
                )
              : this._context.bezierCurveTo(
                  this._x0,
                  (this._y0 = (this._y0 + t) / 2),
                  e,
                  this._y0,
                  e,
                  t,
                );
        }
        ((this._x0 = e), (this._y0 = t));
      }
    }
    function O(e) {
      this._context = e;
    }
    O.prototype = {
      areaStart: m,
      areaEnd: m,
      lineStart: function () {
        this._point = 0;
      },
      lineEnd: function () {
        this._point && this._context.closePath();
      },
      point: function (e, t) {
        ((e *= 1),
          (t *= 1),
          this._point
            ? this._context.lineTo(e, t)
            : ((this._point = 1), this._context.moveTo(e, t)));
      },
    };
    function S(e, t, r) {
      var n = e._x1 - e._x0,
        i = t - e._x1,
        a = (e._y1 - e._y0) / (n || (i < 0 && -0)),
        o = (r - e._y1) / (i || (n < 0 && -0));
      return (
        ((a < 0 ? -1 : 1) + (o < 0 ? -1 : 1)) *
          Math.min(Math.abs(a), Math.abs(o), 0.5 * Math.abs((a * i + o * n) / (n + i))) || 0
      );
    }
    function A(e, t) {
      var r = e._x1 - e._x0;
      return r ? ((3 * (e._y1 - e._y0)) / r - t) / 2 : t;
    }
    function P(e, t, r) {
      var n = e._x0,
        i = e._y0,
        a = e._x1,
        o = e._y1,
        l = (a - n) / 3;
      e._context.bezierCurveTo(n + l, i + l * t, a - l, o - l * r, a, o);
    }
    function _(e) {
      this._context = e;
    }
    function E(e) {
      this._context = new j(e);
    }
    function j(e) {
      this._context = e;
    }
    function C(e) {
      this._context = e;
    }
    function M(e) {
      var t,
        r,
        n = e.length - 1,
        i = Array(n),
        a = Array(n),
        o = Array(n);
      for (i[0] = 0, a[0] = 2, o[0] = e[0] + 2 * e[1], t = 1; t < n - 1; ++t)
        ((i[t] = 1), (a[t] = 4), (o[t] = 4 * e[t] + 2 * e[t + 1]));
      for (i[n - 1] = 2, a[n - 1] = 7, o[n - 1] = 8 * e[n - 1] + e[n], t = 1; t < n; ++t)
        ((r = i[t] / a[t - 1]), (a[t] -= r), (o[t] -= r * o[t - 1]));
      for (i[n - 1] = o[n - 1] / a[n - 1], t = n - 2; t >= 0; --t) i[t] = (o[t] - i[t + 1]) / a[t];
      for (t = 0, a[n - 1] = (e[n] + i[n - 1]) / 2; t < n - 1; ++t) a[t] = 2 * e[t + 1] - i[t + 1];
      return [i, a];
    }
    function k(e, t) {
      ((this._context = e), (this._t = t));
    }
    ((_.prototype = {
      areaStart: function () {
        this._line = 0;
      },
      areaEnd: function () {
        this._line = NaN;
      },
      lineStart: function () {
        ((this._x0 = this._x1 = this._y0 = this._y1 = this._t0 = NaN), (this._point = 0));
      },
      lineEnd: function () {
        switch (this._point) {
          case 2:
            this._context.lineTo(this._x1, this._y1);
            break;
          case 3:
            P(this, this._t0, A(this, this._t0));
        }
        ((this._line || (0 !== this._line && 1 === this._point)) && this._context.closePath(),
          (this._line = 1 - this._line));
      },
      point: function (e, t) {
        var r = NaN;
        if (((t *= 1), (e *= 1) !== this._x1 || t !== this._y1)) {
          switch (this._point) {
            case 0:
              ((this._point = 1),
                this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t));
              break;
            case 1:
              this._point = 2;
              break;
            case 2:
              ((this._point = 3), P(this, A(this, (r = S(this, e, t))), r));
              break;
            default:
              P(this, this._t0, (r = S(this, e, t)));
          }
          ((this._x0 = this._x1),
            (this._x1 = e),
            (this._y0 = this._y1),
            (this._y1 = t),
            (this._t0 = r));
        }
      },
    }),
      ((E.prototype = Object.create(_.prototype)).point = function (e, t) {
        _.prototype.point.call(this, t, e);
      }),
      (j.prototype = {
        moveTo: function (e, t) {
          this._context.moveTo(t, e);
        },
        closePath: function () {
          this._context.closePath();
        },
        lineTo: function (e, t) {
          this._context.lineTo(t, e);
        },
        bezierCurveTo: function (e, t, r, n, i, a) {
          this._context.bezierCurveTo(t, e, n, r, a, i);
        },
      }),
      (C.prototype = {
        areaStart: function () {
          this._line = 0;
        },
        areaEnd: function () {
          this._line = NaN;
        },
        lineStart: function () {
          ((this._x = []), (this._y = []));
        },
        lineEnd: function () {
          var e = this._x,
            t = this._y,
            r = e.length;
          if (r)
            if (
              (this._line ? this._context.lineTo(e[0], t[0]) : this._context.moveTo(e[0], t[0]),
              2 === r)
            )
              this._context.lineTo(e[1], t[1]);
            else
              for (var n = M(e), i = M(t), a = 0, o = 1; o < r; ++a, ++o)
                this._context.bezierCurveTo(n[0][a], i[0][a], n[1][a], i[1][a], e[o], t[o]);
          ((this._line || (0 !== this._line && 1 === r)) && this._context.closePath(),
            (this._line = 1 - this._line),
            (this._x = this._y = null));
        },
        point: function (e, t) {
          (this._x.push(+e), this._y.push(+t));
        },
      }),
      (k.prototype = {
        areaStart: function () {
          this._line = 0;
        },
        areaEnd: function () {
          this._line = NaN;
        },
        lineStart: function () {
          ((this._x = this._y = NaN), (this._point = 0));
        },
        lineEnd: function () {
          (0 < this._t &&
            this._t < 1 &&
            2 === this._point &&
            this._context.lineTo(this._x, this._y),
            (this._line || (0 !== this._line && 1 === this._point)) && this._context.closePath(),
            this._line >= 0 && ((this._t = 1 - this._t), (this._line = 1 - this._line)));
        },
        point: function (e, t) {
          switch (((e *= 1), (t *= 1), this._point)) {
            case 0:
              ((this._point = 1),
                this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t));
              break;
            case 1:
              this._point = 2;
            default:
              if (this._t <= 0) (this._context.lineTo(this._x, t), this._context.lineTo(e, t));
              else {
                var r = this._x * (1 - this._t) + e * this._t;
                (this._context.lineTo(r, this._y), this._context.lineTo(r, t));
              }
          }
          ((this._x = e), (this._y = t));
        },
      }));
    var T = e.i(94083),
      D = e.i(37195),
      N = (e, r) => {
        if (!e || 'function' == typeof e || 'boolean' == typeof e) return null;
        var n = e;
        if (
          ((0, t.isValidElement)(e) && (n = e.props),
          'object' != typeof n && 'function' != typeof n)
        )
          return null;
        var i = {};
        return (
          Object.keys(n).forEach((e) => {
            (0, D.isEventKey)(e) && 'function' == typeof n[e] && (i[e] = r || ((t) => n[e](n, t)));
          }),
          i
        );
      };
    e.s(
      [
        'adaptEventHandlers',
        0,
        N,
        'adaptEventsOfChild',
        0,
        (e, t, r) => {
          if (null === e || ('object' != typeof e && 'function' != typeof e)) return null;
          var n = null;
          return (
            Object.keys(e).forEach((i) => {
              var a = e[i];
              (0, D.isEventKey)(i) &&
                'function' == typeof a &&
                (n || (n = {}), (n[i] = (e) => (a(t, r, e), null)));
            }),
            n
          );
        },
        'isPolarCoordinate',
        0,
        (e) => 'radius' in e && 'startAngle' in e && 'endAngle' in e,
      ],
      68078,
    );
    var I = e.i(49294),
      L = e.i(25894),
      R = e.i(75093),
      B = e.i(77314);
    function z() {
      return (z = Object.assign.bind()).apply(null, arguments);
    }
    function F(e, t) {
      var r = Object.keys(e);
      if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(e);
        (t &&
          (n = n.filter(function (t) {
            return Object.getOwnPropertyDescriptor(e, t).enumerable;
          })),
          r.push.apply(r, n));
      }
      return r;
    }
    function U(e) {
      for (var t = 1; t < arguments.length; t++) {
        var r = null != arguments[t] ? arguments[t] : {};
        t % 2
          ? F(Object(r), !0).forEach(function (t) {
              var n, i, a;
              ((n = e),
                (i = t),
                (a = r[t]),
                (i = (function (e) {
                  var t = (function (e, t) {
                    if ('object' != typeof e || !e) return e;
                    var r = e[Symbol.toPrimitive];
                    if (void 0 !== r) {
                      var n = r.call(e, t || 'default');
                      if ('object' != typeof n) return n;
                      throw TypeError('@@toPrimitive must return a primitive value.');
                    }
                    return ('string' === t ? String : Number)(e);
                  })(e, 'string');
                  return 'symbol' == typeof t ? t : t + '';
                })(i)) in n
                  ? Object.defineProperty(n, i, {
                      value: a,
                      enumerable: !0,
                      configurable: !0,
                      writable: !0,
                    })
                  : (n[i] = a));
            })
          : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
            : F(Object(r)).forEach(function (t) {
                Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t));
              });
      }
      return e;
    }
    var W = {
        curveBasisClosed: function (e) {
          return new b(e);
        },
        curveBasisOpen: function (e) {
          return new x(e);
        },
        curveBasis: function (e) {
          return new g(e);
        },
        curveBumpX: function (e) {
          return new w(e, !0);
        },
        curveBumpY: function (e) {
          return new w(e, !1);
        },
        curveLinearClosed: function (e) {
          return new O(e);
        },
        curveLinear: a,
        curveMonotoneX: function (e) {
          return new _(e);
        },
        curveMonotoneY: function (e) {
          return new E(e);
        },
        curveNatural: function (e) {
          return new C(e);
        },
        curveStep: function (e) {
          return new k(e, 0.5);
        },
        curveStepAfter: function (e) {
          return new k(e, 1);
        },
        curveStepBefore: function (e) {
          return new k(e, 0);
        },
      },
      $ = (e) => (0, L.isWellBehavedNumber)(e.x) && (0, L.isWellBehavedNumber)(e.y),
      V = (e) => null != e.base && $(e.base) && $(e),
      K = (e) => e.x,
      H = (e) => e.y;
    e.s(
      [
        'Curve',
        0,
        (e) => {
          var { className: r, points: n, path: i, pathRef: o } = e,
            l = (0, B.useChartLayout)();
          if ((!n || !n.length) && !i) return null;
          var u = {
              type: e.type,
              points: e.points,
              baseLine: e.baseLine,
              layout: e.layout || l,
              connectNulls: e.connectNulls,
            },
            c =
              n && n.length
                ? ((e) => {
                    var {
                        type: t = 'linear',
                        points: r = [],
                        baseLine: n,
                        layout: i,
                        connectNulls: o = !1,
                      } = e,
                      l = ((e, t) => {
                        if ('function' == typeof e) return e;
                        var r = 'curve'.concat((0, I.upperFirst)(e));
                        if (('curveMonotone' === r || 'curveBump' === r) && t) {
                          var n = W[''.concat(r).concat('vertical' === t ? 'Y' : 'X')];
                          if (n) return n;
                        }
                        return W[r] || a;
                      })(t, i),
                      u = o ? r.filter($) : r;
                    if (Array.isArray(n)) {
                      var c = r.map((e, t) => U(U({}, e), {}, { base: n[t] }));
                      return (
                        'vertical' === i
                          ? v()
                              .y(H)
                              .x1(K)
                              .x0((e) => e.base.x)
                          : v()
                              .x(K)
                              .y1(H)
                              .y0((e) => e.base.y)
                      )
                        .defined(V)
                        .curve(l)(o ? c.filter(V) : c);
                    }
                    return (
                      'vertical' === i && (0, I.isNumber)(n)
                        ? v().y(H).x1(K).x0(n)
                        : (0, I.isNumber)(n)
                          ? v().x(K).y1(H).y0(n)
                          : h().x(K).y(H)
                    )
                      .defined($)
                      .curve(l)(u);
                  })(u)
                : i;
          return t.createElement(
            'path',
            z({}, (0, R.svgPropertiesNoEvents)(e), N(e), {
              className: (0, T.clsx)('recharts-curve', r),
              d: null === c ? void 0 : c,
              ref: o,
            }),
          );
        },
      ],
      1232,
    );
  },
  91214,
  (e) => {
    'use strict';
    var t = e.i(61129),
      r = e.i(94083),
      n = e.i(73508),
      i = ['children', 'className'];
    function a() {
      return (a = Object.assign.bind()).apply(null, arguments);
    }
    var o = t.forwardRef((e, o) => {
      var { children: l, className: u } = e,
        c = (function (e, t) {
          if (null == e) return {};
          var r,
            n,
            i = (function (e, t) {
              if (null == e) return {};
              var r = {};
              for (var n in e)
                if ({}.hasOwnProperty.call(e, n)) {
                  if (-1 !== t.indexOf(n)) continue;
                  r[n] = e[n];
                }
              return r;
            })(e, t);
          if (Object.getOwnPropertySymbols) {
            var a = Object.getOwnPropertySymbols(e);
            for (n = 0; n < a.length; n++)
              ((r = a[n]),
                -1 === t.indexOf(r) && {}.propertyIsEnumerable.call(e, r) && (i[r] = e[r]));
          }
          return i;
        })(e, i),
        s = (0, r.clsx)('recharts-layer', u);
      return t.createElement(
        'g',
        a({ className: s }, (0, n.svgPropertiesAndEvents)(c), { ref: o }),
        l,
      );
    });
    e.s(['Layer', 0, o]);
  },
  15202,
  83513,
  (e) => {
    'use strict';
    var t,
      r,
      n,
      i = e.i(61129),
      a = e.i(94083),
      o = e.i(49294),
      l = e.i(85948);
    function u(e, t) {
      var r = Object.keys(e);
      if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(e);
        (t &&
          (n = n.filter(function (t) {
            return Object.getOwnPropertyDescriptor(e, t).enumerable;
          })),
          r.push.apply(r, n));
      }
      return r;
    }
    var c = (function (e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? u(Object(r), !0).forEach(function (t) {
                var n, i, a;
                ((n = e),
                  (i = t),
                  (a = r[t]),
                  (i = (function (e) {
                    var t = (function (e, t) {
                      if ('object' != typeof e || !e) return e;
                      var r = e[Symbol.toPrimitive];
                      if (void 0 !== r) {
                        var n = r.call(e, t || 'default');
                        if ('object' != typeof n) return n;
                        throw TypeError('@@toPrimitive must return a primitive value.');
                      }
                      return ('string' === t ? String : Number)(e);
                    })(e, 'string');
                    return 'symbol' == typeof t ? t : t + '';
                  })(i)) in n
                    ? Object.defineProperty(n, i, {
                        value: a,
                        enumerable: !0,
                        configurable: !0,
                        writable: !0,
                      })
                    : (n[i] = a));
              })
            : Object.getOwnPropertyDescriptors
              ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
              : u(Object(r)).forEach(function (t) {
                  Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t));
                });
        }
        return e;
      })({}, { cacheSize: 2e3, enableCache: !0 }),
      s = new (class {
        constructor(e) {
          (!(function (e, t, r) {
            var n;
            (t =
              'symbol' ==
              typeof (n = (function (e, t) {
                if ('object' != typeof e || !e) return e;
                var r = e[Symbol.toPrimitive];
                if (void 0 !== r) {
                  var n = r.call(e, t || 'default');
                  if ('object' != typeof n) return n;
                  throw TypeError('@@toPrimitive must return a primitive value.');
                }
                return ('string' === t ? String : Number)(e);
              })(t, 'string'))
                ? n
                : n + '') in e
              ? Object.defineProperty(e, t, {
                  value: r,
                  enumerable: !0,
                  configurable: !0,
                  writable: !0,
                })
              : (e[t] = r);
          })(this, 'cache', new Map()),
            (this.maxSize = e));
        }
        get(e) {
          var t = this.cache.get(e);
          return (void 0 !== t && (this.cache.delete(e), this.cache.set(e, t)), t);
        }
        set(e, t) {
          if (this.cache.has(e)) this.cache.delete(e);
          else if (this.cache.size >= this.maxSize) {
            var r = this.cache.keys().next().value;
            null != r && this.cache.delete(r);
          }
          this.cache.set(e, t);
        }
        clear() {
          this.cache.clear();
        }
        size() {
          return this.cache.size;
        }
      })(c.cacheSize),
      f = {
        position: 'absolute',
        top: '-20000px',
        left: 0,
        padding: 0,
        margin: 0,
        border: 'none',
        whiteSpace: 'pre',
      },
      d = 'recharts_measurement_span',
      p = (e, t) => {
        try {
          var r = document.getElementById(d);
          (r ||
            ((r = document.createElement('span')).setAttribute('id', d),
            r.setAttribute('aria-hidden', 'true'),
            document.body.appendChild(r)),
            Object.assign(r.style, f, t),
            (r.textContent = ''.concat(e)));
          var n = r.getBoundingClientRect();
          return { width: n.width, height: n.height };
        } catch (e) {
          return { width: 0, height: 0 };
        }
      },
      h = function (e) {
        var t,
          r,
          n,
          i,
          a,
          o,
          u = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
        if (null == e || l.Global.isSsr) return { width: 0, height: 0 };
        if (!c.enableCache) return p(e, u);
        var f =
            ((t = u.fontSize || ''),
            (r = u.fontFamily || ''),
            (n = u.fontWeight || ''),
            (i = u.fontStyle || ''),
            (a = u.letterSpacing || ''),
            (o = u.textTransform || ''),
            ''
              .concat(e, '|')
              .concat(t, '|')
              .concat(r, '|')
              .concat(n, '|')
              .concat(i, '|')
              .concat(a, '|')
              .concat(o)),
          d = s.get(f);
        if (d) return d;
        var h = p(e, u);
        return (s.set(f, h), h);
      };
    e.s(['getStringSize', 0, h], 83513);
    var v = /(-?\d+(?:\.\d+)?[a-zA-Z%]*)([*/])(-?\d+(?:\.\d+)?[a-zA-Z%]*)/,
      y = /(-?\d+(?:\.\d+)?[a-zA-Z%]*)([+-])(-?\d+(?:\.\d+)?[a-zA-Z%]*)/,
      g = /^(px|cm|vh|vw|em|rem|%|mm|in|pt|pc|ex|ch|vmin|vmax|Q)$/,
      m = /(-?\d+(?:\.\d+)?)([a-zA-Z%]+)?/,
      b = { cm: 96 / 2.54, mm: 96 / 25.4, pt: 96 / 72, pc: 16, in: 96, Q: 96 / 101.6, px: 1 },
      x = ['cm', 'mm', 'pt', 'pc', 'in', 'Q', 'px'];
    class w {
      static parse(e) {
        var t,
          [, r, n] = null != (t = m.exec(e)) ? t : [];
        return null == r ? w.NaN : new w(parseFloat(r), null != n ? n : '');
      }
      constructor(e, t) {
        ((this.num = e),
          (this.unit = t),
          (this.num = e),
          (this.unit = t),
          (0, o.isNan)(e) && (this.unit = ''),
          '' === t || g.test(t) || ((this.num = NaN), (this.unit = '')),
          (function (e) {
            return x.includes(e);
          })(t) &&
            ((this.num = (function (e, t) {
              return e * b[t];
            })(e, t)),
            (this.unit = 'px')));
      }
      add(e) {
        return this.unit !== e.unit ? new w(NaN, '') : new w(this.num + e.num, this.unit);
      }
      subtract(e) {
        return this.unit !== e.unit ? new w(NaN, '') : new w(this.num - e.num, this.unit);
      }
      multiply(e) {
        return '' !== this.unit && '' !== e.unit && this.unit !== e.unit
          ? new w(NaN, '')
          : new w(this.num * e.num, this.unit || e.unit);
      }
      divide(e) {
        return '' !== this.unit && '' !== e.unit && this.unit !== e.unit
          ? new w(NaN, '')
          : new w(this.num / e.num, this.unit || e.unit);
      }
      toString() {
        return ''.concat(this.num).concat(this.unit);
      }
      isNaN() {
        return (0, o.isNan)(this.num);
      }
    }
    function O(e) {
      if (null == e || e.includes('NaN')) return 'NaN';
      for (var t = e; t.includes('*') || t.includes('/'); ) {
        var r,
          [, n, i, a] = null != (r = v.exec(t)) ? r : [],
          o = w.parse(null != n ? n : ''),
          l = w.parse(null != a ? a : ''),
          u = '*' === i ? o.multiply(l) : o.divide(l);
        if (u.isNaN()) return 'NaN';
        t = t.replace(v, u.toString());
      }
      for (; t.includes('+') || /.-\d+(?:\.\d+)?/.test(t); ) {
        var c,
          [, s, f, d] = null != (c = y.exec(t)) ? c : [],
          p = w.parse(null != s ? s : ''),
          h = w.parse(null != d ? d : ''),
          g = '+' === f ? p.add(h) : p.subtract(h);
        if (g.isNaN()) return 'NaN';
        t = t.replace(y, g.toString());
      }
      return t;
    }
    ((r = 'NaN'),
      (n = new w(NaN, '')),
      (r =
        'symbol' ==
        typeof (t = (function (e, t) {
          if ('object' != typeof e || !e) return e;
          var r = e[Symbol.toPrimitive];
          if (void 0 !== r) {
            var n = r.call(e, t || 'default');
            if ('object' != typeof n) return n;
            throw TypeError('@@toPrimitive must return a primitive value.');
          }
          return ('string' === t ? String : Number)(e);
        })(r, 'string'))
          ? t
          : t + '') in w
        ? Object.defineProperty(w, r, { value: n, enumerable: !0, configurable: !0, writable: !0 })
        : (w[r] = n));
    var S = /\(([^()]*)\)/;
    function A(e) {
      var t = (function (e) {
        try {
          var t;
          return (
            (t = e.replace(/\s+/g, '')),
            (t = (function (e) {
              for (var t, r = e; null != (t = S.exec(r)); ) {
                var [, n] = t;
                r = r.replace(S, O(n));
              }
              return r;
            })(t)),
            (t = O(t))
          );
        } catch (e) {
          return 'NaN';
        }
      })(e.slice(5, -1));
      return 'NaN' === t ? '' : t;
    }
    var P = e.i(73508),
      _ = e.i(75448),
      E = e.i(25894),
      j = [
        'x',
        'y',
        'lineHeight',
        'capHeight',
        'fill',
        'scaleToFit',
        'textAnchor',
        'verticalAnchor',
      ],
      C = ['dx', 'dy', 'angle', 'className', 'breakAll'];
    function M() {
      return (M = Object.assign.bind()).apply(null, arguments);
    }
    function k(e, t) {
      if (null == e) return {};
      var r,
        n,
        i = (function (e, t) {
          if (null == e) return {};
          var r = {};
          for (var n in e)
            if ({}.hasOwnProperty.call(e, n)) {
              if (-1 !== t.indexOf(n)) continue;
              r[n] = e[n];
            }
          return r;
        })(e, t);
      if (Object.getOwnPropertySymbols) {
        var a = Object.getOwnPropertySymbols(e);
        for (n = 0; n < a.length; n++)
          ((r = a[n]), -1 === t.indexOf(r) && {}.propertyIsEnumerable.call(e, r) && (i[r] = e[r]));
      }
      return i;
    }
    var T = /[ \f\n\r\t\v\u2028\u2029]+/,
      D = (e) => {
        var { children: t, breakAll: r, style: n } = e;
        try {
          var i = [];
          (0, o.isNullish)(t) || (i = r ? t.toString().split('') : t.toString().split(T));
          var a = i.map((e) => ({ word: e, width: h(e, n).width })),
            l = r ? 0 : h(' ', n).width;
          return { wordsWithComputedWidth: a, spaceWidth: l };
        } catch (e) {
          return null;
        }
      },
      N = (e, t, r, n) =>
        e.reduce((e, i) => {
          var { word: a, width: o } = i,
            l = e[e.length - 1];
          return (
            l && null != o && (null == t || n || l.width + o + r < Number(t))
              ? (l.words.push(a), (l.width += o + r))
              : e.push({ words: [a], width: o }),
            e
          );
        }, []),
      I = (e) => e.reduce((e, t) => (e.width > t.width ? e : t)),
      L = (e, t, r, n, i, a, o, l) => {
        var u = D({ breakAll: r, style: n, children: e.slice(0, t) + '…' });
        if (!u) return [!1, []];
        var c = N(u.wordsWithComputedWidth, a, o, l);
        return [c.length > i || I(c).width > Number(a), c];
      },
      R = (e) => [{ words: (0, o.isNullish)(e) ? [] : e.toString().split(T), width: void 0 }],
      B = '#808080',
      z = {
        angle: 0,
        breakAll: !1,
        capHeight: '0.71em',
        fill: B,
        lineHeight: '1em',
        scaleToFit: !1,
        textAnchor: 'start',
        verticalAnchor: 'end',
        x: 0,
        y: 0,
      },
      F = (0, i.forwardRef)((e, t) => {
        var r,
          n = (0, _.resolveDefaultProps)(e, z),
          {
            x: u,
            y: c,
            lineHeight: s,
            capHeight: f,
            fill: d,
            scaleToFit: p,
            textAnchor: h,
            verticalAnchor: v,
          } = n,
          y = k(n, j),
          g = (0, i.useMemo)(
            () =>
              ((e) => {
                var {
                  width: t,
                  scaleToFit: r,
                  children: n,
                  style: i,
                  breakAll: a,
                  maxLines: u,
                } = e;
                if ((t || r) && !l.Global.isSsr) {
                  var c = D({ breakAll: a, children: n, style: i });
                  if (!c) return R(n);
                  var { wordsWithComputedWidth: s, spaceWidth: f } = c;
                  return ((e, t, r, n, i) => {
                    var a,
                      { maxLines: l, children: u, style: c, breakAll: s } = e,
                      f = (0, o.isNumber)(l),
                      d = String(u),
                      p = N(t, n, r, i);
                    if (!f || i || !(p.length > l || I(p).width > Number(n))) return p;
                    for (var h = 0, v = d.length - 1, y = 0; h <= v && y <= d.length - 1; ) {
                      var g = Math.floor((h + v) / 2),
                        [m, b] = L(d, g - 1, s, c, l, n, r, i),
                        [x] = L(d, g, s, c, l, n, r, i);
                      if ((m || x || (h = g + 1), m && x && (v = g - 1), !m && x)) {
                        a = b;
                        break;
                      }
                      y++;
                    }
                    return a || p;
                  })({ breakAll: a, children: n, maxLines: u, style: i }, s, f, t, !!r);
                }
                return R(n);
              })({
                breakAll: y.breakAll,
                children: y.children,
                maxLines: y.maxLines,
                scaleToFit: p,
                style: y.style,
                width: y.width,
              }),
            [y.breakAll, y.children, y.maxLines, p, y.style, y.width],
          ),
          { dx: m, dy: b, angle: x, className: w, breakAll: O } = y,
          S = k(y, C);
        if (!(0, o.isNumOrStr)(u) || !(0, o.isNumOrStr)(c) || 0 === g.length) return null;
        var T = Number(u) + ((0, o.isNumber)(m) ? m : 0),
          F = Number(c) + ((0, o.isNumber)(b) ? b : 0);
        if (!(0, E.isWellBehavedNumber)(T) || !(0, E.isWellBehavedNumber)(F)) return null;
        switch (v) {
          case 'start':
            r = A('calc('.concat(f, ')'));
            break;
          case 'middle':
            r = A(
              'calc('
                .concat((g.length - 1) / 2, ' * -')
                .concat(s, ' + (')
                .concat(f, ' / 2))'),
            );
            break;
          default:
            r = A('calc('.concat(g.length - 1, ' * -').concat(s, ')'));
        }
        var U = [],
          W = g[0];
        if (p && null != W) {
          var $ = W.width,
            { width: V } = y;
          U.push('scale('.concat((0, o.isNumber)(V) && (0, o.isNumber)($) ? V / $ : 1, ')'));
        }
        return (
          x && U.push('rotate('.concat(x, ', ').concat(T, ', ').concat(F, ')')),
          U.length && (S.transform = U.join(' ')),
          i.createElement(
            'text',
            M({}, (0, P.svgPropertiesAndEvents)(S), {
              ref: t,
              x: T,
              y: F,
              className: (0, a.clsx)('recharts-text', w),
              textAnchor: h,
              fill: d.includes('url') ? B : d,
            }),
            g.map((e, t) => {
              var n = e.words.join(O ? '' : ' ');
              return i.createElement(
                'tspan',
                { x: T, dy: 0 === t ? r : s, key: ''.concat(n, '-').concat(t) },
                n,
              );
            }),
          )
        );
      });
    ((F.displayName = 'Text'),
      e.s(
        [
          'Text',
          0,
          F,
          'isRenderableText',
          0,
          function (e) {
            return (
              (0, o.isNullish)(e) ||
              'string' == typeof e ||
              'number' == typeof e ||
              'boolean' == typeof e
            );
          },
          'isValidTextAnchor',
          0,
          function (e) {
            return 'start' === e || 'middle' === e || 'end' === e || 'inherit' === e;
          },
        ],
        15202,
      ));
  },
  57155,
  7848,
  44587,
  (e) => {
    'use strict';
    var t = e.i(61129),
      r = e.i(94083),
      n = e.i(15202),
      i = e.i(49294),
      a = e.i(13348),
      o = e.i(77314),
      l = e.i(98733),
      u = e.i(83300),
      c = e.i(75448),
      s = e.i(73508),
      f = e.i(7473),
      d = e.i(47432),
      p = e.i(18344),
      h = e.i(57632);
    function v(e) {
      var { zIndex: r, children: n } = e,
        i = (0, o.useIsInChartContext)() && void 0 !== r && 0 !== r,
        a = (0, h.useIsPanorama)(),
        u = (0, t.useRef)(void 0),
        c = (0, t.useRef)(new Set()),
        s = (0, l.useAppDispatch)(),
        v = (0, l.useAppSelector)((e) => (0, d.selectZIndexPortalElement)(e, r, a));
      if (
        ((0, t.useLayoutEffect)(() => {
          if (!i) {
            var e = c.current;
            (e.forEach((e) => {
              s((0, p.unregisterZIndexPortal)({ zIndex: e }));
            }),
              e.clear(),
              (u.current = void 0));
            return;
          }
          if (
            (c.current.has(r) || (s((0, p.registerZIndexPortal)({ zIndex: r })), c.current.add(r)),
            v)
          ) {
            u.current = v;
            var t = c.current;
            t.forEach((e) => {
              e !== r && (s((0, p.unregisterZIndexPortal)({ zIndex: e })), t.delete(e));
            });
          }
        }, [s, r, i, v]),
        (0, t.useLayoutEffect)(() => {
          var e = c.current;
          return () => {
            (e.forEach((e) => {
              s((0, p.unregisterZIndexPortal)({ zIndex: e }));
            }),
              e.clear());
          };
        }, [s]),
        !i)
      )
        return n;
      var y = null != v ? v : u.current;
      return y ? (0, f.createPortal)(n, y) : null;
    }
    e.s(['ZIndexLayer', 0, v], 7848);
    var y = e.i(95916);
    function g(e, t) {
      var r = Object.keys(e);
      if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(e);
        (t &&
          (n = n.filter(function (t) {
            return Object.getOwnPropertyDescriptor(e, t).enumerable;
          })),
          r.push.apply(r, n));
      }
      return r;
    }
    function m(e) {
      for (var t = 1; t < arguments.length; t++) {
        var r = null != arguments[t] ? arguments[t] : {};
        t % 2
          ? g(Object(r), !0).forEach(function (t) {
              var n, i, a;
              ((n = e),
                (i = t),
                (a = r[t]),
                (i = (function (e) {
                  var t = (function (e, t) {
                    if ('object' != typeof e || !e) return e;
                    var r = e[Symbol.toPrimitive];
                    if (void 0 !== r) {
                      var n = r.call(e, t || 'default');
                      if ('object' != typeof n) return n;
                      throw TypeError('@@toPrimitive must return a primitive value.');
                    }
                    return ('string' === t ? String : Number)(e);
                  })(e, 'string');
                  return 'symbol' == typeof t ? t : t + '';
                })(i)) in n
                  ? Object.defineProperty(n, i, {
                      value: a,
                      enumerable: !0,
                      configurable: !0,
                      writable: !0,
                    })
                  : (n[i] = a));
            })
          : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
            : g(Object(r)).forEach(function (t) {
                Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t));
              });
      }
      return e;
    }
    var b = ['labelRef'],
      x = ['content'];
    function w(e, t) {
      if (null == e) return {};
      var r,
        n,
        i = (function (e, t) {
          if (null == e) return {};
          var r = {};
          for (var n in e)
            if ({}.hasOwnProperty.call(e, n)) {
              if (-1 !== t.indexOf(n)) continue;
              r[n] = e[n];
            }
          return r;
        })(e, t);
      if (Object.getOwnPropertySymbols) {
        var a = Object.getOwnPropertySymbols(e);
        for (n = 0; n < a.length; n++)
          ((r = a[n]), -1 === t.indexOf(r) && {}.propertyIsEnumerable.call(e, r) && (i[r] = e[r]));
      }
      return i;
    }
    function O(e, t) {
      var r = Object.keys(e);
      if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(e);
        (t &&
          (n = n.filter(function (t) {
            return Object.getOwnPropertyDescriptor(e, t).enumerable;
          })),
          r.push.apply(r, n));
      }
      return r;
    }
    function S(e) {
      for (var t = 1; t < arguments.length; t++) {
        var r = null != arguments[t] ? arguments[t] : {};
        t % 2
          ? O(Object(r), !0).forEach(function (t) {
              var n, i, a;
              ((n = e),
                (i = t),
                (a = r[t]),
                (i = (function (e) {
                  var t = (function (e, t) {
                    if ('object' != typeof e || !e) return e;
                    var r = e[Symbol.toPrimitive];
                    if (void 0 !== r) {
                      var n = r.call(e, t || 'default');
                      if ('object' != typeof n) return n;
                      throw TypeError('@@toPrimitive must return a primitive value.');
                    }
                    return ('string' === t ? String : Number)(e);
                  })(e, 'string');
                  return 'symbol' == typeof t ? t : t + '';
                })(i)) in n
                  ? Object.defineProperty(n, i, {
                      value: a,
                      enumerable: !0,
                      configurable: !0,
                      writable: !0,
                    })
                  : (n[i] = a));
            })
          : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
            : O(Object(r)).forEach(function (t) {
                Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t));
              });
      }
      return e;
    }
    function A() {
      return (A = Object.assign.bind()).apply(null, arguments);
    }
    var P = (0, t.createContext)(null),
      _ = () => {
        var e = (0, t.useContext)(P),
          r = (0, o.useViewBox)();
        return e || (r ? (0, o.cartesianViewBoxToTrapezoid)(r) : void 0);
      },
      E = (0, t.createContext)(null),
      j = (e) => null != e && 'function' == typeof e,
      C = (e) => null != e && 'cx' in e && (0, i.isNumber)(e.cx),
      M = {
        angle: 0,
        offset: 5,
        zIndex: y.DefaultZIndexes.label,
        position: 'middle',
        textBreakAll: !1,
      };
    function k(e) {
      var f,
        d,
        p,
        h,
        y,
        g = (0, c.resolveDefaultProps)(e, M),
        {
          viewBox: O,
          parentViewBox: P,
          position: j,
          value: k,
          children: T,
          content: D,
          className: N = '',
          textBreakAll: I,
          labelRef: L,
        } = g,
        R = ((f = (0, t.useContext)(E)), (d = (0, l.useAppSelector)(u.selectPolarViewBox)), f || d),
        B = _(),
        z = (function (e) {
          if (!C(e)) return e;
          var { cx: t, cy: r, outerRadius: n } = e,
            i = 2 * n;
          return { x: t - n, y: r - n, width: i, upperWidth: i, lowerWidth: i, height: i };
        })(
          (p =
            null == O
              ? 'center' === j
                ? B
                : null != R
                  ? R
                  : B
              : C(O)
                ? O
                : (0, o.cartesianViewBoxToTrapezoid)(O)),
        );
      if (
        !p ||
        ((0, i.isNullish)(k) &&
          (0, i.isNullish)(T) &&
          !(0, t.isValidElement)(D) &&
          'function' != typeof D)
      )
        return null;
      var F = S(S({}, g), {}, { viewBox: p });
      if ((0, t.isValidElement)(D)) {
        var { labelRef: U } = F,
          W = w(F, b);
        return (0, t.cloneElement)(D, W);
      }
      if ('function' == typeof D) {
        var { content: $ } = F,
          V = w(F, x);
        if (((h = (0, t.createElement)(D, V)), (0, t.isValidElement)(h))) return h;
      } else
        h = ((e) => {
          var { value: t, formatter: r } = e,
            n = (0, i.isNullish)(e.children) ? t : e.children;
          return 'function' == typeof r ? r(n) : n;
        })(g);
      var K = (0, s.svgPropertiesAndEvents)(g);
      if (C(p)) {
        if ('insideStart' === j || 'insideEnd' === j || 'end' === j)
          return ((e, n, o, l, u) => {
            var c,
              s,
              { offset: f, className: d } = e,
              {
                cx: p,
                cy: h,
                innerRadius: v,
                outerRadius: y,
                startAngle: g,
                endAngle: m,
                clockWise: b,
              } = u,
              x = (v + y) / 2,
              w = (0, i.mathSign)(m - g) * Math.min(Math.abs(m - g), 360),
              O = w >= 0 ? 1 : -1;
            switch (n) {
              case 'insideStart':
                ((c = g + O * f), (s = b));
                break;
              case 'insideEnd':
                ((c = m - O * f), (s = !b));
                break;
              case 'end':
                ((c = m + O * f), (s = b));
                break;
              default:
                throw Error('Unsupported position '.concat(n));
            }
            s = w <= 0 ? s : !s;
            var S = (0, a.polarToCartesian)(p, h, x, c),
              P = (0, a.polarToCartesian)(p, h, x, c + (s ? 1 : -1) * 359),
              _ = 'M'
                .concat(S.x, ',')
                .concat(S.y, '\n    A')
                .concat(x, ',')
                .concat(x, ',0,1,')
                .concat(+!s, ',\n    ')
                .concat(P.x, ',')
                .concat(P.y),
              E = (0, i.isNullish)(e.id) ? (0, i.uniqueId)('recharts-radial-line-') : e.id;
            return t.createElement(
              'text',
              A({}, l, {
                dominantBaseline: 'central',
                className: (0, r.clsx)('recharts-radial-bar-label', d),
              }),
              t.createElement('defs', null, t.createElement('path', { id: E, d: _ })),
              t.createElement('textPath', { xlinkHref: '#'.concat(E) }, o),
            );
          })(g, j, h, K, p);
        y = ((e, t, r) => {
          var { cx: n, cy: i, innerRadius: o, outerRadius: l, startAngle: u, endAngle: c } = e,
            s = (u + c) / 2;
          if ('outside' === r) {
            var { x: f, y: d } = (0, a.polarToCartesian)(n, i, l + t, s);
            return { x: f, y: d, textAnchor: f >= n ? 'start' : 'end', verticalAnchor: 'middle' };
          }
          if ('center' === r) return { x: n, y: i, textAnchor: 'middle', verticalAnchor: 'middle' };
          if ('centerTop' === r)
            return { x: n, y: i, textAnchor: 'middle', verticalAnchor: 'start' };
          if ('centerBottom' === r)
            return { x: n, y: i, textAnchor: 'middle', verticalAnchor: 'end' };
          var { x: p, y: h } = (0, a.polarToCartesian)(n, i, (o + l) / 2, s);
          return { x: p, y: h, textAnchor: 'middle', verticalAnchor: 'middle' };
        })(p, g.offset, g.position);
      } else {
        if (!z) return null;
        var H = ((e) => {
          var { viewBox: t, position: r, offset: n = 0, parentViewBox: a, clamp: l } = e,
            {
              x: u,
              y: c,
              height: s,
              upperWidth: f,
              lowerWidth: d,
            } = (0, o.cartesianViewBoxToTrapezoid)(t),
            p = u + (f - d) / 2,
            h = (u + p) / 2,
            v = (f + d) / 2,
            y = s >= 0 ? 1 : -1,
            g = y * n,
            b = y > 0 ? 'end' : 'start',
            x = y > 0 ? 'start' : 'end',
            w = f >= 0 ? 1 : -1,
            O = w * n,
            S = w > 0 ? 'end' : 'start',
            A = w > 0 ? 'start' : 'end';
          if ('top' === r) {
            var P = { x: u + f / 2, y: c - g, horizontalAnchor: 'middle', verticalAnchor: b };
            return (l && a && ((P.height = Math.max(c - a.y, 0)), (P.width = f)), P);
          }
          if ('bottom' === r) {
            var _ = { x: p + d / 2, y: c + s + g, horizontalAnchor: 'middle', verticalAnchor: x };
            return (
              l && a && ((_.height = Math.max(a.y + a.height - (c + s), 0)), (_.width = d)),
              _
            );
          }
          if ('left' === r) {
            var E = { x: h - O, y: c + s / 2, horizontalAnchor: S, verticalAnchor: 'middle' };
            return (l && a && ((E.width = Math.max(E.x - a.x, 0)), (E.height = s)), E);
          }
          if ('right' === r) {
            var j = { x: h + v + O, y: c + s / 2, horizontalAnchor: A, verticalAnchor: 'middle' };
            return (l && a && ((j.width = Math.max(a.x + a.width - j.x, 0)), (j.height = s)), j);
          }
          var C = l && a ? { width: v, height: s } : {};
          return 'insideLeft' === r
            ? m({ x: h + O, y: c + s / 2, horizontalAnchor: A, verticalAnchor: 'middle' }, C)
            : 'insideRight' === r
              ? m({ x: h + v - O, y: c + s / 2, horizontalAnchor: S, verticalAnchor: 'middle' }, C)
              : 'insideTop' === r
                ? m({ x: u + f / 2, y: c + g, horizontalAnchor: 'middle', verticalAnchor: x }, C)
                : 'insideBottom' === r
                  ? m(
                      { x: p + d / 2, y: c + s - g, horizontalAnchor: 'middle', verticalAnchor: b },
                      C,
                    )
                  : 'insideTopLeft' === r
                    ? m({ x: u + O, y: c + g, horizontalAnchor: A, verticalAnchor: x }, C)
                    : 'insideTopRight' === r
                      ? m({ x: u + f - O, y: c + g, horizontalAnchor: S, verticalAnchor: x }, C)
                      : 'insideBottomLeft' === r
                        ? m({ x: p + O, y: c + s - g, horizontalAnchor: A, verticalAnchor: b }, C)
                        : 'insideBottomRight' === r
                          ? m(
                              {
                                x: p + d - O,
                                y: c + s - g,
                                horizontalAnchor: S,
                                verticalAnchor: b,
                              },
                              C,
                            )
                          : r &&
                              'object' == typeof r &&
                              ((0, i.isNumber)(r.x) || (0, i.isPercent)(r.x)) &&
                              ((0, i.isNumber)(r.y) || (0, i.isPercent)(r.y))
                            ? m(
                                {
                                  x: u + (0, i.getPercentValue)(r.x, v),
                                  y: c + (0, i.getPercentValue)(r.y, s),
                                  horizontalAnchor: 'end',
                                  verticalAnchor: 'end',
                                },
                                C,
                              )
                            : m(
                                {
                                  x: u + f / 2,
                                  y: c + s / 2,
                                  horizontalAnchor: 'middle',
                                  verticalAnchor: 'middle',
                                },
                                C,
                              );
        })({
          viewBox: z,
          position: j,
          offset: g.offset,
          parentViewBox: C(P) ? void 0 : P,
          clamp: !0,
        });
        y = S(
          S(
            { x: H.x, y: H.y, textAnchor: H.horizontalAnchor, verticalAnchor: H.verticalAnchor },
            void 0 !== H.width ? { width: H.width } : {},
          ),
          void 0 !== H.height ? { height: H.height } : {},
        );
      }
      return t.createElement(
        v,
        { zIndex: g.zIndex },
        t.createElement(
          n.Text,
          A({ ref: L, className: (0, r.clsx)('recharts-label', N) }, K, y, {
            textAnchor: (0, n.isValidTextAnchor)(K.textAnchor) ? K.textAnchor : y.textAnchor,
            breakAll: I,
          }),
          h,
        ),
      );
    }
    ((k.displayName = 'Label'),
      e.s(
        [
          'CartesianLabelContextProvider',
          0,
          (e) => {
            var { x: r, y: n, upperWidth: i, lowerWidth: a, width: o, height: l, children: u } = e,
              c = (0, t.useMemo)(
                () => ({ x: r, y: n, upperWidth: i, lowerWidth: a, width: o, height: l }),
                [r, n, i, a, o, l],
              );
            return t.createElement(P.Provider, { value: c }, u);
          },
          'CartesianLabelFromLabelProp',
          0,
          function (e) {
            var { label: r, labelRef: n } = e;
            return (
              ((e, r, n) => {
                if (!e) return null;
                var a = { viewBox: r, labelRef: n };
                return !0 === e
                  ? t.createElement(k, A({ key: 'label-implicit' }, a))
                  : (0, i.isNumOrStr)(e)
                    ? t.createElement(k, A({ key: 'label-implicit', value: e }, a))
                    : (0, t.isValidElement)(e)
                      ? e.type === k
                        ? (0, t.cloneElement)(e, S({ key: 'label-implicit' }, a))
                        : t.createElement(k, A({ key: 'label-implicit', content: e }, a))
                      : j(e)
                        ? t.createElement(k, A({ key: 'label-implicit', content: e }, a))
                        : e && 'object' == typeof e
                          ? t.createElement(k, A({}, e, { key: 'label-implicit' }, a))
                          : null;
              })(r, _(), n) || null
            );
          },
          'Label',
          0,
          k,
          'isLabelContentAFunction',
          0,
          j,
        ],
        44587,
      ));
    var T = e.i(91214),
      D = e.i(41469),
      N = ['valueAccessor'],
      I = ['dataKey', 'clockWise', 'id', 'textBreakAll', 'zIndex'];
    function L() {
      return (L = Object.assign.bind()).apply(null, arguments);
    }
    function R(e, t) {
      if (null == e) return {};
      var r,
        n,
        i = (function (e, t) {
          if (null == e) return {};
          var r = {};
          for (var n in e)
            if ({}.hasOwnProperty.call(e, n)) {
              if (-1 !== t.indexOf(n)) continue;
              r[n] = e[n];
            }
          return r;
        })(e, t);
      if (Object.getOwnPropertySymbols) {
        var a = Object.getOwnPropertySymbols(e);
        for (n = 0; n < a.length; n++)
          ((r = a[n]), -1 === t.indexOf(r) && {}.propertyIsEnumerable.call(e, r) && (i[r] = e[r]));
      }
      return i;
    }
    var B = (e) => {
        var t = Array.isArray(e.value) ? e.value[e.value.length - 1] : e.value;
        if ((0, n.isRenderableText)(t)) return t;
      },
      z = (0, t.createContext)(void 0),
      F = z.Provider,
      U = (0, t.createContext)(void 0),
      W = U.Provider;
    function $(e) {
      var { valueAccessor: r = B } = e,
        n = R(e, N),
        { dataKey: a, clockWise: o, id: l, textBreakAll: u, zIndex: c } = n,
        f = R(n, I),
        d = (0, t.useContext)(z),
        p = (0, t.useContext)(U),
        h = d || p;
      return h && h.length
        ? t.createElement(
            v,
            { zIndex: null != c ? c : y.DefaultZIndexes.label },
            t.createElement(
              T.Layer,
              { className: 'recharts-label-list' },
              h.map((e, o) => {
                var c,
                  d = (0, i.isNullish)(a) ? r(e, o) : (0, D.getValueByDataKey)(e.payload, a),
                  p = (0, i.isNullish)(l) ? {} : { id: ''.concat(l, '-').concat(o) };
                return t.createElement(
                  k,
                  L({ key: 'label-'.concat(o) }, (0, s.svgPropertiesAndEvents)(e), f, p, {
                    fill: null != (c = n.fill) ? c : e.fill,
                    parentViewBox: e.parentViewBox,
                    value: d,
                    textBreakAll: u,
                    viewBox: e.viewBox,
                    index: o,
                    zIndex: 0,
                  }),
                );
              }),
            ),
          )
        : null;
    }
    (($.displayName = 'LabelList'),
      e.s(
        [
          'CartesianLabelListContextProvider',
          0,
          F,
          'LabelListFromLabelProp',
          0,
          function (e) {
            var { label: r } = e;
            return r
              ? !0 === r
                ? t.createElement($, { key: 'labelList-implicit' })
                : t.isValidElement(r) || j(r)
                  ? t.createElement($, { key: 'labelList-implicit', content: r })
                  : 'object' == typeof r
                    ? t.createElement(
                        $,
                        L({ key: 'labelList-implicit' }, r, { type: String(r.type) }),
                      )
                    : null
              : null;
          },
          'PolarLabelListContextProvider',
          0,
          W,
        ],
        57155,
      ));
  },
  5636,
  (e) => {
    'use strict';
    var t = e.i(28539),
      r = e.i(61129),
      n = e.i(29850),
      i = e.i(49294),
      a = (e) => ('string' == typeof e ? e : e ? e.displayName || e.name || 'Component' : ''),
      o = null,
      l = null,
      u = (e) => {
        if (e === o && Array.isArray(l)) return l;
        var t = [];
        return (
          r.Children.forEach(e, (e) => {
            (0, i.isNullish)(e) ||
              ((0, n.isFragment)(e) ? (t = t.concat(u(e.props.children))) : t.push(e));
          }),
          (l = t),
          (o = e),
          t
        );
      };
    e.s([
      'findAllByType',
      0,
      function (e, r) {
        var n = [],
          i = [];
        return (
          (i = Array.isArray(r) ? r.map((e) => a(e)) : [a(r)]),
          u(e).forEach((e) => {
            var r = (0, t.default)(e, 'type.displayName') || (0, t.default)(e, 'type.name');
            r && -1 !== i.indexOf(r) && n.push(e);
          }),
          n
        );
      },
      'isClipDot',
      0,
      (e) => !e || 'object' != typeof e || !('clipDot' in e) || !!e.clipDot,
    ]);
  },
  88514,
  (e) => {
    'use strict';
    var t = e.i(61129),
      r = e.i(98733),
      n = e.i(12281),
      i = e.i(57632);
    e.s([
      'SetTooltipEntrySettings',
      0,
      function (e) {
        var { tooltipEntrySettings: a } = e,
          o = (0, r.useAppDispatch)(),
          l = (0, i.useIsPanorama)(),
          u = (0, t.useRef)(null);
        return (
          (0, t.useLayoutEffect)(() => {
            l ||
              (null === u.current
                ? o((0, n.addTooltipEntrySettings)(a))
                : u.current !== a &&
                  o((0, n.replaceTooltipEntrySettings)({ prev: u.current, next: a })),
              (u.current = a));
          }, [a, o, l]),
          (0, t.useLayoutEffect)(
            () => () => {
              u.current && (o((0, n.removeTooltipEntrySettings)(u.current)), (u.current = null));
            },
            [o],
          ),
          null
        );
      },
    ]);
  },
  96459,
  42965,
  (e) => {
    'use strict';
    var t = e.i(61129),
      r = e.i(98733),
      n = e.i(58644),
      i = e.i(25650);
    function a(e, t) {
      var i,
        a,
        o = (0, r.useAppSelector)((t) => (0, n.selectXAxisSettings)(t, e)),
        l = (0, r.useAppSelector)((e) => (0, n.selectYAxisSettings)(e, t)),
        u =
          null != (i = null == o ? void 0 : o.allowDataOverflow)
            ? i
            : n.implicitXAxis.allowDataOverflow,
        c =
          null != (a = null == l ? void 0 : l.allowDataOverflow)
            ? a
            : n.implicitYAxis.allowDataOverflow;
      return { needClip: u || c, needClipX: u, needClipY: c };
    }
    e.s(
      [
        'GraphicalItemClipPath',
        0,
        function (e) {
          var { xAxisId: r, yAxisId: n, clipPathId: o } = e,
            l = (0, i.usePlotArea)(),
            { needClipX: u, needClipY: c, needClip: s } = a(r, n);
          if (!s || !l) return null;
          var { x: f, y: d, width: p, height: h } = l;
          return t.createElement(
            'clipPath',
            { id: 'clipPath-'.concat(o) },
            t.createElement('rect', {
              x: u ? f : f - p / 2,
              y: c ? d : d - h / 2,
              width: u ? p : 2 * p,
              height: c ? h : 2 * h,
            }),
          );
        },
        'useNeedsClip',
        0,
        a,
      ],
      96459,
    );
    var o = e.i(45424);
    e.s(
      [
        'selectXAxisIdFromGraphicalItemId',
        0,
        function (e, t) {
          var r, n;
          return null !=
            (r =
              null == (n = e.graphicalItems.cartesianItems.find((e) => e.id === t))
                ? void 0
                : n.xAxisId)
            ? r
            : o.defaultAxisId;
        },
        'selectYAxisIdFromGraphicalItemId',
        0,
        function (e, t) {
          var r, n;
          return null !=
            (r =
              null == (n = e.graphicalItems.cartesianItems.find((e) => e.id === t))
                ? void 0
                : n.yAxisId)
            ? r
            : o.defaultAxisId;
        },
      ],
      42965,
    );
  },
  65573,
  (e) => {
    'use strict';
    var t = e.i(61129),
      r = e.i(57632),
      n = e.i(77314),
      i = e.i(98733),
      a = e.i(89179);
    e.s([
      'SetLegendPayload',
      0,
      function (e) {
        var { legendPayload: n } = e,
          o = (0, i.useAppDispatch)(),
          l = (0, r.useIsPanorama)(),
          u = (0, t.useRef)(null);
        return (
          (0, t.useLayoutEffect)(() => {
            l ||
              (null === u.current
                ? o((0, a.addLegendPayload)(n))
                : u.current !== n && o((0, a.replaceLegendPayload)({ prev: u.current, next: n })),
              (u.current = n));
          }, [o, l, n]),
          (0, t.useLayoutEffect)(
            () => () => {
              u.current && (o((0, a.removeLegendPayload)(u.current)), (u.current = null));
            },
            [o],
          ),
          null
        );
      },
      'SetPolarLegendPayload',
      0,
      function (e) {
        var { legendPayload: r } = e,
          o = (0, i.useAppDispatch)(),
          l = (0, i.useAppSelector)(n.selectChartLayout),
          u = (0, t.useRef)(null);
        return (
          (0, t.useLayoutEffect)(() => {
            ('centric' === l || 'radial' === l) &&
              (null === u.current
                ? o((0, a.addLegendPayload)(r))
                : u.current !== r && o((0, a.replaceLegendPayload)({ prev: u.current, next: r })),
              (u.current = r));
          }, [o, l, r]),
          (0, t.useLayoutEffect)(
            () => () => {
              u.current && (o((0, a.removeLegendPayload)(u.current)), (u.current = null));
            },
            [o],
          ),
          null
        );
      },
    ]);
  },
  14742,
  (e) => {
    'use strict';
    var t = e.i(61129),
      r = e.i(49294);
    e.s([
      'useAnimationId',
      0,
      function (e) {
        var n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 'animation-',
          i = (0, t.useRef)((0, r.uniqueId)(n)),
          a = (0, t.useRef)(e);
        return (a.current !== e && ((i.current = (0, r.uniqueId)(n)), (a.current = e)), i.current);
      },
    ]);
  },
  91595,
  95335,
  76619,
  (e) => {
    'use strict';
    var t,
      r = e.i(61129),
      n = e.i(49294),
      i =
        null != (t = r['useId'.toString()])
          ? t
          : () => {
              var [e] = r.useState(() => (0, n.uniqueId)('uid-'));
              return e;
            };
    function a(e, t) {
      var r = i();
      return t || (e ? ''.concat(e, '-').concat(r) : r);
    }
    e.s(['useUniqueId', 0, a], 95335);
    var o = (0, r.createContext)(void 0);
    e.s(
      [
        'RegisterGraphicalItemId',
        0,
        (e) => {
          var { id: t, type: n, children: i } = e,
            l = a('recharts-'.concat(n), t);
          return r.createElement(o.Provider, { value: l }, i(l));
        },
      ],
      91595,
    );
    var l = e.i(98733),
      u = e.i(26547),
      c = (0, r.memo)((e) => {
        var t = (0, l.useAppDispatch)(),
          n = (0, r.useRef)(null);
        return (
          (0, r.useLayoutEffect)(() => {
            (null === n.current
              ? t((0, u.addCartesianGraphicalItem)(e))
              : n.current !== e &&
                t((0, u.replaceCartesianGraphicalItem)({ prev: n.current, next: e })),
              (n.current = e));
          }, [t, e]),
          (0, r.useLayoutEffect)(
            () => () => {
              n.current && (t((0, u.removeCartesianGraphicalItem)(n.current)), (n.current = null));
            },
            [t],
          ),
          null
        );
      }),
      s = (0, r.memo)((e) => {
        var t = (0, l.useAppDispatch)(),
          n = (0, r.useRef)(null);
        return (
          (0, r.useLayoutEffect)(() => {
            (null === n.current
              ? t((0, u.addPolarGraphicalItem)(e))
              : n.current !== e &&
                t((0, u.replacePolarGraphicalItem)({ prev: n.current, next: e })),
              (n.current = e));
          }, [t, e]),
          (0, r.useLayoutEffect)(
            () => () => {
              n.current && (t((0, u.removePolarGraphicalItem)(n.current)), (n.current = null));
            },
            [t],
          ),
          null
        );
      });
    e.s(['SetCartesianGraphicalItem', 0, c, 'SetPolarGraphicalItem', 0, s], 76619);
  },
  62409,
  64650,
  11327,
  (e) => {
    'use strict';
    var t = e.i(61129),
      r = e.i(49294),
      n = e.i(75448);
    function i(e, t) {
      var r = Object.keys(e);
      if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(e);
        (t &&
          (n = n.filter(function (t) {
            return Object.getOwnPropertyDescriptor(e, t).enumerable;
          })),
          r.push.apply(r, n));
      }
      return r;
    }
    function a(e) {
      for (var t = 1; t < arguments.length; t++) {
        var r = null != arguments[t] ? arguments[t] : {};
        t % 2
          ? i(Object(r), !0).forEach(function (t) {
              var n, i, a;
              ((n = e),
                (i = t),
                (a = r[t]),
                (i = (function (e) {
                  var t = (function (e, t) {
                    if ('object' != typeof e || !e) return e;
                    var r = e[Symbol.toPrimitive];
                    if (void 0 !== r) {
                      var n = r.call(e, t || 'default');
                      if ('object' != typeof n) return n;
                      throw TypeError('@@toPrimitive must return a primitive value.');
                    }
                    return ('string' === t ? String : Number)(e);
                  })(e, 'string');
                  return 'symbol' == typeof t ? t : t + '';
                })(i)) in n
                  ? Object.defineProperty(n, i, {
                      value: a,
                      enumerable: !0,
                      configurable: !0,
                      writable: !0,
                    })
                  : (n[i] = a));
            })
          : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
            : i(Object(r)).forEach(function (t) {
                Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t));
              });
      }
      return e;
    }
    var o = (e, t) =>
        [Object.keys(e), Object.keys(t)].reduce((e, t) => e.filter((e) => t.includes(e))),
      l = (e, t) => Object.keys(t).reduce((r, n) => a(a({}, r), {}, { [n]: e(n, t[n]) }), {});
    function u(e, t) {
      var r = Object.keys(e);
      if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(e);
        (t &&
          (n = n.filter(function (t) {
            return Object.getOwnPropertyDescriptor(e, t).enumerable;
          })),
          r.push.apply(r, n));
      }
      return r;
    }
    function c(e) {
      for (var t = 1; t < arguments.length; t++) {
        var r = null != arguments[t] ? arguments[t] : {};
        t % 2
          ? u(Object(r), !0).forEach(function (t) {
              var n, i, a;
              ((n = e),
                (i = t),
                (a = r[t]),
                (i = (function (e) {
                  var t = (function (e, t) {
                    if ('object' != typeof e || !e) return e;
                    var r = e[Symbol.toPrimitive];
                    if (void 0 !== r) {
                      var n = r.call(e, t || 'default');
                      if ('object' != typeof n) return n;
                      throw TypeError('@@toPrimitive must return a primitive value.');
                    }
                    return ('string' === t ? String : Number)(e);
                  })(e, 'string');
                  return 'symbol' == typeof t ? t : t + '';
                })(i)) in n
                  ? Object.defineProperty(n, i, {
                      value: a,
                      enumerable: !0,
                      configurable: !0,
                      writable: !0,
                    })
                  : (n[i] = a));
            })
          : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
            : u(Object(r)).forEach(function (t) {
                Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t));
              });
      }
      return e;
    }
    e.s(
      [
        'getIntersectionKeys',
        0,
        o,
        'getTransitionVal',
        0,
        (e, t, r) =>
          e
            .map((e) =>
              ''
                .concat(
                  e.replace(/([A-Z])/g, (e) => '-'.concat(e.toLowerCase())),
                  ' ',
                )
                .concat(t, 'ms ')
                .concat(r),
            )
            .join(','),
        'mapObject',
        0,
        l,
      ],
      64650,
    );
    var s = (e, t, r) => e + (t - e) * r,
      f = (e) => {
        var { from: t, to: r } = e;
        return t !== r;
      },
      d = (e, t, r) => {
        var n = l((t, r) => {
          if (f(r)) {
            var [n, i] = e(r.from, r.to, r.velocity);
            return c(c({}, r), {}, { from: n, velocity: i });
          }
          return r;
        }, t);
        return r < 1
          ? l(
              (e, t) =>
                f(t) && null != n[e]
                  ? c(
                      c({}, t),
                      {},
                      { velocity: s(t.velocity, n[e].velocity, r), from: s(t.from, n[e].from, r) },
                    )
                  : t,
              t,
            )
          : d(e, n, r - 1);
      },
      p = (e, t) => [0, 3 * e, 3 * t - 6 * e, 3 * e - 3 * t + 1],
      h = (e, t) => e.map((e, r) => e * t ** r).reduce((e, t) => e + t),
      v = (e, t) => (r) => h(p(e, t), r),
      y = function () {
        for (var e = arguments.length, t = Array(e), r = 0; r < e; r++) t[r] = arguments[r];
        if (1 === t.length)
          switch (t[0]) {
            case 'linear':
              return [0, 0, 1, 1];
            case 'ease':
              return [0.25, 0.1, 0.25, 1];
            case 'ease-in':
              return [0.42, 0, 1, 1];
            case 'ease-out':
              return [0.42, 0, 0.58, 1];
            case 'ease-in-out':
              return [0, 0, 0.58, 1];
            default:
              var n = ((e) => {
                var t,
                  r = e.split('(');
                if (2 !== r.length || 'cubic-bezier' !== r[0]) return null;
                var n = null == (t = r[1]) || null == (t = t.split(')')[0]) ? void 0 : t.split(',');
                if (null == n || 4 !== n.length) return null;
                var i = n.map((e) => parseFloat(e));
                return [i[0], i[1], i[2], i[3]];
              })(t[0]);
              if (n) return n;
          }
        return 4 === t.length ? t : [0, 0, 1, 1];
      },
      g = function () {
        return ((e, t, r, n) => {
          var i = v(e, r),
            a = v(t, n),
            o = (t) =>
              h(
                [
                  ...p(e, r)
                    .map((e, t) => e * t)
                    .slice(1),
                  0,
                ],
                t,
              ),
            l = (e) => (e > 1 ? 1 : e < 0 ? 0 : e),
            u = (e) => {
              for (var t = e > 1 ? 1 : e, r = t, n = 0; n < 8; ++n) {
                var u = i(r) - t,
                  c = o(r);
                if (1e-4 > Math.abs(u - t) || c < 1e-4) break;
                r = l(r - u / c);
              }
              return a(r);
            };
          return ((u.isStepper = !1), u);
        })(...y(...arguments));
      },
      m = function () {
        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
          { stiff: t = 100, damping: r = 8, dt: n = 17 } = e,
          i = (e, i, a) => {
            var o = a + ((-(e - i) * t - a * r) * n) / 1e3,
              l = (a * n) / 1e3 + e;
            return 1e-4 > Math.abs(l - i) && 1e-4 > Math.abs(o) ? [i, 0] : [l, o];
          };
        return ((i.isStepper = !0), (i.dt = n), i);
      };
    class b {
      setTimeout(e) {
        var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0,
          r = performance.now(),
          n = null,
          i = (a) => {
            a - r >= t
              ? e(a)
              : 'function' == typeof requestAnimationFrame && (n = requestAnimationFrame(i));
          };
        return (
          (n = requestAnimationFrame(i)),
          () => {
            null != n && cancelAnimationFrame(n);
          }
        );
      }
    }
    var x = (0, t.createContext)(function () {
        var e, t, r, n, i;
        return (
          (e = new b()),
          (t = () => null),
          (r = !1),
          (n = null),
          (i = (a) => {
            if (!r) {
              if (Array.isArray(a)) {
                if (!a.length) return;
                var [o, ...l] = a;
                if ('number' == typeof o) {
                  n = e.setTimeout(i.bind(null, l), o);
                  return;
                }
                (i(o), (n = e.setTimeout(i.bind(null, l))));
                return;
              }
              ('string' == typeof a && t(a),
                'object' == typeof a && t(a),
                'function' == typeof a && a());
            }
          }),
          {
            stop: () => {
              r = !0;
            },
            start: (e) => {
              ((r = !1), n && (n(), (n = null)), i(e));
            },
            subscribe: (e) => (
              (t = e),
              () => {
                t = () => null;
              }
            ),
            getTimeoutController: () => e,
          }
        );
      }),
      w = e.i(85948);
    function O() {
      var [e, r] = (0, t.useState)(
        () =>
          !w.Global.isSsr &&
          !!window.matchMedia &&
          window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      );
      return (
        (0, t.useEffect)(() => {
          if (window.matchMedia) {
            var e = window.matchMedia('(prefers-reduced-motion: reduce)'),
              t = () => {
                r(e.matches);
              };
            return (
              e.addEventListener('change', t),
              () => {
                e.removeEventListener('change', t);
              }
            );
          }
        }, []),
        e
      );
    }
    e.s(['usePrefersReducedMotion', 0, O], 11327);
    var S = {
        begin: 0,
        duration: 1e3,
        easing: 'ease',
        isActive: !0,
        canBegin: !0,
        onAnimationEnd: () => {},
        onAnimationStart: () => {},
      },
      A = { t: 0 },
      P = { t: 1 };
    e.s(
      [
        'JavascriptAnimate',
        0,
        function (e) {
          var i,
            a,
            u,
            p = (0, n.resolveDefaultProps)(e, S),
            {
              isActive: h,
              canBegin: v,
              duration: y,
              easing: b,
              begin: _,
              onAnimationEnd: E,
              onAnimationStart: j,
              children: C,
            } = p,
            M = O(),
            k = 'auto' === h ? !w.Global.isSsr && !M : h,
            T =
              ((i = p.animationId),
              (a = p.animationManager),
              (u = (0, t.useContext)(x)),
              (0, t.useMemo)(() => (null != a ? a : u(i)), [i, a, u])),
            [D, N] = (0, t.useState)(k ? A : P),
            I = (0, t.useRef)(null);
          return (
            (0, t.useEffect)(() => {
              k || N(P);
            }, [k]),
            (0, t.useEffect)(() => {
              if (!k || !v) return r.noop;
              var e = ((e, t, r, n, i, a) => {
                var u,
                  p,
                  h,
                  v,
                  y,
                  g,
                  m,
                  b,
                  x = o(e, t);
                return null == r
                  ? () => (i(c(c({}, e), t)), () => {})
                  : !0 === r.isStepper
                    ? ((p = x.reduce(
                        (r, n) => c(c({}, r), {}, { [n]: { from: e[n], velocity: 0, to: t[n] } }),
                        {},
                      )),
                      (h = null),
                      (v = (n) => {
                        u || (u = n);
                        var o = (n - u) / r.dt;
                        ((p = d(r, p, o)),
                          i(
                            c(
                              c(c({}, e), t),
                              l((e, t) => t.from, p),
                            ),
                          ),
                          (u = n),
                          Object.values(p).filter(f).length && (h = a.setTimeout(v)));
                      }),
                      () => (
                        (h = a.setTimeout(v)),
                        () => {
                          var e;
                          null == (e = h) || e();
                        }
                      ))
                    : ((g = null),
                      (m = x.reduce((r, n) => {
                        var i = e[n],
                          a = t[n];
                        return null == i || null == a ? r : c(c({}, r), {}, { [n]: [i, a] });
                      }, {})),
                      (b = (o) => {
                        y || (y = o);
                        var u = (o - y) / n,
                          f = l((e, t) => s(...t, r(u)), m);
                        if ((i(c(c(c({}, e), t), f)), u < 1)) g = a.setTimeout(b);
                        else {
                          var d = l((e, t) => s(...t, r(1)), m);
                          i(c(c(c({}, e), t), d));
                        }
                      }),
                      () => (
                        (g = a.setTimeout(b)),
                        () => {
                          var e;
                          null == (e = g) || e();
                        }
                      ));
              })(
                A,
                P,
                ((e) => {
                  if ('string' == typeof e)
                    switch (e) {
                      case 'ease':
                      case 'ease-in-out':
                      case 'ease-out':
                      case 'ease-in':
                      case 'linear':
                        return g(e);
                      case 'spring':
                        return m();
                      default:
                        if ('cubic-bezier' === e.split('(')[0]) return g(e);
                    }
                  return 'function' == typeof e ? e : null;
                })(b),
                y,
                N,
                T.getTimeoutController(),
              );
              return (
                T.start([
                  j,
                  _,
                  () => {
                    I.current = e();
                  },
                  y,
                  E,
                ]),
                () => {
                  (T.stop(), I.current && I.current(), E());
                }
              );
            }, [k, v, y, b, _, j, E, T]),
            C(D.t)
          );
        },
      ],
      62409,
    );
  },
  5784,
  16277,
  (e) => {
    'use strict';
    var t = e.i(49294),
      r = e.i(83513),
      n = e.i(85948),
      i = function (e) {
        var { width: t, height: r } = e,
          n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0,
          i = ((((n % 180) + 180) % 180) * Math.PI) / 180,
          a = Math.atan(r / t);
        return Math.abs(i > a && i < Math.PI - a ? r / Math.sin(i) : t / Math.cos(i));
      };
    function a(e, t) {
      if (t < 1) return [];
      if (1 === t) return e;
      for (var r = [], n = 0; n < e.length; n += t) {
        var i = e[n];
        void 0 !== i && r.push(i);
      }
      return r;
    }
    function o(e, t, r, n, i) {
      if (e * t < e * n || e * t > e * i) return !1;
      var a = r();
      return e * (t - (e * a) / 2 - n) >= 0 && e * (t + (e * a) / 2 - i) <= 0;
    }
    function l(e, t) {
      var r = Object.keys(e);
      if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(e);
        (t &&
          (n = n.filter(function (t) {
            return Object.getOwnPropertyDescriptor(e, t).enumerable;
          })),
          r.push.apply(r, n));
      }
      return r;
    }
    function u(e) {
      for (var t = 1; t < arguments.length; t++) {
        var r = null != arguments[t] ? arguments[t] : {};
        t % 2
          ? l(Object(r), !0).forEach(function (t) {
              var n, i, a;
              ((n = e),
                (i = t),
                (a = r[t]),
                (i = (function (e) {
                  var t = (function (e, t) {
                    if ('object' != typeof e || !e) return e;
                    var r = e[Symbol.toPrimitive];
                    if (void 0 !== r) {
                      var n = r.call(e, t || 'default');
                      if ('object' != typeof n) return n;
                      throw TypeError('@@toPrimitive must return a primitive value.');
                    }
                    return ('string' === t ? String : Number)(e);
                  })(e, 'string');
                  return 'symbol' == typeof t ? t : t + '';
                })(i)) in n
                  ? Object.defineProperty(n, i, {
                      value: a,
                      enumerable: !0,
                      configurable: !0,
                      writable: !0,
                    })
                  : (n[i] = a));
            })
          : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
            : l(Object(r)).forEach(function (t) {
                Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t));
              });
      }
      return e;
    }
    (e.s(
      [
        'getTicks',
        0,
        function (e, l, c) {
          var s,
            {
              tick: f,
              ticks: d,
              viewBox: p,
              minTickGap: h,
              orientation: v,
              interval: y,
              tickFormatter: g,
              unit: m,
              angle: b,
            } = e;
          if (!d || !d.length || !f) return [];
          if ((0, t.isNumber)(y) || n.Global.isSsr)
            return null != (s = a(d, ((0, t.isNumber)(y) ? y : 0) + 1)) ? s : [];
          var x = 'top' === v || 'bottom' === v ? 'width' : 'height',
            w =
              m && 'width' === x
                ? (0, r.getStringSize)(m, { fontSize: l, letterSpacing: c })
                : { width: 0, height: 0 },
            O = (e, t) => {
              var n,
                a = 'function' == typeof g ? g(e.value, t) : e.value;
              return 'width' === x
                ? ((n = (0, r.getStringSize)(a, { fontSize: l, letterSpacing: c })),
                  i({ width: n.width + w.width, height: n.height + w.height }, b))
                : (0, r.getStringSize)(a, { fontSize: l, letterSpacing: c })[x];
            },
            S = d[0],
            A = d[1],
            P =
              d.length >= 2 && null != S && null != A
                ? (0, t.mathSign)(A.coordinate - S.coordinate)
                : 1,
            _ = (function (e, t, r) {
              var n = 'width' === r,
                { x: i, y: a, width: o, height: l } = e;
              return 1 === t
                ? { start: n ? i : a, end: n ? i + o : a + l }
                : { start: n ? i + o : a + l, end: n ? i : a };
            })(p, P, x);
          return 'equidistantPreserveStart' === y
            ? (function (e, t, r, n, i) {
                for (
                  var l, u = (n || []).slice(), { start: c, end: s } = t, f = 0, d = 1, p = c;
                  d <= u.length;
                )
                  if (
                    (l = (function () {
                      var t,
                        l = null == n ? void 0 : n[f];
                      if (void 0 === l) return { v: a(n, d) };
                      var u = f,
                        h = () => (void 0 === t && (t = r(l, u)), t),
                        v = l.coordinate,
                        y = 0 === f || o(e, v, h, p, s);
                      (y || ((f = 0), (p = c), (d += 1)),
                        y && ((p = v + e * (h() / 2 + i)), (f += d)));
                    })())
                  )
                    return l.v;
                return [];
              })(P, _, O, d, h)
            : 'equidistantPreserveEnd' === y
              ? (function (e, t, r, n, i) {
                  var a = (n || []).slice().length;
                  if (0 === a) return [];
                  for (var { start: l, end: u } = t, c = 1; c <= a; c++) {
                    for (
                      var s, f = (a - 1) % c, d = l, p = !0, h = f;
                      h < a &&
                      (0 ===
                        (s = (function () {
                          var t,
                            a = n[h];
                          if (null == a) return 0;
                          var l = h,
                            c = () => (void 0 === t && (t = r(a, l)), t),
                            s = a.coordinate,
                            v = h === f || o(e, s, c, d, u);
                          if (!v) return ((p = !1), 1);
                          v && (d = s + e * (c() / 2 + i));
                        })()) ||
                        1 !== s);
                      h += c
                    );
                    if (p) {
                      for (var v = [], y = f; y < a; y += c) {
                        var g = n[y];
                        null != g && v.push(g);
                      }
                      return v;
                    }
                  }
                  return [];
                })(P, _, O, d, h)
              : ('preserveStart' === y || 'preserveStartEnd' === y
                  ? (function (e, t, r, n, i, a) {
                      var l = (n || []).slice(),
                        c = l.length,
                        { start: s, end: f } = t;
                      if (a) {
                        var d = n[c - 1];
                        if (null != d) {
                          var p = r(d, c - 1),
                            h = e * (d.coordinate + (e * p) / 2 - f);
                          ((l[c - 1] = d =
                            u(
                              u({}, d),
                              {},
                              { tickCoord: h > 0 ? d.coordinate - h * e : d.coordinate },
                            )),
                            null != d.tickCoord &&
                              o(e, d.tickCoord, () => p, s, f) &&
                              ((f = d.tickCoord - e * (p / 2 + i)),
                              (l[c - 1] = u(u({}, d), {}, { isShow: !0 }))));
                        }
                      }
                      for (
                        var v = a ? c - 1 : c,
                          y = function (t) {
                            var n,
                              a = l[t];
                            if (null == a) return 1;
                            var c = a,
                              d = () => (void 0 === n && (n = r(a, t)), n);
                            if (0 === t) {
                              var p = e * (c.coordinate - (e * d()) / 2 - s);
                              l[t] = c = u(
                                u({}, c),
                                {},
                                { tickCoord: p < 0 ? c.coordinate - p * e : c.coordinate },
                              );
                            } else l[t] = c = u(u({}, c), {}, { tickCoord: c.coordinate });
                            null != c.tickCoord &&
                              o(e, c.tickCoord, d, s, f) &&
                              ((s = c.tickCoord + e * (d() / 2 + i)),
                              (l[t] = u(u({}, c), {}, { isShow: !0 })));
                          },
                          g = 0;
                        g < v;
                        g++
                      )
                        if (y(g)) continue;
                      return l;
                    })(P, _, O, d, h, 'preserveStartEnd' === y)
                  : (function (e, t, r, n, i) {
                      for (
                        var a = (n || []).slice(),
                          l = a.length,
                          { start: c } = t,
                          { end: s } = t,
                          f = function (t) {
                            var n,
                              f = a[t];
                            if (null == f) return 1;
                            var d = f,
                              p = () => (void 0 === n && (n = r(f, t)), n);
                            if (t === l - 1) {
                              var h = e * (d.coordinate + (e * p()) / 2 - s);
                              a[t] = d = u(
                                u({}, d),
                                {},
                                { tickCoord: h > 0 ? d.coordinate - h * e : d.coordinate },
                              );
                            } else a[t] = d = u(u({}, d), {}, { tickCoord: d.coordinate });
                            null != d.tickCoord &&
                              o(e, d.tickCoord, p, c, s) &&
                              ((s = d.tickCoord - e * (p() / 2 + i)),
                              (a[t] = u(u({}, d), {}, { isShow: !0 })));
                          },
                          d = l - 1;
                        d >= 0;
                        d--
                      )
                        if (f(d)) continue;
                      return a;
                    })(P, _, O, d, h)
                ).filter((e) => e.isShow);
        },
      ],
      5784,
    ),
      e.s(
        [
          'getCalculatedYAxisWidth',
          0,
          (e) => {
            var {
                ticks: t,
                label: r,
                labelGapWithTick: n = 5,
                tickSize: i = 0,
                tickMargin: a = 0,
              } = e,
              o = 0;
            if (t) {
              Array.from(t).forEach((e) => {
                if (e) {
                  var t = e.getBoundingClientRect();
                  t.width > o && (o = t.width);
                }
              });
              var l = r ? r.getBoundingClientRect().width : 0;
              return Math.round(o + (i + a) + l + (r ? n : 0));
            }
            return 0;
          },
        ],
        16277,
      ));
  },
  58324,
  (e) => {
    'use strict';
    e.s([
      'getClassNameFromUnknown',
      0,
      function (e) {
        return e && 'object' == typeof e && 'className' in e && 'string' == typeof e.className
          ? e.className
          : '';
      },
    ]);
  },
  72427,
  (e, t, r) => {
    'use strict';
    (Object.defineProperty(r, Symbol.toStringTag, { value: 'Module' }),
      (r.uniqBy = function (e, t) {
        let r = new Map();
        for (let n = 0; n < e.length; n++) {
          let i = e[n],
            a = t(i, n, e);
          r.has(a) || r.set(a, i);
        }
        return Array.from(r.values());
      }));
  },
  44931,
  (e, t, r) => {
    'use strict';
    (Object.defineProperty(r, Symbol.toStringTag, { value: 'Module' }),
      (r.ary = function (e, t) {
        return function (...r) {
          return e.apply(this, r.slice(0, t));
        };
      }));
  },
  29691,
  (e, t, r) => {
    'use strict';
    (Object.defineProperty(r, Symbol.toStringTag, { value: 'Module' }),
      (r.identity = function (e) {
        return e;
      }));
  },
  82813,
  (e, t, r) => {
    'use strict';
    (Object.defineProperty(r, Symbol.toStringTag, { value: 'Module' }),
      (r.isObjectLike = function (e) {
        return 'object' == typeof e && null !== e;
      }));
  },
  48357,
  (e, t, r) => {
    'use strict';
    Object.defineProperty(r, Symbol.toStringTag, { value: 'Module' });
    let n = e.r(78333),
      i = e.r(82813);
    r.isArrayLikeObject = function (e) {
      return i.isObjectLike(e) && n.isArrayLike(e);
    };
  },
  35423,
  (e, t, r) => {
    'use strict';
    Object.defineProperty(r, Symbol.toStringTag, { value: 'Module' });
    let n = e.r(88251);
    r.property = function (e) {
      return function (t) {
        return n.get(t, e);
      };
    };
  },
  71071,
  (e, t, r) => {
    'use strict';
    (Object.defineProperty(r, Symbol.toStringTag, { value: 'Module' }),
      (r.isPrimitive = function (e) {
        return null == e || ('object' != typeof e && 'function' != typeof e);
      }));
  },
  72041,
  (e, t, r) => {
    'use strict';
    Object.defineProperty(r, Symbol.toStringTag, { value: 'Module' });
    let n = e.r(85846),
      i = e.r(71071),
      a = e.r(94361);
    function o(e, t, r, c) {
      if (t === e) return !0;
      switch (typeof t) {
        case 'object':
          return (function (e, t, r, n) {
            if (null == t) return !0;
            if (Array.isArray(t)) return l(e, t, r, n);
            if (t instanceof Map) {
              var a = e,
                o = t,
                c = r,
                s = n;
              if (0 === o.size) return !0;
              if (!(a instanceof Map)) return !1;
              for (let [e, t] of o.entries()) if (!1 === c(a.get(e), t, e, a, o, s)) return !1;
              return !0;
            }
            if (t instanceof Set) return u(e, t, r, n);
            let f = Object.keys(t);
            if (null == e || i.isPrimitive(e)) return 0 === f.length;
            if (0 === f.length) return !0;
            if (n?.has(t)) return n.get(t) === e;
            n?.set(t, e);
            try {
              for (let a = 0; a < f.length; a++) {
                let o = f[a];
                if (
                  (!i.isPrimitive(e) && !(o in e)) ||
                  (void 0 === t[o] && void 0 !== e[o]) ||
                  (null === t[o] && null !== e[o]) ||
                  !r(e[o], t[o], o, e, t, n)
                )
                  return !1;
              }
              return !0;
            } finally {
              n?.delete(t);
            }
          })(e, t, r, c);
        case 'function':
          if (Object.keys(t).length > 0) return o(e, { ...t }, r, c);
          return a.isEqualsSameValueZero(e, t);
        default:
          if (!n.isObject(e)) return a.isEqualsSameValueZero(e, t);
          if ('string' == typeof t) return '' === t;
          return !0;
      }
    }
    function l(e, t, r, n) {
      if (0 === t.length) return !0;
      if (!Array.isArray(e)) return !1;
      let i = new Set();
      for (let a = 0; a < t.length; a++) {
        let o = t[a],
          l = !1;
        for (let u = 0; u < e.length; u++) {
          if (i.has(u)) continue;
          let c = e[u],
            s = !1;
          if ((r(c, o, a, e, t, n) && (s = !0), s)) {
            (i.add(u), (l = !0));
            break;
          }
        }
        if (!l) return !1;
      }
      return !0;
    }
    function u(e, t, r, n) {
      return 0 === t.size || (e instanceof Set && l([...e], [...t], r, n));
    }
    ((r.isMatchWith = function e(t, r, n) {
      return 'function' != typeof n
        ? e(t, r, () => void 0)
        : o(
            t,
            r,
            function e(t, r, i, a, l, u) {
              let c = n(t, r, i, a, l, u);
              return void 0 !== c ? !!c : o(t, r, e, u);
            },
            new Map(),
          );
    }),
      (r.isSetMatch = u));
  },
  36444,
  (e, t, r) => {
    'use strict';
    Object.defineProperty(r, Symbol.toStringTag, { value: 'Module' });
    let n = e.r(72041);
    r.isMatch = function (e, t) {
      return n.isMatchWith(e, t, () => void 0);
    };
  },
  54538,
  (e, t, r) => {
    'use strict';
    (Object.defineProperty(r, Symbol.toStringTag, { value: 'Module' }),
      (r.getSymbols = function (e) {
        return Object.getOwnPropertySymbols(e).filter((t) =>
          Object.prototype.propertyIsEnumerable.call(e, t),
        );
      }));
  },
  97941,
  (e, t, r) => {
    'use strict';
    (Object.defineProperty(r, Symbol.toStringTag, { value: 'Module' }),
      (r.getTag = function (e) {
        return null == e
          ? void 0 === e
            ? '[object Undefined]'
            : '[object Null]'
          : Object.prototype.toString.call(e);
      }));
  },
  19122,
  (e, t, r) => {
    'use strict';
    (Object.defineProperty(r, Symbol.toStringTag, { value: 'Module' }),
      (r.argumentsTag = '[object Arguments]'),
      (r.arrayBufferTag = '[object ArrayBuffer]'),
      (r.arrayTag = '[object Array]'),
      (r.bigInt64ArrayTag = '[object BigInt64Array]'),
      (r.bigUint64ArrayTag = '[object BigUint64Array]'),
      (r.booleanTag = '[object Boolean]'),
      (r.dataViewTag = '[object DataView]'),
      (r.dateTag = '[object Date]'),
      (r.errorTag = '[object Error]'),
      (r.float32ArrayTag = '[object Float32Array]'),
      (r.float64ArrayTag = '[object Float64Array]'),
      (r.functionTag = '[object Function]'),
      (r.int16ArrayTag = '[object Int16Array]'),
      (r.int32ArrayTag = '[object Int32Array]'),
      (r.int8ArrayTag = '[object Int8Array]'),
      (r.mapTag = '[object Map]'),
      (r.numberTag = '[object Number]'),
      (r.objectTag = '[object Object]'),
      (r.regexpTag = '[object RegExp]'),
      (r.setTag = '[object Set]'),
      (r.stringTag = '[object String]'),
      (r.symbolTag = '[object Symbol]'),
      (r.uint16ArrayTag = '[object Uint16Array]'),
      (r.uint32ArrayTag = '[object Uint32Array]'),
      (r.uint8ArrayTag = '[object Uint8Array]'),
      (r.uint8ClampedArrayTag = '[object Uint8ClampedArray]'));
  },
  39160,
  (e, t, r) => {
    'use strict';
    (Object.defineProperty(r, Symbol.toStringTag, { value: 'Module' }),
      (r.globalThis =
        ('object' == typeof globalThis && globalThis) ||
        ('object' == typeof window && window) ||
        ('object' == typeof self && self) ||
        e.g ||
        (function () {
          return this;
        })() ||
        Function('return this')()));
  },
  89339,
  (e, t, r) => {
    'use strict';
    Object.defineProperty(r, Symbol.toStringTag, { value: 'Module' });
    let n = e.r(39160);
    r.isBuffer = function (e) {
      return void 0 !== n.globalThis.Buffer && n.globalThis.Buffer.isBuffer(e);
    };
  },
  92,
  (e, t, r) => {
    'use strict';
    (Object.defineProperty(r, Symbol.toStringTag, { value: 'Module' }),
      (r.isTypedArray = function (e) {
        return ArrayBuffer.isView(e) && !(e instanceof DataView);
      }));
  },
  19715,
  (e, t, r) => {
    'use strict';
    Object.defineProperty(r, Symbol.toStringTag, { value: 'Module' });
    let n = e.r(54538),
      i = e.r(97941),
      a = e.r(19122),
      o = e.r(89339),
      l = e.r(71071),
      u = e.r(92);
    function c(e, t, r, n = new Map(), f) {
      let d = f?.(e, t, r, n);
      if (void 0 !== d) return d;
      if (l.isPrimitive(e)) return e;
      if (n.has(e)) return n.get(e);
      if (Array.isArray(e)) {
        let t = Array(e.length);
        n.set(e, t);
        for (let i = 0; i < e.length; i++) t[i] = c(e[i], i, r, n, f);
        return (
          Object.hasOwn(e, 'index') && (t.index = e.index),
          Object.hasOwn(e, 'input') && (t.input = e.input),
          t
        );
      }
      if (e instanceof Date) return new Date(e.getTime());
      if (e instanceof RegExp) {
        let t = new RegExp(e.source, e.flags);
        return ((t.lastIndex = e.lastIndex), t);
      }
      if (e instanceof Map) {
        let t = new Map();
        for (let [i, a] of (n.set(e, t), e)) t.set(i, c(a, i, r, n, f));
        return t;
      }
      if (e instanceof Set) {
        let t = new Set();
        for (let i of (n.set(e, t), e)) t.add(c(i, void 0, r, n, f));
        return t;
      }
      if (o.isBuffer(e)) return e.subarray();
      if (u.isTypedArray(e)) {
        let t = new (Object.getPrototypeOf(e).constructor)(e.length);
        n.set(e, t);
        for (let i = 0; i < e.length; i++) t[i] = c(e[i], i, r, n, f);
        return t;
      }
      if (
        e instanceof ArrayBuffer ||
        ('u' > typeof SharedArrayBuffer && e instanceof SharedArrayBuffer)
      )
        return e.slice(0);
      if (e instanceof DataView) {
        let t = new DataView(e.buffer.slice(0), e.byteOffset, e.byteLength);
        return (n.set(e, t), s(t, e, r, n, f), t);
      }
      if ('u' > typeof File && e instanceof File) {
        let t = new File([e], e.name, { type: e.type });
        return (n.set(e, t), s(t, e, r, n, f), t);
      }
      if ('u' > typeof Blob && e instanceof Blob) {
        let t = new Blob([e], { type: e.type });
        return (n.set(e, t), s(t, e, r, n, f), t);
      }
      if (e instanceof Error) {
        let t = structuredClone(e);
        return (
          n.set(e, t),
          (t.message = e.message),
          (t.name = e.name),
          (t.stack = e.stack),
          (t.cause = e.cause),
          (t.constructor = e.constructor),
          s(t, e, r, n, f),
          t
        );
      }
      if (e instanceof Boolean) {
        let t = new Boolean(e.valueOf());
        return (n.set(e, t), s(t, e, r, n, f), t);
      }
      if (e instanceof Number) {
        let t = new Number(e.valueOf());
        return (n.set(e, t), s(t, e, r, n, f), t);
      }
      if (e instanceof String) {
        let t = new String(e.valueOf());
        return (n.set(e, t), s(t, e, r, n, f), t);
      }
      if (
        'object' == typeof e &&
        (function (e) {
          switch (i.getTag(e)) {
            case a.argumentsTag:
            case a.arrayTag:
            case a.arrayBufferTag:
            case a.dataViewTag:
            case a.booleanTag:
            case a.dateTag:
            case a.float32ArrayTag:
            case a.float64ArrayTag:
            case a.int8ArrayTag:
            case a.int16ArrayTag:
            case a.int32ArrayTag:
            case a.mapTag:
            case a.numberTag:
            case a.objectTag:
            case a.regexpTag:
            case a.setTag:
            case a.stringTag:
            case a.symbolTag:
            case a.uint8ArrayTag:
            case a.uint8ClampedArrayTag:
            case a.uint16ArrayTag:
            case a.uint32ArrayTag:
              return !0;
            default:
              return !1;
          }
        })(e)
      ) {
        let t = Object.create(Object.getPrototypeOf(e));
        return (n.set(e, t), s(t, e, r, n, f), t);
      }
      return e;
    }
    function s(e, t, r = e, i, a) {
      let o = [...Object.keys(t), ...n.getSymbols(t)];
      for (let n = 0; n < o.length; n++) {
        let l = o[n],
          u = Object.getOwnPropertyDescriptor(e, l);
        (null == u || u.writable) && (e[l] = c(t[l], l, r, i, a));
      }
    }
    ((r.cloneDeepWith = function (e, t) {
      return c(e, void 0, e, new Map(), t);
    }),
      (r.cloneDeepWithImpl = c),
      (r.copyProperties = s));
  },
  2756,
  (e, t, r) => {
    'use strict';
    Object.defineProperty(r, Symbol.toStringTag, { value: 'Module' });
    let n = e.r(19715);
    r.cloneDeep = function (e) {
      return n.cloneDeepWithImpl(e, void 0, e, new Map(), void 0);
    };
  },
  7156,
  (e, t, r) => {
    'use strict';
    Object.defineProperty(r, Symbol.toStringTag, { value: 'Module' });
    let n = e.r(36444),
      i = e.r(2756);
    r.matches = function (e) {
      return ((e = i.cloneDeep(e)), (t) => n.isMatch(t, e));
    };
  },
  90263,
  (e, t, r) => {
    'use strict';
    Object.defineProperty(r, Symbol.toStringTag, { value: 'Module' });
    let n = e.r(19715),
      i = e.r(97941),
      a = e.r(19122);
    r.cloneDeepWith = function (e, t) {
      return n.cloneDeepWith(e, (r, o, l, u) => {
        let c = t?.(r, o, l, u);
        if (void 0 !== c) return c;
        if ('object' == typeof e) {
          if (i.getTag(e) === a.objectTag && 'function' != typeof e.constructor) {
            let t = {};
            return (u.set(e, t), n.copyProperties(t, e, l, u), t);
          }
          switch (Object.prototype.toString.call(e)) {
            case a.numberTag:
            case a.stringTag:
            case a.booleanTag: {
              let t = new e.constructor(e?.valueOf());
              return (n.copyProperties(t, e), t);
            }
            case a.argumentsTag: {
              let t = {};
              return (
                n.copyProperties(t, e),
                (t.length = e.length),
                (t[Symbol.iterator] = e[Symbol.iterator]),
                t
              );
            }
            default:
              return;
          }
        }
      });
    };
  },
  63517,
  (e, t, r) => {
    'use strict';
    Object.defineProperty(r, Symbol.toStringTag, { value: 'Module' });
    let n = e.r(90263);
    r.cloneDeep = function (e) {
      return n.cloneDeepWith(e);
    };
  },
  54150,
  (e, t, r) => {
    'use strict';
    Object.defineProperty(r, Symbol.toStringTag, { value: 'Module' });
    let n = e.r(97941);
    r.isArguments = function (e) {
      return null !== e && 'object' == typeof e && '[object Arguments]' === n.getTag(e);
    };
  },
  83752,
  (e, t, r) => {
    'use strict';
    Object.defineProperty(r, Symbol.toStringTag, { value: 'Module' });
    let n = e.r(95766),
      i = e.r(93083),
      a = e.r(54150),
      o = e.r(42138);
    r.has = function (e, t) {
      let r;
      if (
        0 ===
        (r = Array.isArray(t)
          ? t
          : 'string' == typeof t && n.isDeepKey(t) && e?.[t] == null
            ? o.toPath(t)
            : [t]).length
      )
        return !1;
      let l = e;
      for (let e = 0; e < r.length; e++) {
        let t = r[e];
        if (
          (null == l || !Object.hasOwn(l, t)) &&
          !((Array.isArray(l) || a.isArguments(l)) && i.isIndex(t) && t < l.length)
        )
          return !1;
        l = l[t];
      }
      return !0;
    };
  },
  59680,
  (e, t, r) => {
    'use strict';
    Object.defineProperty(r, Symbol.toStringTag, { value: 'Module' });
    let n = e.r(36444),
      i = e.r(83922),
      a = e.r(63517),
      o = e.r(88251),
      l = e.r(83752);
    r.matchesProperty = function (e, t) {
      switch (typeof e) {
        case 'object':
          Object.is(e?.valueOf(), -0) && (e = '-0');
          break;
        case 'number':
          e = i.toKey(e);
      }
      return (
        (t = a.cloneDeep(t)),
        function (r) {
          let i = o.get(r, e);
          return void 0 === i ? l.has(r, e) : void 0 === t ? void 0 === i : n.isMatch(i, t);
        }
      );
    };
  },
  39879,
  (e, t, r) => {
    'use strict';
    Object.defineProperty(r, Symbol.toStringTag, { value: 'Module' });
    let n = e.r(29691),
      i = e.r(35423),
      a = e.r(7156),
      o = e.r(59680);
    r.iteratee = function (e) {
      if (null == e) return n.identity;
      switch (typeof e) {
        case 'function':
          return e;
        case 'object':
          if (Array.isArray(e) && 2 === e.length) return o.matchesProperty(e[0], e[1]);
          return a.matches(e);
        case 'string':
        case 'symbol':
        case 'number':
          return i.property(e);
      }
    };
  },
  91326,
  (e, t, r) => {
    'use strict';
    Object.defineProperty(r, Symbol.toStringTag, { value: 'Module' });
    let n = e.r(72427),
      i = e.r(44931),
      a = e.r(29691),
      o = e.r(48357),
      l = e.r(39879);
    r.uniqBy = function (e, t = a.identity) {
      return o.isArrayLikeObject(e) ? n.uniqBy(Array.from(e), i.ary(l.iteratee(t), 1)) : [];
    };
  },
  37576,
  (e, t, r) => {
    t.exports = e.r(91326).uniqBy;
  },
  19834,
  29788,
  6855,
  56960,
  22989,
  57462,
  77116,
  61546,
  37738,
  (e) => {
    'use strict';
    var t = e.i(61129),
      r = e.i(94083),
      n = e.i(28539),
      i = e.i(91214),
      a = e.i(15202),
      o = e.i(44587),
      l = e.i(49294),
      u = e.i(68078),
      c = e.i(5784),
      s = e.i(75093),
      f = e.i(16277),
      d = e.i(75448),
      p = e.i(7848),
      h = e.i(95916),
      v = e.i(58324),
      y = e.i(61049),
      g = e.i(98733),
      m = ['axisLine', 'width', 'height', 'className', 'hide', 'ticks', 'axisType', 'axisId'];
    function b() {
      return (b = Object.assign.bind()).apply(null, arguments);
    }
    function x(e, t) {
      var r = Object.keys(e);
      if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(e);
        (t &&
          (n = n.filter(function (t) {
            return Object.getOwnPropertyDescriptor(e, t).enumerable;
          })),
          r.push.apply(r, n));
      }
      return r;
    }
    function w(e) {
      for (var t = 1; t < arguments.length; t++) {
        var r = null != arguments[t] ? arguments[t] : {};
        t % 2
          ? x(Object(r), !0).forEach(function (t) {
              var n, i, a;
              ((n = e),
                (i = t),
                (a = r[t]),
                (i = (function (e) {
                  var t = (function (e, t) {
                    if ('object' != typeof e || !e) return e;
                    var r = e[Symbol.toPrimitive];
                    if (void 0 !== r) {
                      var n = r.call(e, t || 'default');
                      if ('object' != typeof n) return n;
                      throw TypeError('@@toPrimitive must return a primitive value.');
                    }
                    return ('string' === t ? String : Number)(e);
                  })(e, 'string');
                  return 'symbol' == typeof t ? t : t + '';
                })(i)) in n
                  ? Object.defineProperty(n, i, {
                      value: a,
                      enumerable: !0,
                      configurable: !0,
                      writable: !0,
                    })
                  : (n[i] = a));
            })
          : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
            : x(Object(r)).forEach(function (t) {
                Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t));
              });
      }
      return e;
    }
    var O = {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      viewBox: { x: 0, y: 0, width: 0, height: 0 },
      orientation: 'bottom',
      ticks: [],
      stroke: '#666',
      tickLine: !0,
      axisLine: !0,
      tick: !0,
      mirror: !1,
      minTickGap: 5,
      tickSize: 6,
      tickMargin: 2,
      interval: 'preserveEnd',
      zIndex: h.DefaultZIndexes.axis,
    };
    function S(e) {
      var {
        x: i,
        y: a,
        width: o,
        height: l,
        orientation: u,
        mirror: c,
        axisLine: f,
        otherSvgProps: d,
      } = e;
      if (!f) return null;
      var p = w(w(w({}, d), (0, s.svgPropertiesNoEvents)(f)), {}, { fill: 'none' });
      if ('top' === u || 'bottom' === u) {
        var h = +(('top' === u && !c) || ('bottom' === u && c));
        p = w(w({}, p), {}, { x1: i, y1: a + h * l, x2: i + o, y2: a + h * l });
      } else {
        var v = +(('left' === u && !c) || ('right' === u && c));
        p = w(w({}, p), {}, { x1: i + v * o, y1: a, x2: i + v * o, y2: a + l });
      }
      return t.createElement(
        'line',
        b({}, p, {
          className: (0, r.clsx)('recharts-cartesian-axis-line', (0, n.default)(f, 'className')),
        }),
      );
    }
    function A(e) {
      var n,
        { option: i, tickProps: o, value: l } = e,
        u = (0, r.clsx)(o.className, 'recharts-cartesian-axis-tick-value');
      if (t.isValidElement(i)) n = t.cloneElement(i, w(w({}, o), {}, { className: u }));
      else if ('function' == typeof i) n = i(w(w({}, o), {}, { className: u }));
      else {
        var c = 'recharts-cartesian-axis-tick-value';
        ('boolean' != typeof i && (c = (0, r.clsx)(c, (0, v.getClassNameFromUnknown)(i))),
          (n = t.createElement(a.Text, b({}, o, { className: c }), l)));
      }
      return n;
    }
    function P(e) {
      var { ticks: r, axisType: n, axisId: i } = e,
        a = (0, g.useAppDispatch)();
      return (
        (0, t.useEffect)(() => {
          if (null == i || null == n) return l.noop;
          var e = r.map((e) => ({
            value: e.value,
            coordinate: e.coordinate,
            offset: e.offset,
            index: e.index,
          }));
          return (
            a((0, y.setRenderedTicks)({ ticks: e, axisId: i, axisType: n })),
            () => {
              a((0, y.removeRenderedTicks)({ axisId: i, axisType: n }));
            }
          );
        }, [a, r, i, n]),
        null
      );
    }
    var _ = (0, t.forwardRef)((e, o) => {
        var {
            ticks: f = [],
            tick: d,
            tickLine: v,
            stroke: y,
            tickFormatter: g,
            unit: m,
            padding: x,
            tickTextProps: O,
            orientation: S,
            mirror: _,
            x: E,
            y: j,
            width: C,
            height: M,
            tickSize: k,
            tickMargin: T,
            fontSize: D,
            letterSpacing: N,
            getTicksConfig: I,
            events: L,
            axisType: R,
            axisId: B,
          } = e,
          z = (0, c.getTicks)(w(w({}, I), {}, { ticks: f }), D, N),
          F = (0, s.svgPropertiesNoEvents)(I),
          U = (0, s.svgPropertiesNoEventsFromUnknown)(d),
          W = (0, a.isValidTextAnchor)(F.textAnchor)
            ? F.textAnchor
            : (function (e, t) {
                switch (e) {
                  case 'left':
                    return t ? 'start' : 'end';
                  case 'right':
                    return t ? 'end' : 'start';
                  default:
                    return 'middle';
                }
              })(S, _),
          $ = (function (e, t) {
            switch (e) {
              case 'left':
              case 'right':
                return 'middle';
              case 'top':
                return t ? 'start' : 'end';
              default:
                return t ? 'end' : 'start';
            }
          })(S, _),
          V = {};
        'object' == typeof v && (V = v);
        var K = w(w({}, F), {}, { fill: 'none' }, V),
          H = z.map((e) =>
            w(
              { entry: e },
              (function (e, t, r, n, i, a, o, u, c) {
                var s,
                  f,
                  d,
                  p,
                  h,
                  v,
                  y = u ? -1 : 1,
                  g = e.tickSize || o,
                  m = (0, l.isNumber)(e.tickCoord) ? e.tickCoord : e.coordinate;
                switch (a) {
                  case 'top':
                    ((s = f = e.coordinate), (v = (d = (p = r + !u * i) - y * g) - y * c), (h = m));
                    break;
                  case 'left':
                    ((d = p = e.coordinate), (h = (s = (f = t + !u * n) - y * g) - y * c), (v = m));
                    break;
                  case 'right':
                    ((d = p = e.coordinate), (h = (s = (f = t + u * n) + y * g) + y * c), (v = m));
                    break;
                  default:
                    ((s = f = e.coordinate), (v = (d = (p = r + u * i) + y * g) + y * c), (h = m));
                }
                return { line: { x1: s, y1: d, x2: f, y2: p }, tick: { x: h, y: v } };
              })(e, E, j, C, M, S, k, _, T),
            ),
          ),
          q = H.map((e) => {
            var { entry: a, line: o } = e;
            return t.createElement(
              i.Layer,
              {
                className: 'recharts-cartesian-axis-tick',
                key: 'tick-'.concat(a.value, '-').concat(a.coordinate, '-').concat(a.tickCoord),
              },
              v &&
                t.createElement(
                  'line',
                  b({}, K, o, {
                    className: (0, r.clsx)(
                      'recharts-cartesian-axis-tick-line',
                      (0, n.default)(v, 'className'),
                    ),
                  }),
                ),
            );
          }),
          Y = H.map((e, r) => {
            var n,
              a,
              { entry: o, tick: l } = e,
              c = w(
                w(
                  w(w({ verticalAnchor: $ }, F), {}, { textAnchor: W, stroke: 'none', fill: y }, l),
                  {},
                  {
                    index: r,
                    payload: o,
                    visibleTicksCount: z.length,
                    tickFormatter: g,
                    padding: x,
                  },
                  O,
                ),
                {},
                {
                  angle:
                    null != (n = null != (a = null == O ? void 0 : O.angle) ? a : F.angle) ? n : 0,
                },
              ),
              s = w(w({}, c), U);
            return t.createElement(
              i.Layer,
              b(
                {
                  className: 'recharts-cartesian-axis-tick-label',
                  key: 'tick-label-'
                    .concat(o.value, '-')
                    .concat(o.coordinate, '-')
                    .concat(o.tickCoord),
                },
                (0, u.adaptEventsOfChild)(L, o, r),
              ),
              d &&
                t.createElement(A, {
                  option: d,
                  tickProps: s,
                  value: ''
                    .concat('function' == typeof g ? g(o.value, r) : o.value)
                    .concat(m || ''),
                }),
            );
          });
        return t.createElement(
          'g',
          { className: 'recharts-cartesian-axis-ticks recharts-'.concat(R, '-ticks') },
          t.createElement(P, { ticks: z, axisId: B, axisType: R }),
          Y.length > 0 &&
            t.createElement(
              p.ZIndexLayer,
              { zIndex: h.DefaultZIndexes.label },
              t.createElement(
                'g',
                {
                  className: 'recharts-cartesian-axis-tick-labels recharts-'.concat(
                    R,
                    '-tick-labels',
                  ),
                  ref: o,
                },
                Y,
              ),
            ),
          q.length > 0 &&
            t.createElement(
              'g',
              {
                className: 'recharts-cartesian-axis-tick-lines recharts-'.concat(R, '-tick-lines'),
              },
              q,
            ),
        );
      }),
      E = (0, t.forwardRef)((e, n) => {
        var {
            axisLine: a,
            width: l,
            height: u,
            className: c,
            hide: d,
            ticks: h,
            axisType: v,
            axisId: y,
          } = e,
          g = (function (e, t) {
            if (null == e) return {};
            var r,
              n,
              i = (function (e, t) {
                if (null == e) return {};
                var r = {};
                for (var n in e)
                  if ({}.hasOwnProperty.call(e, n)) {
                    if (-1 !== t.indexOf(n)) continue;
                    r[n] = e[n];
                  }
                return r;
              })(e, t);
            if (Object.getOwnPropertySymbols) {
              var a = Object.getOwnPropertySymbols(e);
              for (n = 0; n < a.length; n++)
                ((r = a[n]),
                  -1 === t.indexOf(r) && {}.propertyIsEnumerable.call(e, r) && (i[r] = e[r]));
            }
            return i;
          })(e, m),
          [b, x] = (0, t.useState)(''),
          [w, O] = (0, t.useState)(''),
          A = (0, t.useRef)(null);
        (0, t.useImperativeHandle)(n, () => ({
          getCalculatedWidth: () => {
            var t;
            return (0, f.getCalculatedYAxisWidth)({
              ticks: A.current,
              label: null == (t = e.labelRef) ? void 0 : t.current,
              labelGapWithTick: 5,
              tickSize: e.tickSize,
              tickMargin: e.tickMargin,
            });
          },
        }));
        var P = (0, t.useCallback)(
          (e) => {
            if (e) {
              var t = e.getElementsByClassName('recharts-cartesian-axis-tick-value');
              A.current = t;
              var r = t[0];
              if (r) {
                var n = window.getComputedStyle(r),
                  i = n.fontSize,
                  a = n.letterSpacing;
                (i !== b || a !== w) && (x(i), O(a));
              }
            }
          },
          [b, w],
        );
        return d || (null != l && l <= 0) || (null != u && u <= 0)
          ? null
          : t.createElement(
              p.ZIndexLayer,
              { zIndex: e.zIndex },
              t.createElement(
                i.Layer,
                { className: (0, r.clsx)('recharts-cartesian-axis', c) },
                t.createElement(S, {
                  x: e.x,
                  y: e.y,
                  width: l,
                  height: u,
                  orientation: e.orientation,
                  mirror: e.mirror,
                  axisLine: a,
                  otherSvgProps: (0, s.svgPropertiesNoEvents)(e),
                }),
                t.createElement(_, {
                  ref: P,
                  axisType: v,
                  events: g,
                  fontSize: b,
                  getTicksConfig: e,
                  height: e.height,
                  letterSpacing: w,
                  mirror: e.mirror,
                  orientation: e.orientation,
                  padding: e.padding,
                  stroke: e.stroke,
                  tick: e.tick,
                  tickFormatter: e.tickFormatter,
                  tickLine: e.tickLine,
                  tickMargin: e.tickMargin,
                  tickSize: e.tickSize,
                  tickTextProps: e.tickTextProps,
                  ticks: h,
                  unit: e.unit,
                  width: e.width,
                  x: e.x,
                  y: e.y,
                  axisId: y,
                }),
                t.createElement(
                  o.CartesianLabelContextProvider,
                  {
                    x: e.x,
                    y: e.y,
                    width: e.width,
                    height: e.height,
                    lowerWidth: e.width,
                    upperWidth: e.width,
                  },
                  t.createElement(o.CartesianLabelFromLabelProp, {
                    label: e.label,
                    labelRef: e.labelRef,
                  }),
                  e.children,
                ),
              ),
            );
      }),
      j = t.forwardRef((e, r) => {
        var n = (0, d.resolveDefaultProps)(e, O);
        return t.createElement(E, b({}, n, { ref: r }));
      });
    ((j.displayName = 'CartesianAxis'),
      e.s(['CartesianAxis', 0, j, 'defaultCartesianAxisProps', 0, O], 29788));
    var C = e.i(45424),
      M = e.i(58644),
      k = e.i(57024),
      T = e.i(57632),
      D = e.i(97943),
      N = ['domain', 'range'],
      I = ['domain', 'range'];
    function L(e, t) {
      if (null == e) return {};
      var r,
        n,
        i = (function (e, t) {
          if (null == e) return {};
          var r = {};
          for (var n in e)
            if ({}.hasOwnProperty.call(e, n)) {
              if (-1 !== t.indexOf(n)) continue;
              r[n] = e[n];
            }
          return r;
        })(e, t);
      if (Object.getOwnPropertySymbols) {
        var a = Object.getOwnPropertySymbols(e);
        for (n = 0; n < a.length; n++)
          ((r = a[n]), -1 === t.indexOf(r) && {}.propertyIsEnumerable.call(e, r) && (i[r] = e[r]));
      }
      return i;
    }
    function R(e, t) {
      return (
        e === t ||
        (!!(Array.isArray(e) && 2 === e.length && Array.isArray(t)) &&
          2 === t.length &&
          e[0] === t[0] &&
          e[1] === t[1])
      );
    }
    function B(e, t) {
      if (e === t) return !0;
      var { domain: r, range: n } = e,
        i = L(e, N),
        { domain: a, range: o } = t,
        l = L(t, I);
      return !!R(r, a) && !!R(n, o) && (0, D.propsAreEqual)(i, l);
    }
    var z = e.i(77314),
      F = e.i(96288),
      U = ['type'],
      W = ['dangerouslySetInnerHTML', 'ticks', 'scale'],
      $ = ['id', 'scale'];
    function V() {
      return (V = Object.assign.bind()).apply(null, arguments);
    }
    function K(e, t) {
      var r = Object.keys(e);
      if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(e);
        (t &&
          (n = n.filter(function (t) {
            return Object.getOwnPropertyDescriptor(e, t).enumerable;
          })),
          r.push.apply(r, n));
      }
      return r;
    }
    function H(e) {
      for (var t = 1; t < arguments.length; t++) {
        var r = null != arguments[t] ? arguments[t] : {};
        t % 2
          ? K(Object(r), !0).forEach(function (t) {
              var n, i, a;
              ((n = e),
                (i = t),
                (a = r[t]),
                (i = (function (e) {
                  var t = (function (e, t) {
                    if ('object' != typeof e || !e) return e;
                    var r = e[Symbol.toPrimitive];
                    if (void 0 !== r) {
                      var n = r.call(e, t || 'default');
                      if ('object' != typeof n) return n;
                      throw TypeError('@@toPrimitive must return a primitive value.');
                    }
                    return ('string' === t ? String : Number)(e);
                  })(e, 'string');
                  return 'symbol' == typeof t ? t : t + '';
                })(i)) in n
                  ? Object.defineProperty(n, i, {
                      value: a,
                      enumerable: !0,
                      configurable: !0,
                      writable: !0,
                    })
                  : (n[i] = a));
            })
          : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
            : K(Object(r)).forEach(function (t) {
                Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t));
              });
      }
      return e;
    }
    function q(e, t) {
      if (null == e) return {};
      var r,
        n,
        i = (function (e, t) {
          if (null == e) return {};
          var r = {};
          for (var n in e)
            if ({}.hasOwnProperty.call(e, n)) {
              if (-1 !== t.indexOf(n)) continue;
              r[n] = e[n];
            }
          return r;
        })(e, t);
      if (Object.getOwnPropertySymbols) {
        var a = Object.getOwnPropertySymbols(e);
        for (n = 0; n < a.length; n++)
          ((r = a[n]), -1 === t.indexOf(r) && {}.propertyIsEnumerable.call(e, r) && (i[r] = e[r]));
      }
      return i;
    }
    function Y(e) {
      var r = (0, g.useAppDispatch)(),
        n = (0, t.useRef)(null),
        i = (0, z.useCartesianChartLayout)(),
        { type: a } = e,
        o = q(e, U),
        l = (0, F.getAxisTypeBasedOnLayout)(i, 'xAxis', a),
        u = (0, t.useMemo)(() => {
          if (null != l) return H(H({}, o), {}, { type: l });
        }, [o, l]);
      return (
        (0, t.useLayoutEffect)(() => {
          null != u &&
            (null === n.current
              ? r((0, C.addXAxis)(u))
              : n.current !== u && r((0, C.replaceXAxis)({ prev: n.current, next: u })),
            (n.current = u));
        }, [u, r]),
        (0, t.useLayoutEffect)(
          () => () => {
            n.current && (r((0, C.removeXAxis)(n.current)), (n.current = null));
          },
          [r],
        ),
        null
      );
    }
    var X = (e) => {
        var { xAxisId: n, className: i } = e,
          a = (0, g.useAppSelector)(k.selectAxisViewBox),
          o = (0, T.useIsPanorama)(),
          l = 'xAxis',
          u = (0, g.useAppSelector)((e) => (0, M.selectTicksOfAxis)(e, l, n, o)),
          c = (0, g.useAppSelector)((e) => (0, M.selectXAxisSize)(e, n)),
          s = (0, g.useAppSelector)((e) => (0, M.selectXAxisPosition)(e, n)),
          f = (0, g.useAppSelector)((e) => (0, M.selectXAxisSettingsNoDefaults)(e, n));
        if (null == c || null == s || null == f) return null;
        var { dangerouslySetInnerHTML: d, ticks: p, scale: h } = e,
          v = q(e, W),
          { id: y, scale: m } = f,
          b = q(f, $);
        return t.createElement(
          j,
          V({}, v, b, {
            x: s.x,
            y: s.y,
            width: c.width,
            height: c.height,
            className: (0, r.clsx)('recharts-'.concat(l, ' ').concat(l), i),
            viewBox: a,
            ticks: u,
            axisType: l,
            axisId: n,
          }),
        );
      },
      G = {
        allowDataOverflow: M.implicitXAxis.allowDataOverflow,
        allowDecimals: M.implicitXAxis.allowDecimals,
        allowDuplicatedCategory: M.implicitXAxis.allowDuplicatedCategory,
        angle: M.implicitXAxis.angle,
        axisLine: O.axisLine,
        height: M.implicitXAxis.height,
        hide: !1,
        includeHidden: M.implicitXAxis.includeHidden,
        interval: M.implicitXAxis.interval,
        label: !1,
        minTickGap: M.implicitXAxis.minTickGap,
        mirror: M.implicitXAxis.mirror,
        orientation: M.implicitXAxis.orientation,
        padding: M.implicitXAxis.padding,
        reversed: M.implicitXAxis.reversed,
        scale: M.implicitXAxis.scale,
        tick: M.implicitXAxis.tick,
        tickCount: M.implicitXAxis.tickCount,
        tickLine: O.tickLine,
        tickSize: O.tickSize,
        type: M.implicitXAxis.type,
        niceTicks: M.implicitXAxis.niceTicks,
        xAxisId: 0,
      },
      Z = t.memo((e) => {
        var r = (0, d.resolveDefaultProps)(e, G);
        return t.createElement(
          t.Fragment,
          null,
          t.createElement(Y, {
            allowDataOverflow: r.allowDataOverflow,
            allowDecimals: r.allowDecimals,
            allowDuplicatedCategory: r.allowDuplicatedCategory,
            angle: r.angle,
            dataKey: r.dataKey,
            domain: r.domain,
            height: r.height,
            hide: r.hide,
            id: r.xAxisId,
            includeHidden: r.includeHidden,
            interval: r.interval,
            minTickGap: r.minTickGap,
            mirror: r.mirror,
            name: r.name,
            orientation: r.orientation,
            padding: r.padding,
            reversed: r.reversed,
            scale: r.scale,
            tick: r.tick,
            tickCount: r.tickCount,
            tickFormatter: r.tickFormatter,
            ticks: r.ticks,
            type: r.type,
            unit: r.unit,
            niceTicks: r.niceTicks,
          }),
          t.createElement(X, r),
        );
      }, B);
    ((Z.displayName = 'XAxis'), e.s(['XAxis', 0, Z], 19834));
    var Q = ['type'],
      J = ['dangerouslySetInnerHTML', 'ticks', 'scale'],
      ee = ['id', 'scale'];
    function et() {
      return (et = Object.assign.bind()).apply(null, arguments);
    }
    function er(e, t) {
      var r = Object.keys(e);
      if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(e);
        (t &&
          (n = n.filter(function (t) {
            return Object.getOwnPropertyDescriptor(e, t).enumerable;
          })),
          r.push.apply(r, n));
      }
      return r;
    }
    function en(e) {
      for (var t = 1; t < arguments.length; t++) {
        var r = null != arguments[t] ? arguments[t] : {};
        t % 2
          ? er(Object(r), !0).forEach(function (t) {
              var n, i, a;
              ((n = e),
                (i = t),
                (a = r[t]),
                (i = (function (e) {
                  var t = (function (e, t) {
                    if ('object' != typeof e || !e) return e;
                    var r = e[Symbol.toPrimitive];
                    if (void 0 !== r) {
                      var n = r.call(e, t || 'default');
                      if ('object' != typeof n) return n;
                      throw TypeError('@@toPrimitive must return a primitive value.');
                    }
                    return ('string' === t ? String : Number)(e);
                  })(e, 'string');
                  return 'symbol' == typeof t ? t : t + '';
                })(i)) in n
                  ? Object.defineProperty(n, i, {
                      value: a,
                      enumerable: !0,
                      configurable: !0,
                      writable: !0,
                    })
                  : (n[i] = a));
            })
          : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
            : er(Object(r)).forEach(function (t) {
                Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t));
              });
      }
      return e;
    }
    function ei(e, t) {
      if (null == e) return {};
      var r,
        n,
        i = (function (e, t) {
          if (null == e) return {};
          var r = {};
          for (var n in e)
            if ({}.hasOwnProperty.call(e, n)) {
              if (-1 !== t.indexOf(n)) continue;
              r[n] = e[n];
            }
          return r;
        })(e, t);
      if (Object.getOwnPropertySymbols) {
        var a = Object.getOwnPropertySymbols(e);
        for (n = 0; n < a.length; n++)
          ((r = a[n]), -1 === t.indexOf(r) && {}.propertyIsEnumerable.call(e, r) && (i[r] = e[r]));
      }
      return i;
    }
    function ea(e) {
      var r = (0, g.useAppDispatch)(),
        n = (0, t.useRef)(null),
        i = (0, z.useCartesianChartLayout)(),
        { type: a } = e,
        o = ei(e, Q),
        l = (0, F.getAxisTypeBasedOnLayout)(i, 'yAxis', a),
        u = (0, t.useMemo)(() => {
          if (null != l) return en(en({}, o), {}, { type: l });
        }, [l, o]);
      return (
        (0, t.useLayoutEffect)(() => {
          null != u &&
            (null === n.current
              ? r((0, C.addYAxis)(u))
              : n.current !== u && r((0, C.replaceYAxis)({ prev: n.current, next: u })),
            (n.current = u));
        }, [u, r]),
        (0, t.useLayoutEffect)(
          () => () => {
            n.current && (r((0, C.removeYAxis)(n.current)), (n.current = null));
          },
          [r],
        ),
        null
      );
    }
    function eo(e) {
      var { yAxisId: n, className: i, width: a, label: l } = e,
        u = (0, t.useRef)(null),
        c = (0, t.useRef)(null),
        s = (0, g.useAppSelector)(k.selectAxisViewBox),
        f = (0, T.useIsPanorama)(),
        d = (0, g.useAppDispatch)(),
        p = 'yAxis',
        h = (0, g.useAppSelector)((e) => (0, M.selectYAxisSize)(e, n)),
        v = (0, g.useAppSelector)((e) => (0, M.selectYAxisPosition)(e, n)),
        y = (0, g.useAppSelector)((e) => (0, M.selectTicksOfAxis)(e, p, n, f)),
        m = (0, g.useAppSelector)((e) => (0, M.selectYAxisSettingsNoDefaults)(e, n));
      if (
        ((0, t.useLayoutEffect)(() => {
          if (
            !(
              'auto' !== a ||
              !h ||
              (0, o.isLabelContentAFunction)(l) ||
              (0, t.isValidElement)(l)
            ) &&
            null != m
          ) {
            var e = u.current;
            if (e) {
              var r = e.getCalculatedWidth();
              Math.round(h.width) !== Math.round(r) &&
                d((0, C.updateYAxisWidth)({ id: n, width: r }));
            }
          }
        }, [y, h, d, l, n, a, m]),
        null == h || null == v || null == m)
      )
        return null;
      var { dangerouslySetInnerHTML: b, ticks: x, scale: w } = e,
        O = ei(e, J),
        { id: S, scale: A } = m,
        P = ei(m, ee);
      return t.createElement(
        j,
        et({}, O, P, {
          ref: u,
          labelRef: c,
          x: v.x,
          y: v.y,
          tickTextProps: 'auto' === a ? { width: void 0 } : { width: a },
          width: h.width,
          height: h.height,
          className: (0, r.clsx)('recharts-'.concat(p, ' ').concat(p), i),
          viewBox: s,
          ticks: y,
          axisType: p,
          axisId: n,
        }),
      );
    }
    var el = {
        allowDataOverflow: M.implicitYAxis.allowDataOverflow,
        allowDecimals: M.implicitYAxis.allowDecimals,
        allowDuplicatedCategory: M.implicitYAxis.allowDuplicatedCategory,
        angle: M.implicitYAxis.angle,
        axisLine: O.axisLine,
        hide: !1,
        includeHidden: M.implicitYAxis.includeHidden,
        interval: M.implicitYAxis.interval,
        label: !1,
        minTickGap: M.implicitYAxis.minTickGap,
        mirror: M.implicitYAxis.mirror,
        orientation: M.implicitYAxis.orientation,
        padding: M.implicitYAxis.padding,
        reversed: M.implicitYAxis.reversed,
        scale: M.implicitYAxis.scale,
        tick: M.implicitYAxis.tick,
        tickCount: M.implicitYAxis.tickCount,
        tickLine: O.tickLine,
        tickSize: O.tickSize,
        type: M.implicitYAxis.type,
        niceTicks: M.implicitYAxis.niceTicks,
        width: M.implicitYAxis.width,
        yAxisId: 0,
      },
      eu = t.memo((e) => {
        var r = (0, d.resolveDefaultProps)(e, el);
        return t.createElement(
          t.Fragment,
          null,
          t.createElement(ea, {
            interval: r.interval,
            id: r.yAxisId,
            scale: r.scale,
            type: r.type,
            domain: r.domain,
            allowDataOverflow: r.allowDataOverflow,
            dataKey: r.dataKey,
            allowDuplicatedCategory: r.allowDuplicatedCategory,
            allowDecimals: r.allowDecimals,
            tickCount: r.tickCount,
            padding: r.padding,
            includeHidden: r.includeHidden,
            reversed: r.reversed,
            ticks: r.ticks,
            width: r.width,
            orientation: r.orientation,
            mirror: r.mirror,
            hide: r.hide,
            unit: r.unit,
            name: r.name,
            angle: r.angle,
            minTickGap: r.minTickGap,
            tick: r.tick,
            tickFormatter: r.tickFormatter,
            niceTicks: r.niceTicks,
          }),
          t.createElement(eo, r),
        );
      }, B);
    ((eu.displayName = 'YAxis'), e.s(['YAxis', 0, eu], 6855));
    var ec = e.i(10511);
    function es() {
      return (es = Object.assign.bind()).apply(null, arguments);
    }
    function ef(e, t) {
      var r = Object.keys(e);
      if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(e);
        (t &&
          (n = n.filter(function (t) {
            return Object.getOwnPropertyDescriptor(e, t).enumerable;
          })),
          r.push.apply(r, n));
      }
      return r;
    }
    function ed(e) {
      for (var t = 1; t < arguments.length; t++) {
        var r = null != arguments[t] ? arguments[t] : {};
        t % 2
          ? ef(Object(r), !0).forEach(function (t) {
              var n, i, a;
              ((n = e),
                (i = t),
                (a = r[t]),
                (i = (function (e) {
                  var t = (function (e, t) {
                    if ('object' != typeof e || !e) return e;
                    var r = e[Symbol.toPrimitive];
                    if (void 0 !== r) {
                      var n = r.call(e, t || 'default');
                      if ('object' != typeof n) return n;
                      throw TypeError('@@toPrimitive must return a primitive value.');
                    }
                    return ('string' === t ? String : Number)(e);
                  })(e, 'string');
                  return 'symbol' == typeof t ? t : t + '';
                })(i)) in n
                  ? Object.defineProperty(n, i, {
                      value: a,
                      enumerable: !0,
                      configurable: !0,
                      writable: !0,
                    })
                  : (n[i] = a));
            })
          : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
            : ef(Object(r)).forEach(function (t) {
                Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t));
              });
      }
      return e;
    }
    function ep(e) {
      return Array.isArray(e) && (0, l.isNumOrStr)(e[0]) && (0, l.isNumOrStr)(e[1])
        ? e.join(' ~ ')
        : e;
    }
    var eh = {
        margin: 0,
        padding: 10,
        backgroundColor: '#fff',
        border: '1px solid #ccc',
        whiteSpace: 'nowrap',
      },
      ev = { display: 'block', paddingTop: 4, paddingBottom: 4, color: '#000' },
      ey = {};
    e.s(
      [
        'DefaultTooltipContent',
        0,
        (e) => {
          var {
              separator: n = ' : ',
              contentStyle: i,
              itemStyle: a,
              labelStyle: o = ey,
              payload: u,
              formatter: c,
              itemSorter: s,
              wrapperClassName: f,
              labelClassName: d,
              label: p,
              labelFormatter: h,
              accessibilityLayer: v = !1,
            } = e,
            y = ed(ed({}, eh), i),
            g = ed({ margin: 0 }, o),
            m = !(0, l.isNullish)(p),
            b = m ? p : '',
            x = (0, r.clsx)('recharts-default-tooltip', f),
            w = (0, r.clsx)('recharts-tooltip-label', d);
          return (
            m && h && null != u && (b = h(p, u)),
            t.createElement(
              'div',
              es({ className: x, style: y }, v ? { role: 'status', 'aria-live': 'assertive' } : {}),
              t.createElement(
                'p',
                { className: w, style: g },
                t.isValidElement(b) ? b : ''.concat(b),
              ),
              (() => {
                if (u && u.length) {
                  var e = (null == s ? u : (0, ec.default)(u, s)).map((e, r) => {
                    if (!e || 'none' === e.type) return null;
                    var i = e.formatter || c || ep,
                      { value: o, name: s } = e,
                      f = o,
                      d = s,
                      p = i(o, s, e, r, u);
                    if (Array.isArray(p)) [f, d] = p;
                    else {
                      if (null == p) return null;
                      f = p;
                    }
                    var h = ed(ed({}, ev), {}, { color: e.color || ev.color }, a);
                    return t.createElement(
                      'li',
                      {
                        className: 'recharts-tooltip-item',
                        key: 'tooltip-item-'.concat(r),
                        style: h,
                      },
                      (0, l.isNumOrStr)(d)
                        ? t.createElement('span', { className: 'recharts-tooltip-item-name' }, d)
                        : null,
                      (0, l.isNumOrStr)(d)
                        ? t.createElement(
                            'span',
                            { className: 'recharts-tooltip-item-separator' },
                            n,
                          )
                        : null,
                      t.createElement('span', { className: 'recharts-tooltip-item-value' }, f),
                      t.createElement(
                        'span',
                        { className: 'recharts-tooltip-item-unit' },
                        e.unit || '',
                      ),
                    );
                  });
                  return t.createElement(
                    'ul',
                    { className: 'recharts-tooltip-item-list', style: { padding: 0, margin: 0 } },
                    e,
                  );
                }
                return null;
              })(),
            )
          );
        },
      ],
      56960,
    );
    var eg = 'recharts-tooltip-wrapper',
      em = { visibility: 'hidden' };
    function eb(e) {
      var {
        allowEscapeViewBox: t,
        coordinate: r,
        key: n,
        offset: i,
        position: a,
        reverseDirection: o,
        tooltipDimension: u,
        viewBox: c,
        viewBoxDimension: s,
      } = e;
      if (a && (0, l.isNumber)(a[n])) return a[n];
      var f = r[n] - u - (i > 0 ? i : 0),
        d = r[n] + i;
      if (t[n]) return o[n] ? f : d;
      var p = c[n];
      return null == p
        ? 0
        : o[n]
          ? f < p
            ? Math.max(d, p)
            : Math.max(f, p)
          : null == s
            ? 0
            : d + u > p + s
              ? Math.max(f, p)
              : Math.max(d, p);
    }
    var ex = e.i(11327);
    function ew(e, t) {
      var r = Object.keys(e);
      if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(e);
        (t &&
          (n = n.filter(function (t) {
            return Object.getOwnPropertyDescriptor(e, t).enumerable;
          })),
          r.push.apply(r, n));
      }
      return r;
    }
    function eO(e) {
      for (var t = 1; t < arguments.length; t++) {
        var r = null != arguments[t] ? arguments[t] : {};
        t % 2
          ? ew(Object(r), !0).forEach(function (t) {
              var n, i, a;
              ((n = e),
                (i = t),
                (a = r[t]),
                (i = (function (e) {
                  var t = (function (e, t) {
                    if ('object' != typeof e || !e) return e;
                    var r = e[Symbol.toPrimitive];
                    if (void 0 !== r) {
                      var n = r.call(e, t || 'default');
                      if ('object' != typeof n) return n;
                      throw TypeError('@@toPrimitive must return a primitive value.');
                    }
                    return ('string' === t ? String : Number)(e);
                  })(e, 'string');
                  return 'symbol' == typeof t ? t : t + '';
                })(i)) in n
                  ? Object.defineProperty(n, i, {
                      value: a,
                      enumerable: !0,
                      configurable: !0,
                      writable: !0,
                    })
                  : (n[i] = a));
            })
          : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
            : ew(Object(r)).forEach(function (t) {
                Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t));
              });
      }
      return e;
    }
    var eS = t.memo(function (e) {
      var n,
        i,
        a,
        o,
        u,
        c,
        s = (0, ex.usePrefersReducedMotion)(),
        [f, d] = t.useState(() => ({ dismissed: !1, dismissedAtCoordinate: { x: 0, y: 0 } }));
      (t.useEffect(() => {
        var t = (t) => {
          if ('Escape' === t.key) {
            var r, n, i, a;
            d({
              dismissed: !0,
              dismissedAtCoordinate: {
                x: null != (r = null == (n = e.coordinate) ? void 0 : n.x) ? r : 0,
                y: null != (i = null == (a = e.coordinate) ? void 0 : a.y) ? i : 0,
              },
            });
          }
        };
        return (
          document.addEventListener('keydown', t),
          () => {
            document.removeEventListener('keydown', t);
          }
        );
      }, [null == (n = e.coordinate) ? void 0 : n.x, null == (i = e.coordinate) ? void 0 : i.y]),
        f.dismissed &&
          ((null != (a = null == (o = e.coordinate) ? void 0 : o.x) ? a : 0) !==
            f.dismissedAtCoordinate.x ||
            (null != (u = null == (c = e.coordinate) ? void 0 : c.y) ? u : 0) !==
              f.dismissedAtCoordinate.y) &&
          d(eO(eO({}, f), {}, { dismissed: !1 })));
      var { cssClasses: p, cssProperties: h } = (function (e) {
          var t,
            n,
            i,
            {
              allowEscapeViewBox: a,
              coordinate: o,
              offsetTop: u,
              offsetLeft: c,
              position: s,
              reverseDirection: f,
              tooltipBox: d,
              useTranslate3d: p,
              viewBox: h,
            } = e;
          return {
            cssProperties: (t =
              d.height > 0 && d.width > 0 && o
                ? (function (e) {
                    var { translateX: t, translateY: r, useTranslate3d: n } = e;
                    return {
                      transform: n
                        ? 'translate3d('.concat(t, 'px, ').concat(r, 'px, 0)')
                        : 'translate('.concat(t, 'px, ').concat(r, 'px)'),
                    };
                  })({
                    translateX: (n = eb({
                      allowEscapeViewBox: a,
                      coordinate: o,
                      key: 'x',
                      offset: c,
                      position: s,
                      reverseDirection: f,
                      tooltipDimension: d.width,
                      viewBox: h,
                      viewBoxDimension: h.width,
                    })),
                    translateY: (i = eb({
                      allowEscapeViewBox: a,
                      coordinate: o,
                      key: 'y',
                      offset: u,
                      position: s,
                      reverseDirection: f,
                      tooltipDimension: d.height,
                      viewBox: h,
                      viewBoxDimension: h.height,
                    })),
                    useTranslate3d: p,
                  })
                : em),
            cssClasses: (function (e) {
              var { coordinate: t, translateX: n, translateY: i } = e;
              return (0, r.clsx)(eg, {
                [''.concat(eg, '-right')]:
                  (0, l.isNumber)(n) && t && (0, l.isNumber)(t.x) && n >= t.x,
                [''.concat(eg, '-left')]:
                  (0, l.isNumber)(n) && t && (0, l.isNumber)(t.x) && n < t.x,
                [''.concat(eg, '-bottom')]:
                  (0, l.isNumber)(i) && t && (0, l.isNumber)(t.y) && i >= t.y,
                [''.concat(eg, '-top')]: (0, l.isNumber)(i) && t && (0, l.isNumber)(t.y) && i < t.y,
              });
            })({ translateX: n, translateY: i, coordinate: o }),
          };
        })({
          allowEscapeViewBox: e.allowEscapeViewBox,
          coordinate: e.coordinate,
          offsetLeft: 'number' == typeof e.offset ? e.offset : e.offset.x,
          offsetTop: 'number' == typeof e.offset ? e.offset : e.offset.y,
          position: e.position,
          reverseDirection: e.reverseDirection,
          tooltipBox: { height: e.lastBoundingBox.height, width: e.lastBoundingBox.width },
          useTranslate3d: e.useTranslate3d,
          viewBox: e.viewBox,
        }),
        v = e.hasPortalFromProps
          ? {}
          : eO(
              eO(
                {
                  transition: (function (e) {
                    if (
                      (!e.prefersReducedMotion || 'auto' !== e.isAnimationActive) &&
                      e.isAnimationActive &&
                      e.active
                    )
                      return 'transform '
                        .concat(e.animationDuration, 'ms ')
                        .concat(e.animationEasing);
                  })({
                    prefersReducedMotion: s,
                    isAnimationActive: e.isAnimationActive,
                    active: e.active,
                    animationDuration: e.animationDuration,
                    animationEasing: e.animationEasing,
                  }),
                },
                h,
              ),
              {},
              { pointerEvents: 'none', position: 'absolute', top: 0, left: 0 },
            ),
        y = eO(
          eO({}, v),
          {},
          { visibility: !f.dismissed && e.active && e.hasPayload ? 'visible' : 'hidden' },
          e.wrapperStyle,
        );
      return t.createElement(
        'div',
        {
          xmlns: 'http://www.w3.org/1999/xhtml',
          tabIndex: -1,
          className: p,
          style: y,
          ref: e.innerRef,
        },
        e.children,
      );
    });
    e.s(['TooltipBoundingBox', 0, eS], 22989);
    var eA = e.i(37576);
    (e.s(
      [
        'getUniqPayload',
        0,
        function (e, t, r) {
          return !0 === t
            ? (0, eA.default)(e, r)
            : 'function' == typeof t
              ? (0, eA.default)(e, t)
              : e;
        },
      ],
      57462,
    ),
      e.s(
        [
          'useElementOffset',
          0,
          function () {
            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [],
              [r, n] = (0, t.useState)({ height: 0, left: 0, top: 0, width: 0 }),
              i = (0, t.useCallback)(
                (e) => {
                  if (null != e) {
                    var t = e.getBoundingClientRect(),
                      i = { height: t.height, left: t.left, top: t.top, width: t.width };
                    (Math.abs(i.height - r.height) > 1 ||
                      Math.abs(i.left - r.left) > 1 ||
                      Math.abs(i.top - r.top) > 1 ||
                      Math.abs(i.width - r.width) > 1) &&
                      n({ height: i.height, left: i.left, top: i.top, width: i.width });
                  }
                },
                [r.width, r.height, r.top, r.left, ...e],
              );
            return [r, i];
          },
        ],
        77116,
      ));
    var eP = e.i(73508),
      e_ = ['x', 'y', 'top', 'left', 'width', 'height', 'className'];
    function eE() {
      return (eE = Object.assign.bind()).apply(null, arguments);
    }
    function ej(e, t) {
      var r = Object.keys(e);
      if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(e);
        (t &&
          (n = n.filter(function (t) {
            return Object.getOwnPropertyDescriptor(e, t).enumerable;
          })),
          r.push.apply(r, n));
      }
      return r;
    }
    (e.s(
      [
        'Cross',
        0,
        (e) => {
          var {
              x: n = 0,
              y: i = 0,
              top: a = 0,
              left: o = 0,
              width: u = 0,
              height: c = 0,
              className: s,
            } = e,
            f = (function (e) {
              for (var t = 1; t < arguments.length; t++) {
                var r = null != arguments[t] ? arguments[t] : {};
                t % 2
                  ? ej(Object(r), !0).forEach(function (t) {
                      var n, i, a;
                      ((n = e),
                        (i = t),
                        (a = r[t]),
                        (i = (function (e) {
                          var t = (function (e, t) {
                            if ('object' != typeof e || !e) return e;
                            var r = e[Symbol.toPrimitive];
                            if (void 0 !== r) {
                              var n = r.call(e, t || 'default');
                              if ('object' != typeof n) return n;
                              throw TypeError('@@toPrimitive must return a primitive value.');
                            }
                            return ('string' === t ? String : Number)(e);
                          })(e, 'string');
                          return 'symbol' == typeof t ? t : t + '';
                        })(i)) in n
                          ? Object.defineProperty(n, i, {
                              value: a,
                              enumerable: !0,
                              configurable: !0,
                              writable: !0,
                            })
                          : (n[i] = a));
                    })
                  : Object.getOwnPropertyDescriptors
                    ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
                    : ej(Object(r)).forEach(function (t) {
                        Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t));
                      });
              }
              return e;
            })(
              { x: n, y: i, top: a, left: o, width: u, height: c },
              (function (e, t) {
                if (null == e) return {};
                var r,
                  n,
                  i = (function (e, t) {
                    if (null == e) return {};
                    var r = {};
                    for (var n in e)
                      if ({}.hasOwnProperty.call(e, n)) {
                        if (-1 !== t.indexOf(n)) continue;
                        r[n] = e[n];
                      }
                    return r;
                  })(e, t);
                if (Object.getOwnPropertySymbols) {
                  var a = Object.getOwnPropertySymbols(e);
                  for (n = 0; n < a.length; n++)
                    ((r = a[n]),
                      -1 === t.indexOf(r) && {}.propertyIsEnumerable.call(e, r) && (i[r] = e[r]));
                }
                return i;
              })(e, e_),
            );
          return (0, l.isNumber)(n) &&
            (0, l.isNumber)(i) &&
            (0, l.isNumber)(u) &&
            (0, l.isNumber)(c) &&
            (0, l.isNumber)(a) &&
            (0, l.isNumber)(o)
            ? t.createElement(
                'path',
                eE({}, (0, eP.svgPropertiesAndEvents)(f), {
                  className: (0, r.clsx)('recharts-cross', s),
                  d: 'M'
                    .concat(n, ',')
                    .concat(a, 'v')
                    .concat(c, 'M')
                    .concat(o, ',')
                    .concat(i, 'h')
                    .concat(u),
                }),
              )
            : null;
        },
      ],
      61546,
    ),
      e.s(
        [
          'getCursorRectangle',
          0,
          function (e, t, r, n) {
            var i = n / 2;
            return {
              stroke: 'none',
              fill: '#ccc',
              x: 'horizontal' === e ? t.x - i : r.left + 0.5,
              y: 'horizontal' === e ? r.top + 0.5 : t.y - i,
              width: 'horizontal' === e ? n : r.width - 1,
              height: 'horizontal' === e ? r.height - 1 : n,
            };
          },
        ],
        37738,
      ));
  },
  50312,
  (e) => {
    'use strict';
    var t,
      r,
      n,
      i,
      a,
      o,
      l,
      u,
      c,
      s,
      f = e.i(61129),
      d = e.i(94083),
      p = e.i(75448),
      h = e.i(62409),
      v = e.i(49294),
      y = e.i(14742),
      g = e.i(64650),
      m = e.i(73508),
      b = e.i(65601),
      x = ['radius'],
      w = ['radius'];
    function O(e, t) {
      var r = Object.keys(e);
      if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(e);
        (t &&
          (n = n.filter(function (t) {
            return Object.getOwnPropertyDescriptor(e, t).enumerable;
          })),
          r.push.apply(r, n));
      }
      return r;
    }
    function S(e) {
      for (var t = 1; t < arguments.length; t++) {
        var r = null != arguments[t] ? arguments[t] : {};
        t % 2
          ? O(Object(r), !0).forEach(function (t) {
              var n, i, a;
              ((n = e),
                (i = t),
                (a = r[t]),
                (i = (function (e) {
                  var t = (function (e, t) {
                    if ('object' != typeof e || !e) return e;
                    var r = e[Symbol.toPrimitive];
                    if (void 0 !== r) {
                      var n = r.call(e, t || 'default');
                      if ('object' != typeof n) return n;
                      throw TypeError('@@toPrimitive must return a primitive value.');
                    }
                    return ('string' === t ? String : Number)(e);
                  })(e, 'string');
                  return 'symbol' == typeof t ? t : t + '';
                })(i)) in n
                  ? Object.defineProperty(n, i, {
                      value: a,
                      enumerable: !0,
                      configurable: !0,
                      writable: !0,
                    })
                  : (n[i] = a));
            })
          : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
            : O(Object(r)).forEach(function (t) {
                Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t));
              });
      }
      return e;
    }
    function A() {
      return (A = Object.assign.bind()).apply(null, arguments);
    }
    function P(e, t) {
      if (null == e) return {};
      var r,
        n,
        i = (function (e, t) {
          if (null == e) return {};
          var r = {};
          for (var n in e)
            if ({}.hasOwnProperty.call(e, n)) {
              if (-1 !== t.indexOf(n)) continue;
              r[n] = e[n];
            }
          return r;
        })(e, t);
      if (Object.getOwnPropertySymbols) {
        var a = Object.getOwnPropertySymbols(e);
        for (n = 0; n < a.length; n++)
          ((r = a[n]), -1 === t.indexOf(r) && {}.propertyIsEnumerable.call(e, r) && (i[r] = e[r]));
      }
      return i;
    }
    function _(e, t) {
      return (
        t || (t = e.slice(0)),
        Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } }))
      );
    }
    var E = (e, f, d, p, h) => {
        var v = (0, b.round)(d),
          y = (0, b.round)(p),
          g = Math.min(Math.abs(v) / 2, Math.abs(y) / 2),
          m = y >= 0 ? 1 : -1,
          x = v >= 0 ? 1 : -1,
          w = +((y >= 0 && v >= 0) || (y < 0 && v < 0));
        if (g > 0 && Array.isArray(h)) {
          for (var O = [0, 0, 0, 0], S = 0; S < 4; S++) {
            var A,
              P,
              E = null != (P = h[S]) ? P : 0;
            O[S] = E > g ? g : E;
          }
          ((A = (0, b.roundTemplateLiteral)(t || (t = _(['M', ',', ''])), e, f + m * O[0])),
            O[0] > 0 &&
              (A += (0, b.roundTemplateLiteral)(
                r || (r = _(['A ', ',', ',0,0,', ',', ',', ''])),
                O[0],
                O[0],
                w,
                e + x * O[0],
                f,
              )),
            (A += (0, b.roundTemplateLiteral)(n || (n = _(['L ', ',', ''])), e + d - x * O[1], f)),
            O[1] > 0 &&
              (A += (0, b.roundTemplateLiteral)(
                i || (i = _(['A ', ',', ',0,0,', ',\n        ', ',', ''])),
                O[1],
                O[1],
                w,
                e + d,
                f + m * O[1],
              )),
            (A += (0, b.roundTemplateLiteral)(
              a || (a = _(['L ', ',', ''])),
              e + d,
              f + p - m * O[2],
            )),
            O[2] > 0 &&
              (A += (0, b.roundTemplateLiteral)(
                o || (o = _(['A ', ',', ',0,0,', ',\n        ', ',', ''])),
                O[2],
                O[2],
                w,
                e + d - x * O[2],
                f + p,
              )),
            (A += (0, b.roundTemplateLiteral)(l || (l = _(['L ', ',', ''])), e + x * O[3], f + p)),
            O[3] > 0 &&
              (A += (0, b.roundTemplateLiteral)(
                u || (u = _(['A ', ',', ',0,0,', ',\n        ', ',', ''])),
                O[3],
                O[3],
                w,
                e,
                f + p - m * O[3],
              )),
            (A += 'Z'));
        } else if (g > 0 && h === +h && h > 0) {
          var j = Math.min(g, h);
          A = (0, b.roundTemplateLiteral)(
            c ||
              (c = _([
                'M ',
                ',',
                '\n            A ',
                ',',
                ',0,0,',
                ',',
                ',',
                '\n            L ',
                ',',
                '\n            A ',
                ',',
                ',0,0,',
                ',',
                ',',
                '\n            L ',
                ',',
                '\n            A ',
                ',',
                ',0,0,',
                ',',
                ',',
                '\n            L ',
                ',',
                '\n            A ',
                ',',
                ',0,0,',
                ',',
                ',',
                ' Z',
              ])),
            e,
            f + m * j,
            j,
            j,
            w,
            e + x * j,
            f,
            e + d - x * j,
            f,
            j,
            j,
            w,
            e + d,
            f + m * j,
            e + d,
            f + p - m * j,
            j,
            j,
            w,
            e + d - x * j,
            f + p,
            e + x * j,
            f + p,
            j,
            j,
            w,
            e,
            f + p - m * j,
          );
        } else
          A = (0, b.roundTemplateLiteral)(
            s || (s = _(['M ', ',', ' h ', ' v ', ' h ', ' Z'])),
            e,
            f,
            d,
            p,
            -d,
          );
        return A;
      },
      j = {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        radius: 0,
        isAnimationActive: !1,
        isUpdateAnimationActive: !1,
        animationBegin: 0,
        animationDuration: 1500,
        animationEasing: 'ease',
      };
    e.s([
      'Rectangle',
      0,
      (e) => {
        var t = (0, p.resolveDefaultProps)(e, j),
          r = (0, f.useRef)(null),
          [n, i] = (0, f.useState)(-1);
        (0, f.useEffect)(() => {
          if (r.current && r.current.getTotalLength)
            try {
              var e = r.current.getTotalLength();
              e && i(e);
            } catch (e) {}
        }, []);
        var { x: a, y: o, width: l, height: u, radius: c, className: s } = t,
          {
            animationEasing: O,
            animationDuration: _,
            animationBegin: C,
            isAnimationActive: M,
            isUpdateAnimationActive: k,
          } = t,
          T = (0, f.useRef)(l),
          D = (0, f.useRef)(u),
          N = (0, f.useRef)(a),
          I = (0, f.useRef)(o),
          L = (0, f.useMemo)(
            () => ({ x: a, y: o, width: l, height: u, radius: c }),
            [a, o, l, u, c],
          ),
          R = (0, y.useAnimationId)(L, 'rectangle-');
        if (a !== +a || o !== +o || l !== +l || u !== +u || 0 === l || 0 === u) return null;
        var B = (0, d.clsx)('recharts-rectangle', s);
        if (!k) {
          var z = (0, m.svgPropertiesAndEvents)(t),
            { radius: F } = z,
            U = P(z, x);
          return f.createElement(
            'path',
            A({}, U, {
              x: (0, b.round)(a),
              y: (0, b.round)(o),
              width: (0, b.round)(l),
              height: (0, b.round)(u),
              radius: 'number' == typeof c ? c : void 0,
              className: B,
              d: E(a, o, l, u, c),
            }),
          );
        }
        var W = T.current,
          $ = D.current,
          V = N.current,
          K = I.current,
          H = '0px '.concat(-1 === n ? 1 : n, 'px'),
          q = ''.concat(n, 'px ').concat(n, 'px'),
          Y = (0, g.getTransitionVal)(
            ['strokeDasharray'],
            _,
            'string' == typeof O ? O : j.animationEasing,
          );
        return f.createElement(
          h.JavascriptAnimate,
          {
            animationId: R,
            key: R,
            canBegin: n > 0,
            duration: _,
            easing: O,
            isActive: k,
            begin: C,
          },
          (e) => {
            var n,
              i = (0, v.interpolate)(W, l, e),
              s = (0, v.interpolate)($, u, e),
              d = (0, v.interpolate)(V, a, e),
              p = (0, v.interpolate)(K, o, e);
            (r.current && ((T.current = i), (D.current = s), (N.current = d), (I.current = p)),
              (n = M
                ? e > 0
                  ? { transition: Y, strokeDasharray: q }
                  : { strokeDasharray: H }
                : { strokeDasharray: q }));
            var h = (0, m.svgPropertiesAndEvents)(t),
              { radius: y } = h,
              g = P(h, w);
            return f.createElement(
              'path',
              A({}, g, {
                radius: 'number' == typeof c ? c : void 0,
                className: B,
                d: E(d, p, i, s, c),
                ref: r,
                style: S(S({}, n), t.style),
              }),
            );
          },
        );
      },
    ]);
  },
  4553,
  (e) => {
    'use strict';
    var t = e.i(13348);
    e.s([
      'getRadialCursorPoints',
      0,
      function (e) {
        var { cx: r, cy: n, radius: i, startAngle: a, endAngle: o } = e;
        return {
          points: [(0, t.polarToCartesian)(r, n, i, a), (0, t.polarToCartesian)(r, n, i, o)],
          cx: r,
          cy: n,
          radius: i,
          startAngle: a,
          endAngle: o,
        };
      },
    ]);
  },
  30856,
  (e) => {
    'use strict';
    var t,
      r,
      n,
      i,
      a,
      o,
      l,
      u = e.i(61129),
      c = e.i(94083),
      s = e.i(13348),
      f = e.i(49294),
      d = e.i(75448),
      p = e.i(73508),
      h = e.i(65601);
    function v() {
      return (v = Object.assign.bind()).apply(null, arguments);
    }
    function y(e, t) {
      return (
        t || (t = e.slice(0)),
        Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } }))
      );
    }
    var g = (e) => {
        var {
            cx: t,
            cy: r,
            radius: n,
            angle: i,
            sign: a,
            isExternal: o,
            cornerRadius: l,
            cornerIsExternal: u,
          } = e,
          c = l * (o ? 1 : -1) + n,
          f = Math.asin(l / c) / s.RADIAN,
          d = u ? i : i + a * f,
          p = (0, s.polarToCartesian)(t, r, c, d);
        return {
          center: p,
          circleTangency: (0, s.polarToCartesian)(t, r, n, d),
          lineTangency: (0, s.polarToCartesian)(
            t,
            r,
            c * Math.cos(f * s.RADIAN),
            u ? i - a * f : i,
          ),
          theta: f,
        };
      },
      m = (e) => {
        var { cx: i, cy: a, innerRadius: o, outerRadius: l, startAngle: u, endAngle: c } = e,
          d = (0, f.mathSign)(c - u) * Math.min(Math.abs(c - u), 359.999),
          p = u + d,
          v = (0, s.polarToCartesian)(i, a, l, u),
          g = (0, s.polarToCartesian)(i, a, l, p),
          m = (0, h.roundTemplateLiteral)(
            t || (t = y(['M ', ',', '\n    A ', ',', ',0,\n    ', ',', ',\n    ', ',', '\n  '])),
            v.x,
            v.y,
            l,
            l,
            +(Math.abs(d) > 180),
            +(u > p),
            g.x,
            g.y,
          );
        if (o > 0) {
          var b = (0, s.polarToCartesian)(i, a, o, u),
            x = (0, s.polarToCartesian)(i, a, o, p);
          m += (0, h.roundTemplateLiteral)(
            r ||
              (r = y([
                'L ',
                ',',
                '\n            A ',
                ',',
                ',0,\n            ',
                ',',
                ',\n            ',
                ',',
                ' Z',
              ])),
            x.x,
            x.y,
            o,
            o,
            +(Math.abs(d) > 180),
            +(u <= p),
            b.x,
            b.y,
          );
        } else m += (0, h.roundTemplateLiteral)(n || (n = y(['L ', ',', ' Z'])), i, a);
        return m;
      },
      b = {
        cx: 0,
        cy: 0,
        innerRadius: 0,
        outerRadius: 0,
        startAngle: 0,
        endAngle: 0,
        cornerRadius: 0,
        forceCornerRadius: !1,
        cornerIsExternal: !1,
      };
    e.s([
      'Sector',
      0,
      (e) => {
        var t,
          r = (0, d.resolveDefaultProps)(e, b),
          {
            cx: n,
            cy: s,
            innerRadius: x,
            outerRadius: w,
            cornerRadius: O,
            forceCornerRadius: S,
            cornerIsExternal: A,
            startAngle: P,
            endAngle: _,
            className: E,
          } = r;
        if (w < x || P === _) return null;
        var j = (0, c.clsx)('recharts-sector', E),
          C = w - x,
          M = (0, f.getPercentValue)(O, C, 0, !0);
        return (
          (t =
            M > 0 && 360 > Math.abs(P - _)
              ? ((e) => {
                  var {
                      cx: t,
                      cy: r,
                      innerRadius: n,
                      outerRadius: u,
                      cornerRadius: c,
                      forceCornerRadius: s,
                      cornerIsExternal: d,
                      startAngle: p,
                      endAngle: v,
                    } = e,
                    b = (0, f.mathSign)(v - p),
                    {
                      circleTangency: x,
                      lineTangency: w,
                      theta: O,
                    } = g({
                      cx: t,
                      cy: r,
                      radius: u,
                      angle: p,
                      sign: b,
                      cornerRadius: c,
                      cornerIsExternal: d,
                    }),
                    {
                      circleTangency: S,
                      lineTangency: A,
                      theta: P,
                    } = g({
                      cx: t,
                      cy: r,
                      radius: u,
                      angle: v,
                      sign: -b,
                      cornerRadius: c,
                      cornerIsExternal: d,
                    }),
                    _ = d ? Math.abs(p - v) : Math.abs(p - v) - O - P;
                  if (_ < 0)
                    return s
                      ? (0, h.roundTemplateLiteral)(
                          i ||
                            (i = y([
                              'M ',
                              ',',
                              '\n        a',
                              ',',
                              ',0,0,1,',
                              ',0\n        a',
                              ',',
                              ',0,0,1,',
                              ',0\n      ',
                            ])),
                          w.x,
                          w.y,
                          c,
                          c,
                          2 * c,
                          c,
                          c,
                          -(2 * c),
                        )
                      : m({
                          cx: t,
                          cy: r,
                          innerRadius: n,
                          outerRadius: u,
                          startAngle: p,
                          endAngle: v,
                        });
                  var E = (0, h.roundTemplateLiteral)(
                    a ||
                      (a = y([
                        'M ',
                        ',',
                        '\n    A',
                        ',',
                        ',0,0,',
                        ',',
                        ',',
                        '\n    A',
                        ',',
                        ',0,',
                        ',',
                        ',',
                        ',',
                        '\n    A',
                        ',',
                        ',0,0,',
                        ',',
                        ',',
                        '\n  ',
                      ])),
                    w.x,
                    w.y,
                    c,
                    c,
                    +(b < 0),
                    x.x,
                    x.y,
                    u,
                    u,
                    +(_ > 180),
                    +(b < 0),
                    S.x,
                    S.y,
                    c,
                    c,
                    +(b < 0),
                    A.x,
                    A.y,
                  );
                  if (n > 0) {
                    var {
                        circleTangency: j,
                        lineTangency: C,
                        theta: M,
                      } = g({
                        cx: t,
                        cy: r,
                        radius: n,
                        angle: p,
                        sign: b,
                        isExternal: !0,
                        cornerRadius: c,
                        cornerIsExternal: d,
                      }),
                      {
                        circleTangency: k,
                        lineTangency: T,
                        theta: D,
                      } = g({
                        cx: t,
                        cy: r,
                        radius: n,
                        angle: v,
                        sign: -b,
                        isExternal: !0,
                        cornerRadius: c,
                        cornerIsExternal: d,
                      }),
                      N = d ? Math.abs(p - v) : Math.abs(p - v) - M - D;
                    if (N < 0 && 0 === c) return ''.concat(E, 'L').concat(t, ',').concat(r, 'Z');
                    E += (0, h.roundTemplateLiteral)(
                      o ||
                        (o = y([
                          'L',
                          ',',
                          '\n      A',
                          ',',
                          ',0,0,',
                          ',',
                          ',',
                          '\n      A',
                          ',',
                          ',0,',
                          ',',
                          ',',
                          ',',
                          '\n      A',
                          ',',
                          ',0,0,',
                          ',',
                          ',',
                          'Z',
                        ])),
                      T.x,
                      T.y,
                      c,
                      c,
                      +(b < 0),
                      k.x,
                      k.y,
                      n,
                      n,
                      +(N > 180),
                      +(b > 0),
                      j.x,
                      j.y,
                      c,
                      c,
                      +(b < 0),
                      C.x,
                      C.y,
                    );
                  } else E += (0, h.roundTemplateLiteral)(l || (l = y(['L', ',', 'Z'])), t, r);
                  return E;
                })({
                  cx: n,
                  cy: s,
                  innerRadius: x,
                  outerRadius: w,
                  cornerRadius: Math.min(M, C / 2),
                  forceCornerRadius: S,
                  cornerIsExternal: A,
                  startAngle: P,
                  endAngle: _,
                })
              : m({ cx: n, cy: s, innerRadius: x, outerRadius: w, startAngle: P, endAngle: _ })),
          u.createElement('path', v({}, (0, p.svgPropertiesAndEvents)(r), { className: j, d: t }))
        );
      },
    ]);
  },
  54241,
  (e) => {
    'use strict';
    var t = e.i(61129),
      r = e.i(7473),
      n = e.i(56960),
      i = e.i(22989),
      a = e.i(57462),
      o = e.i(77314),
      l = e.i(84773),
      u = e.i(77116),
      c = e.i(94083),
      s = e.i(68078),
      f = e.i(1232),
      d = e.i(61546),
      p = e.i(37738),
      h = e.i(50312),
      v = e.i(4553),
      y = e.i(30856),
      g = e.i(13348),
      m = e.i(98733),
      b = e.i(41469),
      x = e.i(58644),
      w = e.i(70192);
    function O(e, t) {
      var r = Object.keys(e);
      if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(e);
        (t &&
          (n = n.filter(function (t) {
            return Object.getOwnPropertyDescriptor(e, t).enumerable;
          })),
          r.push.apply(r, n));
      }
      return r;
    }
    function S(e) {
      for (var t = 1; t < arguments.length; t++) {
        var r = null != arguments[t] ? arguments[t] : {};
        t % 2
          ? O(Object(r), !0).forEach(function (t) {
              var n, i, a;
              ((n = e),
                (i = t),
                (a = r[t]),
                (i = (function (e) {
                  var t = (function (e, t) {
                    if ('object' != typeof e || !e) return e;
                    var r = e[Symbol.toPrimitive];
                    if (void 0 !== r) {
                      var n = r.call(e, t || 'default');
                      if ('object' != typeof n) return n;
                      throw TypeError('@@toPrimitive must return a primitive value.');
                    }
                    return ('string' === t ? String : Number)(e);
                  })(e, 'string');
                  return 'symbol' == typeof t ? t : t + '';
                })(i)) in n
                  ? Object.defineProperty(n, i, {
                      value: a,
                      enumerable: !0,
                      configurable: !0,
                      writable: !0,
                    })
                  : (n[i] = a));
            })
          : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
            : O(Object(r)).forEach(function (t) {
                Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t));
              });
      }
      return e;
    }
    var A = e.i(92544),
      P = e.i(75093),
      _ = e.i(7848),
      E = e.i(95916);
    function j() {
      return (j = Object.assign.bind()).apply(null, arguments);
    }
    function C(e, t) {
      var r = Object.keys(e);
      if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(e);
        (t &&
          (n = n.filter(function (t) {
            return Object.getOwnPropertyDescriptor(e, t).enumerable;
          })),
          r.push.apply(r, n));
      }
      return r;
    }
    function M(e) {
      for (var t = 1; t < arguments.length; t++) {
        var r = null != arguments[t] ? arguments[t] : {};
        t % 2
          ? C(Object(r), !0).forEach(function (t) {
              var n, i, a;
              ((n = e),
                (i = t),
                (a = r[t]),
                (i = (function (e) {
                  var t = (function (e, t) {
                    if ('object' != typeof e || !e) return e;
                    var r = e[Symbol.toPrimitive];
                    if (void 0 !== r) {
                      var n = r.call(e, t || 'default');
                      if ('object' != typeof n) return n;
                      throw TypeError('@@toPrimitive must return a primitive value.');
                    }
                    return ('string' === t ? String : Number)(e);
                  })(e, 'string');
                  return 'symbol' == typeof t ? t : t + '';
                })(i)) in n
                  ? Object.defineProperty(n, i, {
                      value: a,
                      enumerable: !0,
                      configurable: !0,
                      writable: !0,
                    })
                  : (n[i] = a));
            })
          : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
            : C(Object(r)).forEach(function (t) {
                Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t));
              });
      }
      return e;
    }
    function k(e) {
      var { cursor: r, cursorComp: n, cursorProps: i } = e;
      return (0, t.isValidElement)(r) ? (0, t.cloneElement)(r, i) : (0, t.createElement)(n, i);
    }
    function T(e) {
      var r,
        n,
        i,
        a,
        {
          coordinate: o,
          payload: l,
          index: u,
          offset: m,
          tooltipAxisBandSize: b,
          layout: x,
          cursor: w,
          tooltipEventType: O,
          chartName: S,
        } = e;
      if (!w || !o || ('ScatterChart' !== S && 'axis' !== O)) return null;
      if ('ScatterChart' === S) ((n = o), (i = d.Cross), (a = E.DefaultZIndexes.cursorLine));
      else if ('BarChart' === S)
        ((n = (0, p.getCursorRectangle)(x, o, m, b)),
          (i = h.Rectangle),
          (a = E.DefaultZIndexes.cursorRectangle));
      else if ('radial' === x && (0, s.isPolarCoordinate)(o)) {
        var {
          cx: A,
          cy: j,
          radius: C,
          startAngle: T,
          endAngle: D,
        } = (0, v.getRadialCursorPoints)(o);
        ((n = { cx: A, cy: j, startAngle: T, endAngle: D, innerRadius: C, outerRadius: C }),
          (i = y.Sector),
          (a = E.DefaultZIndexes.cursorLine));
      } else
        ((n = {
          points: (function (e, t, r) {
            if ('horizontal' === e)
              return [
                { x: t.x, y: r.top },
                { x: t.x, y: r.top + r.height },
              ];
            if ('vertical' === e)
              return [
                { x: r.left, y: t.y },
                { x: r.left + r.width, y: t.y },
              ];
            if ((0, s.isPolarCoordinate)(t)) {
              if ('centric' === e) {
                var { cx: n, cy: i, innerRadius: a, outerRadius: o, angle: l } = t,
                  u = (0, g.polarToCartesian)(n, i, a, l),
                  c = (0, g.polarToCartesian)(n, i, o, l);
                return [
                  { x: u.x, y: u.y },
                  { x: c.x, y: c.y },
                ];
              }
              return (0, v.getRadialCursorPoints)(t);
            }
          })(x, o, m),
        }),
          (i = f.Curve),
          (a = E.DefaultZIndexes.cursorLine));
      var N = 'object' == typeof w && 'className' in w ? w.className : void 0,
        I = M(
          M(
            M(M({ stroke: '#ccc', pointerEvents: 'none' }, m), n),
            (0, P.svgPropertiesNoEventsFromUnknown)(w),
          ),
          {},
          { payload: l, payloadIndex: u, className: (0, c.clsx)('recharts-tooltip-cursor', N) },
        );
      return t.createElement(
        _.ZIndexLayer,
        { zIndex: null != (r = e.zIndex) ? r : a },
        t.createElement(k, { cursor: w, cursorComp: i, cursorProps: I }),
      );
    }
    function D(e) {
      var r,
        n,
        i,
        a =
          ((r = (0, m.useAppSelector)(x.selectTooltipAxis)),
          (n = (0, m.useAppSelector)(w.selectTooltipAxisTicks)),
          (i = (0, m.useAppSelector)(w.selectTooltipAxisScale)),
          r && i
            ? (0, b.getBandSizeOfAxis)(S(S({}, r), {}, { scale: i }), n)
            : (0, b.getBandSizeOfAxis)(void 0, n)),
        l = (0, o.useOffsetInternal)(),
        u = (0, o.useChartLayout)(),
        c = (0, A.useChartName)();
      return null == a || null == l || null == u || null == c
        ? null
        : t.createElement(
            T,
            j({}, e, { offset: l, layout: u, tooltipAxisBandSize: a, chartName: c }),
          );
    }
    var N = e.i(97240),
      I = e.i(12281),
      L = e.i(80124),
      R = e.i(4601),
      B = e.i(75448);
    function z(e, t) {
      var r = Object.keys(e);
      if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(e);
        (t &&
          (n = n.filter(function (t) {
            return Object.getOwnPropertyDescriptor(e, t).enumerable;
          })),
          r.push.apply(r, n));
      }
      return r;
    }
    function F(e) {
      for (var t = 1; t < arguments.length; t++) {
        var r = null != arguments[t] ? arguments[t] : {};
        t % 2
          ? z(Object(r), !0).forEach(function (t) {
              var n, i, a;
              ((n = e),
                (i = t),
                (a = r[t]),
                (i = (function (e) {
                  var t = (function (e, t) {
                    if ('object' != typeof e || !e) return e;
                    var r = e[Symbol.toPrimitive];
                    if (void 0 !== r) {
                      var n = r.call(e, t || 'default');
                      if ('object' != typeof n) return n;
                      throw TypeError('@@toPrimitive must return a primitive value.');
                    }
                    return ('string' === t ? String : Number)(e);
                  })(e, 'string');
                  return 'symbol' == typeof t ? t : t + '';
                })(i)) in n
                  ? Object.defineProperty(n, i, {
                      value: a,
                      enumerable: !0,
                      configurable: !0,
                      writable: !0,
                    })
                  : (n[i] = a));
            })
          : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
            : z(Object(r)).forEach(function (t) {
                Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t));
              });
      }
      return e;
    }
    function U(e) {
      return e.dataKey;
    }
    var W = [],
      $ = {
        allowEscapeViewBox: { x: !1, y: !1 },
        animationDuration: 400,
        animationEasing: 'ease',
        axisId: 0,
        contentStyle: {},
        cursor: !0,
        filterNull: !0,
        includeHidden: !1,
        isAnimationActive: 'auto',
        itemSorter: 'name',
        itemStyle: {},
        labelStyle: {},
        offset: 10,
        reverseDirection: { x: !1, y: !1 },
        separator: ' : ',
        trigger: 'hover',
        useTranslate3d: !1,
        wrapperStyle: {},
      };
    e.s(
      [
        'Tooltip',
        0,
        function (e) {
          var c,
            s,
            f = (0, B.resolveDefaultProps)(e, $),
            {
              active: d,
              allowEscapeViewBox: p,
              animationDuration: h,
              animationEasing: v,
              content: y,
              filterNull: g,
              isAnimationActive: b,
              offset: x,
              payloadUniqBy: w,
              position: O,
              reverseDirection: S,
              useTranslate3d: P,
              wrapperStyle: _,
              cursor: E,
              shared: j,
              trigger: C,
              defaultIndex: M,
              portal: k,
              axisId: T,
            } = f,
            z = (0, m.useAppDispatch)(),
            V = 'number' == typeof M ? String(M) : M;
          (0, t.useEffect)(() => {
            z(
              (0, I.setTooltipSettingsState)({
                shared: j,
                trigger: C,
                axisId: T,
                active: d,
                defaultIndex: V,
              }),
            );
          }, [z, j, C, T, d, V]);
          var K = (0, o.useViewBox)(),
            H = (0, l.useAccessibilityLayer)(),
            q = (0, R.useTooltipEventType)(j),
            { activeIndex: Y, isActive: X } =
              null != (c = (0, m.useAppSelector)((e) => (0, A.selectIsTooltipActive)(e, q, C, V)))
                ? c
                : {},
            G = (0, m.useAppSelector)((e) => (0, A.selectTooltipPayload)(e, q, C, V)),
            Z = (0, m.useAppSelector)((e) => (0, A.selectActiveLabel)(e, q, C, V)),
            Q = (0, m.useAppSelector)((e) => (0, A.selectActiveCoordinate)(e, q, C, V)),
            J = (0, N.useTooltipPortal)(),
            ee = null != (s = null != d ? d : X) && s,
            [et, er] = (0, u.useElementOffset)([G, ee]),
            en = 'axis' === q ? Z : void 0;
          (0, L.useTooltipChartSynchronisation)(q, C, Q, en, Y, ee);
          var ei = null != k ? k : J;
          if (null == ei || null == K || null == q) return null;
          var ea = null != G ? G : W;
          (ee || (ea = W),
            g &&
              ea.length &&
              (ea = (0, a.getUniqPayload)(
                ea.filter((e) => null != e.value && (!0 !== e.hide || f.includeHidden)),
                w,
                U,
              )));
          var eo = ea.length > 0,
            el = F(
              F({}, f),
              {},
              {
                payload: ea,
                label: en,
                active: ee,
                activeIndex: Y,
                coordinate: Q,
                accessibilityLayer: H,
              },
            ),
            eu = t.createElement(
              i.TooltipBoundingBox,
              {
                allowEscapeViewBox: p,
                animationDuration: h,
                animationEasing: v,
                isAnimationActive: b,
                active: ee,
                coordinate: Q,
                hasPayload: eo,
                offset: x,
                position: O,
                reverseDirection: S,
                useTranslate3d: P,
                viewBox: K,
                wrapperStyle: _,
                lastBoundingBox: et,
                innerRef: er,
                hasPortalFromProps: !!k,
              },
              t.isValidElement(y)
                ? t.cloneElement(y, el)
                : 'function' == typeof y
                  ? t.createElement(y, el)
                  : t.createElement(n.DefaultTooltipContent, el),
            );
          return t.createElement(
            t.Fragment,
            null,
            (0, r.createPortal)(eu, ei),
            ee &&
              t.createElement(D, {
                cursor: E,
                tooltipEventType: q,
                coordinate: Q,
                payload: ea,
                index: Y,
              }),
          );
        },
      ],
      54241,
    );
  },
]);
