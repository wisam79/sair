(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([
  'object' == typeof document ? document.currentScript : void 0,
  98562,
  (e) => {
    'use strict';
    e.i(64775);
    var t = e.i(84570),
      r = e.i(98457),
      a = e.i(61129),
      l = e.i(94083),
      o = e.i(42306),
      i = e.i(26589),
      s = e.i(44504),
      n = e.i(10372),
      d = e.i(59049),
      u = e.i(6888),
      c = e.i(58478),
      p = e.i(18635),
      f = e.i(50901);
    function h(e) {
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
    var v = e.i(37473),
      g = e.i(16320),
      x = e.i(37479);
    let y = (0, g.default)(
        (0, x.jsx)('path', {
          d: 'M20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4C12.76,4 13.5,4.11 14.2, 4.31L15.77,2.74C14.61,2.26 13.34,2 12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0, 0 22,12M7.91,10.08L6.5,11.5L11,16L21,6L19.59,4.58L11,13.17L7.91,10.08Z',
        }),
        'SuccessOutlined',
      ),
      j = (0, g.default)(
        (0, x.jsx)('path', {
          d: 'M12 5.99L19.53 19H4.47L12 5.99M12 2L1 21h22L12 2zm1 14h-2v2h2v-2zm0-6h-2v4h2v-4z',
        }),
        'ReportProblemOutlined',
      ),
      C = (0, g.default)(
        (0, x.jsx)('path', {
          d: 'M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z',
        }),
        'ErrorOutline',
      ),
      S = (0, g.default)(
        (0, x.jsx)('path', {
          d: 'M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20, 12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10, 10 0 0,0 12,2M11,17H13V11H11V17Z',
        }),
        'InfoOutlined',
      );
    var b = e.i(50718);
    let M = [
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
      _ = (0, s.styled)(c.default, {
        name: 'MuiAlert',
        slot: 'Root',
        overridesResolver: (e, t) => {
          let { ownerState: r } = e;
          return [t.root, t[r.variant], t[`${r.variant}${(0, u.default)(r.color || r.severity)}`]];
        },
      })(({ theme: e }) => {
        let t = 'light' === e.palette.mode ? i.darken : i.lighten,
          a = 'light' === e.palette.mode ? i.lighten : i.darken;
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
                  [`& .${m.icon}`]: e.vars
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
                  [`& .${m.icon}`]: e.vars
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
      w = (0, s.styled)('div', {
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
      z = {
        success: (0, x.jsx)(y, { fontSize: 'inherit' }),
        warning: (0, x.jsx)(j, { fontSize: 'inherit' }),
        error: (0, x.jsx)(C, { fontSize: 'inherit' }),
        info: (0, x.jsx)(S, { fontSize: 'inherit' }),
      },
      T = a.forwardRef(function (e, a) {
        let i = (0, n.useDefaultProps)({ props: e, name: 'MuiAlert' }),
          {
            action: s,
            children: c,
            className: p,
            closeText: f = 'Close',
            color: m,
            components: g = {},
            componentsProps: y = {},
            icon: j,
            iconMapping: C = z,
            onClose: S,
            role: T = 'alert',
            severity: k = 'success',
            slotProps: O = {},
            slots: N = {},
            variant: D = 'standard',
          } = i,
          L = (0, t.default)(i, M),
          $ = (0, r.default)({}, i, { color: m, severity: k, variant: D, colorSeverity: m || k }),
          W = ((e) => {
            let { variant: t, color: r, severity: a, classes: l } = e,
              i = {
                root: [
                  'root',
                  `color${(0, u.default)(r || a)}`,
                  `${t}${(0, u.default)(r || a)}`,
                  `${t}`,
                ],
                icon: ['icon'],
                message: ['message'],
                action: ['action'],
              };
            return (0, o.default)(i, h, l);
          })($),
          P = {
            slots: (0, r.default)({ closeButton: g.CloseButton, closeIcon: g.CloseIcon }, N),
            slotProps: (0, r.default)({}, y, O),
          },
          [R, B] = (0, d.default)('closeButton', {
            elementType: v.default,
            externalForwardedProps: P,
            ownerState: $,
          }),
          [F, E] = (0, d.default)('closeIcon', {
            elementType: b.default,
            externalForwardedProps: P,
            ownerState: $,
          });
        return (0, x.jsxs)(
          _,
          (0, r.default)(
            { role: T, elevation: 0, ownerState: $, className: (0, l.default)(W.root, p), ref: a },
            L,
            {
              children: [
                !1 !== j
                  ? (0, x.jsx)(A, { ownerState: $, className: W.icon, children: j || C[k] || z[k] })
                  : null,
                (0, x.jsx)(I, { ownerState: $, className: W.message, children: c }),
                null != s
                  ? (0, x.jsx)(w, { ownerState: $, className: W.action, children: s })
                  : null,
                null == s && S
                  ? (0, x.jsx)(w, {
                      ownerState: $,
                      className: W.action,
                      children: (0, x.jsx)(
                        R,
                        (0, r.default)(
                          {
                            size: 'small',
                            'aria-label': f,
                            title: f,
                            color: 'inherit',
                            onClick: S,
                          },
                          B,
                          { children: (0, x.jsx)(F, (0, r.default)({ fontSize: 'small' }, E)) },
                        ),
                      ),
                    })
                  : null,
              ],
            },
          ),
        );
      });
    e.s(['Alert', 0, T], 98562);
  },
  39549,
  (e, t, r) => {
    'use strict';
    var a = e.r(27249);
    (Object.defineProperty(r, '__esModule', { value: !0 }), (r.default = void 0));
    var l = a(e.r(72523)),
      o = e.r(37479);
    r.default = (0, l.default)(
      (0, o.jsx)('path', {
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
  34909,
  98123,
  (e) => {
    'use strict';
    e.i(64775);
    var t = e.i(84570),
      r = e.i(98457),
      a = e.i(61129),
      l = e.i(94083),
      o = e.i(42306),
      i = e.i(47740),
      s = e.i(10372),
      n = e.i(18635),
      d = e.i(50901);
    function u(e) {
      return (0, d.default)('MuiDialogContent', e);
    }
    (0, n.default)('MuiDialogContent', ['root', 'dividers']);
    var c = e.i(69705),
      p = e.i(37479);
    let f = ['className', 'dividers'],
      h = (0, i.default)('div', {
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
            : { [`.${c.default.root} + &`]: { paddingTop: 0 } },
        ),
      ),
      m = a.forwardRef(function (e, a) {
        let i = (0, s.useDefaultProps)({ props: e, name: 'MuiDialogContent' }),
          { className: n, dividers: d = !1 } = i,
          c = (0, t.default)(i, f),
          m = (0, r.default)({}, i, { dividers: d }),
          v = ((e) => {
            let { classes: t, dividers: r } = e;
            return (0, o.default)({ root: ['root', r && 'dividers'] }, u, t);
          })(m);
        return (0, p.jsx)(
          h,
          (0, r.default)({ className: (0, l.default)(v.root, n), ownerState: m, ref: a }, c),
        );
      });
    e.s(['DialogContent', 0, m], 34909);
    var v = e.i(69321),
      g = e.i(56292);
    function x(e) {
      return (0, d.default)('MuiDialogContentText', e);
    }
    (0, n.default)('MuiDialogContentText', ['root']);
    let y = ['children', 'className'],
      j = (0, i.default)(g.default, {
        shouldForwardProp: (e) => (0, v.rootShouldForwardProp)(e) || 'classes' === e,
        name: 'MuiDialogContentText',
        slot: 'Root',
        overridesResolver: (e, t) => t.root,
      })({}),
      C = a.forwardRef(function (e, a) {
        let i = (0, s.useDefaultProps)({ props: e, name: 'MuiDialogContentText' }),
          { className: n } = i,
          d = (0, t.default)(i, y),
          u = ((e) => {
            let { classes: t } = e,
              a = (0, o.default)({ root: ['root'] }, x, t);
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
              className: (0, l.default)(u.root, n),
            },
            i,
            { classes: u },
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
    var l = a(e.r(72523)),
      o = e.r(37479);
    r.default = (0, l.default)(
      (0, o.jsx)('path', {
        d: 'M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2m5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12z',
      }),
      'Cancel',
    );
  },
  1884,
  (e, t, r) => {
    'use strict';
    var a = e.r(27249);
    (Object.defineProperty(r, '__esModule', { value: !0 }), (r.default = void 0));
    var l = a(e.r(72523)),
      o = e.r(37479);
    r.default = (0, l.default)(
      (0, o.jsx)('path', {
        d: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8z',
      }),
      'CheckCircle',
    );
  },
  61603,
  (e) => {
    'use strict';
    var t = e.i(37479),
      r = e.i(61129),
      a = e.i(24644),
      l = e.i(20412),
      o = e.i(43737),
      i = e.i(98562),
      s = e.i(29744),
      n = e.i(25417),
      d = e.i(80461),
      u = e.i(55584),
      c = e.i(8462),
      p = e.i(24319),
      f = e.i(23441),
      h = e.i(26132),
      m = e.i(20218),
      v = e.i(24859),
      g = e.i(34909),
      x = e.i(98123),
      y = e.i(73803),
      j = e.i(23786),
      C = e.i(72233),
      S = e.i(39549),
      b = e.i(1884),
      M = e.i(83754);
    e.i(74507);
    var _ = e.i(32576),
      A = e.i(21203);
    e.s([
      'default',
      0,
      function () {
        let { t: e } = (0, _.useTranslation)(),
          [I, w] = (0, r.useState)([]),
          [z, T] = (0, r.useState)(!0),
          [k, O] = (0, r.useState)(null),
          [N, D] = (0, r.useState)(0),
          [L, $] = (0, r.useState)(25),
          [W, P] = (0, r.useState)(0),
          [R, B] = (0, r.useState)('pending'),
          [F, E] = (0, r.useState)({ isOpen: !1, type: 'completed', payoutId: null }),
          [H, U] = (0, r.useState)(''),
          V = (0, r.useCallback)(async () => {
            (T(!0), O(null));
            try {
              let e = A.supabaseClient
                .from('driver_payouts')
                .select(
                  `
          id,
          driver_id,
          amount,
          status,
          reference_note,
          created_at,
          drivers!inner(user_id, profiles!drivers_user_id_fkey(full_name, phone))
        `,
                  { count: 'exact' },
                )
                .order('created_at', { ascending: !1 })
                .range(N * L, N * L + L - 1);
              'all' !== R && (e = e.eq('status', R));
              let { data: t, error: r, count: a } = await e;
              if (r) throw r;
              let l = (t || []).map((e) => {
                let t = Array.isArray(e.drivers?.profiles)
                  ? e.drivers?.profiles[0]
                  : e.drivers?.profiles;
                return {
                  id: e.id,
                  driver_id: e.driver_id,
                  driver_name: t?.full_name || 'Unknown',
                  phone: t?.phone || 'Unknown',
                  amount: e.amount,
                  status: e.status,
                  reference_note: e.reference_note || '',
                  created_at: e.created_at,
                };
              });
              (w(l), P(a ?? 0));
            } catch (e) {
              O(e instanceof Error ? e.message : 'Failed to load payouts');
            } finally {
              T(!1);
            }
          }, [N, L, R]);
        (0, r.useEffect)(() => {
          V();
        }, [V]);
        let K = async () => {
            if (F.payoutId)
              try {
                let { error: e } = await A.supabaseClient.rpc('process_payout', {
                  p_payout_id: F.payoutId,
                  p_new_status: F.type,
                  p_reference_note: H.trim(),
                });
                if (e) throw e;
                (w((e) =>
                  e.map((e) =>
                    e.id === F.payoutId ? { ...e, status: F.type, reference_note: H.trim() } : e,
                  ),
                ),
                  E({ isOpen: !1, type: 'completed', payoutId: null }),
                  U(''));
              } catch (e) {
                O(e instanceof Error ? e.message : 'Failed to update payout status');
              }
          },
          Z = [
            {
              field: 'driver_name',
              headerName: e('payouts.fields.driverName'),
              minWidth: 180,
              flex: 1,
            },
            { field: 'phone', headerName: e('payouts.fields.phone'), minWidth: 150, flex: 1 },
            {
              field: 'amount',
              headerName: e('payouts.fields.amount'),
              minWidth: 120,
              flex: 1,
              renderCell: ({ value: r }) =>
                (0, t.jsxs)(l.Typography, {
                  variant: 'body2',
                  sx: { fontWeight: 'bold' },
                  children: [Number(r).toLocaleString(), ' ', e('currency')],
                }),
            },
            {
              field: 'status',
              headerName: e('payouts.fields.status'),
              minWidth: 120,
              flex: 1,
              renderCell: ({ value: r }) =>
                (0, t.jsx)(o.Chip, {
                  label: e(`payouts.status.${r}`) || r,
                  color: 'completed' === r ? 'success' : 'rejected' === r ? 'error' : 'warning',
                  size: 'small',
                  variant: 'outlined',
                }),
            },
            {
              field: 'reference_note',
              headerName: e('payouts.fields.referenceNote'),
              minWidth: 150,
              flex: 1.5,
            },
            {
              field: 'created_at',
              headerName: e('payouts.fields.createdAt'),
              minWidth: 160,
              flex: 1,
              renderCell: ({ value: e }) => (e ? new Date(e).toLocaleString() : '—'),
            },
            {
              field: 'actions',
              headerName: e('actions.actions'),
              sortable: !1,
              minWidth: 150,
              align: 'center',
              headerAlign: 'center',
              renderCell: ({ row: r }) =>
                'pending' === r.status
                  ? (0, t.jsxs)(d.Stack, {
                      direction: 'row',
                      spacing: 1,
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100%',
                      children: [
                        (0, t.jsx)(n.Tooltip, {
                          title: e('payouts.actions.approve'),
                          children: (0, t.jsx)('span', {
                            children: (0, t.jsx)(s.IconButton, {
                              size: 'small',
                              color: 'success',
                              onClick: () => {
                                (E({ isOpen: !0, type: 'completed', payoutId: r.id }), U(''));
                              },
                              children: (0, t.jsx)(b.default, { fontSize: 'small' }),
                            }),
                          }),
                        }),
                        (0, t.jsx)(n.Tooltip, {
                          title: e('payouts.actions.reject'),
                          children: (0, t.jsx)('span', {
                            children: (0, t.jsx)(s.IconButton, {
                              size: 'small',
                              color: 'error',
                              onClick: () => {
                                (E({ isOpen: !0, type: 'rejected', payoutId: r.id }), U(''));
                              },
                              children: (0, t.jsx)(M.default, { fontSize: 'small' }),
                            }),
                          }),
                        }),
                      ],
                    })
                  : null,
            },
          ];
        return (0, t.jsxs)(a.Box, {
          sx: { p: 3 },
          children: [
            (0, t.jsxs)(a.Box, {
              sx: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 },
              children: [
                (0, t.jsx)(l.Typography, {
                  variant: 'h5',
                  fontWeight: 'bold',
                  children: e('payouts.titles.list'),
                }),
                (0, t.jsxs)(a.Box, {
                  sx: { display: 'flex', gap: 2, alignItems: 'center' },
                  children: [
                    (0, t.jsxs)(f.FormControl, {
                      size: 'small',
                      sx: { minWidth: 160 },
                      children: [
                        (0, t.jsx)(h.InputLabel, { children: e('payouts.fields.status') }),
                        (0, t.jsxs)(c.Select, {
                          value: R,
                          label: e('payouts.fields.status'),
                          onChange: (e) => {
                            (B(e.target.value), D(0));
                          },
                          children: [
                            (0, t.jsx)(p.MenuItem, {
                              value: 'all',
                              children: e('trips.all_statuses'),
                            }),
                            (0, t.jsx)(p.MenuItem, {
                              value: 'pending',
                              children: e('payouts.status.pending'),
                            }),
                            (0, t.jsx)(p.MenuItem, {
                              value: 'completed',
                              children: e('payouts.status.completed'),
                            }),
                            (0, t.jsx)(p.MenuItem, {
                              value: 'rejected',
                              children: e('payouts.status.rejected'),
                            }),
                          ],
                        }),
                      ],
                    }),
                    (0, t.jsx)(n.Tooltip, {
                      title: e('dashboard.refresh'),
                      children: (0, t.jsx)(s.IconButton, {
                        onClick: V,
                        disabled: z,
                        color: 'primary',
                        children: (0, t.jsx)(S.default, {}),
                      }),
                    }),
                  ],
                }),
              ],
            }),
            k &&
              (0, t.jsx)(i.Alert, {
                severity: 'error',
                sx: { mb: 2 },
                onClose: () => O(null),
                children: k,
              }),
            (0, t.jsx)(C.DataGrid, {
              rows: I,
              columns: Z,
              loading: z,
              rowCount: W,
              paginationMode: 'server',
              page: N,
              pageSize: L,
              onPageChange: (e) => D(e),
              onPageSizeChange: (e) => $(e),
              rowsPerPageOptions: [10, 25, 50],
              autoHeight: !0,
              disableSelectionOnClick: !0,
            }),
            (0, t.jsxs)(m.Dialog, {
              open: F.isOpen,
              onClose: () => E({ ...F, isOpen: !1 }),
              children: [
                (0, t.jsx)(v.DialogTitle, {
                  children:
                    'completed' === F.type
                      ? e('payouts.actions.approve')
                      : e('payouts.actions.reject'),
                }),
                (0, t.jsxs)(g.DialogContent, {
                  children: [
                    (0, t.jsx)(x.DialogContentText, { mb: 2, children: e('are_you_sure') }),
                    (0, t.jsx)(j.TextField, {
                      autoFocus: !0,
                      margin: 'dense',
                      label: e('payouts.fields.referenceNote'),
                      fullWidth: !0,
                      variant: 'outlined',
                      value: H,
                      onChange: (e) => U(e.target.value),
                    }),
                  ],
                }),
                (0, t.jsxs)(y.DialogActions, {
                  sx: { p: 2 },
                  children: [
                    (0, t.jsx)(u.Button, {
                      onClick: () => E({ ...F, isOpen: !1 }),
                      color: 'inherit',
                      children: e('cancel'),
                    }),
                    (0, t.jsx)(u.Button, {
                      onClick: K,
                      variant: 'contained',
                      color: 'completed' === F.type ? 'success' : 'error',
                      children: e('save'),
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
