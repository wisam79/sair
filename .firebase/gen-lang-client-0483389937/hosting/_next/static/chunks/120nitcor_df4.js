(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([
  'object' == typeof document ? document.currentScript : void 0,
  49945,
  (e) => {
    'use strict';
    var t = e.i(37479),
      i = e.i(60552),
      o = e.i(78090),
      a = e.i(80461),
      n = e.i(20412);
    e.s([
      'default',
      0,
      function () {
        let { queryResult: e } = (0, i.useShow)(),
          { data: d, isLoading: l } = e,
          r = d?.data;
        return (0, t.jsx)(o.Show, {
          isLoading: l,
          children: (0, t.jsxs)(a.Stack, {
            gap: 1,
            children: [
              (0, t.jsx)(n.Typography, { variant: 'body1', fontWeight: 'bold', children: 'ID' }),
              (0, t.jsx)(o.TextFieldComponent, { value: r?.id }),
              (0, t.jsx)(n.Typography, { variant: 'body1', fontWeight: 'bold', children: 'Name' }),
              (0, t.jsx)(o.TextFieldComponent, { value: r?.name }),
              (0, t.jsx)(n.Typography, { variant: 'body1', fontWeight: 'bold', children: 'City' }),
              (0, t.jsx)(o.TextFieldComponent, { value: r?.city ?? '-' }),
              (0, t.jsx)(n.Typography, {
                variant: 'body1',
                fontWeight: 'bold',
                children: 'Created At',
              }),
              (0, t.jsx)(o.DateField, { value: r?.createdAt }),
            ],
          }),
        });
      },
    ]);
  },
]);
