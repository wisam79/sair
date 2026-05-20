(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([
  'object' == typeof document ? document.currentScript : void 0,
  58233,
  (e, t, r) => {
    !(function (r, n) {
      'use strict';
      if ('function' == typeof define && define.amd) {
        let t;
        void 0 !== (t = n()) && e.v(t);
      } else t.exports = n();
    })(e.e, function () {
      'use strict';
      function e(e) {
        return e.charAt(0).toUpperCase() + e.substring(1);
      }
      function t(e) {
        return function () {
          return this[e];
        };
      }
      var r = ['isConstructor', 'isEval', 'isNative', 'isToplevel'],
        n = ['columnNumber', 'lineNumber'],
        a = ['fileName', 'functionName', 'source'],
        i = r.concat(n, a, ['args'], ['evalOrigin']);
      function o(t) {
        if (t)
          for (var r = 0; r < i.length; r++) void 0 !== t[i[r]] && this['set' + e(i[r])](t[i[r]]);
      }
      ((o.prototype = {
        getArgs: function () {
          return this.args;
        },
        setArgs: function (e) {
          if ('[object Array]' !== Object.prototype.toString.call(e))
            throw TypeError('Args must be an Array');
          this.args = e;
        },
        getEvalOrigin: function () {
          return this.evalOrigin;
        },
        setEvalOrigin: function (e) {
          if (e instanceof o) this.evalOrigin = e;
          else if (e instanceof Object) this.evalOrigin = new o(e);
          else throw TypeError('Eval Origin must be an Object or StackFrame');
        },
        toString: function () {
          var e = this.getFileName() || '',
            t = this.getLineNumber() || '',
            r = this.getColumnNumber() || '',
            n = this.getFunctionName() || '';
          return this.getIsEval()
            ? e
              ? '[eval] (' + e + ':' + t + ':' + r + ')'
              : '[eval]:' + t + ':' + r
            : n
              ? n + ' (' + e + ':' + t + ':' + r + ')'
              : e + ':' + t + ':' + r;
        },
      }),
        (o.fromString = function (e) {
          var t = e.indexOf('('),
            r = e.lastIndexOf(')'),
            n = e.substring(0, t),
            a = e.substring(t + 1, r).split(','),
            i = e.substring(r + 1);
          if (0 === i.indexOf('@'))
            var s = /@(.+?)(?::(\d+))?(?::(\d+))?$/.exec(i, ''),
              l = s[1],
              u = s[2],
              c = s[3];
          return new o({
            functionName: n,
            args: a || void 0,
            fileName: l,
            lineNumber: u || void 0,
            columnNumber: c || void 0,
          });
        }));
      for (var s = 0; s < r.length; s++)
        ((o.prototype['get' + e(r[s])] = t(r[s])),
          (o.prototype['set' + e(r[s])] = (function (e) {
            return function (t) {
              this[e] = !!t;
            };
          })(r[s])));
      for (var l = 0; l < n.length; l++)
        ((o.prototype['get' + e(n[l])] = t(n[l])),
          (o.prototype['set' + e(n[l])] = (function (e) {
            return function (t) {
              if (!(!isNaN(parseFloat(t)) && isFinite(t))) throw TypeError(e + ' must be a Number');
              this[e] = Number(t);
            };
          })(n[l])));
      for (var u = 0; u < a.length; u++)
        ((o.prototype['get' + e(a[u])] = t(a[u])),
          (o.prototype['set' + e(a[u])] = (function (e) {
            return function (t) {
              this[e] = String(t);
            };
          })(a[u])));
      return o;
    });
  },
  18583,
  (e, t, r) => {
    !(function (r, n) {
      'use strict';
      if ('function' == typeof define && define.amd) {
        let t;
        void 0 !== (t = n(e.r(58233))) && e.v(t);
      } else t.exports = n(e.r(58233));
    })(e.e, function (e) {
      'use strict';
      var t = /(^|@)\S+:\d+/,
        r = /^\s*at .*(\S+:\d+|\(native\))/m,
        n = /^(eval@)?(\[native code])?$/;
      return {
        parse: function (e) {
          if (void 0 !== e.stacktrace || void 0 !== e['opera#sourceloc']) return this.parseOpera(e);
          if (e.stack && e.stack.match(r)) return this.parseV8OrIE(e);
          if (e.stack) return this.parseFFOrSafari(e);
          throw Error('Cannot parse given Error object');
        },
        extractLocation: function (e) {
          if (-1 === e.indexOf(':')) return [e];
          var t = /(.+?)(?::(\d+))?(?::(\d+))?$/.exec(e.replace(/[()]/g, ''));
          return [t[1], t[2] || void 0, t[3] || void 0];
        },
        parseV8OrIE: function (t) {
          return t.stack
            .split('\n')
            .filter(function (e) {
              return !!e.match(r);
            }, this)
            .map(function (t) {
              t.indexOf('(eval ') > -1 &&
                (t = t.replace(/eval code/g, 'eval').replace(/(\(eval at [^()]*)|(,.*$)/g, ''));
              var r = t
                  .replace(/^\s+/, '')
                  .replace(/\(eval code/g, '(')
                  .replace(/^.*?\s+/, ''),
                n = r.match(/ (\(.+\)$)/);
              r = n ? r.replace(n[0], '') : r;
              var a = this.extractLocation(n ? n[1] : r);
              return new e({
                functionName: (n && r) || void 0,
                fileName: ['eval', '<anonymous>'].indexOf(a[0]) > -1 ? void 0 : a[0],
                lineNumber: a[1],
                columnNumber: a[2],
                source: t,
              });
            }, this);
        },
        parseFFOrSafari: function (t) {
          return t.stack
            .split('\n')
            .filter(function (e) {
              return !e.match(n);
            }, this)
            .map(function (t) {
              if (
                (t.indexOf(' > eval') > -1 &&
                  (t = t.replace(/ line (\d+)(?: > eval line \d+)* > eval:\d+:\d+/g, ':$1')),
                -1 === t.indexOf('@') && -1 === t.indexOf(':'))
              )
                return new e({ functionName: t });
              var r = /((.*".+"[^@]*)?[^@]*)(?:@)/,
                n = t.match(r),
                a = n && n[1] ? n[1] : void 0,
                i = this.extractLocation(t.replace(r, ''));
              return new e({
                functionName: a,
                fileName: i[0],
                lineNumber: i[1],
                columnNumber: i[2],
                source: t,
              });
            }, this);
        },
        parseOpera: function (e) {
          return !e.stacktrace ||
            (e.message.indexOf('\n') > -1 &&
              e.message.split('\n').length > e.stacktrace.split('\n').length)
            ? this.parseOpera9(e)
            : e.stack
              ? this.parseOpera11(e)
              : this.parseOpera10(e);
        },
        parseOpera9: function (t) {
          for (
            var r = /Line (\d+).*script (?:in )?(\S+)/i,
              n = t.message.split('\n'),
              a = [],
              i = 2,
              o = n.length;
            i < o;
            i += 2
          ) {
            var s = r.exec(n[i]);
            s && a.push(new e({ fileName: s[2], lineNumber: s[1], source: n[i] }));
          }
          return a;
        },
        parseOpera10: function (t) {
          for (
            var r = /Line (\d+).*script (?:in )?(\S+)(?:: In function (\S+))?$/i,
              n = t.stacktrace.split('\n'),
              a = [],
              i = 0,
              o = n.length;
            i < o;
            i += 2
          ) {
            var s = r.exec(n[i]);
            s &&
              a.push(
                new e({
                  functionName: s[3] || void 0,
                  fileName: s[2],
                  lineNumber: s[1],
                  source: n[i],
                }),
              );
          }
          return a;
        },
        parseOpera11: function (r) {
          return r.stack
            .split('\n')
            .filter(function (e) {
              return !!e.match(t) && !e.match(/^Error created at/);
            }, this)
            .map(function (t) {
              var r,
                n = t.split('@'),
                a = this.extractLocation(n.pop()),
                i = n.shift() || '',
                o =
                  i.replace(/<anonymous function(: (\w+))?>/, '$2').replace(/\([^)]*\)/g, '') ||
                  void 0;
              return (
                i.match(/\(([^)]*)\)/) && (r = i.replace(/^[^(]+\(([^)]*)\)$/, '$1')),
                new e({
                  functionName: o,
                  args: void 0 === r || '[arguments not available]' === r ? void 0 : r.split(','),
                  fileName: a[0],
                  lineNumber: a[1],
                  columnNumber: a[2],
                  source: t,
                })
              );
            }, this);
        },
      };
    });
  },
  49396,
  (e, t, r) => {
    'use strict';
    t.exports = TypeError;
  },
  88014,
  (e, t, r) => {
    var n = 'function' == typeof Map && Map.prototype,
      a =
        Object.getOwnPropertyDescriptor && n
          ? Object.getOwnPropertyDescriptor(Map.prototype, 'size')
          : null,
      i = n && a && 'function' == typeof a.get ? a.get : null,
      o = n && Map.prototype.forEach,
      s = 'function' == typeof Set && Set.prototype,
      l =
        Object.getOwnPropertyDescriptor && s
          ? Object.getOwnPropertyDescriptor(Set.prototype, 'size')
          : null,
      u = s && l && 'function' == typeof l.get ? l.get : null,
      c = s && Set.prototype.forEach,
      d = 'function' == typeof WeakMap && WeakMap.prototype ? WeakMap.prototype.has : null,
      f = 'function' == typeof WeakSet && WeakSet.prototype ? WeakSet.prototype.has : null,
      p = 'function' == typeof WeakRef && WeakRef.prototype ? WeakRef.prototype.deref : null,
      h = Boolean.prototype.valueOf,
      m = Object.prototype.toString,
      y = Function.prototype.toString,
      v = String.prototype.match,
      g = String.prototype.slice,
      b = String.prototype.replace,
      E = String.prototype.toUpperCase,
      w = String.prototype.toLowerCase,
      C = RegExp.prototype.test,
      P = Array.prototype.concat,
      S = Array.prototype.join,
      O = Array.prototype.slice,
      x = Math.floor,
      L = 'function' == typeof BigInt ? BigInt.prototype.valueOf : null,
      A = Object.getOwnPropertySymbols,
      k =
        'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
          ? Symbol.prototype.toString
          : null,
      F = 'function' == typeof Symbol && 'object' == typeof Symbol.iterator,
      _ =
        'function' == typeof Symbol &&
        Symbol.toStringTag &&
        (typeof Symbol.toStringTag === F ? 'object' : 'symbol')
          ? Symbol.toStringTag
          : null,
      R = Object.prototype.propertyIsEnumerable,
      D =
        ('function' == typeof Reflect ? Reflect.getPrototypeOf : Object.getPrototypeOf) ||
        ([].__proto__ === Array.prototype
          ? function (e) {
              return e.__proto__;
            }
          : null);
    function M(e, t) {
      if (e === 1 / 0 || e === -1 / 0 || e != e || (e && e > -1e3 && e < 1e3) || C.call(/e/, t))
        return t;
      var r = /[0-9](?=(?:[0-9]{3})+(?![0-9]))/g;
      if ('number' == typeof e) {
        var n = e < 0 ? -x(-e) : x(e);
        if (n !== e) {
          var a = String(n),
            i = g.call(t, a.length + 1);
          return b.call(a, r, '$&_') + '.' + b.call(b.call(i, /([0-9]{3})/g, '$&_'), /_$/, '');
        }
      }
      return b.call(t, r, '$&_');
    }
    var N = {},
      T = N.custom,
      j = z(T) ? T : null,
      I = { __proto__: null, double: '"', single: "'" },
      $ = { __proto__: null, double: /(["\\])/g, single: /(['\\])/g };
    function q(e, t, r) {
      var n = I[r.quoteStyle || t];
      return n + e + n;
    }
    function U(e) {
      return !_ || !('object' == typeof e && (_ in e || void 0 !== e[_]));
    }
    function K(e) {
      return '[object Array]' === H(e) && U(e);
    }
    function Q(e) {
      return '[object RegExp]' === H(e) && U(e);
    }
    function z(e) {
      if (F) return e && 'object' == typeof e && e instanceof Symbol;
      if ('symbol' == typeof e) return !0;
      if (!e || 'object' != typeof e || !k) return !1;
      try {
        return (k.call(e), !0);
      } catch (e) {}
      return !1;
    }
    t.exports = function t(r, n, a, s) {
      var l,
        m,
        E,
        C,
        x,
        A = n || {};
      if (W(A, 'quoteStyle') && !W(I, A.quoteStyle))
        throw TypeError('option "quoteStyle" must be "single" or "double"');
      if (
        W(A, 'maxStringLength') &&
        ('number' == typeof A.maxStringLength
          ? A.maxStringLength < 0 && A.maxStringLength !== 1 / 0
          : null !== A.maxStringLength)
      )
        throw TypeError(
          'option "maxStringLength", if provided, must be a positive integer, Infinity, or `null`',
        );
      var T = !W(A, 'customInspect') || A.customInspect;
      if ('boolean' != typeof T && 'symbol' !== T)
        throw TypeError(
          'option "customInspect", if provided, must be `true`, `false`, or `\'symbol\'`',
        );
      if (
        W(A, 'indent') &&
        null !== A.indent &&
        '	' !== A.indent &&
        !(parseInt(A.indent, 10) === A.indent && A.indent > 0)
      )
        throw TypeError('option "indent" must be "\\t", an integer > 0, or `null`');
      if (W(A, 'numericSeparator') && 'boolean' != typeof A.numericSeparator)
        throw TypeError('option "numericSeparator", if provided, must be `true` or `false`');
      var B = A.numericSeparator;
      if (void 0 === r) return 'undefined';
      if (null === r) return 'null';
      if ('boolean' == typeof r) return r ? 'true' : 'false';
      if ('string' == typeof r)
        return (function e(t, r) {
          if (t.length > r.maxStringLength) {
            var n = t.length - r.maxStringLength;
            return (
              e(g.call(t, 0, r.maxStringLength), r) +
              ('... ' + n) +
              ' more character' +
              (n > 1 ? 's' : '')
            );
          }
          var a = $[r.quoteStyle || 'single'];
          return (
            (a.lastIndex = 0),
            q(b.call(b.call(t, a, '\\$1'), /[\x00-\x1f]/g, V), 'single', r)
          );
        })(r, A);
      if ('number' == typeof r) {
        if (0 === r) return 1 / 0 / r > 0 ? '0' : '-0';
        var et = String(r);
        return B ? M(r, et) : et;
      }
      if ('bigint' == typeof r) {
        var er = String(r) + 'n';
        return B ? M(r, er) : er;
      }
      var en = void 0 === A.depth ? 5 : A.depth;
      if ((void 0 === a && (a = 0), a >= en && en > 0 && 'object' == typeof r))
        return K(r) ? '[Array]' : '[Object]';
      var ea = (function (e, t) {
        var r;
        if ('	' === e.indent) r = '	';
        else {
          if ('number' != typeof e.indent || !(e.indent > 0)) return null;
          r = S.call(Array(e.indent + 1), ' ');
        }
        return { base: r, prev: S.call(Array(t + 1), r) };
      })(A, a);
      if (void 0 === s) s = [];
      else if (G(s, r) >= 0) return '[Circular]';
      function ei(e, r, n) {
        if ((r && (s = O.call(s)).push(r), n)) {
          var i = { depth: A.depth };
          return (W(A, 'quoteStyle') && (i.quoteStyle = A.quoteStyle), t(e, i, a + 1, s));
        }
        return t(e, A, a + 1, s);
      }
      if ('function' == typeof r && !Q(r)) {
        var eo = (function (e) {
            if (e.name) return e.name;
            var t = v.call(y.call(e), /^function\s*([\w$]+)/);
            return t ? t[1] : null;
          })(r),
          es = ee(r, ei);
        return (
          '[Function' +
          (eo ? ': ' + eo : ' (anonymous)') +
          ']' +
          (es.length > 0 ? ' { ' + S.call(es, ', ') + ' }' : '')
        );
      }
      if (z(r)) {
        var el = F ? b.call(String(r), /^(Symbol\(.*\))_[^)]*$/, '$1') : k.call(r);
        return 'object' != typeof r || F ? el : Z(el);
      }
      if (
        (eu = r) &&
        'object' == typeof eu &&
        (('u' > typeof HTMLElement && eu instanceof HTMLElement) ||
          ('string' == typeof eu.nodeName && 'function' == typeof eu.getAttribute))
      ) {
        for (
          var eu, ec, ed = '<' + w.call(String(r.nodeName)), ef = r.attributes || [], ep = 0;
          ep < ef.length;
          ep++
        ) {
          ed +=
            ' ' +
            ef[ep].name +
            '=' +
            q(((ec = ef[ep].value), b.call(String(ec), /"/g, '&quot;')), 'double', A);
        }
        return (
          (ed += '>'),
          r.childNodes && r.childNodes.length && (ed += '...'),
          (ed += '</' + w.call(String(r.nodeName)) + '>')
        );
      }
      if (K(r)) {
        if (0 === r.length) return '[]';
        var eh = ee(r, ei);
        return ea &&
          !(function (e) {
            for (var t = 0; t < e.length; t++) if (G(e[t], '\n') >= 0) return !1;
            return !0;
          })(eh)
          ? '[' + X(eh, ea) + ']'
          : '[ ' + S.call(eh, ', ') + ' ]';
      }
      if ('[object Error]' === H((l = r)) && U(l)) {
        var em = ee(r, ei);
        return 'cause' in Error.prototype || !('cause' in r) || R.call(r, 'cause')
          ? 0 === em.length
            ? '[' + String(r) + ']'
            : '{ [' + String(r) + '] ' + S.call(em, ', ') + ' }'
          : '{ [' + String(r) + '] ' + S.call(P.call('[cause]: ' + ei(r.cause), em), ', ') + ' }';
      }
      if ('object' == typeof r && T) {
        if (j && 'function' == typeof r[j] && N) return N(r, { depth: en - a });
        else if ('symbol' !== T && 'function' == typeof r.inspect) return r.inspect();
      }
      if (
        (function (e) {
          if (!i || !e || 'object' != typeof e) return !1;
          try {
            i.call(e);
            try {
              u.call(e);
            } catch (e) {
              return !0;
            }
            return e instanceof Map;
          } catch (e) {}
          return !1;
        })(r)
      ) {
        var ey = [];
        return (
          o &&
            o.call(r, function (e, t) {
              ey.push(ei(t, r, !0) + ' => ' + ei(e, r));
            }),
          J('Map', i.call(r), ey, ea)
        );
      }
      if (
        (function (e) {
          if (!u || !e || 'object' != typeof e) return !1;
          try {
            u.call(e);
            try {
              i.call(e);
            } catch (e) {
              return !0;
            }
            return e instanceof Set;
          } catch (e) {}
          return !1;
        })(r)
      ) {
        var ev = [];
        return (
          c &&
            c.call(r, function (e) {
              ev.push(ei(e, r));
            }),
          J('Set', u.call(r), ev, ea)
        );
      }
      if (
        (function (e) {
          if (!d || !e || 'object' != typeof e) return !1;
          try {
            d.call(e, d);
            try {
              f.call(e, f);
            } catch (e) {
              return !0;
            }
            return e instanceof WeakMap;
          } catch (e) {}
          return !1;
        })(r)
      )
        return Y('WeakMap');
      if (
        (function (e) {
          if (!f || !e || 'object' != typeof e) return !1;
          try {
            f.call(e, f);
            try {
              d.call(e, d);
            } catch (e) {
              return !0;
            }
            return e instanceof WeakSet;
          } catch (e) {}
          return !1;
        })(r)
      )
        return Y('WeakSet');
      if (
        (function (e) {
          if (!p || !e || 'object' != typeof e) return !1;
          try {
            return (p.call(e), !0);
          } catch (e) {}
          return !1;
        })(r)
      )
        return Y('WeakRef');
      if ('[object Number]' === H((m = r)) && U(m)) return Z(ei(Number(r)));
      if (
        (function (e) {
          if (!e || 'object' != typeof e || !L) return !1;
          try {
            return (L.call(e), !0);
          } catch (e) {}
          return !1;
        })(r)
      )
        return Z(ei(L.call(r)));
      if ('[object Boolean]' === H((E = r)) && U(E)) return Z(h.call(r));
      if ('[object String]' === H((C = r)) && U(C)) return Z(ei(String(r)));
      if ('u' > typeof window && r === window) return '{ [object Window] }';
      if (('u' > typeof globalThis && r === globalThis) || r === e.g)
        return '{ [object globalThis] }';
      if (!('[object Date]' === H((x = r)) && U(x)) && !Q(r)) {
        var eg = ee(r, ei),
          eb = D ? D(r) === Object.prototype : r instanceof Object || r.constructor === Object,
          eE = r instanceof Object ? '' : 'null prototype',
          ew = !eb && _ && Object(r) === r && _ in r ? g.call(H(r), 8, -1) : eE ? 'Object' : '',
          eC =
            (eb || 'function' != typeof r.constructor
              ? ''
              : r.constructor.name
                ? r.constructor.name + ' '
                : '') + (ew || eE ? '[' + S.call(P.call([], ew || [], eE || []), ': ') + '] ' : '');
        return 0 === eg.length
          ? eC + '{}'
          : ea
            ? eC + '{' + X(eg, ea) + '}'
            : eC + '{ ' + S.call(eg, ', ') + ' }';
      }
      return String(r);
    };
    var B =
      Object.prototype.hasOwnProperty ||
      function (e) {
        return e in this;
      };
    function W(e, t) {
      return B.call(e, t);
    }
    function H(e) {
      return m.call(e);
    }
    function G(e, t) {
      if (e.indexOf) return e.indexOf(t);
      for (var r = 0, n = e.length; r < n; r++) if (e[r] === t) return r;
      return -1;
    }
    function V(e) {
      var t = e.charCodeAt(0),
        r = { 8: 'b', 9: 't', 10: 'n', 12: 'f', 13: 'r' }[t];
      return r ? '\\' + r : '\\x' + (t < 16 ? '0' : '') + E.call(t.toString(16));
    }
    function Z(e) {
      return 'Object(' + e + ')';
    }
    function Y(e) {
      return e + ' { ? }';
    }
    function J(e, t, r, n) {
      return e + ' (' + t + ') {' + (n ? X(r, n) : S.call(r, ', ')) + '}';
    }
    function X(e, t) {
      if (0 === e.length) return '';
      var r = '\n' + t.prev + t.base;
      return r + S.call(e, ',' + r) + '\n' + t.prev;
    }
    function ee(e, t) {
      var r,
        n = K(e),
        a = [];
      if (n) {
        a.length = e.length;
        for (var i = 0; i < e.length; i++) a[i] = W(e, i) ? t(e[i], e) : '';
      }
      var o = 'function' == typeof A ? A(e) : [];
      if (F) {
        r = {};
        for (var s = 0; s < o.length; s++) r['$' + o[s]] = o[s];
      }
      for (var l in e)
        if (W(e, l) && (!n || String(Number(l)) !== l || !(l < e.length)))
          if (F && r['$' + l] instanceof Symbol) continue;
          else
            C.call(/[^\w$]/, l)
              ? a.push(t(l, e) + ': ' + t(e[l], e))
              : a.push(l + ': ' + t(e[l], e));
      if ('function' == typeof A)
        for (var u = 0; u < o.length; u++)
          R.call(e, o[u]) && a.push('[' + t(o[u]) + ']: ' + t(e[o[u]], e));
      return a;
    }
  },
  44241,
  (e, t, r) => {
    'use strict';
    var n = e.r(88014),
      a = e.r(49396),
      i = function (e, t, r) {
        for (var n, a = e; null != (n = a.next); a = n)
          if (n.key === t) return ((a.next = n.next), r || ((n.next = e.next), (e.next = n)), n);
      },
      o = function (e, t) {
        if (e) {
          var r = i(e, t);
          return r && r.value;
        }
      },
      s = function (e, t, r) {
        var n = i(e, t);
        n ? (n.value = r) : (e.next = { key: t, next: e.next, value: r });
      },
      l = function (e, t) {
        if (e) return i(e, t, !0);
      };
    t.exports = function () {
      var e,
        t = {
          assert: function (e) {
            if (!t.has(e)) throw new a('Side channel does not contain ' + n(e));
          },
          delete: function (t) {
            var r = l(e, t);
            return (r && e && !e.next && (e = void 0), !!r);
          },
          get: function (t) {
            return o(e, t);
          },
          has: function (t) {
            var r;
            return !!(r = e) && !!i(r, t);
          },
          set: function (t, r) {
            (e || (e = { next: void 0 }), s(e, t, r));
          },
        };
      return t;
    };
  },
  52629,
  (e, t, r) => {
    'use strict';
    t.exports = Object;
  },
  89102,
  (e, t, r) => {
    'use strict';
    t.exports = Error;
  },
  34936,
  (e, t, r) => {
    'use strict';
    t.exports = EvalError;
  },
  19643,
  (e, t, r) => {
    'use strict';
    t.exports = RangeError;
  },
  26664,
  (e, t, r) => {
    'use strict';
    t.exports = ReferenceError;
  },
  85472,
  (e, t, r) => {
    'use strict';
    t.exports = SyntaxError;
  },
  50360,
  (e, t, r) => {
    'use strict';
    t.exports = URIError;
  },
  19053,
  (e, t, r) => {
    'use strict';
    t.exports = Math.abs;
  },
  57668,
  (e, t, r) => {
    'use strict';
    t.exports = Math.floor;
  },
  97772,
  (e, t, r) => {
    'use strict';
    t.exports = Math.max;
  },
  98478,
  (e, t, r) => {
    'use strict';
    t.exports = Math.min;
  },
  94209,
  (e, t, r) => {
    'use strict';
    t.exports = Math.pow;
  },
  94801,
  (e, t, r) => {
    'use strict';
    t.exports = Math.round;
  },
  46545,
  (e, t, r) => {
    'use strict';
    t.exports =
      Number.isNaN ||
      function (e) {
        return e != e;
      };
  },
  59815,
  (e, t, r) => {
    'use strict';
    var n = e.r(46545);
    t.exports = function (e) {
      return n(e) || 0 === e ? e : e < 0 ? -1 : 1;
    };
  },
  94459,
  (e, t, r) => {
    'use strict';
    t.exports = Object.getOwnPropertyDescriptor;
  },
  7237,
  (e, t, r) => {
    'use strict';
    var n = e.r(94459);
    if (n)
      try {
        n([], 'length');
      } catch (e) {
        n = null;
      }
    t.exports = n;
  },
  228,
  (e, t, r) => {
    'use strict';
    var n = Object.defineProperty || !1;
    if (n)
      try {
        n({}, 'a', { value: 1 });
      } catch (e) {
        n = !1;
      }
    t.exports = n;
  },
  99043,
  (e, t, r) => {
    'use strict';
    t.exports = function () {
      if ('function' != typeof Symbol || 'function' != typeof Object.getOwnPropertySymbols)
        return !1;
      if ('symbol' == typeof Symbol.iterator) return !0;
      var e = {},
        t = Symbol('test'),
        r = Object(t);
      if (
        'string' == typeof t ||
        '[object Symbol]' !== Object.prototype.toString.call(t) ||
        '[object Symbol]' !== Object.prototype.toString.call(r)
      )
        return !1;
      for (var n in ((e[t] = 42), e)) return !1;
      if (
        ('function' == typeof Object.keys && 0 !== Object.keys(e).length) ||
        ('function' == typeof Object.getOwnPropertyNames &&
          0 !== Object.getOwnPropertyNames(e).length)
      )
        return !1;
      var a = Object.getOwnPropertySymbols(e);
      if (1 !== a.length || a[0] !== t || !Object.prototype.propertyIsEnumerable.call(e, t))
        return !1;
      if ('function' == typeof Object.getOwnPropertyDescriptor) {
        var i = Object.getOwnPropertyDescriptor(e, t);
        if (42 !== i.value || !0 !== i.enumerable) return !1;
      }
      return !0;
    };
  },
  49752,
  (e, t, r) => {
    'use strict';
    var n = 'u' > typeof Symbol && Symbol,
      a = e.r(99043);
    t.exports = function () {
      return (
        'function' == typeof n &&
        'function' == typeof Symbol &&
        'symbol' == typeof n('foo') &&
        'symbol' == typeof Symbol('bar') &&
        a()
      );
    };
  },
  75397,
  (e, t, r) => {
    'use strict';
    t.exports = ('u' > typeof Reflect && Reflect.getPrototypeOf) || null;
  },
  1292,
  (e, t, r) => {
    'use strict';
    t.exports = e.r(52629).getPrototypeOf || null;
  },
  1793,
  (e, t, r) => {
    'use strict';
    var n = Object.prototype.toString,
      a = Math.max,
      i = function (e, t) {
        for (var r = [], n = 0; n < e.length; n += 1) r[n] = e[n];
        for (var a = 0; a < t.length; a += 1) r[a + e.length] = t[a];
        return r;
      },
      o = function (e, t) {
        for (var r = [], n = t || 0, a = 0; n < e.length; n += 1, a += 1) r[a] = e[n];
        return r;
      },
      s = function (e, t) {
        for (var r = '', n = 0; n < e.length; n += 1) ((r += e[n]), n + 1 < e.length && (r += t));
        return r;
      };
    t.exports = function (e) {
      var t,
        r = this;
      if ('function' != typeof r || '[object Function]' !== n.apply(r))
        throw TypeError('Function.prototype.bind called on incompatible ' + r);
      for (var l = o(arguments, 1), u = a(0, r.length - l.length), c = [], d = 0; d < u; d++)
        c[d] = '$' + d;
      if (
        ((t = Function(
          'binder',
          'return function (' + s(c, ',') + '){ return binder.apply(this,arguments); }',
        )(function () {
          if (this instanceof t) {
            var n = r.apply(this, i(l, arguments));
            return Object(n) === n ? n : this;
          }
          return r.apply(e, i(l, arguments));
        })),
        r.prototype)
      ) {
        var f = function () {};
        ((f.prototype = r.prototype), (t.prototype = new f()), (f.prototype = null));
      }
      return t;
    };
  },
  51025,
  (e, t, r) => {
    'use strict';
    var n = e.r(1793);
    t.exports = Function.prototype.bind || n;
  },
  70212,
  (e, t, r) => {
    'use strict';
    t.exports = Function.prototype.call;
  },
  42936,
  (e, t, r) => {
    'use strict';
    t.exports = Function.prototype.apply;
  },
  5078,
  (e, t, r) => {
    'use strict';
    t.exports = 'u' > typeof Reflect && Reflect && Reflect.apply;
  },
  59745,
  (e, t, r) => {
    'use strict';
    var n = e.r(51025),
      a = e.r(42936),
      i = e.r(70212);
    t.exports = e.r(5078) || n.call(i, a);
  },
  64217,
  (e, t, r) => {
    'use strict';
    var n = e.r(51025),
      a = e.r(49396),
      i = e.r(70212),
      o = e.r(59745);
    t.exports = function (e) {
      if (e.length < 1 || 'function' != typeof e[0]) throw new a('a function is required');
      return o(n, i, e);
    };
  },
  39939,
  (e, t, r) => {
    'use strict';
    var n,
      a = e.r(64217),
      i = e.r(7237);
    try {
      n = [].__proto__ === Array.prototype;
    } catch (e) {
      if (!e || 'object' != typeof e || !('code' in e) || 'ERR_PROTO_ACCESS' !== e.code) throw e;
    }
    var o = !!n && i && i(Object.prototype, '__proto__'),
      s = Object,
      l = s.getPrototypeOf;
    t.exports =
      o && 'function' == typeof o.get
        ? a([o.get])
        : 'function' == typeof l &&
          function (e) {
            return l(null == e ? e : s(e));
          };
  },
  79458,
  (e, t, r) => {
    'use strict';
    var n = e.r(75397),
      a = e.r(1292),
      i = e.r(39939);
    t.exports = n
      ? function (e) {
          return n(e);
        }
      : a
        ? function (e) {
            if (!e || ('object' != typeof e && 'function' != typeof e))
              throw TypeError('getProto: not an object');
            return a(e);
          }
        : i
          ? function (e) {
              return i(e);
            }
          : null;
  },
  93747,
  (e, t, r) => {
    'use strict';
    var n = Function.prototype.call,
      a = Object.prototype.hasOwnProperty;
    t.exports = e.r(51025).call(n, a);
  },
  89891,
  (e, t, r) => {
    'use strict';
    var n = e.r(52629),
      a = e.r(89102),
      i = e.r(34936),
      o = e.r(19643),
      s = e.r(26664),
      l = e.r(85472),
      u = e.r(49396),
      c = e.r(50360),
      d = e.r(19053),
      f = e.r(57668),
      p = e.r(97772),
      h = e.r(98478),
      m = e.r(94209),
      y = e.r(94801),
      v = e.r(59815),
      g = Function,
      b = function (e) {
        try {
          return g('"use strict"; return (' + e + ').constructor;')();
        } catch (e) {}
      },
      E = e.r(7237),
      w = e.r(228),
      C = function () {
        throw new u();
      },
      P = E
        ? (function () {
            try {
              return (arguments.callee, C);
            } catch (e) {
              try {
                return E(arguments, 'callee').get;
              } catch (e) {
                return C;
              }
            }
          })()
        : C,
      S = e.r(49752)(),
      O = e.r(79458),
      x = e.r(1292),
      L = e.r(75397),
      A = e.r(42936),
      k = e.r(70212),
      F = {},
      _ = 'u' > typeof Uint8Array && O ? O(Uint8Array) : void 0,
      R = {
        __proto__: null,
        '%AggregateError%': 'u' < typeof AggregateError ? void 0 : AggregateError,
        '%Array%': Array,
        '%ArrayBuffer%': 'u' < typeof ArrayBuffer ? void 0 : ArrayBuffer,
        '%ArrayIteratorPrototype%': S && O ? O([][Symbol.iterator]()) : void 0,
        '%AsyncFromSyncIteratorPrototype%': void 0,
        '%AsyncFunction%': F,
        '%AsyncGenerator%': F,
        '%AsyncGeneratorFunction%': F,
        '%AsyncIteratorPrototype%': F,
        '%Atomics%': 'u' < typeof Atomics ? void 0 : Atomics,
        '%BigInt%': 'u' < typeof BigInt ? void 0 : BigInt,
        '%BigInt64Array%': 'u' < typeof BigInt64Array ? void 0 : BigInt64Array,
        '%BigUint64Array%': 'u' < typeof BigUint64Array ? void 0 : BigUint64Array,
        '%Boolean%': Boolean,
        '%DataView%': 'u' < typeof DataView ? void 0 : DataView,
        '%Date%': Date,
        '%decodeURI%': decodeURI,
        '%decodeURIComponent%': decodeURIComponent,
        '%encodeURI%': encodeURI,
        '%encodeURIComponent%': encodeURIComponent,
        '%Error%': a,
        '%eval%': eval,
        '%EvalError%': i,
        '%Float16Array%': 'u' < typeof Float16Array ? void 0 : Float16Array,
        '%Float32Array%': 'u' < typeof Float32Array ? void 0 : Float32Array,
        '%Float64Array%': 'u' < typeof Float64Array ? void 0 : Float64Array,
        '%FinalizationRegistry%': 'u' < typeof FinalizationRegistry ? void 0 : FinalizationRegistry,
        '%Function%': g,
        '%GeneratorFunction%': F,
        '%Int8Array%': 'u' < typeof Int8Array ? void 0 : Int8Array,
        '%Int16Array%': 'u' < typeof Int16Array ? void 0 : Int16Array,
        '%Int32Array%': 'u' < typeof Int32Array ? void 0 : Int32Array,
        '%isFinite%': isFinite,
        '%isNaN%': isNaN,
        '%IteratorPrototype%': S && O ? O(O([][Symbol.iterator]())) : void 0,
        '%JSON%': 'object' == typeof JSON ? JSON : void 0,
        '%Map%': 'u' < typeof Map ? void 0 : Map,
        '%MapIteratorPrototype%':
          'u' > typeof Map && S && O ? O(new Map()[Symbol.iterator]()) : void 0,
        '%Math%': Math,
        '%Number%': Number,
        '%Object%': n,
        '%Object.getOwnPropertyDescriptor%': E,
        '%parseFloat%': parseFloat,
        '%parseInt%': parseInt,
        '%Promise%': 'u' < typeof Promise ? void 0 : Promise,
        '%Proxy%': 'u' < typeof Proxy ? void 0 : Proxy,
        '%RangeError%': o,
        '%ReferenceError%': s,
        '%Reflect%': 'u' < typeof Reflect ? void 0 : Reflect,
        '%RegExp%': RegExp,
        '%Set%': 'u' < typeof Set ? void 0 : Set,
        '%SetIteratorPrototype%':
          'u' > typeof Set && S && O ? O(new Set()[Symbol.iterator]()) : void 0,
        '%SharedArrayBuffer%': 'u' < typeof SharedArrayBuffer ? void 0 : SharedArrayBuffer,
        '%String%': String,
        '%StringIteratorPrototype%': S && O ? O(''[Symbol.iterator]()) : void 0,
        '%Symbol%': S ? Symbol : void 0,
        '%SyntaxError%': l,
        '%ThrowTypeError%': P,
        '%TypedArray%': _,
        '%TypeError%': u,
        '%Uint8Array%': 'u' < typeof Uint8Array ? void 0 : Uint8Array,
        '%Uint8ClampedArray%': 'u' < typeof Uint8ClampedArray ? void 0 : Uint8ClampedArray,
        '%Uint16Array%': 'u' < typeof Uint16Array ? void 0 : Uint16Array,
        '%Uint32Array%': 'u' < typeof Uint32Array ? void 0 : Uint32Array,
        '%URIError%': c,
        '%WeakMap%': 'u' < typeof WeakMap ? void 0 : WeakMap,
        '%WeakRef%': 'u' < typeof WeakRef ? void 0 : WeakRef,
        '%WeakSet%': 'u' < typeof WeakSet ? void 0 : WeakSet,
        '%Function.prototype.call%': k,
        '%Function.prototype.apply%': A,
        '%Object.defineProperty%': w,
        '%Object.getPrototypeOf%': x,
        '%Math.abs%': d,
        '%Math.floor%': f,
        '%Math.max%': p,
        '%Math.min%': h,
        '%Math.pow%': m,
        '%Math.round%': y,
        '%Math.sign%': v,
        '%Reflect.getPrototypeOf%': L,
      };
    if (O)
      try {
        null.error;
      } catch (e) {
        var D = O(O(e));
        R['%Error.prototype%'] = D;
      }
    var M = function e(t) {
        var r;
        if ('%AsyncFunction%' === t) r = b('async function () {}');
        else if ('%GeneratorFunction%' === t) r = b('function* () {}');
        else if ('%AsyncGeneratorFunction%' === t) r = b('async function* () {}');
        else if ('%AsyncGenerator%' === t) {
          var n = e('%AsyncGeneratorFunction%');
          n && (r = n.prototype);
        } else if ('%AsyncIteratorPrototype%' === t) {
          var a = e('%AsyncGenerator%');
          a && O && (r = O(a.prototype));
        }
        return ((R[t] = r), r);
      },
      N = {
        __proto__: null,
        '%ArrayBufferPrototype%': ['ArrayBuffer', 'prototype'],
        '%ArrayPrototype%': ['Array', 'prototype'],
        '%ArrayProto_entries%': ['Array', 'prototype', 'entries'],
        '%ArrayProto_forEach%': ['Array', 'prototype', 'forEach'],
        '%ArrayProto_keys%': ['Array', 'prototype', 'keys'],
        '%ArrayProto_values%': ['Array', 'prototype', 'values'],
        '%AsyncFunctionPrototype%': ['AsyncFunction', 'prototype'],
        '%AsyncGenerator%': ['AsyncGeneratorFunction', 'prototype'],
        '%AsyncGeneratorPrototype%': ['AsyncGeneratorFunction', 'prototype', 'prototype'],
        '%BooleanPrototype%': ['Boolean', 'prototype'],
        '%DataViewPrototype%': ['DataView', 'prototype'],
        '%DatePrototype%': ['Date', 'prototype'],
        '%ErrorPrototype%': ['Error', 'prototype'],
        '%EvalErrorPrototype%': ['EvalError', 'prototype'],
        '%Float32ArrayPrototype%': ['Float32Array', 'prototype'],
        '%Float64ArrayPrototype%': ['Float64Array', 'prototype'],
        '%FunctionPrototype%': ['Function', 'prototype'],
        '%Generator%': ['GeneratorFunction', 'prototype'],
        '%GeneratorPrototype%': ['GeneratorFunction', 'prototype', 'prototype'],
        '%Int8ArrayPrototype%': ['Int8Array', 'prototype'],
        '%Int16ArrayPrototype%': ['Int16Array', 'prototype'],
        '%Int32ArrayPrototype%': ['Int32Array', 'prototype'],
        '%JSONParse%': ['JSON', 'parse'],
        '%JSONStringify%': ['JSON', 'stringify'],
        '%MapPrototype%': ['Map', 'prototype'],
        '%NumberPrototype%': ['Number', 'prototype'],
        '%ObjectPrototype%': ['Object', 'prototype'],
        '%ObjProto_toString%': ['Object', 'prototype', 'toString'],
        '%ObjProto_valueOf%': ['Object', 'prototype', 'valueOf'],
        '%PromisePrototype%': ['Promise', 'prototype'],
        '%PromiseProto_then%': ['Promise', 'prototype', 'then'],
        '%Promise_all%': ['Promise', 'all'],
        '%Promise_reject%': ['Promise', 'reject'],
        '%Promise_resolve%': ['Promise', 'resolve'],
        '%RangeErrorPrototype%': ['RangeError', 'prototype'],
        '%ReferenceErrorPrototype%': ['ReferenceError', 'prototype'],
        '%RegExpPrototype%': ['RegExp', 'prototype'],
        '%SetPrototype%': ['Set', 'prototype'],
        '%SharedArrayBufferPrototype%': ['SharedArrayBuffer', 'prototype'],
        '%StringPrototype%': ['String', 'prototype'],
        '%SymbolPrototype%': ['Symbol', 'prototype'],
        '%SyntaxErrorPrototype%': ['SyntaxError', 'prototype'],
        '%TypedArrayPrototype%': ['TypedArray', 'prototype'],
        '%TypeErrorPrototype%': ['TypeError', 'prototype'],
        '%Uint8ArrayPrototype%': ['Uint8Array', 'prototype'],
        '%Uint8ClampedArrayPrototype%': ['Uint8ClampedArray', 'prototype'],
        '%Uint16ArrayPrototype%': ['Uint16Array', 'prototype'],
        '%Uint32ArrayPrototype%': ['Uint32Array', 'prototype'],
        '%URIErrorPrototype%': ['URIError', 'prototype'],
        '%WeakMapPrototype%': ['WeakMap', 'prototype'],
        '%WeakSetPrototype%': ['WeakSet', 'prototype'],
      },
      T = e.r(51025),
      j = e.r(93747),
      I = T.call(k, Array.prototype.concat),
      $ = T.call(A, Array.prototype.splice),
      q = T.call(k, String.prototype.replace),
      U = T.call(k, String.prototype.slice),
      K = T.call(k, RegExp.prototype.exec),
      Q =
        /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g,
      z = /\\(\\)?/g,
      B = function (e) {
        var t = U(e, 0, 1),
          r = U(e, -1);
        if ('%' === t && '%' !== r) throw new l('invalid intrinsic syntax, expected closing `%`');
        if ('%' === r && '%' !== t) throw new l('invalid intrinsic syntax, expected opening `%`');
        var n = [];
        return (
          q(e, Q, function (e, t, r, a) {
            n[n.length] = r ? q(a, z, '$1') : t || e;
          }),
          n
        );
      },
      W = function (e, t) {
        var r,
          n = e;
        if ((j(N, n) && (n = '%' + (r = N[n])[0] + '%'), j(R, n))) {
          var a = R[n];
          if ((a === F && (a = M(n)), void 0 === a && !t))
            throw new u('intrinsic ' + e + ' exists, but is not available. Please file an issue!');
          return { alias: r, name: n, value: a };
        }
        throw new l('intrinsic ' + e + ' does not exist!');
      };
    t.exports = function (e, t) {
      if ('string' != typeof e || 0 === e.length)
        throw new u('intrinsic name must be a non-empty string');
      if (arguments.length > 1 && 'boolean' != typeof t)
        throw new u('"allowMissing" argument must be a boolean');
      if (null === K(/^%?[^%]*%?$/, e))
        throw new l(
          '`%` may not be present anywhere but at the beginning and end of the intrinsic name',
        );
      var r = B(e),
        n = r.length > 0 ? r[0] : '',
        a = W('%' + n + '%', t),
        i = a.name,
        o = a.value,
        s = !1,
        c = a.alias;
      c && ((n = c[0]), $(r, I([0, 1], c)));
      for (var d = 1, f = !0; d < r.length; d += 1) {
        var p = r[d],
          h = U(p, 0, 1),
          m = U(p, -1);
        if (('"' === h || "'" === h || '`' === h || '"' === m || "'" === m || '`' === m) && h !== m)
          throw new l('property names with quotes must have matching quotes');
        if ((('constructor' !== p && f) || (s = !0), (n += '.' + p), j(R, (i = '%' + n + '%'))))
          o = R[i];
        else if (null != o) {
          if (!(p in o)) {
            if (!t)
              throw new u(
                'base intrinsic for ' + e + ' exists, but the property is not available.',
              );
            return;
          }
          if (E && d + 1 >= r.length) {
            var y = E(o, p);
            o = (f = !!y) && 'get' in y && !('originalValue' in y.get) ? y.get : o[p];
          } else ((f = j(o, p)), (o = o[p]));
          f && !s && (R[i] = o);
        }
      }
      return o;
    };
  },
  98273,
  (e, t, r) => {
    'use strict';
    var n = e.r(89891),
      a = e.r(64217),
      i = a([n('%String.prototype.indexOf%')]);
    t.exports = function (e, t) {
      var r = n(e, !!t);
      return 'function' == typeof r && i(e, '.prototype.') > -1 ? a([r]) : r;
    };
  },
  22030,
  (e, t, r) => {
    'use strict';
    var n = e.r(89891),
      a = e.r(98273),
      i = e.r(88014),
      o = e.r(49396),
      s = n('%Map%', !0),
      l = a('Map.prototype.get', !0),
      u = a('Map.prototype.set', !0),
      c = a('Map.prototype.has', !0),
      d = a('Map.prototype.delete', !0),
      f = a('Map.prototype.size', !0);
    t.exports =
      !!s &&
      function () {
        var e,
          t = {
            assert: function (e) {
              if (!t.has(e)) throw new o('Side channel does not contain ' + i(e));
            },
            delete: function (t) {
              if (e) {
                var r = d(e, t);
                return (0 === f(e) && (e = void 0), r);
              }
              return !1;
            },
            get: function (t) {
              if (e) return l(e, t);
            },
            has: function (t) {
              return !!e && c(e, t);
            },
            set: function (t, r) {
              (e || (e = new s()), u(e, t, r));
            },
          };
        return t;
      };
  },
  57020,
  (e, t, r) => {
    'use strict';
    var n = e.r(89891),
      a = e.r(98273),
      i = e.r(88014),
      o = e.r(22030),
      s = e.r(49396),
      l = n('%WeakMap%', !0),
      u = a('WeakMap.prototype.get', !0),
      c = a('WeakMap.prototype.set', !0),
      d = a('WeakMap.prototype.has', !0),
      f = a('WeakMap.prototype.delete', !0);
    t.exports = l
      ? function () {
          var e,
            t,
            r = {
              assert: function (e) {
                if (!r.has(e)) throw new s('Side channel does not contain ' + i(e));
              },
              delete: function (r) {
                if (l && r && ('object' == typeof r || 'function' == typeof r)) {
                  if (e) return f(e, r);
                } else if (o && t) return t.delete(r);
                return !1;
              },
              get: function (r) {
                return l && r && ('object' == typeof r || 'function' == typeof r) && e
                  ? u(e, r)
                  : t && t.get(r);
              },
              has: function (r) {
                return l && r && ('object' == typeof r || 'function' == typeof r) && e
                  ? d(e, r)
                  : !!t && t.has(r);
              },
              set: function (r, n) {
                l && r && ('object' == typeof r || 'function' == typeof r)
                  ? (e || (e = new l()), c(e, r, n))
                  : o && (t || (t = o()), t.set(r, n));
              },
            };
          return r;
        }
      : o;
  },
  39271,
  (e, t, r) => {
    'use strict';
    var n = e.r(49396),
      a = e.r(88014),
      i = e.r(44241),
      o = e.r(22030),
      s = e.r(57020) || o || i;
    t.exports = function () {
      var e,
        t = {
          assert: function (e) {
            if (!t.has(e)) throw new n('Side channel does not contain ' + a(e));
          },
          delete: function (t) {
            return !!e && e.delete(t);
          },
          get: function (t) {
            return e && e.get(t);
          },
          has: function (t) {
            return !!e && e.has(t);
          },
          set: function (t, r) {
            (e || (e = s()), e.set(t, r));
          },
        };
      return t;
    };
  },
  16636,
  (e, t, r) => {
    'use strict';
    var n = String.prototype.replace,
      a = /%20/g,
      i = 'RFC3986';
    t.exports = {
      default: i,
      formatters: {
        RFC1738: function (e) {
          return n.call(e, a, '+');
        },
        RFC3986: function (e) {
          return String(e);
        },
      },
      RFC1738: 'RFC1738',
      RFC3986: i,
    };
  },
  41873,
  (e, t, r) => {
    'use strict';
    var n = e.r(16636),
      a = e.r(39271),
      i = Object.prototype.hasOwnProperty,
      o = Array.isArray,
      s = a(),
      l = function (e, t) {
        return (s.set(e, t), e);
      },
      u = function (e) {
        return s.has(e);
      },
      c = function (e) {
        return s.get(e);
      },
      d = function (e, t) {
        s.set(e, t);
      },
      f = (function () {
        for (var e = [], t = 0; t < 256; ++t)
          e[e.length] = '%' + ((t < 16 ? '0' : '') + t.toString(16)).toUpperCase();
        return e;
      })(),
      p = function (e) {
        for (; e.length > 1; ) {
          var t = e.pop(),
            r = t.obj[t.prop];
          if (o(r)) {
            for (var n = [], a = 0; a < r.length; ++a) void 0 !== r[a] && (n[n.length] = r[a]);
            t.obj[t.prop] = n;
          }
        }
      },
      h = function (e, t) {
        for (var r = t && t.plainObjects ? { __proto__: null } : {}, n = 0; n < e.length; ++n)
          void 0 !== e[n] && (r[n] = e[n]);
        return r;
      };
    t.exports = {
      arrayToObject: h,
      assign: function (e, t) {
        return Object.keys(t).reduce(function (e, r) {
          return ((e[r] = t[r]), e);
        }, e);
      },
      combine: function (e, t, r, n) {
        if (u(e)) {
          var a = c(e) + 1;
          return ((e[a] = t), d(e, a), e);
        }
        var i = [].concat(e, t);
        return i.length > r ? l(h(i, { plainObjects: n }), i.length - 1) : i;
      },
      compact: function (e) {
        for (var t = [{ obj: { o: e }, prop: 'o' }], r = [], n = 0; n < t.length; ++n)
          for (var a = t[n], i = a.obj[a.prop], o = Object.keys(i), s = 0; s < o.length; ++s) {
            var l = o[s],
              u = i[l];
            'object' == typeof u &&
              null !== u &&
              -1 === r.indexOf(u) &&
              ((t[t.length] = { obj: i, prop: l }), (r[r.length] = u));
          }
        return (p(t), e);
      },
      decode: function (e, t, r) {
        var n = e.replace(/\+/g, ' ');
        if ('iso-8859-1' === r) return n.replace(/%[0-9a-f]{2}/gi, unescape);
        try {
          return decodeURIComponent(n);
        } catch (e) {
          return n;
        }
      },
      encode: function (e, t, r, a, i) {
        if (0 === e.length) return e;
        var o = e;
        if (
          ('symbol' == typeof e
            ? (o = Symbol.prototype.toString.call(e))
            : 'string' != typeof e && (o = String(e)),
          'iso-8859-1' === r)
        )
          return escape(o).replace(/%u[0-9a-f]{4}/gi, function (e) {
            return '%26%23' + parseInt(e.slice(2), 16) + '%3B';
          });
        for (var s = '', l = 0; l < o.length; l += 1024) {
          for (
            var u = o.length >= 1024 ? o.slice(l, l + 1024) : o, c = [], d = 0;
            d < u.length;
            ++d
          ) {
            var p = u.charCodeAt(d);
            if (
              45 === p ||
              46 === p ||
              95 === p ||
              126 === p ||
              (p >= 48 && p <= 57) ||
              (p >= 65 && p <= 90) ||
              (p >= 97 && p <= 122) ||
              (i === n.RFC1738 && (40 === p || 41 === p))
            ) {
              c[c.length] = u.charAt(d);
              continue;
            }
            if (p < 128) {
              c[c.length] = f[p];
              continue;
            }
            if (p < 2048) {
              c[c.length] = f[192 | (p >> 6)] + f[128 | (63 & p)];
              continue;
            }
            if (p < 55296 || p >= 57344) {
              c[c.length] = f[224 | (p >> 12)] + f[128 | ((p >> 6) & 63)] + f[128 | (63 & p)];
              continue;
            }
            ((d += 1),
              (p = 65536 + (((1023 & p) << 10) | (1023 & u.charCodeAt(d)))),
              (c[c.length] =
                f[240 | (p >> 18)] +
                f[128 | ((p >> 12) & 63)] +
                f[128 | ((p >> 6) & 63)] +
                f[128 | (63 & p)]));
          }
          s += c.join('');
        }
        return s;
      },
      isBuffer: function (e) {
        return (
          !!e &&
          'object' == typeof e &&
          !!(e.constructor && e.constructor.isBuffer && e.constructor.isBuffer(e))
        );
      },
      isOverflow: u,
      isRegExp: function (e) {
        return '[object RegExp]' === Object.prototype.toString.call(e);
      },
      markOverflow: l,
      maybeMap: function (e, t) {
        if (o(e)) {
          for (var r = [], n = 0; n < e.length; n += 1) r[r.length] = t(e[n]);
          return r;
        }
        return t(e);
      },
      merge: function e(t, r, n) {
        if (!r) return t;
        if ('object' != typeof r && 'function' != typeof r) {
          if (o(t)) {
            var a = t.length;
            if (n && 'number' == typeof n.arrayLimit && a > n.arrayLimit)
              return l(h(t.concat(r), n), a);
            t[a] = r;
          } else if (!t || 'object' != typeof t) return [t, r];
          else if (u(t)) {
            var s = c(t) + 1;
            ((t[s] = r), d(t, s));
          } else {
            if (n && n.strictMerge) return [t, r];
            ((n && (n.plainObjects || n.allowPrototypes)) || !i.call(Object.prototype, r)) &&
              (t[r] = !0);
          }
          return t;
        }
        if (!t || 'object' != typeof t) {
          if (u(r)) {
            for (
              var f = Object.keys(r),
                p = n && n.plainObjects ? { __proto__: null, 0: t } : { 0: t },
                m = 0;
              m < f.length;
              m++
            )
              p[parseInt(f[m], 10) + 1] = r[f[m]];
            return l(p, c(r) + 1);
          }
          var y = [t].concat(r);
          return n && 'number' == typeof n.arrayLimit && y.length > n.arrayLimit
            ? l(h(y, n), y.length - 1)
            : y;
        }
        var v = t;
        return (o(t) && !o(r) && (v = h(t, n)), o(t) && o(r))
          ? (r.forEach(function (r, a) {
              if (i.call(t, a)) {
                var o = t[a];
                o && 'object' == typeof o && r && 'object' == typeof r
                  ? (t[a] = e(o, r, n))
                  : (t[t.length] = r);
              } else t[a] = r;
            }),
            t)
          : Object.keys(r).reduce(function (t, a) {
              var o = r[a];
              if (
                (i.call(t, a) ? (t[a] = e(t[a], o, n)) : (t[a] = o),
                u(r) && !u(t) && l(t, c(r)),
                u(t))
              ) {
                var s = parseInt(a, 10);
                String(s) === a && s >= 0 && s > c(t) && d(t, s);
              }
              return t;
            }, v);
      },
    };
  },
  44719,
  (e, t, r) => {
    'use strict';
    var n = e.r(39271),
      a = e.r(41873),
      i = e.r(16636),
      o = Object.prototype.hasOwnProperty,
      s = {
        brackets: function (e) {
          return e + '[]';
        },
        comma: 'comma',
        indices: function (e, t) {
          return e + '[' + t + ']';
        },
        repeat: function (e) {
          return e;
        },
      },
      l = Array.isArray,
      u = Array.prototype.push,
      c = function (e, t) {
        u.apply(e, l(t) ? t : [t]);
      },
      d = Date.prototype.toISOString,
      f = i.default,
      p = {
        addQueryPrefix: !1,
        allowDots: !1,
        allowEmptyArrays: !1,
        arrayFormat: 'indices',
        charset: 'utf-8',
        charsetSentinel: !1,
        commaRoundTrip: !1,
        delimiter: '&',
        encode: !0,
        encodeDotInKeys: !1,
        encoder: a.encode,
        encodeValuesOnly: !1,
        filter: void 0,
        format: f,
        formatter: i.formatters[f],
        indices: !1,
        serializeDate: function (e) {
          return d.call(e);
        },
        skipNulls: !1,
        strictNullHandling: !1,
      },
      h = {},
      m = function e(t, r, i, o, s, u, d, f, m, y, v, g, b, E, w, C, P, S) {
        for (var O, x, L = t, A = S, k = 0, F = !1; void 0 !== (A = A.get(h)) && !F; ) {
          var _ = A.get(t);
          if (((k += 1), void 0 !== _))
            if (_ === k) throw RangeError('Cyclic object value');
            else F = !0;
          void 0 === A.get(h) && (k = 0);
        }
        if (
          ('function' == typeof y
            ? (L = y(r, L))
            : L instanceof Date
              ? (L = b(L))
              : 'comma' === i &&
                l(L) &&
                (L = a.maybeMap(L, function (e) {
                  return e instanceof Date ? b(e) : e;
                })),
          null === L)
        ) {
          if (u) return m && !C ? m(r, p.encoder, P, 'key', E) : r;
          L = '';
        }
        if (
          'string' == typeof (O = L) ||
          'number' == typeof O ||
          'boolean' == typeof O ||
          'symbol' == typeof O ||
          'bigint' == typeof O ||
          a.isBuffer(L)
        )
          return m
            ? [w(C ? r : m(r, p.encoder, P, 'key', E)) + '=' + w(m(L, p.encoder, P, 'value', E))]
            : [w(r) + '=' + w(String(L))];
        var R = [];
        if (void 0 === L) return R;
        if ('comma' === i && l(L))
          (C && m && (L = a.maybeMap(L, m)),
            (x = [{ value: L.length > 0 ? L.join(',') || null : void 0 }]));
        else if (l(y)) x = y;
        else {
          var D = Object.keys(L);
          x = v ? D.sort(v) : D;
        }
        var M = f ? String(r).replace(/\./g, '%2E') : String(r),
          N = o && l(L) && 1 === L.length ? M + '[]' : M;
        if (s && l(L) && 0 === L.length) return N + '[]';
        for (var T = 0; T < x.length; ++T) {
          var j = x[T],
            I = 'object' == typeof j && j && void 0 !== j.value ? j.value : L[j];
          if (!d || null !== I) {
            var $ = g && f ? String(j).replace(/\./g, '%2E') : String(j),
              q = l(L) ? ('function' == typeof i ? i(N, $) : N) : N + (g ? '.' + $ : '[' + $ + ']');
            S.set(t, k);
            var U = n();
            (U.set(h, S),
              c(
                R,
                e(
                  I,
                  q,
                  i,
                  o,
                  s,
                  u,
                  d,
                  f,
                  'comma' === i && C && l(L) ? null : m,
                  y,
                  v,
                  g,
                  b,
                  E,
                  w,
                  C,
                  P,
                  U,
                ),
              ));
          }
        }
        return R;
      },
      y = function (e) {
        if (!e) return p;
        if (void 0 !== e.allowEmptyArrays && 'boolean' != typeof e.allowEmptyArrays)
          throw TypeError('`allowEmptyArrays` option can only be `true` or `false`, when provided');
        if (void 0 !== e.encodeDotInKeys && 'boolean' != typeof e.encodeDotInKeys)
          throw TypeError('`encodeDotInKeys` option can only be `true` or `false`, when provided');
        if (null !== e.encoder && void 0 !== e.encoder && 'function' != typeof e.encoder)
          throw TypeError('Encoder has to be a function.');
        var t,
          r = e.charset || p.charset;
        if (void 0 !== e.charset && 'utf-8' !== e.charset && 'iso-8859-1' !== e.charset)
          throw TypeError('The charset option must be either utf-8, iso-8859-1, or undefined');
        var n = i.default;
        if (void 0 !== e.format) {
          if (!o.call(i.formatters, e.format)) throw TypeError('Unknown format option provided.');
          n = e.format;
        }
        var a = i.formatters[n],
          u = p.filter;
        if (
          (('function' == typeof e.filter || l(e.filter)) && (u = e.filter),
          (t =
            e.arrayFormat in s
              ? e.arrayFormat
              : 'indices' in e
                ? e.indices
                  ? 'indices'
                  : 'repeat'
                : p.arrayFormat),
          'commaRoundTrip' in e && 'boolean' != typeof e.commaRoundTrip)
        )
          throw TypeError('`commaRoundTrip` must be a boolean, or absent');
        var c = void 0 === e.allowDots ? !0 === e.encodeDotInKeys || p.allowDots : !!e.allowDots;
        return {
          addQueryPrefix:
            'boolean' == typeof e.addQueryPrefix ? e.addQueryPrefix : p.addQueryPrefix,
          allowDots: c,
          allowEmptyArrays:
            'boolean' == typeof e.allowEmptyArrays ? !!e.allowEmptyArrays : p.allowEmptyArrays,
          arrayFormat: t,
          charset: r,
          charsetSentinel:
            'boolean' == typeof e.charsetSentinel ? e.charsetSentinel : p.charsetSentinel,
          commaRoundTrip: !!e.commaRoundTrip,
          delimiter: void 0 === e.delimiter ? p.delimiter : e.delimiter,
          encode: 'boolean' == typeof e.encode ? e.encode : p.encode,
          encodeDotInKeys:
            'boolean' == typeof e.encodeDotInKeys ? e.encodeDotInKeys : p.encodeDotInKeys,
          encoder: 'function' == typeof e.encoder ? e.encoder : p.encoder,
          encodeValuesOnly:
            'boolean' == typeof e.encodeValuesOnly ? e.encodeValuesOnly : p.encodeValuesOnly,
          filter: u,
          format: n,
          formatter: a,
          serializeDate: 'function' == typeof e.serializeDate ? e.serializeDate : p.serializeDate,
          skipNulls: 'boolean' == typeof e.skipNulls ? e.skipNulls : p.skipNulls,
          sort: 'function' == typeof e.sort ? e.sort : null,
          strictNullHandling:
            'boolean' == typeof e.strictNullHandling ? e.strictNullHandling : p.strictNullHandling,
        };
      };
    t.exports = function (e, t) {
      var r,
        a = e,
        i = y(t);
      'function' == typeof i.filter ? (a = (0, i.filter)('', a)) : l(i.filter) && (r = i.filter);
      var o = [];
      if ('object' != typeof a || null === a) return '';
      var u = s[i.arrayFormat],
        d = 'comma' === u && i.commaRoundTrip;
      (r || (r = Object.keys(a)), i.sort && r.sort(i.sort));
      for (var f = n(), p = 0; p < r.length; ++p) {
        var h = r[p],
          v = a[h];
        (i.skipNulls && null === v) ||
          c(
            o,
            m(
              v,
              h,
              u,
              d,
              i.allowEmptyArrays,
              i.strictNullHandling,
              i.skipNulls,
              i.encodeDotInKeys,
              i.encode ? i.encoder : null,
              i.filter,
              i.sort,
              i.allowDots,
              i.serializeDate,
              i.format,
              i.formatter,
              i.encodeValuesOnly,
              i.charset,
              f,
            ),
          );
      }
      var g = o.join(i.delimiter),
        b = !0 === i.addQueryPrefix ? '?' : '';
      return (
        i.charsetSentinel &&
          ('iso-8859-1' === i.charset ? (b += 'utf8=%26%2310003%3B&') : (b += 'utf8=%E2%9C%93&')),
        g.length > 0 ? b + g : ''
      );
    };
  },
  8711,
  (e, t, r) => {
    'use strict';
    var n = e.r(41873),
      a = Object.prototype.hasOwnProperty,
      i = Array.isArray,
      o = {
        allowDots: !1,
        allowEmptyArrays: !1,
        allowPrototypes: !1,
        allowSparse: !1,
        arrayLimit: 20,
        charset: 'utf-8',
        charsetSentinel: !1,
        comma: !1,
        decodeDotInKeys: !1,
        decoder: n.decode,
        delimiter: '&',
        depth: 5,
        duplicates: 'combine',
        ignoreQueryPrefix: !1,
        interpretNumericEntities: !1,
        parameterLimit: 1e3,
        parseArrays: !0,
        plainObjects: !1,
        strictDepth: !1,
        strictMerge: !0,
        strictNullHandling: !1,
        throwOnLimitExceeded: !1,
      },
      s = function (e, t, r) {
        if (e && 'string' == typeof e && t.comma && e.indexOf(',') > -1) return e.split(',');
        if (t.throwOnLimitExceeded && r >= t.arrayLimit)
          throw RangeError(
            'Array limit exceeded. Only ' +
              t.arrayLimit +
              ' element' +
              (1 === t.arrayLimit ? '' : 's') +
              ' allowed in an array.',
          );
        return e;
      },
      l = function (e, t) {
        var r = { __proto__: null },
          l = t.ignoreQueryPrefix ? e.replace(/^\?/, '') : e;
        l = l.replace(/%5B/gi, '[').replace(/%5D/gi, ']');
        var u = t.parameterLimit === 1 / 0 ? void 0 : t.parameterLimit,
          c = l.split(t.delimiter, t.throwOnLimitExceeded && void 0 !== u ? u + 1 : u);
        if (t.throwOnLimitExceeded && void 0 !== u && c.length > u)
          throw RangeError(
            'Parameter limit exceeded. Only ' +
              u +
              ' parameter' +
              (1 === u ? '' : 's') +
              ' allowed.',
          );
        var d = -1,
          f = t.charset;
        if (t.charsetSentinel)
          for (p = 0; p < c.length; ++p)
            0 === c[p].indexOf('utf8=') &&
              ('utf8=%E2%9C%93' === c[p]
                ? (f = 'utf-8')
                : 'utf8=%26%2310003%3B' === c[p] && (f = 'iso-8859-1'),
              (d = p),
              (p = c.length));
        for (p = 0; p < c.length; ++p)
          if (p !== d) {
            var p,
              h,
              m,
              y = c[p],
              v = y.indexOf(']='),
              g = -1 === v ? y.indexOf('=') : v + 1;
            if (
              (-1 === g
                ? ((h = t.decoder(y, o.decoder, f, 'key')), (m = t.strictNullHandling ? null : ''))
                : null !== (h = t.decoder(y.slice(0, g), o.decoder, f, 'key')) &&
                  (m = n.maybeMap(s(y.slice(g + 1), t, i(r[h]) ? r[h].length : 0), function (e) {
                    return t.decoder(e, o.decoder, f, 'value');
                  })),
              m &&
                t.interpretNumericEntities &&
                'iso-8859-1' === f &&
                (m = String(m).replace(/&#(\d+);/g, function (e, t) {
                  return String.fromCharCode(parseInt(t, 10));
                })),
              y.indexOf('[]=') > -1 && (m = i(m) ? [m] : m),
              t.comma && i(m) && m.length > t.arrayLimit)
            ) {
              if (t.throwOnLimitExceeded)
                throw RangeError(
                  'Array limit exceeded. Only ' +
                    t.arrayLimit +
                    ' element' +
                    (1 === t.arrayLimit ? '' : 's') +
                    ' allowed in an array.',
                );
              m = n.combine([], m, t.arrayLimit, t.plainObjects);
            }
            if (null !== h) {
              var b = a.call(r, h);
              b && ('combine' === t.duplicates || y.indexOf('[]=') > -1)
                ? (r[h] = n.combine(r[h], m, t.arrayLimit, t.plainObjects))
                : (b && 'last' !== t.duplicates) || (r[h] = m);
            }
          }
        return r;
      },
      u = function (e, t, r, a) {
        var i = 0;
        if (e.length > 0 && '[]' === e[e.length - 1]) {
          var o = e.slice(0, -1).join('');
          i = Array.isArray(t) && t[o] ? t[o].length : 0;
        }
        for (var l = a ? t : s(t, r, i), u = e.length - 1; u >= 0; --u) {
          var c,
            d = e[u];
          if ('[]' === d && r.parseArrays)
            c = n.isOverflow(l)
              ? l
              : r.allowEmptyArrays && ('' === l || (r.strictNullHandling && null === l))
                ? []
                : n.combine([], l, r.arrayLimit, r.plainObjects);
          else {
            c = r.plainObjects ? { __proto__: null } : {};
            var f = '[' === d.charAt(0) && ']' === d.charAt(d.length - 1) ? d.slice(1, -1) : d,
              p = r.decodeDotInKeys ? f.replace(/%2E/g, '.') : f,
              h = parseInt(p, 10),
              m = !isNaN(h) && d !== p && String(h) === p && h >= 0 && r.parseArrays;
            if (r.parseArrays || '' !== p)
              if (m && h < r.arrayLimit) (c = [])[h] = l;
              else if (m && r.throwOnLimitExceeded)
                throw RangeError(
                  'Array limit exceeded. Only ' +
                    r.arrayLimit +
                    ' element' +
                    (1 === r.arrayLimit ? '' : 's') +
                    ' allowed in an array.',
                );
              else m ? ((c[h] = l), n.markOverflow(c, h)) : '__proto__' !== p && (c[p] = l);
            else c = { 0: l };
          }
          l = c;
        }
        return l;
      },
      c = function (e, t) {
        var r = t.allowDots ? e.replace(/\.([^.[]+)/g, '[$1]') : e;
        if (t.depth <= 0) {
          if (!t.plainObjects && a.call(Object.prototype, r) && !t.allowPrototypes) return;
          return [r];
        }
        var n = /(\[[^[\]]*])/g,
          i = /(\[[^[\]]*])/.exec(r),
          o = i ? r.slice(0, i.index) : r,
          s = [];
        if (o) {
          if (!t.plainObjects && a.call(Object.prototype, o) && !t.allowPrototypes) return;
          s[s.length] = o;
        }
        for (var l = 0; null !== (i = n.exec(r)) && l < t.depth; ) {
          l += 1;
          var u = i[1].slice(1, -1);
          if (!t.plainObjects && a.call(Object.prototype, u) && !t.allowPrototypes) return;
          s[s.length] = i[1];
        }
        if (i) {
          if (!0 === t.strictDepth)
            throw RangeError(
              'Input depth exceeded depth option of ' + t.depth + ' and strictDepth is true',
            );
          s[s.length] = '[' + r.slice(i.index) + ']';
        }
        return s;
      },
      d = function (e, t, r, n) {
        if (e) {
          var a = c(e, r);
          if (a) return u(a, t, r, n);
        }
      },
      f = function (e) {
        if (!e) return o;
        if (void 0 !== e.allowEmptyArrays && 'boolean' != typeof e.allowEmptyArrays)
          throw TypeError('`allowEmptyArrays` option can only be `true` or `false`, when provided');
        if (void 0 !== e.decodeDotInKeys && 'boolean' != typeof e.decodeDotInKeys)
          throw TypeError('`decodeDotInKeys` option can only be `true` or `false`, when provided');
        if (null !== e.decoder && void 0 !== e.decoder && 'function' != typeof e.decoder)
          throw TypeError('Decoder has to be a function.');
        if (void 0 !== e.charset && 'utf-8' !== e.charset && 'iso-8859-1' !== e.charset)
          throw TypeError('The charset option must be either utf-8, iso-8859-1, or undefined');
        if (void 0 !== e.throwOnLimitExceeded && 'boolean' != typeof e.throwOnLimitExceeded)
          throw TypeError('`throwOnLimitExceeded` option must be a boolean');
        var t = void 0 === e.charset ? o.charset : e.charset,
          r = void 0 === e.duplicates ? o.duplicates : e.duplicates;
        if ('combine' !== r && 'first' !== r && 'last' !== r)
          throw TypeError('The duplicates option must be either combine, first, or last');
        return {
          allowDots:
            void 0 === e.allowDots ? !0 === e.decodeDotInKeys || o.allowDots : !!e.allowDots,
          allowEmptyArrays:
            'boolean' == typeof e.allowEmptyArrays ? !!e.allowEmptyArrays : o.allowEmptyArrays,
          allowPrototypes:
            'boolean' == typeof e.allowPrototypes ? e.allowPrototypes : o.allowPrototypes,
          allowSparse: 'boolean' == typeof e.allowSparse ? e.allowSparse : o.allowSparse,
          arrayLimit: 'number' == typeof e.arrayLimit ? e.arrayLimit : o.arrayLimit,
          charset: t,
          charsetSentinel:
            'boolean' == typeof e.charsetSentinel ? e.charsetSentinel : o.charsetSentinel,
          comma: 'boolean' == typeof e.comma ? e.comma : o.comma,
          decodeDotInKeys:
            'boolean' == typeof e.decodeDotInKeys ? e.decodeDotInKeys : o.decodeDotInKeys,
          decoder: 'function' == typeof e.decoder ? e.decoder : o.decoder,
          delimiter:
            'string' == typeof e.delimiter || n.isRegExp(e.delimiter) ? e.delimiter : o.delimiter,
          depth: 'number' == typeof e.depth || !1 === e.depth ? +e.depth : o.depth,
          duplicates: r,
          ignoreQueryPrefix: !0 === e.ignoreQueryPrefix,
          interpretNumericEntities:
            'boolean' == typeof e.interpretNumericEntities
              ? e.interpretNumericEntities
              : o.interpretNumericEntities,
          parameterLimit: 'number' == typeof e.parameterLimit ? e.parameterLimit : o.parameterLimit,
          parseArrays: !1 !== e.parseArrays,
          plainObjects: 'boolean' == typeof e.plainObjects ? e.plainObjects : o.plainObjects,
          strictDepth: 'boolean' == typeof e.strictDepth ? !!e.strictDepth : o.strictDepth,
          strictMerge: 'boolean' == typeof e.strictMerge ? !!e.strictMerge : o.strictMerge,
          strictNullHandling:
            'boolean' == typeof e.strictNullHandling ? e.strictNullHandling : o.strictNullHandling,
          throwOnLimitExceeded:
            'boolean' == typeof e.throwOnLimitExceeded && e.throwOnLimitExceeded,
        };
      };
    t.exports = function (e, t) {
      var r = f(t);
      if ('' === e || null == e) return r.plainObjects ? { __proto__: null } : {};
      for (
        var a = 'string' == typeof e ? l(e, r) : e,
          i = r.plainObjects ? { __proto__: null } : {},
          o = Object.keys(a),
          s = 0;
        s < o.length;
        ++s
      ) {
        var u = o[s],
          c = d(u, a[u], r, 'string' == typeof e);
        i = n.merge(i, c, r);
      }
      return !0 === r.allowSparse ? i : n.compact(i);
    };
  },
  37790,
  (e, t, r) => {
    'use strict';
    var n = e.r(44719),
      a = e.r(8711);
    t.exports = { formats: e.r(16636), parse: a, stringify: n };
  },
  44913,
  (e, t, r) => {
    t.exports = function (e) {};
  },
  80286,
  (e, t, r) => {
    (e.e,
      (t.exports = (function () {
        var e = [],
          t = [],
          r = {},
          n = {},
          a = {};
        function i(e) {
          return 'string' == typeof e ? RegExp('^' + e + '$', 'i') : e;
        }
        function o(e, t) {
          return e === t
            ? t
            : e === e.toLowerCase()
              ? t.toLowerCase()
              : e === e.toUpperCase()
                ? t.toUpperCase()
                : e[0] === e[0].toUpperCase()
                  ? t.charAt(0).toUpperCase() + t.substr(1).toLowerCase()
                  : t.toLowerCase();
        }
        function s(e, t, n) {
          if (!e.length || r.hasOwnProperty(e)) return t;
          for (var a = n.length; a--; ) {
            var i = n[a];
            if (i[0].test(t))
              return (function (e, t) {
                return e.replace(t[0], function (r, n) {
                  var a,
                    i,
                    s =
                      ((a = t[1]),
                      (i = arguments),
                      a.replace(/\$(\d{1,2})/g, function (e, t) {
                        return i[t] || '';
                      }));
                  return '' === r ? o(e[n - 1], s) : o(r, s);
                });
              })(t, i);
          }
          return t;
        }
        function l(e, t, r) {
          return function (n) {
            var a = n.toLowerCase();
            return t.hasOwnProperty(a) ? o(n, a) : e.hasOwnProperty(a) ? o(n, e[a]) : s(a, n, r);
          };
        }
        function u(e, t, r, n) {
          return function (n) {
            var a = n.toLowerCase();
            return !!t.hasOwnProperty(a) || (!e.hasOwnProperty(a) && s(a, a, r) === a);
          };
        }
        function c(e, t, r) {
          var n = 1 === t ? c.singular(e) : c.plural(e);
          return (r ? t + ' ' : '') + n;
        }
        return (
          (c.plural = l(a, n, e)),
          (c.isPlural = u(a, n, e)),
          (c.singular = l(n, a, t)),
          (c.isSingular = u(n, a, t)),
          (c.addPluralRule = function (t, r) {
            e.push([i(t), r]);
          }),
          (c.addSingularRule = function (e, r) {
            t.push([i(e), r]);
          }),
          (c.addUncountableRule = function (e) {
            if ('string' == typeof e) {
              r[e.toLowerCase()] = !0;
              return;
            }
            (c.addPluralRule(e, '$0'), c.addSingularRule(e, '$0'));
          }),
          (c.addIrregularRule = function (e, t) {
            ((t = t.toLowerCase()), (a[(e = e.toLowerCase())] = t), (n[t] = e));
          }),
          [
            ['I', 'we'],
            ['me', 'us'],
            ['he', 'they'],
            ['she', 'they'],
            ['them', 'them'],
            ['myself', 'ourselves'],
            ['yourself', 'yourselves'],
            ['itself', 'themselves'],
            ['herself', 'themselves'],
            ['himself', 'themselves'],
            ['themself', 'themselves'],
            ['is', 'are'],
            ['was', 'were'],
            ['has', 'have'],
            ['this', 'these'],
            ['that', 'those'],
            ['echo', 'echoes'],
            ['dingo', 'dingoes'],
            ['volcano', 'volcanoes'],
            ['tornado', 'tornadoes'],
            ['torpedo', 'torpedoes'],
            ['genus', 'genera'],
            ['viscus', 'viscera'],
            ['stigma', 'stigmata'],
            ['stoma', 'stomata'],
            ['dogma', 'dogmata'],
            ['lemma', 'lemmata'],
            ['schema', 'schemata'],
            ['anathema', 'anathemata'],
            ['ox', 'oxen'],
            ['axe', 'axes'],
            ['die', 'dice'],
            ['yes', 'yeses'],
            ['foot', 'feet'],
            ['eave', 'eaves'],
            ['goose', 'geese'],
            ['tooth', 'teeth'],
            ['quiz', 'quizzes'],
            ['human', 'humans'],
            ['proof', 'proofs'],
            ['carve', 'carves'],
            ['valve', 'valves'],
            ['looey', 'looies'],
            ['thief', 'thieves'],
            ['groove', 'grooves'],
            ['pickaxe', 'pickaxes'],
            ['passerby', 'passersby'],
          ].forEach(function (e) {
            return c.addIrregularRule(e[0], e[1]);
          }),
          [
            [/s?$/i, 's'],
            [/[^\u0000-\u007F]$/i, '$0'],
            [/([^aeiou]ese)$/i, '$1'],
            [/(ax|test)is$/i, '$1es'],
            [/(alias|[^aou]us|t[lm]as|gas|ris)$/i, '$1es'],
            [/(e[mn]u)s?$/i, '$1s'],
            [/([^l]ias|[aeiou]las|[ejzr]as|[iu]am)$/i, '$1'],
            [
              /(alumn|syllab|vir|radi|nucle|fung|cact|stimul|termin|bacill|foc|uter|loc|strat)(?:us|i)$/i,
              '$1i',
            ],
            [/(alumn|alg|vertebr)(?:a|ae)$/i, '$1ae'],
            [/(seraph|cherub)(?:im)?$/i, '$1im'],
            [/(her|at|gr)o$/i, '$1oes'],
            [
              /(agend|addend|millenni|dat|extrem|bacteri|desiderat|strat|candelabr|errat|ov|symposi|curricul|automat|quor)(?:a|um)$/i,
              '$1a',
            ],
            [
              /(apheli|hyperbat|periheli|asyndet|noumen|phenomen|criteri|organ|prolegomen|hedr|automat)(?:a|on)$/i,
              '$1a',
            ],
            [/sis$/i, 'ses'],
            [/(?:(kni|wi|li)fe|(ar|l|ea|eo|oa|hoo)f)$/i, '$1$2ves'],
            [/([^aeiouy]|qu)y$/i, '$1ies'],
            [/([^ch][ieo][ln])ey$/i, '$1ies'],
            [/(x|ch|ss|sh|zz)$/i, '$1es'],
            [/(matr|cod|mur|sil|vert|ind|append)(?:ix|ex)$/i, '$1ices'],
            [/\b((?:tit)?m|l)(?:ice|ouse)$/i, '$1ice'],
            [/(pe)(?:rson|ople)$/i, '$1ople'],
            [/(child)(?:ren)?$/i, '$1ren'],
            [/eaux$/i, '$0'],
            [/m[ae]n$/i, 'men'],
            ['thou', 'you'],
          ].forEach(function (e) {
            return c.addPluralRule(e[0], e[1]);
          }),
          [
            [/s$/i, ''],
            [/(ss)$/i, '$1'],
            [/(wi|kni|(?:after|half|high|low|mid|non|night|[^\w]|^)li)ves$/i, '$1fe'],
            [/(ar|(?:wo|[ae])l|[eo][ao])ves$/i, '$1f'],
            [/ies$/i, 'y'],
            [
              /\b([pl]|zomb|(?:neck|cross)?t|coll|faer|food|gen|goon|group|lass|talk|goal|cut)ies$/i,
              '$1ie',
            ],
            [/\b(mon|smil)ies$/i, '$1ey'],
            [/\b((?:tit)?m|l)ice$/i, '$1ouse'],
            [/(seraph|cherub)im$/i, '$1'],
            [
              /(x|ch|ss|sh|zz|tto|go|cho|alias|[^aou]us|t[lm]as|gas|(?:her|at|gr)o|[aeiou]ris)(?:es)?$/i,
              '$1',
            ],
            [/(analy|diagno|parenthe|progno|synop|the|empha|cri|ne)(?:sis|ses)$/i, '$1sis'],
            [/(movie|twelve|abuse|e[mn]u)s$/i, '$1'],
            [/(test)(?:is|es)$/i, '$1is'],
            [
              /(alumn|syllab|vir|radi|nucle|fung|cact|stimul|termin|bacill|foc|uter|loc|strat)(?:us|i)$/i,
              '$1us',
            ],
            [
              /(agend|addend|millenni|dat|extrem|bacteri|desiderat|strat|candelabr|errat|ov|symposi|curricul|quor)a$/i,
              '$1um',
            ],
            [
              /(apheli|hyperbat|periheli|asyndet|noumen|phenomen|criteri|organ|prolegomen|hedr|automat)a$/i,
              '$1on',
            ],
            [/(alumn|alg|vertebr)ae$/i, '$1a'],
            [/(cod|mur|sil|vert|ind)ices$/i, '$1ex'],
            [/(matr|append)ices$/i, '$1ix'],
            [/(pe)(rson|ople)$/i, '$1rson'],
            [/(child)ren$/i, '$1'],
            [/(eau)x?$/i, '$1'],
            [/men$/i, 'man'],
          ].forEach(function (e) {
            return c.addSingularRule(e[0], e[1]);
          }),
          [
            'adulthood',
            'advice',
            'agenda',
            'aid',
            'aircraft',
            'alcohol',
            'ammo',
            'analytics',
            'anime',
            'athletics',
            'audio',
            'bison',
            'blood',
            'bream',
            'buffalo',
            'butter',
            'carp',
            'cash',
            'chassis',
            'chess',
            'clothing',
            'cod',
            'commerce',
            'cooperation',
            'corps',
            'debris',
            'diabetes',
            'digestion',
            'elk',
            'energy',
            'equipment',
            'excretion',
            'expertise',
            'firmware',
            'flounder',
            'fun',
            'gallows',
            'garbage',
            'graffiti',
            'hardware',
            'headquarters',
            'health',
            'herpes',
            'highjinks',
            'homework',
            'housework',
            'information',
            'jeans',
            'justice',
            'kudos',
            'labour',
            'literature',
            'machinery',
            'mackerel',
            'mail',
            'media',
            'mews',
            'moose',
            'music',
            'mud',
            'manga',
            'news',
            'only',
            'personnel',
            'pike',
            'plankton',
            'pliers',
            'police',
            'pollution',
            'premises',
            'rain',
            'research',
            'rice',
            'salmon',
            'scissors',
            'series',
            'sewage',
            'shambles',
            'shrimp',
            'software',
            'species',
            'staff',
            'swine',
            'tennis',
            'traffic',
            'transportation',
            'trout',
            'tuna',
            'wealth',
            'welfare',
            'whiting',
            'wildebeest',
            'wildlife',
            'you',
            /pok[eé]mon$/i,
            /[^aeiou]ese$/i,
            /deer$/i,
            /fish$/i,
            /measles$/i,
            /o[iu]s$/i,
            /pox$/i,
            /sheep$/i,
          ].forEach(c.addUncountableRule),
          c
        );
      })()));
  },
  7125,
  (e, t, r) => {
    var n;
    let a;
    (e.e,
      (n = function e() {
        var t,
          r = 'u' > typeof self ? self : 'u' > typeof window ? window : void 0 !== r ? r : {},
          n = !r.document && !!r.postMessage,
          a = r.IS_PAPA_WORKER || !1,
          i = {},
          o = 0,
          s = {};
        function l(e) {
          ((this._handle = null),
            (this._finished = !1),
            (this._completed = !1),
            (this._halted = !1),
            (this._input = null),
            (this._baseIndex = 0),
            (this._partialLine = ''),
            (this._rowCount = 0),
            (this._start = 0),
            (this._nextChunk = null),
            (this.isFirstChunk = !0),
            (this._completeResults = { data: [], errors: [], meta: {} }),
            function (e) {
              var t = b(e);
              ((t.chunkSize = parseInt(t.chunkSize)),
                e.step || e.chunk || (t.chunkSize = null),
                (this._handle = new p(t)),
                ((this._handle.streamer = this)._config = t));
            }.call(this, e),
            (this.parseChunk = function (e, t) {
              var n = parseInt(this._config.skipFirstNLines) || 0;
              if (this.isFirstChunk && 0 < n) {
                let t = this._config.newline;
                (t ||
                  ((i = this._config.quoteChar || '"'), (t = this._handle.guessLineEndings(e, i))),
                  (e = [...e.split(t).slice(n)].join(t)));
              }
              (this.isFirstChunk &&
                w(this._config.beforeFirstChunk) &&
                void 0 !== (i = this._config.beforeFirstChunk(e)) &&
                (e = i),
                (this.isFirstChunk = !1),
                (this._halted = !1));
              var n = this._partialLine + e,
                i =
                  ((this._partialLine = ''),
                  this._handle.parse(n, this._baseIndex, !this._finished));
              if (!this._handle.paused() && !this._handle.aborted()) {
                if (
                  ((e = i.meta.cursor),
                  this._finished ||
                    ((this._partialLine = n.substring(e - this._baseIndex)), (this._baseIndex = e)),
                  i && i.data && (this._rowCount += i.data.length),
                  (n =
                    this._finished ||
                    (this._config.preview && this._rowCount >= this._config.preview)),
                  a)
                )
                  r.postMessage({ results: i, workerId: s.WORKER_ID, finished: n });
                else if (w(this._config.chunk) && !t) {
                  if (
                    (this._config.chunk(i, this._handle),
                    this._handle.paused() || this._handle.aborted())
                  )
                    return void (this._halted = !0);
                  this._completeResults = i = void 0;
                }
                return (
                  this._config.step ||
                    this._config.chunk ||
                    ((this._completeResults.data = this._completeResults.data.concat(i.data)),
                    (this._completeResults.errors = this._completeResults.errors.concat(i.errors)),
                    (this._completeResults.meta = i.meta)),
                  this._completed ||
                    !n ||
                    !w(this._config.complete) ||
                    (i && i.meta.aborted) ||
                    (this._config.complete(this._completeResults, this._input),
                    (this._completed = !0)),
                  n || (i && i.meta.paused) || this._nextChunk(),
                  i
                );
              }
              this._halted = !0;
            }),
            (this._sendError = function (e) {
              w(this._config.error)
                ? this._config.error(e)
                : a &&
                  this._config.error &&
                  r.postMessage({ workerId: s.WORKER_ID, error: e, finished: !1 });
            }));
        }
        function u(e) {
          var t;
          ((e = e || {}).chunkSize || (e.chunkSize = s.RemoteChunkSize),
            l.call(this, e),
            (this._nextChunk = n
              ? function () {
                  (this._readChunk(), this._chunkLoaded());
                }
              : function () {
                  this._readChunk();
                }),
            (this.stream = function (e) {
              ((this._input = e), this._nextChunk());
            }),
            (this._readChunk = function () {
              if (this._finished) this._chunkLoaded();
              else {
                if (
                  ((t = new XMLHttpRequest()),
                  this._config.withCredentials &&
                    (t.withCredentials = this._config.withCredentials),
                  n ||
                    ((t.onload = E(this._chunkLoaded, this)),
                    (t.onerror = E(this._chunkError, this))),
                  t.open(this._config.downloadRequestBody ? 'POST' : 'GET', this._input, !n),
                  this._config.downloadRequestHeaders)
                ) {
                  var e,
                    r,
                    a = this._config.downloadRequestHeaders;
                  for (r in a) t.setRequestHeader(r, a[r]);
                }
                this._config.chunkSize &&
                  ((e = this._start + this._config.chunkSize - 1),
                  t.setRequestHeader('Range', 'bytes=' + this._start + '-' + e));
                try {
                  t.send(this._config.downloadRequestBody);
                } catch (e) {
                  this._chunkError(e.message);
                }
                n && 0 === t.status && this._chunkError();
              }
            }),
            (this._chunkLoaded = function () {
              let e;
              4 === t.readyState &&
                (t.status < 200 || 400 <= t.status
                  ? this._chunkError()
                  : ((this._start += this._config.chunkSize || t.responseText.length),
                    (this._finished =
                      !this._config.chunkSize ||
                      this._start >=
                        (null !== (e = (e = t).getResponseHeader('Content-Range'))
                          ? parseInt(e.substring(e.lastIndexOf('/') + 1))
                          : -1)),
                    this.parseChunk(t.responseText)));
            }),
            (this._chunkError = function (e) {
              ((e = t.statusText || e), this._sendError(Error(e)));
            }));
        }
        function c(e) {
          ((e = e || {}).chunkSize || (e.chunkSize = s.LocalChunkSize), l.call(this, e));
          var t,
            r,
            n = 'u' > typeof FileReader;
          ((this.stream = function (e) {
            ((this._input = e),
              (r = e.slice || e.webkitSlice || e.mozSlice),
              n
                ? (((t = new FileReader()).onload = E(this._chunkLoaded, this)),
                  (t.onerror = E(this._chunkError, this)))
                : (t = new FileReaderSync()),
              this._nextChunk());
          }),
            (this._nextChunk = function () {
              this._finished ||
                (this._config.preview && !(this._rowCount < this._config.preview)) ||
                this._readChunk();
            }),
            (this._readChunk = function () {
              var e = this._input,
                a =
                  (this._config.chunkSize &&
                    ((a = Math.min(this._start + this._config.chunkSize, this._input.size)),
                    (e = r.call(e, this._start, a))),
                  t.readAsText(e, this._config.encoding));
              n || this._chunkLoaded({ target: { result: a } });
            }),
            (this._chunkLoaded = function (e) {
              ((this._start += this._config.chunkSize),
                (this._finished = !this._config.chunkSize || this._start >= this._input.size),
                this.parseChunk(e.target.result));
            }),
            (this._chunkError = function () {
              this._sendError(t.error);
            }));
        }
        function d(e) {
          var t;
          (l.call(this, (e = e || {})),
            (this.stream = function (e) {
              return ((t = e), this._nextChunk());
            }),
            (this._nextChunk = function () {
              var e, r;
              if (!this._finished)
                return (
                  (t = (e = this._config.chunkSize)
                    ? ((r = t.substring(0, e)), t.substring(e))
                    : ((r = t), '')),
                  (this._finished = !t),
                  this.parseChunk(r)
                );
            }));
        }
        function f(e) {
          l.call(this, (e = e || {}));
          var t = [],
            r = !0,
            n = !1;
          ((this.pause = function () {
            (l.prototype.pause.apply(this, arguments), this._input.pause());
          }),
            (this.resume = function () {
              (l.prototype.resume.apply(this, arguments), this._input.resume());
            }),
            (this.stream = function (e) {
              ((this._input = e),
                this._input.on('data', this._streamData),
                this._input.on('end', this._streamEnd),
                this._input.on('error', this._streamError));
            }),
            (this._checkIsFinished = function () {
              n && 1 === t.length && (this._finished = !0);
            }),
            (this._nextChunk = function () {
              (this._checkIsFinished(), t.length ? this.parseChunk(t.shift()) : (r = !0));
            }),
            (this._streamData = E(function (e) {
              try {
                (t.push('string' == typeof e ? e : e.toString(this._config.encoding)),
                  r && ((r = !1), this._checkIsFinished(), this.parseChunk(t.shift())));
              } catch (e) {
                this._streamError(e);
              }
            }, this)),
            (this._streamError = E(function (e) {
              (this._streamCleanUp(), this._sendError(e));
            }, this)),
            (this._streamEnd = E(function () {
              (this._streamCleanUp(), (n = !0), this._streamData(''));
            }, this)),
            (this._streamCleanUp = E(function () {
              (this._input.removeListener('data', this._streamData),
                this._input.removeListener('end', this._streamEnd),
                this._input.removeListener('error', this._streamError));
            }, this)));
        }
        function p(e) {
          var t,
            r,
            n,
            a,
            i = /^\s*-?(\d+\.?|\.\d+|\d+\.\d+)([eE][-+]?\d+)?\s*$/,
            o =
              /^((\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z)))$/,
            l = this,
            u = 0,
            c = 0,
            d = !1,
            f = !1,
            p = [],
            y = { data: [], errors: [], meta: {} };
          function v(t) {
            return 'greedy' === e.skipEmptyLines
              ? '' === t.join('').trim()
              : 1 === t.length && 0 === t[0].length;
          }
          function g() {
            if (
              (y &&
                n &&
                (C(
                  'Delimiter',
                  'UndetectableDelimiter',
                  "Unable to auto-detect delimiting character; defaulted to '" +
                    s.DefaultDelimiter +
                    "'",
                ),
                (n = !1)),
              e.skipEmptyLines &&
                (y.data = y.data.filter(function (e) {
                  return !v(e);
                })),
              E())
            ) {
              if (y)
                if (Array.isArray(y.data[0])) {
                  for (var t, r = 0; E() && r < y.data.length; r++) y.data[r].forEach(a);
                  y.data.splice(0, 1);
                } else y.data.forEach(a);
              function a(t, r) {
                (w(e.transformHeader) && (t = e.transformHeader(t, r)), p.push(t));
              }
            }
            function l(t, r) {
              for (var n = e.header ? {} : [], a = 0; a < t.length; a++) {
                var s = a,
                  l = t[a],
                  l = ((t, r) =>
                    (e.dynamicTypingFunction &&
                      void 0 === e.dynamicTyping[t] &&
                      (e.dynamicTyping[t] = e.dynamicTypingFunction(t)),
                    !0 === (e.dynamicTyping[t] || e.dynamicTyping))
                      ? 'true' === r ||
                        'TRUE' === r ||
                        ('false' !== r &&
                          'FALSE' !== r &&
                          (((e) => {
                            if (
                              i.test(e) &&
                              -0x20000000000000 < (e = parseFloat(e)) &&
                              e < 0x20000000000000
                            )
                              return 1;
                          })(r)
                            ? parseFloat(r)
                            : o.test(r)
                              ? new Date(r)
                              : '' === r
                                ? null
                                : r))
                      : r)(
                    (s = e.header ? (a >= p.length ? '__parsed_extra' : p[a]) : s),
                    (l = e.transform ? e.transform(l, s) : l),
                  );
                '__parsed_extra' === s ? ((n[s] = n[s] || []), n[s].push(l)) : (n[s] = l);
              }
              return (
                e.header &&
                  (a > p.length
                    ? C(
                        'FieldMismatch',
                        'TooManyFields',
                        'Too many fields: expected ' + p.length + ' fields but parsed ' + a,
                        c + r,
                      )
                    : a < p.length &&
                      C(
                        'FieldMismatch',
                        'TooFewFields',
                        'Too few fields: expected ' + p.length + ' fields but parsed ' + a,
                        c + r,
                      )),
                n
              );
            }
            y &&
              (e.header || e.dynamicTyping || e.transform) &&
              ((t = 1),
              !y.data.length || Array.isArray(y.data[0])
                ? ((y.data = y.data.map(l)), (t = y.data.length))
                : (y.data = l(y.data, 0)),
              e.header && y.meta && (y.meta.fields = p),
              (c += t));
          }
          function E() {
            return e.header && 0 === p.length;
          }
          function C(e, t, r, n) {
            ((e = { type: e, code: t, message: r }), void 0 !== n && (e.row = n), y.errors.push(e));
          }
          (w(e.step) &&
            ((a = e.step),
            (e.step = function (t) {
              ((y = t),
                E()
                  ? g()
                  : (g(),
                    0 !== y.data.length &&
                      ((u += t.data.length),
                      e.preview && u > e.preview ? r.abort() : ((y.data = y.data[0]), a(y, l)))));
            })),
            (this.parse = function (a, i, o) {
              var l = e.quoteChar || '"',
                l =
                  (e.newline || (e.newline = this.guessLineEndings(a, l)),
                  (n = !1),
                  e.delimiter
                    ? w(e.delimiter) &&
                      ((e.delimiter = e.delimiter(a)), (y.meta.delimiter = e.delimiter))
                    : ((l = ((t, r, n, a, i) => {
                        var o, l, u, c;
                        i = i || [',', '	', '|', ';', s.RECORD_SEP, s.UNIT_SEP];
                        for (var d = 0; d < i.length; d++) {
                          for (
                            var f,
                              p = i[d],
                              h = 0,
                              y = 0,
                              g = 0,
                              b =
                                ((u = void 0),
                                new m({ comments: a, delimiter: p, newline: r, preview: 10 }).parse(
                                  t,
                                )),
                              E = 0;
                            E < b.data.length;
                            E++
                          )
                            n && v(b.data[E])
                              ? g++
                              : ((y += f = b.data[E].length),
                                void 0 === u
                                  ? (u = f)
                                  : 0 < f && ((h += Math.abs(f - u)), (u = f)));
                          (0 < b.data.length && (y /= b.data.length - g),
                            (void 0 === l || h <= l) &&
                              (void 0 === c || c < y) &&
                              1.99 < y &&
                              ((l = h), (o = p), (c = y)));
                        }
                        return { successful: !!(e.delimiter = o), bestDelimiter: o };
                      })(a, e.newline, e.skipEmptyLines, e.comments, e.delimitersToGuess))
                        .successful
                        ? (e.delimiter = l.bestDelimiter)
                        : ((n = !0), (e.delimiter = s.DefaultDelimiter)),
                      (y.meta.delimiter = e.delimiter)),
                  b(e));
              return (
                e.preview && e.header && l.preview++,
                (t = a),
                (y = (r = new m(l)).parse(t, i, o)),
                g(),
                d ? { meta: { paused: !0 } } : y || { meta: { paused: !1 } }
              );
            }),
            (this.paused = function () {
              return d;
            }),
            (this.pause = function () {
              ((d = !0), r.abort(), (t = w(e.chunk) ? '' : t.substring(r.getCharIndex())));
            }),
            (this.resume = function () {
              l.streamer._halted
                ? ((d = !1), l.streamer.parseChunk(t, !0))
                : setTimeout(l.resume, 3);
            }),
            (this.aborted = function () {
              return f;
            }),
            (this.abort = function () {
              ((f = !0),
                r.abort(),
                (y.meta.aborted = !0),
                w(e.complete) && e.complete(y),
                (t = ''));
            }),
            (this.guessLineEndings = function (e, t) {
              e = e.substring(0, 1048576);
              var t = RegExp(h(t) + '([^]*?)' + h(t), 'gm'),
                r = (e = e.replace(t, '')).split('\r'),
                t = e.split('\n'),
                e = 1 < t.length && t[0].length < r[0].length;
              if (1 === r.length || e) return '\n';
              for (var n = 0, a = 0; a < r.length; a++) '\n' === r[a][0] && n++;
              return n >= r.length / 2 ? '\r\n' : '\r';
            }));
        }
        function h(e) {
          return e.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        }
        function m(e) {
          var t = (e = e || {}).delimiter,
            r = e.newline,
            n = e.comments,
            a = e.step,
            i = e.preview,
            o = e.fastMode,
            l = null,
            u = !1,
            c = null == e.quoteChar ? '"' : e.quoteChar,
            d = c;
          if (
            (void 0 !== e.escapeChar && (d = e.escapeChar),
            ('string' != typeof t || -1 < s.BAD_DELIMITERS.indexOf(t)) && (t = ','),
            n === t)
          )
            throw Error('Comment character same as delimiter');
          (!0 === n
            ? (n = '#')
            : ('string' != typeof n || -1 < s.BAD_DELIMITERS.indexOf(n)) && (n = !1),
            '\n' !== r && '\r' !== r && '\r\n' !== r && (r = '\n'));
          var f = 0,
            p = !1;
          ((this.parse = function (s, m, y) {
            if ('string' != typeof s) throw Error('Input must be a string');
            var v = s.length,
              g = t.length,
              b = r.length,
              E = n.length,
              C = w(a),
              P = [],
              S = [],
              O = [],
              x = (f = 0);
            if (!s) return I();
            if (o || (!1 !== o && -1 === s.indexOf(c))) {
              for (var L = s.split(r), A = 0; A < L.length; A++) {
                if (((O = L[A]), (f += O.length), A !== L.length - 1)) f += r.length;
                else if (y) break;
                if (!n || O.substring(0, E) !== n) {
                  if (C) {
                    if (((P = []), M(O.split(t)), $(), p)) return I();
                  } else M(O.split(t));
                  if (i && i <= A) return ((P = P.slice(0, i)), I(!0));
                }
              }
              return I();
            }
            for (
              var k = s.indexOf(t, f),
                F = s.indexOf(r, f),
                _ = RegExp(h(d) + h(c), 'g'),
                R = s.indexOf(c, f);
              ;
            )
              if (s[f] === c)
                for (R = f, f++; ; ) {
                  if (-1 === (R = s.indexOf(c, R + 1)))
                    return (
                      y ||
                        S.push({
                          type: 'Quotes',
                          code: 'MissingQuotes',
                          message: 'Quoted field unterminated',
                          row: P.length,
                          index: f,
                        }),
                      T()
                    );
                  if (R === v - 1) return T(s.substring(f, R).replace(_, c));
                  if (c === d && s[R + 1] === d) R++;
                  else if (c === d || 0 === R || s[R - 1] !== d) {
                    -1 !== k && k < R + 1 && (k = s.indexOf(t, R + 1));
                    var D = N(
                      -1 === (F = -1 !== F && F < R + 1 ? s.indexOf(r, R + 1) : F)
                        ? k
                        : Math.min(k, F),
                    );
                    if (s.substr(R + 1 + D, g) === t) {
                      (O.push(s.substring(f, R).replace(_, c)),
                        s[(f = R + 1 + D + g)] !== c && (R = s.indexOf(c, f)),
                        (k = s.indexOf(t, f)),
                        (F = s.indexOf(r, f)));
                      break;
                    }
                    if (((D = N(F)), s.substring(R + 1 + D, R + 1 + D + b) === r)) {
                      if (
                        (O.push(s.substring(f, R).replace(_, c)),
                        j(R + 1 + D + b),
                        (k = s.indexOf(t, f)),
                        (R = s.indexOf(c, f)),
                        C && ($(), p))
                      )
                        return I();
                      if (i && P.length >= i) return I(!0);
                      break;
                    }
                    (S.push({
                      type: 'Quotes',
                      code: 'InvalidQuotes',
                      message: 'Trailing quote on quoted field is malformed',
                      row: P.length,
                      index: f,
                    }),
                      R++);
                  }
                }
              else if (n && 0 === O.length && s.substring(f, f + E) === n) {
                if (-1 === F) return I();
                ((f = F + b), (F = s.indexOf(r, f)), (k = s.indexOf(t, f)));
              } else if (-1 !== k && (k < F || -1 === F))
                (O.push(s.substring(f, k)), (f = k + g), (k = s.indexOf(t, f)));
              else {
                if (-1 === F) break;
                if ((O.push(s.substring(f, F)), j(F + b), C && ($(), p))) return I();
                if (i && P.length >= i) return I(!0);
              }
            return T();
            function M(e) {
              (P.push(e), (x = f));
            }
            function N(e) {
              return -1 !== e && (e = s.substring(R + 1, e)) && '' === e.trim() ? e.length : 0;
            }
            function T(e) {
              return (
                y || (void 0 === e && (e = s.substring(f)), O.push(e), (f = v), M(O), C && $()),
                I()
              );
            }
            function j(e) {
              ((f = e), M(O), (O = []), (F = s.indexOf(r, f)));
            }
            function I(n) {
              if (e.header && !m && P.length && !u) {
                var a = P[0],
                  i = Object.create(null),
                  o = new Set(a);
                let t = !1;
                for (let r = 0; r < a.length; r++) {
                  let n = a[r];
                  if (i[(n = w(e.transformHeader) ? e.transformHeader(n, r) : n)]) {
                    let e,
                      s = i[n];
                    for (; (e = n + '_' + s), s++, o.has(e); );
                    (o.add(e), (a[r] = e), i[n]++, (t = !0), ((l = null === l ? {} : l)[e] = n));
                  } else ((i[n] = 1), (a[r] = n));
                  o.add(n);
                }
                (t && console.warn('Duplicate headers found and renamed.'), (u = !0));
              }
              return {
                data: P,
                errors: S,
                meta: {
                  delimiter: t,
                  linebreak: r,
                  aborted: p,
                  truncated: !!n,
                  cursor: x + (m || 0),
                  renamedHeaders: l,
                },
              };
            }
            function $() {
              (a(I()), (P = []), (S = []));
            }
          }),
            (this.abort = function () {
              p = !0;
            }),
            (this.getCharIndex = function () {
              return f;
            }));
        }
        function y(e) {
          var t = e.data,
            r = i[t.workerId],
            n = !1;
          if (t.error) r.userError(t.error, t.file);
          else if (t.results && t.results.data) {
            var a = {
              abort: function () {
                ((n = !0), v(t.workerId, { data: [], errors: [], meta: { aborted: !0 } }));
              },
              pause: g,
              resume: g,
            };
            if (w(r.userStep)) {
              for (
                var o = 0;
                o < t.results.data.length &&
                (r.userStep(
                  { data: t.results.data[o], errors: t.results.errors, meta: t.results.meta },
                  a,
                ),
                !n);
                o++
              );
              delete t.results;
            } else w(r.userChunk) && (r.userChunk(t.results, a, t.file), delete t.results);
          }
          t.finished && !n && v(t.workerId, t.results);
        }
        function v(e, t) {
          var r = i[e];
          (w(r.userComplete) && r.userComplete(t), r.terminate(), delete i[e]);
        }
        function g() {
          throw Error('Not implemented.');
        }
        function b(e) {
          if ('object' != typeof e || null === e) return e;
          var t,
            r = Array.isArray(e) ? [] : {};
          for (t in e) r[t] = b(e[t]);
          return r;
        }
        function E(e, t) {
          return function () {
            e.apply(t, arguments);
          };
        }
        function w(e) {
          return 'function' == typeof e;
        }
        return (
          (s.parse = function (t, n) {
            var a,
              l,
              p,
              h = (n = n || {}).dynamicTyping || !1;
            if (
              (w(h) && ((n.dynamicTypingFunction = h), (h = {})),
              (n.dynamicTyping = h),
              (n.transform = !!w(n.transform) && n.transform),
              !n.worker || !s.WORKERS_SUPPORTED)
            ) {
              let e;
              return (
                (h = null),
                s.NODE_STREAM_INPUT,
                'string' == typeof t
                  ? ((t = 65279 !== (e = t).charCodeAt(0) ? e : e.slice(1)),
                    (h = new (n.download ? u : d)(n)))
                  : !0 === t.readable && w(t.read) && w(t.on)
                    ? (h = new f(n))
                    : ((r.File && t instanceof File) || t instanceof Object) && (h = new c(n)),
                h.stream(t)
              );
            }
            (((h =
              !!s.WORKERS_SUPPORTED &&
              ((l = r.URL || r.webkitURL || null),
              (p = e.toString()),
              (a =
                s.BLOB_URL ||
                (s.BLOB_URL = l.createObjectURL(
                  new Blob(
                    [
                      "var global = (function() { if (typeof self !== 'undefined') { return self; } if (typeof window !== 'undefined') { return window; } if (typeof global !== 'undefined') { return global; } return {}; })(); global.IS_PAPA_WORKER=true; ",
                      '(',
                      p,
                      ')();',
                    ],
                    { type: 'text/javascript' },
                  ),
                ))),
              ((a = new r.Worker(a)).onmessage = y),
              (a.id = o++),
              (i[a.id] = a))).userStep = n.step),
              (h.userChunk = n.chunk),
              (h.userComplete = n.complete),
              (h.userError = n.error),
              (n.step = w(n.step)),
              (n.chunk = w(n.chunk)),
              (n.complete = w(n.complete)),
              (n.error = w(n.error)),
              delete n.worker,
              h.postMessage({ input: t, config: n, workerId: h.id }));
          }),
          (s.unparse = function (e, t) {
            var r = !1,
              n = !0,
              a = ',',
              i = '\r\n',
              o = '"',
              l = o + o,
              u = !1,
              c = null,
              d = !1,
              f =
                ((() => {
                  if ('object' == typeof t) {
                    if (
                      ('string' != typeof t.delimiter ||
                        s.BAD_DELIMITERS.filter(function (e) {
                          return -1 !== t.delimiter.indexOf(e);
                        }).length ||
                        (a = t.delimiter),
                      ('boolean' == typeof t.quotes ||
                        'function' == typeof t.quotes ||
                        Array.isArray(t.quotes)) &&
                        (r = t.quotes),
                      ('boolean' != typeof t.skipEmptyLines &&
                        'string' != typeof t.skipEmptyLines) ||
                        (u = t.skipEmptyLines),
                      'string' == typeof t.newline && (i = t.newline),
                      'string' == typeof t.quoteChar && (o = t.quoteChar),
                      'boolean' == typeof t.header && (n = t.header),
                      Array.isArray(t.columns))
                    ) {
                      if (0 === t.columns.length) throw Error('Option columns is empty');
                      c = t.columns;
                    }
                    (void 0 !== t.escapeChar && (l = t.escapeChar + o),
                      t.escapeFormulae instanceof RegExp
                        ? (d = t.escapeFormulae)
                        : 'boolean' == typeof t.escapeFormulae &&
                          t.escapeFormulae &&
                          (d = /^[=+\-@\t\r].*$/));
                  }
                })(),
                RegExp(h(o), 'g'));
            if (('string' == typeof e && (e = JSON.parse(e)), Array.isArray(e))) {
              if (!e.length || Array.isArray(e[0])) return p(null, e, u);
              if ('object' == typeof e[0]) return p(c || Object.keys(e[0]), e, u);
            } else if ('object' == typeof e)
              return (
                'string' == typeof e.data && (e.data = JSON.parse(e.data)),
                Array.isArray(e.data) &&
                  (e.fields || (e.fields = (e.meta && e.meta.fields) || c),
                  e.fields ||
                    (e.fields = Array.isArray(e.data[0])
                      ? e.fields
                      : 'object' == typeof e.data[0]
                        ? Object.keys(e.data[0])
                        : []),
                  Array.isArray(e.data[0]) || 'object' == typeof e.data[0] || (e.data = [e.data])),
                p(e.fields || [], e.data || [], u)
              );
            throw Error('Unable to serialize unrecognized input');
            function p(e, t, r) {
              var o = '',
                s =
                  ('string' == typeof e && (e = JSON.parse(e)),
                  'string' == typeof t && (t = JSON.parse(t)),
                  Array.isArray(e) && 0 < e.length),
                l = !Array.isArray(t[0]);
              if (s && n) {
                for (var u = 0; u < e.length; u++) (0 < u && (o += a), (o += m(e[u], u)));
                0 < t.length && (o += i);
              }
              for (var c = 0; c < t.length; c++) {
                var d = (s ? e : t[c]).length,
                  f = !1,
                  p = s ? 0 === Object.keys(t[c]).length : 0 === t[c].length;
                if (
                  (r &&
                    !s &&
                    (f =
                      'greedy' === r
                        ? '' === t[c].join('').trim()
                        : 1 === t[c].length && 0 === t[c][0].length),
                  'greedy' === r && s)
                ) {
                  for (var h = [], y = 0; y < d; y++) {
                    var v = l ? e[y] : y;
                    h.push(t[c][v]);
                  }
                  f = '' === h.join('').trim();
                }
                if (!f) {
                  for (var g = 0; g < d; g++) {
                    0 < g && !p && (o += a);
                    var b = s && l ? e[g] : g;
                    o += m(t[c][b], g);
                  }
                  c < t.length - 1 && (!r || (0 < d && !p)) && (o += i);
                }
              }
              return o;
            }
            function m(e, t) {
              var n, i;
              return null == e
                ? ''
                : e.constructor === Date
                  ? JSON.stringify(e).slice(1, 25)
                  : ((i = !1),
                    d && 'string' == typeof e && d.test(e) && ((e = "'" + e), (i = !0)),
                    (n = e.toString().replace(f, l)),
                    (i =
                      i ||
                      !0 === r ||
                      ('function' == typeof r && r(e, t)) ||
                      (Array.isArray(r) && r[t]) ||
                      ((e, t) => {
                        for (var r = 0; r < t.length; r++) if (-1 < e.indexOf(t[r])) return !0;
                        return !1;
                      })(n, s.BAD_DELIMITERS) ||
                      -1 < n.indexOf(a) ||
                      ' ' === n.charAt(0) ||
                      ' ' === n.charAt(n.length - 1))
                      ? o + n + o
                      : n);
            }
          }),
          (s.RECORD_SEP = '\x1e'),
          (s.UNIT_SEP = '\x1f'),
          (s.BYTE_ORDER_MARK = '\uFEFF'),
          (s.BAD_DELIMITERS = ['\r', '\n', '"', s.BYTE_ORDER_MARK]),
          (s.WORKERS_SUPPORTED = !n && !!r.Worker),
          (s.NODE_STREAM_INPUT = 1),
          (s.LocalChunkSize = 0xa00000),
          (s.RemoteChunkSize = 5242880),
          (s.DefaultDelimiter = ','),
          (s.Parser = m),
          (s.ParserHandle = p),
          (s.NetworkStreamer = u),
          (s.FileStreamer = c),
          (s.StringStreamer = d),
          (s.ReadableStreamStreamer = f),
          r.jQuery &&
            ((t = r.jQuery).fn.parse = function (e) {
              var n = e.config || {},
                a = [];
              return (
                this.each(function (e) {
                  if (
                    !(
                      'INPUT' === t(this).prop('tagName').toUpperCase() &&
                      'file' === t(this).attr('type').toLowerCase() &&
                      r.FileReader
                    ) ||
                    !this.files ||
                    0 === this.files.length
                  )
                    return !0;
                  for (var i = 0; i < this.files.length; i++)
                    a.push({
                      file: this.files[i],
                      inputElem: this,
                      instanceConfig: t.extend({}, n),
                    });
                }),
                i(),
                this
              );
              function i() {
                if (0 === a.length) w(e.complete) && e.complete();
                else {
                  var r,
                    n,
                    i,
                    l = a[0];
                  if (w(e.before)) {
                    var u = e.before(l.file, l.inputElem);
                    if ('object' == typeof u) {
                      if ('abort' === u.action)
                        return (
                          (r = l.file),
                          (n = l.inputElem),
                          (i = u.reason),
                          void (w(e.error) && e.error({ name: 'AbortError' }, r, n, i))
                        );
                      if ('skip' === u.action) return void o();
                      'object' == typeof u.config &&
                        (l.instanceConfig = t.extend(l.instanceConfig, u.config));
                    } else if ('skip' === u) return void o();
                  }
                  var c = l.instanceConfig.complete;
                  ((l.instanceConfig.complete = function (e) {
                    (w(c) && c(e, l.file, l.inputElem), o());
                  }),
                    s.parse(l.file, l.instanceConfig));
                }
              }
              function o() {
                (a.splice(0, 1), i());
              }
            }),
          a &&
            (r.onmessage = function (e) {
              ((e = e.data),
                void 0 === s.WORKER_ID && e && (s.WORKER_ID = e.workerId),
                'string' == typeof e.input
                  ? r.postMessage({
                      workerId: s.WORKER_ID,
                      results: s.parse(e.input, e.config),
                      finished: !0,
                    })
                  : ((r.File && e.input instanceof File) || e.input instanceof Object) &&
                    (e = s.parse(e.input, e.config)) &&
                    r.postMessage({ workerId: s.WORKER_ID, results: e, finished: !0 }));
            }),
          ((u.prototype = Object.create(l.prototype)).constructor = u),
          ((c.prototype = Object.create(l.prototype)).constructor = c),
          ((d.prototype = Object.create(d.prototype)).constructor = d),
          ((f.prototype = Object.create(l.prototype)).constructor = f),
          s
        );
      }),
      'function' == typeof define && define.amd
        ? void 0 !== (a = n()) && e.v(a)
        : (t.exports = n()));
  },
  60552,
  78468,
  30821,
  18241,
  40182,
  97596,
  (e) => {
    'use strict';
    let t, r, n, a, i, o, s, l, u;
    var c,
      d,
      f,
      p,
      h,
      m,
      y,
      v,
      g = e.i(1648),
      b = e.i(61129);
    (e.i(64775), e.i(18583));
    var E =
      (((t = E || {}).RELOAD = 'devtools:reload'),
      (t.DEVTOOLS_INIT = 'devtools:init'),
      (t.DEVTOOLS_ALREADY_CONNECTED = 'devtools:already-connected'),
      (t.ACTIVITY = 'devtools:send-activity'),
      (t.DEVTOOLS_ACTIVITY_UPDATE = 'devtools:activity-update'),
      (t.DEVTOOLS_CONNECTED_APP = 'devtools:connected-app'),
      (t.DEVTOOLS_DISCONNECTED_APP = 'devtools:disconnected-app'),
      (t.DEVTOOLS_HIGHLIGHT_IN_MONITOR = 'devtools:highlight-in-monitor'),
      (t.DEVTOOLS_HIGHLIGHT_IN_MONITOR_ACTION = 'devtools:highlight-in-monitor-action'),
      (t.DEVTOOLS_LOGIN_SUCCESS = 'devtools:login-success'),
      (t.DEVTOOLS_DISPLAY_LOGIN_FAILURE = 'devtools:display-login-failure'),
      (t.DEVTOOLS_LOGIN_FAILURE = 'devtools:login-failure'),
      (t.DEVTOOLS_RELOAD_AFTER_LOGIN = 'devtools:reload-after-login'),
      (t.DEVTOOLS_INVALIDATE_QUERY = 'devtools:invalidate-query'),
      (t.DEVTOOLS_INVALIDATE_QUERY_ACTION = 'devtools:invalidate-query-action'),
      t);
    function w(e, t, r, n) {
      return { hookName: '', trace: [], resourcePath: null, legacyKey: !1 };
    }
    (Object.entries({
      useCan: 'access-control',
      useLog: 'audit-log',
      useLogList: 'audit-log',
      useCreate: 'data',
      useCreateMany: 'data',
      useCustom: 'data',
      useCustomMutation: 'data',
      useDelete: 'data',
      useDeleteMany: 'data',
      useInfiniteList: 'data',
      useList: 'data',
      useMany: 'data',
      useOne: 'data',
      useUpdate: 'data',
      useUpdateMany: 'data',
      useForgotPassword: 'auth',
      useGetIdentity: 'auth',
      useIsAuthenticated: 'auth',
      useLogin: 'auth',
      useLogout: 'auth',
      useOnError: 'auth',
      usePermissions: 'auth',
      useRegister: 'auth',
      useUpdatePassword: 'auth',
    }).reduce((e, [t, r]) => (e[r] || (e[r] = []), e[r].push(t), e), {}),
      b.default.createContext({
        __devtools: !1,
        httpUrl: 'http://localhost:5001',
        wsUrl: 'ws://localhost:5001',
        ws: null,
      }));
    let C = 'u' < typeof window || 'Deno' in window;
    function P() {}
    function S(e) {
      return 'number' == typeof e && e >= 0 && e !== 1 / 0;
    }
    function O(e, t) {
      return Math.max(e + (t || 0) - Date.now(), 0);
    }
    function x(e, t, r) {
      return j(e)
        ? 'function' == typeof t
          ? { ...r, queryKey: e, queryFn: t }
          : { ...t, queryKey: e }
        : e;
    }
    function L(e, t, r) {
      return j(e) ? [{ ...t, queryKey: e }, r] : [e || {}, t];
    }
    function A(e, t) {
      let { type: r = 'all', exact: n, fetchStatus: a, predicate: i, queryKey: o, stale: s } = e;
      if (j(o))
        if (n) {
          if (t.queryHash !== F(o, t.options)) return !1;
        } else {
          var l;
          if (((l = t.queryKey), !R(l, o))) return !1;
        }
      if ('all' !== r) {
        let e = t.isActive();
        if (('active' === r && !e) || ('inactive' === r && e)) return !1;
      }
      return (
        ('boolean' != typeof s || t.isStale() === s) &&
        (void 0 === a || a === t.state.fetchStatus) &&
        (!i || !!i(t))
      );
    }
    function k(e, t) {
      let { exact: r, fetching: n, predicate: a, mutationKey: i } = e;
      if (j(i)) {
        if (!t.options.mutationKey) return !1;
        if (r) {
          if (_(t.options.mutationKey) !== _(i)) return !1;
        } else {
          var o;
          if (((o = t.options.mutationKey), !R(o, i))) return !1;
        }
      }
      return ('boolean' != typeof n || ('loading' === t.state.status) === n) && (!a || !!a(t));
    }
    function F(e, t) {
      return ((null == t ? void 0 : t.queryKeyHashFn) || _)(e);
    }
    function _(e) {
      return JSON.stringify(e, (e, t) =>
        N(t)
          ? Object.keys(t)
              .sort()
              .reduce((e, r) => ((e[r] = t[r]), e), {})
          : t,
      );
    }
    function R(e, t) {
      return (
        e === t ||
        (typeof e == typeof t &&
          !!e &&
          !!t &&
          'object' == typeof e &&
          'object' == typeof t &&
          !Object.keys(t).some((r) => !R(e[r], t[r])))
      );
    }
    function D(e, t) {
      if ((e && !t) || (t && !e)) return !1;
      for (let r in e) if (e[r] !== t[r]) return !1;
      return !0;
    }
    function M(e) {
      return Array.isArray(e) && e.length === Object.keys(e).length;
    }
    function N(e) {
      if (!T(e)) return !1;
      let t = e.constructor;
      if (void 0 === t) return !0;
      let r = t.prototype;
      return !!T(r) && !!r.hasOwnProperty('isPrototypeOf');
    }
    function T(e) {
      return '[object Object]' === Object.prototype.toString.call(e);
    }
    function j(e) {
      return Array.isArray(e);
    }
    function I(e) {
      return new Promise((t) => {
        setTimeout(t, e);
      });
    }
    function $(e) {
      I(0).then(e);
    }
    function q(e, t, r) {
      return null != r.isDataEqual && r.isDataEqual(e, t)
        ? e
        : 'function' == typeof r.structuralSharing
          ? r.structuralSharing(e, t)
          : !1 !== r.structuralSharing
            ? (function e(t, r, n = 0) {
                if (t === r) return t;
                if (n > 500) return r;
                let a = M(t) && M(r);
                if (a || (N(t) && N(r))) {
                  let i = a ? t.length : Object.keys(t).length,
                    o = a ? r : Object.keys(r),
                    s = o.length,
                    l = a ? [] : {},
                    u = 0;
                  for (let i = 0; i < s; i++) {
                    let s = a ? i : o[i];
                    ((l[s] = e(t[s], r[s], n + 1)), l[s] === t[s] && u++);
                  }
                  return i === s && u === i ? t : l;
                }
                return r;
              })(e, t)
            : t;
    }
    let U =
      ((r = []),
      (n = 0),
      (a = (e) => {
        e();
      }),
      (i = (e) => {
        e();
      }),
      (o = (e) => {
        n
          ? r.push(e)
          : $(() => {
              a(e);
            });
      }),
      (s = () => {
        let e = r;
        ((r = []),
          e.length &&
            $(() => {
              i(() => {
                e.forEach((e) => {
                  a(e);
                });
              });
            }));
      }),
      {
        batch: (e) => {
          let t;
          n++;
          try {
            t = e();
          } finally {
            --n || s();
          }
          return t;
        },
        batchCalls:
          (e) =>
          (...t) => {
            o(() => {
              e(...t);
            });
          },
        schedule: o,
        setNotifyFunction: (e) => {
          a = e;
        },
        setBatchNotifyFunction: (e) => {
          i = e;
        },
      });
    class K {
      constructor() {
        ((this.listeners = new Set()), (this.subscribe = this.subscribe.bind(this)));
      }
      subscribe(e) {
        let t = { listener: e };
        return (
          this.listeners.add(t),
          this.onSubscribe(),
          () => {
            (this.listeners.delete(t), this.onUnsubscribe());
          }
        );
      }
      hasListeners() {
        return this.listeners.size > 0;
      }
      onSubscribe() {}
      onUnsubscribe() {}
    }
    let Q = new (class extends K {
        constructor() {
          (super(),
            (this.setup = (e) => {
              if (!C && window.addEventListener) {
                let t = () => e();
                return (
                  window.addEventListener('visibilitychange', t, !1),
                  window.addEventListener('focus', t, !1),
                  () => {
                    (window.removeEventListener('visibilitychange', t),
                      window.removeEventListener('focus', t));
                  }
                );
              }
            }));
        }
        onSubscribe() {
          this.cleanup || this.setEventListener(this.setup);
        }
        onUnsubscribe() {
          if (!this.hasListeners()) {
            var e;
            (null == (e = this.cleanup) || e.call(this), (this.cleanup = void 0));
          }
        }
        setEventListener(e) {
          var t;
          ((this.setup = e),
            null == (t = this.cleanup) || t.call(this),
            (this.cleanup = e((e) => {
              'boolean' == typeof e ? this.setFocused(e) : this.onFocus();
            })));
        }
        setFocused(e) {
          this.focused !== e && ((this.focused = e), this.onFocus());
        }
        onFocus() {
          this.listeners.forEach(({ listener: e }) => {
            e();
          });
        }
        isFocused() {
          return 'boolean' == typeof this.focused
            ? this.focused
            : 'u' < typeof document ||
                [void 0, 'visible', 'prerender'].includes(document.visibilityState);
        }
      })(),
      z = ['online', 'offline'],
      B = new (class extends K {
        constructor() {
          (super(),
            (this.setup = (e) => {
              if (!C && window.addEventListener) {
                let t = () => e();
                return (
                  z.forEach((e) => {
                    window.addEventListener(e, t, !1);
                  }),
                  () => {
                    z.forEach((e) => {
                      window.removeEventListener(e, t);
                    });
                  }
                );
              }
            }));
        }
        onSubscribe() {
          this.cleanup || this.setEventListener(this.setup);
        }
        onUnsubscribe() {
          if (!this.hasListeners()) {
            var e;
            (null == (e = this.cleanup) || e.call(this), (this.cleanup = void 0));
          }
        }
        setEventListener(e) {
          var t;
          ((this.setup = e),
            null == (t = this.cleanup) || t.call(this),
            (this.cleanup = e((e) => {
              'boolean' == typeof e ? this.setOnline(e) : this.onOnline();
            })));
        }
        setOnline(e) {
          this.online !== e && ((this.online = e), this.onOnline());
        }
        onOnline() {
          this.listeners.forEach(({ listener: e }) => {
            e();
          });
        }
        isOnline() {
          return 'boolean' == typeof this.online
            ? this.online
            : 'u' < typeof navigator || void 0 === navigator.onLine || navigator.onLine;
        }
      })();
    function W(e) {
      return Math.min(1e3 * 2 ** e, 3e4);
    }
    function H(e) {
      return (null != e ? e : 'online') !== 'online' || B.isOnline();
    }
    class G {
      constructor(e) {
        ((this.revert = null == e ? void 0 : e.revert),
          (this.silent = null == e ? void 0 : e.silent));
      }
    }
    function V(e) {
      return e instanceof G;
    }
    function Z(e) {
      let t,
        r,
        n,
        a = !1,
        i = 0,
        o = !1,
        s = new Promise((e, t) => {
          ((r = e), (n = t));
        }),
        l = () => !Q.isFocused() || ('always' !== e.networkMode && !B.isOnline()),
        u = (n) => {
          o || ((o = !0), null == e.onSuccess || e.onSuccess(n), null == t || t(), r(n));
        },
        c = (r) => {
          o || ((o = !0), null == e.onError || e.onError(r), null == t || t(), n(r));
        },
        d = () =>
          new Promise((r) => {
            ((t = (e) => {
              let t = o || !l();
              return (t && r(e), t);
            }),
              null == e.onPause || e.onPause());
          }).then(() => {
            ((t = void 0), o || null == e.onContinue || e.onContinue());
          }),
        f = () => {
          let t;
          if (!o) {
            try {
              t = e.fn();
            } catch (e) {
              t = Promise.reject(e);
            }
            Promise.resolve(t)
              .then(u)
              .catch((t) => {
                var r, n;
                if (o) return;
                let s = null != (r = e.retry) ? r : 3,
                  u = null != (n = e.retryDelay) ? n : W,
                  p = 'function' == typeof u ? u(i, t) : u,
                  h =
                    !0 === s ||
                    ('number' == typeof s && i < s) ||
                    ('function' == typeof s && s(i, t));
                a || !h
                  ? c(t)
                  : (i++,
                    null == e.onFail || e.onFail(i, t),
                    I(p)
                      .then(() => {
                        if (l()) return d();
                      })
                      .then(() => {
                        a ? c(t) : f();
                      }));
              });
          }
        };
      return (
        H(e.networkMode) ? f() : d().then(f),
        {
          promise: s,
          cancel: (t) => {
            o || (c(new G(t)), null == e.abort || e.abort());
          },
          continue: () => ((null == t ? void 0 : t()) ? s : Promise.resolve()),
          cancelRetry: () => {
            a = !0;
          },
          continueRetry: () => {
            a = !1;
          },
        }
      );
    }
    class Y extends K {
      constructor(e, t) {
        (super(),
          (this.client = e),
          (this.options = t),
          (this.trackedProps = new Set()),
          (this.selectError = null),
          this.bindMethods(),
          this.setOptions(t));
      }
      bindMethods() {
        ((this.remove = this.remove.bind(this)), (this.refetch = this.refetch.bind(this)));
      }
      onSubscribe() {
        1 === this.listeners.size &&
          (this.currentQuery.addObserver(this),
          J(this.currentQuery, this.options) && this.executeFetch(),
          this.updateTimers());
      }
      onUnsubscribe() {
        this.hasListeners() || this.destroy();
      }
      shouldFetchOnReconnect() {
        return X(this.currentQuery, this.options, this.options.refetchOnReconnect);
      }
      shouldFetchOnWindowFocus() {
        return X(this.currentQuery, this.options, this.options.refetchOnWindowFocus);
      }
      destroy() {
        ((this.listeners = new Set()),
          this.clearStaleTimeout(),
          this.clearRefetchInterval(),
          this.currentQuery.removeObserver(this));
      }
      setOptions(e, t) {
        let r = this.options,
          n = this.currentQuery;
        if (
          ((this.options = this.client.defaultQueryOptions(e)),
          D(r, this.options) ||
            this.client
              .getQueryCache()
              .notify({ type: 'observerOptionsUpdated', query: this.currentQuery, observer: this }),
          void 0 !== this.options.enabled && 'boolean' != typeof this.options.enabled)
        )
          throw Error('Expected enabled to be a boolean');
        (this.options.queryKey || (this.options.queryKey = r.queryKey), this.updateQuery());
        let a = this.hasListeners();
        (a && ee(this.currentQuery, n, this.options, r) && this.executeFetch(),
          this.updateResult(t),
          a &&
            (this.currentQuery !== n ||
              this.options.enabled !== r.enabled ||
              this.options.staleTime !== r.staleTime) &&
            this.updateStaleTimeout());
        let i = this.computeRefetchInterval();
        a &&
          (this.currentQuery !== n ||
            this.options.enabled !== r.enabled ||
            i !== this.currentRefetchInterval) &&
          this.updateRefetchInterval(i);
      }
      getOptimisticResult(e) {
        var t, r, n;
        let a = this.client.getQueryCache().build(this.client, e),
          i = this.createResult(a, e);
        return (
          (t = this),
          (r = i),
          (n = e).keepPreviousData ||
            (void 0 !== n.placeholderData ? !r.isPlaceholderData : D(t.getCurrentResult(), r)) ||
            ((this.currentResult = i),
            (this.currentResultOptions = this.options),
            (this.currentResultState = this.currentQuery.state)),
          i
        );
      }
      getCurrentResult() {
        return this.currentResult;
      }
      trackResult(e) {
        let t = {};
        return (
          Object.keys(e).forEach((r) => {
            Object.defineProperty(t, r, {
              configurable: !1,
              enumerable: !0,
              get: () => (this.trackedProps.add(r), e[r]),
            });
          }),
          t
        );
      }
      getCurrentQuery() {
        return this.currentQuery;
      }
      remove() {
        this.client.getQueryCache().remove(this.currentQuery);
      }
      refetch({ refetchPage: e, ...t } = {}) {
        return this.fetch({ ...t, meta: { refetchPage: e } });
      }
      fetchOptimistic(e) {
        let t = this.client.defaultQueryOptions(e),
          r = this.client.getQueryCache().build(this.client, t);
        return ((r.isFetchingOptimistic = !0), r.fetch().then(() => this.createResult(r, t)));
      }
      fetch(e) {
        var t;
        return this.executeFetch({ ...e, cancelRefetch: null == (t = e.cancelRefetch) || t }).then(
          () => (this.updateResult(), this.currentResult),
        );
      }
      executeFetch(e) {
        this.updateQuery();
        let t = this.currentQuery.fetch(this.options, e);
        return ((null != e && e.throwOnError) || (t = t.catch(P)), t);
      }
      updateStaleTimeout() {
        if (
          (this.clearStaleTimeout(), C || this.currentResult.isStale || !S(this.options.staleTime))
        )
          return;
        let e = O(this.currentResult.dataUpdatedAt, this.options.staleTime);
        this.staleTimeoutId = setTimeout(() => {
          this.currentResult.isStale || this.updateResult();
        }, e + 1);
      }
      computeRefetchInterval() {
        var e;
        return 'function' == typeof this.options.refetchInterval
          ? this.options.refetchInterval(this.currentResult.data, this.currentQuery)
          : null != (e = this.options.refetchInterval) && e;
      }
      updateRefetchInterval(e) {
        (this.clearRefetchInterval(),
          (this.currentRefetchInterval = e),
          !C &&
            !1 !== this.options.enabled &&
            S(this.currentRefetchInterval) &&
            0 !== this.currentRefetchInterval &&
            (this.refetchIntervalId = setInterval(() => {
              (this.options.refetchIntervalInBackground || Q.isFocused()) && this.executeFetch();
            }, this.currentRefetchInterval)));
      }
      updateTimers() {
        (this.updateStaleTimeout(), this.updateRefetchInterval(this.computeRefetchInterval()));
      }
      clearStaleTimeout() {
        this.staleTimeoutId && (clearTimeout(this.staleTimeoutId), (this.staleTimeoutId = void 0));
      }
      clearRefetchInterval() {
        this.refetchIntervalId &&
          (clearInterval(this.refetchIntervalId), (this.refetchIntervalId = void 0));
      }
      createResult(e, t) {
        let r,
          n = this.currentQuery,
          a = this.options,
          i = this.currentResult,
          o = this.currentResultState,
          s = this.currentResultOptions,
          l = e !== n,
          u = l ? e.state : this.currentQueryInitialState,
          c = l ? this.currentResult : this.previousQueryResult,
          { state: d } = e,
          { dataUpdatedAt: f, error: p, errorUpdatedAt: h, fetchStatus: m, status: y } = d,
          v = !1,
          g = !1;
        if (t._optimisticResults) {
          let r = this.hasListeners(),
            i = !r && J(e, t),
            o = r && ee(e, n, t, a);
          ((i || o) &&
            ((m = H(e.options.networkMode) ? 'fetching' : 'paused'), f || (y = 'loading')),
            'isRestoring' === t._optimisticResults && (m = 'idle'));
        }
        if (t.keepPreviousData && !d.dataUpdatedAt && null != c && c.isSuccess && 'error' !== y)
          ((r = c.data), (f = c.dataUpdatedAt), (y = c.status), (v = !0));
        else if (t.select && void 0 !== d.data)
          if (i && d.data === (null == o ? void 0 : o.data) && t.select === this.selectFn)
            r = this.selectResult;
          else
            try {
              ((this.selectFn = t.select),
                (r = t.select(d.data)),
                (r = q(null == i ? void 0 : i.data, r, t)),
                (this.selectResult = r),
                (this.selectError = null));
            } catch (e) {
              this.selectError = e;
            }
        else r = d.data;
        if (void 0 !== t.placeholderData && void 0 === r && 'loading' === y) {
          let e;
          if (
            null != i &&
            i.isPlaceholderData &&
            t.placeholderData === (null == s ? void 0 : s.placeholderData)
          )
            e = i.data;
          else if (
            ((e = 'function' == typeof t.placeholderData ? t.placeholderData() : t.placeholderData),
            t.select && void 0 !== e)
          )
            try {
              ((e = t.select(e)), (this.selectError = null));
            } catch (e) {
              this.selectError = e;
            }
          void 0 !== e && ((y = 'success'), (r = q(null == i ? void 0 : i.data, e, t)), (g = !0));
        }
        this.selectError &&
          ((p = this.selectError), (r = this.selectResult), (h = Date.now()), (y = 'error'));
        let b = 'fetching' === m,
          E = 'loading' === y,
          w = 'error' === y;
        return {
          status: y,
          fetchStatus: m,
          isLoading: E,
          isSuccess: 'success' === y,
          isError: w,
          isInitialLoading: E && b,
          data: r,
          dataUpdatedAt: f,
          error: p,
          errorUpdatedAt: h,
          failureCount: d.fetchFailureCount,
          failureReason: d.fetchFailureReason,
          errorUpdateCount: d.errorUpdateCount,
          isFetched: d.dataUpdateCount > 0 || d.errorUpdateCount > 0,
          isFetchedAfterMount:
            d.dataUpdateCount > u.dataUpdateCount || d.errorUpdateCount > u.errorUpdateCount,
          isFetching: b,
          isRefetching: b && !E,
          isLoadingError: w && 0 === d.dataUpdatedAt,
          isPaused: 'paused' === m,
          isPlaceholderData: g,
          isPreviousData: v,
          isRefetchError: w && 0 !== d.dataUpdatedAt,
          isStale: et(e, t),
          refetch: this.refetch,
          remove: this.remove,
        };
      }
      updateResult(e) {
        let t = this.currentResult,
          r = this.createResult(this.currentQuery, this.options);
        if (
          ((this.currentResultState = this.currentQuery.state),
          (this.currentResultOptions = this.options),
          D(r, t))
        )
          return;
        this.currentResult = r;
        let n = { cache: !0 },
          a = () => {
            if (!t) return !0;
            let { notifyOnChangeProps: e } = this.options,
              r = 'function' == typeof e ? e() : e;
            if ('all' === r || (!r && !this.trackedProps.size)) return !0;
            let n = new Set(null != r ? r : this.trackedProps);
            return (
              this.options.useErrorBoundary && n.add('error'),
              Object.keys(this.currentResult).some(
                (e) => this.currentResult[e] !== t[e] && n.has(e),
              )
            );
          };
        ((null == e ? void 0 : e.listeners) !== !1 && a() && (n.listeners = !0),
          this.notify({ ...n, ...e }));
      }
      updateQuery() {
        let e = this.client.getQueryCache().build(this.client, this.options);
        if (e === this.currentQuery) return;
        let t = this.currentQuery;
        ((this.currentQuery = e),
          (this.currentQueryInitialState = e.state),
          (this.previousQueryResult = this.currentResult),
          this.hasListeners() && (null == t || t.removeObserver(this), e.addObserver(this)));
      }
      onQueryUpdate(e) {
        let t = {};
        ('success' === e.type
          ? (t.onSuccess = !e.manual)
          : 'error' !== e.type || V(e.error) || (t.onError = !0),
          this.updateResult(t),
          this.hasListeners() && this.updateTimers());
      }
      notify(e) {
        U.batch(() => {
          var t, r, n, a, i, o, s, l;
          (e.onSuccess
            ? (null == (t = (r = this.options).onSuccess) || t.call(r, this.currentResult.data),
              null == (n = (a = this.options).onSettled) ||
                n.call(a, this.currentResult.data, null))
            : e.onError &&
              (null == (i = (o = this.options).onError) || i.call(o, this.currentResult.error),
              null == (s = (l = this.options).onSettled) ||
                s.call(l, void 0, this.currentResult.error)),
            e.listeners &&
              this.listeners.forEach(({ listener: e }) => {
                e(this.currentResult);
              }),
            e.cache &&
              this.client
                .getQueryCache()
                .notify({ query: this.currentQuery, type: 'observerResultsUpdated' }));
        });
      }
    }
    function J(e, t) {
      return (
        (!1 !== t.enabled &&
          !e.state.dataUpdatedAt &&
          ('error' !== e.state.status || !1 !== t.retryOnMount)) ||
        (e.state.dataUpdatedAt > 0 && X(e, t, t.refetchOnMount))
      );
    }
    function X(e, t, r) {
      if (!1 !== t.enabled) {
        let n = 'function' == typeof r ? r(e) : r;
        return 'always' === n || (!1 !== n && et(e, t));
      }
      return !1;
    }
    function ee(e, t, r, n) {
      return (
        !1 !== r.enabled &&
        (e !== t || !1 === n.enabled) &&
        (!r.suspense || 'error' !== e.state.status) &&
        et(e, r)
      );
    }
    function et(e, t) {
      return e.isStaleByTime(t.staleTime);
    }
    let er = e.i(55248).useSyncExternalStore,
      en = b.createContext(
        ((l = !1),
        {
          clearReset: () => {
            l = !1;
          },
          reset: () => {
            l = !0;
          },
          isReset: () => l,
        }),
      ),
      ea = b.createContext(void 0),
      ei = b.createContext(!1);
    function eo(e, t) {
      return (
        e ||
        (t && 'u' > typeof window
          ? (window.ReactQueryClientContext || (window.ReactQueryClientContext = ea),
            window.ReactQueryClientContext)
          : ea)
      );
    }
    let es = ({ context: e } = {}) => {
        let t = b.useContext(eo(e, b.useContext(ei)));
        if (!t) throw Error('No QueryClient set, use QueryClientProvider to set one');
        return t;
      },
      el = ({ client: e, children: t, context: r, contextSharing: n = !1 }) => {
        b.useEffect(
          () => (
            e.mount(),
            () => {
              e.unmount();
            }
          ),
          [e],
        );
        let a = eo(r, n);
        return b.createElement(
          ei.Provider,
          { value: !r && n },
          b.createElement(a.Provider, { value: e }, t),
        );
      },
      eu = b.createContext(!1);
    function ec(e, t) {
      return 'function' == typeof e ? e(...t) : !!e;
    }
    function ed(e, t) {
      let r = es({ context: e.context }),
        n = b.useContext(eu),
        a = b.useContext(en),
        i = r.defaultQueryOptions(e);
      ((i._optimisticResults = n ? 'isRestoring' : 'optimistic'),
        i.onError && (i.onError = U.batchCalls(i.onError)),
        i.onSuccess && (i.onSuccess = U.batchCalls(i.onSuccess)),
        i.onSettled && (i.onSettled = U.batchCalls(i.onSettled)),
        i.suspense &&
          ('number' != typeof i.staleTime && (i.staleTime = 1e3),
          'number' == typeof i.cacheTime && (i.cacheTime = Math.max(i.cacheTime, 1e3))),
        (i.suspense || i.useErrorBoundary) && !a.isReset() && (i.retryOnMount = !1),
        b.useEffect(() => {
          a.clearReset();
        }, [a]));
      let [o] = b.useState(() => new t(r, i)),
        s = o.getOptimisticResult(i);
      if (
        (er(
          b.useCallback(
            (e) => {
              let t = n ? () => void 0 : o.subscribe(U.batchCalls(e));
              return (o.updateResult(), t);
            },
            [o, n],
          ),
          () => o.getCurrentResult(),
          () => o.getCurrentResult(),
        ),
        b.useEffect(() => {
          o.setOptions(i, { listeners: !1 });
        }, [i, o]),
        (null == i ? void 0 : i.suspense) && s.isLoading && s.isFetching && !n)
      )
        throw o
          .fetchOptimistic(i)
          .then(({ data: e }) => {
            (null == i.onSuccess || i.onSuccess(e), null == i.onSettled || i.onSettled(e, null));
          })
          .catch((e) => {
            (a.clearReset(),
              null == i.onError || i.onError(e),
              null == i.onSettled || i.onSettled(void 0, e));
          });
      if (
        (({ result: e, errorResetBoundary: t, useErrorBoundary: r, query: n }) =>
          e.isError && !t.isReset() && !e.isFetching && ec(r, [e.error, n]))({
          result: s,
          errorResetBoundary: a,
          useErrorBoundary: i.useErrorBoundary,
          query: o.getCurrentQuery(),
        })
      )
        throw s.error;
      return i.notifyOnChangeProps ? s : o.trackResult(s);
    }
    function ef(e, t, r) {
      return ed(x(e, t, r), Y);
    }
    eu.Provider;
    var ep = e.g && e.g.Object === Object && e.g,
      eh = 'object' == typeof self && self && self.Object === Object && self,
      em = ep || eh || Function('return this')(),
      ey = em.Symbol,
      ev = Object.prototype,
      eg = ev.hasOwnProperty,
      eb = ev.toString,
      eE = ey ? ey.toStringTag : void 0;
    let ew = function (e) {
      var t = eg.call(e, eE),
        r = e[eE];
      try {
        e[eE] = void 0;
        var n = !0;
      } catch (e) {}
      var a = eb.call(e);
      return (n && (t ? (e[eE] = r) : delete e[eE]), a);
    };
    var eC = Object.prototype.toString,
      eP = ey ? ey.toStringTag : void 0;
    let eS = function (e) {
        return null == e
          ? void 0 === e
            ? '[object Undefined]'
            : '[object Null]'
          : eP && eP in Object(e)
            ? ew(e)
            : eC.call(e);
      },
      eO = function (e) {
        var t = typeof e;
        return null != e && ('object' == t || 'function' == t);
      },
      ex = function (e) {
        if (!eO(e)) return !1;
        var t = eS(e);
        return (
          '[object Function]' == t ||
          '[object GeneratorFunction]' == t ||
          '[object AsyncFunction]' == t ||
          '[object Proxy]' == t
        );
      };
    var eL = em['__core-js_shared__'],
      eA = (c = /[^.]+$/.exec((eL && eL.keys && eL.keys.IE_PROTO) || ''))
        ? 'Symbol(src)_1.' + c
        : '',
      ek = Function.prototype.toString;
    let eF = function (e) {
      if (null != e) {
        try {
          return ek.call(e);
        } catch (e) {}
        try {
          return e + '';
        } catch (e) {}
      }
      return '';
    };
    var e_ = /^\[object .+?Constructor\]$/,
      eR = Object.prototype,
      eD = Function.prototype.toString,
      eM = eR.hasOwnProperty,
      eN = RegExp(
        '^' +
          eD
            .call(eM)
            .replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
            .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') +
          '$',
      );
    let eT = function (e) {
        return !!eO(e) && (!eA || !(eA in e)) && (ex(e) ? eN : e_).test(eF(e));
      },
      ej = function (e, t) {
        var r = null == e ? void 0 : e[t];
        return eT(r) ? r : void 0;
      };
    var eI = ej(Object, 'create'),
      e$ = Object.prototype.hasOwnProperty,
      eq = Object.prototype.hasOwnProperty;
    function eU(e) {
      var t = -1,
        r = null == e ? 0 : e.length;
      for (this.clear(); ++t < r; ) {
        var n = e[t];
        this.set(n[0], n[1]);
      }
    }
    ((eU.prototype.clear = function () {
      ((this.__data__ = eI ? eI(null) : {}), (this.size = 0));
    }),
      (eU.prototype.delete = function (e) {
        var t = this.has(e) && delete this.__data__[e];
        return ((this.size -= !!t), t);
      }),
      (eU.prototype.get = function (e) {
        var t = this.__data__;
        if (eI) {
          var r = t[e];
          return '__lodash_hash_undefined__' === r ? void 0 : r;
        }
        return e$.call(t, e) ? t[e] : void 0;
      }),
      (eU.prototype.has = function (e) {
        var t = this.__data__;
        return eI ? void 0 !== t[e] : eq.call(t, e);
      }),
      (eU.prototype.set = function (e, t) {
        var r = this.__data__;
        return (
          (this.size += +!this.has(e)),
          (r[e] = eI && void 0 === t ? '__lodash_hash_undefined__' : t),
          this
        );
      }));
    let eK = function (e, t) {
        return e === t || (e != e && t != t);
      },
      eQ = function (e, t) {
        for (var r = e.length; r--; ) if (eK(e[r][0], t)) return r;
        return -1;
      };
    var ez = Array.prototype.splice;
    function eB(e) {
      var t = -1,
        r = null == e ? 0 : e.length;
      for (this.clear(); ++t < r; ) {
        var n = e[t];
        this.set(n[0], n[1]);
      }
    }
    ((eB.prototype.clear = function () {
      ((this.__data__ = []), (this.size = 0));
    }),
      (eB.prototype.delete = function (e) {
        var t = this.__data__,
          r = eQ(t, e);
        return !(r < 0) && (r == t.length - 1 ? t.pop() : ez.call(t, r, 1), --this.size, !0);
      }),
      (eB.prototype.get = function (e) {
        var t = this.__data__,
          r = eQ(t, e);
        return r < 0 ? void 0 : t[r][1];
      }),
      (eB.prototype.has = function (e) {
        return eQ(this.__data__, e) > -1;
      }),
      (eB.prototype.set = function (e, t) {
        var r = this.__data__,
          n = eQ(r, e);
        return (n < 0 ? (++this.size, r.push([e, t])) : (r[n][1] = t), this);
      }));
    var eW = ej(em, 'Map');
    let eH = function (e) {
        var t = typeof e;
        return 'string' == t || 'number' == t || 'symbol' == t || 'boolean' == t
          ? '__proto__' !== e
          : null === e;
      },
      eG = function (e, t) {
        var r = e.__data__;
        return eH(t) ? r['string' == typeof t ? 'string' : 'hash'] : r.map;
      };
    function eV(e) {
      var t = -1,
        r = null == e ? 0 : e.length;
      for (this.clear(); ++t < r; ) {
        var n = e[t];
        this.set(n[0], n[1]);
      }
    }
    function eZ(e) {
      var t = -1,
        r = null == e ? 0 : e.length;
      for (this.__data__ = new eV(); ++t < r; ) this.add(e[t]);
    }
    ((eV.prototype.clear = function () {
      ((this.size = 0),
        (this.__data__ = { hash: new eU(), map: new (eW || eB)(), string: new eU() }));
    }),
      (eV.prototype.delete = function (e) {
        var t = eG(this, e).delete(e);
        return ((this.size -= !!t), t);
      }),
      (eV.prototype.get = function (e) {
        return eG(this, e).get(e);
      }),
      (eV.prototype.has = function (e) {
        return eG(this, e).has(e);
      }),
      (eV.prototype.set = function (e, t) {
        var r = eG(this, e),
          n = r.size;
        return (r.set(e, t), (this.size += +(r.size != n)), this);
      }),
      (eZ.prototype.add = eZ.prototype.push =
        function (e) {
          return (this.__data__.set(e, '__lodash_hash_undefined__'), this);
        }),
      (eZ.prototype.has = function (e) {
        return this.__data__.has(e);
      }));
    let eY = function (e, t, r, n) {
        for (var a = e.length, i = r + (n ? 1 : -1); n ? i-- : ++i < a; )
          if (t(e[i], i, e)) return i;
        return -1;
      },
      eJ = function (e) {
        return e != e;
      },
      eX = function (e, t, r) {
        for (var n = r - 1, a = e.length; ++n < a; ) if (e[n] === t) return n;
        return -1;
      },
      e0 = function (e, t) {
        return !!(null == e ? 0 : e.length) && (t == t ? eX(e, t, 0) : eY(e, eJ, 0)) > -1;
      },
      e1 = function (e, t, r) {
        for (var n = -1, a = null == e ? 0 : e.length; ++n < a; ) if (r(t, e[n])) return !0;
        return !1;
      },
      e2 = function (e, t) {
        for (var r = -1, n = null == e ? 0 : e.length, a = Array(n); ++r < n; )
          a[r] = t(e[r], r, e);
        return a;
      },
      e4 = function (e) {
        return function (t) {
          return e(t);
        };
      },
      e3 = function (e, t) {
        return e.has(t);
      },
      e8 = function (e, t, r, n) {
        var a = -1,
          i = e0,
          o = !0,
          s = e.length,
          l = [],
          u = t.length;
        if (!s) return l;
        (r && (t = e2(t, e4(r))),
          n ? ((i = e1), (o = !1)) : t.length >= 200 && ((i = e3), (o = !1), (t = new eZ(t))));
        e: for (; ++a < s; ) {
          var c = e[a],
            d = null == r ? c : r(c);
          if (((c = n || 0 !== c ? c : 0), o && d == d)) {
            for (var f = u; f--; ) if (t[f] === d) continue e;
            l.push(c);
          } else i(t, d, n) || l.push(c);
        }
        return l;
      },
      e6 = function (e, t) {
        for (var r = -1, n = t.length, a = e.length; ++r < n; ) e[a + r] = t[r];
        return e;
      },
      e5 = function (e) {
        return null != e && 'object' == typeof e;
      },
      e9 = function (e) {
        return e5(e) && '[object Arguments]' == eS(e);
      };
    var e7 = Object.prototype,
      te = e7.hasOwnProperty,
      tt = e7.propertyIsEnumerable,
      tr = e9(
        (function () {
          return arguments;
        })(),
      )
        ? e9
        : function (e) {
            return e5(e) && te.call(e, 'callee') && !tt.call(e, 'callee');
          },
      tn = Array.isArray,
      ta = ey ? ey.isConcatSpreadable : void 0;
    let ti = function (e) {
        return tn(e) || tr(e) || !!(ta && e && e[ta]);
      },
      to = function e(t, r, n, a, i) {
        var o = -1,
          s = t.length;
        for (n || (n = ti), i || (i = []); ++o < s; ) {
          var l = t[o];
          r > 0 && n(l) ? (r > 1 ? e(l, r - 1, n, a, i) : e6(i, l)) : a || (i[i.length] = l);
        }
        return i;
      },
      ts = function (e) {
        return e;
      },
      tl = function (e, t, r) {
        switch (r.length) {
          case 0:
            return e.call(t);
          case 1:
            return e.call(t, r[0]);
          case 2:
            return e.call(t, r[0], r[1]);
          case 3:
            return e.call(t, r[0], r[1], r[2]);
        }
        return e.apply(t, r);
      };
    var tu = Math.max,
      tc = (function () {
        try {
          var e = ej(Object, 'defineProperty');
          return (e({}, '', {}), e);
        } catch (e) {}
      })(),
      td = Date.now,
      tf =
        ((d = tc
          ? function (e, t) {
              return tc(e, 'toString', {
                configurable: !0,
                enumerable: !1,
                value: function () {
                  return t;
                },
                writable: !0,
              });
            }
          : ts),
        (f = 0),
        (p = 0),
        function () {
          var e = td(),
            t = 16 - (e - p);
          if (((p = e), t > 0)) {
            if (++f >= 800) return arguments[0];
          } else f = 0;
          return d.apply(void 0, arguments);
        });
    let tp = function (e, t) {
        var r;
        return tf(
          ((r = tu(void 0 === (r = t) ? e.length - 1 : r, 0)),
          function () {
            for (var t = arguments, n = -1, a = tu(t.length - r, 0), i = Array(a); ++n < a; )
              i[n] = t[r + n];
            n = -1;
            for (var o = Array(r + 1); ++n < r; ) o[n] = t[n];
            return ((o[r] = ts(i)), tl(e, this, o));
          }),
          e + '',
        );
      },
      th = function (e) {
        return 'number' == typeof e && e > -1 && e % 1 == 0 && e <= 0x1fffffffffffff;
      },
      tm = function (e) {
        return null != e && th(e.length) && !ex(e);
      },
      ty = function (e) {
        return e5(e) && tm(e);
      },
      tv = function (e) {
        var t = null == e ? 0 : e.length;
        return t ? e[t - 1] : void 0;
      };
    var tg = tp(function (e, t) {
      var r = tv(t);
      return (ty(r) && (r = void 0), ty(e) ? e8(e, to(t, 1, ty, !0), void 0, r) : []);
    });
    e.s(['default', 0, tg], 78468);
    var tb = ej(em, 'Set');
    let tE = function (e) {
      var t = -1,
        r = Array(e.size);
      return (
        e.forEach(function (e) {
          r[++t] = e;
        }),
        r
      );
    };
    var tw =
      tb && 1 / tE(new tb([, -0]))[1] == 1 / 0
        ? function (e) {
            return new tb(e);
          }
        : function () {};
    let tC = function (e, t, r) {
      var n = -1,
        a = e0,
        i = e.length,
        o = !0,
        s = [],
        l = s;
      if (r) ((o = !1), (a = e1));
      else if (i >= 200) {
        var u = t ? null : tw(e);
        if (u) return tE(u);
        ((o = !1), (a = e3), (l = new eZ()));
      } else l = t ? [] : s;
      e: for (; ++n < i; ) {
        var c = e[n],
          d = t ? t(c) : c;
        if (((c = r || 0 !== c ? c : 0), o && d == d)) {
          for (var f = l.length; f--; ) if (l[f] === d) continue e;
          (t && l.push(d), s.push(c));
        } else a(l, d, r) || (l !== s && l.push(d), s.push(c));
      }
      return s;
    };
    var tP = tp(function (e) {
      var t = tv(e);
      return ((t = 'function' == typeof t ? t : void 0), tC(to(e, 1, ty, !0), void 0, t));
    });
    e.s(['default', 0, tP], 30821);
    var tS = e.i(37790),
      tO = e.i(44913);
    let tx = function (e, t, r) {
        '__proto__' == t && tc
          ? tc(e, t, { configurable: !0, enumerable: !0, value: r, writable: !0 })
          : (e[t] = r);
      },
      tL = function (e) {
        for (var t = -1, r = null == e ? 0 : e.length, n = {}; ++t < r; ) {
          var a = e[t];
          tx(n, a[0], a[1]);
        }
        return n;
      },
      tA = function (e, t) {
        for (var r = -1, n = null == e ? 0 : e.length, a = 0, i = []; ++r < n; ) {
          var o = e[r];
          t(o, r, e) && (i[a++] = o);
        }
        return i;
      },
      tk = function (e) {
        return function (t) {
          return null == t ? void 0 : t[e];
        };
      },
      tF = function (e, t) {
        for (var r = -1, n = Array(e); ++r < e; ) n[r] = t(r);
        return n;
      };
    var t_ = Math.max,
      tR = tp(function (e) {
        if (!(e && e.length)) return [];
        var t = 0;
        return (
          (e = tA(e, function (e) {
            if (ty(e)) return ((t = t_(e.length, t)), !0);
          })),
          tF(t, function (t) {
            return e2(e, tk(t));
          })
        );
      }),
      tD = e.i(80286);
    let tM = function () {
      return em.Date.now();
    };
    var tN = /\s/;
    let tT = function (e) {
      for (var t = e.length; t-- && tN.test(e.charAt(t)); );
      return t;
    };
    var tj = /^\s+/;
    let tI = function (e) {
      return 'symbol' == typeof e || (e5(e) && '[object Symbol]' == eS(e));
    };
    var t$ = 0 / 0,
      tq = /^[-+]0x[0-9a-f]+$/i,
      tU = /^0b[01]+$/i,
      tK = /^0o[0-7]+$/i,
      tQ = parseInt;
    let tz = function (e) {
      if ('number' == typeof e) return e;
      if (tI(e)) return t$;
      if (eO(e)) {
        var t,
          r = 'function' == typeof e.valueOf ? e.valueOf() : e;
        e = eO(r) ? r + '' : r;
      }
      if ('string' != typeof e) return 0 === e ? e : +e;
      e = (t = e) ? t.slice(0, tT(t) + 1).replace(tj, '') : t;
      var n = tU.test(e);
      return n || tK.test(e) ? tQ(e.slice(2), n ? 2 : 8) : tq.test(e) ? t$ : +e;
    };
    var tB = Math.max,
      tW = Math.min;
    let tH = function (e, t, r) {
        var n,
          a,
          i,
          o,
          s,
          l,
          u = 0,
          c = !1,
          d = !1,
          f = !0;
        if ('function' != typeof e) throw TypeError('Expected a function');
        function p(t) {
          var r = n,
            i = a;
          return ((n = a = void 0), (u = t), (o = e.apply(i, r)));
        }
        function h(e) {
          var r = e - l,
            n = e - u;
          return void 0 === l || r >= t || r < 0 || (d && n >= i);
        }
        function m() {
          var e,
            r,
            n,
            a = tM();
          if (h(a)) return y(a);
          s = setTimeout(m, ((e = a - l), (r = a - u), (n = t - e), d ? tW(n, i - r) : n));
        }
        function y(e) {
          return ((s = void 0), f && n) ? p(e) : ((n = a = void 0), o);
        }
        function v() {
          var e,
            r = tM(),
            i = h(r);
          if (((n = arguments), (a = this), (l = r), i)) {
            if (void 0 === s) return ((u = e = l), (s = setTimeout(m, t)), c ? p(e) : o);
            if (d) return (clearTimeout(s), (s = setTimeout(m, t)), p(l));
          }
          return (void 0 === s && (s = setTimeout(m, t)), o);
        }
        return (
          (t = tz(t) || 0),
          eO(r) &&
            ((c = !!r.leading),
            (i = (d = 'maxWait' in r) ? tB(tz(r.maxWait) || 0, t) : i),
            (f = 'trailing' in r ? !!r.trailing : f)),
          (v.cancel = function () {
            (void 0 !== s && clearTimeout(s), (u = 0), (n = l = a = s = void 0));
          }),
          (v.flush = function () {
            return void 0 === s ? o : y(tM());
          }),
          v
        );
      },
      tG = console;
    class tV {
      destroy() {
        this.clearGcTimeout();
      }
      scheduleGc() {
        (this.clearGcTimeout(),
          S(this.cacheTime) &&
            (this.gcTimeout = setTimeout(() => {
              this.optionalRemove();
            }, this.cacheTime)));
      }
      updateCacheTime(e) {
        this.cacheTime = Math.max(this.cacheTime || 0, null != e ? e : C ? 1 / 0 : 3e5);
      }
      clearGcTimeout() {
        this.gcTimeout && (clearTimeout(this.gcTimeout), (this.gcTimeout = void 0));
      }
    }
    class tZ extends tV {
      constructor(e) {
        (super(),
          (this.defaultOptions = e.defaultOptions),
          (this.mutationId = e.mutationId),
          (this.mutationCache = e.mutationCache),
          (this.logger = e.logger || tG),
          (this.observers = []),
          (this.state = e.state || tY()),
          this.setOptions(e.options),
          this.scheduleGc());
      }
      setOptions(e) {
        ((this.options = { ...this.defaultOptions, ...e }),
          this.updateCacheTime(this.options.cacheTime));
      }
      get meta() {
        return this.options.meta;
      }
      setState(e) {
        this.dispatch({ type: 'setState', state: e });
      }
      addObserver(e) {
        this.observers.includes(e) ||
          (this.observers.push(e),
          this.clearGcTimeout(),
          this.mutationCache.notify({ type: 'observerAdded', mutation: this, observer: e }));
      }
      removeObserver(e) {
        ((this.observers = this.observers.filter((t) => t !== e)),
          this.scheduleGc(),
          this.mutationCache.notify({ type: 'observerRemoved', mutation: this, observer: e }));
      }
      optionalRemove() {
        this.observers.length ||
          ('loading' === this.state.status ? this.scheduleGc() : this.mutationCache.remove(this));
      }
      continue() {
        var e, t;
        return null != (e = null == (t = this.retryer) ? void 0 : t.continue())
          ? e
          : this.execute();
      }
      async execute() {
        var e, t, r, n, a, i, o, s, l, u, c, d, f, p, h, m, y, v, g, b;
        let E = () => {
            var e;
            return (
              (this.retryer = Z({
                fn: () =>
                  this.options.mutationFn
                    ? this.options.mutationFn(this.state.variables)
                    : Promise.reject('No mutationFn found'),
                onFail: (e, t) => {
                  this.dispatch({ type: 'failed', failureCount: e, error: t });
                },
                onPause: () => {
                  this.dispatch({ type: 'pause' });
                },
                onContinue: () => {
                  this.dispatch({ type: 'continue' });
                },
                retry: null != (e = this.options.retry) ? e : 0,
                retryDelay: this.options.retryDelay,
                networkMode: this.options.networkMode,
              })),
              this.retryer.promise
            );
          },
          w = 'loading' === this.state.status;
        try {
          if (!w) {
            (this.dispatch({ type: 'loading', variables: this.options.variables }),
              await (null == (l = (u = this.mutationCache.config).onMutate)
                ? void 0
                : l.call(u, this.state.variables, this)));
            let e = await (null == (c = (d = this.options).onMutate)
              ? void 0
              : c.call(d, this.state.variables));
            e !== this.state.context &&
              this.dispatch({ type: 'loading', context: e, variables: this.state.variables });
          }
          let f = await E();
          return (
            await (null == (e = (t = this.mutationCache.config).onSuccess)
              ? void 0
              : e.call(t, f, this.state.variables, this.state.context, this)),
            await (null == (r = (n = this.options).onSuccess)
              ? void 0
              : r.call(n, f, this.state.variables, this.state.context)),
            await (null == (a = (i = this.mutationCache.config).onSettled)
              ? void 0
              : a.call(i, f, null, this.state.variables, this.state.context, this)),
            await (null == (o = (s = this.options).onSettled)
              ? void 0
              : o.call(s, f, null, this.state.variables, this.state.context)),
            this.dispatch({ type: 'success', data: f }),
            f
          );
        } catch (e) {
          try {
            throw (
              await (null == (f = (p = this.mutationCache.config).onError)
                ? void 0
                : f.call(p, e, this.state.variables, this.state.context, this)),
              await (null == (h = (m = this.options).onError)
                ? void 0
                : h.call(m, e, this.state.variables, this.state.context)),
              await (null == (y = (v = this.mutationCache.config).onSettled)
                ? void 0
                : y.call(v, void 0, e, this.state.variables, this.state.context, this)),
              await (null == (g = (b = this.options).onSettled)
                ? void 0
                : g.call(b, void 0, e, this.state.variables, this.state.context)),
              e
            );
          } finally {
            this.dispatch({ type: 'error', error: e });
          }
        }
      }
      dispatch(e) {
        let t = (t) => {
          switch (e.type) {
            case 'failed':
              return { ...t, failureCount: e.failureCount, failureReason: e.error };
            case 'pause':
              return { ...t, isPaused: !0 };
            case 'continue':
              return { ...t, isPaused: !1 };
            case 'loading':
              return {
                ...t,
                context: e.context,
                data: void 0,
                failureCount: 0,
                failureReason: null,
                error: null,
                isPaused: !H(this.options.networkMode),
                status: 'loading',
                variables: e.variables,
              };
            case 'success':
              return {
                ...t,
                data: e.data,
                failureCount: 0,
                failureReason: null,
                error: null,
                status: 'success',
                isPaused: !1,
              };
            case 'error':
              return {
                ...t,
                data: void 0,
                error: e.error,
                failureCount: t.failureCount + 1,
                failureReason: e.error,
                isPaused: !1,
                status: 'error',
              };
            case 'setState':
              return { ...t, ...e.state };
          }
        };
        ((this.state = t(this.state)),
          U.batch(() => {
            (this.observers.forEach((t) => {
              t.onMutationUpdate(e);
            }),
              this.mutationCache.notify({ mutation: this, type: 'updated', action: e }));
          }));
      }
    }
    function tY() {
      return {
        context: void 0,
        data: void 0,
        error: null,
        failureCount: 0,
        failureReason: null,
        isPaused: !1,
        status: 'idle',
        variables: void 0,
      };
    }
    class tJ extends K {
      constructor(e, t) {
        (super(), (this.client = e), this.setOptions(t), this.bindMethods(), this.updateResult());
      }
      bindMethods() {
        ((this.mutate = this.mutate.bind(this)), (this.reset = this.reset.bind(this)));
      }
      setOptions(e) {
        var t;
        let r = this.options;
        ((this.options = this.client.defaultMutationOptions(e)),
          D(r, this.options) ||
            this.client.getMutationCache().notify({
              type: 'observerOptionsUpdated',
              mutation: this.currentMutation,
              observer: this,
            }),
          null == (t = this.currentMutation) || t.setOptions(this.options));
      }
      onUnsubscribe() {
        if (!this.hasListeners()) {
          var e;
          null == (e = this.currentMutation) || e.removeObserver(this);
        }
      }
      onMutationUpdate(e) {
        this.updateResult();
        let t = { listeners: !0 };
        ('success' === e.type ? (t.onSuccess = !0) : 'error' === e.type && (t.onError = !0),
          this.notify(t));
      }
      getCurrentResult() {
        return this.currentResult;
      }
      reset() {
        ((this.currentMutation = void 0), this.updateResult(), this.notify({ listeners: !0 }));
      }
      mutate(e, t) {
        return (
          (this.mutateOptions = t),
          this.currentMutation && this.currentMutation.removeObserver(this),
          (this.currentMutation = this.client.getMutationCache().build(this.client, {
            ...this.options,
            variables: void 0 !== e ? e : this.options.variables,
          })),
          this.currentMutation.addObserver(this),
          this.currentMutation.execute()
        );
      }
      updateResult() {
        let e = this.currentMutation ? this.currentMutation.state : tY(),
          t = 'loading' === e.status,
          r = {
            ...e,
            isLoading: t,
            isPending: t,
            isSuccess: 'success' === e.status,
            isError: 'error' === e.status,
            isIdle: 'idle' === e.status,
            mutate: this.mutate,
            reset: this.reset,
          };
        this.currentResult = r;
      }
      notify(e) {
        U.batch(() => {
          if (this.mutateOptions && this.hasListeners()) {
            var t, r, n, a, i, o, s, l;
            e.onSuccess
              ? (null == (t = (r = this.mutateOptions).onSuccess) ||
                  t.call(
                    r,
                    this.currentResult.data,
                    this.currentResult.variables,
                    this.currentResult.context,
                  ),
                null == (n = (a = this.mutateOptions).onSettled) ||
                  n.call(
                    a,
                    this.currentResult.data,
                    null,
                    this.currentResult.variables,
                    this.currentResult.context,
                  ))
              : e.onError &&
                (null == (i = (o = this.mutateOptions).onError) ||
                  i.call(
                    o,
                    this.currentResult.error,
                    this.currentResult.variables,
                    this.currentResult.context,
                  ),
                null == (s = (l = this.mutateOptions).onSettled) ||
                  s.call(
                    l,
                    void 0,
                    this.currentResult.error,
                    this.currentResult.variables,
                    this.currentResult.context,
                  ));
          }
          e.listeners &&
            this.listeners.forEach(({ listener: e }) => {
              e(this.currentResult);
            });
        });
      }
    }
    function tX(e, t, r) {
      var n, a, i;
      let o =
          ((n = e),
          (a = t),
          (i = r),
          j(n)
            ? 'function' == typeof a
              ? { ...i, mutationKey: n, mutationFn: a }
              : { ...a, mutationKey: n }
            : 'function' == typeof n
              ? { ...a, mutationFn: n }
              : { ...n }),
        s = es({ context: o.context }),
        [l] = b.useState(() => new tJ(s, o));
      b.useEffect(() => {
        l.setOptions(o);
      }, [l, o]);
      let u = er(
          b.useCallback((e) => l.subscribe(U.batchCalls(e)), [l]),
          () => l.getCurrentResult(),
          () => l.getCurrentResult(),
        ),
        c = b.useCallback(
          (e, t) => {
            l.mutate(e, t).catch(t0);
          },
          [l],
        );
      if (u.error && ec(l.options.useErrorBoundary, [u.error])) throw u.error;
      return { ...u, mutate: c, mutateAsync: u.mutate };
    }
    function t0() {}
    function t1() {
      return {
        onFetch: (e) => {
          e.fetchFn = () => {
            var t, r, n, a, i, o;
            let s,
              l = null == (t = e.fetchOptions) || null == (r = t.meta) ? void 0 : r.refetchPage,
              u = null == (n = e.fetchOptions) || null == (a = n.meta) ? void 0 : a.fetchMore,
              c = null == u ? void 0 : u.pageParam,
              d = (null == u ? void 0 : u.direction) === 'forward',
              f = (null == u ? void 0 : u.direction) === 'backward',
              p = (null == (i = e.state.data) ? void 0 : i.pages) || [],
              h = (null == (o = e.state.data) ? void 0 : o.pageParams) || [],
              m = h,
              y = !1,
              v =
                e.options.queryFn ||
                (() =>
                  Promise.reject("Missing queryFn for queryKey '" + e.options.queryHash + "'")),
              g = (e, t, r, n) => ((m = n ? [t, ...m] : [...m, t]), n ? [r, ...e] : [...e, r]),
              b = (t, r, n, a) => {
                if (y) return Promise.reject('Cancelled');
                if (void 0 === n && !r && t.length) return Promise.resolve(t);
                let i = { queryKey: e.queryKey, pageParam: n, meta: e.options.meta };
                return (
                  Object.defineProperty(i, 'signal', {
                    enumerable: !0,
                    get: () => {
                      var t, r;
                      return (
                        null != (t = e.signal) && t.aborted
                          ? (y = !0)
                          : null == (r = e.signal) ||
                            r.addEventListener('abort', () => {
                              y = !0;
                            }),
                        e.signal
                      );
                    },
                  }),
                  Promise.resolve(v(i)).then((e) => g(t, n, e, a))
                );
              };
            if (p.length)
              if (d) {
                let t = void 0 !== c,
                  r = t ? c : t2(e.options, p);
                s = b(p, t, r);
              } else if (f) {
                let t = void 0 !== c,
                  r = t ? c : t4(e.options, p);
                s = b(p, t, r, !0);
              } else {
                m = [];
                let t = void 0 === e.options.getNextPageParam;
                s =
                  !l || !p[0] || l(p[0], 0, p)
                    ? b([], t, h[0])
                    : Promise.resolve(g([], h[0], p[0]));
                for (let r = 1; r < p.length; r++)
                  s = s.then((n) => {
                    if (!l || !p[r] || l(p[r], r, p)) {
                      let a = t ? h[r] : t2(e.options, n);
                      return b(n, t, a);
                    }
                    return Promise.resolve(g(n, h[r], p[r]));
                  });
              }
            else s = b([]);
            return s.then((e) => ({ pages: e, pageParams: m }));
          };
        },
      };
    }
    function t2(e, t) {
      return null == e.getNextPageParam ? void 0 : e.getNextPageParam(t[t.length - 1], t);
    }
    function t4(e, t) {
      return null == e.getPreviousPageParam ? void 0 : e.getPreviousPageParam(t[0], t);
    }
    class t3 extends Y {
      constructor(e, t) {
        super(e, t);
      }
      bindMethods() {
        (super.bindMethods(),
          (this.fetchNextPage = this.fetchNextPage.bind(this)),
          (this.fetchPreviousPage = this.fetchPreviousPage.bind(this)));
      }
      setOptions(e, t) {
        super.setOptions({ ...e, behavior: t1() }, t);
      }
      getOptimisticResult(e) {
        return ((e.behavior = t1()), super.getOptimisticResult(e));
      }
      fetchNextPage({ pageParam: e, ...t } = {}) {
        return this.fetch({ ...t, meta: { fetchMore: { direction: 'forward', pageParam: e } } });
      }
      fetchPreviousPage({ pageParam: e, ...t } = {}) {
        return this.fetch({ ...t, meta: { fetchMore: { direction: 'backward', pageParam: e } } });
      }
      createResult(e, t) {
        var r, n, a, i, o, s;
        let { state: l } = e,
          u = super.createResult(e, t),
          { isFetching: c, isRefetching: d } = u,
          f =
            c &&
            (null == (r = l.fetchMeta) || null == (n = r.fetchMore) ? void 0 : n.direction) ===
              'forward',
          p =
            c &&
            (null == (a = l.fetchMeta) || null == (i = a.fetchMore) ? void 0 : i.direction) ===
              'backward';
        return {
          ...u,
          fetchNextPage: this.fetchNextPage,
          fetchPreviousPage: this.fetchPreviousPage,
          hasNextPage: (function (e, t) {
            if (e.getNextPageParam && Array.isArray(t)) {
              let r = t2(e, t);
              return null != r && !1 !== r;
            }
          })(t, null == (o = l.data) ? void 0 : o.pages),
          hasPreviousPage: (function (e, t) {
            if (e.getPreviousPageParam && Array.isArray(t)) {
              let r = t4(e, t);
              return null != r && !1 !== r;
            }
          })(t, null == (s = l.data) ? void 0 : s.pages),
          isFetchingNextPage: f,
          isFetchingPreviousPage: p,
          isRefetching: d && !f && !p,
        };
      }
    }
    function t8(e) {
      var t = (this.__data__ = new eB(e));
      this.size = t.size;
    }
    ((t8.prototype.clear = function () {
      ((this.__data__ = new eB()), (this.size = 0));
    }),
      (t8.prototype.delete = function (e) {
        var t = this.__data__,
          r = t.delete(e);
        return ((this.size = t.size), r);
      }),
      (t8.prototype.get = function (e) {
        return this.__data__.get(e);
      }),
      (t8.prototype.has = function (e) {
        return this.__data__.has(e);
      }),
      (t8.prototype.set = function (e, t) {
        var r = this.__data__;
        if (r instanceof eB) {
          var n = r.__data__;
          if (!eW || n.length < 199) return (n.push([e, t]), (this.size = ++r.size), this);
          r = this.__data__ = new eV(n);
        }
        return (r.set(e, t), (this.size = r.size), this);
      }));
    let t6 = function (e, t) {
        for (var r = -1, n = null == e ? 0 : e.length; ++r < n; ) if (t(e[r], r, e)) return !0;
        return !1;
      },
      t5 = function (e, t, r, n, a, i) {
        var o = 1 & r,
          s = e.length,
          l = t.length;
        if (s != l && !(o && l > s)) return !1;
        var u = i.get(e),
          c = i.get(t);
        if (u && c) return u == t && c == e;
        var d = -1,
          f = !0,
          p = 2 & r ? new eZ() : void 0;
        for (i.set(e, t), i.set(t, e); ++d < s; ) {
          var h = e[d],
            m = t[d];
          if (n) var y = o ? n(m, h, d, t, e, i) : n(h, m, d, e, t, i);
          if (void 0 !== y) {
            if (y) continue;
            f = !1;
            break;
          }
          if (p) {
            if (
              !t6(t, function (e, t) {
                if (!e3(p, t) && (h === e || a(h, e, r, n, i))) return p.push(t);
              })
            ) {
              f = !1;
              break;
            }
          } else if (!(h === m || a(h, m, r, n, i))) {
            f = !1;
            break;
          }
        }
        return (i.delete(e), i.delete(t), f);
      };
    var t9 = em.Uint8Array;
    let t7 = function (e) {
      var t = -1,
        r = Array(e.size);
      return (
        e.forEach(function (e, n) {
          r[++t] = [n, e];
        }),
        r
      );
    };
    var re = ey ? ey.prototype : void 0,
      rt = re ? re.valueOf : void 0;
    let rr = function (e, t, r, n, a, i, o) {
        switch (r) {
          case '[object DataView]':
            if (e.byteLength != t.byteLength || e.byteOffset != t.byteOffset) break;
            ((e = e.buffer), (t = t.buffer));
          case '[object ArrayBuffer]':
            if (e.byteLength != t.byteLength || !i(new t9(e), new t9(t))) break;
            return !0;
          case '[object Boolean]':
          case '[object Date]':
          case '[object Number]':
            return eK(+e, +t);
          case '[object Error]':
            return e.name == t.name && e.message == t.message;
          case '[object RegExp]':
          case '[object String]':
            return e == t + '';
          case '[object Map]':
            var s = t7;
          case '[object Set]':
            var l = 1 & n;
            if ((s || (s = tE), e.size != t.size && !l)) break;
            var u = o.get(e);
            if (u) return u == t;
            ((n |= 2), o.set(e, t));
            var c = t5(s(e), s(t), n, a, i, o);
            return (o.delete(e), c);
          case '[object Symbol]':
            if (rt) return rt.call(e) == rt.call(t);
        }
        return !1;
      },
      rn = function (e, t, r) {
        var n = t(e);
        return tn(e) ? n : e6(n, r(e));
      };
    var ra = Object.prototype.propertyIsEnumerable,
      ri = Object.getOwnPropertySymbols,
      ro = ri
        ? function (e) {
            return null == e
              ? []
              : tA(ri((e = Object(e))), function (t) {
                  return ra.call(e, t);
                });
          }
        : function () {
            return [];
          };
    let rs = function () {
      return !1;
    };
    var rl = /^(?:0|[1-9]\d*)$/;
    let ru = function (e, t) {
      var r = typeof e;
      return (
        !!(t = null == t ? 0x1fffffffffffff : t) &&
        ('number' == r || ('symbol' != r && rl.test(e))) &&
        e > -1 &&
        e % 1 == 0 &&
        e < t
      );
    };
    var rc = {};
    ((rc['[object Float32Array]'] =
      rc['[object Float64Array]'] =
      rc['[object Int8Array]'] =
      rc['[object Int16Array]'] =
      rc['[object Int32Array]'] =
      rc['[object Uint8Array]'] =
      rc['[object Uint8ClampedArray]'] =
      rc['[object Uint16Array]'] =
      rc['[object Uint32Array]'] =
        !0),
      (rc['[object Arguments]'] =
        rc['[object Array]'] =
        rc['[object ArrayBuffer]'] =
        rc['[object Boolean]'] =
        rc['[object DataView]'] =
        rc['[object Date]'] =
        rc['[object Error]'] =
        rc['[object Function]'] =
        rc['[object Map]'] =
        rc['[object Number]'] =
        rc['[object Object]'] =
        rc['[object RegExp]'] =
        rc['[object Set]'] =
        rc['[object String]'] =
        rc['[object WeakMap]'] =
          !1));
    var rd = (function () {
        try {
          return !1;
        } catch (e) {}
      })(),
      rf = rd && rd.isTypedArray,
      rp = rf
        ? e4(rf)
        : function (e) {
            return e5(e) && th(e.length) && !!rc[eS(e)];
          },
      rh = Object.prototype.hasOwnProperty;
    let rm = function (e, t) {
      var r = tn(e),
        n = !r && tr(e),
        a = !r && !n && rs(e),
        i = !r && !n && !a && rp(e),
        o = r || n || a || i,
        s = o ? tF(e.length, String) : [],
        l = s.length;
      for (var u in e)
        (t || rh.call(e, u)) &&
          !(
            o &&
            ('length' == u ||
              (a && ('offset' == u || 'parent' == u)) ||
              (i && ('buffer' == u || 'byteLength' == u || 'byteOffset' == u)) ||
              ru(u, l))
          ) &&
          s.push(u);
      return s;
    };
    var ry = Object.prototype;
    let rv = function (e) {
      var t = e && e.constructor;
      return e === (('function' == typeof t && t.prototype) || ry);
    };
    var rg =
        ((h = Object.keys),
        (m = Object),
        function (e) {
          return h(m(e));
        }),
      rb = Object.prototype.hasOwnProperty;
    let rE = function (e) {
        if (!rv(e)) return rg(e);
        var t = [];
        for (var r in Object(e)) rb.call(e, r) && 'constructor' != r && t.push(r);
        return t;
      },
      rw = function (e) {
        return tm(e) ? rm(e) : rE(e);
      },
      rC = function (e) {
        return rn(e, rw, ro);
      };
    var rP = Object.prototype.hasOwnProperty;
    let rS = function (e, t, r, n, a, i) {
      var o = 1 & r,
        s = rC(e),
        l = s.length;
      if (l != rC(t).length && !o) return !1;
      for (var u = l; u--; ) {
        var c = s[u];
        if (!(o ? c in t : rP.call(t, c))) return !1;
      }
      var d = i.get(e),
        f = i.get(t);
      if (d && f) return d == t && f == e;
      var p = !0;
      (i.set(e, t), i.set(t, e));
      for (var h = o; ++u < l; ) {
        var m = e[(c = s[u])],
          y = t[c];
        if (n) var v = o ? n(y, m, c, t, e, i) : n(m, y, c, e, t, i);
        if (!(void 0 === v ? m === y || a(m, y, r, n, i) : v)) {
          p = !1;
          break;
        }
        h || (h = 'constructor' == c);
      }
      if (p && !h) {
        var g = e.constructor,
          b = t.constructor;
        g != b &&
          'constructor' in e &&
          'constructor' in t &&
          !('function' == typeof g && g instanceof g && 'function' == typeof b && b instanceof b) &&
          (p = !1);
      }
      return (i.delete(e), i.delete(t), p);
    };
    var rO = ej(em, 'DataView'),
      rx = ej(em, 'Promise'),
      rL = ej(em, 'WeakMap'),
      rA = '[object Map]',
      rk = '[object Promise]',
      rF = '[object Set]',
      r_ = '[object WeakMap]',
      rR = '[object DataView]',
      rD = eF(rO),
      rM = eF(eW),
      rN = eF(rx),
      rT = eF(tb),
      rj = eF(rL),
      rI = eS;
    ((rO && rI(new rO(new ArrayBuffer(1))) != rR) ||
      (eW && rI(new eW()) != rA) ||
      (rx && rI(rx.resolve()) != rk) ||
      (tb && rI(new tb()) != rF) ||
      (rL && rI(new rL()) != r_)) &&
      (rI = function (e) {
        var t = eS(e),
          r = '[object Object]' == t ? e.constructor : void 0,
          n = r ? eF(r) : '';
        if (n)
          switch (n) {
            case rD:
              return rR;
            case rM:
              return rA;
            case rN:
              return rk;
            case rT:
              return rF;
            case rj:
              return r_;
          }
        return t;
      });
    let r$ = rI;
    var rq = '[object Arguments]',
      rU = '[object Array]',
      rK = '[object Object]',
      rQ = Object.prototype.hasOwnProperty;
    let rz = function (e, t, r, n, a, i) {
        var o = tn(e),
          s = tn(t),
          l = o ? rU : r$(e),
          u = s ? rU : r$(t);
        ((l = l == rq ? rK : l), (u = u == rq ? rK : u));
        var c = l == rK,
          d = u == rK,
          f = l == u;
        if (f && rs(e)) {
          if (!rs(t)) return !1;
          ((o = !0), (c = !1));
        }
        if (f && !c)
          return (i || (i = new t8()), o || rp(e) ? t5(e, t, r, n, a, i) : rr(e, t, l, r, n, a, i));
        if (!(1 & r)) {
          var p = c && rQ.call(e, '__wrapped__'),
            h = d && rQ.call(t, '__wrapped__');
          if (p || h) {
            var m = p ? e.value() : e,
              y = h ? t.value() : t;
            return (i || (i = new t8()), a(m, y, r, n, i));
          }
        }
        return !!f && (i || (i = new t8()), rS(e, t, r, n, a, i));
      },
      rB = function e(t, r, n, a, i) {
        return (
          t === r ||
          (null != t && null != r && (e5(t) || e5(r)) ? rz(t, r, n, a, e, i) : t != t && r != r)
        );
      },
      rW = function (e, t) {
        return rB(e, t);
      };
    e.s(['default', 0, rW], 18241);
    var rH = e.i(7125);
    let rG = function (e, t, r) {
        var n = -1,
          a = e.length;
        (t < 0 && (t = -t > a ? 0 : a + t),
          (r = r > a ? a : r) < 0 && (r += a),
          (a = t > r ? 0 : (r - t) >>> 0),
          (t >>>= 0));
        for (var i = Array(a); ++n < a; ) i[n] = e[n + t];
        return i;
      },
      rV = function (e, t, r) {
        if (!eO(r)) return !1;
        var n = typeof t;
        return (
          ('number' == n ? !!(tm(r) && ru(t, r.length)) : 'string' == n && t in r) && eK(r[t], e)
        );
      };
    var rZ = 1 / 0;
    let rY = function (e) {
      var t,
        r = (t = e)
          ? (t = tz(t)) === rZ || t === -rZ
            ? (t < 0 ? -1 : 1) * 17976931348623157e292
            : t == t
              ? t
              : 0
          : 0 === t
            ? t
            : 0,
        n = r % 1;
      return r == r ? (n ? r - n : r) : 0;
    };
    var rJ = Math.ceil,
      rX = Math.max;
    let r0 = function (e, t, r) {
      t = (r ? rV(e, t, r) : void 0 === t) ? 1 : rX(rY(t), 0);
      var n = null == e ? 0 : e.length;
      if (!n || t < 1) return [];
      for (var a = 0, i = 0, o = Array(rJ(n / t)); a < n; ) o[i++] = rG(e, a, (a += t));
      return o;
    };
    var r1 = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
      r2 = /^\w*$/;
    let r4 = function (e, t) {
      if (tn(e)) return !1;
      var r = typeof e;
      return (
        !!('number' == r || 'symbol' == r || 'boolean' == r || null == e || tI(e)) ||
        r2.test(e) ||
        !r1.test(e) ||
        (null != t && e in Object(t))
      );
    };
    function r3(e, t) {
      if ('function' != typeof e || (null != t && 'function' != typeof t))
        throw TypeError('Expected a function');
      var r = function () {
        var n = arguments,
          a = t ? t.apply(this, n) : n[0],
          i = r.cache;
        if (i.has(a)) return i.get(a);
        var o = e.apply(this, n);
        return ((r.cache = i.set(a, o) || i), o);
      };
      return ((r.cache = new (r3.Cache || eV)()), r);
    }
    r3.Cache = eV;
    var r8 =
        /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,
      r6 = /\\(\\)?/g,
      r5 =
        ((v = (y = r3(
          function (e) {
            var t = [];
            return (
              46 === e.charCodeAt(0) && t.push(''),
              e.replace(r8, function (e, r, n, a) {
                t.push(n ? a.replace(r6, '$1') : r || e);
              }),
              t
            );
          },
          function (e) {
            return (500 === v.size && v.clear(), e);
          },
        )).cache),
        y),
      r9 = 1 / 0,
      r7 = ey ? ey.prototype : void 0,
      ne = r7 ? r7.toString : void 0;
    let nt = function e(t) {
        if ('string' == typeof t) return t;
        if (tn(t)) return e2(t, e) + '';
        if (tI(t)) return ne ? ne.call(t) : '';
        var r = t + '';
        return '0' == r && 1 / t == -r9 ? '-0' : r;
      },
      nr = function (e, t) {
        return tn(e) ? e : r4(e, t) ? [e] : r5(null == e ? '' : nt(e));
      };
    var nn = 1 / 0;
    let na = function (e) {
        if ('string' == typeof e || tI(e)) return e;
        var t = e + '';
        return '0' == t && 1 / e == -nn ? '-0' : t;
      },
      ni = function (e, t) {
        t = nr(t, e);
        for (var r = 0, n = t.length; null != e && r < n; ) e = e[na(t[r++])];
        return r && r == n ? e : void 0;
      },
      no = function (e, t, r) {
        var n = null == e ? void 0 : ni(e, t);
        return void 0 === n ? r : n;
      };
    e.s(['default', 0, no], 40182);
    let ns = function (e, t, r, n) {
        var a = r.length,
          i = a,
          o = !n;
        if (null == e) return !i;
        for (e = Object(e); a--; ) {
          var s = r[a];
          if (o && s[2] ? s[1] !== e[s[0]] : !(s[0] in e)) return !1;
        }
        for (; ++a < i; ) {
          var l = (s = r[a])[0],
            u = e[l],
            c = s[1];
          if (o && s[2]) {
            if (void 0 === u && !(l in e)) return !1;
          } else {
            var d = new t8();
            if (n) var f = n(u, c, l, e, t, d);
            if (!(void 0 === f ? rB(c, u, 3, n, d) : f)) return !1;
          }
        }
        return !0;
      },
      nl = function (e) {
        return e == e && !eO(e);
      },
      nu = function (e) {
        for (var t = rw(e), r = t.length; r--; ) {
          var n = t[r],
            a = e[n];
          t[r] = [n, a, nl(a)];
        }
        return t;
      },
      nc = function (e, t) {
        return function (r) {
          return null != r && r[e] === t && (void 0 !== t || e in Object(r));
        };
      },
      nd = function (e) {
        var t = nu(e);
        return 1 == t.length && t[0][2]
          ? nc(t[0][0], t[0][1])
          : function (r) {
              return r === e || ns(r, e, t);
            };
      },
      nf = function (e, t) {
        return null != e && t in Object(e);
      },
      np = function (e, t, r) {
        t = nr(t, e);
        for (var n = -1, a = t.length, i = !1; ++n < a; ) {
          var o = na(t[n]);
          if (!(i = null != e && r(e, o))) break;
          e = e[o];
        }
        return i || ++n != a
          ? i
          : !!(a = null == e ? 0 : e.length) && th(a) && ru(o, a) && (tn(e) || tr(e));
      };
    e.s(['default', 0, np], 97596);
    let nh = function (e) {
        return r4(e)
          ? tk(na(e))
          : function (t) {
              return ni(t, e);
            };
      },
      nm = function (e) {
        if ('function' == typeof e) return e;
        if (null == e) return ts;
        if ('object' == typeof e) {
          var t, r;
          return tn(e)
            ? ((t = e[0]),
              (r = e[1]),
              r4(t) && nl(r)
                ? nc(na(t), r)
                : function (e) {
                    var n = no(e, t);
                    return void 0 === n && n === r ? null != e && np(e, t, nf) : rB(r, n, 3);
                  })
            : nd(e);
        }
        return nh(e);
      };
    class ny extends tV {
      constructor(e) {
        (super(),
          (this.abortSignalConsumed = !1),
          (this.defaultOptions = e.defaultOptions),
          this.setOptions(e.options),
          (this.observers = []),
          (this.cache = e.cache),
          (this.logger = e.logger || tG),
          (this.queryKey = e.queryKey),
          (this.queryHash = e.queryHash),
          (this.initialState =
            e.state ||
            (function (e) {
              let t = 'function' == typeof e.initialData ? e.initialData() : e.initialData,
                r = void 0 !== t,
                n = r
                  ? 'function' == typeof e.initialDataUpdatedAt
                    ? e.initialDataUpdatedAt()
                    : e.initialDataUpdatedAt
                  : 0;
              return {
                data: t,
                dataUpdateCount: 0,
                dataUpdatedAt: r ? (null != n ? n : Date.now()) : 0,
                error: null,
                errorUpdateCount: 0,
                errorUpdatedAt: 0,
                fetchFailureCount: 0,
                fetchFailureReason: null,
                fetchMeta: null,
                isInvalidated: !1,
                status: r ? 'success' : 'loading',
                fetchStatus: 'idle',
              };
            })(this.options)),
          (this.state = this.initialState),
          this.scheduleGc());
      }
      get meta() {
        return this.options.meta;
      }
      setOptions(e) {
        ((this.options = { ...this.defaultOptions, ...e }),
          this.updateCacheTime(this.options.cacheTime));
      }
      optionalRemove() {
        this.observers.length || 'idle' !== this.state.fetchStatus || this.cache.remove(this);
      }
      setData(e, t) {
        let r = q(this.state.data, e, this.options);
        return (
          this.dispatch({
            data: r,
            type: 'success',
            dataUpdatedAt: null == t ? void 0 : t.updatedAt,
            manual: null == t ? void 0 : t.manual,
          }),
          r
        );
      }
      setState(e, t) {
        this.dispatch({ type: 'setState', state: e, setStateOptions: t });
      }
      cancel(e) {
        var t;
        let r = this.promise;
        return (
          null == (t = this.retryer) || t.cancel(e),
          r ? r.then(P).catch(P) : Promise.resolve()
        );
      }
      destroy() {
        (super.destroy(), this.cancel({ silent: !0 }));
      }
      reset() {
        (this.destroy(), this.setState(this.initialState));
      }
      isActive() {
        return this.observers.some((e) => !1 !== e.options.enabled);
      }
      isDisabled() {
        return this.getObserversCount() > 0 && !this.isActive();
      }
      isStale() {
        return (
          this.state.isInvalidated ||
          !this.state.dataUpdatedAt ||
          this.observers.some((e) => e.getCurrentResult().isStale)
        );
      }
      isStaleByTime(e = 0) {
        return (
          this.state.isInvalidated || !this.state.dataUpdatedAt || !O(this.state.dataUpdatedAt, e)
        );
      }
      onFocus() {
        var e;
        let t = this.observers.find((e) => e.shouldFetchOnWindowFocus());
        (t && t.refetch({ cancelRefetch: !1 }), null == (e = this.retryer) || e.continue());
      }
      onOnline() {
        var e;
        let t = this.observers.find((e) => e.shouldFetchOnReconnect());
        (t && t.refetch({ cancelRefetch: !1 }), null == (e = this.retryer) || e.continue());
      }
      addObserver(e) {
        this.observers.includes(e) ||
          (this.observers.push(e),
          this.clearGcTimeout(),
          this.cache.notify({ type: 'observerAdded', query: this, observer: e }));
      }
      removeObserver(e) {
        this.observers.includes(e) &&
          ((this.observers = this.observers.filter((t) => t !== e)),
          this.observers.length ||
            (this.retryer &&
              (this.abortSignalConsumed
                ? this.retryer.cancel({ revert: !0 })
                : this.retryer.cancelRetry()),
            this.scheduleGc()),
          this.cache.notify({ type: 'observerRemoved', query: this, observer: e }));
      }
      getObserversCount() {
        return this.observers.length;
      }
      invalidate() {
        this.state.isInvalidated || this.dispatch({ type: 'invalidate' });
      }
      fetch(e, t) {
        var r, n, a, i;
        if ('idle' !== this.state.fetchStatus) {
          if (this.state.dataUpdatedAt && null != t && t.cancelRefetch) this.cancel({ silent: !0 });
          else if (this.promise)
            return (null == (a = this.retryer) || a.continueRetry(), this.promise);
        }
        if ((e && this.setOptions(e), !this.options.queryFn)) {
          let e = this.observers.find((e) => e.options.queryFn);
          e && this.setOptions(e.options);
        }
        let o = (function () {
            if ('function' == typeof AbortController) return new AbortController();
          })(),
          s = { queryKey: this.queryKey, pageParam: void 0, meta: this.meta },
          l = (e) => {
            Object.defineProperty(e, 'signal', {
              enumerable: !0,
              get: () => {
                if (o) return ((this.abortSignalConsumed = !0), o.signal);
              },
            });
          };
        l(s);
        let u = () =>
            this.options.queryFn
              ? ((this.abortSignalConsumed = !1), this.options.queryFn(s))
              : Promise.reject("Missing queryFn for queryKey '" + this.options.queryHash + "'"),
          c = {
            fetchOptions: t,
            options: this.options,
            queryKey: this.queryKey,
            state: this.state,
            fetchFn: u,
          };
        (l(c),
          null == (r = this.options.behavior) || r.onFetch(c),
          (this.revertState = this.state),
          ('idle' === this.state.fetchStatus ||
            this.state.fetchMeta !== (null == (n = c.fetchOptions) ? void 0 : n.meta)) &&
            this.dispatch({ type: 'fetch', meta: null == (i = c.fetchOptions) ? void 0 : i.meta }));
        let d = (e) => {
          if (((V(e) && e.silent) || this.dispatch({ type: 'error', error: e }), !V(e))) {
            var t, r, n, a;
            (null == (t = (r = this.cache.config).onError) || t.call(r, e, this),
              null == (n = (a = this.cache.config).onSettled) ||
                n.call(a, this.state.data, e, this));
          }
          (this.isFetchingOptimistic || this.scheduleGc(), (this.isFetchingOptimistic = !1));
        };
        return (
          (this.retryer = Z({
            fn: c.fetchFn,
            abort: null == o ? void 0 : o.abort.bind(o),
            onSuccess: (e) => {
              var t, r, n, a;
              void 0 === e
                ? d(Error(this.queryHash + ' data is undefined'))
                : (this.setData(e),
                  null == (t = (r = this.cache.config).onSuccess) || t.call(r, e, this),
                  null == (n = (a = this.cache.config).onSettled) ||
                    n.call(a, e, this.state.error, this),
                  this.isFetchingOptimistic || this.scheduleGc(),
                  (this.isFetchingOptimistic = !1));
            },
            onError: d,
            onFail: (e, t) => {
              this.dispatch({ type: 'failed', failureCount: e, error: t });
            },
            onPause: () => {
              this.dispatch({ type: 'pause' });
            },
            onContinue: () => {
              this.dispatch({ type: 'continue' });
            },
            retry: c.options.retry,
            retryDelay: c.options.retryDelay,
            networkMode: c.options.networkMode,
          })),
          (this.promise = this.retryer.promise),
          this.promise
        );
      }
      dispatch(e) {
        let t = (t) => {
          var r, n;
          switch (e.type) {
            case 'failed':
              return { ...t, fetchFailureCount: e.failureCount, fetchFailureReason: e.error };
            case 'pause':
              return { ...t, fetchStatus: 'paused' };
            case 'continue':
              return { ...t, fetchStatus: 'fetching' };
            case 'fetch':
              return {
                ...t,
                fetchFailureCount: 0,
                fetchFailureReason: null,
                fetchMeta: null != (r = e.meta) ? r : null,
                fetchStatus: H(this.options.networkMode) ? 'fetching' : 'paused',
                ...(!t.dataUpdatedAt && { error: null, status: 'loading' }),
              };
            case 'success':
              return {
                ...t,
                data: e.data,
                dataUpdateCount: t.dataUpdateCount + 1,
                dataUpdatedAt: null != (n = e.dataUpdatedAt) ? n : Date.now(),
                error: null,
                isInvalidated: !1,
                status: 'success',
                ...(!e.manual && {
                  fetchStatus: 'idle',
                  fetchFailureCount: 0,
                  fetchFailureReason: null,
                }),
              };
            case 'error':
              let a = e.error;
              if (V(a) && a.revert && this.revertState)
                return { ...this.revertState, fetchStatus: 'idle' };
              return {
                ...t,
                error: a,
                errorUpdateCount: t.errorUpdateCount + 1,
                errorUpdatedAt: Date.now(),
                fetchFailureCount: t.fetchFailureCount + 1,
                fetchFailureReason: a,
                fetchStatus: 'idle',
                status: 'error',
              };
            case 'invalidate':
              return { ...t, isInvalidated: !0 };
            case 'setState':
              return { ...t, ...e.state };
          }
        };
        ((this.state = t(this.state)),
          U.batch(() => {
            (this.observers.forEach((t) => {
              t.onQueryUpdate(e);
            }),
              this.cache.notify({ query: this, type: 'updated', action: e }));
          }));
      }
    }
    class nv extends K {
      constructor(e) {
        (super(), (this.config = e || {}), (this.queries = []), (this.queriesMap = {}));
      }
      build(e, t, r) {
        var n;
        let a = t.queryKey,
          i = null != (n = t.queryHash) ? n : F(a, t),
          o = this.get(i);
        return (
          o ||
            ((o = new ny({
              cache: this,
              logger: e.getLogger(),
              queryKey: a,
              queryHash: i,
              options: e.defaultQueryOptions(t),
              state: r,
              defaultOptions: e.getQueryDefaults(a),
            })),
            this.add(o)),
          o
        );
      }
      add(e) {
        this.queriesMap[e.queryHash] ||
          ((this.queriesMap[e.queryHash] = e),
          this.queries.push(e),
          this.notify({ type: 'added', query: e }));
      }
      remove(e) {
        let t = this.queriesMap[e.queryHash];
        t &&
          (e.destroy(),
          (this.queries = this.queries.filter((t) => t !== e)),
          t === e && delete this.queriesMap[e.queryHash],
          this.notify({ type: 'removed', query: e }));
      }
      clear() {
        U.batch(() => {
          this.queries.forEach((e) => {
            this.remove(e);
          });
        });
      }
      get(e) {
        return this.queriesMap[e];
      }
      getAll() {
        return this.queries;
      }
      find(e, t) {
        let [r] = L(e, t);
        return (void 0 === r.exact && (r.exact = !0), this.queries.find((e) => A(r, e)));
      }
      findAll(e, t) {
        let [r] = L(e, t);
        return Object.keys(r).length > 0 ? this.queries.filter((e) => A(r, e)) : this.queries;
      }
      notify(e) {
        U.batch(() => {
          this.listeners.forEach(({ listener: t }) => {
            t(e);
          });
        });
      }
      onFocus() {
        U.batch(() => {
          this.queries.forEach((e) => {
            e.onFocus();
          });
        });
      }
      onOnline() {
        U.batch(() => {
          this.queries.forEach((e) => {
            e.onOnline();
          });
        });
      }
    }
    class ng extends K {
      constructor(e) {
        (super(), (this.config = e || {}), (this.mutations = []), (this.mutationId = 0));
      }
      build(e, t, r) {
        let n = new tZ({
          mutationCache: this,
          logger: e.getLogger(),
          mutationId: ++this.mutationId,
          options: e.defaultMutationOptions(t),
          state: r,
          defaultOptions: t.mutationKey ? e.getMutationDefaults(t.mutationKey) : void 0,
        });
        return (this.add(n), n);
      }
      add(e) {
        (this.mutations.push(e), this.notify({ type: 'added', mutation: e }));
      }
      remove(e) {
        ((this.mutations = this.mutations.filter((t) => t !== e)),
          this.notify({ type: 'removed', mutation: e }));
      }
      clear() {
        U.batch(() => {
          this.mutations.forEach((e) => {
            this.remove(e);
          });
        });
      }
      getAll() {
        return this.mutations;
      }
      find(e) {
        return (void 0 === e.exact && (e.exact = !0), this.mutations.find((t) => k(e, t)));
      }
      findAll(e) {
        return this.mutations.filter((t) => k(e, t));
      }
      notify(e) {
        U.batch(() => {
          this.listeners.forEach(({ listener: t }) => {
            t(e);
          });
        });
      }
      resumePausedMutations() {
        var e;
        return (
          (this.resuming = (null != (e = this.resuming) ? e : Promise.resolve())
            .then(() => {
              let e = this.mutations.filter((e) => e.state.isPaused);
              return U.batch(() =>
                e.reduce((e, t) => e.then(() => t.continue().catch(P)), Promise.resolve()),
              );
            })
            .then(() => {
              this.resuming = void 0;
            })),
          this.resuming
        );
      }
    }
    class nb {
      constructor(e = {}) {
        ((this.queryCache = e.queryCache || new nv()),
          (this.mutationCache = e.mutationCache || new ng()),
          (this.logger = e.logger || tG),
          (this.defaultOptions = e.defaultOptions || {}),
          (this.queryDefaults = []),
          (this.mutationDefaults = []),
          (this.mountCount = 0));
      }
      mount() {
        (this.mountCount++,
          1 === this.mountCount &&
            ((this.unsubscribeFocus = Q.subscribe(() => {
              Q.isFocused() && (this.resumePausedMutations(), this.queryCache.onFocus());
            })),
            (this.unsubscribeOnline = B.subscribe(() => {
              B.isOnline() && (this.resumePausedMutations(), this.queryCache.onOnline());
            }))));
      }
      unmount() {
        var e, t;
        (this.mountCount--,
          0 === this.mountCount &&
            (null == (e = this.unsubscribeFocus) || e.call(this),
            (this.unsubscribeFocus = void 0),
            null == (t = this.unsubscribeOnline) || t.call(this),
            (this.unsubscribeOnline = void 0)));
      }
      isFetching(e, t) {
        let [r] = L(e, t);
        return ((r.fetchStatus = 'fetching'), this.queryCache.findAll(r).length);
      }
      isMutating(e) {
        return this.mutationCache.findAll({ ...e, fetching: !0 }).length;
      }
      getQueryData(e, t) {
        var r;
        return null == (r = this.queryCache.find(e, t)) ? void 0 : r.state.data;
      }
      ensureQueryData(e, t, r) {
        let n = x(e, t, r),
          a = this.getQueryData(n.queryKey);
        return a ? Promise.resolve(a) : this.fetchQuery(n);
      }
      getQueriesData(e) {
        return this.getQueryCache()
          .findAll(e)
          .map(({ queryKey: e, state: t }) => [e, t.data]);
      }
      setQueryData(e, t, r) {
        let n = this.queryCache.find(e),
          a = null == n ? void 0 : n.state.data,
          i = 'function' == typeof t ? t(a) : t;
        if (void 0 === i) return;
        let o = x(e),
          s = this.defaultQueryOptions(o);
        return this.queryCache.build(this, s).setData(i, { ...r, manual: !0 });
      }
      setQueriesData(e, t, r) {
        return U.batch(() =>
          this.getQueryCache()
            .findAll(e)
            .map(({ queryKey: e }) => [e, this.setQueryData(e, t, r)]),
        );
      }
      getQueryState(e, t) {
        var r;
        return null == (r = this.queryCache.find(e, t)) ? void 0 : r.state;
      }
      removeQueries(e, t) {
        let [r] = L(e, t),
          n = this.queryCache;
        U.batch(() => {
          n.findAll(r).forEach((e) => {
            n.remove(e);
          });
        });
      }
      resetQueries(e, t, r) {
        let [n, a] = L(e, t, r),
          i = this.queryCache,
          o = { type: 'active', ...n };
        return U.batch(
          () => (
            i.findAll(n).forEach((e) => {
              e.reset();
            }),
            this.refetchQueries(o, a)
          ),
        );
      }
      cancelQueries(e, t, r) {
        let [n, a = {}] = L(e, t, r);
        return (
          void 0 === a.revert && (a.revert = !0),
          Promise.all(U.batch(() => this.queryCache.findAll(n).map((e) => e.cancel(a))))
            .then(P)
            .catch(P)
        );
      }
      invalidateQueries(e, t, r) {
        let [n, a] = L(e, t, r);
        return U.batch(() => {
          var e, t;
          if (
            (this.queryCache.findAll(n).forEach((e) => {
              e.invalidate();
            }),
            'none' === n.refetchType)
          )
            return Promise.resolve();
          let r = {
            ...n,
            type: null != (e = null != (t = n.refetchType) ? t : n.type) ? e : 'active',
          };
          return this.refetchQueries(r, a);
        });
      }
      refetchQueries(e, t, r) {
        let [n, a] = L(e, t, r),
          i = Promise.all(
            U.batch(() =>
              this.queryCache
                .findAll(n)
                .filter((e) => !e.isDisabled())
                .map((e) => {
                  var t;
                  return e.fetch(void 0, {
                    ...a,
                    cancelRefetch: null == (t = null == a ? void 0 : a.cancelRefetch) || t,
                    meta: { refetchPage: n.refetchPage },
                  });
                }),
            ),
          ).then(P);
        return ((null != a && a.throwOnError) || (i = i.catch(P)), i);
      }
      fetchQuery(e, t, r) {
        let n = x(e, t, r),
          a = this.defaultQueryOptions(n);
        void 0 === a.retry && (a.retry = !1);
        let i = this.queryCache.build(this, a);
        return i.isStaleByTime(a.staleTime) ? i.fetch(a) : Promise.resolve(i.state.data);
      }
      prefetchQuery(e, t, r) {
        return this.fetchQuery(e, t, r).then(P).catch(P);
      }
      fetchInfiniteQuery(e, t, r) {
        let n = x(e, t, r);
        return ((n.behavior = t1()), this.fetchQuery(n));
      }
      prefetchInfiniteQuery(e, t, r) {
        return this.fetchInfiniteQuery(e, t, r).then(P).catch(P);
      }
      resumePausedMutations() {
        return this.mutationCache.resumePausedMutations();
      }
      getQueryCache() {
        return this.queryCache;
      }
      getMutationCache() {
        return this.mutationCache;
      }
      getLogger() {
        return this.logger;
      }
      getDefaultOptions() {
        return this.defaultOptions;
      }
      setDefaultOptions(e) {
        this.defaultOptions = e;
      }
      setQueryDefaults(e, t) {
        let r = this.queryDefaults.find((t) => _(e) === _(t.queryKey));
        r ? (r.defaultOptions = t) : this.queryDefaults.push({ queryKey: e, defaultOptions: t });
      }
      getQueryDefaults(e) {
        if (!e) return;
        let t = this.queryDefaults.find((t) => R(e, t.queryKey));
        return null == t ? void 0 : t.defaultOptions;
      }
      setMutationDefaults(e, t) {
        let r = this.mutationDefaults.find((t) => _(e) === _(t.mutationKey));
        r
          ? (r.defaultOptions = t)
          : this.mutationDefaults.push({ mutationKey: e, defaultOptions: t });
      }
      getMutationDefaults(e) {
        if (!e) return;
        let t = this.mutationDefaults.find((t) => R(e, t.mutationKey));
        return null == t ? void 0 : t.defaultOptions;
      }
      defaultQueryOptions(e) {
        if (null != e && e._defaulted) return e;
        let t = {
          ...this.defaultOptions.queries,
          ...this.getQueryDefaults(null == e ? void 0 : e.queryKey),
          ...e,
          _defaulted: !0,
        };
        return (
          !t.queryHash && t.queryKey && (t.queryHash = F(t.queryKey, t)),
          void 0 === t.refetchOnReconnect && (t.refetchOnReconnect = 'always' !== t.networkMode),
          void 0 === t.useErrorBoundary && (t.useErrorBoundary = !!t.suspense),
          t
        );
      }
      defaultMutationOptions(e) {
        return null != e && e._defaulted
          ? e
          : {
              ...this.defaultOptions.mutations,
              ...this.getMutationDefaults(null == e ? void 0 : e.mutationKey),
              ...e,
              _defaulted: !0,
            };
      }
      clear() {
        (this.queryCache.clear(), this.mutationCache.clear());
      }
    }
    var nE = Object.defineProperty,
      nw = (e, t) => nE(e, 'name', { value: t, configurable: !0 }),
      nC = b.default.createContext({}),
      nP = nw(({ children: e, isProvided: t, ...r }) => {
        let { replace: n } = os(),
          a = nw(async (e) => {
            var t;
            try {
              return await (null == (t = r.login) ? void 0 : t.call(r, e));
            } catch (e) {
              return Promise.reject(e);
            }
          }, 'loginFunc'),
          i = nw(async (e) => {
            var t;
            try {
              return await (null == (t = r.register) ? void 0 : t.call(r, e));
            } catch (e) {
              return Promise.reject(e);
            }
          }, 'registerFunc'),
          o = nw(async (e) => {
            var t;
            try {
              return await (null == (t = r.logout) ? void 0 : t.call(r, e));
            } catch (e) {
              return Promise.reject(e);
            }
          }, 'logoutFunc'),
          s = nw(async (e) => {
            var t;
            try {
              return (await (null == (t = r.checkAuth) ? void 0 : t.call(r, e)), Promise.resolve());
            } catch (e) {
              return (null != e && e.redirectPath && n(e.redirectPath), Promise.reject(e));
            }
          }, 'checkAuthFunc');
        return b.default.createElement(
          nC.Provider,
          { value: { ...r, login: a, logout: o, checkAuth: s, register: i, isProvided: t } },
          e,
        );
      }, 'LegacyAuthContextProvider'),
      nS = b.default.createContext({}),
      nO = nw(({ children: e, isProvided: t, ...r }) => {
        let n = nw(async (e) => {
            var t;
            try {
              return await (null == (t = r.login) ? void 0 : t.call(r, e));
            } catch (e) {
              return (
                console.warn(
                  'Unhandled Error in login: refine always expects a resolved promise.',
                  e,
                ),
                Promise.reject(e)
              );
            }
          }, 'handleLogin'),
          a = nw(async (e) => {
            var t;
            try {
              return await (null == (t = r.register) ? void 0 : t.call(r, e));
            } catch (e) {
              return (
                console.warn(
                  'Unhandled Error in register: refine always expects a resolved promise.',
                  e,
                ),
                Promise.reject(e)
              );
            }
          }, 'handleRegister'),
          i = nw(async (e) => {
            var t;
            try {
              return await (null == (t = r.logout) ? void 0 : t.call(r, e));
            } catch (e) {
              return (
                console.warn(
                  'Unhandled Error in logout: refine always expects a resolved promise.',
                  e,
                ),
                Promise.reject(e)
              );
            }
          }, 'handleLogout'),
          o = nw(async (e) => {
            var t;
            try {
              let n = await (null == (t = r.check) ? void 0 : t.call(r, e));
              return Promise.resolve(n);
            } catch (e) {
              return (
                console.warn(
                  'Unhandled Error in check: refine always expects a resolved promise.',
                  e,
                ),
                Promise.reject(e)
              );
            }
          }, 'handleCheck'),
          s = nw(async (e) => {
            var t;
            try {
              let n = await (null == (t = r.forgotPassword) ? void 0 : t.call(r, e));
              return Promise.resolve(n);
            } catch (e) {
              return (
                console.warn(
                  'Unhandled Error in forgotPassword: refine always expects a resolved promise.',
                  e,
                ),
                Promise.reject(e)
              );
            }
          }, 'handleForgotPassword'),
          l = nw(async (e) => {
            var t;
            try {
              let n = await (null == (t = r.updatePassword) ? void 0 : t.call(r, e));
              return Promise.resolve(n);
            } catch (e) {
              return (
                console.warn(
                  'Unhandled Error in updatePassword: refine always expects a resolved promise.',
                  e,
                ),
                Promise.reject(e)
              );
            }
          }, 'handleUpdatePassword');
        return b.default.createElement(
          nS.Provider,
          {
            value: {
              ...r,
              login: n,
              logout: i,
              check: o,
              register: a,
              forgotPassword: s,
              updatePassword: l,
              isProvided: t,
            },
          },
          e,
        );
      }, 'AuthBindingsContextProvider'),
      nx = nw(() => b.default.useContext(nC), 'useLegacyAuthContext'),
      nL = nw(() => b.default.useContext(nS), 'useAuthBindingsContext'),
      nA = nw((e) => e / 1e3, 'userFriendlySecond'),
      nk = nw((e, t = (e) => e) => {
        let [r, ...n] = e;
        return n.map((e) => tL(tR(r, e))).map((e, r, n) => t.call(void 0, e, r, n));
      }, 'importCSVMapper'),
      nF = nw((e = '', t) => {
        let r = n5(e);
        return 'singular' === t ? tD.default.singular(r) : tD.default.plural(r);
      }, 'userFriendlyResourceName');
    function n_(e, t) {
      return e.findIndex((r, n) => n <= e.length - t.length && t.every((t, r) => e[n + r] === t));
    }
    function nR(e) {
      if ('data' === e[0]) {
        let t = e.slice(1);
        if ('many' === t[2]) t[2] = 'getMany';
        else if ('infinite' === t[2]) t[2] = 'list';
        else if ('one' === t[2]) t[2] = 'detail';
        else if ('custom' === t[1]) {
          let e = { ...t[2] };
          return (delete e.method, delete e.url, [t[0], t[1], t[2].method, t[2].url, e]);
        }
        return t;
      }
      if ('audit' === e[0] && 'list' === e[2]) return ['logList', e[1], e[3]];
      if ('access' === e[0] && 4 === e.length)
        return ['useCan', { resource: e[1], action: e[2], ...e[3] }];
      if ('auth' === e[0]) {
        if (-1 !== n_(e, ['auth', 'login'])) return ['useLogin'];
        if (-1 !== n_(e, ['auth', 'logout'])) return ['useLogout'];
        if (-1 !== n_(e, ['auth', 'identity'])) return ['getUserIdentity'];
        if (-1 !== n_(e, ['auth', 'register'])) return ['useRegister'];
        if (-1 !== n_(e, ['auth', 'forgotPassword'])) return ['useForgotPassword'];
        if (-1 !== n_(e, ['auth', 'check'])) return ['useAuthenticated', e[2]];
        if (-1 !== n_(e, ['auth', 'onError'])) return ['useCheckError'];
        if (-1 !== n_(e, ['auth', 'permissions'])) return ['usePermissions'];
        if (-1 !== n_(e, ['auth', 'updatePassword'])) return ['useUpdatePassword'];
      }
      return e;
    }
    (nw(
      (e = {}) => (null != e && e.id ? { ...e, id: decodeURIComponent(e.id) } : e),
      'handleUseParams',
    ),
      nw(n_, 'arrayFindIndex'),
      nw(nR, 'convertToLegacy'));
    var nD = class {
      constructor(e = []) {
        ((this.segments = []), (this.segments = e));
      }
      key() {
        return this.segments;
      }
      legacy() {
        return nR(this.segments);
      }
      get(e) {
        return e ? this.legacy() : this.segments;
      }
    };
    nw(nD, 'BaseKeyBuilder');
    var nM = class extends nD {
      params(e) {
        return new nD([...this.segments, e]);
      }
    };
    nw(nM, 'ParamsKeyBuilder');
    var nN = class extends nD {
      id(e) {
        return new nM([...this.segments, e ? String(e) : void 0]);
      }
    };
    nw(nN, 'DataIdRequiringKeyBuilder');
    var nT = class extends nD {
      ids(...e) {
        return new nM([...this.segments, ...(e.length ? [e.map((e) => String(e))] : [])]);
      }
    };
    nw(nT, 'DataIdsRequiringKeyBuilder');
    var nj = class extends nD {
      action(e) {
        if ('one' === e) return new nN([...this.segments, e]);
        if ('many' === e) return new nT([...this.segments, e]);
        if (['list', 'infinite'].includes(e)) return new nM([...this.segments, e]);
        throw Error('Invalid action type');
      }
    };
    nw(nj, 'DataResourceKeyBuilder');
    var nI = class extends nD {
      resource(e) {
        return new nj([...this.segments, e]);
      }
      mutation(e) {
        return new nM([...('custom' === e ? this.segments : [this.segments[0]]), e]);
      }
    };
    nw(nI, 'DataKeyBuilder');
    var n$ = class extends nD {
      action(e) {
        return new nM([...this.segments, e]);
      }
    };
    nw(n$, 'AuthKeyBuilder');
    var nq = class extends nD {
      action(e) {
        return new nM([...this.segments, e]);
      }
    };
    nw(nq, 'AccessResourceKeyBuilder');
    var nU = class extends nD {
      resource(e) {
        return new nq([...this.segments, e]);
      }
    };
    nw(nU, 'AccessKeyBuilder');
    var nK = class extends nD {
      action(e) {
        return new nM([...this.segments, e]);
      }
    };
    nw(nK, 'AuditActionKeyBuilder');
    var nQ = class extends nD {
      resource(e) {
        return new nK([...this.segments, e]);
      }
      action(e) {
        return new nM([...this.segments, e]);
      }
    };
    nw(nQ, 'AuditKeyBuilder');
    var nz = class extends nD {
      data(e) {
        return new nI(['data', e || 'default']);
      }
      auth() {
        return new n$(['auth']);
      }
      access() {
        return new nU(['access']);
      }
      audit() {
        return new nQ(['audit']);
      }
    };
    nw(nz, 'KeyBuilder');
    var nB = nw(() => new nz([]), 'keys'),
      nW = nw((...e) => e.find((e) => 'u' > typeof e), 'pickNotDeprecated');
    nw((e, t, r, n) => {
      let a = t || 'default',
        i = {
          all: [a],
          resourceAll: [a, e || ''],
          list: (e) => [...i.resourceAll, 'list', { ...e, ...(nW(r, n) || {}) }],
          many: (e) =>
            [
              ...i.resourceAll,
              'getMany',
              null == e ? void 0 : e.map(String),
              { ...(nW(r, n) || {}) },
            ].filter((e) => void 0 !== e),
          detail: (e) => [
            ...i.resourceAll,
            'detail',
            null == e ? void 0 : e.toString(),
            { ...(nW(r, n) || {}) },
          ],
          logList: (t) => ['logList', e, t, n].filter((e) => void 0 !== e),
        };
      return i;
    }, 'queryKeys');
    var nH = nw(
        (e) => (t, r, n, a) => {
          let i = r || 'default';
          return {
            all: nB().data(i).get(e),
            resourceAll: nB()
              .data(r)
              .resource(t ?? '')
              .get(e),
            list: (i) =>
              nB()
                .data(r)
                .resource(t ?? '')
                .action('list')
                .params({ ...i, ...(nW(n, a) || {}) })
                .get(e),
            many: (i) =>
              nB()
                .data(r)
                .resource(t ?? '')
                .action('many')
                .ids(...(i ?? []))
                .params({ ...(nW(n, a) || {}) })
                .get(e),
            detail: (i) =>
              nB()
                .data(r)
                .resource(t ?? '')
                .action('one')
                .id(i ?? '')
                .params({ ...(nW(n, a) || {}) })
                .get(e),
            logList: (r) =>
              [...nB().audit().resource(t).action('list').params(r).get(e), a].filter(
                (e) => void 0 !== e,
              ),
          };
        },
        'queryKeysReplacement',
      ),
      nG = nw((e, t) => !!e && !!t && !!e.find((e) => e === t), 'hasPermission'),
      nV = nw((e) => e.startsWith(':'), 'isParameter'),
      nZ = nw((e) => e.split('/').filter((e) => '' !== e), 'splitToSegments'),
      nY = nw((e, t) => {
        let r = nZ(e),
          n = nZ(t);
        return r.length === n.length;
      }, 'isSegmentCountsSame'),
      nJ = nw((e) => e.replace(/^\/|\/$/g, ''), 'removeLeadingTrailingSlashes'),
      nX = nw((e, t) => {
        let r = nJ(e),
          n = nJ(t);
        if (!nY(r, n)) return !1;
        let a = nZ(r);
        return nZ(n).every((e, t) => nV(e) || e === a[t]);
      }, 'checkBySegments'),
      n0 = nw((e, t, r) => {
        let n = nJ(r || ''),
          a = `${n}${n ? '/' : ''}${e}`;
        return (
          'list' === t
            ? (a = `${a}`)
            : 'create' === t
              ? (a = `${a}/create`)
              : 'edit' === t
                ? (a = `${a}/edit/:id`)
                : 'show' === t
                  ? (a = `${a}/show/:id`)
                  : 'clone' === t && (a = `${a}/clone/:id`),
          `/${a.replace(/^\//, '')}`
        );
      }, 'getDefaultActionPath'),
      n1 = nw((e, t) => {
        var r, n;
        let a = nW(
          null == (r = e.meta) ? void 0 : r.parent,
          null == (n = e.options) ? void 0 : n.parent,
          e.parentName,
        );
        return a ? (t.find((e) => (e.identifier ?? e.name) === a) ?? { name: a }) : void 0;
      }, 'getParentResource'),
      n2 = nw((e, t, r) => {
        let n = [],
          a = n1(e, t);
        for (; a; ) (n.push(a), (a = n1(a, t)));
        if (0 !== n.length)
          return `/${n
            .reverse()
            .map((e) => {
              var t;
              return nJ(r ? ((null == (t = e.options) ? void 0 : t.route) ?? e.name) : e.name);
            })
            .join('/')}`;
      }, 'getParentPrefixForResource'),
      n4 = nw((e, t, r) => {
        let n = [],
          a = n2(e, t, r);
        return (
          ['list', 'show', 'edit', 'create', 'clone'].forEach((t) => {
            var i, o;
            let s = r && 'clone' === t ? e.create : e[t],
              l;
            ('function' == typeof s || r
              ? (l = n0(
                  r
                    ? ((null == (i = e.meta) ? void 0 : i.route) ??
                        (null == (o = e.options) ? void 0 : o.route) ??
                        e.name)
                    : e.name,
                  t,
                  r ? a : void 0,
                ))
              : 'string' == typeof s
                ? (l = s)
                : 'object' == typeof s && (l = s.path),
              l && n.push({ action: t, resource: e, route: `/${l.replace(/^\//, '')}` }));
          }),
          n
        );
      }, 'getActionRoutesFromResource'),
      n3 = nw((e) => {
        var t;
        if (0 === e.length) return;
        if (1 === e.length) return e[0];
        let r = e.map((e) => ({ ...e, splitted: nZ(nJ(e.route)) })),
          n = (null == (t = r[0]) ? void 0 : t.splitted.length) ?? 0,
          a = [...r];
        for (let e = 0; e < n; e++) {
          let t = a.filter((t) => !nV(t.splitted[e]));
          if (0 !== t.length) {
            if (1 === t.length) {
              a = t;
              break;
            }
            a = t;
          }
        }
        return a[0];
      }, 'pickMatchedRoute'),
      n8 = nw((e, t) => {
        let r = n3(t.flatMap((e) => n4(e, t)).filter((t) => nX(e, t.route)));
        return {
          found: !!r,
          resource: null == r ? void 0 : r.resource,
          action: null == r ? void 0 : r.action,
          matchedRoute: null == r ? void 0 : r.route,
        };
      }, 'matchResourceFromRoute'),
      n6 = nw((e, t) => {
        var r;
        let n,
          a = n2(e, t, !0);
        if (a) {
          let t = nW(e.meta, e.options);
          n = `${a}/${(null == t ? void 0 : t.route) ?? e.name}`;
        } else n = (null == (r = e.options) ? void 0 : r.route) ?? e.name;
        return `/${n.replace(/^\//, '')}`;
      }, 'routeGenerator');
    nw((e) => {
      var t;
      let r = [],
        n = {},
        a = {},
        i,
        o;
      for (let r = 0; r < e.length; r++) {
        let o =
          (i = e[r]).route ??
          (null == (t = nW(null == i ? void 0 : i.meta, i.options)) ? void 0 : t.route) ??
          '';
        ((n[o] = i), (n[o].children = []), (a[i.name] = i), (a[i.name].children = []));
      }
      for (let e in n)
        Object.hasOwn(n, e) &&
          ((o = n[e]).parentName && a[o.parentName] ? a[o.parentName].children.push(o) : r.push(o));
      return r;
    }, 'createTreeView');
    var n5 = nw(
        (e) =>
          (e =
            (e = (e = (e = e.replace(/([a-z]{1})([A-Z]{1})/g, '$1-$2')).replace(
              /([A-Z]{1})([A-Z]{1})([a-z]{1})/g,
              '$1-$2$3',
            ))
              .toLowerCase()
              .replace(/[_-]+/g, ' ')
              .replace(/\s{2,}/g, ' ')
              .trim())
              .charAt(0)
              .toUpperCase() + e.slice(1)),
        'humanizeString',
      ),
      n9 = nw(({ children: e }) => b.default.createElement('div', null, e), 'DefaultLayout'),
      n7 = {
        icon: b.default.createElement(
          'svg',
          {
            width: 24,
            height: 24,
            viewBox: '0 0 24 24',
            fill: 'none',
            xmlns: 'http://www.w3.org/2000/svg',
            'data-testid': 'refine-logo',
            id: 'refine-default-logo',
          },
          b.default.createElement('path', {
            fillRule: 'evenodd',
            clipRule: 'evenodd',
            d: 'M13.7889 0.422291C12.6627 -0.140764 11.3373 -0.140764 10.2111 0.422291L2.21115 4.42229C0.85601 5.09986 0 6.48491 0 8V16C0 17.5151 0.85601 18.9001 2.21115 19.5777L10.2111 23.5777C11.3373 24.1408 12.6627 24.1408 13.7889 23.5777L21.7889 19.5777C23.144 18.9001 24 17.5151 24 16V8C24 6.48491 23.144 5.09986 21.7889 4.42229L13.7889 0.422291ZM8 8C8 5.79086 9.79086 4 12 4C14.2091 4 16 5.79086 16 8V16C16 18.2091 14.2091 20 12 20C9.79086 20 8 18.2091 8 16V8Z',
            fill: 'currentColor',
          }),
          b.default.createElement('path', {
            d: 'M14 8C14 9.10457 13.1046 10 12 10C10.8954 10 10 9.10457 10 8C10 6.89543 10.8954 6 12 6C13.1046 6 14 6.89543 14 8Z',
            fill: 'currentColor',
          }),
        ),
        text: 'Refine Project',
      },
      ae = {
        mutationMode: 'pessimistic',
        syncWithLocation: !1,
        undoableTimeout: 5e3,
        warnWhenUnsavedChanges: !1,
        liveMode: 'off',
        redirect: { afterCreate: 'list', afterClone: 'list', afterEdit: 'list' },
        overtime: { enabled: !0, interval: 1e3 },
        textTransformers: {
          humanize: n5,
          plural: tD.default.plural,
          singular: tD.default.singular,
        },
        disableServerSideValidation: !1,
        title: n7,
      },
      at = b.default.createContext({
        hasDashboard: !1,
        mutationMode: 'pessimistic',
        warnWhenUnsavedChanges: !1,
        syncWithLocation: !1,
        undoableTimeout: 5e3,
        Title: void 0,
        Sider: void 0,
        Header: void 0,
        Footer: void 0,
        Layout: n9,
        OffLayoutArea: void 0,
        liveMode: 'off',
        onLiveEvent: void 0,
        options: ae,
      }),
      ar = nw(
        ({
          hasDashboard: e,
          mutationMode: t,
          warnWhenUnsavedChanges: r,
          syncWithLocation: n,
          undoableTimeout: a,
          children: i,
          DashboardPage: o,
          Title: s,
          Layout: l = n9,
          Header: u,
          Sider: c,
          Footer: d,
          OffLayoutArea: f,
          LoginPage: p = oW,
          catchAll: h,
          liveMode: m = 'off',
          onLiveEvent: y,
          options: v,
        }) =>
          b.default.createElement(
            at.Provider,
            {
              value: {
                __initialized: !0,
                hasDashboard: e,
                mutationMode: t,
                warnWhenUnsavedChanges: r,
                syncWithLocation: n,
                Title: s,
                undoableTimeout: a,
                Layout: l,
                Header: u,
                Sider: c,
                Footer: d,
                OffLayoutArea: f,
                DashboardPage: o,
                LoginPage: p,
                catchAll: h,
                liveMode: m,
                onLiveEvent: y,
                options: v,
              },
            },
            i,
          ),
        'RefineContextProvider',
      ),
      an = nw(
        ({
          options: e,
          disableTelemetry: t,
          liveMode: r,
          mutationMode: n,
          reactQueryClientConfig: a,
          reactQueryDevtoolConfig: i,
          syncWithLocation: o,
          undoableTimeout: s,
          warnWhenUnsavedChanges: l,
        } = {}) => {
          var u, c, d, f, p, h, m, y, v, g, b, E;
          return {
            optionsWithDefaults: {
              breadcrumb: null == e ? void 0 : e.breadcrumb,
              mutationMode: (null == e ? void 0 : e.mutationMode) ?? n ?? ae.mutationMode,
              undoableTimeout: (null == e ? void 0 : e.undoableTimeout) ?? s ?? ae.undoableTimeout,
              syncWithLocation:
                (null == e ? void 0 : e.syncWithLocation) ?? o ?? ae.syncWithLocation,
              warnWhenUnsavedChanges:
                (null == e ? void 0 : e.warnWhenUnsavedChanges) ?? l ?? ae.warnWhenUnsavedChanges,
              liveMode: (null == e ? void 0 : e.liveMode) ?? r ?? ae.liveMode,
              redirect: {
                afterCreate:
                  (null == (u = null == e ? void 0 : e.redirect) ? void 0 : u.afterCreate) ??
                  ae.redirect.afterCreate,
                afterClone:
                  (null == (c = null == e ? void 0 : e.redirect) ? void 0 : c.afterClone) ??
                  ae.redirect.afterClone,
                afterEdit:
                  (null == (d = null == e ? void 0 : e.redirect) ? void 0 : d.afterEdit) ??
                  ae.redirect.afterEdit,
              },
              overtime: (null == e ? void 0 : e.overtime) ?? ae.overtime,
              textTransformers: {
                humanize:
                  (null == (f = null == e ? void 0 : e.textTransformers) ? void 0 : f.humanize) ??
                  ae.textTransformers.humanize,
                plural:
                  (null == (p = null == e ? void 0 : e.textTransformers) ? void 0 : p.plural) ??
                  ae.textTransformers.plural,
                singular:
                  (null == (h = null == e ? void 0 : e.textTransformers) ? void 0 : h.singular) ??
                  ae.textTransformers.singular,
              },
              disableServerSideValidation:
                (null == e ? void 0 : e.disableServerSideValidation) ??
                ae.disableServerSideValidation,
              projectId: null == e ? void 0 : e.projectId,
              useNewQueryKeys: null == e ? void 0 : e.useNewQueryKeys,
              title: {
                icon:
                  typeof (null == (m = null == e ? void 0 : e.title) ? void 0 : m.icon) > 'u'
                    ? ae.title.icon
                    : null == (y = null == e ? void 0 : e.title)
                      ? void 0
                      : y.icon,
                text:
                  typeof (null == (v = null == e ? void 0 : e.title) ? void 0 : v.text) > 'u'
                    ? ae.title.text
                    : null == (g = null == e ? void 0 : e.title)
                      ? void 0
                      : g.text,
              },
            },
            disableTelemetryWithDefault: (null == e ? void 0 : e.disableTelemetry) ?? t ?? !1,
            reactQueryWithDefaults: {
              clientConfig:
                (null == (b = null == e ? void 0 : e.reactQuery) ? void 0 : b.clientConfig) ??
                a ??
                {},
              devtoolConfig:
                (null == (E = null == e ? void 0 : e.reactQuery) ? void 0 : E.devtoolConfig) ??
                i ??
                {},
            },
          };
        },
        'handleRefineOptions',
      ),
      aa = nw(({ redirectFromProps: e, action: t, redirectOptions: r }) => {
        if (e || !1 === e) return e;
        switch (t) {
          case 'clone':
            return r.afterClone;
          case 'create':
            return r.afterCreate;
          case 'edit':
            return r.afterEdit;
          default:
            return !1;
        }
      }, 'redirectPage'),
      ai = nw(async (e, t, r) => {
        let n = [];
        for (let [a, i] of e.entries())
          try {
            let e = await i();
            n.push(t(e, a));
          } catch (e) {
            n.push(r(e, a));
          }
        return n;
      }, 'sequentialPromises'),
      ao = nw((e, t = [], r = !1) => {
        if (!e) return;
        if (r) return t.find((t) => nJ(t.route ?? '') === nJ(e)) || t.find((t) => t.name === e);
        let n = t.find((t) => t.identifier === e);
        return (n || (n = t.find((t) => t.name === e)), n);
      }, 'pickResource'),
      as = nw((e, t, r) => {
        if (t) return t;
        let n = ao(e, r),
          a = nW(null == n ? void 0 : n.meta, null == n ? void 0 : n.options);
        return null != a && a.dataProviderName ? a.dataProviderName : 'default';
      }, 'pickDataProvider'),
      al = nw(async (e) => ({ data: (await Promise.all(e)).map((e) => e.data) }), 'handleMultiple'),
      au = nw((e) => {
        let { pagination: t, cursor: r } = e;
        if (null != r && r.next) return r.next;
        let n = (null == t ? void 0 : t.current) || 1,
          a = (null == t ? void 0 : t.pageSize) || 10;
        return n < Math.ceil((e.total || 0) / a) ? Number(n) + 1 : void 0;
      }, 'getNextPageParam'),
      ac = nw((e) => {
        let { pagination: t, cursor: r } = e;
        if (null != r && r.prev) return r.prev;
        let n = (null == t ? void 0 : t.current) || 1;
        return 1 === n ? void 0 : n - 1;
      }, 'getPreviousPageParam'),
      ad = nw((e) => {
        let t = [];
        return (
          e.forEach((r) => {
            var n, a;
            t.push({
              ...r,
              label:
                (null == (n = r.meta) ? void 0 : n.label) ??
                (null == (a = r.options) ? void 0 : a.label),
              route: n6(r, e),
              canCreate: !!r.create,
              canEdit: !!r.edit,
              canShow: !!r.show,
              canDelete: r.canDelete,
            });
          }),
          t
        );
      }, 'legacyResourceTransform'),
      af = nw((e) => nZ(nJ(e)).flatMap((e) => (nV(e) ? [e.slice(1)] : [])), 'pickRouteParams'),
      ap = nw(
        (e, t = {}) =>
          e.reduce((e, r) => {
            let n = t[r];
            return ('u' > typeof n && (e[r] = n), e);
          }, {}),
        'prepareRouteParams',
      ),
      ah = nw((e, t = {}, r = {}, n = {}) => {
        let a = ap(af(e), {
          ...t,
          ...('u' > typeof (null == r ? void 0 : r.id) ? { id: r.id } : {}),
          ...('u' > typeof (null == r ? void 0 : r.action) ? { action: r.action } : {}),
          ...('u' > typeof (null == r ? void 0 : r.resource) ? { resource: r.resource } : {}),
          ...(null == r ? void 0 : r.params),
          ...n,
        });
        return e.replace(/:([^\/]+)/g, (e, t) => {
          let r = a[t];
          return 'u' > typeof r ? `${r}` : e;
        });
      }, 'composeRoute'),
      am = nw(() => {
        let e = nx(),
          t = nL();
        return t.isProvided
          ? { isLegacy: !1, ...t }
          : e.isProvided
            ? {
                isLegacy: !0,
                ...e,
                check: e.checkAuth,
                onError: e.checkError,
                getIdentity: e.getUserIdentity,
              }
            : null;
      }, 'useActiveAuthProvider'),
      ay = nw(({ hasPagination: e, pagination: t, configPagination: r } = {}) => {
        let n = (null == t ? void 0 : t.mode) ?? (!1 === e ? 'off' : 'server');
        return {
          current: nW(null == t ? void 0 : t.current, null == r ? void 0 : r.current) ?? 1,
          pageSize: nW(null == t ? void 0 : t.pageSize, null == r ? void 0 : r.pageSize) ?? 10,
          mode: n,
        };
      }, 'handlePaginationParams'),
      av = nw((e) => {
        let [t, r] = (0, b.useState)(!1);
        return (
          (0, b.useEffect)(() => {
            let n = window.matchMedia(e);
            n.matches !== t && r(n.matches);
            let a = nw(() => r(n.matches), 'listener');
            return (
              window.addEventListener('resize', a),
              () => window.removeEventListener('resize', a)
            );
          }, [t, e]),
          t
        );
      }, 'useMediaQuery'),
      ag = nw((e, t, r, n) => {
        let a = n ? e(t, n, r) : e(t, r),
          i = r ?? t;
        return a === t || typeof a > 'u' ? i : a;
      }, 'safeTranslate');
    nw(function (e, t, r, n, a) {
      var i;
      let o = {
          create: 'Create new ',
          clone: `#${n ?? ''} Clone `,
          edit: `#${n ?? ''} Edit `,
          show: `#${n ?? ''} Show `,
          list: '',
        },
        s = (null == t ? void 0 : t.identifier) ?? (null == t ? void 0 : t.name),
        l =
          (null == t ? void 0 : t.label) ??
          (null == (i = null == t ? void 0 : t.meta) ? void 0 : i.label) ??
          nF(s, 'list' === r ? 'plural' : 'singular'),
        u = ag(e, 'documentTitle.default', 'Refine'),
        c = ag(e, 'documentTitle.suffix', ' | Refine'),
        d = u;
      return (
        r && s && (d = ag(e, `documentTitle.${s}.${r}`, `${o[r] ?? ''}${a ?? l}${c}`, { id: n })),
        d
      );
    }, 'generateDefaultDocumentTitle');
    var ab = nw((e, t) => {
        let { mutationMode: r, undoableTimeout: n } = (0, b.useContext)(at);
        return { mutationMode: e ?? r, undoableTimeout: t ?? n };
      }, 'useMutationMode'),
      aE = b.default.createContext({}),
      aw = nw(({ children: e }) => {
        let [t, r] = (0, b.useState)(!1);
        return b.default.createElement(aE.Provider, { value: { warnWhen: t, setWarnWhen: r } }, e);
      }, 'UnsavedWarnContextProvider'),
      aC = nw(() => {
        let { warnWhenUnsavedChanges: e } = (0, b.useContext)(at),
          { warnWhen: t, setWarnWhen: r } = (0, b.useContext)(aE);
        return { warnWhenUnsavedChanges: e, warnWhen: !!t, setWarnWhen: r ?? (() => {}) };
      }, 'useWarnAboutChange'),
      aP = nw(() => {
        let { syncWithLocation: e } = (0, b.useContext)(at);
        return { syncWithLocation: e };
      }, 'useSyncWithLocation'),
      aS = nw(() => {
        let { Title: e } = (0, b.useContext)(at);
        return e;
      }, 'useTitle'),
      aO = nw(() => {
        let {
          Footer: e,
          Header: t,
          Layout: r,
          OffLayoutArea: n,
          Sider: a,
          Title: i,
          hasDashboard: o,
          mutationMode: s,
          syncWithLocation: l,
          undoableTimeout: u,
          warnWhenUnsavedChanges: c,
          DashboardPage: d,
          LoginPage: f,
          catchAll: p,
          options: h,
          __initialized: m,
        } = (0, b.useContext)(at);
        return {
          __initialized: m,
          Footer: e,
          Header: t,
          Layout: r,
          OffLayoutArea: n,
          Sider: a,
          Title: i,
          hasDashboard: o,
          mutationMode: s,
          syncWithLocation: l,
          undoableTimeout: u,
          warnWhenUnsavedChanges: c,
          DashboardPage: d,
          LoginPage: f,
          catchAll: p,
          options: h,
        };
      }, 'useRefineContext'),
      ax = nw(() => {
        let {
          options: { textTransformers: e },
        } = aO();
        return nw((t = '', r) => {
          let n = e.humanize(t);
          return 'singular' === r ? e.singular(n) : e.plural(n);
        }, 'getFriendlyName');
      }, 'useUserFriendlyName'),
      aL = nw((e) => 'object' == typeof e && null !== e, 'isNested'),
      aA = nw((e) => Array.isArray(e), 'isArray'),
      ak = nw(
        (e, t = '') =>
          aL(e)
            ? Object.keys(e).reduce((r, n) => {
                let a = t.length ? `${t}.` : '';
                return (
                  aL(e[n]) &&
                    Object.keys(e[n]).length &&
                    (aA(e[n]) && e[n].length
                      ? e[n].forEach((e, t) => {
                          Object.assign(r, ak(e, `${a + n}.${t}`));
                        })
                      : Object.assign(r, ak(e[n], a + n))),
                  (r[a + n] = e[n]),
                  r
                );
              }, {})
            : { [t]: e },
        'flattenObjectKeys',
      );
    nw(
      (e) => e.split('.').map((e) => (Number.isNaN(Number(e)) ? e : Number(e))),
      'propertyPathToArray',
    );
    var aF = nw((e, t, r) => {
        if (typeof window > 'u') return;
        let n = new Blob([t], { type: r }),
          a = document.createElement('a');
        (a.setAttribute('visibility', 'hidden'), (a.download = e));
        let i = URL.createObjectURL(n);
        ((a.href = i),
          document.body.appendChild(a),
          a.click(),
          document.body.removeChild(a),
          setTimeout(() => {
            URL.revokeObjectURL(i);
          }));
      }, 'downloadInBrowser'),
      a_ = nw((e) => {
        setTimeout(e, 0);
      }, 'deferExecution'),
      aR = nw((e, t = 1e3, r) => {
        let n = [],
          a = nw(() => {
            (n.forEach((e) => {
              var t;
              return null == (t = e.reject) ? void 0 : t.call(e, r);
            }),
              (n = []));
          }, 'cancelPrevious'),
          i = tH((...t) => {
            let { resolve: r, reject: a } = n.pop() || {};
            Promise.resolve(e(...t))
              .then(r)
              .catch(a);
          }, t),
          o = nw(
            (...e) =>
              new Promise((t, r) => {
                (a(), n.push({ resolve: t, reject: r }), i(...e));
              }),
            'runner',
          );
        return (
          (o.flush = () => i.flush()),
          (o.cancel = () => {
            (i.cancel(), a());
          }),
          o
        );
      }, 'asyncDebounce'),
      aD = nw((e) => {
        let t = { queryKey: e.queryKey, pageParam: e.pageParam };
        return (Object.defineProperty(t, 'signal', { enumerable: !0, get: () => e.signal }), t);
      }, 'prepareQueryContext'),
      aM = nw((e) => {
        let {
          current: t,
          pageSize: r,
          sorter: n,
          sorters: a,
          filters: i,
        } = tS.default.parse(e.substring(1));
        return {
          parsedCurrent: t && Number(t),
          parsedPageSize: r && Number(r),
          parsedSorter: nW(a, n) ?? [],
          parsedFilters: i ?? [],
        };
      }, 'parseTableParams'),
      aN =
        (nw((e) => {
          let t = tS.default.stringify(e);
          return aM(`/${t}`);
        }, 'parseTableParamsFromQuery'),
        nw((e) => {
          let { pagination: t, sorter: r, sorters: n, filters: a, ...i } = e;
          return tS.default.stringify(
            { ...i, ...(t || {}), sorters: nW(n, r), filters: a },
            { skipNulls: !0, arrayFormat: 'indices', encode: !1 },
          );
        }, 'stringifyTableParams')),
      aT = nw(
        (e, t) =>
          'and' !== e.operator && 'or' !== e.operator && 'and' !== t.operator && 'or' !== t.operator
            ? ('field' in e ? e.field : void 0) === ('field' in t ? t.field : void 0) &&
              e.operator === t.operator
            : ('key' in e ? e.key : void 0) === ('key' in t ? t.key : void 0) &&
              e.operator === t.operator,
        'compareFilters',
      ),
      aj = nw((e, t) => e.field === t.field, 'compareSorters'),
      aI = nw(
        (e, t, r = []) => (
          t.filter((e) => ('or' === e.operator || 'and' === e.operator) && !e.key).length > 1 &&
            (0, tO.default)(
              !0,
              `[conditionalFilters]: You have created multiple Conditional Filters at the top level, this requires the key parameter. 
For more information, see https://refine.dev/docs/advanced-tutorials/data-provider/handling-filters/#top-level-multiple-conditional-filters-usage`,
            ),
          tP(e, t, r, aT).filter(
            (e) =>
              void 0 !== e.value &&
              null !== e.value &&
              ('or' !== e.operator || ('or' === e.operator && 0 !== e.value.length)) &&
              ('and' !== e.operator || ('and' === e.operator && 0 !== e.value.length)),
          )
        ),
        'unionFilters',
      ),
      a$ = nw(
        (e, t) => tP(e, t, aj).filter((e) => void 0 !== e.order && null !== e.order),
        'unionSorters',
      ),
      aq = nw((e, t) => [...tg(t, e, aT), ...e], 'setInitialFilters'),
      aU = nw((e, t) => [...tg(t, e, aj), ...e], 'setInitialSorters');
    (nw((e, t) => {
      if (!t) return;
      let r = t.find((t) => t.field === e);
      if (r) return r.order;
    }, 'getDefaultSortOrder'),
      nw((e, t, r = 'eq') => {
        let n =
          null == t
            ? void 0
            : t.find((t) => {
                if ('or' !== t.operator && 'and' !== t.operator && 'field' in t) {
                  let { operator: n, field: a } = t;
                  return a === e && n === r;
                }
              });
        if (n) return n.value || [];
      }, 'getDefaultFilter'),
      nw(
        (e) =>
          new Promise((t, r) => {
            let n = new FileReader(),
              a = nw(() => {
                n.result && (n.removeEventListener('load', a, !1), t(n.result));
              }, 'resultHandler');
            (n.addEventListener('load', a, !1),
              n.readAsDataURL(e.originFileObj),
              (n.onerror = (e) => (n.removeEventListener('load', a, !1), r(e))));
          }),
        'file2Base64',
      ));
    var aK = nw(() => {
      let {
        options: { useNewQueryKeys: e },
      } = aO();
      return { keys: nB, preferLegacyKeys: !e };
    }, 'useKeys');
    function aQ({ v3LegacyAuthProviderCompatible: e = !1, queryOptions: t } = {}) {
      let { getUserIdentity: r } = nx(),
        { getIdentity: n } = nL(),
        { keys: a, preferLegacyKeys: i } = aK(),
        o = ef({
          queryKey: a().auth().action('identity').get(i),
          queryFn: n ?? (() => Promise.resolve({})),
          enabled: !e && !!n,
          retry: !1,
          ...(!0 === e ? {} : t),
          meta: { ...(!0 === e ? {} : null == t ? void 0 : t.meta), ...w('useGetIdentity', i) },
        }),
        s = ef({
          queryKey: [...a().auth().action('identity').get(i), 'v3LegacyAuthProviderCompatible'],
          queryFn: r ?? (() => Promise.resolve({})),
          enabled: e && !!r,
          retry: !1,
          ...(e ? t : {}),
          meta: { ...(e ? (null == t ? void 0 : t.meta) : {}), ...w('useGetIdentity', i) },
        });
      return e ? s : o;
    }
    (nw(function ({ v3LegacyAuthProviderCompatible: e = !1, options: t, params: r } = {}) {
      let { getPermissions: n } = nx(),
        { getPermissions: a } = nL(),
        { keys: i, preferLegacyKeys: o } = aK(),
        s = ef({
          queryKey: i().auth().action('permissions').get(o),
          queryFn: a ? () => a(r) : () => Promise.resolve(void 0),
          enabled: !e && !!a,
          ...(e ? {} : t),
          meta: { ...(e ? {} : null == t ? void 0 : t.meta), ...w('usePermissions', o) },
        }),
        l = ef({
          queryKey: [...i().auth().action('permissions').get(o), 'v3LegacyAuthProviderCompatible'],
          queryFn: n ? () => n(r) : () => Promise.resolve(void 0),
          enabled: e && !!n,
          ...(e ? t : {}),
          meta: { ...(e ? (null == t ? void 0 : t.meta) : {}), ...w('usePermissions', o) },
        });
      return e ? l : s;
    }, 'usePermissions'),
      nw(aQ, 'useGetIdentity'));
    var az = nw(() => {
      let e = es(),
        { keys: t, preferLegacyKeys: r } = aK();
      return nw(async () => {
        await Promise.all(
          ['check', 'identity', 'permissions'].map((n) =>
            e.invalidateQueries(t().auth().action(n).get(r)),
          ),
        );
      }, 'invalidate');
    }, 'useInvalidateAuthStore');
    function aB({ v3LegacyAuthProviderCompatible: e, mutationOptions: t } = {}) {
      let r = az(),
        n = iN(),
        a = oi(),
        { push: i } = os(),
        { open: o, close: s } = iX(),
        { logout: l } = nx(),
        { logout: u } = nL(),
        { keys: c, preferLegacyKeys: d } = aK(),
        f = tX({
          mutationKey: c().auth().action('logout').get(d),
          mutationFn: u,
          onSuccess: async (e, t) => {
            let { success: l, error: u, redirectTo: c, successNotification: d } = e,
              { redirectPath: f } = t ?? {},
              p = f ?? c;
            (l && (null == s || s('useLogout-error'), d && (null == o || o(aH(d)))),
              (u || !l) && (null == o || o(aW(u))),
              !1 !== p && ('legacy' === n ? i(p ?? '/login') : p && a({ to: p })),
              await r());
          },
          onError: (e) => {
            null == o || o(aW(e));
          },
          ...(!0 === e ? {} : t),
          meta: { ...(!0 === e ? {} : null == t ? void 0 : t.meta), ...w('useLogout', d) },
        }),
        p = tX({
          mutationKey: [...c().auth().action('logout').get(d), 'v3LegacyAuthProviderCompatible'],
          mutationFn: l,
          onSuccess: async (e, t) => {
            let o = (null == t ? void 0 : t.redirectPath) ?? e;
            if (!1 !== o) {
              if (o) return void ('legacy' === n ? i(o) : a({ to: o }));
              ('legacy' === n ? i('/login') : a({ to: '/login' }), await r());
            }
          },
          onError: (e) => {
            null == o || o(aW(e));
          },
          ...(e ? t : {}),
          meta: { ...(e ? (null == t ? void 0 : t.meta) : {}), ...w('useLogout', d) },
        });
      return e ? p : f;
    }
    nw(aB, 'useLogout');
    var aW = nw(
        (e) => ({
          key: 'useLogout-error',
          type: 'error',
          message: (null == e ? void 0 : e.name) || 'Logout Error',
          description: (null == e ? void 0 : e.message) || 'Something went wrong during logout',
        }),
        'buildNotification',
      ),
      aH = nw(
        (e) => ({
          message: e.message,
          description: e.description,
          key: 'logout-success',
          type: 'success',
        }),
        'buildSuccessNotification',
      );
    function aG({ v3LegacyAuthProviderCompatible: e, mutationOptions: t } = {}) {
      let r = az(),
        n = iN(),
        a = oi(),
        { replace: i } = os(),
        o = iq(),
        { useLocation: s } = og(),
        { search: l } = s(),
        { close: u, open: c } = iX(),
        { login: d } = nx(),
        { login: f } = nL(),
        { keys: p, preferLegacyKeys: h } = aK(),
        m = b.default.useMemo(() => {
          var e;
          return 'legacy' === n
            ? tS.default.parse(l, { ignoreQueryPrefix: !0 }).to
            : null == (e = o.params)
              ? void 0
              : e.to;
        }, [n, o.params, l]),
        y = tX({
          mutationKey: p().auth().action('login').get(h),
          mutationFn: f,
          onSuccess: async ({ success: e, redirectTo: t, error: o, successNotification: s }) => {
            (e && (null == u || u('login-error'), s && (null == c || c(aZ(s)))),
              (o || !e) && (null == c || c(aV(o))),
              m && e
                ? 'legacy' === n
                  ? i(m)
                  : a({ to: m, type: 'replace' })
                : t
                  ? 'legacy' === n
                    ? i(t)
                    : a({ to: t, type: 'replace' })
                  : 'legacy' === n && i('/'),
              setTimeout(() => {
                r();
              }, 32));
          },
          onError: (e) => {
            null == c || c(aV(e));
          },
          ...(!0 === e ? {} : t),
          meta: { ...(!0 === e ? {} : null == t ? void 0 : t.meta), ...w('useLogin', h) },
        }),
        v = tX({
          mutationKey: [...p().auth().action('login').get(h), 'v3LegacyAuthProviderCompatible'],
          mutationFn: d,
          onSuccess: async (e) => {
            (m && i(m),
              !1 === e ||
                m ||
                ('string' == typeof e
                  ? 'legacy' === n
                    ? i(e)
                    : a({ to: e, type: 'replace' })
                  : 'legacy' === n
                    ? i('/')
                    : a({ to: '/', type: 'replace' })),
              setTimeout(() => {
                r();
              }, 32),
              null == u || u('login-error'));
          },
          onError: (e) => {
            null == c || c(aV(e));
          },
          ...(e ? t : {}),
          meta: { ...(e ? (null == t ? void 0 : t.meta) : {}), ...w('useLogin', h) },
        });
      return e ? v : y;
    }
    nw(aG, 'useLogin');
    var aV = nw(
        (e) => ({
          message: (null == e ? void 0 : e.name) || 'Login Error',
          description: (null == e ? void 0 : e.message) || 'Invalid credentials',
          key: 'login-error',
          type: 'error',
        }),
        'buildNotification',
      ),
      aZ = nw(
        (e) => ({
          message: e.message,
          description: e.description,
          key: 'login-success',
          type: 'success',
        }),
        'buildSuccessNotification',
      );
    function aY({ v3LegacyAuthProviderCompatible: e, mutationOptions: t } = {}) {
      let r = az(),
        n = iN(),
        a = oi(),
        { replace: i } = os(),
        { register: o } = nx(),
        { register: s } = nL(),
        { close: l, open: u } = iX(),
        { keys: c, preferLegacyKeys: d } = aK(),
        f = tX({
          mutationKey: c().auth().action('register').get(d),
          mutationFn: s,
          onSuccess: async ({ success: e, redirectTo: t, error: o, successNotification: s }) => {
            (e && (null == l || l('register-error'), s && (null == u || u(aX(s))), await r()),
              (o || !e) && (null == u || u(aJ(o))),
              t
                ? 'legacy' === n
                  ? i(t)
                  : a({ to: t, type: 'replace' })
                : 'legacy' === n && i('/'));
          },
          onError: (e) => {
            null == u || u(aJ(e));
          },
          ...(!0 === e ? {} : t),
          meta: { ...(!0 === e ? {} : null == t ? void 0 : t.meta), ...w('useRegister', d) },
        }),
        p = tX({
          mutationKey: [...c().auth().action('register').get(d), 'v3LegacyAuthProviderCompatible'],
          mutationFn: o,
          onSuccess: async (e) => {
            !1 !== e &&
              (e
                ? 'legacy' === n
                  ? i(e)
                  : a({ to: e, type: 'replace' })
                : 'legacy' === n
                  ? i('/')
                  : a({ to: '/', type: 'replace' }),
              await r(),
              null == l || l('register-error'));
          },
          onError: (e) => {
            null == u || u(aJ(e));
          },
          ...(e ? t : {}),
          meta: { ...(e ? (null == t ? void 0 : t.meta) : {}), ...w('useRegister', d) },
        });
      return e ? p : f;
    }
    nw(aY, 'useRegister');
    var aJ = nw(
        (e) => ({
          message: (null == e ? void 0 : e.name) || 'Register Error',
          description: (null == e ? void 0 : e.message) || 'Error while registering',
          key: 'register-error',
          type: 'error',
        }),
        'buildNotification',
      ),
      aX = nw(
        (e) => ({
          message: e.message,
          description: e.description,
          key: 'register-success',
          type: 'success',
        }),
        'buildSuccessNotification',
      );
    function a0({ v3LegacyAuthProviderCompatible: e, mutationOptions: t } = {}) {
      let r = iN(),
        n = oi(),
        { replace: a } = os(),
        { forgotPassword: i } = nx(),
        { forgotPassword: o } = nL(),
        { close: s, open: l } = iX(),
        { keys: u, preferLegacyKeys: c } = aK(),
        d = tX({
          mutationKey: u().auth().action('forgotPassword').get(c),
          mutationFn: o,
          onSuccess: ({ success: e, redirectTo: t, error: i, successNotification: o }) => {
            (e && (null == s || s('forgot-password-error'), o && (null == l || l(a2(o)))),
              (i || !e) && (null == l || l(a1(i))),
              t && ('legacy' === r ? a(t) : n({ to: t, type: 'replace' })));
          },
          onError: (e) => {
            null == l || l(a1(e));
          },
          ...(!0 === e ? {} : t),
          meta: { ...(!0 === e ? {} : null == t ? void 0 : t.meta), ...w('useForgotPassword', c) },
        }),
        f = tX({
          mutationKey: [
            ...u().auth().action('forgotPassword').get(c),
            'v3LegacyAuthProviderCompatible',
          ],
          mutationFn: i,
          onSuccess: (e) => {
            (!1 !== e && e && ('legacy' === r ? a(e) : n({ to: e, type: 'replace' })),
              null == s || s('forgot-password-error'));
          },
          onError: (e) => {
            null == l || l(a1(e));
          },
          ...(e ? t : {}),
          meta: { ...(e ? (null == t ? void 0 : t.meta) : {}), ...w('useForgotPassword', c) },
        });
      return e ? f : d;
    }
    nw(a0, 'useForgotPassword');
    var a1 = nw(
        (e) => ({
          message: (null == e ? void 0 : e.name) || 'Forgot Password Error',
          description: (null == e ? void 0 : e.message) || 'Error while resetting password',
          key: 'forgot-password-error',
          type: 'error',
        }),
        'buildNotification',
      ),
      a2 = nw(
        (e) => ({
          message: e.message,
          description: e.description,
          key: 'forgot-password-success',
          type: 'success',
        }),
        'buildSuccessNotification',
      );
    function a4({ v3LegacyAuthProviderCompatible: e, mutationOptions: t } = {}) {
      let r = iN(),
        n = oi(),
        { replace: a } = os(),
        { updatePassword: i } = nx(),
        { updatePassword: o } = nL(),
        { close: s, open: l } = iX(),
        { keys: u, preferLegacyKeys: c } = aK(),
        d = iq(),
        { useLocation: f } = og(),
        { search: p } = f(),
        h = b.default.useMemo(
          () =>
            'legacy' === r
              ? (tS.default.parse(p, { ignoreQueryPrefix: !0 }) ?? {})
              : (d.params ?? {}),
          [p, d, r],
        ),
        m = tX({
          mutationKey: u().auth().action('updatePassword').get(c),
          mutationFn: async (e) => (null == o ? void 0 : o({ ...h, ...e })),
          onSuccess: ({ success: e, redirectTo: t, error: i, successNotification: o }) => {
            (e && (null == s || s('update-password-error'), o && (null == l || l(a8(o)))),
              (i || !e) && (null == l || l(a3(i))),
              t && ('legacy' === r ? a(t) : n({ to: t, type: 'replace' })));
          },
          onError: (e) => {
            null == l || l(a3(e));
          },
          ...(!0 === e ? {} : t),
          meta: { ...(!0 === e ? {} : null == t ? void 0 : t.meta), ...w('useUpdatePassword', c) },
        }),
        y = tX({
          mutationKey: [
            ...u().auth().action('updatePassword').get(c),
            'v3LegacyAuthProviderCompatible',
          ],
          mutationFn: async (e) => (null == i ? void 0 : i({ ...h, ...e })),
          onSuccess: (e) => {
            (!1 !== e && e && ('legacy' === r ? a(e) : n({ to: e, type: 'replace' })),
              null == s || s('update-password-error'));
          },
          onError: (e) => {
            null == l || l(a3(e));
          },
          ...(e ? t : {}),
          meta: { ...(e ? (null == t ? void 0 : t.meta) : {}), ...w('useUpdatePassword', c) },
        });
      return e ? y : m;
    }
    nw(a4, 'useUpdatePassword');
    var a3 = nw(
        (e) => ({
          message: (null == e ? void 0 : e.name) || 'Update Password Error',
          description: (null == e ? void 0 : e.message) || 'Error while updating password',
          key: 'update-password-error',
          type: 'error',
        }),
        'buildNotification',
      ),
      a8 = nw(
        (e) => ({
          message: e.message,
          description: e.description,
          key: 'update-password-success',
          type: 'success',
        }),
        'buildSuccessNotification',
      );
    function a6({ v3LegacyAuthProviderCompatible: e = !1, params: t } = {}) {
      let { checkAuth: r } = nx(),
        { check: n } = nL(),
        { keys: a, preferLegacyKeys: i } = aK(),
        o = ef({
          queryKey: a().auth().action('check').params(t).get(i),
          queryFn: async () => (await (null == n ? void 0 : n(t))) ?? {},
          retry: !1,
          enabled: !e,
          meta: { ...w('useIsAuthenticated', i) },
        }),
        s = ef({
          queryKey: [
            ...a().auth().action('check').params(t).get(i),
            'v3LegacyAuthProviderCompatible',
          ],
          queryFn: async () => (await (null == r ? void 0 : r(t))) ?? {},
          retry: !1,
          enabled: e,
          meta: { ...w('useIsAuthenticated', i) },
        });
      return e ? s : o;
    }
    function a5({ v3LegacyAuthProviderCompatible: e = !1 } = {}) {
      let t = iN(),
        r = oi(),
        { replace: n } = os(),
        { checkError: a } = nx(),
        { onError: i } = nL(),
        { keys: o, preferLegacyKeys: s } = aK(),
        { mutate: l } = aB({ v3LegacyAuthProviderCompatible: !!e }),
        { mutate: u } = aB({ v3LegacyAuthProviderCompatible: !!e }),
        c = tX({
          mutationKey: o().auth().action('onError').get(s),
          ...(i
            ? {
                mutationFn: i,
                onSuccess: ({ logout: e, redirectTo: a }) => {
                  e
                    ? u({ redirectPath: a })
                    : a && ('legacy' === t ? n(a) : r({ to: a, type: 'replace' }));
                },
              }
            : { mutationFn: () => ({}) }),
          meta: { ...w('useOnError', s) },
        }),
        d = tX({
          mutationKey: [...o().auth().action('onError').get(s), 'v3LegacyAuthProviderCompatible'],
          mutationFn: a,
          onError: (e) => {
            l({ redirectPath: e });
          },
          meta: { ...w('useOnError', s) },
        });
      return e ? d : c;
    }
    (nw(a6, 'useIsAuthenticated'), nw(a5, 'useOnError'));
    var a9 = nw(() => {
        let { isProvided: e } = nx(),
          { isProvided: t } = nL();
        return !!(t || e);
      }, 'useIsExistAuthentication'),
      a7 = nw(({ enabled: e, isLoading: t, interval: r, onInterval: n }) => {
        let [a, i] = (0, b.useState)(void 0),
          { options: o } = aO(),
          { overtime: s } = o,
          l = r ?? s.interval,
          u = n ?? (null == s ? void 0 : s.onInterval),
          c = 'u' > typeof e ? e : !('u' > typeof s.enabled) || s.enabled;
        return (
          (0, b.useEffect)(() => {
            let e;
            return (
              c &&
                t &&
                (e = setInterval(() => {
                  i((e) => (void 0 === e ? l : e + l));
                }, l)),
              () => {
                ('u' > typeof e && clearInterval(e), i(void 0));
              }
            );
          }, [t, l, c]),
          (0, b.useEffect)(() => {
            u && a && u(a);
          }, [a]),
          { elapsedTime: a }
        );
      }, 'useLoadingOvertime'),
      ie = nw(
        ({
          resource: e,
          config: t,
          filters: r,
          hasPagination: n,
          pagination: a,
          sorters: i,
          queryOptions: o,
          successNotification: s,
          errorNotification: l,
          meta: u,
          metaData: c,
          liveMode: d,
          onLiveEvent: f,
          liveParams: p,
          dataProviderName: h,
          overtimeOptions: m,
        } = {}) => {
          let { resources: y, resource: v, identifier: g } = iU(e),
            b = iO(),
            E = i3(),
            C = am(),
            { mutate: P } = a5({ v3LegacyAuthProviderCompatible: !!(null != C && C.isLegacy) }),
            S = i0(),
            O = oI(),
            { keys: x, preferLegacyKeys: L } = aK(),
            A = as(g, h, y),
            k = nW(u, c),
            F = nW(r, null == t ? void 0 : t.filters),
            _ = nW(i, null == t ? void 0 : t.sort),
            R = nW(n, null == t ? void 0 : t.hasPagination),
            D = ay({
              pagination: a,
              configPagination: null == t ? void 0 : t.pagination,
              hasPagination: R,
            }),
            M = 'server' === D.mode,
            N = O({ resource: v, meta: k }),
            T = {
              meta: N,
              metaData: N,
              filters: F,
              hasPagination: M,
              pagination: D,
              sorters: _,
              config: { ...t, sort: _ },
            },
            j =
              (null == o ? void 0 : o.enabled) === void 0 ||
              (null == o ? void 0 : o.enabled) === !0,
            { getList: I } = b(A);
          iQ({
            resource: g,
            types: ['*'],
            params: {
              meta: N,
              metaData: N,
              pagination: D,
              hasPagination: M,
              sort: _,
              sorters: _,
              filters: F,
              subscriptionType: 'useList',
              ...p,
            },
            channel: `resources/${null == v ? void 0 : v.name}`,
            enabled: j,
            liveMode: d,
            onLiveEvent: f,
            dataProviderName: A,
            meta: { ...u, dataProviderName: h },
          });
          let $ = ef({
              queryKey: x()
                .data(A)
                .resource(g ?? '')
                .action('list')
                .params({
                  ...(k || {}),
                  filters: F,
                  hasPagination: M,
                  ...(M && { pagination: D }),
                  ...(i && { sorters: i }),
                  ...((null == t ? void 0 : t.sort) && { sort: null == t ? void 0 : t.sort }),
                })
                .get(L),
              queryFn: (e) => {
                let t = { ...N, queryContext: aD(e) };
                return I({
                  resource: (null == v ? void 0 : v.name) ?? '',
                  pagination: D,
                  hasPagination: M,
                  filters: F,
                  sort: _,
                  sorters: _,
                  meta: t,
                  metaData: t,
                });
              },
              ...o,
              enabled:
                'u' > typeof (null == o ? void 0 : o.enabled)
                  ? null == o
                    ? void 0
                    : o.enabled
                  : !!(null != v && v.name),
              select: (e) => {
                var t;
                let r = e,
                  { current: n, mode: a, pageSize: i } = D;
                return (
                  'client' === a &&
                    (r = { ...r, data: r.data.slice((n - 1) * i, n * i), total: r.total }),
                  null != o && o.select
                    ? null == (t = null == o ? void 0 : o.select)
                      ? void 0
                      : t.call(o, r)
                    : r
                );
              },
              onSuccess: (e) => {
                var t;
                (null == (t = null == o ? void 0 : o.onSuccess) || t.call(o, e),
                  S('function' == typeof s ? s(e, T, g) : s));
              },
              onError: (e) => {
                var t;
                (P(e),
                  null == (t = null == o ? void 0 : o.onError) || t.call(o, e),
                  S('function' == typeof l ? l(e, T, g) : l, {
                    key: `${g}-useList-notification`,
                    message: E(
                      'notifications.error',
                      { statusCode: e.statusCode },
                      `Error (status code: ${e.statusCode})`,
                    ),
                    description: e.message,
                    type: 'error',
                  }));
              },
              meta: {
                ...(null == o ? void 0 : o.meta),
                ...w('useList', L, null == v ? void 0 : v.name),
              },
            }),
            { elapsedTime: q } = a7({ ...m, isLoading: $.isFetching });
          return { ...$, overtime: { elapsedTime: q } };
        },
        'useList',
      ),
      it = nw(
        ({
          resource: e,
          id: t,
          queryOptions: r,
          successNotification: n,
          errorNotification: a,
          meta: i,
          metaData: o,
          liveMode: s,
          onLiveEvent: l,
          liveParams: u,
          dataProviderName: c,
          overtimeOptions: d,
        }) => {
          let { resources: f, resource: p, identifier: h } = iU(e),
            m = iO(),
            y = i3(),
            v = am(),
            { mutate: g } = a5({ v3LegacyAuthProviderCompatible: !!(null != v && v.isLegacy) }),
            b = i0(),
            E = oI(),
            { keys: C, preferLegacyKeys: P } = aK(),
            S = nW(i, o),
            O = as(h, c, f),
            { getOne: x } = m(O),
            L = E({ resource: p, meta: S });
          iQ({
            resource: h,
            types: ['*'],
            channel: `resources/${null == p ? void 0 : p.name}`,
            params: {
              ids: t ? [t] : [],
              id: t,
              meta: L,
              metaData: L,
              subscriptionType: 'useOne',
              ...u,
            },
            enabled:
              'u' > typeof (null == r ? void 0 : r.enabled)
                ? null == r
                  ? void 0
                  : r.enabled
                : 'u' > typeof (null == p ? void 0 : p.name) && 'u' > typeof t,
            liveMode: s,
            onLiveEvent: l,
            dataProviderName: O,
            meta: { ...i, dataProviderName: c },
          });
          let A = ef({
              queryKey: C()
                .data(O)
                .resource(h ?? '')
                .action('one')
                .id(t ?? '')
                .params({ ...(S || {}) })
                .get(P),
              queryFn: (e) =>
                x({
                  resource: (null == p ? void 0 : p.name) ?? '',
                  id: t,
                  meta: { ...L, queryContext: aD(e) },
                  metaData: { ...L, queryContext: aD(e) },
                }),
              ...r,
              enabled:
                'u' > typeof (null == r ? void 0 : r.enabled)
                  ? null == r
                    ? void 0
                    : r.enabled
                  : 'u' > typeof t,
              onSuccess: (e) => {
                var a;
                (null == (a = null == r ? void 0 : r.onSuccess) || a.call(r, e),
                  b('function' == typeof n ? n(e, { id: t, ...L }, h) : n));
              },
              onError: (e) => {
                var n;
                (g(e),
                  null == (n = null == r ? void 0 : r.onError) || n.call(r, e),
                  b('function' == typeof a ? a(e, { id: t, ...L }, h) : a, {
                    key: `${t}-${h}-getOne-notification`,
                    message: y(
                      'notifications.error',
                      { statusCode: e.statusCode },
                      `Error (status code: ${e.statusCode})`,
                    ),
                    description: e.message,
                    type: 'error',
                  }));
              },
              meta: {
                ...(null == r ? void 0 : r.meta),
                ...w('useOne', P, null == p ? void 0 : p.name),
              },
            }),
            { elapsedTime: k } = a7({ ...d, isLoading: A.isFetching });
          return { ...A, overtime: { elapsedTime: k } };
        },
        'useOne',
      ),
      ir = nw(
        ({
          resource: e,
          ids: t,
          queryOptions: r,
          successNotification: n,
          errorNotification: a,
          meta: i,
          metaData: o,
          liveMode: s,
          onLiveEvent: l,
          liveParams: u,
          dataProviderName: c,
          overtimeOptions: d,
        }) => {
          let { resources: f, resource: p, identifier: h } = iU(e),
            m = iO(),
            y = i3(),
            v = am(),
            { mutate: g } = a5({ v3LegacyAuthProviderCompatible: !!(null != v && v.isLegacy) }),
            b = i0(),
            E = oI(),
            { keys: C, preferLegacyKeys: P } = aK(),
            S = nW(i, o),
            O = as(h, c, f),
            x =
              (null == r ? void 0 : r.enabled) === void 0 ||
              (null == r ? void 0 : r.enabled) === !0,
            { getMany: L, getOne: A } = m(O),
            k = E({ resource: p, meta: S }),
            F = Array.isArray(t),
            _ = !!(null != p && p.name),
            R = (null == r ? void 0 : r.enabled) === !0;
          ((0, tO.default)(!F && !R, ia(t, null == p ? void 0 : p.name)),
            (0, tO.default)(!_ && !R, ii()),
            iQ({
              resource: h,
              types: ['*'],
              params: { ids: t ?? [], meta: k, metaData: k, subscriptionType: 'useMany', ...u },
              channel: `resources/${(null == p ? void 0 : p.name) ?? ''}`,
              enabled: x,
              liveMode: s,
              onLiveEvent: l,
              dataProviderName: O,
              meta: { ...i, dataProviderName: c },
            }));
          let D = ef({
              queryKey: C()
                .data(O)
                .resource(h)
                .action('many')
                .ids(...(t ?? []))
                .params({ ...(S || {}) })
                .get(P),
              queryFn: (e) => {
                let r = { ...k, queryContext: aD(e) };
                return L
                  ? L({ resource: null == p ? void 0 : p.name, ids: t, meta: r, metaData: r })
                  : al(
                      t.map((e) =>
                        A({ resource: null == p ? void 0 : p.name, id: e, meta: r, metaData: r }),
                      ),
                    );
              },
              enabled: F && _,
              ...r,
              onSuccess: (e) => {
                var a;
                (null == (a = null == r ? void 0 : r.onSuccess) || a.call(r, e),
                  b('function' == typeof n ? n(e, t, h) : n));
              },
              onError: (e) => {
                var n;
                (g(e),
                  null == (n = null == r ? void 0 : r.onError) || n.call(r, e),
                  b('function' == typeof a ? a(e, t, h) : a, {
                    key: `${t[0]}-${h}-getMany-notification`,
                    message: y(
                      'notifications.error',
                      { statusCode: e.statusCode },
                      `Error (status code: ${e.statusCode})`,
                    ),
                    description: e.message,
                    type: 'error',
                  }));
              },
              meta: {
                ...(null == r ? void 0 : r.meta),
                ...w('useMany', P, null == p ? void 0 : p.name),
              },
            }),
            { elapsedTime: M } = a7({ ...d, isLoading: D.isFetching });
          return { ...D, overtime: { elapsedTime: M } };
        },
        'useMany',
      ),
      ia = nw(
        (
          e,
          t,
        ) => `[useMany]: Missing "ids" prop. Expected an array of ids, but got "${typeof e}". Resource: "${t}"

See https://refine.dev/docs/data/hooks/use-many/#ids-`,
        'idsWarningMessage',
      ),
      ii = nw(
        () => `[useMany]: Missing "resource" prop. Expected a string, but got undefined.

See https://refine.dev/docs/data/hooks/use-many/#resource-`,
        'resourceWarningMessage',
      ),
      io =
        (((u = io || {}).ADD = 'ADD'),
        (u.REMOVE = 'REMOVE'),
        (u.DECREASE_NOTIFICATION_SECOND = 'DECREASE_NOTIFICATION_SECOND'),
        u),
      is = nw(
        ({
          id: e,
          resource: t,
          values: r,
          dataProviderName: n,
          successNotification: a,
          errorNotification: i,
          meta: o,
          metaData: s,
          mutationMode: l,
          undoableTimeout: u,
          onCancel: c,
          optimisticUpdateMap: d,
          invalidates: f,
          mutationOptions: p,
          overtimeOptions: h,
        } = {}) => {
          let { resources: m, select: y } = iU(),
            v = es(),
            g = iO(),
            { mutationMode: b, undoableTimeout: E } = ab(),
            C = i3(),
            P = am(),
            { mutate: S } = a5({ v3LegacyAuthProviderCompatible: !!(null != P && P.isLegacy) }),
            O = iB(),
            { log: x } = oF(),
            { notificationDispatch: L } = iZ(),
            A = i0(),
            k = iA(),
            F = oI(),
            {
              options: { textTransformers: _ },
            } = aO(),
            { keys: R, preferLegacyKeys: D } = aK(),
            {
              mutate: M,
              mutateAsync: N,
              ...T
            } = tX({
              mutationFn: ({
                id: a = e,
                values: i = r,
                resource: d = t,
                mutationMode: f = l,
                undoableTimeout: p = u,
                onCancel: h = c,
                meta: v = o,
                metaData: w = s,
                dataProviderName: C = n,
              }) => {
                if (typeof a > 'u') throw iu;
                if (!i) throw ic;
                if (!d) throw il;
                let { resource: P, identifier: S } = y(d),
                  O = F({ resource: P, meta: nW(v, w) }),
                  x = p ?? E;
                return 'undoable' !== (f ?? b)
                  ? g(as(S, C, m)).update({
                      resource: P.name,
                      id: a,
                      variables: i,
                      meta: O,
                      metaData: O,
                    })
                  : new Promise((e, t) => {
                      let r = nw(() => {
                          g(as(S, C, m))
                            .update({ resource: P.name, id: a, variables: i, meta: O, metaData: O })
                            .then((t) => e(t))
                            .catch((e) => t(e));
                        }, 'doMutation'),
                        n = nw(() => {
                          t({ message: 'mutationCancelled' });
                        }, 'cancelMutation');
                      (h && h(n),
                        L({
                          type: 'ADD',
                          payload: {
                            id: a,
                            resource: S,
                            cancelMutation: n,
                            doMutation: r,
                            seconds: x,
                            isSilent: !!h,
                          },
                        }));
                    });
              },
              onMutate: async ({
                resource: a = t,
                id: i = e,
                mutationMode: u = l,
                values: c = r,
                dataProviderName: f = n,
                meta: p = o,
                metaData: h = s,
                optimisticUpdateMap: g = d ?? { list: !0, many: !0, detail: !0 },
              }) => {
                if (typeof i > 'u') throw iu;
                if (!c) throw ic;
                if (!a) throw il;
                let { identifier: E } = y(a),
                  { gqlMutation: w, gqlQuery: C, ...P } = nW(p, h) ?? {},
                  S = nH(D)(E, as(E, f, m), P),
                  O = R()
                    .data(as(E, f, m))
                    .resource(E),
                  x = v.getQueriesData(O.get(D));
                return (
                  await v.cancelQueries(O.get(D), void 0, { silent: !0 }),
                  'pessimistic' !== (u ?? b) &&
                    (g.list &&
                      v.setQueriesData(
                        O.action('list')
                          .params(P ?? {})
                          .get(D),
                        (e) => {
                          if ('function' == typeof g.list) return g.list(e, c, i);
                          if (!e) return null;
                          let t = e.data.map((e) => {
                            var t;
                            return (null == (t = e.id) ? void 0 : t.toString()) ===
                              (null == i ? void 0 : i.toString())
                              ? { id: i, ...e, ...c }
                              : e;
                          });
                          return { ...e, data: t };
                        },
                      ),
                    g.many &&
                      v.setQueriesData(O.action('many').get(D), (e) => {
                        if ('function' == typeof g.many) return g.many(e, c, i);
                        if (!e) return null;
                        let t = e.data.map((e) => {
                          var t;
                          return (
                            (null == (t = e.id) ? void 0 : t.toString()) ===
                              (null == i ? void 0 : i.toString()) && (e = { id: i, ...e, ...c }),
                            e
                          );
                        });
                        return { ...e, data: t };
                      }),
                    g.detail &&
                      v.setQueriesData(
                        O.action('one')
                          .id(i)
                          .params(P ?? {})
                          .get(D),
                        (e) =>
                          'function' == typeof g.detail
                            ? g.detail(e, c, i)
                            : e
                              ? { ...e, data: { ...e.data, ...c } }
                              : null,
                      )),
                  { previousQueries: x, queryKey: S }
                );
              },
              onSettled: (r, a, i, o) => {
                var s;
                let {
                  id: l = e,
                  resource: u = t,
                  dataProviderName: c = n,
                  invalidates: d = f ?? ['list', 'many', 'detail'],
                } = i;
                if (typeof l > 'u') throw iu;
                if (!u) throw il;
                let { identifier: h } = y(u);
                (k({ resource: h, dataProviderName: as(h, c, m), invalidates: d, id: l }),
                  L({ type: 'REMOVE', payload: { id: l, resource: h } }),
                  null == (s = null == p ? void 0 : p.onSettled) || s.call(p, r, a, i, o));
              },
              onSuccess: (i, l, u) => {
                var c, d;
                let f,
                  {
                    id: h = e,
                    resource: g = t,
                    successNotification: b = a,
                    dataProviderName: E = n,
                    values: w = r,
                    meta: P = o,
                    metaData: S = s,
                  } = l;
                if (typeof h > 'u') throw iu;
                if (!w) throw ic;
                if (!g) throw il;
                let { resource: L, identifier: k } = y(g),
                  R = _.singular(k),
                  D = as(k, E, m),
                  M = F({ resource: L, meta: nW(P, S) });
                if (
                  (A('function' == typeof b ? b(i, { id: h, values: w }, k) : b, {
                    key: `${h}-${k}-notification`,
                    description: C('notifications.success', 'Successful'),
                    message: C(
                      'notifications.editSuccess',
                      { resource: C(`${k}.${k}`, R) },
                      `Successfully updated ${R}`,
                    ),
                    type: 'success',
                  }),
                  null == O ||
                    O({
                      channel: `resources/${L.name}`,
                      type: 'updated',
                      payload: { ids: null != (c = i.data) && c.id ? [i.data.id] : void 0 },
                      date: new Date(),
                      meta: { ...M, dataProviderName: D },
                    }),
                  u)
                ) {
                  let e = v.getQueryData(u.queryKey.detail(h));
                  f = Object.keys(w || {}).reduce((t, r) => {
                    var n;
                    return ((t[r] = null == (n = null == e ? void 0 : e.data) ? void 0 : n[r]), t);
                  }, {});
                }
                let { fields: N, operation: T, variables: j, ...I } = M || {};
                (null == x ||
                  x.mutate({
                    action: 'update',
                    resource: L.name,
                    data: w,
                    previousData: f,
                    meta: { ...I, dataProviderName: D, id: h },
                  }),
                  null == (d = null == p ? void 0 : p.onSuccess) || d.call(p, i, l, u));
              },
              onError: (n, a, o) => {
                var s;
                let { id: l = e, resource: u = t, errorNotification: c = i, values: d = r } = a;
                if (typeof l > 'u') throw iu;
                if (!d) throw ic;
                if (!u) throw il;
                let { identifier: f } = y(u);
                if (o) for (let e of o.previousQueries) v.setQueryData(e[0], e[1]);
                if ('mutationCancelled' !== n.message) {
                  null == S || S(n);
                  let e = _.singular(f);
                  A('function' == typeof c ? c(n, { id: l, values: d }, f) : c, {
                    key: `${l}-${f}-notification`,
                    message: C(
                      'notifications.editError',
                      { resource: C(`${f}.${f}`, e), statusCode: n.statusCode },
                      `Error when updating ${e} (status code: ${n.statusCode})`,
                    ),
                    description: n.message,
                    type: 'error',
                  });
                }
                null == (s = null == p ? void 0 : p.onError) || s.call(p, n, a, o);
              },
              mutationKey: R().data().mutation('update').get(D),
              ...p,
              meta: { ...(null == p ? void 0 : p.meta), ...w('useUpdate', D) },
            }),
            { elapsedTime: j } = a7({ ...h, isLoading: T.isLoading });
          return {
            ...T,
            mutate: nw((e, t) => M(e || {}, t), 'handleMutation'),
            mutateAsync: nw((e, t) => N(e || {}, t), 'handleMutateAsync'),
            overtime: { elapsedTime: j },
          };
        },
        'useUpdate',
      ),
      il = Error('[useUpdate]: `resource` is not defined or not matched but is required'),
      iu = Error('[useUpdate]: `id` is not defined but is required in edit and clone actions'),
      ic = Error('[useUpdate]: `values` is not provided but is required'),
      id = nw(
        ({
          resource: e,
          values: t,
          dataProviderName: r,
          successNotification: n,
          errorNotification: a,
          invalidates: i,
          meta: o,
          metaData: s,
          mutationOptions: l,
          overtimeOptions: u,
        } = {}) => {
          let c = am(),
            { mutate: d } = a5({ v3LegacyAuthProviderCompatible: !!(null != c && c.isLegacy) }),
            f = iO(),
            p = iA(),
            { resources: h, select: m } = iU(),
            y = i3(),
            v = iB(),
            { log: g } = oF(),
            b = i0(),
            E = oI(),
            {
              options: { textTransformers: C },
            } = aO(),
            { keys: P, preferLegacyKeys: S } = aK(),
            {
              mutate: O,
              mutateAsync: x,
              ...L
            } = tX({
              mutationFn: ({
                resource: n = e,
                values: a = t,
                meta: i = o,
                metaData: l = s,
                dataProviderName: u = r,
              }) => {
                if (!a) throw ih;
                if (!n) throw ip;
                let { resource: c, identifier: d } = m(n),
                  p = E({ resource: c, meta: nW(i, l) });
                return f(as(d, u, h)).create({
                  resource: c.name,
                  variables: a,
                  meta: p,
                  metaData: p,
                });
              },
              onSuccess: (a, u, c) => {
                var d, f, w;
                let {
                  resource: P = e,
                  successNotification: S = n,
                  dataProviderName: O = r,
                  invalidates: x = i ?? ['list', 'many'],
                  values: L = t,
                  meta: A = o,
                  metaData: k = s,
                } = u;
                if (!L) throw ih;
                if (!P) throw ip;
                let { resource: F, identifier: _ } = m(P),
                  R = C.singular(_),
                  D = as(_, O, h),
                  M = E({ resource: F, meta: nW(A, k) });
                (b('function' == typeof S ? S(a, L, _) : S, {
                  key: `create-${_}-notification`,
                  message: y(
                    'notifications.createSuccess',
                    { resource: y(`${_}.${_}`, R) },
                    `Successfully created ${R}`,
                  ),
                  description: y('notifications.success', 'Success'),
                  type: 'success',
                }),
                  p({ resource: _, dataProviderName: D, invalidates: x }),
                  null == v ||
                    v({
                      channel: `resources/${F.name}`,
                      type: 'created',
                      payload: {
                        ids:
                          null != (d = null == a ? void 0 : a.data) && d.id ? [a.data.id] : void 0,
                      },
                      date: new Date(),
                      meta: { ...M, dataProviderName: D },
                    }));
                let { fields: N, operation: T, variables: j, ...I } = M || {};
                (null == g ||
                  g.mutate({
                    action: 'create',
                    resource: F.name,
                    data: L,
                    meta: {
                      ...I,
                      dataProviderName: D,
                      id: (null == (f = null == a ? void 0 : a.data) ? void 0 : f.id) ?? void 0,
                    },
                  }),
                  null == (w = null == l ? void 0 : l.onSuccess) || w.call(l, a, u, c));
              },
              onError: (r, n, i) => {
                var o;
                let { resource: s = e, errorNotification: u = a, values: c = t } = n;
                if (!c) throw ih;
                if (!s) throw ip;
                d(r);
                let { identifier: f } = m(s),
                  p = C.singular(f);
                (b('function' == typeof u ? u(r, c, f) : u, {
                  key: `create-${f}-notification`,
                  description: r.message,
                  message: y(
                    'notifications.createError',
                    { resource: y(`${f}.${f}`, p), statusCode: r.statusCode },
                    `There was an error creating ${p} (status code: ${r.statusCode})`,
                  ),
                  type: 'error',
                }),
                  null == (o = null == l ? void 0 : l.onError) || o.call(l, r, n, i));
              },
              mutationKey: P().data().mutation('create').get(S),
              ...l,
              meta: { ...(null == l ? void 0 : l.meta), ...w('useCreate', S) },
            }),
            { elapsedTime: A } = a7({ ...u, isLoading: L.isLoading });
          return {
            ...L,
            mutate: nw((e, t) => O(e || {}, t), 'handleMutation'),
            mutateAsync: nw((e, t) => x(e || {}, t), 'handleMutateAsync'),
            overtime: { elapsedTime: A },
          };
        },
        'useCreate',
      ),
      ip = Error('[useCreate]: `resource` is not defined or not matched but is required'),
      ih = Error('[useCreate]: `values` is not provided but is required'),
      im = nw(({ mutationOptions: e, overtimeOptions: t } = {}) => {
        let r = am(),
          { mutate: n } = a5({ v3LegacyAuthProviderCompatible: !!(null != r && r.isLegacy) }),
          a = iO(),
          { resources: i, select: o } = iU(),
          s = es(),
          { mutationMode: l, undoableTimeout: u } = ab(),
          { notificationDispatch: c } = iZ(),
          d = i3(),
          f = iB(),
          { log: p } = oF(),
          h = i0(),
          m = iA(),
          y = oI(),
          {
            options: { textTransformers: v },
          } = aO(),
          { keys: g, preferLegacyKeys: b } = aK(),
          E = tX({
            mutationFn: ({
              id: e,
              mutationMode: t,
              undoableTimeout: r,
              resource: n,
              onCancel: s,
              meta: d,
              metaData: f,
              dataProviderName: p,
              values: h,
            }) => {
              let { resource: m, identifier: v } = o(n),
                g = y({ resource: m, meta: nW(d, f) }),
                b = r ?? u;
              return 'undoable' !== (t ?? l)
                ? a(as(v, p, i)).deleteOne({
                    resource: m.name,
                    id: e,
                    meta: g,
                    metaData: g,
                    variables: h,
                  })
                : new Promise((t, r) => {
                    let n = nw(() => {
                        a(as(v, p, i))
                          .deleteOne({
                            resource: m.name,
                            id: e,
                            meta: g,
                            metaData: g,
                            variables: h,
                          })
                          .then((e) => t(e))
                          .catch((e) => r(e));
                      }, 'doMutation'),
                      o = nw(() => {
                        r({ message: 'mutationCancelled' });
                      }, 'cancelMutation');
                    (s && s(o),
                      c({
                        type: 'ADD',
                        payload: {
                          id: e,
                          resource: v,
                          cancelMutation: o,
                          doMutation: n,
                          seconds: b,
                          isSilent: !!s,
                        },
                      }));
                  });
            },
            onMutate: async ({
              id: e,
              resource: t,
              mutationMode: r,
              dataProviderName: n,
              meta: a,
              metaData: u,
            }) => {
              let { identifier: c } = o(t),
                { gqlMutation: d, gqlQuery: f, ...p } = nW(a, u) ?? {},
                h = nH(b)(c, as(c, n, i), p),
                m = g()
                  .data(as(c, n, i))
                  .resource(c);
              await s.cancelQueries(m.get(b), void 0, { silent: !0 });
              let y = s.getQueriesData(m.get(b));
              return (
                'pessimistic' !== (r ?? l) &&
                  (s.setQueriesData(
                    m
                      .action('list')
                      .params(p ?? {})
                      .get(b),
                    (t) =>
                      t
                        ? {
                            data: t.data.filter((t) => {
                              var r;
                              return (null == (r = t.id) ? void 0 : r.toString()) !== e.toString();
                            }),
                            total: t.total - 1,
                          }
                        : null,
                  ),
                  s.setQueriesData(m.action('many').get(b), (t) => {
                    if (!t) return null;
                    let r = t.data.filter((t) => {
                      var r;
                      return (
                        (null == (r = t.id) ? void 0 : r.toString()) !==
                        (null == e ? void 0 : e.toString())
                      );
                    });
                    return { ...t, data: r };
                  })),
                { previousQueries: y, queryKey: h }
              );
            },
            onSettled: (
              e,
              t,
              { id: r, resource: n, dataProviderName: a, invalidates: s = ['list', 'many'] },
            ) => {
              let { identifier: l } = o(n);
              (m({ resource: l, dataProviderName: as(l, a, i), invalidates: s }),
                c({ type: 'REMOVE', payload: { id: r, resource: l } }));
            },
            onSuccess: (
              e,
              {
                id: t,
                resource: r,
                successNotification: n,
                dataProviderName: a,
                meta: l,
                metaData: u,
              },
              c,
            ) => {
              let { resource: m, identifier: g } = o(r),
                b = v.singular(g),
                E = as(g, a, i),
                w = y({ resource: m, meta: nW(l, u) });
              (s.removeQueries(null == c ? void 0 : c.queryKey.detail(t)),
                h('function' == typeof n ? n(e, t, g) : n, {
                  key: `${t}-${g}-notification`,
                  description: d('notifications.success', 'Success'),
                  message: d(
                    'notifications.deleteSuccess',
                    { resource: d(`${g}.${g}`, b) },
                    `Successfully deleted a ${b}`,
                  ),
                  type: 'success',
                }),
                null == f ||
                  f({
                    channel: `resources/${m.name}`,
                    type: 'deleted',
                    payload: { ids: [t] },
                    date: new Date(),
                    meta: { ...w, dataProviderName: E },
                  }));
              let { fields: C, operation: P, variables: S, ...O } = w || {};
              (null == p ||
                p.mutate({
                  action: 'delete',
                  resource: m.name,
                  meta: { ...O, dataProviderName: E, id: t },
                }),
                s.removeQueries(null == c ? void 0 : c.queryKey.detail(t)));
            },
            onError: (e, { id: t, resource: r, errorNotification: a }, i) => {
              let { identifier: l } = o(r);
              if (i) for (let e of i.previousQueries) s.setQueryData(e[0], e[1]);
              if ('mutationCancelled' !== e.message) {
                n(e);
                let r = v.singular(l);
                h('function' == typeof a ? a(e, t, l) : a, {
                  key: `${t}-${l}-notification`,
                  message: d(
                    'notifications.deleteError',
                    { resource: r, statusCode: e.statusCode },
                    `Error (status code: ${e.statusCode})`,
                  ),
                  description: e.message,
                  type: 'error',
                });
              }
            },
            mutationKey: g().data().mutation('delete').get(b),
            ...e,
            meta: { ...(null == e ? void 0 : e.meta), ...w('useDelete', b) },
          }),
          { elapsedTime: C } = a7({ ...t, isLoading: E.isLoading });
        return { ...E, overtime: { elapsedTime: C } };
      }, 'useDelete'),
      iy = nw(
        ({
          resource: e,
          values: t,
          dataProviderName: r,
          successNotification: n,
          errorNotification: a,
          meta: i,
          metaData: o,
          invalidates: s,
          mutationOptions: l,
          overtimeOptions: u,
        } = {}) => {
          let c = iO(),
            { resources: d, select: f } = iU(),
            p = i3(),
            h = iB(),
            m = i0(),
            y = iA(),
            { log: v } = oF(),
            g = oI(),
            {
              options: { textTransformers: b },
            } = aO(),
            { keys: E, preferLegacyKeys: C } = aK(),
            {
              mutate: P,
              mutateAsync: S,
              ...O
            } = tX({
              mutationFn: ({
                resource: n = e,
                values: a = t,
                meta: s = i,
                metaData: l = o,
                dataProviderName: u = r,
              }) => {
                if (!a) throw ig;
                if (!n) throw iv;
                let { resource: p, identifier: h } = f(n),
                  m = g({ resource: p, meta: nW(s, l) }),
                  y = c(as(h, u, d));
                return y.createMany
                  ? y.createMany({ resource: p.name, variables: a, meta: m, metaData: m })
                  : al(
                      a.map((e) =>
                        y.create({ resource: p.name, variables: e, meta: m, metaData: m }),
                      ),
                    );
              },
              onSuccess: (a, u, c) => {
                var E;
                let {
                  resource: w = e,
                  successNotification: C = n,
                  dataProviderName: P = r,
                  invalidates: S = s ?? ['list', 'many'],
                  values: O = t,
                  meta: x = i,
                  metaData: L = o,
                } = u;
                if (!O) throw ig;
                if (!w) throw iv;
                let { resource: A, identifier: k } = f(w),
                  F = b.plural(k),
                  _ = as(k, P, d),
                  R = g({ resource: A, meta: nW(x, L) });
                (m('function' == typeof C ? C(a, O, k) : C, {
                  key: `createMany-${k}-notification`,
                  message: p(
                    'notifications.createSuccess',
                    { resource: p(`${k}.${k}`, k) },
                    `Successfully created ${F}`,
                  ),
                  description: p('notifications.success', 'Success'),
                  type: 'success',
                }),
                  y({ resource: k, dataProviderName: _, invalidates: S }));
                let D =
                  null == a
                    ? void 0
                    : a.data.filter((e) => (null == e ? void 0 : e.id) !== void 0).map((e) => e.id);
                null == h ||
                  h({
                    channel: `resources/${A.name}`,
                    type: 'created',
                    payload: { ids: D },
                    date: new Date(),
                    meta: { ...R, dataProviderName: _ },
                  });
                let { fields: M, operation: N, variables: T, ...j } = R || {};
                (null == v ||
                  v.mutate({
                    action: 'createMany',
                    resource: A.name,
                    data: O,
                    meta: { dataProviderName: _, ids: D, ...j },
                  }),
                  null == (E = null == l ? void 0 : l.onSuccess) || E.call(l, a, u, c));
              },
              onError: (r, n, i) => {
                var o;
                let { resource: s = e, errorNotification: u = a, values: c = t } = n;
                if (!c) throw ig;
                if (!s) throw iv;
                let { identifier: d } = f(s);
                (m('function' == typeof u ? u(r, c, d) : u, {
                  key: `createMany-${d}-notification`,
                  description: r.message,
                  message: p(
                    'notifications.createError',
                    { resource: p(`${d}.${d}`, d), statusCode: r.statusCode },
                    `There was an error creating ${d} (status code: ${r.statusCode}`,
                  ),
                  type: 'error',
                }),
                  null == (o = null == l ? void 0 : l.onError) || o.call(l, r, n, i));
              },
              mutationKey: E().data().mutation('createMany').get(C),
              ...l,
              meta: { ...(null == l ? void 0 : l.meta), ...w('useCreateMany', C) },
            }),
            { elapsedTime: x } = a7({ ...u, isLoading: O.isLoading });
          return {
            ...O,
            mutate: nw((e, t) => P(e || {}, t), 'handleMutation'),
            mutateAsync: nw((e, t) => S(e || {}, t), 'handleMutateAsync'),
            overtime: { elapsedTime: x },
          };
        },
        'useCreateMany',
      ),
      iv = Error('[useCreateMany]: `resource` is not defined or not matched but is required'),
      ig = Error('[useCreateMany]: `values` is not provided but is required');
    nw(
      ({
        ids: e,
        resource: t,
        values: r,
        dataProviderName: n,
        successNotification: a,
        errorNotification: i,
        meta: o,
        metaData: s,
        mutationMode: l,
        undoableTimeout: u,
        onCancel: c,
        optimisticUpdateMap: d,
        invalidates: f,
        mutationOptions: p,
        overtimeOptions: h,
      } = {}) => {
        let { resources: m, select: y } = iU(),
          v = es(),
          g = iO(),
          b = i3(),
          { mutationMode: E, undoableTimeout: C } = ab(),
          P = am(),
          { mutate: S } = a5({ v3LegacyAuthProviderCompatible: !!(null != P && P.isLegacy) }),
          { notificationDispatch: O } = iZ(),
          x = iB(),
          L = i0(),
          A = iA(),
          { log: k } = oF(),
          F = oI(),
          {
            options: { textTransformers: _ },
          } = aO(),
          { keys: R, preferLegacyKeys: D } = aK(),
          {
            mutate: M,
            mutateAsync: N,
            ...T
          } = tX({
            mutationFn: ({
              ids: a = e,
              values: i = r,
              resource: d = t,
              onCancel: f = c,
              mutationMode: p = l,
              undoableTimeout: h = u,
              meta: v = o,
              metaData: b = s,
              dataProviderName: w = n,
            }) => {
              if (!a) throw iE;
              if (!i) throw iw;
              if (!d) throw ib;
              let { resource: P, identifier: S } = y(d),
                x = F({ resource: P, meta: nW(v, b) }),
                L = h ?? C,
                A = g(as(S, w, m)),
                k = nw(
                  () =>
                    A.updateMany
                      ? A.updateMany({
                          resource: P.name,
                          ids: a,
                          variables: i,
                          meta: x,
                          metaData: x,
                        })
                      : al(
                          a.map((e) =>
                            A.update({
                              resource: P.name,
                              id: e,
                              variables: i,
                              meta: x,
                              metaData: x,
                            }),
                          ),
                        ),
                  'mutationFn',
                );
              return 'undoable' !== (p ?? E)
                ? k()
                : new Promise((e, t) => {
                    let r = nw(() => {
                        k()
                          .then((t) => e(t))
                          .catch((e) => t(e));
                      }, 'doMutation'),
                      n = nw(() => {
                        t({ message: 'mutationCancelled' });
                      }, 'cancelMutation');
                    (f && f(n),
                      O({
                        type: 'ADD',
                        payload: {
                          id: a,
                          resource: S,
                          cancelMutation: n,
                          doMutation: r,
                          seconds: L,
                          isSilent: !!f,
                        },
                      }));
                  });
            },
            onMutate: async ({
              resource: a = t,
              ids: i = e,
              values: u = r,
              mutationMode: c = l,
              dataProviderName: f = n,
              meta: p = o,
              metaData: h = s,
              optimisticUpdateMap: g = d ?? { list: !0, many: !0, detail: !0 },
            }) => {
              if (!i) throw iE;
              if (!u) throw iw;
              if (!a) throw ib;
              let { identifier: b } = y(a),
                { gqlMutation: w, gqlQuery: C, ...P } = nW(p, h) ?? {},
                S = nH(D)(b, as(b, f, m), P),
                O = R()
                  .data(as(b, f, m))
                  .resource(b);
              await v.cancelQueries(O.get(D), void 0, { silent: !0 });
              let x = v.getQueriesData(O.get(D));
              if (
                'pessimistic' !== (c ?? E) &&
                (g.list &&
                  v.setQueriesData(
                    O.action('list')
                      .params(P ?? {})
                      .get(D),
                    (e) => {
                      if ('function' == typeof g.list) return g.list(e, u, i);
                      if (!e) return null;
                      let t = e.data.map((e) =>
                        void 0 !== e.id &&
                        i
                          .filter((e) => void 0 !== e)
                          .map(String)
                          .includes(e.id.toString())
                          ? { ...e, ...u }
                          : e,
                      );
                      return { ...e, data: t };
                    },
                  ),
                g.many &&
                  v.setQueriesData(O.action('many').get(D), (e) => {
                    if ('function' == typeof g.many) return g.many(e, u, i);
                    if (!e) return null;
                    let t = e.data.map((e) =>
                      void 0 !== e.id &&
                      i
                        .filter((e) => void 0 !== e)
                        .map(String)
                        .includes(e.id.toString())
                        ? { ...e, ...u }
                        : e,
                    );
                    return { ...e, data: t };
                  }),
                g.detail)
              )
                for (let e of i)
                  v.setQueriesData(
                    O.action('one')
                      .id(e)
                      .params(P ?? {})
                      .get(D),
                    (t) => {
                      if ('function' == typeof g.detail) return g.detail(t, u, e);
                      if (!t) return null;
                      let r = { ...t.data, ...u };
                      return { ...t, data: r };
                    },
                  );
              return { previousQueries: x, queryKey: S };
            },
            onSettled: (r, a, i, o) => {
              var s;
              let { ids: l = e, resource: u = t, dataProviderName: c = n, invalidates: d = f } = i;
              if (!l) throw iE;
              if (!u) throw ib;
              let { identifier: h } = y(u);
              (A({
                resource: h,
                invalidates: d ?? ['list', 'many'],
                dataProviderName: as(h, c, m),
              }),
                l.forEach((e) =>
                  A({
                    resource: h,
                    invalidates: d ?? ['detail'],
                    dataProviderName: as(h, c, m),
                    id: e,
                  }),
                ),
                O({ type: 'REMOVE', payload: { id: l, resource: h } }),
                null == (s = null == p ? void 0 : p.onSettled) || s.call(p, r, a, i, o));
            },
            onSuccess: (i, l, u) => {
              var c;
              let {
                ids: d = e,
                resource: f = t,
                values: h = r,
                meta: g = o,
                metaData: E = s,
                dataProviderName: w = n,
                successNotification: C = a,
              } = l;
              if (!d) throw iE;
              if (!h) throw iw;
              if (!f) throw ib;
              let { resource: P, identifier: S } = y(f),
                O = _.singular(S),
                A = as(S, w, m),
                R = F({ resource: P, meta: nW(g, E) });
              (L('function' == typeof C ? C(i, { ids: d, values: h }, S) : C, {
                key: `${d}-${S}-notification`,
                description: b('notifications.success', 'Successful'),
                message: b(
                  'notifications.editSuccess',
                  { resource: b(`${S}.${S}`, S) },
                  `Successfully updated ${O}`,
                ),
                type: 'success',
              }),
                null == x ||
                  x({
                    channel: `resources/${P.name}`,
                    type: 'updated',
                    payload: { ids: d.map(String) },
                    date: new Date(),
                    meta: { ...R, dataProviderName: A },
                  }));
              let D = [];
              u &&
                d.forEach((e) => {
                  let t = v.getQueryData(u.queryKey.detail(e));
                  D.push(
                    Object.keys(h || {}).reduce((e, r) => {
                      var n;
                      return (
                        (e[r] = null == (n = null == t ? void 0 : t.data) ? void 0 : n[r]),
                        e
                      );
                    }, {}),
                  );
                });
              let { fields: M, operation: N, variables: T, ...j } = R || {};
              (null == k ||
                k.mutate({
                  action: 'updateMany',
                  resource: P.name,
                  data: h,
                  previousData: D,
                  meta: { ...j, dataProviderName: A, ids: d },
                }),
                null == (c = null == p ? void 0 : p.onSuccess) || c.call(p, i, l, u));
            },
            onError: (n, a, o) => {
              var s;
              let { ids: l = e, resource: u = t, errorNotification: c = i, values: d = r } = a;
              if (!l) throw iE;
              if (!d) throw iw;
              if (!u) throw ib;
              let { identifier: f } = y(u);
              if (o) for (let e of o.previousQueries) v.setQueryData(e[0], e[1]);
              if ('mutationCancelled' !== n.message) {
                null == S || S(n);
                let e = _.singular(f);
                L('function' == typeof c ? c(n, { ids: l, values: d }, f) : c, {
                  key: `${l}-${f}-updateMany-error-notification`,
                  message: b(
                    'notifications.editError',
                    { resource: e, statusCode: n.statusCode },
                    `Error when updating ${e} (status code: ${n.statusCode})`,
                  ),
                  description: n.message,
                  type: 'error',
                });
              }
              null == (s = null == p ? void 0 : p.onError) || s.call(p, n, a, o);
            },
            mutationKey: R().data().mutation('updateMany').get(D),
            ...p,
            meta: { ...(null == p ? void 0 : p.meta), ...w('useUpdateMany', D) },
          }),
          { elapsedTime: j } = a7({ ...h, isLoading: T.isLoading });
        return {
          ...T,
          mutate: nw((e, t) => M(e || {}, t), 'handleMutation'),
          mutateAsync: nw((e, t) => N(e || {}, t), 'handleMutateAsync'),
          overtime: { elapsedTime: j },
        };
      },
      'useUpdateMany',
    );
    var ib = Error('[useUpdateMany]: `resource` is not defined or not matched but is required'),
      iE = Error('[useUpdateMany]: `id` is not defined but is required in edit and clone actions'),
      iw = Error('[useUpdateMany]: `values` is not provided but is required');
    (nw(({ mutationOptions: e, overtimeOptions: t } = {}) => {
      let r = am(),
        { mutate: n } = a5({ v3LegacyAuthProviderCompatible: !!(null != r && r.isLegacy) }),
        { mutationMode: a, undoableTimeout: i } = ab(),
        o = iO(),
        { notificationDispatch: s } = iZ(),
        l = i3(),
        u = iB(),
        c = i0(),
        d = iA(),
        { log: f } = oF(),
        { resources: p, select: h } = iU(),
        m = es(),
        y = oI(),
        {
          options: { textTransformers: v },
        } = aO(),
        { keys: g, preferLegacyKeys: b } = aK(),
        E = tX({
          mutationFn: ({
            resource: e,
            ids: t,
            mutationMode: r,
            undoableTimeout: n,
            onCancel: l,
            meta: u,
            metaData: c,
            dataProviderName: d,
            values: f,
          }) => {
            let { resource: m, identifier: v } = h(e),
              g = y({ resource: m, meta: nW(u, c) }),
              b = n ?? i,
              E = o(as(v, d, p)),
              w = nw(
                () =>
                  E.deleteMany
                    ? E.deleteMany({ resource: m.name, ids: t, meta: g, metaData: g, variables: f })
                    : al(
                        t.map((e) =>
                          E.deleteOne({
                            resource: m.name,
                            id: e,
                            meta: g,
                            metaData: g,
                            variables: f,
                          }),
                        ),
                      ),
                'mutationFn',
              );
            return 'undoable' !== (r ?? a)
              ? w()
              : new Promise((e, r) => {
                  let n = nw(() => {
                      w()
                        .then((t) => e(t))
                        .catch((e) => r(e));
                    }, 'doMutation'),
                    a = nw(() => {
                      r({ message: 'mutationCancelled' });
                    }, 'cancelMutation');
                  (l && l(a),
                    s({
                      type: 'ADD',
                      payload: {
                        id: t,
                        resource: v,
                        cancelMutation: a,
                        doMutation: n,
                        seconds: b,
                        isSilent: !!l,
                      },
                    }));
                });
          },
          onMutate: async ({
            ids: e,
            resource: t,
            mutationMode: r,
            dataProviderName: n,
            meta: i,
            metaData: o,
          }) => {
            let { identifier: s } = h(t),
              { gqlMutation: l, gqlQuery: u, ...c } = nW(i, o) ?? {},
              d = nH(b)(s, as(s, n, p), c),
              f = g()
                .data(as(s, n, p))
                .resource(s);
            await m.cancelQueries(f.get(b), void 0, { silent: !0 });
            let y = m.getQueriesData(f.get(b));
            if ('pessimistic' !== (r ?? a))
              for (let t of (m.setQueriesData(
                f
                  .action('list')
                  .params(c ?? {})
                  .get(b),
                (t) =>
                  t
                    ? {
                        data: t.data.filter(
                          (t) => t.id && !e.map(String).includes(t.id.toString()),
                        ),
                        total: t.total - 1,
                      }
                    : null,
              ),
              m.setQueriesData(f.action('many').get(b), (t) => {
                if (!t) return null;
                let r = t.data.filter((t) => !!t.id && !e.map(String).includes(t.id.toString()));
                return { ...t, data: r };
              }),
              e))
                m.setQueriesData(f.action('one').id(t).params(c).get(b), (e) =>
                  e && e.data.id !== t ? { ...e } : null,
                );
            return { previousQueries: y, queryKey: d };
          },
          onSettled: (
            e,
            t,
            { resource: r, ids: n, dataProviderName: a, invalidates: i = ['list', 'many'] },
          ) => {
            let { identifier: o } = h(r);
            (d({ resource: o, dataProviderName: as(o, a, p), invalidates: i }),
              s({ type: 'REMOVE', payload: { id: n, resource: o } }));
          },
          onSuccess: (
            e,
            {
              ids: t,
              resource: r,
              meta: n,
              metaData: a,
              dataProviderName: i,
              successNotification: o,
            },
            s,
          ) => {
            let { resource: d, identifier: v } = h(r),
              g = as(v, i, p),
              b = y({ resource: d, meta: nW(n, a) });
            (t.forEach((e) => m.removeQueries(null == s ? void 0 : s.queryKey.detail(e))),
              c('function' == typeof o ? o(e, t, v) : o, {
                key: `${t}-${v}-notification`,
                description: l('notifications.success', 'Success'),
                message: l(
                  'notifications.deleteSuccess',
                  { resource: l(`${v}.${v}`, v) },
                  `Successfully deleted ${v}`,
                ),
                type: 'success',
              }),
              null == u ||
                u({
                  channel: `resources/${d.name}`,
                  type: 'deleted',
                  payload: { ids: t },
                  date: new Date(),
                  meta: { ...b, dataProviderName: g },
                }));
            let { fields: E, operation: w, variables: C, ...P } = b || {};
            (null == f ||
              f.mutate({
                action: 'deleteMany',
                resource: d.name,
                meta: { ids: t, dataProviderName: g, ...P },
              }),
              t.forEach((e) => m.removeQueries(null == s ? void 0 : s.queryKey.detail(e))));
          },
          onError: (e, { ids: t, resource: r, errorNotification: a }, i) => {
            let { identifier: o } = h(r);
            if (i) for (let e of i.previousQueries) m.setQueryData(e[0], e[1]);
            if ('mutationCancelled' !== e.message) {
              n(e);
              let r = v.singular(o);
              c('function' == typeof a ? a(e, t, o) : a, {
                key: `${t}-${o}-notification`,
                message: l(
                  'notifications.deleteError',
                  { resource: r, statusCode: e.statusCode },
                  `Error (status code: ${e.statusCode})`,
                ),
                description: e.message,
                type: 'error',
              });
            }
          },
          mutationKey: g().data().mutation('deleteMany').get(b),
          ...e,
          meta: { ...(null == e ? void 0 : e.meta), ...w('useDeleteMany', b) },
        }),
        { elapsedTime: C } = a7({ ...t, isLoading: E.isLoading });
      return { ...E, overtime: { elapsedTime: C } };
    }, 'useDeleteMany'),
      nw((e) => {
        var t;
        let r = iO(),
          { resource: n } = iU(),
          { getApiUrl: a } = r(
            e ??
              (null == (t = nW(null == n ? void 0 : n.meta, null == n ? void 0 : n.options))
                ? void 0
                : t.dataProviderName),
          );
        return a();
      }, 'useApiUrl'),
      nw(
        ({
          url: e,
          method: t,
          config: r,
          queryOptions: n,
          successNotification: a,
          errorNotification: i,
          meta: o,
          metaData: s,
          dataProviderName: l,
          overtimeOptions: u,
        }) => {
          let c = iO(),
            d = am(),
            { mutate: f } = a5({ v3LegacyAuthProviderCompatible: !!(null != d && d.isLegacy) }),
            p = i3(),
            h = i0(),
            m = oI(),
            { keys: y, preferLegacyKeys: v } = aK(),
            g = nW(o, s),
            { custom: b } = c(l),
            E = m({ meta: g });
          if (b) {
            let o = ef({
                queryKey: y()
                  .data(l)
                  .mutation('custom')
                  .params({ method: t, url: e, ...r, ...(g || {}) })
                  .get(v),
                queryFn: (n) =>
                  b({
                    url: e,
                    method: t,
                    ...r,
                    meta: { ...E, queryContext: aD(n) },
                    metaData: { ...E, queryContext: aD(n) },
                  }),
                ...n,
                onSuccess: (e) => {
                  var t;
                  (null == (t = null == n ? void 0 : n.onSuccess) || t.call(n, e),
                    h('function' == typeof a ? a(e, { ...r, ...E }) : a));
                },
                onError: (e) => {
                  var a;
                  (f(e),
                    null == (a = null == n ? void 0 : n.onError) || a.call(n, e),
                    h('function' == typeof i ? i(e, { ...r, ...E }) : i, {
                      key: `${t}-notification`,
                      message: p(
                        'notifications.error',
                        { statusCode: e.statusCode },
                        `Error (status code: ${e.statusCode})`,
                      ),
                      description: e.message,
                      type: 'error',
                    }));
                },
                meta: { ...(null == n ? void 0 : n.meta), ...w('useCustom', v) },
              }),
              { elapsedTime: s } = a7({ ...u, isLoading: o.isFetching });
            return { ...o, overtime: { elapsedTime: s } };
          }
          throw Error('Not implemented custom on data provider.');
        },
        'useCustom',
      ),
      nw(({ mutationOptions: e, overtimeOptions: t } = {}) => {
        let r = am(),
          { mutate: n } = a5({ v3LegacyAuthProviderCompatible: !!(null != r && r.isLegacy) }),
          a = i0(),
          i = iO(),
          o = i3(),
          s = oI(),
          { keys: l, preferLegacyKeys: u } = aK(),
          c = tX(
            ({
              url: e,
              method: t,
              values: r,
              meta: n,
              metaData: a,
              dataProviderName: o,
              config: l,
            }) => {
              let u = s({ meta: nW(n, a) }),
                { custom: c } = i(o);
              if (c)
                return c({
                  url: e,
                  method: t,
                  payload: r,
                  meta: u,
                  metaData: u,
                  headers: { ...(null == l ? void 0 : l.headers) },
                });
              throw Error('Not implemented custom on data provider.');
            },
            {
              onSuccess: (e, { successNotification: t, config: r, meta: n, metaData: i }) => {
                a('function' == typeof t ? t(e, { ...r, ...(nW(n, i) || {}) }) : t);
              },
              onError: (
                e,
                { errorNotification: t, method: r, config: i, meta: s, metaData: l },
              ) => {
                (n(e),
                  a('function' == typeof t ? t(e, { ...i, ...(nW(s, l) || {}) }) : t, {
                    key: `${r}-notification`,
                    message: o(
                      'notifications.error',
                      { statusCode: e.statusCode },
                      `Error (status code: ${e.statusCode})`,
                    ),
                    description: e.message,
                    type: 'error',
                  }));
              },
              mutationKey: l().data().mutation('customMutation').get(u),
              ...e,
              meta: { ...(null == e ? void 0 : e.meta), ...w('useCustomMutation', u) },
            },
          ),
          { elapsedTime: d } = a7({ ...t, isLoading: c.isLoading });
        return { ...c, overtime: { elapsedTime: d } };
      }, 'useCustomMutation'));
    var iC = { default: {} },
      iP = b.default.createContext(iC),
      iS = nw(({ children: e, dataProvider: t }) => {
        let r = iC;
        return (
          t && (r = !('default' in t) && ('getList' in t || 'getOne' in t) ? { default: t } : t),
          b.default.createElement(iP.Provider, { value: r }, e)
        );
      }, 'DataContextProvider'),
      iO = nw(() => {
        let e = (0, b.useContext)(iP);
        return (0, b.useCallback)(
          (t) => {
            if (t) {
              let r = null == e ? void 0 : e[t];
              if (!r) throw Error(`"${t}" Data provider not found`);
              if (r && !(null != e && e.default))
                throw Error(
                  'If you have multiple data providers, you must provide default data provider property',
                );
              return e[t];
            }
            if (e.default) return e.default;
            throw Error('There is no "default" data provider. Please pass dataProviderName.');
          },
          [e],
        );
      }, 'useDataProvider');
    nw(
      ({
        resource: e,
        config: t,
        filters: r,
        hasPagination: n,
        pagination: a,
        sorters: i,
        queryOptions: o,
        successNotification: s,
        errorNotification: l,
        meta: u,
        metaData: c,
        liveMode: d,
        onLiveEvent: f,
        liveParams: p,
        dataProviderName: h,
        overtimeOptions: m,
      }) => {
        let { resources: y, resource: v, identifier: g } = iU(e),
          b = iO(),
          E = i3(),
          C = am(),
          { mutate: P } = a5({ v3LegacyAuthProviderCompatible: !!(null != C && C.isLegacy) }),
          S = i0(),
          O = oI(),
          { keys: L, preferLegacyKeys: A } = aK(),
          k = as(g, h, y),
          F = nW(u, c),
          _ = nW(r, null == t ? void 0 : t.filters),
          R = nW(i, null == t ? void 0 : t.sort),
          D = nW(n, null == t ? void 0 : t.hasPagination),
          M = ay({
            pagination: a,
            configPagination: null == t ? void 0 : t.pagination,
            hasPagination: D,
          }),
          N = 'server' === M.mode,
          T = {
            meta: F,
            metaData: F,
            filters: _,
            hasPagination: N,
            pagination: M,
            sorters: R,
            config: { ...t, sort: R },
          },
          j =
            (null == o ? void 0 : o.enabled) === void 0 || (null == o ? void 0 : o.enabled) === !0,
          I = O({ resource: v, meta: F }),
          { getList: $ } = b(k);
        iQ({
          resource: g,
          types: ['*'],
          params: {
            meta: I,
            metaData: I,
            pagination: M,
            hasPagination: N,
            sort: R,
            sorters: R,
            filters: _,
            subscriptionType: 'useList',
            ...p,
          },
          channel: `resources/${v.name}`,
          enabled: j,
          liveMode: d,
          onLiveEvent: f,
          dataProviderName: k,
          meta: { ...I, dataProviderName: h },
        });
        let q = ed(
            x(
              {
                queryKey: L()
                  .data(k)
                  .resource(g)
                  .action('infinite')
                  .params({
                    ...(F || {}),
                    filters: _,
                    hasPagination: N,
                    ...(N && { pagination: M }),
                    ...(i && { sorters: i }),
                    ...((null == t ? void 0 : t.sort) && { sort: null == t ? void 0 : t.sort }),
                  })
                  .get(A),
                queryFn: (e) => {
                  let t = { ...M, current: e.pageParam },
                    r = { ...I, queryContext: aD(e) };
                  return $({
                    resource: v.name,
                    pagination: t,
                    hasPagination: N,
                    filters: _,
                    sort: R,
                    sorters: R,
                    meta: r,
                    metaData: r,
                  }).then(({ data: e, total: r, ...n }) => ({
                    data: e,
                    total: r,
                    pagination: t,
                    ...n,
                  }));
                },
                getNextPageParam: (e) => au(e),
                getPreviousPageParam: (e) => ac(e),
                ...o,
                onSuccess: (e) => {
                  var t;
                  (null == (t = null == o ? void 0 : o.onSuccess) || t.call(o, e),
                    S('function' == typeof s ? s(e, T, g) : s));
                },
                onError: (e) => {
                  var t;
                  (P(e),
                    null == (t = null == o ? void 0 : o.onError) || t.call(o, e),
                    S('function' == typeof l ? l(e, T, g) : l, {
                      key: `${g}-useInfiniteList-notification`,
                      message: E(
                        'notifications.error',
                        { statusCode: e.statusCode },
                        `Error (status code: ${e.statusCode})`,
                      ),
                      description: e.message,
                      type: 'error',
                    }));
                },
                meta: {
                  ...(null == o ? void 0 : o.meta),
                  ...w('useInfiniteList', A, null == v ? void 0 : v.name),
                },
              },
              void 0,
              void 0,
            ),
            t3,
          ),
          { elapsedTime: U } = a7({ ...m, isLoading: q.isFetching });
        return { ...q, overtime: { elapsedTime: U } };
      },
      'useInfiniteList',
    );
    var ix = b.default.createContext({}),
      iL = nw(
        ({ liveProvider: e, children: t }) =>
          b.default.createElement(ix.Provider, { value: { liveProvider: e } }, t),
        'LiveContextProvider',
      ),
      iA = nw(() => {
        let { resources: e } = iU(),
          t = es(),
          { keys: r, preferLegacyKeys: n } = aK();
        return (0, b.useCallback)(
          async ({
            resource: a,
            dataProviderName: i,
            invalidates: o,
            id: s,
            invalidationFilters: l = { type: 'all', refetchType: 'active' },
            invalidationOptions: u = { cancelRefetch: !1 },
          }) => {
            if (!1 === o) return;
            let c = as(a, i, e),
              d = r()
                .data(c)
                .resource(a ?? '');
            await Promise.all(
              o.map((e) => {
                switch (e) {
                  case 'all':
                    return t.invalidateQueries(r().data(c).get(n), l, u);
                  case 'list':
                    return t.invalidateQueries(d.action('list').get(n), l, u);
                  case 'many':
                    return t.invalidateQueries(d.action('many').get(n), l, u);
                  case 'resourceAll':
                    return t.invalidateQueries(d.get(n), l, u);
                  case 'detail':
                    return t.invalidateQueries(
                      d
                        .action('one')
                        .id(s || '')
                        .get(n),
                      l,
                      u,
                    );
                  default:
                    return;
                }
              }),
            );
          },
          [],
        );
      }, 'useInvalidate'),
      ik = nw((e) => {
        let t = (0, b.useRef)(e);
        return (rW(t.current, e) || (t.current = e), t.current);
      }, 'useMemoized'),
      iF = nw((e, t) => {
        let r = ik(t);
        return (0, b.useMemo)(e, r);
      }, 'useDeepMemo'),
      i_ = b.default.createContext({ resources: [] }),
      iR = nw(({ resources: e, children: t }) => {
        let r = iF(() => ad(e ?? []), [e]);
        return b.default.createElement(i_.Provider, { value: { resources: r } }, t);
      }, 'ResourceContextProvider'),
      iD = b.default.createContext('new'),
      iM = iD.Provider,
      iN = nw(() => b.default.useContext(iD), 'useRouterType'),
      iT = {},
      ij = (0, b.createContext)(iT),
      iI = nw(
        ({ children: e, router: t }) => b.default.createElement(ij.Provider, { value: t ?? iT }, e),
        'RouterContextProvider',
      ),
      i$ = nw(() => {
        let e = (0, b.useContext)(ij);
        return b.default.useMemo(
          () => (null == e ? void 0 : e.parse) ?? (() => () => ({})),
          [null == e ? void 0 : e.parse],
        )();
      }, 'useParse'),
      iq = nw(() => {
        let e = i$();
        return b.default.useMemo(() => e(), [e]);
      }, 'useParsed');
    function iU(e) {
      let { resources: t } = (0, b.useContext)(i_),
        r = iN(),
        n = iq(),
        a = {
          resourceName: e && 'string' != typeof e ? e.resourceName : e,
          resourceNameOrRouteName: e && 'string' != typeof e ? e.resourceNameOrRouteName : e,
          recordItemId: e && 'string' != typeof e ? e.recordItemId : void 0,
        },
        i = nw((e, n = !0) => {
          let a = ao(e, t, 'legacy' === r);
          if (a) return { resource: a, identifier: a.identifier ?? a.name };
          if (n) {
            let t = { name: e, identifier: e },
              r = t.identifier ?? t.name;
            return { resource: t, identifier: r };
          }
        }, 'select'),
        o = iK(),
        { useParams: s } = og(),
        l = s();
      if ('legacy' === r) {
        let e = a.resourceNameOrRouteName ? a.resourceNameOrRouteName : l.resource,
          r = e ? o(e) : void 0,
          n = (null == a ? void 0 : a.recordItemId) ?? l.id,
          s = l.action,
          u = (null == a ? void 0 : a.resourceName) ?? (null == r ? void 0 : r.name),
          c = (null == r ? void 0 : r.identifier) ?? (null == r ? void 0 : r.name);
        return {
          resources: t,
          resource: r,
          resourceName: u,
          id: n,
          action: s,
          select: i,
          identifier: c,
        };
      }
      let u,
        c = 'string' == typeof e ? e : null == a ? void 0 : a.resourceNameOrRouteName;
      if (c) {
        let e = ao(c, t);
        u = e || { name: c };
      } else null != n && n.resource && (u = n.resource);
      return {
        resources: t,
        resource: u,
        resourceName: null == u ? void 0 : u.name,
        id: n.id,
        action: n.action,
        select: i,
        identifier: (null == u ? void 0 : u.identifier) ?? (null == u ? void 0 : u.name),
      };
    }
    nw(iU, 'useResource');
    var iK = nw(() => {
        let { resources: e } = (0, b.useContext)(i_);
        return (0, b.useCallback)((t) => ao(t, e, !0) || { name: t, route: t }, [e]);
      }, 'useResourceWithRoute'),
      iQ = nw(
        ({
          resource: e,
          params: t,
          channel: r,
          types: n,
          enabled: a = !0,
          liveMode: i,
          onLiveEvent: o,
          dataProviderName: s,
          meta: l,
        }) => {
          var u;
          let { resource: c, identifier: d } = iU(e),
            { liveProvider: f } = (0, b.useContext)(ix),
            { liveMode: p, onLiveEvent: h } = (0, b.useContext)(at),
            m = i ?? p,
            y = iA(),
            v =
              s ??
              (null == l ? void 0 : l.dataProviderName) ??
              (null == (u = null == c ? void 0 : c.meta) ? void 0 : u.dataProviderName);
          (0, b.useEffect)(() => {
            let e,
              i = nw((e) => {
                ('auto' === m &&
                  y({
                    resource: d,
                    dataProviderName: v,
                    invalidates: ['resourceAll'],
                    invalidationFilters: { type: 'active', refetchType: 'active' },
                    invalidationOptions: { cancelRefetch: !1 },
                  }),
                  null == o || o(e),
                  null == h || h(e));
              }, 'callback');
            return (
              m &&
                'off' !== m &&
                a &&
                (e =
                  null == f
                    ? void 0
                    : f.subscribe({
                        channel: r,
                        params: { resource: null == c ? void 0 : c.name, ...t },
                        types: n,
                        callback: i,
                        dataProviderName: v,
                        meta: { ...l, dataProviderName: v },
                      })),
              () => {
                e && (null == f || f.unsubscribe(e));
              }
            );
          }, [a]);
        },
        'useResourceSubscription',
      ),
      iz = nw((e) => {
        let { liveMode: t } = (0, b.useContext)(at);
        return e ?? t;
      }, 'useLiveMode');
    nw(
      ({
        params: e,
        channel: t,
        types: r = ['*'],
        enabled: n = !0,
        onLiveEvent: a,
        dataProviderName: i = 'default',
        meta: o,
      }) => {
        let { liveProvider: s } = (0, b.useContext)(ix);
        (0, b.useEffect)(() => {
          let l;
          return (
            n &&
              (l =
                null == s
                  ? void 0
                  : s.subscribe({
                      channel: t,
                      params: e,
                      types: r,
                      callback: a,
                      dataProviderName: i,
                      meta: { ...o, dataProviderName: i },
                    })),
            () => {
              l && (null == s || s.unsubscribe(l));
            }
          );
        }, [n]);
      },
      'useSubscription',
    );
    var iB = nw(() => {
        let { liveProvider: e } = (0, b.useContext)(ix);
        return null == e ? void 0 : e.publish;
      }, 'usePublish'),
      iW = (0, b.createContext)({ notifications: [], notificationDispatch: () => !1 }),
      iH = [],
      iG = nw((e, t) => {
        switch (t.type) {
          case 'ADD':
            return [
              ...e.filter((e) => !(rW(e.id, t.payload.id) && e.resource === t.payload.resource)),
              { ...t.payload, isRunning: !0 },
            ];
          case 'REMOVE':
            return e.filter((e) => !(rW(e.id, t.payload.id) && e.resource === t.payload.resource));
          case 'DECREASE_NOTIFICATION_SECOND':
            return e.map((e) =>
              rW(e.id, t.payload.id) && e.resource === t.payload.resource
                ? { ...e, seconds: t.payload.seconds - 1e3 }
                : e,
            );
          default:
            return e;
        }
      }, 'undoableQueueReducer'),
      iV = nw(({ children: e }) => {
        let [t, r] = (0, b.useReducer)(iG, iH);
        return b.default.createElement(
          iW.Provider,
          { value: { notifications: t, notificationDispatch: r } },
          e,
          'u' > typeof window
            ? t.map((e) =>
                b.default.createElement(si, {
                  key: `${e.id}-${e.resource}-queue`,
                  notification: e,
                }),
              )
            : null,
        );
      }, 'UndoableQueueContextProvider'),
      iZ = nw(() => {
        let { notifications: e, notificationDispatch: t } = (0, b.useContext)(iW);
        return { notifications: e, notificationDispatch: t };
      }, 'useCancelNotification'),
      iY = (0, b.createContext)({}),
      iJ = nw(
        ({ open: e, close: t, children: r }) =>
          b.default.createElement(iY.Provider, { value: { open: e, close: t } }, r),
        'NotificationContextProvider',
      ),
      iX = nw(() => {
        let { open: e, close: t } = (0, b.useContext)(iY);
        return { open: e, close: t };
      }, 'useNotification'),
      i0 = nw(() => {
        let { open: e } = iX();
        return (0, b.useCallback)((t, r) => {
          !1 !== t && (t ? null == e || e(t) : r && (null == e || e(r)));
        }, []);
      }, 'useHandleNotification'),
      i1 = b.default.createContext({}),
      i2 = nw(
        ({ children: e, i18nProvider: t }) =>
          b.default.createElement(i1.Provider, { value: { i18nProvider: t } }, e),
        'I18nContextProvider',
      ),
      i4 = nw(() => {
        let { i18nProvider: e } = (0, b.useContext)(i1);
        return (0, b.useCallback)((t) => (null == e ? void 0 : e.changeLocale(t)), []);
      }, 'useSetLocale'),
      i3 = nw(() => {
        let { i18nProvider: e } = (0, b.useContext)(i1);
        return (0, b.useMemo)(() => {
          function t(t, r, n) {
            return (
              (null == e ? void 0 : e.translate(t, r, n)) ??
              n ??
              ('string' == typeof r && typeof n > 'u' ? r : t)
            );
          }
          return (nw(t, 'translate'), t);
        }, [e]);
      }, 'useTranslate'),
      i8 = nw(() => {
        let { i18nProvider: e } = (0, b.useContext)(i1);
        return (0, b.useCallback)(() => (null == e ? void 0 : e.getLocale()), []);
      }, 'useGetLocale');
    (nw(() => ({ translate: i3(), changeLocale: i4(), getLocale: i8() }), 'useTranslation'),
      nw(
        ({
          resourceName: e,
          resource: t,
          sorter: r,
          sorters: n,
          filters: a,
          maxItemCount: i,
          pageSize: o = 20,
          mapData: s = nw((e) => e, 'mapData'),
          exportOptions: l,
          unparseConfig: u,
          meta: c,
          metaData: d,
          dataProviderName: f,
          onError: p,
          download: h,
        } = {}) => {
          let [m, y] = (0, b.useState)(!1),
            v = iO(),
            g = oI(),
            { resource: E, resources: w, identifier: C } = iU(nW(t, e)),
            P = `${ax()(C, 'plural')}-${new Date().toLocaleString()}`,
            { getList: S } = v(as(C, f, w)),
            O = g({ resource: E, meta: nW(c, d) });
          return {
            isLoading: m,
            triggerExport: nw(async () => {
              y(!0);
              let e = [],
                t = 1,
                c = !0;
              for (; c; )
                try {
                  let { data: s, total: l } = await S({
                    resource: (null == E ? void 0 : E.name) ?? '',
                    filters: a,
                    sort: nW(n, r),
                    sorters: nW(n, r),
                    pagination: { current: t, pageSize: o, mode: 'server' },
                    meta: O,
                    metaData: O,
                  });
                  (t++,
                    e.push(...s),
                    i && e.length >= i && ((e = e.slice(0, i)), (c = !1)),
                    l === e.length && (c = !1));
                } catch (e) {
                  (y(!1), (c = !1), null == p || p(e));
                  return;
                }
              let d = 'u' > typeof u && null !== u;
              (0, tO.default)(
                d && 'u' > typeof l && null !== l,
                `[useExport]: resource: "${C}" 

Both \`unparseConfig\` and \`exportOptions\` are set, \`unparseConfig\` will take precedence`,
              );
              let f = {
                filename: P,
                useKeysAsHeaders: !0,
                useBom: !0,
                title: 'My Generated Report',
                quoteStrings: '"',
                ...l,
              };
              ((0, tO.default)(
                (null == l ? void 0 : l.decimalSeparator) !== void 0,
                `[useExport]: resource: "${C}" 

Use of \`decimalSeparator\` no longer supported, please use \`mapData\` instead.

See https://refine.dev/docs/api-reference/core/hooks/import-export/useExport/`,
              ),
                (u = d
                  ? { quotes: !0, ...u }
                  : {
                      columns: f.useKeysAsHeaders ? void 0 : f.headers,
                      delimiter: f.fieldSeparator,
                      header: f.showLabels || f.useKeysAsHeaders,
                      quoteChar: f.quoteStrings,
                      quotes: !0,
                    }));
              let m = rH.default.unparse(e.map(s), u);
              if (
                (f.showTitle &&
                  (m = `${f.title}\r

${m}`),
                'u' > typeof window && m.length > 0 && (h ?? !0))
              ) {
                let e = f.useTextFile ? '.txt' : '.csv',
                  t = `text/${f.useTextFile ? 'plain' : 'csv'};charset=utf8;`;
                aF(
                  `${(f.filename ?? 'download').replace(/ /g, '_')}${e}`,
                  `${null != f && f.useBom ? '\uFEFF' : ''}${m}`,
                  t,
                );
              }
              return (y(!1), m);
            }, 'triggerExport'),
          };
        },
        'useExport',
      ));
    var i6 = nw((e = {}) => {
        var t, r, n;
        let a = oI(),
          i = iA(),
          { redirect: o } = o$(),
          { mutationMode: s } = ab(),
          { setWarnWhen: l } = aC(),
          u = or(),
          c = nW(e.meta, e.metaData),
          d = e.mutationMode ?? s,
          {
            id: f,
            setId: p,
            resource: h,
            identifier: m,
            formAction: y,
          } = oK({ resource: e.resource, id: e.id, action: e.action }),
          [v, g] = b.default.useState(!1),
          E = 'edit' === y,
          w = 'clone' === y,
          C = 'create' === y,
          P = a({ resource: h, meta: c }),
          S = (E || w) && !!e.resource,
          O = 'u' > typeof e.id,
          x = (null == (t = e.queryOptions) ? void 0 : t.enabled) === !1;
        (0, tO.default)(S && !O && !x, ot(y, m, f));
        let L = aa({ redirectFromProps: e.redirect, action: y, redirectOptions: o }),
          A = nw((e = E ? 'list' : 'edit', t = f, r = {}) => {
            u({ redirect: e, resource: h, id: t, meta: { ...c, ...r } });
          }, 'redirect'),
          k = it({
            resource: m,
            id: f,
            queryOptions: { enabled: !C && void 0 !== f, ...e.queryOptions },
            liveMode: e.liveMode,
            onLiveEvent: e.onLiveEvent,
            liveParams: e.liveParams,
            meta: { ...P, ...e.queryMeta },
            dataProviderName: e.dataProviderName,
            overtimeOptions: { enabled: !1 },
          }),
          F = id({ mutationOptions: e.createMutationOptions, overtimeOptions: { enabled: !1 } }),
          _ = is({ mutationOptions: e.updateMutationOptions, overtimeOptions: { enabled: !1 } }),
          R = E ? _ : F,
          D = R.isLoading || k.isFetching,
          { elapsedTime: M } = a7({ ...e.overtimeOptions, isLoading: D });
        b.default.useEffect(
          () => () => {
            var t;
            null != (t = e.autoSave) &&
              t.invalidateOnUnmount &&
              v &&
              m &&
              'u' > typeof f &&
              i({
                id: f,
                invalidates: e.invalidates || ['list', 'many', 'detail'],
                dataProviderName: e.dataProviderName,
                resource: m,
              });
          },
          [null == (r = e.autoSave) ? void 0 : r.invalidateOnUnmount, v],
        );
        let N = nw(async (t, { isAutosave: r = !1 } = {}) => {
            let n = 'pessimistic' === d;
            l(!1);
            let a = nw((e) => A(L, e), 'onSuccessRedirect');
            return new Promise((i, o) => {
              if (!h) return o(i5);
              if (w && !f) return o(i9);
              if (!t) return o(i7);
              if (r && !E) return o(oe);
              n || r || (a_(() => a()), i());
              let s = {
                  values: t,
                  resource: m ?? h.name,
                  meta: { ...P, ...e.mutationMeta },
                  metaData: { ...P, ...e.mutationMeta },
                  dataProviderName: e.dataProviderName,
                  invalidates: r ? [] : e.invalidates,
                  successNotification: !r && e.successNotification,
                  errorNotification: !r && e.errorNotification,
                  ...(E
                    ? {
                        id: f ?? '',
                        mutationMode: d,
                        undoableTimeout: e.undoableTimeout,
                        optimisticUpdateMap: e.optimisticUpdateMap,
                      }
                    : {}),
                },
                { mutateAsync: l } = E ? _ : F;
              l(s, {
                onSuccess: e.onMutationSuccess
                  ? (n, a, i) => {
                      var o;
                      null == (o = e.onMutationSuccess) || o.call(e, n, t, i, r);
                    }
                  : void 0,
                onError: e.onMutationError
                  ? (n, a, i) => {
                      var o;
                      null == (o = e.onMutationError) || o.call(e, n, t, i, r);
                    }
                  : void 0,
              })
                .then((e) => {
                  (n &&
                    !r &&
                    a_(() => {
                      var t;
                      return a(null == (t = null == e ? void 0 : e.data) ? void 0 : t.id);
                    }),
                    r && g(!0),
                    i(e));
                })
                .catch(o);
            });
          }, 'onFinish'),
          T = aR(
            (e) => N(e, { isAutosave: !0 }),
            (null == (n = e.autoSave) ? void 0 : n.debounce) || 1e3,
            'Cancelled by debounce',
          );
        return {
          onFinish: N,
          onFinishAutoSave: T,
          formLoading: D,
          mutationResult: R,
          mutation: R,
          queryResult: k,
          query: k,
          autoSaveProps: { status: _.status, data: _.data, error: _.error },
          id: f,
          setId: p,
          redirect: A,
          overtime: { elapsedTime: M },
        };
      }, 'useForm'),
      i5 = Error('[useForm]: `resource` is not defined or not matched but is required'),
      i9 = Error('[useForm]: `id` is not defined but is required in edit and clone actions'),
      i7 = Error('[useForm]: `values` is not provided but is required'),
      oe = Error('[useForm]: `autoSave` is only allowed in edit action'),
      ot = nw(
        (e, t, r) => `[useForm]: action: "${e}", resource: "${t}", id: ${r}

If you don't use the \`setId\` method to set the \`id\`, you should pass the \`id\` prop to \`useForm\`. Otherwise, \`useForm\` will not be able to infer the \`id\` from the current URL with custom resource provided.

See https://refine.dev/docs/data/hooks/use-form/#id-`,
        'idWarningMessage',
      ),
      or = nw(() => {
        let { show: e, edit: t, list: r, create: n } = os();
        return (0, b.useCallback)(({ redirect: a, resource: i, id: o, meta: s = {} }) => {
          if (a && i)
            return i.show && 'show' === a && o
              ? e(i, o, void 0, s)
              : i.edit && 'edit' === a && o
                ? t(i, o, void 0, s)
                : i.create && 'create' === a
                  ? n(i, void 0, s)
                  : r(i, 'push', s);
        }, []);
      }, 'useRedirectionAfterSubmission'),
      on = nw(() => {
        let e = (0, b.useContext)(ij);
        return b.default.useMemo(
          () => (null == e ? void 0 : e.back) ?? (() => () => {}),
          [null == e ? void 0 : e.back],
        )();
      }, 'useBack'),
      oa = nw(() => {
        let e = iN(),
          { resource: t, resources: r } = iU(),
          n = iq();
        return b.default.useCallback(
          ({ resource: a, action: i, meta: o }) => {
            var s;
            let l = a || t;
            if (!l) return;
            let u =
              null == (s = n4(l, r, 'legacy' === e).find((e) => e.action === i)) ? void 0 : s.route;
            return u ? ah(u, null == l ? void 0 : l.meta, n, o) : void 0;
          },
          [r, t, n],
        );
      }, 'useGetToPath'),
      oi = nw(() => {
        let e = (0, b.useContext)(ij),
          { select: t } = iU(),
          r = oa(),
          n = b.default.useMemo(
            () => (null == e ? void 0 : e.go) ?? (() => () => {}),
            [null == e ? void 0 : e.go],
          )();
        return (0, b.useCallback)(
          (e) => {
            if ('object' != typeof e.to) return n({ ...e, to: e.to });
            let { resource: a } = t(e.to.resource);
            oo(e.to, a);
            let i = r({ resource: a, action: e.to.action, meta: { id: e.to.id, ...e.to.meta } });
            return n({ ...e, to: i });
          },
          [t, n],
        );
      }, 'useGo'),
      oo = nw((e, t) => {
        if (!(null != e && e.action) || !(null != e && e.resource))
          throw Error('[useGo]: "action" or "resource" is required.');
        if (['edit', 'show', 'clone'].includes(null == e ? void 0 : e.action) && !e.id)
          throw Error(
            `[useGo]: [action: ${e.action}] requires an "id" for resource [resource: ${e.resource}]`,
          );
        if (!t[e.action])
          throw Error(
            `[useGo]: [action: ${e.action}] is not defined for [resource: ${e.resource}]`,
          );
      }, 'handleResourceErrors'),
      os = nw(() => {
        let { resources: e } = iU(),
          t = iN(),
          { useHistory: r } = og(),
          n = r(),
          a = iq(),
          i = oi(),
          o = on(),
          s = nw((e, r = 'push') => {
            'legacy' === t ? n[r](e) : i({ to: e, type: r });
          }, 'handleUrl'),
          l = nw((r, n = {}) => {
            var o;
            if ('legacy' === t) {
              let t = 'string' == typeof r ? (ao(r, e, !0) ?? { name: r, route: r }) : r,
                i = n4(t, e, !0).find((e) => 'create' === e.action);
              return i ? ah(i.route, null == t ? void 0 : t.meta, a, n) : '';
            }
            let s = 'string' == typeof r ? (ao(r, e) ?? { name: r }) : r,
              l = null == (o = n4(s, e).find((e) => 'create' === e.action)) ? void 0 : o.route;
            return l
              ? i({ to: ah(l, null == s ? void 0 : s.meta, a, n), type: 'path', query: n.query })
              : '';
          }, 'createUrl'),
          u = nw((r, n, o = {}) => {
            var s;
            let l = encodeURIComponent(n);
            if ('legacy' === t) {
              let t = 'string' == typeof r ? (ao(r, e, !0) ?? { name: r, route: r }) : r,
                n = n4(t, e, !0).find((e) => 'edit' === e.action);
              return n ? ah(n.route, null == t ? void 0 : t.meta, a, { ...o, id: l }) : '';
            }
            let u = 'string' == typeof r ? (ao(r, e) ?? { name: r }) : r,
              c = null == (s = n4(u, e).find((e) => 'edit' === e.action)) ? void 0 : s.route;
            return c
              ? i({
                  to: ah(c, null == u ? void 0 : u.meta, a, { ...o, id: l }),
                  type: 'path',
                  query: o.query,
                })
              : '';
          }, 'editUrl'),
          c = nw((r, n, o = {}) => {
            var s;
            let l = encodeURIComponent(n);
            if ('legacy' === t) {
              let t = 'string' == typeof r ? (ao(r, e, !0) ?? { name: r, route: r }) : r,
                n = n4(t, e, !0).find((e) => 'clone' === e.action);
              return n ? ah(n.route, null == t ? void 0 : t.meta, a, { ...o, id: l }) : '';
            }
            let u = 'string' == typeof r ? (ao(r, e) ?? { name: r }) : r,
              c = null == (s = n4(u, e).find((e) => 'clone' === e.action)) ? void 0 : s.route;
            return c
              ? i({
                  to: ah(c, null == u ? void 0 : u.meta, a, { ...o, id: l }),
                  type: 'path',
                  query: o.query,
                })
              : '';
          }, 'cloneUrl'),
          d = nw((r, n, o = {}) => {
            var s;
            let l = encodeURIComponent(n);
            if ('legacy' === t) {
              let t = 'string' == typeof r ? (ao(r, e, !0) ?? { name: r, route: r }) : r,
                n = n4(t, e, !0).find((e) => 'show' === e.action);
              return n ? ah(n.route, null == t ? void 0 : t.meta, a, { ...o, id: l }) : '';
            }
            let u = 'string' == typeof r ? (ao(r, e) ?? { name: r }) : r,
              c = null == (s = n4(u, e).find((e) => 'show' === e.action)) ? void 0 : s.route;
            return c
              ? i({
                  to: ah(c, null == u ? void 0 : u.meta, a, { ...o, id: l }),
                  type: 'path',
                  query: o.query,
                })
              : '';
          }, 'showUrl'),
          f = nw((r, n = {}) => {
            var o;
            if ('legacy' === t) {
              let t = 'string' == typeof r ? (ao(r, e, !0) ?? { name: r, route: r }) : r,
                i = n4(t, e, !0).find((e) => 'list' === e.action);
              return i ? ah(i.route, null == t ? void 0 : t.meta, a, n) : '';
            }
            let s = 'string' == typeof r ? (ao(r, e) ?? { name: r }) : r,
              l = null == (o = n4(s, e).find((e) => 'list' === e.action)) ? void 0 : o.route;
            return l
              ? i({ to: ah(l, null == s ? void 0 : s.meta, a, n), type: 'path', query: n.query })
              : '';
          }, 'listUrl');
        return {
          create: nw((e, t = 'push', r = {}) => {
            s(l(e, r), t);
          }, 'create'),
          createUrl: l,
          edit: nw((e, t, r = 'push', n = {}) => {
            s(u(e, t, n), r);
          }, 'edit'),
          editUrl: u,
          clone: nw((e, t, r = 'push', n = {}) => {
            s(c(e, t, n), r);
          }, 'clone'),
          cloneUrl: c,
          show: nw((e, t, r = 'push', n = {}) => {
            s(d(e, t, n), r);
          }, 'show'),
          showUrl: d,
          list: nw((e, t = 'push', r = {}) => {
            s(f(e, r), t);
          }, 'list'),
          listUrl: f,
          push: nw((e, ...r) => {
            'legacy' === t ? n.push(e, ...r) : i({ to: e, type: 'push' });
          }, 'push'),
          replace: nw((e, ...r) => {
            'legacy' === t ? n.replace(e, ...r) : i({ to: e, type: 'replace' });
          }, 'replace'),
          goBack: nw(() => {
            'legacy' === t ? n.goBack() : o();
          }, 'goBack'),
        };
      }, 'useNavigation'),
      ol = nw(
        ({
          resource: e,
          id: t,
          meta: r,
          metaData: n,
          queryOptions: a,
          overtimeOptions: i,
          ...o
        } = {}) => {
          let { resource: s, identifier: l, id: u, setId: c } = oK({ id: t, resource: e }),
            d = oI()({ resource: s, meta: nW(r, n) });
          (0, tO.default)(!!e && !u, ou(l, u));
          let f = it({
            resource: l,
            id: u ?? '',
            queryOptions: { enabled: void 0 !== u, ...a },
            meta: d,
            metaData: d,
            overtimeOptions: i,
            ...o,
          });
          return { queryResult: f, query: f, showId: u, setShowId: c, overtime: f.overtime };
        },
        'useShow',
      ),
      ou = nw(
        (e, t) => `[useShow]: resource: "${e}", id: ${t} 

If you don't use the \`setShowId\` method to set the \`showId\`, you should pass the \`id\` prop to \`useShow\`. Otherwise, \`useShow\` will not be able to infer the \`id\` from the current URL. 

See https://refine.dev/docs/data/hooks/use-show/#resource`,
        'idWarningMessage',
      );
    nw(
      ({
        resourceName: e,
        resource: t,
        mapData: r = nw((e) => e, 'mapData'),
        paparseOptions: n,
        batchSize: a = Number.MAX_SAFE_INTEGER,
        onFinish: i,
        meta: o,
        metaData: s,
        onProgress: l,
        dataProviderName: u,
      } = {}) => {
        let [c, d] = (0, b.useState)(0),
          [f, p] = (0, b.useState)(0),
          [h, m] = (0, b.useState)(!1),
          { resource: y, identifier: v } = iU(t ?? e),
          g = oI(),
          E = iy(),
          w = id(),
          C = g({ resource: y, meta: nW(o, s) }),
          P;
        P = 1 === a ? w : E;
        let S = nw(() => {
            (p(0), d(0), m(!1));
          }, 'handleCleanup'),
          O = nw((e) => {
            let t = {
              succeeded: e.filter((e) => 'success' === e.type),
              errored: e.filter((e) => 'error' === e.type),
            };
            (null == i || i(t), m(!1));
          }, 'handleFinish');
        (0, b.useEffect)(() => {
          null == l || l({ totalAmount: f, processedAmount: c });
        }, [f, c]);
        let x = nw(
          ({ file: e }) => (
            S(),
            new Promise((t) => {
              (m(!0),
                rH.default.parse(e, {
                  complete: async ({ data: e }) => {
                    let n = nk(e, r);
                    if ((p(n.length), 1 === a)) {
                      let e = n.map((e) =>
                        nw(
                          async () => ({
                            response: await w.mutateAsync({
                              resource: v ?? '',
                              values: e,
                              successNotification: !1,
                              errorNotification: !1,
                              dataProviderName: u,
                              meta: C,
                              metaData: C,
                            }),
                            value: e,
                          }),
                          'fn',
                        ),
                      );
                      t(
                        await ai(
                          e,
                          ({ response: e, value: t }) => (
                            d((e) => e + 1),
                            { response: [e.data], type: 'success', request: [t] }
                          ),
                          (e, t) => ({ response: [e], type: 'error', request: [n[t]] }),
                        ),
                      );
                    } else {
                      let e = r0(n, a),
                        r = e.map((e) =>
                          nw(
                            async () => ({
                              response: await E.mutateAsync({
                                resource: v ?? '',
                                values: e,
                                successNotification: !1,
                                errorNotification: !1,
                                dataProviderName: u,
                                meta: C,
                                metaData: C,
                              }),
                              value: e,
                              currentBatchLength: e.length,
                            }),
                            'fn',
                          ),
                        );
                      t(
                        await ai(
                          r,
                          ({ response: e, currentBatchLength: t, value: r }) => (
                            d((e) => e + t),
                            { response: e.data, type: 'success', request: r }
                          ),
                          (t, r) => ({ response: [t], type: 'error', request: e[r] }),
                        ),
                      );
                    }
                  },
                  ...n,
                }));
            }).then((e) => (O(e), e))
          ),
          'handleChange',
        );
        return {
          inputProps: {
            type: 'file',
            accept: '.csv',
            onChange: (e) => {
              e.target.files && e.target.files.length > 0 && x({ file: e.target.files[0] });
            },
          },
          mutationResult: P,
          isLoading: h,
          handleChange: x,
        };
      },
      'useImport',
    );
    var oc = nw(({ defaultVisible: e = !1 } = {}) => {
        let [t, r] = (0, b.useState)(e),
          n = (0, b.useCallback)(() => r(!0), [t]),
          a = (0, b.useCallback)(() => r(!1), [t]);
        return { visible: t, show: n, close: a };
      }, 'useModal'),
      od = nw(
        ({ resource: e, action: t, meta: r, legacy: n }) =>
          oa()({ resource: e, action: t, meta: r, legacy: n }),
        'useToPath',
      ),
      of = nw((e, t) => {
        let r = (0, b.useContext)(ij),
          n = null == r ? void 0 : r.Link,
          a = oi(),
          i = '';
        return (
          'go' in e &&
            ((null != r && r.go) ||
              (0, tO.default)(
                !0,
                '[Link]: `routerProvider` is not found. To use `go`, Please make sure that you have provided the `routerProvider` for `<Refine />` https://refine.dev/docs/routing/router-provider/ \n',
              ),
            (i = a({ ...e.go, type: 'path' }))),
          'to' in e && (i = e.to),
          n
            ? b.default.createElement(n, { ref: t, ...e, to: i, go: void 0 })
            : b.default.createElement('a', { ref: t, href: i, ...e, to: void 0, go: void 0 })
        );
      }, 'LinkComponent'),
      op = (0, b.forwardRef)(of),
      oh = nw(() => op, 'useLink'),
      om = {
        useHistory: () => !1,
        useLocation: () => !1,
        useParams: () => ({}),
        Prompt: () => null,
        Link: () => null,
      },
      oy = b.default.createContext(om),
      ov = nw(
        ({
          children: e,
          useHistory: t,
          useLocation: r,
          useParams: n,
          Prompt: a,
          Link: i,
          routes: o,
        }) =>
          b.default.createElement(
            oy.Provider,
            {
              value: {
                useHistory: t ?? om.useHistory,
                useLocation: r ?? om.useLocation,
                useParams: n ?? om.useParams,
                Prompt: a ?? om.Prompt,
                Link: i ?? om.Link,
                routes: o ?? om.routes,
              },
            },
            e,
          ),
        'LegacyRouterContextProvider',
      ),
      og = nw(() => {
        let {
          useHistory: e,
          useLocation: t,
          useParams: r,
          Prompt: n,
          Link: a,
          routes: i,
        } = (0, b.useContext)(oy) ?? om;
        return { useHistory: e, useLocation: t, useParams: r, Prompt: n, Link: a, routes: i };
      }, 'useRouterContext'),
      ob = b.default.createContext({
        options: { buttons: { enableAccessControl: !0, hideIfUnauthorized: !1 } },
      }),
      oE = nw(
        ({ can: e, children: t, options: r }) =>
          b.default.createElement(
            ob.Provider,
            {
              value: {
                can: e,
                options: r
                  ? {
                      ...r,
                      buttons: { enableAccessControl: !0, hideIfUnauthorized: !1, ...r.buttons },
                    }
                  : {
                      buttons: { enableAccessControl: !0, hideIfUnauthorized: !1 },
                      queryOptions: void 0,
                    },
              },
            },
            t,
          ),
        'AccessControlContextProvider',
      ),
      ow = nw((e) => {
        if (!e) return;
        let {
            icon: t,
            list: r,
            edit: n,
            create: a,
            show: i,
            clone: o,
            children: s,
            meta: l,
            options: u,
            ...c
          } = e,
          { icon: d, ...f } = l ?? {},
          { icon: p, ...h } = u ?? {};
        return { ...c, ...(l ? { meta: f } : {}), ...(u ? { options: h } : {}) };
      }, 'sanitizeResource'),
      oC = nw(({ action: e, resource: t, params: r, queryOptions: n }) => {
        let { can: a, options: i } = (0, b.useContext)(ob),
          { keys: o, preferLegacyKeys: s } = aK(),
          { queryOptions: l } = i || {},
          u = { ...l, ...n },
          { resource: c, ...d } = r ?? {},
          f = ow(c),
          p = ef({
            queryKey: o()
              .access()
              .resource(t)
              .action(e)
              .params({ params: { ...d, resource: f }, enabled: null == u ? void 0 : u.enabled })
              .get(s),
            queryFn: () =>
              (null == a ? void 0 : a({ action: e, resource: t, params: { ...d, resource: f } })) ??
              Promise.resolve({ can: !0 }),
            enabled: 'u' > typeof a,
            ...u,
            meta: {
              ...(null == u ? void 0 : u.meta),
              ...w('useCan', s, t, ['useButtonCanAccess', 'useNavigationButton']),
            },
            retry: !1,
          });
        return typeof a > 'u' ? { data: { can: !0 } } : p;
      }, 'useCan'),
      oP = nw(() => {
        let { can: e } = b.default.useContext(ob);
        return {
          can: b.default.useMemo(
            () =>
              e
                ? nw(async ({ params: t, ...r }) => {
                    let n = null != t && t.resource ? ow(t.resource) : void 0;
                    return e({ ...r, ...(t ? { params: { ...t, resource: n } } : {}) });
                  }, 'canWithSanitizedResource')
                : void 0,
            [e],
          ),
        };
      }, 'useCanWithoutCache'),
      oS = nw((e) => {
        let [t, r] = (0, b.useState)([]),
          [n, a] = (0, b.useState)([]),
          [i, o] = (0, b.useState)([]),
          {
            resource: s,
            sort: l,
            sorters: u,
            filters: c = [],
            optionLabel: d = 'title',
            optionValue: f = 'id',
            searchField: p = 'string' == typeof d ? d : 'title',
            debounce: h = 300,
            successNotification: m,
            errorNotification: y,
            defaultValueQueryOptions: v,
            queryOptions: g,
            fetchSize: E,
            pagination: w,
            hasPagination: C = !1,
            liveMode: P,
            defaultValue: S = [],
            selectedOptionsOrder: O = 'in-place',
            onLiveEvent: x,
            onSearch: L,
            liveParams: A,
            meta: k,
            metaData: F,
            dataProviderName: _,
            overtimeOptions: R,
          } = e,
          D = (0, b.useCallback)((e) => ('string' == typeof d ? no(e, d) : d(e)), [d]),
          M = (0, b.useCallback)((e) => ('string' == typeof f ? no(e, f) : f(e)), [f]),
          { resource: N, identifier: T } = iU(s),
          j = oI()({ resource: N, meta: nW(k, F) }),
          I = Array.isArray(S) ? S : [S],
          $ = (0, b.useCallback)(
            (e) => {
              o(e.data.map((e) => ({ label: D(e), value: M(e) })));
            },
            [d, f],
          ),
          q = v ?? g,
          U = ir({
            resource: T,
            ids: I,
            queryOptions: {
              ...q,
              enabled: I.length > 0 && ((null == q ? void 0 : q.enabled) ?? !0),
              onSuccess: (e) => {
                var t;
                ($(e), null == (t = null == q ? void 0 : q.onSuccess) || t.call(q, e));
              },
            },
            overtimeOptions: { enabled: !1 },
            meta: j,
            metaData: j,
            liveMode: 'off',
            dataProviderName: _,
          }),
          K = (0, b.useCallback)(
            (e) => {
              a(e.data.map((e) => ({ label: D(e), value: M(e) })));
            },
            [d, f],
          ),
          Q = ie({
            resource: T,
            sorters: nW(u, l),
            filters: c.concat(t),
            pagination: {
              current: null == w ? void 0 : w.current,
              pageSize: (null == w ? void 0 : w.pageSize) ?? E,
              mode: null == w ? void 0 : w.mode,
            },
            hasPagination: C,
            queryOptions: {
              ...g,
              onSuccess: (e) => {
                var t;
                (K(e), null == (t = null == g ? void 0 : g.onSuccess) || t.call(g, e));
              },
            },
            overtimeOptions: { enabled: !1 },
            successNotification: m,
            errorNotification: y,
            meta: j,
            metaData: j,
            liveMode: P,
            liveParams: A,
            onLiveEvent: x,
            dataProviderName: _,
          }),
          { elapsedTime: z } = a7({ ...R, isLoading: Q.isFetching || U.isFetching }),
          B = (0, b.useMemo)(() => {
            var e;
            return (e = 'in-place' === O ? [...n, ...i] : [...i, ...n]) && e.length
              ? tC(e, nm('value', 2))
              : [];
          }, [n, i]),
          W = (0, b.useRef)(L),
          H = (0, b.useMemo)(
            () =>
              tH((e) => {
                W.current
                  ? r(W.current(e))
                  : e
                    ? r([{ field: p, operator: 'contains', value: e }])
                    : r([]);
              }, h),
            [p, h],
          );
        return (
          (0, b.useEffect)(() => {
            W.current = L;
          }, [L]),
          {
            queryResult: Q,
            defaultValueQueryResult: U,
            query: Q,
            defaultValueQuery: U,
            options: B,
            onSearch: H,
            overtime: { elapsedTime: z },
          }
        );
      }, 'useSelect'),
      oO = [],
      ox = [];
    function oL({
      initialCurrent: e,
      initialPageSize: t,
      hasPagination: r = !0,
      pagination: n,
      initialSorter: a,
      permanentSorter: i = ox,
      defaultSetFilterBehavior: o,
      initialFilter: s,
      permanentFilter: l = oO,
      filters: u,
      sorters: c,
      syncWithLocation: d,
      resource: f,
      successNotification: p,
      errorNotification: h,
      queryOptions: m,
      liveMode: y,
      onLiveEvent: v,
      liveParams: g,
      meta: E,
      metaData: w,
      dataProviderName: C,
      overtimeOptions: P,
    } = {}) {
      var S, O, x, L, A;
      let { syncWithLocation: k } = aP(),
        F = d ?? k,
        _ = iz(y),
        R = iN(),
        { useLocation: D } = og(),
        { search: M, pathname: N } = D(),
        T = oI(),
        j = iq(),
        I = 'server' === ((null == u ? void 0 : u.mode) || 'server'),
        $ = 'server' === ((null == c ? void 0 : c.mode) || 'server'),
        q = !1 === r ? 'off' : 'server',
        U = ((null == n ? void 0 : n.mode) ?? q) !== 'off',
        K = nW(null == n ? void 0 : n.current, e),
        Q = nW(null == n ? void 0 : n.pageSize, t),
        z = nW(E, w),
        { parsedCurrent: B, parsedPageSize: W, parsedSorter: H, parsedFilters: G } = aM(M ?? '?'),
        V = nW(null == u ? void 0 : u.initial, s),
        Z = nW(null == u ? void 0 : u.permanent, l) ?? oO,
        Y = nW(null == c ? void 0 : c.initial, a),
        J = nW(null == c ? void 0 : c.permanent, i) ?? ox,
        X = nW(null == u ? void 0 : u.defaultBehavior, o) ?? 'merge',
        ee,
        et,
        er,
        en;
      F
        ? ((ee = (null == (S = null == j ? void 0 : j.params) ? void 0 : S.current) || B || K || 1),
          (et =
            (null == (O = null == j ? void 0 : j.params) ? void 0 : O.pageSize) || W || Q || 10),
          (er =
            (null == (x = null == j ? void 0 : j.params) ? void 0 : x.sorters) ||
            (H.length ? H : Y)),
          (en =
            (null == (L = null == j ? void 0 : j.params) ? void 0 : L.filters) ||
            (G.length ? G : V)))
        : ((ee = K || 1), (et = Q || 10), (er = Y), (en = V));
      let { replace: ea } = os(),
        ei = oi(),
        { resource: eo, identifier: es } = iU(f),
        el = T({ resource: eo, meta: z });
      b.default.useEffect(() => {
        (0, tO.default)(typeof es > 'u', 'useTable: `resource` is not defined.');
      }, [es]);
      let [eu, ec] = (0, b.useState)(aU(J, er ?? [])),
        [ed, ef] = (0, b.useState)(aq(Z, en ?? [])),
        [ep, eh] = (0, b.useState)(ee),
        [em, ey] = (0, b.useState)(et),
        ev = nw(() => {
          if ('new' === R) {
            let {
              sorters: e,
              filters: t,
              pageSize: r,
              current: n,
              ...a
            } = (null == j ? void 0 : j.params) ?? {};
            return a;
          }
          let {
            sorter: e,
            filters: t,
            pageSize: r,
            current: n,
            ...a
          } = tS.default.parse(M, { ignoreQueryPrefix: !0 });
          return a;
        }, 'getCurrentQueryParams'),
        eg = nw(({ pagination: { current: e, pageSize: t }, sorter: r, filters: n }) => {
          if ('new' === R)
            return (
              ei({
                type: 'path',
                options: { keepHash: !0, keepQuery: !0 },
                query: {
                  ...(U ? { current: e, pageSize: t } : {}),
                  sorters: r,
                  filters: n,
                  ...ev(),
                },
              }) ?? ''
            );
          let a = aN({
            pagination: { pageSize: t, current: e },
            sorters: eu ?? r,
            filters: n,
            ...tS.default.parse(null == M ? void 0 : M.substring(1)),
          });
          return `${N ?? ''}?${a ?? ''}`;
        }, 'createLinkForSyncWithLocation');
      ((0, b.useEffect)(() => {
        '' === M && (eh(ee), ey(et), ec(aU(J, er ?? [])), ef(aq(Z, en ?? [])));
      }, [M]),
        (0, b.useEffect)(() => {
          if (F) {
            let e = ev();
            if ('new' === R)
              ei({
                type: 'replace',
                options: { keepQuery: !0 },
                query: {
                  ...(U ? { pageSize: em, current: ep } : {}),
                  sorters: tg(eu, J, rW),
                  filters: tg(ed, Z, rW),
                },
              });
            else {
              let t = aN({
                ...(U ? { pagination: { pageSize: em, current: ep } } : {}),
                sorters: tg(eu, J, rW),
                filters: tg(ed, Z, rW),
                ...e,
              });
              return null == ea ? void 0 : ea(`${N}?${t}`, void 0, { shallow: !0 });
            }
          }
        }, [F, ep, em, eu, ed]));
      let eb = ie({
          resource: es,
          hasPagination: r,
          pagination: { current: ep, pageSize: em, mode: null == n ? void 0 : n.mode },
          filters: I ? aI(Z, ed) : void 0,
          sorters: $ ? a$(J, eu) : void 0,
          queryOptions: m,
          overtimeOptions: P,
          successNotification: p,
          errorNotification: h,
          meta: el,
          metaData: el,
          liveMode: _,
          liveParams: g,
          onLiveEvent: v,
          dataProviderName: C,
        }),
        eE = (0, b.useCallback)(
          (e) => {
            ef((t) => aI(Z, e, t));
          },
          [Z],
        ),
        ew = (0, b.useCallback)(
          (e) => {
            ef(aI(Z, e));
          },
          [Z],
        ),
        eC = (0, b.useCallback)(
          (e) => {
            ef((t) => aI(Z, e(t)));
          },
          [Z],
        ),
        eP = (0, b.useCallback)(
          (e, t = X) => {
            'function' == typeof e ? eC(e) : 'replace' === t ? ew(e) : eE(e);
          },
          [eC, ew, eE],
        ),
        eS = (0, b.useCallback)(
          (e) => {
            ec(() => a$(J, e));
          },
          [J],
        );
      return {
        tableQueryResult: eb,
        tableQuery: eb,
        sorters: eu,
        setSorters: eS,
        sorter: eu,
        setSorter: eS,
        filters: ed,
        setFilters: eP,
        current: ep,
        setCurrent: eh,
        pageSize: em,
        setPageSize: ey,
        pageCount: em ? Math.ceil(((null == (A = eb.data) ? void 0 : A.total) ?? 0) / em) : 1,
        createLinkForSyncWithLocation: eg,
        overtime: eb.overtime,
      };
    }
    nw(oL, 'useTable');
    var oA = b.default.createContext({}),
      ok = nw(
        ({ create: e, get: t, update: r, children: n }) =>
          b.default.createElement(oA.Provider, { value: { create: e, get: t, update: r } }, n),
        'AuditLogContextProvider',
      ),
      oF = nw(({ logMutationOptions: e, renameMutationOptions: t } = {}) => {
        let r = es(),
          n = (0, b.useContext)(oA),
          { keys: a, preferLegacyKeys: i } = aK(),
          o = am(),
          { resources: s } = (0, b.useContext)(i_),
          {
            data: l,
            refetch: u,
            isLoading: c,
          } = aQ({
            v3LegacyAuthProviderCompatible: !!(null != o && o.isLegacy),
            queryOptions: { enabled: !!(null != n && n.create) },
          });
        return {
          log: tX(
            async (e) => {
              var t, r, a, i, o;
              let d,
                f = ao(e.resource, s),
                p = nW(
                  null == (t = null == f ? void 0 : f.meta) ? void 0 : t.audit,
                  null == (r = null == f ? void 0 : f.options) ? void 0 : r.audit,
                  null == (i = null == (a = null == f ? void 0 : f.options) ? void 0 : a.auditLog)
                    ? void 0
                    : i.permissions,
                );
              if (!p || nG(p, e.action))
                return (
                  c && null != n && n.create && (d = await u()),
                  await (null == (o = n.create)
                    ? void 0
                    : o.call(n, { ...e, author: l ?? (null == d ? void 0 : d.data) }))
                );
            },
            {
              mutationKey: a().audit().action('log').get(),
              ...e,
              meta: { ...(null == e ? void 0 : e.meta), ...w('useLog', i) },
            },
          ),
          rename: tX(
            async (e) => {
              var t;
              return await (null == (t = n.update) ? void 0 : t.call(n, e));
            },
            {
              onSuccess: (e) => {
                null != e &&
                  e.resource &&
                  r.invalidateQueries(
                    a()
                      .audit()
                      .resource((null == e ? void 0 : e.resource) ?? '')
                      .action('list')
                      .get(i),
                  );
              },
              mutationKey: a().audit().action('rename').get(),
              ...t,
              meta: { ...(null == t ? void 0 : t.meta), ...w('useLog', i) },
            },
          ),
        };
      }, 'useLog');
    nw(({ resource: e, action: t, meta: r, author: n, metaData: a, queryOptions: i }) => {
      let { get: o } = (0, b.useContext)(oA),
        { keys: s, preferLegacyKeys: l } = aK();
      return ef({
        queryKey: s().audit().resource(e).action('list').params(r).get(l),
        queryFn: () =>
          (null == o ? void 0 : o({ resource: e, action: t, author: n, meta: r, metaData: a })) ??
          Promise.resolve([]),
        enabled: 'u' > typeof o,
        ...i,
        retry: !1,
        meta: { ...(null == i ? void 0 : i.meta), ...w('useLogList', l, e) },
      });
    }, 'useLogList');
    var o_ = nw(({ meta: e = {} } = {}) => {
        let t = iN(),
          { i18nProvider: r } = (0, b.useContext)(i1),
          n = iq(),
          a = i3(),
          { resources: i, resource: o, action: s } = iU(),
          {
            options: { textTransformers: l },
          } = aO(),
          u = [];
        if (!(null != o && o.name)) return { breadcrumbs: u };
        let c = nw((r) => {
          var o, s, d, f, p, h;
          let m = 'string' == typeof r ? (ao(r, i, 'legacy' === t) ?? { name: r }) : r;
          if (m) {
            let r = nW(
              null == (o = null == m ? void 0 : m.meta) ? void 0 : o.parent,
              null == m ? void 0 : m.parentName,
            );
            r && c(r);
            let y = n4(m, i, 'legacy' === t).find((e) => 'list' === e.action),
              v =
                null != (s = null == y ? void 0 : y.resource) && s.list
                  ? null == y
                    ? void 0
                    : y.route
                  : void 0,
              g = v ? ('legacy' === t ? v : ah(v, null == m ? void 0 : m.meta, n, e)) : void 0;
            u.push({
              label:
                nW(
                  null == (d = m.meta) ? void 0 : d.label,
                  null == (f = m.options) ? void 0 : f.label,
                ) ?? a(`${m.name}.${m.name}`, l.humanize(m.name)),
              href: g,
              icon: nW(
                null == (p = m.meta) ? void 0 : p.icon,
                null == (h = m.options) ? void 0 : h.icon,
                m.icon,
              ),
            });
          }
        }, 'addBreadcrumb');
        if ((c(o), s && 'list' !== s)) {
          let e = `actions.${s}`,
            t = a(e);
          'u' > typeof r && t === e
            ? ((0, tO.default)(
                !0,
                `[useBreadcrumb]: Breadcrumb missing translate key for the "${s}" action. Please add "actions.${s}" key to your translation file.
For more information, see https://refine.dev/docs/api-reference/core/hooks/useBreadcrumb/#i18n-support`,
              ),
              u.push({ label: a(`buttons.${s}`, l.humanize(s)) }))
            : u.push({ label: a(e, l.humanize(s)) });
        }
        return { breadcrumbs: u };
      }, 'useBreadcrumb'),
      oR = nw((e, t, r = !1) => {
        let n = [],
          a = n1(e, t);
        for (; a; ) (n.push(a), (a = n1(a, t)));
        return (
          n.reverse(),
          `/${[...n, e]
            .map((e) => nJ((r ? e.route : void 0) ?? e.identifier ?? e.name))
            .join('/')
            .replace(/^\//, '')}`
        );
      }, 'createResourceKey'),
      oD = nw((e, t = !1) => {
        let r = { item: { name: '__root__' }, children: {} };
        e.forEach((n) => {
          let a = [],
            i = n1(n, e);
          for (; i; ) (a.push(i), (i = n1(i, e)));
          a.reverse();
          let o = r;
          a.forEach((e) => {
            let r = (t ? e.route : void 0) ?? e.identifier ?? e.name;
            (o.children[r] || (o.children[r] = { item: e, children: {} }), (o = o.children[r]));
          });
          let s = (t ? n.route : void 0) ?? n.identifier ?? n.name;
          o.children[s] || (o.children[s] = { item: n, children: {} });
        });
        let n = nw((r) => {
          let a = [];
          return (
            Object.keys(r.children).forEach((i) => {
              let o = oR(r.children[i].item, e, t),
                s = { ...r.children[i].item, key: o, children: n(r.children[i]) };
              a.push(s);
            }),
            a
          );
        }, 'flatten');
        return n(r);
      }, 'createTree'),
      oM = nw(
        (e) =>
          e
            .split('?')[0]
            .split('#')[0]
            .replace(/(.+)(\/$)/, '$1'),
        'getCleanPath',
      ),
      oN = nw(({ meta: e, hideOnMissingParameter: t = !0 } = { hideOnMissingParameter: !0 }) => {
        let r = i3(),
          n = oa(),
          a = iN(),
          { resource: i, resources: o } = iU(),
          { pathname: s } = iq(),
          { useLocation: l } = og(),
          { pathname: u } = l(),
          c = ax(),
          d = `/${(('legacy' === a ? oM(u) : s ? oM(s) : void 0) ?? '').replace(/^\//, '')}`,
          f = i ? oR(i, o, 'legacy' === a) : (d ?? ''),
          p = b.default.useMemo(() => {
            if (!i) return [];
            let e = n1(i, o),
              t = [oR(i, o)];
            for (; e; ) (t.push(oR(e, o)), (e = n1(e, o)));
            return t;
          }, []),
          h = b.default.useCallback(
            (i) => {
              var o, s, l, u, d, f;
              if (
                nW(
                  null == (o = null == i ? void 0 : i.meta) ? void 0 : o.hide,
                  null == (s = null == i ? void 0 : i.options) ? void 0 : s.hide,
                ) ||
                (!(null != i && i.list) && 0 === i.children.length)
              )
                return;
              let p = i.list
                ? n({ resource: i, action: 'list', legacy: 'legacy' === a, meta: e })
                : void 0;
              if (!(t && p && p.match(/(\/|^):(.+?)(\/|$){1}/)))
                return {
                  ...i,
                  route: p,
                  icon: nW(
                    null == (l = i.meta) ? void 0 : l.icon,
                    null == (u = i.options) ? void 0 : u.icon,
                    i.icon,
                  ),
                  label:
                    nW(
                      null == (d = null == i ? void 0 : i.meta) ? void 0 : d.label,
                      null == (f = null == i ? void 0 : i.options) ? void 0 : f.label,
                    ) ?? r(`${i.name}.${i.name}`, c(i.name, 'plural')),
                };
            },
            [a, e, n, r, t],
          );
        return {
          defaultOpenKeys: p,
          selectedKey: f,
          menuItems: b.default.useMemo(() => {
            let e = oD(o, 'legacy' === a),
              t = nw(
                (e) =>
                  e.flatMap((e) => {
                    let r = t(e.children),
                      n = h({ ...e, children: r });
                    return n ? [n] : [];
                  }),
                'prepare',
              );
            return t(e);
          }, [o, a, h]),
        };
      }, 'useMenu'),
      oT = (0, b.createContext)({}),
      oj =
        (nw(({ children: e, value: t }) => {
          let r = oj(),
            n = (0, b.useMemo)(() => ({ ...r, ...t }), [r, t]);
          return b.default.createElement(oT.Provider, { value: n }, e);
        }, 'MetaContextProvider'),
        nw(() => {
          if (!(0, b.useContext)(oT))
            throw Error('useMetaContext must be used within a MetaContextProvider');
          return (0, b.useContext)(oT);
        }, 'useMetaContext')),
      oI = nw(() => {
        let { params: e } = iq(),
          t = oj();
        return nw(({ resource: r, meta: n } = {}) => {
          let { meta: a } = ow(r) ?? { meta: {} },
            { filters: i, sorters: o, current: s, pageSize: l, ...u } = e ?? {},
            c = { ...a, ...u, ...n };
          return (null != t && t.tenantId && (c.tenantId = t.tenantId), c);
        }, 'getMetaFn');
      }, 'useMeta'),
      o$ = nw(() => {
        let { options: e } = b.default.useContext(at);
        return e;
      }, 'useRefineOptions'),
      oq = nw((e) => {
        let t = iN(),
          { useParams: r } = og(),
          n = iq(),
          a = r(),
          i = 'legacy' === t ? a.id : n.id;
        return e ?? i;
      }, 'useId'),
      oU = nw((e) => {
        let t = iN(),
          { useParams: r } = og(),
          n = iq(),
          a = r(),
          i = 'legacy' === t ? a.action : n.action;
        return e ?? i;
      }, 'useAction');
    function oK(e) {
      let { select: t, identifier: r } = iU(),
        n = (null == e ? void 0 : e.resource) ?? r,
        { identifier: a, resource: i } = n ? t(n, !0) : {},
        o = r === a,
        s = oq(),
        l = oU(null == e ? void 0 : e.action),
        u = b.default.useMemo(
          () => (o ? ((null == e ? void 0 : e.id) ?? s) : null == e ? void 0 : e.id),
          [o, null == e ? void 0 : e.id, s],
        ),
        [c, d] = b.default.useState(u);
      b.default.useMemo(() => d(u), [u]);
      let f = b.default.useMemo(
        () => ((o || (null != e && e.action)) && ('edit' === l || 'clone' === l) ? l : 'create'),
        [l, o, null == e ? void 0 : e.action],
      );
      return { id: c, setId: d, resource: i, action: l, identifier: a, formAction: f };
    }
    function oQ({ type: e }) {
      let t = i3(),
        {
          textTransformers: { humanize: r },
        } = o$();
      return { label: t(`buttons.${e}`, r(e)) };
    }
    (nw(oK, 'useResourceParams'), nw(oQ, 'useActionableButton'));
    var oz = nw((e) => {
      var t, r, n;
      let a = i3(),
        i = b.default.useContext(ob),
        o =
          (null == (t = e.accessControl) ? void 0 : t.enabled) ??
          i.options.buttons.enableAccessControl,
        s =
          (null == (r = e.accessControl) ? void 0 : r.hideIfUnauthorized) ??
          i.options.buttons.hideIfUnauthorized,
        { data: l } = oC({
          resource: null == (n = e.resource) ? void 0 : n.name,
          action: 'clone' === e.action ? 'create' : e.action,
          params: { meta: e.meta, id: e.id, resource: e.resource },
          queryOptions: { enabled: o },
        });
      return {
        title: b.default.useMemo(
          () =>
            null != l && l.can
              ? ''
              : null != l && l.reason
                ? l.reason
                : a('buttons.notAccessTitle', "You don't have permission to access"),
          [null == l ? void 0 : l.can, null == l ? void 0 : l.reason, a],
        ),
        hidden: o && s && !(null != l && l.can),
        disabled: (null == l ? void 0 : l.can) === !1,
        canAccess: l,
      };
    }, 'useButtonCanAccess');
    function oB(e) {
      var t;
      let r = os(),
        n = iN(),
        a = oh(),
        { Link: i } = og(),
        o = i3(),
        s = ax(),
        {
          textTransformers: { humanize: l },
        } = o$(),
        {
          id: u,
          resource: c,
          identifier: d,
        } = oK({ resource: e.resource, id: 'create' === e.action ? void 0 : e.id }),
        {
          canAccess: f,
          title: p,
          hidden: h,
          disabled: m,
        } = oz({
          action: e.action,
          accessControl: e.accessControl,
          meta: e.meta,
          id: u,
          resource: c,
        });
      return {
        to: b.default.useMemo(() => {
          if (!c) return '';
          switch (e.action) {
            case 'create':
            case 'list':
              return r[`${e.action}Url`](c, e.meta);
            default:
              return u ? r[`${e.action}Url`](c, u, e.meta) : '';
          }
        }, [c, u, e.meta, r[`${e.action}Url`]]),
        label:
          'list' === e.action
            ? o(
                `${d ?? e.resource}.titles.list`,
                s(
                  (null == (t = null == c ? void 0 : c.meta) ? void 0 : t.label) ??
                    (null == c ? void 0 : c.label) ??
                    d ??
                    e.resource,
                  'plural',
                ),
              )
            : o(`buttons.${e.action}`, l(e.action)),
        title: p,
        disabled: m,
        hidden: h,
        canAccess: f,
        LinkComponent: 'legacy' === n ? i : a,
      };
    }
    (nw(oB, 'useNavigationButton'),
      nw(function (e) {
        let t = i3(),
          { mutate: r, isLoading: n, variables: a } = im(),
          { setWarnWhen: i } = aC(),
          { mutationMode: o } = ab(e.mutationMode),
          { id: s, resource: l, identifier: u } = oK({ resource: e.resource, id: e.id }),
          {
            title: c,
            disabled: d,
            hidden: f,
            canAccess: p,
          } = oz({ action: 'delete', accessControl: e.accessControl, id: s, resource: l }),
          h = t('buttons.delete', 'Delete'),
          m = t('buttons.delete', 'Delete'),
          y = t('buttons.confirm', 'Are you sure?'),
          v = t('buttons.cancel', 'Cancel');
        return {
          label: h,
          title: c,
          hidden: f,
          disabled: d,
          canAccess: p,
          loading: s === (null == a ? void 0 : a.id) && n,
          confirmOkLabel: m,
          cancelLabel: v,
          confirmTitle: y,
          onConfirm: nw(() => {
            s &&
              u &&
              (i(!1),
              r(
                {
                  id: s,
                  resource: u,
                  mutationMode: o,
                  successNotification: e.successNotification,
                  errorNotification: e.errorNotification,
                  meta: e.meta,
                  metaData: e.meta,
                  dataProviderName: e.dataProviderName,
                  invalidates: e.invalidates,
                },
                { onSuccess: e.onSuccess },
              ));
          }, 'onConfirm'),
        };
      }, 'useDeleteButton'),
      nw(function (e) {
        let t = i3(),
          { keys: r, preferLegacyKeys: n } = aK(),
          a = es(),
          i = iA(),
          { identifier: o, id: s } = oK({ resource: e.resource, id: e.id }),
          { resources: l } = iU(),
          u = !!a.isFetching({
            queryKey: r()
              .data(as(o, e.dataProviderName, l))
              .resource(o)
              .action('one')
              .get(n),
          });
        return {
          onClick: nw(() => {
            i({
              id: s,
              invalidates: ['detail'],
              dataProviderName: e.dataProviderName,
              resource: o,
            });
          }, 'onClick'),
          label: t('buttons.refresh', 'Refresh'),
          loading: u,
        };
      }, 'useRefreshButton'),
      nw((e) => oB({ ...e, action: 'show' }), 'useShowButton'),
      nw((e) => oB({ ...e, action: 'edit' }), 'useEditButton'),
      nw((e) => oB({ ...e, action: 'clone' }), 'useCloneButton'),
      nw((e) => oB({ ...e, action: 'create' }), 'useCreateButton'),
      nw((e) => oB({ ...e, action: 'list' }), 'useListButton'),
      nw(() => oQ({ type: 'save' }), 'useSaveButton'),
      nw(() => oQ({ type: 'export' }), 'useExportButton'),
      nw(() => oQ({ type: 'import' }), 'useImportButton'),
      nw(() => {
        let [e, t] = (0, b.useState)(),
          r = i3(),
          { push: n } = os(),
          a = oi(),
          i = iN(),
          { resource: o, action: s } = iU();
        return (
          (0, b.useEffect)(() => {
            o &&
              s &&
              t(
                r(
                  'pages.error.info',
                  { action: s, resource: o.name },
                  `You may have forgotten to add the "${s}" component to "${o.name}" resource.`,
                ),
              );
          }, [o, s]),
          b.default.createElement(
            b.default.Fragment,
            null,
            b.default.createElement(
              'h1',
              null,
              r('pages.error.404', void 0, 'Sorry, the page you visited does not exist.'),
            ),
            e && b.default.createElement('p', null, e),
            b.default.createElement(
              'button',
              {
                onClick: () => {
                  'legacy' === i ? n('/') : a({ to: '/' });
                },
              },
              r('pages.error.backHome', void 0, 'Back Home'),
            ),
          )
        );
      }, 'ErrorComponent'));
    var oW = nw(() => {
        let [e, t] = (0, b.useState)(''),
          [r, n] = (0, b.useState)(''),
          a = i3(),
          i = am(),
          { mutate: o } = aG({ v3LegacyAuthProviderCompatible: !!(null != i && i.isLegacy) });
        return b.default.createElement(
          b.default.Fragment,
          null,
          b.default.createElement('h1', null, a('pages.login.title', 'Sign in your account')),
          b.default.createElement(
            'form',
            {
              onSubmit: (t) => {
                (t.preventDefault(), o({ username: e, password: r }));
              },
            },
            b.default.createElement(
              'table',
              null,
              b.default.createElement(
                'tbody',
                null,
                b.default.createElement(
                  'tr',
                  null,
                  b.default.createElement(
                    'td',
                    null,
                    a('pages.login.username', void 0, 'username'),
                    ':',
                  ),
                  b.default.createElement(
                    'td',
                    null,
                    b.default.createElement('input', {
                      type: 'text',
                      size: 20,
                      autoCorrect: 'off',
                      spellCheck: !1,
                      autoCapitalize: 'off',
                      autoFocus: !0,
                      required: !0,
                      value: e,
                      onChange: (e) => t(e.target.value),
                    }),
                  ),
                ),
                b.default.createElement(
                  'tr',
                  null,
                  b.default.createElement(
                    'td',
                    null,
                    a('pages.login.password', void 0, 'password'),
                    ':',
                  ),
                  b.default.createElement(
                    'td',
                    null,
                    b.default.createElement('input', {
                      type: 'password',
                      required: !0,
                      size: 20,
                      value: r,
                      onChange: (e) => n(e.target.value),
                    }),
                  ),
                ),
              ),
            ),
            b.default.createElement('br', null),
            b.default.createElement('input', { type: 'submit', value: 'login' }),
          ),
        );
      }, 'LoginPage'),
      oH = nw(
        ({
          providers: e,
          registerLink: t,
          forgotPasswordLink: r,
          rememberMe: n,
          contentProps: a,
          wrapperProps: i,
          renderContent: o,
          formProps: s,
          title: l,
          hideForm: u,
          mutationVariables: c,
        }) => {
          let d = iN(),
            f = oh(),
            { Link: p } = og(),
            h = 'legacy' === d ? p : f,
            [m, y] = (0, b.useState)(''),
            [v, g] = (0, b.useState)(''),
            [E, w] = (0, b.useState)(!1),
            C = i3(),
            P = am(),
            { mutate: S } = aG({ v3LegacyAuthProviderCompatible: !!(null != P && P.isLegacy) }),
            O = nw((e, t) => b.default.createElement(h, { to: e }, t), 'renderLink'),
            x = nw(
              () =>
                e
                  ? e.map((e) =>
                      b.default.createElement(
                        'div',
                        {
                          key: e.name,
                          style: {
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '1rem',
                          },
                        },
                        b.default.createElement(
                          'button',
                          {
                            onClick: () => S({ ...c, providerName: e.name }),
                            style: { display: 'flex', alignItems: 'center' },
                          },
                          null == e ? void 0 : e.icon,
                          e.label ?? b.default.createElement('label', null, e.label),
                        ),
                      ),
                    )
                  : null,
              'renderProviders',
            ),
            L = b.default.createElement(
              'div',
              { ...a },
              b.default.createElement(
                'h1',
                { style: { textAlign: 'center' } },
                C('pages.login.title', 'Sign in to your account'),
              ),
              x(),
              !u &&
                b.default.createElement(
                  b.default.Fragment,
                  null,
                  b.default.createElement('hr', null),
                  b.default.createElement(
                    'form',
                    {
                      onSubmit: (e) => {
                        (e.preventDefault(), S({ ...c, email: m, password: v, remember: E }));
                      },
                      ...s,
                    },
                    b.default.createElement(
                      'div',
                      { style: { display: 'flex', flexDirection: 'column', padding: 25 } },
                      b.default.createElement(
                        'label',
                        { htmlFor: 'email-input' },
                        C('pages.login.fields.email', 'Email'),
                      ),
                      b.default.createElement('input', {
                        id: 'email-input',
                        name: 'email',
                        type: 'text',
                        size: 20,
                        autoCorrect: 'off',
                        spellCheck: !1,
                        autoCapitalize: 'off',
                        required: !0,
                        value: m,
                        onChange: (e) => y(e.target.value),
                      }),
                      b.default.createElement(
                        'label',
                        { htmlFor: 'password-input' },
                        C('pages.login.fields.password', 'Password'),
                      ),
                      b.default.createElement('input', {
                        id: 'password-input',
                        type: 'password',
                        name: 'password',
                        required: !0,
                        size: 20,
                        value: v,
                        onChange: (e) => g(e.target.value),
                      }),
                      n ??
                        b.default.createElement(
                          b.default.Fragment,
                          null,
                          b.default.createElement(
                            'label',
                            { htmlFor: 'remember-me-input' },
                            C('pages.login.buttons.rememberMe', 'Remember me'),
                            b.default.createElement('input', {
                              id: 'remember-me-input',
                              name: 'remember',
                              type: 'checkbox',
                              size: 20,
                              checked: E,
                              value: E.toString(),
                              onChange: () => {
                                w(!E);
                              },
                            }),
                          ),
                        ),
                      b.default.createElement('br', null),
                      r ??
                        O(
                          '/forgot-password',
                          C('pages.login.buttons.forgotPassword', 'Forgot password?'),
                        ),
                      b.default.createElement('input', {
                        type: 'submit',
                        value: C('pages.login.signin', 'Sign in'),
                      }),
                      t ??
                        b.default.createElement(
                          'span',
                          null,
                          C('pages.login.buttons.noAccount', 'Don’t have an account?'),
                          ' ',
                          O('/register', C('pages.login.register', 'Sign up')),
                        ),
                    ),
                  ),
                ),
              !1 !== t &&
                u &&
                b.default.createElement(
                  'div',
                  { style: { textAlign: 'center' } },
                  C('pages.login.buttons.noAccount', 'Don’t have an account?'),
                  ' ',
                  O('/register', C('pages.login.register', 'Sign up')),
                ),
            );
          return b.default.createElement('div', { ...i }, o ? o(L, l) : L);
        },
        'LoginPage',
      ),
      oG = nw(
        ({
          providers: e,
          loginLink: t,
          wrapperProps: r,
          contentProps: n,
          renderContent: a,
          formProps: i,
          title: o,
          hideForm: s,
          mutationVariables: l,
        }) => {
          let u = iN(),
            c = oh(),
            { Link: d } = og(),
            f = 'legacy' === u ? d : c,
            [p, h] = (0, b.useState)(''),
            [m, y] = (0, b.useState)(''),
            v = i3(),
            g = am(),
            { mutate: E, isLoading: w } = aY({
              v3LegacyAuthProviderCompatible: !!(null != g && g.isLegacy),
            }),
            C = nw((e, t) => b.default.createElement(f, { to: e }, t), 'renderLink'),
            P = nw(
              () =>
                e
                  ? e.map((e) =>
                      b.default.createElement(
                        'div',
                        {
                          key: e.name,
                          style: {
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '1rem',
                          },
                        },
                        b.default.createElement(
                          'button',
                          {
                            onClick: () => E({ ...l, providerName: e.name }),
                            style: { display: 'flex', alignItems: 'center' },
                          },
                          null == e ? void 0 : e.icon,
                          e.label ?? b.default.createElement('label', null, e.label),
                        ),
                      ),
                    )
                  : null,
              'renderProviders',
            ),
            S = b.default.createElement(
              'div',
              { ...n },
              b.default.createElement(
                'h1',
                { style: { textAlign: 'center' } },
                v('pages.register.title', 'Sign up for your account'),
              ),
              P(),
              !s &&
                b.default.createElement(
                  b.default.Fragment,
                  null,
                  b.default.createElement('hr', null),
                  b.default.createElement(
                    'form',
                    {
                      onSubmit: (e) => {
                        (e.preventDefault(), E({ ...l, email: p, password: m }));
                      },
                      ...i,
                    },
                    b.default.createElement(
                      'div',
                      { style: { display: 'flex', flexDirection: 'column', padding: 25 } },
                      b.default.createElement(
                        'label',
                        { htmlFor: 'email-input' },
                        v('pages.register.fields.email', 'Email'),
                      ),
                      b.default.createElement('input', {
                        id: 'email-input',
                        name: 'email',
                        type: 'email',
                        size: 20,
                        autoCorrect: 'off',
                        spellCheck: !1,
                        autoCapitalize: 'off',
                        required: !0,
                        value: p,
                        onChange: (e) => h(e.target.value),
                      }),
                      b.default.createElement(
                        'label',
                        { htmlFor: 'password-input' },
                        v('pages.register.fields.password', 'Password'),
                      ),
                      b.default.createElement('input', {
                        id: 'password-input',
                        name: 'password',
                        type: 'password',
                        required: !0,
                        size: 20,
                        value: m,
                        onChange: (e) => y(e.target.value),
                      }),
                      b.default.createElement('input', {
                        type: 'submit',
                        value: v('pages.register.buttons.submit', 'Sign up'),
                        disabled: w,
                      }),
                      t ??
                        b.default.createElement(
                          b.default.Fragment,
                          null,
                          b.default.createElement(
                            'span',
                            null,
                            v('pages.login.buttons.haveAccount', 'Have an account?'),
                            ' ',
                            C('/login', v('pages.login.signin', 'Sign in')),
                          ),
                        ),
                    ),
                  ),
                ),
              !1 !== t &&
                s &&
                b.default.createElement(
                  'div',
                  { style: { textAlign: 'center' } },
                  v('pages.login.buttons.haveAccount', 'Have an account?'),
                  ' ',
                  C('/login', v('pages.login.signin', 'Sign in')),
                ),
            );
          return b.default.createElement('div', { ...r }, a ? a(S, o) : S);
        },
        'RegisterPage',
      ),
      oV = nw(
        ({
          loginLink: e,
          wrapperProps: t,
          contentProps: r,
          renderContent: n,
          formProps: a,
          title: i,
          mutationVariables: o,
        }) => {
          let s = i3(),
            l = iN(),
            u = oh(),
            { Link: c } = og(),
            d = 'legacy' === l ? c : u,
            [f, p] = (0, b.useState)(''),
            { mutate: h, isLoading: m } = a0(),
            y = nw((e, t) => b.default.createElement(d, { to: e }, t), 'renderLink'),
            v = b.default.createElement(
              'div',
              { ...r },
              b.default.createElement(
                'h1',
                { style: { textAlign: 'center' } },
                s('pages.forgotPassword.title', 'Forgot your password?'),
              ),
              b.default.createElement('hr', null),
              b.default.createElement(
                'form',
                {
                  onSubmit: (e) => {
                    (e.preventDefault(), h({ ...o, email: f }));
                  },
                  ...a,
                },
                b.default.createElement(
                  'div',
                  { style: { display: 'flex', flexDirection: 'column', padding: 25 } },
                  b.default.createElement(
                    'label',
                    { htmlFor: 'email-input' },
                    s('pages.forgotPassword.fields.email', 'Email'),
                  ),
                  b.default.createElement('input', {
                    id: 'email-input',
                    name: 'email',
                    type: 'mail',
                    autoCorrect: 'off',
                    spellCheck: !1,
                    autoCapitalize: 'off',
                    required: !0,
                    value: f,
                    onChange: (e) => p(e.target.value),
                  }),
                  b.default.createElement('input', {
                    type: 'submit',
                    disabled: m,
                    value: s('pages.forgotPassword.buttons.submit', 'Send reset instructions'),
                  }),
                  b.default.createElement('br', null),
                  e ??
                    b.default.createElement(
                      'span',
                      null,
                      s('pages.register.buttons.haveAccount', 'Have an account? '),
                      ' ',
                      y('/login', s('pages.login.signin', 'Sign in')),
                    ),
                ),
              ),
            );
          return b.default.createElement('div', { ...t }, n ? n(v, i) : v);
        },
        'ForgotPasswordPage',
      ),
      oZ = nw(
        ({
          wrapperProps: e,
          contentProps: t,
          renderContent: r,
          formProps: n,
          title: a,
          mutationVariables: i,
        }) => {
          let o = i3(),
            s = am(),
            { mutate: l, isLoading: u } = a4({
              v3LegacyAuthProviderCompatible: !!(null != s && s.isLegacy),
            }),
            [c, d] = (0, b.useState)(''),
            [f, p] = (0, b.useState)(''),
            h = b.default.createElement(
              'div',
              { ...t },
              b.default.createElement(
                'h1',
                { style: { textAlign: 'center' } },
                o('pages.updatePassword.title', 'Update Password'),
              ),
              b.default.createElement('hr', null),
              b.default.createElement(
                'form',
                {
                  onSubmit: (e) => {
                    (e.preventDefault(), l({ ...i, password: c, confirmPassword: f }));
                  },
                  ...n,
                },
                b.default.createElement(
                  'div',
                  { style: { display: 'flex', flexDirection: 'column', padding: 25 } },
                  b.default.createElement(
                    'label',
                    { htmlFor: 'password-input' },
                    o('pages.updatePassword.fields.password', 'New Password'),
                  ),
                  b.default.createElement('input', {
                    id: 'password-input',
                    name: 'password',
                    type: 'password',
                    required: !0,
                    size: 20,
                    value: c,
                    onChange: (e) => d(e.target.value),
                  }),
                  b.default.createElement(
                    'label',
                    { htmlFor: 'confirm-password-input' },
                    o('pages.updatePassword.fields.confirmPassword', 'Confirm New Password'),
                  ),
                  b.default.createElement('input', {
                    id: 'confirm-password-input',
                    name: 'confirmPassword',
                    type: 'password',
                    required: !0,
                    size: 20,
                    value: f,
                    onChange: (e) => p(e.target.value),
                  }),
                  b.default.createElement('input', {
                    type: 'submit',
                    disabled: u,
                    value: o('pages.updatePassword.buttons.submit', 'Update'),
                  }),
                ),
              ),
            );
          return b.default.createElement('div', { ...e }, r ? r(h, a) : h);
        },
        'UpdatePasswordPage',
      );
    nw((e) => {
      let { type: t } = e;
      return b.default.createElement(
        b.default.Fragment,
        null,
        nw(() => {
          switch (t) {
            case 'register':
              return b.default.createElement(oG, { ...e });
            case 'forgotPassword':
              return b.default.createElement(oV, { ...e });
            case 'updatePassword':
              return b.default.createElement(oZ, { ...e });
            default:
              return b.default.createElement(oH, { ...e });
          }
        }, 'renderView')(),
      );
    }, 'AuthPage');
    var oY = nw(
        () =>
          b.default.createElement(
            b.default.Fragment,
            null,
            b.default.createElement('h1', null, 'Welcome on board'),
            b.default.createElement('p', null, 'Your configuration is completed.'),
            b.default.createElement(
              'p',
              null,
              'Now you can get started by adding your resources to the',
              ' ',
              b.default.createElement('code', null, '`resources`'),
              ' property of ',
              b.default.createElement('code', null, '`<Refine>`'),
            ),
            b.default.createElement(
              'div',
              { style: { display: 'flex', gap: 8 } },
              b.default.createElement(
                'a',
                { href: 'https://refine.dev', target: '_blank', rel: 'noreferrer' },
                b.default.createElement('button', null, 'Documentation'),
              ),
              b.default.createElement(
                'a',
                { href: 'https://refine.dev/examples', target: '_blank', rel: 'noreferrer' },
                b.default.createElement('button', null, 'Examples'),
              ),
              b.default.createElement(
                'a',
                { href: 'https://discord.gg/refine', target: '_blank', rel: 'noreferrer' },
                b.default.createElement('button', null, 'Community'),
              ),
            ),
          ),
        'ReadyPage',
      ),
      oJ = [
        {
          title: 'Documentation',
          description: 'Learn about the technical details of using Refine in your projects.',
          link: 'https://refine.dev/docs',
          iconUrl: 'https://refine.ams3.cdn.digitaloceanspaces.com/welcome-page/book.svg',
        },
        {
          title: 'Tutorial',
          description:
            'Learn how to use Refine by building a fully-functioning CRUD app, from scratch to full launch.',
          link: 'https://refine.dev/tutorial',
          iconUrl: 'https://refine.ams3.cdn.digitaloceanspaces.com/welcome-page/hat.svg',
        },
        {
          title: 'Templates',
          description:
            'Explore a range of pre-built templates, perfect everything from admin panels to dashboards and CRMs.',
          link: 'https://refine.dev/templates',
          iconUrl: 'https://refine.ams3.cdn.digitaloceanspaces.com/welcome-page/application.svg',
        },
        {
          title: 'Community',
          description: 'Join our Discord community and keep up with the latest news.',
          link: 'https://discord.gg/refine',
          iconUrl: 'https://refine.ams3.cdn.digitaloceanspaces.com/welcome-page/discord.svg',
        },
      ],
      oX = nw(() => {
        let e = av('(max-width: 1010px)'),
          t = av('(max-width: 650px)'),
          r = nw(() => (t ? '1, 280px' : e ? '2, 280px' : '4, 1fr'), 'getGridTemplateColumns'),
          n = nw(() => (t ? '32px' : e ? '40px' : '48px'), 'getHeaderFontSize'),
          a = nw(() => (t ? '16px' : e ? '20px' : '24px'), 'getSubHeaderFontSize');
        return b.default.createElement(
          'div',
          {
            style: {
              position: 'fixed',
              zIndex: 10,
              inset: 0,
              overflow: 'auto',
              width: '100dvw',
              height: '100dvh',
            },
          },
          b.default.createElement(
            'div',
            {
              style: {
                overflow: 'hidden',
                position: 'relative',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                background: t
                  ? 'url(https://refine.ams3.cdn.digitaloceanspaces.com/website/static/assets/landing-noise.webp), radial-gradient(88.89% 50% at 50% 100%, rgba(38, 217, 127, 0.10) 0%, rgba(38, 217, 127, 0.00) 100%), radial-gradient(88.89% 50% at 50% 0%, rgba(71, 235, 235, 0.15) 0%, rgba(71, 235, 235, 0.00) 100%), #1D1E30'
                  : e
                    ? 'url(https://refine.ams3.cdn.digitaloceanspaces.com/website/static/assets/landing-noise.webp), radial-gradient(66.67% 50% at 50% 100%, rgba(38, 217, 127, 0.10) 0%, rgba(38, 217, 127, 0.00) 100%), radial-gradient(66.67% 50% at 50% 0%, rgba(71, 235, 235, 0.15) 0%, rgba(71, 235, 235, 0.00) 100%), #1D1E30'
                    : 'url(https://refine.ams3.cdn.digitaloceanspaces.com/website/static/assets/landing-noise.webp), radial-gradient(35.56% 50% at 50% 100%, rgba(38, 217, 127, 0.12) 0%, rgba(38, 217, 127, 0) 100%), radial-gradient(35.56% 50% at 50% 0%, rgba(71, 235, 235, 0.18) 0%, rgba(71, 235, 235, 0) 100%), #1D1E30',
                minHeight: '100%',
                minWidth: '100%',
                fontFamily: 'Arial',
                color: '#FFFFFF',
              },
            },
            b.default.createElement('div', {
              style: {
                zIndex: 2,
                position: 'absolute',
                width: t ? '400px' : '800px',
                height: '552px',
                opacity: '0.5',
                background:
                  'url(https://refine.ams3.cdn.digitaloceanspaces.com/assets/welcome-page-hexagon.png)',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'contain',
                top: '0',
                left: '50%',
                transform: 'translateX(-50%)',
              },
            }),
            b.default.createElement('div', { style: { height: t ? '40px' : '80px' } }),
            b.default.createElement(
              'div',
              { style: { display: 'flex', justifyContent: 'center' } },
              b.default.createElement('div', {
                style: {
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: t ? '112px 58px' : '224px 116px',
                  backgroundImage:
                    'url(https://refine.ams3.cdn.digitaloceanspaces.com/assets/refine-logo.svg)',
                  width: t ? 112 : 224,
                  height: t ? 58 : 116,
                },
              }),
            ),
            b.default.createElement('div', {
              style: {
                height: t ? '120px' : e ? '200px' : '30vh',
                minHeight: t ? '120px' : '200px',
              },
            }),
            b.default.createElement(
              'div',
              {
                style: {
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  textAlign: 'center',
                },
              },
              b.default.createElement(
                'h1',
                { style: { fontSize: n(), fontWeight: 700, margin: '0px' } },
                'Welcome Aboard!',
              ),
              b.default.createElement(
                'h4',
                { style: { fontSize: a(), fontWeight: 400, margin: '0px' } },
                'Your configuration is completed.',
              ),
            ),
            b.default.createElement('div', { style: { height: '64px' } }),
            b.default.createElement(
              'div',
              {
                style: {
                  display: 'grid',
                  gridTemplateColumns: `repeat(${r()})`,
                  justifyContent: 'center',
                  gap: '48px',
                  paddingRight: '16px',
                  paddingLeft: '16px',
                  paddingBottom: '32px',
                  maxWidth: '976px',
                  margin: 'auto',
                },
              },
              oJ.map((e) =>
                b.default.createElement(o0, { key: `welcome-page-${e.title}`, card: e }),
              ),
            ),
          ),
        );
      }, 'ConfigSuccessPage'),
      o0 = nw(({ card: e }) => {
        let { title: t, description: r, iconUrl: n, link: a } = e,
          [i, o] = (0, b.useState)(!1);
        return b.default.createElement(
          'div',
          { style: { display: 'flex', flexDirection: 'column', gap: '16px' } },
          b.default.createElement(
            'div',
            { style: { display: 'flex', alignItems: 'center' } },
            b.default.createElement(
              'a',
              {
                onPointerEnter: () => o(!0),
                onPointerLeave: () => o(!1),
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  color: '#fff',
                  textDecoration: 'none',
                },
                href: a,
              },
              b.default.createElement('div', {
                style: {
                  width: '16px',
                  height: '16px',
                  backgroundPosition: 'center',
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                  backgroundImage: `url(${n})`,
                },
              }),
              b.default.createElement(
                'span',
                {
                  style: {
                    fontSize: '16px',
                    fontWeight: 700,
                    marginLeft: '13px',
                    marginRight: '14px',
                  },
                },
                t,
              ),
              b.default.createElement(
                'svg',
                {
                  style: {
                    transition: 'transform 0.5s ease-in-out, opacity 0.2s ease-in-out',
                    ...(i && { transform: 'translateX(4px)', opacity: 1 }),
                  },
                  width: '12',
                  height: '8',
                  fill: 'none',
                  opacity: '0.5',
                  xmlns: 'http://www.w3.org/2000/svg',
                },
                b.default.createElement('path', {
                  d: 'M7.293.293a1 1 0 0 1 1.414 0l3 3a1 1 0 0 1 0 1.414l-3 3a1 1 0 0 1-1.414-1.414L8.586 5H1a1 1 0 0 1 0-2h7.586L7.293 1.707a1 1 0 0 1 0-1.414Z',
                  fill: '#fff',
                }),
              ),
            ),
          ),
          b.default.createElement(
            'span',
            { style: { fontSize: '12px', opacity: 0.5, lineHeight: '16px' } },
            r,
          ),
        );
      }, 'Card'),
      o1 = nw(
        () =>
          b.default.createElement(
            'div',
            {
              style: {
                position: 'fixed',
                zIndex: 11,
                inset: 0,
                overflow: 'auto',
                width: '100dvw',
                height: '100dvh',
              },
            },
            b.default.createElement(
              'div',
              {
                style: {
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '24px',
                  background: '#14141FBF',
                  backdropFilter: 'blur(3px)',
                },
              },
              b.default.createElement(
                'div',
                {
                  style: {
                    maxWidth: '640px',
                    width: '100%',
                    background: '#1D1E30',
                    borderRadius: '16px',
                    border: '1px solid #303450',
                    boxShadow: '0px 0px 120px -24px #000000',
                  },
                },
                b.default.createElement(
                  'div',
                  {
                    style: {
                      padding: '16px 20px',
                      borderBottom: '1px solid #303450',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      position: 'relative',
                    },
                  },
                  b.default.createElement(o4, { style: { position: 'absolute', left: 0, top: 0 } }),
                  b.default.createElement(
                    'div',
                    {
                      style: {
                        lineHeight: '24px',
                        fontSize: '16px',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                      },
                    },
                    b.default.createElement(o3, null),
                    b.default.createElement(
                      'span',
                      { style: { fontWeight: 400 } },
                      'Configuration Error',
                    ),
                  ),
                ),
                b.default.createElement(
                  'div',
                  {
                    style: {
                      padding: '20px',
                      color: '#A3ADC2',
                      lineHeight: '20px',
                      fontSize: '14px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '20px',
                    },
                  },
                  b.default.createElement(
                    'p',
                    { style: { margin: 0, padding: 0, lineHeight: '28px', fontSize: '16px' } },
                    b.default.createElement(
                      'code',
                      {
                        style: {
                          display: 'inline-block',
                          background: '#30345080',
                          padding: '0 4px',
                          lineHeight: '24px',
                          fontSize: '16px',
                          borderRadius: '4px',
                          color: '#FFFFFF',
                        },
                      },
                      '<Refine />',
                    ),
                    ' ',
                    'is not initialized. Please make sure you have it mounted in your app and placed your components inside it.',
                  ),
                  b.default.createElement('div', null, b.default.createElement(o2, null)),
                ),
              ),
            ),
          ),
        'ConfigErrorPage',
      ),
      o2 = nw(
        () =>
          b.default.createElement(
            'pre',
            {
              style: {
                display: 'block',
                overflowX: 'auto',
                borderRadius: '8px',
                fontSize: '14px',
                lineHeight: '24px',
                backgroundColor: '#14141F',
                color: '#E5ECF2',
                padding: '16px',
                margin: '0',
                maxHeight: '400px',
                overflow: 'auto',
              },
            },
            b.default.createElement('span', { style: { color: '#FF7B72' } }, 'import'),
            ' ',
            '{',
            ' Refine, WelcomePage',
            ' ',
            '}',
            ' ',
            b.default.createElement('span', { style: { color: '#FF7B72' } }, 'from'),
            ' ',
            b.default.createElement('span', { style: { color: '#A5D6FF' } }, '"@refinedev/core"'),
            ';',
            `
`,
            `
`,
            b.default.createElement('span', { style: { color: '#FF7B72' } }, 'export'),
            ' ',
            b.default.createElement('span', { style: { color: '#FF7B72' } }, 'default'),
            ' ',
            b.default.createElement(
              'span',
              null,
              b.default.createElement('span', { style: { color: '#FF7B72' } }, 'function'),
              ' ',
              b.default.createElement('span', { style: { color: '#FFA657' } }, 'App'),
              '(',
              b.default.createElement('span', { style: { color: 'rgb(222, 147, 95)' } }),
              ')',
              ' ',
            ),
            '{',
            `
`,
            '  ',
            b.default.createElement('span', { style: { color: '#FF7B72' } }, 'return'),
            ' (',
            `
`,
            '    ',
            b.default.createElement(
              'span',
              null,
              b.default.createElement(
                'span',
                { style: { color: '#79C0FF' } },
                '<',
                b.default.createElement('span', { style: { color: '#79C0FF' } }, 'Refine'),
                `
`,
                '      ',
                b.default.createElement(
                  'span',
                  { style: { color: '#E5ECF2', opacity: 0.6 } },
                  '// ',
                  b.default.createElement('span', null, '...'),
                ),
                `
`,
                '    ',
                '>',
              ),
              `
`,
              '      ',
              b.default.createElement('span', { style: { opacity: 0.6 } }, '{', '/* ... */', '}'),
              `
`,
              '      ',
              b.default.createElement(
                'span',
                { style: { color: '#79C0FF' } },
                '<',
                b.default.createElement('span', { style: { color: '#79C0FF' } }, 'WelcomePage'),
                ' />',
              ),
              `
`,
              '      ',
              b.default.createElement('span', { style: { opacity: 0.6 } }, '{', '/* ... */', '}'),
              `
`,
              '    ',
              b.default.createElement(
                'span',
                { style: { color: '#79C0FF' } },
                '</',
                b.default.createElement('span', { style: { color: '#79C0FF' } }, 'Refine'),
                '>',
              ),
            ),
            `
`,
            '  ',
            ');',
            `
`,
            '}',
          ),
        'ExampleImplementation',
      ),
      o4 = nw(
        (e) =>
          b.default.createElement(
            'svg',
            {
              xmlns: 'http://www.w3.org/2000/svg',
              width: 204,
              height: 56,
              viewBox: '0 0 204 56',
              fill: 'none',
              ...e,
            },
            b.default.createElement('path', {
              fill: 'url(#welcome-page-error-gradient-a)',
              d: 'M12 0H0v12L12 0Z',
            }),
            b.default.createElement('path', {
              fill: 'url(#welcome-page-error-gradient-b)',
              d: 'M28 0h-8L0 20v8L28 0Z',
            }),
            b.default.createElement('path', {
              fill: 'url(#welcome-page-error-gradient-c)',
              d: 'M36 0h8L0 44v-8L36 0Z',
            }),
            b.default.createElement('path', {
              fill: 'url(#welcome-page-error-gradient-d)',
              d: 'M60 0h-8L0 52v4h4L60 0Z',
            }),
            b.default.createElement('path', {
              fill: 'url(#welcome-page-error-gradient-e)',
              d: 'M68 0h8L20 56h-8L68 0Z',
            }),
            b.default.createElement('path', {
              fill: 'url(#welcome-page-error-gradient-f)',
              d: 'M92 0h-8L28 56h8L92 0Z',
            }),
            b.default.createElement('path', {
              fill: 'url(#welcome-page-error-gradient-g)',
              d: 'M100 0h8L52 56h-8l56-56Z',
            }),
            b.default.createElement('path', {
              fill: 'url(#welcome-page-error-gradient-h)',
              d: 'M124 0h-8L60 56h8l56-56Z',
            }),
            b.default.createElement('path', {
              fill: 'url(#welcome-page-error-gradient-i)',
              d: 'M140 0h-8L76 56h8l56-56Z',
            }),
            b.default.createElement('path', {
              fill: 'url(#welcome-page-error-gradient-j)',
              d: 'M132 0h8L84 56h-8l56-56Z',
            }),
            b.default.createElement('path', {
              fill: 'url(#welcome-page-error-gradient-k)',
              d: 'M156 0h-8L92 56h8l56-56Z',
            }),
            b.default.createElement('path', {
              fill: 'url(#welcome-page-error-gradient-l)',
              d: 'M164 0h8l-56 56h-8l56-56Z',
            }),
            b.default.createElement('path', {
              fill: 'url(#welcome-page-error-gradient-m)',
              d: 'M188 0h-8l-56 56h8l56-56Z',
            }),
            b.default.createElement('path', {
              fill: 'url(#welcome-page-error-gradient-n)',
              d: 'M204 0h-8l-56 56h8l56-56Z',
            }),
            b.default.createElement(
              'defs',
              null,
              b.default.createElement(
                'radialGradient',
                {
                  id: 'welcome-page-error-gradient-a',
                  cx: 0,
                  cy: 0,
                  r: 1,
                  gradientTransform: 'scale(124)',
                  gradientUnits: 'userSpaceOnUse',
                },
                b.default.createElement('stop', { stopColor: '#FF4C4D', stopOpacity: 0.1 }),
                b.default.createElement('stop', {
                  offset: 1,
                  stopColor: '#FF4C4D',
                  stopOpacity: 0,
                }),
              ),
              b.default.createElement(
                'radialGradient',
                {
                  id: 'welcome-page-error-gradient-b',
                  cx: 0,
                  cy: 0,
                  r: 1,
                  gradientTransform: 'scale(124)',
                  gradientUnits: 'userSpaceOnUse',
                },
                b.default.createElement('stop', { stopColor: '#FF4C4D', stopOpacity: 0.1 }),
                b.default.createElement('stop', {
                  offset: 1,
                  stopColor: '#FF4C4D',
                  stopOpacity: 0,
                }),
              ),
              b.default.createElement(
                'radialGradient',
                {
                  id: 'welcome-page-error-gradient-c',
                  cx: 0,
                  cy: 0,
                  r: 1,
                  gradientTransform: 'scale(124)',
                  gradientUnits: 'userSpaceOnUse',
                },
                b.default.createElement('stop', { stopColor: '#FF4C4D', stopOpacity: 0.1 }),
                b.default.createElement('stop', {
                  offset: 1,
                  stopColor: '#FF4C4D',
                  stopOpacity: 0,
                }),
              ),
              b.default.createElement(
                'radialGradient',
                {
                  id: 'welcome-page-error-gradient-d',
                  cx: 0,
                  cy: 0,
                  r: 1,
                  gradientTransform: 'scale(124)',
                  gradientUnits: 'userSpaceOnUse',
                },
                b.default.createElement('stop', { stopColor: '#FF4C4D', stopOpacity: 0.1 }),
                b.default.createElement('stop', {
                  offset: 1,
                  stopColor: '#FF4C4D',
                  stopOpacity: 0,
                }),
              ),
              b.default.createElement(
                'radialGradient',
                {
                  id: 'welcome-page-error-gradient-e',
                  cx: 0,
                  cy: 0,
                  r: 1,
                  gradientTransform: 'scale(124)',
                  gradientUnits: 'userSpaceOnUse',
                },
                b.default.createElement('stop', { stopColor: '#FF4C4D', stopOpacity: 0.1 }),
                b.default.createElement('stop', {
                  offset: 1,
                  stopColor: '#FF4C4D',
                  stopOpacity: 0,
                }),
              ),
              b.default.createElement(
                'radialGradient',
                {
                  id: 'welcome-page-error-gradient-f',
                  cx: 0,
                  cy: 0,
                  r: 1,
                  gradientTransform: 'scale(124)',
                  gradientUnits: 'userSpaceOnUse',
                },
                b.default.createElement('stop', { stopColor: '#FF4C4D', stopOpacity: 0.1 }),
                b.default.createElement('stop', {
                  offset: 1,
                  stopColor: '#FF4C4D',
                  stopOpacity: 0,
                }),
              ),
              b.default.createElement(
                'radialGradient',
                {
                  id: 'welcome-page-error-gradient-g',
                  cx: 0,
                  cy: 0,
                  r: 1,
                  gradientTransform: 'scale(124)',
                  gradientUnits: 'userSpaceOnUse',
                },
                b.default.createElement('stop', { stopColor: '#FF4C4D', stopOpacity: 0.1 }),
                b.default.createElement('stop', {
                  offset: 1,
                  stopColor: '#FF4C4D',
                  stopOpacity: 0,
                }),
              ),
              b.default.createElement(
                'radialGradient',
                {
                  id: 'welcome-page-error-gradient-h',
                  cx: 0,
                  cy: 0,
                  r: 1,
                  gradientTransform: 'scale(124)',
                  gradientUnits: 'userSpaceOnUse',
                },
                b.default.createElement('stop', { stopColor: '#FF4C4D', stopOpacity: 0.1 }),
                b.default.createElement('stop', {
                  offset: 1,
                  stopColor: '#FF4C4D',
                  stopOpacity: 0,
                }),
              ),
              b.default.createElement(
                'radialGradient',
                {
                  id: 'welcome-page-error-gradient-i',
                  cx: 0,
                  cy: 0,
                  r: 1,
                  gradientTransform: 'scale(124)',
                  gradientUnits: 'userSpaceOnUse',
                },
                b.default.createElement('stop', { stopColor: '#FF4C4D', stopOpacity: 0.1 }),
                b.default.createElement('stop', {
                  offset: 1,
                  stopColor: '#FF4C4D',
                  stopOpacity: 0,
                }),
              ),
              b.default.createElement(
                'radialGradient',
                {
                  id: 'welcome-page-error-gradient-j',
                  cx: 0,
                  cy: 0,
                  r: 1,
                  gradientTransform: 'scale(124)',
                  gradientUnits: 'userSpaceOnUse',
                },
                b.default.createElement('stop', { stopColor: '#FF4C4D', stopOpacity: 0.1 }),
                b.default.createElement('stop', {
                  offset: 1,
                  stopColor: '#FF4C4D',
                  stopOpacity: 0,
                }),
              ),
              b.default.createElement(
                'radialGradient',
                {
                  id: 'welcome-page-error-gradient-k',
                  cx: 0,
                  cy: 0,
                  r: 1,
                  gradientTransform: 'scale(124)',
                  gradientUnits: 'userSpaceOnUse',
                },
                b.default.createElement('stop', { stopColor: '#FF4C4D', stopOpacity: 0.1 }),
                b.default.createElement('stop', {
                  offset: 1,
                  stopColor: '#FF4C4D',
                  stopOpacity: 0,
                }),
              ),
              b.default.createElement(
                'radialGradient',
                {
                  id: 'welcome-page-error-gradient-l',
                  cx: 0,
                  cy: 0,
                  r: 1,
                  gradientTransform: 'scale(124)',
                  gradientUnits: 'userSpaceOnUse',
                },
                b.default.createElement('stop', { stopColor: '#FF4C4D', stopOpacity: 0.1 }),
                b.default.createElement('stop', {
                  offset: 1,
                  stopColor: '#FF4C4D',
                  stopOpacity: 0,
                }),
              ),
              b.default.createElement(
                'radialGradient',
                {
                  id: 'welcome-page-error-gradient-m',
                  cx: 0,
                  cy: 0,
                  r: 1,
                  gradientTransform: 'scale(124)',
                  gradientUnits: 'userSpaceOnUse',
                },
                b.default.createElement('stop', { stopColor: '#FF4C4D', stopOpacity: 0.1 }),
                b.default.createElement('stop', {
                  offset: 1,
                  stopColor: '#FF4C4D',
                  stopOpacity: 0,
                }),
              ),
              b.default.createElement(
                'radialGradient',
                {
                  id: 'welcome-page-error-gradient-n',
                  cx: 0,
                  cy: 0,
                  r: 1,
                  gradientTransform: 'scale(124)',
                  gradientUnits: 'userSpaceOnUse',
                },
                b.default.createElement('stop', { stopColor: '#FF4C4D', stopOpacity: 0.1 }),
                b.default.createElement('stop', {
                  offset: 1,
                  stopColor: '#FF4C4D',
                  stopOpacity: 0,
                }),
              ),
            ),
          ),
        'ErrorGradient',
      ),
      o3 = nw(
        (e) =>
          b.default.createElement(
            'svg',
            {
              xmlns: 'http://www.w3.org/2000/svg',
              width: 16,
              height: 16,
              viewBox: '0 0 16 16',
              fill: 'none',
              ...e,
            },
            b.default.createElement('path', {
              fill: '#FF4C4D',
              fillRule: 'evenodd',
              d: 'M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16Z',
              clipRule: 'evenodd',
            }),
            b.default.createElement('path', {
              fill: '#fff',
              fillRule: 'evenodd',
              d: 'M7 8a1 1 0 1 0 2 0V5a1 1 0 1 0-2 0v3Zm0 3a1 1 0 1 1 2 0 1 1 0 0 1-2 0Z',
              clipRule: 'evenodd',
            }),
          ),
        'ErrorIcon',
      ),
      o8 = nw(() => {
        let { __initialized: e } = aO();
        return b.default.createElement(
          b.default.Fragment,
          null,
          b.default.createElement(oX, null),
          !e && b.default.createElement(o1, null),
        );
      }, 'WelcomePage'),
      o6 = nw(() => {
        var e;
        let t = a9(),
          r = (0, b.useContext)(oA),
          { liveProvider: n } = (0, b.useContext)(ix),
          a = (0, b.useContext)(oy),
          i = (0, b.useContext)(iP),
          { i18nProvider: o } = (0, b.useContext)(i1),
          s = (0, b.useContext)(iY),
          l = (0, b.useContext)(ob),
          { resources: u } = iU(),
          c = aO(),
          d = !!r.create || !!r.get || !!r.update,
          f =
            !!(null != n && n.publish) ||
            !!(null != n && n.subscribe) ||
            !!(null != n && n.unsubscribe),
          p = !!a.useHistory || !!a.Link || !!a.Prompt || !!a.useLocation || !!a.useParams,
          h =
            !!(null != o && o.changeLocale) ||
            !!(null != o && o.getLocale) ||
            !!(null != o && o.translate),
          m = !!s.close || !!s.open,
          y = !!l.can,
          v = null == (e = null == c ? void 0 : c.options) ? void 0 : e.projectId;
        return {
          providers: {
            auth: t,
            auditLog: d,
            live: f,
            router: p,
            data: !!i,
            i18n: h,
            notification: m,
            accessControl: y,
          },
          version: '4.58.0',
          resourceCount: u.length,
          projectId: v,
        };
      }, 'useTelemetryData'),
      o5 = nw((e) => {
        try {
          let t = JSON.stringify(e || {});
          return 'u' > typeof btoa ? btoa(t) : g.Buffer.from(t).toString('base64');
        } catch {
          return;
        }
      }, 'encode'),
      o9 = nw((e) => {
        new Image().src = e;
      }, 'throughImage'),
      o7 = nw((e) => {
        fetch(e);
      }, 'throughFetch'),
      se = nw((e) => {
        'u' > typeof Image ? o9(e) : 'u' > typeof fetch && o7(e);
      }, 'transport'),
      st = nw(() => {
        let e = o6(),
          t = b.default.useRef(!1);
        return (
          b.default.useEffect(() => {
            if (t.current) return;
            let r = o5(e);
            r && (se(`https://telemetry.refine.dev/telemetry?payload=${r}`), (t.current = !0));
          }, []),
          null
        );
      }, 'Telemetry'),
      sr = nw((e) => {
        let t = ['go', 'parse', 'back', 'Link'],
          r = Object.keys(e).filter((e) => !t.includes(e));
        return (
          r.length > 0 &&
          (console.warn(
            `Unsupported properties are found in \`routerProvider\` prop. You provided \`${r.join(', ')}\`. Supported properties are \`${t.join(', ')}\`. You may wanted to use \`legacyRouterProvider\` prop instead.`,
          ),
          !0)
        );
      }, 'checkRouterPropMisuse'),
      sn = nw((e) => {
        let t = b.default.useRef(!1);
        b.default.useEffect(() => {
          !1 === t.current && e && sr(e) && (t.current = !0);
        }, [e]);
      }, 'useRouterMisuseWarning'),
      sa = nw(
        ({
          legacyAuthProvider: e,
          authProvider: t,
          dataProvider: r,
          legacyRouterProvider: n,
          routerProvider: a,
          notificationProvider: i,
          accessControlProvider: o,
          auditLogProvider: s,
          resources: l,
          DashboardPage: u,
          ReadyPage: c,
          LoginPage: d,
          catchAll: f,
          children: p,
          liveProvider: h,
          i18nProvider: m,
          Title: y,
          Layout: v,
          Sider: g,
          Header: E,
          Footer: w,
          OffLayoutArea: C,
          onLiveEvent: P,
          options: S,
        }) => {
          let {
              optionsWithDefaults: O,
              disableTelemetryWithDefault: x,
              reactQueryWithDefaults: L,
            } = an({ options: S }),
            A = iF(() => {
              var e;
              return L.clientConfig instanceof nb
                ? L.clientConfig
                : new nb({
                    ...L.clientConfig,
                    defaultOptions: {
                      ...L.clientConfig.defaultOptions,
                      queries: {
                        refetchOnWindowFocus: !1,
                        keepPreviousData: !0,
                        ...(null == (e = L.clientConfig.defaultOptions) ? void 0 : e.queries),
                      },
                    },
                  });
            }, [L.clientConfig]),
            k = b.default.useMemo(() => ('function' == typeof i ? i : () => i), [i])();
          if ((sn(a), n && !a && 0 === (l ?? []).length))
            return c ? b.default.createElement(c, null) : b.default.createElement(oY, null);
          let { RouterComponent: F = b.default.Fragment } = a ? {} : (n ?? {});
          return b.default.createElement(
            el,
            { client: A },
            b.default.createElement(
              iJ,
              { ...k },
              b.default.createElement(
                nP,
                { ...(e ?? {}), isProvided: !!e },
                b.default.createElement(
                  nO,
                  { ...(t ?? {}), isProvided: !!t },
                  b.default.createElement(
                    iS,
                    { dataProvider: r },
                    b.default.createElement(
                      iL,
                      { liveProvider: h },
                      b.default.createElement(
                        iM,
                        { value: n && !a ? 'legacy' : 'new' },
                        b.default.createElement(
                          iI,
                          { router: a },
                          b.default.createElement(
                            ov,
                            { ...n },
                            b.default.createElement(
                              iR,
                              { resources: l ?? [] },
                              b.default.createElement(
                                i2,
                                { i18nProvider: m },
                                b.default.createElement(
                                  oE,
                                  { ...(o ?? {}) },
                                  b.default.createElement(
                                    ok,
                                    { ...(s ?? {}) },
                                    b.default.createElement(
                                      iV,
                                      null,
                                      b.default.createElement(
                                        ar,
                                        {
                                          mutationMode: O.mutationMode,
                                          warnWhenUnsavedChanges: O.warnWhenUnsavedChanges,
                                          syncWithLocation: O.syncWithLocation,
                                          Title: y,
                                          undoableTimeout: O.undoableTimeout,
                                          catchAll: f,
                                          DashboardPage: u,
                                          LoginPage: d,
                                          Layout: v,
                                          Sider: g,
                                          Footer: w,
                                          Header: E,
                                          OffLayoutArea: C,
                                          hasDashboard: !!u,
                                          liveMode: O.liveMode,
                                          onLiveEvent: P,
                                          options: O,
                                        },
                                        b.default.createElement(
                                          aw,
                                          null,
                                          b.default.createElement(
                                            F,
                                            null,
                                            p,
                                            !x && b.default.createElement(st, null),
                                            b.default.createElement(sc, null),
                                          ),
                                        ),
                                      ),
                                    ),
                                  ),
                                ),
                              ),
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            ),
          );
        },
        'Refine',
      ),
      si = nw(({ notification: e }) => {
        let t = i3(),
          { notificationDispatch: r } = iZ(),
          { open: n } = iX(),
          [a, i] = (0, b.useState)(),
          o = nw(() => {
            !0 === e.isRunning &&
              (0 === e.seconds && e.doMutation(),
              e.isSilent ||
                null == n ||
                n({
                  key: `${e.id}-${e.resource}-notification`,
                  type: 'progress',
                  message: t(
                    'notifications.undoable',
                    { seconds: nA(e.seconds) },
                    `You have ${nA(e.seconds)} seconds to undo`,
                  ),
                  cancelMutation: e.cancelMutation,
                  undoableTimeout: nA(e.seconds),
                }),
              e.seconds > 0) &&
              (a && clearTimeout(a),
              i(
                setTimeout(() => {
                  r({
                    type: 'DECREASE_NOTIFICATION_SECOND',
                    payload: { id: e.id, seconds: e.seconds, resource: e.resource },
                  });
                }, 1e3),
              ));
          }, 'cancelNotification');
        return (
          (0, b.useEffect)(() => {
            o();
          }, [e]),
          null
        );
      }, 'UndoableQueue');
    nw(({ children: e, Layout: t, Sider: r, Header: n, Title: a, Footer: i, OffLayoutArea: o }) => {
      let { Layout: s, Footer: l, Header: u, Sider: c, Title: d, OffLayoutArea: f } = aO();
      return b.default.createElement(
        t ?? s,
        { Sider: r ?? c, Header: n ?? u, Footer: i ?? l, Title: a ?? d, OffLayoutArea: o ?? f },
        e,
        b.default.createElement(so, null),
      );
    }, 'LayoutWrapper');
    var so = nw(() => {
      let { Prompt: e } = og(),
        t = i3(),
        { warnWhen: r, setWarnWhen: n } = aC(),
        a = nw(
          (e) => (
            e.preventDefault(),
            (e.returnValue = t(
              'warnWhenUnsavedChanges',
              'Are you sure you want to leave? You have unsaved changes.',
            )),
            e.returnValue
          ),
          'warnWhenListener',
        );
      return (
        (0, b.useEffect)(
          () => (
            r && window.addEventListener('beforeunload', a),
            window.removeEventListener('beforeunload', a)
          ),
          [r],
        ),
        b.default.createElement(e, {
          when: r,
          message: t(
            'warnWhenUnsavedChanges',
            'Are you sure you want to leave? You have unsaved changes.',
          ),
          setWarnWhen: n,
        })
      );
    }, 'UnsavedPrompt');
    function ss({
      redirectOnFail: e = !0,
      appendCurrentPathToQuery: t = !0,
      children: r,
      fallback: n,
      loading: a,
      params: i,
    }) {
      var o;
      let s = am(),
        l = iN(),
        u = !!(null != s && s.isProvided),
        c = !!(null != s && s.isLegacy),
        d = 'legacy' === l,
        f = iq(),
        p = oi(),
        { useLocation: h } = og(),
        m = h(),
        {
          isFetching: y,
          isSuccess: v,
          data: { authenticated: g, redirectTo: E } = {},
        } = a6({ v3LegacyAuthProviderCompatible: c, params: i }),
        w = !u || (c ? v : g);
      if (!u) return b.default.createElement(b.default.Fragment, null, r ?? null);
      if (y) return b.default.createElement(b.default.Fragment, null, a ?? null);
      if (w) return b.default.createElement(b.default.Fragment, null, r ?? null);
      if ('u' > typeof n) return b.default.createElement(b.default.Fragment, null, n ?? null);
      let C = c ? ('string' == typeof e ? e : '/login') : 'string' == typeof e ? e : E,
        P = `${d ? (null == m ? void 0 : m.pathname) : f.pathname}`.replace(/(\?.*|#.*)$/, '');
      if (C) {
        if (d) {
          let e = t ? `?to=${encodeURIComponent(P)}` : '';
          return b.default.createElement(su, { to: `${C}${e}` });
        }
        let e =
          null != (o = f.params) && o.to
            ? f.params.to
            : p({ to: P, options: { keepQuery: !0 }, type: 'path' });
        return b.default.createElement(sl, {
          config: { to: C, query: t && (e ?? '').length > 1 ? { to: e } : void 0, type: 'replace' },
        });
      }
      return null;
    }
    nw(ss, 'Authenticated');
    var sl = nw(({ config: e }) => {
        let t = oi();
        return (
          b.default.useEffect(() => {
            t(e);
          }, [t, e]),
          null
        );
      }, 'Redirect'),
      su = nw(({ to: e }) => {
        let { replace: t } = os();
        return (
          b.default.useEffect(() => {
            t(e);
          }, [t, e]),
          null
        );
      }, 'RedirectLegacy'),
      sc = nw(() => {
        let { useLocation: e } = og(),
          { checkAuth: t } = nx(),
          r = e();
        return (
          (0, b.useEffect)(() => {
            null == t || t().catch(() => !1);
          }, [null == r ? void 0 : r.pathname]),
          null
        );
      }, 'RouteChangeHandler'),
      sd = nw(
        ({
          resource: e,
          action: t,
          params: r,
          fallback: n,
          onUnauthorized: a,
          children: i,
          queryOptions: o,
          ...s
        }) => {
          let {
              id: l,
              resource: u,
              action: c = '',
            } = oK({ resource: e, id: null == r ? void 0 : r.id }),
            d = t ?? c,
            f = r ?? { id: l, resource: u },
            { data: p } = oC({
              resource: null == u ? void 0 : u.name,
              action: d,
              params: f,
              queryOptions: o,
            });
          return (
            (0, b.useEffect)(() => {
              a &&
                (null == p ? void 0 : p.can) === !1 &&
                a({
                  resource: null == u ? void 0 : u.name,
                  action: d,
                  reason: null == p ? void 0 : p.reason,
                  params: f,
                });
            }, [null == p ? void 0 : p.can]),
            null != p && p.can
              ? b.default.isValidElement(i)
                ? b.default.cloneElement(i, s)
                : b.default.createElement(b.default.Fragment, null, i)
              : (null == p ? void 0 : p.can) === !1
                ? b.default.createElement(b.default.Fragment, null, n ?? null)
                : null
          );
        },
        'CanAccess',
      ),
      sf = [
        `
    .bg-top-announcement {
        border-bottom: 1px solid rgba(71, 235, 235, 0.15);
        background: radial-gradient(
                218.19% 111.8% at 0% 0%,
                rgba(71, 235, 235, 0.1) 0%,
                rgba(71, 235, 235, 0.2) 100%
            ),
            #14141f;
    }
    `,
        `
    .top-announcement-mask {
        mask-image: url(https://refine.ams3.cdn.digitaloceanspaces.com/website/static/assets/hexagon.svg);
        -webkit-mask-image: url(https://refine.ams3.cdn.digitaloceanspaces.com/website/static/assets/hexagon.svg);
        mask-repeat: repeat;
        -webkit-mask-repeat: repeat;
        background: rgba(71, 235, 235, 0.25);
    }
    `,
        `
    .banner {
        display: flex;
        @media (max-width: 1000px) {
            display: none;
        }
    }`,
        `
    .gh-link, .gh-link:hover, .gh-link:active, .gh-link:visited, .gh-link:focus {
        text-decoration: none;
        z-index: 9;
    }
    `,
        `
    @keyframes top-announcement-glow {
        0% {
            opacity: 1;
        }

        100% {
            opacity: 0;
        }
    }
    `,
      ];
    nw(
      ({ containerStyle: e }) => (
        (0, b.useEffect)(() => {
          let e = document.createElement('style');
          (document.head.appendChild(e),
            sf.forEach((t) => {
              var r;
              return null == (r = e.sheet) ? void 0 : r.insertRule(t, e.sheet.cssRules.length);
            }));
        }, []),
        b.default.createElement(
          'div',
          { className: 'banner bg-top-announcement', style: { width: '100%', height: '48px' } },
          b.default.createElement(
            'div',
            {
              style: {
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                paddingLeft: '200px',
                width: '100%',
                maxWidth: '100vw',
                height: '100%',
                borderBottom: '1px solid #47ebeb26',
                ...e,
              },
            },
            b.default.createElement(
              'div',
              {
                className: 'top-announcement-mask',
                style: {
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: '100%',
                  height: '100%',
                  borderBottom: '1px solid #47ebeb26',
                },
              },
              b.default.createElement(
                'div',
                {
                  style: {
                    position: 'relative',
                    width: '960px',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    margin: '0 auto',
                  },
                },
                b.default.createElement(
                  'div',
                  { style: { width: 'calc(50% - 300px)', height: '100%', position: 'relative' } },
                  b.default.createElement(sh, {
                    style: {
                      animationDelay: '1.5s',
                      position: 'absolute',
                      top: '2px',
                      right: '220px',
                    },
                    id: '1',
                  }),
                  b.default.createElement(sh, {
                    style: {
                      animationDelay: '1s',
                      position: 'absolute',
                      top: '8px',
                      right: '100px',
                      transform: 'rotate(180deg)',
                    },
                    id: '2',
                  }),
                  b.default.createElement(sm, {
                    style: { position: 'absolute', right: '10px' },
                    id: '3',
                  }),
                ),
                b.default.createElement(
                  'div',
                  { style: { width: 'calc(50% - 300px)', height: '100%', position: 'relative' } },
                  b.default.createElement(sh, {
                    style: {
                      animationDelay: '2s',
                      position: 'absolute',
                      top: '6px',
                      right: '180px',
                      transform: 'rotate(180deg)',
                    },
                    id: '4',
                  }),
                  b.default.createElement(sh, {
                    style: {
                      animationDelay: '0.5s',
                      transitionDelay: '1.3s',
                      position: 'absolute',
                      top: '2px',
                      right: '40px',
                    },
                    id: '5',
                  }),
                  b.default.createElement(sm, {
                    style: { position: 'absolute', right: '-70px' },
                    id: '6',
                  }),
                ),
              ),
            ),
            b.default.createElement(sp, {
              text: 'If you find Refine useful, you can contribute to its growth by giving it a star on GitHub',
            }),
          ),
        )
      ),
      'GitHubBanner',
    );
    var sp = nw(
        ({ text: e }) =>
          b.default.createElement(
            'a',
            {
              className: 'gh-link',
              href: 'https://s.refine.dev/github-support',
              target: '_blank',
              rel: 'noreferrer',
              style: {
                position: 'absolute',
                height: '100%',
                padding: '0 60px',
                display: 'flex',
                flexWrap: 'nowrap',
                whiteSpace: 'nowrap',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundImage:
                  'linear-gradient(90deg, rgba(31, 63, 72, 0.00) 0%, #1F3F48 10%, #1F3F48 90%, rgba(31, 63, 72, 0.00) 100%)',
              },
            },
            b.default.createElement(
              'div',
              { style: { color: '#fff', display: 'flex', flexDirection: 'row', gap: '8px' } },
              b.default.createElement(
                'span',
                {
                  style: {
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  },
                },
                '⭐️',
              ),
              b.default.createElement(
                'span',
                { className: 'text', style: { fontSize: '16px', lineHeight: '24px' } },
                e,
              ),
              b.default.createElement(
                'span',
                {
                  style: {
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  },
                },
                '⭐️',
              ),
            ),
          ),
        'Text',
      ),
      sh = nw(
        ({ style: e, ...t }) =>
          b.default.createElement(
            'svg',
            {
              xmlns: 'http://www.w3.org/2000/svg',
              width: 80,
              height: 40,
              fill: 'none',
              style: {
                opacity: 1,
                animation: 'top-announcement-glow 1s ease-in-out infinite alternate',
                ...e,
              },
            },
            b.default.createElement('circle', {
              cx: 40,
              r: 40,
              fill: `url(#${t.id}-a)`,
              fillOpacity: 0.5,
            }),
            b.default.createElement(
              'defs',
              null,
              b.default.createElement(
                'radialGradient',
                {
                  id: `${t.id}-a`,
                  cx: 0,
                  cy: 0,
                  r: 1,
                  gradientTransform: 'matrix(0 40 -40 0 40 0)',
                  gradientUnits: 'userSpaceOnUse',
                },
                b.default.createElement('stop', { stopColor: '#47EBEB' }),
                b.default.createElement('stop', {
                  offset: 1,
                  stopColor: '#47EBEB',
                  stopOpacity: 0,
                }),
              ),
            ),
          ),
        'GlowSmall',
      ),
      sm = nw(
        ({ style: e, ...t }) =>
          b.default.createElement(
            'svg',
            {
              xmlns: 'http://www.w3.org/2000/svg',
              width: 120,
              height: 48,
              fill: 'none',
              ...t,
              style: {
                opacity: 1,
                animation: 'top-announcement-glow 1s ease-in-out infinite alternate',
                ...e,
              },
            },
            b.default.createElement('circle', {
              cx: 60,
              cy: 24,
              r: 60,
              fill: `url(#${t.id}-a)`,
              fillOpacity: 0.5,
            }),
            b.default.createElement(
              'defs',
              null,
              b.default.createElement(
                'radialGradient',
                {
                  id: `${t.id}-a`,
                  cx: 0,
                  cy: 0,
                  r: 1,
                  gradientTransform: 'matrix(0 60 -60 0 60 24)',
                  gradientUnits: 'userSpaceOnUse',
                },
                b.default.createElement('stop', { stopColor: '#47EBEB' }),
                b.default.createElement('stop', {
                  offset: 1,
                  stopColor: '#47EBEB',
                  stopOpacity: 0,
                }),
              ),
            ),
          ),
        'GlowBig',
      );
    nw(
      ({
        status: e,
        elements: {
          success: t = b.default.createElement(sy, {
            translationKey: 'autoSave.success',
            defaultMessage: 'saved',
          }),
          error: r = b.default.createElement(sy, {
            translationKey: 'autoSave.error',
            defaultMessage: 'auto save failure',
          }),
          loading: n = b.default.createElement(sy, {
            translationKey: 'autoSave.loading',
            defaultMessage: 'saving...',
          }),
          idle: a = b.default.createElement(sy, {
            translationKey: 'autoSave.idle',
            defaultMessage: 'waiting for changes',
          }),
        } = {},
      }) => {
        switch (e) {
          case 'success':
            return b.default.createElement(b.default.Fragment, null, t);
          case 'error':
            return b.default.createElement(b.default.Fragment, null, r);
          case 'loading':
            return b.default.createElement(b.default.Fragment, null, n);
          default:
            return b.default.createElement(b.default.Fragment, null, a);
        }
      },
      'AutoSaveIndicator',
    );
    var sy = nw(({ translationKey: e, defaultMessage: t }) => {
      let r = i3();
      return b.default.createElement('span', null, r(e, t));
    }, 'Message');
    e.s(
      [
        'Authenticated',
        0,
        ss,
        'CanAccess',
        0,
        sd,
        'Refine',
        0,
        sa,
        'ResourceContext',
        0,
        i_,
        'WelcomePage',
        0,
        o8,
        'flattenObjectKeys',
        0,
        ak,
        'matchResourceFromRoute',
        0,
        n8,
        'pickNotDeprecated',
        0,
        nW,
        'useActiveAuthProvider',
        0,
        am,
        'useBack',
        0,
        on,
        'useBreadcrumb',
        0,
        o_,
        'useCan',
        0,
        oC,
        'useCanWithoutCache',
        0,
        oP,
        'useDelete',
        0,
        im,
        'useForgotPassword',
        0,
        a0,
        'useForm',
        0,
        i6,
        'useGetIdentity',
        0,
        aQ,
        'useGetToPath',
        0,
        oa,
        'useGo',
        0,
        oi,
        'useInvalidate',
        0,
        iA,
        'useIsExistAuthentication',
        0,
        a9,
        'useLink',
        0,
        oh,
        'useList',
        0,
        ie,
        'useLiveMode',
        0,
        iz,
        'useLogin',
        0,
        aG,
        'useLogout',
        0,
        aB,
        'useMany',
        0,
        ir,
        'useMenu',
        0,
        oN,
        'useModal',
        0,
        oc,
        'useMutationMode',
        0,
        ab,
        'useNavigation',
        0,
        os,
        'useNotification',
        0,
        iX,
        'useOne',
        0,
        it,
        'useParsed',
        0,
        iq,
        'useRefineContext',
        0,
        aO,
        'useRegister',
        0,
        aY,
        'useResource',
        0,
        iU,
        'useRouterContext',
        0,
        og,
        'useRouterType',
        0,
        iN,
        'useSelect',
        0,
        oS,
        'useShow',
        0,
        ol,
        'useTable',
        0,
        oL,
        'useTitle',
        0,
        aS,
        'useToPath',
        0,
        od,
        'useTranslate',
        0,
        i3,
        'useUpdatePassword',
        0,
        a4,
        'useUserFriendlyName',
        0,
        ax,
        'useWarnAboutChange',
        0,
        aC,
        'userFriendlyResourceName',
        0,
        nF,
      ],
      60552,
    );
  },
]);
