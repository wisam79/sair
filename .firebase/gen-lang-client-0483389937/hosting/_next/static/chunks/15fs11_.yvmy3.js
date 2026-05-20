(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([
  'object' == typeof document ? document.currentScript : void 0,
  34909,
  98123,
  (e) => {
    'use strict';
    e.i(64775);
    var t = e.i(84570),
      r = e.i(98457),
      a = e.i(61129),
      i = e.i(94083),
      l = e.i(42306),
      o = e.i(47740),
      n = e.i(10372),
      s = e.i(18635),
      d = e.i(50901);
    function c(e) {
      return (0, d.default)('MuiDialogContent', e);
    }
    (0, s.default)('MuiDialogContent', ['root', 'dividers']);
    var u = e.i(69705),
      p = e.i(37479);
    let f = ['className', 'dividers'],
      h = (0, o.default)('div', {
        name: 'MuiDialogContent',
        slot: 'Root',
        overridesResolver: (e, t) => {
          let { ownerState: r } = e;
          return [t.root, r.dividers && t.dividers];
        },
      })(({ theme: e, ownerState: t }) =>
        (0, r.default)(
          {
            flex: '1 1 auto',
            WebkitOverflowScrolling: 'touch',
            overflowY: 'auto',
            padding: '20px 24px',
          },
          t.dividers
            ? {
                padding: '16px 24px',
                borderTop: `1px solid ${(e.vars || e).palette.divider}`,
                borderBottom: `1px solid ${(e.vars || e).palette.divider}`,
              }
            : { [`.${u.default.root} + &`]: { paddingTop: 0 } },
        ),
      ),
      v = a.forwardRef(function (e, a) {
        let o = (0, n.useDefaultProps)({ props: e, name: 'MuiDialogContent' }),
          { className: s, dividers: d = !1 } = o,
          u = (0, t.default)(o, f),
          v = (0, r.default)({}, o, { dividers: d }),
          x = ((e) => {
            let { classes: t, dividers: r } = e;
            return (0, l.default)({ root: ['root', r && 'dividers'] }, c, t);
          })(v);
        return (0, p.jsx)(
          h,
          (0, r.default)({ className: (0, i.default)(x.root, s), ownerState: v, ref: a }, u),
        );
      });
    e.s(['DialogContent', 0, v], 34909);
    var x = e.i(69321),
      g = e.i(56292);
    function m(e) {
      return (0, d.default)('MuiDialogContentText', e);
    }
    (0, s.default)('MuiDialogContentText', ['root']);
    let y = ['children', 'className'],
      j = (0, o.default)(g.default, {
        shouldForwardProp: (e) => (0, x.rootShouldForwardProp)(e) || 'classes' === e,
        name: 'MuiDialogContentText',
        slot: 'Root',
        overridesResolver: (e, t) => t.root,
      })({}),
      C = a.forwardRef(function (e, a) {
        let o = (0, n.useDefaultProps)({ props: e, name: 'MuiDialogContentText' }),
          { className: s } = o,
          d = (0, t.default)(o, y),
          c = ((e) => {
            let { classes: t } = e,
              a = (0, l.default)({ root: ['root'] }, m, t);
            return (0, r.default)({}, t, a);
          })(d);
        return (0, p.jsx)(
          j,
          (0, r.default)(
            {
              component: 'p',
              variant: 'body1',
              color: 'text.secondary',
              ref: a,
              ownerState: d,
              className: (0, i.default)(c.root, s),
            },
            o,
            { classes: c },
          ),
        );
      });
    e.s(['DialogContentText', 0, C], 98123);
  },
  83754,
  (e, t, r) => {
    'use strict';
    var a = e.r(27249);
    (Object.defineProperty(r, '__esModule', { value: !0 }), (r.default = void 0));
    var i = a(e.r(72523)),
      l = e.r(37479);
    r.default = (0, i.default)(
      (0, l.jsx)('path', {
        d: 'M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2m5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12z',
      }),
      'Cancel',
    );
  },
  98562,
  (e) => {
    'use strict';
    e.i(64775);
    var t = e.i(84570),
      r = e.i(98457),
      a = e.i(61129),
      i = e.i(94083),
      l = e.i(42306),
      o = e.i(26589),
      n = e.i(44504),
      s = e.i(10372),
      d = e.i(59049),
      c = e.i(6888),
      u = e.i(58478),
      p = e.i(18635),
      f = e.i(50901);
    function h(e) {
      return (0, f.default)('MuiAlert', e);
    }
    let v = (0, p.default)('MuiAlert', [
      'root',
      'action',
      'icon',
      'message',
      'filled',
      'colorSuccess',
      'colorInfo',
      'colorWarning',
      'colorError',
      'filledSuccess',
      'filledInfo',
      'filledWarning',
      'filledError',
      'outlined',
      'outlinedSuccess',
      'outlinedInfo',
      'outlinedWarning',
      'outlinedError',
      'standard',
      'standardSuccess',
      'standardInfo',
      'standardWarning',
      'standardError',
    ]);
    var x = e.i(37473),
      g = e.i(16320),
      m = e.i(37479);
    let y = (0, g.default)(
        (0, m.jsx)('path', {
          d: 'M20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4C12.76,4 13.5,4.11 14.2, 4.31L15.77,2.74C14.61,2.26 13.34,2 12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0, 0 22,12M7.91,10.08L6.5,11.5L11,16L21,6L19.59,4.58L11,13.17L7.91,10.08Z',
        }),
        'SuccessOutlined',
      ),
      j = (0, g.default)(
        (0, m.jsx)('path', {
          d: 'M12 5.99L19.53 19H4.47L12 5.99M12 2L1 21h22L12 2zm1 14h-2v2h2v-2zm0-6h-2v4h2v-4z',
        }),
        'ReportProblemOutlined',
      ),
      C = (0, g.default)(
        (0, m.jsx)('path', {
          d: 'M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z',
        }),
        'ErrorOutline',
      ),
      b = (0, g.default)(
        (0, m.jsx)('path', {
          d: 'M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20, 12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10, 10 0 0,0 12,2M11,17H13V11H11V17Z',
        }),
        'InfoOutlined',
      );
    var _ = e.i(50718);
    let w = [
        'action',
        'children',
        'className',
        'closeText',
        'color',
        'components',
        'componentsProps',
        'icon',
        'iconMapping',
        'onClose',
        'role',
        'severity',
        'slotProps',
        'slots',
        'variant',
      ],
      S = (0, n.styled)(u.default, {
        name: 'MuiAlert',
        slot: 'Root',
        overridesResolver: (e, t) => {
          let { ownerState: r } = e;
          return [t.root, t[r.variant], t[`${r.variant}${(0, c.default)(r.color || r.severity)}`]];
        },
      })(({ theme: e }) => {
        let t = 'light' === e.palette.mode ? o.darken : o.lighten,
          a = 'light' === e.palette.mode ? o.lighten : o.darken;
        return (0, r.default)({}, e.typography.body2, {
          backgroundColor: 'transparent',
          display: 'flex',
          padding: '6px 16px',
          variants: [
            ...Object.entries(e.palette)
              .filter(([, e]) => e.main && e.light)
              .map(([r]) => ({
                props: { colorSeverity: r, variant: 'standard' },
                style: {
                  color: e.vars ? e.vars.palette.Alert[`${r}Color`] : t(e.palette[r].light, 0.6),
                  backgroundColor: e.vars
                    ? e.vars.palette.Alert[`${r}StandardBg`]
                    : a(e.palette[r].light, 0.9),
                  [`& .${v.icon}`]: e.vars
                    ? { color: e.vars.palette.Alert[`${r}IconColor`] }
                    : { color: e.palette[r].main },
                },
              })),
            ...Object.entries(e.palette)
              .filter(([, e]) => e.main && e.light)
              .map(([r]) => ({
                props: { colorSeverity: r, variant: 'outlined' },
                style: {
                  color: e.vars ? e.vars.palette.Alert[`${r}Color`] : t(e.palette[r].light, 0.6),
                  border: `1px solid ${(e.vars || e).palette[r].light}`,
                  [`& .${v.icon}`]: e.vars
                    ? { color: e.vars.palette.Alert[`${r}IconColor`] }
                    : { color: e.palette[r].main },
                },
              })),
            ...Object.entries(e.palette)
              .filter(([, e]) => e.main && e.dark)
              .map(([t]) => ({
                props: { colorSeverity: t, variant: 'filled' },
                style: (0, r.default)(
                  { fontWeight: e.typography.fontWeightMedium },
                  e.vars
                    ? {
                        color: e.vars.palette.Alert[`${t}FilledColor`],
                        backgroundColor: e.vars.palette.Alert[`${t}FilledBg`],
                      }
                    : {
                        backgroundColor:
                          'dark' === e.palette.mode ? e.palette[t].dark : e.palette[t].main,
                        color: e.palette.getContrastText(e.palette[t].main),
                      },
                ),
              })),
          ],
        });
      }),
      M = (0, n.styled)('div', {
        name: 'MuiAlert',
        slot: 'Icon',
        overridesResolver: (e, t) => t.icon,
      })({ marginRight: 12, padding: '7px 0', display: 'flex', fontSize: 22, opacity: 0.9 }),
      A = (0, n.styled)('div', {
        name: 'MuiAlert',
        slot: 'Message',
        overridesResolver: (e, t) => t.message,
      })({ padding: '8px 0', minWidth: 0, overflow: 'auto' }),
      T = (0, n.styled)('div', {
        name: 'MuiAlert',
        slot: 'Action',
        overridesResolver: (e, t) => t.action,
      })({
        display: 'flex',
        alignItems: 'flex-start',
        padding: '4px 0 0 16px',
        marginLeft: 'auto',
        marginRight: -8,
      }),
      I = {
        success: (0, m.jsx)(y, { fontSize: 'inherit' }),
        warning: (0, m.jsx)(j, { fontSize: 'inherit' }),
        error: (0, m.jsx)(C, { fontSize: 'inherit' }),
        info: (0, m.jsx)(b, { fontSize: 'inherit' }),
      },
      D = a.forwardRef(function (e, a) {
        let o = (0, s.useDefaultProps)({ props: e, name: 'MuiAlert' }),
          {
            action: n,
            children: u,
            className: p,
            closeText: f = 'Close',
            color: v,
            components: g = {},
            componentsProps: y = {},
            icon: j,
            iconMapping: C = I,
            onClose: b,
            role: D = 'alert',
            severity: L = 'success',
            slotProps: z = {},
            slots: P = {},
            variant: $ = 'standard',
          } = o,
          R = (0, t.default)(o, w),
          W = (0, r.default)({}, o, { color: v, severity: L, variant: $, colorSeverity: v || L }),
          k = ((e) => {
            let { variant: t, color: r, severity: a, classes: i } = e,
              o = {
                root: [
                  'root',
                  `color${(0, c.default)(r || a)}`,
                  `${t}${(0, c.default)(r || a)}`,
                  `${t}`,
                ],
                icon: ['icon'],
                message: ['message'],
                action: ['action'],
              };
            return (0, l.default)(o, h, i);
          })(W),
          N = {
            slots: (0, r.default)({ closeButton: g.CloseButton, closeIcon: g.CloseIcon }, P),
            slotProps: (0, r.default)({}, y, z),
          },
          [B, F] = (0, d.default)('closeButton', {
            elementType: x.default,
            externalForwardedProps: N,
            ownerState: W,
          }),
          [E, O] = (0, d.default)('closeIcon', {
            elementType: _.default,
            externalForwardedProps: N,
            ownerState: W,
          });
        return (0, m.jsxs)(
          S,
          (0, r.default)(
            { role: D, elevation: 0, ownerState: W, className: (0, i.default)(k.root, p), ref: a },
            R,
            {
              children: [
                !1 !== j
                  ? (0, m.jsx)(M, { ownerState: W, className: k.icon, children: j || C[L] || I[L] })
                  : null,
                (0, m.jsx)(A, { ownerState: W, className: k.message, children: u }),
                null != n
                  ? (0, m.jsx)(T, { ownerState: W, className: k.action, children: n })
                  : null,
                null == n && b
                  ? (0, m.jsx)(T, {
                      ownerState: W,
                      className: k.action,
                      children: (0, m.jsx)(
                        B,
                        (0, r.default)(
                          {
                            size: 'small',
                            'aria-label': f,
                            title: f,
                            color: 'inherit',
                            onClick: b,
                          },
                          F,
                          { children: (0, m.jsx)(E, (0, r.default)({ fontSize: 'small' }, O)) },
                        ),
                      ),
                    })
                  : null,
              ],
            },
          ),
        );
      });
    e.s(['Alert', 0, D], 98562);
  },
  39549,
  (e, t, r) => {
    'use strict';
    var a = e.r(27249);
    (Object.defineProperty(r, '__esModule', { value: !0 }), (r.default = void 0));
    var i = a(e.r(72523)),
      l = e.r(37479);
    r.default = (0, i.default)(
      (0, l.jsx)('path', {
        d: 'M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4z',
      }),
      'Refresh',
    );
  },
  24319,
  (e) => {
    'use strict';
    var t = e.i(8929);
    e.s(['MenuItem', () => t.default]);
  },
  8462,
  (e) => {
    'use strict';
    var t = e.i(15845);
    e.s(['Select', () => t.default]);
  },
  23441,
  26132,
  (e) => {
    'use strict';
    var t = e.i(25275);
    e.s(['FormControl', () => t.default], 23441);
    var r = e.i(91502);
    e.s(['InputLabel', () => r.default], 26132);
  },
  66055,
  (e) => {
    'use strict';
    e.i(64775);
    var t,
      r = e.i(84570),
      a = e.i(98457),
      i = e.i(61129),
      l = e.i(94083),
      o = e.i(42306),
      n = e.i(6888),
      s = e.i(56292),
      d = e.i(37819),
      c = e.i(68271),
      u = e.i(47740),
      p = e.i(18635),
      f = e.i(50901);
    function h(e) {
      return (0, f.default)('MuiInputAdornment', e);
    }
    let v = (0, p.default)('MuiInputAdornment', [
      'root',
      'filled',
      'standard',
      'outlined',
      'positionStart',
      'positionEnd',
      'disablePointerEvents',
      'hiddenLabel',
      'sizeSmall',
    ]);
    var x = e.i(10372),
      g = e.i(37479);
    let m = [
        'children',
        'className',
        'component',
        'disablePointerEvents',
        'disableTypography',
        'position',
        'variant',
      ],
      y = (0, u.default)('div', {
        name: 'MuiInputAdornment',
        slot: 'Root',
        overridesResolver: (e, t) => {
          let { ownerState: r } = e;
          return [
            t.root,
            t[`position${(0, n.default)(r.position)}`],
            !0 === r.disablePointerEvents && t.disablePointerEvents,
            t[r.variant],
          ];
        },
      })(({ theme: e, ownerState: t }) =>
        (0, a.default)(
          {
            display: 'flex',
            height: '0.01em',
            maxHeight: '2em',
            alignItems: 'center',
            whiteSpace: 'nowrap',
            color: (e.vars || e).palette.action.active,
          },
          'filled' === t.variant && {
            [`&.${v.positionStart}&:not(.${v.hiddenLabel})`]: { marginTop: 16 },
          },
          'start' === t.position && { marginRight: 8 },
          'end' === t.position && { marginLeft: 8 },
          !0 === t.disablePointerEvents && { pointerEvents: 'none' },
        ),
      ),
      j = i.forwardRef(function (e, u) {
        let p = (0, x.useDefaultProps)({ props: e, name: 'MuiInputAdornment' }),
          {
            children: f,
            className: v,
            component: j = 'div',
            disablePointerEvents: C = !1,
            disableTypography: b = !1,
            position: _,
            variant: w,
          } = p,
          S = (0, r.default)(p, m),
          M = (0, c.default)() || {},
          A = w;
        (w && M.variant, M && !A && (A = M.variant));
        let T = (0, a.default)({}, p, {
            hiddenLabel: M.hiddenLabel,
            size: M.size,
            disablePointerEvents: C,
            position: _,
            variant: A,
          }),
          I = ((e) => {
            let {
                classes: t,
                disablePointerEvents: r,
                hiddenLabel: a,
                position: i,
                size: l,
                variant: s,
              } = e,
              d = {
                root: [
                  'root',
                  r && 'disablePointerEvents',
                  i && `position${(0, n.default)(i)}`,
                  s,
                  a && 'hiddenLabel',
                  l && `size${(0, n.default)(l)}`,
                ],
              };
            return (0, o.default)(d, h, t);
          })(T);
        return (0, g.jsx)(d.default.Provider, {
          value: null,
          children: (0, g.jsx)(
            y,
            (0, a.default)(
              { as: j, ownerState: T, className: (0, l.default)(I.root, v), ref: u },
              S,
              {
                children:
                  'string' != typeof f || b
                    ? (0, g.jsxs)(i.Fragment, {
                        children: [
                          'start' === _
                            ? t ||
                              (t = (0, g.jsx)('span', { className: 'notranslate', children: '​' }))
                            : null,
                          f,
                        ],
                      })
                    : (0, g.jsx)(s.default, { color: 'text.secondary', children: f }),
              },
            ),
          ),
        });
      });
    e.s(['InputAdornment', 0, j], 66055);
  },
  10354,
  (e, t, r) => {
    'use strict';
    var a = e.r(27249);
    (Object.defineProperty(r, '__esModule', { value: !0 }), (r.default = void 0));
    var i = a(e.r(72523)),
      l = e.r(37479);
    r.default = (0, i.default)(
      (0, l.jsx)('path', {
        d: 'M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14',
      }),
      'Search',
    );
  },
  24845,
  (e) => {
    'use strict';
    var t = e.i(37479),
      r = e.i(61129),
      a = e.i(24644),
      i = e.i(20412),
      l = e.i(43737),
      o = e.i(8462),
      n = e.i(24319),
      s = e.i(23441),
      d = e.i(26132),
      c = e.i(98562),
      u = e.i(29744),
      p = e.i(25417),
      f = e.i(23786),
      h = e.i(66055),
      v = e.i(80461),
      x = e.i(25592),
      g = e.i(55584),
      m = e.i(20218),
      y = e.i(24859),
      j = e.i(34909),
      C = e.i(98123),
      b = e.i(73803),
      _ = e.i(72233),
      w = e.i(39549),
      S = e.i(10354),
      M = e.i(83754);
    e.i(74507);
    var A = e.i(32576),
      T = e.i(21203);
    let I = { active: 'success', pending: 'warning', expired: 'default', cancelled: 'error' };
    e.s([
      'default',
      0,
      function () {
        let { t: e } = (0, A.useTranslation)(),
          [D, L] = (0, r.useState)([]),
          [z, P] = (0, r.useState)([]),
          [$, R] = (0, r.useState)(!0),
          [W, k] = (0, r.useState)(null),
          [N, B] = (0, r.useState)('all'),
          [F, E] = (0, r.useState)(''),
          [O, H] = (0, r.useState)(0),
          [Q, V] = (0, r.useState)(25),
          [q, U] = (0, r.useState)(0),
          [G, K] = (0, r.useState)(null),
          [Z, Y] = (0, r.useState)(!1),
          J = (t) => e(`status_labels.${t}`),
          X = (0, r.useCallback)(async () => {
            (R(!0), k(null));
            try {
              let e = T.supabaseClient
                .from('subscriptions')
                .select(
                  `
          id,
          status,
          start_date,
          end_date,
          created_at,
          profiles!subscriptions_student_id_fkey(full_name, phone),
          routes!subscriptions_route_id_fkey(title, price, start_location, end_location)
        `,
                  { count: 'exact' },
                )
                .order('created_at', { ascending: !1 })
                .range(O * Q, O * Q + Q - 1);
              'all' !== N && (e = e.eq('status', N));
              let { data: t, error: r, count: a } = await e;
              if (r) throw r;
              let i = (t || []).map((e) => {
                let t = Array.isArray(e.profiles) ? e.profiles[0] : e.profiles,
                  r = Array.isArray(e.routes) ? e.routes[0] : e.routes;
                return {
                  id: e.id,
                  status: e.status,
                  start_date: e.start_date,
                  end_date: e.end_date,
                  created_at: e.created_at,
                  student_name: t?.full_name ?? '—',
                  student_phone: t?.phone ?? '—',
                  route_title: r?.title ?? '—',
                  route_price: r?.price ?? 0,
                  route_start_location: r?.start_location ?? '—',
                  route_end_location: r?.end_location ?? '—',
                };
              });
              (L(i), U(a ?? 0));
            } catch (t) {
              k(t instanceof Error ? t.message : e('subscriptions.errors.loadFailed'));
            } finally {
              R(!1);
            }
          }, [N, O, Q]);
        ((0, r.useEffect)(() => {
          X();
        }, [X]),
          (0, r.useEffect)(() => {
            let e = D;
            if (F) {
              let t = F.toLowerCase();
              e = e.filter(
                (e) =>
                  e.student_name.toLowerCase().includes(t) ||
                  e.student_phone.includes(t) ||
                  e.route_title.toLowerCase().includes(t) ||
                  e.route_start_location.toLowerCase().includes(t) ||
                  e.route_end_location.toLowerCase().includes(t),
              );
            }
            P(e);
          }, [D, F]));
        let ee = (e) => (e <= 3 ? '#FF3B30' : e <= 7 ? '#FF9500' : '#34C759'),
          et = async () => {
            if (G) {
              (Y(!0), k(null));
              try {
                let { error: e } = await T.supabaseClient.rpc('cancel_subscription', {
                  p_subscription_id: G,
                });
                if (e) throw e;
                (L((e) => e.map((e) => (e.id === G ? { ...e, status: 'cancelled' } : e))),
                  K(null),
                  X());
              } catch (t) {
                k(t instanceof Error ? t.message : e('subscriptions.errors.cancelFailed'));
              } finally {
                Y(!1);
              }
            }
          },
          er = [
            {
              field: 'student',
              headerName: e('subscriptions.fields.student'),
              minWidth: 220,
              flex: 1,
              renderCell: (e) =>
                (0, t.jsxs)(v.Stack, {
                  direction: 'row',
                  spacing: 1.5,
                  alignItems: 'center',
                  height: '100%',
                  children: [
                    (0, t.jsx)(x.Avatar, {
                      sx: { width: 36, height: 36, bgcolor: '#007AFF', fontSize: 14 },
                      children: e.row.student_name.charAt(0).toUpperCase(),
                    }),
                    (0, t.jsxs)(a.Box, {
                      children: [
                        (0, t.jsx)(i.Typography, {
                          variant: 'body2',
                          fontWeight: 600,
                          children: e.row.student_name,
                        }),
                        (0, t.jsx)(i.Typography, {
                          variant: 'caption',
                          color: 'text.secondary',
                          children: e.row.student_phone,
                        }),
                      ],
                    }),
                  ],
                }),
            },
            {
              field: 'route',
              headerName: e('subscriptions.fields.route'),
              minWidth: 220,
              flex: 1,
              renderCell: (e) =>
                (0, t.jsxs)(a.Box, {
                  children: [
                    (0, t.jsx)(i.Typography, {
                      variant: 'body2',
                      fontWeight: 600,
                      children: e.row.route_title,
                    }),
                    (0, t.jsxs)(v.Stack, {
                      direction: 'row',
                      spacing: 0.5,
                      alignItems: 'center',
                      children: [
                        (0, t.jsx)(i.Typography, {
                          variant: 'caption',
                          color: 'text.secondary',
                          children: e.row.route_start_location,
                        }),
                        (0, t.jsx)(i.Typography, {
                          variant: 'caption',
                          color: 'text.secondary',
                          children: '→',
                        }),
                        (0, t.jsx)(i.Typography, {
                          variant: 'caption',
                          color: 'text.secondary',
                          children: e.row.route_end_location,
                        }),
                      ],
                    }),
                  ],
                }),
            },
            {
              field: 'status',
              headerName: e('subscriptions.fields.status'),
              minWidth: 120,
              flex: 0.6,
              renderCell: (e) =>
                (0, t.jsx)(l.Chip, {
                  label: J(e.row.status),
                  color: I[e.row.status] ?? 'default',
                  size: 'small',
                  variant: 'outlined',
                }),
            },
            {
              field: 'days_remaining',
              headerName: e('subscriptions.fields.daysRemaining'),
              minWidth: 120,
              flex: 0.5,
              renderCell: (r) => {
                let a = ((e, t) => {
                  if ('active' !== t) return 0;
                  let r = new Date(e),
                    a = new Date();
                  return Math.max(0, Math.ceil((r.getTime() - a.getTime()) / 864e5));
                })(r.row.end_date, r.row.status);
                return 'active' !== r.row.status
                  ? (0, t.jsx)(i.Typography, {
                      variant: 'caption',
                      color: 'text.secondary',
                      children: '—',
                    })
                  : (0, t.jsx)(l.Chip, {
                      label: `${a} ${e('days') || 'days'}`,
                      size: 'small',
                      sx: { bgcolor: ee(a) + '20', color: ee(a), fontWeight: 600 },
                    });
              },
            },
            {
              field: 'start_date',
              headerName: e('subscriptions.fields.startDate'),
              minWidth: 130,
              flex: 0.6,
              renderCell: (e) =>
                e.row.start_date ? new Date(e.row.start_date).toLocaleDateString('ar-IQ') : '—',
            },
            {
              field: 'end_date',
              headerName: e('subscriptions.fields.endDate'),
              minWidth: 130,
              flex: 0.6,
              renderCell: (e) =>
                e.row.end_date ? new Date(e.row.end_date).toLocaleDateString('ar-IQ') : '—',
            },
            {
              field: 'price',
              headerName: e('subscriptions.fields.price'),
              minWidth: 100,
              flex: 0.4,
              renderCell: (r) =>
                (0, t.jsxs)(i.Typography, {
                  variant: 'body2',
                  fontWeight: 600,
                  color: 'primary',
                  children: [r.row.route_price.toLocaleString(), ' ', e('iqd') || 'IQD'],
                }),
            },
            {
              field: 'created_at',
              headerName: e('subscriptions.fields.createdAt'),
              minWidth: 130,
              flex: 0.6,
              renderCell: (e) =>
                e.row.created_at ? new Date(e.row.created_at).toLocaleDateString('ar-IQ') : '—',
            },
            {
              field: 'actions',
              headerName: e('actions.actions'),
              sortable: !1,
              minWidth: 100,
              align: 'center',
              headerAlign: 'center',
              renderCell: (r) =>
                'active' === r.row.status || 'pending' === r.row.status
                  ? (0, t.jsx)(p.Tooltip, {
                      title: e('subscriptions.actions.cancel') || 'Cancel subscription',
                      children: (0, t.jsx)(u.IconButton, {
                        size: 'small',
                        color: 'error',
                        onClick: () => K(r.row.id),
                        children: (0, t.jsx)(M.default, { fontSize: 'small' }),
                      }),
                    })
                  : (0, t.jsx)(i.Typography, {
                      variant: 'caption',
                      color: 'text.secondary',
                      children: '—',
                    }),
            },
          ],
          ea = (0, r.useMemo)(() => {
            let e = D.length,
              t = D.filter((e) => 'active' === e.status).length,
              r = D.filter((e) => 'pending' === e.status).length,
              a = D.filter((e) => 'expired' === e.status).length;
            return {
              totalSubs: e,
              active: t,
              pending: r,
              expired: a,
              cancelled: D.filter((e) => 'cancelled' === e.status).length,
              totalRevenue: D.filter((e) => 'active' === e.status).reduce(
                (e, t) => e + t.route_price,
                0,
              ),
            };
          }, [D]);
        return (0, t.jsxs)(a.Box, {
          sx: { p: 3 },
          children: [
            (0, t.jsxs)(a.Box, {
              sx: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 },
              children: [
                (0, t.jsxs)(a.Box, {
                  children: [
                    (0, t.jsx)(i.Typography, {
                      variant: 'h5',
                      fontWeight: 'bold',
                      children: e('subscriptions.titles.list'),
                    }),
                    (0, t.jsxs)(v.Stack, {
                      direction: 'row',
                      spacing: 2,
                      mt: 1,
                      children: [
                        (0, t.jsxs)(i.Typography, {
                          variant: 'caption',
                          color: 'text.secondary',
                          children: [e('total'), ': ', ea.totalSubs],
                        }),
                        (0, t.jsxs)(i.Typography, {
                          variant: 'caption',
                          sx: { color: '#34C759' },
                          children: [e('active'), ': ', ea.active],
                        }),
                        (0, t.jsxs)(i.Typography, {
                          variant: 'caption',
                          sx: { color: '#FF9500' },
                          children: [e('pending'), ': ', ea.pending],
                        }),
                        (0, t.jsxs)(i.Typography, {
                          variant: 'caption',
                          sx: { color: '#FF3B30' },
                          children: [e('expired'), ': ', ea.expired],
                        }),
                        (0, t.jsxs)(i.Typography, {
                          variant: 'caption',
                          color: 'text.secondary',
                          children: [
                            e('revenue'),
                            ': ',
                            ea.totalRevenue.toLocaleString(),
                            ' ',
                            e('iqd') || 'IQD',
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
                (0, t.jsx)(p.Tooltip, {
                  title: 'Refresh',
                  children: (0, t.jsx)(u.IconButton, {
                    onClick: X,
                    disabled: $,
                    color: 'primary',
                    children: (0, t.jsx)(w.default, {}),
                  }),
                }),
              ],
            }),
            (0, t.jsxs)(a.Box, {
              sx: { display: 'flex', gap: 2, mb: 3 },
              children: [
                (0, t.jsx)(f.TextField, {
                  size: 'small',
                  placeholder: e('search_subscriptions') || 'Search by student, route, phone...',
                  value: F,
                  onChange: (e) => E(e.target.value),
                  sx: { minWidth: 300 },
                  InputProps: {
                    startAdornment: (0, t.jsx)(h.InputAdornment, {
                      position: 'start',
                      children: (0, t.jsx)(S.default, { sx: { color: 'text.secondary' } }),
                    }),
                  },
                }),
                (0, t.jsxs)(s.FormControl, {
                  size: 'small',
                  sx: { minWidth: 160 },
                  children: [
                    (0, t.jsx)(d.InputLabel, { children: e('status') }),
                    (0, t.jsxs)(o.Select, {
                      value: N,
                      label: e('status'),
                      onChange: (e) => {
                        (B(e.target.value), H(0));
                      },
                      children: [
                        (0, t.jsx)(n.MenuItem, { value: 'all', children: e('all_statuses') }),
                        (0, t.jsx)(n.MenuItem, { value: 'active', children: J('active') }),
                        (0, t.jsx)(n.MenuItem, { value: 'pending', children: J('pending') }),
                        (0, t.jsx)(n.MenuItem, { value: 'expired', children: J('expired') }),
                        (0, t.jsx)(n.MenuItem, { value: 'cancelled', children: J('cancelled') }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
            W &&
              (0, t.jsx)(c.Alert, {
                severity: 'error',
                sx: { mb: 2 },
                onClose: () => k(null),
                children: W,
              }),
            (0, t.jsx)(_.DataGrid, {
              rows: z,
              columns: er,
              loading: $,
              rowCount: q,
              paginationMode: 'server',
              page: O,
              pageSize: Q,
              onPageChange: (e) => H(e),
              onPageSizeChange: (e) => {
                (V(e), H(0));
              },
              rowsPerPageOptions: [10, 25, 50, 100],
              autoHeight: !0,
              disableSelectionOnClick: !0,
              sx: { '& .MuiDataGrid-row:hover': { bgcolor: 'action.hover' } },
            }),
            (0, t.jsxs)(m.Dialog, {
              open: !!G,
              onClose: () => K(null),
              children: [
                (0, t.jsx)(y.DialogTitle, {
                  children: e('subscriptions.actions.cancel') || 'Cancel subscription',
                }),
                (0, t.jsx)(j.DialogContent, {
                  children: (0, t.jsx)(C.DialogContentText, {
                    children: e('are_you_sure') || 'Are you sure?',
                  }),
                }),
                (0, t.jsxs)(b.DialogActions, {
                  sx: { p: 2 },
                  children: [
                    (0, t.jsx)(g.Button, {
                      onClick: () => K(null),
                      color: 'inherit',
                      disabled: Z,
                      children: e('cancel') || 'Cancel',
                    }),
                    (0, t.jsx)(g.Button, {
                      onClick: et,
                      color: 'error',
                      variant: 'contained',
                      disabled: Z,
                      children: e('confirm') || 'Confirm',
                    }),
                  ],
                }),
              ],
            }),
          ],
        });
      },
    ]);
  },
]);
