(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([
  'object' == typeof document ? document.currentScript : void 0,
  57891,
  (e) => {
    'use strict';
    var i = e.i(37479),
      t = e.i(78090),
      o = e.i(20412),
      l = e.i(80461),
      d = e.i(43737),
      s = e.i(60552);
    e.i(74507);
    var n = e.i(32576);
    let r = { admin: 'error', student: 'primary', driver: 'success' };
    e.s([
      'default',
      0,
      function () {
        let { t: e } = (0, n.useTranslation)(),
          { queryResult: a } = (0, s.useShow)(),
          { data: f, isLoading: p } = a,
          h = f?.data,
          { data: u, isLoading: c } = (0, s.useOne)({
            resource: 'institutions',
            id: h?.institutionId || h?.institution_id || '',
            queryOptions: { enabled: !!(h?.institutionId || h?.institution_id) },
          });
        return (0, i.jsx)(t.Show, {
          isLoading: p,
          children: (0, i.jsxs)(l.Stack, {
            gap: 1,
            children: [
              (0, i.jsx)(o.Typography, {
                variant: 'body1',
                fontWeight: 'bold',
                children: e('profiles.fields.id'),
              }),
              (0, i.jsx)(t.TextFieldComponent, { value: h?.id }),
              (0, i.jsx)(o.Typography, {
                variant: 'body1',
                fontWeight: 'bold',
                children: e('profiles.fields.fullName'),
              }),
              (0, i.jsx)(t.TextFieldComponent, { value: h?.fullName ?? h?.full_name }),
              (0, i.jsx)(o.Typography, {
                variant: 'body1',
                fontWeight: 'bold',
                children: e('profiles.fields.phone'),
              }),
              (0, i.jsx)(t.TextFieldComponent, { value: h?.phone }),
              (0, i.jsx)(o.Typography, {
                variant: 'body1',
                fontWeight: 'bold',
                children: e('profiles.fields.role'),
              }),
              (0, i.jsx)(d.Chip, { label: h?.role, color: r[h?.role] || 'default', size: 'small' }),
              (0, i.jsx)(o.Typography, {
                variant: 'body1',
                fontWeight: 'bold',
                children: e('profiles.fields.verified'),
              }),
              (0, i.jsx)(d.Chip, {
                label: e(
                  (h?.isVerified ?? h?.is_verified)
                    ? 'profiles.fields.verified'
                    : 'profiles.fields.notVerified',
                ),
                color: (h?.isVerified ?? h?.is_verified) ? 'success' : 'default',
                size: 'small',
              }),
              (0, i.jsx)(o.Typography, {
                variant: 'body1',
                fontWeight: 'bold',
                children: e('profiles.fields.institution'),
              }),
              (0, i.jsx)(t.TextFieldComponent, {
                value: c ? e('loading') : (u?.data?.name ?? '-'),
              }),
              (0, i.jsx)(o.Typography, {
                variant: 'body1',
                fontWeight: 'bold',
                children: e('profiles.fields.joined'),
              }),
              (0, i.jsx)(t.TextFieldComponent, {
                value:
                  (h?.createdAt ?? h?.created_at)
                    ? new Date(h?.createdAt ?? h?.created_at).toLocaleString('ar-IQ')
                    : '-',
              }),
            ],
          }),
        });
      },
    ]);
  },
]);
