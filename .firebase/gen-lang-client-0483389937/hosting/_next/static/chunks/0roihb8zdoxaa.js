(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([
  'object' == typeof document ? document.currentScript : void 0,
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
      s = e.i(44504),
      n = e.i(10372),
      d = e.i(59049),
      c = e.i(6888),
      u = e.i(58478),
      f = e.i(18635),
      p = e.i(50901);
    function h(e) {
      return (0, p.default)('MuiAlert', e);
    }
    let m = (0, f.default)('MuiAlert', [
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
      v = e.i(16320),
      x = e.i(37479);
    let y = (0, v.default)(
        (0, x.jsx)('path', {
          d: 'M20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4C12.76,4 13.5,4.11 14.2, 4.31L15.77,2.74C14.61,2.26 13.34,2 12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0, 0 22,12M7.91,10.08L6.5,11.5L11,16L21,6L19.59,4.58L11,13.17L7.91,10.08Z',
        }),
        'SuccessOutlined',
      ),
      C = (0, v.default)(
        (0, x.jsx)('path', {
          d: 'M12 5.99L19.53 19H4.47L12 5.99M12 2L1 21h22L12 2zm1 14h-2v2h2v-2zm0-6h-2v4h2v-4z',
        }),
        'ReportProblemOutlined',
      ),
      S = (0, v.default)(
        (0, x.jsx)('path', {
          d: 'M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z',
        }),
        'ErrorOutline',
      ),
      j = (0, v.default)(
        (0, x.jsx)('path', {
          d: 'M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20, 12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10, 10 0 0,0 12,2M11,17H13V11H11V17Z',
        }),
        'InfoOutlined',
      );
    var A = e.i(50718);
    let _ = [
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
      b = (0, s.styled)(u.default, {
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
      M = (0, s.styled)('div', {
        name: 'MuiAlert',
        slot: 'Icon',
        overridesResolver: (e, t) => t.icon,
      })({ marginRight: 12, padding: '7px 0', display: 'flex', fontSize: 22, opacity: 0.9 }),
      z = (0, s.styled)('div', {
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
      T = {
        success: (0, x.jsx)(y, { fontSize: 'inherit' }),
        warning: (0, x.jsx)(C, { fontSize: 'inherit' }),
        error: (0, x.jsx)(S, { fontSize: 'inherit' }),
        info: (0, x.jsx)(j, { fontSize: 'inherit' }),
      },
      $ = r.forwardRef(function (e, r) {
        let o = (0, n.useDefaultProps)({ props: e, name: 'MuiAlert' }),
          {
            action: s,
            children: u,
            className: f,
            closeText: p = 'Close',
            color: m,
            components: v = {},
            componentsProps: y = {},
            icon: C,
            iconMapping: S = T,
            onClose: j,
            role: $ = 'alert',
            severity: I = 'success',
            slotProps: L = {},
            slots: W = {},
            variant: k = 'standard',
          } = o,
          N = (0, t.default)(o, _),
          O = (0, l.default)({}, o, { color: m, severity: I, variant: k, colorSeverity: m || I }),
          P = ((e) => {
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
            return (0, i.default)(o, h, a);
          })(O),
          R = {
            slots: (0, l.default)({ closeButton: v.CloseButton, closeIcon: v.CloseIcon }, W),
            slotProps: (0, l.default)({}, y, L),
          },
          [E, B] = (0, d.default)('closeButton', {
            elementType: g.default,
            externalForwardedProps: R,
            ownerState: O,
          }),
          [H, D] = (0, d.default)('closeIcon', {
            elementType: A.default,
            externalForwardedProps: R,
            ownerState: O,
          });
        return (0, x.jsxs)(
          b,
          (0, l.default)(
            { role: $, elevation: 0, ownerState: O, className: (0, a.default)(P.root, f), ref: r },
            N,
            {
              children: [
                !1 !== C
                  ? (0, x.jsx)(M, { ownerState: O, className: P.icon, children: C || S[I] || T[I] })
                  : null,
                (0, x.jsx)(z, { ownerState: O, className: P.message, children: u }),
                null != s
                  ? (0, x.jsx)(w, { ownerState: O, className: P.action, children: s })
                  : null,
                null == s && j
                  ? (0, x.jsx)(w, {
                      ownerState: O,
                      className: P.action,
                      children: (0, x.jsx)(
                        E,
                        (0, l.default)(
                          {
                            size: 'small',
                            'aria-label': p,
                            title: p,
                            color: 'inherit',
                            onClick: j,
                          },
                          B,
                          { children: (0, x.jsx)(H, (0, l.default)({ fontSize: 'small' }, D)) },
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
  (e, t, l) => {
    'use strict';
    var r = e.r(27249);
    (Object.defineProperty(l, '__esModule', { value: !0 }), (l.default = void 0));
    var a = r(e.r(72523)),
      i = e.r(37479);
    l.default = (0, a.default)(
      (0, i.jsx)('path', {
        d: 'M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4z',
      }),
      'Refresh',
    );
  },
  23976,
  (e) => {
    'use strict';
    var t = e.i(37479),
      l = e.i(61129),
      r = e.i(24644),
      a = e.i(20412),
      i = e.i(43737),
      o = e.i(98562),
      s = e.i(29744),
      n = e.i(25417),
      d = e.i(72233),
      c = e.i(39549);
    e.i(74507);
    var u = e.i(32576),
      f = e.i(21203);
    e.s([
      'default',
      0,
      function () {
        let { t: e } = (0, u.useTranslation)(),
          [p, h] = (0, l.useState)([]),
          [m, g] = (0, l.useState)(!0),
          [v, x] = (0, l.useState)(null),
          [y, C] = (0, l.useState)(0),
          [S, j] = (0, l.useState)(25),
          [A, _] = (0, l.useState)(0),
          b = (0, l.useCallback)(async () => {
            (g(!0), x(null));
            try {
              let {
                data: e,
                error: t,
                count: l,
              } = await f.supabaseClient
                .from('audit_logs')
                .select(
                  `
          id,
          user_id,
          action,
          resource,
          resource_id,
          details,
          created_at,
          profiles!audit_logs_user_id_fkey(full_name)
        `,
                  { count: 'exact' },
                )
                .order('created_at', { ascending: !1 })
                .range(y * S, y * S + S - 1);
              if (t) throw t;
              let r = (e || []).map((e) => ({
                id: e.id,
                user_id: e.user_id,
                user_name:
                  (Array.isArray(e.profiles) ? e.profiles[0]?.full_name : e.profiles?.full_name) ??
                  e.user_id ??
                  'System',
                action: e.action,
                resource: e.resource,
                resource_id: e.resource_id,
                details:
                  'object' == typeof e.details && null !== e.details
                    ? JSON.stringify(e.details)
                    : String(e.details || ''),
                created_at: e.created_at,
              }));
              (h(r), _(l ?? 0));
            } catch (e) {
              x(e instanceof Error ? e.message : 'Failed to load audit logs');
            } finally {
              g(!1);
            }
          }, [y, S]);
        (0, l.useEffect)(() => {
          b();
        }, [b]);
        let M = [
          { field: 'user_name', headerName: e('audit_logs.fields.user'), minWidth: 180, flex: 1 },
          {
            field: 'action',
            headerName: e('audit_logs.fields.action'),
            minWidth: 150,
            flex: 1,
            renderCell: ({ value: e }) =>
              (0, t.jsx)(i.Chip, {
                label: e,
                color: e.includes('DELETE') ? 'error' : e.includes('UPDATE') ? 'warning' : 'info',
                size: 'small',
                variant: 'outlined',
              }),
          },
          {
            field: 'resource',
            headerName: e('audit_logs.fields.resource'),
            minWidth: 150,
            flex: 1,
          },
          {
            field: 'resource_id',
            headerName: e('audit_logs.fields.resourceId'),
            minWidth: 200,
            flex: 1,
            renderCell: ({ value: e }) =>
              (0, t.jsx)(a.Typography, {
                variant: 'body2',
                sx: { fontFamily: 'monospace', fontSize: '0.75rem' },
                children: e || '—',
              }),
          },
          {
            field: 'details',
            headerName: e('audit_logs.fields.details'),
            minWidth: 250,
            flex: 2,
            renderCell: ({ value: e }) =>
              (0, t.jsx)(n.Tooltip, {
                title: e,
                children: (0, t.jsx)(a.Typography, {
                  variant: 'body2',
                  noWrap: !0,
                  sx: { fontFamily: 'monospace', fontSize: '0.75rem', color: 'text.secondary' },
                  children: e,
                }),
              }),
          },
          {
            field: 'created_at',
            headerName: e('audit_logs.fields.createdAt'),
            minWidth: 160,
            flex: 1,
            renderCell: ({ value: e }) => (e ? new Date(e).toLocaleString() : '—'),
          },
        ];
        return (0, t.jsxs)(r.Box, {
          sx: { p: 3 },
          children: [
            (0, t.jsxs)(r.Box, {
              sx: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 },
              children: [
                (0, t.jsx)(a.Typography, {
                  variant: 'h5',
                  fontWeight: 'bold',
                  children: e('audit_logs.titles.list'),
                }),
                (0, t.jsx)(n.Tooltip, {
                  title: e('dashboard.refresh'),
                  children: (0, t.jsx)('span', {
                    children: (0, t.jsx)(s.IconButton, {
                      onClick: b,
                      disabled: m,
                      color: 'primary',
                      children: (0, t.jsx)(c.default, {}),
                    }),
                  }),
                }),
              ],
            }),
            v &&
              (0, t.jsx)(o.Alert, {
                severity: 'error',
                sx: { mb: 2 },
                onClose: () => x(null),
                children: v,
              }),
            (0, t.jsx)(d.DataGrid, {
              rows: p,
              columns: M,
              loading: m,
              rowCount: A,
              paginationMode: 'server',
              page: y,
              pageSize: S,
              onPageChange: (e) => C(e),
              onPageSizeChange: (e) => j(e),
              rowsPerPageOptions: [10, 25, 50],
              autoHeight: !0,
              disableSelectionOnClick: !0,
            }),
          ],
        });
      },
    ]);
  },
]);
