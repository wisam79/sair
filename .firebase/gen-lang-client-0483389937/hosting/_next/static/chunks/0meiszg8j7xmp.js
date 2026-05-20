(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([
  'object' == typeof document ? document.currentScript : void 0,
  41210,
  (e) => {
    'use strict';
    var t = e.i(37479),
      i = e.i(78090),
      n = e.i(72233),
      r = e.i(61129),
      d = e.i(80461);
    e.i(74507);
    var s = e.i(32576);
    e.s([
      'default',
      0,
      function () {
        let { t: e } = (0, s.useTranslation)(),
          { dataGridProps: a } = (0, i.useDataGrid)({ resource: 'institutions' }),
          o = r.default.useMemo(
            () => [
              {
                field: 'id',
                headerName: e('institutions.fields.id'),
                type: 'string',
                minWidth: 100,
                flex: 1,
              },
              {
                field: 'name',
                headerName: e('institutions.fields.name'),
                type: 'string',
                minWidth: 220,
                flex: 1,
              },
              {
                field: 'city',
                headerName: e('institutions.fields.city'),
                type: 'string',
                minWidth: 150,
                flex: 1,
                renderCell: function ({ value: e }) {
                  return e ?? '-';
                },
              },
              {
                field: 'createdAt',
                headerName: e('institutions.fields.createdAt'),
                minWidth: 160,
                flex: 1,
                renderCell: function ({ value: e }) {
                  return e ? new Date(e).toLocaleDateString() : '-';
                },
              },
              {
                field: 'actions',
                headerName: e('institutions.fields.actions'),
                sortable: !1,
                renderCell: function ({ row: e }) {
                  return (0, t.jsxs)(d.Stack, {
                    direction: 'row',
                    spacing: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    children: [
                      (0, t.jsx)(i.EditButton, { hideText: !0, recordItemId: e.id }),
                      (0, t.jsx)(i.ShowButton, { hideText: !0, recordItemId: e.id }),
                      (0, t.jsx)(i.DeleteButton, { hideText: !0, recordItemId: e.id }),
                    ],
                  });
                },
                align: 'center',
                headerAlign: 'center',
                minWidth: 150,
              },
            ],
            [],
          );
        return (0, t.jsx)(i.List, {
          headerButtons: (0, t.jsx)(i.CreateButton, {}),
          children: (0, t.jsx)(n.DataGrid, { ...a, columns: o, autoHeight: !0 }),
        });
      },
    ]);
  },
]);
