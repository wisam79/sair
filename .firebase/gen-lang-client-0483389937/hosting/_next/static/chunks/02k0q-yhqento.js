(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([
  'object' == typeof document ? document.currentScript : void 0,
  50718,
  (e) => {
    'use strict';
    e.i(61129);
    var t = e.i(16320),
      l = e.i(37479);
    let r = (0, t.default)(
      (0, l.jsx)('path', {
        d: 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z',
      }),
      'Close',
    );
    e.s(['default', 0, r]);
  },
  98562,
  (e) => {
    'use strict';
    e.i(64775);
    var t = e.i(84570),
      l = e.i(98457),
      r = e.i(61129),
      a = e.i(94083),
      i = e.i(42306),
      o = e.i(26589),
      n = e.i(44504),
      s = e.i(10372),
      d = e.i(59049),
      c = e.i(6888),
      u = e.i(58478),
      p = e.i(18635),
      m = e.i(50901);
    function f(e) {
      return (0, m.default)('MuiAlert', e);
    }
    let g = (0, p.default)('MuiAlert', [
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
    var h = e.i(37473),
      v = e.i(16320),
      x = e.i(37479);
    let y = (0, v.default)(
        (0, x.jsx)('path', {
          d: 'M20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4C12.76,4 13.5,4.11 14.2, 4.31L15.77,2.74C14.61,2.26 13.34,2 12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0, 0 22,12M7.91,10.08L6.5,11.5L11,16L21,6L19.59,4.58L11,13.17L7.91,10.08Z',
        }),
        'SuccessOutlined',
      ),
      j = (0, v.default)(
        (0, x.jsx)('path', {
          d: 'M12 5.99L19.53 19H4.47L12 5.99M12 2L1 21h22L12 2zm1 14h-2v2h2v-2zm0-6h-2v4h2v-4z',
        }),
        'ReportProblemOutlined',
      ),
      C = (0, v.default)(
        (0, x.jsx)('path', {
          d: 'M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z',
        }),
        'ErrorOutline',
      ),
      S = (0, v.default)(
        (0, x.jsx)('path', {
          d: 'M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20, 12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10, 10 0 0,0 12,2M11,17H13V11H11V17Z',
        }),
        'InfoOutlined',
      );
    var A = e.i(50718);
    let b = [
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
      M = (0, n.styled)(u.default, {
        name: 'MuiAlert',
        slot: 'Root',
        overridesResolver: (e, t) => {
          let { ownerState: l } = e;
          return [t.root, t[l.variant], t[`${l.variant}${(0, c.default)(l.color || l.severity)}`]];
        },
      })(({ theme: e }) => {
        let t = 'light' === e.palette.mode ? o.darken : o.lighten,
          r = 'light' === e.palette.mode ? o.lighten : o.darken;
        return (0, l.default)({}, e.typography.body2, {
          backgroundColor: 'transparent',
          display: 'flex',
          padding: '6px 16px',
          variants: [
            ...Object.entries(e.palette)
              .filter(([, e]) => e.main && e.light)
              .map(([l]) => ({
                props: { colorSeverity: l, variant: 'standard' },
                style: {
                  color: e.vars ? e.vars.palette.Alert[`${l}Color`] : t(e.palette[l].light, 0.6),
                  backgroundColor: e.vars
                    ? e.vars.palette.Alert[`${l}StandardBg`]
                    : r(e.palette[l].light, 0.9),
                  [`& .${g.icon}`]: e.vars
                    ? { color: e.vars.palette.Alert[`${l}IconColor`] }
                    : { color: e.palette[l].main },
                },
              })),
            ...Object.entries(e.palette)
              .filter(([, e]) => e.main && e.light)
              .map(([l]) => ({
                props: { colorSeverity: l, variant: 'outlined' },
                style: {
                  color: e.vars ? e.vars.palette.Alert[`${l}Color`] : t(e.palette[l].light, 0.6),
                  border: `1px solid ${(e.vars || e).palette[l].light}`,
                  [`& .${g.icon}`]: e.vars
                    ? { color: e.vars.palette.Alert[`${l}IconColor`] }
                    : { color: e.palette[l].main },
                },
              })),
            ...Object.entries(e.palette)
              .filter(([, e]) => e.main && e.dark)
              .map(([t]) => ({
                props: { colorSeverity: t, variant: 'filled' },
                style: (0, l.default)(
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
      z = (0, n.styled)('div', {
        name: 'MuiAlert',
        slot: 'Icon',
        overridesResolver: (e, t) => t.icon,
      })({ marginRight: 12, padding: '7px 0', display: 'flex', fontSize: 22, opacity: 0.9 }),
      w = (0, n.styled)('div', {
        name: 'MuiAlert',
        slot: 'Message',
        overridesResolver: (e, t) => t.message,
      })({ padding: '8px 0', minWidth: 0, overflow: 'auto' }),
      I = (0, n.styled)('div', {
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
      L = {
        success: (0, x.jsx)(y, { fontSize: 'inherit' }),
        warning: (0, x.jsx)(j, { fontSize: 'inherit' }),
        error: (0, x.jsx)(C, { fontSize: 'inherit' }),
        info: (0, x.jsx)(S, { fontSize: 'inherit' }),
      },
      $ = r.forwardRef(function (e, r) {
        let o = (0, s.useDefaultProps)({ props: e, name: 'MuiAlert' }),
          {
            action: n,
            children: u,
            className: p,
            closeText: m = 'Close',
            color: g,
            components: v = {},
            componentsProps: y = {},
            icon: j,
            iconMapping: C = L,
            onClose: S,
            role: $ = 'alert',
            severity: T = 'success',
            slotProps: P = {},
            slots: k = {},
            variant: R = 'standard',
          } = o,
          W = (0, t.default)(o, b),
          O = (0, l.default)({}, o, { color: g, severity: T, variant: R, colorSeverity: g || T }),
          B = ((e) => {
            let { variant: t, color: l, severity: r, classes: a } = e,
              o = {
                root: [
                  'root',
                  `color${(0, c.default)(l || r)}`,
                  `${t}${(0, c.default)(l || r)}`,
                  `${t}`,
                ],
                icon: ['icon'],
                message: ['message'],
                action: ['action'],
              };
            return (0, i.default)(o, f, a);
          })(O),
          E = {
            slots: (0, l.default)({ closeButton: v.CloseButton, closeIcon: v.CloseIcon }, k),
            slotProps: (0, l.default)({}, y, P),
          },
          [H, N] = (0, d.default)('closeButton', {
            elementType: h.default,
            externalForwardedProps: E,
            ownerState: O,
          }),
          [V, F] = (0, d.default)('closeIcon', {
            elementType: A.default,
            externalForwardedProps: E,
            ownerState: O,
          });
        return (0, x.jsxs)(
          M,
          (0, l.default)(
            { role: $, elevation: 0, ownerState: O, className: (0, a.default)(B.root, p), ref: r },
            W,
            {
              children: [
                !1 !== j
                  ? (0, x.jsx)(z, { ownerState: O, className: B.icon, children: j || C[T] || L[T] })
                  : null,
                (0, x.jsx)(w, { ownerState: O, className: B.message, children: u }),
                null != n
                  ? (0, x.jsx)(I, { ownerState: O, className: B.action, children: n })
                  : null,
                null == n && S
                  ? (0, x.jsx)(I, {
                      ownerState: O,
                      className: B.action,
                      children: (0, x.jsx)(
                        H,
                        (0, l.default)(
                          {
                            size: 'small',
                            'aria-label': m,
                            title: m,
                            color: 'inherit',
                            onClick: S,
                          },
                          N,
                          { children: (0, x.jsx)(V, (0, l.default)({ fontSize: 'small' }, F)) },
                        ),
                      ),
                    })
                  : null,
              ],
            },
          ),
        );
      });
    e.s(['Alert', 0, $], 98562);
  },
  8839,
  (e, t, l) => {
    'use strict';
    var r = e.r(27249);
    (Object.defineProperty(l, '__esModule', { value: !0 }), (l.default = void 0));
    var a = r(e.r(72523)),
      i = e.r(37479);
    l.default = (0, a.default)(
      (0, i.jsx)('path', {
        d: 'M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2M9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9zm9 14H6V10h12zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2',
      }),
      'LockOutlined',
    );
  },
  45018,
  (e, t, l) => {
    'use strict';
    var r = e.r(27249);
    (Object.defineProperty(l, '__esModule', { value: !0 }), (l.default = void 0));
    var a = r(e.r(72523)),
      i = e.r(37479);
    l.default = (0, a.default)(
      (0, i.jsx)('path', {
        d: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m0 4c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6m0 14c-2.03 0-4.43-.82-6.14-2.88C7.55 15.8 9.68 15 12 15s4.45.8 6.14 2.12C16.43 19.18 14.03 20 12 20',
      }),
      'AccountCircle',
    );
  },
  20380,
  (e) => {
    'use strict';
    var t = e.i(37479),
      l = e.i(60552);
    e.i(74507);
    var r = e.i(32576),
      a = e.i(61129),
      i = e.i(55584),
      o = e.i(23786),
      n = e.i(20412),
      s = e.i(76086),
      d = e.i(3204),
      c = e.i(41191),
      u = e.i(98562),
      p = e.i(44504),
      m = e.i(8839),
      f = e.i(45018);
    let g = (0, p.styled)(d.Paper)(({ theme: e }) => ({
        marginTop: e.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: e.spacing(4),
        width: '100%',
        maxWidth: 400,
      })),
      h = (0, p.styled)('div')(({ theme: e }) => ({
        margin: e.spacing(1),
        backgroundColor: e.palette.primary.main,
        width: 64,
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
      })),
      v = (0, p.styled)('form')(({ theme: e }) => ({ width: '100%', marginTop: e.spacing(1) })),
      x = (0, p.styled)(i.Button)(({ theme: e }) => ({ margin: e.spacing(3, 0, 2) }));
    e.s([
      'default',
      0,
      function () {
        let { t: e } = (0, r.useTranslation)(),
          [i, d] = (0, a.useState)(''),
          [p, y] = (0, a.useState)(''),
          [j, C] = (0, a.useState)(null),
          { mutate: S, isLoading: A } = (0, l.useLogin)();
        return (0, t.jsx)(s.Container, {
          component: 'main',
          maxWidth: 'xs',
          children: (0, t.jsxs)(g, {
            elevation: 3,
            children: [
              (0, t.jsx)(h, {
                children: (0, t.jsx)(m.default, { sx: { color: '#fff', fontSize: 32 } }),
              }),
              (0, t.jsx)(n.Typography, {
                component: 'h1',
                variant: 'h5',
                fontWeight: 'bold',
                sx: { mt: 2 },
                children: e('login.title') || 'UniRide Admin',
              }),
              (0, t.jsx)(n.Typography, {
                variant: 'body2',
                color: 'text.secondary',
                sx: { mb: 3 },
                children: e('login.subtitle') || 'Sign in to manage the platform',
              }),
              (0, t.jsxs)(v, {
                onSubmit: (t) => {
                  (t.preventDefault(),
                    C(null),
                    S(
                      { email: i, password: p },
                      {
                        onError: (t) => {
                          C(
                            t?.message ||
                              e('login.error') ||
                              'Login failed. Please check your credentials.',
                          );
                        },
                      },
                    ));
                },
                children: [
                  (0, t.jsx)(o.TextField, {
                    margin: 'normal',
                    required: !0,
                    fullWidth: !0,
                    id: 'email',
                    label: e('login.email') || 'Email Address',
                    name: 'email',
                    autoComplete: 'email',
                    autoFocus: !0,
                    value: i,
                    onChange: (e) => d(e.target.value),
                    InputProps: {
                      startAdornment: (0, t.jsx)(f.default, {
                        color: 'action',
                        sx: { marginInlineEnd: 1 },
                      }),
                    },
                  }),
                  (0, t.jsx)(o.TextField, {
                    margin: 'normal',
                    required: !0,
                    fullWidth: !0,
                    name: 'password',
                    label: e('login.password') || 'Password',
                    type: 'password',
                    id: 'password',
                    autoComplete: 'current-password',
                    value: p,
                    onChange: (e) => y(e.target.value),
                  }),
                  j &&
                    (0, t.jsx)(u.Alert, {
                      severity: 'error',
                      sx: { mt: 2, width: '100%' },
                      children: j,
                    }),
                  (0, t.jsx)(x, {
                    type: 'submit',
                    fullWidth: !0,
                    variant: 'contained',
                    disabled: A,
                    sx: { mt: 3, mb: 2 },
                    children: A
                      ? (0, t.jsx)(c.CircularProgress, { size: 24, color: 'inherit' })
                      : e('login.submit') || 'Sign In',
                  }),
                ],
              }),
            ],
          }),
        });
      },
    ]);
  },
]);
