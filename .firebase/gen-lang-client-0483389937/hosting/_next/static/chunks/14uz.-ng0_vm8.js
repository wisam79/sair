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
      l = e.i(94083),
      i = e.i(42306),
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
            return (0, i.default)({ root: ['root', r && 'dividers'] }, c, t);
          })(v);
        return (0, p.jsx)(
          h,
          (0, r.default)({ className: (0, l.default)(x.root, s), ownerState: v, ref: a }, u),
        );
      });
    e.s(['DialogContent', 0, v], 34909);
    var x = e.i(69321),
      m = e.i(56292);
    function g(e) {
      return (0, d.default)('MuiDialogContentText', e);
    }
    (0, s.default)('MuiDialogContentText', ['root']);
    let y = ['children', 'className'],
      j = (0, o.default)(m.default, {
        shouldForwardProp: (e) => (0, x.rootShouldForwardProp)(e) || 'classes' === e,
        name: 'MuiDialogContentText',
        slot: 'Root',
        overridesResolver: (e, t) => t.root,
      })({}),
      _ = a.forwardRef(function (e, a) {
        let o = (0, n.useDefaultProps)({ props: e, name: 'MuiDialogContentText' }),
          { className: s } = o,
          d = (0, t.default)(o, y),
          c = ((e) => {
            let { classes: t } = e,
              a = (0, i.default)({ root: ['root'] }, g, t);
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
              className: (0, l.default)(c.root, s),
            },
            o,
            { classes: c },
          ),
        );
      });
    e.s(['DialogContentText', 0, _], 98123);
  },
  83754,
  (e, t, r) => {
    'use strict';
    var a = e.r(27249);
    (Object.defineProperty(r, '__esModule', { value: !0 }), (r.default = void 0));
    var l = a(e.r(72523)),
      i = e.r(37479);
    r.default = (0, l.default)(
      (0, i.jsx)('path', {
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
      l = e.i(94083),
      i = e.i(42306),
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
      m = e.i(16320),
      g = e.i(37479);
    let y = (0, m.default)(
        (0, g.jsx)('path', {
          d: 'M20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4C12.76,4 13.5,4.11 14.2, 4.31L15.77,2.74C14.61,2.26 13.34,2 12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0, 0 22,12M7.91,10.08L6.5,11.5L11,16L21,6L19.59,4.58L11,13.17L7.91,10.08Z',
        }),
        'SuccessOutlined',
      ),
      j = (0, m.default)(
        (0, g.jsx)('path', {
          d: 'M12 5.99L19.53 19H4.47L12 5.99M12 2L1 21h22L12 2zm1 14h-2v2h2v-2zm0-6h-2v4h2v-4z',
        }),
        'ReportProblemOutlined',
      ),
      _ = (0, m.default)(
        (0, g.jsx)('path', {
          d: 'M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z',
        }),
        'ErrorOutline',
      ),
      C = (0, m.default)(
        (0, g.jsx)('path', {
          d: 'M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20, 12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10, 10 0 0,0 12,2M11,17H13V11H11V17Z',
        }),
        'InfoOutlined',
      );
    var w = e.i(50718);
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
      S = (0, n.styled)('div', {
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
        success: (0, g.jsx)(y, { fontSize: 'inherit' }),
        warning: (0, g.jsx)(j, { fontSize: 'inherit' }),
        error: (0, g.jsx)(_, { fontSize: 'inherit' }),
        info: (0, g.jsx)(C, { fontSize: 'inherit' }),
      },
      $ = a.forwardRef(function (e, a) {
        let o = (0, s.useDefaultProps)({ props: e, name: 'MuiAlert' }),
          {
            action: n,
            children: u,
            className: p,
            closeText: f = 'Close',
            color: v,
            components: m = {},
            componentsProps: y = {},
            icon: j,
            iconMapping: _ = I,
            onClose: C,
            role: $ = 'alert',
            severity: z = 'success',
            slotProps: L = {},
            slots: D = {},
            variant: P = 'standard',
          } = o,
          k = (0, t.default)(o, b),
          R = (0, r.default)({}, o, { color: v, severity: z, variant: P, colorSeverity: v || z }),
          B = ((e) => {
            let { variant: t, color: r, severity: a, classes: l } = e,
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
            return (0, i.default)(o, h, l);
          })(R),
          N = {
            slots: (0, r.default)({ closeButton: m.CloseButton, closeIcon: m.CloseIcon }, D),
            slotProps: (0, r.default)({}, y, L),
          },
          [W, E] = (0, d.default)('closeButton', {
            elementType: x.default,
            externalForwardedProps: N,
            ownerState: R,
          }),
          [F, O] = (0, d.default)('closeIcon', {
            elementType: w.default,
            externalForwardedProps: N,
            ownerState: R,
          });
        return (0, g.jsxs)(
          M,
          (0, r.default)(
            { role: $, elevation: 0, ownerState: R, className: (0, l.default)(B.root, p), ref: a },
            k,
            {
              children: [
                !1 !== j
                  ? (0, g.jsx)(S, { ownerState: R, className: B.icon, children: j || _[z] || I[z] })
                  : null,
                (0, g.jsx)(A, { ownerState: R, className: B.message, children: u }),
                null != n
                  ? (0, g.jsx)(T, { ownerState: R, className: B.action, children: n })
                  : null,
                null == n && C
                  ? (0, g.jsx)(T, {
                      ownerState: R,
                      className: B.action,
                      children: (0, g.jsx)(
                        W,
                        (0, r.default)(
                          {
                            size: 'small',
                            'aria-label': f,
                            title: f,
                            color: 'inherit',
                            onClick: C,
                          },
                          E,
                          { children: (0, g.jsx)(F, (0, r.default)({ fontSize: 'small' }, O)) },
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
  39549,
  (e, t, r) => {
    'use strict';
    var a = e.r(27249);
    (Object.defineProperty(r, '__esModule', { value: !0 }), (r.default = void 0));
    var l = a(e.r(72523)),
      i = e.r(37479);
    r.default = (0, l.default)(
      (0, i.jsx)('path', {
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
  23441,
  26132,
  (e) => {
    'use strict';
    var t = e.i(25275);
    e.s(['FormControl', () => t.default], 23441);
    var r = e.i(91502);
    e.s(['InputLabel', () => r.default], 26132);
  },
  8462,
  (e) => {
    'use strict';
    var t = e.i(15845);
    e.s(['Select', () => t.default]);
  },
  66055,
  (e) => {
    'use strict';
    e.i(64775);
    var t,
      r = e.i(84570),
      a = e.i(98457),
      l = e.i(61129),
      i = e.i(94083),
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
      m = e.i(37479);
    let g = [
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
      j = l.forwardRef(function (e, u) {
        let p = (0, x.useDefaultProps)({ props: e, name: 'MuiInputAdornment' }),
          {
            children: f,
            className: v,
            component: j = 'div',
            disablePointerEvents: _ = !1,
            disableTypography: C = !1,
            position: w,
            variant: b,
          } = p,
          M = (0, r.default)(p, g),
          S = (0, c.default)() || {},
          A = b;
        (b && S.variant, S && !A && (A = S.variant));
        let T = (0, a.default)({}, p, {
            hiddenLabel: S.hiddenLabel,
            size: S.size,
            disablePointerEvents: _,
            position: w,
            variant: A,
          }),
          I = ((e) => {
            let {
                classes: t,
                disablePointerEvents: r,
                hiddenLabel: a,
                position: l,
                size: i,
                variant: s,
              } = e,
              d = {
                root: [
                  'root',
                  r && 'disablePointerEvents',
                  l && `position${(0, n.default)(l)}`,
                  s,
                  a && 'hiddenLabel',
                  i && `size${(0, n.default)(i)}`,
                ],
              };
            return (0, o.default)(d, h, t);
          })(T);
        return (0, m.jsx)(d.default.Provider, {
          value: null,
          children: (0, m.jsx)(
            y,
            (0, a.default)(
              { as: j, ownerState: T, className: (0, i.default)(I.root, v), ref: u },
              M,
              {
                children:
                  'string' != typeof f || C
                    ? (0, m.jsxs)(l.Fragment, {
                        children: [
                          'start' === w
                            ? t ||
                              (t = (0, m.jsx)('span', { className: 'notranslate', children: '​' }))
                            : null,
                          f,
                        ],
                      })
                    : (0, m.jsx)(s.default, { color: 'text.secondary', children: f }),
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
    var l = a(e.r(72523)),
      i = e.r(37479);
    r.default = (0, l.default)(
      (0, i.jsx)('path', {
        d: 'M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14',
      }),
      'Search',
    );
  },
  59953,
  (e, t, r) => {
    'use strict';
    var a = e.r(27249);
    (Object.defineProperty(r, '__esModule', { value: !0 }), (r.default = void 0));
    var l = a(e.r(72523)),
      i = e.r(37479);
    r.default = (0, l.default)(
      (0, i.jsx)('path', { d: 'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6z' }),
      'Add',
    );
  },
  93928,
  (e) => {
    'use strict';
    var t = e.i(37479),
      r = e.i(61129);
    e.i(74507);
    var a = e.i(32576),
      l = e.i(24644),
      i = e.i(20412),
      o = e.i(43737),
      n = e.i(98562),
      s = e.i(29744),
      d = e.i(25417),
      c = e.i(80461),
      u = e.i(23786),
      p = e.i(66055),
      f = e.i(24319),
      h = e.i(23441),
      v = e.i(26132),
      x = e.i(8462),
      m = e.i(55584),
      g = e.i(20218),
      y = e.i(24859),
      j = e.i(34909),
      _ = e.i(98123),
      C = e.i(73803),
      w = e.i(72233),
      b = e.i(39549),
      M = e.i(59953),
      S = e.i(10354),
      A = e.i(83754),
      T = e.i(73589),
      I = e.i(51215),
      $ = e.i(21203);
    let z = {
      scheduled: 'default',
      driver_waiting: 'warning',
      in_transit: 'primary',
      completed: 'success',
      absent: 'error',
      cancelled: 'error',
    };
    e.s([
      'default',
      0,
      function () {
        let e = (0, I.useRouter)(),
          { t: L } = (0, a.useTranslation)(),
          [D, P] = (0, r.useState)([]),
          [k, R] = (0, r.useState)([]),
          [B, N] = (0, r.useState)(!0),
          [W, E] = (0, r.useState)(null),
          [F, O] = (0, r.useState)(0),
          [H, V] = (0, r.useState)(25),
          [G, K] = (0, r.useState)(0),
          [U, Z] = (0, r.useState)(''),
          [Q, Y] = (0, r.useState)('all'),
          [q, J] = (0, r.useState)(null),
          [X, ee] = (0, r.useState)(!1),
          et = (e) => L(`status_labels.${e}`),
          er = (0, r.useCallback)(async () => {
            (N(!0), E(null));
            try {
              let {
                data: e,
                error: t,
                count: r,
              } = await $.supabaseClient
                .from('trips')
                .select(
                  `
          id,
          route_id,
          driver_id,
          status,
          scheduled_at,
          started_at,
          ended_at,
          last_lat,
          last_lng,
          created_at,
          routes!trips_route_id_fkey(title, start_location, end_location, available_seats, capacity),
          drivers!trips_driver_id_fkey(profiles!drivers_user_id_fkey(full_name, phone))
        `,
                  { count: 'exact' },
                )
                .order('scheduled_at', { ascending: !1 })
                .range(F * H, F * H + H - 1);
              if (t) throw t;
              let a = (e || []).map((e) => {
                let t = Array.isArray(e.routes) ? e.routes[0] : e.routes,
                  r = Array.isArray(e.drivers?.profiles)
                    ? e.drivers?.profiles[0]
                    : e.drivers?.profiles;
                return {
                  id: e.id,
                  route_id: e.route_id,
                  driver_id: e.driver_id,
                  status: e.status,
                  scheduled_at: e.scheduled_at,
                  started_at: e.started_at,
                  ended_at: e.ended_at,
                  last_lat: e.last_lat,
                  last_lng: e.last_lng,
                  created_at: e.created_at,
                  route_title: t?.title ?? '—',
                  driver_name: r?.full_name ?? '—',
                  driver_phone: r?.phone ?? '—',
                  start_location: t?.start_location ?? '—',
                  end_location: t?.end_location ?? '—',
                  available_seats: t?.available_seats ?? 0,
                  capacity: t?.capacity ?? 0,
                };
              });
              (P(a), K(r ?? 0));
            } catch (e) {
              E(e instanceof Error ? e.message : L('trips.errors.loadFailed'));
            } finally {
              N(!1);
            }
          }, [F, H]);
        ((0, r.useEffect)(() => {
          er();
        }, [er]),
          (0, r.useEffect)(() => {
            let e = D;
            if (U) {
              let t = U.toLowerCase();
              e = e.filter(
                (e) =>
                  e.route_title.toLowerCase().includes(t) ||
                  e.driver_name.toLowerCase().includes(t) ||
                  e.id.toLowerCase().includes(t) ||
                  e.start_location.toLowerCase().includes(t) ||
                  e.end_location.toLowerCase().includes(t),
              );
            }
            ('all' !== Q && (e = e.filter((e) => e.status === Q)), R(e));
          }, [D, U, Q]));
        let ea = async () => {
            if (q) {
              (ee(!0), E(null));
              try {
                let { error: e } = await $.supabaseClient.rpc('admin_cancel_trip', {
                  p_trip_id: q,
                });
                if (e) throw e;
                (P((e) => e.map((e) => (e.id === q ? { ...e, status: 'cancelled' } : e))),
                  J(null),
                  er());
              } catch (e) {
                E(e instanceof Error ? e.message : L('trips.errors.cancelFailed'));
              } finally {
                ee(!1);
              }
            }
          },
          el = [
            {
              field: 'id',
              headerName: L('trips.fields.id'),
              minWidth: 100,
              flex: 0.5,
              renderCell: (e) =>
                (0, t.jsx)(d.Tooltip, {
                  title: e.row.id,
                  children: (0, t.jsxs)(i.Typography, {
                    variant: 'caption',
                    sx: { fontFamily: 'monospace' },
                    children: [e.row.id.substring(0, 8), '...'],
                  }),
                }),
            },
            {
              field: 'route',
              headerName: L('trips.fields.route'),
              minWidth: 200,
              flex: 1,
              renderCell: (e) =>
                (0, t.jsxs)(l.Box, {
                  children: [
                    (0, t.jsx)(i.Typography, {
                      variant: 'body2',
                      fontWeight: 600,
                      children: e.row.route_title,
                    }),
                    (0, t.jsxs)(c.Stack, {
                      direction: 'row',
                      spacing: 0.5,
                      alignItems: 'center',
                      children: [
                        (0, t.jsx)(i.Typography, {
                          variant: 'caption',
                          color: 'text.secondary',
                          children: e.row.start_location,
                        }),
                        (0, t.jsx)(i.Typography, {
                          variant: 'caption',
                          color: 'text.secondary',
                          children: '→',
                        }),
                        (0, t.jsx)(i.Typography, {
                          variant: 'caption',
                          color: 'text.secondary',
                          children: e.row.end_location,
                        }),
                      ],
                    }),
                  ],
                }),
            },
            {
              field: 'driver',
              headerName: L('trips.fields.driver'),
              minWidth: 180,
              flex: 0.8,
              renderCell: (e) =>
                (0, t.jsxs)(l.Box, {
                  children: [
                    (0, t.jsx)(i.Typography, {
                      variant: 'body2',
                      fontWeight: 500,
                      children: e.row.driver_name,
                    }),
                    (0, t.jsx)(i.Typography, {
                      variant: 'caption',
                      color: 'text.secondary',
                      children: e.row.driver_phone,
                    }),
                  ],
                }),
            },
            {
              field: 'status',
              headerName: L('trips.fields.status'),
              minWidth: 140,
              flex: 0.6,
              renderCell: (e) =>
                (0, t.jsx)(o.Chip, {
                  label: et(e.row.status),
                  color: z[e.row.status] || 'default',
                  size: 'small',
                  variant: 'outlined',
                  icon:
                    'in_transit' === e.row.status
                      ? (0, t.jsx)(T.default, { sx: { fontSize: 16 } })
                      : void 0,
                }),
            },
            {
              field: 'scheduled_at',
              headerName: L('trips.fields.scheduledAt'),
              minWidth: 180,
              flex: 0.8,
              renderCell: (e) =>
                (0, t.jsxs)(l.Box, {
                  children: [
                    (0, t.jsx)(i.Typography, {
                      variant: 'body2',
                      children: e.row.scheduled_at
                        ? new Date(e.row.scheduled_at).toLocaleString('ar-IQ')
                        : '—',
                    }),
                    (0, t.jsx)(i.Typography, {
                      variant: 'caption',
                      sx: {
                        color:
                          'completed' === e.row.status || 'cancelled' === e.row.status
                            ? 'text.secondary'
                            : '#FF9500',
                      },
                      children: ((e) => {
                        let t = new Date(e),
                          r = new Date(),
                          a = t.getTime() - r.getTime();
                        if (a < 0) {
                          let e = Math.floor(Math.abs(a) / 6e4);
                          if (e < 60) return `منذ ${e} دقيقة`;
                          let t = Math.floor(e / 60);
                          if (t < 24) return `منذ ${t} ساعة`;
                          let r = Math.floor(t / 24);
                          return `منذ ${r} يوم`;
                        }
                        let l = Math.floor(a / 6e4);
                        if (l < 60) return `خلال ${l} دقيقة`;
                        let i = Math.floor(l / 60);
                        if (i < 24) return `خلال ${i} ساعة`;
                        let o = Math.floor(i / 24);
                        return `خلال ${o} يوم`;
                      })(e.row.scheduled_at),
                    }),
                  ],
                }),
            },
            {
              field: 'duration',
              headerName: L('trips.fields.duration'),
              minWidth: 100,
              flex: 0.5,
              renderCell: (e) => {
                if (!e.row.started_at) return '—';
                let t = e.row.ended_at ? new Date(e.row.ended_at) : new Date(),
                  r = new Date(e.row.started_at),
                  a = Math.floor((t.getTime() - r.getTime()) / 6e4);
                if (a < 60) return `${a} دقيقة`;
                let l = Math.floor(a / 60);
                return `${l} ساعة ${a % 60} دقيقة`;
              },
            },
            {
              field: 'seats',
              headerName: L('trips.fields.seats'),
              minWidth: 80,
              flex: 0.4,
              renderCell: (e) =>
                (0, t.jsx)(o.Chip, {
                  label: `${e.row.capacity - e.row.available_seats}/${e.row.capacity}`,
                  size: 'small',
                  color: 0 === e.row.available_seats ? 'error' : 'primary',
                  variant: 'outlined',
                }),
            },
            {
              field: 'actions',
              headerName: L('actions.actions'),
              sortable: !1,
              minWidth: 100,
              align: 'center',
              headerAlign: 'center',
              renderCell: ({ row: e }) =>
                (0, t.jsx)(c.Stack, {
                  direction: 'row',
                  spacing: 1,
                  alignItems: 'center',
                  height: '100%',
                  children:
                    'completed' !== e.status && 'cancelled' !== e.status && 'absent' !== e.status
                      ? (0, t.jsx)(d.Tooltip, {
                          title: L('trips.actions.cancel'),
                          children: (0, t.jsx)(s.IconButton, {
                            size: 'small',
                            onClick: () => J(e.id),
                            color: 'error',
                            children: (0, t.jsx)(A.default, { fontSize: 'small' }),
                          }),
                        })
                      : (0, t.jsx)(i.Typography, {
                          variant: 'caption',
                          color: 'text.secondary',
                          children: '—',
                        }),
                }),
            },
          ],
          ei = (0, r.useMemo)(() => {
            let e = D.length,
              t = D.filter(
                (e) => 'in_transit' === e.status || 'driver_waiting' === e.status,
              ).length;
            return {
              total: e,
              active: t,
              completed: D.filter((e) => 'completed' === e.status).length,
              cancelled: D.filter((e) => 'cancelled' === e.status).length,
            };
          }, [D]);
        return (0, t.jsxs)(l.Box, {
          sx: { p: 3 },
          children: [
            (0, t.jsxs)(l.Box, {
              sx: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 },
              children: [
                (0, t.jsxs)(l.Box, {
                  children: [
                    (0, t.jsx)(i.Typography, {
                      variant: 'h5',
                      fontWeight: 'bold',
                      children: L('trips.titles.list'),
                    }),
                    (0, t.jsxs)(c.Stack, {
                      direction: 'row',
                      spacing: 2,
                      mt: 1,
                      children: [
                        (0, t.jsxs)(i.Typography, {
                          variant: 'caption',
                          color: 'text.secondary',
                          children: [L('total'), ': ', ei.total],
                        }),
                        (0, t.jsxs)(i.Typography, {
                          variant: 'caption',
                          sx: { color: '#007AFF' },
                          children: [L('active'), ': ', ei.active],
                        }),
                        (0, t.jsxs)(i.Typography, {
                          variant: 'caption',
                          sx: { color: '#34C759' },
                          children: [L('completed'), ': ', ei.completed],
                        }),
                        (0, t.jsxs)(i.Typography, {
                          variant: 'caption',
                          sx: { color: '#FF3B30' },
                          children: [L('cancelled'), ': ', ei.cancelled],
                        }),
                      ],
                    }),
                  ],
                }),
                (0, t.jsxs)(c.Stack, {
                  direction: 'row',
                  spacing: 1,
                  children: [
                    (0, t.jsx)(d.Tooltip, {
                      title: L('create_trip'),
                      children: (0, t.jsx)(m.Button, {
                        variant: 'contained',
                        startIcon: (0, t.jsx)(M.default, {}),
                        onClick: () => e.push('/trips/create'),
                        children: L('create_trip'),
                      }),
                    }),
                    (0, t.jsx)(d.Tooltip, {
                      title: 'Refresh',
                      children: (0, t.jsx)(s.IconButton, {
                        onClick: er,
                        disabled: B,
                        color: 'primary',
                        children: (0, t.jsx)(b.default, {}),
                      }),
                    }),
                  ],
                }),
              ],
            }),
            (0, t.jsxs)(l.Box, {
              sx: { display: 'flex', gap: 2, mb: 3 },
              children: [
                (0, t.jsx)(u.TextField, {
                  size: 'small',
                  placeholder: L('search_trips') || 'Search by route, driver, ID...',
                  value: U,
                  onChange: (e) => Z(e.target.value),
                  sx: { minWidth: 300 },
                  InputProps: {
                    startAdornment: (0, t.jsx)(p.InputAdornment, {
                      position: 'start',
                      children: (0, t.jsx)(S.default, { sx: { color: 'text.secondary' } }),
                    }),
                  },
                }),
                (0, t.jsxs)(h.FormControl, {
                  size: 'small',
                  sx: { minWidth: 160 },
                  children: [
                    (0, t.jsx)(v.InputLabel, { children: L('status') }),
                    (0, t.jsxs)(x.Select, {
                      value: Q,
                      label: L('status'),
                      onChange: (e) => {
                        (Y(e.target.value), O(0));
                      },
                      children: [
                        (0, t.jsx)(f.MenuItem, { value: 'all', children: L('all_statuses') }),
                        (0, t.jsx)(f.MenuItem, { value: 'scheduled', children: et('scheduled') }),
                        (0, t.jsx)(f.MenuItem, {
                          value: 'driver_waiting',
                          children: et('driver_waiting'),
                        }),
                        (0, t.jsx)(f.MenuItem, { value: 'in_transit', children: et('in_transit') }),
                        (0, t.jsx)(f.MenuItem, { value: 'completed', children: et('completed') }),
                        (0, t.jsx)(f.MenuItem, { value: 'absent', children: et('absent') }),
                        (0, t.jsx)(f.MenuItem, { value: 'cancelled', children: et('cancelled') }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
            W &&
              (0, t.jsx)(n.Alert, {
                severity: 'error',
                sx: { mb: 2 },
                onClose: () => E(null),
                children: W,
              }),
            (0, t.jsx)(w.DataGrid, {
              rows: k,
              columns: el,
              loading: B,
              rowCount: G,
              paginationMode: 'server',
              page: F,
              pageSize: H,
              onPageChange: (e) => O(e),
              onPageSizeChange: (e) => {
                (V(e), O(0));
              },
              rowsPerPageOptions: [10, 25, 50, 100],
              autoHeight: !0,
              disableSelectionOnClick: !0,
              sx: { '& .MuiDataGrid-row:hover': { bgcolor: 'action.hover' } },
            }),
            (0, t.jsxs)(g.Dialog, {
              open: !!q,
              onClose: () => J(null),
              children: [
                (0, t.jsx)(y.DialogTitle, { children: L('trips.actions.cancel') || 'Cancel trip' }),
                (0, t.jsx)(j.DialogContent, {
                  children: (0, t.jsx)(_.DialogContentText, {
                    children: L('are_you_sure') || 'Are you sure?',
                  }),
                }),
                (0, t.jsxs)(C.DialogActions, {
                  sx: { p: 2 },
                  children: [
                    (0, t.jsx)(m.Button, {
                      onClick: () => J(null),
                      color: 'inherit',
                      disabled: X,
                      children: L('cancel') || 'Cancel',
                    }),
                    (0, t.jsx)(m.Button, {
                      onClick: ea,
                      color: 'error',
                      variant: 'contained',
                      disabled: X,
                      children: L('confirm') || 'Confirm',
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
