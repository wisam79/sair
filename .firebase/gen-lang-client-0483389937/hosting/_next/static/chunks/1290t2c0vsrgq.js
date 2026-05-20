(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([
  'object' == typeof document ? document.currentScript : void 0,
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
    var l = e.i(91502);
    e.s(['InputLabel', () => l.default], 26132);
  },
  8462,
  (e) => {
    'use strict';
    var t = e.i(15845);
    e.s(['Select', () => t.default]);
  },
  91703,
  (e) => {
    'use strict';
    var t = e.i(37479),
      l = e.i(78090),
      r = e.i(72233);
    e.i(64775);
    var i = e.i(98457),
      a = e.i(84570),
      s = e.i(61129),
      o = e.i(65263),
      n = e.i(90517),
      c = e.i(44504),
      u = e.i(7677),
      d = e.i(98850),
      p = e.i(16269);
    let m = ['className', 'children'],
      f = (0, c.styled)('div', {
        name: 'MuiDataGrid',
        slot: 'ToolbarContainer',
        overridesResolver: (e, t) => t.toolbarContainer,
      })(({ theme: e }) => ({
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        padding: e.spacing(0.5, 0.5, 0),
      })),
      b = s.forwardRef(function (e, l) {
        let { className: r, children: s } = e,
          o = (0, a.default)(e, m),
          c = (0, p.useGridRootProps)(),
          b = ((e) => {
            let { classes: t } = e;
            return (0, u.unstable_composeClasses)(
              { root: ['toolbarContainer'] },
              d.getDataGridUtilityClass,
              t,
            );
          })(c);
        return s
          ? (0, t.jsx)(
              f,
              (0, i.default)({ ref: l, className: (0, n.default)(r, b.root), ownerState: c }, o, {
                children: s,
              }),
            )
          : null;
      });
    var h = e.i(24531),
      x = e.i(41386),
      v = e.i(29780),
      g = e.i(21874);
    let y = ['onClick'],
      C = s.forwardRef(function (e, l) {
        var r;
        let { onClick: s } = e,
          o = (0, a.default)(e, y),
          n = (0, g.useGridApiContext)(),
          c = (0, p.useGridRootProps)(),
          { open: u, openedPanelValue: d } = (0, h.useGridSelector)(
            n,
            x.gridPreferencePanelStateSelector,
          );
        return c.disableColumnSelector
          ? null
          : (0, t.jsx)(
              c.components.BaseButton,
              (0, i.default)(
                {
                  ref: l,
                  size: 'small',
                  'aria-label': n.current.getLocaleText('toolbarColumnsLabel'),
                  startIcon: (0, t.jsx)(c.components.ColumnSelectorIcon, {}),
                },
                o,
                {
                  onClick: (e) => {
                    (u && d === v.GridPreferencePanelsValue.columns
                      ? n.current.hidePreferences()
                      : n.current.showPreferences(v.GridPreferencePanelsValue.columns),
                      null == s || s(e));
                  },
                },
                null == (r = c.componentsProps) ? void 0 : r.baseButton,
                { children: n.current.getLocaleText('toolbarColumns') },
              ),
            );
      });
    var j = e.i(7466),
      F = e.i(70775),
      S = e.i(99353),
      T = e.i(8929),
      k = e.i(44511),
      D = e.i(2819),
      P = e.i(25105),
      G = e.i(42412),
      L = e.i(24058);
    let I = ['onClick'],
      w = s.forwardRef(function (e, l) {
        var r;
        let { onClick: o } = e,
          n = (0, a.default)(e, I),
          c = (0, g.useGridApiContext)(),
          u = (0, p.useGridRootProps)(),
          m = (0, h.useGridSelector)(c, D.gridDensityValueSelector),
          f = (0, j.unstable_useId)(),
          b = (0, j.unstable_useId)(),
          [x, v] = s.useState(!1),
          y = s.useRef(null),
          C = (0, F.useForkRef)(l, y),
          w = [
            {
              icon: (0, t.jsx)(u.components.DensityCompactIcon, {}),
              label: c.current.getLocaleText('toolbarDensityCompact'),
              value: P.GridDensityTypes.Compact,
            },
            {
              icon: (0, t.jsx)(u.components.DensityStandardIcon, {}),
              label: c.current.getLocaleText('toolbarDensityStandard'),
              value: P.GridDensityTypes.Standard,
            },
            {
              icon: (0, t.jsx)(u.components.DensityComfortableIcon, {}),
              label: c.current.getLocaleText('toolbarDensityComfortable'),
              value: P.GridDensityTypes.Comfortable,
            },
          ],
          M = s.useMemo(() => {
            switch (m) {
              case P.GridDensityTypes.Compact:
                return (0, t.jsx)(u.components.DensityCompactIcon, {});
              case P.GridDensityTypes.Comfortable:
                return (0, t.jsx)(u.components.DensityComfortableIcon, {});
              default:
                return (0, t.jsx)(u.components.DensityStandardIcon, {});
            }
          }, [m, u]);
        if (u.disableDensitySelector) return null;
        let R = w.map((e, l) =>
          (0, t.jsxs)(
            T.default,
            {
              onClick: () => {
                var t;
                return ((t = e.value), void (c.current.setDensity(t), v(!1)));
              },
              selected: e.value === m,
              children: [(0, t.jsx)(k.default, { children: e.icon }), e.label],
            },
            l,
          ),
        );
        return (0, t.jsxs)(s.Fragment, {
          children: [
            (0, t.jsx)(
              u.components.BaseButton,
              (0, i.default)(
                {
                  ref: C,
                  size: 'small',
                  startIcon: M,
                  'aria-label': c.current.getLocaleText('toolbarDensityLabel'),
                  'aria-expanded': x ? 'true' : void 0,
                  'aria-haspopup': 'menu',
                  'aria-controls': b,
                  id: f,
                },
                n,
                {
                  onClick: (e) => {
                    (v((e) => !e), null == o || o(e));
                  },
                },
                null == (r = u.componentsProps) ? void 0 : r.baseButton,
                { children: c.current.getLocaleText('toolbarDensity') },
              ),
            ),
            (0, t.jsx)(L.GridMenu, {
              open: x,
              target: y.current,
              onClickAway: (e) => {
                var t;
                y.current === e.target ||
                  (null != (t = y.current) && t.contains(e.target)) ||
                  v(!1);
              },
              position: 'bottom-start',
              children: (0, t.jsx)(S.default, {
                id: b,
                className: d.gridClasses.menuList,
                'aria-labelledby': f,
                onKeyDown: (e) => {
                  ((0, G.isTabKey)(e.key) && e.preventDefault(),
                    (0, G.isHideMenuKey)(e.key) && v(!1));
                },
                autoFocusItem: x,
                children: R,
              }),
            }),
          ],
        });
      });
    var M = e.i(98964),
      R = e.i(77645),
      B = e.i(30195),
      A = e.i(52831);
    let N = ['componentsProps'],
      O = (0, c.styled)('ul', {
        name: 'MuiDataGrid',
        slot: 'ToolbarFilterList',
        overridesResolver: (e, t) => t.toolbarFilterList,
      })(({ theme: e }) => ({ margin: e.spacing(1, 1, 0.5), padding: e.spacing(0, 1) })),
      _ = s.forwardRef(function (e, l) {
        var r, o;
        let { componentsProps: n = {} } = e,
          c = (0, a.default)(e, N),
          m = n.button || {},
          f = (0, g.useGridApiContext)(),
          b = (0, p.useGridRootProps)(),
          y = (0, h.useGridSelector)(f, A.gridFilterActiveItemsSelector),
          C = (0, h.useGridSelector)(f, B.gridColumnLookupSelector),
          j = (0, h.useGridSelector)(f, x.gridPreferencePanelStateSelector),
          F = ((e) => {
            let { classes: t } = e;
            return (0, u.unstable_composeClasses)(
              { root: ['toolbarFilterList'] },
              d.getDataGridUtilityClass,
              t,
            );
          })(b),
          S = s.useMemo(
            () =>
              j.open
                ? f.current.getLocaleText('toolbarFiltersTooltipHide')
                : 0 === y.length
                  ? f.current.getLocaleText('toolbarFiltersTooltipShow')
                  : (0, t.jsxs)('div', {
                      children: [
                        f.current.getLocaleText('toolbarFiltersTooltipActive')(y.length),
                        (0, t.jsx)(O, {
                          className: F.root,
                          ownerState: b,
                          children: y.map((e, l) =>
                            (0, i.default)(
                              {},
                              C[e.columnField] &&
                                (0, t.jsx)(
                                  'li',
                                  {
                                    children: `${C[e.columnField].headerName || e.columnField}
                  ${C[e.columnField].filterOperators.find((t) => t.value === e.operatorValue).label || f.current.getLocaleText(`filterOperator${(0, R.capitalize)(e.operatorValue)}`).toString()}
                  ${
                    e.value
                      ? ((e) => {
                          let { getValueAsString: t } = C[e.columnField].filterOperators.find(
                            (t) => t.value === e.operatorValue,
                          );
                          return t ? t(e.value) : e.value;
                        })(e)
                      : ''
                  }`,
                                  },
                                  l,
                                ),
                            ),
                          ),
                        }),
                      ],
                    }),
            [f, b, j.open, y, C, F],
          );
        return b.disableColumnFilter
          ? null
          : (0, t.jsx)(
              b.components.BaseTooltip,
              (0, i.default)(
                { title: S, enterDelay: 1e3 },
                c,
                null == (r = b.componentsProps) ? void 0 : r.baseTooltip,
                {
                  children: (0, t.jsx)(
                    b.components.BaseButton,
                    (0, i.default)(
                      {
                        ref: l,
                        size: 'small',
                        'aria-label': f.current.getLocaleText('toolbarFiltersLabel'),
                        startIcon: (0, t.jsx)(M.default, {
                          badgeContent: y.length,
                          color: 'primary',
                          children: (0, t.jsx)(b.components.OpenFilterButtonIcon, {}),
                        }),
                      },
                      m,
                      {
                        onClick: (e) => {
                          var t;
                          let { open: l, openedPanelValue: r } = j;
                          (l && r === v.GridPreferencePanelsValue.filters
                            ? f.current.hideFilterPanel()
                            : f.current.showFilterPanel(),
                            null == (t = m.onClick) || t.call(m, e));
                        },
                      },
                      null == (o = b.componentsProps) ? void 0 : o.baseButton,
                      { children: f.current.getLocaleText('toolbarFilters') },
                    ),
                  ),
                },
              ),
            );
      });
    var z = e.i(54867),
      Q = e.i(80705),
      W = e.i(37473),
      V = e.i(48621),
      q = e.i(51069);
    let K = ['quickFilterParser', 'quickFilterFormatter', 'debounceMs'],
      U = (0, c.styled)(Q.default, {
        name: 'MuiDataGrid',
        slot: 'ToolbarQuickFilter',
        overridesResolver: (e, t) => t.toolbarQuickFilter,
      })(({ theme: e }) => ({
        width: 'auto',
        paddingBottom: e.spacing(0.5),
        '& input': { marginLeft: e.spacing(0.5) },
        '& .MuiInput-underline:before': { borderBottom: `1px solid ${e.palette.divider}` },
        [`& input[type=search]::-ms-clear,
& input[type=search]::-ms-reveal`]: { display: 'none', width: 0, height: 0 },
        [`& input[type="search"]::-webkit-search-decoration,
  & input[type="search"]::-webkit-search-cancel-button,
  & input[type="search"]::-webkit-search-results-button,
  & input[type="search"]::-webkit-search-results-decoration`]: { display: 'none' },
      })),
      $ = (e) => e.split(' ').filter((e) => '' !== e),
      E = (e) => e.join(' ');
    function H(e) {
      var l;
      let { quickFilterParser: r = $, quickFilterFormatter: o = E, debounceMs: n = 500 } = e,
        c = (0, a.default)(e, K),
        u = (0, g.useGridApiContext)(),
        d = (0, p.useGridRootProps)(),
        m = (0, h.useGridSelector)(u, A.gridQuickFilterValuesSelector),
        [f, b] = s.useState(() => o(null != m ? m : [])),
        [x, v] = s.useState(m);
      s.useEffect(() => {
        (0, q.isDeepEqual)(x, m) ||
          (v(m), b((e) => ((0, q.isDeepEqual)(r(e), m) ? e : o(null != m ? m : []))));
      }, [x, m, o, r]);
      let y = s.useCallback(
          (e) => {
            u.current.setQuickFilterValues(r(e));
          },
          [u, r],
        ),
        C = s.useMemo(() => (0, V.debounce)(y, n), [y, n]),
        j = s.useCallback(
          (e) => {
            let t = e.target.value;
            (b(t), C(t));
          },
          [C],
        ),
        F = s.useCallback(() => {
          (b(''), y(''));
        }, [y]);
      return (0, t.jsx)(
        U,
        (0, i.default)(
          {
            as: d.components.BaseTextField,
            ownerState: d,
            variant: 'standard',
            value: f,
            onChange: j,
            placeholder: u.current.getLocaleText('toolbarQuickFilterPlaceholder'),
            'aria-label': u.current.getLocaleText('toolbarQuickFilterLabel'),
            type: 'search',
            InputProps: {
              startAdornment: (0, t.jsx)(d.components.QuickFilterIcon, { fontSize: 'small' }),
              endAdornment: (0, t.jsx)(W.default, {
                'aria-label': u.current.getLocaleText('toolbarQuickFilterDeleteIconLabel'),
                size: 'small',
                sx: { visibility: f ? 'visible' : 'hidden' },
                onClick: F,
                children: (0, t.jsx)(d.components.QuickFilterClearIcon, { fontSize: 'small' }),
              }),
            },
          },
          c,
          null == (l = d.componentsProps) ? void 0 : l.baseTextField,
        ),
      );
    }
    let J = [
        'className',
        'csvOptions',
        'printOptions',
        'excelOptions',
        'showQuickFilter',
        'quickFilterProps',
      ],
      X = s.forwardRef(function (e, l) {
        let {
            csvOptions: r,
            printOptions: s,
            excelOptions: n,
            showQuickFilter: c = !1,
            quickFilterProps: u = {},
          } = e,
          d = (0, a.default)(e, J),
          m = (0, p.useGridRootProps)();
        return m.disableColumnFilter && m.disableColumnSelector && m.disableDensitySelector && !c
          ? null
          : (0, t.jsxs)(
              b,
              (0, i.default)({ ref: l }, d, {
                children: [
                  (0, t.jsx)(C, {}),
                  (0, t.jsx)(_, {}),
                  (0, t.jsx)(w, {}),
                  (0, t.jsx)(z.GridToolbarExport, {
                    csvOptions: r,
                    printOptions: s,
                    excelOptions: n,
                  }),
                  (0, t.jsx)(o.default, { sx: { flex: 1 } }),
                  c && (0, t.jsx)(H, (0, i.default)({}, u)),
                ],
              }),
            );
      });
    var Y = e.i(43737),
      Z = e.i(24644),
      ee = e.i(23441),
      et = e.i(26132),
      el = e.i(8462),
      er = e.i(24319),
      ei = e.i(60552);
    e.i(74507);
    var ea = e.i(32576);
    e.s(
      [
        'default',
        0,
        function () {
          let { t: e } = (0, ea.useTranslation)(),
            [i, a] = (0, s.useState)('all'),
            [o, n] = (0, s.useState)('all'),
            { data: c } = (0, ei.useList)({
              resource: 'license_batches',
              pagination: { pageSize: 25 },
              sorters: [{ field: 'created_at', order: 'desc' }],
            }),
            u = [];
          ('all' !== i && u.push({ field: 'status', operator: 'eq', value: i }),
            'all' !== o && u.push({ field: 'batch_id', operator: 'eq', value: o }));
          let { dataGridProps: d } = (0, l.useDataGrid)({
              resource: 'licenses',
              sorters: { initial: [{ field: 'created_at', order: 'desc' }] },
              filters: { permanent: u },
            }),
            p = s.default.useMemo(
              () => [
                {
                  field: 'code',
                  headerName: e('licenses.fields.code'),
                  type: 'string',
                  minWidth: 150,
                  flex: 1,
                  renderCell: ({ value: e }) =>
                    (0, t.jsx)('span', {
                      style: { fontFamily: 'monospace', fontWeight: 'bold', letterSpacing: 2 },
                      children: e,
                    }),
                },
                {
                  field: 'status',
                  headerName: e('licenses.fields.status'),
                  type: 'string',
                  minWidth: 120,
                  flex: 0.7,
                  renderCell: function ({ value: e }) {
                    return (0, t.jsx)(Y.Chip, {
                      size: 'small',
                      label: e,
                      color:
                        { active: 'success', used: 'default', revoked: 'error' }[e] ?? 'default',
                    });
                  },
                },
                {
                  field: 'validDays',
                  headerName: e('licenses.fields.validDays'),
                  type: 'number',
                  minWidth: 100,
                  flex: 0.6,
                },
                {
                  field: 'usedAt',
                  headerName: e('licenses.fields.usedAt'),
                  minWidth: 180,
                  flex: 1,
                  renderCell: function ({ value: e }) {
                    return e ? (0, t.jsx)(l.DateField, { value: e }) : '-';
                  },
                },
                {
                  field: 'createdAt',
                  headerName: e('licenses.fields.createdAt'),
                  minWidth: 180,
                  flex: 1,
                  renderCell: function ({ value: e }) {
                    return (0, t.jsx)(l.DateField, { value: e });
                  },
                },
              ],
              [e],
            );
          return (0, t.jsxs)(l.List, {
            children: [
              (0, t.jsxs)(Z.Box, {
                sx: { display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' },
                children: [
                  (0, t.jsxs)(ee.FormControl, {
                    size: 'small',
                    sx: { minWidth: 150 },
                    children: [
                      (0, t.jsx)(et.InputLabel, { children: e('licenses.fields.status') }),
                      (0, t.jsxs)(el.Select, {
                        value: i,
                        label: e('licenses.fields.status'),
                        onChange: (e) => a(e.target.value),
                        children: [
                          (0, t.jsx)(er.MenuItem, {
                            value: 'all',
                            children: e('trips.all_statuses'),
                          }),
                          (0, t.jsx)(er.MenuItem, { value: 'active', children: 'Active' }),
                          (0, t.jsx)(er.MenuItem, { value: 'used', children: 'Used' }),
                          (0, t.jsx)(er.MenuItem, { value: 'revoked', children: 'Revoked' }),
                        ],
                      }),
                    ],
                  }),
                  (0, t.jsxs)(ee.FormControl, {
                    size: 'small',
                    sx: { minWidth: 200 },
                    children: [
                      (0, t.jsx)(et.InputLabel, { children: e('license_batches.titles.show') }),
                      (0, t.jsxs)(el.Select, {
                        value: o,
                        label: e('license_batches.titles.show'),
                        onChange: (e) => n(e.target.value),
                        children: [
                          (0, t.jsx)(er.MenuItem, { value: 'all', children: 'All Batches' }),
                          c?.data?.map((e) =>
                            (0, t.jsx)(
                              er.MenuItem,
                              {
                                value: e.id,
                                children: e.batchName ?? e.batch_name ?? e.id.slice(0, 8),
                              },
                              e.id,
                            ),
                          ),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              (0, t.jsx)(r.DataGrid, {
                ...d,
                columns: p,
                autoHeight: !0,
                components: { Toolbar: X },
                componentsProps: {
                  toolbar: { showQuickFilter: !0, quickFilterProps: { debounceMs: 300 } },
                },
              }),
            ],
          });
        },
      ],
      91703,
    );
  },
]);
