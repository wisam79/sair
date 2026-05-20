(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([
  'object' == typeof document ? document.currentScript : void 0,
  50718,
  (e) => {
    'use strict';
    e.i(61129);
    var t = e.i(16320),
      a = e.i(37479);
    let i = (0, t.default)(
      (0, a.jsx)('path', {
        d: 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z',
      }),
      'Close',
    );
    e.s(['default', 0, i]);
  },
  8929,
  (e) => {
    'use strict';
    e.i(64775);
    var t = e.i(84570),
      a = e.i(98457),
      i = e.i(61129),
      l = e.i(94083),
      r = e.i(42306),
      o = e.i(26589),
      s = e.i(47740),
      n = e.i(69321),
      d = e.i(10372),
      c = e.i(41781),
      u = e.i(81330),
      p = e.i(19348),
      f = e.i(86778),
      m = e.i(60898),
      m = m,
      v = e.i(96246),
      v = v,
      g = e.i(51370),
      g = g,
      h = e.i(18635),
      y = e.i(50901);
    function x(e) {
      return (0, y.default)('MuiMenuItem', e);
    }
    let b = (0, h.default)('MuiMenuItem', [
      'root',
      'focusVisible',
      'dense',
      'disabled',
      'divider',
      'gutters',
      'selected',
    ]);
    var C = e.i(37479);
    let j = [
        'autoFocus',
        'component',
        'dense',
        'divider',
        'disableGutters',
        'focusVisibleClassName',
        'role',
        'tabIndex',
        'className',
      ],
      S = (0, s.default)(u.default, {
        shouldForwardProp: (e) => (0, n.rootShouldForwardProp)(e) || 'classes' === e,
        name: 'MuiMenuItem',
        slot: 'Root',
        overridesResolver: (e, t) => {
          let { ownerState: a } = e;
          return [
            t.root,
            a.dense && t.dense,
            a.divider && t.divider,
            !a.disableGutters && t.gutters,
          ];
        },
      })(({ theme: e, ownerState: t }) =>
        (0, a.default)(
          {},
          e.typography.body1,
          {
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            position: 'relative',
            textDecoration: 'none',
            minHeight: 48,
            paddingTop: 6,
            paddingBottom: 6,
            boxSizing: 'border-box',
            whiteSpace: 'nowrap',
          },
          !t.disableGutters && { paddingLeft: 16, paddingRight: 16 },
          t.divider && {
            borderBottom: `1px solid ${(e.vars || e).palette.divider}`,
            backgroundClip: 'padding-box',
          },
          {
            '&:hover': {
              textDecoration: 'none',
              backgroundColor: (e.vars || e).palette.action.hover,
              '@media (hover: none)': { backgroundColor: 'transparent' },
            },
            [`&.${b.selected}`]: {
              backgroundColor: e.vars
                ? `rgba(${e.vars.palette.primary.mainChannel} / ${e.vars.palette.action.selectedOpacity})`
                : (0, o.alpha)(e.palette.primary.main, e.palette.action.selectedOpacity),
              [`&.${b.focusVisible}`]: {
                backgroundColor: e.vars
                  ? `rgba(${e.vars.palette.primary.mainChannel} / calc(${e.vars.palette.action.selectedOpacity} + ${e.vars.palette.action.focusOpacity}))`
                  : (0, o.alpha)(
                      e.palette.primary.main,
                      e.palette.action.selectedOpacity + e.palette.action.focusOpacity,
                    ),
              },
            },
            [`&.${b.selected}:hover`]: {
              backgroundColor: e.vars
                ? `rgba(${e.vars.palette.primary.mainChannel} / calc(${e.vars.palette.action.selectedOpacity} + ${e.vars.palette.action.hoverOpacity}))`
                : (0, o.alpha)(
                    e.palette.primary.main,
                    e.palette.action.selectedOpacity + e.palette.action.hoverOpacity,
                  ),
              '@media (hover: none)': {
                backgroundColor: e.vars
                  ? `rgba(${e.vars.palette.primary.mainChannel} / ${e.vars.palette.action.selectedOpacity})`
                  : (0, o.alpha)(e.palette.primary.main, e.palette.action.selectedOpacity),
              },
            },
            [`&.${b.focusVisible}`]: { backgroundColor: (e.vars || e).palette.action.focus },
            [`&.${b.disabled}`]: { opacity: (e.vars || e).palette.action.disabledOpacity },
            [`& + .${m.default.root}`]: { marginTop: e.spacing(1), marginBottom: e.spacing(1) },
            [`& + .${m.default.inset}`]: { marginLeft: 52 },
            [`& .${g.default.root}`]: { marginTop: 0, marginBottom: 0 },
            [`& .${g.default.inset}`]: { paddingLeft: 36 },
            [`& .${v.default.root}`]: { minWidth: 36 },
          },
          !t.dense && { [e.breakpoints.up('sm')]: { minHeight: 'auto' } },
          t.dense &&
            (0, a.default)({ minHeight: 32, paddingTop: 4, paddingBottom: 4 }, e.typography.body2, {
              [`& .${v.default.root} svg`]: { fontSize: '1.25rem' },
            }),
        ),
      ),
      $ = i.forwardRef(function (e, o) {
        let s,
          n = (0, d.useDefaultProps)({ props: e, name: 'MuiMenuItem' }),
          {
            autoFocus: u = !1,
            component: m = 'li',
            dense: v = !1,
            divider: g = !1,
            disableGutters: h = !1,
            focusVisibleClassName: y,
            role: b = 'menuitem',
            tabIndex: $,
            className: M,
          } = n,
          A = (0, t.default)(n, j),
          I = i.useContext(c.default),
          O = i.useMemo(() => ({ dense: v || I.dense || !1, disableGutters: h }), [I.dense, v, h]),
          k = i.useRef(null);
        (0, p.default)(() => {
          u && k.current && k.current.focus();
        }, [u]);
        let z = (0, a.default)({}, n, { dense: O.dense, divider: g, disableGutters: h }),
          w = ((e) => {
            let {
                disabled: t,
                dense: i,
                divider: l,
                disableGutters: o,
                selected: s,
                classes: n,
              } = e,
              d = (0, r.default)(
                {
                  root: [
                    'root',
                    i && 'dense',
                    t && 'disabled',
                    !o && 'gutters',
                    l && 'divider',
                    s && 'selected',
                  ],
                },
                x,
                n,
              );
            return (0, a.default)({}, n, d);
          })(n),
          L = (0, f.default)(k, o);
        return (
          n.disabled || (s = void 0 !== $ ? $ : -1),
          (0, C.jsx)(c.default.Provider, {
            value: O,
            children: (0, C.jsx)(
              S,
              (0, a.default)(
                {
                  ref: L,
                  role: b,
                  tabIndex: s,
                  component: m,
                  focusVisibleClassName: (0, l.default)(w.focusVisible, y),
                  className: (0, l.default)(w.root, M),
                },
                A,
                { ownerState: z, classes: w },
              ),
            ),
          })
        );
      });
    e.s(['default', 0, $], 8929);
  },
  98562,
  (e) => {
    'use strict';
    e.i(64775);
    var t = e.i(84570),
      a = e.i(98457),
      i = e.i(61129),
      l = e.i(94083),
      r = e.i(42306),
      o = e.i(26589),
      s = e.i(44504),
      n = e.i(10372),
      d = e.i(59049),
      c = e.i(6888),
      u = e.i(58478),
      p = e.i(18635),
      f = e.i(50901);
    function m(e) {
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
    var g = e.i(37473),
      h = e.i(16320),
      y = e.i(37479);
    let x = (0, h.default)(
        (0, y.jsx)('path', {
          d: 'M20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4C12.76,4 13.5,4.11 14.2, 4.31L15.77,2.74C14.61,2.26 13.34,2 12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0, 0 22,12M7.91,10.08L6.5,11.5L11,16L21,6L19.59,4.58L11,13.17L7.91,10.08Z',
        }),
        'SuccessOutlined',
      ),
      b = (0, h.default)(
        (0, y.jsx)('path', {
          d: 'M12 5.99L19.53 19H4.47L12 5.99M12 2L1 21h22L12 2zm1 14h-2v2h2v-2zm0-6h-2v4h2v-4z',
        }),
        'ReportProblemOutlined',
      ),
      C = (0, h.default)(
        (0, y.jsx)('path', {
          d: 'M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z',
        }),
        'ErrorOutline',
      ),
      j = (0, h.default)(
        (0, y.jsx)('path', {
          d: 'M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20, 12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10, 10 0 0,0 12,2M11,17H13V11H11V17Z',
        }),
        'InfoOutlined',
      );
    var S = e.i(50718);
    let $ = [
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
      M = (0, s.styled)(u.default, {
        name: 'MuiAlert',
        slot: 'Root',
        overridesResolver: (e, t) => {
          let { ownerState: a } = e;
          return [t.root, t[a.variant], t[`${a.variant}${(0, c.default)(a.color || a.severity)}`]];
        },
      })(({ theme: e }) => {
        let t = 'light' === e.palette.mode ? o.darken : o.lighten,
          i = 'light' === e.palette.mode ? o.lighten : o.darken;
        return (0, a.default)({}, e.typography.body2, {
          backgroundColor: 'transparent',
          display: 'flex',
          padding: '6px 16px',
          variants: [
            ...Object.entries(e.palette)
              .filter(([, e]) => e.main && e.light)
              .map(([a]) => ({
                props: { colorSeverity: a, variant: 'standard' },
                style: {
                  color: e.vars ? e.vars.palette.Alert[`${a}Color`] : t(e.palette[a].light, 0.6),
                  backgroundColor: e.vars
                    ? e.vars.palette.Alert[`${a}StandardBg`]
                    : i(e.palette[a].light, 0.9),
                  [`& .${v.icon}`]: e.vars
                    ? { color: e.vars.palette.Alert[`${a}IconColor`] }
                    : { color: e.palette[a].main },
                },
              })),
            ...Object.entries(e.palette)
              .filter(([, e]) => e.main && e.light)
              .map(([a]) => ({
                props: { colorSeverity: a, variant: 'outlined' },
                style: {
                  color: e.vars ? e.vars.palette.Alert[`${a}Color`] : t(e.palette[a].light, 0.6),
                  border: `1px solid ${(e.vars || e).palette[a].light}`,
                  [`& .${v.icon}`]: e.vars
                    ? { color: e.vars.palette.Alert[`${a}IconColor`] }
                    : { color: e.palette[a].main },
                },
              })),
            ...Object.entries(e.palette)
              .filter(([, e]) => e.main && e.dark)
              .map(([t]) => ({
                props: { colorSeverity: t, variant: 'filled' },
                style: (0, a.default)(
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
      A = (0, s.styled)('div', {
        name: 'MuiAlert',
        slot: 'Icon',
        overridesResolver: (e, t) => t.icon,
      })({ marginRight: 12, padding: '7px 0', display: 'flex', fontSize: 22, opacity: 0.9 }),
      I = (0, s.styled)('div', {
        name: 'MuiAlert',
        slot: 'Message',
        overridesResolver: (e, t) => t.message,
      })({ padding: '8px 0', minWidth: 0, overflow: 'auto' }),
      O = (0, s.styled)('div', {
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
      k = {
        success: (0, y.jsx)(x, { fontSize: 'inherit' }),
        warning: (0, y.jsx)(b, { fontSize: 'inherit' }),
        error: (0, y.jsx)(C, { fontSize: 'inherit' }),
        info: (0, y.jsx)(j, { fontSize: 'inherit' }),
      },
      z = i.forwardRef(function (e, i) {
        let o = (0, n.useDefaultProps)({ props: e, name: 'MuiAlert' }),
          {
            action: s,
            children: u,
            className: p,
            closeText: f = 'Close',
            color: v,
            components: h = {},
            componentsProps: x = {},
            icon: b,
            iconMapping: C = k,
            onClose: j,
            role: z = 'alert',
            severity: w = 'success',
            slotProps: L = {},
            slots: R = {},
            variant: T = 'standard',
          } = o,
          B = (0, t.default)(o, $),
          P = (0, a.default)({}, o, { color: v, severity: w, variant: T, colorSeverity: v || w }),
          W = ((e) => {
            let { variant: t, color: a, severity: i, classes: l } = e,
              o = {
                root: [
                  'root',
                  `color${(0, c.default)(a || i)}`,
                  `${t}${(0, c.default)(a || i)}`,
                  `${t}`,
                ],
                icon: ['icon'],
                message: ['message'],
                action: ['action'],
              };
            return (0, r.default)(o, m, l);
          })(P),
          N = {
            slots: (0, a.default)({ closeButton: h.CloseButton, closeIcon: h.CloseIcon }, R),
            slotProps: (0, a.default)({}, x, L),
          },
          [F, V] = (0, d.default)('closeButton', {
            elementType: g.default,
            externalForwardedProps: N,
            ownerState: P,
          }),
          [E, H] = (0, d.default)('closeIcon', {
            elementType: S.default,
            externalForwardedProps: N,
            ownerState: P,
          });
        return (0, y.jsxs)(
          M,
          (0, a.default)(
            { role: z, elevation: 0, ownerState: P, className: (0, l.default)(W.root, p), ref: i },
            B,
            {
              children: [
                !1 !== b
                  ? (0, y.jsx)(A, { ownerState: P, className: W.icon, children: b || C[w] || k[w] })
                  : null,
                (0, y.jsx)(I, { ownerState: P, className: W.message, children: u }),
                null != s
                  ? (0, y.jsx)(O, { ownerState: P, className: W.action, children: s })
                  : null,
                null == s && j
                  ? (0, y.jsx)(O, {
                      ownerState: P,
                      className: W.action,
                      children: (0, y.jsx)(
                        F,
                        (0, a.default)(
                          {
                            size: 'small',
                            'aria-label': f,
                            title: f,
                            color: 'inherit',
                            onClick: j,
                          },
                          V,
                          { children: (0, y.jsx)(E, (0, a.default)({ fontSize: 'small' }, H)) },
                        ),
                      ),
                    })
                  : null,
              ],
            },
          ),
        );
      });
    e.s(['Alert', 0, z], 98562);
  },
  24319,
  (e) => {
    'use strict';
    var t = e.i(8929);
    e.s(['MenuItem', () => t.default]);
  },
  23441,
  26132,
  (e) => {
    'use strict';
    var t = e.i(25275);
    e.s(['FormControl', () => t.default], 23441);
    var a = e.i(91502);
    e.s(['InputLabel', () => a.default], 26132);
  },
  8462,
  (e) => {
    'use strict';
    var t = e.i(15845);
    e.s(['Select', () => t.default]);
  },
  9728,
  (e, t, a) => {
    'use strict';
    var i = e.r(27249);
    (Object.defineProperty(a, '__esModule', { value: !0 }), (a.default = void 0));
    var l = i(e.r(72523)),
      r = e.r(37479);
    a.default = (0, l.default)(
      (0, r.jsx)('path', { d: 'M2.01 21 23 12 2.01 3 2 10l15 2-15 2z' }),
      'Send',
    );
  },
  21101,
  (e) => {
    'use strict';
    var t = e.i(37479),
      a = e.i(61129),
      i = e.i(24644),
      l = e.i(20412),
      r = e.i(65311),
      o = e.i(87332),
      s = e.i(23786),
      n = e.i(55584),
      d = e.i(23441),
      c = e.i(26132),
      u = e.i(8462),
      p = e.i(24319),
      f = e.i(98562),
      m = e.i(41191),
      v = e.i(9728);
    e.i(74507);
    var g = e.i(32576),
      h = e.i(21203);
    e.s([
      'default',
      0,
      function () {
        let { t: e } = (0, g.useTranslation)(),
          [y, x] = (0, a.useState)('all'),
          [b, C] = (0, a.useState)(''),
          [j, S] = (0, a.useState)(''),
          [$, M] = (0, a.useState)(!1),
          [A, I] = (0, a.useState)(null),
          O = async () => {
            if (b.trim() && j.trim()) {
              (M(!0), I(null));
              try {
                let {
                  data: { session: t },
                } = await h.supabaseClient.auth.getSession();
                if (!t) throw Error('No active session');
                let a = await fetch(
                    'https://pfjsqgqrxnrlrfnchnqf.supabase.co/functions/v1/send-notification',
                    {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${t.access_token}`,
                        'idempotency-key': crypto.randomUUID(),
                      },
                      body: JSON.stringify({ targetRole: y, title: b.trim(), body: j.trim() }),
                    },
                  ),
                  i = await a.json();
                if (!a.ok) throw Error(i.error || i.message || 'Failed to send notification');
                i.success
                  ? (I({ success: !0, message: e('notifications.success', { sent: i.sent || 0 }) }),
                    C(''),
                    S(''))
                  : I({ success: !1, message: i.message || e('notifications.failed') });
              } catch (t) {
                I({
                  success: !1,
                  message: t instanceof Error ? t.message : e('notifications.failed'),
                });
              } finally {
                M(!1);
              }
            }
          };
        return (0, t.jsxs)(i.Box, {
          sx: { p: 3, maxWidth: 600, mx: 'auto' },
          children: [
            (0, t.jsx)(l.Typography, {
              variant: 'h5',
              fontWeight: 'bold',
              mb: 3,
              children: e('notifications.titles.broadcast'),
            }),
            (0, t.jsx)(r.Card, {
              elevation: 0,
              variant: 'outlined',
              sx: { borderRadius: 3 },
              children: (0, t.jsxs)(o.CardContent, {
                sx: { display: 'flex', flexDirection: 'column', gap: 3 },
                children: [
                  A &&
                    (0, t.jsx)(f.Alert, {
                      severity: A.success ? 'success' : 'error',
                      onClose: () => I(null),
                      children: A.message,
                    }),
                  (0, t.jsxs)(d.FormControl, {
                    fullWidth: !0,
                    children: [
                      (0, t.jsx)(c.InputLabel, { children: e('notifications.fields.target') }),
                      (0, t.jsxs)(u.Select, {
                        value: y,
                        label: e('notifications.fields.target'),
                        onChange: (e) => x(e.target.value),
                        disabled: $,
                        children: [
                          (0, t.jsx)(p.MenuItem, {
                            value: 'all',
                            children: e('notifications.targets.all'),
                          }),
                          (0, t.jsx)(p.MenuItem, {
                            value: 'student',
                            children: e('notifications.targets.student'),
                          }),
                          (0, t.jsx)(p.MenuItem, {
                            value: 'driver',
                            children: e('notifications.targets.driver'),
                          }),
                        ],
                      }),
                    ],
                  }),
                  (0, t.jsx)(s.TextField, {
                    fullWidth: !0,
                    label: e('notifications.fields.title'),
                    value: b,
                    onChange: (e) => C(e.target.value),
                    disabled: $,
                    variant: 'outlined',
                  }),
                  (0, t.jsx)(s.TextField, {
                    fullWidth: !0,
                    label: e('notifications.fields.body'),
                    value: j,
                    onChange: (e) => S(e.target.value),
                    disabled: $,
                    multiline: !0,
                    rows: 4,
                    variant: 'outlined',
                  }),
                  (0, t.jsx)(n.Button, {
                    variant: 'contained',
                    color: 'primary',
                    size: 'large',
                    onClick: O,
                    disabled: $ || !b.trim() || !j.trim(),
                    startIcon: $
                      ? (0, t.jsx)(m.CircularProgress, { size: 20, color: 'inherit' })
                      : (0, t.jsx)(v.default, {}),
                    sx: { py: 1.5, borderRadius: 2 },
                    children: e('notifications.send'),
                  }),
                ],
              }),
            }),
          ],
        });
      },
    ]);
  },
]);
