(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([
  'object' == typeof document ? document.currentScript : void 0,
  50718,
  (e) => {
    'use strict';
    e.i(61129);
    var t = e.i(16320),
      a = e.i(37479);
    let r = (0, t.default)(
      (0, a.jsx)('path', {
        d: 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z',
      }),
      'Close',
    );
    e.s(['default', 0, r]);
  },
  8929,
  (e) => {
    'use strict';
    e.i(64775);
    var t = e.i(84570),
      a = e.i(98457),
      r = e.i(61129),
      i = e.i(94083),
      l = e.i(42306),
      o = e.i(26589),
      s = e.i(47740),
      n = e.i(69321),
      d = e.i(10372),
      u = e.i(41781),
      c = e.i(81330),
      p = e.i(19348),
      m = e.i(86778),
      f = e.i(60898),
      f = f,
      h = e.i(96246),
      h = h,
      v = e.i(51370),
      v = v,
      g = e.i(18635),
      y = e.i(50901);
    function b(e) {
      return (0, y.default)('MuiMenuItem', e);
    }
    let x = (0, g.default)('MuiMenuItem', [
      'root',
      'focusVisible',
      'dense',
      'disabled',
      'divider',
      'gutters',
      'selected',
    ]);
    var C = e.i(37479);
    let $ = [
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
      M = (0, s.default)(c.default, {
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
            [`&.${x.selected}`]: {
              backgroundColor: e.vars
                ? `rgba(${e.vars.palette.primary.mainChannel} / ${e.vars.palette.action.selectedOpacity})`
                : (0, o.alpha)(e.palette.primary.main, e.palette.action.selectedOpacity),
              [`&.${x.focusVisible}`]: {
                backgroundColor: e.vars
                  ? `rgba(${e.vars.palette.primary.mainChannel} / calc(${e.vars.palette.action.selectedOpacity} + ${e.vars.palette.action.focusOpacity}))`
                  : (0, o.alpha)(
                      e.palette.primary.main,
                      e.palette.action.selectedOpacity + e.palette.action.focusOpacity,
                    ),
              },
            },
            [`&.${x.selected}:hover`]: {
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
            [`&.${x.focusVisible}`]: { backgroundColor: (e.vars || e).palette.action.focus },
            [`&.${x.disabled}`]: { opacity: (e.vars || e).palette.action.disabledOpacity },
            [`& + .${f.default.root}`]: { marginTop: e.spacing(1), marginBottom: e.spacing(1) },
            [`& + .${f.default.inset}`]: { marginLeft: 52 },
            [`& .${v.default.root}`]: { marginTop: 0, marginBottom: 0 },
            [`& .${v.default.inset}`]: { paddingLeft: 36 },
            [`& .${h.default.root}`]: { minWidth: 36 },
          },
          !t.dense && { [e.breakpoints.up('sm')]: { minHeight: 'auto' } },
          t.dense &&
            (0, a.default)({ minHeight: 32, paddingTop: 4, paddingBottom: 4 }, e.typography.body2, {
              [`& .${h.default.root} svg`]: { fontSize: '1.25rem' },
            }),
        ),
      ),
      j = r.forwardRef(function (e, o) {
        let s,
          n = (0, d.useDefaultProps)({ props: e, name: 'MuiMenuItem' }),
          {
            autoFocus: c = !1,
            component: f = 'li',
            dense: h = !1,
            divider: v = !1,
            disableGutters: g = !1,
            focusVisibleClassName: y,
            role: x = 'menuitem',
            tabIndex: j,
            className: A,
          } = n,
          S = (0, t.default)(n, $),
          I = r.useContext(u.default),
          T = r.useMemo(() => ({ dense: h || I.dense || !1, disableGutters: g }), [I.dense, h, g]),
          k = r.useRef(null);
        (0, p.default)(() => {
          c && k.current && k.current.focus();
        }, [c]);
        let _ = (0, a.default)({}, n, { dense: T.dense, divider: v, disableGutters: g }),
          L = ((e) => {
            let {
                disabled: t,
                dense: r,
                divider: i,
                disableGutters: o,
                selected: s,
                classes: n,
              } = e,
              d = (0, l.default)(
                {
                  root: [
                    'root',
                    r && 'dense',
                    t && 'disabled',
                    !o && 'gutters',
                    i && 'divider',
                    s && 'selected',
                  ],
                },
                b,
                n,
              );
            return (0, a.default)({}, n, d);
          })(n),
          O = (0, m.default)(k, o);
        return (
          n.disabled || (s = void 0 !== j ? j : -1),
          (0, C.jsx)(u.default.Provider, {
            value: T,
            children: (0, C.jsx)(
              M,
              (0, a.default)(
                {
                  ref: O,
                  role: x,
                  tabIndex: s,
                  component: f,
                  focusVisibleClassName: (0, i.default)(L.focusVisible, y),
                  className: (0, i.default)(L.root, A),
                },
                S,
                { ownerState: _, classes: L },
              ),
            ),
          })
        );
      });
    e.s(['default', 0, j], 8929);
  },
  98562,
  (e) => {
    'use strict';
    e.i(64775);
    var t = e.i(84570),
      a = e.i(98457),
      r = e.i(61129),
      i = e.i(94083),
      l = e.i(42306),
      o = e.i(26589),
      s = e.i(44504),
      n = e.i(10372),
      d = e.i(59049),
      u = e.i(6888),
      c = e.i(58478),
      p = e.i(18635),
      m = e.i(50901);
    function f(e) {
      return (0, m.default)('MuiAlert', e);
    }
    let h = (0, p.default)('MuiAlert', [
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
      y = e.i(37479);
    let b = (0, g.default)(
        (0, y.jsx)('path', {
          d: 'M20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4C12.76,4 13.5,4.11 14.2, 4.31L15.77,2.74C14.61,2.26 13.34,2 12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0, 0 22,12M7.91,10.08L6.5,11.5L11,16L21,6L19.59,4.58L11,13.17L7.91,10.08Z',
        }),
        'SuccessOutlined',
      ),
      x = (0, g.default)(
        (0, y.jsx)('path', {
          d: 'M12 5.99L19.53 19H4.47L12 5.99M12 2L1 21h22L12 2zm1 14h-2v2h2v-2zm0-6h-2v4h2v-4z',
        }),
        'ReportProblemOutlined',
      ),
      C = (0, g.default)(
        (0, y.jsx)('path', {
          d: 'M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z',
        }),
        'ErrorOutline',
      ),
      $ = (0, g.default)(
        (0, y.jsx)('path', {
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
      A = (0, s.styled)(c.default, {
        name: 'MuiAlert',
        slot: 'Root',
        overridesResolver: (e, t) => {
          let { ownerState: a } = e;
          return [t.root, t[a.variant], t[`${a.variant}${(0, u.default)(a.color || a.severity)}`]];
        },
      })(({ theme: e }) => {
        let t = 'light' === e.palette.mode ? o.darken : o.lighten,
          r = 'light' === e.palette.mode ? o.lighten : o.darken;
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
                    : r(e.palette[a].light, 0.9),
                  [`& .${h.icon}`]: e.vars
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
                  [`& .${h.icon}`]: e.vars
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
      S = (0, s.styled)('div', {
        name: 'MuiAlert',
        slot: 'Icon',
        overridesResolver: (e, t) => t.icon,
      })({ marginRight: 12, padding: '7px 0', display: 'flex', fontSize: 22, opacity: 0.9 }),
      I = (0, s.styled)('div', {
        name: 'MuiAlert',
        slot: 'Message',
        overridesResolver: (e, t) => t.message,
      })({ padding: '8px 0', minWidth: 0, overflow: 'auto' }),
      T = (0, s.styled)('div', {
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
        success: (0, y.jsx)(b, { fontSize: 'inherit' }),
        warning: (0, y.jsx)(x, { fontSize: 'inherit' }),
        error: (0, y.jsx)(C, { fontSize: 'inherit' }),
        info: (0, y.jsx)($, { fontSize: 'inherit' }),
      },
      _ = r.forwardRef(function (e, r) {
        let o = (0, n.useDefaultProps)({ props: e, name: 'MuiAlert' }),
          {
            action: s,
            children: c,
            className: p,
            closeText: m = 'Close',
            color: h,
            components: g = {},
            componentsProps: b = {},
            icon: x,
            iconMapping: C = k,
            onClose: $,
            role: _ = 'alert',
            severity: L = 'success',
            slotProps: O = {},
            slots: q = {},
            variant: R = 'standard',
          } = o,
          P = (0, t.default)(o, j),
          w = (0, a.default)({}, o, { color: h, severity: L, variant: R, colorSeverity: h || L }),
          z = ((e) => {
            let { variant: t, color: a, severity: r, classes: i } = e,
              o = {
                root: [
                  'root',
                  `color${(0, u.default)(a || r)}`,
                  `${t}${(0, u.default)(a || r)}`,
                  `${t}`,
                ],
                icon: ['icon'],
                message: ['message'],
                action: ['action'],
              };
            return (0, l.default)(o, f, i);
          })(w),
          B = {
            slots: (0, a.default)({ closeButton: g.CloseButton, closeIcon: g.CloseIcon }, q),
            slotProps: (0, a.default)({}, b, O),
          },
          [N, F] = (0, d.default)('closeButton', {
            elementType: v.default,
            externalForwardedProps: B,
            ownerState: w,
          }),
          [V, W] = (0, d.default)('closeIcon', {
            elementType: M.default,
            externalForwardedProps: B,
            ownerState: w,
          });
        return (0, y.jsxs)(
          A,
          (0, a.default)(
            { role: _, elevation: 0, ownerState: w, className: (0, i.default)(z.root, p), ref: r },
            P,
            {
              children: [
                !1 !== x
                  ? (0, y.jsx)(S, { ownerState: w, className: z.icon, children: x || C[L] || k[L] })
                  : null,
                (0, y.jsx)(I, { ownerState: w, className: z.message, children: c }),
                null != s
                  ? (0, y.jsx)(T, { ownerState: w, className: z.action, children: s })
                  : null,
                null == s && $
                  ? (0, y.jsx)(T, {
                      ownerState: w,
                      className: z.action,
                      children: (0, y.jsx)(
                        N,
                        (0, a.default)(
                          {
                            size: 'small',
                            'aria-label': m,
                            title: m,
                            color: 'inherit',
                            onClick: $,
                          },
                          F,
                          { children: (0, y.jsx)(V, (0, a.default)({ fontSize: 'small' }, W)) },
                        ),
                      ),
                    })
                  : null,
              ],
            },
          ),
        );
      });
    e.s(['Alert', 0, _], 98562);
  },
  24319,
  (e) => {
    'use strict';
    var t = e.i(8929);
    e.s(['MenuItem', () => t.default]);
  },
  92668,
  (e) => {
    'use strict';
    var t = e.i(37479),
      a = e.i(78090),
      r = e.i(24644),
      i = e.i(23786),
      l = e.i(24319),
      o = e.i(98562),
      s = e.i(85424),
      n = e.i(60552),
      d = e.i(21203),
      u = e.i(51215);
    e.s([
      'default',
      0,
      function () {
        let {
            saveButtonProps: e,
            refineCore: { formLoading: c },
            register: p,
            handleSubmit: m,
            formState: { errors: f },
          } = (0, s.useForm)(),
          h = (0, u.useRouter)(),
          { open: v } = (0, n.useNotification)(),
          { options: g } = (0, n.useSelect)({
            resource: 'routes',
            optionLabel: 'title',
            optionValue: 'id',
          }),
          y = async (e) => {
            try {
              let { error: t } = await d.supabaseClient.rpc('create_license_batch', {
                p_route_id: e.route_id,
                p_batch_name: e.batch_name,
                p_quantity: Number(e.quantity),
                p_price: Number(e.price),
                p_valid_days: Number(e.valid_days),
              });
              if (t)
                return void v?.({
                  type: 'error',
                  message: t.message,
                  description: 'Failed to create batch',
                });
              (v?.({ type: 'success', message: 'Batch created successfully' }),
                h.push('/license_batches'));
            } catch (t) {
              let e = t instanceof Error ? t.message : 'An unknown error occurred';
              v?.({ type: 'error', message: e, description: 'Failed to create batch' });
            }
          };
        return (0, t.jsx)(a.Create, {
          saveButtonProps: { ...e, onClick: m(y) },
          isLoading: c,
          children: (0, t.jsxs)(r.Box, {
            component: 'form',
            sx: { display: 'flex', flexDirection: 'column' },
            autoComplete: 'off',
            children: [
              (0, t.jsx)(i.TextField, {
                ...p('batch_name', { required: 'This field is required' }),
                error: !!f?.batch_name,
                helperText: f?.batch_name?.message,
                margin: 'normal',
                fullWidth: !0,
                InputLabelProps: { shrink: !0 },
                type: 'text',
                label: "Batch Name (e.g. 'Month 5 - Route A')",
                name: 'batch_name',
              }),
              (0, t.jsx)(i.TextField, {
                select: !0,
                ...p('route_id', { required: 'This field is required' }),
                error: !!f?.route_id,
                helperText: f?.route_id?.message,
                margin: 'normal',
                fullWidth: !0,
                InputLabelProps: { shrink: !0 },
                label: 'Route',
                name: 'route_id',
                defaultValue: '',
                children: g?.map((e) =>
                  (0, t.jsx)(l.MenuItem, { value: e.value, children: e.label }, e.value),
                ),
              }),
              (0, t.jsx)(i.TextField, {
                ...p('quantity', { required: 'This field is required', min: 1 }),
                error: !!f?.quantity,
                helperText: f?.quantity?.message,
                margin: 'normal',
                fullWidth: !0,
                InputLabelProps: { shrink: !0 },
                type: 'number',
                label: 'Quantity (Number of codes to generate)',
                name: 'quantity',
              }),
              (0, t.jsx)(i.TextField, {
                ...p('price', { required: 'This field is required', min: 0 }),
                error: !!f?.price,
                helperText: f?.price?.message,
                margin: 'normal',
                fullWidth: !0,
                InputLabelProps: { shrink: !0 },
                type: 'number',
                label: 'Price (per license code)',
                name: 'price',
              }),
              (0, t.jsx)(i.TextField, {
                ...p('valid_days', { required: 'This field is required', min: 1 }),
                error: !!f?.valid_days,
                helperText: f?.valid_days?.message,
                margin: 'normal',
                fullWidth: !0,
                InputLabelProps: { shrink: !0 },
                type: 'number',
                label: 'Valid Days (e.g. 30)',
                name: 'valid_days',
                defaultValue: 30,
              }),
              (0, t.jsx)(o.Alert, {
                severity: 'info',
                sx: { mt: 2 },
                children:
                  'Generating a batch will securely create the requested quantity of unique 8-character codes immediately.',
              }),
            ],
          }),
        });
      },
    ]);
  },
]);
