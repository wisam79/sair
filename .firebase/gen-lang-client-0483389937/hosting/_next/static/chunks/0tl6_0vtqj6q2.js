(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([
  'object' == typeof document ? document.currentScript : void 0,
  433,
  (e) => {
    'use strict';
    var t = e.i(37479),
      i = e.i(78090),
      o = e.i(20412),
      a = e.i(80461),
      n = e.i(60552);
    e.s([
      'default',
      0,
      function () {
        let { queryResult: e } = (0, n.useShow)(),
          { data: d, isLoading: r } = e,
          l = d?.data,
          { data: s, isLoading: h } = (0, n.useOne)({
            resource: 'drivers',
            id: l?.driverId || '',
            queryOptions: { enabled: !!l },
          });
        return (0, t.jsx)(i.Show, {
          isLoading: r,
          children: (0, t.jsxs)(a.Stack, {
            gap: 1,
            children: [
              (0, t.jsx)(o.Typography, { variant: 'body1', fontWeight: 'bold', children: 'ID' }),
              (0, t.jsx)(i.TextFieldComponent, { value: l?.id }),
              (0, t.jsx)(o.Typography, { variant: 'body1', fontWeight: 'bold', children: 'Title' }),
              (0, t.jsx)(i.TextFieldComponent, { value: l?.title }),
              (0, t.jsx)(o.Typography, {
                variant: 'body1',
                fontWeight: 'bold',
                children: 'Driver',
              }),
              h
                ? (0, t.jsx)(t.Fragment, { children: 'Loading...' })
                : (0, t.jsx)(i.TextFieldComponent, {
                    value: s?.data?.licenseNumber || l?.driverId,
                  }),
              (0, t.jsx)(o.Typography, {
                variant: 'body1',
                fontWeight: 'bold',
                children: 'Start Location',
              }),
              (0, t.jsx)(i.TextFieldComponent, { value: l?.startLocation }),
              (0, t.jsx)(o.Typography, {
                variant: 'body1',
                fontWeight: 'bold',
                children: 'End Location',
              }),
              (0, t.jsx)(i.TextFieldComponent, { value: l?.endLocation }),
              (0, t.jsx)(o.Typography, { variant: 'body1', fontWeight: 'bold', children: 'Price' }),
              (0, t.jsx)(i.TextFieldComponent, { value: l?.price }),
              (0, t.jsx)(o.Typography, {
                variant: 'body1',
                fontWeight: 'bold',
                children: 'Capacity',
              }),
              (0, t.jsx)(i.TextFieldComponent, { value: l?.capacity }),
              (0, t.jsx)(o.Typography, {
                variant: 'body1',
                fontWeight: 'bold',
                children: 'Available Seats',
              }),
              (0, t.jsx)(i.TextFieldComponent, { value: l?.availableSeats }),
              (0, t.jsx)(o.Typography, {
                variant: 'body1',
                fontWeight: 'bold',
                children: 'Is Active',
              }),
              (0, t.jsx)(i.TextFieldComponent, { value: l?.isActive ? 'Yes' : 'No' }),
            ],
          }),
        });
      },
    ]);
  },
]);
