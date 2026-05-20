(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([
  'object' == typeof document ? document.currentScript : void 0,
  48421,
  (e) => {
    'use strict';
    var t = e.i(37479),
      r = e.i(61129),
      i = e.i(60552);
    e.i(74507);
    var a = e.i(32576),
      n = e.i(24644),
      l = e.i(65311),
      o = e.i(87332),
      s = e.i(20412),
      c = e.i(93502),
      u = e.i(41191),
      d = e.i(29744),
      p = e.i(25417),
      h = e.i(98562),
      y = e.i(3204),
      x = e.i(81796),
      m = e.i(80461),
      f = e.i(80998),
      v = e.i(10316),
      g = e.i(66544),
      b = e.i(77287);
    let j = (0, b.default)('map-pin', [
        [
          'path',
          {
            d: 'M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0',
            key: '1r0f0z',
          },
        ],
        ['circle', { cx: '12', cy: '10', r: '3', key: 'ilqhr7' }],
      ]),
      A = (0, b.default)('activity', [
        [
          'path',
          {
            d: 'M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2',
            key: '169zse',
          },
        ],
      ]),
      E = (0, b.default)('layers', [
        [
          'path',
          {
            d: 'M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z',
            key: 'zw3jo',
          },
        ],
        [
          'path',
          {
            d: 'M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12',
            key: '1wduqc',
          },
        ],
        [
          'path',
          {
            d: 'M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17',
            key: 'kqbvx6',
          },
        ],
      ]),
      P = (0, b.default)('clock', [
        ['circle', { cx: '12', cy: '12', r: '10', key: '1mglay' }],
        ['path', { d: 'M12 6v6l4 2', key: 'mmk7yg' }],
      ]);
    var k = e.i(18623);
    let O = (0, b.default)('trending-up', [
        ['path', { d: 'M16 7h6v6', key: 'box55l' }],
        ['path', { d: 'm22 7-8.5 8.5-5-5L2 17', key: '1t1m79' }],
      ]),
      C = (0, b.default)('circle', [['circle', { cx: '12', cy: '12', r: '10', key: '1mglay' }]]),
      I = (0, b.default)('chevron-right', [['path', { d: 'm9 18 6-6-6-6', key: 'mthhwq' }]]),
      w = (0, b.default)('circle-check-big', [
        ['path', { d: 'M21.801 10A10 10 0 1 1 17 3.335', key: 'yps3ct' }],
        ['path', { d: 'm9 11 3 3L22 4', key: '1pflzl' }],
      ]);
    var N = e.i(11381),
      S = e.i(46116),
      F = e.i(60091),
      T = ['axis'],
      D = (0, r.forwardRef)((e, t) =>
        r.createElement(F.CartesianChart, {
          chartName: 'AreaChart',
          defaultTooltipEventType: 'axis',
          validateTooltipEventTypes: T,
          tooltipPayloadSearcher: S.arrayTooltipSearcher,
          categoricalChartProps: e,
          ref: t,
        }),
      ),
      B = r,
      z = e.i(94083),
      L = e.i(1232),
      _ = e.i(91214),
      G = e.i(57155),
      W = e.i(68078),
      M = e.i(75093),
      R = e.i(49294);
    function K() {
      return (K = Object.assign.bind()).apply(null, arguments);
    }
    var q = (e) => {
        var { cx: t, cy: i, r: a, className: n } = e,
          l = (0, z.clsx)('recharts-dot', n);
        return (0, R.isNumber)(t) && (0, R.isNumber)(i) && (0, R.isNumber)(a)
          ? r.createElement(
              'circle',
              K({}, (0, M.svgPropertiesNoEvents)(e), (0, W.adaptEventHandlers)(e), {
                className: l,
                cx: t,
                cy: i,
                r: a,
              }),
            )
          : null;
      },
      V = e.i(5636),
      U = e.i(73508),
      Z = e.i(7848),
      H = e.i(95916),
      Y = ['points'];
    function X(e, t) {
      var r = Object.keys(e);
      if (Object.getOwnPropertySymbols) {
        var i = Object.getOwnPropertySymbols(e);
        (t &&
          (i = i.filter(function (t) {
            return Object.getOwnPropertyDescriptor(e, t).enumerable;
          })),
          r.push.apply(r, i));
      }
      return r;
    }
    function $(e) {
      for (var t = 1; t < arguments.length; t++) {
        var r = null != arguments[t] ? arguments[t] : {};
        t % 2
          ? X(Object(r), !0).forEach(function (t) {
              var i, a, n;
              ((i = e),
                (a = t),
                (n = r[t]),
                (a = (function (e) {
                  var t = (function (e, t) {
                    if ('object' != typeof e || !e) return e;
                    var r = e[Symbol.toPrimitive];
                    if (void 0 !== r) {
                      var i = r.call(e, t || 'default');
                      if ('object' != typeof i) return i;
                      throw TypeError('@@toPrimitive must return a primitive value.');
                    }
                    return ('string' === t ? String : Number)(e);
                  })(e, 'string');
                  return 'symbol' == typeof t ? t : t + '';
                })(a)) in i
                  ? Object.defineProperty(i, a, {
                      value: n,
                      enumerable: !0,
                      configurable: !0,
                      writable: !0,
                    })
                  : (i[a] = n));
            })
          : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
            : X(Object(r)).forEach(function (t) {
                Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t));
              });
      }
      return e;
    }
    function J() {
      return (J = Object.assign.bind()).apply(null, arguments);
    }
    function Q(e) {
      var { option: t, dotProps: i, className: a } = e;
      if ((0, r.isValidElement)(t)) return (0, r.cloneElement)(t, i);
      if ('function' == typeof t) return t(i);
      var n = (0, z.clsx)(a, 'boolean' != typeof t ? t.className : ''),
        l = null != i ? i : {},
        { points: o } = l,
        s = (function (e, t) {
          if (null == e) return {};
          var r,
            i,
            a = (function (e, t) {
              if (null == e) return {};
              var r = {};
              for (var i in e)
                if ({}.hasOwnProperty.call(e, i)) {
                  if (-1 !== t.indexOf(i)) continue;
                  r[i] = e[i];
                }
              return r;
            })(e, t);
          if (Object.getOwnPropertySymbols) {
            var n = Object.getOwnPropertySymbols(e);
            for (i = 0; i < n.length; i++)
              ((r = n[i]),
                -1 === t.indexOf(r) && {}.propertyIsEnumerable.call(e, r) && (a[r] = e[r]));
          }
          return a;
        })(l, Y);
      return r.createElement(q, J({}, s, { className: n }));
    }
    function ee(e) {
      var {
        points: t,
        dot: i,
        className: a,
        dotClassName: n,
        dataKey: l,
        baseProps: o,
        needClip: s,
        clipPathId: c,
        zIndex: u = H.DefaultZIndexes.scatter,
      } = e;
      if (null == t || (!i && 1 !== t.length)) return null;
      var d = (0, V.isClipDot)(i),
        p = (0, U.svgPropertiesAndEventsFromUnknown)(i),
        h = t.map((e, a) => {
          var s,
            c,
            u = $(
              $($({ r: 3 }, o), p),
              {},
              {
                index: a,
                cx: null != (s = e.x) ? s : void 0,
                cy: null != (c = e.y) ? c : void 0,
                dataKey: l,
                value: e.value,
                payload: e.payload,
                points: t,
              },
            );
          return r.createElement(Q, {
            key: 'dot-'.concat(a),
            option: i,
            dotProps: u,
            className: n,
          });
        }),
        y = {};
      return (
        s && null != c && (y.clipPath = 'url(#clipPath-'.concat(d ? '' : 'dots-').concat(c, ')')),
        r.createElement(
          Z.ZIndexLayer,
          { zIndex: u },
          r.createElement(_.Layer, J({ className: a }, y), h),
        )
      );
    }
    var et = e.i(41469),
      er = e.i(98733),
      ei = e.i(70192),
      ea = e.i(25650);
    function en(e, t) {
      var r = Object.keys(e);
      if (Object.getOwnPropertySymbols) {
        var i = Object.getOwnPropertySymbols(e);
        (t &&
          (i = i.filter(function (t) {
            return Object.getOwnPropertyDescriptor(e, t).enumerable;
          })),
          r.push.apply(r, i));
      }
      return r;
    }
    function el(e) {
      for (var t = 1; t < arguments.length; t++) {
        var r = null != arguments[t] ? arguments[t] : {};
        t % 2
          ? en(Object(r), !0).forEach(function (t) {
              var i, a, n;
              ((i = e),
                (a = t),
                (n = r[t]),
                (a = (function (e) {
                  var t = (function (e, t) {
                    if ('object' != typeof e || !e) return e;
                    var r = e[Symbol.toPrimitive];
                    if (void 0 !== r) {
                      var i = r.call(e, t || 'default');
                      if ('object' != typeof i) return i;
                      throw TypeError('@@toPrimitive must return a primitive value.');
                    }
                    return ('string' === t ? String : Number)(e);
                  })(e, 'string');
                  return 'symbol' == typeof t ? t : t + '';
                })(a)) in i
                  ? Object.defineProperty(i, a, {
                      value: n,
                      enumerable: !0,
                      configurable: !0,
                      writable: !0,
                    })
                  : (i[a] = n));
            })
          : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
            : en(Object(r)).forEach(function (t) {
                Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t));
              });
      }
      return e;
    }
    var eo = (e) => {
      var t,
        { point: i, childIndex: a, mainColor: n, activeDot: l, dataKey: o, clipPath: s } = e;
      if (!1 === l || null == i.x || null == i.y) return null;
      var c = el(
        el(
          el(
            {},
            {
              index: a,
              dataKey: o,
              cx: i.x,
              cy: i.y,
              r: 4,
              fill: null != n ? n : 'none',
              strokeWidth: 2,
              stroke: '#fff',
              payload: i.payload,
              value: i.value,
            },
          ),
          (0, M.svgPropertiesNoEventsFromUnknown)(l),
        ),
        (0, W.adaptEventHandlers)(l),
      );
      return (
        (t = (0, r.isValidElement)(l)
          ? (0, r.cloneElement)(l, c)
          : 'function' == typeof l
            ? l(c)
            : r.createElement(q, c)),
        r.createElement(_.Layer, { className: 'recharts-active-dot', clipPath: s }, t)
      );
    };
    function es(e) {
      var {
          points: t,
          mainColor: i,
          activeDot: a,
          itemDataKey: n,
          clipPath: l,
          zIndex: o = H.DefaultZIndexes.activeDot,
        } = e,
        s = (0, er.useAppSelector)(ei.selectActiveTooltipIndex),
        c = (0, ea.useActiveTooltipDataPoints)();
      if (null == t || null == c) return null;
      var u = t.find((e) => c.includes(e.payload));
      return (0, R.isNullish)(u)
        ? null
        : r.createElement(
            Z.ZIndexLayer,
            { zIndex: o },
            r.createElement(eo, {
              point: u,
              childIndex: Number(s),
              mainColor: i,
              dataKey: n,
              activeDot: a,
              clipPath: l,
            }),
          );
    }
    var ec = e.i(88514),
      eu = e.i(96459),
      ed = e.i(29576),
      ep = e.i(58644),
      eh = e.i(77314),
      ey = e.i(63203),
      ex = e.i(61427),
      em = e.i(76108),
      ef = e.i(42965),
      ev = (e, t, r) =>
        (0, ep.selectAxisWithScale)(e, 'xAxis', (0, ef.selectXAxisIdFromGraphicalItemId)(e, t), r),
      eg = (e, t, r) =>
        (0, ep.selectTicksOfGraphicalItem)(
          e,
          'xAxis',
          (0, ef.selectXAxisIdFromGraphicalItemId)(e, t),
          r,
        ),
      eb = (e, t, r) =>
        (0, ep.selectAxisWithScale)(e, 'yAxis', (0, ef.selectYAxisIdFromGraphicalItemId)(e, t), r),
      ej = (e, t, r) =>
        (0, ep.selectTicksOfGraphicalItem)(
          e,
          'yAxis',
          (0, ef.selectYAxisIdFromGraphicalItemId)(e, t),
          r,
        ),
      eA = (0, ed.createSelector)([eh.selectChartLayout, ev, eb, eg, ej], (e, t, r, i, a) =>
        (0, et.isCategoricalAxis)(e, 'xAxis')
          ? (0, et.getBandSizeOfAxis)(t, i, !1)
          : (0, et.getBandSizeOfAxis)(r, a, !1),
      ),
      eE = (0, ed.createSelector)([ep.selectUnfilteredCartesianItems, (e, t) => t], (e, t) =>
        e.filter((e) => 'area' === e.type).find((e) => e.id === t),
      ),
      eP = (e) => {
        var t = (0, eh.selectChartLayout)(e);
        return (0, et.isCategoricalAxis)(t, 'xAxis') ? 'yAxis' : 'xAxis';
      },
      ek = (0, ed.createSelector)(
        [
          eE,
          (e, t, r) =>
            (0, ep.selectStackGroups)(
              e,
              eP(e),
              'yAxis' === eP(e)
                ? (0, ef.selectYAxisIdFromGraphicalItemId)(e, t)
                : (0, ef.selectXAxisIdFromGraphicalItemId)(e, t),
              r,
            ),
        ],
        (e, t) => {
          if (null != e && null != t) {
            var r,
              { stackId: i } = e,
              a = (0, ex.getStackSeriesIdentifier)(e);
            if (null != i && null != a) {
              var n = null == (r = t[i]) ? void 0 : r.stackedData,
                l = null == n ? void 0 : n.find((e) => e.key === a);
              if (null != l) return l.map((e) => [e[0], e[1]]);
            }
          }
        },
      ),
      eO = (0, ed.createSelector)(
        [
          eh.selectChartLayout,
          ev,
          eb,
          eg,
          ej,
          ek,
          ey.selectChartDataWithIndexesIfNotInPanoramaPosition3,
          eA,
          eE,
          em.selectChartBaseValue,
        ],
        (e, t, r, i, a, n, l, o, s, c) => {
          var u,
            { chartData: d, dataStartIndex: p, dataEndIndex: h } = l;
          if (
            null != s &&
            ('horizontal' === e || 'vertical' === e) &&
            null != t &&
            null != r &&
            null != i &&
            null != a &&
            0 !== i.length &&
            0 !== a.length &&
            null != o
          ) {
            var { data: y } = s;
            if (null != (u = y && y.length > 0 ? y : null == d ? void 0 : d.slice(p, h + 1)))
              return (function (e) {
                var t,
                  {
                    areaSettings: { connectNulls: r, baseValue: i, dataKey: a },
                    stackedData: n,
                    layout: l,
                    chartBaseValue: o,
                    xAxis: s,
                    yAxis: c,
                    displayedData: u,
                    dataStartIndex: d,
                    xAxisTicks: p,
                    yAxisTicks: h,
                    bandSize: y,
                  } = e,
                  x = n && n.length,
                  m = ((e, t, r, i, a) => {
                    var n = null != r ? r : t;
                    if ((0, R.isNumber)(n)) return n;
                    var l = 'horizontal' === e ? a : i,
                      o = l.scale.domain();
                    if ('number' === l.type) {
                      var s = Math.max(o[0], o[1]),
                        c = Math.min(o[0], o[1]);
                      return 'dataMin' === n
                        ? c
                        : 'dataMax' === n || s < 0
                          ? s
                          : Math.max(Math.min(o[0], o[1]), 0);
                    }
                    return 'dataMin' === n ? o[0] : 'dataMax' === n ? o[1] : o[0];
                  })(l, o, i, s, c),
                  f = 'horizontal' === l,
                  v = !1,
                  g = u.map((e, t) => {
                    if (x) u = n[d + t];
                    else {
                      var i,
                        l,
                        o,
                        u,
                        g,
                        b = (0, et.getValueByDataKey)(e, a);
                      Array.isArray(b) ? ((u = b), (v = !0)) : (u = [m, b]);
                    }
                    var j = null != (i = null == (l = u) ? void 0 : l[1]) ? i : null,
                      A = null == j || (x && !r && null == (0, et.getValueByDataKey)(e, a));
                    return f
                      ? {
                          x: (0, et.getCateCoordinateOfLine)({
                            axis: s,
                            ticks: p,
                            bandSize: y,
                            entry: e,
                            index: t,
                          }),
                          y: A ? null : null != (g = c.scale.map(j)) ? g : null,
                          value: u,
                          payload: e,
                        }
                      : {
                          x: A ? null : null != (o = s.scale.map(j)) ? o : null,
                          y: (0, et.getCateCoordinateOfLine)({
                            axis: c,
                            ticks: h,
                            bandSize: y,
                            entry: e,
                            index: t,
                          }),
                          value: u,
                          payload: e,
                        };
                  });
                return (
                  (t =
                    x || v
                      ? g.map((e) => {
                          var t,
                            r,
                            i = Array.isArray(e.value) ? e.value[0] : null;
                          return f
                            ? {
                                x: e.x,
                                y:
                                  null != i && null != e.y && null != (r = c.scale.map(i))
                                    ? r
                                    : null,
                                payload: e.payload,
                              }
                            : {
                                x: null != i && null != (t = s.scale.map(i)) ? t : null,
                                y: e.y,
                                payload: e.payload,
                              };
                        })
                      : f
                        ? c.scale.map(m)
                        : s.scale.map(m)),
                  { points: g, baseLine: null != t ? t : 0, isRange: v }
                );
              })({
                layout: e,
                xAxis: t,
                yAxis: r,
                xAxisTicks: i,
                yAxisTicks: a,
                dataStartIndex: p,
                areaSettings: s,
                stackedData: n,
                displayedData: u,
                chartBaseValue: c,
                bandSize: o,
              });
          }
        },
      ),
      eC = e.i(57632),
      eI = e.i(92544),
      ew = e.i(65573),
      eN = e.i(14742),
      eS = e.i(75448),
      eF = e.i(25894),
      eT = e.i(91595),
      eD = e.i(76619),
      eB = e.i(62409),
      ez = e.i(97943),
      eL = ['id'],
      e_ = [
        'activeDot',
        'animationBegin',
        'animationDuration',
        'animationEasing',
        'connectNulls',
        'dot',
        'fill',
        'fillOpacity',
        'hide',
        'isAnimationActive',
        'legendType',
        'stroke',
        'xAxisId',
        'yAxisId',
      ];
    function eG() {
      return (eG = Object.assign.bind()).apply(null, arguments);
    }
    function eW(e, t) {
      if (null == e) return {};
      var r,
        i,
        a = (function (e, t) {
          if (null == e) return {};
          var r = {};
          for (var i in e)
            if ({}.hasOwnProperty.call(e, i)) {
              if (-1 !== t.indexOf(i)) continue;
              r[i] = e[i];
            }
          return r;
        })(e, t);
      if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(e);
        for (i = 0; i < n.length; i++)
          ((r = n[i]), -1 === t.indexOf(r) && {}.propertyIsEnumerable.call(e, r) && (a[r] = e[r]));
      }
      return a;
    }
    function eM(e, t) {
      var r = Object.keys(e);
      if (Object.getOwnPropertySymbols) {
        var i = Object.getOwnPropertySymbols(e);
        (t &&
          (i = i.filter(function (t) {
            return Object.getOwnPropertyDescriptor(e, t).enumerable;
          })),
          r.push.apply(r, i));
      }
      return r;
    }
    function eR(e) {
      for (var t = 1; t < arguments.length; t++) {
        var r = null != arguments[t] ? arguments[t] : {};
        t % 2
          ? eM(Object(r), !0).forEach(function (t) {
              var i, a, n;
              ((i = e),
                (a = t),
                (n = r[t]),
                (a = (function (e) {
                  var t = (function (e, t) {
                    if ('object' != typeof e || !e) return e;
                    var r = e[Symbol.toPrimitive];
                    if (void 0 !== r) {
                      var i = r.call(e, t || 'default');
                      if ('object' != typeof i) return i;
                      throw TypeError('@@toPrimitive must return a primitive value.');
                    }
                    return ('string' === t ? String : Number)(e);
                  })(e, 'string');
                  return 'symbol' == typeof t ? t : t + '';
                })(a)) in i
                  ? Object.defineProperty(i, a, {
                      value: n,
                      enumerable: !0,
                      configurable: !0,
                      writable: !0,
                    })
                  : (i[a] = n));
            })
          : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
            : eM(Object(r)).forEach(function (t) {
                Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t));
              });
      }
      return e;
    }
    function eK(e, t) {
      return e && 'none' !== e ? e : t;
    }
    var eq = B.memo((e) => {
      var {
          dataKey: t,
          data: r,
          stroke: i,
          strokeWidth: a,
          fill: n,
          name: l,
          hide: o,
          unit: s,
          tooltipType: c,
          id: u,
        } = e,
        d = {
          dataDefinedOnItem: r,
          getPosition: R.noop,
          settings: {
            stroke: i,
            strokeWidth: a,
            fill: n,
            dataKey: t,
            nameKey: void 0,
            name: (0, et.getTooltipNameProp)(l, t),
            hide: o,
            type: c,
            color: eK(i, n),
            unit: s,
            graphicalItemId: u,
          },
        };
      return B.createElement(ec.SetTooltipEntrySettings, { tooltipEntrySettings: d });
    });
    function eV(e) {
      var { clipPathId: t, points: r, props: i } = e,
        { needClip: a, dot: n, dataKey: l } = i,
        o = (0, M.svgPropertiesNoEvents)(i);
      return B.createElement(ee, {
        points: r,
        dot: n,
        className: 'recharts-area-dots',
        dotClassName: 'recharts-area-dot',
        dataKey: l,
        baseProps: o,
        needClip: a,
        clipPathId: t,
      });
    }
    function eU(e) {
      var { showLabels: t, children: r, points: i } = e,
        a = i.map((e) => {
          var t,
            r,
            i = {
              x: null != (t = e.x) ? t : 0,
              y: null != (r = e.y) ? r : 0,
              width: 0,
              lowerWidth: 0,
              upperWidth: 0,
              height: 0,
            };
          return eR(
            eR({}, i),
            {},
            { value: e.value, payload: e.payload, parentViewBox: void 0, viewBox: i, fill: void 0 },
          );
        });
      return B.createElement(G.CartesianLabelListContextProvider, { value: t ? a : void 0 }, r);
    }
    function eZ(e) {
      var { points: t, baseLine: r, needClip: i, clipPathId: a, props: n } = e,
        { layout: l, type: o, stroke: s, connectNulls: c, isRange: u } = n,
        { id: d } = n,
        p = eW(n, eL),
        h = (0, M.svgPropertiesNoEvents)(p),
        y = (0, U.svgPropertiesAndEvents)(p);
      return B.createElement(
        B.Fragment,
        null,
        (null == t ? void 0 : t.length) > 1 &&
          B.createElement(
            _.Layer,
            { clipPath: i ? 'url(#clipPath-'.concat(a, ')') : void 0 },
            B.createElement(
              L.Curve,
              eG({}, y, {
                id: d,
                points: t,
                connectNulls: c,
                type: o,
                baseLine: r,
                layout: l,
                stroke: 'none',
                className: 'recharts-area-area',
              }),
            ),
            'none' !== s &&
              B.createElement(
                L.Curve,
                eG({}, h, {
                  className: 'recharts-area-curve',
                  layout: l,
                  type: o,
                  connectNulls: c,
                  fill: 'none',
                  points: t,
                }),
              ),
            'none' !== s &&
              u &&
              Array.isArray(r) &&
              B.createElement(
                L.Curve,
                eG({}, h, {
                  className: 'recharts-area-curve',
                  layout: l,
                  type: o,
                  connectNulls: c,
                  fill: 'none',
                  points: r,
                }),
              ),
          ),
        B.createElement(eV, { points: t, props: p, clipPathId: a }),
      );
    }
    function eH(e) {
      var t,
        r,
        { alpha: i, baseLine: a, points: n, strokeWidth: l } = e,
        o = null == (t = n[0]) ? void 0 : t.y,
        s = null == (r = n[n.length - 1]) ? void 0 : r.y;
      if (!(0, eF.isWellBehavedNumber)(o) || !(0, eF.isWellBehavedNumber)(s)) return null;
      var c = i * Math.abs(o - s),
        u = Math.max(...n.map((e) => e.x || 0));
      return ((0, R.isNumber)(a)
        ? (u = Math.max(a, u))
        : a && Array.isArray(a) && a.length && (u = Math.max(...a.map((e) => e.x || 0), u)),
      (0, R.isNumber)(u))
        ? B.createElement('rect', {
            x: 0,
            y: o < s ? o : o - c,
            width: u + (l ? parseInt(''.concat(l), 10) : 1),
            height: Math.floor(c),
          })
        : null;
    }
    function eY(e) {
      var t,
        r,
        { alpha: i, baseLine: a, points: n, strokeWidth: l } = e,
        o = null == (t = n[0]) ? void 0 : t.x,
        s = null == (r = n[n.length - 1]) ? void 0 : r.x;
      if (!(0, eF.isWellBehavedNumber)(o) || !(0, eF.isWellBehavedNumber)(s)) return null;
      var c = i * Math.abs(o - s),
        u = Math.max(...n.map((e) => e.y || 0));
      return ((0, R.isNumber)(a)
        ? (u = Math.max(a, u))
        : a && Array.isArray(a) && a.length && (u = Math.max(...a.map((e) => e.y || 0), u)),
      (0, R.isNumber)(u))
        ? B.createElement('rect', {
            x: o < s ? o : o - c,
            y: 0,
            width: c,
            height: Math.floor(u + (l ? parseInt(''.concat(l), 10) : 1)),
          })
        : null;
    }
    function eX(e) {
      var { alpha: t, layout: r, points: i, baseLine: a, strokeWidth: n } = e;
      return 'vertical' === r
        ? B.createElement(eH, { alpha: t, points: i, baseLine: a, strokeWidth: n })
        : B.createElement(eY, { alpha: t, points: i, baseLine: a, strokeWidth: n });
    }
    function e$(e) {
      var {
          needClip: t,
          clipPathId: r,
          props: i,
          previousPointsRef: a,
          previousBaselineRef: n,
        } = e,
        {
          points: l,
          baseLine: o,
          isAnimationActive: s,
          animationBegin: c,
          animationDuration: u,
          animationEasing: d,
          onAnimationStart: p,
          onAnimationEnd: h,
        } = i,
        y = (0, B.useMemo)(() => ({ points: l, baseLine: o }), [l, o]),
        x = (0, eN.useAnimationId)(y, 'recharts-area-'),
        m = (0, eh.useCartesianChartLayout)(),
        [f, v] = (0, B.useState)(!1),
        g = (0, B.useCallback)(() => {
          ('function' == typeof h && h(), v(!1));
        }, [h]),
        b = (0, B.useCallback)(() => {
          ('function' == typeof p && p(), v(!0));
        }, [p]);
      if (null == m) return null;
      var j = a.current,
        A = n.current;
      return B.createElement(
        eU,
        { showLabels: !f, points: l },
        i.children,
        B.createElement(
          eB.JavascriptAnimate,
          {
            animationId: x,
            begin: c,
            duration: u,
            isActive: s,
            easing: d,
            onAnimationEnd: g,
            onAnimationStart: b,
            key: x,
          },
          (e) => {
            if (j) {
              var c,
                u = j.length / l.length,
                d =
                  1 === e
                    ? l
                    : l.map((t, r) => {
                        var i = Math.floor(r * u);
                        if (j[i]) {
                          var a = j[i];
                          return eR(
                            eR({}, t),
                            {},
                            {
                              x: (0, R.interpolate)(a.x, t.x, e),
                              y: (0, R.interpolate)(a.y, t.y, e),
                            },
                          );
                        }
                        return t;
                      });
              return (
                (c = (0, R.isNumber)(o)
                  ? (0, R.interpolate)(A, o, e)
                  : (0, R.isNullish)(o) || (0, R.isNan)(o)
                    ? (0, R.interpolate)(A, 0, e)
                    : o.map((t, r) => {
                        var i = Math.floor(r * u);
                        if (Array.isArray(A) && A[i]) {
                          var a = A[i];
                          return eR(
                            eR({}, t),
                            {},
                            {
                              x: (0, R.interpolate)(a.x, t.x, e),
                              y: (0, R.interpolate)(a.y, t.y, e),
                            },
                          );
                        }
                        return t;
                      })),
                e > 0 && ((a.current = d), (n.current = c)),
                B.createElement(eZ, {
                  points: d,
                  baseLine: c,
                  needClip: t,
                  clipPathId: r,
                  props: i,
                })
              );
            }
            return (
              e > 0 && ((a.current = l), (n.current = o)),
              B.createElement(
                _.Layer,
                null,
                s &&
                  B.createElement(
                    'defs',
                    null,
                    B.createElement(
                      'clipPath',
                      { id: 'animationClipPath-'.concat(r) },
                      B.createElement(eX, {
                        alpha: e,
                        points: l,
                        baseLine: o,
                        layout: m,
                        strokeWidth: i.strokeWidth,
                      }),
                    ),
                  ),
                B.createElement(
                  _.Layer,
                  { clipPath: 'url(#animationClipPath-'.concat(r, ')') },
                  B.createElement(eZ, {
                    points: l,
                    baseLine: o,
                    needClip: t,
                    clipPathId: r,
                    props: i,
                  }),
                ),
              )
            );
          },
        ),
        B.createElement(G.LabelListFromLabelProp, { label: i.label }),
      );
    }
    function eJ(e) {
      var { needClip: t, clipPathId: r, props: i } = e,
        a = (0, B.useRef)(null),
        n = (0, B.useRef)();
      return B.createElement(e$, {
        needClip: t,
        clipPathId: r,
        props: i,
        previousPointsRef: a,
        previousBaselineRef: n,
      });
    }
    class eQ extends B.PureComponent {
      render() {
        var {
          hide: e,
          dot: t,
          points: r,
          className: i,
          top: a,
          left: n,
          needClip: l,
          xAxisId: o,
          yAxisId: s,
          width: c,
          height: u,
          id: d,
          baseLine: p,
          zIndex: h,
        } = this.props;
        if (e) return null;
        var y = (0, z.clsx)('recharts-area', i),
          { r: x, strokeWidth: m } = (function (e) {
            var t = (0, M.svgPropertiesNoEventsFromUnknown)(e);
            if (null != t) {
              var { r, strokeWidth: i } = t,
                a = Number(r),
                n = Number(i);
              return (
                (Number.isNaN(a) || a < 0) && (a = 3),
                (Number.isNaN(n) || n < 0) && (n = 2),
                { r: a, strokeWidth: n }
              );
            }
            return { r: 3, strokeWidth: 2 };
          })(t),
          f = (0, V.isClipDot)(t),
          v = 2 * x + m,
          g = l ? 'url(#clipPath-'.concat(f ? '' : 'dots-').concat(d, ')') : void 0;
        return B.createElement(
          Z.ZIndexLayer,
          { zIndex: h },
          B.createElement(
            _.Layer,
            { className: y },
            l &&
              B.createElement(
                'defs',
                null,
                B.createElement(eu.GraphicalItemClipPath, {
                  clipPathId: d,
                  xAxisId: o,
                  yAxisId: s,
                }),
                !f &&
                  B.createElement(
                    'clipPath',
                    { id: 'clipPath-dots-'.concat(d) },
                    B.createElement('rect', {
                      x: n - v / 2,
                      y: a - v / 2,
                      width: c + v,
                      height: u + v,
                    }),
                  ),
              ),
            B.createElement(eJ, { needClip: l, clipPathId: d, props: this.props }),
          ),
          B.createElement(es, {
            points: r,
            mainColor: eK(this.props.stroke, this.props.fill),
            itemDataKey: this.props.dataKey,
            activeDot: this.props.activeDot,
            clipPath: g,
          }),
          this.props.isRange &&
            Array.isArray(p) &&
            B.createElement(es, {
              points: p,
              mainColor: eK(this.props.stroke, this.props.fill),
              itemDataKey: this.props.dataKey,
              activeDot: this.props.activeDot,
              clipPath: g,
            }),
        );
      }
    }
    var e0 = {
      activeDot: !0,
      animationBegin: 0,
      animationDuration: 1500,
      animationEasing: 'ease',
      connectNulls: !1,
      dot: !1,
      fill: '#3182bd',
      fillOpacity: 0.6,
      hide: !1,
      isAnimationActive: 'auto',
      legendType: 'line',
      stroke: '#3182bd',
      strokeWidth: 1,
      type: 'linear',
      label: !1,
      xAxisId: 0,
      yAxisId: 0,
      zIndex: H.DefaultZIndexes.area,
    };
    function e1(e) {
      var t,
        {
          activeDot: r,
          animationBegin: i,
          animationDuration: a,
          animationEasing: n,
          connectNulls: l,
          dot: o,
          fill: s,
          fillOpacity: c,
          hide: u,
          isAnimationActive: d,
          legendType: p,
          stroke: h,
          xAxisId: y,
          yAxisId: x,
        } = e,
        m = eW(e, e_),
        f = (0, eh.useChartLayout)(),
        v = (0, eI.useChartName)(),
        { needClip: g } = (0, eu.useNeedsClip)(y, x),
        b = (0, eC.useIsPanorama)(),
        {
          points: j,
          isRange: A,
          baseLine: E,
        } = null != (t = (0, er.useAppSelector)((t) => eO(t, e.id, b))) ? t : {},
        P = (0, ea.usePlotArea)();
      if (
        ('horizontal' !== f && 'vertical' !== f) ||
        null == P ||
        ('AreaChart' !== v && 'ComposedChart' !== v)
      )
        return null;
      var { height: k, width: O, x: C, y: I } = P;
      return j && j.length
        ? B.createElement(
            eQ,
            eG({}, m, {
              activeDot: r,
              animationBegin: i,
              animationDuration: a,
              animationEasing: n,
              baseLine: E,
              connectNulls: l,
              dot: o,
              fill: s,
              fillOpacity: c,
              height: k,
              hide: u,
              layout: f,
              isAnimationActive: d,
              isRange: A,
              legendType: p,
              needClip: g,
              points: j,
              stroke: h,
              width: O,
              left: C,
              top: I,
              xAxisId: y,
              yAxisId: x,
            }),
          )
        : null;
    }
    var e2 = B.memo(function (e) {
      var t = (0, eS.resolveDefaultProps)(e, e0),
        r = (0, eC.useIsPanorama)();
      return B.createElement(eT.RegisterGraphicalItemId, { id: t.id, type: 'area' }, (e) =>
        B.createElement(
          B.Fragment,
          null,
          B.createElement(ew.SetLegendPayload, {
            legendPayload: ((e) => {
              var { dataKey: t, name: r, stroke: i, fill: a, legendType: n, hide: l } = e;
              return [
                {
                  inactive: l,
                  dataKey: t,
                  type: n,
                  color: eK(i, a),
                  value: (0, et.getTooltipNameProp)(r, t),
                  payload: e,
                },
              ];
            })(t),
          }),
          B.createElement(eq, {
            dataKey: t.dataKey,
            data: t.data,
            stroke: t.stroke,
            strokeWidth: t.strokeWidth,
            fill: t.fill,
            name: t.name,
            hide: t.hide,
            unit: t.unit,
            tooltipType: t.tooltipType,
            id: e,
          }),
          B.createElement(eD.SetCartesianGraphicalItem, {
            type: 'area',
            id: e,
            data: t.data,
            dataKey: t.dataKey,
            xAxisId: t.xAxisId,
            yAxisId: t.yAxisId,
            zAxisId: 0,
            stackId: (0, et.getNormalizedStackId)(t.stackId),
            hide: t.hide,
            barSize: void 0,
            baseValue: t.baseValue,
            isPanorama: r,
            connectNulls: t.connectNulls,
          }),
          B.createElement(e1, eG({}, t, { id: e })),
        ),
      );
    }, ez.propsAreEqual);
    e2.displayName = 'Area';
    var e5 = e.i(19834),
      e3 = e.i(6855),
      e4 = e.i(20178),
      e6 = e.i(5784),
      e8 = e.i(29788),
      e9 = ['x1', 'y1', 'x2', 'y2', 'key'],
      e7 = ['offset'],
      te = ['xAxisId', 'yAxisId'],
      tt = ['xAxisId', 'yAxisId'];
    function tr(e, t) {
      var r = Object.keys(e);
      if (Object.getOwnPropertySymbols) {
        var i = Object.getOwnPropertySymbols(e);
        (t &&
          (i = i.filter(function (t) {
            return Object.getOwnPropertyDescriptor(e, t).enumerable;
          })),
          r.push.apply(r, i));
      }
      return r;
    }
    function ti(e) {
      for (var t = 1; t < arguments.length; t++) {
        var r = null != arguments[t] ? arguments[t] : {};
        t % 2
          ? tr(Object(r), !0).forEach(function (t) {
              var i, a, n;
              ((i = e),
                (a = t),
                (n = r[t]),
                (a = (function (e) {
                  var t = (function (e, t) {
                    if ('object' != typeof e || !e) return e;
                    var r = e[Symbol.toPrimitive];
                    if (void 0 !== r) {
                      var i = r.call(e, t || 'default');
                      if ('object' != typeof i) return i;
                      throw TypeError('@@toPrimitive must return a primitive value.');
                    }
                    return ('string' === t ? String : Number)(e);
                  })(e, 'string');
                  return 'symbol' == typeof t ? t : t + '';
                })(a)) in i
                  ? Object.defineProperty(i, a, {
                      value: n,
                      enumerable: !0,
                      configurable: !0,
                      writable: !0,
                    })
                  : (i[a] = n));
            })
          : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
            : tr(Object(r)).forEach(function (t) {
                Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t));
              });
      }
      return e;
    }
    function ta() {
      return (ta = Object.assign.bind()).apply(null, arguments);
    }
    function tn(e, t) {
      if (null == e) return {};
      var r,
        i,
        a = (function (e, t) {
          if (null == e) return {};
          var r = {};
          for (var i in e)
            if ({}.hasOwnProperty.call(e, i)) {
              if (-1 !== t.indexOf(i)) continue;
              r[i] = e[i];
            }
          return r;
        })(e, t);
      if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(e);
        for (i = 0; i < n.length; i++)
          ((r = n[i]), -1 === t.indexOf(r) && {}.propertyIsEnumerable.call(e, r) && (a[r] = e[r]));
      }
      return a;
    }
    var tl = (e) => {
      var { fill: t } = e;
      if (!t || 'none' === t) return null;
      var { fillOpacity: i, x: a, y: n, width: l, height: o, ry: s } = e;
      return r.createElement('rect', {
        x: a,
        y: n,
        ry: s,
        width: l,
        height: o,
        stroke: 'none',
        fill: t,
        fillOpacity: i,
        className: 'recharts-cartesian-grid-bg',
      });
    };
    function to(e) {
      var { option: t, lineItemProps: i } = e;
      if (r.isValidElement(t)) a = r.cloneElement(t, i);
      else if ('function' == typeof t) a = t(i);
      else {
        var a,
          n,
          { x1: l, y1: o, x2: s, y2: c, key: u } = i,
          d = tn(i, e9),
          p = null != (n = (0, M.svgPropertiesNoEvents)(d)) ? n : {},
          { offset: h } = p,
          y = tn(p, e7);
        a = r.createElement(
          'line',
          ta({}, y, { x1: l, y1: o, x2: s, y2: c, fill: 'none', key: u }),
        );
      }
      return a;
    }
    function ts(e) {
      var { x: t, width: i, horizontal: a = !0, horizontalPoints: n } = e;
      if (!a || !n || !n.length) return null;
      var { xAxisId: l, yAxisId: o } = e,
        s = tn(e, te),
        c = n.map((e, n) => {
          var l = ti(
            ti({}, s),
            {},
            { x1: t, y1: e, x2: t + i, y2: e, key: 'line-'.concat(n), index: n },
          );
          return r.createElement(to, { key: 'line-'.concat(n), option: a, lineItemProps: l });
        });
      return r.createElement('g', { className: 'recharts-cartesian-grid-horizontal' }, c);
    }
    function tc(e) {
      var { y: t, height: i, vertical: a = !0, verticalPoints: n } = e;
      if (!a || !n || !n.length) return null;
      var { xAxisId: l, yAxisId: o } = e,
        s = tn(e, tt),
        c = n.map((e, n) => {
          var l = ti(
            ti({}, s),
            {},
            { x1: e, y1: t, x2: e, y2: t + i, key: 'line-'.concat(n), index: n },
          );
          return r.createElement(to, { option: a, lineItemProps: l, key: 'line-'.concat(n) });
        });
      return r.createElement('g', { className: 'recharts-cartesian-grid-vertical' }, c);
    }
    function tu(e) {
      var {
        horizontalFill: t,
        fillOpacity: i,
        x: a,
        y: n,
        width: l,
        height: o,
        horizontalPoints: s,
        horizontal: c = !0,
      } = e;
      if (!c || !t || !t.length || null == s) return null;
      var u = s.map((e) => Math.round(e + n - n)).sort((e, t) => e - t);
      n !== u[0] && u.unshift(0);
      var d = u.map((e, s) => {
        var c = u[s + 1],
          d = null == c ? n + o - e : c - e;
        if (d <= 0) return null;
        var p = s % t.length;
        return r.createElement('rect', {
          key: 'react-'.concat(s),
          y: e,
          x: a,
          height: d,
          width: l,
          stroke: 'none',
          fill: t[p],
          fillOpacity: i,
          className: 'recharts-cartesian-grid-bg',
        });
      });
      return r.createElement('g', { className: 'recharts-cartesian-gridstripes-horizontal' }, d);
    }
    function td(e) {
      var {
        vertical: t = !0,
        verticalFill: i,
        fillOpacity: a,
        x: n,
        y: l,
        width: o,
        height: s,
        verticalPoints: c,
      } = e;
      if (!t || !i || !i.length) return null;
      var u = c.map((e) => Math.round(e + n - n)).sort((e, t) => e - t);
      n !== u[0] && u.unshift(0);
      var d = u.map((e, t) => {
        var c = u[t + 1],
          d = null == c ? n + o - e : c - e;
        if (d <= 0) return null;
        var p = t % i.length;
        return r.createElement('rect', {
          key: 'react-'.concat(t),
          x: e,
          y: l,
          width: d,
          height: s,
          stroke: 'none',
          fill: i[p],
          fillOpacity: a,
          className: 'recharts-cartesian-grid-bg',
        });
      });
      return r.createElement('g', { className: 'recharts-cartesian-gridstripes-vertical' }, d);
    }
    var tp = (e, t) => {
        var { xAxis: r, width: i, height: a, offset: n } = e;
        return (0, et.getCoordinatesOfGrid)(
          (0, e6.getTicks)(
            ti(
              ti(ti({}, e8.defaultCartesianAxisProps), r),
              {},
              {
                ticks: (0, et.getTicksOfAxis)(r, !0),
                viewBox: { x: 0, y: 0, width: i, height: a },
              },
            ),
          ),
          n.left,
          n.left + n.width,
          t,
        );
      },
      th = (e, t) => {
        var { yAxis: r, width: i, height: a, offset: n } = e;
        return (0, et.getCoordinatesOfGrid)(
          (0, e6.getTicks)(
            ti(
              ti(ti({}, e8.defaultCartesianAxisProps), r),
              {},
              {
                ticks: (0, et.getTicksOfAxis)(r, !0),
                viewBox: { x: 0, y: 0, width: i, height: a },
              },
            ),
          ),
          n.top,
          n.top + n.height,
          t,
        );
      },
      ty = {
        horizontal: !0,
        vertical: !0,
        horizontalPoints: [],
        verticalPoints: [],
        stroke: '#ccc',
        fill: 'none',
        verticalFill: [],
        horizontalFill: [],
        xAxisId: 0,
        yAxisId: 0,
        syncWithTicks: !1,
        zIndex: H.DefaultZIndexes.grid,
      };
    function tx(e) {
      var t = (0, eh.useChartWidth)(),
        i = (0, eh.useChartHeight)(),
        a = (0, eh.useOffsetInternal)(),
        n = ti(
          ti({}, (0, eS.resolveDefaultProps)(e, ty)),
          {},
          {
            x: (0, R.isNumber)(e.x) ? e.x : a.left,
            y: (0, R.isNumber)(e.y) ? e.y : a.top,
            width: (0, R.isNumber)(e.width) ? e.width : a.width,
            height: (0, R.isNumber)(e.height) ? e.height : a.height,
          },
        ),
        {
          xAxisId: l,
          yAxisId: o,
          x: s,
          y: c,
          width: u,
          height: d,
          syncWithTicks: p,
          horizontalValues: h,
          verticalValues: y,
        } = n,
        x = (0, eC.useIsPanorama)(),
        m = (0, er.useAppSelector)((e) =>
          (0, ep.selectAxisPropsNeededForCartesianGridTicksGenerator)(e, 'xAxis', l, x),
        ),
        f = (0, er.useAppSelector)((e) =>
          (0, ep.selectAxisPropsNeededForCartesianGridTicksGenerator)(e, 'yAxis', o, x),
        );
      if (
        !(0, eF.isPositiveNumber)(u) ||
        !(0, eF.isPositiveNumber)(d) ||
        !(0, R.isNumber)(s) ||
        !(0, R.isNumber)(c)
      )
        return null;
      var v = n.verticalCoordinatesGenerator || tp,
        g = n.horizontalCoordinatesGenerator || th,
        { horizontalPoints: b, verticalPoints: j } = n;
      if ((!b || !b.length) && 'function' == typeof g) {
        var A = h && h.length,
          E = g(
            {
              yAxis: f ? ti(ti({}, f), {}, { ticks: A ? h : f.ticks }) : void 0,
              width: null != t ? t : u,
              height: null != i ? i : d,
              offset: a,
            },
            !!A || p,
          );
        ((0, e4.warn)(
          Array.isArray(E),
          'horizontalCoordinatesGenerator should return Array but instead it returned ['.concat(
            typeof E,
            ']',
          ),
        ),
          Array.isArray(E) && (b = E));
      }
      if ((!j || !j.length) && 'function' == typeof v) {
        var P = y && y.length,
          k = v(
            {
              xAxis: m ? ti(ti({}, m), {}, { ticks: P ? y : m.ticks }) : void 0,
              width: null != t ? t : u,
              height: null != i ? i : d,
              offset: a,
            },
            !!P || p,
          );
        ((0, e4.warn)(
          Array.isArray(k),
          'verticalCoordinatesGenerator should return Array but instead it returned ['.concat(
            typeof k,
            ']',
          ),
        ),
          Array.isArray(k) && (j = k));
      }
      return r.createElement(
        Z.ZIndexLayer,
        { zIndex: n.zIndex },
        r.createElement(
          'g',
          { className: 'recharts-cartesian-grid' },
          r.createElement(tl, {
            fill: n.fill,
            fillOpacity: n.fillOpacity,
            x: n.x,
            y: n.y,
            width: n.width,
            height: n.height,
            ry: n.ry,
          }),
          r.createElement(tu, ta({}, n, { horizontalPoints: b })),
          r.createElement(td, ta({}, n, { verticalPoints: j })),
          r.createElement(ts, ta({}, n, { offset: a, horizontalPoints: b, xAxis: m, yAxis: f })),
          r.createElement(tc, ta({}, n, { offset: a, verticalPoints: j, xAxis: m, yAxis: f })),
        ),
      );
    }
    tx.displayName = 'CartesianGrid';
    var tm = e.i(54241),
      tf = e.i(51215),
      tv = e.i(21203);
    function tg({ title: e, value: r, icon: i, color: a, trend: c }) {
      return (0, t.jsxs)(l.Card, {
        sx: {
          height: '100%',
          position: 'relative',
          overflow: 'hidden',
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': { transform: 'translateY(-2px)', boxShadow: 4 },
        },
        children: [
          (0, t.jsx)(n.Box, {
            sx: {
              position: 'absolute',
              top: -10,
              right: -10,
              opacity: 0.1,
              transform: 'rotate(15deg)',
            },
            children: (0, t.jsx)(i, { size: 80, color: a }),
          }),
          (0, t.jsxs)(o.CardContent, {
            children: [
              (0, t.jsxs)(n.Box, {
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                mb: 1,
                children: [
                  (0, t.jsx)(n.Box, {
                    sx: {
                      p: 1,
                      borderRadius: '12px',
                      backgroundColor: `${a}15`,
                      color: a,
                      display: 'flex',
                    },
                    children: (0, t.jsx)(i, { size: 20 }),
                  }),
                  (0, t.jsx)(s.Typography, {
                    color: 'text.secondary',
                    variant: 'overline',
                    sx: { fontWeight: 600 },
                    children: e,
                  }),
                ],
              }),
              (0, t.jsx)(s.Typography, {
                variant: 'h4',
                sx: { fontWeight: 800, mb: 0.5 },
                children: 'number' == typeof r ? r.toLocaleString() : r,
              }),
              c &&
                (0, t.jsxs)(n.Box, {
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  children: [
                    (0, t.jsx)(O, { size: 14, color: '#34C759' }),
                    (0, t.jsx)(s.Typography, {
                      variant: 'caption',
                      sx: { color: '#34C759', fontWeight: 600 },
                      children: c,
                    }),
                  ],
                }),
            ],
          }),
        ],
      });
    }
    function tb({ status: e }) {
      let { t: r } = (0, a.useTranslation)(),
        i = {
          scheduled: { color: '#8E8E93', bg: '#F2F2F7' },
          driver_waiting: { color: '#FF9500', bg: '#FFF5E6' },
          in_transit: { color: '#34C759', bg: '#E8F5E9' },
          completed: { color: '#007AFF', bg: '#E3F2FD' },
          absent: { color: '#FF3B30', bg: '#FFEBEE' },
          cancelled: { color: '#FF3B30', bg: '#FFEBEE' },
        },
        l = i[e] || i.scheduled;
      return (0, t.jsx)(n.Box, {
        sx: {
          px: 1.5,
          py: 0.5,
          borderRadius: 1,
          backgroundColor: l.bg,
          color: l.color,
          fontSize: '0.7rem',
          fontWeight: 700,
          textTransform: 'uppercase',
        },
        children: r(`status_labels.${e}`) || e,
      });
    }
    function tj({ title: e, subtitle: r, icon: i, color: a, onClick: l }) {
      return (0, t.jsx)(y.Paper, {
        onClick: l,
        sx: {
          p: 2,
          borderRadius: 2,
          cursor: 'pointer',
          transition: 'all 0.2s',
          '&:hover': { transform: 'translateY(-2px)', boxShadow: 2 },
        },
        elevation: 0,
        variant: 'outlined',
        children: (0, t.jsxs)(m.Stack, {
          direction: 'row',
          spacing: 2,
          alignItems: 'center',
          children: [
            (0, t.jsx)(n.Box, {
              sx: { p: 1.5, borderRadius: 2, backgroundColor: `${a}15`, color: a },
              children: (0, t.jsx)(i, { size: 24 }),
            }),
            (0, t.jsxs)(n.Box, {
              sx: { flex: 1 },
              children: [
                (0, t.jsx)(s.Typography, { variant: 'subtitle2', fontWeight: 700, children: e }),
                (0, t.jsx)(s.Typography, {
                  variant: 'caption',
                  color: 'text.secondary',
                  children: r,
                }),
              ],
            }),
            (0, t.jsx)(I, { size: 16, color: '#8E8E93' }),
          ],
        }),
      });
    }
    function tA() {
      let e = (0, tf.useRouter)(),
        { t: i } = (0, a.useTranslation)(),
        [l, o] = (0, r.useState)(null),
        [m, b] = (0, r.useState)([]),
        [I, S] = (0, r.useState)([]),
        [F, T] = (0, r.useState)(!0),
        [B, z] = (0, r.useState)(null),
        [L, _] = (0, r.useState)(null),
        [G, W] = (0, r.useState)('connecting'),
        M = (0, r.useRef)(null),
        R = (0, r.useCallback)(async () => {
          (T(!0), z(null));
          try {
            let [e, t, r] = await Promise.all([
              tv.supabaseClient.rpc('get_dashboard_stats'),
              tv.supabaseClient.rpc('get_daily_activity', { p_days: 7 }),
              tv.supabaseClient.rpc('get_recent_active_trips', { p_limit: 5 }),
            ]);
            if (e.error) throw e.error;
            (e.data && o(e.data),
              t.error
                ? console.warn('[Dashboard] get_daily_activity failed:', t.error)
                : t.data && b(t.data),
              r.error
                ? console.warn('[Dashboard] get_recent_active_trips failed:', r.error)
                : r.data && S(r.data),
              _(new Date()));
          } catch (e) {
            z(e.message);
          } finally {
            T(!1);
          }
        }, []),
        K = (0, r.useCallback)(() => {
          M.current ||
            (M.current = setTimeout(() => {
              ((M.current = null), R());
            }, 1500));
        }, [R]);
      if (
        ((0, r.useEffect)(() => {
          R();
          let e = tv.supabaseClient
            .channel('dashboard-realtime')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'trips' }, () => {
              K();
            })
            .subscribe((e) => {
              ('SUBSCRIBED' === e && W('connected'), 'CLOSED' === e && W('disconnected'));
            });
          return () => {
            (M.current && (clearTimeout(M.current), (M.current = null)),
              tv.supabaseClient.removeChannel(e));
          };
        }, [R, K]),
        F && !l)
      )
        return (0, t.jsx)(n.Box, {
          sx: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '80vh',
          },
          children: (0, t.jsx)(u.CircularProgress, {
            thickness: 5,
            size: 60,
            sx: { color: '#007AFF' },
          }),
        });
      let q = [
        {
          title: i('dashboard.quickActions.manageDrivers'),
          subtitle: i('dashboard.quickActions.viewDrivers'),
          icon: v.Users,
          color: '#007AFF',
          onClick: () => e.push('/drivers'),
        },
        {
          title: i('dashboard.quickActions.viewTrips'),
          subtitle: i('dashboard.quickActions.monitorTrips'),
          icon: g.Bus,
          color: '#34C759',
          onClick: () => e.push('/trips'),
        },
        {
          title: i('dashboard.quickActions.licenses'),
          subtitle: i('dashboard.quickActions.createBatch'),
          icon: E,
          color: '#5856D6',
          onClick: () => e.push('/license_batches'),
        },
        {
          title: i('dashboard.quickActions.analytics'),
          subtitle: i('dashboard.quickActions.viewStats'),
          icon: O,
          color: '#FF9500',
          onClick: () => e.push('/analytics'),
        },
      ];
      return (0, t.jsxs)(n.Box, {
        sx: { p: { xs: 2, md: 4 } },
        children: [
          (0, t.jsxs)(n.Box, {
            sx: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 },
            children: [
              (0, t.jsxs)(n.Box, {
                children: [
                  (0, t.jsx)(s.Typography, {
                    variant: 'h4',
                    sx: { fontWeight: 800, color: 'text.primary' },
                    children: i('dashboard.title'),
                  }),
                  (0, t.jsxs)(n.Box, {
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    mt: 0.5,
                    children: [
                      (0, t.jsxs)(n.Box, {
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        children: [
                          (0, t.jsx)(C, {
                            size: 8,
                            fill: 'connected' === G ? '#34C759' : '#FF3B30',
                            color: 'connected' === G ? '#34C759' : '#FF3B30',
                            style: { animation: 'connected' === G ? 'pulse 2s infinite' : 'none' },
                          }),
                          (0, t.jsx)(s.Typography, {
                            variant: 'caption',
                            color: 'text.secondary',
                            sx: { fontWeight: 600 },
                            children: i(`dashboard.realtime.${G}`),
                          }),
                        ],
                      }),
                      L &&
                        (0, t.jsxs)(t.Fragment, {
                          children: [
                            (0, t.jsx)(x.Divider, {
                              orientation: 'vertical',
                              flexItem: !0,
                              sx: { height: 12, my: 'auto' },
                            }),
                            (0, t.jsx)(s.Typography, {
                              variant: 'caption',
                              color: 'text.secondary',
                              children: i('dashboard.last_updated', {
                                time: L.toLocaleTimeString(),
                              }),
                            }),
                          ],
                        }),
                    ],
                  }),
                ],
              }),
              (0, t.jsx)(p.Tooltip, {
                title: i('dashboard.refresh'),
                children: (0, t.jsx)(d.IconButton, {
                  onClick: R,
                  disabled: F,
                  sx: {
                    backgroundColor: 'background.paper',
                    boxShadow: 1,
                    '&:hover': { backgroundColor: '#f0f0f0' },
                  },
                  children: (0, t.jsx)(f.RefreshCw, {
                    size: 20,
                    className: F ? 'animate-spin' : '',
                  }),
                }),
              }),
            ],
          }),
          B &&
            (0, t.jsx)(h.Alert, {
              severity: 'error',
              sx: { mb: 4, borderRadius: 2 },
              onClose: () => z(null),
              children: B,
            }),
          l &&
            (0, t.jsxs)(t.Fragment, {
              children: [
                (0, t.jsxs)(c.Grid, {
                  container: !0,
                  spacing: 3,
                  mb: 4,
                  children: [
                    (0, t.jsx)(c.Grid, {
                      item: !0,
                      xs: 12,
                      sm: 6,
                      md: 3,
                      children: (0, t.jsx)(tg, {
                        title: i('dashboard.stats.total_users'),
                        value: l.total_users,
                        icon: v.Users,
                        color: '#007AFF',
                      }),
                    }),
                    (0, t.jsx)(c.Grid, {
                      item: !0,
                      xs: 12,
                      sm: 6,
                      md: 3,
                      children: (0, t.jsx)(tg, {
                        title: i('dashboard.stats.active_drivers'),
                        value: l.total_drivers,
                        icon: g.Bus,
                        color: '#34C759',
                      }),
                    }),
                    (0, t.jsx)(c.Grid, {
                      item: !0,
                      xs: 12,
                      sm: 6,
                      md: 3,
                      children: (0, t.jsx)(tg, {
                        title: i('dashboard.stats.active_subscriptions'),
                        value: l.active_subscriptions,
                        icon: E,
                        color: '#5856D6',
                      }),
                    }),
                    (0, t.jsx)(c.Grid, {
                      item: !0,
                      xs: 12,
                      sm: 6,
                      md: 3,
                      children: (0, t.jsx)(tg, {
                        title: i('dashboard.stats.monthly_revenue'),
                        value: l.monthly_revenue.toLocaleString(),
                        icon: k.CreditCard,
                        color: '#FF9500',
                      }),
                    }),
                  ],
                }),
                (0, t.jsxs)(c.Grid, {
                  container: !0,
                  spacing: 2,
                  mb: 4,
                  children: [
                    (0, t.jsx)(c.Grid, {
                      item: !0,
                      xs: 6,
                      sm: 3,
                      children: (0, t.jsxs)(y.Paper, {
                        sx: { p: 2, borderRadius: 2, textAlign: 'center' },
                        elevation: 0,
                        variant: 'outlined',
                        children: [
                          (0, t.jsx)(w, { size: 20, color: '#34C759' }),
                          (0, t.jsx)(s.Typography, {
                            variant: 'h5',
                            fontWeight: 700,
                            mt: 1,
                            children: l.active_trips,
                          }),
                          (0, t.jsx)(s.Typography, {
                            variant: 'caption',
                            color: 'text.secondary',
                            children: i('dashboard.stats.active_trips') || 'Active Trips',
                          }),
                        ],
                      }),
                    }),
                    (0, t.jsx)(c.Grid, {
                      item: !0,
                      xs: 6,
                      sm: 3,
                      children: (0, t.jsxs)(y.Paper, {
                        sx: { p: 2, borderRadius: 2, textAlign: 'center' },
                        elevation: 0,
                        variant: 'outlined',
                        children: [
                          (0, t.jsx)(j, { size: 20, color: '#007AFF' }),
                          (0, t.jsx)(s.Typography, {
                            variant: 'h5',
                            fontWeight: 700,
                            mt: 1,
                            children: l.active_routes,
                          }),
                          (0, t.jsx)(s.Typography, {
                            variant: 'caption',
                            color: 'text.secondary',
                            children: i('dashboard.stats.active_routes') || 'Active Routes',
                          }),
                        ],
                      }),
                    }),
                    (0, t.jsx)(c.Grid, {
                      item: !0,
                      xs: 6,
                      sm: 3,
                      children: (0, t.jsxs)(y.Paper, {
                        sx: { p: 2, borderRadius: 2, textAlign: 'center' },
                        elevation: 0,
                        variant: 'outlined',
                        children: [
                          (0, t.jsx)(E, { size: 20, color: '#5856D6' }),
                          (0, t.jsx)(s.Typography, {
                            variant: 'h5',
                            fontWeight: 700,
                            mt: 1,
                            children: l.total_routes,
                          }),
                          (0, t.jsx)(s.Typography, {
                            variant: 'caption',
                            color: 'text.secondary',
                            children: i('dashboard.stats.total_routes') || 'Total Routes',
                          }),
                        ],
                      }),
                    }),
                    (0, t.jsx)(c.Grid, {
                      item: !0,
                      xs: 6,
                      sm: 3,
                      children: (0, t.jsxs)(y.Paper, {
                        sx: { p: 2, borderRadius: 2, textAlign: 'center' },
                        elevation: 0,
                        variant: 'outlined',
                        children: [
                          (0, t.jsx)(A, { size: 20, color: '#FF3B30' }),
                          (0, t.jsx)(s.Typography, {
                            variant: 'h5',
                            fontWeight: 700,
                            mt: 1,
                            children: l.total_trips,
                          }),
                          (0, t.jsx)(s.Typography, {
                            variant: 'caption',
                            color: 'text.secondary',
                            children: i('dashboard.stats.total_trips') || 'Total Trips',
                          }),
                        ],
                      }),
                    }),
                  ],
                }),
              ],
            }),
          (0, t.jsxs)(c.Grid, {
            container: !0,
            spacing: 4,
            children: [
              (0, t.jsx)(c.Grid, {
                item: !0,
                xs: 12,
                lg: 8,
                children: (0, t.jsxs)(y.Paper, {
                  sx: { p: 3, borderRadius: 3, height: '100%' },
                  elevation: 0,
                  variant: 'outlined',
                  children: [
                    (0, t.jsx)(s.Typography, {
                      variant: 'h6',
                      sx: { fontWeight: 700, mb: 3 },
                      children: i('dashboard.charts.trips_activity'),
                    }),
                    (0, t.jsx)(n.Box, {
                      sx: { height: 280, width: '100%' },
                      children: (0, t.jsx)(N.ResponsiveContainer, {
                        width: '100%',
                        height: '100%',
                        children: (0, t.jsxs)(D, {
                          data: m,
                          children: [
                            (0, t.jsx)('defs', {
                              children: (0, t.jsxs)('linearGradient', {
                                id: 'colorCount',
                                x1: '0',
                                y1: '0',
                                x2: '0',
                                y2: '1',
                                children: [
                                  (0, t.jsx)('stop', {
                                    offset: '5%',
                                    stopColor: '#007AFF',
                                    stopOpacity: 0.3,
                                  }),
                                  (0, t.jsx)('stop', {
                                    offset: '95%',
                                    stopColor: '#007AFF',
                                    stopOpacity: 0,
                                  }),
                                ],
                              }),
                            }),
                            (0, t.jsx)(tx, {
                              strokeDasharray: '3 3',
                              vertical: !1,
                              stroke: '#f0f0f0',
                            }),
                            (0, t.jsx)(e5.XAxis, {
                              dataKey: 'day',
                              axisLine: !1,
                              tickLine: !1,
                              tick: { fontSize: 12, fill: '#8E8E93' },
                              dy: 10,
                              tickFormatter: (e) =>
                                new Date(e).toLocaleDateString(void 0, { weekday: 'short' }),
                            }),
                            (0, t.jsx)(e3.YAxis, {
                              axisLine: !1,
                              tickLine: !1,
                              tick: { fontSize: 12, fill: '#8E8E93' },
                            }),
                            (0, t.jsx)(tm.Tooltip, {
                              contentStyle: {
                                borderRadius: '12px',
                                border: 'none',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                              },
                            }),
                            (0, t.jsx)(e2, {
                              type: 'monotone',
                              dataKey: 'count',
                              stroke: '#007AFF',
                              strokeWidth: 3,
                              fillOpacity: 1,
                              fill: 'url(#colorCount)',
                            }),
                          ],
                        }),
                      }),
                    }),
                  ],
                }),
              }),
              (0, t.jsx)(c.Grid, {
                item: !0,
                xs: 12,
                lg: 4,
                children: (0, t.jsxs)(y.Paper, {
                  sx: { p: 3, borderRadius: 3, height: '100%' },
                  elevation: 0,
                  variant: 'outlined',
                  children: [
                    (0, t.jsxs)(n.Box, {
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 3,
                      children: [
                        (0, t.jsx)(s.Typography, {
                          variant: 'h6',
                          sx: { fontWeight: 700 },
                          children: i('dashboard.realtime.live'),
                        }),
                        (0, t.jsx)(A, { size: 20, color: '#FF3B30' }),
                      ],
                    }),
                    I.length > 0
                      ? (0, t.jsx)(n.Box, {
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 2,
                          children: I.map((e) =>
                            (0, t.jsxs)(
                              n.Box,
                              {
                                sx: {
                                  p: 2,
                                  borderRadius: 2,
                                  backgroundColor: '#F2F2F7',
                                  border: '1px solid #E5E5EA',
                                  transition: 'all 0.2s',
                                  '&:hover': { backgroundColor: '#E5E5EA' },
                                },
                                children: [
                                  (0, t.jsxs)(n.Box, {
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-start',
                                    mb: 1,
                                    children: [
                                      (0, t.jsx)(s.Typography, {
                                        variant: 'subtitle2',
                                        sx: { fontWeight: 700 },
                                        children: e.route_title,
                                      }),
                                      (0, t.jsx)(tb, { status: e.status }),
                                    ],
                                  }),
                                  (0, t.jsxs)(n.Box, {
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    color: 'text.secondary',
                                    children: [
                                      (0, t.jsx)(g.Bus, { size: 14 }),
                                      (0, t.jsx)(s.Typography, {
                                        variant: 'caption',
                                        children: e.driver_name,
                                      }),
                                    ],
                                  }),
                                  (0, t.jsxs)(n.Box, {
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    color: 'text.secondary',
                                    mt: 0.5,
                                    children: [
                                      (0, t.jsx)(P, { size: 14 }),
                                      (0, t.jsx)(s.Typography, {
                                        variant: 'caption',
                                        children: new Date(e.scheduled_at).toLocaleTimeString(),
                                      }),
                                    ],
                                  }),
                                ],
                              },
                              e.id,
                            ),
                          ),
                        })
                      : (0, t.jsxs)(n.Box, {
                          sx: {
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: 240,
                            opacity: 0.5,
                          },
                          children: [
                            (0, t.jsx)(A, { size: 40 }),
                            (0, t.jsx)(s.Typography, {
                              variant: 'body2',
                              sx: { mt: 2 },
                              children: i('no_active_trips'),
                            }),
                          ],
                        }),
                  ],
                }),
              }),
            ],
          }),
          (0, t.jsx)(s.Typography, {
            variant: 'h6',
            sx: { fontWeight: 700, mt: 4, mb: 2 },
            children: i('dashboard.quickActions.title') || 'Quick Actions',
          }),
          (0, t.jsx)(c.Grid, {
            container: !0,
            spacing: 2,
            children: q.map((e, r) =>
              (0, t.jsx)(
                c.Grid,
                { item: !0, xs: 12, sm: 6, md: 3, children: (0, t.jsx)(tj, { ...e }) },
                r,
              ),
            ),
          }),
          (0, t.jsx)('style', {
            children: `
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.7; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `,
          }),
        ],
      });
    }
    e.s(
      [
        'default',
        0,
        function () {
          return (0, t.jsx)(
            i.Authenticated,
            {
              redirectOnFail: '/login',
              fallback: (0, t.jsx)(n.Box, {
                sx: {
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  minHeight: '100vh',
                },
                children: (0, t.jsx)(u.CircularProgress, {}),
              }),
              children: (0, t.jsx)(tA, {}),
            },
            'dashboard',
          );
        },
      ],
      48421,
    );
  },
]);
