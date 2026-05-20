(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([
  'object' == typeof document ? document.currentScript : void 0,
  10508,
  (e) => {
    'use strict';
    var i = e.i(37479),
      r = e.i(61129),
      l = e.i(78090),
      t = e.i(24644),
      a = e.i(23786),
      s = e.i(20982),
      o = e.i(81352),
      n = e.i(85424),
      c = e.i(15291),
      d = e.i(60552),
      u = e.i(51215),
      p = e.i(21203);
    e.s([
      'default',
      0,
      function () {
        let {
            saveButtonProps: e,
            refineCore: { queryResult: m, formLoading: h },
            register: f,
            handleSubmit: b,
            control: x,
            setValue: v,
            formState: { errors: y },
          } = (0, n.useForm)(),
          T = (0, u.useRouter)(),
          g = (0, u.useParams)(),
          { open: P } = (0, d.useNotification)(),
          C = m?.data?.data,
          j = C?.userId;
        (0, r.useEffect)(() => {
          if (!j) return;
          let e = !1;
          return (
            p.supabaseClient
              .from('profiles')
              .select('is_verified')
              .eq('id', j)
              .single()
              .then(({ data: i }) => {
                e || v('isVerified', !!i?.is_verified);
              }),
            () => {
              e = !0;
            }
          );
        }, [j, v]);
        let q = async (e) => {
          try {
            let { error: i } = await p.supabaseClient
              .from('drivers')
              .update({
                license_number: e.licenseNumber,
                vehicle_model: e.vehicleModel,
                vehicle_plate: e.vehiclePlate,
                capacity: Number(e.capacity),
              })
              .eq('id', g.id);
            if (i) throw i;
            if (j) {
              let { error: i } = await p.supabaseClient
                .from('profiles')
                .update({ is_verified: !!e.isVerified })
                .eq('id', j);
              if (i) throw i;
            }
            (P?.({ type: 'success', message: 'Driver updated successfully' }), T.push('/drivers'));
          } catch (e) {
            P?.({
              type: 'error',
              message: e instanceof Error ? e.message : 'Failed to update driver',
            });
          }
        };
        return (0, i.jsx)(l.Edit, {
          isLoading: h,
          saveButtonProps: { ...e, onClick: b(q) },
          children: (0, i.jsxs)(t.Box, {
            component: 'form',
            sx: { display: 'flex', flexDirection: 'column' },
            autoComplete: 'off',
            children: [
              (0, i.jsx)(a.TextField, {
                value: j || '',
                margin: 'normal',
                fullWidth: !0,
                InputLabelProps: { shrink: !0 },
                label: 'User Profile ID',
                disabled: !0,
                helperText: 'User profile cannot be changed after creation',
              }),
              (0, i.jsx)(a.TextField, {
                ...f('licenseNumber', { required: 'This field is required' }),
                error: !!y?.licenseNumber,
                helperText: y?.licenseNumber?.message,
                margin: 'normal',
                fullWidth: !0,
                InputLabelProps: { shrink: !0 },
                type: 'text',
                label: 'License Number',
                name: 'licenseNumber',
              }),
              (0, i.jsx)(a.TextField, {
                ...f('vehicleModel', { required: 'This field is required' }),
                error: !!y?.vehicleModel,
                helperText: y?.vehicleModel?.message,
                margin: 'normal',
                fullWidth: !0,
                InputLabelProps: { shrink: !0 },
                type: 'text',
                label: 'Vehicle Model',
                name: 'vehicleModel',
              }),
              (0, i.jsx)(a.TextField, {
                ...f('vehiclePlate', { required: 'This field is required' }),
                error: !!y?.vehiclePlate,
                helperText: y?.vehiclePlate?.message,
                margin: 'normal',
                fullWidth: !0,
                InputLabelProps: { shrink: !0 },
                type: 'text',
                label: 'Vehicle Plate',
                name: 'vehiclePlate',
              }),
              (0, i.jsx)(a.TextField, {
                ...f('capacity', {
                  required: 'This field is required',
                  valueAsNumber: !0,
                  validate: (e) => e >= 1 || 'Capacity must be at least 1',
                }),
                error: !!y?.capacity,
                helperText: y?.capacity?.message,
                margin: 'normal',
                fullWidth: !0,
                InputLabelProps: { shrink: !0 },
                type: 'number',
                label: 'Capacity',
                name: 'capacity',
              }),
              (0, i.jsx)(c.Controller, {
                control: x,
                name: 'isVerified',
                render: ({ field: e }) =>
                  (0, i.jsx)(o.FormControlLabel, {
                    control: (0, i.jsx)(s.Checkbox, { ...e, checked: !!e.value }),
                    label: 'Is Verified',
                  }),
              }),
            ],
          }),
        });
      },
    ]);
  },
]);
