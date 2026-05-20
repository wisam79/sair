(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([
  'object' == typeof document ? document.currentScript : void 0,
  84950,
  (e) => {
    'use strict';
    var i = e.i(37479),
      t = e.i(60552),
      r = e.i(78090),
      d = e.i(72233),
      a = e.i(61129),
      n = e.i(80461);
    e.i(74507);
    var s = e.i(32576);
    e.s([
      'default',
      0,
      function () {
        let { t: e } = (0, s.useTranslation)(),
          { dataGridProps: l } = (0, r.useDataGrid)({ resource: 'routes' }),
          { data: o, isLoading: u } = (0, t.useMany)({
            resource: 'drivers',
            ids: l?.rows?.map((e) => e?.driverId).filter(Boolean) ?? [],
            queryOptions: { enabled: !!l?.rows },
          }),
          f = a.default.useMemo(
            () => [
              {
                field: 'id',
                headerName: e('routes.fields.id'),
                type: 'string',
                minWidth: 100,
                flex: 1,
              },
              {
                field: 'title',
                headerName: e('routes.fields.title'),
                type: 'string',
                minWidth: 150,
                flex: 1,
              },
              {
                field: 'driverId',
                headerName: e('routes.fields.driver'),
                type: 'string',
                minWidth: 200,
                flex: 1,
                renderCell: function ({ value: t }) {
                  if (u) return (0, i.jsx)(i.Fragment, { children: e('loading') });
                  let r = o?.data?.find((e) => e.id === t);
                  return r ? (r.fullName ?? r.licenseNumber ?? t) : t;
                },
              },
              {
                field: 'startLocation',
                headerName: e('routes.fields.startLocation'),
                type: 'string',
                minWidth: 150,
                flex: 1,
              },
              {
                field: 'endLocation',
                headerName: e('routes.fields.endLocation'),
                type: 'string',
                minWidth: 150,
                flex: 1,
              },
              {
                field: 'price',
                headerName: e('routes.fields.price'),
                type: 'number',
                minWidth: 100,
                flex: 1,
              },
              {
                field: 'capacity',
                headerName: e('routes.fields.capacity'),
                type: 'number',
                minWidth: 100,
                flex: 1,
              },
              {
                field: 'availableSeats',
                headerName: e('routes.fields.availableSeats'),
                type: 'number',
                minWidth: 100,
                flex: 1,
              },
              {
                field: 'isActive',
                headerName: e('routes.fields.active'),
                type: 'boolean',
                minWidth: 100,
                flex: 1,
              },
              {
                field: 'actions',
                headerName: e('routes.fields.actions'),
                sortable: !1,
                renderCell: function ({ row: e }) {
                  return (0, i.jsxs)(n.Stack, {
                    direction: 'row',
                    spacing: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    children: [
                      (0, i.jsx)(r.EditButton, { hideText: !0, recordItemId: e.id }),
                      (0, i.jsx)(r.ShowButton, { hideText: !0, recordItemId: e.id }),
                    ],
                  });
                },
                align: 'center',
                headerAlign: 'center',
                minWidth: 120,
              },
            ],
            [o?.data, u],
          );
        return (0, i.jsx)(r.List, {
          children: (0, i.jsx)(d.DataGrid, { ...l, columns: f, autoHeight: !0 }),
        });
      },
    ]);
  },
]);
