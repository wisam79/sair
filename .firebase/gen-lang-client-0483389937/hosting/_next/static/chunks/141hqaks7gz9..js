(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([
  'object' == typeof document ? document.currentScript : void 0,
  19498,
  (e) => {
    'use strict';
    var i = e.i(37479),
      r = e.i(78090),
      t = e.i(24644),
      l = e.i(23786),
      n = e.i(85424);
    e.s([
      'default',
      0,
      function () {
        let {
          saveButtonProps: e,
          refineCore: { formLoading: o },
          register: a,
          formState: { errors: s },
        } = (0, n.useForm)();
        return (0, i.jsx)(r.Create, {
          isLoading: o,
          saveButtonProps: e,
          children: (0, i.jsxs)(t.Box, {
            component: 'form',
            sx: { display: 'flex', flexDirection: 'column' },
            autoComplete: 'off',
            children: [
              (0, i.jsx)(l.TextField, {
                ...a('name', { required: 'This field is required' }),
                error: !!s?.name,
                helperText: s?.name?.message,
                margin: 'normal',
                fullWidth: !0,
                InputLabelProps: { shrink: !0 },
                label: 'Name',
                name: 'name',
              }),
              (0, i.jsx)(l.TextField, {
                ...a('city'),
                error: !!s?.city,
                helperText: s?.city?.message,
                margin: 'normal',
                fullWidth: !0,
                InputLabelProps: { shrink: !0 },
                label: 'City',
                name: 'city',
              }),
            ],
          }),
        });
      },
    ]);
  },
]);
