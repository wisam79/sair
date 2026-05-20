(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([
  'object' == typeof document ? document.currentScript : void 0,
  32461,
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
          register: s,
          formState: { errors: a },
        } = (0, n.useForm)();
        return (0, i.jsx)(r.Edit, {
          isLoading: o,
          saveButtonProps: e,
          children: (0, i.jsxs)(t.Box, {
            component: 'form',
            sx: { display: 'flex', flexDirection: 'column' },
            autoComplete: 'off',
            children: [
              (0, i.jsx)(l.TextField, {
                ...s('name', { required: 'This field is required' }),
                error: !!a?.name,
                helperText: a?.name?.message,
                margin: 'normal',
                fullWidth: !0,
                InputLabelProps: { shrink: !0 },
                label: 'Name',
                name: 'name',
              }),
              (0, i.jsx)(l.TextField, {
                ...s('city'),
                error: !!a?.city,
                helperText: a?.city?.message,
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
