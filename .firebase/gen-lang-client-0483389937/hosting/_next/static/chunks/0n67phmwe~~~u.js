(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([
  'object' == typeof document ? document.currentScript : void 0,
  60434,
  (e) => {
    'use strict';
    var i = e.i(37479),
      o = e.i(60552),
      a = e.i(78090),
      t = e.i(20412),
      d = e.i(80461);
    e.s([
      'default',
      0,
      function () {
        let { queryResult: e } = (0, o.useShow)(),
          { data: l, isLoading: n } = e,
          r = l?.data,
          { data: s, isLoading: h } = (0, o.useOne)({
            resource: 'profiles',
            id: r?.userId || '',
            queryOptions: { enabled: !!r?.userId },
          });
        return (0, i.jsx)(a.Show, {
          isLoading: n,
          children: (0, i.jsxs)(d.Stack, {
            gap: 1,
            children: [
              (0, i.jsx)(t.Typography, { variant: 'body1', fontWeight: 'bold', children: 'ID' }),
              (0, i.jsx)(a.TextFieldComponent, { value: r?.id }),
              (0, i.jsx)(t.Typography, {
                variant: 'body1',
                fontWeight: 'bold',
                children: 'User Profile',
              }),
              h
                ? (0, i.jsx)(t.Typography, { variant: 'body2', children: 'Loading...' })
                : (0, i.jsx)(a.TextFieldComponent, { value: s?.data?.fullName || r?.userId }),
              (0, i.jsx)(t.Typography, {
                variant: 'body1',
                fontWeight: 'bold',
                children: 'License Number',
              }),
              (0, i.jsx)(a.TextFieldComponent, { value: r?.licenseNumber }),
              (0, i.jsx)(t.Typography, {
                variant: 'body1',
                fontWeight: 'bold',
                children: 'Vehicle Model',
              }),
              (0, i.jsx)(a.TextFieldComponent, { value: r?.vehicleModel }),
              (0, i.jsx)(t.Typography, {
                variant: 'body1',
                fontWeight: 'bold',
                children: 'Vehicle Plate',
              }),
              (0, i.jsx)(a.TextFieldComponent, { value: r?.vehiclePlate }),
              (0, i.jsx)(t.Typography, {
                variant: 'body1',
                fontWeight: 'bold',
                children: 'Capacity',
              }),
              (0, i.jsx)(a.NumberField, { value: r?.capacity ?? '' }),
              (0, i.jsx)(t.Typography, {
                variant: 'body1',
                fontWeight: 'bold',
                children: 'Verified',
              }),
              (0, i.jsx)(a.BooleanField, { value: !!s?.data?.isVerified }),
            ],
          }),
        });
      },
    ]);
  },
]);
