(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([
  'object' == typeof document ? document.currentScript : void 0,
  50718,
  (e) => {
    'use strict';
    e.i(61129);
    var t = e.i(16320),
      r = e.i(37479);
    let o = (0, t.default)(
      (0, r.jsx)('path', {
        d: 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z',
      }),
      'Close',
    );
    e.s(['default', 0, o]);
  },
  98967,
  81625,
  35226,
  74613,
  6171,
  (e) => {
    'use strict';
    e.i(64775);
    var t,
      r,
      o = e.i(84570),
      l = e.i(98457),
      a = e.i(61129),
      n = e.i(94083),
      i = e.i(42306),
      u = e.i(26589),
      s = e.i(69989),
      d = e.i(96648),
      p = e.i(98985),
      p = p,
      c = e.i(72203);
    e.s(['unstable_useId', () => c.default], 81625);
    var c = c;
    let f = (e) => {
      let t = a.useRef({});
      return (
        a.useEffect(() => {
          t.current = e;
        }),
        t.current
      );
    };
    function g(e) {
      return void 0 !== e.normalize ? e.normalize('NFD').replace(/[\u0300-\u036f]/g, '') : e;
    }
    function h(e = {}) {
      let {
        ignoreAccents: t = !0,
        ignoreCase: r = !0,
        limit: o,
        matchFrom: l = 'any',
        stringify: a,
        trim: n = !1,
      } = e;
      return (e, { inputValue: i, getOptionLabel: u }) => {
        let s = n ? i.trim() : i;
        (r && (s = s.toLowerCase()), t && (s = g(s)));
        let d = s
          ? e.filter((e) => {
              let o = (a || u)(e);
              return (
                r && (o = o.toLowerCase()),
                t && (o = g(o)),
                'start' === l ? 0 === o.indexOf(s) : o.indexOf(s) > -1
              );
            })
          : e;
        return 'number' == typeof o ? d.slice(0, o) : d;
      };
    }
    function m(e, t) {
      for (let r = 0; r < e.length; r += 1) if (t(e[r])) return r;
      return -1;
    }
    (e.s(['default', 0, f], 35226), e.s(['usePreviousProps', 0, f], 74613));
    let b = h(),
      v = (e) => {
        var t;
        return (
          null !== e.current &&
          (null == (t = e.current.parentElement) ? void 0 : t.contains(document.activeElement))
        );
      },
      x = [],
      y = function (e) {
        let {
            unstable_isActiveElementInListbox: t = v,
            unstable_classNamePrefix: r = 'Mui',
            autoComplete: o = !1,
            autoHighlight: n = !1,
            autoSelect: i = !1,
            blurOnSelect: u = !1,
            clearOnBlur: g = !e.freeSolo,
            clearOnEscape: h = !1,
            componentName: y = 'useAutocomplete',
            defaultValue: $ = e.multiple ? x : null,
            disableClearable: S = !1,
            disableCloseOnSelect: C = !1,
            disabled: I,
            disabledItemsFocusable: O = !1,
            disableListWrap: k = !1,
            filterOptions: P = b,
            filterSelectedOptions: A = !1,
            freeSolo: R = !1,
            getOptionDisabled: T,
            getOptionKey: w,
            getOptionLabel: L = (e) => {
              var t;
              return null != (t = e.label) ? t : e;
            },
            groupBy: D,
            handleHomeEndKeys: M = !e.freeSolo,
            id: j,
            includeInputInList: N = !1,
            inputValue: _,
            isOptionEqualToValue: z = (e, t) => e === t,
            multiple: E = !1,
            onChange: F,
            onClose: q,
            onHighlightChange: H,
            onInputChange: W,
            onOpen: B,
            open: V,
            openOnFocus: U = !1,
            options: K,
            readOnly: G = !1,
            selectOnFocus: J = !e.freeSolo,
            value: Q,
          } = e,
          X = (0, c.default)(j),
          Y = L;
        Y = (e) => {
          let t = L(e);
          return 'string' != typeof t ? String(t) : t;
        };
        let Z = a.useRef(!1),
          ee = a.useRef(!0),
          et = a.useRef(null),
          er = a.useRef(null),
          [eo, el] = a.useState(null),
          [ea, en] = a.useState(-1),
          ei = n ? 0 : -1,
          eu = a.useRef(ei),
          [es, ed] = (0, p.default)({ controlled: Q, default: $, name: y }),
          [ep, ec] = (0, p.default)({ controlled: _, default: '', name: y, state: 'inputValue' }),
          [ef, eg] = a.useState(!1),
          eh = a.useCallback(
            (e, t) => {
              let r;
              if ((E ? es.length < t.length : null !== t) || g) {
                if (E) r = '';
                else if (null == t) r = '';
                else {
                  let e = Y(t);
                  r = 'string' == typeof e ? e : '';
                }
                ep !== r && (ec(r), W && W(e, r, 'reset'));
              }
            },
            [Y, ep, E, W, ec, g, es],
          ),
          [em, eb] = (0, p.default)({ controlled: V, default: !1, name: y, state: 'open' }),
          [ev, ex] = a.useState(!0),
          ey = !E && null != es && ep === Y(es),
          e$ = em && !G,
          eS = e$
            ? P(
                K.filter((e) => !(A && (E ? es : [es]).some((t) => null !== t && z(e, t)))),
                { inputValue: ey && ev ? '' : ep, getOptionLabel: Y },
              )
            : [],
          eC = f({ filteredOptions: eS, value: es, inputValue: ep });
        a.useEffect(() => {
          let e = es !== eC.value;
          (ef && !e) || ((!R || e) && eh(null, es));
        }, [es, eh, ef, eC.value, R]);
        let eI = em && eS.length > 0 && !G,
          eO = (0, d.unstable_useEventCallback)((e) => {
            -1 === e ? et.current.focus() : eo.querySelector(`[data-tag-index="${e}"]`).focus();
          });
        a.useEffect(() => {
          E && ea > es.length - 1 && (en(-1), eO(-1));
        }, [es, E, ea, eO]);
        let ek = (0, d.unstable_useEventCallback)(({ event: e, index: t, reason: o = 'auto' }) => {
            if (
              ((eu.current = t),
              -1 === t
                ? et.current.removeAttribute('aria-activedescendant')
                : et.current.setAttribute('aria-activedescendant', `${X}-option-${t}`),
              H && H(e, -1 === t ? null : eS[t], o),
              !er.current)
            )
              return;
            let l = er.current.querySelector(`[role="option"].${r}-focused`);
            l && (l.classList.remove(`${r}-focused`), l.classList.remove(`${r}-focusVisible`));
            let a = er.current;
            if (
              ('listbox' !== er.current.getAttribute('role') &&
                (a = er.current.parentElement.querySelector('[role="listbox"]')),
              !a)
            )
              return;
            if (-1 === t) {
              a.scrollTop = 0;
              return;
            }
            let n = er.current.querySelector(`[data-option-index="${t}"]`);
            if (
              n &&
              (n.classList.add(`${r}-focused`),
              'keyboard' === o && n.classList.add(`${r}-focusVisible`),
              a.scrollHeight > a.clientHeight && 'mouse' !== o && 'touch' !== o)
            ) {
              let e = a.clientHeight + a.scrollTop,
                t = n.offsetTop + n.offsetHeight;
              t > e
                ? (a.scrollTop = t - a.clientHeight)
                : n.offsetTop - n.offsetHeight * (1.3 * !!D) < a.scrollTop &&
                  (a.scrollTop = n.offsetTop - n.offsetHeight * (1.3 * !!D));
            }
          }),
          eP = (0, d.unstable_useEventCallback)(
            ({ event: e, diff: t, direction: r = 'next', reason: l = 'auto' }) => {
              if (!e$) return;
              let a = (function (e, t) {
                if (!er.current || e < 0 || e >= eS.length) return -1;
                let r = e;
                for (;;) {
                  let o = er.current.querySelector(`[data-option-index="${r}"]`),
                    l = !O && (!o || o.disabled || 'true' === o.getAttribute('aria-disabled'));
                  if (o && o.hasAttribute('tabindex') && !l) return r;
                  if (
                    (r = 'next' === t ? (r + 1) % eS.length : (r - 1 + eS.length) % eS.length) === e
                  )
                    return -1;
                }
              })(
                (() => {
                  let e = eS.length - 1;
                  if ('reset' === t) return ei;
                  if ('start' === t) return 0;
                  if ('end' === t) return e;
                  let r = eu.current + t;
                  return r < 0
                    ? -1 === r && N
                      ? -1
                      : (k && -1 !== eu.current) || Math.abs(t) > 1
                        ? 0
                        : e
                    : r > e
                      ? r === e + 1 && N
                        ? -1
                        : k || Math.abs(t) > 1
                          ? e
                          : 0
                      : r;
                })(),
                r,
              );
              if ((ek({ index: a, reason: l, event: e }), o && 'reset' !== t))
                if (-1 === a) et.current.value = ep;
                else {
                  let e = Y(eS[a]);
                  ((et.current.value = e),
                    0 === e.toLowerCase().indexOf(ep.toLowerCase()) &&
                      ep.length > 0 &&
                      et.current.setSelectionRange(ep.length, e.length));
                }
            },
          ),
          eA = a.useCallback(() => {
            if (!e$) return;
            let e = (() => {
              var e;
              if (
                -1 !== eu.current &&
                eC.filteredOptions &&
                eC.filteredOptions.length !== eS.length &&
                eC.inputValue === ep &&
                (E
                  ? es.length === eC.value.length && eC.value.every((e, t) => Y(es[t]) === Y(e))
                  : ((e = eC.value), (e ? Y(e) : '') === (es ? Y(es) : '')))
              ) {
                let e = eC.filteredOptions[eu.current];
                if (e) return m(eS, (t) => Y(t) === Y(e));
              }
              return -1;
            })();
            if (-1 !== e) {
              eu.current = e;
              return;
            }
            let t = E ? es[0] : es;
            if (0 === eS.length || null == t) return void eP({ diff: 'reset' });
            if (er.current) {
              if (null != t) {
                let e = eS[eu.current];
                if (E && e && -1 !== m(es, (t) => z(e, t))) return;
                let r = m(eS, (e) => z(e, t));
                -1 === r ? eP({ diff: 'reset' }) : ek({ index: r });
                return;
              }
              if (eu.current >= eS.length - 1) return void ek({ index: eS.length - 1 });
              ek({ index: eu.current });
            }
          }, [eS.length, !E && es, A, eP, ek, e$, ep, E]),
          eR = (0, d.unstable_useEventCallback)((e) => {
            ((0, s.unstable_setRef)(er, e), e && eA());
          });
        a.useEffect(() => {
          eA();
        }, [eA]);
        let eT = (e) => {
            !em && (eb(!0), ex(!0), B && B(e));
          },
          ew = (e, t) => {
            em && (eb(!1), q && q(e, t));
          },
          eL = (e, t, r, o) => {
            if (E) {
              if (es.length === t.length && es.every((e, r) => e === t[r])) return;
            } else if (es === t) return;
            (F && F(e, t, r, o), ed(t));
          },
          eD = a.useRef(!1),
          eM = (e, t, r = 'selectOption', o = 'options') => {
            let l = r,
              a = t;
            if (E) {
              let e = m((a = Array.isArray(es) ? es.slice() : []), (e) => z(t, e));
              -1 === e ? a.push(t) : 'freeSolo' !== o && (a.splice(e, 1), (l = 'removeOption'));
            }
            (eh(e, a),
              eL(e, a, l, { option: t }),
              C || (e && (e.ctrlKey || e.metaKey)) || ew(e, l),
              (!0 === u || ('touch' === u && eD.current) || ('mouse' === u && !eD.current)) &&
                et.current.blur());
          },
          ej = (e, t) => {
            if (!E) return;
            '' === ep && ew(e, 'toggleInput');
            let r = ea;
            (-1 === ea
              ? '' === ep && 'previous' === t && (r = es.length - 1)
              : ((r += 'next' === t ? 1 : -1) < 0 && (r = 0), r === es.length && (r = -1)),
              en(
                (r = (function (e, t) {
                  if (-1 === e) return -1;
                  let r = e;
                  for (;;) {
                    if (('next' === t && r === es.length) || ('previous' === t && -1 === r))
                      return -1;
                    let e = eo.querySelector(`[data-tag-index="${r}"]`);
                    if (
                      e &&
                      e.hasAttribute('tabindex') &&
                      !e.disabled &&
                      'true' !== e.getAttribute('aria-disabled')
                    )
                      return r;
                    r += 'next' === t ? 1 : -1;
                  }
                })(r, t)),
              ),
              eO(r));
          },
          eN = (e) => {
            ((Z.current = !0), ec(''), W && W(e, '', 'clear'), eL(e, E ? [] : null, 'clear'));
          },
          e_ = (e) => {
            (eg(!0), U && !Z.current && eT(e));
          },
          ez = (e) => {
            t(er)
              ? et.current.focus()
              : (eg(!1),
                (ee.current = !0),
                (Z.current = !1),
                i && -1 !== eu.current && e$
                  ? eM(e, eS[eu.current], 'blur')
                  : i && R && '' !== ep
                    ? eM(e, ep, 'blur', 'freeSolo')
                    : g && eh(e, es),
                ew(e, 'blur'));
          },
          eE = (e) => {
            let t = e.target.value;
            (ep !== t && (ec(t), ex(!1), W && W(e, t, 'input')),
              '' === t ? S || E || eL(e, null, 'clear') : eT(e));
          },
          eF = (e) => {
            let t = Number(e.currentTarget.getAttribute('data-option-index'));
            eu.current !== t && ek({ event: e, index: t, reason: 'mouse' });
          },
          eq = (e) => {
            (ek({
              event: e,
              index: Number(e.currentTarget.getAttribute('data-option-index')),
              reason: 'touch',
            }),
              (eD.current = !0));
          },
          eH = (e) => {
            let t = Number(e.currentTarget.getAttribute('data-option-index'));
            (eM(e, eS[t], 'selectOption'), (eD.current = !1));
          },
          eW = (e) => {
            em ? ew(e, 'toggleInput') : eT(e);
          },
          eB = (e) => {
            e.currentTarget.contains(e.target) &&
              e.target.getAttribute('id') !== X &&
              e.preventDefault();
          },
          eV = (e) => {
            e.currentTarget.contains(e.target) &&
              (et.current.focus(),
              J &&
                ee.current &&
                et.current.selectionEnd - et.current.selectionStart == 0 &&
                et.current.select(),
              (ee.current = !1));
          },
          eU = (e) => {
            I || ('' !== ep && em) || eW(e);
          },
          eK = R && ep.length > 0;
        eK = eK || (E ? es.length > 0 : null !== es);
        let eG = eS;
        return (
          D &&
            (eG = eS.reduce((e, t, r) => {
              let o = D(t);
              return (
                e.length > 0 && e[e.length - 1].group === o
                  ? e[e.length - 1].options.push(t)
                  : e.push({ key: r, index: r, group: o, options: [t] }),
                e
              );
            }, [])),
          I && ef && ez(),
          {
            getRootProps: (e = {}) =>
              (0, l.default)({ 'aria-owns': eI ? `${X}-listbox` : null }, e, {
                onKeyDown: (t) => {
                  if (
                    (e.onKeyDown && e.onKeyDown(t),
                    !t.defaultMuiPrevented &&
                      (-1 !== ea &&
                        -1 === ['ArrowLeft', 'ArrowRight'].indexOf(t.key) &&
                        (en(-1), eO(-1)),
                      229 !== t.which))
                  )
                    switch (t.key) {
                      case 'Home':
                        e$ &&
                          M &&
                          (t.preventDefault(),
                          eP({ diff: 'start', direction: 'next', reason: 'keyboard', event: t }));
                        break;
                      case 'End':
                        e$ &&
                          M &&
                          (t.preventDefault(),
                          eP({ diff: 'end', direction: 'previous', reason: 'keyboard', event: t }));
                        break;
                      case 'PageUp':
                        (t.preventDefault(),
                          eP({ diff: -5, direction: 'previous', reason: 'keyboard', event: t }),
                          eT(t));
                        break;
                      case 'PageDown':
                        (t.preventDefault(),
                          eP({ diff: 5, direction: 'next', reason: 'keyboard', event: t }),
                          eT(t));
                        break;
                      case 'ArrowDown':
                        (t.preventDefault(),
                          eP({ diff: 1, direction: 'next', reason: 'keyboard', event: t }),
                          eT(t));
                        break;
                      case 'ArrowUp':
                        (t.preventDefault(),
                          eP({ diff: -1, direction: 'previous', reason: 'keyboard', event: t }),
                          eT(t));
                        break;
                      case 'ArrowLeft':
                        ej(t, 'previous');
                        break;
                      case 'ArrowRight':
                        ej(t, 'next');
                        break;
                      case 'Enter':
                        if (-1 !== eu.current && e$) {
                          let e = eS[eu.current],
                            r = !!T && T(e);
                          if ((t.preventDefault(), r)) return;
                          (eM(t, e, 'selectOption'),
                            o &&
                              et.current.setSelectionRange(
                                et.current.value.length,
                                et.current.value.length,
                              ));
                        } else
                          R &&
                            '' !== ep &&
                            !1 === ey &&
                            (E && t.preventDefault(), eM(t, ep, 'createOption', 'freeSolo'));
                        break;
                      case 'Escape':
                        e$
                          ? (t.preventDefault(), t.stopPropagation(), ew(t, 'escape'))
                          : h &&
                            ('' !== ep || (E && es.length > 0)) &&
                            (t.preventDefault(), t.stopPropagation(), eN(t));
                        break;
                      case 'Backspace':
                        if (E && !G && '' === ep && es.length > 0) {
                          let e = -1 === ea ? es.length - 1 : ea,
                            r = es.slice();
                          (r.splice(e, 1), eL(t, r, 'removeOption', { option: es[e] }));
                        }
                        break;
                      case 'Delete':
                        if (E && !G && '' === ep && es.length > 0 && -1 !== ea) {
                          let e = es.slice();
                          (e.splice(ea, 1), eL(t, e, 'removeOption', { option: es[ea] }));
                        }
                    }
                },
                onMouseDown: eB,
                onClick: eV,
              }),
            getInputLabelProps: () => ({ id: `${X}-label`, htmlFor: X }),
            getInputProps: () => ({
              id: X,
              value: ep,
              onBlur: ez,
              onFocus: e_,
              onChange: eE,
              onMouseDown: eU,
              'aria-activedescendant': e$ ? '' : null,
              'aria-autocomplete': o ? 'both' : 'list',
              'aria-controls': eI ? `${X}-listbox` : void 0,
              'aria-expanded': eI,
              autoComplete: 'off',
              ref: et,
              autoCapitalize: 'none',
              spellCheck: 'false',
              role: 'combobox',
              disabled: I,
            }),
            getClearProps: () => ({ tabIndex: -1, type: 'button', onClick: eN }),
            getPopupIndicatorProps: () => ({ tabIndex: -1, type: 'button', onClick: eW }),
            getTagProps: ({ index: e }) =>
              (0, l.default)(
                { key: e, 'data-tag-index': e, tabIndex: -1 },
                !G && {
                  onDelete: (t) => {
                    let r = es.slice();
                    (r.splice(e, 1), eL(t, r, 'removeOption', { option: es[e] }));
                  },
                },
              ),
            getListboxProps: () => ({
              role: 'listbox',
              id: `${X}-listbox`,
              'aria-labelledby': `${X}-label`,
              ref: eR,
              onMouseDown: (e) => {
                e.preventDefault();
              },
            }),
            getOptionProps: ({ index: e, option: t }) => {
              var r;
              let o = (E ? es : [es]).some((e) => null != e && z(t, e)),
                l = !!T && T(t);
              return {
                key: null != (r = null == w ? void 0 : w(t)) ? r : Y(t),
                tabIndex: -1,
                role: 'option',
                id: `${X}-option-${e}`,
                onMouseMove: eF,
                onClick: eH,
                onTouchStart: eq,
                'data-option-index': e,
                'aria-disabled': l,
                'aria-selected': o,
              };
            },
            id: X,
            inputValue: ep,
            value: es,
            dirty: eK,
            expanded: e$ && eo,
            popupOpen: e$,
            focused: ef || -1 !== ea,
            anchorEl: eo,
            setAnchorEl: el,
            focusedTag: ea,
            groupedOptions: eG,
          }
        );
      };
    e.s(['createFilterOptions', 0, h, 'default', 0, y], 6171);
    var $ = e.i(80172),
      S = e.i(47740),
      C = e.i(10372),
      I = e.i(6888),
      O = e.i(18635),
      k = e.i(50901);
    function P(e) {
      return (0, k.default)('MuiListSubheader', e);
    }
    (0, O.default)('MuiListSubheader', [
      'root',
      'colorPrimary',
      'colorInherit',
      'gutters',
      'inset',
      'sticky',
    ]);
    var A = e.i(37479);
    let R = ['className', 'color', 'component', 'disableGutters', 'disableSticky', 'inset'],
      T = (0, S.default)('li', {
        name: 'MuiListSubheader',
        slot: 'Root',
        overridesResolver: (e, t) => {
          let { ownerState: r } = e;
          return [
            t.root,
            'default' !== r.color && t[`color${(0, I.default)(r.color)}`],
            !r.disableGutters && t.gutters,
            r.inset && t.inset,
            !r.disableSticky && t.sticky,
          ];
        },
      })(({ theme: e, ownerState: t }) =>
        (0, l.default)(
          {
            boxSizing: 'border-box',
            lineHeight: '48px',
            listStyle: 'none',
            color: (e.vars || e).palette.text.secondary,
            fontFamily: e.typography.fontFamily,
            fontWeight: e.typography.fontWeightMedium,
            fontSize: e.typography.pxToRem(14),
          },
          'primary' === t.color && { color: (e.vars || e).palette.primary.main },
          'inherit' === t.color && { color: 'inherit' },
          !t.disableGutters && { paddingLeft: 16, paddingRight: 16 },
          t.inset && { paddingLeft: 72 },
          !t.disableSticky && {
            position: 'sticky',
            top: 0,
            zIndex: 1,
            backgroundColor: (e.vars || e).palette.background.paper,
          },
        ),
      ),
      w = a.forwardRef(function (e, t) {
        let r = (0, C.useDefaultProps)({ props: e, name: 'MuiListSubheader' }),
          {
            className: a,
            color: u = 'default',
            component: s = 'li',
            disableGutters: d = !1,
            disableSticky: p = !1,
            inset: c = !1,
          } = r,
          f = (0, o.default)(r, R),
          g = (0, l.default)({}, r, {
            color: u,
            component: s,
            disableGutters: d,
            disableSticky: p,
            inset: c,
          }),
          h = ((e) => {
            let { classes: t, color: r, disableGutters: o, inset: l, disableSticky: a } = e,
              n = {
                root: [
                  'root',
                  'default' !== r && `color${(0, I.default)(r)}`,
                  !o && 'gutters',
                  l && 'inset',
                  !a && 'sticky',
                ],
              };
            return (0, i.default)(n, P, t);
          })(g);
        return (0, A.jsx)(
          T,
          (0, l.default)({ as: s, className: (0, n.default)(h.root, a), ref: t, ownerState: g }, f),
        );
      });
    w.muiSkipListHighlight = !0;
    var L = e.i(58478),
      D = e.i(37473),
      M = e.i(90367),
      j = e.i(77959),
      N = e.i(27253),
      _ = e.i(79080),
      z = e.i(80034),
      E = e.i(50718),
      F = e.i(87647),
      q = e.i(44504);
    function H(e) {
      return (0, k.default)('MuiAutocomplete', e);
    }
    let W = (0, O.default)('MuiAutocomplete', [
      'root',
      'expanded',
      'fullWidth',
      'focused',
      'focusVisible',
      'tag',
      'tagSizeSmall',
      'tagSizeMedium',
      'hasPopupIcon',
      'hasClearIcon',
      'inputRoot',
      'input',
      'inputFocused',
      'endAdornment',
      'clearIndicator',
      'popupIndicator',
      'popupIndicatorOpen',
      'popper',
      'popperDisablePortal',
      'paper',
      'listbox',
      'loading',
      'noOptions',
      'option',
      'groupLabel',
      'groupUl',
    ]);
    var B = e.i(86778);
    let V = [
        'autoComplete',
        'autoHighlight',
        'autoSelect',
        'blurOnSelect',
        'ChipProps',
        'className',
        'clearIcon',
        'clearOnBlur',
        'clearOnEscape',
        'clearText',
        'closeText',
        'componentsProps',
        'defaultValue',
        'disableClearable',
        'disableCloseOnSelect',
        'disabled',
        'disabledItemsFocusable',
        'disableListWrap',
        'disablePortal',
        'filterOptions',
        'filterSelectedOptions',
        'forcePopupIcon',
        'freeSolo',
        'fullWidth',
        'getLimitTagsText',
        'getOptionDisabled',
        'getOptionKey',
        'getOptionLabel',
        'isOptionEqualToValue',
        'groupBy',
        'handleHomeEndKeys',
        'id',
        'includeInputInList',
        'inputValue',
        'limitTags',
        'ListboxComponent',
        'ListboxProps',
        'loading',
        'loadingText',
        'multiple',
        'noOptionsText',
        'onChange',
        'onClose',
        'onHighlightChange',
        'onInputChange',
        'onOpen',
        'open',
        'openOnFocus',
        'openText',
        'options',
        'PaperComponent',
        'PopperComponent',
        'popupIcon',
        'readOnly',
        'renderGroup',
        'renderInput',
        'renderOption',
        'renderTags',
        'selectOnFocus',
        'size',
        'slotProps',
        'value',
      ],
      U = ['ref'],
      K = ['key'],
      G = ['key'],
      J = (0, q.styled)('div', {
        name: 'MuiAutocomplete',
        slot: 'Root',
        overridesResolver: (e, t) => {
          let { ownerState: r } = e,
            { fullWidth: o, hasClearIcon: l, hasPopupIcon: a, inputFocused: n, size: i } = r;
          return [
            { [`& .${W.tag}`]: t.tag },
            { [`& .${W.tag}`]: t[`tagSize${(0, I.default)(i)}`] },
            { [`& .${W.inputRoot}`]: t.inputRoot },
            { [`& .${W.input}`]: t.input },
            { [`& .${W.input}`]: n && t.inputFocused },
            t.root,
            o && t.fullWidth,
            a && t.hasPopupIcon,
            l && t.hasClearIcon,
          ];
        },
      })({
        [`&.${W.focused} .${W.clearIndicator}`]: { visibility: 'visible' },
        '@media (pointer: fine)': { [`&:hover .${W.clearIndicator}`]: { visibility: 'visible' } },
        [`& .${W.tag}`]: { margin: 3, maxWidth: 'calc(100% - 6px)' },
        [`& .${W.inputRoot}`]: {
          [`.${W.hasPopupIcon}&, .${W.hasClearIcon}&`]: { paddingRight: 30 },
          [`.${W.hasPopupIcon}.${W.hasClearIcon}&`]: { paddingRight: 56 },
          [`& .${W.input}`]: { width: 0, minWidth: 30 },
        },
        [`& .${j.default.root}`]: {
          paddingBottom: 1,
          '& .MuiInput-input': { padding: '4px 4px 4px 0px' },
        },
        [`& .${j.default.root}.${N.default.sizeSmall}`]: {
          [`& .${j.default.input}`]: { padding: '2px 4px 3px 0' },
        },
        [`& .${_.default.root}`]: {
          padding: 9,
          [`.${W.hasPopupIcon}&, .${W.hasClearIcon}&`]: { paddingRight: 39 },
          [`.${W.hasPopupIcon}.${W.hasClearIcon}&`]: { paddingRight: 65 },
          [`& .${W.input}`]: { padding: '7.5px 4px 7.5px 5px' },
          [`& .${W.endAdornment}`]: { right: 9 },
        },
        [`& .${_.default.root}.${N.default.sizeSmall}`]: {
          paddingTop: 6,
          paddingBottom: 6,
          paddingLeft: 6,
          [`& .${W.input}`]: { padding: '2.5px 4px 2.5px 8px' },
        },
        [`& .${z.default.root}`]: {
          paddingTop: 19,
          paddingLeft: 8,
          [`.${W.hasPopupIcon}&, .${W.hasClearIcon}&`]: { paddingRight: 39 },
          [`.${W.hasPopupIcon}.${W.hasClearIcon}&`]: { paddingRight: 65 },
          [`& .${z.default.input}`]: { padding: '7px 4px' },
          [`& .${W.endAdornment}`]: { right: 9 },
        },
        [`& .${z.default.root}.${N.default.sizeSmall}`]: {
          paddingBottom: 1,
          [`& .${z.default.input}`]: { padding: '2.5px 4px' },
        },
        [`& .${N.default.hiddenLabel}`]: { paddingTop: 8 },
        [`& .${z.default.root}.${N.default.hiddenLabel}`]: {
          paddingTop: 0,
          paddingBottom: 0,
          [`& .${W.input}`]: { paddingTop: 16, paddingBottom: 17 },
        },
        [`& .${z.default.root}.${N.default.hiddenLabel}.${N.default.sizeSmall}`]: {
          [`& .${W.input}`]: { paddingTop: 8, paddingBottom: 9 },
        },
        [`& .${W.input}`]: { flexGrow: 1, textOverflow: 'ellipsis', opacity: 0 },
        variants: [
          { props: { fullWidth: !0 }, style: { width: '100%' } },
          {
            props: { size: 'small' },
            style: { [`& .${W.tag}`]: { margin: 2, maxWidth: 'calc(100% - 4px)' } },
          },
          { props: { inputFocused: !0 }, style: { [`& .${W.input}`]: { opacity: 1 } } },
          { props: { multiple: !0 }, style: { [`& .${W.inputRoot}`]: { flexWrap: 'wrap' } } },
        ],
      }),
      Q = (0, q.styled)('div', {
        name: 'MuiAutocomplete',
        slot: 'EndAdornment',
        overridesResolver: (e, t) => t.endAdornment,
      })({ position: 'absolute', right: 0, top: '50%', transform: 'translate(0, -50%)' }),
      X = (0, q.styled)(D.default, {
        name: 'MuiAutocomplete',
        slot: 'ClearIndicator',
        overridesResolver: (e, t) => t.clearIndicator,
      })({ marginRight: -2, padding: 4, visibility: 'hidden' }),
      Y = (0, q.styled)(D.default, {
        name: 'MuiAutocomplete',
        slot: 'PopupIndicator',
        overridesResolver: ({ ownerState: e }, t) =>
          (0, l.default)({}, t.popupIndicator, e.popupOpen && t.popupIndicatorOpen),
      })({
        padding: 2,
        marginRight: -2,
        variants: [{ props: { popupOpen: !0 }, style: { transform: 'rotate(180deg)' } }],
      }),
      Z = (0, q.styled)($.default, {
        name: 'MuiAutocomplete',
        slot: 'Popper',
        overridesResolver: (e, t) => {
          let { ownerState: r } = e;
          return [
            { [`& .${W.option}`]: t.option },
            t.popper,
            r.disablePortal && t.popperDisablePortal,
          ];
        },
      })(({ theme: e }) => ({
        zIndex: (e.vars || e).zIndex.modal,
        variants: [{ props: { disablePortal: !0 }, style: { position: 'absolute' } }],
      })),
      ee = (0, q.styled)(L.default, {
        name: 'MuiAutocomplete',
        slot: 'Paper',
        overridesResolver: (e, t) => t.paper,
      })(({ theme: e }) => (0, l.default)({}, e.typography.body1, { overflow: 'auto' })),
      et = (0, q.styled)('div', {
        name: 'MuiAutocomplete',
        slot: 'Loading',
        overridesResolver: (e, t) => t.loading,
      })(({ theme: e }) => ({ color: (e.vars || e).palette.text.secondary, padding: '14px 16px' })),
      er = (0, q.styled)('div', {
        name: 'MuiAutocomplete',
        slot: 'NoOptions',
        overridesResolver: (e, t) => t.noOptions,
      })(({ theme: e }) => ({ color: (e.vars || e).palette.text.secondary, padding: '14px 16px' })),
      eo = (0, q.styled)('div', {
        name: 'MuiAutocomplete',
        slot: 'Listbox',
        overridesResolver: (e, t) => t.listbox,
      })(({ theme: e }) => ({
        listStyle: 'none',
        margin: 0,
        padding: '8px 0',
        maxHeight: '40vh',
        overflow: 'auto',
        position: 'relative',
        [`& .${W.option}`]: {
          minHeight: 48,
          display: 'flex',
          overflow: 'hidden',
          justifyContent: 'flex-start',
          alignItems: 'center',
          cursor: 'pointer',
          paddingTop: 6,
          boxSizing: 'border-box',
          outline: '0',
          WebkitTapHighlightColor: 'transparent',
          paddingBottom: 6,
          paddingLeft: 16,
          paddingRight: 16,
          [e.breakpoints.up('sm')]: { minHeight: 'auto' },
          [`&.${W.focused}`]: {
            backgroundColor: (e.vars || e).palette.action.hover,
            '@media (hover: none)': { backgroundColor: 'transparent' },
          },
          '&[aria-disabled="true"]': {
            opacity: (e.vars || e).palette.action.disabledOpacity,
            pointerEvents: 'none',
          },
          [`&.${W.focusVisible}`]: { backgroundColor: (e.vars || e).palette.action.focus },
          '&[aria-selected="true"]': {
            backgroundColor: e.vars
              ? `rgba(${e.vars.palette.primary.mainChannel} / ${e.vars.palette.action.selectedOpacity})`
              : (0, u.alpha)(e.palette.primary.main, e.palette.action.selectedOpacity),
            [`&.${W.focused}`]: {
              backgroundColor: e.vars
                ? `rgba(${e.vars.palette.primary.mainChannel} / calc(${e.vars.palette.action.selectedOpacity} + ${e.vars.palette.action.hoverOpacity}))`
                : (0, u.alpha)(
                    e.palette.primary.main,
                    e.palette.action.selectedOpacity + e.palette.action.hoverOpacity,
                  ),
              '@media (hover: none)': { backgroundColor: (e.vars || e).palette.action.selected },
            },
            [`&.${W.focusVisible}`]: {
              backgroundColor: e.vars
                ? `rgba(${e.vars.palette.primary.mainChannel} / calc(${e.vars.palette.action.selectedOpacity} + ${e.vars.palette.action.focusOpacity}))`
                : (0, u.alpha)(
                    e.palette.primary.main,
                    e.palette.action.selectedOpacity + e.palette.action.focusOpacity,
                  ),
            },
          },
        },
      })),
      el = (0, q.styled)(w, {
        name: 'MuiAutocomplete',
        slot: 'GroupLabel',
        overridesResolver: (e, t) => t.groupLabel,
      })(({ theme: e }) => ({ backgroundColor: (e.vars || e).palette.background.paper, top: -8 })),
      ea = (0, q.styled)('ul', {
        name: 'MuiAutocomplete',
        slot: 'GroupUl',
        overridesResolver: (e, t) => t.groupUl,
      })({ padding: 0, [`& .${W.option}`]: { paddingLeft: 24 } }),
      en = a.forwardRef(function (e, u) {
        var s, d, p, c;
        let f,
          g = (0, C.useDefaultProps)({ props: e, name: 'MuiAutocomplete' }),
          {
            autoComplete: h = !1,
            autoHighlight: m = !1,
            autoSelect: b = !1,
            blurOnSelect: v = !1,
            ChipProps: x,
            className: S,
            clearIcon: O = t || (t = (0, A.jsx)(E.default, { fontSize: 'small' })),
            clearOnBlur: k = !g.freeSolo,
            clearOnEscape: P = !1,
            clearText: R = 'Clear',
            closeText: T = 'Close',
            componentsProps: w = {},
            defaultValue: D = g.multiple ? [] : null,
            disableClearable: j = !1,
            disableCloseOnSelect: N = !1,
            disabled: _ = !1,
            disabledItemsFocusable: z = !1,
            disableListWrap: q = !1,
            disablePortal: W = !1,
            filterSelectedOptions: en = !1,
            forcePopupIcon: ei = 'auto',
            freeSolo: eu = !1,
            fullWidth: es = !1,
            getLimitTagsText: ed = (e) => `+${e}`,
            getOptionLabel: ep,
            groupBy: ec,
            handleHomeEndKeys: ef = !g.freeSolo,
            includeInputInList: eg = !1,
            limitTags: eh = -1,
            ListboxComponent: em = 'ul',
            ListboxProps: eb,
            loading: ev = !1,
            loadingText: ex = 'Loading…',
            multiple: ey = !1,
            noOptionsText: e$ = 'No options',
            openOnFocus: eS = !1,
            openText: eC = 'Open',
            PaperComponent: eI = L.default,
            PopperComponent: eO = $.default,
            popupIcon: ek = r || (r = (0, A.jsx)(F.default, {})),
            readOnly: eP = !1,
            renderGroup: eA,
            renderInput: eR,
            renderOption: eT,
            renderTags: ew,
            selectOnFocus: eL = !g.freeSolo,
            size: eD = 'medium',
            slotProps: eM = {},
          } = g,
          ej = (0, o.default)(g, V),
          {
            getRootProps: eN,
            getInputProps: e_,
            getInputLabelProps: ez,
            getPopupIndicatorProps: eE,
            getClearProps: eF,
            getTagProps: eq,
            getListboxProps: eH,
            getOptionProps: eW,
            value: eB,
            dirty: eV,
            expanded: eU,
            id: eK,
            popupOpen: eG,
            focused: eJ,
            focusedTag: eQ,
            anchorEl: eX,
            setAnchorEl: eY,
            inputValue: eZ,
            groupedOptions: e0,
          } = y((0, l.default)({}, g, { componentName: 'Autocomplete' })),
          e1 = !j && !_ && eV && !eP,
          e6 = (!eu || !0 === ei) && !1 !== ei,
          { onMouseDown: e4 } = e_(),
          { ref: e7 } = null != eb ? eb : {},
          e9 = eH(),
          { ref: e5 } = e9,
          e2 = (0, o.default)(e9, U),
          e8 = (0, B.default)(e5, e7),
          e3 =
            ep ||
            ((e) => {
              var t;
              return null != (t = e.label) ? t : e;
            }),
          te = (0, l.default)({}, g, {
            disablePortal: W,
            expanded: eU,
            focused: eJ,
            fullWidth: es,
            getOptionLabel: e3,
            hasClearIcon: e1,
            hasPopupIcon: e6,
            inputFocused: -1 === eQ,
            popupOpen: eG,
            size: eD,
          }),
          tt = ((e) => {
            let {
                classes: t,
                disablePortal: r,
                expanded: o,
                focused: l,
                fullWidth: a,
                hasClearIcon: n,
                hasPopupIcon: u,
                inputFocused: s,
                popupOpen: d,
                size: p,
              } = e,
              c = {
                root: [
                  'root',
                  o && 'expanded',
                  l && 'focused',
                  a && 'fullWidth',
                  n && 'hasClearIcon',
                  u && 'hasPopupIcon',
                ],
                inputRoot: ['inputRoot'],
                input: ['input', s && 'inputFocused'],
                tag: ['tag', `tagSize${(0, I.default)(p)}`],
                endAdornment: ['endAdornment'],
                clearIndicator: ['clearIndicator'],
                popupIndicator: ['popupIndicator', d && 'popupIndicatorOpen'],
                popper: ['popper', r && 'popperDisablePortal'],
                paper: ['paper'],
                listbox: ['listbox'],
                loading: ['loading'],
                noOptions: ['noOptions'],
                option: ['option'],
                groupLabel: ['groupLabel'],
                groupUl: ['groupUl'],
              };
            return (0, i.default)(c, H, t);
          })(te);
        if (ey && eB.length > 0) {
          let e = (e) => (0, l.default)({ className: tt.tag, disabled: _ }, eq(e));
          f = ew
            ? ew(eB, e, te)
            : eB.map((t, r) => {
                let a = e({ index: r }),
                  { key: n } = a,
                  i = (0, o.default)(a, K);
                return (0, A.jsx)(M.default, (0, l.default)({ label: e3(t), size: eD }, i, x), n);
              });
        }
        if (eh > -1 && Array.isArray(f)) {
          let e = f.length - eh;
          !eJ &&
            e > 0 &&
            (f = f.splice(0, eh)).push(
              (0, A.jsx)('span', { className: tt.tag, children: ed(e) }, f.length),
            );
        }
        let tr =
            eA ||
            ((e) =>
              (0, A.jsxs)(
                'li',
                {
                  children: [
                    (0, A.jsx)(el, {
                      className: tt.groupLabel,
                      ownerState: te,
                      component: 'div',
                      children: e.group,
                    }),
                    (0, A.jsx)(ea, { className: tt.groupUl, ownerState: te, children: e.children }),
                  ],
                },
                e.key,
              )),
          to =
            eT ||
            ((e, t) => {
              let { key: r } = e,
                a = (0, o.default)(e, G);
              return (0, A.jsx)('li', (0, l.default)({}, a, { children: e3(t) }), r);
            }),
          tl = (e, t) => {
            let r = eW({ option: e, index: t });
            return to(
              (0, l.default)({}, r, { className: tt.option }),
              e,
              { selected: r['aria-selected'], index: t, inputValue: eZ },
              te,
            );
          },
          ta = null != (s = eM.clearIndicator) ? s : w.clearIndicator,
          tn = null != (d = eM.paper) ? d : w.paper,
          ti = null != (p = eM.popper) ? p : w.popper,
          tu = null != (c = eM.popupIndicator) ? c : w.popupIndicator;
        return (0, A.jsxs)(a.Fragment, {
          children: [
            (0, A.jsx)(
              J,
              (0, l.default)(
                { ref: u, className: (0, n.default)(tt.root, S), ownerState: te },
                eN(ej),
                {
                  children: eR({
                    id: eK,
                    disabled: _,
                    fullWidth: !0,
                    size: 'small' === eD ? 'small' : void 0,
                    InputLabelProps: ez(),
                    InputProps: (0, l.default)(
                      {
                        ref: eY,
                        className: tt.inputRoot,
                        startAdornment: f,
                        onClick: (e) => {
                          e.target === e.currentTarget && e4(e);
                        },
                      },
                      (e1 || e6) && {
                        endAdornment: (0, A.jsxs)(Q, {
                          className: tt.endAdornment,
                          ownerState: te,
                          children: [
                            e1
                              ? (0, A.jsx)(
                                  X,
                                  (0, l.default)(
                                    {},
                                    eF(),
                                    { 'aria-label': R, title: R, ownerState: te },
                                    ta,
                                    {
                                      className: (0, n.default)(
                                        tt.clearIndicator,
                                        null == ta ? void 0 : ta.className,
                                      ),
                                      children: O,
                                    },
                                  ),
                                )
                              : null,
                            e6
                              ? (0, A.jsx)(
                                  Y,
                                  (0, l.default)(
                                    {},
                                    eE(),
                                    {
                                      disabled: _,
                                      'aria-label': eG ? T : eC,
                                      title: eG ? T : eC,
                                      ownerState: te,
                                    },
                                    tu,
                                    {
                                      className: (0, n.default)(
                                        tt.popupIndicator,
                                        null == tu ? void 0 : tu.className,
                                      ),
                                      children: ek,
                                    },
                                  ),
                                )
                              : null,
                          ],
                        }),
                      },
                    ),
                    inputProps: (0, l.default)(
                      { className: tt.input, disabled: _, readOnly: eP },
                      e_(),
                    ),
                  }),
                },
              ),
            ),
            eX
              ? (0, A.jsx)(
                  Z,
                  (0, l.default)(
                    {
                      as: eO,
                      disablePortal: W,
                      style: { width: eX ? eX.clientWidth : null },
                      ownerState: te,
                      role: 'presentation',
                      anchorEl: eX,
                      open: eG,
                    },
                    ti,
                    {
                      className: (0, n.default)(tt.popper, null == ti ? void 0 : ti.className),
                      children: (0, A.jsxs)(
                        ee,
                        (0, l.default)({ ownerState: te, as: eI }, tn, {
                          className: (0, n.default)(tt.paper, null == tn ? void 0 : tn.className),
                          children: [
                            ev && 0 === e0.length
                              ? (0, A.jsx)(et, {
                                  className: tt.loading,
                                  ownerState: te,
                                  children: ex,
                                })
                              : null,
                            0 !== e0.length || eu || ev
                              ? null
                              : (0, A.jsx)(er, {
                                  className: tt.noOptions,
                                  ownerState: te,
                                  role: 'presentation',
                                  onMouseDown: (e) => {
                                    e.preventDefault();
                                  },
                                  children: e$,
                                }),
                            e0.length > 0
                              ? (0, A.jsx)(
                                  eo,
                                  (0, l.default)(
                                    { as: em, className: tt.listbox, ownerState: te },
                                    e2,
                                    eb,
                                    {
                                      ref: e8,
                                      children: e0.map((e, t) =>
                                        ec
                                          ? tr({
                                              key: e.key,
                                              group: e.group,
                                              children: e.options.map((t, r) => tl(t, e.index + r)),
                                            })
                                          : tl(e, t),
                                      ),
                                    },
                                  ),
                                )
                              : null,
                          ],
                        }),
                      ),
                    },
                  ),
                )
              : null,
          ],
        });
      });
    e.s(['default', 0, en], 98967);
  },
  26198,
  (e) => {
    'use strict';
    var t = e.i(98967);
    e.s(['Autocomplete', () => t.default]);
  },
  74249,
  (e) => {
    'use strict';
    var t = e.i(37479),
      r = e.i(78090),
      o = e.i(24644),
      l = e.i(23786),
      a = e.i(26198),
      n = e.i(85424),
      i = e.i(15291),
      u = e.i(60552),
      s = e.i(51215),
      d = e.i(21203);
    e.s([
      'default',
      0,
      function () {
        let {
            saveButtonProps: e,
            refineCore: { formLoading: p },
            register: c,
            handleSubmit: f,
            control: g,
            formState: { errors: h },
          } = (0, n.useForm)(),
          m = (0, s.useRouter)(),
          { open: b } = (0, u.useNotification)(),
          { autocompleteProps: v } = (0, r.useAutocomplete)({ resource: 'routes' }),
          { autocompleteProps: x } = (0, r.useAutocomplete)({ resource: 'drivers' }),
          y = async (e) => {
            try {
              let { error: t } = await d.supabaseClient.rpc('admin_create_trip', {
                p_route_id: e.route_id,
                p_driver_id: e.driver_id,
                p_scheduled_at: new Date(e.scheduled_at).toISOString(),
              });
              if (t) throw t;
              (b?.({ type: 'success', message: 'Trip created successfully' }), m.push('/trips'));
            } catch (e) {
              b?.({
                type: 'error',
                message: e instanceof Error ? e.message : 'Failed to create trip',
              });
            }
          };
        return (0, t.jsx)(r.Create, {
          isLoading: p,
          saveButtonProps: { ...e, onClick: f(y) },
          children: (0, t.jsxs)(o.Box, {
            component: 'form',
            sx: { display: 'flex', flexDirection: 'column' },
            autoComplete: 'off',
            children: [
              (0, t.jsx)(i.Controller, {
                control: g,
                name: 'route_id',
                rules: { required: 'This field is required' },
                render: ({ field: e }) =>
                  (0, t.jsx)(a.Autocomplete, {
                    ...v,
                    ...e,
                    onChange: (t, r) => {
                      e.onChange(r?.id ?? r);
                    },
                    getOptionLabel: (e) =>
                      v?.options?.find((t) => t?.id?.toString() === (e?.id ?? e)?.toString())
                        ?.title ?? '',
                    isOptionEqualToValue: (e, t) =>
                      void 0 === t || e?.id?.toString() === (t?.id ?? t)?.toString(),
                    renderInput: (e) =>
                      (0, t.jsx)(l.TextField, {
                        ...e,
                        label: 'Route',
                        margin: 'normal',
                        variant: 'outlined',
                        error: !!h?.route_id,
                        helperText: h?.route_id?.message ?? void 0,
                        required: !0,
                        size: e.size ?? 'medium',
                      }),
                  }),
              }),
              (0, t.jsx)(i.Controller, {
                control: g,
                name: 'driver_id',
                rules: { required: 'This field is required' },
                render: ({ field: e }) =>
                  (0, t.jsx)(a.Autocomplete, {
                    ...x,
                    ...e,
                    onChange: (t, r) => {
                      e.onChange(r?.id ?? r);
                    },
                    getOptionLabel: (e) =>
                      x?.options?.find((t) => t?.id?.toString() === (e?.id ?? e)?.toString())
                        ?.vehicle_plate ?? '',
                    isOptionEqualToValue: (e, t) =>
                      void 0 === t || e?.id?.toString() === (t?.id ?? t)?.toString(),
                    renderInput: (e) =>
                      (0, t.jsx)(l.TextField, {
                        ...e,
                        label: 'Driver (Vehicle Plate)',
                        margin: 'normal',
                        variant: 'outlined',
                        error: !!h?.driver_id,
                        helperText: h?.driver_id?.message || 'Select the driver for this trip',
                        required: !0,
                        size: e.size ?? 'medium',
                      }),
                  }),
              }),
              (0, t.jsx)(l.TextField, {
                ...c('scheduled_at', { required: 'This field is required' }),
                error: !!h?.scheduled_at,
                helperText: h?.scheduled_at?.message,
                margin: 'normal',
                fullWidth: !0,
                InputLabelProps: { shrink: !0 },
                type: 'datetime-local',
                label: 'Scheduled At',
                name: 'scheduled_at',
              }),
            ],
          }),
        });
      },
    ]);
  },
]);
