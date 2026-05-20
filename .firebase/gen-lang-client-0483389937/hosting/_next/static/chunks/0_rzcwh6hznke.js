(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([
  'object' == typeof document ? document.currentScript : void 0,
  65031,
  (e, t, r) => {
    'use strict';
    (Object.defineProperty(r, Symbol.toStringTag, { value: 'Module' }),
      (r.isPlainObject = function (e) {
        if ('object' != typeof e || null == e) return !1;
        if (null === Object.getPrototypeOf(e)) return !0;
        if ('[object Object]' !== Object.prototype.toString.call(e)) {
          let t = e[Symbol.toStringTag];
          return (
            null != t &&
            !!Object.getOwnPropertyDescriptor(e, Symbol.toStringTag)?.writable &&
            e.toString() === `[object ${t}]`
          );
        }
        let t = e;
        for (; null !== Object.getPrototypeOf(t); ) t = Object.getPrototypeOf(t);
        return Object.getPrototypeOf(e) === t;
      }));
  },
  17318,
  (e, t, r) => {
    t.exports = e.r(65031).isPlainObject;
  },
  41544,
  (e) => {
    'use strict';
    var t,
      r,
      n,
      a,
      i,
      l = e.i(37479),
      o = e.i(61129),
      c = e.i(21203);
    e.i(74507);
    var s = e.i(32576),
      u = e.i(93502),
      p = e.i(65311),
      d = e.i(87332),
      f = e.i(20412),
      m = e.i(24644),
      y = e.i(41191),
      v = e.i(98562),
      h = e.i(23786),
      b = e.i(55584),
      g = e.i(29744),
      x = e.i(25417),
      O = e.i(3204),
      j = e.i(66544),
      P = e.i(10316),
      S = e.i(18623),
      A = e.i(77287);
    let E = (0, A.default)('star', [
      [
        'path',
        {
          d: 'M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z',
          key: 'r04s7s',
        },
      ],
    ]);
    var I = e.i(80998);
    let w = (0, A.default)('chart-no-axes-column', [
        ['path', { d: 'M5 21v-6', key: '1hz6c0' }],
        ['path', { d: 'M12 21V3', key: '1lcnhd' }],
        ['path', { d: 'M19 21V9', key: 'unv183' }],
      ]),
      T = (0, A.default)('chart-pie', [
        [
          'path',
          {
            d: 'M21 12c.552 0 1.005-.449.95-.998a10 10 0 0 0-8.953-8.951c-.55-.055-.998.398-.998.95v8a1 1 0 0 0 1 1z',
            key: 'pzmjnu',
          },
        ],
        ['path', { d: 'M21.21 15.89A10 10 0 1 1 8 2.83', key: 'k2fpak' }],
      ]);
    var k = e.i(46116),
      D = e.i(26951),
      C = e.i(2052),
      z = e.i(54947),
      N = e.i(75648),
      B = e.i(57308),
      R = e.i(98733),
      L = e.i(94592);
    function M(e) {
      var t = (0, R.useAppDispatch)();
      return (
        (0, o.useEffect)(() => {
          t((0, L.updatePolarOptions)(e));
        }, [t, e]),
        null
      );
    }
    var K = e.i(34383),
      F = e.i(75448),
      G = e.i(94191),
      V = ['layout'];
    function _() {
      return (_ = Object.assign.bind()).apply(null, arguments);
    }
    function W(e, t) {
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
    var q = (function (e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? W(Object(r), !0).forEach(function (t) {
                var n, a, i;
                ((n = e),
                  (a = t),
                  (i = r[t]),
                  (a = (function (e) {
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
                  })(a)) in n
                    ? Object.defineProperty(n, a, {
                        value: i,
                        enumerable: !0,
                        configurable: !0,
                        writable: !0,
                      })
                    : (n[a] = i));
              })
            : Object.getOwnPropertyDescriptors
              ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
              : W(Object(r)).forEach(function (t) {
                  Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t));
                });
        }
        return e;
      })(
        {
          accessibilityLayer: !0,
          stackOffset: 'none',
          barCategoryGap: '10%',
          barGap: 4,
          margin: { top: 5, right: 5, bottom: 5, left: 5 },
          reverseStackOrder: !1,
          syncMethod: 'index',
          layout: 'radial',
          responsive: !1,
          cx: '50%',
          cy: '50%',
          innerRadius: 0,
          outerRadius: '80%',
        },
        G.initialEventSettingsState,
      ),
      U = (0, o.forwardRef)(function (e, t) {
        var r,
          n = (0, F.resolveDefaultProps)(e.categoricalChartProps, q),
          { layout: a } = n,
          i = (function (e, t) {
            if (null == e) return {};
            var r,
              n,
              a = (function (e, t) {
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
              var i = Object.getOwnPropertySymbols(e);
              for (n = 0; n < i.length; n++)
                ((r = i[n]),
                  -1 === t.indexOf(r) && {}.propertyIsEnumerable.call(e, r) && (a[r] = e[r]));
            }
            return a;
          })(n, V),
          {
            chartName: l,
            defaultTooltipEventType: c,
            validateTooltipEventTypes: s,
            tooltipPayloadSearcher: u,
          } = e;
        return o.createElement(
          D.RechartsStoreProvider,
          {
            preloadedState: {
              options: {
                chartName: l,
                defaultTooltipEventType: c,
                validateTooltipEventTypes: s,
                tooltipPayloadSearcher: u,
                eventEmitter: void 0,
              },
            },
            reduxStoreName: null != (r = n.id) ? r : l,
          },
          o.createElement(C.ChartDataContextProvider, { chartData: n.data }),
          o.createElement(z.ReportMainChartProps, { layout: a, margin: n.margin }),
          o.createElement(B.ReportEventSettings, {
            throttleDelay: n.throttleDelay,
            throttledEvents: n.throttledEvents,
          }),
          o.createElement(N.ReportChartProps, {
            baseValue: void 0,
            accessibilityLayer: n.accessibilityLayer,
            barCategoryGap: n.barCategoryGap,
            maxBarSize: n.maxBarSize,
            stackOffset: n.stackOffset,
            barGap: n.barGap,
            barSize: n.barSize,
            syncId: n.syncId,
            syncMethod: n.syncMethod,
            className: n.className,
            reverseStackOrder: n.reverseStackOrder,
          }),
          o.createElement(M, {
            cx: n.cx,
            cy: n.cy,
            startAngle: n.startAngle,
            endAngle: n.endAngle,
            innerRadius: n.innerRadius,
            outerRadius: n.outerRadius,
          }),
          o.createElement(K.CategoricalChart, _({}, i, { ref: t })),
        );
      });
    function Z(e, t) {
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
    function X(e) {
      for (var t = 1; t < arguments.length; t++) {
        var r = null != arguments[t] ? arguments[t] : {};
        t % 2
          ? Z(Object(r), !0).forEach(function (t) {
              var n, a, i;
              ((n = e),
                (a = t),
                (i = r[t]),
                (a = (function (e) {
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
                })(a)) in n
                  ? Object.defineProperty(n, a, {
                      value: i,
                      enumerable: !0,
                      configurable: !0,
                      writable: !0,
                    })
                  : (n[a] = i));
            })
          : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
            : Z(Object(r)).forEach(function (t) {
                Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t));
              });
      }
      return e;
    }
    var Y = ['item'],
      H = X(X({}, q), {}, { layout: 'centric', startAngle: 0, endAngle: 360 }),
      $ = (0, o.forwardRef)((e, t) => {
        var r = (0, F.resolveDefaultProps)(e, H);
        return o.createElement(U, {
          chartName: 'PieChart',
          defaultTooltipEventType: 'item',
          validateTooltipEventTypes: Y,
          tooltipPayloadSearcher: k.arrayTooltipSearcher,
          categoricalChartProps: r,
          ref: t,
        });
      }),
      J = e.i(28539),
      Q = e.i(94083),
      ee = e.i(29576),
      et = e.i(63203),
      er = e.i(57024),
      en = e.i(41469),
      ea = e.i(58644),
      ei = e.i(77314),
      el = e.i(11085),
      eo = e.i(27765),
      ec = e.i(76108),
      es = e.i(56281),
      eu = (e) => e.graphicalItems.polarItems,
      ep = (0, ee.createSelector)([el.pickAxisType, eo.pickAxisId], ea.itemAxisPredicate),
      ed = (0, ee.createSelector)([eu, ea.selectBaseAxis, ep], ea.combineGraphicalItemsSettings),
      ef = (0, ee.createSelector)([ed], ea.combineGraphicalItemsData),
      em = (0, ee.createSelector)(
        [ef, et.selectChartDataAndAlwaysIgnoreIndexes],
        ea.combineDisplayedData,
      ),
      ey = (0, ee.createSelector)([em, ea.selectBaseAxis, ed], ea.combineAppliedValues);
    (0, ee.createSelector)([em, ea.selectBaseAxis, ed], (e, t, r) =>
      r.length > 0
        ? e
            .flatMap((e) =>
              r.flatMap((r) => {
                var n;
                return {
                  value: (0, en.getValueByDataKey)(e, null != (n = t.dataKey) ? n : r.dataKey),
                  errorDomain: [],
                };
              }),
            )
            .filter(Boolean)
        : (null == t ? void 0 : t.dataKey) != null
          ? e.map((e) => ({ value: (0, en.getValueByDataKey)(e, t.dataKey), errorDomain: [] }))
          : e.map((e) => ({ value: e, errorDomain: [] })),
    );
    var ev = () => void 0,
      eh = (0, ee.createSelector)(
        [
          em,
          ea.selectBaseAxis,
          ed,
          ea.selectAllErrorBarSettings,
          el.pickAxisType,
          et.selectChartDataSliceIgnoringIndexes,
        ],
        ea.combineDomainOfAllAppliedNumericalValuesIncludingErrorValues,
      ),
      eb = (0, ee.createSelector)(
        [
          ea.selectBaseAxis,
          ea.selectDomainDefinition,
          ea.selectDomainFromUserPreference,
          ev,
          eh,
          ev,
          ei.selectChartLayout,
          el.pickAxisType,
        ],
        ea.combineNumericalDomain,
      ),
      eg = (0, ee.createSelector)(
        [
          ea.selectBaseAxis,
          ei.selectChartLayout,
          em,
          ey,
          ec.selectStackOffsetType,
          el.pickAxisType,
          eb,
        ],
        ea.combineAxisDomain,
      ),
      ex = (0, ee.createSelector)(
        [eg, ea.selectRenderableAxisSettings, ea.selectRealScaleType],
        ea.combineNiceTicks,
      ),
      eO = (0, ee.createSelector)(
        [ea.selectBaseAxis, eg, ex, el.pickAxisType],
        ea.combineAxisDomainWithNiceTicks,
      );
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
    function eP(e) {
      for (var t = 1; t < arguments.length; t++) {
        var r = null != arguments[t] ? arguments[t] : {};
        t % 2
          ? ej(Object(r), !0).forEach(function (t) {
              var n, a, i;
              ((n = e),
                (a = t),
                (i = r[t]),
                (a = (function (e) {
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
                })(a)) in n
                  ? Object.defineProperty(n, a, {
                      value: i,
                      enumerable: !0,
                      configurable: !0,
                      writable: !0,
                    })
                  : (n[a] = i));
            })
          : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
            : ej(Object(r)).forEach(function (t) {
                Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t));
              });
      }
      return e;
    }
    (0, ee.createSelector)([ea.selectRealScaleType, eO], es.combineCheckedDomain);
    var eS = (0, ee.createSelector)([eu, (e, t) => t], (e, t) =>
        e.filter((e) => 'pie' === e.type).find((e) => e.id === t),
      ),
      eA = [],
      eE = (e, t, r) => ((null == r ? void 0 : r.length) === 0 ? eA : r),
      eI = (0, ee.createSelector)([et.selectChartDataAndAlwaysIgnoreIndexes, eS, eE], (e, t, r) => {
        var n,
          { chartData: a } = e;
        if (
          null != t &&
          (((n = (null == t ? void 0 : t.data) != null && t.data.length > 0 ? t.data : a) &&
            n.length) ||
            null == r ||
            (n = r.map((e) => eP(eP({}, t.presentationProps), e.props))),
          null != n)
        )
          return n;
      }),
      ew = (0, ee.createSelector)([eI, eS, eE], (e, t, r) => {
        if (null != e && null != t)
          return e.map((e, n) => {
            var a,
              i,
              l = (0, en.getValueByDataKey)(e, t.nameKey, t.name);
            return (
              (i =
                null != r && null != (a = r[n]) && null != (a = a.props) && a.fill
                  ? r[n].props.fill
                  : 'object' == typeof e && null != e && 'fill' in e
                    ? e.fill
                    : t.fill),
              {
                value: (0, en.getTooltipNameProp)(l, t.dataKey),
                color: i,
                payload: e,
                type: t.legendType,
              }
            );
          });
      }),
      eT = (0, ee.createSelector)([eI, eS, eE, er.selectChartOffsetInternal], (e, t, r, n) => {
        if (null != t && null != e)
          return (function (e) {
            var t,
              r,
              n,
              { pieSettings: a, displayedData: i, cells: l, offset: o } = e,
              {
                cornerRadius: c,
                startAngle: s,
                endAngle: u,
                dataKey: p,
                nameKey: d,
                tooltipType: f,
              } = a,
              m = Math.abs(a.minAngle),
              y = (0, eR.mathSign)(u - s) * Math.min(Math.abs(u - s), 360),
              v = Math.abs(y),
              h = i.length <= 1 ? 0 : null != (t = a.paddingAngle) ? t : 0,
              b = i.filter((e) => 0 !== (0, en.getValueByDataKey)(e, p, 0)).length,
              g = i.reduce((e, t) => {
                var r = (0, en.getValueByDataKey)(t, p, 0);
                return e + ((0, eR.isNumber)(r) ? r : 0);
              }, 0),
              x =
                m > 0 &&
                g > 0 &&
                i.some((e) => {
                  var t = (0, en.getValueByDataKey)(e, p, 0),
                    r = ((0, eR.isNumber)(t) ? t : 0) / g;
                  return 0 !== t && r * v < m;
                })
                  ? m
                  : 0,
              O = v - b * x - (v >= 360 ? b : b - 1) * h;
            return (
              g > 0 &&
                (r = i.map((e, t) => {
                  var r,
                    i = (0, en.getValueByDataKey)(e, p, 0),
                    u = (0, en.getValueByDataKey)(e, d, t),
                    m = ((e, t, r) => {
                      var n,
                        { top: a, left: i, width: l, height: o } = t,
                        c = (0, eB.getMaxRadius)(l, o),
                        s = i + (0, eR.getPercentValue)(e.cx, l, l / 2),
                        u = a + (0, eR.getPercentValue)(e.cy, o, o / 2),
                        p = (0, eR.getPercentValue)(e.innerRadius, c, 0);
                      return {
                        cx: s,
                        cy: u,
                        innerRadius: p,
                        outerRadius:
                          ((n = e.outerRadius),
                          'function' == typeof n
                            ? (0, eR.getPercentValue)(n(r), c, 0.8 * c)
                            : (0, eR.getPercentValue)(n, c, 0.8 * c)),
                        maxRadius: e.maxRadius || Math.sqrt(l * l + o * o) / 2,
                      };
                    })(a, o, e),
                    v = ((0, eR.isNumber)(i) ? i : 0) / g,
                    b = tF(tF({}, e), l && l[t] && l[t].props),
                    j = null != b && 'fill' in b && 'string' == typeof b.fill ? b.fill : a.fill,
                    P =
                      (r = t ? n.endAngle + (0, eR.mathSign)(y) * h * (0 !== i) : s) +
                      (0, eR.mathSign)(y) * ((0 !== i ? x : 0) + v * O),
                    S = (r + P) / 2,
                    A = (m.innerRadius + m.outerRadius) / 2,
                    E = [
                      {
                        name: u,
                        value: i,
                        payload: b,
                        dataKey: p,
                        type: f,
                        color: j,
                        fill: j,
                        graphicalItemId: a.id,
                      },
                    ],
                    I = (0, eB.polarToCartesian)(m.cx, m.cy, A, S);
                  return (n = tF(
                    tF(
                      tF(
                        tF({}, a.presentationProps),
                        {},
                        {
                          percent: v,
                          cornerRadius: 'string' == typeof c ? parseFloat(c) : c,
                          name: u,
                          tooltipPayload: E,
                          midAngle: S,
                          middleRadius: A,
                          tooltipPosition: I,
                        },
                        b,
                      ),
                      m,
                    ),
                    {},
                    {
                      value: i,
                      dataKey: p,
                      startAngle: r,
                      endAngle: P,
                      payload: b,
                      paddingAngle: 0 !== i ? (0, eR.mathSign)(y) * h : 0,
                    },
                  ));
                })),
              r
            );
          })({ offset: n, pieSettings: t, displayedData: e, cells: r });
      }),
      ek = e.i(91214),
      eD = e.i(1232),
      eC = e.i(15202),
      ez = (e) => null;
    ez.displayName = 'Cell';
    var eN = e.i(5636),
      eB = e.i(13348),
      eR = e.i(49294),
      eL = e.i(68078),
      eM = e.i(17318),
      eK = e.i(50312),
      eF = e.i(62409),
      eG = e.i(14742),
      eV = e.i(64650),
      e_ = e.i(73508),
      eW = e.i(65601);
    function eq(e, t) {
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
    function eU(e) {
      for (var t = 1; t < arguments.length; t++) {
        var r = null != arguments[t] ? arguments[t] : {};
        t % 2
          ? eq(Object(r), !0).forEach(function (t) {
              var n, a, i;
              ((n = e),
                (a = t),
                (i = r[t]),
                (a = (function (e) {
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
                })(a)) in n
                  ? Object.defineProperty(n, a, {
                      value: i,
                      enumerable: !0,
                      configurable: !0,
                      writable: !0,
                    })
                  : (n[a] = i));
            })
          : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
            : eq(Object(r)).forEach(function (t) {
                Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t));
              });
      }
      return e;
    }
    function eZ() {
      return (eZ = Object.assign.bind()).apply(null, arguments);
    }
    function eX(e, t) {
      return (
        t || (t = e.slice(0)),
        Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } }))
      );
    }
    var eY = (e, l, o, c, s) => {
        var u = o - c;
        return (
          (0, eW.roundTemplateLiteral)(t || (t = eX(['M ', ',', ''])), e, l) +
          (0, eW.roundTemplateLiteral)(r || (r = eX(['L ', ',', ''])), e + o, l) +
          (0, eW.roundTemplateLiteral)(n || (n = eX(['L ', ',', ''])), e + o - u / 2, l + s) +
          (0, eW.roundTemplateLiteral)(a || (a = eX(['L ', ',', ''])), e + o - u / 2 - c, l + s) +
          (0, eW.roundTemplateLiteral)(i || (i = eX(['L ', ',', ' Z'])), e, l)
        );
      },
      eH = {
        x: 0,
        y: 0,
        upperWidth: 0,
        lowerWidth: 0,
        height: 0,
        isUpdateAnimationActive: !1,
        animationBegin: 0,
        animationDuration: 1500,
        animationEasing: 'ease',
      },
      e$ = (e) => {
        var t = (0, F.resolveDefaultProps)(e, eH),
          { x: r, y: n, upperWidth: a, lowerWidth: i, height: l, className: c } = t,
          {
            animationEasing: s,
            animationDuration: u,
            animationBegin: p,
            isUpdateAnimationActive: d,
          } = t,
          f = (0, o.useRef)(null),
          [m, y] = (0, o.useState)(-1),
          v = (0, o.useRef)(a),
          h = (0, o.useRef)(i),
          b = (0, o.useRef)(l),
          g = (0, o.useRef)(r),
          x = (0, o.useRef)(n),
          O = (0, eG.useAnimationId)(e, 'trapezoid-');
        if (
          ((0, o.useEffect)(() => {
            if (f.current && f.current.getTotalLength)
              try {
                var e = f.current.getTotalLength();
                e && y(e);
              } catch (e) {}
          }, []),
          r !== +r ||
            n !== +n ||
            a !== +a ||
            i !== +i ||
            l !== +l ||
            (0 === a && 0 === i) ||
            0 === l)
        )
          return null;
        var j = (0, Q.clsx)('recharts-trapezoid', c);
        if (!d)
          return o.createElement(
            'g',
            null,
            o.createElement(
              'path',
              eZ({}, (0, e_.svgPropertiesAndEvents)(t), { className: j, d: eY(r, n, a, i, l) }),
            ),
          );
        var P = v.current,
          S = h.current,
          A = b.current,
          E = g.current,
          I = x.current,
          w = '0px '.concat(-1 === m ? 1 : m, 'px'),
          T = ''.concat(m, 'px ').concat(m, 'px'),
          k = (0, eV.getTransitionVal)(['strokeDasharray'], u, s);
        return o.createElement(
          eF.JavascriptAnimate,
          {
            animationId: O,
            key: O,
            canBegin: m > 0,
            duration: u,
            easing: s,
            isActive: d,
            begin: p,
          },
          (e) => {
            var c = (0, eR.interpolate)(P, a, e),
              s = (0, eR.interpolate)(S, i, e),
              u = (0, eR.interpolate)(A, l, e),
              p = (0, eR.interpolate)(E, r, e),
              d = (0, eR.interpolate)(I, n, e);
            f.current &&
              ((v.current = c), (h.current = s), (b.current = u), (g.current = p), (x.current = d));
            var m = e > 0 ? { transition: k, strokeDasharray: T } : { strokeDasharray: w };
            return o.createElement(
              'path',
              eZ({}, (0, e_.svgPropertiesAndEvents)(t), {
                className: j,
                d: eY(p, d, c, s, u),
                ref: f,
                style: eU(eU({}, m), t.style),
              }),
            );
          },
        );
      },
      eJ = e.i(30856),
      eQ = e.i(16427),
      e0 = e.i(93202);
    let e1 = Math.cos,
      e2 = Math.sin,
      e5 = Math.sqrt,
      e3 = Math.PI,
      e4 = 2 * e3;
    e5(3);
    let e6 = {
        draw(e, t) {
          let r = e5(t / e3);
          (e.moveTo(r, 0), e.arc(0, 0, r, 0, e4));
        },
      },
      e9 = e5(1 / 3),
      e8 = 2 * e9,
      e7 = e2(e3 / 10) / e2((7 * e3) / 10),
      te = e2(e4 / 10) * e7,
      tt = -e1(e4 / 10) * e7,
      tr = e5(3);
    e5(3);
    let tn = e5(3) / 2,
      ta = 1 / e5(12),
      ti = (ta / 2 + 1) * 3;
    var tl = ['type', 'size', 'sizeType'];
    function to() {
      return (to = Object.assign.bind()).apply(null, arguments);
    }
    function tc(e, t) {
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
    function ts(e) {
      for (var t = 1; t < arguments.length; t++) {
        var r = null != arguments[t] ? arguments[t] : {};
        t % 2
          ? tc(Object(r), !0).forEach(function (t) {
              var n, a, i;
              ((n = e),
                (a = t),
                (i = r[t]),
                (a = (function (e) {
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
                })(a)) in n
                  ? Object.defineProperty(n, a, {
                      value: i,
                      enumerable: !0,
                      configurable: !0,
                      writable: !0,
                    })
                  : (n[a] = i));
            })
          : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
            : tc(Object(r)).forEach(function (t) {
                Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t));
              });
      }
      return e;
    }
    var tu = {
        symbolCircle: e6,
        symbolCross: {
          draw(e, t) {
            let r = e5(t / 5) / 2;
            (e.moveTo(-3 * r, -r),
              e.lineTo(-r, -r),
              e.lineTo(-r, -3 * r),
              e.lineTo(r, -3 * r),
              e.lineTo(r, -r),
              e.lineTo(3 * r, -r),
              e.lineTo(3 * r, r),
              e.lineTo(r, r),
              e.lineTo(r, 3 * r),
              e.lineTo(-r, 3 * r),
              e.lineTo(-r, r),
              e.lineTo(-3 * r, r),
              e.closePath());
          },
        },
        symbolDiamond: {
          draw(e, t) {
            let r = e5(t / e8),
              n = r * e9;
            (e.moveTo(0, -r), e.lineTo(n, 0), e.lineTo(0, r), e.lineTo(-n, 0), e.closePath());
          },
        },
        symbolSquare: {
          draw(e, t) {
            let r = e5(t),
              n = -r / 2;
            e.rect(n, n, r, r);
          },
        },
        symbolStar: {
          draw(e, t) {
            let r = e5(0.8908130915292852 * t),
              n = te * r,
              a = tt * r;
            (e.moveTo(0, -r), e.lineTo(n, a));
            for (let t = 1; t < 5; ++t) {
              let i = (e4 * t) / 5,
                l = e1(i),
                o = e2(i);
              (e.lineTo(o * r, -l * r), e.lineTo(l * n - o * a, o * n + l * a));
            }
            e.closePath();
          },
        },
        symbolTriangle: {
          draw(e, t) {
            let r = -e5(t / (3 * tr));
            (e.moveTo(0, 2 * r), e.lineTo(-tr * r, -r), e.lineTo(tr * r, -r), e.closePath());
          },
        },
        symbolWye: {
          draw(e, t) {
            let r = e5(t / ti),
              n = r / 2,
              a = r * ta,
              i = r * ta + r,
              l = -n;
            (e.moveTo(n, a),
              e.lineTo(n, i),
              e.lineTo(l, i),
              e.lineTo(-0.5 * n - tn * a, tn * n + -0.5 * a),
              e.lineTo(-0.5 * n - tn * i, tn * n + -0.5 * i),
              e.lineTo(-0.5 * l - tn * i, tn * l + -0.5 * i),
              e.lineTo(-0.5 * n + tn * a, -0.5 * a - tn * n),
              e.lineTo(-0.5 * n + tn * i, -0.5 * i - tn * n),
              e.lineTo(-0.5 * l + tn * i, -0.5 * i - tn * l),
              e.closePath());
          },
        },
      },
      tp = Math.PI / 180,
      td = (e) => {
        var { type: t = 'circle', size: r = 64, sizeType: n = 'area' } = e,
          a = ts(
            ts(
              {},
              (function (e, t) {
                if (null == e) return {};
                var r,
                  n,
                  a = (function (e, t) {
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
                  var i = Object.getOwnPropertySymbols(e);
                  for (n = 0; n < i.length; n++)
                    ((r = i[n]),
                      -1 === t.indexOf(r) && {}.propertyIsEnumerable.call(e, r) && (a[r] = e[r]));
                }
                return a;
              })(e, tl),
            ),
            {},
            { type: t, size: r, sizeType: n },
          ),
          i = 'circle';
        'string' == typeof t && (i = t);
        var { className: l, cx: c, cy: s } = a,
          u = (0, e_.svgPropertiesAndEvents)(a);
        return (0, eR.isNumber)(c) && (0, eR.isNumber)(s) && (0, eR.isNumber)(r)
          ? o.createElement(
              'path',
              to({}, u, {
                className: (0, Q.clsx)('recharts-symbols', l),
                transform: 'translate('.concat(c, ', ').concat(s, ')'),
                d: (() => {
                  var e,
                    t = ((e = i), tu['symbol'.concat((0, eR.upperFirst)(e))] || e6),
                    a = (function (e, t) {
                      let r = null,
                        n = (0, e0.withPath)(a);
                      function a() {
                        let a;
                        if (
                          (r || (r = a = n()),
                          e.apply(this, arguments).draw(r, +t.apply(this, arguments)),
                          a)
                        )
                          return ((r = null), a + '' || null);
                      }
                      return (
                        (e = 'function' == typeof e ? e : (0, eQ.default)(e || e6)),
                        (t = 'function' == typeof t ? t : (0, eQ.default)(void 0 === t ? 64 : +t)),
                        (a.type = function (t) {
                          return arguments.length
                            ? ((e = 'function' == typeof t ? t : (0, eQ.default)(t)), a)
                            : e;
                        }),
                        (a.size = function (e) {
                          return arguments.length
                            ? ((t = 'function' == typeof e ? e : (0, eQ.default)(+e)), a)
                            : t;
                        }),
                        (a.context = function (e) {
                          return arguments.length ? ((r = null == e ? null : e), a) : r;
                        }),
                        a
                      );
                    })()
                      .type(t)
                      .size(
                        ((e, t, r) => {
                          if ('area' === t) return e;
                          switch (r) {
                            case 'cross':
                              return (5 * e * e) / 9;
                            case 'diamond':
                              return (0.5 * e * e) / Math.sqrt(3);
                            case 'square':
                              return e * e;
                            case 'star':
                              var n = 18 * tp;
                              return (
                                1.25 * e * e * (Math.tan(n) - Math.tan(2 * n) * Math.tan(n) ** 2)
                              );
                            case 'triangle':
                              return (Math.sqrt(3) * e * e) / 4;
                            case 'wye':
                              return ((21 - 10 * Math.sqrt(3)) * e * e) / 8;
                            default:
                              return (Math.PI * e * e) / 4;
                          }
                        })(r, n, i),
                      )();
                  if (null !== a) return a;
                })(),
              }),
            )
          : null;
      };
    td.registerSymbol = (e, t) => {
      tu['symbol'.concat((0, eR.upperFirst)(e))] = t;
    };
    var tf = ['option', 'shapeType', 'activeClassName', 'inActiveClassName'];
    function tm(e, t) {
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
    function ty(e) {
      for (var t = 1; t < arguments.length; t++) {
        var r = null != arguments[t] ? arguments[t] : {};
        t % 2
          ? tm(Object(r), !0).forEach(function (t) {
              var n, a, i;
              ((n = e),
                (a = t),
                (i = r[t]),
                (a = (function (e) {
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
                })(a)) in n
                  ? Object.defineProperty(n, a, {
                      value: i,
                      enumerable: !0,
                      configurable: !0,
                      writable: !0,
                    })
                  : (n[a] = i));
            })
          : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
            : tm(Object(r)).forEach(function (t) {
                Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t));
              });
      }
      return e;
    }
    function tv(e) {
      var { shapeType: t, elementProps: r } = e;
      switch (t) {
        case 'rectangle':
          return o.createElement(eK.Rectangle, r);
        case 'trapezoid':
          return o.createElement(e$, r);
        case 'sector':
          return o.createElement(eJ.Sector, r);
        case 'symbols':
          if ('symbols' === t) return o.createElement(td, r);
          break;
        case 'curve':
          return o.createElement(eD.Curve, r);
        default:
          return null;
      }
    }
    function th(e) {
      var t,
        {
          option: r,
          shapeType: n,
          activeClassName: a = 'recharts-active-shape',
          inActiveClassName: i = 'recharts-shape',
        } = e,
        l = (function (e, t) {
          if (null == e) return {};
          var r,
            n,
            a = (function (e, t) {
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
            var i = Object.getOwnPropertySymbols(e);
            for (n = 0; n < i.length; n++)
              ((r = i[n]),
                -1 === t.indexOf(r) && {}.propertyIsEnumerable.call(e, r) && (a[r] = e[r]));
          }
          return a;
        })(e, tf);
      if ((0, o.isValidElement)(r))
        t = (0, o.cloneElement)(r, ty(ty({}, l), (0, o.isValidElement)(r) ? r.props : r));
      else if ('function' == typeof r) t = r(l, l.index);
      else if ((0, eM.default)(r) && 'boolean' != typeof r) {
        var c = ty(ty({}, l), r);
        t = o.createElement(tv, { shapeType: n, elementProps: c });
      } else t = o.createElement(tv, { shapeType: n, elementProps: l });
      return l.isActive
        ? o.createElement(ek.Layer, { className: a }, t)
        : o.createElement(ek.Layer, { className: i }, t);
    }
    var tb = e.i(12281),
      tg = (e, t, r) => {
        var n = (0, R.useAppDispatch)();
        return (a, i) => (l) => {
          (null == e || e(a, i, l),
            n(
              (0, tb.setActiveMouseOverItemIndex)({
                activeIndex: String(i),
                activeDataKey: t,
                activeCoordinate: a.tooltipPosition,
                activeGraphicalItemId: r,
              }),
            ));
        };
      },
      tx = (e) => {
        var t = (0, R.useAppDispatch)();
        return (r, n) => (a) => {
          (null == e || e(r, n, a), t((0, tb.mouseLeaveItem)()));
        };
      },
      tO = (e, t, r) => {
        var n = (0, R.useAppDispatch)();
        return (a, i) => (l) => {
          (null == e || e(a, i, l),
            n(
              (0, tb.setActiveClickItemIndex)({
                activeIndex: String(i),
                activeDataKey: t,
                activeCoordinate: a.tooltipPosition,
                activeGraphicalItemId: r,
              }),
            ));
        };
      },
      tj = e.i(88514),
      tP = e.i(70192),
      tS = e.i(65573),
      tA = e.i(66850),
      tE = e.i(91595),
      tI = e.i(76619),
      tw = e.i(75093),
      tT = e.i(57155),
      tk = e.i(7848),
      tD = e.i(95916),
      tC = e.i(58324),
      tz = ['key'],
      tN = ['onMouseEnter', 'onClick', 'onMouseLeave'],
      tB = ['id'],
      tR = ['id'];
    function tL() {
      return (tL = Object.assign.bind()).apply(null, arguments);
    }
    function tM(e, t) {
      if (null == e) return {};
      var r,
        n,
        a = (function (e, t) {
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
        var i = Object.getOwnPropertySymbols(e);
        for (n = 0; n < i.length; n++)
          ((r = i[n]), -1 === t.indexOf(r) && {}.propertyIsEnumerable.call(e, r) && (a[r] = e[r]));
      }
      return a;
    }
    function tK(e, t) {
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
    function tF(e) {
      for (var t = 1; t < arguments.length; t++) {
        var r = null != arguments[t] ? arguments[t] : {};
        t % 2
          ? tK(Object(r), !0).forEach(function (t) {
              var n, a, i;
              ((n = e),
                (a = t),
                (i = r[t]),
                (a = (function (e) {
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
                })(a)) in n
                  ? Object.defineProperty(n, a, {
                      value: i,
                      enumerable: !0,
                      configurable: !0,
                      writable: !0,
                    })
                  : (n[a] = i));
            })
          : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
            : tK(Object(r)).forEach(function (t) {
                Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t));
              });
      }
      return e;
    }
    function tG(e) {
      var t = (0, o.useMemo)(() => (0, eN.findAllByType)(e.children, ez), [e.children]),
        r = (0, R.useAppSelector)((r) => ew(r, e.id, t));
      return null == r ? null : o.createElement(tS.SetPolarLegendPayload, { legendPayload: r });
    }
    var tV = o.memo((e) => {
      var {
          dataKey: t,
          nameKey: r,
          sectors: n,
          stroke: a,
          strokeWidth: i,
          fill: l,
          name: c,
          hide: s,
          tooltipType: u,
          id: p,
          activeShape: d,
        } = e,
        f = (function (e) {
          if (null != e && 'boolean' != typeof e && 'function' != typeof e) {
            if (o.isValidElement(e)) {
              var t,
                r = null == (t = e.props) ? void 0 : t.fill;
              return 'string' == typeof r ? r : void 0;
            }
            var { fill: n } = e;
            return 'string' == typeof n ? n : void 0;
          }
        })(d),
        m = {
          dataDefinedOnItem: n.map((e) => {
            var t = e.tooltipPayload;
            return null == f || null == t
              ? t
              : t.map((e) => tF(tF({}, e), {}, { color: f, fill: f }));
          }),
          getPosition: (e) => {
            var t;
            return null == (t = n[Number(e)]) ? void 0 : t.tooltipPosition;
          },
          settings: {
            stroke: a,
            strokeWidth: i,
            fill: l,
            dataKey: t,
            nameKey: r,
            name: (0, en.getTooltipNameProp)(c, t),
            hide: s,
            type: u,
            color: l,
            unit: '',
            graphicalItemId: p,
          },
        };
      return o.createElement(tj.SetTooltipEntrySettings, { tooltipEntrySettings: m });
    });
    function t_(e) {
      var { sectors: t, props: r, showLabels: n } = e,
        { label: a, labelLine: i, dataKey: l } = r;
      if (!n || !a || !t) return null;
      var c = (0, tw.svgPropertiesNoEvents)(r),
        s = (0, tw.svgPropertiesNoEventsFromUnknown)(a),
        u = (0, tw.svgPropertiesNoEventsFromUnknown)(i),
        p =
          ('object' == typeof a &&
            'offsetRadius' in a &&
            'number' == typeof a.offsetRadius &&
            a.offsetRadius) ||
          20,
        d = t.map((e, t) => {
          var r,
            n,
            d = (e.startAngle + e.endAngle) / 2,
            f = (0, eB.polarToCartesian)(e.cx, e.cy, e.outerRadius + p, d),
            m = tF(
              tF(tF(tF({}, c), e), {}, { stroke: 'none' }, s),
              {},
              { index: t, textAnchor: (r = f.x) > (n = e.cx) ? 'start' : r < n ? 'end' : 'middle' },
              f,
            ),
            y = tF(
              tF(tF(tF({}, c), e), {}, { fill: 'none', stroke: e.fill }, u),
              {},
              {
                index: t,
                points: [(0, eB.polarToCartesian)(e.cx, e.cy, e.outerRadius, d), f],
                key: 'line',
              },
            );
          return o.createElement(
            tk.ZIndexLayer,
            {
              zIndex: tD.DefaultZIndexes.label,
              key: 'label-'
                .concat(e.startAngle, '-')
                .concat(e.endAngle, '-')
                .concat(e.midAngle, '-')
                .concat(t),
            },
            o.createElement(
              ek.Layer,
              null,
              i &&
                ((e, t) => {
                  if (o.isValidElement(e)) return o.cloneElement(e, t);
                  if ('function' == typeof e) return e(t);
                  var r = (0, Q.clsx)(
                      'recharts-pie-label-line',
                      'boolean' != typeof e ? e.className : '',
                    ),
                    { key: n } = t,
                    a = tM(t, tz);
                  return o.createElement(eD.Curve, tL({}, a, { type: 'linear', className: r }));
                })(i, y),
              ((e, t, r) => {
                if (o.isValidElement(e)) return o.cloneElement(e, t);
                var n = r;
                if ('function' == typeof e && ((n = e(t)), o.isValidElement(n))) return n;
                var a = (0, Q.clsx)('recharts-pie-label-text', (0, tC.getClassNameFromUnknown)(e));
                return o.createElement(
                  eC.Text,
                  tL({}, t, { alignmentBaseline: 'middle', className: a }),
                  n,
                );
              })(a, m, (0, en.getValueByDataKey)(e, l)),
            ),
          );
        });
      return o.createElement(ek.Layer, { className: 'recharts-pie-labels' }, d);
    }
    function tW(e) {
      var { sectors: t, props: r, showLabels: n } = e,
        { label: a } = r;
      return 'object' == typeof a && null != a && 'position' in a
        ? o.createElement(tT.LabelListFromLabelProp, { label: a })
        : o.createElement(t_, { sectors: t, props: r, showLabels: n });
    }
    function tq(e) {
      var {
          sectors: t,
          activeShape: r,
          inactiveShape: n,
          allOtherPieProps: a,
          shape: i,
          id: l,
        } = e,
        c = (0, R.useAppSelector)(tP.selectActiveTooltipIndex),
        s = (0, R.useAppSelector)(tP.selectActiveTooltipDataKey),
        u = (0, R.useAppSelector)(tP.selectActiveTooltipGraphicalItemId),
        { onMouseEnter: p, onClick: d, onMouseLeave: f } = a,
        m = tM(a, tN),
        y = tg(p, a.dataKey, l),
        v = tx(f),
        h = tO(d, a.dataKey, l);
      return null == t || 0 === t.length
        ? null
        : o.createElement(
            o.Fragment,
            null,
            t.map((e, p) => {
              if (
                (null == e ? void 0 : e.startAngle) === 0 &&
                (null == e ? void 0 : e.endAngle) === 0 &&
                1 !== t.length
              )
                return null;
              var d = null == u || u === l,
                f = String(p) === c && (null == s || a.dataKey === s) && d,
                b = r && f ? r : c ? n : null,
                g = tF(
                  tF({}, e),
                  {},
                  {
                    stroke: e.stroke,
                    tabIndex: -1,
                    [tA.DATA_ITEM_INDEX_ATTRIBUTE_NAME]: p,
                    [tA.DATA_ITEM_GRAPHICAL_ITEM_ID_ATTRIBUTE_NAME]: l,
                  },
                );
              return o.createElement(
                ek.Layer,
                tL(
                  {
                    key: 'sector-'
                      .concat(null == e ? void 0 : e.startAngle, '-')
                      .concat(null == e ? void 0 : e.endAngle, '-')
                      .concat(e.midAngle, '-')
                      .concat(p),
                    tabIndex: -1,
                    className: 'recharts-pie-sector',
                  },
                  (0, eL.adaptEventsOfChild)(m, e, p),
                  { onMouseEnter: y(e, p), onMouseLeave: v(e, p), onClick: h(e, p) },
                ),
                o.createElement(
                  th,
                  tL({ option: null != i ? i : b, index: p, shapeType: 'sector', isActive: f }, g),
                ),
              );
            }),
          );
    }
    function tU(e) {
      var { showLabels: t, sectors: r, children: n } = e,
        a = (0, o.useMemo)(
          () =>
            t && r
              ? r.map((e) => ({
                  value: e.value,
                  payload: e.payload,
                  clockWise: !1,
                  parentViewBox: void 0,
                  viewBox: {
                    cx: e.cx,
                    cy: e.cy,
                    innerRadius: e.innerRadius,
                    outerRadius: e.outerRadius,
                    startAngle: e.startAngle,
                    endAngle: e.endAngle,
                    clockWise: !1,
                  },
                  fill: e.fill,
                }))
              : [],
          [r, t],
        );
      return o.createElement(tT.PolarLabelListContextProvider, { value: t ? a : void 0 }, n);
    }
    function tZ(e) {
      var { props: t, previousSectorsRef: r, id: n } = e,
        {
          sectors: a,
          isAnimationActive: i,
          animationBegin: l,
          animationDuration: c,
          animationEasing: s,
          activeShape: u,
          inactiveShape: p,
          onAnimationStart: d,
          onAnimationEnd: f,
        } = t,
        m = (0, eG.useAnimationId)(t, 'recharts-pie-'),
        y = r.current,
        [v, h] = (0, o.useState)(!1),
        b = (0, o.useCallback)(() => {
          ('function' == typeof f && f(), h(!1));
        }, [f]),
        g = (0, o.useCallback)(() => {
          ('function' == typeof d && d(), h(!0));
        }, [d]);
      return o.createElement(
        tU,
        { showLabels: !v, sectors: a },
        o.createElement(
          eF.JavascriptAnimate,
          {
            animationId: m,
            begin: l,
            duration: c,
            isActive: i,
            easing: s,
            onAnimationStart: g,
            onAnimationEnd: b,
            key: m,
          },
          (e) => {
            var i,
              l = [],
              c = a && a[0],
              s = null != (i = null == c ? void 0 : c.startAngle) ? i : 0;
            return (
              null == a ||
                a.forEach((t, r) => {
                  var n = y && y[r],
                    a = r > 0 ? (0, J.default)(t, 'paddingAngle', 0) : 0;
                  if (n) {
                    var i = (0, eR.interpolate)(
                        n.endAngle - n.startAngle,
                        t.endAngle - t.startAngle,
                        e,
                      ),
                      o = tF(tF({}, t), {}, { startAngle: s + a, endAngle: s + i + a });
                    (l.push(o), (s = o.endAngle));
                  } else {
                    var { endAngle: c, startAngle: u } = t,
                      p = (0, eR.interpolate)(0, c - u, e),
                      d = tF(tF({}, t), {}, { startAngle: s + a, endAngle: s + p + a });
                    (l.push(d), (s = d.endAngle));
                  }
                }),
              (r.current = l),
              o.createElement(
                ek.Layer,
                null,
                o.createElement(tq, {
                  sectors: l,
                  activeShape: u,
                  inactiveShape: p,
                  allOtherPieProps: t,
                  shape: t.shape,
                  id: n,
                }),
              )
            );
          },
        ),
        o.createElement(tW, { showLabels: !v, sectors: a, props: t }),
        t.children,
      );
    }
    var tX = {
      animationBegin: 400,
      animationDuration: 1500,
      animationEasing: 'ease',
      cx: '50%',
      cy: '50%',
      dataKey: 'value',
      endAngle: 360,
      fill: '#808080',
      hide: !1,
      innerRadius: 0,
      isAnimationActive: 'auto',
      label: !1,
      labelLine: !0,
      legendType: 'rect',
      minAngle: 0,
      nameKey: 'name',
      outerRadius: '80%',
      paddingAngle: 0,
      rootTabIndex: 0,
      startAngle: 0,
      stroke: '#fff',
      zIndex: tD.DefaultZIndexes.area,
    };
    function tY(e) {
      var { id: t } = e,
        r = tM(e, tB),
        { hide: n, className: a, rootTabIndex: i } = e,
        l = (0, o.useMemo)(() => (0, eN.findAllByType)(e.children, ez), [e.children]),
        c = (0, R.useAppSelector)((e) => eT(e, t, l)),
        s = (0, o.useRef)(null),
        u = (0, Q.clsx)('recharts-pie', a);
      return n || null == c
        ? ((s.current = null), o.createElement(ek.Layer, { tabIndex: i, className: u }))
        : o.createElement(
            tk.ZIndexLayer,
            { zIndex: e.zIndex },
            o.createElement(tV, {
              dataKey: e.dataKey,
              nameKey: e.nameKey,
              sectors: c,
              stroke: e.stroke,
              strokeWidth: e.strokeWidth,
              fill: e.fill,
              name: e.name,
              hide: e.hide,
              tooltipType: e.tooltipType,
              id: t,
              activeShape: e.activeShape,
            }),
            o.createElement(
              ek.Layer,
              { tabIndex: i, className: u },
              o.createElement(tZ, {
                props: tF(tF({}, r), {}, { sectors: c }),
                previousSectorsRef: s,
                id: t,
              }),
            ),
          );
    }
    var tH = function (e) {
      var t = (0, F.resolveDefaultProps)(e, tX),
        { id: r } = t,
        n = tM(t, tR),
        a = (0, tw.svgPropertiesNoEvents)(n);
      return o.createElement(tE.RegisterGraphicalItemId, { id: r, type: 'pie' }, (e) =>
        o.createElement(
          o.Fragment,
          null,
          o.createElement(tI.SetPolarGraphicalItem, {
            type: 'pie',
            id: e,
            data: n.data,
            dataKey: n.dataKey,
            hide: n.hide,
            angleAxisId: 0,
            radiusAxisId: 0,
            name: n.name,
            nameKey: n.nameKey,
            tooltipType: n.tooltipType,
            legendType: n.legendType,
            fill: n.fill,
            cx: n.cx,
            cy: n.cy,
            startAngle: n.startAngle,
            endAngle: n.endAngle,
            paddingAngle: n.paddingAngle,
            minAngle: n.minAngle,
            innerRadius: n.innerRadius,
            outerRadius: n.outerRadius,
            cornerRadius: n.cornerRadius,
            presentationProps: a,
            maxRadius: t.maxRadius,
          }),
          o.createElement(tG, tL({}, n, { id: e })),
          o.createElement(tY, tL({}, n, { id: e })),
        ),
      );
    };
    tH.displayName = 'Pie';
    var t$ = e.i(60091),
      tJ = ['axis', 'item'],
      tQ = (0, o.forwardRef)((e, t) =>
        o.createElement(t$.CartesianChart, {
          chartName: 'BarChart',
          defaultTooltipEventType: 'axis',
          validateTooltipEventTypes: tJ,
          tooltipPayloadSearcher: k.arrayTooltipSearcher,
          categoricalChartProps: e,
          ref: t,
        }),
      ),
      t0 = o;
    function t1() {
      return (t1 = Object.assign.bind()).apply(null, arguments);
    }
    function t2(e) {
      return o.createElement(
        th,
        t1(
          {
            shapeType: 'rectangle',
            activeClassName: 'recharts-active-bar',
            inActiveClassName: 'recharts-inactive-bar',
          },
          e,
        ),
      );
    }
    e.i(64775);
    var t5 = function (e) {
        var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0;
        return (r, n) => {
          if ((0, eR.isNumber)(e)) return e;
          var a = (0, eR.isNumber)(r) || (0, eR.isNullish)(r);
          return a
            ? e(r, n)
            : (a ||
                (function (e, t) {
                  if (!e) throw Error('Invariant failed');
                })(
                  !1,
                  'minPointSize callback function received a value with type of '.concat(
                    typeof r,
                    '. Currently only numbers or null/undefined are supported.',
                  ),
                ),
              t);
        };
      },
      t3 = ['children'],
      t4 = (0, o.createContext)({
        data: [],
        xAxisId: 'xAxis-0',
        yAxisId: 'yAxis-0',
        dataPointFormatter: () => ({ x: 0, y: 0, value: 0 }),
        errorBarOffset: 0,
      });
    function t6(e) {
      var { children: t } = e,
        r = (function (e, t) {
          if (null == e) return {};
          var r,
            n,
            a = (function (e, t) {
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
            var i = Object.getOwnPropertySymbols(e);
            for (n = 0; n < i.length; n++)
              ((r = i[n]),
                -1 === t.indexOf(r) && {}.propertyIsEnumerable.call(e, r) && (a[r] = e[r]));
          }
          return a;
        })(e, t3);
      return o.createElement(t4.Provider, { value: r }, t);
    }
    var t9 = e.i(96459),
      t8 = e.i(34565),
      t7 = (e, t, r) => {
        var n = null != r ? r : e;
        if (!(0, eR.isNullish)(n)) return (0, eR.getPercentValue)(n, t, 0);
      },
      re = e.i(25894);
    function rt(e, t) {
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
    function rr(e) {
      for (var t = 1; t < arguments.length; t++) {
        var r = null != arguments[t] ? arguments[t] : {};
        t % 2
          ? rt(Object(r), !0).forEach(function (t) {
              var n, a, i;
              ((n = e),
                (a = t),
                (i = r[t]),
                (a = (function (e) {
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
                })(a)) in n
                  ? Object.defineProperty(n, a, {
                      value: i,
                      enumerable: !0,
                      configurable: !0,
                      writable: !0,
                    })
                  : (n[a] = i));
            })
          : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
            : rt(Object(r)).forEach(function (t) {
                Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t));
              });
      }
      return e;
    }
    var rn = e.i(61427),
      ra = e.i(42965),
      ri = (0, ee.createSelector)([ea.selectUnfilteredCartesianItems, (e, t) => t], (e, t) =>
        e.filter((e) => 'bar' === e.type).find((e) => e.id === t),
      ),
      rl = (0, ee.createSelector)([ri], (e) => (null == e ? void 0 : e.maxBarSize)),
      ro = (0, ee.createSelector)(
        [
          ei.selectChartLayout,
          ea.selectUnfilteredCartesianItems,
          ra.selectXAxisIdFromGraphicalItemId,
          ra.selectYAxisIdFromGraphicalItemId,
          (e, t, r) => r,
        ],
        (e, t, r, n, a) =>
          t
            .filter((t) => ('horizontal' === e ? t.xAxisId === r : t.yAxisId === n))
            .filter((e) => e.isPanorama === a)
            .filter((e) => !1 === e.hide)
            .filter((e) => 'bar' === e.type),
      ),
      rc = (0, ee.createSelector)(
        [
          ro,
          ec.selectRootBarSize,
          (e, t) => {
            var r = (0, ei.selectChartLayout)(e),
              n = (0, ra.selectXAxisIdFromGraphicalItemId)(e, t),
              a = (0, ra.selectYAxisIdFromGraphicalItemId)(e, t);
            if (null != n && null != a)
              return 'horizontal' === r
                ? (0, ea.selectCartesianAxisSize)(e, 'xAxis', n)
                : (0, ea.selectCartesianAxisSize)(e, 'yAxis', a);
          },
        ],
        (e, t, r) => {
          var n = e.filter(t8.isStacked),
            a = e.filter((e) => null == e.stackId);
          return [
            ...Object.entries(
              n.reduce((e, t) => {
                var r = e[t.stackId];
                return (null == r && (r = []), r.push(t), (e[t.stackId] = r), e);
              }, {}),
            ).map((e) => {
              var n,
                [a, i] = e;
              return {
                stackId: a,
                dataKeys: i.map((e) => e.dataKey),
                barSize: t7(t, r, null == (n = i[0]) ? void 0 : n.barSize),
              };
            }),
            ...a.map((e) => ({
              stackId: void 0,
              dataKeys: [e.dataKey].filter((e) => null != e),
              barSize: t7(t, r, e.barSize),
            })),
          ];
        },
      ),
      rs = (e, t, r) => {
        var n,
          a,
          i = (0, ei.selectChartLayout)(e),
          l = (0, ra.selectXAxisIdFromGraphicalItemId)(e, t),
          o = (0, ra.selectYAxisIdFromGraphicalItemId)(e, t);
        if (null != l && null != o)
          return (
            'horizontal' === i
              ? ((n = (0, ea.selectAxisWithScale)(e, 'xAxis', l, r)),
                (a = (0, ea.selectTicksOfGraphicalItem)(e, 'xAxis', l, r)))
              : ((n = (0, ea.selectAxisWithScale)(e, 'yAxis', o, r)),
                (a = (0, ea.selectTicksOfGraphicalItem)(e, 'yAxis', o, r))),
            (0, en.getBandSizeOfAxis)(n, a)
          );
      },
      ru = (0, ee.createSelector)(
        [
          rc,
          ec.selectRootMaxBarSize,
          ec.selectBarGap,
          ec.selectBarCategoryGap,
          (e, t, r) => {
            var n,
              a,
              i,
              l,
              o = ri(e, t);
            if (null == o) return 0;
            var c = (0, ra.selectXAxisIdFromGraphicalItemId)(e, t),
              s = (0, ra.selectYAxisIdFromGraphicalItemId)(e, t);
            if (null == c || null == s) return 0;
            var u = (0, ei.selectChartLayout)(e),
              p = (0, ec.selectRootMaxBarSize)(e),
              { maxBarSize: d } = o,
              f = (0, eR.isNullish)(d) ? p : d;
            return (
              'horizontal' === u
                ? ((i = (0, ea.selectAxisWithScale)(e, 'xAxis', c, r)),
                  (l = (0, ea.selectTicksOfGraphicalItem)(e, 'xAxis', c, r)))
                : ((i = (0, ea.selectAxisWithScale)(e, 'yAxis', s, r)),
                  (l = (0, ea.selectTicksOfGraphicalItem)(e, 'yAxis', s, r))),
              null != (n = null != (a = (0, en.getBandSizeOfAxis)(i, l, !0)) ? a : f) ? n : 0
            );
          },
          rs,
          rl,
        ],
        (e, t, r, n, a, i, l) => {
          var o = (function (e, t, r, n, a) {
            var i,
              l,
              o = n.length;
            if (!(o < 1)) {
              var c = (0, eR.getPercentValue)(e, r, 0, !0),
                s = [];
              if ((0, re.isWellBehavedNumber)(null == (i = n[0]) ? void 0 : i.barSize)) {
                var u = !1,
                  p = r / o,
                  d = n.reduce((e, t) => e + (t.barSize || 0), 0);
                ((d += (o - 1) * c) >= r && ((d -= (o - 1) * c), (c = 0)),
                  d >= r && p > 0 && ((u = !0), (p *= 0.9), (d = o * p)));
                var f = { offset: (((r - d) / 2) | 0) - c, size: 0 };
                l = n.reduce((e, t) => {
                  var r,
                    n = {
                      stackId: t.stackId,
                      dataKeys: t.dataKeys,
                      position: {
                        offset: f.offset + f.size + c,
                        size: u ? p : null != (r = t.barSize) ? r : 0,
                      },
                    },
                    a = [...e, n];
                  return ((f = n.position), a);
                }, s);
              } else {
                var m = (0, eR.getPercentValue)(t, r, 0, !0);
                r - 2 * m - (o - 1) * c <= 0 && (c = 0);
                var y = (r - 2 * m - (o - 1) * c) / o;
                y > 1 && (y >>= 0);
                var v = (0, re.isWellBehavedNumber)(a) ? Math.min(y, a) : y;
                l = n.reduce(
                  (e, t, r) => [
                    ...e,
                    {
                      stackId: t.stackId,
                      dataKeys: t.dataKeys,
                      position: { offset: m + (y + c) * r + (y - v) / 2, size: v },
                    },
                  ],
                  s,
                );
              }
              return l;
            }
          })(r, n, a !== i ? a : i, e, (0, eR.isNullish)(l) ? t : l);
          return (
            a !== i &&
              null != o &&
              (o = o.map((e) =>
                rr(
                  rr({}, e),
                  {},
                  { position: rr(rr({}, e.position), {}, { offset: e.position.offset - a / 2 }) },
                ),
              )),
            o
          );
        },
      ),
      rp = (0, ee.createSelector)([ru, ri], (e, t) => {
        if (null != e && null != t) {
          var r = e.find(
            (e) => e.stackId === t.stackId && null != t.dataKey && e.dataKeys.includes(t.dataKey),
          );
          if (null != r) return r.position;
        }
      }),
      rd = (0, ee.createSelector)(
        [
          (e, t, r) => {
            var n = (0, ei.selectChartLayout)(e),
              a = (0, ra.selectXAxisIdFromGraphicalItemId)(e, t),
              i = (0, ra.selectYAxisIdFromGraphicalItemId)(e, t);
            if (null != a && null != i)
              return 'horizontal' === n
                ? (0, ea.selectStackGroups)(e, 'yAxis', i, r)
                : (0, ea.selectStackGroups)(e, 'xAxis', a, r);
          },
          ri,
        ],
        (e, t) => {
          var r = (0, rn.getStackSeriesIdentifier)(t);
          if (!e || null == r || null == t) return;
          var { stackId: n } = t;
          if (null != n) {
            var a = e[n];
            if (a) {
              var { stackedData: i } = a;
              if (i) return i.find((e) => e.key === r);
            }
          }
        },
      ),
      rf = (0, ee.createSelector)(
        [
          er.selectChartOffsetInternal,
          er.selectAxisViewBox,
          (e, t, r) => {
            var n = (0, ra.selectXAxisIdFromGraphicalItemId)(e, t);
            if (null != n) return (0, ea.selectAxisWithScale)(e, 'xAxis', n, r);
          },
          (e, t, r) => {
            var n = (0, ra.selectYAxisIdFromGraphicalItemId)(e, t);
            if (null != n) return (0, ea.selectAxisWithScale)(e, 'yAxis', n, r);
          },
          (e, t, r) => {
            var n = (0, ra.selectXAxisIdFromGraphicalItemId)(e, t);
            if (null != n) return (0, ea.selectTicksOfGraphicalItem)(e, 'xAxis', n, r);
          },
          (e, t, r) => {
            var n = (0, ra.selectYAxisIdFromGraphicalItemId)(e, t);
            if (null != n) return (0, ea.selectTicksOfGraphicalItem)(e, 'yAxis', n, r);
          },
          rp,
          ei.selectChartLayout,
          et.selectChartDataWithIndexesIfNotInPanoramaPosition3,
          rs,
          rd,
          ri,
          (e, t, r, n) => n,
        ],
        (e, t, r, n, a, i, l, o, c, s, u, p, d) => {
          var f,
            { chartData: m, dataStartIndex: y, dataEndIndex: v } = c;
          if (
            null != p &&
            null != l &&
            null != t &&
            ('horizontal' === o || 'vertical' === o) &&
            null != r &&
            null != n &&
            null != a &&
            null != i &&
            null != s
          ) {
            var { data: h } = p;
            if (
              null != (f = null != h && h.length > 0 ? h : null == m ? void 0 : m.slice(y, v + 1))
            )
              return (function (e) {
                var {
                    layout: t,
                    barSettings: { dataKey: r, minPointSize: n, hasCustomShape: a },
                    pos: i,
                    bandSize: l,
                    xAxis: o,
                    yAxis: c,
                    xAxisTicks: s,
                    yAxisTicks: u,
                    stackedData: p,
                    displayedData: d,
                    offset: f,
                    cells: m,
                    parentViewBox: y,
                    dataStartIndex: v,
                  } = e,
                  h = 'horizontal' === t ? c : o,
                  b = p ? h.scale.domain() : null,
                  g = (0, en.getBaseValueOfBar)({ numericAxis: h }),
                  x = h.scale.map(g);
                return d
                  .map((e, d) => {
                    if (p) {
                      var h = p[d + v];
                      if (null == h) return null;
                      j = (0, en.truncateByDomain)(h, b);
                    } else Array.isArray((j = (0, en.getValueByDataKey)(e, r))) || (j = [g, j]);
                    var O = t5(n, 0)(j[1], d);
                    if ('horizontal' === t) {
                      var j,
                        P,
                        S,
                        A,
                        E,
                        I,
                        w,
                        T = c.scale.map(j[0]),
                        k = c.scale.map(j[1]);
                      if (null == T || null == k) return null;
                      ((P = (0, en.getCateCoordinateOfBar)({
                        axis: o,
                        ticks: s,
                        bandSize: l,
                        offset: i.offset,
                        entry: e,
                        index: d,
                      })),
                        (S = null != (w = null != k ? k : T) ? w : void 0),
                        (A = i.size));
                      var D = T - k;
                      if (
                        ((E = (0, eR.isNan)(D) ? 0 : D),
                        (I = { x: P, y: f.top, width: A, height: f.height }),
                        Math.abs(O) > 0 && Math.abs(E) < Math.abs(O))
                      ) {
                        var C = (0, eR.mathSign)(E || O) * (Math.abs(O) - Math.abs(E));
                        ((S -= C), (E += C));
                      }
                    } else {
                      var z = o.scale.map(j[0]),
                        N = o.scale.map(j[1]);
                      if (null == z || null == N) return null;
                      if (
                        ((P = z),
                        (S = (0, en.getCateCoordinateOfBar)({
                          axis: c,
                          ticks: u,
                          bandSize: l,
                          offset: i.offset,
                          entry: e,
                          index: d,
                        })),
                        (A = N - z),
                        (E = i.size),
                        (I = { x: f.left, y: S, width: f.width, height: E }),
                        Math.abs(O) > 0 && Math.abs(A) < Math.abs(O))
                      ) {
                        var B = (0, eR.mathSign)(A || O) * (Math.abs(O) - Math.abs(A));
                        A += B;
                      }
                    }
                    return null != P &&
                      null != S &&
                      null != A &&
                      null != E &&
                      (a || (0 !== A && 0 !== E))
                      ? rC(
                          rC({}, e),
                          {},
                          {
                            stackedBarStart: x,
                            x: P,
                            y: S,
                            width: A,
                            height: E,
                            value: p ? j : j[1],
                            payload: e,
                            background: I,
                            tooltipPosition: { x: P + A / 2, y: S + E / 2 },
                            parentViewBox: y,
                            originalDataIndex: d,
                          },
                          m && m[d] && m[d].props,
                        )
                      : null;
                  })
                  .filter(Boolean);
              })({
                layout: o,
                barSettings: p,
                pos: l,
                parentViewBox: t,
                bandSize: s,
                xAxis: r,
                yAxis: n,
                xAxisTicks: a,
                yAxisTicks: i,
                stackedData: u,
                displayedData: f,
                offset: e,
                cells: d,
                dataStartIndex: y,
              });
          }
        },
      ),
      rm = e.i(57632),
      ry = e.i(97943),
      rv = (e.i(95335), (e, t) => t),
      rh = (e, t, r) => r,
      rb = (0, ee.createSelector)([rv, ea.selectUnfilteredCartesianItems, rh], (e, t, r) =>
        t
          .filter((e) => 'bar' === e.type)
          .filter((t) => t.stackId === e)
          .filter((e) => e.isPanorama === r)
          .filter((e) => !e.hide),
      ),
      rg = (0, ee.createSelector)([rb], (e) => e.map((e) => e.id)),
      rx = (0, ee.createSelector)([(e) => e, rv, rh], (e, t, r) => {
        var n = rg(e, t, r),
          a = [];
        return (
          n.forEach((t) => {
            var n = rf(e, t, r, void 0);
            null == n ||
              n.forEach((e) => {
                var t = e.originalDataIndex;
                a[t] = ((e, t) => {
                  if (!e) return t;
                  if (!t) return e;
                  var r = Math.min(e.x, e.x + e.width, t.x, t.x + t.width),
                    n = Math.min(e.y, e.y + e.height, t.y, t.y + t.height);
                  return {
                    x: r,
                    y: n,
                    width: Math.max(e.x, e.x + e.width, t.x, t.x + t.width) - r,
                    height: Math.max(e.y, e.y + e.height, t.y, t.y + t.height) - n,
                  };
                })(a[t], e);
              });
          }),
          a
        );
      }),
      rO = ['index'];
    function rj() {
      return (rj = Object.assign.bind()).apply(null, arguments);
    }
    var rP = (0, o.createContext)(void 0),
      rS = (e, t) => 'recharts-bar-stack-clip-path-'.concat(e, '-').concat(t),
      rA = (e) => {
        var { index: t } = e,
          r = (function (e, t) {
            if (null == e) return {};
            var r,
              n,
              a = (function (e, t) {
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
              var i = Object.getOwnPropertySymbols(e);
              for (n = 0; n < i.length; n++)
                ((r = i[n]),
                  -1 === t.indexOf(r) && {}.propertyIsEnumerable.call(e, r) && (a[r] = e[r]));
            }
            return a;
          })(e, rO),
          n = ((e) => {
            var t = (0, o.useContext)(rP);
            if (null != t) {
              var { stackId: r } = t;
              return 'url(#'.concat(rS(r, e), ')');
            }
          })(t);
        return o.createElement(
          ek.Layer,
          rj({ className: 'recharts-bar-stack-layer', clipPath: n }, r),
        );
      };
    ry.propsAreEqual;
    var rE = ['onMouseEnter', 'onMouseLeave', 'onClick'],
      rI = ['value', 'background', 'tooltipPosition'],
      rw = ['id'],
      rT = ['onMouseEnter', 'onClick', 'onMouseLeave'];
    function rk() {
      return (rk = Object.assign.bind()).apply(null, arguments);
    }
    function rD(e, t) {
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
    function rC(e) {
      for (var t = 1; t < arguments.length; t++) {
        var r = null != arguments[t] ? arguments[t] : {};
        t % 2
          ? rD(Object(r), !0).forEach(function (t) {
              var n, a, i;
              ((n = e),
                (a = t),
                (i = r[t]),
                (a = (function (e) {
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
                })(a)) in n
                  ? Object.defineProperty(n, a, {
                      value: i,
                      enumerable: !0,
                      configurable: !0,
                      writable: !0,
                    })
                  : (n[a] = i));
            })
          : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
            : rD(Object(r)).forEach(function (t) {
                Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t));
              });
      }
      return e;
    }
    function rz(e, t) {
      if (null == e) return {};
      var r,
        n,
        a = (function (e, t) {
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
        var i = Object.getOwnPropertySymbols(e);
        for (n = 0; n < i.length; n++)
          ((r = i[n]), -1 === t.indexOf(r) && {}.propertyIsEnumerable.call(e, r) && (a[r] = e[r]));
      }
      return a;
    }
    var rN = t0.memo((e) => {
      var {
          dataKey: t,
          stroke: r,
          strokeWidth: n,
          fill: a,
          name: i,
          hide: l,
          unit: o,
          tooltipType: c,
          id: s,
        } = e,
        u = {
          dataDefinedOnItem: void 0,
          getPosition: eR.noop,
          settings: {
            stroke: r,
            strokeWidth: n,
            fill: a,
            dataKey: t,
            nameKey: void 0,
            name: (0, en.getTooltipNameProp)(i, t),
            hide: l,
            type: c,
            color: a,
            unit: o,
            graphicalItemId: s,
          },
        };
      return t0.createElement(tj.SetTooltipEntrySettings, { tooltipEntrySettings: u });
    });
    function rB(e) {
      var t,
        r = (0, R.useAppSelector)(tP.selectActiveTooltipIndex),
        { data: n, dataKey: a, background: i, allOtherBarProps: l } = e,
        { onMouseEnter: o, onMouseLeave: c, onClick: s } = l,
        u = rz(l, rE),
        p = tg(o, a, l.id),
        d = tx(c),
        f = tO(s, a, l.id);
      if (!i || null == n) return null;
      var m = (0, tw.svgPropertiesNoEventsFromUnknown)(i);
      return t0.createElement(
        tk.ZIndexLayer,
        {
          zIndex:
            ((t = tD.DefaultZIndexes.barBackground),
            i &&
            'object' == typeof i &&
            'zIndex' in i &&
            'number' == typeof i.zIndex &&
            (0, re.isWellBehavedNumber)(i.zIndex)
              ? i.zIndex
              : t),
        },
        n.map((e, t) => {
          var { value: n, background: l, tooltipPosition: o } = e,
            c = rz(e, rI);
          if (!l) return null;
          var s = p(e, t),
            y = d(e, t),
            v = f(e, t),
            h = rC(
              rC(
                rC(rC(rC({ option: i, isActive: String(t) === r }, c), {}, { fill: '#eee' }, l), m),
                (0, eL.adaptEventsOfChild)(u, e, t),
              ),
              {},
              {
                onMouseEnter: s,
                onMouseLeave: y,
                onClick: v,
                dataKey: a,
                index: t,
                className: 'recharts-bar-background-rectangle',
              },
            );
          return t0.createElement(t2, rk({ key: 'background-bar-'.concat(t) }, h));
        }),
      );
    }
    function rR(e) {
      var { showLabels: t, children: r, rects: n } = e,
        a =
          null == n
            ? void 0
            : n.map((e) => {
                var t = {
                  x: e.x,
                  y: e.y,
                  width: e.width,
                  lowerWidth: e.width,
                  upperWidth: e.width,
                  height: e.height,
                };
                return rC(
                  rC({}, t),
                  {},
                  {
                    value: e.value,
                    payload: e.payload,
                    parentViewBox: e.parentViewBox,
                    viewBox: t,
                    fill: e.fill,
                  },
                );
              });
      return t0.createElement(tT.CartesianLabelListContextProvider, { value: t ? a : void 0 }, r);
    }
    function rL(e) {
      var t,
        { shape: r, activeBar: n, baseProps: a, entry: i, index: l, dataKey: o } = e,
        c = (0, R.useAppSelector)(tP.selectActiveTooltipIndex),
        s = (0, R.useAppSelector)(tP.selectActiveTooltipDataKey),
        u = n && String(i.originalDataIndex) === c && (null == s || o === s),
        [p, d] = (0, t0.useState)(!1),
        [f, m] = (0, t0.useState)(!1);
      (0, t0.useEffect)(() => {
        var e;
        return (
          u
            ? (d(!0),
              (e = requestAnimationFrame(() => {
                m(!0);
              })))
            : m(!1),
          () => {
            cancelAnimationFrame(e);
          }
        );
      }, [u]);
      var y = (0, t0.useCallback)(() => {
          u || d(!1);
        }, [u]),
        v = u && f,
        h = u || p;
      t = u ? (!0 === n ? r : n) : r;
      var b = t0.createElement(
        t2,
        rk({}, a, { name: String(a.name) }, i, {
          isActive: v,
          option: t,
          index: l,
          dataKey: o,
          onTransitionEnd: y,
        }),
      );
      return h
        ? t0.createElement(
            tk.ZIndexLayer,
            { zIndex: tD.DefaultZIndexes.activeBar },
            t0.createElement(rA, { index: i.originalDataIndex }, b),
          )
        : b;
    }
    function rM(e) {
      var { shape: t, baseProps: r, entry: n, index: a, dataKey: i } = e;
      return t0.createElement(
        t2,
        rk({}, r, { name: String(r.name) }, n, { isActive: !1, option: t, index: a, dataKey: i }),
      );
    }
    function rK(e) {
      var t,
        { data: r, props: n } = e,
        a = null != (t = (0, tw.svgPropertiesNoEvents)(n)) ? t : {},
        { id: i } = a,
        l = rz(a, rw),
        { shape: o, dataKey: c, activeBar: s } = n,
        { onMouseEnter: u, onClick: p, onMouseLeave: d } = n,
        f = rz(n, rT),
        m = tg(u, c, i),
        y = tx(d),
        v = tO(p, c, i);
      return r
        ? t0.createElement(
            t0.Fragment,
            null,
            r.map((e, t) =>
              t0.createElement(
                rA,
                rk(
                  {
                    index: e.originalDataIndex,
                    key: 'rectangle-'
                      .concat(null == e ? void 0 : e.x, '-')
                      .concat(null == e ? void 0 : e.y, '-')
                      .concat(null == e ? void 0 : e.value, '-')
                      .concat(t),
                    className: 'recharts-bar-rectangle',
                  },
                  (0, eL.adaptEventsOfChild)(f, e, t),
                  { onMouseEnter: m(e, t), onMouseLeave: y(e, t), onClick: v(e, t) },
                ),
                s
                  ? t0.createElement(rL, {
                      shape: o,
                      activeBar: s,
                      baseProps: l,
                      entry: e,
                      index: t,
                      dataKey: c,
                    })
                  : t0.createElement(rM, {
                      shape: o,
                      baseProps: l,
                      entry: e,
                      index: t,
                      dataKey: c,
                    }),
              ),
            ),
          )
        : null;
    }
    function rF(e) {
      var { props: t, previousRectanglesRef: r } = e,
        {
          data: n,
          layout: a,
          isAnimationActive: i,
          animationBegin: l,
          animationDuration: o,
          animationEasing: c,
          onAnimationEnd: s,
          onAnimationStart: u,
        } = t,
        p = r.current,
        d = (0, eG.useAnimationId)(t, 'recharts-bar-'),
        [f, m] = (0, t0.useState)(!1),
        y = (0, t0.useCallback)(() => {
          ('function' == typeof s && s(), m(!1));
        }, [s]),
        v = (0, t0.useCallback)(() => {
          ('function' == typeof u && u(), m(!0));
        }, [u]);
      return t0.createElement(
        rR,
        { showLabels: !f, rects: n },
        t0.createElement(
          eF.JavascriptAnimate,
          {
            animationId: d,
            begin: l,
            duration: o,
            isActive: i,
            easing: c,
            onAnimationEnd: y,
            onAnimationStart: v,
            key: d,
          },
          (e) => {
            var i =
              1 === e
                ? n
                : null == n
                  ? void 0
                  : n.map((t, r) => {
                      var n = p && p[r];
                      if (n)
                        return rC(
                          rC({}, t),
                          {},
                          {
                            x: (0, eR.interpolate)(n.x, t.x, e),
                            y: (0, eR.interpolate)(n.y, t.y, e),
                            width: (0, eR.interpolate)(n.width, t.width, e),
                            height: (0, eR.interpolate)(n.height, t.height, e),
                          },
                        );
                      if ('horizontal' === a) {
                        var i = (0, eR.interpolate)(0, t.height, e),
                          l = (0, eR.interpolate)(t.stackedBarStart, t.y, e);
                        return rC(rC({}, t), {}, { y: l, height: i });
                      }
                      var o = (0, eR.interpolate)(0, t.width, e),
                        c = (0, eR.interpolate)(t.stackedBarStart, t.x, e);
                      return rC(rC({}, t), {}, { width: o, x: c });
                    });
            return (e > 0 && (r.current = null != i ? i : null), null == i)
              ? null
              : t0.createElement(ek.Layer, null, t0.createElement(rK, { props: t, data: i }));
          },
        ),
        t0.createElement(tT.LabelListFromLabelProp, { label: t.label }),
        t.children,
      );
    }
    function rG(e) {
      var t = (0, t0.useRef)(null);
      return t0.createElement(rF, { previousRectanglesRef: t, props: e });
    }
    var rV = (e, t) => {
      var r = Array.isArray(e.value) ? e.value[1] : e.value;
      return { x: e.x, y: e.y, value: r, errorVal: (0, en.getValueByDataKey)(e, t) };
    };
    class r_ extends t0.PureComponent {
      render() {
        var {
          hide: e,
          data: t,
          dataKey: r,
          className: n,
          xAxisId: a,
          yAxisId: i,
          needClip: l,
          background: o,
          id: c,
        } = this.props;
        if (e || null == t) return null;
        var s = (0, Q.clsx)('recharts-bar', n);
        return t0.createElement(
          ek.Layer,
          { className: s, id: c },
          l &&
            t0.createElement(
              'defs',
              null,
              t0.createElement(t9.GraphicalItemClipPath, { clipPathId: c, xAxisId: a, yAxisId: i }),
            ),
          t0.createElement(
            ek.Layer,
            {
              className: 'recharts-bar-rectangles',
              clipPath: l ? 'url(#clipPath-'.concat(c, ')') : void 0,
            },
            t0.createElement(rB, {
              data: t,
              dataKey: r,
              background: o,
              allOtherBarProps: this.props,
            }),
            t0.createElement(rG, this.props),
          ),
        );
      }
    }
    var rW = {
      activeBar: !1,
      animationBegin: 0,
      animationDuration: 400,
      animationEasing: 'ease',
      background: !1,
      hide: !1,
      isAnimationActive: 'auto',
      label: !1,
      legendType: 'rect',
      minPointSize: 0,
      xAxisId: 0,
      yAxisId: 0,
      zIndex: tD.DefaultZIndexes.bar,
    };
    function rq(e) {
      var t,
        {
          xAxisId: r,
          yAxisId: n,
          hide: a,
          legendType: i,
          minPointSize: l,
          activeBar: o,
          animationBegin: c,
          animationDuration: s,
          animationEasing: u,
          isAnimationActive: p,
        } = e,
        { needClip: d } = (0, t9.useNeedsClip)(r, n),
        f = (0, ei.useChartLayout)(),
        m = (0, rm.useIsPanorama)(),
        y = (0, eN.findAllByType)(e.children, ez),
        v = (0, R.useAppSelector)((t) => rf(t, e.id, m, y));
      if ('vertical' !== f && 'horizontal' !== f) return null;
      var h = null == v ? void 0 : v[0];
      return (
        (t =
          null == h || null == h.height || null == h.width
            ? 0
            : 'vertical' === f
              ? h.height / 2
              : h.width / 2),
        t0.createElement(
          t6,
          { xAxisId: r, yAxisId: n, data: v, dataPointFormatter: rV, errorBarOffset: t },
          t0.createElement(
            r_,
            rk({}, e, {
              layout: f,
              needClip: d,
              data: v,
              xAxisId: r,
              yAxisId: n,
              hide: a,
              legendType: i,
              minPointSize: l,
              activeBar: o,
              animationBegin: c,
              animationDuration: s,
              animationEasing: u,
              isAnimationActive: p,
            }),
          ),
        )
      );
    }
    var rU = t0.memo(function (e) {
      var t,
        r,
        n = (0, F.resolveDefaultProps)(e, rW),
        a =
          ((t = n.stackId),
          null != (r = (0, o.useContext)(rP))
            ? r.stackId
            : null != t
              ? (0, en.getNormalizedStackId)(t)
              : void 0),
        i = (0, rm.useIsPanorama)();
      return t0.createElement(tE.RegisterGraphicalItemId, { id: n.id, type: 'bar' }, (e) =>
        t0.createElement(
          t0.Fragment,
          null,
          t0.createElement(tS.SetLegendPayload, {
            legendPayload: ((e) => {
              var { dataKey: t, name: r, fill: n, legendType: a, hide: i } = e;
              return [
                {
                  inactive: i,
                  dataKey: t,
                  type: a,
                  color: n,
                  value: (0, en.getTooltipNameProp)(r, t),
                  payload: e,
                },
              ];
            })(n),
          }),
          t0.createElement(rN, {
            dataKey: n.dataKey,
            stroke: n.stroke,
            strokeWidth: n.strokeWidth,
            fill: n.fill,
            name: n.name,
            hide: n.hide,
            unit: n.unit,
            tooltipType: n.tooltipType,
            id: e,
          }),
          t0.createElement(tI.SetCartesianGraphicalItem, {
            type: 'bar',
            id: e,
            data: void 0,
            xAxisId: n.xAxisId,
            yAxisId: n.yAxisId,
            zAxisId: 0,
            dataKey: n.dataKey,
            stackId: a,
            hide: n.hide,
            barSize: n.barSize,
            minPointSize: n.minPointSize,
            maxBarSize: n.maxBarSize,
            isPanorama: i,
            hasCustomShape: null != n.shape,
          }),
          t0.createElement(
            tk.ZIndexLayer,
            { zIndex: n.zIndex },
            t0.createElement(rq, rk({}, n, { id: e })),
          ),
        ),
      );
    }, ry.propsAreEqual);
    rU.displayName = 'Bar';
    var rZ = e.i(11381),
      rX = e.i(19834),
      rY = e.i(6855),
      rH = e.i(54241),
      r$ = e.i(7473),
      rJ = e.i(4605),
      rQ = e.i(29589);
    function r0() {
      return (r0 = Object.assign.bind()).apply(null, arguments);
    }
    function r1(e, t) {
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
    function r2(e) {
      for (var t = 1; t < arguments.length; t++) {
        var r = null != arguments[t] ? arguments[t] : {};
        t % 2
          ? r1(Object(r), !0).forEach(function (t) {
              var n, a, i;
              ((n = e),
                (a = t),
                (i = r[t]),
                (a = (function (e) {
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
                })(a)) in n
                  ? Object.defineProperty(n, a, {
                      value: i,
                      enumerable: !0,
                      configurable: !0,
                      writable: !0,
                    })
                  : (n[a] = i));
            })
          : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
            : r1(Object(r)).forEach(function (t) {
                Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t));
              });
      }
      return e;
    }
    var r5 = {
      align: 'center',
      iconSize: 14,
      inactiveColor: '#ccc',
      layout: 'horizontal',
      verticalAlign: 'middle',
      labelStyle: {},
    };
    function r3(e) {
      var { data: t, iconType: r, inactiveColor: n } = e,
        a = 32 / 6,
        i = 32 / 3,
        l = t.inactive ? n : t.color,
        c = null != r ? r : t.type;
      if ('none' === c) return null;
      if ('plainline' === c)
        return o.createElement('line', {
          strokeWidth: 4,
          fill: 'none',
          stroke: l,
          strokeDasharray: (function (e) {
            if ('object' == typeof e && null !== e && 'strokeDasharray' in e)
              return String(e.strokeDasharray);
          })(t.payload),
          x1: 0,
          y1: 16,
          x2: 32,
          y2: 16,
          className: 'recharts-legend-icon',
        });
      if ('line' === c)
        return o.createElement('path', {
          strokeWidth: 4,
          fill: 'none',
          stroke: l,
          d: 'M0,'
            .concat(16, 'h')
            .concat(i, '\n            A')
            .concat(a, ',')
            .concat(a, ',0,1,1,')
            .concat(2 * i, ',')
            .concat(16, '\n            H')
            .concat(32, 'M')
            .concat(2 * i, ',')
            .concat(16, '\n            A')
            .concat(a, ',')
            .concat(a, ',0,1,1,')
            .concat(i, ',')
            .concat(16),
          className: 'recharts-legend-icon',
        });
      if ('rect' === c)
        return o.createElement('path', {
          stroke: 'none',
          fill: l,
          d: 'M0,'.concat(4, 'h').concat(32, 'v').concat(24, 'h').concat(-32, 'z'),
          className: 'recharts-legend-icon',
        });
      if (o.isValidElement(t.legendIcon)) {
        var s = r2({}, t);
        return (delete s.legendIcon, o.cloneElement(t.legendIcon, s));
      }
      return o.createElement(td, {
        fill: l,
        cx: 16,
        cy: 16,
        size: 32,
        sizeType: 'diameter',
        type: c,
      });
    }
    function r4(e) {
      var {
          payload: t,
          iconSize: r,
          layout: n,
          formatter: a,
          inactiveColor: i,
          iconType: l,
          labelStyle: c,
        } = e,
        s = { x: 0, y: 0, width: 32, height: 32 },
        u = { display: 'horizontal' === n ? 'inline-block' : 'block', marginRight: 10 },
        p = { display: 'inline-block', verticalAlign: 'middle', marginRight: 4 };
      return t.map((t, n) => {
        var d = t.formatter || a,
          f = (0, Q.clsx)({
            'recharts-legend-item': !0,
            ['legend-item-'.concat(n)]: !0,
            inactive: t.inactive,
          });
        if ('none' === t.type) return null;
        var m = 'object' == typeof c ? r2({}, c) : {};
        m.color = t.inactive ? i : m.color || t.color;
        var y = d ? d(t.value, t, n) : t.value;
        return o.createElement(
          'li',
          r0(
            { className: f, style: u, key: 'legend-item-'.concat(n) },
            (0, eL.adaptEventsOfChild)(e, t, n),
          ),
          o.createElement(
            rQ.Surface,
            {
              width: r,
              height: r,
              viewBox: s,
              style: p,
              'aria-label': ''.concat(t.value, ' legend icon'),
            },
            o.createElement(r3, { data: t, iconType: l, inactiveColor: i }),
          ),
          o.createElement('span', { className: 'recharts-legend-item-text', style: m }, y),
        );
      });
    }
    var r6 = (e) => {
        var t = (0, F.resolveDefaultProps)(e, r5),
          { payload: r, layout: n, align: a } = t;
        return r && r.length
          ? o.createElement(
              'ul',
              {
                className: 'recharts-default-legend',
                style: { padding: 0, margin: 0, textAlign: 'horizontal' === n ? a : 'left' },
              },
              o.createElement(r4, r0({}, t, { payload: r })),
            )
          : null;
      },
      r9 = e.i(57462),
      r8 = e.i(72302),
      r7 = e.i(77116),
      ne = e.i(89179),
      nt = ['contextPayload'];
    function nr() {
      return (nr = Object.assign.bind()).apply(null, arguments);
    }
    function nn(e, t) {
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
    function na(e) {
      for (var t = 1; t < arguments.length; t++) {
        var r = null != arguments[t] ? arguments[t] : {};
        t % 2
          ? nn(Object(r), !0).forEach(function (t) {
              var n, a, i;
              ((n = e),
                (a = t),
                (i = r[t]),
                (a = (function (e) {
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
                })(a)) in n
                  ? Object.defineProperty(n, a, {
                      value: i,
                      enumerable: !0,
                      configurable: !0,
                      writable: !0,
                    })
                  : (n[a] = i));
            })
          : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
            : nn(Object(r)).forEach(function (t) {
                Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t));
              });
      }
      return e;
    }
    function ni(e) {
      return e.value;
    }
    function nl(e) {
      var { contextPayload: t } = e,
        r = (function (e, t) {
          if (null == e) return {};
          var r,
            n,
            a = (function (e, t) {
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
            var i = Object.getOwnPropertySymbols(e);
            for (n = 0; n < i.length; n++)
              ((r = i[n]),
                -1 === t.indexOf(r) && {}.propertyIsEnumerable.call(e, r) && (a[r] = e[r]));
          }
          return a;
        })(e, nt),
        n = (0, r9.getUniqPayload)(t, e.payloadUniqBy, ni),
        a = na(na({}, r), {}, { payload: n });
      return o.isValidElement(e.content)
        ? o.cloneElement(e.content, a)
        : 'function' == typeof e.content
          ? o.createElement(e.content, a)
          : o.createElement(r6, a);
    }
    function no(e) {
      var t = (0, R.useAppDispatch)();
      return (
        (0, o.useEffect)(() => {
          t((0, ne.setLegendSettings)(e));
        }, [t, e]),
        null
      );
    }
    function nc(e) {
      var t = (0, R.useAppDispatch)();
      return (
        (0, o.useEffect)(
          () => (
            t((0, ne.setLegendSize)(e)),
            () => {
              t((0, ne.setLegendSize)({ width: 0, height: 0 }));
            }
          ),
          [t, e],
        ),
        null
      );
    }
    var ns = {
        align: 'center',
        iconSize: 14,
        inactiveColor: '#ccc',
        itemSorter: 'value',
        layout: 'horizontal',
        verticalAlign: 'bottom',
      },
      nu = o.memo(function (e) {
        var t,
          r = (0, F.resolveDefaultProps)(e, ns),
          n = (0, R.useAppSelector)(r8.selectLegendPayload),
          a = (0, rJ.useLegendPortal)(),
          i = (0, ei.useMargin)(),
          { width: l, height: c, wrapperStyle: s, portal: u } = r,
          [p, d] = (0, r7.useElementOffset)([n]),
          f = (0, ei.useChartWidth)(),
          m = (0, ei.useChartHeight)();
        if (null == f || null == m) return null;
        var y = f - ((null == i ? void 0 : i.left) || 0) - ((null == i ? void 0 : i.right) || 0),
          v =
            ((t = r.layout),
            'vertical' === t && null != c
              ? { height: c }
              : 'horizontal' === t
                ? { width: l || y }
                : null),
          h = u
            ? s
            : na(
                na(
                  {
                    position: 'absolute',
                    width: (null == v ? void 0 : v.width) || l || 'auto',
                    height: (null == v ? void 0 : v.height) || c || 'auto',
                  },
                  (function (e, t, r, n, a, i) {
                    var l,
                      o,
                      { layout: c, align: s, verticalAlign: u } = t;
                    return (
                      (e &&
                        ((void 0 !== e.left && null !== e.left) ||
                          (void 0 !== e.right && null !== e.right))) ||
                        (l =
                          'center' === s && 'vertical' === c
                            ? { left: ((n || 0) - i.width) / 2 }
                            : 'right' === s
                              ? { right: (r && r.right) || 0 }
                              : { left: (r && r.left) || 0 }),
                      (e &&
                        ((void 0 !== e.top && null !== e.top) ||
                          (void 0 !== e.bottom && null !== e.bottom))) ||
                        (o =
                          'middle' === u
                            ? { top: ((a || 0) - i.height) / 2 }
                            : 'bottom' === u
                              ? { bottom: (r && r.bottom) || 0 }
                              : { top: (r && r.top) || 0 }),
                      na(na({}, l), o)
                    );
                  })(s, r, i, f, m, p),
                ),
                s,
              ),
          b = null != u ? u : a;
        if (null == b || null == n) return null;
        var g = o.createElement(
          'div',
          { className: 'recharts-legend-wrapper', style: h, ref: d },
          o.createElement(no, {
            layout: r.layout,
            align: r.align,
            verticalAlign: r.verticalAlign,
            itemSorter: r.itemSorter,
          }),
          !u && o.createElement(nc, { width: p.width, height: p.height }),
          o.createElement(
            nl,
            nr({}, r, v, { margin: i, chartWidth: f, chartHeight: m, contextPayload: n }),
          ),
        );
        return (0, r$.createPortal)(g, b);
      }, ry.propsAreEqual);
    nu.displayName = 'Legend';
    var np = e.i(72233);
    let nd = ['#007AFF', '#34C759', '#FF9500', '#FF3B30', '#5856D6', '#AF52DE'];
    function nf({ icon: e, label: t, value: r, color: n = '#007AFF' }) {
      return (0, l.jsx)(p.Card, {
        elevation: 0,
        variant: 'outlined',
        sx: { borderRadius: 3 },
        children: (0, l.jsx)(d.CardContent, {
          children: (0, l.jsxs)(m.Box, {
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            children: [
              (0, l.jsx)(m.Box, {
                sx: {
                  p: 1.5,
                  borderRadius: 2.5,
                  backgroundColor: `${n}15`,
                  color: n,
                  display: 'flex',
                },
                children: (0, l.jsx)(e, { size: 24 }),
              }),
              (0, l.jsxs)(m.Box, {
                children: [
                  (0, l.jsx)(f.Typography, { variant: 'h5', sx: { fontWeight: 800 }, children: r }),
                  (0, l.jsx)(f.Typography, {
                    variant: 'body2',
                    color: 'text.secondary',
                    sx: { fontWeight: 500 },
                    children: t,
                  }),
                ],
              }),
            ],
          }),
        }),
      });
    }
    function nm(e) {
      return e.toISOString().split('T')[0] ?? '';
    }
    e.s(
      [
        'default',
        0,
        function () {
          let { t: e } = (0, s.useTranslation)(),
            t = new Date(),
            r = new Date(t.getTime() - 2592e6),
            [n, a] = (0, o.useState)(nm(r)),
            [i, p] = (0, o.useState)(nm(t)),
            [d, A] = (0, o.useState)(null),
            [k, D] = (0, o.useState)(!0),
            [C, z] = (0, o.useState)(null),
            [N, B] = (0, o.useState)([]),
            [R, L] = (0, o.useState)(!0),
            [M, K] = (0, o.useState)(!1),
            F = (0, o.useCallback)(async () => {
              (D(!0), z(null));
              try {
                let { data: e, error: t } = await c.supabaseClient.rpc('get_analytics_summary', {
                  p_start_date: new Date(n).toISOString(),
                  p_end_date: new Date(i + 'T23:59:59').toISOString(),
                });
                if (t) throw t;
                A(e);
              } catch (e) {
                z(e.message || 'Failed to load analytics');
              } finally {
                D(!1);
              }
            }, [n, i]),
            G = (0, o.useCallback)(async () => {
              K(!0);
              try {
                let { data: e, error: t } = await c.supabaseClient.rpc('get_slow_queries', {
                  p_limit: 20,
                });
                if (t) return void L(!1);
                (B((e ?? []).map((e, t) => ({ ...e, id: t }))), L(!0));
              } catch {
                L(!1);
              } finally {
                K(!1);
              }
            }, []);
          if (
            ((0, o.useEffect)(() => {
              (F(), G());
            }, [F, G]),
            k && !d)
          )
            return (0, l.jsx)(m.Box, {
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '80vh',
              children: (0, l.jsx)(y.CircularProgress, {
                thickness: 5,
                size: 60,
                sx: { color: '#007AFF' },
              }),
            });
          let V = d
            ? Object.entries(d.trips_by_status).map(([t, r]) => ({
                name: e(t) || t.replace('_', ' '),
                value: r,
              }))
            : [];
          return (0, l.jsxs)(m.Box, {
            p: { xs: 2, md: 4 },
            children: [
              (0, l.jsxs)(m.Box, {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 4,
                children: [
                  (0, l.jsx)(f.Typography, {
                    variant: 'h4',
                    sx: { fontWeight: 800 },
                    children: e('analytics.title'),
                  }),
                  (0, l.jsx)(x.Tooltip, {
                    title: e('dashboard.refresh'),
                    children: (0, l.jsx)(g.IconButton, {
                      onClick: F,
                      disabled: k,
                      color: 'primary',
                      children: (0, l.jsx)(I.RefreshCw, {
                        size: 24,
                        className: k ? 'animate-spin' : '',
                      }),
                    }),
                  }),
                ],
              }),
              (0, l.jsx)(O.Paper, {
                variant: 'outlined',
                sx: { p: 2, mb: 4, borderRadius: 3 },
                children: (0, l.jsxs)(m.Box, {
                  display: 'flex',
                  gap: 2,
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  children: [
                    (0, l.jsx)(f.Typography, {
                      variant: 'subtitle2',
                      sx: { fontWeight: 700, minWidth: 100 },
                      children: e('analytics.date_range'),
                    }),
                    (0, l.jsx)(h.TextField, {
                      label: e('from'),
                      type: 'date',
                      size: 'small',
                      value: n,
                      onChange: (e) => a(e.target.value),
                      InputLabelProps: { shrink: !0 },
                      sx: { minWidth: 160 },
                    }),
                    (0, l.jsx)(h.TextField, {
                      label: e('to'),
                      type: 'date',
                      size: 'small',
                      value: i,
                      onChange: (e) => p(e.target.value),
                      InputLabelProps: { shrink: !0 },
                      sx: { minWidth: 160 },
                    }),
                    (0, l.jsx)(b.Button, {
                      variant: 'contained',
                      disableElevation: !0,
                      onClick: F,
                      disabled: k,
                      startIcon: k
                        ? (0, l.jsx)(y.CircularProgress, { size: 16, color: 'inherit' })
                        : null,
                      sx: { borderRadius: 2, px: 3 },
                      children: e('analytics.apply'),
                    }),
                    (0, l.jsx)(b.Button, {
                      variant: 'outlined',
                      size: 'small',
                      onClick: () => {
                        (a(nm(r)), p(nm(t)));
                      },
                      sx: { borderRadius: 2 },
                      children: e('analytics.reset'),
                    }),
                  ],
                }),
              }),
              C &&
                (0, l.jsx)(v.Alert, {
                  severity: 'error',
                  sx: { mb: 4, borderRadius: 2 },
                  children: C,
                }),
              d &&
                (0, l.jsxs)(l.Fragment, {
                  children: [
                    (0, l.jsxs)(u.Grid, {
                      container: !0,
                      spacing: 3,
                      mb: 4,
                      children: [
                        (0, l.jsx)(u.Grid, {
                          item: !0,
                          xs: 12,
                          sm: 6,
                          md: 3,
                          children: (0, l.jsx)(nf, {
                            icon: j.Bus,
                            label: e('analytics.kpis.total_trips'),
                            value: d.total_trips,
                            color: '#007AFF',
                          }),
                        }),
                        (0, l.jsx)(u.Grid, {
                          item: !0,
                          xs: 12,
                          sm: 6,
                          md: 3,
                          children: (0, l.jsx)(nf, {
                            icon: P.Users,
                            label: e('analytics.kpis.active_students'),
                            value: d.active_students,
                            color: '#34C759',
                          }),
                        }),
                        (0, l.jsx)(u.Grid, {
                          item: !0,
                          xs: 12,
                          sm: 6,
                          md: 3,
                          children: (0, l.jsx)(nf, {
                            icon: S.CreditCard,
                            label: e('analytics.kpis.revenue'),
                            value: d.total_revenue.toLocaleString(),
                            color: '#FF9500',
                          }),
                        }),
                        (0, l.jsx)(u.Grid, {
                          item: !0,
                          xs: 12,
                          sm: 6,
                          md: 3,
                          children: (0, l.jsx)(nf, {
                            icon: E,
                            label: e('analytics.kpis.avg_rating'),
                            value: d.avg_rating ? `${d.avg_rating} / 5` : 'N/A',
                            color: '#AF52DE',
                          }),
                        }),
                      ],
                    }),
                    (0, l.jsxs)(u.Grid, {
                      container: !0,
                      spacing: 4,
                      mb: 4,
                      children: [
                        (0, l.jsx)(u.Grid, {
                          item: !0,
                          xs: 12,
                          md: 6,
                          children: (0, l.jsxs)(O.Paper, {
                            variant: 'outlined',
                            sx: { p: 3, borderRadius: 3, height: '100%' },
                            children: [
                              (0, l.jsxs)(m.Box, {
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1.5,
                                mb: 3,
                                children: [
                                  (0, l.jsx)(T, { size: 20, color: '#007AFF' }),
                                  (0, l.jsx)(f.Typography, {
                                    variant: 'h6',
                                    sx: { fontWeight: 700 },
                                    children: e('analytics.outcomes.title'),
                                  }),
                                ],
                              }),
                              (0, l.jsx)(m.Box, {
                                sx: { height: 300, width: '100%' },
                                children: (0, l.jsx)(rZ.ResponsiveContainer, {
                                  width: '100%',
                                  height: '100%',
                                  children: (0, l.jsxs)($, {
                                    children: [
                                      (0, l.jsx)(tH, {
                                        data: V,
                                        innerRadius: 60,
                                        outerRadius: 80,
                                        paddingAngle: 5,
                                        dataKey: 'value',
                                        children: V.map((e, t) =>
                                          (0, l.jsx)(ez, { fill: nd[t % nd.length] }, `cell-${t}`),
                                        ),
                                      }),
                                      (0, l.jsx)(rH.Tooltip, {}),
                                      (0, l.jsx)(nu, { verticalAlign: 'bottom', height: 36 }),
                                    ],
                                  }),
                                }),
                              }),
                            ],
                          }),
                        }),
                        (0, l.jsx)(u.Grid, {
                          item: !0,
                          xs: 12,
                          md: 6,
                          children: (0, l.jsxs)(O.Paper, {
                            variant: 'outlined',
                            sx: { p: 3, borderRadius: 3, height: '100%' },
                            children: [
                              (0, l.jsxs)(m.Box, {
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1.5,
                                mb: 3,
                                children: [
                                  (0, l.jsx)(w, { size: 20, color: '#34C759' }),
                                  (0, l.jsx)(f.Typography, {
                                    variant: 'h6',
                                    sx: { fontWeight: 700 },
                                    children: e('dashboard.charts.top_routes'),
                                  }),
                                ],
                              }),
                              (0, l.jsx)(m.Box, {
                                sx: { height: 300, width: '100%' },
                                children: (0, l.jsx)(rZ.ResponsiveContainer, {
                                  width: '100%',
                                  height: '100%',
                                  children: (0, l.jsxs)(tQ, {
                                    data: d.top_routes.slice(0, 5),
                                    layout: 'vertical',
                                    margin: { left: 40, right: 40 },
                                    children: [
                                      (0, l.jsx)(rX.XAxis, { type: 'number', hide: !0 }),
                                      (0, l.jsx)(rY.YAxis, {
                                        dataKey: 'title',
                                        type: 'category',
                                        axisLine: !1,
                                        tickLine: !1,
                                        width: 100,
                                        tick: { fontSize: 11, fontWeight: 600 },
                                      }),
                                      (0, l.jsx)(rH.Tooltip, {}),
                                      (0, l.jsx)(rU, {
                                        dataKey: 'subscriptions',
                                        fill: '#34C759',
                                        radius: [0, 4, 4, 0],
                                        barSize: 20,
                                      }),
                                    ],
                                  }),
                                }),
                              }),
                            ],
                          }),
                        }),
                      ],
                    }),
                    (0, l.jsxs)(m.Box, {
                      mb: 4,
                      children: [
                        (0, l.jsx)(f.Typography, {
                          variant: 'h5',
                          sx: { fontWeight: 800, mb: 3 },
                          children: e('analytics.performance.title'),
                        }),
                        R
                          ? (0, l.jsx)(O.Paper, {
                              variant: 'outlined',
                              sx: { borderRadius: 3, overflow: 'hidden' },
                              children: (0, l.jsx)(np.DataGrid, {
                                rows: N,
                                loading: M,
                                autoHeight: !0,
                                columns: [
                                  {
                                    field: 'query',
                                    headerName: e('analytics.performance.query'),
                                    flex: 3,
                                    renderCell: (e) =>
                                      (0, l.jsx)(x.Tooltip, {
                                        title: e.value,
                                        children: (0, l.jsx)(f.Typography, {
                                          variant: 'body2',
                                          noWrap: !0,
                                          children: e.value,
                                        }),
                                      }),
                                  },
                                  {
                                    field: 'calls',
                                    headerName: e('analytics.performance.calls'),
                                    width: 100,
                                    type: 'number',
                                  },
                                  {
                                    field: 'mean_exec_time',
                                    headerName: e('analytics.performance.avg_ms'),
                                    width: 120,
                                    type: 'number',
                                    valueFormatter: (e) => e?.toFixed(2),
                                  },
                                  {
                                    field: 'total_exec_time',
                                    headerName: e('analytics.performance.total_ms'),
                                    width: 130,
                                    type: 'number',
                                    valueFormatter: (e) => e?.toFixed(2),
                                  },
                                  {
                                    field: 'rows',
                                    headerName: e('analytics.performance.rows'),
                                    width: 100,
                                    type: 'number',
                                  },
                                ],
                                rowsPerPageOptions: [5, 10],
                                initialState: { pagination: { pageSize: 5 } },
                                disableSelectionOnClick: !0,
                                sx: { border: 'none' },
                              }),
                            })
                          : (0, l.jsx)(v.Alert, {
                              severity: 'info',
                              sx: { borderRadius: 2 },
                              children: e('analytics.performance.not_available'),
                            }),
                      ],
                    }),
                  ],
                }),
              (0, l.jsx)('style', {
                children: `
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `,
              }),
            ],
          });
        },
      ],
      41544,
    );
  },
]);
