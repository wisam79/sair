(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([
  'object' == typeof document ? document.currentScript : void 0,
  64164,
  (e) => {
    'use strict';
    var i = e.i(37479),
      t = e.i(78090),
      r = e.i(72233),
      l = e.i(61129),
      n = e.i(43737),
      d = e.i(80461);
    e.i(74507);
    var s = e.i(32576);
    let a = { admin: 'error', student: 'primary', driver: 'success' };
    e.s([
      'default',
      0,
      function () {
        let { t: e } = (0, s.useTranslation)(),
          { dataGridProps: o } = (0, t.useDataGrid)({ resource: 'profiles' }),
          f = l.default.useMemo(
            () => [
              {
                field: 'id',
                headerName: e('profiles.fields.id'),
                type: 'string',
                minWidth: 100,
                flex: 1,
              },
              {
                field: 'fullName',
                headerName: e('profiles.fields.fullName'),
                type: 'string',
                minWidth: 180,
                flex: 1,
              },
              {
                field: 'phone',
                headerName: e('profiles.fields.phone'),
                type: 'string',
                minWidth: 150,
                flex: 1,
              },
              {
                field: 'role',
                headerName: e('profiles.fields.role'),
                type: 'string',
                minWidth: 120,
                flex: 0.5,
                renderCell: function ({ value: t }) {
                  return (0, i.jsx)(n.Chip, {
                    label: e(t),
                    color: a[t] || 'default',
                    size: 'small',
                  });
                },
              },
              {
                field: 'createdAt',
                headerName: e('profiles.fields.joined'),
                minWidth: 180,
                flex: 1,
                renderCell: function ({ value: e }) {
                  return e ? new Date(e).toLocaleDateString() : '-';
                },
              },
              {
                field: 'actions',
                headerName: e('profiles.fields.actions'),
                sortable: !1,
                renderCell: function ({ row: e }) {
                  return (0, i.jsx)(d.Stack, {
                    direction: 'row',
                    spacing: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    children: (0, i.jsx)(t.ShowButton, { hideText: !0, recordItemId: e.id }),
                  });
                },
                align: 'center',
                headerAlign: 'center',
                minWidth: 80,
              },
            ],
            [],
          );
        return (0, i.jsx)(t.List, {
          children: (0, i.jsx)(r.DataGrid, { ...o, columns: f, autoHeight: !0 }),
        });
      },
    ]);
  },
]);
