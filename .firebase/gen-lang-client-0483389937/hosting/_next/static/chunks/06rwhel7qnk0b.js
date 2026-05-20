(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([
  'object' == typeof document ? document.currentScript : void 0,
  98562,
  (e) => {
    'use strict';
    e.i(64775);
    var t = e.i(84570),
      l = e.i(98457),
      o = e.i(61129),
      r = e.i(94083),
      a = e.i(42306),
      i = e.i(26589),
      n = e.i(44504),
      s = e.i(10372),
      d = e.i(59049),
      c = e.i(6888),
      u = e.i(58478),
      p = e.i(18635),
      f = e.i(50901);
    function v(e) {
      return (0, f.default)('MuiAlert', e);
    }
    let m = (0, p.default)('MuiAlert', [
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
      x = e.i(37479);
    let A = (0, h.default)(
        (0, x.jsx)('path', {
          d: 'M20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4C12.76,4 13.5,4.11 14.2, 4.31L15.77,2.74C14.61,2.26 13.34,2 12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0, 0 22,12M7.91,10.08L6.5,11.5L11,16L21,6L19.59,4.58L11,13.17L7.91,10.08Z',
        }),
        'SuccessOutlined',
      ),
      y = (0, h.default)(
        (0, x.jsx)('path', {
          d: 'M12 5.99L19.53 19H4.47L12 5.99M12 2L1 21h22L12 2zm1 14h-2v2h2v-2zm0-6h-2v4h2v-4z',
        }),
        'ReportProblemOutlined',
      ),
      C = (0, h.default)(
        (0, x.jsx)('path', {
          d: 'M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z',
        }),
        'ErrorOutline',
      ),
      S = (0, h.default)(
        (0, x.jsx)('path', {
          d: 'M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20, 12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10, 10 0 0,0 12,2M11,17H13V11H11V17Z',
        }),
        'InfoOutlined',
      );
    var M = e.i(50718);
    let j = [
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
      $ = (0, n.styled)(u.default, {
        name: 'MuiAlert',
        slot: 'Root',
        overridesResolver: (e, t) => {
          let { ownerState: l } = e;
          return [t.root, t[l.variant], t[`${l.variant}${(0, c.default)(l.color || l.severity)}`]];
        },
      })(({ theme: e }) => {
        let t = 'light' === e.palette.mode ? i.darken : i.lighten,
          o = 'light' === e.palette.mode ? i.lighten : i.darken;
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
                    : o(e.palette[l].light, 0.9),
                  [`& .${m.icon}`]: e.vars
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
                  [`& .${m.icon}`]: e.vars
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
      b = (0, n.styled)('div', {
        name: 'MuiAlert',
        slot: 'Icon',
        overridesResolver: (e, t) => t.icon,
      })({ marginRight: 12, padding: '7px 0', display: 'flex', fontSize: 22, opacity: 0.9 }),
      z = (0, n.styled)('div', {
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
        success: (0, x.jsx)(A, { fontSize: 'inherit' }),
        warning: (0, x.jsx)(y, { fontSize: 'inherit' }),
        error: (0, x.jsx)(C, { fontSize: 'inherit' }),
        info: (0, x.jsx)(S, { fontSize: 'inherit' }),
      },
      R = o.forwardRef(function (e, o) {
        let i = (0, s.useDefaultProps)({ props: e, name: 'MuiAlert' }),
          {
            action: n,
            children: u,
            className: p,
            closeText: f = 'Close',
            color: m,
            components: h = {},
            componentsProps: A = {},
            icon: y,
            iconMapping: C = L,
            onClose: S,
            role: R = 'alert',
            severity: k = 'success',
            slotProps: O = {},
            slots: w = {},
            variant: T = 'standard',
          } = i,
          B = (0, t.default)(i, j),
          P = (0, l.default)({}, i, { color: m, severity: k, variant: T, colorSeverity: m || k }),
          W = ((e) => {
            let { variant: t, color: l, severity: o, classes: r } = e,
              i = {
                root: [
                  'root',
                  `color${(0, c.default)(l || o)}`,
                  `${t}${(0, c.default)(l || o)}`,
                  `${t}`,
                ],
                icon: ['icon'],
                message: ['message'],
                action: ['action'],
              };
            return (0, a.default)(i, v, r);
          })(P),
          N = {
            slots: (0, l.default)({ closeButton: h.CloseButton, closeIcon: h.CloseIcon }, w),
            slotProps: (0, l.default)({}, A, O),
          },
          [E, H] = (0, d.default)('closeButton', {
            elementType: g.default,
            externalForwardedProps: N,
            ownerState: P,
          }),
          [V, F] = (0, d.default)('closeIcon', {
            elementType: M.default,
            externalForwardedProps: N,
            ownerState: P,
          });
        return (0, x.jsxs)(
          $,
          (0, l.default)(
            { role: R, elevation: 0, ownerState: P, className: (0, r.default)(W.root, p), ref: o },
            B,
            {
              children: [
                !1 !== y
                  ? (0, x.jsx)(b, { ownerState: P, className: W.icon, children: y || C[k] || L[k] })
                  : null,
                (0, x.jsx)(z, { ownerState: P, className: W.message, children: u }),
                null != n
                  ? (0, x.jsx)(I, { ownerState: P, className: W.action, children: n })
                  : null,
                null == n && S
                  ? (0, x.jsx)(I, {
                      ownerState: P,
                      className: W.action,
                      children: (0, x.jsx)(
                        E,
                        (0, l.default)(
                          {
                            size: 'small',
                            'aria-label': f,
                            title: f,
                            color: 'inherit',
                            onClick: S,
                          },
                          H,
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
    e.s(['Alert', 0, R], 98562);
  },
]);
