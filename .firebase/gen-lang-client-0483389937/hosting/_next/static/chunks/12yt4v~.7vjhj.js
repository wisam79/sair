(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([
  'object' == typeof document ? document.currentScript : void 0,
  61291,
  (e) => {
    'use strict';
    var a = e.i(37479),
      r = e.i(78090),
      t = e.i(24644),
      i = e.i(23786),
      l = e.i(20982),
      s = e.i(81352),
      n = e.i(85424),
      o = e.i(15291);
    e.s([
      'default',
      0,
      function () {
        let {
            saveButtonProps: e,
            refineCore: { queryResult: d, formLoading: c },
            register: u,
            control: p,
            watch: m,
            formState: { errors: b },
          } = (0, n.useForm)(),
          h = d?.data?.data,
          x = h?.driverId;
        return (0, a.jsx)(r.Edit, {
          isLoading: c,
          saveButtonProps: e,
          children: (0, a.jsxs)(t.Box, {
            component: 'form',
            sx: { display: 'flex', flexDirection: 'column' },
            autoComplete: 'off',
            children: [
              (0, a.jsx)(i.TextField, {
                value: x || '',
                margin: 'normal',
                fullWidth: !0,
                InputLabelProps: { shrink: !0 },
                label: 'Driver ID',
                disabled: !0,
                helperText: 'Driver cannot be changed after creation',
              }),
              (0, a.jsx)(i.TextField, {
                ...u('title', { required: 'This field is required' }),
                error: !!b?.title,
                helperText: b?.title?.message,
                margin: 'normal',
                fullWidth: !0,
                InputLabelProps: { shrink: !0 },
                type: 'text',
                label: 'Title',
                name: 'title',
              }),
              (0, a.jsx)(i.TextField, {
                ...u('startLocation', { required: 'This field is required' }),
                error: !!b?.startLocation,
                helperText: b?.startLocation?.message,
                margin: 'normal',
                fullWidth: !0,
                InputLabelProps: { shrink: !0 },
                type: 'text',
                label: 'Start Location',
                name: 'startLocation',
              }),
              (0, a.jsx)(i.TextField, {
                ...u('endLocation', { required: 'This field is required' }),
                error: !!b?.endLocation,
                helperText: b?.endLocation?.message,
                margin: 'normal',
                fullWidth: !0,
                InputLabelProps: { shrink: !0 },
                type: 'text',
                label: 'End Location',
                name: 'endLocation',
              }),
              (0, a.jsx)(i.TextField, {
                ...u('price', {
                  required: 'This field is required',
                  valueAsNumber: !0,
                  validate: (e) => e > 0 || 'Price must be greater than 0',
                }),
                error: !!b?.price,
                helperText: b?.price?.message,
                margin: 'normal',
                fullWidth: !0,
                InputLabelProps: { shrink: !0 },
                type: 'number',
                label: 'Price (IQD)',
                name: 'price',
              }),
              (0, a.jsx)(i.TextField, {
                ...u('capacity', {
                  required: 'This field is required',
                  valueAsNumber: !0,
                  validate: (e) => e >= 1 || 'Capacity must be at least 1',
                }),
                error: !!b?.capacity,
                helperText: b?.capacity?.message,
                margin: 'normal',
                fullWidth: !0,
                InputLabelProps: { shrink: !0 },
                type: 'number',
                label: 'Capacity',
                name: 'capacity',
              }),
              (0, a.jsx)(i.TextField, {
                ...u('availableSeats', {
                  required: 'This field is required',
                  valueAsNumber: !0,
                  validate: (e) => e <= m('capacity') || 'Available seats cannot exceed capacity',
                }),
                error: !!b?.availableSeats,
                helperText: b?.availableSeats?.message || 'Must be less than or equal to capacity',
                margin: 'normal',
                fullWidth: !0,
                InputLabelProps: { shrink: !0 },
                type: 'number',
                label: 'Available Seats',
                name: 'availableSeats',
              }),
              (0, a.jsx)(o.Controller, {
                control: p,
                name: 'isActive',
                render: ({ field: e }) =>
                  (0, a.jsx)(s.FormControlLabel, {
                    control: (0, a.jsx)(l.Checkbox, { ...e, checked: e.value }),
                    label: 'Is Active',
                  }),
              }),
            ],
          }),
        });
      },
    ]);
  },
]);
