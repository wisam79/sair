(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([
  'object' == typeof document ? document.currentScript : void 0,
  55227,
  (e, t, r) => {
    'use strict';
    var n =
        (e.e && e.e.__assign) ||
        function () {
          return (n =
            Object.assign ||
            function (e) {
              for (var t, r = 1, n = arguments.length; r < n; r++)
                for (var a in (t = arguments[r]))
                  Object.prototype.hasOwnProperty.call(t, a) && (e[a] = t[a]);
              return e;
            }).apply(this, arguments);
        },
      a =
        (e.e && e.e.__createBinding) ||
        (Object.create
          ? function (e, t, r, n) {
              (void 0 === n && (n = r),
                Object.defineProperty(e, n, {
                  enumerable: !0,
                  get: function () {
                    return t[r];
                  },
                }));
            }
          : function (e, t, r, n) {
              (void 0 === n && (n = r), (e[n] = t[r]));
            }),
      i =
        (e.e && e.e.__setModuleDefault) ||
        (Object.create
          ? function (e, t) {
              Object.defineProperty(e, 'default', { enumerable: !0, value: t });
            }
          : function (e, t) {
              e.default = t;
            }),
      s =
        (e.e && e.e.__importStar) ||
        function (e) {
          if (e && e.__esModule) return e;
          var t = {};
          if (null != e)
            for (var r in e)
              'default' !== r && Object.prototype.hasOwnProperty.call(e, r) && a(t, e, r);
          return (i(t, e), t);
        },
      o =
        (e.e && e.e.__spreadArray) ||
        function (e, t, r) {
          if (r || 2 == arguments.length)
            for (var n, a = 0, i = t.length; a < i; a++)
              (!n && a in t) || (n || (n = Array.prototype.slice.call(t, 0, a)), (n[a] = t[a]));
          return e.concat(n || Array.prototype.slice.call(t));
        };
    (Object.defineProperty(r, '__esModule', { value: !0 }),
      (r.Priority =
        r.isModKey =
        r.shouldRejectKeystrokes =
        r.useThrottledValue =
        r.getScrollbarWidth =
        r.useIsomorphicLayout =
        r.noop =
        r.createAction =
        r.randomId =
        r.usePointerMovedSinceMount =
        r.useOuterClick =
        r.swallowEvent =
          void 0));
    var u = s(e.r(61129));
    function l() {
      return Math.random().toString(36).substring(2, 9);
    }
    function c() {}
    ((r.swallowEvent = function (e) {
      (e.stopPropagation(), e.preventDefault());
    }),
      (r.useOuterClick = function (e, t) {
        var r = u.useRef(t);
        ((r.current = t),
          u.useEffect(
            function () {
              function t(t) {
                var n, a;
                (null != (n = e.current) && n.contains(t.target)) ||
                  t.target === (null == (a = e.current) ? void 0 : a.getRootNode().host) ||
                  (t.preventDefault(), t.stopPropagation(), r.current());
              }
              return (
                window.addEventListener('pointerdown', t, !0),
                function () {
                  return window.removeEventListener('pointerdown', t, !0);
                }
              );
            },
            [e],
          ));
      }),
      (r.usePointerMovedSinceMount = function () {
        var e = u.useState(!1),
          t = e[0],
          r = e[1];
        return (
          u.useEffect(
            function () {
              function e() {
                r(!0);
              }
              if (!t)
                return (
                  window.addEventListener('pointermove', e),
                  function () {
                    return window.removeEventListener('pointermove', e);
                  }
                );
            },
            [t],
          ),
          t
        );
      }),
      (r.randomId = l),
      (r.createAction = function (e) {
        return n({ id: l() }, e);
      }),
      (r.noop = c),
      (r.useIsomorphicLayout = 'u' < typeof window ? c : u.useLayoutEffect),
      (r.getScrollbarWidth = function () {
        var e = document.createElement('div');
        ((e.style.visibility = 'hidden'),
          (e.style.overflow = 'scroll'),
          document.body.appendChild(e));
        var t = document.createElement('div');
        e.appendChild(t);
        var r = e.offsetWidth - t.offsetWidth;
        return (e.parentNode.removeChild(e), r);
      }),
      (r.useThrottledValue = function (e, t) {
        void 0 === t && (t = 100);
        var r = u.useState(e),
          n = r[0],
          a = r[1],
          i = u.useRef(Date.now());
        return (
          u.useEffect(
            function () {
              if (0 !== t) {
                var r = setTimeout(
                  function () {
                    (a(e), (i.current = Date.now()));
                  },
                  i.current - (Date.now() - t),
                );
                return function () {
                  clearTimeout(r);
                };
              }
            },
            [t, e],
          ),
          0 === t ? e : n
        );
      }),
      (r.shouldRejectKeystrokes = function (e) {
        var t,
          r,
          n = o(
            ['input', 'textarea'],
            (void 0 === e ? { ignoreWhenFocused: [] } : e).ignoreWhenFocused,
            !0,
          ).map(function (e) {
            return e.toLowerCase();
          }),
          a = document.activeElement;
        return (
          a &&
          (-1 !== n.indexOf(a.tagName.toLowerCase()) ||
            (null == (t = a.attributes.getNamedItem('role')) ? void 0 : t.value) === 'textbox' ||
            (null == (r = a.attributes.getNamedItem('contenteditable')) ? void 0 : r.value) ===
              'true')
        );
      }));
    var d = !('u' < typeof window) && 'MacIntel' === window.navigator.platform;
    ((r.isModKey = function (e) {
      return d ? e.metaKey : e.ctrlKey;
    }),
      (r.Priority = { HIGH: 1, NORMAL: 0, LOW: -1 }));
  },
  53083,
  (e, t, r) => {
    (e.e,
      (function (e) {
        'use strict';
        var t = Object.keys;
        function r(e, t) {
          return e === t || (e != e && t != t);
        }
        function n(e) {
          return e.constructor === Object || null == e.constructor;
        }
        function a(e) {
          return !!e && 'function' == typeof e.then;
        }
        function i(e) {
          return !!(e && e.$$typeof);
        }
        var s =
          'function' == typeof WeakSet
            ? function () {
                return new WeakSet();
              }
            : function () {
                var e = [];
                return {
                  add: function (t) {
                    e.push(t);
                  },
                  has: function (t) {
                    return -1 !== e.indexOf(t);
                  },
                };
              };
        function o(e) {
          return function (t) {
            var r = e || t;
            return function (e, t, n) {
              void 0 === n && (n = s());
              var a = !!e && 'object' == typeof e,
                i = !!t && 'object' == typeof t;
              if (a || i) {
                var o = a && n.has(e),
                  u = i && n.has(t);
                if (o || u) return o && u;
                (a && n.add(e), i && n.add(t));
              }
              return r(e, t, n);
            };
          };
        }
        var u = Function.prototype.bind.call(
          Function.prototype.call,
          Object.prototype.hasOwnProperty,
        );
        function l(e, r, n, a) {
          var s = t(e),
            o = s.length;
          if (t(r).length !== o) return !1;
          if (o)
            for (var l = void 0; o-- > 0; ) {
              if ('_owner' === (l = s[o])) {
                var c = i(e),
                  d = i(r);
                if ((c || d) && c !== d) return !1;
              }
              if (!u(r, l) || !n(e[l], r[l], a)) return !1;
            }
          return !0;
        }
        var c = 'function' == typeof Map,
          d = 'function' == typeof Set;
        function f(e) {
          var t = 'function' == typeof e ? e(i) : i;
          function i(e, i, s) {
            if (e === i) return !0;
            if (e && i && 'object' == typeof e && 'object' == typeof i) {
              if (n(e) && n(i)) return l(e, i, t, s);
              var o = Array.isArray(e),
                u = Array.isArray(i);
              return o || u
                ? o === u &&
                    (function (e, t, r, n) {
                      var a = e.length;
                      if (t.length !== a) return !1;
                      for (; a-- > 0; ) if (!r(e[a], t[a], n)) return !1;
                      return !0;
                    })(e, i, t, s)
                : ((o = e instanceof Date), (u = i instanceof Date), o || u)
                  ? o === u && r(e.getTime(), i.getTime())
                  : ((o = e instanceof RegExp), (u = i instanceof RegExp), o || u)
                    ? o === u &&
                      e.source === i.source &&
                      e.global === i.global &&
                      e.ignoreCase === i.ignoreCase &&
                      e.multiline === i.multiline &&
                      e.unicode === i.unicode &&
                      e.sticky === i.sticky &&
                      e.lastIndex === i.lastIndex
                    : a(e) || a(i)
                      ? e === i
                      : c && ((o = e instanceof Map), (u = i instanceof Map), o || u)
                        ? o === u &&
                          (function (e, t, r, n) {
                            var a = e.size === t.size;
                            if (a && e.size) {
                              var i = {};
                              e.forEach(function (e, s) {
                                if (a) {
                                  var o = !1,
                                    u = 0;
                                  (t.forEach(function (t, a) {
                                    (!o && !i[u] && (o = r(s, a, n) && r(e, t, n)) && (i[u] = !0),
                                      u++);
                                  }),
                                    (a = o));
                                }
                              });
                            }
                            return a;
                          })(e, i, t, s)
                        : d && ((o = e instanceof Set), (u = i instanceof Set), o || u)
                          ? o === u &&
                            (function (e, t, r, n) {
                              var a = e.size === t.size;
                              if (a && e.size) {
                                var i = {};
                                e.forEach(function (e) {
                                  if (a) {
                                    var s = !1,
                                      o = 0;
                                    (t.forEach(function (t) {
                                      (!s && !i[o] && (s = r(e, t, n)) && (i[o] = !0), o++);
                                    }),
                                      (a = s));
                                  }
                                });
                              }
                              return a;
                            })(e, i, t, s)
                          : l(e, i, t, s);
            }
            return e != e && i != i;
          }
          return i;
        }
        var p = f(),
          h = f(function () {
            return r;
          }),
          m = f(o()),
          v = f(o(r));
        ((e.circularDeepEqual = m),
          (e.circularShallowEqual = v),
          (e.createCustomEqual = f),
          (e.deepEqual = p),
          (e.sameValueZeroEqual = r),
          (e.shallowEqual = h),
          Object.defineProperty(e, '__esModule', { value: !0 }));
      })(r));
  },
  53425,
  (e, t, r) => {
    'use strict';
    t.exports = function (e, t) {
      if (!e) throw Error('Invariant failed');
    };
  },
  97912,
  (e, t, r) => {
    'use strict';
    (Object.defineProperty(r, '__esModule', { value: !0 }),
      (r.Command = void 0),
      (r.Command = function (e, t) {
        var r = this;
        (void 0 === t && (t = {}),
          (this.perform = function () {
            var n = e.perform();
            if ('function' == typeof n) {
              var a = t.history;
              a &&
                (r.historyItem && a.remove(r.historyItem),
                (r.historyItem = a.add({ perform: e.perform, negate: n })),
                (r.history = {
                  undo: function () {
                    return a.undo(r.historyItem);
                  },
                  redo: function () {
                    return a.redo(r.historyItem);
                  },
                }));
            }
          }));
      }));
  },
  15190,
  (e, t, r) => {
    'use strict';
    var n =
      (e.e && e.e.__importDefault) ||
      function (e) {
        return e && e.__esModule ? e : { default: e };
      };
    (Object.defineProperty(r, '__esModule', { value: !0 }), (r.ActionImpl = void 0));
    var a = n(e.r(53425)),
      i = e.r(97912),
      s = e.r(55227),
      o = function (e) {
        var t = e.keywords,
          r = e.section,
          n = void 0 === r ? '' : r;
        return ((void 0 === t ? '' : t) + ' ' + ('string' == typeof n ? n : n.name)).trim();
      };
    r.ActionImpl = (function () {
      function e(e, t) {
        var r,
          n = this;
        ((this.priority = s.Priority.NORMAL),
          (this.ancestors = []),
          (this.children = []),
          Object.assign(this, e),
          (this.id = e.id),
          (this.name = e.name),
          (this.keywords = o(e)));
        var u = e.perform;
        if (
          ((this.command =
            u &&
            new i.Command(
              {
                perform: function () {
                  return u(n);
                },
              },
              { history: t.history },
            )),
          (this.perform = null == (r = this.command) ? void 0 : r.perform),
          e.parent)
        ) {
          var l = t.store[e.parent];
          ((0, a.default)(
            l,
            'attempted to create an action whos parent: ' +
              e.parent +
              ' does not exist in the store.',
          ),
            l.addChild(this));
        }
      }
      return (
        (e.prototype.addChild = function (e) {
          e.ancestors.unshift(this);
          for (var t = this.parentActionImpl; t; )
            (e.ancestors.unshift(t), (t = t.parentActionImpl));
          this.children.push(e);
        }),
        (e.prototype.removeChild = function (e) {
          var t = this,
            r = this.children.indexOf(e);
          (-1 !== r && this.children.splice(r, 1),
            e.children &&
              e.children.forEach(function (e) {
                t.removeChild(e);
              }));
        }),
        Object.defineProperty(e.prototype, 'parentActionImpl', {
          get: function () {
            return this.ancestors[this.ancestors.length - 1];
          },
          enumerable: !1,
          configurable: !0,
        }),
        (e.create = function (t, r) {
          return new e(t, r);
        }),
        e
      );
    })();
  },
  15695,
  (e, t, r) => {
    'use strict';
    var n =
        (e.e && e.e.__assign) ||
        function () {
          return (n =
            Object.assign ||
            function (e) {
              for (var t, r = 1, n = arguments.length; r < n; r++)
                for (var a in (t = arguments[r]))
                  Object.prototype.hasOwnProperty.call(t, a) && (e[a] = t[a]);
              return e;
            }).apply(this, arguments);
        },
      a =
        (e.e && e.e.__importDefault) ||
        function (e) {
          return e && e.__esModule ? e : { default: e };
        };
    (Object.defineProperty(r, '__esModule', { value: !0 }), (r.ActionInterface = void 0));
    var i = a(e.r(53425)),
      s = e.r(15190);
    r.ActionInterface = (function () {
      function e(e, t) {
        (void 0 === e && (e = []),
          void 0 === t && (t = {}),
          (this.actions = {}),
          (this.options = t),
          this.add(e));
      }
      return (
        (e.prototype.add = function (e) {
          for (var t = 0; t < e.length; t++) {
            var r = e[t];
            (r.parent &&
              (0, i.default)(
                this.actions[r.parent],
                'Attempted to create action "' +
                  r.name +
                  '" without registering its parent "' +
                  r.parent +
                  '" first.',
              ),
              (this.actions[r.id] = s.ActionImpl.create(r, {
                history: this.options.historyManager,
                store: this.actions,
              })));
          }
          return n({}, this.actions);
        }),
        (e.prototype.remove = function (e) {
          var t = this;
          return (
            e.forEach(function (e) {
              var r = t.actions[e.id];
              if (r) {
                for (var n = r.children; n.length; ) {
                  var a = n.pop();
                  if (!a) return;
                  (delete t.actions[a.id],
                    a.parentActionImpl && a.parentActionImpl.removeChild(a),
                    a.children && n.push.apply(n, a.children));
                }
                (r.parentActionImpl && r.parentActionImpl.removeChild(r), delete t.actions[e.id]);
              }
            }),
            n({}, this.actions)
          );
        }),
        e
      );
    })();
  },
  31263,
  (e, t, r) => {
    'use strict';
    (Object.defineProperty(r, '__esModule', { value: !0 }),
      (r.history = r.HistoryItemImpl = void 0));
    var n = e.r(55227),
      a = (function () {
        function e(e) {
          ((this.perform = e.perform), (this.negate = e.negate));
        }
        return (
          (e.create = function (t) {
            return new e(t);
          }),
          e
        );
      })();
    r.HistoryItemImpl = a;
    var i = new ((function () {
      function e() {
        return (
          (this.undoStack = []),
          (this.redoStack = []),
          e.instance || ((e.instance = this), this.init()),
          e.instance
        );
      }
      return (
        (e.prototype.init = function () {
          var e = this;
          'u' > typeof window &&
            window.addEventListener('keydown', function (t) {
              if (
                !((!e.redoStack.length && !e.undoStack.length) || (0, n.shouldRejectKeystrokes)())
              ) {
                var r,
                  a = null == (r = t.key) ? void 0 : r.toLowerCase();
                t.metaKey && 'z' === a && t.shiftKey
                  ? e.redo()
                  : t.metaKey && 'z' === a && e.undo();
              }
            });
        }),
        (e.prototype.add = function (e) {
          var t = a.create(e);
          return (this.undoStack.push(t), t);
        }),
        (e.prototype.remove = function (e) {
          var t = this.undoStack.findIndex(function (t) {
            return t === e;
          });
          if (-1 !== t) return void this.undoStack.splice(t, 1);
          var r = this.redoStack.findIndex(function (t) {
            return t === e;
          });
          -1 !== r && this.redoStack.splice(r, 1);
        }),
        (e.prototype.undo = function (e) {
          if (!e) {
            var t = this.undoStack.pop();
            if (!t) return;
            return (null == t || t.negate(), this.redoStack.push(t), t);
          }
          var r = this.undoStack.findIndex(function (t) {
            return t === e;
          });
          if (-1 !== r) return (this.undoStack.splice(r, 1), e.negate(), this.redoStack.push(e), e);
        }),
        (e.prototype.redo = function (e) {
          if (!e) {
            var t = this.redoStack.pop();
            if (!t) return;
            return (null == t || t.perform(), this.undoStack.push(t), t);
          }
          var r = this.redoStack.findIndex(function (t) {
            return t === e;
          });
          if (-1 !== r)
            return (this.redoStack.splice(r, 1), e.perform(), this.undoStack.push(e), e);
        }),
        (e.prototype.reset = function () {
          (this.undoStack.splice(0), this.redoStack.splice(0));
        }),
        e
      );
    })())();
    ((r.history = i), Object.freeze(i));
  },
  98740,
  (e, t, r) => {
    'use strict';
    var n;
    (Object.defineProperty(r, '__esModule', { value: !0 }),
      (r.VisualState = void 0),
      ((n = r.VisualState || (r.VisualState = {})).animatingIn = 'animating-in'),
      (n.showing = 'showing'),
      (n.animatingOut = 'animating-out'),
      (n.hidden = 'hidden'));
  },
  96512,
  (e, t, r) => {
    'use strict';
    var n =
        (e.e && e.e.__assign) ||
        function () {
          return (n =
            Object.assign ||
            function (e) {
              for (var t, r = 1, n = arguments.length; r < n; r++)
                for (var a in (t = arguments[r]))
                  Object.prototype.hasOwnProperty.call(t, a) && (e[a] = t[a]);
              return e;
            }).apply(this, arguments);
        },
      a =
        (e.e && e.e.__createBinding) ||
        (Object.create
          ? function (e, t, r, n) {
              (void 0 === n && (n = r),
                Object.defineProperty(e, n, {
                  enumerable: !0,
                  get: function () {
                    return t[r];
                  },
                }));
            }
          : function (e, t, r, n) {
              (void 0 === n && (n = r), (e[n] = t[r]));
            }),
      i =
        (e.e && e.e.__setModuleDefault) ||
        (Object.create
          ? function (e, t) {
              Object.defineProperty(e, 'default', { enumerable: !0, value: t });
            }
          : function (e, t) {
              e.default = t;
            }),
      s =
        (e.e && e.e.__importStar) ||
        function (e) {
          if (e && e.__esModule) return e;
          var t = {};
          if (null != e)
            for (var r in e)
              'default' !== r && Object.prototype.hasOwnProperty.call(e, r) && a(t, e, r);
          return (i(t, e), t);
        },
      o =
        (e.e && e.e.__importDefault) ||
        function (e) {
          return e && e.__esModule ? e : { default: e };
        };
    (Object.defineProperty(r, '__esModule', { value: !0 }), (r.useStore = void 0));
    var u = e.r(53083),
      l = s(e.r(61129)),
      c = o(e.r(53425)),
      d = e.r(15695),
      f = e.r(31263),
      p = e.r(98740);
    r.useStore = function (e) {
      var t = l.useRef(n({ animations: { enterMs: 200, exitMs: 100 } }, e.options)),
        r = l.useMemo(function () {
          return new d.ActionInterface(e.actions || [], {
            historyManager: t.current.enableHistory ? f.history : void 0,
          });
        }, []),
        a = l.useState({
          searchQuery: '',
          currentRootActionId: null,
          visualState: p.VisualState.hidden,
          actions: n({}, r.actions),
          activeIndex: 0,
        }),
        i = a[0],
        s = a[1],
        o = l.useRef(i);
      o.current = i;
      var u = l.useCallback(function () {
          return o.current;
        }, []),
        m = l.useMemo(
          function () {
            return new h(u);
          },
          [u],
        );
      l.useEffect(
        function () {
          ((o.current = i), m.notify());
        },
        [i, m],
      );
      var v = l.useCallback(
          function (e) {
            return (
              s(function (t) {
                return n(n({}, t), { actions: r.add(e) });
              }),
              function () {
                s(function (t) {
                  return n(n({}, t), { actions: r.remove(e) });
                });
              }
            );
          },
          [r],
        ),
        g = l.useRef(null);
      return l.useMemo(
        function () {
          return {
            getState: u,
            query: {
              setCurrentRootAction: function (e) {
                s(function (t) {
                  return n(n({}, t), { currentRootActionId: e });
                });
              },
              setVisualState: function (e) {
                s(function (t) {
                  return n(n({}, t), {
                    visualState: 'function' == typeof e ? e(t.visualState) : e,
                  });
                });
              },
              setSearch: function (e) {
                return s(function (t) {
                  return n(n({}, t), { searchQuery: e });
                });
              },
              registerActions: v,
              toggle: function () {
                return s(function (e) {
                  return n(n({}, e), {
                    visualState: [p.VisualState.animatingOut, p.VisualState.hidden].includes(
                      e.visualState,
                    )
                      ? p.VisualState.animatingIn
                      : p.VisualState.animatingOut,
                  });
                });
              },
              setActiveIndex: function (e) {
                return s(function (t) {
                  return n(n({}, t), { activeIndex: 'number' == typeof e ? e : e(t.activeIndex) });
                });
              },
              inputRefSetter: function (e) {
                g.current = e;
              },
              getInput: function () {
                return (
                  (0, c.default)(
                    g.current,
                    'Input is undefined, make sure you apple `query.inputRefSetter` to your search input.',
                  ),
                  g.current
                );
              },
            },
            options: t.current,
            subscribe: function (e, t) {
              return m.subscribe(e, t);
            },
          };
        },
        [u, m, v],
      );
    };
    var h = (function () {
        function e(e) {
          ((this.subscribers = []), (this.getState = e));
        }
        return (
          (e.prototype.subscribe = function (e, t) {
            var r = this,
              n = new m(function () {
                return e(r.getState());
              }, t);
            return (this.subscribers.push(n), this.unsubscribe.bind(this, n));
          }),
          (e.prototype.unsubscribe = function (e) {
            if (this.subscribers.length) {
              var t = this.subscribers.indexOf(e);
              if (t > -1) return this.subscribers.splice(t, 1);
            }
          }),
          (e.prototype.notify = function () {
            this.subscribers.forEach(function (e) {
              return e.collect();
            });
          }),
          e
        );
      })(),
      m = (function () {
        function e(e, t) {
          ((this.collector = e), (this.onChange = t));
        }
        return (
          (e.prototype.collect = function () {
            try {
              var e = this.collector();
              !(0, u.deepEqual)(e, this.collected) &&
                ((this.collected = e), this.onChange && this.onChange(this.collected));
            } catch (e) {
              console.warn(e);
            }
          }),
          e
        );
      })();
  },
  67695,
  (e, t, r) => {
    'use strict';
    Object.defineProperty(r, '__esModule', { value: !0 });
    var n = ['Shift', 'Meta', 'Alt', 'Control'],
      a =
        'object' == typeof navigator && /Mac|iPod|iPhone|iPad/.test(navigator.platform)
          ? 'Meta'
          : 'Control';
    function i(e, t) {
      return 'function' == typeof e.getModifierState && e.getModifierState(t);
    }
    r.default = function (e, t, r) {
      void 0 === r && (r = {});
      var s,
        o,
        u = null != (s = r.timeout) ? s : 1e3,
        l = null != (o = r.event) ? o : 'keydown',
        c = Object.keys(t).map(function (e) {
          return [
            e
              .trim()
              .split(' ')
              .map(function (e) {
                var t = e.split(/\b\+/),
                  r = t.pop();
                return [
                  (t = t.map(function (e) {
                    return '$mod' === e ? a : e;
                  })),
                  r,
                ];
              }),
            t[e],
          ];
        }),
        d = new Map(),
        f = null,
        p = function (e) {
          e instanceof KeyboardEvent &&
            (c.forEach(function (t) {
              var r = t[0],
                a = t[1],
                s = d.get(r) || r,
                o = s[0];
              (/^[^A-Za-z0-9]$/.test(e.key) && o[1] === e.key) ||
              !(
                (o[1].toUpperCase() !== e.key.toUpperCase() && o[1] !== e.code) ||
                o[0].find(function (t) {
                  return !i(e, t);
                }) ||
                n.find(function (t) {
                  return !o[0].includes(t) && o[1] !== t && i(e, t);
                })
              )
                ? s.length > 1
                  ? d.set(r, s.slice(1))
                  : (d.delete(r), a(e))
                : i(e, e.key) || d.delete(r);
            }),
            f && clearTimeout(f),
            (f = setTimeout(d.clear.bind(d), u)));
        };
      return (
        e.addEventListener(l, p),
        function () {
          e.removeEventListener(l, p);
        }
      );
    };
  },
  73345,
  (e, t, r) => {
    'use strict';
    var n =
        (e.e && e.e.__createBinding) ||
        (Object.create
          ? function (e, t, r, n) {
              (void 0 === n && (n = r),
                Object.defineProperty(e, n, {
                  enumerable: !0,
                  get: function () {
                    return t[r];
                  },
                }));
            }
          : function (e, t, r, n) {
              (void 0 === n && (n = r), (e[n] = t[r]));
            }),
      a =
        (e.e && e.e.__setModuleDefault) ||
        (Object.create
          ? function (e, t) {
              Object.defineProperty(e, 'default', { enumerable: !0, value: t });
            }
          : function (e, t) {
              e.default = t;
            }),
      i =
        (e.e && e.e.__importStar) ||
        function (e) {
          if (e && e.__esModule) return e;
          var t = {};
          if (null != e)
            for (var r in e)
              'default' !== r && Object.prototype.hasOwnProperty.call(e, r) && n(t, e, r);
          return (a(t, e), t);
        },
      s =
        (e.e && e.e.__importDefault) ||
        function (e) {
          return e && e.__esModule ? e : { default: e };
        };
    (Object.defineProperty(r, '__esModule', { value: !0 }), (r.InternalEvents = void 0));
    var o = i(e.r(61129)),
      u = s(e.r(67695)),
      l = e.r(98740),
      c = e.r(36949),
      d = e.r(55227);
    r.InternalEvents = function () {
      var e, t, r, n, a, i, s, p, h, m, v, g, y, _, b, x, w, k, O, S, j, A;
      return (
        (n = (r = (0, c.useKBar)(function (e) {
          return { visualState: e.visualState, showing: e.visualState !== l.VisualState.hidden };
        })).query),
        (a = r.options),
        (i = r.visualState),
        (s = r.showing),
        o.useEffect(
          function () {
            var e,
              t = a.toggleShortcut || '$mod+k',
              r = (0, u.default)(
                window,
                (((e = {})[t] = function (e) {
                  var t, r, i, o;
                  e.defaultPrevented ||
                    (e.preventDefault(),
                    n.toggle(),
                    s
                      ? null == (r = null == (t = a.callbacks) ? void 0 : t.onClose) || r.call(t)
                      : null == (o = null == (i = a.callbacks) ? void 0 : i.onOpen) || o.call(i));
                }),
                (e.Escape = function (e) {
                  var t, r;
                  (s &&
                    (e.stopPropagation(),
                    e.preventDefault(),
                    null == (r = null == (t = a.callbacks) ? void 0 : t.onClose) || r.call(t)),
                    n.setVisualState(function (e) {
                      return e === l.VisualState.hidden || e === l.VisualState.animatingOut
                        ? e
                        : l.VisualState.animatingOut;
                    }));
                }),
                e),
              );
            return function () {
              r();
            };
          },
          [a.callbacks, a.toggleShortcut, n, s],
        ),
        (p = o.useRef()),
        (h = o.useCallback(
          function (e) {
            var t,
              r,
              i = 0;
            (e === l.VisualState.animatingIn &&
              (i = (null == (t = a.animations) ? void 0 : t.enterMs) || 0),
              e === l.VisualState.animatingOut &&
                (i = (null == (r = a.animations) ? void 0 : r.exitMs) || 0),
              clearTimeout(p.current),
              (p.current = setTimeout(function () {
                var t = !1;
                (n.setVisualState(function () {
                  var r =
                    e === l.VisualState.animatingIn ? l.VisualState.showing : l.VisualState.hidden;
                  return (r === l.VisualState.hidden && (t = !0), r);
                }),
                  t && n.setCurrentRootAction(null));
              }, i)));
          },
          [
            null == (e = a.animations) ? void 0 : e.enterMs,
            null == (t = a.animations) ? void 0 : t.exitMs,
            n,
          ],
        )),
        o.useEffect(
          function () {
            switch (i) {
              case l.VisualState.animatingIn:
              case l.VisualState.animatingOut:
                h(i);
            }
          },
          [h, i],
        ),
        (v = (m = (0, c.useKBar)(function (e) {
          return { visualState: e.visualState };
        })).visualState),
        (g = m.options),
        o.useEffect(
          function () {
            if (!g.disableDocumentLock)
              if (v === l.VisualState.animatingIn) {
                if (((document.body.style.overflow = 'hidden'), !g.disableScrollbarManagement)) {
                  var e = (0, d.getScrollbarWidth)(),
                    t = getComputedStyle(document.body)['margin-right'];
                  (t && (e += Number(t.replace(/\D/g, ''))),
                    (document.body.style.marginRight = e + 'px'));
                }
              } else
                v === l.VisualState.hidden &&
                  (document.body.style.removeProperty('overflow'),
                  g.disableScrollbarManagement ||
                    document.body.style.removeProperty('margin-right'));
          },
          [g.disableDocumentLock, g.disableScrollbarManagement, v],
        ),
        (_ = (y = (0, c.useKBar)(function (e) {
          return { actions: e.actions, open: e.visualState === l.VisualState.showing };
        })).actions),
        (b = y.query),
        (x = y.open),
        (w = y.options),
        o.useEffect(
          function () {
            if (!x) {
              for (
                var e,
                  t = Object.keys(_).map(function (e) {
                    return _[e];
                  }),
                  r = [],
                  n = 0;
                n < t.length;
                n++
              ) {
                var a = t[n];
                (null == (e = a.shortcut) ? void 0 : e.length) && r.push(a);
              }
              r = r.sort(function (e, t) {
                return t.shortcut.join(' ').length - e.shortcut.join(' ').length;
              });
              for (
                var i = {},
                  s = function (e) {
                    var t;
                    i[e.shortcut.join(' ')] =
                      ((t = function (t) {
                        var r, n, a, i, s, o;
                        (0, d.shouldRejectKeystrokes)() ||
                          (t.preventDefault(),
                          (null == (r = e.children) ? void 0 : r.length)
                            ? (b.setCurrentRootAction(e.id),
                              b.toggle(),
                              null == (a = null == (n = w.callbacks) ? void 0 : n.onOpen) ||
                                a.call(n))
                            : (null == (i = e.command) || i.perform(),
                              null == (o = null == (s = w.callbacks) ? void 0 : s.onSelectAction) ||
                                o.call(s, e)));
                      }),
                      function (e) {
                        f.has(e) || (t(e), f.add(e));
                      });
                  },
                  o = 0,
                  l = r;
                o < l.length;
                o++
              ) {
                var a = l[o];
                s(a);
              }
              var c = (0, u.default)(window, i, { timeout: 400 });
              return function () {
                c();
              };
            }
          },
          [_, x, w.callbacks, b],
        ),
        (k = o.useRef(!0)),
        (S = (O = (0, c.useKBar)(function (e) {
          return {
            isShowing:
              e.visualState === l.VisualState.showing ||
              e.visualState === l.VisualState.animatingIn,
          };
        })).isShowing),
        (j = O.query),
        (A = o.useRef(null)),
        o.useEffect(
          function () {
            if (k.current) {
              k.current = !1;
              return;
            }
            if (S) {
              A.current = document.activeElement;
              return;
            }
            var e = document.activeElement;
            (null == e ? void 0 : e.tagName.toLowerCase()) === 'input' && e.blur();
            var t = A.current;
            t && t !== e && t.focus();
          },
          [S],
        ),
        o.useEffect(
          function () {
            function e(e) {
              var t = j.getInput();
              e.target !== t && t.focus();
            }
            if (S)
              return (
                window.addEventListener('keydown', e),
                function () {
                  window.removeEventListener('keydown', e);
                }
              );
          },
          [S, j],
        ),
        null
      );
    };
    var f = new WeakSet();
  },
  94196,
  (e, t, r) => {
    'use strict';
    var n =
        (e.e && e.e.__createBinding) ||
        (Object.create
          ? function (e, t, r, n) {
              (void 0 === n && (n = r),
                Object.defineProperty(e, n, {
                  enumerable: !0,
                  get: function () {
                    return t[r];
                  },
                }));
            }
          : function (e, t, r, n) {
              (void 0 === n && (n = r), (e[n] = t[r]));
            }),
      a =
        (e.e && e.e.__setModuleDefault) ||
        (Object.create
          ? function (e, t) {
              Object.defineProperty(e, 'default', { enumerable: !0, value: t });
            }
          : function (e, t) {
              e.default = t;
            }),
      i =
        (e.e && e.e.__importStar) ||
        function (e) {
          if (e && e.__esModule) return e;
          var t = {};
          if (null != e)
            for (var r in e)
              'default' !== r && Object.prototype.hasOwnProperty.call(e, r) && n(t, e, r);
          return (a(t, e), t);
        };
    (Object.defineProperty(r, '__esModule', { value: !0 }),
      (r.KBarProvider = r.KBarContext = void 0));
    var s = e.r(96512),
      o = i(e.r(61129)),
      u = e.r(73345);
    ((r.KBarContext = o.createContext({})),
      (r.KBarProvider = function (e) {
        var t = (0, s.useStore)(e);
        return o.createElement(
          r.KBarContext.Provider,
          { value: t },
          o.createElement(u.InternalEvents, null),
          e.children,
        );
      }));
  },
  36949,
  (e, t, r) => {
    'use strict';
    var n =
        (e.e && e.e.__assign) ||
        function () {
          return (n =
            Object.assign ||
            function (e) {
              for (var t, r = 1, n = arguments.length; r < n; r++)
                for (var a in (t = arguments[r]))
                  Object.prototype.hasOwnProperty.call(t, a) && (e[a] = t[a]);
              return e;
            }).apply(this, arguments);
        },
      a =
        (e.e && e.e.__createBinding) ||
        (Object.create
          ? function (e, t, r, n) {
              (void 0 === n && (n = r),
                Object.defineProperty(e, n, {
                  enumerable: !0,
                  get: function () {
                    return t[r];
                  },
                }));
            }
          : function (e, t, r, n) {
              (void 0 === n && (n = r), (e[n] = t[r]));
            }),
      i =
        (e.e && e.e.__setModuleDefault) ||
        (Object.create
          ? function (e, t) {
              Object.defineProperty(e, 'default', { enumerable: !0, value: t });
            }
          : function (e, t) {
              e.default = t;
            }),
      s =
        (e.e && e.e.__importStar) ||
        function (e) {
          if (e && e.__esModule) return e;
          var t = {};
          if (null != e)
            for (var r in e)
              'default' !== r && Object.prototype.hasOwnProperty.call(e, r) && a(t, e, r);
          return (i(t, e), t);
        };
    (Object.defineProperty(r, '__esModule', { value: !0 }), (r.useKBar = void 0));
    var o = s(e.r(61129)),
      u = e.r(94196);
    r.useKBar = function (e) {
      var t = o.useContext(u.KBarContext),
        r = t.query,
        a = t.getState,
        i = t.subscribe,
        s = t.options,
        l = o.useRef(null == e ? void 0 : e(a())),
        c = o.useRef(e),
        d = o.useCallback(
          function (e) {
            return n(n({}, e), { query: r, options: s });
          },
          [r, s],
        ),
        f = o.useState(d(l.current)),
        p = f[0],
        h = f[1];
      return (
        o.useEffect(
          function () {
            var e;
            return (
              c.current &&
                (e = i(
                  function (e) {
                    return c.current(e);
                  },
                  function (e) {
                    return h(d(e));
                  },
                )),
              function () {
                e && e();
              }
            );
          },
          [d, i],
        ),
        p
      );
    };
  },
  3390,
  (e, t, r) => {
    var n = /[\\\/\-_+.# \t"@\[\(\{&]/,
      a = /[\\\/\-_+.# \t"@\[\(\{&]/g;
    t.exports = function (e, t) {
      return (function e(t, r, i, s, o, u) {
        if (u === r.length) return o === t.length ? 1 : 0.99;
        for (var l, c, d, f = s.charAt(u), p = i.indexOf(f, o), h = 0; p >= 0; )
          ((l = e(t, r, i, s, p + 1, u + 1)) > h &&
            (p === o
              ? (l *= 1)
              : n.test(t.charAt(p - 1))
                ? ((l *= 0.9),
                  (d = t.slice(o, p - 1).match(a)) && o > 0 && (l *= Math.pow(0.999, d.length)))
                : (n.test(t.slice(o, p - 1)) ? (l *= 0) : (l *= 0.3),
                  o > 0 && (l *= Math.pow(0.999, p - o))),
            t.charAt(p) !== r.charAt(u) && (l *= 0.9999)),
            l < 0.1 &&
              i.charAt(p - 1) === s.charAt(u + 1) &&
              i.charAt(p - 1) !== s.charAt(u) &&
              0.1 * (c = e(t, r, i, s, p + 1, u + 2)) > l &&
              (l = 0.1 * c),
            l > h && (h = l),
            (p = i.indexOf(f, p + 1)));
        return h;
      })(e, t, e.toLowerCase(), t.toLowerCase(), 0, 0);
    };
  },
  6555,
  (e, t, r) => {
    'use strict';
    var n =
        (e.e && e.e.__createBinding) ||
        (Object.create
          ? function (e, t, r, n) {
              (void 0 === n && (n = r),
                Object.defineProperty(e, n, {
                  enumerable: !0,
                  get: function () {
                    return t[r];
                  },
                }));
            }
          : function (e, t, r, n) {
              (void 0 === n && (n = r), (e[n] = t[r]));
            }),
      a =
        (e.e && e.e.__setModuleDefault) ||
        (Object.create
          ? function (e, t) {
              Object.defineProperty(e, 'default', { enumerable: !0, value: t });
            }
          : function (e, t) {
              e.default = t;
            }),
      i =
        (e.e && e.e.__importStar) ||
        function (e) {
          if (e && e.__esModule) return e;
          var t = {};
          if (null != e)
            for (var r in e)
              'default' !== r && Object.prototype.hasOwnProperty.call(e, r) && n(t, e, r);
          return (a(t, e), t);
        },
      s =
        (e.e && e.e.__importDefault) ||
        function (e) {
          return e && e.__esModule ? e : { default: e };
        };
    (Object.defineProperty(r, '__esModule', { value: !0 }),
      (r.useDeepMatches = r.useMatches = r.NO_GROUP = void 0));
    var o = i(e.r(61129)),
      u = e.r(36949),
      l = e.r(55227),
      c = s(e.r(3390));
    function d(e, t) {
      return t.priority - e.priority;
    }
    function f() {
      var e,
        t,
        n,
        a,
        i,
        s,
        f = (0, u.useKBar)(function (e) {
          return { search: e.searchQuery, actions: e.actions, rootActionId: e.currentRootActionId };
        }),
        p = f.search,
        h = f.actions,
        m = f.rootActionId,
        v = o.useMemo(
          function () {
            return Object.keys(h)
              .reduce(function (e, t) {
                var r = h[t];
                if ((r.parent || m || e.push(r), r.id === m))
                  for (var n = 0; n < r.children.length; n++) e.push(r.children[n]);
                return e;
              }, [])
              .sort(d);
          },
          [h, m],
        ),
        g = o.useCallback(function (e) {
          for (var t = [], r = 0; r < e.length; r++) t.push(e[r]);
          return (function e(r, n) {
            void 0 === n && (n = t);
            for (var a = 0; a < r.length; a++)
              if (r[a].children.length > 0) {
                for (var i = r[a].children, s = 0; s < i.length; s++) n.push(i[s]);
                e(r[a].children, n);
              }
            return n;
          })(e);
        }, []),
        y = !p,
        _ =
          ((e = o.useMemo(
            function () {
              return y ? v : g(v);
            },
            [g, v, y],
          )),
          (t = p),
          (n = o.useMemo(
            function () {
              return { filtered: e, search: t };
            },
            [e, t],
          )),
          (i = (a = (0, l.useThrottledValue)(n)).filtered),
          (s = a.search),
          o.useMemo(
            function () {
              if ('' === s.trim())
                return i.map(function (e) {
                  return { score: 0, action: e };
                });
              for (var e = [], t = 0; t < i.length; t++) {
                var r = i[t],
                  n = (0, c.default)([r.name, r.keywords, r.subtitle].join(' '), s);
                n > 0 && e.push({ score: n, action: r });
              }
              return e;
            },
            [i, s],
          )),
        b = o.useMemo(
          function () {
            for (var e, t, n = {}, a = [], i = [], s = 0; s < _.length; s++) {
              var o = _[s],
                u = o.action,
                c = o.score || l.Priority.NORMAL,
                f = {
                  name:
                    'string' == typeof u.section
                      ? u.section
                      : (null == (e = u.section) ? void 0 : e.name) || r.NO_GROUP.name,
                  priority:
                    'string' == typeof u.section
                      ? c
                      : (null == (t = u.section) ? void 0 : t.priority) || 0 + c,
                };
              (n[f.name] || ((n[f.name] = []), a.push(f)),
                n[f.name].push({ priority: u.priority + c, action: u }));
            }
            i = a.sort(d).map(function (e) {
              return {
                name: e.name,
                actions: n[e.name].sort(d).map(function (e) {
                  return e.action;
                }),
              };
            });
            for (var p = [], s = 0; s < i.length; s++) {
              var h = i[s];
              h.name !== r.NO_GROUP.name && p.push(h.name);
              for (var m = 0; m < h.actions.length; m++) p.push(h.actions[m]);
            }
            return p;
          },
          [_],
        ),
        x = o.useMemo(
          function () {
            return m;
          },
          [b],
        );
      return o.useMemo(
        function () {
          return { results: b, rootActionId: x };
        },
        [x, b],
      );
    }
    ((r.NO_GROUP = { name: 'none', priority: l.Priority.NORMAL }),
      (r.useMatches = f),
      (r.useDeepMatches = f));
  },
  2969,
  (e, t, r) => {
    'use strict';
    let n, a, i;
    var s = Object.create,
      o = Object.defineProperty,
      u = Object.getOwnPropertyDescriptor,
      l = Object.getOwnPropertyNames,
      c = Object.getPrototypeOf,
      d = Object.prototype.hasOwnProperty,
      f = (e, t, r, n) => {
        if ((t && 'object' == typeof t) || 'function' == typeof t)
          for (let a of l(t))
            d.call(e, a) ||
              a === r ||
              o(e, a, { get: () => t[a], enumerable: !(n = u(t, a)) || n.enumerable });
        return e;
      },
      p = {},
      h = { composeRefs: () => y, useComposedRefs: () => _ };
    for (var m in h) o(p, m, { get: h[m], enumerable: !0 });
    t.exports = f(o({}, '__esModule', { value: !0 }), p);
    var v =
      ((i = null != (n = e.r(61129)) ? s(c(n)) : {}),
      f(!a && n && n.__esModule ? i : o(i, 'default', { value: n, enumerable: !0 }), n));
    function g(e, t) {
      if ('function' == typeof e) return e(t);
      null != e && (e.current = t);
    }
    function y(...e) {
      return (t) => {
        let r = !1,
          n = e.map((e) => {
            let n = g(e, t);
            return (r || 'function' != typeof n || (r = !0), n);
          });
        if (r)
          return () => {
            for (let t = 0; t < n.length; t++) {
              let r = n[t];
              'function' == typeof r ? r() : g(e[t], null);
            }
          };
      };
    }
    function _(...e) {
      return v.useCallback(y(...e), e);
    }
  },
  94871,
  (e, t, r) => {
    'use strict';
    let n, a, i;
    var s = Object.create,
      o = Object.defineProperty,
      u = Object.getOwnPropertyDescriptor,
      l = Object.getOwnPropertyNames,
      c = Object.getPrototypeOf,
      d = Object.prototype.hasOwnProperty,
      f = (e, t, r, n) => {
        if ((t && 'object' == typeof t) || 'function' == typeof t)
          for (let a of l(t))
            d.call(e, a) ||
              a === r ||
              o(e, a, { get: () => t[a], enumerable: !(n = u(t, a)) || n.enumerable });
        return e;
      },
      p = {},
      h = {
        Root: () => b,
        Slot: () => b,
        Slottable: () => k,
        createSlot: () => _,
        createSlottable: () => w,
      };
    for (var m in h) o(p, m, { get: h[m], enumerable: !0 });
    t.exports = f(o({}, '__esModule', { value: !0 }), p);
    var v =
        ((i = null != (n = e.r(61129)) ? s(c(n)) : {}),
        f(!a && n && n.__esModule ? i : o(i, 'default', { value: n, enumerable: !0 }), n)),
      g = e.r(2969),
      y = e.r(37479);
    function _(e) {
      var t;
      let r,
        n =
          ((t = e),
          ((r = v.forwardRef((e, t) => {
            let { children: r, ...n } = e;
            if (v.isValidElement(r)) {
              var a;
              let e,
                i,
                s =
                  ((a = r),
                  (i =
                    (e = Object.getOwnPropertyDescriptor(a.props, 'ref')?.get) &&
                    'isReactWarning' in e &&
                    e.isReactWarning)
                    ? a.ref
                    : (i =
                          (e = Object.getOwnPropertyDescriptor(a, 'ref')?.get) &&
                          'isReactWarning' in e &&
                          e.isReactWarning)
                      ? a.props.ref
                      : a.props.ref || a.ref),
                o = (function (e, t) {
                  let r = { ...t };
                  for (let n in t) {
                    let a = e[n],
                      i = t[n];
                    /^on[A-Z]/.test(n)
                      ? a && i
                        ? (r[n] = (...e) => {
                            let t = i(...e);
                            return (a(...e), t);
                          })
                        : a && (r[n] = a)
                      : 'style' === n
                        ? (r[n] = { ...a, ...i })
                        : 'className' === n && (r[n] = [a, i].filter(Boolean).join(' '));
                  }
                  return { ...e, ...r };
                })(n, r.props);
              return (
                r.type !== v.Fragment && (o.ref = t ? (0, g.composeRefs)(t, s) : s),
                v.cloneElement(r, o)
              );
            }
            return v.Children.count(r) > 1 ? v.Children.only(null) : null;
          })).displayName = `${t}.SlotClone`),
          r),
        a = v.forwardRef((e, t) => {
          let { children: r, ...a } = e,
            i = v.Children.toArray(r),
            s = i.find(O);
          if (s) {
            let e = s.props.children,
              r = i.map((t) =>
                t !== s
                  ? t
                  : v.Children.count(e) > 1
                    ? v.Children.only(null)
                    : v.isValidElement(e)
                      ? e.props.children
                      : null,
              );
            return (0, y.jsx)(n, {
              ...a,
              ref: t,
              children: v.isValidElement(e) ? v.cloneElement(e, void 0, r) : null,
            });
          }
          return (0, y.jsx)(n, { ...a, ref: t, children: r });
        });
      return ((a.displayName = `${e}.Slot`), a);
    }
    var b = _('Slot'),
      x = Symbol('radix.slottable');
    function w(e) {
      let t = ({ children: e }) => (0, y.jsx)(y.Fragment, { children: e });
      return ((t.displayName = `${e}.Slottable`), (t.__radixId = x), t);
    }
    var k = w('Slottable');
    function O(e) {
      return (
        v.isValidElement(e) &&
        'function' == typeof e.type &&
        '__radixId' in e.type &&
        e.type.__radixId === x
      );
    }
  },
  62112,
  (e, t, r) => {
    'use strict';
    var n = Object.create,
      a = Object.defineProperty,
      i = Object.getOwnPropertyDescriptor,
      s = Object.getOwnPropertyNames,
      o = Object.getPrototypeOf,
      u = Object.prototype.hasOwnProperty,
      l = (e, t, r, n) => {
        if ((t && 'object' == typeof t) || 'function' == typeof t)
          for (let o of s(t))
            u.call(e, o) ||
              o === r ||
              a(e, o, { get: () => t[o], enumerable: !(n = i(t, o)) || n.enumerable });
        return e;
      },
      c = (e, t, r) => (
        (r = null != e ? n(o(e)) : {}),
        l(!t && e && e.__esModule ? r : a(r, 'default', { value: e, enumerable: !0 }), e)
      ),
      d = {},
      f = { Primitive: () => y, Root: () => b, dispatchDiscreteCustomEvent: () => _ };
    for (var p in f) a(d, p, { get: f[p], enumerable: !0 });
    t.exports = l(a({}, '__esModule', { value: !0 }), d);
    var h = c(e.r(61129)),
      m = c(e.r(7473)),
      v = e.r(94871),
      g = e.r(37479),
      y = [
        'a',
        'button',
        'div',
        'form',
        'h2',
        'h3',
        'img',
        'input',
        'label',
        'li',
        'nav',
        'ol',
        'p',
        'select',
        'span',
        'svg',
        'ul',
      ].reduce((e, t) => {
        let r = (0, v.createSlot)(`Primitive.${t}`),
          n = h.forwardRef((e, n) => {
            let { asChild: a, ...i } = e;
            return (
              'u' > typeof window && (window[Symbol.for('radix-ui')] = !0),
              (0, g.jsx)(a ? r : t, { ...i, ref: n })
            );
          });
        return ((n.displayName = `Primitive.${t}`), { ...e, [t]: n });
      }, {});
    function _(e, t) {
      e && m.flushSync(() => e.dispatchEvent(t));
    }
    var b = y;
  },
  24738,
  (e, t, r) => {
    'use strict';
    let n, a, i;
    var s = Object.create,
      o = Object.defineProperty,
      u = Object.getOwnPropertyDescriptor,
      l = Object.getOwnPropertyNames,
      c = Object.getPrototypeOf,
      d = Object.prototype.hasOwnProperty,
      f = (e, t, r, n) => {
        if ((t && 'object' == typeof t) || 'function' == typeof t)
          for (let a of l(t))
            d.call(e, a) ||
              a === r ||
              o(e, a, { get: () => t[a], enumerable: !(n = u(t, a)) || n.enumerable });
        return e;
      },
      p = {},
      h = { useLayoutEffect: () => g };
    for (var m in h) o(p, m, { get: h[m], enumerable: !0 });
    t.exports = f(o({}, '__esModule', { value: !0 }), p);
    var v =
        ((i = null != (n = e.r(61129)) ? s(c(n)) : {}),
        f(!a && n && n.__esModule ? i : o(i, 'default', { value: n, enumerable: !0 }), n)),
      g = globalThis?.document ? v.useLayoutEffect : () => {};
  },
  46738,
  (e, t, r) => {
    'use strict';
    var n = Object.create,
      a = Object.defineProperty,
      i = Object.getOwnPropertyDescriptor,
      s = Object.getOwnPropertyNames,
      o = Object.getPrototypeOf,
      u = Object.prototype.hasOwnProperty,
      l = (e, t, r, n) => {
        if ((t && 'object' == typeof t) || 'function' == typeof t)
          for (let o of s(t))
            u.call(e, o) ||
              o === r ||
              a(e, o, { get: () => t[o], enumerable: !(n = i(t, o)) || n.enumerable });
        return e;
      },
      c = (e, t, r) => (
        (r = null != e ? n(o(e)) : {}),
        l(!t && e && e.__esModule ? r : a(r, 'default', { value: e, enumerable: !0 }), e)
      ),
      d = {},
      f = { Portal: () => _, Root: () => b };
    for (var p in f) a(d, p, { get: f[p], enumerable: !0 });
    t.exports = l(a({}, '__esModule', { value: !0 }), d);
    var h = c(e.r(61129)),
      m = c(e.r(7473)),
      v = e.r(62112),
      g = e.r(24738),
      y = e.r(37479),
      _ = h.forwardRef((e, t) => {
        let { container: r, ...n } = e,
          [a, i] = h.useState(!1);
        (0, g.useLayoutEffect)(() => i(!0), []);
        let s = r || (a && globalThis?.document?.body);
        return s ? m.default.createPortal((0, y.jsx)(v.Primitive.div, { ...n, ref: t }), s) : null;
      });
    _.displayName = 'Portal';
    var b = _;
  },
  41276,
  (e, t, r) => {
    'use strict';
    var n =
        (e.e && e.e.__createBinding) ||
        (Object.create
          ? function (e, t, r, n) {
              (void 0 === n && (n = r),
                Object.defineProperty(e, n, {
                  enumerable: !0,
                  get: function () {
                    return t[r];
                  },
                }));
            }
          : function (e, t, r, n) {
              (void 0 === n && (n = r), (e[n] = t[r]));
            }),
      a =
        (e.e && e.e.__setModuleDefault) ||
        (Object.create
          ? function (e, t) {
              Object.defineProperty(e, 'default', { enumerable: !0, value: t });
            }
          : function (e, t) {
              e.default = t;
            }),
      i =
        (e.e && e.e.__importStar) ||
        function (e) {
          if (e && e.__esModule) return e;
          var t = {};
          if (null != e)
            for (var r in e)
              'default' !== r && Object.prototype.hasOwnProperty.call(e, r) && n(t, e, r);
          return (a(t, e), t);
        };
    (Object.defineProperty(r, '__esModule', { value: !0 }), (r.KBarPortal = void 0));
    var s = e.r(46738),
      o = i(e.r(61129)),
      u = e.r(98740),
      l = e.r(36949);
    r.KBarPortal = function (e) {
      return (0, l.useKBar)(function (e) {
        return { showing: e.visualState !== u.VisualState.hidden };
      }).showing
        ? o.createElement(s.Portal, null, e.children)
        : null;
    };
  },
  5651,
  (e, t, r) => {
    'use strict';
    var n =
        (e.e && e.e.__assign) ||
        function () {
          return (n =
            Object.assign ||
            function (e) {
              for (var t, r = 1, n = arguments.length; r < n; r++)
                for (var a in (t = arguments[r]))
                  Object.prototype.hasOwnProperty.call(t, a) && (e[a] = t[a]);
              return e;
            }).apply(this, arguments);
        },
      a =
        (e.e && e.e.__createBinding) ||
        (Object.create
          ? function (e, t, r, n) {
              (void 0 === n && (n = r),
                Object.defineProperty(e, n, {
                  enumerable: !0,
                  get: function () {
                    return t[r];
                  },
                }));
            }
          : function (e, t, r, n) {
              (void 0 === n && (n = r), (e[n] = t[r]));
            }),
      i =
        (e.e && e.e.__setModuleDefault) ||
        (Object.create
          ? function (e, t) {
              Object.defineProperty(e, 'default', { enumerable: !0, value: t });
            }
          : function (e, t) {
              e.default = t;
            }),
      s =
        (e.e && e.e.__importStar) ||
        function (e) {
          if (e && e.__esModule) return e;
          var t = {};
          if (null != e)
            for (var r in e)
              'default' !== r && Object.prototype.hasOwnProperty.call(e, r) && a(t, e, r);
          return (i(t, e), t);
        },
      o =
        (e.e && e.e.__rest) ||
        function (e, t) {
          var r = {};
          for (var n in e)
            Object.prototype.hasOwnProperty.call(e, n) && 0 > t.indexOf(n) && (r[n] = e[n]);
          if (null != e && 'function' == typeof Object.getOwnPropertySymbols)
            for (var a = 0, n = Object.getOwnPropertySymbols(e); a < n.length; a++)
              0 > t.indexOf(n[a]) &&
                Object.prototype.propertyIsEnumerable.call(e, n[a]) &&
                (r[n[a]] = e[n[a]]);
          return r;
        };
    (Object.defineProperty(r, '__esModule', { value: !0 }), (r.KBarPositioner = void 0));
    var u = s(e.r(61129)),
      l = {
        position: 'fixed',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        width: '100%',
        inset: '0px',
        padding: '14vh 16px 16px',
      };
    r.KBarPositioner = u.forwardRef(function (e, t) {
      var r = e.style,
        a = e.children,
        i = o(e, ['style', 'children']);
      return u.createElement('div', n({ ref: t, style: r ? n(n({}, l), r) : l }, i), a);
    });
  },
  39281,
  (e, t, r) => {
    'use strict';
    var n =
        (e.e && e.e.__assign) ||
        function () {
          return (n =
            Object.assign ||
            function (e) {
              for (var t, r = 1, n = arguments.length; r < n; r++)
                for (var a in (t = arguments[r]))
                  Object.prototype.hasOwnProperty.call(t, a) && (e[a] = t[a]);
              return e;
            }).apply(this, arguments);
        },
      a =
        (e.e && e.e.__createBinding) ||
        (Object.create
          ? function (e, t, r, n) {
              (void 0 === n && (n = r),
                Object.defineProperty(e, n, {
                  enumerable: !0,
                  get: function () {
                    return t[r];
                  },
                }));
            }
          : function (e, t, r, n) {
              (void 0 === n && (n = r), (e[n] = t[r]));
            }),
      i =
        (e.e && e.e.__setModuleDefault) ||
        (Object.create
          ? function (e, t) {
              Object.defineProperty(e, 'default', { enumerable: !0, value: t });
            }
          : function (e, t) {
              e.default = t;
            }),
      s =
        (e.e && e.e.__importStar) ||
        function (e) {
          if (e && e.__esModule) return e;
          var t = {};
          if (null != e)
            for (var r in e)
              'default' !== r && Object.prototype.hasOwnProperty.call(e, r) && a(t, e, r);
          return (i(t, e), t);
        },
      o =
        (e.e && e.e.__rest) ||
        function (e, t) {
          var r = {};
          for (var n in e)
            Object.prototype.hasOwnProperty.call(e, n) && 0 > t.indexOf(n) && (r[n] = e[n]);
          if (null != e && 'function' == typeof Object.getOwnPropertySymbols)
            for (var a = 0, n = Object.getOwnPropertySymbols(e); a < n.length; a++)
              0 > t.indexOf(n[a]) &&
                Object.prototype.propertyIsEnumerable.call(e, n[a]) &&
                (r[n[a]] = e[n[a]]);
          return r;
        };
    (Object.defineProperty(r, '__esModule', { value: !0 }),
      (r.KBarSearch = r.getListboxItemId = r.KBAR_LISTBOX = void 0));
    var u = s(e.r(61129)),
      l = e.r(98740),
      c = e.r(36949);
    ((r.KBAR_LISTBOX = 'kbar-listbox'),
      (r.getListboxItemId = function (e) {
        return 'kbar-listbox-item-' + e;
      }),
      (r.KBarSearch = function (e) {
        var t = (0, c.useKBar)(function (e) {
            return {
              search: e.searchQuery,
              currentRootActionId: e.currentRootActionId,
              actions: e.actions,
              activeIndex: e.activeIndex,
              showing: e.visualState === l.VisualState.showing,
            };
          }),
          a = t.query,
          i = t.search,
          s = t.actions,
          d = t.currentRootActionId,
          f = t.activeIndex,
          p = t.showing,
          h = t.options,
          m = e.defaultPlaceholder,
          v = o(e, ['defaultPlaceholder']);
        u.useEffect(
          function () {
            return (
              a.setSearch(''),
              a.getInput().focus(),
              function () {
                return a.setSearch('');
              }
            );
          },
          [d, a],
        );
        var g = u.useMemo(
          function () {
            var e = null != m ? m : 'Type a command or search…';
            return d && s[d] ? s[d].name : e;
          },
          [s, d, m],
        );
        return u.createElement(
          'input',
          n({}, v, {
            ref: a.inputRefSetter,
            autoFocus: !0,
            autoComplete: 'off',
            role: 'combobox',
            spellCheck: 'false',
            'aria-expanded': p,
            'aria-controls': r.KBAR_LISTBOX,
            'aria-activedescendant': (0, r.getListboxItemId)(f),
            value: i,
            placeholder: g,
            onChange: function (t) {
              var r, n, i;
              (null == (r = e.onChange) || r.call(e, t),
                a.setSearch(t.target.value),
                null ==
                  (i = null == (n = null == h ? void 0 : h.callbacks) ? void 0 : n.onQueryChange) ||
                  i.call(n, t.target.value));
            },
            onKeyDown: function (t) {
              var r;
              if ((null == (r = e.onKeyDown) || r.call(e, t), d && !i && 'Backspace' === t.key)) {
                var n = s[d].parent;
                a.setCurrentRootAction(n);
              }
            },
          }),
        );
      }));
  },
  39389,
  (e) => {
    'use strict';
    var t,
      r = e.i(61129);
    function n() {
      return (n =
        Object.assign ||
        function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var n in r) Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
          }
          return e;
        }).apply(this, arguments);
    }
    var a = ['bottom', 'height', 'left', 'right', 'top', 'width'],
      i = new Map(),
      s = function e() {
        var r = [];
        (i.forEach(function (e, t) {
          var n,
            i,
            s = t.getBoundingClientRect();
          ((n = s),
            (i = e.rect),
            void 0 === n && (n = {}),
            void 0 === i && (i = {}),
            a.some(function (e) {
              return n[e] !== i[e];
            }) && ((e.rect = s), r.push(e)));
        }),
          r.forEach(function (e) {
            e.callbacks.forEach(function (t) {
              return t(e.rect);
            });
          }),
          (t = window.requestAnimationFrame(e)));
      },
      o = 'u' > typeof window ? r.default.useLayoutEffect : r.default.useEffect;
    function u(e, t) {
      var r = t.rect;
      return e.height !== r.height || e.width !== r.width ? r : e;
    }
    var l = function () {
        return 50;
      },
      c = function (e) {
        return e;
      },
      d = function (e, t) {
        return e[t ? 'offsetWidth' : 'offsetHeight'];
      },
      f = function (e) {
        for (
          var t = Math.max(e.start - e.overscan, 0),
            r = Math.min(e.end + e.overscan, e.size - 1),
            n = [],
            a = t;
          a <= r;
          a++
        )
          n.push(a);
        return n;
      },
      p = function (e, t, r, n) {
        for (; e <= t; ) {
          var a = ((e + t) / 2) | 0,
            i = r(a);
          if (i < n) e = a + 1;
          else {
            if (!(i > n)) return a;
            t = a - 1;
          }
        }
        return e > 0 ? e - 1 : 0;
      };
    e.s([
      'defaultRangeExtractor',
      0,
      f,
      'useVirtual',
      0,
      function (e) {
        var a,
          h = e.size,
          m = void 0 === h ? 0 : h,
          v = e.estimateSize,
          g = void 0 === v ? l : v,
          y = e.overscan,
          _ = void 0 === y ? 1 : y,
          b = e.paddingStart,
          x = void 0 === b ? 0 : b,
          w = e.paddingEnd,
          k = e.parentRef,
          O = e.horizontal,
          S = e.scrollToFn,
          j = e.useObserver,
          A = e.initialRect,
          P = e.onScrollElement,
          E = e.scrollOffsetFn,
          C = e.keyExtractor,
          R = void 0 === C ? c : C,
          T = e.measureSize,
          I = void 0 === T ? d : T,
          M = e.rangeExtractor,
          N = void 0 === M ? f : M,
          Z = O ? 'width' : 'height',
          $ = O ? 'scrollLeft' : 'scrollTop',
          L = r.default.useRef({ scrollOffset: 0, measurements: [] }),
          D = r.default.useState(0),
          B = D[0],
          z = D[1];
        L.current.scrollOffset = B;
        var V = (
          j ||
          function (e, n) {
            void 0 === n && (n = { width: 0, height: 0 });
            var a = r.default.useState(e.current),
              l = a[0],
              c = a[1],
              d = r.default.useReducer(u, n),
              f = d[0],
              p = d[1],
              h = r.default.useRef(!1);
            return (
              o(function () {
                e.current !== l && c(e.current);
              }),
              o(
                function () {
                  l && !h.current && ((h.current = !0), p({ rect: l.getBoundingClientRect() }));
                },
                [l],
              ),
              r.default.useEffect(
                function () {
                  if (l) {
                    var e,
                      r =
                        ((e = function (e) {
                          p({ rect: e });
                        }),
                        {
                          observe: function () {
                            var t = 0 === i.size;
                            (i.has(l)
                              ? i.get(l).callbacks.push(e)
                              : i.set(l, { rect: void 0, hasRectChanged: !1, callbacks: [e] }),
                              t && s());
                          },
                          unobserve: function () {
                            var r = i.get(l);
                            if (r) {
                              var n = r.callbacks.indexOf(e);
                              (n >= 0 && r.callbacks.splice(n, 1),
                                r.callbacks.length || i.delete(l),
                                i.size || cancelAnimationFrame(t));
                            }
                          },
                        });
                    return (
                      r.observe(),
                      function () {
                        r.unobserve();
                      }
                    );
                  }
                },
                [l],
              ),
              f
            );
          }
        )(k, A)[Z];
        L.current.outerSize = V;
        var F = r.default.useCallback(
            function (e) {
              k.current && (k.current[$] = e);
            },
            [k, $],
          ),
          U = S || F;
        S = r.default.useCallback(
          function (e) {
            U(e, F);
          },
          [F, U],
        );
        var K = r.default.useState({}),
          q = K[0],
          W = K[1],
          H = r.default.useCallback(function () {
            return W({});
          }, []),
          G = r.default.useRef([]),
          Q = r.default.useMemo(
            function () {
              var e = G.current.length > 0 ? Math.min.apply(Math, G.current) : 0;
              G.current = [];
              for (var t = L.current.measurements.slice(0, e), r = e; r < m; r++) {
                var n = R(r),
                  a = q[n],
                  i = t[r - 1] ? t[r - 1].end : x,
                  s = 'number' == typeof a ? a : g(r),
                  o = i + s;
                t[r] = { index: r, start: i, size: s, end: o, key: n };
              }
              return t;
            },
            [g, q, x, m, R],
          ),
          Y = ((null == (a = Q[m - 1]) ? void 0 : a.end) || x) + (void 0 === w ? 0 : w);
        ((L.current.measurements = Q), (L.current.totalSize = Y));
        var J = P ? P.current : k.current,
          X = r.default.useRef(E);
        ((X.current = E),
          o(
            function () {
              if (!J) return void z(0);
              var e = function (e) {
                z(X.current ? X.current(e) : J[$]);
              };
              return (
                e(),
                J.addEventListener('scroll', e, { capture: !1, passive: !0 }),
                function () {
                  J.removeEventListener('scroll', e);
                }
              );
            },
            [J, $],
          ));
        var ee = (function (e) {
            for (
              var t = e.measurements,
                r = e.outerSize,
                n = e.scrollOffset,
                a = t.length - 1,
                i = p(
                  0,
                  a,
                  function (e) {
                    return t[e].start;
                  },
                  n,
                ),
                s = i;
              s < a && t[s].end < n + r;
            )
              s++;
            return { start: i, end: s };
          })(L.current),
          et = ee.start,
          er = ee.end,
          en = r.default.useMemo(
            function () {
              return N({ start: et, end: er, overscan: _, size: Q.length });
            },
            [et, er, _, Q.length, N],
          ),
          ea = r.default.useRef(I);
        ea.current = I;
        var ei = r.default.useMemo(
            function () {
              for (var e = [], t = 0, r = en.length; t < r; t++)
                !(function (t) {
                  var r = en[t],
                    a = Q[r],
                    i = n(
                      n({}, a),
                      {},
                      {
                        measureRef: function (e) {
                          if (e) {
                            var t = ea.current(e, O);
                            if (t !== i.size) {
                              var a = L.current.scrollOffset;
                              (i.start < a && F(a + (t - i.size)),
                                G.current.push(r),
                                W(function (e) {
                                  var r;
                                  return n(n({}, e), {}, (((r = {})[i.key] = t), r));
                                }));
                            }
                          }
                        },
                      },
                    );
                  e.push(i);
                })(t);
              return e;
            },
            [en, F, O, Q],
          ),
          es = r.default.useRef(!1);
        o(
          function () {
            (es.current && W({}), (es.current = !0));
          },
          [g],
        );
        var eo = r.default.useCallback(
            function (e, t) {
              var r = (void 0 === t ? {} : t).align,
                n = void 0 === r ? 'start' : r,
                a = L.current,
                i = a.scrollOffset,
                s = a.outerSize;
              ('auto' === n && (n = e <= i ? 'start' : e >= i + s ? 'end' : 'start'),
                'start' === n ? S(e) : 'end' === n ? S(e - s) : 'center' === n && S(e - s / 2));
            },
            [S],
          ),
          eu = r.default.useCallback(
            function (e, t) {
              var r = void 0 === t ? {} : t,
                a = r.align,
                i = void 0 === a ? 'auto' : a,
                s = (function (e, t) {
                  if (null == e) return {};
                  var r,
                    n,
                    a = {},
                    i = Object.keys(e);
                  for (n = 0; n < i.length; n++) t.indexOf((r = i[n])) >= 0 || (a[r] = e[r]);
                  return a;
                })(r, ['align']),
                o = L.current,
                u = o.measurements,
                l = o.scrollOffset,
                c = o.outerSize,
                d = u[Math.max(0, Math.min(e, m - 1))];
              if (d) {
                if ('auto' === i)
                  if (d.end >= l + c) i = 'end';
                  else {
                    if (!(d.start <= l)) return;
                    i = 'start';
                  }
                eo(
                  'center' === i ? d.start + d.size / 2 : 'end' === i ? d.end : d.start,
                  n({ align: i }, s),
                );
              }
            },
            [eo, m],
          );
        return {
          virtualItems: ei,
          totalSize: Y,
          scrollToOffset: eo,
          scrollToIndex: r.default.useCallback(
            function () {
              for (var e = arguments.length, t = Array(e), r = 0; r < e; r++) t[r] = arguments[r];
              (eu.apply(void 0, t),
                requestAnimationFrame(function () {
                  eu.apply(void 0, t);
                }));
            },
            [eu],
          ),
          measure: H,
        };
      },
    ]);
  },
  37327,
  (e, t, r) => {
    'use strict';
    var n =
        (e.e && e.e.__assign) ||
        function () {
          return (n =
            Object.assign ||
            function (e) {
              for (var t, r = 1, n = arguments.length; r < n; r++)
                for (var a in (t = arguments[r]))
                  Object.prototype.hasOwnProperty.call(t, a) && (e[a] = t[a]);
              return e;
            }).apply(this, arguments);
        },
      a =
        (e.e && e.e.__createBinding) ||
        (Object.create
          ? function (e, t, r, n) {
              (void 0 === n && (n = r),
                Object.defineProperty(e, n, {
                  enumerable: !0,
                  get: function () {
                    return t[r];
                  },
                }));
            }
          : function (e, t, r, n) {
              (void 0 === n && (n = r), (e[n] = t[r]));
            }),
      i =
        (e.e && e.e.__setModuleDefault) ||
        (Object.create
          ? function (e, t) {
              Object.defineProperty(e, 'default', { enumerable: !0, value: t });
            }
          : function (e, t) {
              e.default = t;
            }),
      s =
        (e.e && e.e.__importStar) ||
        function (e) {
          if (e && e.__esModule) return e;
          var t = {};
          if (null != e)
            for (var r in e)
              'default' !== r && Object.prototype.hasOwnProperty.call(e, r) && a(t, e, r);
          return (i(t, e), t);
        };
    (Object.defineProperty(r, '__esModule', { value: !0 }), (r.KBarResults = void 0));
    var o = s(e.r(61129)),
      u = e.r(39389),
      l = e.r(39281),
      c = e.r(36949),
      d = e.r(55227);
    r.KBarResults = function (e) {
      var t = o.useRef(null),
        r = o.useRef(null),
        a = o.useRef(e.items);
      a.current = e.items;
      var i = (0, u.useVirtual)({ size: a.current.length, parentRef: r }),
        s = (0, c.useKBar)(function (e) {
          return {
            search: e.searchQuery,
            currentRootActionId: e.currentRootActionId,
            activeIndex: e.activeIndex,
          };
        }),
        f = s.query,
        p = s.search,
        h = s.currentRootActionId,
        m = s.activeIndex,
        v = s.options;
      o.useEffect(
        function () {
          var e = function (e) {
            var r;
            e.isComposing ||
              ('ArrowUp' === e.key || (e.ctrlKey && 'p' === e.key)
                ? (e.preventDefault(),
                  f.setActiveIndex(function (e) {
                    var t = e > 0 ? e - 1 : e;
                    if ('string' == typeof a.current[t]) {
                      if (0 === t) return e;
                      t -= 1;
                    }
                    return t;
                  }))
                : 'ArrowDown' === e.key || (e.ctrlKey && 'n' === e.key)
                  ? (e.preventDefault(),
                    f.setActiveIndex(function (e) {
                      var t = e < a.current.length - 1 ? e + 1 : e;
                      if ('string' == typeof a.current[t]) {
                        if (t === a.current.length - 1) return e;
                        t += 1;
                      }
                      return t;
                    }))
                  : 'Enter' === e.key &&
                    (e.preventDefault(), null == (r = t.current) || r.click()));
          };
          return (
            window.addEventListener('keydown', e),
            function () {
              return window.removeEventListener('keydown', e);
            }
          );
        },
        [f],
      );
      var g = i.scrollToIndex;
      (o.useEffect(
        function () {
          g(m, { align: m <= 1 ? 'end' : 'auto' });
        },
        [m, g],
      ),
        o.useEffect(
          function () {
            f.setActiveIndex(+('string' == typeof e.items[0]));
          },
          [p, h, e.items, f],
        ));
      var y = o.useCallback(
          function (e) {
            var t, r;
            'string' != typeof e &&
              (e.command
                ? (e.command.perform(e), f.toggle())
                : (f.setSearch(''), f.setCurrentRootAction(e.id)),
              null == (r = null == (t = v.callbacks) ? void 0 : t.onSelectAction) || r.call(t, e));
          },
          [f, v],
        ),
        _ = (0, d.usePointerMovedSinceMount)();
      return o.createElement(
        'div',
        {
          ref: r,
          style: { maxHeight: e.maxHeight || 400, position: 'relative', overflow: 'auto' },
        },
        o.createElement(
          'div',
          {
            role: 'listbox',
            id: l.KBAR_LISTBOX,
            style: { height: i.totalSize + 'px', width: '100%' },
          },
          i.virtualItems.map(function (r) {
            var i = a.current[r.index],
              s = 'string' != typeof i && {
                onPointerMove: function () {
                  return _ && m !== r.index && f.setActiveIndex(r.index);
                },
                onPointerDown: function () {
                  return f.setActiveIndex(r.index);
                },
                onClick: function () {
                  return y(i);
                },
              },
              u = r.index === m;
            return o.createElement(
              'div',
              n(
                {
                  ref: u ? t : null,
                  id: (0, l.getListboxItemId)(r.index),
                  role: 'option',
                  'aria-selected': u,
                  key: r.index,
                  style: {
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    transform: 'translateY(' + r.start + 'px)',
                  },
                },
                s,
              ),
              o.cloneElement(e.onRender({ item: i, active: u }), { ref: r.measureRef }),
            );
          }),
        ),
      );
    };
  },
  15189,
  (e, t, r) => {
    'use strict';
    var n =
        (e.e && e.e.__createBinding) ||
        (Object.create
          ? function (e, t, r, n) {
              (void 0 === n && (n = r),
                Object.defineProperty(e, n, {
                  enumerable: !0,
                  get: function () {
                    return t[r];
                  },
                }));
            }
          : function (e, t, r, n) {
              (void 0 === n && (n = r), (e[n] = t[r]));
            }),
      a =
        (e.e && e.e.__setModuleDefault) ||
        (Object.create
          ? function (e, t) {
              Object.defineProperty(e, 'default', { enumerable: !0, value: t });
            }
          : function (e, t) {
              e.default = t;
            }),
      i =
        (e.e && e.e.__importStar) ||
        function (e) {
          if (e && e.__esModule) return e;
          var t = {};
          if (null != e)
            for (var r in e)
              'default' !== r && Object.prototype.hasOwnProperty.call(e, r) && n(t, e, r);
          return (a(t, e), t);
        };
    (Object.defineProperty(r, '__esModule', { value: !0 }), (r.useRegisterActions = void 0));
    var s = i(e.r(61129)),
      o = e.r(36949);
    r.useRegisterActions = function (e, t) {
      void 0 === t && (t = []);
      var r = (0, o.useKBar)().query,
        n = s.useMemo(function () {
          return e;
        }, t);
      s.useEffect(
        function () {
          if (n.length) {
            var e = r.registerActions(n);
            return function () {
              e();
            };
          }
        },
        [r, n],
      );
    };
  },
  38060,
  (e, t, r) => {
    'use strict';
    var n =
        (e.e && e.e.__assign) ||
        function () {
          return (n =
            Object.assign ||
            function (e) {
              for (var t, r = 1, n = arguments.length; r < n; r++)
                for (var a in (t = arguments[r]))
                  Object.prototype.hasOwnProperty.call(t, a) && (e[a] = t[a]);
              return e;
            }).apply(this, arguments);
        },
      a =
        (e.e && e.e.__createBinding) ||
        (Object.create
          ? function (e, t, r, n) {
              (void 0 === n && (n = r),
                Object.defineProperty(e, n, {
                  enumerable: !0,
                  get: function () {
                    return t[r];
                  },
                }));
            }
          : function (e, t, r, n) {
              (void 0 === n && (n = r), (e[n] = t[r]));
            }),
      i =
        (e.e && e.e.__setModuleDefault) ||
        (Object.create
          ? function (e, t) {
              Object.defineProperty(e, 'default', { enumerable: !0, value: t });
            }
          : function (e, t) {
              e.default = t;
            }),
      s =
        (e.e && e.e.__importStar) ||
        function (e) {
          if (e && e.__esModule) return e;
          var t = {};
          if (null != e)
            for (var r in e)
              'default' !== r && Object.prototype.hasOwnProperty.call(e, r) && a(t, e, r);
          return (i(t, e), t);
        };
    (Object.defineProperty(r, '__esModule', { value: !0 }), (r.KBarAnimator = void 0));
    var o = s(e.r(61129)),
      u = e.r(98740),
      l = e.r(36949),
      c = e.r(55227),
      d = [
        { opacity: 0, transform: 'scale(.99)' },
        { opacity: 1, transform: 'scale(1.01)' },
        { opacity: 1, transform: 'scale(1)' },
      ],
      f = [{ transform: 'scale(1)' }, { transform: 'scale(.98)' }, { transform: 'scale(1)' }];
    r.KBarAnimator = function (e) {
      var t,
        r,
        a = e.children,
        i = e.style,
        s = e.className,
        p = (0, l.useKBar)(function (e) {
          return { visualState: e.visualState, currentRootActionId: e.currentRootActionId };
        }),
        h = p.visualState,
        m = p.currentRootActionId,
        v = p.query,
        g = p.options,
        y = o.useRef(null),
        _ = o.useRef(null),
        b = (null == (t = null == g ? void 0 : g.animations) ? void 0 : t.enterMs) || 0,
        x = (null == (r = null == g ? void 0 : g.animations) ? void 0 : r.exitMs) || 0;
      o.useEffect(
        function () {
          if (h !== u.VisualState.showing) {
            var e = h === u.VisualState.animatingIn ? b : x,
              t = y.current;
            null == t ||
              t.animate(d, {
                duration: e,
                easing: h === u.VisualState.animatingOut ? 'ease-in' : 'ease-out',
                direction: h === u.VisualState.animatingOut ? 'reverse' : 'normal',
                fill: 'forwards',
              });
          }
        },
        [g, h, b, x],
      );
      var w = o.useRef();
      o.useEffect(
        function () {
          if (h === u.VisualState.showing) {
            var e = y.current,
              t = _.current;
            if (e && t) {
              var r = new ResizeObserver(function (t) {
                for (var r = 0; r < t.length; r++) {
                  var n = t[r].contentRect;
                  (w.current || (w.current = n.height),
                    e.animate([{ height: w.current + 'px' }, { height: n.height + 'px' }], {
                      duration: b / 2,
                      easing: 'ease-out',
                      fill: 'forwards',
                    }),
                    (w.current = n.height));
                }
              });
              return (
                r.observe(t),
                function () {
                  r.unobserve(t);
                }
              );
            }
          }
        },
        [h, g, b, x],
      );
      var k = o.useRef(!0);
      return (
        o.useEffect(
          function () {
            if (k.current) {
              k.current = !1;
              return;
            }
            var e = y.current;
            e && e.animate(f, { duration: b, easing: 'ease-out' });
          },
          [m, b],
        ),
        (0, c.useOuterClick)(y, function () {
          var e, t;
          (v.setVisualState(u.VisualState.animatingOut),
            null == (t = null == (e = g.callbacks) ? void 0 : e.onClose) || t.call(e));
        }),
        o.createElement(
          'div',
          { ref: y, style: n(n(n({}, d[0]), i), { pointerEvents: 'auto' }), className: s },
          o.createElement('div', { ref: _ }, a),
        )
      );
    };
  },
  58646,
  (e, t, r) => {
    'use strict';
    var n =
        (e.e && e.e.__createBinding) ||
        (Object.create
          ? function (e, t, r, n) {
              (void 0 === n && (n = r),
                Object.defineProperty(e, n, {
                  enumerable: !0,
                  get: function () {
                    return t[r];
                  },
                }));
            }
          : function (e, t, r, n) {
              (void 0 === n && (n = r), (e[n] = t[r]));
            }),
      a =
        (e.e && e.e.__exportStar) ||
        function (e, t) {
          for (var r in e)
            'default' === r || Object.prototype.hasOwnProperty.call(t, r) || n(t, e, r);
        };
    (Object.defineProperty(r, '__esModule', { value: !0 }), a(e.r(15695), r), a(e.r(15190), r));
  },
  56872,
  (e, t, r) => {
    'use strict';
    var n =
        (e.e && e.e.__createBinding) ||
        (Object.create
          ? function (e, t, r, n) {
              (void 0 === n && (n = r),
                Object.defineProperty(e, n, {
                  enumerable: !0,
                  get: function () {
                    return t[r];
                  },
                }));
            }
          : function (e, t, r, n) {
              (void 0 === n && (n = r), (e[n] = t[r]));
            }),
      a =
        (e.e && e.e.__exportStar) ||
        function (e, t) {
          for (var r in e)
            'default' === r || Object.prototype.hasOwnProperty.call(t, r) || n(t, e, r);
        };
    (Object.defineProperty(r, '__esModule', { value: !0 }), (r.Priority = r.createAction = void 0));
    var i = e.r(55227);
    (Object.defineProperty(r, 'createAction', {
      enumerable: !0,
      get: function () {
        return i.createAction;
      },
    }),
      Object.defineProperty(r, 'Priority', {
        enumerable: !0,
        get: function () {
          return i.Priority;
        },
      }),
      a(e.r(6555), r),
      a(e.r(41276), r),
      a(e.r(5651), r),
      a(e.r(39281), r),
      a(e.r(37327), r),
      a(e.r(36949), r),
      a(e.r(15189), r),
      a(e.r(94196), r),
      a(e.r(38060), r),
      a(e.r(98740), r),
      a(e.r(58646), r));
  },
  25603,
  (e, t, r) => {
    'use strict';
    Object.defineProperty(r, '__esModule', { value: !0 });
    var n = {
      formatUrl: function () {
        return o;
      },
      formatWithValidation: function () {
        return l;
      },
      urlObjectKeys: function () {
        return u;
      },
    };
    for (var a in n) Object.defineProperty(r, a, { enumerable: !0, get: n[a] });
    let i = e.r(87969)._(e.r(75440)),
      s = /https?|ftp|gopher|file/;
    function o(e) {
      let { auth: t, hostname: r } = e,
        n = e.protocol || '',
        a = e.pathname || '',
        o = e.hash || '',
        u = e.query || '',
        l = !1;
      ((t = t ? encodeURIComponent(t).replace(/%3A/i, ':') + '@' : ''),
        e.host
          ? (l = t + e.host)
          : r && ((l = t + (~r.indexOf(':') ? `[${r}]` : r)), e.port && (l += ':' + e.port)),
        u && 'object' == typeof u && (u = String(i.urlQueryToSearchParams(u))));
      let c = e.search || (u && `?${u}`) || '';
      return (
        n && !n.endsWith(':') && (n += ':'),
        e.slashes || ((!n || s.test(n)) && !1 !== l)
          ? ((l = '//' + (l || '')), a && '/' !== a[0] && (a = '/' + a))
          : l || (l = ''),
        o && '#' !== o[0] && (o = '#' + o),
        c && '?' !== c[0] && (c = '?' + c),
        (a = a.replace(/[?#]/g, encodeURIComponent)),
        (c = c.replace('#', '%23')),
        `${n}${l}${a}${c}${o}`
      );
    }
    let u = [
      'auth',
      'hash',
      'host',
      'hostname',
      'href',
      'path',
      'pathname',
      'port',
      'protocol',
      'query',
      'search',
      'slashes',
    ];
    function l(e) {
      return o(e);
    }
  },
  89755,
  (e, t, r) => {
    'use strict';
    (Object.defineProperty(r, '__esModule', { value: !0 }),
      Object.defineProperty(r, 'useMergedRef', {
        enumerable: !0,
        get: function () {
          return a;
        },
      }));
    let n = e.r(61129);
    function a(e, t) {
      let r = (0, n.useRef)(null),
        a = (0, n.useRef)(null);
      return (0, n.useCallback)(
        (n) => {
          if (null === n) {
            let e = r.current;
            e && ((r.current = null), e());
            let t = a.current;
            t && ((a.current = null), t());
          } else (e && (r.current = i(e, n)), t && (a.current = i(t, n)));
        },
        [e, t],
      );
    }
    function i(e, t) {
      if ('function' != typeof e)
        return (
          (e.current = t),
          () => {
            e.current = null;
          }
        );
      {
        let r = e(t);
        return 'function' == typeof r ? r : () => e(null);
      }
    }
    ('function' == typeof r.default || ('object' == typeof r.default && null !== r.default)) &&
      void 0 === r.default.__esModule &&
      (Object.defineProperty(r.default, '__esModule', { value: !0 }),
      Object.assign(r.default, r),
      (t.exports = r.default));
  },
  36980,
  (e, t, r) => {
    'use strict';
    (Object.defineProperty(r, '__esModule', { value: !0 }),
      Object.defineProperty(r, 'isLocalURL', {
        enumerable: !0,
        get: function () {
          return i;
        },
      }));
    let n = e.r(58800),
      a = e.r(83699);
    function i(e) {
      if (!(0, n.isAbsoluteUrl)(e)) return !0;
      try {
        let t = (0, n.getLocationOrigin)(),
          r = new URL(e, t);
        return r.origin === t && (0, a.hasBasePath)(r.pathname);
      } catch (e) {
        return !1;
      }
    }
  },
  29546,
  (e, t, r) => {
    'use strict';
    (Object.defineProperty(r, '__esModule', { value: !0 }),
      Object.defineProperty(r, 'errorOnce', {
        enumerable: !0,
        get: function () {
          return n;
        },
      }));
    let n = (e) => {};
  },
  80506,
  (e, t, r) => {
    'use strict';
    Object.defineProperty(r, '__esModule', { value: !0 });
    var n = {
      default: function () {
        return g;
      },
      useLinkStatus: function () {
        return _;
      },
    };
    for (var a in n) Object.defineProperty(r, a, { enumerable: !0, get: n[a] });
    let i = e.r(87969),
      s = e.r(37479),
      o = i._(e.r(61129)),
      u = e.r(25603),
      l = e.r(47718),
      c = e.r(89755),
      d = e.r(58800),
      f = e.r(1839);
    e.r(64045);
    let p = e.r(36097),
      h = e.r(2175),
      m = e.r(36980),
      v = e.r(71945);
    function g(t) {
      var r, n;
      let a,
        i,
        g,
        [_, b] = (0, o.useOptimistic)(h.IDLE_LINK_STATUS),
        x = (0, o.useRef)(null),
        {
          href: w,
          as: k,
          children: O,
          prefetch: S = null,
          passHref: j,
          replace: A,
          shallow: P,
          scroll: E,
          onClick: C,
          onMouseEnter: R,
          onTouchStart: T,
          legacyBehavior: I = !1,
          onNavigate: M,
          transitionTypes: N,
          ref: Z,
          unstable_dynamicOnHover: $,
          ...L
        } = t;
      ((a = O),
        I &&
          ('string' == typeof a || 'number' == typeof a) &&
          (a = (0, s.jsx)('a', { children: a })));
      let D = o.default.useContext(l.AppRouterContext),
        B = !1 !== S,
        z =
          !1 !== S
            ? null === (n = S) || 'auto' === n
              ? v.FetchStrategy.PPR
              : v.FetchStrategy.Full
            : v.FetchStrategy.PPR,
        V = 'string' == typeof (r = k || w) ? r : (0, u.formatUrl)(r);
      if (I) {
        if (a?.$$typeof === Symbol.for('react.lazy'))
          throw Object.defineProperty(
            Error(
              "`<Link legacyBehavior>` received a direct child that is either a Server Component, or JSX that was loaded with React.lazy(). This is not supported. Either remove legacyBehavior, or make the direct child a Client Component that renders the Link's `<a>` tag.",
            ),
            '__NEXT_ERROR_CODE',
            { value: 'E863', enumerable: !1, configurable: !0 },
          );
        i = o.default.Children.only(a);
      }
      let F = I ? i && 'object' == typeof i && i.ref : Z,
        U = o.default.useCallback(
          (e) => (
            null !== D && (x.current = (0, h.mountLinkInstance)(e, V, D, z, B, b)),
            () => {
              (x.current && ((0, h.unmountLinkForCurrentNavigation)(x.current), (x.current = null)),
                (0, h.unmountPrefetchableInstance)(e));
            }
          ),
          [B, V, D, z, b],
        ),
        K = {
          ref: (0, c.useMergedRef)(U, F),
          onClick(t) {
            (I || 'function' != typeof C || C(t),
              I && i.props && 'function' == typeof i.props.onClick && i.props.onClick(t),
              !D ||
                t.defaultPrevented ||
                (function (t, r, n, a, i, s, u) {
                  if ('u' > typeof window) {
                    let l,
                      { nodeName: c } = t.currentTarget;
                    if (
                      ('A' === c.toUpperCase() &&
                        (((l = t.currentTarget.getAttribute('target')) && '_self' !== l) ||
                          t.metaKey ||
                          t.ctrlKey ||
                          t.shiftKey ||
                          t.altKey ||
                          (t.nativeEvent && 2 === t.nativeEvent.which))) ||
                      t.currentTarget.hasAttribute('download')
                    )
                      return;
                    if (!(0, m.isLocalURL)(r)) {
                      a && (t.preventDefault(), location.replace(r));
                      return;
                    }
                    if ((t.preventDefault(), s)) {
                      let e = !1;
                      if (
                        (s({
                          preventDefault: () => {
                            e = !0;
                          },
                        }),
                        e)
                      )
                        return;
                    }
                    let { dispatchNavigateAction: d } = e.r(15397);
                    o.default.startTransition(() => {
                      d(
                        r,
                        a ? 'replace' : 'push',
                        !1 === i ? p.ScrollBehavior.NoScroll : p.ScrollBehavior.Default,
                        n.current,
                        u,
                      );
                    });
                  }
                })(t, V, x, A, E, M, N));
          },
          onMouseEnter(e) {
            (I || 'function' != typeof R || R(e),
              I && i.props && 'function' == typeof i.props.onMouseEnter && i.props.onMouseEnter(e),
              D && B && (0, h.onNavigationIntent)(e.currentTarget, !0 === $));
          },
          onTouchStart: function (e) {
            (I || 'function' != typeof T || T(e),
              I && i.props && 'function' == typeof i.props.onTouchStart && i.props.onTouchStart(e),
              D && B && (0, h.onNavigationIntent)(e.currentTarget, !0 === $));
          },
        };
      return (
        (0, d.isAbsoluteUrl)(V)
          ? (K.href = V)
          : (I && !j && ('a' !== i.type || 'href' in i.props)) || (K.href = (0, f.addBasePath)(V)),
        (g = I ? o.default.cloneElement(i, K) : (0, s.jsx)('a', { ...L, ...K, children: a })),
        (0, s.jsx)(y.Provider, { value: _, children: g })
      );
    }
    e.r(29546);
    let y = (0, o.createContext)(h.IDLE_LINK_STATUS),
      _ = () => (0, o.useContext)(y);
    ('function' == typeof r.default || ('object' == typeof r.default && null !== r.default)) &&
      void 0 === r.default.__esModule &&
      (Object.defineProperty(r.default, '__esModule', { value: !0 }),
      Object.assign(r.default, r),
      (t.exports = r.default));
  },
  29753,
  (e) => {
    'use strict';
    let t, r;
    var n,
      a,
      i,
      s,
      o,
      u,
      l,
      c = e.i(37479),
      d = e.i(60552),
      f = e.i(61129),
      p = e.i(56872),
      h = Object.defineProperty,
      m = (e, t) => h(e, 'name', { value: t, configurable: !0 }),
      v = m(
        (e) => e.replace(/\w\S*/g, (e) => e.charAt(0).toUpperCase() + e.slice(1).toLowerCase()),
        'capitalize',
      ),
      g = m(() => {
        let e = (0, d.useTranslate)(),
          { resource: t, resources: r, id: n, action: a } = (0, d.useResource)(),
          i = (0, d.useRouterType)(),
          s = (0, d.useGetToPath)(),
          o = (0, d.useGo)(),
          { mutate: u } = (0, d.useDelete)(),
          { push: l, list: c, create: h, show: g, edit: y } = (0, d.useNavigation)(),
          _ = (0, d.useUserFriendlyName)(),
          b = (0, f.useContext)(p.KBarContext),
          { can: x } = (0, d.useCanWithoutCache)(),
          [w, k] = (0, f.useState)([]);
        ((0, f.useEffect)(() => {
          m(async () => await Promise.all(O().flatMap((e) => S(e))), 'preaparedActions')().then(
            (e) => k(e.flatMap((e) => e)),
          );
        }, [r, n, t, a]),
          (0, f.useEffect)(() => {
            0 === w.length && b.query.setVisualState(p.VisualState.hidden);
          }, [w]));
        let O = m(() => {
            let e = [...r],
              n =
                null == e
                  ? void 0
                  : e.findIndex(
                      (e) =>
                        (e.identifier ?? (null == e ? void 0 : e.name)) ===
                        ((null == t ? void 0 : t.identifier) ?? (null == t ? void 0 : t.name)),
                    );
            if (n > 0) {
              let t = e[n];
              (e.splice(n, 1), e.splice(0, 0, t));
            }
            return e;
          }, 'moveActionToFirst'),
          S = m(async (r) => {
            var c, d, f, h, m, g;
            let {
                name: y,
                label: b,
                list: w,
                create: k,
                canCreate: O,
                canEdit: S,
                canShow: j,
                icon: A,
                show: P,
                canDelete: E,
                edit: C,
                route: R,
              } = r,
              T =
                (null == (c = null == r ? void 0 : r.meta) ? void 0 : c.label) ??
                (null == (d = null == r ? void 0 : r.options) ? void 0 : d.label) ??
                b,
              I =
                (null == (f = null == r ? void 0 : r.meta) ? void 0 : f.icon) ??
                (null == (h = null == r ? void 0 : r.options) ? void 0 : h.icon) ??
                A,
              M =
                (null == (m = null == r ? void 0 : r.meta) ? void 0 : m.canDelete) ??
                (null == (g = null == r ? void 0 : r.options) ? void 0 : g.canDelete) ??
                E,
              N = T ?? e(`${r.name}.${r.name}`, _(r.name, 'plural')),
              Z = [];
            if (
              w &&
              ((void 0 !== t && (null == t ? void 0 : t.name) !== y) ||
                (void 0 !== a && (null == t ? void 0 : t.name) === y))
            ) {
              let { can: t } = (await (null == x
                ? void 0
                : x({ resource: y, action: 'list', params: { id: n, resource: r } }))) || {
                can: !0,
              };
              t &&
                Z.push(
                  (0, p.createAction)({
                    name: e('actions.list', v('list')),
                    section: N,
                    icon: I,
                    perform: () => {
                      let e = s({ resource: r, action: 'list', legacy: 'legacy' === i });
                      e && ('legacy' === i ? l(e) : o({ to: e }));
                    },
                  }),
                );
            }
            if ((O || k) && k && ('create' !== a || (null == t ? void 0 : t.name) !== y)) {
              let { can: t } = (await (null == x
                ? void 0
                : x({ resource: y, action: 'create', params: { resource: r } }))) || { can: !0 };
              t &&
                Z.push(
                  (0, p.createAction)({
                    name: e('actions.create', v('create')),
                    section: N,
                    icon: I,
                    keywords: 'new',
                    perform: () => {
                      let e = s({ resource: r, action: 'create', legacy: 'legacy' === i });
                      e && ('legacy' === i ? l(e) : o({ to: e }));
                    },
                  }),
                );
            }
            if ((null == t ? void 0 : t.name) === y && n) {
              if ((j || P) && P && 'show' !== a) {
                let { can: t } = (await (null == x
                  ? void 0
                  : x({ resource: y, action: 'show', params: { id: n, resource: r } }))) || {
                  can: !0,
                };
                t &&
                  Z.push(
                    (0, p.createAction)({
                      name: e('actions.show', v('show')),
                      section: N,
                      icon: I,
                      perform: () => {
                        let e = s({
                          resource: r,
                          action: 'show',
                          legacy: 'legacy' === i,
                          meta: { id: n },
                        });
                        e && ('legacy' === i ? l(e) : o({ to: e }));
                      },
                    }),
                  );
              }
              if ((S || C) && C && 'edit' !== a) {
                let { can: t } = (await (null == x
                  ? void 0
                  : x({ resource: y, action: 'edit', params: { id: n, resource: r } }))) || {
                  can: !0,
                };
                t &&
                  Z.push(
                    (0, p.createAction)({
                      name: e('actions.edit', v('edit')),
                      section: N,
                      icon: I,
                      perform: () => {
                        let e = s({
                          resource: r,
                          action: 'edit',
                          legacy: 'legacy' === i,
                          meta: { id: n },
                        });
                        e && ('legacy' === i ? l(e) : o({ to: e }));
                      },
                    }),
                  );
              }
              if (M) {
                let { can: t } = (await (null == x
                  ? void 0
                  : x({ resource: y, action: 'delete', params: { id: n, resource: r } }))) || {
                  can: !0,
                };
                t &&
                  Z.push(
                    { id: 'delete', name: e('actions.delete', v('delete')), section: N, icon: I },
                    (0, p.createAction)({
                      name: e('buttons.delete', v('delete')),
                      section: e('buttons.confirm', 'Are you sure?'),
                      parent: 'delete',
                      perform: () => {
                        u(
                          { resource: r.name, id: n },
                          {
                            onSuccess: () => {
                              let e = s({ resource: r, action: 'list', legacy: 'legacy' === i });
                              e && ('legacy' === i ? l(e) : o({ to: e }));
                            },
                          },
                        );
                      },
                    }),
                    (0, p.createAction)({
                      name: e('buttons.cancel', 'Cancel'),
                      parent: 'delete',
                      perform: () => null,
                    }),
                  );
              }
            }
            return Z;
          }, 'createActionWithResource');
        (0, p.useRegisterActions)(w, [w]);
      }, 'useRefineKbar'),
      y = m(
        () =>
          f.default.createElement(
            p.KBarPortal,
            null,
            f.default.createElement(
              p.KBarPositioner,
              {
                style: {
                  opacity: 1,
                  transition: 'background 0.35s cubic-bezier(0.4, 0, 0.2, 1) 0s',
                  backdropFilter: 'saturate(180%) blur(1px)',
                  background: 'rgba(0, 0, 0, 0.1)',
                  zIndex: '9999',
                },
              },
              f.default.createElement(
                p.KBarAnimator,
                {
                  style: {
                    maxWidth: '600px',
                    width: '100%',
                    background: 'white',
                    color: 'black',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                  },
                },
                f.default.createElement(p.KBarSearch, {
                  style: {
                    padding: '12px 16px',
                    fontSize: '16px',
                    width: '100%',
                    boxSizing: 'border-box',
                    outline: 'none',
                    border: 'none',
                    background: 'rgb(252 252 252)',
                    color: 'black',
                  },
                }),
                f.default.createElement(b, null),
              ),
            ),
          ),
        'CommandBar',
      ),
      _ = {
        padding: '8px 16px',
        fontSize: '14px',
        textTransform: 'uppercase',
        fontWeight: 'bold',
        opacity: 0.5,
      },
      b = m(() => {
        let { results: e, rootActionId: t } = (0, p.useMatches)();
        return f.default.createElement(p.KBarResults, {
          items: e,
          onRender: ({ item: e, active: r }) =>
            'string' == typeof e
              ? f.default.createElement('div', { style: _ }, e)
              : f.default.createElement(x, { action: e, active: r, currentRootActionId: t }),
        });
      }, 'RenderResults'),
      x = f.default.forwardRef(({ action: e, active: t, currentRootActionId: r }, n) => {
        var a;
        let i = f.default.useMemo(() => {
          if (!r) return e.ancestors;
          let t = e.ancestors.findIndex((e) => e.id === r);
          return e.ancestors.slice(t + 1);
        }, [e.ancestors, r]);
        return f.default.createElement(
          'div',
          {
            ref: n,
            style: {
              padding: '12px 16px',
              background: t ? 'rgba(0 0 0 / 0.05)' : 'transparent',
              borderLeft: `2px solid ${t ? 'rgb(28 28 29)' : 'transparent'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
            },
          },
          f.default.createElement(
            'div',
            { style: { display: 'flex', gap: '8px', alignItems: 'center', fontSize: 14 } },
            e.icon && e.icon,
            f.default.createElement(
              'div',
              { style: { display: 'flex', flexDirection: 'column' } },
              f.default.createElement(
                'div',
                null,
                i.length > 0 &&
                  i.map((e) =>
                    f.default.createElement(
                      f.default.Fragment,
                      { key: e.id },
                      f.default.createElement(
                        'span',
                        { style: { opacity: 0.5, marginRight: 8 } },
                        e.name,
                      ),
                      f.default.createElement('span', { style: { marginRight: 8 } }, '›'),
                    ),
                  ),
                f.default.createElement(
                  'span',
                  { style: { color: 'DELETE' === e.name.toLocaleUpperCase() ? 'red' : 'black' } },
                  e.name,
                ),
              ),
              e.subtitle &&
                f.default.createElement('span', { style: { fontSize: 12 } }, e.subtitle),
            ),
          ),
          null != (a = e.shortcut) && a.length
            ? f.default.createElement(
                'div',
                {
                  'aria-hidden': !0,
                  style: { display: 'grid', gridAutoFlow: 'column', gap: '4px' },
                },
                e.shortcut.map((e) =>
                  f.default.createElement(
                    'kbd',
                    {
                      key: e,
                      style: {
                        padding: '4px 6px',
                        background: 'rgba(0 0 0 / .1)',
                        borderRadius: '4px',
                        fontSize: 14,
                      },
                    },
                    e,
                  ),
                ),
              )
            : null,
        );
      });
    ((x.displayName = 'ResultItem'),
      m(({ commandBarProps: e }) => {
        let t = (0, f.useContext)(w);
        g();
        let r = { ...t, ...e };
        return f.default.createElement(y, { ...r });
      }, 'RefineKbar'));
    var w = (0, f.createContext)({}),
      k = m(
        ({ children: e, commandBarProps: t }) =>
          f.default.createElement(
            w.Provider,
            { value: t ?? {} },
            f.default.createElement(p.KBarProvider, null, e),
          ),
        'RefineKbarProvider',
      ),
      O = e.i(78090),
      S = e.i(51215),
      j = e.i(80506),
      A = e.i(37790),
      P = (e) => {
        if (typeof e > 'u') return e;
        let t = Number(e);
        return `${t}` === e ? t : e;
      },
      E = {
        addQueryPrefix: !0,
        skipNulls: !0,
        arrayFormat: 'indices',
        encode: !1,
        encodeValuesOnly: !0,
      },
      C = {
        go: () => {
          let { push: e, replace: t } = (0, S.useRouter)(),
            r = (0, S.usePathname)(),
            n = (0, S.useSearchParams)();
          return f.default.useCallback(
            ({
              to: a,
              type: i,
              query: s,
              options: { keepQuery: o, keepHash: u } = {},
              hash: l,
            }) => {
              let c = '';
              (u && 'u' > typeof document && (c = document.location.hash),
                l && (c = `#${l.replace(/^#/, '')}`));
              let d = {
                ...(o ? A.default.parse(n.toString(), { ignoreQueryPrefix: !0 }) : {}),
                ...s,
              };
              d.to && (d.to = encodeURIComponent(`${d.to}`));
              let f = (null == r ? void 0 : r.split('?')[0].split('#')[0]) ?? '',
                p = c.length > 1,
                h = Object.keys(d).length > 0,
                m = `${a || f}${h ? A.default.stringify(d, E) : ''}${p ? c : ''}`;
              if ('path' === i) return m;
              'replace' === i ? t(m) : e(m);
            },
            [n, e, t],
          );
        },
        back: () => {
          let { back: e } = (0, S.useRouter)();
          return e;
        },
        parse: () => {
          let e,
            t,
            r,
            n,
            a,
            i = (0, S.usePathname)(),
            s = (0, S.useSearchParams)(),
            { resources: o } = (0, f.useContext)(d.ResourceContext),
            {
              resource: u,
              action: l,
              matchedRoute: c,
            } = f.default.useMemo(
              () => (i ? (0, d.matchResourceFromRoute)(i, o) : { found: !1 }),
              [i, o],
            ),
            p =
              c && i
                ? ((e = {}),
                  (t = c.replace(/^\/|\/$/g, '')),
                  (r = i.replace(/^\/|\/$/g, '')),
                  (n = t.split('/')),
                  (a = r.split('/')),
                  n.forEach((t, r) => {
                    var n;
                    t.startsWith(':') &&
                      (null == (n = a[r]) ? void 0 : n.length) > 0 &&
                      (e[t.replace(':', '')] = a[r]);
                  }),
                  e)
                : {},
            h = p.id,
            m = f.default.useMemo(() => {
              let e = s.toString();
              return A.default.parse(e, { ignoreQueryPrefix: !0 });
            }, [s]);
          return f.default.useCallback(() => {
            let e = { ...p, ...m };
            return {
              ...(u && { resource: u }),
              ...(l && { action: l }),
              ...(h && { id: decodeURIComponent(h) }),
              pathname: i || void 0,
              params: {
                ...e,
                current: P(e.current),
                pageSize: P(e.pageSize),
                to: e.to ? decodeURIComponent(e.to) : void 0,
              },
            };
          }, [i, m, p, h, u, l]);
        },
        Link: f.default.forwardRef(function ({ to: e, ...t }, r) {
          return f.default.createElement(j.default, { href: e, ...t, ref: r });
        }),
      },
      R = e.i(21203);
    let T = {
      login: async ({ email: e, password: t }) => {
        let { data: r, error: n } = await R.supabaseClient.auth.signInWithPassword({
          email: e,
          password: t,
        });
        return n
          ? { success: !1, error: n }
          : r?.session
            ? 'admin' !== r.user?.app_metadata?.role
              ? (await R.supabaseClient.auth.signOut(),
                { success: !1, error: { message: 'Invalid credentials', name: 'Unauthorized' } })
              : { success: !0, redirectTo: '/' }
            : { success: !1, error: { message: 'Login failed', name: 'Invalid credentials' } };
      },
      logout: async () => {
        let { error: e } = await R.supabaseClient.auth.signOut();
        return e ? { success: !1, error: e } : { success: !0, redirectTo: '/login' };
      },
      check: async () => {
        let { data: e } = await R.supabaseClient.auth.getSession(),
          { session: t } = e;
        return t
          ? 'admin' !== t.user?.app_metadata?.role
            ? { authenticated: !1, redirectTo: '/login', logout: !0 }
            : { authenticated: !0 }
          : { authenticated: !1, redirectTo: '/login' };
      },
      getPermissions: async () => {
        let { data: e } = await R.supabaseClient.auth.getUser();
        return e?.user ? e.user.app_metadata?.role : null;
      },
      getIdentity: async () => {
        let { data: e } = await R.supabaseClient.auth.getUser();
        return e?.user ? { ...e.user, name: e.user.email } : null;
      },
      onError: async (e) => (e?.status === 401 ? { logout: !0 } : { error: e }),
    };
    e.i(78874);
    var I = e.i(22587);
    (I.REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.INSERT,
      I.REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.UPDATE,
      I.REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.DELETE,
      I.REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.ALL);
    var M = (e) => {
        switch (e) {
          case 'ne':
            return 'neq';
          case 'nin':
            return 'not.in';
          case 'contains':
            return 'ilike';
          case 'ncontains':
            return 'not.ilike';
          case 'containss':
            return 'like';
          case 'ncontainss':
            return 'not.like';
          case 'null':
            return 'is';
          case 'nnull':
            return 'not.is';
          case 'ina':
            return 'cs';
          case 'nina':
            return 'not.cs';
          case 'between':
          case 'nbetween':
            throw Error(`Operator ${e} is not supported`);
          default:
            return e;
        }
      },
      N = (e) => Promise.reject({ ...e, message: e.message, statusCode: Number.parseInt(e.code) });
    function Z(e) {
      return e.replace(/_([a-z])/g, (e, t) => t.toUpperCase());
    }
    function $(e) {
      return e.replace(/[A-Z]/g, (e) => `_${e.toLowerCase()}`);
    }
    function L(e, t) {
      return Array.isArray(e)
        ? e.map((e) => L(e, t))
        : null !== e && 'object' == typeof e
          ? Object.keys(e).reduce((r, n) => ((r[t(n)] = L(e[n], t)), r), {})
          : e;
    }
    let D = new Set([
        'scheduled_at',
        'started_at',
        'ended_at',
        'last_lat',
        'last_lng',
        'created_at',
        'status',
        'route_id',
        'driver_id',
        'title',
        'start_location',
        'end_location',
        'price',
        'capacity',
        'available_seats',
        'is_active',
        'driver_id',
        'license_number',
        'vehicle_model',
        'vehicle_plate',
        'user_id',
        'is_verified',
        'full_name',
        'phone',
        'institution_id',
        'role',
        'student_id',
        'start_date',
        'end_date',
        'updated_at',
        'code',
        'batch_id',
        'valid_days',
        'used_at',
        'created_at',
        'used_by',
        'name',
        'city',
        'user_id',
        'action',
        'resource',
        'resource_id',
        'details',
        'amount',
        'reference_note',
        'enabled',
        'description',
      ]),
      B =
        ((r = R.supabaseClient),
        {
          getList: async ({ resource: e, pagination: t, filters: n, sorters: a, meta: i }) => {
            let { current: s = 1, pageSize: o = 10, mode: u = 'server' } = t ?? {},
              l = (null != i && i.schema ? r.schema(i.schema) : r)
                .from(e)
                .select((null == i ? void 0 : i.select) ?? '*', {
                  count: (null == i ? void 0 : i.count) ?? 'exact',
                });
            ('server' === u && l.range((s - 1) * o, s * o - 1),
              null == a ||
                a.map((e) => {
                  let [t, r] = e.field.split(/\.(?=[^.]+$)/);
                  t && r
                    ? l
                        .select((null == i ? void 0 : i.select) ?? `*, ${t}(${r})`)
                        .order(r, { ascending: 'asc' === e.order, foreignTable: t })
                    : l.order(e.field, { ascending: 'asc' === e.order });
                }),
              null == n ||
                n.map((e) => {
                  ((e, t) => {
                    switch (e.operator) {
                      case 'eq':
                        return t.eq(e.field, e.value);
                      case 'ne':
                        return t.neq(e.field, e.value);
                      case 'in':
                        return t.in(e.field, e.value);
                      case 'ina':
                        return t.contains(e.field, e.value);
                      case 'nina':
                        return t.not(e.field, 'cs', `{${e.value.map((e) => `"${e}"`).join(',')}}`);
                      case 'gt':
                        return t.gt(e.field, e.value);
                      case 'gte':
                        return t.gte(e.field, e.value);
                      case 'lt':
                        return t.lt(e.field, e.value);
                      case 'lte':
                        return t.lte(e.field, e.value);
                      case 'between':
                        if (2 !== e.value.length)
                          throw Error(
                            `[@refinedev/supabase]: Unexpected length ${e.value.length}. Between operator expects a range between 2 values.`,
                          );
                        return t.gte(e.field, e.value[0]).lte(e.field, e.value[1]);
                      case 'contains':
                        return t.ilike(e.field, `%${e.value}%`);
                      case 'containss':
                        return t.like(e.field, `%${e.value}%`);
                      case 'null':
                        return t.is(e.field, null);
                      case 'startswith':
                        return t.ilike(e.field, `${e.value}%`);
                      case 'endswith':
                        return t.ilike(e.field, `%${e.value}`);
                      case 'or': {
                        let r = e.value
                          .map((e) => {
                            if ('or' !== e.operator && 'and' !== e.operator && 'field' in e) {
                              let t = e.value;
                              return (
                                ('ina' === e.operator || 'nina' === e.operator) &&
                                  (t = `{${e.value.map((e) => `"${e}"`).join(',')}}`),
                                ('contains' === e.operator || 'containss' === e.operator) &&
                                  (t = `%${t}%`),
                                'startswith' === e.operator && (t = `${t}%`),
                                'endswith' === e.operator && (t = `%${t}`),
                                `${e.field}.${M(e.operator)}.${t}`
                              );
                            }
                          })
                          .join(',');
                        return t.or(r);
                      }
                      case 'and':
                        throw Error("Operator 'and' is not supported");
                      default:
                        return t.filter(e.field, M(e.operator), e.value);
                    }
                  })(e, l);
                }));
            let { data: c, count: d, error: f } = await l;
            return f ? N(f) : { data: c || [], total: d || 0 };
          },
          getMany: async ({ resource: e, ids: t, meta: n }) => {
            let a = (null != n && n.schema ? r.schema(n.schema) : r)
              .from(e)
              .select((null == n ? void 0 : n.select) ?? '*');
            null != n && n.idColumnName ? a.in(n.idColumnName, t) : a.in('id', t);
            let { data: i, error: s } = await a;
            return s ? N(s) : { data: i || [] };
          },
          create: async ({ resource: e, variables: t, meta: n }) => {
            let a = (null != n && n.schema ? r.schema(n.schema) : r).from(e).insert(t);
            a.select((null == n ? void 0 : n.select) ?? '*');
            let { data: i, error: s } = await a;
            return s ? N(s) : { data: (i || [])[0] };
          },
          createMany: async ({ resource: e, variables: t, meta: n }) => {
            let a = (null != n && n.schema ? r.schema(n.schema) : r).from(e).insert(t);
            a.select((null == n ? void 0 : n.select) ?? '*');
            let { data: i, error: s } = await a;
            return s ? N(s) : { data: i };
          },
          update: async ({ resource: e, id: t, variables: n, meta: a }) => {
            let i = (null != a && a.schema ? r.schema(a.schema) : r).from(e).update(n);
            (null != a && a.idColumnName ? i.eq(a.idColumnName, t) : i.match({ id: t }),
              i.select((null == a ? void 0 : a.select) ?? '*'));
            let { data: s, error: o } = await i;
            return o ? N(o) : { data: (s || [])[0] };
          },
          updateMany: async ({ resource: e, ids: t, variables: n, meta: a }) => ({
            data: await Promise.all(
              t.map(async (t) => {
                let i = (null != a && a.schema ? r.schema(a.schema) : r).from(e).update(n);
                (null != a && a.idColumnName ? i.eq(a.idColumnName, t) : i.match({ id: t }),
                  i.select((null == a ? void 0 : a.select) ?? '*'));
                let { data: s, error: o } = await i;
                return o ? N(o) : (s || [])[0];
              }),
            ),
          }),
          getOne: async ({ resource: e, id: t, meta: n }) => {
            let a = (null != n && n.schema ? r.schema(n.schema) : r)
              .from(e)
              .select((null == n ? void 0 : n.select) ?? '*');
            null != n && n.idColumnName ? a.eq(n.idColumnName, t) : a.match({ id: t });
            let { data: i, error: s } = await a;
            return s ? N(s) : { data: (i || [])[0] };
          },
          deleteOne: async ({ resource: e, id: t, meta: n }) => {
            let a = (null != n && n.schema ? r.schema(n.schema) : r).from(e).delete();
            null != n && n.idColumnName ? a.eq(n.idColumnName, t) : a.match({ id: t });
            let { data: i, error: s } = await a;
            return s ? N(s) : { data: (i || [])[0] };
          },
          deleteMany: async ({ resource: e, ids: t, meta: n }) => ({
            data: await Promise.all(
              t.map(async (t) => {
                let a = (null != n && n.schema ? r.schema(n.schema) : r).from(e).delete();
                null != n && n.idColumnName ? a.eq(n.idColumnName, t) : a.match({ id: t });
                let { data: i, error: s } = await a;
                return s ? N(s) : (i || [])[0];
              }),
            ),
          }),
          getApiUrl: () => {
            throw Error('Not implemented on refine-supabase data provider.');
          },
          custom: () => {
            throw Error('Not implemented on refine-supabase data provider.');
          },
        }),
      z = {
        ...B,
        getList: async (e) => {
          var t, r;
          let n = {
              ...e,
              sorters: Array.isArray((t = e.sorters))
                ? t.map((e) => {
                    var t;
                    return e && 'object' == typeof e && 'string' == typeof e.field
                      ? ((t = e.field), D.has(t))
                        ? { ...e, field: $(e.field) }
                        : e
                      : e;
                  })
                : t,
              filters: Array.isArray((r = e.filters))
                ? r.map((e) => {
                    var t;
                    if (
                      !e ||
                      'object' != typeof e ||
                      'string' != typeof e.field ||
                      ((t = e.field), !D.has(t))
                    )
                      return e;
                    let r = { ...e };
                    return (
                      (r.field = $(e.field)),
                      Array.isArray(e.value) && (r.value = e.value),
                      r
                    );
                  })
                : r,
            },
            a = await B.getList(n);
          return { ...a, data: L(a.data, Z) };
        },
        getMany: B.getMany
          ? async (e) => {
              let t = await B.getMany(e);
              return { ...t, data: L(t.data, Z) };
            }
          : void 0,
        getOne: async (e) => {
          let t = await B.getOne(e);
          return { ...t, data: L(t.data, Z) };
        },
        create: async (e) => {
          let t = L(e.variables, $),
            r = await B.create({ ...e, variables: t });
          return { ...r, data: L(r.data, Z) };
        },
        update: async (e) => {
          let t = L(e.variables, $),
            r = await B.update({ ...e, variables: t });
          return { ...r, data: L(r.data, Z) };
        },
        deleteOne: async (e) => {
          let t = await B.deleteOne(e);
          return { ...t, data: L(t.data, Z) };
        },
        getApiUrl: () => B.getApiUrl(),
        custom: B.custom
          ? async (e) => {
              let t = await B.custom(e);
              return { ...t, data: L(t.data, Z) };
            }
          : void 0,
      };
    var V = e.i(24644),
      F = e.i(41191);
    e.i(74507);
    var U = e.i(30663),
      K = e.i(13451),
      q = e.i(93383);
    (e.s([], 29356),
      e.i(29356),
      ((n = s || (s = {})).assertEqual = (e) => {}),
      (n.assertIs = function (e) {}),
      (n.assertNever = function (e) {
        throw Error();
      }),
      (n.arrayToEnum = (e) => {
        let t = {};
        for (let r of e) t[r] = r;
        return t;
      }),
      (n.getValidEnumValues = (e) => {
        let t = n.objectKeys(e).filter((t) => 'number' != typeof e[e[t]]),
          r = {};
        for (let n of t) r[n] = e[n];
        return n.objectValues(r);
      }),
      (n.objectValues = (e) =>
        n.objectKeys(e).map(function (t) {
          return e[t];
        })),
      (n.objectKeys =
        'function' == typeof Object.keys
          ? (e) => Object.keys(e)
          : (e) => {
              let t = [];
              for (let r in e) Object.prototype.hasOwnProperty.call(e, r) && t.push(r);
              return t;
            }),
      (n.find = (e, t) => {
        for (let r of e) if (t(r)) return r;
      }),
      (n.isInteger =
        'function' == typeof Number.isInteger
          ? (e) => Number.isInteger(e)
          : (e) => 'number' == typeof e && Number.isFinite(e) && Math.floor(e) === e),
      (n.joinValues = function (e, t = ' | ') {
        return e.map((e) => ('string' == typeof e ? `'${e}'` : e)).join(t);
      }),
      (n.jsonStringifyReplacer = (e, t) => ('bigint' == typeof t ? t.toString() : t)),
      ((o || (o = {})).mergeShapes = (e, t) => ({ ...e, ...t })));
    let W = s.arrayToEnum([
        'string',
        'nan',
        'number',
        'integer',
        'float',
        'boolean',
        'date',
        'bigint',
        'symbol',
        'function',
        'undefined',
        'null',
        'array',
        'object',
        'unknown',
        'promise',
        'void',
        'never',
        'map',
        'set',
      ]),
      H = (e) => {
        switch (typeof e) {
          case 'undefined':
            return W.undefined;
          case 'string':
            return W.string;
          case 'number':
            return Number.isNaN(e) ? W.nan : W.number;
          case 'boolean':
            return W.boolean;
          case 'function':
            return W.function;
          case 'bigint':
            return W.bigint;
          case 'symbol':
            return W.symbol;
          case 'object':
            if (Array.isArray(e)) return W.array;
            if (null === e) return W.null;
            if (e.then && 'function' == typeof e.then && e.catch && 'function' == typeof e.catch)
              return W.promise;
            if ('u' > typeof Map && e instanceof Map) return W.map;
            if ('u' > typeof Set && e instanceof Set) return W.set;
            if ('u' > typeof Date && e instanceof Date) return W.date;
            return W.object;
          default:
            return W.unknown;
        }
      };
    e.s(['ZodParsedType', 0, W, 'getParsedType', 0, H, 'objectUtil', 0, o, 'util', 0, s], 58525);
    let G = s.arrayToEnum([
        'invalid_type',
        'invalid_literal',
        'custom',
        'invalid_union',
        'invalid_union_discriminator',
        'invalid_enum_value',
        'unrecognized_keys',
        'invalid_arguments',
        'invalid_return_type',
        'invalid_date',
        'invalid_string',
        'too_small',
        'too_big',
        'invalid_intersection_types',
        'not_multiple_of',
        'not_finite',
      ]),
      Q = (e) => JSON.stringify(e, null, 2).replace(/"([^"]+)":/g, '$1:');
    class Y extends Error {
      get errors() {
        return this.issues;
      }
      constructor(e) {
        (super(),
          (this.issues = []),
          (this.addIssue = (e) => {
            this.issues = [...this.issues, e];
          }),
          (this.addIssues = (e = []) => {
            this.issues = [...this.issues, ...e];
          }));
        const t = new.target.prototype;
        (Object.setPrototypeOf ? Object.setPrototypeOf(this, t) : (this.__proto__ = t),
          (this.name = 'ZodError'),
          (this.issues = e));
      }
      format(e) {
        let t =
            e ||
            function (e) {
              return e.message;
            },
          r = { _errors: [] },
          n = (e) => {
            for (let a of e.issues)
              if ('invalid_union' === a.code) a.unionErrors.map(n);
              else if ('invalid_return_type' === a.code) n(a.returnTypeError);
              else if ('invalid_arguments' === a.code) n(a.argumentsError);
              else if (0 === a.path.length) r._errors.push(t(a));
              else {
                let e = r,
                  n = 0;
                for (; n < a.path.length; ) {
                  let r = a.path[n];
                  (n === a.path.length - 1
                    ? ((e[r] = e[r] || { _errors: [] }), e[r]._errors.push(t(a)))
                    : (e[r] = e[r] || { _errors: [] }),
                    (e = e[r]),
                    n++);
                }
              }
          };
        return (n(this), r);
      }
      static assert(e) {
        if (!(e instanceof Y)) throw Error(`Not a ZodError: ${e}`);
      }
      toString() {
        return this.message;
      }
      get message() {
        return JSON.stringify(this.issues, s.jsonStringifyReplacer, 2);
      }
      get isEmpty() {
        return 0 === this.issues.length;
      }
      flatten(e = (e) => e.message) {
        let t = {},
          r = [];
        for (let n of this.issues)
          if (n.path.length > 0) {
            let r = n.path[0];
            ((t[r] = t[r] || []), t[r].push(e(n)));
          } else r.push(e(n));
        return { formErrors: r, fieldErrors: t };
      }
      get formErrors() {
        return this.flatten();
      }
    }
    ((Y.create = (e) => new Y(e)),
      e.s(['ZodError', 0, Y, 'ZodIssueCode', 0, G, 'quotelessJson', 0, Q], 11838));
    let J = (e, t) => {
        let r;
        switch (e.code) {
          case G.invalid_type:
            r =
              e.received === W.undefined
                ? 'Required'
                : `Expected ${e.expected}, received ${e.received}`;
            break;
          case G.invalid_literal:
            r = `Invalid literal value, expected ${JSON.stringify(e.expected, s.jsonStringifyReplacer)}`;
            break;
          case G.unrecognized_keys:
            r = `Unrecognized key(s) in object: ${s.joinValues(e.keys, ', ')}`;
            break;
          case G.invalid_union:
            r = 'Invalid input';
            break;
          case G.invalid_union_discriminator:
            r = `Invalid discriminator value. Expected ${s.joinValues(e.options)}`;
            break;
          case G.invalid_enum_value:
            r = `Invalid enum value. Expected ${s.joinValues(e.options)}, received '${e.received}'`;
            break;
          case G.invalid_arguments:
            r = 'Invalid function arguments';
            break;
          case G.invalid_return_type:
            r = 'Invalid function return type';
            break;
          case G.invalid_date:
            r = 'Invalid date';
            break;
          case G.invalid_string:
            'object' == typeof e.validation
              ? 'includes' in e.validation
                ? ((r = `Invalid input: must include "${e.validation.includes}"`),
                  'number' == typeof e.validation.position &&
                    (r = `${r} at one or more positions greater than or equal to ${e.validation.position}`))
                : 'startsWith' in e.validation
                  ? (r = `Invalid input: must start with "${e.validation.startsWith}"`)
                  : 'endsWith' in e.validation
                    ? (r = `Invalid input: must end with "${e.validation.endsWith}"`)
                    : s.assertNever(e.validation)
              : (r = 'regex' !== e.validation ? `Invalid ${e.validation}` : 'Invalid');
            break;
          case G.too_small:
            r =
              'array' === e.type
                ? `Array must contain ${e.exact ? 'exactly' : e.inclusive ? 'at least' : 'more than'} ${e.minimum} element(s)`
                : 'string' === e.type
                  ? `String must contain ${e.exact ? 'exactly' : e.inclusive ? 'at least' : 'over'} ${e.minimum} character(s)`
                  : 'number' === e.type || 'bigint' === e.type
                    ? `Number must be ${e.exact ? 'exactly equal to ' : e.inclusive ? 'greater than or equal to ' : 'greater than '}${e.minimum}`
                    : 'date' === e.type
                      ? `Date must be ${e.exact ? 'exactly equal to ' : e.inclusive ? 'greater than or equal to ' : 'greater than '}${new Date(Number(e.minimum))}`
                      : 'Invalid input';
            break;
          case G.too_big:
            r =
              'array' === e.type
                ? `Array must contain ${e.exact ? 'exactly' : e.inclusive ? 'at most' : 'less than'} ${e.maximum} element(s)`
                : 'string' === e.type
                  ? `String must contain ${e.exact ? 'exactly' : e.inclusive ? 'at most' : 'under'} ${e.maximum} character(s)`
                  : 'number' === e.type
                    ? `Number must be ${e.exact ? 'exactly' : e.inclusive ? 'less than or equal to' : 'less than'} ${e.maximum}`
                    : 'bigint' === e.type
                      ? `BigInt must be ${e.exact ? 'exactly' : e.inclusive ? 'less than or equal to' : 'less than'} ${e.maximum}`
                      : 'date' === e.type
                        ? `Date must be ${e.exact ? 'exactly' : e.inclusive ? 'smaller than or equal to' : 'smaller than'} ${new Date(Number(e.maximum))}`
                        : 'Invalid input';
            break;
          case G.custom:
            r = 'Invalid input';
            break;
          case G.invalid_intersection_types:
            r = 'Intersection results could not be merged';
            break;
          case G.not_multiple_of:
            r = `Number must be a multiple of ${e.multipleOf}`;
            break;
          case G.not_finite:
            r = 'Number must be finite';
            break;
          default:
            ((r = t.defaultError), s.assertNever(e));
        }
        return { message: r };
      },
      X = J;
    function ee(e) {
      X = e;
    }
    function et() {
      return X;
    }
    (e.s(['getErrorMap', 0, et, 'setErrorMap', 0, ee], 91464),
      e.i(91464),
      e.s(['defaultErrorMap', 0, J, 'getErrorMap', 0, et, 'setErrorMap', 0, ee], 54603),
      e.i(54603));
    let er = (e) => {
        let { data: t, path: r, errorMaps: n, issueData: a } = e,
          i = [...r, ...(a.path || [])],
          s = { ...a, path: i };
        if (void 0 !== a.message) return { ...a, path: i, message: a.message };
        let o = '';
        for (let e of n
          .filter((e) => !!e)
          .slice()
          .reverse())
          o = e(s, { data: t, defaultError: o }).message;
        return { ...a, path: i, message: o };
      },
      en = [];
    function ea(e, t) {
      let r = et(),
        n = er({
          issueData: t,
          data: e.data,
          path: e.path,
          errorMaps: [
            e.common.contextualErrorMap,
            e.schemaErrorMap,
            r,
            r === J ? void 0 : J,
          ].filter((e) => !!e),
        });
      e.common.issues.push(n);
    }
    class ei {
      constructor() {
        this.value = 'valid';
      }
      dirty() {
        'valid' === this.value && (this.value = 'dirty');
      }
      abort() {
        'aborted' !== this.value && (this.value = 'aborted');
      }
      static mergeArray(e, t) {
        let r = [];
        for (let n of t) {
          if ('aborted' === n.status) return es;
          ('dirty' === n.status && e.dirty(), r.push(n.value));
        }
        return { status: e.value, value: r };
      }
      static async mergeObjectAsync(e, t) {
        let r = [];
        for (let e of t) {
          let t = await e.key,
            n = await e.value;
          r.push({ key: t, value: n });
        }
        return ei.mergeObjectSync(e, r);
      }
      static mergeObjectSync(e, t) {
        let r = {};
        for (let n of t) {
          let { key: t, value: a } = n;
          if ('aborted' === t.status || 'aborted' === a.status) return es;
          ('dirty' === t.status && e.dirty(),
            'dirty' === a.status && e.dirty(),
            '__proto__' !== t.value &&
              (void 0 !== a.value || n.alwaysSet) &&
              (r[t.value] = a.value));
        }
        return { status: e.value, value: r };
      }
    }
    let es = Object.freeze({ status: 'aborted' }),
      eo = (e) => ({ status: 'dirty', value: e }),
      eu = (e) => ({ status: 'valid', value: e }),
      el = (e) => 'aborted' === e.status,
      ec = (e) => 'dirty' === e.status,
      ed = (e) => 'valid' === e.status,
      ef = (e) => 'u' > typeof Promise && e instanceof Promise;
    (e.s(
      [
        'DIRTY',
        0,
        eo,
        'EMPTY_PATH',
        0,
        en,
        'INVALID',
        0,
        es,
        'OK',
        0,
        eu,
        'ParseStatus',
        0,
        ei,
        'addIssueToContext',
        0,
        ea,
        'isAborted',
        0,
        el,
        'isAsync',
        0,
        ef,
        'isDirty',
        0,
        ec,
        'isValid',
        0,
        ed,
        'makeIssue',
        0,
        er,
      ],
      84730,
    ),
      e.i(84730),
      e.s([], 66627),
      e.i(66627),
      e.i(58525),
      ((a = u || (u = {})).errToObj = (e) => ('string' == typeof e ? { message: e } : e || {})),
      (a.toString = (e) => ('string' == typeof e ? e : e?.message)));
    class ep {
      constructor(e, t, r, n) {
        ((this._cachedPath = []),
          (this.parent = e),
          (this.data = t),
          (this._path = r),
          (this._key = n));
      }
      get path() {
        return (
          this._cachedPath.length ||
            (Array.isArray(this._key)
              ? this._cachedPath.push(...this._path, ...this._key)
              : this._cachedPath.push(...this._path, this._key)),
          this._cachedPath
        );
      }
    }
    let eh = (e, t) => {
      if (ed(t)) return { success: !0, data: t.value };
      if (!e.common.issues.length) throw Error('Validation failed but no issues detected.');
      return {
        success: !1,
        get error() {
          if (this._error) return this._error;
          let t = new Y(e.common.issues);
          return ((this._error = t), this._error);
        },
      };
    };
    function em(e) {
      if (!e) return {};
      let { errorMap: t, invalid_type_error: r, required_error: n, description: a } = e;
      if (t && (r || n))
        throw Error(
          'Can\'t use "invalid_type_error" or "required_error" in conjunction with custom error map.',
        );
      return t
        ? { errorMap: t, description: a }
        : {
            errorMap: (t, a) => {
              let { message: i } = e;
              return 'invalid_enum_value' === t.code
                ? { message: i ?? a.defaultError }
                : void 0 === a.data
                  ? { message: i ?? n ?? a.defaultError }
                  : 'invalid_type' !== t.code
                    ? { message: a.defaultError }
                    : { message: i ?? r ?? a.defaultError };
            },
            description: a,
          };
    }
    class ev {
      get description() {
        return this._def.description;
      }
      _getType(e) {
        return H(e.data);
      }
      _getOrReturnCtx(e, t) {
        return (
          t || {
            common: e.parent.common,
            data: e.data,
            parsedType: H(e.data),
            schemaErrorMap: this._def.errorMap,
            path: e.path,
            parent: e.parent,
          }
        );
      }
      _processInputParams(e) {
        return {
          status: new ei(),
          ctx: {
            common: e.parent.common,
            data: e.data,
            parsedType: H(e.data),
            schemaErrorMap: this._def.errorMap,
            path: e.path,
            parent: e.parent,
          },
        };
      }
      _parseSync(e) {
        let t = this._parse(e);
        if (ef(t)) throw Error('Synchronous parse encountered promise.');
        return t;
      }
      _parseAsync(e) {
        return Promise.resolve(this._parse(e));
      }
      parse(e, t) {
        let r = this.safeParse(e, t);
        if (r.success) return r.data;
        throw r.error;
      }
      safeParse(e, t) {
        let r = {
            common: { issues: [], async: t?.async ?? !1, contextualErrorMap: t?.errorMap },
            path: t?.path || [],
            schemaErrorMap: this._def.errorMap,
            parent: null,
            data: e,
            parsedType: H(e),
          },
          n = this._parseSync({ data: e, path: r.path, parent: r });
        return eh(r, n);
      }
      '~validate'(e) {
        let t = {
          common: { issues: [], async: !!this['~standard'].async },
          path: [],
          schemaErrorMap: this._def.errorMap,
          parent: null,
          data: e,
          parsedType: H(e),
        };
        if (!this['~standard'].async)
          try {
            let r = this._parseSync({ data: e, path: [], parent: t });
            return ed(r) ? { value: r.value } : { issues: t.common.issues };
          } catch (e) {
            (e?.message?.toLowerCase()?.includes('encountered') && (this['~standard'].async = !0),
              (t.common = { issues: [], async: !0 }));
          }
        return this._parseAsync({ data: e, path: [], parent: t }).then((e) =>
          ed(e) ? { value: e.value } : { issues: t.common.issues },
        );
      }
      async parseAsync(e, t) {
        let r = await this.safeParseAsync(e, t);
        if (r.success) return r.data;
        throw r.error;
      }
      async safeParseAsync(e, t) {
        let r = {
            common: { issues: [], contextualErrorMap: t?.errorMap, async: !0 },
            path: t?.path || [],
            schemaErrorMap: this._def.errorMap,
            parent: null,
            data: e,
            parsedType: H(e),
          },
          n = this._parse({ data: e, path: r.path, parent: r });
        return eh(r, await (ef(n) ? n : Promise.resolve(n)));
      }
      refine(e, t) {
        return this._refinement((r, n) => {
          let a = e(r),
            i = () =>
              n.addIssue({
                code: G.custom,
                ...('string' == typeof t || void 0 === t
                  ? { message: t }
                  : 'function' == typeof t
                    ? t(r)
                    : t),
              });
          return 'u' > typeof Promise && a instanceof Promise
            ? a.then((e) => !!e || (i(), !1))
            : !!a || (i(), !1);
        });
      }
      refinement(e, t) {
        return this._refinement(
          (r, n) => !!e(r) || (n.addIssue('function' == typeof t ? t(r, n) : t), !1),
        );
      }
      _refinement(e) {
        return new te({
          schema: this,
          typeName: l.ZodEffects,
          effect: { type: 'refinement', refinement: e },
        });
      }
      superRefine(e) {
        return this._refinement(e);
      }
      constructor(e) {
        ((this.spa = this.safeParseAsync),
          (this._def = e),
          (this.parse = this.parse.bind(this)),
          (this.safeParse = this.safeParse.bind(this)),
          (this.parseAsync = this.parseAsync.bind(this)),
          (this.safeParseAsync = this.safeParseAsync.bind(this)),
          (this.spa = this.spa.bind(this)),
          (this.refine = this.refine.bind(this)),
          (this.refinement = this.refinement.bind(this)),
          (this.superRefine = this.superRefine.bind(this)),
          (this.optional = this.optional.bind(this)),
          (this.nullable = this.nullable.bind(this)),
          (this.nullish = this.nullish.bind(this)),
          (this.array = this.array.bind(this)),
          (this.promise = this.promise.bind(this)),
          (this.or = this.or.bind(this)),
          (this.and = this.and.bind(this)),
          (this.transform = this.transform.bind(this)),
          (this.brand = this.brand.bind(this)),
          (this.default = this.default.bind(this)),
          (this.catch = this.catch.bind(this)),
          (this.describe = this.describe.bind(this)),
          (this.pipe = this.pipe.bind(this)),
          (this.readonly = this.readonly.bind(this)),
          (this.isNullable = this.isNullable.bind(this)),
          (this.isOptional = this.isOptional.bind(this)),
          (this['~standard'] = {
            version: 1,
            vendor: 'zod',
            validate: (e) => this['~validate'](e),
          }));
      }
      optional() {
        return tt.create(this, this._def);
      }
      nullable() {
        return tr.create(this, this._def);
      }
      nullish() {
        return this.nullable().optional();
      }
      array() {
        return eW.create(this);
      }
      promise() {
        return e8.create(this, this._def);
      }
      or(e) {
        return eG.create([this, e], this._def);
      }
      and(e) {
        return eJ.create(this, e, this._def);
      }
      transform(e) {
        return new te({
          ...em(this._def),
          schema: this,
          typeName: l.ZodEffects,
          effect: { type: 'transform', transform: e },
        });
      }
      default(e) {
        return new tn({
          ...em(this._def),
          innerType: this,
          defaultValue: 'function' == typeof e ? e : () => e,
          typeName: l.ZodDefault,
        });
      }
      brand() {
        return new to({ typeName: l.ZodBranded, type: this, ...em(this._def) });
      }
      catch(e) {
        return new ta({
          ...em(this._def),
          innerType: this,
          catchValue: 'function' == typeof e ? e : () => e,
          typeName: l.ZodCatch,
        });
      }
      describe(e) {
        return new this.constructor({ ...this._def, description: e });
      }
      pipe(e) {
        return tu.create(this, e);
      }
      readonly() {
        return tl.create(this);
      }
      isOptional() {
        return this.safeParse(void 0).success;
      }
      isNullable() {
        return this.safeParse(null).success;
      }
    }
    let eg = /^c[^\s-]{8,}$/i,
      ey = /^[0-9a-z]+$/,
      e_ = /^[0-9A-HJKMNP-TV-Z]{26}$/i,
      eb = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i,
      ex = /^[a-z0-9_-]{21}$/i,
      ew = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/,
      ek =
        /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/,
      eO = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i,
      eS =
        /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/,
      ej =
        /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/,
      eA =
        /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/,
      eP =
        /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/,
      eE = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/,
      eC = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/,
      eR =
        '((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))',
      eT = RegExp(`^${eR}$`);
    function eI(e) {
      let t = '[0-5]\\d';
      e.precision
        ? (t = `${t}\\.\\d{${e.precision}}`)
        : null == e.precision && (t = `${t}(\\.\\d+)?`);
      let r = e.precision ? '+' : '?';
      return `([01]\\d|2[0-3]):[0-5]\\d(:${t})${r}`;
    }
    function eM(e) {
      let t = `${eR}T${eI(e)}`,
        r = [];
      return (
        r.push(e.local ? 'Z?' : 'Z'),
        e.offset && r.push('([+-]\\d{2}:?\\d{2})'),
        (t = `${t}(${r.join('|')})`),
        RegExp(`^${t}$`)
      );
    }
    class eN extends ev {
      _parse(e) {
        var r, n, a, i;
        let o;
        if ((this._def.coerce && (e.data = String(e.data)), this._getType(e) !== W.string)) {
          let t = this._getOrReturnCtx(e);
          return (ea(t, { code: G.invalid_type, expected: W.string, received: t.parsedType }), es);
        }
        let u = new ei();
        for (let l of this._def.checks)
          if ('min' === l.kind)
            e.data.length < l.value &&
              (ea((o = this._getOrReturnCtx(e, o)), {
                code: G.too_small,
                minimum: l.value,
                type: 'string',
                inclusive: !0,
                exact: !1,
                message: l.message,
              }),
              u.dirty());
          else if ('max' === l.kind)
            e.data.length > l.value &&
              (ea((o = this._getOrReturnCtx(e, o)), {
                code: G.too_big,
                maximum: l.value,
                type: 'string',
                inclusive: !0,
                exact: !1,
                message: l.message,
              }),
              u.dirty());
          else if ('length' === l.kind) {
            let t = e.data.length > l.value,
              r = e.data.length < l.value;
            (t || r) &&
              ((o = this._getOrReturnCtx(e, o)),
              t
                ? ea(o, {
                    code: G.too_big,
                    maximum: l.value,
                    type: 'string',
                    inclusive: !0,
                    exact: !0,
                    message: l.message,
                  })
                : r &&
                  ea(o, {
                    code: G.too_small,
                    minimum: l.value,
                    type: 'string',
                    inclusive: !0,
                    exact: !0,
                    message: l.message,
                  }),
              u.dirty());
          } else if ('email' === l.kind)
            eO.test(e.data) ||
              (ea((o = this._getOrReturnCtx(e, o)), {
                validation: 'email',
                code: G.invalid_string,
                message: l.message,
              }),
              u.dirty());
          else if ('emoji' === l.kind)
            (t || (t = RegExp('^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$', 'u')),
              t.test(e.data) ||
                (ea((o = this._getOrReturnCtx(e, o)), {
                  validation: 'emoji',
                  code: G.invalid_string,
                  message: l.message,
                }),
                u.dirty()));
          else if ('uuid' === l.kind)
            eb.test(e.data) ||
              (ea((o = this._getOrReturnCtx(e, o)), {
                validation: 'uuid',
                code: G.invalid_string,
                message: l.message,
              }),
              u.dirty());
          else if ('nanoid' === l.kind)
            ex.test(e.data) ||
              (ea((o = this._getOrReturnCtx(e, o)), {
                validation: 'nanoid',
                code: G.invalid_string,
                message: l.message,
              }),
              u.dirty());
          else if ('cuid' === l.kind)
            eg.test(e.data) ||
              (ea((o = this._getOrReturnCtx(e, o)), {
                validation: 'cuid',
                code: G.invalid_string,
                message: l.message,
              }),
              u.dirty());
          else if ('cuid2' === l.kind)
            ey.test(e.data) ||
              (ea((o = this._getOrReturnCtx(e, o)), {
                validation: 'cuid2',
                code: G.invalid_string,
                message: l.message,
              }),
              u.dirty());
          else if ('ulid' === l.kind)
            e_.test(e.data) ||
              (ea((o = this._getOrReturnCtx(e, o)), {
                validation: 'ulid',
                code: G.invalid_string,
                message: l.message,
              }),
              u.dirty());
          else if ('url' === l.kind)
            try {
              new URL(e.data);
            } catch {
              (ea((o = this._getOrReturnCtx(e, o)), {
                validation: 'url',
                code: G.invalid_string,
                message: l.message,
              }),
                u.dirty());
            }
          else
            'regex' === l.kind
              ? ((l.regex.lastIndex = 0),
                l.regex.test(e.data) ||
                  (ea((o = this._getOrReturnCtx(e, o)), {
                    validation: 'regex',
                    code: G.invalid_string,
                    message: l.message,
                  }),
                  u.dirty()))
              : 'trim' === l.kind
                ? (e.data = e.data.trim())
                : 'includes' === l.kind
                  ? e.data.includes(l.value, l.position) ||
                    (ea((o = this._getOrReturnCtx(e, o)), {
                      code: G.invalid_string,
                      validation: { includes: l.value, position: l.position },
                      message: l.message,
                    }),
                    u.dirty())
                  : 'toLowerCase' === l.kind
                    ? (e.data = e.data.toLowerCase())
                    : 'toUpperCase' === l.kind
                      ? (e.data = e.data.toUpperCase())
                      : 'startsWith' === l.kind
                        ? e.data.startsWith(l.value) ||
                          (ea((o = this._getOrReturnCtx(e, o)), {
                            code: G.invalid_string,
                            validation: { startsWith: l.value },
                            message: l.message,
                          }),
                          u.dirty())
                        : 'endsWith' === l.kind
                          ? e.data.endsWith(l.value) ||
                            (ea((o = this._getOrReturnCtx(e, o)), {
                              code: G.invalid_string,
                              validation: { endsWith: l.value },
                              message: l.message,
                            }),
                            u.dirty())
                          : 'datetime' === l.kind
                            ? eM(l).test(e.data) ||
                              (ea((o = this._getOrReturnCtx(e, o)), {
                                code: G.invalid_string,
                                validation: 'datetime',
                                message: l.message,
                              }),
                              u.dirty())
                            : 'date' === l.kind
                              ? eT.test(e.data) ||
                                (ea((o = this._getOrReturnCtx(e, o)), {
                                  code: G.invalid_string,
                                  validation: 'date',
                                  message: l.message,
                                }),
                                u.dirty())
                              : 'time' === l.kind
                                ? RegExp(`^${eI(l)}$`).test(e.data) ||
                                  (ea((o = this._getOrReturnCtx(e, o)), {
                                    code: G.invalid_string,
                                    validation: 'time',
                                    message: l.message,
                                  }),
                                  u.dirty())
                                : 'duration' === l.kind
                                  ? ek.test(e.data) ||
                                    (ea((o = this._getOrReturnCtx(e, o)), {
                                      validation: 'duration',
                                      code: G.invalid_string,
                                      message: l.message,
                                    }),
                                    u.dirty())
                                  : 'ip' === l.kind
                                    ? ((r = e.data),
                                      !(
                                        (('v4' === (n = l.version) || !n) && eS.test(r)) ||
                                        (('v6' === n || !n) && eA.test(r))
                                      ) &&
                                        1 &&
                                        (ea((o = this._getOrReturnCtx(e, o)), {
                                          validation: 'ip',
                                          code: G.invalid_string,
                                          message: l.message,
                                        }),
                                        u.dirty()))
                                    : 'jwt' === l.kind
                                      ? !(function (e, t) {
                                          if (!ew.test(e)) return !1;
                                          try {
                                            let [r] = e.split('.');
                                            if (!r) return !1;
                                            let n = r
                                                .replace(/-/g, '+')
                                                .replace(/_/g, '/')
                                                .padEnd(r.length + ((4 - (r.length % 4)) % 4), '='),
                                              a = JSON.parse(atob(n));
                                            if (
                                              'object' != typeof a ||
                                              null === a ||
                                              ('typ' in a && a?.typ !== 'JWT') ||
                                              !a.alg ||
                                              (t && a.alg !== t)
                                            )
                                              return !1;
                                            return !0;
                                          } catch {
                                            return !1;
                                          }
                                        })(e.data, l.alg) &&
                                        (ea((o = this._getOrReturnCtx(e, o)), {
                                          validation: 'jwt',
                                          code: G.invalid_string,
                                          message: l.message,
                                        }),
                                        u.dirty())
                                      : 'cidr' === l.kind
                                        ? ((a = e.data),
                                          !(
                                            (('v4' === (i = l.version) || !i) && ej.test(a)) ||
                                            (('v6' === i || !i) && eP.test(a))
                                          ) &&
                                            1 &&
                                            (ea((o = this._getOrReturnCtx(e, o)), {
                                              validation: 'cidr',
                                              code: G.invalid_string,
                                              message: l.message,
                                            }),
                                            u.dirty()))
                                        : 'base64' === l.kind
                                          ? eE.test(e.data) ||
                                            (ea((o = this._getOrReturnCtx(e, o)), {
                                              validation: 'base64',
                                              code: G.invalid_string,
                                              message: l.message,
                                            }),
                                            u.dirty())
                                          : 'base64url' === l.kind
                                            ? eC.test(e.data) ||
                                              (ea((o = this._getOrReturnCtx(e, o)), {
                                                validation: 'base64url',
                                                code: G.invalid_string,
                                                message: l.message,
                                              }),
                                              u.dirty())
                                            : s.assertNever(l);
        return { status: u.value, value: e.data };
      }
      _regex(e, t, r) {
        return this.refinement((t) => e.test(t), {
          validation: t,
          code: G.invalid_string,
          ...u.errToObj(r),
        });
      }
      _addCheck(e) {
        return new eN({ ...this._def, checks: [...this._def.checks, e] });
      }
      email(e) {
        return this._addCheck({ kind: 'email', ...u.errToObj(e) });
      }
      url(e) {
        return this._addCheck({ kind: 'url', ...u.errToObj(e) });
      }
      emoji(e) {
        return this._addCheck({ kind: 'emoji', ...u.errToObj(e) });
      }
      uuid(e) {
        return this._addCheck({ kind: 'uuid', ...u.errToObj(e) });
      }
      nanoid(e) {
        return this._addCheck({ kind: 'nanoid', ...u.errToObj(e) });
      }
      cuid(e) {
        return this._addCheck({ kind: 'cuid', ...u.errToObj(e) });
      }
      cuid2(e) {
        return this._addCheck({ kind: 'cuid2', ...u.errToObj(e) });
      }
      ulid(e) {
        return this._addCheck({ kind: 'ulid', ...u.errToObj(e) });
      }
      base64(e) {
        return this._addCheck({ kind: 'base64', ...u.errToObj(e) });
      }
      base64url(e) {
        return this._addCheck({ kind: 'base64url', ...u.errToObj(e) });
      }
      jwt(e) {
        return this._addCheck({ kind: 'jwt', ...u.errToObj(e) });
      }
      ip(e) {
        return this._addCheck({ kind: 'ip', ...u.errToObj(e) });
      }
      cidr(e) {
        return this._addCheck({ kind: 'cidr', ...u.errToObj(e) });
      }
      datetime(e) {
        return 'string' == typeof e
          ? this._addCheck({ kind: 'datetime', precision: null, offset: !1, local: !1, message: e })
          : this._addCheck({
              kind: 'datetime',
              precision: void 0 === e?.precision ? null : e?.precision,
              offset: e?.offset ?? !1,
              local: e?.local ?? !1,
              ...u.errToObj(e?.message),
            });
      }
      date(e) {
        return this._addCheck({ kind: 'date', message: e });
      }
      time(e) {
        return 'string' == typeof e
          ? this._addCheck({ kind: 'time', precision: null, message: e })
          : this._addCheck({
              kind: 'time',
              precision: void 0 === e?.precision ? null : e?.precision,
              ...u.errToObj(e?.message),
            });
      }
      duration(e) {
        return this._addCheck({ kind: 'duration', ...u.errToObj(e) });
      }
      regex(e, t) {
        return this._addCheck({ kind: 'regex', regex: e, ...u.errToObj(t) });
      }
      includes(e, t) {
        return this._addCheck({
          kind: 'includes',
          value: e,
          position: t?.position,
          ...u.errToObj(t?.message),
        });
      }
      startsWith(e, t) {
        return this._addCheck({ kind: 'startsWith', value: e, ...u.errToObj(t) });
      }
      endsWith(e, t) {
        return this._addCheck({ kind: 'endsWith', value: e, ...u.errToObj(t) });
      }
      min(e, t) {
        return this._addCheck({ kind: 'min', value: e, ...u.errToObj(t) });
      }
      max(e, t) {
        return this._addCheck({ kind: 'max', value: e, ...u.errToObj(t) });
      }
      length(e, t) {
        return this._addCheck({ kind: 'length', value: e, ...u.errToObj(t) });
      }
      nonempty(e) {
        return this.min(1, u.errToObj(e));
      }
      trim() {
        return new eN({ ...this._def, checks: [...this._def.checks, { kind: 'trim' }] });
      }
      toLowerCase() {
        return new eN({ ...this._def, checks: [...this._def.checks, { kind: 'toLowerCase' }] });
      }
      toUpperCase() {
        return new eN({ ...this._def, checks: [...this._def.checks, { kind: 'toUpperCase' }] });
      }
      get isDatetime() {
        return !!this._def.checks.find((e) => 'datetime' === e.kind);
      }
      get isDate() {
        return !!this._def.checks.find((e) => 'date' === e.kind);
      }
      get isTime() {
        return !!this._def.checks.find((e) => 'time' === e.kind);
      }
      get isDuration() {
        return !!this._def.checks.find((e) => 'duration' === e.kind);
      }
      get isEmail() {
        return !!this._def.checks.find((e) => 'email' === e.kind);
      }
      get isURL() {
        return !!this._def.checks.find((e) => 'url' === e.kind);
      }
      get isEmoji() {
        return !!this._def.checks.find((e) => 'emoji' === e.kind);
      }
      get isUUID() {
        return !!this._def.checks.find((e) => 'uuid' === e.kind);
      }
      get isNANOID() {
        return !!this._def.checks.find((e) => 'nanoid' === e.kind);
      }
      get isCUID() {
        return !!this._def.checks.find((e) => 'cuid' === e.kind);
      }
      get isCUID2() {
        return !!this._def.checks.find((e) => 'cuid2' === e.kind);
      }
      get isULID() {
        return !!this._def.checks.find((e) => 'ulid' === e.kind);
      }
      get isIP() {
        return !!this._def.checks.find((e) => 'ip' === e.kind);
      }
      get isCIDR() {
        return !!this._def.checks.find((e) => 'cidr' === e.kind);
      }
      get isBase64() {
        return !!this._def.checks.find((e) => 'base64' === e.kind);
      }
      get isBase64url() {
        return !!this._def.checks.find((e) => 'base64url' === e.kind);
      }
      get minLength() {
        let e = null;
        for (let t of this._def.checks)
          'min' === t.kind && (null === e || t.value > e) && (e = t.value);
        return e;
      }
      get maxLength() {
        let e = null;
        for (let t of this._def.checks)
          'max' === t.kind && (null === e || t.value < e) && (e = t.value);
        return e;
      }
    }
    eN.create = (e) =>
      new eN({ checks: [], typeName: l.ZodString, coerce: e?.coerce ?? !1, ...em(e) });
    class eZ extends ev {
      constructor() {
        (super(...arguments),
          (this.min = this.gte),
          (this.max = this.lte),
          (this.step = this.multipleOf));
      }
      _parse(e) {
        let t;
        if ((this._def.coerce && (e.data = Number(e.data)), this._getType(e) !== W.number)) {
          let t = this._getOrReturnCtx(e);
          return (ea(t, { code: G.invalid_type, expected: W.number, received: t.parsedType }), es);
        }
        let r = new ei();
        for (let n of this._def.checks)
          'int' === n.kind
            ? s.isInteger(e.data) ||
              (ea((t = this._getOrReturnCtx(e, t)), {
                code: G.invalid_type,
                expected: 'integer',
                received: 'float',
                message: n.message,
              }),
              r.dirty())
            : 'min' === n.kind
              ? (n.inclusive ? e.data < n.value : e.data <= n.value) &&
                (ea((t = this._getOrReturnCtx(e, t)), {
                  code: G.too_small,
                  minimum: n.value,
                  type: 'number',
                  inclusive: n.inclusive,
                  exact: !1,
                  message: n.message,
                }),
                r.dirty())
              : 'max' === n.kind
                ? (n.inclusive ? e.data > n.value : e.data >= n.value) &&
                  (ea((t = this._getOrReturnCtx(e, t)), {
                    code: G.too_big,
                    maximum: n.value,
                    type: 'number',
                    inclusive: n.inclusive,
                    exact: !1,
                    message: n.message,
                  }),
                  r.dirty())
                : 'multipleOf' === n.kind
                  ? 0 !==
                      (function (e, t) {
                        let r = (e.toString().split('.')[1] || '').length,
                          n = (t.toString().split('.')[1] || '').length,
                          a = r > n ? r : n;
                        return (
                          (Number.parseInt(e.toFixed(a).replace('.', '')) %
                            Number.parseInt(t.toFixed(a).replace('.', ''))) /
                          10 ** a
                        );
                      })(e.data, n.value) &&
                    (ea((t = this._getOrReturnCtx(e, t)), {
                      code: G.not_multiple_of,
                      multipleOf: n.value,
                      message: n.message,
                    }),
                    r.dirty())
                  : 'finite' === n.kind
                    ? Number.isFinite(e.data) ||
                      (ea((t = this._getOrReturnCtx(e, t)), {
                        code: G.not_finite,
                        message: n.message,
                      }),
                      r.dirty())
                    : s.assertNever(n);
        return { status: r.value, value: e.data };
      }
      gte(e, t) {
        return this.setLimit('min', e, !0, u.toString(t));
      }
      gt(e, t) {
        return this.setLimit('min', e, !1, u.toString(t));
      }
      lte(e, t) {
        return this.setLimit('max', e, !0, u.toString(t));
      }
      lt(e, t) {
        return this.setLimit('max', e, !1, u.toString(t));
      }
      setLimit(e, t, r, n) {
        return new eZ({
          ...this._def,
          checks: [
            ...this._def.checks,
            { kind: e, value: t, inclusive: r, message: u.toString(n) },
          ],
        });
      }
      _addCheck(e) {
        return new eZ({ ...this._def, checks: [...this._def.checks, e] });
      }
      int(e) {
        return this._addCheck({ kind: 'int', message: u.toString(e) });
      }
      positive(e) {
        return this._addCheck({ kind: 'min', value: 0, inclusive: !1, message: u.toString(e) });
      }
      negative(e) {
        return this._addCheck({ kind: 'max', value: 0, inclusive: !1, message: u.toString(e) });
      }
      nonpositive(e) {
        return this._addCheck({ kind: 'max', value: 0, inclusive: !0, message: u.toString(e) });
      }
      nonnegative(e) {
        return this._addCheck({ kind: 'min', value: 0, inclusive: !0, message: u.toString(e) });
      }
      multipleOf(e, t) {
        return this._addCheck({ kind: 'multipleOf', value: e, message: u.toString(t) });
      }
      finite(e) {
        return this._addCheck({ kind: 'finite', message: u.toString(e) });
      }
      safe(e) {
        return this._addCheck({
          kind: 'min',
          inclusive: !0,
          value: Number.MIN_SAFE_INTEGER,
          message: u.toString(e),
        })._addCheck({
          kind: 'max',
          inclusive: !0,
          value: Number.MAX_SAFE_INTEGER,
          message: u.toString(e),
        });
      }
      get minValue() {
        let e = null;
        for (let t of this._def.checks)
          'min' === t.kind && (null === e || t.value > e) && (e = t.value);
        return e;
      }
      get maxValue() {
        let e = null;
        for (let t of this._def.checks)
          'max' === t.kind && (null === e || t.value < e) && (e = t.value);
        return e;
      }
      get isInt() {
        return !!this._def.checks.find(
          (e) => 'int' === e.kind || ('multipleOf' === e.kind && s.isInteger(e.value)),
        );
      }
      get isFinite() {
        let e = null,
          t = null;
        for (let r of this._def.checks)
          if ('finite' === r.kind || 'int' === r.kind || 'multipleOf' === r.kind) return !0;
          else
            'min' === r.kind
              ? (null === t || r.value > t) && (t = r.value)
              : 'max' === r.kind && (null === e || r.value < e) && (e = r.value);
        return Number.isFinite(t) && Number.isFinite(e);
      }
    }
    eZ.create = (e) =>
      new eZ({ checks: [], typeName: l.ZodNumber, coerce: e?.coerce || !1, ...em(e) });
    class e$ extends ev {
      constructor() {
        (super(...arguments), (this.min = this.gte), (this.max = this.lte));
      }
      _parse(e) {
        let t;
        if (this._def.coerce)
          try {
            e.data = BigInt(e.data);
          } catch {
            return this._getInvalidInput(e);
          }
        if (this._getType(e) !== W.bigint) return this._getInvalidInput(e);
        let r = new ei();
        for (let n of this._def.checks)
          'min' === n.kind
            ? (n.inclusive ? e.data < n.value : e.data <= n.value) &&
              (ea((t = this._getOrReturnCtx(e, t)), {
                code: G.too_small,
                type: 'bigint',
                minimum: n.value,
                inclusive: n.inclusive,
                message: n.message,
              }),
              r.dirty())
            : 'max' === n.kind
              ? (n.inclusive ? e.data > n.value : e.data >= n.value) &&
                (ea((t = this._getOrReturnCtx(e, t)), {
                  code: G.too_big,
                  type: 'bigint',
                  maximum: n.value,
                  inclusive: n.inclusive,
                  message: n.message,
                }),
                r.dirty())
              : 'multipleOf' === n.kind
                ? e.data % n.value !== BigInt(0) &&
                  (ea((t = this._getOrReturnCtx(e, t)), {
                    code: G.not_multiple_of,
                    multipleOf: n.value,
                    message: n.message,
                  }),
                  r.dirty())
                : s.assertNever(n);
        return { status: r.value, value: e.data };
      }
      _getInvalidInput(e) {
        let t = this._getOrReturnCtx(e);
        return (ea(t, { code: G.invalid_type, expected: W.bigint, received: t.parsedType }), es);
      }
      gte(e, t) {
        return this.setLimit('min', e, !0, u.toString(t));
      }
      gt(e, t) {
        return this.setLimit('min', e, !1, u.toString(t));
      }
      lte(e, t) {
        return this.setLimit('max', e, !0, u.toString(t));
      }
      lt(e, t) {
        return this.setLimit('max', e, !1, u.toString(t));
      }
      setLimit(e, t, r, n) {
        return new e$({
          ...this._def,
          checks: [
            ...this._def.checks,
            { kind: e, value: t, inclusive: r, message: u.toString(n) },
          ],
        });
      }
      _addCheck(e) {
        return new e$({ ...this._def, checks: [...this._def.checks, e] });
      }
      positive(e) {
        return this._addCheck({
          kind: 'min',
          value: BigInt(0),
          inclusive: !1,
          message: u.toString(e),
        });
      }
      negative(e) {
        return this._addCheck({
          kind: 'max',
          value: BigInt(0),
          inclusive: !1,
          message: u.toString(e),
        });
      }
      nonpositive(e) {
        return this._addCheck({
          kind: 'max',
          value: BigInt(0),
          inclusive: !0,
          message: u.toString(e),
        });
      }
      nonnegative(e) {
        return this._addCheck({
          kind: 'min',
          value: BigInt(0),
          inclusive: !0,
          message: u.toString(e),
        });
      }
      multipleOf(e, t) {
        return this._addCheck({ kind: 'multipleOf', value: e, message: u.toString(t) });
      }
      get minValue() {
        let e = null;
        for (let t of this._def.checks)
          'min' === t.kind && (null === e || t.value > e) && (e = t.value);
        return e;
      }
      get maxValue() {
        let e = null;
        for (let t of this._def.checks)
          'max' === t.kind && (null === e || t.value < e) && (e = t.value);
        return e;
      }
    }
    e$.create = (e) =>
      new e$({ checks: [], typeName: l.ZodBigInt, coerce: e?.coerce ?? !1, ...em(e) });
    class eL extends ev {
      _parse(e) {
        if ((this._def.coerce && (e.data = !!e.data), this._getType(e) !== W.boolean)) {
          let t = this._getOrReturnCtx(e);
          return (ea(t, { code: G.invalid_type, expected: W.boolean, received: t.parsedType }), es);
        }
        return eu(e.data);
      }
    }
    eL.create = (e) => new eL({ typeName: l.ZodBoolean, coerce: e?.coerce || !1, ...em(e) });
    class eD extends ev {
      _parse(e) {
        let t;
        if ((this._def.coerce && (e.data = new Date(e.data)), this._getType(e) !== W.date)) {
          let t = this._getOrReturnCtx(e);
          return (ea(t, { code: G.invalid_type, expected: W.date, received: t.parsedType }), es);
        }
        if (Number.isNaN(e.data.getTime()))
          return (ea(this._getOrReturnCtx(e), { code: G.invalid_date }), es);
        let r = new ei();
        for (let n of this._def.checks)
          'min' === n.kind
            ? e.data.getTime() < n.value &&
              (ea((t = this._getOrReturnCtx(e, t)), {
                code: G.too_small,
                message: n.message,
                inclusive: !0,
                exact: !1,
                minimum: n.value,
                type: 'date',
              }),
              r.dirty())
            : 'max' === n.kind
              ? e.data.getTime() > n.value &&
                (ea((t = this._getOrReturnCtx(e, t)), {
                  code: G.too_big,
                  message: n.message,
                  inclusive: !0,
                  exact: !1,
                  maximum: n.value,
                  type: 'date',
                }),
                r.dirty())
              : s.assertNever(n);
        return { status: r.value, value: new Date(e.data.getTime()) };
      }
      _addCheck(e) {
        return new eD({ ...this._def, checks: [...this._def.checks, e] });
      }
      min(e, t) {
        return this._addCheck({ kind: 'min', value: e.getTime(), message: u.toString(t) });
      }
      max(e, t) {
        return this._addCheck({ kind: 'max', value: e.getTime(), message: u.toString(t) });
      }
      get minDate() {
        let e = null;
        for (let t of this._def.checks)
          'min' === t.kind && (null === e || t.value > e) && (e = t.value);
        return null != e ? new Date(e) : null;
      }
      get maxDate() {
        let e = null;
        for (let t of this._def.checks)
          'max' === t.kind && (null === e || t.value < e) && (e = t.value);
        return null != e ? new Date(e) : null;
      }
    }
    eD.create = (e) =>
      new eD({ checks: [], coerce: e?.coerce || !1, typeName: l.ZodDate, ...em(e) });
    class eB extends ev {
      _parse(e) {
        if (this._getType(e) !== W.symbol) {
          let t = this._getOrReturnCtx(e);
          return (ea(t, { code: G.invalid_type, expected: W.symbol, received: t.parsedType }), es);
        }
        return eu(e.data);
      }
    }
    eB.create = (e) => new eB({ typeName: l.ZodSymbol, ...em(e) });
    class ez extends ev {
      _parse(e) {
        if (this._getType(e) !== W.undefined) {
          let t = this._getOrReturnCtx(e);
          return (
            ea(t, { code: G.invalid_type, expected: W.undefined, received: t.parsedType }),
            es
          );
        }
        return eu(e.data);
      }
    }
    ez.create = (e) => new ez({ typeName: l.ZodUndefined, ...em(e) });
    class eV extends ev {
      _parse(e) {
        if (this._getType(e) !== W.null) {
          let t = this._getOrReturnCtx(e);
          return (ea(t, { code: G.invalid_type, expected: W.null, received: t.parsedType }), es);
        }
        return eu(e.data);
      }
    }
    eV.create = (e) => new eV({ typeName: l.ZodNull, ...em(e) });
    class eF extends ev {
      constructor() {
        (super(...arguments), (this._any = !0));
      }
      _parse(e) {
        return eu(e.data);
      }
    }
    eF.create = (e) => new eF({ typeName: l.ZodAny, ...em(e) });
    class eU extends ev {
      constructor() {
        (super(...arguments), (this._unknown = !0));
      }
      _parse(e) {
        return eu(e.data);
      }
    }
    eU.create = (e) => new eU({ typeName: l.ZodUnknown, ...em(e) });
    class eK extends ev {
      _parse(e) {
        let t = this._getOrReturnCtx(e);
        return (ea(t, { code: G.invalid_type, expected: W.never, received: t.parsedType }), es);
      }
    }
    eK.create = (e) => new eK({ typeName: l.ZodNever, ...em(e) });
    class eq extends ev {
      _parse(e) {
        if (this._getType(e) !== W.undefined) {
          let t = this._getOrReturnCtx(e);
          return (ea(t, { code: G.invalid_type, expected: W.void, received: t.parsedType }), es);
        }
        return eu(e.data);
      }
    }
    eq.create = (e) => new eq({ typeName: l.ZodVoid, ...em(e) });
    class eW extends ev {
      _parse(e) {
        let { ctx: t, status: r } = this._processInputParams(e),
          n = this._def;
        if (t.parsedType !== W.array)
          return (ea(t, { code: G.invalid_type, expected: W.array, received: t.parsedType }), es);
        if (null !== n.exactLength) {
          let e = t.data.length > n.exactLength.value,
            a = t.data.length < n.exactLength.value;
          (e || a) &&
            (ea(t, {
              code: e ? G.too_big : G.too_small,
              minimum: a ? n.exactLength.value : void 0,
              maximum: e ? n.exactLength.value : void 0,
              type: 'array',
              inclusive: !0,
              exact: !0,
              message: n.exactLength.message,
            }),
            r.dirty());
        }
        if (
          (null !== n.minLength &&
            t.data.length < n.minLength.value &&
            (ea(t, {
              code: G.too_small,
              minimum: n.minLength.value,
              type: 'array',
              inclusive: !0,
              exact: !1,
              message: n.minLength.message,
            }),
            r.dirty()),
          null !== n.maxLength &&
            t.data.length > n.maxLength.value &&
            (ea(t, {
              code: G.too_big,
              maximum: n.maxLength.value,
              type: 'array',
              inclusive: !0,
              exact: !1,
              message: n.maxLength.message,
            }),
            r.dirty()),
          t.common.async)
        )
          return Promise.all(
            [...t.data].map((e, r) => n.type._parseAsync(new ep(t, e, t.path, r))),
          ).then((e) => ei.mergeArray(r, e));
        let a = [...t.data].map((e, r) => n.type._parseSync(new ep(t, e, t.path, r)));
        return ei.mergeArray(r, a);
      }
      get element() {
        return this._def.type;
      }
      min(e, t) {
        return new eW({ ...this._def, minLength: { value: e, message: u.toString(t) } });
      }
      max(e, t) {
        return new eW({ ...this._def, maxLength: { value: e, message: u.toString(t) } });
      }
      length(e, t) {
        return new eW({ ...this._def, exactLength: { value: e, message: u.toString(t) } });
      }
      nonempty(e) {
        return this.min(1, e);
      }
    }
    eW.create = (e, t) =>
      new eW({
        type: e,
        minLength: null,
        maxLength: null,
        exactLength: null,
        typeName: l.ZodArray,
        ...em(t),
      });
    class eH extends ev {
      constructor() {
        (super(...arguments),
          (this._cached = null),
          (this.nonstrict = this.passthrough),
          (this.augment = this.extend));
      }
      _getCached() {
        if (null !== this._cached) return this._cached;
        let e = this._def.shape(),
          t = s.objectKeys(e);
        return ((this._cached = { shape: e, keys: t }), this._cached);
      }
      _parse(e) {
        if (this._getType(e) !== W.object) {
          let t = this._getOrReturnCtx(e);
          return (ea(t, { code: G.invalid_type, expected: W.object, received: t.parsedType }), es);
        }
        let { status: t, ctx: r } = this._processInputParams(e),
          { shape: n, keys: a } = this._getCached(),
          i = [];
        if (!(this._def.catchall instanceof eK && 'strip' === this._def.unknownKeys))
          for (let e in r.data) a.includes(e) || i.push(e);
        let s = [];
        for (let e of a) {
          let t = n[e],
            a = r.data[e];
          s.push({
            key: { status: 'valid', value: e },
            value: t._parse(new ep(r, a, r.path, e)),
            alwaysSet: e in r.data,
          });
        }
        if (this._def.catchall instanceof eK) {
          let e = this._def.unknownKeys;
          if ('passthrough' === e)
            for (let e of i)
              s.push({
                key: { status: 'valid', value: e },
                value: { status: 'valid', value: r.data[e] },
              });
          else if ('strict' === e)
            i.length > 0 && (ea(r, { code: G.unrecognized_keys, keys: i }), t.dirty());
          else if ('strip' === e);
          else throw Error('Internal ZodObject error: invalid unknownKeys value.');
        } else {
          let e = this._def.catchall;
          for (let t of i) {
            let n = r.data[t];
            s.push({
              key: { status: 'valid', value: t },
              value: e._parse(new ep(r, n, r.path, t)),
              alwaysSet: t in r.data,
            });
          }
        }
        return r.common.async
          ? Promise.resolve()
              .then(async () => {
                let e = [];
                for (let t of s) {
                  let r = await t.key,
                    n = await t.value;
                  e.push({ key: r, value: n, alwaysSet: t.alwaysSet });
                }
                return e;
              })
              .then((e) => ei.mergeObjectSync(t, e))
          : ei.mergeObjectSync(t, s);
      }
      get shape() {
        return this._def.shape();
      }
      strict(e) {
        return (
          u.errToObj,
          new eH({
            ...this._def,
            unknownKeys: 'strict',
            ...(void 0 !== e
              ? {
                  errorMap: (t, r) => {
                    let n = this._def.errorMap?.(t, r).message ?? r.defaultError;
                    return 'unrecognized_keys' === t.code
                      ? { message: u.errToObj(e).message ?? n }
                      : { message: n };
                  },
                }
              : {}),
          })
        );
      }
      strip() {
        return new eH({ ...this._def, unknownKeys: 'strip' });
      }
      passthrough() {
        return new eH({ ...this._def, unknownKeys: 'passthrough' });
      }
      extend(e) {
        return new eH({ ...this._def, shape: () => ({ ...this._def.shape(), ...e }) });
      }
      merge(e) {
        return new eH({
          unknownKeys: e._def.unknownKeys,
          catchall: e._def.catchall,
          shape: () => ({ ...this._def.shape(), ...e._def.shape() }),
          typeName: l.ZodObject,
        });
      }
      setKey(e, t) {
        return this.augment({ [e]: t });
      }
      catchall(e) {
        return new eH({ ...this._def, catchall: e });
      }
      pick(e) {
        let t = {};
        for (let r of s.objectKeys(e)) e[r] && this.shape[r] && (t[r] = this.shape[r]);
        return new eH({ ...this._def, shape: () => t });
      }
      omit(e) {
        let t = {};
        for (let r of s.objectKeys(this.shape)) e[r] || (t[r] = this.shape[r]);
        return new eH({ ...this._def, shape: () => t });
      }
      deepPartial() {
        return (function e(t) {
          if (t instanceof eH) {
            let r = {};
            for (let n in t.shape) {
              let a = t.shape[n];
              r[n] = tt.create(e(a));
            }
            return new eH({ ...t._def, shape: () => r });
          }
          if (t instanceof eW) return new eW({ ...t._def, type: e(t.element) });
          if (t instanceof tt) return tt.create(e(t.unwrap()));
          if (t instanceof tr) return tr.create(e(t.unwrap()));
          if (t instanceof eX) return eX.create(t.items.map((t) => e(t)));
          else return t;
        })(this);
      }
      partial(e) {
        let t = {};
        for (let r of s.objectKeys(this.shape)) {
          let n = this.shape[r];
          e && !e[r] ? (t[r] = n) : (t[r] = n.optional());
        }
        return new eH({ ...this._def, shape: () => t });
      }
      required(e) {
        let t = {};
        for (let r of s.objectKeys(this.shape))
          if (e && !e[r]) t[r] = this.shape[r];
          else {
            let e = this.shape[r];
            for (; e instanceof tt; ) e = e._def.innerType;
            t[r] = e;
          }
        return new eH({ ...this._def, shape: () => t });
      }
      keyof() {
        return e3(s.objectKeys(this.shape));
      }
    }
    ((eH.create = (e, t) =>
      new eH({
        shape: () => e,
        unknownKeys: 'strip',
        catchall: eK.create(),
        typeName: l.ZodObject,
        ...em(t),
      })),
      (eH.strictCreate = (e, t) =>
        new eH({
          shape: () => e,
          unknownKeys: 'strict',
          catchall: eK.create(),
          typeName: l.ZodObject,
          ...em(t),
        })),
      (eH.lazycreate = (e, t) =>
        new eH({
          shape: e,
          unknownKeys: 'strip',
          catchall: eK.create(),
          typeName: l.ZodObject,
          ...em(t),
        })));
    class eG extends ev {
      _parse(e) {
        let { ctx: t } = this._processInputParams(e),
          r = this._def.options;
        if (t.common.async)
          return Promise.all(
            r.map(async (e) => {
              let r = { ...t, common: { ...t.common, issues: [] }, parent: null };
              return {
                result: await e._parseAsync({ data: t.data, path: t.path, parent: r }),
                ctx: r,
              };
            }),
          ).then(function (e) {
            for (let t of e) if ('valid' === t.result.status) return t.result;
            for (let r of e)
              if ('dirty' === r.result.status)
                return (t.common.issues.push(...r.ctx.common.issues), r.result);
            let r = e.map((e) => new Y(e.ctx.common.issues));
            return (ea(t, { code: G.invalid_union, unionErrors: r }), es);
          });
        {
          let e,
            n = [];
          for (let a of r) {
            let r = { ...t, common: { ...t.common, issues: [] }, parent: null },
              i = a._parseSync({ data: t.data, path: t.path, parent: r });
            if ('valid' === i.status) return i;
            ('dirty' !== i.status || e || (e = { result: i, ctx: r }),
              r.common.issues.length && n.push(r.common.issues));
          }
          if (e) return (t.common.issues.push(...e.ctx.common.issues), e.result);
          let a = n.map((e) => new Y(e));
          return (ea(t, { code: G.invalid_union, unionErrors: a }), es);
        }
      }
      get options() {
        return this._def.options;
      }
    }
    eG.create = (e, t) => new eG({ options: e, typeName: l.ZodUnion, ...em(t) });
    let eQ = (e) => {
      if (e instanceof e4) return eQ(e.schema);
      if (e instanceof te) return eQ(e.innerType());
      if (e instanceof e5) return [e.value];
      if (e instanceof e7) return e.options;
      if (e instanceof e6) return s.objectValues(e.enum);
      else if (e instanceof tn) return eQ(e._def.innerType);
      else if (e instanceof ez) return [void 0];
      else if (e instanceof eV) return [null];
      else if (e instanceof tt) return [void 0, ...eQ(e.unwrap())];
      else if (e instanceof tr) return [null, ...eQ(e.unwrap())];
      else if (e instanceof to) return eQ(e.unwrap());
      else if (e instanceof tl) return eQ(e.unwrap());
      else if (e instanceof ta) return eQ(e._def.innerType);
      else return [];
    };
    class eY extends ev {
      _parse(e) {
        let { ctx: t } = this._processInputParams(e);
        if (t.parsedType !== W.object)
          return (ea(t, { code: G.invalid_type, expected: W.object, received: t.parsedType }), es);
        let r = this.discriminator,
          n = t.data[r],
          a = this.optionsMap.get(n);
        return a
          ? t.common.async
            ? a._parseAsync({ data: t.data, path: t.path, parent: t })
            : a._parseSync({ data: t.data, path: t.path, parent: t })
          : (ea(t, {
              code: G.invalid_union_discriminator,
              options: Array.from(this.optionsMap.keys()),
              path: [r],
            }),
            es);
      }
      get discriminator() {
        return this._def.discriminator;
      }
      get options() {
        return this._def.options;
      }
      get optionsMap() {
        return this._def.optionsMap;
      }
      static create(e, t, r) {
        let n = new Map();
        for (let r of t) {
          let t = eQ(r.shape[e]);
          if (!t.length)
            throw Error(
              `A discriminator value for key \`${e}\` could not be extracted from all schema options`,
            );
          for (let a of t) {
            if (n.has(a))
              throw Error(`Discriminator property ${String(e)} has duplicate value ${String(a)}`);
            n.set(a, r);
          }
        }
        return new eY({
          typeName: l.ZodDiscriminatedUnion,
          discriminator: e,
          options: t,
          optionsMap: n,
          ...em(r),
        });
      }
    }
    class eJ extends ev {
      _parse(e) {
        let { status: t, ctx: r } = this._processInputParams(e),
          n = (e, n) => {
            if (el(e) || el(n)) return es;
            let a = (function e(t, r) {
              let n = H(t),
                a = H(r);
              if (t === r) return { valid: !0, data: t };
              if (n === W.object && a === W.object) {
                let n = s.objectKeys(r),
                  a = s.objectKeys(t).filter((e) => -1 !== n.indexOf(e)),
                  i = { ...t, ...r };
                for (let n of a) {
                  let a = e(t[n], r[n]);
                  if (!a.valid) return { valid: !1 };
                  i[n] = a.data;
                }
                return { valid: !0, data: i };
              }
              if (n === W.array && a === W.array) {
                if (t.length !== r.length) return { valid: !1 };
                let n = [];
                for (let a = 0; a < t.length; a++) {
                  let i = e(t[a], r[a]);
                  if (!i.valid) return { valid: !1 };
                  n.push(i.data);
                }
                return { valid: !0, data: n };
              }
              if (n === W.date && a === W.date && +t == +r) return { valid: !0, data: t };
              return { valid: !1 };
            })(e.value, n.value);
            return a.valid
              ? ((ec(e) || ec(n)) && t.dirty(), { status: t.value, value: a.data })
              : (ea(r, { code: G.invalid_intersection_types }), es);
          };
        return r.common.async
          ? Promise.all([
              this._def.left._parseAsync({ data: r.data, path: r.path, parent: r }),
              this._def.right._parseAsync({ data: r.data, path: r.path, parent: r }),
            ]).then(([e, t]) => n(e, t))
          : n(
              this._def.left._parseSync({ data: r.data, path: r.path, parent: r }),
              this._def.right._parseSync({ data: r.data, path: r.path, parent: r }),
            );
      }
    }
    eJ.create = (e, t, r) => new eJ({ left: e, right: t, typeName: l.ZodIntersection, ...em(r) });
    class eX extends ev {
      _parse(e) {
        let { status: t, ctx: r } = this._processInputParams(e);
        if (r.parsedType !== W.array)
          return (ea(r, { code: G.invalid_type, expected: W.array, received: r.parsedType }), es);
        if (r.data.length < this._def.items.length)
          return (
            ea(r, {
              code: G.too_small,
              minimum: this._def.items.length,
              inclusive: !0,
              exact: !1,
              type: 'array',
            }),
            es
          );
        !this._def.rest &&
          r.data.length > this._def.items.length &&
          (ea(r, {
            code: G.too_big,
            maximum: this._def.items.length,
            inclusive: !0,
            exact: !1,
            type: 'array',
          }),
          t.dirty());
        let n = [...r.data]
          .map((e, t) => {
            let n = this._def.items[t] || this._def.rest;
            return n ? n._parse(new ep(r, e, r.path, t)) : null;
          })
          .filter((e) => !!e);
        return r.common.async
          ? Promise.all(n).then((e) => ei.mergeArray(t, e))
          : ei.mergeArray(t, n);
      }
      get items() {
        return this._def.items;
      }
      rest(e) {
        return new eX({ ...this._def, rest: e });
      }
    }
    eX.create = (e, t) => {
      if (!Array.isArray(e)) throw Error('You must pass an array of schemas to z.tuple([ ... ])');
      return new eX({ items: e, typeName: l.ZodTuple, rest: null, ...em(t) });
    };
    class e0 extends ev {
      get keySchema() {
        return this._def.keyType;
      }
      get valueSchema() {
        return this._def.valueType;
      }
      _parse(e) {
        let { status: t, ctx: r } = this._processInputParams(e);
        if (r.parsedType !== W.object)
          return (ea(r, { code: G.invalid_type, expected: W.object, received: r.parsedType }), es);
        let n = [],
          a = this._def.keyType,
          i = this._def.valueType;
        for (let e in r.data)
          n.push({
            key: a._parse(new ep(r, e, r.path, e)),
            value: i._parse(new ep(r, r.data[e], r.path, e)),
            alwaysSet: e in r.data,
          });
        return r.common.async ? ei.mergeObjectAsync(t, n) : ei.mergeObjectSync(t, n);
      }
      get element() {
        return this._def.valueType;
      }
      static create(e, t, r) {
        return new e0(
          t instanceof ev
            ? { keyType: e, valueType: t, typeName: l.ZodRecord, ...em(r) }
            : { keyType: eN.create(), valueType: e, typeName: l.ZodRecord, ...em(t) },
        );
      }
    }
    class e1 extends ev {
      get keySchema() {
        return this._def.keyType;
      }
      get valueSchema() {
        return this._def.valueType;
      }
      _parse(e) {
        let { status: t, ctx: r } = this._processInputParams(e);
        if (r.parsedType !== W.map)
          return (ea(r, { code: G.invalid_type, expected: W.map, received: r.parsedType }), es);
        let n = this._def.keyType,
          a = this._def.valueType,
          i = [...r.data.entries()].map(([e, t], i) => ({
            key: n._parse(new ep(r, e, r.path, [i, 'key'])),
            value: a._parse(new ep(r, t, r.path, [i, 'value'])),
          }));
        if (r.common.async) {
          let e = new Map();
          return Promise.resolve().then(async () => {
            for (let r of i) {
              let n = await r.key,
                a = await r.value;
              if ('aborted' === n.status || 'aborted' === a.status) return es;
              (('dirty' === n.status || 'dirty' === a.status) && t.dirty(),
                e.set(n.value, a.value));
            }
            return { status: t.value, value: e };
          });
        }
        {
          let e = new Map();
          for (let r of i) {
            let n = r.key,
              a = r.value;
            if ('aborted' === n.status || 'aborted' === a.status) return es;
            (('dirty' === n.status || 'dirty' === a.status) && t.dirty(), e.set(n.value, a.value));
          }
          return { status: t.value, value: e };
        }
      }
    }
    e1.create = (e, t, r) => new e1({ valueType: t, keyType: e, typeName: l.ZodMap, ...em(r) });
    class e2 extends ev {
      _parse(e) {
        let { status: t, ctx: r } = this._processInputParams(e);
        if (r.parsedType !== W.set)
          return (ea(r, { code: G.invalid_type, expected: W.set, received: r.parsedType }), es);
        let n = this._def;
        (null !== n.minSize &&
          r.data.size < n.minSize.value &&
          (ea(r, {
            code: G.too_small,
            minimum: n.minSize.value,
            type: 'set',
            inclusive: !0,
            exact: !1,
            message: n.minSize.message,
          }),
          t.dirty()),
          null !== n.maxSize &&
            r.data.size > n.maxSize.value &&
            (ea(r, {
              code: G.too_big,
              maximum: n.maxSize.value,
              type: 'set',
              inclusive: !0,
              exact: !1,
              message: n.maxSize.message,
            }),
            t.dirty()));
        let a = this._def.valueType;
        function i(e) {
          let r = new Set();
          for (let n of e) {
            if ('aborted' === n.status) return es;
            ('dirty' === n.status && t.dirty(), r.add(n.value));
          }
          return { status: t.value, value: r };
        }
        let s = [...r.data.values()].map((e, t) => a._parse(new ep(r, e, r.path, t)));
        return r.common.async ? Promise.all(s).then((e) => i(e)) : i(s);
      }
      min(e, t) {
        return new e2({ ...this._def, minSize: { value: e, message: u.toString(t) } });
      }
      max(e, t) {
        return new e2({ ...this._def, maxSize: { value: e, message: u.toString(t) } });
      }
      size(e, t) {
        return this.min(e, t).max(e, t);
      }
      nonempty(e) {
        return this.min(1, e);
      }
    }
    e2.create = (e, t) =>
      new e2({ valueType: e, minSize: null, maxSize: null, typeName: l.ZodSet, ...em(t) });
    class e9 extends ev {
      constructor() {
        (super(...arguments), (this.validate = this.implement));
      }
      _parse(e) {
        let { ctx: t } = this._processInputParams(e);
        if (t.parsedType !== W.function)
          return (
            ea(t, { code: G.invalid_type, expected: W.function, received: t.parsedType }),
            es
          );
        function r(e, r) {
          return er({
            data: e,
            path: t.path,
            errorMaps: [t.common.contextualErrorMap, t.schemaErrorMap, et(), J].filter((e) => !!e),
            issueData: { code: G.invalid_arguments, argumentsError: r },
          });
        }
        function n(e, r) {
          return er({
            data: e,
            path: t.path,
            errorMaps: [t.common.contextualErrorMap, t.schemaErrorMap, et(), J].filter((e) => !!e),
            issueData: { code: G.invalid_return_type, returnTypeError: r },
          });
        }
        let a = { errorMap: t.common.contextualErrorMap },
          i = t.data;
        if (this._def.returns instanceof e8) {
          let e = this;
          return eu(async function (...t) {
            let s = new Y([]),
              o = await e._def.args.parseAsync(t, a).catch((e) => {
                throw (s.addIssue(r(t, e)), s);
              }),
              u = await Reflect.apply(i, this, o);
            return await e._def.returns._def.type.parseAsync(u, a).catch((e) => {
              throw (s.addIssue(n(u, e)), s);
            });
          });
        }
        {
          let e = this;
          return eu(function (...t) {
            let s = e._def.args.safeParse(t, a);
            if (!s.success) throw new Y([r(t, s.error)]);
            let o = Reflect.apply(i, this, s.data),
              u = e._def.returns.safeParse(o, a);
            if (!u.success) throw new Y([n(o, u.error)]);
            return u.data;
          });
        }
      }
      parameters() {
        return this._def.args;
      }
      returnType() {
        return this._def.returns;
      }
      args(...e) {
        return new e9({ ...this._def, args: eX.create(e).rest(eU.create()) });
      }
      returns(e) {
        return new e9({ ...this._def, returns: e });
      }
      implement(e) {
        return this.parse(e);
      }
      strictImplement(e) {
        return this.parse(e);
      }
      static create(e, t, r) {
        return new e9({
          args: e || eX.create([]).rest(eU.create()),
          returns: t || eU.create(),
          typeName: l.ZodFunction,
          ...em(r),
        });
      }
    }
    class e4 extends ev {
      get schema() {
        return this._def.getter();
      }
      _parse(e) {
        let { ctx: t } = this._processInputParams(e);
        return this._def.getter()._parse({ data: t.data, path: t.path, parent: t });
      }
    }
    e4.create = (e, t) => new e4({ getter: e, typeName: l.ZodLazy, ...em(t) });
    class e5 extends ev {
      _parse(e) {
        if (e.data !== this._def.value) {
          let t = this._getOrReturnCtx(e);
          return (
            ea(t, { received: t.data, code: G.invalid_literal, expected: this._def.value }),
            es
          );
        }
        return { status: 'valid', value: e.data };
      }
      get value() {
        return this._def.value;
      }
    }
    function e3(e, t) {
      return new e7({ values: e, typeName: l.ZodEnum, ...em(t) });
    }
    e5.create = (e, t) => new e5({ value: e, typeName: l.ZodLiteral, ...em(t) });
    class e7 extends ev {
      _parse(e) {
        if ('string' != typeof e.data) {
          let t = this._getOrReturnCtx(e),
            r = this._def.values;
          return (
            ea(t, { expected: s.joinValues(r), received: t.parsedType, code: G.invalid_type }),
            es
          );
        }
        if ((this._cache || (this._cache = new Set(this._def.values)), !this._cache.has(e.data))) {
          let t = this._getOrReturnCtx(e),
            r = this._def.values;
          return (ea(t, { received: t.data, code: G.invalid_enum_value, options: r }), es);
        }
        return eu(e.data);
      }
      get options() {
        return this._def.values;
      }
      get enum() {
        let e = {};
        for (let t of this._def.values) e[t] = t;
        return e;
      }
      get Values() {
        let e = {};
        for (let t of this._def.values) e[t] = t;
        return e;
      }
      get Enum() {
        let e = {};
        for (let t of this._def.values) e[t] = t;
        return e;
      }
      extract(e, t = this._def) {
        return e7.create(e, { ...this._def, ...t });
      }
      exclude(e, t = this._def) {
        return e7.create(
          this.options.filter((t) => !e.includes(t)),
          { ...this._def, ...t },
        );
      }
    }
    e7.create = e3;
    class e6 extends ev {
      _parse(e) {
        let t = s.getValidEnumValues(this._def.values),
          r = this._getOrReturnCtx(e);
        if (r.parsedType !== W.string && r.parsedType !== W.number) {
          let e = s.objectValues(t);
          return (
            ea(r, { expected: s.joinValues(e), received: r.parsedType, code: G.invalid_type }),
            es
          );
        }
        if (
          (this._cache || (this._cache = new Set(s.getValidEnumValues(this._def.values))),
          !this._cache.has(e.data))
        ) {
          let e = s.objectValues(t);
          return (ea(r, { received: r.data, code: G.invalid_enum_value, options: e }), es);
        }
        return eu(e.data);
      }
      get enum() {
        return this._def.values;
      }
    }
    e6.create = (e, t) => new e6({ values: e, typeName: l.ZodNativeEnum, ...em(t) });
    class e8 extends ev {
      unwrap() {
        return this._def.type;
      }
      _parse(e) {
        let { ctx: t } = this._processInputParams(e);
        return t.parsedType !== W.promise && !1 === t.common.async
          ? (ea(t, { code: G.invalid_type, expected: W.promise, received: t.parsedType }), es)
          : eu(
              (t.parsedType === W.promise ? t.data : Promise.resolve(t.data)).then((e) =>
                this._def.type.parseAsync(e, {
                  path: t.path,
                  errorMap: t.common.contextualErrorMap,
                }),
              ),
            );
      }
    }
    e8.create = (e, t) => new e8({ type: e, typeName: l.ZodPromise, ...em(t) });
    class te extends ev {
      innerType() {
        return this._def.schema;
      }
      sourceType() {
        return this._def.schema._def.typeName === l.ZodEffects
          ? this._def.schema.sourceType()
          : this._def.schema;
      }
      _parse(e) {
        let { status: t, ctx: r } = this._processInputParams(e),
          n = this._def.effect || null,
          a = {
            addIssue: (e) => {
              (ea(r, e), e.fatal ? t.abort() : t.dirty());
            },
            get path() {
              return r.path;
            },
          };
        if (((a.addIssue = a.addIssue.bind(a)), 'preprocess' === n.type)) {
          let e = n.transform(r.data, a);
          if (r.common.async)
            return Promise.resolve(e).then(async (e) => {
              if ('aborted' === t.value) return es;
              let n = await this._def.schema._parseAsync({ data: e, path: r.path, parent: r });
              return 'aborted' === n.status
                ? es
                : 'dirty' === n.status || 'dirty' === t.value
                  ? eo(n.value)
                  : n;
            });
          {
            if ('aborted' === t.value) return es;
            let n = this._def.schema._parseSync({ data: e, path: r.path, parent: r });
            return 'aborted' === n.status
              ? es
              : 'dirty' === n.status || 'dirty' === t.value
                ? eo(n.value)
                : n;
          }
        }
        if ('refinement' === n.type) {
          let e = (e) => {
            let t = n.refinement(e, a);
            if (r.common.async) return Promise.resolve(t);
            if (t instanceof Promise)
              throw Error(
                'Async refinement encountered during synchronous parse operation. Use .parseAsync instead.',
              );
            return e;
          };
          if (!1 !== r.common.async)
            return this._def.schema
              ._parseAsync({ data: r.data, path: r.path, parent: r })
              .then((r) =>
                'aborted' === r.status
                  ? es
                  : ('dirty' === r.status && t.dirty(),
                    e(r.value).then(() => ({ status: t.value, value: r.value }))),
              );
          {
            let n = this._def.schema._parseSync({ data: r.data, path: r.path, parent: r });
            return 'aborted' === n.status
              ? es
              : ('dirty' === n.status && t.dirty(),
                e(n.value),
                { status: t.value, value: n.value });
          }
        }
        if ('transform' === n.type)
          if (!1 !== r.common.async)
            return this._def.schema
              ._parseAsync({ data: r.data, path: r.path, parent: r })
              .then((e) =>
                ed(e)
                  ? Promise.resolve(n.transform(e.value, a)).then((e) => ({
                      status: t.value,
                      value: e,
                    }))
                  : es,
              );
          else {
            let e = this._def.schema._parseSync({ data: r.data, path: r.path, parent: r });
            if (!ed(e)) return es;
            let i = n.transform(e.value, a);
            if (i instanceof Promise)
              throw Error(
                'Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.',
              );
            return { status: t.value, value: i };
          }
        s.assertNever(n);
      }
    }
    ((te.create = (e, t, r) => new te({ schema: e, typeName: l.ZodEffects, effect: t, ...em(r) })),
      (te.createWithPreprocess = (e, t, r) =>
        new te({
          schema: t,
          effect: { type: 'preprocess', transform: e },
          typeName: l.ZodEffects,
          ...em(r),
        })));
    class tt extends ev {
      _parse(e) {
        return this._getType(e) === W.undefined ? eu(void 0) : this._def.innerType._parse(e);
      }
      unwrap() {
        return this._def.innerType;
      }
    }
    tt.create = (e, t) => new tt({ innerType: e, typeName: l.ZodOptional, ...em(t) });
    class tr extends ev {
      _parse(e) {
        return this._getType(e) === W.null ? eu(null) : this._def.innerType._parse(e);
      }
      unwrap() {
        return this._def.innerType;
      }
    }
    tr.create = (e, t) => new tr({ innerType: e, typeName: l.ZodNullable, ...em(t) });
    class tn extends ev {
      _parse(e) {
        let { ctx: t } = this._processInputParams(e),
          r = t.data;
        return (
          t.parsedType === W.undefined && (r = this._def.defaultValue()),
          this._def.innerType._parse({ data: r, path: t.path, parent: t })
        );
      }
      removeDefault() {
        return this._def.innerType;
      }
    }
    tn.create = (e, t) =>
      new tn({
        innerType: e,
        typeName: l.ZodDefault,
        defaultValue: 'function' == typeof t.default ? t.default : () => t.default,
        ...em(t),
      });
    class ta extends ev {
      _parse(e) {
        let { ctx: t } = this._processInputParams(e),
          r = { ...t, common: { ...t.common, issues: [] } },
          n = this._def.innerType._parse({ data: r.data, path: r.path, parent: { ...r } });
        return ef(n)
          ? n.then((e) => ({
              status: 'valid',
              value:
                'valid' === e.status
                  ? e.value
                  : this._def.catchValue({
                      get error() {
                        return new Y(r.common.issues);
                      },
                      input: r.data,
                    }),
            }))
          : {
              status: 'valid',
              value:
                'valid' === n.status
                  ? n.value
                  : this._def.catchValue({
                      get error() {
                        return new Y(r.common.issues);
                      },
                      input: r.data,
                    }),
            };
      }
      removeCatch() {
        return this._def.innerType;
      }
    }
    ta.create = (e, t) =>
      new ta({
        innerType: e,
        typeName: l.ZodCatch,
        catchValue: 'function' == typeof t.catch ? t.catch : () => t.catch,
        ...em(t),
      });
    class ti extends ev {
      _parse(e) {
        if (this._getType(e) !== W.nan) {
          let t = this._getOrReturnCtx(e);
          return (ea(t, { code: G.invalid_type, expected: W.nan, received: t.parsedType }), es);
        }
        return { status: 'valid', value: e.data };
      }
    }
    ti.create = (e) => new ti({ typeName: l.ZodNaN, ...em(e) });
    let ts = Symbol('zod_brand');
    class to extends ev {
      _parse(e) {
        let { ctx: t } = this._processInputParams(e),
          r = t.data;
        return this._def.type._parse({ data: r, path: t.path, parent: t });
      }
      unwrap() {
        return this._def.type;
      }
    }
    class tu extends ev {
      _parse(e) {
        let { status: t, ctx: r } = this._processInputParams(e);
        if (r.common.async)
          return (async () => {
            let e = await this._def.in._parseAsync({ data: r.data, path: r.path, parent: r });
            return 'aborted' === e.status
              ? es
              : 'dirty' === e.status
                ? (t.dirty(), eo(e.value))
                : this._def.out._parseAsync({ data: e.value, path: r.path, parent: r });
          })();
        {
          let e = this._def.in._parseSync({ data: r.data, path: r.path, parent: r });
          return 'aborted' === e.status
            ? es
            : 'dirty' === e.status
              ? (t.dirty(), { status: 'dirty', value: e.value })
              : this._def.out._parseSync({ data: e.value, path: r.path, parent: r });
        }
      }
      static create(e, t) {
        return new tu({ in: e, out: t, typeName: l.ZodPipeline });
      }
    }
    class tl extends ev {
      _parse(e) {
        let t = this._def.innerType._parse(e),
          r = (e) => (ed(e) && (e.value = Object.freeze(e.value)), e);
        return ef(t) ? t.then((e) => r(e)) : r(t);
      }
      unwrap() {
        return this._def.innerType;
      }
    }
    function tc(e, t) {
      let r = 'function' == typeof e ? e(t) : 'string' == typeof e ? { message: e } : e;
      return 'string' == typeof r ? { message: r } : r;
    }
    function td(e, t = {}, r) {
      return e
        ? eF.create().superRefine((n, a) => {
            let i = e(n);
            if (i instanceof Promise)
              return i.then((e) => {
                if (!e) {
                  let e = tc(t, n),
                    i = e.fatal ?? r ?? !0;
                  a.addIssue({ code: 'custom', ...e, fatal: i });
                }
              });
            if (!i) {
              let e = tc(t, n),
                i = e.fatal ?? r ?? !0;
              a.addIssue({ code: 'custom', ...e, fatal: i });
            }
          })
        : eF.create();
    }
    tl.create = (e, t) => new tl({ innerType: e, typeName: l.ZodReadonly, ...em(t) });
    let tf = { object: eH.lazycreate };
    (((i = l || (l = {})).ZodString = 'ZodString'),
      (i.ZodNumber = 'ZodNumber'),
      (i.ZodNaN = 'ZodNaN'),
      (i.ZodBigInt = 'ZodBigInt'),
      (i.ZodBoolean = 'ZodBoolean'),
      (i.ZodDate = 'ZodDate'),
      (i.ZodSymbol = 'ZodSymbol'),
      (i.ZodUndefined = 'ZodUndefined'),
      (i.ZodNull = 'ZodNull'),
      (i.ZodAny = 'ZodAny'),
      (i.ZodUnknown = 'ZodUnknown'),
      (i.ZodNever = 'ZodNever'),
      (i.ZodVoid = 'ZodVoid'),
      (i.ZodArray = 'ZodArray'),
      (i.ZodObject = 'ZodObject'),
      (i.ZodUnion = 'ZodUnion'),
      (i.ZodDiscriminatedUnion = 'ZodDiscriminatedUnion'),
      (i.ZodIntersection = 'ZodIntersection'),
      (i.ZodTuple = 'ZodTuple'),
      (i.ZodRecord = 'ZodRecord'),
      (i.ZodMap = 'ZodMap'),
      (i.ZodSet = 'ZodSet'),
      (i.ZodFunction = 'ZodFunction'),
      (i.ZodLazy = 'ZodLazy'),
      (i.ZodLiteral = 'ZodLiteral'),
      (i.ZodEnum = 'ZodEnum'),
      (i.ZodEffects = 'ZodEffects'),
      (i.ZodNativeEnum = 'ZodNativeEnum'),
      (i.ZodOptional = 'ZodOptional'),
      (i.ZodNullable = 'ZodNullable'),
      (i.ZodDefault = 'ZodDefault'),
      (i.ZodCatch = 'ZodCatch'),
      (i.ZodPromise = 'ZodPromise'),
      (i.ZodBranded = 'ZodBranded'),
      (i.ZodPipeline = 'ZodPipeline'),
      (i.ZodReadonly = 'ZodReadonly'));
    let tp = (e, t = { message: `Input not instance of ${e.name}` }) =>
        td((t) => t instanceof e, t),
      th = eN.create,
      tm = eZ.create,
      tv = ti.create,
      tg = e$.create,
      ty = eL.create,
      t_ = eD.create,
      tb = eB.create,
      tx = ez.create,
      tw = eV.create,
      tk = eF.create,
      tO = eU.create,
      tS = eK.create,
      tj = eq.create,
      tA = eW.create,
      tP = eH.create,
      tE = eH.strictCreate,
      tC = eG.create,
      tR = eY.create,
      tT = eJ.create,
      tI = eX.create,
      tM = e0.create,
      tN = e1.create,
      tZ = e2.create,
      t$ = e9.create,
      tL = e4.create,
      tD = e5.create,
      tB = e7.create,
      tz = e6.create,
      tV = e8.create,
      tF = te.create,
      tU = tt.create,
      tK = tr.create,
      tq = te.createWithPreprocess,
      tW = tu.create,
      tH = () => th().optional(),
      tG = () => tm().optional(),
      tQ = () => ty().optional(),
      tY = {
        string: (e) => eN.create({ ...e, coerce: !0 }),
        number: (e) => eZ.create({ ...e, coerce: !0 }),
        boolean: (e) => eL.create({ ...e, coerce: !0 }),
        bigint: (e) => e$.create({ ...e, coerce: !0 }),
        date: (e) => eD.create({ ...e, coerce: !0 }),
      };
    (e.s(
      [
        'BRAND',
        0,
        ts,
        'NEVER',
        0,
        es,
        'Schema',
        0,
        ev,
        'ZodAny',
        0,
        eF,
        'ZodArray',
        0,
        eW,
        'ZodBigInt',
        0,
        e$,
        'ZodBoolean',
        0,
        eL,
        'ZodBranded',
        0,
        to,
        'ZodCatch',
        0,
        ta,
        'ZodDate',
        0,
        eD,
        'ZodDefault',
        0,
        tn,
        'ZodDiscriminatedUnion',
        0,
        eY,
        'ZodEffects',
        0,
        te,
        'ZodEnum',
        0,
        e7,
        'ZodFirstPartyTypeKind',
        0,
        l,
        'ZodFunction',
        0,
        e9,
        'ZodIntersection',
        0,
        eJ,
        'ZodLazy',
        0,
        e4,
        'ZodLiteral',
        0,
        e5,
        'ZodMap',
        0,
        e1,
        'ZodNaN',
        0,
        ti,
        'ZodNativeEnum',
        0,
        e6,
        'ZodNever',
        0,
        eK,
        'ZodNull',
        0,
        eV,
        'ZodNullable',
        0,
        tr,
        'ZodNumber',
        0,
        eZ,
        'ZodObject',
        0,
        eH,
        'ZodOptional',
        0,
        tt,
        'ZodPipeline',
        0,
        tu,
        'ZodPromise',
        0,
        e8,
        'ZodReadonly',
        0,
        tl,
        'ZodRecord',
        0,
        e0,
        'ZodSchema',
        0,
        ev,
        'ZodSet',
        0,
        e2,
        'ZodString',
        0,
        eN,
        'ZodSymbol',
        0,
        eB,
        'ZodTransformer',
        0,
        te,
        'ZodTuple',
        0,
        eX,
        'ZodType',
        0,
        ev,
        'ZodUndefined',
        0,
        ez,
        'ZodUnion',
        0,
        eG,
        'ZodUnknown',
        0,
        eU,
        'ZodVoid',
        0,
        eq,
        'any',
        0,
        tk,
        'array',
        0,
        tA,
        'bigint',
        0,
        tg,
        'boolean',
        0,
        ty,
        'coerce',
        0,
        tY,
        'custom',
        0,
        td,
        'date',
        0,
        t_,
        'datetimeRegex',
        0,
        eM,
        'discriminatedUnion',
        0,
        tR,
        'effect',
        0,
        tF,
        'enum',
        0,
        tB,
        'function',
        0,
        t$,
        'instanceof',
        0,
        tp,
        'intersection',
        0,
        tT,
        'late',
        0,
        tf,
        'lazy',
        0,
        tL,
        'literal',
        0,
        tD,
        'map',
        0,
        tN,
        'nan',
        0,
        tv,
        'nativeEnum',
        0,
        tz,
        'never',
        0,
        tS,
        'null',
        0,
        tw,
        'nullable',
        0,
        tK,
        'number',
        0,
        tm,
        'object',
        0,
        tP,
        'oboolean',
        0,
        tQ,
        'onumber',
        0,
        tG,
        'optional',
        0,
        tU,
        'ostring',
        0,
        tH,
        'pipeline',
        0,
        tW,
        'preprocess',
        0,
        tq,
        'promise',
        0,
        tV,
        'record',
        0,
        tM,
        'set',
        0,
        tZ,
        'strictObject',
        0,
        tE,
        'string',
        0,
        th,
        'symbol',
        0,
        tb,
        'transformer',
        0,
        tF,
        'tuple',
        0,
        tI,
        'undefined',
        0,
        tx,
        'union',
        0,
        tC,
        'unknown',
        0,
        tO,
        'void',
        0,
        tj,
      ],
      84649,
    ),
      e.i(84649),
      e.i(11838),
      e.s(
        [
          'BRAND',
          0,
          ts,
          'DIRTY',
          0,
          eo,
          'EMPTY_PATH',
          0,
          en,
          'INVALID',
          0,
          es,
          'NEVER',
          0,
          es,
          'OK',
          0,
          eu,
          'ParseStatus',
          0,
          ei,
          'Schema',
          0,
          ev,
          'ZodAny',
          0,
          eF,
          'ZodArray',
          0,
          eW,
          'ZodBigInt',
          0,
          e$,
          'ZodBoolean',
          0,
          eL,
          'ZodBranded',
          0,
          to,
          'ZodCatch',
          0,
          ta,
          'ZodDate',
          0,
          eD,
          'ZodDefault',
          0,
          tn,
          'ZodDiscriminatedUnion',
          0,
          eY,
          'ZodEffects',
          0,
          te,
          'ZodEnum',
          0,
          e7,
          'ZodError',
          0,
          Y,
          'ZodFirstPartyTypeKind',
          0,
          l,
          'ZodFunction',
          0,
          e9,
          'ZodIntersection',
          0,
          eJ,
          'ZodIssueCode',
          0,
          G,
          'ZodLazy',
          0,
          e4,
          'ZodLiteral',
          0,
          e5,
          'ZodMap',
          0,
          e1,
          'ZodNaN',
          0,
          ti,
          'ZodNativeEnum',
          0,
          e6,
          'ZodNever',
          0,
          eK,
          'ZodNull',
          0,
          eV,
          'ZodNullable',
          0,
          tr,
          'ZodNumber',
          0,
          eZ,
          'ZodObject',
          0,
          eH,
          'ZodOptional',
          0,
          tt,
          'ZodParsedType',
          0,
          W,
          'ZodPipeline',
          0,
          tu,
          'ZodPromise',
          0,
          e8,
          'ZodReadonly',
          0,
          tl,
          'ZodRecord',
          0,
          e0,
          'ZodSchema',
          0,
          ev,
          'ZodSet',
          0,
          e2,
          'ZodString',
          0,
          eN,
          'ZodSymbol',
          0,
          eB,
          'ZodTransformer',
          0,
          te,
          'ZodTuple',
          0,
          eX,
          'ZodType',
          0,
          ev,
          'ZodUndefined',
          0,
          ez,
          'ZodUnion',
          0,
          eG,
          'ZodUnknown',
          0,
          eU,
          'ZodVoid',
          0,
          eq,
          'addIssueToContext',
          0,
          ea,
          'any',
          0,
          tk,
          'array',
          0,
          tA,
          'bigint',
          0,
          tg,
          'boolean',
          0,
          ty,
          'coerce',
          0,
          tY,
          'custom',
          0,
          td,
          'date',
          0,
          t_,
          'datetimeRegex',
          0,
          eM,
          'defaultErrorMap',
          0,
          J,
          'discriminatedUnion',
          0,
          tR,
          'effect',
          0,
          tF,
          'enum',
          0,
          tB,
          'function',
          0,
          t$,
          'getErrorMap',
          0,
          et,
          'getParsedType',
          0,
          H,
          'instanceof',
          0,
          tp,
          'intersection',
          0,
          tT,
          'isAborted',
          0,
          el,
          'isAsync',
          0,
          ef,
          'isDirty',
          0,
          ec,
          'isValid',
          0,
          ed,
          'late',
          0,
          tf,
          'lazy',
          0,
          tL,
          'literal',
          0,
          tD,
          'makeIssue',
          0,
          er,
          'map',
          0,
          tN,
          'nan',
          0,
          tv,
          'nativeEnum',
          0,
          tz,
          'never',
          0,
          tS,
          'null',
          0,
          tw,
          'nullable',
          0,
          tK,
          'number',
          0,
          tm,
          'object',
          0,
          tP,
          'objectUtil',
          0,
          o,
          'oboolean',
          0,
          tQ,
          'onumber',
          0,
          tG,
          'optional',
          0,
          tU,
          'ostring',
          0,
          tH,
          'pipeline',
          0,
          tW,
          'preprocess',
          0,
          tq,
          'promise',
          0,
          tV,
          'quotelessJson',
          0,
          Q,
          'record',
          0,
          tM,
          'set',
          0,
          tZ,
          'setErrorMap',
          0,
          ee,
          'strictObject',
          0,
          tE,
          'string',
          0,
          th,
          'symbol',
          0,
          tb,
          'transformer',
          0,
          tF,
          'tuple',
          0,
          tI,
          'undefined',
          0,
          tx,
          'union',
          0,
          tC,
          'unknown',
          0,
          tO,
          'util',
          0,
          s,
          'void',
          0,
          tj,
        ],
        31956,
      ));
    var tJ = e.i(31956),
      tJ = tJ;
    let tX = tJ.enum(['admin', 'student', 'driver']);
    tJ.number().int().min(0);
    let t0 = tJ.enum([
      'scheduled',
      'driver_waiting',
      'in_transit',
      'completed',
      'absent',
      'cancelled',
    ]);
    (tJ.object({ lat: tJ.number().min(-90).max(90), lng: tJ.number().min(-180).max(180) }),
      tJ.object({ routeId: tJ.string().uuid(), studentId: tJ.string().uuid() }),
      tJ.object({ routeId: tJ.string().uuid() }),
      tJ
        .object({
          targetUserId: tJ.string().uuid().optional(),
          targetRole: tJ.enum(['all', 'student', 'driver']).optional(),
          title: tJ.string().min(1),
          body: tJ.string().min(1),
          data: tJ.record(tJ.unknown()).optional(),
        })
        .refine((e) => e.targetUserId || e.targetRole, {
          message: 'Must provide either targetUserId or targetRole',
        }),
      tJ.object({ token: tJ.string().min(1) }),
      tJ.object({
        tripId: tJ.string().uuid(),
        newStatus: t0,
        lat: tJ.number().min(-90).max(90).optional().nullable(),
        lng: tJ.number().min(-180).max(180).optional().nullable(),
      }));
    let t1 = tJ.enum(['pending', 'active', 'expired', 'cancelled']);
    (tJ.object({
      id: tJ.string().uuid(),
      name: tJ.string().min(1),
      city: tJ.string().nullable().optional(),
      created_at: tJ.string(),
    }),
      tJ.object({
        id: tJ.string().uuid(),
        driver_id: tJ.string().uuid(),
        institution_id: tJ.string().uuid().nullable().optional(),
        title: tJ.string().min(1),
        start_location: tJ.string().min(1),
        end_location: tJ.string().min(1),
        price: tJ.number().int().min(0),
        capacity: tJ.number().int().min(1),
        available_seats: tJ.number().int().min(0),
        is_active: tJ.boolean(),
        start_lat: tJ.number().nullable().optional(),
        start_lng: tJ.number().nullable().optional(),
        end_lat: tJ.number().nullable().optional(),
        end_lng: tJ.number().nullable().optional(),
        departure_time: tJ.string().nullable().optional(),
        return_time: tJ.string().nullable().optional(),
      }),
      tJ.object({
        id: tJ.string().uuid(),
        trip_id: tJ.string().uuid(),
        student_id: tJ.string().uuid(),
        driver_id: tJ.string().uuid(),
        rating: tJ.number().int().min(1).max(5),
        comment: tJ.string().nullable().optional(),
        created_at: tJ.string(),
      }),
      tJ.object({
        id: tJ.string().uuid(),
        route_id: tJ.string().uuid(),
        driver_id: tJ.string().uuid(),
        status: t0,
        scheduled_at: tJ.string(),
        started_at: tJ.string().nullable(),
        ended_at: tJ.string().nullable(),
        last_lat: tJ.number().nullable(),
        last_lng: tJ.number().nullable(),
      }),
      tJ.object({
        id: tJ.string().uuid(),
        student_id: tJ.string().uuid(),
        route_id: tJ.string().uuid(),
        status: t1,
        start_date: tJ.string(),
        end_date: tJ.string(),
        created_at: tJ.string(),
      }));
    let t2 = tJ.enum(['active', 'used', 'revoked']);
    (tJ.object({
      id: tJ.string().uuid(),
      batch_id: tJ.string().uuid(),
      route_id: tJ.string().uuid(),
      code: tJ.string(),
      status: t2,
      used_by: tJ.string().uuid().nullable().optional(),
      used_at: tJ.string().nullable().optional(),
      valid_days: tJ.number().int().min(1),
      created_at: tJ.string(),
    }),
      tJ.object({
        id: tJ.string().uuid(),
        created_by: tJ.string().uuid(),
        route_id: tJ.string().uuid(),
        batch_name: tJ.string(),
        quantity: tJ.number().int().min(1),
        price: tJ.number().min(0),
        valid_days: tJ.number().int().min(1),
        created_at: tJ.string(),
      }));
    let t9 = tJ.enum(['pending', 'completed', 'rejected']);
    (tJ.object({
      id: tJ.string().uuid(),
      driver_id: tJ.string().uuid(),
      amount: tJ.number().min(0.01),
      status: t9,
      reference_note: tJ.string().nullable().optional(),
      created_at: tJ.string(),
      updated_at: tJ.string(),
    }),
      tJ.object({
        id: tJ.string().uuid(),
        full_name: tJ.string().min(1),
        phone: tJ.string().min(1),
        role: tX,
        institution_id: tJ.string().uuid().nullable(),
        is_verified: tJ.boolean().default(!1),
        created_at: tJ.string(),
        updated_at: tJ.string(),
      }),
      tJ.enum(['ar', 'en']));
    let t4 = {
      ar: {
        translation: {
          welcome: 'مرحباً بك في يونيرايد',
          book_now: 'احجز الآن',
          no_seats: 'عذراً، لا توجد مقاعد متاحة',
          trip_started: 'بدأت الرحلة',
          login: 'تسجيل الدخول',
          signup: 'إنشاء حساب',
          email: 'البريد الإلكتروني',
          password: 'كلمة المرور',
          loading: 'جاري التحميل...',
          available_routes: 'الخطوط المتاحة',
          my_subscriptions: 'اشتراكاتي',
          profile: 'الملف الشخصي',
          logout: 'تسجيل الخروج',
          driver_dashboard: 'لوحة السائق',
          start_trip: 'بدء الرحلة',
          end_trip: 'إنهاء الرحلة',
          cancel_trip: 'إلغاء الرحلة',
          waiting_for_driver: 'في انتظار السائق',
          in_transit: 'في الطريق',
          completed: 'مكتملة',
          cancelled: 'ملغاة',
          scheduled: 'مجدولة',
          absent: 'غائب',
          driver_waiting: 'السائق ينتظر',
          from: 'من',
          to: 'إلى',
          price: 'السعر',
          seats_available: 'مقاعد متاحة',
          seat_reserved: 'تم حجز المقعد بنجاح!',
          booking_failed: 'فشل الحجز',
          live_tracking: 'التتبع المباشر',
          no_active_trips: 'لا توجد رحلات نشطة',
          confirm_booking: 'تأكيد الحجز',
          route_details: 'تفاصيل الخط',
          subscription_active: 'فعال',
          subscription_expired: 'منتهي',
          subscription_cancelled: 'ملغي',
          subscription_pending: 'قيد الانتظار',
          error_generic: 'حدث خطأ، يرجى المحاولة مرة أخرى',
          no_internet: 'لا يوجد اتصال بالإنترنت',
          cancel_subscription: 'إلغاء الاشتراك',
          save: 'حفظ',
          phone: 'الهاتف',
          language: 'اللغة',
          retry: 'إعادة المحاولة',
          go_back: 'رجوع',
          are_you_sure: 'هل أنت متأكد؟',
          no: 'لا',
          yes: 'نعم',
          updated_successfully: 'تم التحديث بنجاح',
          something_went_wrong: 'حدث خطأ ما',
          try_again: 'حاول مرة أخرى',
          check_inbox: 'يرجى التحقق من بريدك الإلكتروني للتحقق',
          invalid_transition: 'انتقال حالة غير صالح',
          cancel_confirmation: 'هل أنت متأكد من إلغاء هذا الاشتراك؟',
          full_name: 'الاسم الكامل',
          i_am: 'أنا...',
          student: 'طالب',
          driver: 'سائق',
          forgot_password: 'نسيت كلمة المرور؟',
          already_have_account: 'لديك حساب بالفعل؟ ',
          dont_have_account: 'لا تملك حساباً؟ ',
          account_created: 'تم إنشاء الحساب بنجاح!',
          enter_email_first: 'يرجى إدخال بريدك الإلكتروني أولاً',
          reset_link_sent: 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني',
          sent: 'تم الإرسال',
          alert: 'تنبيه',
          error: 'خطأ',
          uniride_tagline: 'نقل جامعي ذكي',
          activation_required: 'التفعيل مطلوب',
          activation_prompt: 'الحجز يتم عبر كود ترخيص. افتح شاشة التفعيل الآن.',
          cancel: 'إلغاء',
          open_activation: 'فتح التفعيل',
          route_not_found: 'لم يتم العثور على الخط',
          activate_license: 'تفعيل الترخيص',
          currency: 'د.ع',
          trip_history: 'سجل الرحلات',
          unknown_route: 'مسار غير معروف',
          unknown_driver: 'سائق غير معروف',
          no_trips_found: 'لا توجد رحلات سابقة',
          hello: 'مرحباً',
          search_routes_placeholder: 'إلى أين تريد الذهاب؟',
          search_routes_subtitle: 'ابحث عن خط نقلك',
          activate_new_license: 'تفعيل ترخيص جديد',
          activate_license_description: 'أدخل الكود لتفعيل اشتراكك',
          departure: 'ذهاب',
          return: 'إياب',
          seat: 'مقعد',
          no_available_routes: 'لا توجد خطوط متاحة',
          pull_to_refresh: 'اسحب للأسفل للتحديث',
          failed_to_load_routes: 'تعذّر تحميل الخطوط',
          available_routes_count: 'خط متاح',
          home: 'الرئيسية',
          book_trip: 'حجز رحلة',
          account: 'الحساب',
          activate_subscription: 'تفعيل اشتراك',
          check_inbox_title: 'تحقق من بريدك',
          check_inbox_msg: 'أرسلنا لك رابط تفعيل على بريدك الإلكتروني',
          admin: 'مدير',
          arabic: 'العربية',
          english: 'English',
          go_back_short: 'تراجع',
          active: 'نشط',
          used: 'مستخدم',
          revoked: 'ملغي',
          activate: 'تفعيل',
          invalid_license: 'كود التفعيل غير صالح',
          activation_success: 'تم تفعيل الاشتراك بنجاح!',
          license_code: 'كود الترخيص',
          enter_license_code: 'أدخل كود الترخيص المكون من 8 رموز',
          confirm_payout: 'تأكيد عملية الدفع',
          payout_submitted: 'تم إرسال طلب الدفع',
          status: 'الحالة',
          comment: 'تعليق',
          rating: 'التقييم',
          submit: 'إرسال',
          optional: 'اختياري',
          create_trip: 'إنشاء رحلة',
          user: 'المستخدم',
          enter_full_name: 'أدخل اسمك الكامل',
          success: 'نجاح',
          ok: 'حسناً',
          license_placeholder: 'مثال: A1B2C3D4',
          invalid_code_length: 'يرجى إدخال كود ترخيص صحيح (8 رموز)',
          activation_failed: 'فشل التفعيل',
          invalid_code_error: 'الكود غير صالح أو مستخدم مسبقاً',
          trip_opened_success: 'تم فتح الرحلة واستقبال الطلاب بنجاح',
          trip_creation_error: 'خطأ في إنشاء الرحلة',
          new_trip: 'رحلة جديدة',
          select_route_prompt: 'اختر الخط الذي ستقوم بالرحلة عليه الآن:',
          passengers: 'راكب',
          no_routes_assigned: 'لم يتم تخصيص خطوط لك بعد',
          open_trip_now: 'فتح الرحلة الآن',
          request_payout_title: 'طلب سحب أرباح',
          request_payout_confirm: 'هل أنت متأكد من طلب سحب أرباحك؟',
          confirm_request: 'تأكيد الطلب',
          payout_submitted_success: 'تم إرسال طلب السحب بنجاح. سيتم مراجعته قريباً.',
          start_receiving_students: 'بدء استقبال الطلاب',
          start_trip_action: 'انطلاق الرحلة',
          cancel_trip_confirm: 'هل أنت متأكد من إلغاء هذه الرحلة؟',
          yes_cancel: 'نعم، قم بالإلغاء',
          available_balance: 'الرصيد المتاح للسحب',
          withdraw_request: 'طلب سحب',
          no_scheduled_trips: 'لا توجد رحلات مجدولة حالياً',
          onboarding_1_desc: 'احجز مقعدك في خطوط النقل الجامعية بكل سهولة ويسر من هاتفك المحمول.',
          onboarding_2_title: 'تتبع رحلتك المباشر',
          onboarding_2_desc: 'لا داعي للانتظار طويلاً، تابع حركة السائق مباشرة عبر الخريطة.',
          onboarding_3_title: 'آمن وموثوق',
          onboarding_3_desc: 'سائقون معتمدون ومركبات آمنة لضمان راحتك في رحلتك اليومية للجامعة.',
          skip: 'تخطي',
          get_started: 'ابدأ الآن',
          next: 'التالي',
          failed_to_find_trip: 'تعذّر البحث عن رحلة نشطة',
          track_trip: 'تتبع الرحلة',
          no_subscriptions: 'لا توجد اشتراكات',
          book_route_prompt: 'احجز خطاً من الصفحة الرئيسية',
          tracking: 'التتبع',
          please_rate: 'يرجى اختيار عدد النجوم للتقييم',
          thank_you: 'شكراً لك',
          rating_success: 'تم إرسال تقييمك بنجاح!',
          how_was_trip: 'كيف كانت رحلتك؟',
          rating_subtitle: 'تقييمك يساعدنا في تحسين جودة النقل للجميع',
          additional_notes_optional: 'ملاحظات إضافية (اختياري)',
          comment_placeholder: 'اكتب تعليقك هنا...',
          submit_rating: 'إرسال التقييم',
          start_point: 'نقطة الانطلاق',
          end_point: 'نقطة الوصول',
          driver_location: 'موقع السائق',
          app_error: '⚠️ خطأ في التطبيق',
          unexpected_error: 'حدث خطأ غير متوقع',
          please_restart: 'يرجى إعادة تشغيل التطبيق',
          documentTitle: { default: 'يونيرايد - لوحة التحكم' },
          dashboard: {
            title: 'الرئيسية',
            subtitle: 'لوحة التحكم',
            stats: {
              total_users: 'إجمالي المستخدمين',
              active_drivers: 'السائقون النشطون',
              active_routes: 'الخطوط الفعالة',
              active_trips: 'الرحلات الحية',
              total_routes: 'إجمالي الخطوط',
              total_trips: 'إجمالي الرحلات',
              active_subscriptions: 'الاشتراكات الفعالة',
              monthly_revenue: 'الأرباح الشهرية',
            },
            charts: {
              trips_activity: 'نشاط الرحلات (آخر 7 أيام)',
              outcomes: 'نتائج الرحلات',
              top_routes: 'أكثر الخطوط طلباً',
              revenue_trend: 'توجه الأرباح',
            },
            realtime: {
              live: 'مباشر',
              connecting: 'جاري الاتصال...',
              connected: 'متصل',
              disconnected: 'منقطع',
            },
            live_trips_notice_title: 'الرحلات الحية الان',
            live_trips_notice_desc: 'رحلة/رحلات نشطة حالياً. راجع التفاصيل في قسم الرحلات.',
            refresh: 'تحديث البيانات',
            last_updated: 'آخر تحديث: {{time}}',
            update_failed: 'تعذّر تحديث البيانات — تعرض آخر نسخة محفوظة',
            quickActions: {
              title: 'إجراءات سريعة',
              manageDrivers: 'إدارة السائقين',
              viewDrivers: 'عرض وتوثيق السائقين',
              viewTrips: 'عرض الرحلات',
              monitorTrips: 'مراقبة الرحلات النشطة',
              licenses: 'دفعات التراخيص',
              createBatch: 'إنشاء دفعة جديدة',
              analytics: 'التحليلات',
              viewStats: 'عرض الإحصائيات التفصيلية',
            },
          },
          analytics: {
            title: 'التحليلات',
            date_range: 'الفترة الزمنية',
            apply: 'تطبيق',
            reset: 'إعادة ضبط (30 يوم)',
            kpis: {
              total_trips: 'إجمالي الرحلات',
              active_students: 'الطلاب النشطون',
              revenue: 'الأرباح (د.ع)',
              avg_rating: 'متوسط التقييم',
            },
            outcomes: {
              title: 'نتائج الرحلات',
              completion: 'نسبة الإكمال',
              cancellation: 'نسبة الإلغاء',
              active_drivers: 'السائقون النشطون',
            },
            performance: {
              title: 'أداء الاستعلامات',
              query: 'الاستعلام',
              calls: 'النداءات',
              avg_ms: 'المعدل (ms)',
              total_ms: 'الإجمالي (ms)',
              rows: 'الصفوف',
              not_available: 'مراقبة الاستعلامات غير متوفرة',
            },
          },
          login: {
            title: 'يونيرايد - الإدارة',
            subtitle: 'سجّل الدخول لإدارة المنصة',
            email: 'البريد الإلكتروني',
            password: 'كلمة المرور',
            submit: 'تسجيل الدخول',
            error: 'بيانات الدخول غير صحيحة',
          },
          status_labels: {
            scheduled: 'مجدول',
            driver_waiting: 'السائق ينتظر',
            in_transit: 'في الطريق',
            completed: 'مكتمل',
            absent: 'غائب',
            cancelled: 'ملغي',
            active: 'نشط',
            pending: 'قيد الانتظار',
            expired: 'منتهي',
          },
          confirm: 'تأكيد',
          are_you_sure: 'هل أنت متأكد؟',
          loading: 'جاري التحميل...',
          no_active_trips: 'لا توجد رحلات نشطة',
          cancel_trip: 'إلغاء الرحلة',
          cancel_subscription: 'إلغاء الاشتراك',
          profiles: {
            titles: {
              list: 'المستخدمين',
              show: 'عرض المستخدم',
              edit: 'تعديل المستخدم',
              create: 'إضافة مستخدم',
            },
            fields: {
              id: 'المعرف',
              fullName: 'الاسم الكامل',
              phone: 'الهاتف',
              role: 'الدور',
              joined: 'تاريخ الانضمام',
              actions: 'الإجراءات',
              verified: 'موثق',
              notVerified: 'غير موثق',
              institution: 'المؤسسة',
            },
          },
          trips: {
            titles: {
              list: 'الرحلات الحية',
              show: 'عرض الرحلة',
              edit: 'تعديل الرحلة',
              create: 'إضافة رحلة',
            },
            fields: {
              id: 'المعرف',
              status: 'الحالة',
              route: 'المسار',
              driver: 'السائق',
              scheduledAt: 'وقت الجدولة',
              startedAt: 'وقت البدء',
              duration: 'المدة',
              seats: 'المقاعد',
              actions: 'الإجراءات',
            },
            all_statuses: 'كل الحالات',
            actions: { cancel: 'إلغاء الرحلة' },
            errors: { loadFailed: 'فشل في تحميل الرحلات', cancelFailed: 'فشل في إلغاء الرحلة' },
          },
          routes: {
            titles: { list: 'الخطوط', show: 'عرض الخط', edit: 'تعديل الخط', create: 'إضافة خط' },
            fields: {
              id: 'المعرف',
              title: 'العنوان',
              driver: 'السائق',
              startLocation: 'نقطة الانطلاق',
              endLocation: 'نقطة النهاية',
              price: 'السعر',
              capacity: 'السعة',
              availableSeats: 'المقاعد المتاحة',
              active: 'فعال',
              actions: 'الإجراءات',
            },
          },
          subscriptions: {
            titles: {
              list: 'الاشتراكات',
              show: 'عرض الاشتراك',
              edit: 'تعديل الاشتراك',
              create: 'إضافة اشتراك',
            },
            fields: {
              student: 'الطالب',
              route: 'الخط',
              status: 'الحالة',
              startDate: 'تاريخ البدء',
              endDate: 'تاريخ الانتهاء',
              createdAt: 'تاريخ الإنشاء',
              daysRemaining: 'الأيام المتبقية',
              price: 'السعر',
            },
            actions: { cancel: 'إلغاء الاشتراك' },
            errors: {
              loadFailed: 'فشل في تحميل الاشتراكات',
              cancelFailed: 'فشل في إلغاء الاشتراك',
            },
          },
          license_batches: {
            titles: {
              list: 'دفعات التراخيص',
              show: 'عرض الدفعة',
              edit: 'تعديل الدفعة',
              create: 'إضافة دفعة',
            },
            fields: {
              name: 'اسم الدفعة',
              route: 'الخط',
              quantity: 'الكمية',
              price: 'السعر',
              validDays: 'أيام الصلاحية',
              createdAt: 'تاريخ الإنشاء',
            },
          },
          licenses: {
            titles: {
              list: 'التراخيص',
              show: 'عرض الترخيص',
              edit: 'تعديل الترخيص',
              create: 'إضافة ترخيص',
            },
            fields: {
              code: 'الكود',
              status: 'الحالة',
              usedBy: 'استخدم بواسطة',
              usedAt: 'تاريخ الاستخدام',
              validDays: 'أيام الصلاحية',
              createdAt: 'تاريخ الإنشاء',
            },
          },
          drivers: {
            titles: {
              list: 'إدارة السائقين',
              show: 'عرض السائق',
              edit: 'تعديل السائق',
              create: 'إضافة سائق',
            },
            fields: {
              driverName: 'اسم السائق',
              phone: 'الهاتف',
              licenseNumber: 'رقم الرخصة',
              vehicle: 'المركبة',
              plate: 'اللوحة',
              capacity: 'السعة',
              rating: 'التقييم',
              trips: 'الرحلات',
              verified: 'موثق',
              registered: 'تاريخ التسجيل',
              actions: 'الإجراءات',
            },
          },
          institutions: {
            titles: {
              list: 'المؤسسات',
              show: 'عرض المؤسسة',
              edit: 'تعديل المؤسسة',
              create: 'إضافة مؤسسة',
            },
            fields: {
              id: 'المعرف',
              name: 'الاسم',
              city: 'المدينة',
              createdAt: 'تاريخ الإنشاء',
              actions: 'الإجراءات',
            },
          },
          feature_flags: { titles: { list: 'ميزات النظام' } },
          audit_logs: {
            titles: { list: 'سجل المراجعة' },
            fields: {
              user: 'المستخدم',
              action: 'الإجراء',
              resource: 'المورد',
              resourceId: 'معرف المورد',
              details: 'التفاصيل',
              createdAt: 'التاريخ',
            },
          },
          notifications: {
            titles: { broadcast: 'بث الإشعارات' },
            fields: { target: 'الفئة المستهدفة', title: 'عنوان الإشعار', body: 'محتوى الإشعار' },
            targets: { all: 'جميع المستخدمين', student: 'الطلاب فقط', driver: 'السائقين فقط' },
            success: 'تم إرسال الإشعار بنجاح إلى {{sent}} جهاز',
            failed: 'فشل الإرسال',
            send: 'إرسال الآن',
          },
          payouts: {
            titles: { list: 'طلبات السحب' },
            fields: {
              driverName: 'اسم السائق',
              phone: 'رقم الهاتف',
              amount: 'المبلغ',
              status: 'الحالة',
              referenceNote: 'ملاحظة مرجعية',
              createdAt: 'تاريخ الطلب',
            },
            status: { pending: 'قيد الانتظار', completed: 'مكتمل', rejected: 'مرفوض' },
            actions: { approve: 'اعتماد', reject: 'رفض' },
          },
          actions: {
            actions: 'الإجراءات',
            edit: 'تعديل',
            show: 'عرض',
            create: 'إنشاء',
            delete: 'حذف',
            save: 'حفظ',
            cancel: 'إلغاء',
            export: 'تصدير',
          },
          buttons: { logout: 'تسجيل الخروج' },
          verified: 'موثق',
          unverified: 'غير موثق',
          total: 'المجموع',
          active: 'نشط',
          completed: 'مكتمل',
          cancelled: 'ملغي',
          pending: 'قيد الانتظار',
          expired: 'منتهي',
          revenue: 'الأرباح',
          search_placeholder: 'بحث...',
          search_trips: 'بحث بالخط أو السائق...',
          search_subscriptions: 'بحث بالطالب أو الخط...',
          add_driver: 'إضافة سائق',
          create_trip: 'إضافة رحلة',
          status: 'الحالة',
          all: 'الكل',
          all_statuses: 'كل الحالات',
          days: 'يوم',
          iqd: 'د.ع',
          yes: 'نعم',
          no: 'لا',
        },
      },
      en: {
        translation: {
          welcome: 'Welcome to UniRide',
          book_now: 'Book Now',
          no_seats: 'Sorry, no seats available',
          trip_started: 'Trip Started',
          login: 'Login',
          signup: 'Create Account',
          email: 'Email',
          password: 'Password',
          loading: 'Loading...',
          available_routes: 'Available Routes',
          my_subscriptions: 'My Subscriptions',
          profile: 'Profile',
          logout: 'Logout',
          driver_dashboard: 'Driver Dashboard',
          start_trip: 'Start Trip',
          end_trip: 'End Trip',
          cancel_trip: 'Cancel Trip',
          waiting_for_driver: 'Waiting for Driver',
          in_transit: 'In Transit',
          completed: 'Completed',
          cancelled: 'Cancelled',
          scheduled: 'Scheduled',
          absent: 'Absent',
          driver_waiting: 'Driver Waiting',
          from: 'From',
          to: 'To',
          price: 'Price',
          seats_available: 'seats available',
          seat_reserved: 'Seat reserved successfully!',
          booking_failed: 'Booking failed',
          live_tracking: 'Live Tracking',
          no_active_trips: 'No active trips',
          confirm_booking: 'Confirm Booking',
          route_details: 'Route Details',
          subscription_active: 'Active',
          subscription_expired: 'Expired',
          subscription_cancelled: 'Cancelled',
          subscription_pending: 'Pending',
          error_generic: 'An error occurred, please try again',
          no_internet: 'No internet connection',
          cancel_subscription: 'Cancel Subscription',
          save: 'Save',
          phone: 'Phone',
          language: 'Language',
          retry: 'Retry',
          go_back: 'Go Back',
          are_you_sure: 'Are you sure?',
          no: 'No',
          yes: 'Yes',
          updated_successfully: 'Updated successfully',
          something_went_wrong: 'Something went wrong',
          try_again: 'Try Again',
          check_inbox: 'Please check your inbox for email verification',
          invalid_transition: 'Invalid status transition',
          cancel_confirmation: 'Are you sure you want to cancel this subscription?',
          full_name: 'Full Name',
          i_am: 'I am...',
          student: 'Student',
          driver: 'Driver',
          forgot_password: 'Forgot Password?',
          already_have_account: 'Already have an account? ',
          dont_have_account: "Don't have an account? ",
          account_created: 'Account created successfully!',
          enter_email_first: 'Please enter your email first',
          reset_link_sent: 'A password reset link has been sent to your email',
          sent: 'Sent',
          alert: 'Alert',
          error: 'Error',
          uniride_tagline: 'Smart University Transit',
          activation_required: 'Activation Required',
          activation_prompt: 'Booking requires a license code. Open the activation screen now.',
          cancel: 'Cancel',
          open_activation: 'Open Activation',
          route_not_found: 'Route not found',
          activate_license: 'Activate License',
          currency: 'IQD',
          trip_history: 'Trip History',
          unknown_route: 'Unknown Route',
          unknown_driver: 'Unknown Driver',
          no_trips_found: 'No trips found',
          hello: 'Hello',
          search_routes_placeholder: 'Where do you want to go?',
          search_routes_subtitle: 'Search for your route',
          activate_new_license: 'Activate New License',
          activate_license_description: 'Enter code to activate subscription',
          departure: 'Departure',
          return: 'Return',
          seat: 'Seat',
          no_available_routes: 'No available routes',
          pull_to_refresh: 'Pull down to refresh',
          failed_to_load_routes: 'Failed to load routes',
          available_routes_count: 'available routes',
          home: 'Home',
          book_trip: 'Book Trip',
          account: 'Account',
          activate_subscription: 'Activate Subscription',
          check_inbox_title: 'Check your inbox',
          check_inbox_msg: 'We sent you an activation link to your email',
          admin: 'Admin',
          arabic: 'Arabic',
          english: 'English',
          go_back_short: 'Back',
          active: 'Active',
          used: 'Used',
          revoked: 'Revoked',
          activate: 'Activate',
          invalid_license: 'Invalid license code',
          activation_success: 'Subscription activated successfully!',
          license_code: 'License Code',
          enter_license_code: 'Enter 8-digit license code',
          confirm_payout: 'Confirm Payout',
          payout_submitted: 'Payout request submitted',
          status: 'Status',
          comment: 'Comment',
          rating: 'Rating',
          submit: 'Submit',
          optional: 'Optional',
          create_trip: 'Create Trip',
          user: 'User',
          enter_full_name: 'Enter your full name',
          success: 'Success',
          ok: 'OK',
          license_placeholder: 'e.g., A1B2C3D4',
          invalid_code_length: 'Please enter a valid 8-digit license code',
          activation_failed: 'Activation Failed',
          invalid_code_error: 'Invalid or already used code',
          trip_opened_success: 'Trip started and accepting students successfully',
          trip_creation_error: 'Error creating trip',
          new_trip: 'New Trip',
          select_route_prompt: 'Select the route you are starting now:',
          passengers: 'passengers',
          no_routes_assigned: 'No routes assigned to you yet',
          open_trip_now: 'Open Trip Now',
          request_payout_title: 'Request Payout',
          request_payout_confirm: 'Are you sure you want to request a payout?',
          confirm_request: 'Confirm Request',
          payout_submitted_success:
            'Payout request submitted successfully. It will be reviewed soon.',
          start_receiving_students: 'Start receiving students',
          start_trip_action: 'Start Trip',
          cancel_trip_confirm: 'Are you sure you want to cancel this trip?',
          yes_cancel: 'Yes, cancel it',
          available_balance: 'Available balance for withdrawal',
          withdraw_request: 'Withdraw Request',
          no_scheduled_trips: 'No scheduled trips currently',
          onboarding_1_desc:
            'Book your seat in university transit lines easily from your mobile phone.',
          onboarding_2_title: 'Live Trip Tracking',
          onboarding_2_desc: 'No need to wait long, follow the driver’s movement live on the map.',
          onboarding_3_title: 'Safe and Reliable',
          onboarding_3_desc:
            'Certified drivers and safe vehicles to ensure your comfort on your daily trip to the university.',
          skip: 'Skip',
          get_started: 'Get Started',
          next: 'Next',
          failed_to_find_trip: 'Failed to find active trip',
          track_trip: 'Track Trip',
          no_subscriptions: 'No subscriptions',
          book_route_prompt: 'Book a route from the home page',
          tracking: 'Tracking',
          please_rate: 'Please select a star rating',
          thank_you: 'Thank you',
          rating_success: 'Your rating has been submitted successfully!',
          how_was_trip: 'How was your trip?',
          rating_subtitle: 'Your feedback helps us improve transportation for everyone',
          additional_notes_optional: 'Additional notes (optional)',
          comment_placeholder: 'Write your comment here...',
          submit_rating: 'Submit Rating',
          start_point: 'Start Point',
          end_point: 'End Point',
          driver_location: 'Driver Location',
          app_error: '⚠️ App Error',
          unexpected_error: 'An unexpected error occurred',
          please_restart: 'Please restart the application',
          documentTitle: { default: 'UniRide - Admin Dashboard' },
          dashboard: {
            title: 'Dashboard',
            subtitle: 'Admin Dashboard',
            stats: {
              total_users: 'Total Users',
              active_drivers: 'Active Drivers',
              active_routes: 'Active Routes',
              active_trips: 'Active Trips',
              total_routes: 'Total Routes',
              total_trips: 'Total Trips',
              active_subscriptions: 'Active Subscriptions',
              monthly_revenue: 'Monthly Revenue',
            },
            charts: {
              trips_activity: 'Trips Activity (Last 7 Days)',
              outcomes: 'Trip Outcomes',
              top_routes: 'Top Routes',
              revenue_trend: 'Revenue Trend',
            },
            realtime: {
              live: 'LIVE',
              connecting: 'Connecting...',
              connected: 'Connected',
              disconnected: 'Disconnected',
            },
            live_trips_notice_title: 'Active Trips',
            live_trips_notice_desc: 'There are active trips. Review details in the trips section.',
            refresh: 'Refresh',
            last_updated: 'Last updated: {{time}}',
            update_failed: 'Failed to update data',
            quickActions: {
              title: 'Quick Actions',
              manageDrivers: 'Manage Drivers',
              viewDrivers: 'View and verify drivers',
              viewTrips: 'View Trips',
              monitorTrips: 'Monitor active trips',
              licenses: 'License Batches',
              createBatch: 'Create new batch',
              analytics: 'Analytics',
              viewStats: 'View detailed statistics',
            },
          },
          analytics: {
            title: 'Analytics',
            date_range: 'Date Range',
            apply: 'Apply',
            reset: 'Reset (30 days)',
            kpis: {
              total_trips: 'Total Trips',
              active_students: 'Active Students',
              revenue: 'Revenue (IQD)',
              avg_rating: 'Average Rating',
            },
            outcomes: {
              title: 'Trip Outcomes',
              completion: 'Completion Rate',
              cancellation: 'Cancellation Rate',
              active_drivers: 'Active Drivers',
            },
            performance: {
              title: 'Query Performance',
              query: 'Query',
              calls: 'Calls',
              avg_ms: 'Avg (ms)',
              total_ms: 'Total (ms)',
              rows: 'Rows',
              not_available: 'Query monitoring not available',
            },
          },
          login: {
            title: 'UniRide Admin',
            subtitle: 'Sign in to manage the platform',
            email: 'Email Address',
            password: 'Password',
            submit: 'Sign In',
            error: 'Invalid credentials',
          },
          status_labels: {
            scheduled: 'Scheduled',
            driver_waiting: 'Driver Waiting',
            in_transit: 'In Transit',
            completed: 'Completed',
            absent: 'Absent',
            cancelled: 'Cancelled',
            active: 'Active',
            pending: 'Pending',
            expired: 'Expired',
          },
          confirm: 'Confirm',
          are_you_sure: 'Are you sure?',
          loading: 'Loading...',
          no_active_trips: 'No active trips',
          cancel_trip: 'Cancel Trip',
          cancel_subscription: 'Cancel Subscription',
          profiles: {
            titles: { list: 'Users', show: 'View User', edit: 'Edit User', create: 'Add User' },
            fields: {
              id: 'ID',
              fullName: 'Full Name',
              phone: 'Phone',
              role: 'Role',
              joined: 'Joined',
              actions: 'Actions',
              verified: 'Verified',
              notVerified: 'Not Verified',
              institution: 'Institution',
            },
          },
          trips: {
            titles: {
              list: 'Live Trips',
              show: 'View Trip',
              edit: 'Edit Trip',
              create: 'Add Trip',
            },
            fields: {
              id: 'ID',
              status: 'Status',
              route: 'Route',
              driver: 'Driver',
              scheduledAt: 'Scheduled',
              startedAt: 'Started',
              duration: 'Duration',
              seats: 'Seats',
              actions: 'Actions',
            },
            all_statuses: 'All Statuses',
            actions: { cancel: 'Cancel Trip' },
            errors: { loadFailed: 'Failed to load trips', cancelFailed: 'Failed to cancel trip' },
          },
          routes: {
            titles: { list: 'Routes', show: 'View Route', edit: 'Edit Route', create: 'Add Route' },
            fields: {
              id: 'ID',
              title: 'Title',
              driver: 'Driver',
              startLocation: 'Start',
              endLocation: 'End',
              price: 'Price',
              capacity: 'Capacity',
              availableSeats: 'Available Seats',
              active: 'Active',
              actions: 'Actions',
            },
          },
          subscriptions: {
            titles: {
              list: 'Subscriptions',
              show: 'View Subscription',
              edit: 'Edit Subscription',
              create: 'Add Subscription',
            },
            fields: {
              student: 'Student',
              route: 'Route',
              status: 'Status',
              startDate: 'Start Date',
              endDate: 'End Date',
              createdAt: 'Created At',
              daysRemaining: 'Days Remaining',
              price: 'Price',
            },
            actions: { cancel: 'Cancel Subscription' },
            errors: {
              loadFailed: 'Failed to load subscriptions',
              cancelFailed: 'Failed to cancel subscription',
            },
          },
          license_batches: {
            titles: {
              list: 'License Batches',
              show: 'View Batch',
              edit: 'Edit Batch',
              create: 'Add Batch',
            },
            fields: {
              name: 'Batch Name',
              route: 'Route',
              quantity: 'Quantity',
              price: 'Price',
              validDays: 'Valid Days',
              createdAt: 'Created At',
            },
          },
          licenses: {
            titles: {
              list: 'Licenses',
              show: 'View License',
              edit: 'Edit License',
              create: 'Add License',
            },
            fields: {
              code: 'Code',
              status: 'Status',
              usedBy: 'Used By',
              usedAt: 'Used At',
              validDays: 'Valid Days',
              createdAt: 'Created At',
            },
          },
          drivers: {
            titles: {
              list: 'Drivers Management',
              show: 'View Driver',
              edit: 'Edit Driver',
              create: 'Add Driver',
            },
            fields: {
              driverName: 'Driver Name',
              phone: 'Phone',
              licenseNumber: 'License Number',
              vehicle: 'Vehicle',
              plate: 'Plate',
              capacity: 'Capacity',
              rating: 'Rating',
              trips: 'Trips',
              verified: 'Verified',
              registered: 'Registered',
              actions: 'Actions',
            },
          },
          institutions: {
            titles: {
              list: 'Institutions',
              show: 'View Institution',
              edit: 'Edit Institution',
              create: 'Add Institution',
            },
            fields: {
              id: 'ID',
              name: 'Name',
              city: 'City',
              createdAt: 'Created At',
              actions: 'Actions',
            },
          },
          feature_flags: { titles: { list: 'Feature Flags' } },
          audit_logs: {
            titles: { list: 'Audit Logs' },
            fields: {
              user: 'User',
              action: 'Action',
              resource: 'Resource',
              resourceId: 'Resource ID',
              details: 'Details',
              createdAt: 'Date',
            },
          },
          notifications: {
            titles: { broadcast: 'Broadcast Notifications' },
            fields: { target: 'Target', title: 'Title', body: 'Body' },
            targets: { all: 'All Users', student: 'Students Only', driver: 'Drivers Only' },
            success: 'Notification sent successfully to {{sent}} devices',
            failed: 'Send failed',
            send: 'Send Now',
          },
          payouts: {
            titles: { list: 'Payout Requests' },
            fields: {
              driverName: 'Driver Name',
              phone: 'Phone',
              amount: 'Amount',
              status: 'Status',
              referenceNote: 'Reference Note',
              createdAt: 'Requested At',
            },
            status: { pending: 'Pending', completed: 'Completed', rejected: 'Rejected' },
            actions: { approve: 'Approve', reject: 'Reject' },
          },
          actions: {
            actions: 'Actions',
            edit: 'Edit',
            show: 'View',
            create: 'Create',
            delete: 'Delete',
            save: 'Save',
            cancel: 'Cancel',
            export: 'Export',
          },
          buttons: { logout: 'Logout' },
          verified: 'Verified',
          unverified: 'Unverified',
          total: 'Total',
          active: 'Active',
          completed: 'Completed',
          cancelled: 'Cancelled',
          pending: 'Pending',
          expired: 'Expired',
          revenue: 'Revenue',
          search_placeholder: 'Search...',
          search_trips: 'Search by route or driver...',
          search_subscriptions: 'Search by student or route...',
          add_driver: 'Add Driver',
          create_trip: 'Create Trip',
          status: 'Status',
          all: 'All',
          all_statuses: 'All Statuses',
          days: 'days',
          iqd: 'IQD',
          yes: 'Yes',
          no: 'No',
        },
      },
    };
    K.default
      .use(q.initReactI18next)
      .init({ resources: t4, lng: 'ar', fallbackLng: 'en', interpolation: { escapeValue: !1 } });
    let t5 = K.default,
      t3 = {
        translate: (e, t) => {
          let r = t5.t(e, t);
          return r !== e ? ('string' == typeof r ? r : JSON.stringify(r)) : e;
        },
        changeLocale: async (e) => {
          await t5.changeLanguage(e);
        },
        getLocale: () => t5.language,
      };
    e.s(
      [
        'AppProvider',
        0,
        ({ children: e }) =>
          (0, c.jsx)(k, {
            children: (0, c.jsx)(O.RefineSnackbarProvider, {
              children: (0, c.jsx)(f.Suspense, {
                fallback: (0, c.jsx)(V.Box, {
                  sx: {
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '100vh',
                  },
                  children: (0, c.jsx)(F.CircularProgress, {}),
                }),
                children: (0, c.jsx)(U.I18nextProvider, {
                  i18n: t5,
                  children: (0, c.jsx)(d.Refine, {
                    dataProvider: z,
                    authProvider: T,
                    routerProvider: C,
                    notificationProvider: O.notificationProvider,
                    i18nProvider: t3,
                    resources: [
                      { name: 'profiles', list: '/profiles', show: '/profiles/show/:id' },
                      {
                        name: 'drivers',
                        list: '/drivers',
                        create: '/drivers/create',
                        edit: '/drivers/edit/:id',
                        show: '/drivers/show/:id',
                      },
                      {
                        name: 'routes',
                        list: '/routes',
                        create: '/routes/create',
                        edit: '/routes/edit/:id',
                        show: '/routes/show/:id',
                      },
                      { name: 'trips', list: '/trips', create: '/trips/create' },
                      { name: 'subscriptions', list: '/subscriptions' },
                      {
                        name: 'license_batches',
                        list: '/license_batches',
                        create: '/license_batches/create',
                      },
                      { name: 'licenses', list: '/licenses' },
                      {
                        name: 'institutions',
                        list: '/institutions',
                        create: '/institutions/create',
                        edit: '/institutions/edit/:id',
                        show: '/institutions/show/:id',
                      },
                      { name: 'feature_flags', list: '/feature-flags' },
                    ],
                    options: { syncWithLocation: !0, warnWhenUnsavedChanges: !0 },
                    children: e,
                  }),
                }),
              }),
            }),
          }),
      ],
      29753,
    );
  },
  5010,
  (e, t, r) => {
    'use strict';
    var n = e.r(27249);
    (Object.defineProperty(r, '__esModule', { value: !0 }), (r.default = void 0));
    var a = n(e.r(72523)),
      i = e.r(37479);
    r.default = (0, a.default)(
      (0, i.jsx)('path', {
        d: 'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3m-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3m0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5m8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5',
      }),
      'People',
    );
  },
  83523,
  (e, t, r) => {
    'use strict';
    var n = e.r(27249);
    (Object.defineProperty(r, '__esModule', { value: !0 }), (r.default = void 0));
    var a = n(e.r(72523)),
      i = e.r(37479);
    r.default = (0, a.default)(
      (0, i.jsx)('path', {
        d: 'm9.78 11.16-1.42 1.42c-.68-.69-1.34-1.58-1.79-2.94l1.94-.49c.32.89.77 1.5 1.27 2.01M11 6 7 2 3 6h3.02c.02.81.08 1.54.19 2.17l1.94-.49C8.08 7.2 8.03 6.63 8.02 6zm10 0-4-4-4 4h2.99c-.1 3.68-1.28 4.75-2.54 5.88-.5.44-1.01.92-1.45 1.55-.34-.49-.73-.88-1.13-1.24L9.46 13.6c.93.85 1.54 1.54 1.54 3.4v5h2v-5c0-2.02.71-2.66 1.79-3.63 1.38-1.24 3.08-2.78 3.2-7.37z',
      }),
      'AltRoute',
    );
  },
  74289,
  (e, t, r) => {
    'use strict';
    var n = e.r(27249);
    (Object.defineProperty(r, '__esModule', { value: !0 }), (r.default = void 0));
    var a = n(e.r(72523)),
      i = e.r(37479);
    r.default = (0, a.default)(
      (0, i.jsx)('path', {
        d: 'M20 2H4c-1.11 0-2 .89-2 2v11c0 1.11.89 2 2 2h4v5l4-2 4 2v-5h4c1.11 0 2-.89 2-2V4c0-1.11-.89-2-2-2m0 13H4v-2h16zm0-5H4V4h16z',
      }),
      'CardMembership',
    );
  },
  3417,
  (e, t, r) => {
    'use strict';
    var n = e.r(27249);
    (Object.defineProperty(r, '__esModule', { value: !0 }), (r.default = void 0));
    var a = n(e.r(72523)),
      i = e.r(37479);
    r.default = (0, a.default)(
      (0, i.jsx)('path', {
        d: 'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4m0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4',
      }),
      'Person',
    );
  },
  91228,
  (e, t, r) => {
    'use strict';
    var n = e.r(27249);
    (Object.defineProperty(r, '__esModule', { value: !0 }), (r.default = void 0));
    var a = n(e.r(72523)),
      i = e.r(37479);
    r.default = (0, a.default)(
      (0, i.jsx)('path', {
        d: 'M22 10V6c0-1.11-.9-2-2-2H4c-1.1 0-1.99.89-1.99 2v4c1.1 0 1.99.9 1.99 2s-.89 2-2 2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-4c-1.1 0-2-.9-2-2s.9-2 2-2m-9 7.5h-2v-2h2zm0-4.5h-2v-2h2zm0-4.5h-2v-2h2z',
      }),
      'ConfirmationNumber',
    );
  },
  88835,
  (e, t, r) => {
    'use strict';
    var n = e.r(27249);
    (Object.defineProperty(r, '__esModule', { value: !0 }), (r.default = void 0));
    var a = n(e.r(72523)),
      i = e.r(37479);
    r.default = (0, a.default)(
      (0, i.jsx)('path', {
        d: 'm11.99 18.54-7.37-5.73L3 14.07l9 7 9-7-1.63-1.27zM12 16l7.36-5.73L21 9l-9-7-9 7 1.63 1.27z',
      }),
      'Layers',
    );
  },
  83792,
  (e, t, r) => {
    'use strict';
    var n = e.r(27249);
    (Object.defineProperty(r, '__esModule', { value: !0 }), (r.default = void 0));
    var a = n(e.r(72523)),
      i = e.r(37479);
    r.default = (0, a.default)(
      (0, i.jsx)('path', { d: 'M5 13.18v4L12 21l7-3.82v-4L12 17zM12 3 1 9l11 6 9-4.91V17h2V9z' }),
      'School',
    );
  },
  5857,
  (e, t, r) => {
    'use strict';
    var n = e.r(27249);
    (Object.defineProperty(r, '__esModule', { value: !0 }), (r.default = void 0));
    var a = n(e.r(72523)),
      i = e.r(37479);
    r.default = (0, a.default)(
      (0, i.jsx)('path', { d: 'M4 9h4v11H4zm12 4h4v7h-4zm-6-9h4v16h-4z' }),
      'BarChart',
    );
  },
  85151,
  (e, t, r) => {
    'use strict';
    var n = e.r(27249);
    (Object.defineProperty(r, '__esModule', { value: !0 }), (r.default = void 0));
    var a = n(e.r(72523)),
      i = e.r(37479);
    r.default = (0, a.default)(
      (0, i.jsx)('path', { d: 'M14.4 6 14 4H5v17h2v-7h5.6l.4 2h7V6z' }),
      'Flag',
    );
  },
  28477,
  (e, t, r) => {
    'use strict';
    var n = e.r(27249);
    (Object.defineProperty(r, '__esModule', { value: !0 }), (r.default = void 0));
    var a = n(e.r(72523)),
      i = e.r(37479);
    r.default = (0, a.default)(
      (0, i.jsx)('path', {
        d: 'M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9m-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8z',
      }),
      'History',
    );
  },
  75596,
  (e, t, r) => {
    'use strict';
    var n = e.r(27249);
    (Object.defineProperty(r, '__esModule', { value: !0 }), (r.default = void 0));
    var a = n(e.r(72523)),
      i = e.r(37479);
    r.default = (0, a.default)(
      (0, i.jsx)('path', {
        d: 'M7.58 4.08 6.15 2.65C3.75 4.48 2.17 7.3 2.03 10.5h2c.15-2.65 1.51-4.97 3.55-6.42m12.39 6.42h2c-.15-3.2-1.73-6.02-4.12-7.85l-1.42 1.43c2.02 1.45 3.39 3.77 3.54 6.42M18 11c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-6 11c.14 0 .27-.01.4-.04.65-.14 1.18-.58 1.44-1.18.1-.24.15-.5.15-.78h-4c.01 1.1.9 2 2.01 2',
      }),
      'NotificationsActive',
    );
  },
  81025,
  (e, t, r) => {
    'use strict';
    var n = e.r(27249);
    (Object.defineProperty(r, '__esModule', { value: !0 }), (r.default = void 0));
    var a = n(e.r(72523)),
      i = e.r(37479);
    r.default = (0, a.default)(
      (0, i.jsx)('path', {
        d: 'M19 14V6c0-1.1-.9-2-2-2H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2m-9-1c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3m13-6v11c0 1.1-.9 2-2 2H4v-2h17V7z',
      }),
      'Payments',
    );
  },
  4424,
  (e) => {
    'use strict';
    var t = e.i(37479),
      r = e.i(61129),
      n = e.i(60552),
      a = e.i(24644),
      i = e.i(20839),
      s = e.i(16842),
      o = e.i(83689),
      u = e.i(69783),
      l = e.i(59997),
      c = e.i(33558),
      d = e.i(92329),
      f = e.i(20412),
      p = e.i(29744),
      h = e.i(25592);
    e.i(64775);
    var m = e.i(24096),
      v = e.i(40893),
      v = v,
      g = e.i(44657);
    let y = r.useSyncExternalStore;
    var _ = e.i(75530),
      b = e.i(19279),
      x = e.i(5010),
      w = e.i(83523),
      k = e.i(73589),
      O = e.i(74289),
      S = e.i(83319),
      j = e.i(92926),
      A = e.i(3417),
      P = e.i(91228),
      E = e.i(88835),
      C = e.i(83792),
      R = e.i(5857),
      T = e.i(85151),
      I = e.i(28477),
      M = e.i(75596),
      N = e.i(81025),
      Z = e.i(51215);
    e.i(74507);
    var $ = e.i(32576),
      L = e.i(21203);
    e.s(
      [
        'default',
        0,
        function ({ children: e }) {
          !(function (e, t = {}) {
            let n = (0, g.default)(),
              a = 'u' > typeof window && void 0 !== window.matchMedia,
              {
                defaultMatches: i = !1,
                matchMedia: s = a ? window.matchMedia : null,
                ssrMatchMedia: o = null,
                noSsr: u = !1,
              } = (0, v.default)({ name: 'MuiUseMediaQuery', props: t, theme: n }),
              l = 'function' == typeof e ? e(n) : e;
            (void 0 !== y
              ? function (e, t, n, a, i) {
                  let s = r.useCallback(() => t, [t]),
                    o = r.useMemo(() => {
                      if (i && n) return () => n(e).matches;
                      if (null !== a) {
                        let { matches: t } = a(e);
                        return () => t;
                      }
                      return s;
                    }, [s, e, a, i, n]),
                    [u, l] = r.useMemo(() => {
                      if (null === n) return [s, () => () => {}];
                      let t = n(e);
                      return [
                        () => t.matches,
                        (e) => (
                          t.addListener(e),
                          () => {
                            t.removeListener(e);
                          }
                        ),
                      ];
                    }, [s, n, e]);
                  return y(l, u, o);
                }
              : function (e, t, n, a, i) {
                  let [s, o] = r.useState(() => (i && n ? n(e).matches : a ? a(e).matches : t));
                  return (
                    (0, m.default)(() => {
                      let t = !0;
                      if (!n) return;
                      let r = n(e),
                        a = () => {
                          t && o(r.matches);
                        };
                      return (
                        a(),
                        r.addListener(a),
                        () => {
                          ((t = !1), r.removeListener(a));
                        }
                      );
                    }, [e, n]),
                    s
                  );
                })((l = l.replace(/^@media( ?)/m, '')), i, s, o, u);
          })((0, _.useTheme)().breakpoints.down('sm'));
          let { t: D } = (0, $.useTranslation)(),
            [B, z] = r.default.useState(!1),
            V = (0, Z.useRouter)(),
            F = (0, Z.usePathname)(),
            { mutate: U } = (0, n.useLogout)(),
            { data: K } = (0, n.useGetIdentity)(),
            [q, W] = r.default.useState(!0);
          if (
            (r.default.useEffect(() => {
              if ('/login' === F) return void W(!1);
              let e = !1;
              return (
                (async function () {
                  let { data: t } = await L.supabaseClient.auth.getSession(),
                    r = t.session;
                  if (!e) {
                    if (!r) return V.replace('/login');
                    if (r.user?.app_metadata?.role !== 'admin') {
                      (await L.supabaseClient.auth.signOut(), e || V.replace('/login'));
                      return;
                    }
                    W(!1);
                  }
                })(),
                () => {
                  e = !0;
                }
              );
            }, [F, V]),
            '/login' === F)
          )
            return (0, t.jsx)(t.Fragment, { children: e });
          let H = [
              { label: D('dashboard.title'), icon: (0, t.jsx)(b.default, {}), path: '/' },
              {
                label: D('profiles.titles.list'),
                icon: (0, t.jsx)(x.default, {}),
                path: '/profiles',
              },
              {
                label: D('drivers.titles.list'),
                icon: (0, t.jsx)(A.default, {}),
                path: '/drivers',
              },
              {
                label: D('institutions.titles.list'),
                icon: (0, t.jsx)(C.default, {}),
                path: '/institutions',
              },
              { label: D('routes.titles.list'), icon: (0, t.jsx)(w.default, {}), path: '/routes' },
              { label: D('trips.titles.list'), icon: (0, t.jsx)(k.default, {}), path: '/trips' },
              {
                label: D('subscriptions.titles.list'),
                icon: (0, t.jsx)(O.default, {}),
                path: '/subscriptions',
              },
              {
                label: D('license_batches.titles.list'),
                icon: (0, t.jsx)(E.default, {}),
                path: '/license_batches',
              },
              {
                label: D('licenses.titles.list'),
                icon: (0, t.jsx)(P.default, {}),
                path: '/licenses',
              },
              {
                label: D('payouts.titles.list'),
                icon: (0, t.jsx)(N.default, {}),
                path: '/payouts',
              },
              { label: D('analytics.title'), icon: (0, t.jsx)(R.default, {}), path: '/analytics' },
              {
                label: D('feature_flags.titles.list'),
                icon: (0, t.jsx)(T.default, {}),
                path: '/feature-flags',
              },
              {
                label: D('audit_logs.titles.list'),
                icon: (0, t.jsx)(I.default, {}),
                path: '/audit_logs',
              },
              {
                label: D('notifications.titles.broadcast'),
                icon: (0, t.jsx)(M.default, {}),
                path: '/notifications',
              },
            ],
            G = (0, t.jsxs)(a.Box, {
              sx: { height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#0f172a' },
              children: [
                (0, t.jsxs)(a.Box, {
                  sx: {
                    p: 2.5,
                    textAlign: 'center',
                    borderBottom: '1px solid rgba(255,255,255,0.08)',
                  },
                  children: [
                    (0, t.jsx)(f.Typography, {
                      variant: 'h6',
                      fontWeight: 'bold',
                      color: '#fff',
                      letterSpacing: 1,
                      children: 'UniRide Admin',
                    }),
                    (0, t.jsx)(f.Typography, {
                      variant: 'caption',
                      color: 'rgba(255,255,255,0.5)',
                      sx: { mt: 0.5, display: 'block' },
                      children: D('dashboard.subtitle'),
                    }),
                  ],
                }),
                (0, t.jsx)(s.List, {
                  sx: { flex: 1, pt: 1 },
                  children: H.map((e) =>
                    (0, t.jsxs)(
                      o.ListItemButton,
                      {
                        selected: F === e.path || ('/' !== e.path && F.startsWith(e.path)),
                        onClick: () => {
                          (V.push(e.path), z(!1));
                        },
                        sx: {
                          mx: 1.5,
                          borderRadius: 1.5,
                          mb: 0.3,
                          py: 1,
                          color: 'rgba(255,255,255,0.7)',
                          '&:hover': { bgcolor: 'rgba(255,255,255,0.08)', color: '#fff' },
                          '&.Mui-selected': {
                            bgcolor: 'primary.main',
                            color: '#fff',
                            '&:hover': { bgcolor: 'primary.dark' },
                            '& .MuiListItemIcon-root': { color: '#fff' },
                          },
                        },
                        children: [
                          (0, t.jsx)(u.ListItemIcon, {
                            sx: { minWidth: 40, color: 'inherit' },
                            children: e.icon,
                          }),
                          (0, t.jsx)(l.ListItemText, {
                            primary: e.label,
                            primaryTypographyProps: { fontSize: 14, fontWeight: 500 },
                          }),
                        ],
                      },
                      e.path,
                    ),
                  ),
                }),
                (0, t.jsx)(a.Box, {
                  sx: { p: 2, borderTop: '1px solid rgba(255,255,255,0.08)' },
                  children: (0, t.jsxs)(o.ListItemButton, {
                    onClick: () => U(),
                    sx: {
                      mx: 1,
                      borderRadius: 1.5,
                      color: 'rgba(255,255,255,0.6)',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.08)', color: '#ef5350' },
                    },
                    children: [
                      (0, t.jsx)(u.ListItemIcon, {
                        sx: { minWidth: 40, color: 'inherit' },
                        children: (0, t.jsx)(S.default, {}),
                      }),
                      (0, t.jsx)(l.ListItemText, {
                        primary: D('buttons.logout'),
                        primaryTypographyProps: { fontSize: 14 },
                      }),
                    ],
                  }),
                }),
              ],
            });
          return q
            ? (0, t.jsx)(a.Box, {
                sx: {
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  minHeight: '100vh',
                },
                children: (0, t.jsx)(f.Typography, {
                  color: 'text.secondary',
                  children: D('loading'),
                }),
              })
            : (0, t.jsxs)(a.Box, {
                sx: { display: 'flex', minHeight: '100vh' },
                children: [
                  (0, t.jsx)(c.AppBar, {
                    position: 'fixed',
                    elevation: 0,
                    sx: {
                      width: { sm: 'calc(100% - 260px)' },
                      marginInlineStart: { sm: '260px' },
                      bgcolor: '#fff',
                      borderBottom: '1px solid #eee',
                    },
                    children: (0, t.jsxs)(d.Toolbar, {
                      children: [
                        (0, t.jsx)(p.IconButton, {
                          color: 'inherit',
                          edge: 'start',
                          onClick: () => z(!B),
                          sx: {
                            marginInlineEnd: 2,
                            display: { sm: 'none' },
                            color: 'text.primary',
                          },
                          children: (0, t.jsx)(j.default, {}),
                        }),
                        (0, t.jsx)(f.Typography, {
                          variant: 'h6',
                          noWrap: !0,
                          sx: { flexGrow: 1, color: 'text.primary' },
                          children: H.find((e) => e.path === F)?.label || D('dashboard.title'),
                        }),
                        K &&
                          (0, t.jsx)(a.Box, {
                            sx: { display: 'flex', alignItems: 'center', gap: 1 },
                            children: (0, t.jsx)(h.Avatar, {
                              sx: { width: 32, height: 32, bgcolor: 'primary.main', fontSize: 14 },
                              children: K.name?.[0]?.toUpperCase() ?? 'A',
                            }),
                          }),
                      ],
                    }),
                  }),
                  (0, t.jsxs)(a.Box, {
                    component: 'nav',
                    sx: { width: { sm: 260 }, flexShrink: 0 },
                    children: [
                      (0, t.jsx)(i.Drawer, {
                        variant: 'temporary',
                        open: B,
                        onClose: () => z(!1),
                        ModalProps: { keepMounted: !0 },
                        sx: {
                          display: { xs: 'block', sm: 'none' },
                          '& .MuiDrawer-paper': { width: 260 },
                        },
                        children: G,
                      }),
                      (0, t.jsx)(i.Drawer, {
                        variant: 'permanent',
                        sx: {
                          display: { xs: 'none', sm: 'block' },
                          '& .MuiDrawer-paper': { width: 260 },
                        },
                        open: !0,
                        children: G,
                      }),
                    ],
                  }),
                  (0, t.jsx)(a.Box, {
                    component: 'main',
                    sx: { flexGrow: 1, p: 3, mt: 8, bgcolor: '#fafafa' },
                    children: e,
                  }),
                ],
              });
        },
      ],
      4424,
    );
  },
  92453,
  (e, t, r) => {
    var n;
    function a(e, t) {
      var r = [],
        n = 0;
      function a(e) {
        return (r.push(e), t);
      }
      function i() {
        return r[n++];
      }
      return {
        tokenize: function (t) {
          return t.replace(e, a);
        },
        detokenize: function (e) {
          return e.replace(RegExp('(' + t + ')', 'g'), i);
        },
      };
    }
    ((n = new (function () {
      var e = '`TMP`',
        t = '`COMMENT`',
        r = '[^\\u0020-\\u007e]',
        n = '(?:[0-9]*\\.[0-9]+|[0-9]+)',
        i = '(?:em|ex|px|cm|mm|in|pt|pc|deg|rad|grad|ms|s|hz|khz|%)',
        s = 'direction\\s*:\\s*',
        o = '[\'"]?\\s*',
        u = '(^|[^a-zA-Z])',
        l = '\\/\\*\\!?\\s*@noflip\\s*\\*\\/',
        c = '(?:(?:(?:\\\\[0-9a-f]{1,6})(?:\\r\\n|\\s)?)|\\\\[^\\r\\n\\f0-9a-f])',
        d = '(?:[_a-z0-9-]|' + r + '|' + c + ')',
        f = n + '(?:\\s*' + i + '|' + ('-?' + ('(?:[_a-z]|' + r + '|') + c + ')' + d) + '*)?',
        p = '((?:-?' + f + ')|(?:inherit|auto))',
        h =
          '((?:-?' +
          f +
          ')|(?:inherit|auto)|' +
          ('(?:calc\\((?:' + ('(?:(?:\\(|\\)|\\t| )|' + ('(?:-?' + n + '(?:\\s*') + i)) +
          ')?)|(?:\\+|\\-|\\*|\\/)){3,})\\)))',
        m = '(#?' + d + '+|(?:rgba?|hsla?)\\([ \\d.,%-]+\\))',
        v = '(?:[!#$%&*-~]|' + r + '|' + c + ')*?',
        g = '(?![a-zA-Z])',
        y =
          '(?!(' +
          d +
          '|\\r?\\n|\\s|#|\\:|\\.|\\,|\\+|>|~|\\(|\\)|\\[|\\]|=|\\*=|~=|\\^=|\'[^\']*\'|"[^"]*"|' +
          t +
          ')*?{)',
        _ = '(?!' + v + o + '\\))',
        b = '(?=' + v + o + '\\))',
        x = '(\\s*(?:!important\\s*)?[;}])',
        w = /`TMP`/g,
        k = /`TMPLTR`/g,
        O = /`TMPRTL`/g,
        S = RegExp('\\/\\*[^*]*\\*+([^\\/*][^*]*\\*+)*\\/', 'gi'),
        j = RegExp('(' + l + y + '[^;}]+;?)', 'gi'),
        A = RegExp('(' + l + '[^\\}]*?})', 'gi'),
        P = RegExp('(' + s + ')ltr', 'gi'),
        E = RegExp('(' + s + ')rtl', 'gi'),
        C = RegExp(u + '(left)' + g + _ + y, 'gi'),
        R = RegExp(u + '(right)' + g + _ + y, 'gi'),
        T = RegExp(u + '(left)' + b, 'gi'),
        I = RegExp(u + '(right)' + b, 'gi'),
        M = /(:dir\( *)ltr( *\))/g,
        N = /(:dir\( *)rtl( *\))/g,
        Z = RegExp(u + '(ltr)' + b, 'gi'),
        $ = RegExp(u + '(rtl)' + b, 'gi'),
        L = RegExp(u + '([ns]?)e-resize', 'gi'),
        D = RegExp(u + '([ns]?)w-resize', 'gi'),
        B = RegExp(
          '((?:margin|padding|border-width)\\s*:\\s*)' +
            h +
            '(\\s+)' +
            h +
            '(\\s+)' +
            h +
            '(\\s+)' +
            h +
            x,
          'gi',
        ),
        z = RegExp(
          '((?:-color|border-style)\\s*:\\s*)' + m + '(\\s+)' + m + '(\\s+)' + m + '(\\s+)' + m + x,
          'gi',
        ),
        V = RegExp('(background(?:-position)?\\s*:\\s*(?:[^:;}\\s]+\\s+)*?)(' + f + ')', 'gi'),
        F = RegExp('(background-position-x\\s*:\\s*)(-?' + n + '%)', 'gi'),
        U = RegExp(
          '(border-radius\\s*:\\s*)' +
            p +
            '(?:(?:\\s+' +
            p +
            ')(?:\\s+' +
            p +
            ')?(?:\\s+' +
            p +
            ')?)?(?:(?:(?:\\s*\\/\\s*)' +
            p +
            ')(?:\\s+' +
            p +
            ')?(?:\\s+' +
            p +
            ')?(?:\\s+' +
            p +
            ')?)?' +
            x,
          'gi',
        ),
        K = RegExp('(box-shadow\\s*:\\s*(?:inset\\s*)?)' + p, 'gi'),
        q = RegExp('(text-shadow\\s*:\\s*)' + p + '(\\s*)' + m, 'gi'),
        W = RegExp('(text-shadow\\s*:\\s*)' + m + '(\\s*)' + p, 'gi'),
        H = RegExp('(text-shadow\\s*:\\s*)' + p, 'gi'),
        G = RegExp('(transform\\s*:[^;}]*)(translateX\\s*\\(\\s*)' + p + '(\\s*\\))', 'gi'),
        Q = RegExp(
          '(transform\\s*:[^;}]*)(translate\\s*\\(\\s*)' +
            p +
            '((?:\\s*,\\s*' +
            p +
            '){0,2}\\s*\\))',
          'gi',
        );
      function Y(e, t, r) {
        var n, a;
        return (
          '%' === r.slice(-1) &&
            (-1 !== (n = r.indexOf('.'))
              ? ((a = r.length - n - 2), (r = (r = 100 - parseFloat(r)).toFixed(a) + '%'))
              : (r = 100 - parseFloat(r) + '%')),
          t + r
        );
      }
      function J(e) {
        switch (e.length) {
          case 4:
            e = [e[1], e[0], e[3], e[2]];
            break;
          case 3:
            e = [e[1], e[0], e[1], e[2]];
            break;
          case 2:
            e = [e[1], e[0]];
            break;
          case 1:
            e = [e[0]];
        }
        return e.join(' ');
      }
      function X(e, t) {
        var r = [].slice.call(arguments),
          n = r.slice(2, 6).filter(function (e) {
            return e;
          }),
          a = r.slice(6, 10).filter(function (e) {
            return e;
          }),
          i = r[10] || '';
        return t + (a.length ? J(n) + ' / ' + J(a) : J(n)) + i;
      }
      function ee(e) {
        return 0 === parseFloat(e) ? e : '-' === e[0] ? e.slice(1) : '-' + e;
      }
      function et(e, t, r) {
        return t + ee(r);
      }
      function er(e, t, r, n, a) {
        return t + r + ee(n) + a;
      }
      function en(e, t, r, n, a) {
        return t + r + n + ee(a);
      }
      return {
        transform: function (r, n) {
          var i = new a(j, '`NOFLIP_SINGLE`'),
            s = new a(A, '`NOFLIP_CLASS`'),
            o = new a(S, t);
          return (
            (r = o.tokenize(s.tokenize(i.tokenize(r.replace('`', '%60'))))),
            n.transformDirInUrl &&
              (r = r
                .replace(M, '$1`TMPLTR`$2')
                .replace(N, '$1`TMPRTL`$2')
                .replace(Z, '$1' + e)
                .replace($, '$1ltr')
                .replace(w, 'rtl')
                .replace(k, 'ltr')
                .replace(O, 'rtl')),
            n.transformEdgeInUrl &&
              (r = r
                .replace(T, '$1' + e)
                .replace(I, '$1left')
                .replace(w, 'right')),
            (r = r
              .replace(P, '$1' + e)
              .replace(E, '$1ltr')
              .replace(w, 'rtl')
              .replace(C, '$1' + e)
              .replace(R, '$1left')
              .replace(w, 'right')
              .replace(L, '$1$2' + e)
              .replace(D, '$1$2e-resize')
              .replace(w, 'w-resize')
              .replace(U, X)
              .replace(K, et)
              .replace(q, en)
              .replace(W, en)
              .replace(H, et)
              .replace(G, er)
              .replace(Q, er)
              .replace(B, '$1$2$3$8$5$6$7$4$9')
              .replace(z, '$1$2$3$8$5$6$7$4$9')
              .replace(V, Y)
              .replace(F, Y)),
            (r = i.detokenize(s.detokenize(o.detokenize(r))))
          );
        },
      };
    })()),
      t.exports
        ? (r.transform = function (e, t, r) {
            var a;
            return (
              'object' == typeof t
                ? (a = t)
                : ((a = {}),
                  'boolean' == typeof t && (a.transformDirInUrl = t),
                  'boolean' == typeof r && (a.transformEdgeInUrl = r)),
              n.transform(e, a)
            );
          })
        : 'u' > typeof window && (window.cssjanus = n));
  },
  6900,
  (e) => {
    'use strict';
    var t = e.i(37479),
      r = e.i(61129),
      n = e.i(36441),
      a = e.i(51215),
      i = e.i(18935);
    e.i(64775);
    var s = e.i(98457),
      o = e.i(84570);
    let u = r.createContext(null);
    function l() {
      return r.useContext(u);
    }
    let c =
        'function' == typeof Symbol && Symbol.for ? Symbol.for('mui.nested') : '__THEME_NESTED__',
      d = function (e) {
        let { children: n, theme: a } = e,
          i = l(),
          o = r.useMemo(() => {
            var e, t;
            let r =
              null === i
                ? a
                : ((e = i), 'function' == typeof (t = a) ? t(e) : (0, s.default)({}, e, t));
            return (null != r && (r[c] = null !== i), r);
          }, [a, i]);
        return (0, t.jsx)(u.Provider, { value: o, children: n });
      };
    var f = e.i(12504),
      p = e.i(44657),
      h = e.i(80840),
      m = e.i(32282),
      v = e.i(24096),
      g = e.i(72203),
      y = e.i(81216);
    let _ = {};
    function b(e, t, n, a = !1) {
      return r.useMemo(() => {
        let r = (e && t[e]) || t;
        if ('function' == typeof n) {
          let i = n(r),
            o = e ? (0, s.default)({}, t, { [e]: i }) : i;
          return a ? () => o : o;
        }
        return e ? (0, s.default)({}, t, { [e]: n }) : (0, s.default)({}, t, n);
      }, [e, t, n, a]);
    }
    let x = function (e) {
      let { children: r, theme: n, themeId: a } = e,
        i = (0, p.default)(_),
        s = l() || _,
        o = b(a, i, n),
        u = b(a, s, n, !0),
        c = 'rtl' === o.direction,
        x = (function (e) {
          let r = (0, p.default)(),
            n = (0, g.default)() || '',
            { modularCssLayers: a } = e,
            i = 'mui.global, mui.components, mui.theme, mui.custom, mui.sx';
          return ((i =
            a && null === r
              ? 'string' == typeof a
                ? a.replace(/mui(?!\.)/g, i)
                : `@layer ${i};`
              : ''),
          (0, v.default)(() => {
            var e, t;
            let r = document.querySelector('head');
            if (!r) return;
            let a = r.firstChild;
            if (i) {
              if (
                a &&
                null != (e = a.hasAttribute) &&
                e.call(a, 'data-mui-layer-order') &&
                a.getAttribute('data-mui-layer-order') === n
              )
                return;
              let t = document.createElement('style');
              (t.setAttribute('data-mui-layer-order', n), (t.textContent = i), r.prepend(t));
            } else
              null == (t = r.querySelector(`style[data-mui-layer-order="${n}"]`)) || t.remove();
          }, [i, n]),
          i)
            ? (0, t.jsx)(y.default, { styles: i })
            : null;
        })(o);
      return (0, t.jsx)(d, {
        theme: u,
        children: (0, t.jsx)(f.ThemeContext.Provider, {
          value: o,
          children: (0, t.jsx)(h.default, {
            value: c,
            children: (0, t.jsxs)(m.default, {
              value: null == o ? void 0 : o.components,
              children: [x, r],
            }),
          }),
        }),
      });
    };
    var w = e.i(37793);
    let k = ['theme'];
    function O(e) {
      let { theme: r } = e,
        n = (0, o.default)(e, k),
        a = r[w.default],
        i = a || r;
      return (
        'function' != typeof r &&
          (a && !a.vars
            ? (i = (0, s.default)({}, a, { vars: null }))
            : r && !r.vars && (i = (0, s.default)({}, r, { vars: null }))),
        (0, t.jsx)(x, (0, s.default)({}, n, { themeId: a ? w.default : void 0, theme: i }))
      );
    }
    var S = e.i(70350),
      j = e.i(10372),
      A = e.i(23847);
    let P = function (e) {
      let { children: n, enableColorScheme: a = !1 } = (0, j.useDefaultProps)({
        props: e,
        name: 'MuiCssBaseline',
      });
      return (0, t.jsxs)(r.Fragment, {
        children: [
          (0, t.jsx)(A.default, {
            styles: (e) =>
              ((e, t = !1) => {
                var r;
                let n = {};
                t &&
                  e.colorSchemes &&
                  Object.entries(e.colorSchemes).forEach(([t, r]) => {
                    var a;
                    n[e.getColorSchemeSelector(t).replace(/\s*&/, '')] = {
                      colorScheme: null == (a = r.palette) ? void 0 : a.mode,
                    };
                  });
                let a = (0, s.default)(
                    {
                      html: (0, s.default)(
                        {
                          WebkitFontSmoothing: 'antialiased',
                          MozOsxFontSmoothing: 'grayscale',
                          boxSizing: 'border-box',
                          WebkitTextSizeAdjust: '100%',
                        },
                        t && !e.vars && { colorScheme: e.palette.mode },
                      ),
                      '*, *::before, *::after': { boxSizing: 'inherit' },
                      'strong, b': { fontWeight: e.typography.fontWeightBold },
                      body: (0, s.default)(
                        { margin: 0 },
                        (0, s.default)(
                          { color: (e.vars || e).palette.text.primary },
                          e.typography.body1,
                          {
                            backgroundColor: (e.vars || e).palette.background.default,
                            '@media print': { backgroundColor: (e.vars || e).palette.common.white },
                          },
                        ),
                        {
                          '&::backdrop': {
                            backgroundColor: (e.vars || e).palette.background.default,
                          },
                        },
                      ),
                    },
                    n,
                  ),
                  i =
                    null == (r = e.components) || null == (r = r.MuiCssBaseline)
                      ? void 0
                      : r.styleOverrides;
                return (i && (a = [a, i]), a);
              })(e, a),
          }),
          n,
        ],
      });
    };
    var E = e.i(92453),
      C = '-ms-',
      R = '-moz-',
      T = '-webkit-',
      I = 'comm',
      M = 'rule',
      N = 'decl',
      Z = '@keyframes',
      $ = Math.abs,
      L = String.fromCharCode,
      D = Object.assign;
    function B(e, t) {
      return (e = t.exec(e)) ? e[0] : e;
    }
    function z(e, t, r) {
      return e.replace(t, r);
    }
    function V(e, t) {
      return e.indexOf(t);
    }
    function F(e, t) {
      return 0 | e.charCodeAt(t);
    }
    function U(e, t, r) {
      return e.slice(t, r);
    }
    function K(e) {
      return e.length;
    }
    function q(e, t) {
      return (t.push(e), e);
    }
    function W(e, t) {
      return e.filter(function (e) {
        return !B(e, t);
      });
    }
    var H = 1,
      G = 1,
      Q = 0,
      Y = 0,
      J = 0,
      X = '';
    function ee(e, t, r, n, a, i, s, o) {
      return {
        value: e,
        root: t,
        parent: r,
        type: n,
        props: a,
        children: i,
        line: H,
        column: G,
        length: s,
        return: '',
        siblings: o,
      };
    }
    function et(e, t) {
      return D(ee('', null, null, '', null, null, 0, e.siblings), e, { length: -e.length }, t);
    }
    function er(e) {
      for (; e.root; ) e = et(e.root, { children: [e] });
      q(e, e.siblings);
    }
    function en() {
      return ((J = Y < Q ? F(X, Y++) : 0), G++, 10 === J && ((G = 1), H++), J);
    }
    function ea() {
      return F(X, Y);
    }
    function ei(e) {
      switch (e) {
        case 0:
        case 9:
        case 10:
        case 13:
        case 32:
          return 5;
        case 33:
        case 43:
        case 44:
        case 47:
        case 62:
        case 64:
        case 126:
        case 59:
        case 123:
        case 125:
          return 4;
        case 58:
          return 3;
        case 34:
        case 39:
        case 40:
        case 91:
          return 2;
        case 41:
        case 93:
          return 1;
      }
      return 0;
    }
    function es(e) {
      var t, r;
      return ((t = Y - 1),
      (r = (function e(t) {
        for (; en(); )
          switch (J) {
            case t:
              return Y;
            case 34:
            case 39:
              34 !== t && 39 !== t && e(J);
              break;
            case 40:
              41 === t && e(t);
              break;
            case 92:
              en();
          }
        return Y;
      })(91 === e ? e + 2 : 40 === e ? e + 1 : e)),
      U(X, t, r)).trim();
    }
    function eo(e, t, r, n, a, i, s, o, u, l, c, d) {
      for (var f = a - 1, p = 0 === a ? i : [''], h = p.length, m = 0, v = 0, g = 0; m < n; ++m)
        for (var y = 0, _ = U(e, f + 1, (f = $((v = s[m])))), b = e; y < h; ++y)
          (b = (v > 0 ? p[y] + ' ' + _ : z(_, /&\f/g, p[y])).trim()) && (u[g++] = b);
      return ee(e, t, r, 0 === a ? M : o, u, l, c, d);
    }
    function eu(e, t, r, n, a) {
      return ee(e, t, r, N, U(e, 0, n), U(e, n + 1, -1), n, a);
    }
    function el(e, t) {
      for (var r = '', n = 0; n < e.length; n++) r += t(e[n], n, e, t) || '';
      return r;
    }
    function ec(e, t, r, n) {
      if (
        e.type === Z ||
        '@supports' === e.type ||
        (e.type === M && (!e.parent || '@media' === e.parent.type || e.parent.type === M))
      ) {
        var a,
          i,
          s,
          o = E.default.transform(
            (function e(t, r, n) {
              switch (t.type) {
                case '@import':
                case N:
                case I:
                  return (t.return = t.return || t.value);
                case M:
                  ((t.value = Array.isArray(t.props) ? t.props.join(',') : t.props),
                    Array.isArray(t.children) &&
                      t.children.forEach(function (e) {
                        e.type === I && (e.children = e.value);
                      }));
              }
              var a = el(Array.prototype.concat(t.children), e);
              return K(a) ? (t.return = t.value + '{' + a + '}') : '';
            })(e, 0, 0),
          );
        ((e.children = o
          ? ((s = (function e(t, r, n, a, i, s, o, u, l) {
              for (
                var c,
                  d,
                  f,
                  p,
                  h = 0,
                  m = 0,
                  v = o,
                  g = 0,
                  y = 0,
                  _ = 0,
                  b = 1,
                  x = 1,
                  w = 1,
                  k = 0,
                  O = 0,
                  S = '',
                  j = i,
                  A = s,
                  P = a,
                  E = S;
                x;
              )
                switch (((_ = O), (O = en()))) {
                  case 40:
                    108 != _ && 58 == F(E, v - 1) ? (k++, (E += '(')) : (E += es(O));
                    break;
                  case 41:
                    (k--, (E += ')'));
                    break;
                  case 34:
                  case 39:
                  case 91:
                    E += es(O);
                    break;
                  case 9:
                  case 10:
                  case 13:
                  case 32:
                    if (k > 0) {
                      E += L(O);
                      break;
                    }
                    E += (function (e) {
                      for (; (J = ea()); )
                        if (J < 33) en();
                        else break;
                      return ei(e) > 2 || ei(J) > 3 ? '' : ' ';
                    })(_);
                    break;
                  case 92:
                    E += (function (e, t) {
                      for (
                        var r;
                        --t &&
                        en() &&
                        !(J < 48) &&
                        !(J > 102) &&
                        (!(J > 57) || !(J < 65)) &&
                        (!(J > 70) || !(J < 97));
                      );
                      return ((r = Y + (t < 6 && 32 == ea() && 32 == en())), U(X, e, r));
                    })(Y - 1, 7);
                    continue;
                  case 47:
                    switch (ea()) {
                      case 42:
                      case 47:
                        (q(
                          ((c = (function (e, t) {
                            for (; en(); )
                              if (e + J === 57) break;
                              else if (e + J === 84 && 47 === ea()) break;
                            return '/*' + U(X, t, Y - 1) + '*' + L(47 === e ? e : en());
                          })(en(), Y)),
                          (d = r),
                          (f = n),
                          (p = l),
                          ee(c, d, f, I, L(J), U(c, 2, -2), 0, p)),
                          l,
                        ),
                          (5 == ei(_ || 1) || 5 == ei(ea() || 1)) &&
                            K(E) &&
                            ' ' !== U(E, -1, void 0) &&
                            (E += ' '));
                        break;
                      default:
                        E += '/';
                    }
                    break;
                  case 123 * b:
                    u[h++] = K(E) * w;
                  case 125 * b:
                  case 59:
                  case 0:
                    if (k > 0 && O) {
                      E += L(O);
                      break;
                    }
                    switch (O) {
                      case 0:
                      case 125:
                        x = 0;
                      case 59 + m:
                        (-1 == w && (E = z(E, /\f/g, '')),
                          y > 0 &&
                            (K(E) - v || 0 === b) &&
                            q(
                              y > 32
                                ? eu(E + ';', a, n, v - 1, l)
                                : eu(z(E, ' ', '') + ';', a, n, v - 2, l),
                              l,
                            ));
                        break;
                      case 59:
                        E += ';';
                      default:
                        if (
                          (q((P = eo(E, r, n, h, m, i, u, S, (j = []), (A = []), v, s)), s),
                          123 === O)
                        )
                          if (0 === m) e(E, r, P, P, j, s, v, u, A);
                          else {
                            switch (g) {
                              case 99:
                                if (110 === F(E, 3)) break;
                              case 108:
                                if (97 === F(E, 2)) break;
                              default:
                                m = 0;
                              case 100:
                              case 109:
                              case 115:
                            }
                            m
                              ? e(
                                  t,
                                  P,
                                  P,
                                  a && q(eo(t, P, P, 0, 0, i, u, S, i, (j = []), v, A), A),
                                  i,
                                  A,
                                  v,
                                  u,
                                  a ? j : A,
                                )
                              : e(E, P, P, P, [''], A, 0, u, A);
                          }
                    }
                    ((h = m = y = 0), (b = w = 1), (S = E = ''), (v = o));
                    break;
                  case 58:
                    ((v = 1 + K(E)), (y = _));
                  default:
                    if (b < 1) {
                      if (123 == O) --b;
                      else if (
                        125 == O &&
                        0 == b++ &&
                        125 == ((J = Y > 0 ? F(X, --Y) : 0), G--, 10 === J && ((G = 1), H--), J)
                      )
                        continue;
                    }
                    switch (((E += L(O)), O * b)) {
                      case 38:
                        w = m > 0 ? 1 : ((E += '\f'), -1);
                        break;
                      case 44:
                        if (k > 0) break;
                        ((u[h++] = (K(E) - 1) * w), (w = 1));
                        break;
                      case 64:
                        (45 === ea() && (E += es(en())),
                          (g = ea()),
                          (m = v =
                            K(
                              (S = E +=
                                (function (e) {
                                  for (; !ei(ea()); ) en();
                                  return U(X, e, Y);
                                })(Y)),
                            )),
                          O++);
                        break;
                      case 45:
                        45 === _ && 2 == K(E) && (b = 0);
                    }
                }
              return s;
            })(
              '',
              null,
              null,
              null,
              [''],
              ((i = a = o), (H = G = 1), (Q = K((X = i))), (Y = 0), (a = [])),
              0,
              [0],
              a,
            )),
            (X = ''),
            s)[0].children
          : []),
          (e.return = ''));
      }
    }
    function ed(e, t, r, n) {
      if (e.length > -1 && !e.return)
        switch (e.type) {
          case N:
            e.return = (function e(t, r, n) {
              var a;
              switch (
                ((a = r),
                45 ^ F(t, 0)
                  ? (((((((a << 2) ^ F(t, 0)) << 2) ^ F(t, 1)) << 2) ^ F(t, 2)) << 2) ^ F(t, 3)
                  : 0)
              ) {
                case 5103:
                  return T + 'print-' + t + t;
                case 5737:
                case 4201:
                case 3177:
                case 3433:
                case 1641:
                case 4457:
                case 2921:
                case 5572:
                case 6356:
                case 5844:
                case 3191:
                case 6645:
                case 3005:
                case 4215:
                case 6389:
                case 5109:
                case 5365:
                case 5621:
                case 3829:
                case 6391:
                case 5879:
                case 5623:
                case 6135:
                case 4599:
                  return T + t + t;
                case 4855:
                  return (
                    T +
                    t
                      .replace('add', 'source-over')
                      .replace('substract', 'source-out')
                      .replace('intersect', 'source-in')
                      .replace('exclude', 'xor') +
                    t
                  );
                case 4789:
                  return R + t + t;
                case 5349:
                case 4246:
                case 4810:
                case 6968:
                case 2756:
                  return T + t + R + t + C + t + t;
                case 5936:
                  switch (F(t, r + 11)) {
                    case 114:
                      return T + t + C + z(t, /[svh]\w+-[tblr]{2}/, 'tb') + t;
                    case 108:
                      return T + t + C + z(t, /[svh]\w+-[tblr]{2}/, 'tb-rl') + t;
                    case 45:
                      return T + t + C + z(t, /[svh]\w+-[tblr]{2}/, 'lr') + t;
                  }
                case 6828:
                case 4268:
                case 2903:
                  return T + t + C + t + t;
                case 6165:
                  return T + t + C + 'flex-' + t + t;
                case 5187:
                  return T + t + z(t, /(\w+).+(:[^]+)/, T + 'box-$1$2' + C + 'flex-$1$2') + t;
                case 5443:
                  return (
                    T +
                    t +
                    C +
                    'flex-item-' +
                    z(t, /flex-|-self/g, '') +
                    (B(t, /flex-|baseline/) ? '' : C + 'grid-row-' + z(t, /flex-|-self/g, '')) +
                    t
                  );
                case 4675:
                  return T + t + C + 'flex-line-pack' + z(t, /align-content|flex-|-self/g, '') + t;
                case 5548:
                  return T + t + C + z(t, 'shrink', 'negative') + t;
                case 5292:
                  return T + t + C + z(t, 'basis', 'preferred-size') + t;
                case 6060:
                  return T + 'box-' + z(t, '-grow', '') + T + t + C + z(t, 'grow', 'positive') + t;
                case 4554:
                  return T + z(t, /([^-])(transform)/g, '$1' + T + '$2') + t;
                case 6187:
                  return z(z(z(t, /(zoom-|grab)/, T + '$1'), /(image-set)/, T + '$1'), t, '') + t;
                case 5495:
                case 3959:
                  return z(t, /(image-set\([^]*)/, T + '$1$`$1');
                case 4968:
                  return (
                    z(
                      z(t, /(.+:)(flex-)?(.*)/, T + 'box-pack:$3' + C + 'flex-pack:$3'),
                      /space-between/,
                      'justify',
                    ) +
                    T +
                    t +
                    t
                  );
                case 4200:
                  if (!B(t, /flex-|baseline/)) return C + 'grid-column-align' + U(t, r) + t;
                  break;
                case 2592:
                case 3360:
                  return C + z(t, 'template-', '') + t;
                case 4384:
                case 3616:
                  if (
                    n &&
                    n.some(function (e, t) {
                      return ((r = t), B(e.props, /grid-\w+-end/));
                    })
                  )
                    return ~V(t + (n = n[r].value), 'span')
                      ? t
                      : C +
                          z(t, '-start', '') +
                          t +
                          C +
                          'grid-row-span:' +
                          (~V(n, 'span') ? B(n, /\d+/) : B(n, /\d+/) - B(t, /\d+/)) +
                          ';';
                  return C + z(t, '-start', '') + t;
                case 4896:
                case 4128:
                  return n &&
                    n.some(function (e) {
                      return B(e.props, /grid-\w+-start/);
                    })
                    ? t
                    : C + z(z(t, '-end', '-span'), 'span ', '') + t;
                case 4095:
                case 3583:
                case 4068:
                case 2532:
                  return z(t, /(.+)-inline(.+)/, T + '$1$2') + t;
                case 8116:
                case 7059:
                case 5753:
                case 5535:
                case 5445:
                case 5701:
                case 4933:
                case 4677:
                case 5533:
                case 5789:
                case 5021:
                case 4765:
                  if (K(t) - 1 - r > 6)
                    switch (F(t, r + 1)) {
                      case 109:
                        if (45 !== F(t, r + 4)) break;
                      case 102:
                        return (
                          z(
                            t,
                            /(.+:)(.+)-([^]+)/,
                            '$1' + T + '$2-$3$1' + R + (108 == F(t, r + 3) ? '$3' : '$2-$3'),
                          ) + t
                        );
                      case 115:
                        return ~V(t, 'stretch')
                          ? e(z(t, 'stretch', 'fill-available'), r, n) + t
                          : t;
                    }
                  break;
                case 5152:
                case 5920:
                  return z(
                    t,
                    /(.+?):(\d+)(\s*\/\s*(span)?\s*(\d+))?(.*)/,
                    function (e, r, n, a, i, s, o) {
                      return (
                        C + r + ':' + n + o + (a ? C + r + '-span:' + (i ? s : s - n) + o : '') + t
                      );
                    },
                  );
                case 4949:
                  if (121 === F(t, r + 6)) return z(t, ':', ':' + T) + t;
                  break;
                case 6444:
                  switch (F(t, 45 === F(t, 14) ? 18 : 11)) {
                    case 120:
                      return (
                        z(
                          t,
                          /(.+:)([^;\s!]+)(;|(\s+)?!.+)?/,
                          '$1' +
                            T +
                            (45 === F(t, 14) ? 'inline-' : '') +
                            'box$3$1' +
                            T +
                            '$2$3$1' +
                            C +
                            '$2box$3',
                        ) + t
                      );
                    case 100:
                      return z(t, ':', ':' + C) + t;
                  }
                  break;
                case 5719:
                case 2647:
                case 2135:
                case 3927:
                case 2391:
                  return z(t, 'scroll-', 'scroll-snap-') + t;
              }
              return t;
            })(e.value, e.length, r);
            return;
          case Z:
            return el([et(e, { value: z(e.value, '@', '@' + T) })], n);
          case M:
            if (e.length) {
              var a, i;
              return (
                (a = r = e.props),
                (i = function (t) {
                  switch (B(t, (n = /(::plac\w+|:read-\w+)/))) {
                    case ':read-only':
                    case ':read-write':
                      (er(et(e, { props: [z(t, /:(read-\w+)/, ':' + R + '$1')] })),
                        er(et(e, { props: [t] })),
                        D(e, { props: W(r, n) }));
                      break;
                    case '::placeholder':
                      (er(et(e, { props: [z(t, /:(plac\w+)/, ':' + T + 'input-$1')] })),
                        er(et(e, { props: [z(t, /:(plac\w+)/, ':' + R + '$1')] })),
                        er(et(e, { props: [z(t, /:(plac\w+)/, C + 'input-$1')] })),
                        er(et(e, { props: [t] })),
                        D(e, { props: W(r, n) }));
                  }
                  return '';
                }),
                a.map(i).join('')
              );
            }
        }
    }
    Object.defineProperty(ec, 'name', { value: 'stylisRTLPlugin' });
    var ef = e.i(78090);
    let ep = (0, S.createTheme)({
      ...ef.RefineThemes.Blue,
      direction: 'rtl',
      typography: { fontFamily: '"Cairo", "Inter", "Roboto", "Helvetica", "Arial", sans-serif' },
    });
    e.s(
      [
        'default',
        0,
        function ({ children: e }) {
          let [{ cache: s, flush: o }] = (0, r.useState)(() => {
            let e = (0, n.default)({ key: 'mui-style-rtl', stylisPlugins: [ed, ec] });
            e.compat = !0;
            let t = e.insert,
              r = [];
            return (
              (e.insert = (...n) => {
                let a = n[1];
                return (void 0 === e.inserted[a.name] && r.push(a.name), t(...n));
              }),
              {
                cache: e,
                flush: () => {
                  let e = r;
                  return ((r = []), e);
                },
              }
            );
          });
          return (
            (0, a.useServerInsertedHTML)(() => {
              let e = o();
              if (0 === e.length) return null;
              let r = '';
              for (let t of e) r += s.inserted[t];
              return (0, t.jsx)(
                'style',
                {
                  'data-emotion': `${s.key} ${e.join(' ')}`,
                  dangerouslySetInnerHTML: { __html: r },
                },
                s.key,
              );
            }),
            (0, t.jsx)(i.CacheProvider, {
              value: s,
              children: (0, t.jsxs)(O, { theme: ep, children: [(0, t.jsx)(P, {}), e] }),
            })
          );
        },
      ],
      6900,
    );
  },
]);
