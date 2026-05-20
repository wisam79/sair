(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([
  'object' == typeof document ? document.currentScript : void 0,
  50718,
  (e) => {
    'use strict';
    e.i(61129);
    var t = e.i(16320),
      a = e.i(37479);
    let l = (0, t.default)(
      (0, a.jsx)('path', {
        d: 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z',
      }),
      'Close',
    );
    e.s(['default', 0, l]);
  },
  58915,
  21620,
  (e) => {
    'use strict';
    e.i(64775);
    var t = e.i(84570),
      a = e.i(98457),
      l = e.i(61129),
      r = e.i(94083),
      i = e.i(42306),
      o = e.i(26589),
      s = e.i(6888),
      n = e.i(34070),
      d = e.i(44504),
      c = e.i(10372),
      u = e.i(18635),
      p = e.i(50901);
    function h(e) {
      return (0, p.default)('MuiSwitch', e);
    }
    let f = (0, u.default)('MuiSwitch', [
      'root',
      'edgeStart',
      'edgeEnd',
      'switchBase',
      'colorPrimary',
      'colorSecondary',
      'sizeSmall',
      'sizeMedium',
      'checked',
      'disabled',
      'input',
      'thumb',
      'track',
    ]);
    e.s(['default', 0, f, 'getSwitchUtilityClass', 0, h], 21620);
    var m = e.i(37479);
    let g = ['className', 'color', 'edge', 'size', 'sx'],
      v = (0, d.styled)('span', {
        name: 'MuiSwitch',
        slot: 'Root',
        overridesResolver: (e, t) => {
          let { ownerState: a } = e;
          return [
            t.root,
            a.edge && t[`edge${(0, s.default)(a.edge)}`],
            t[`size${(0, s.default)(a.size)}`],
          ];
        },
      })({
        display: 'inline-flex',
        width: 58,
        height: 38,
        overflow: 'hidden',
        padding: 12,
        boxSizing: 'border-box',
        position: 'relative',
        flexShrink: 0,
        zIndex: 0,
        verticalAlign: 'middle',
        '@media print': { colorAdjust: 'exact' },
        variants: [
          { props: { edge: 'start' }, style: { marginLeft: -8 } },
          { props: { edge: 'end' }, style: { marginRight: -8 } },
          {
            props: { size: 'small' },
            style: {
              width: 40,
              height: 24,
              padding: 7,
              [`& .${f.thumb}`]: { width: 16, height: 16 },
              [`& .${f.switchBase}`]: {
                padding: 4,
                [`&.${f.checked}`]: { transform: 'translateX(16px)' },
              },
            },
          },
        ],
      }),
      x = (0, d.styled)(n.default, {
        name: 'MuiSwitch',
        slot: 'SwitchBase',
        overridesResolver: (e, t) => {
          let { ownerState: a } = e;
          return [
            t.switchBase,
            { [`& .${f.input}`]: t.input },
            'default' !== a.color && t[`color${(0, s.default)(a.color)}`],
          ];
        },
      })(
        ({ theme: e }) => ({
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 1,
          color: e.vars
            ? e.vars.palette.Switch.defaultColor
            : `${'light' === e.palette.mode ? e.palette.common.white : e.palette.grey[300]}`,
          transition: e.transitions.create(['left', 'transform'], {
            duration: e.transitions.duration.shortest,
          }),
          [`&.${f.checked}`]: { transform: 'translateX(20px)' },
          [`&.${f.disabled}`]: {
            color: e.vars
              ? e.vars.palette.Switch.defaultDisabledColor
              : `${'light' === e.palette.mode ? e.palette.grey[100] : e.palette.grey[600]}`,
          },
          [`&.${f.checked} + .${f.track}`]: { opacity: 0.5 },
          [`&.${f.disabled} + .${f.track}`]: {
            opacity: e.vars
              ? e.vars.opacity.switchTrackDisabled
              : `${'light' === e.palette.mode ? 0.12 : 0.2}`,
          },
          [`& .${f.input}`]: { left: '-100%', width: '300%' },
        }),
        ({ theme: e }) => ({
          '&:hover': {
            backgroundColor: e.vars
              ? `rgba(${e.vars.palette.action.activeChannel} / ${e.vars.palette.action.hoverOpacity})`
              : (0, o.alpha)(e.palette.action.active, e.palette.action.hoverOpacity),
            '@media (hover: none)': { backgroundColor: 'transparent' },
          },
          variants: [
            ...Object.entries(e.palette)
              .filter(([, e]) => e.main && e.light)
              .map(([t]) => ({
                props: { color: t },
                style: {
                  [`&.${f.checked}`]: {
                    color: (e.vars || e).palette[t].main,
                    '&:hover': {
                      backgroundColor: e.vars
                        ? `rgba(${e.vars.palette[t].mainChannel} / ${e.vars.palette.action.hoverOpacity})`
                        : (0, o.alpha)(e.palette[t].main, e.palette.action.hoverOpacity),
                      '@media (hover: none)': { backgroundColor: 'transparent' },
                    },
                    [`&.${f.disabled}`]: {
                      color: e.vars
                        ? e.vars.palette.Switch[`${t}DisabledColor`]
                        : `${'light' === e.palette.mode ? (0, o.lighten)(e.palette[t].main, 0.62) : (0, o.darken)(e.palette[t].main, 0.55)}`,
                    },
                  },
                  [`&.${f.checked} + .${f.track}`]: {
                    backgroundColor: (e.vars || e).palette[t].main,
                  },
                },
              })),
          ],
        }),
      ),
      y = (0, d.styled)('span', {
        name: 'MuiSwitch',
        slot: 'Track',
        overridesResolver: (e, t) => t.track,
      })(({ theme: e }) => ({
        height: '100%',
        width: '100%',
        borderRadius: 7,
        zIndex: -1,
        transition: e.transitions.create(['opacity', 'background-color'], {
          duration: e.transitions.duration.shortest,
        }),
        backgroundColor: e.vars
          ? e.vars.palette.common.onBackground
          : `${'light' === e.palette.mode ? e.palette.common.black : e.palette.common.white}`,
        opacity: e.vars ? e.vars.opacity.switchTrack : `${'light' === e.palette.mode ? 0.38 : 0.3}`,
      })),
      b = (0, d.styled)('span', {
        name: 'MuiSwitch',
        slot: 'Thumb',
        overridesResolver: (e, t) => t.thumb,
      })(({ theme: e }) => ({
        boxShadow: (e.vars || e).shadows[1],
        backgroundColor: 'currentColor',
        width: 20,
        height: 20,
        borderRadius: '50%',
      })),
      C = l.forwardRef(function (e, l) {
        let o = (0, c.useDefaultProps)({ props: e, name: 'MuiSwitch' }),
          { className: n, color: d = 'primary', edge: u = !1, size: p = 'medium', sx: f } = o,
          C = (0, t.default)(o, g),
          j = (0, a.default)({}, o, { color: d, edge: u, size: p }),
          S = ((e) => {
            let { classes: t, edge: l, size: r, color: o, checked: n, disabled: d } = e,
              c = {
                root: ['root', l && `edge${(0, s.default)(l)}`, `size${(0, s.default)(r)}`],
                switchBase: [
                  'switchBase',
                  `color${(0, s.default)(o)}`,
                  n && 'checked',
                  d && 'disabled',
                ],
                thumb: ['thumb'],
                track: ['track'],
                input: ['input'],
              },
              u = (0, i.default)(c, h, t);
            return (0, a.default)({}, t, u);
          })(j),
          w = (0, m.jsx)(b, { className: S.thumb, ownerState: j });
        return (0, m.jsxs)(v, {
          className: (0, r.default)(S.root, n),
          sx: f,
          ownerState: j,
          children: [
            (0, m.jsx)(
              x,
              (0, a.default)(
                { type: 'checkbox', icon: w, checkedIcon: w, ref: l, ownerState: j },
                C,
                { classes: (0, a.default)({}, S, { root: S.switchBase }) },
              ),
            ),
            (0, m.jsx)(y, { className: S.track, ownerState: j }),
          ],
        });
      });
    e.s(['default', 0, C], 58915);
  },
  98562,
  (e) => {
    'use strict';
    e.i(64775);
    var t = e.i(84570),
      a = e.i(98457),
      l = e.i(61129),
      r = e.i(94083),
      i = e.i(42306),
      o = e.i(26589),
      s = e.i(44504),
      n = e.i(10372),
      d = e.i(59049),
      c = e.i(6888),
      u = e.i(58478),
      p = e.i(18635),
      h = e.i(50901);
    function f(e) {
      return (0, h.default)('MuiAlert', e);
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
      v = e.i(16320),
      x = e.i(37479);
    let y = (0, v.default)(
        (0, x.jsx)('path', {
          d: 'M20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4C12.76,4 13.5,4.11 14.2, 4.31L15.77,2.74C14.61,2.26 13.34,2 12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0, 0 22,12M7.91,10.08L6.5,11.5L11,16L21,6L19.59,4.58L11,13.17L7.91,10.08Z',
        }),
        'SuccessOutlined',
      ),
      b = (0, v.default)(
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
      j = (0, v.default)(
        (0, x.jsx)('path', {
          d: 'M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20, 12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10, 10 0 0,0 12,2M11,17H13V11H11V17Z',
        }),
        'InfoOutlined',
      );
    var S = e.i(50718);
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
      $ = (0, s.styled)(u.default, {
        name: 'MuiAlert',
        slot: 'Root',
        overridesResolver: (e, t) => {
          let { ownerState: a } = e;
          return [t.root, t[a.variant], t[`${a.variant}${(0, c.default)(a.color || a.severity)}`]];
        },
      })(({ theme: e }) => {
        let t = 'light' === e.palette.mode ? o.darken : o.lighten,
          l = 'light' === e.palette.mode ? o.lighten : o.darken;
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
                    : l(e.palette[a].light, 0.9),
                  [`& .${m.icon}`]: e.vars
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
                  [`& .${m.icon}`]: e.vars
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
      k = (0, s.styled)('div', {
        name: 'MuiAlert',
        slot: 'Icon',
        overridesResolver: (e, t) => t.icon,
      })({ marginRight: 12, padding: '7px 0', display: 'flex', fontSize: 22, opacity: 0.9 }),
      A = (0, s.styled)('div', {
        name: 'MuiAlert',
        slot: 'Message',
        overridesResolver: (e, t) => t.message,
      })({ padding: '8px 0', minWidth: 0, overflow: 'auto' }),
      z = (0, s.styled)('div', {
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
      M = {
        success: (0, x.jsx)(y, { fontSize: 'inherit' }),
        warning: (0, x.jsx)(b, { fontSize: 'inherit' }),
        error: (0, x.jsx)(C, { fontSize: 'inherit' }),
        info: (0, x.jsx)(j, { fontSize: 'inherit' }),
      },
      B = l.forwardRef(function (e, l) {
        let o = (0, n.useDefaultProps)({ props: e, name: 'MuiAlert' }),
          {
            action: s,
            children: u,
            className: p,
            closeText: h = 'Close',
            color: m,
            components: v = {},
            componentsProps: y = {},
            icon: b,
            iconMapping: C = M,
            onClose: j,
            role: B = 'alert',
            severity: I = 'success',
            slotProps: R = {},
            slots: T = {},
            variant: L = 'standard',
          } = o,
          O = (0, t.default)(o, w),
          _ = (0, a.default)({}, o, { color: m, severity: I, variant: L, colorSeverity: m || I }),
          P = ((e) => {
            let { variant: t, color: a, severity: l, classes: r } = e,
              o = {
                root: [
                  'root',
                  `color${(0, c.default)(a || l)}`,
                  `${t}${(0, c.default)(a || l)}`,
                  `${t}`,
                ],
                icon: ['icon'],
                message: ['message'],
                action: ['action'],
              };
            return (0, i.default)(o, f, r);
          })(_),
          E = {
            slots: (0, a.default)({ closeButton: v.CloseButton, closeIcon: v.CloseIcon }, T),
            slotProps: (0, a.default)({}, y, R),
          },
          [N, D] = (0, d.default)('closeButton', {
            elementType: g.default,
            externalForwardedProps: E,
            ownerState: _,
          }),
          [W, F] = (0, d.default)('closeIcon', {
            elementType: S.default,
            externalForwardedProps: E,
            ownerState: _,
          });
        return (0, x.jsxs)(
          $,
          (0, a.default)(
            { role: B, elevation: 0, ownerState: _, className: (0, r.default)(P.root, p), ref: l },
            O,
            {
              children: [
                !1 !== b
                  ? (0, x.jsx)(k, { ownerState: _, className: P.icon, children: b || C[I] || M[I] })
                  : null,
                (0, x.jsx)(A, { ownerState: _, className: P.message, children: u }),
                null != s
                  ? (0, x.jsx)(z, { ownerState: _, className: P.action, children: s })
                  : null,
                null == s && j
                  ? (0, x.jsx)(z, {
                      ownerState: _,
                      className: P.action,
                      children: (0, x.jsx)(
                        N,
                        (0, a.default)(
                          {
                            size: 'small',
                            'aria-label': h,
                            title: h,
                            color: 'inherit',
                            onClick: j,
                          },
                          D,
                          { children: (0, x.jsx)(W, (0, a.default)({ fontSize: 'small' }, F)) },
                        ),
                      ),
                    })
                  : null,
              ],
            },
          ),
        );
      });
    e.s(['Alert', 0, B], 98562);
  },
  39549,
  (e, t, a) => {
    'use strict';
    var l = e.r(27249);
    (Object.defineProperty(a, '__esModule', { value: !0 }), (a.default = void 0));
    var r = l(e.r(72523)),
      i = e.r(37479);
    a.default = (0, r.default)(
      (0, i.jsx)('path', {
        d: 'M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4z',
      }),
      'Refresh',
    );
  },
  23894,
  (e) => {
    'use strict';
    var t = e.i(58915);
    e.s(['Switch', () => t.default]);
  },
  87209,
  (e) => {
    'use strict';
    var t = e.i(37479),
      a = e.i(61129),
      l = e.i(24644),
      r = e.i(20412),
      i = e.i(65311),
      o = e.i(87332),
      s = e.i(23894),
      n = e.i(98562),
      d = e.i(41191),
      c = e.i(43737),
      u = e.i(29744),
      p = e.i(25417),
      h = e.i(39549),
      f = e.i(21203);
    let m = {
      realtime_tracking: '📡',
      push_notifications: '🔔',
      offline_mode: '📴',
      ratings_system: '⭐',
      zaincash_payment: '💳',
    };
    e.s([
      'default',
      0,
      function () {
        let [e, g] = (0, a.useState)([]),
          [v, x] = (0, a.useState)(!0),
          [y, b] = (0, a.useState)(null),
          [C, j] = (0, a.useState)(null),
          [S, w] = (0, a.useState)(null),
          $ = (0, a.useRef)(null),
          k = (0, a.useCallback)(async () => {
            (x(!0), b(null));
            try {
              let { data: e, error: t } = await f.supabaseClient
                .from('feature_flags')
                .select('*')
                .order('name');
              if (t) throw t;
              g(e);
            } catch (e) {
              b(e instanceof Error ? e.message : 'Failed to load feature flags');
            } finally {
              x(!1);
            }
          }, []),
          A = (0, a.useCallback)(() => {
            $.current ||
              ($.current = setTimeout(() => {
                (($.current = null), k());
              }, 1500));
          }, [k]);
        (0, a.useEffect)(() => {
          k();
          let e = f.supabaseClient
            .channel('admin-feature-flags')
            .on(
              'postgres_changes',
              { event: '*', schema: 'public', table: 'feature_flags' },
              () => {
                A();
              },
            )
            .subscribe();
          return () => {
            ($.current && (clearTimeout($.current), ($.current = null)),
              f.supabaseClient.removeChannel(e));
          };
        }, [k, A]);
        let z = async (e) => {
          (j(e.id), b(null), w(null));
          try {
            let { error: t } = await f.supabaseClient
              .from('feature_flags')
              .update({ enabled: !e.enabled, updated_at: new Date().toISOString() })
              .eq('id', e.id);
            if (t) throw t;
            (g((t) => t.map((t) => (t.id === e.id ? { ...t, enabled: !t.enabled } : t))),
              w(`"${e.name}" ${!e.enabled ? 'enabled' : 'disabled'} successfully`),
              setTimeout(() => w(null), 3e3));
          } catch (e) {
            b(e instanceof Error ? e.message : 'Failed to update flag');
          } finally {
            j(null);
          }
        };
        return v && 0 === e.length
          ? (0, t.jsx)(l.Box, {
              sx: {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: 400,
              },
              children: (0, t.jsx)(d.CircularProgress, {}),
            })
          : (0, t.jsxs)(l.Box, {
              sx: { p: 3 },
              children: [
                (0, t.jsxs)(l.Box, {
                  sx: {
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 3,
                  },
                  children: [
                    (0, t.jsxs)(l.Box, {
                      children: [
                        (0, t.jsx)(r.Typography, {
                          variant: 'h5',
                          fontWeight: 'bold',
                          children: 'Feature Flags',
                        }),
                        (0, t.jsx)(r.Typography, {
                          variant: 'body2',
                          color: 'text.secondary',
                          children:
                            'Toggle features in real-time — changes reflect immediately in the mobile app',
                        }),
                      ],
                    }),
                    (0, t.jsx)(p.Tooltip, {
                      title: 'Refresh',
                      children: (0, t.jsx)(u.IconButton, {
                        onClick: k,
                        disabled: v,
                        color: 'primary',
                        children: (0, t.jsx)(h.default, {}),
                      }),
                    }),
                  ],
                }),
                y &&
                  (0, t.jsx)(n.Alert, {
                    severity: 'error',
                    sx: { mb: 2 },
                    onClose: () => b(null),
                    children: y,
                  }),
                S && (0, t.jsx)(n.Alert, { severity: 'success', sx: { mb: 2 }, children: S }),
                (0, t.jsx)(l.Box, {
                  sx: { display: 'flex', flexDirection: 'column', gap: 2 },
                  children: e.map((e) =>
                    (0, t.jsx)(
                      i.Card,
                      {
                        elevation: 1,
                        sx: { borderLeft: `4px solid ${e.enabled ? '#34C759' : '#ccc'}` },
                        children: (0, t.jsx)(o.CardContent, {
                          children: (0, t.jsxs)(l.Box, {
                            sx: {
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            },
                            children: [
                              (0, t.jsxs)(l.Box, {
                                sx: { display: 'flex', alignItems: 'center', gap: 2 },
                                children: [
                                  (0, t.jsx)(r.Typography, {
                                    fontSize: 28,
                                    children: m[e.name] ?? '🚩',
                                  }),
                                  (0, t.jsxs)(l.Box, {
                                    children: [
                                      (0, t.jsxs)(l.Box, {
                                        sx: { display: 'flex', alignItems: 'center', gap: 1 },
                                        children: [
                                          (0, t.jsx)(r.Typography, {
                                            variant: 'subtitle1',
                                            fontWeight: 'bold',
                                            children: e.name,
                                          }),
                                          (0, t.jsx)(c.Chip, {
                                            label: e.enabled ? 'Enabled' : 'Disabled',
                                            color: e.enabled ? 'success' : 'default',
                                            size: 'small',
                                          }),
                                        ],
                                      }),
                                      e.description &&
                                        (0, t.jsx)(r.Typography, {
                                          variant: 'body2',
                                          color: 'text.secondary',
                                          children: e.description,
                                        }),
                                      (0, t.jsxs)(r.Typography, {
                                        variant: 'caption',
                                        color: 'text.disabled',
                                        children: [
                                          'Last updated: ',
                                          new Date(e.updated_at).toLocaleString('ar-IQ'),
                                        ],
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                              (0, t.jsxs)(l.Box, {
                                sx: { display: 'flex', alignItems: 'center', gap: 1 },
                                children: [
                                  C === e.id && (0, t.jsx)(d.CircularProgress, { size: 20 }),
                                  (0, t.jsx)(s.Switch, {
                                    checked: e.enabled,
                                    onChange: () => z(e),
                                    disabled: C === e.id,
                                    color: 'success',
                                  }),
                                ],
                              }),
                            ],
                          }),
                        }),
                      },
                      e.id,
                    ),
                  ),
                }),
              ],
            });
      },
    ]);
  },
]);
