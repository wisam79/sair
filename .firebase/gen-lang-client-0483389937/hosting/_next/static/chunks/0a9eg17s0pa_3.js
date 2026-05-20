(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([
  'object' == typeof document ? document.currentScript : void 0,
  45354,
  (e) => {
    'use strict';
    var i = e.i(37479),
      t = e.i(78090),
      a = e.i(72233),
      d = e.i(61129),
      r = e.i(60552);
    e.i(74507);
    var l = e.i(32576);
    e.s([
      'default',
      0,
      function () {
        let { t: e } = (0, l.useTranslation)(),
          { dataGridProps: s } = (0, t.useDataGrid)({
            resource: 'license_batches',
            sorters: { initial: [{ field: 'created_at', order: 'desc' }] },
          }),
          { data: n, isLoading: c } = (0, r.useMany)({
            resource: 'routes',
            ids: s?.rows?.map((e) => e?.routeId).filter(Boolean) ?? [],
            queryOptions: { enabled: !!s?.rows },
          }),
          u = d.default.useMemo(
            () => [
              {
                field: 'batchName',
                headerName: e('license_batches.fields.name'),
                type: 'string',
                minWidth: 150,
                flex: 1,
              },
              {
                field: 'routeId',
                headerName: e('license_batches.fields.route'),
                type: 'string',
                minWidth: 200,
                flex: 1,
                renderCell: function ({ value: i }) {
                  if (c) return e('loading');
                  let t = n?.data?.find((e) => e.id === i);
                  return t ? t.title : i;
                },
              },
              {
                field: 'quantity',
                headerName: e('license_batches.fields.quantity'),
                type: 'number',
                minWidth: 100,
                flex: 1,
              },
              {
                field: 'price',
                headerName: e('license_batches.fields.price'),
                type: 'number',
                minWidth: 100,
                flex: 1,
              },
              {
                field: 'validDays',
                headerName: e('license_batches.fields.validDays'),
                type: 'number',
                minWidth: 100,
                flex: 1,
              },
              {
                field: 'createdAt',
                headerName: e('license_batches.fields.createdAt'),
                minWidth: 200,
                flex: 1,
                renderCell: function ({ value: e }) {
                  return (0, i.jsx)(t.DateField, { value: e });
                },
              },
            ],
            [n?.data, c, e],
          );
        return (0, i.jsx)(t.List, {
          children: (0, i.jsx)(a.DataGrid, { ...s, columns: u, autoHeight: !0 }),
        });
      },
    ]);
  },
]);
