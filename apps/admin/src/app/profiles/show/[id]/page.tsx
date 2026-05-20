'use client';

import { Show, TextFieldComponent as TextField } from '@refinedev/mui';
import { Typography, Stack, Chip } from '@mui/material';
import { useShow } from '@refinedev/core';
import { useTranslation } from 'react-i18next';

const ROLE_COLORS: Record<
  string,
  'default' | 'primary' | 'success' | 'error' | 'warning' | 'info'
> = {
  admin: 'error',
  student: 'primary',
  driver: 'success',
};

export default function ProfileShow() {
  const { t } = useTranslation();
  const { queryResult } = useShow();
  const { data, isLoading } = queryResult;
  const record = data?.data;

  return (
    <Show isLoading={isLoading}>
      <Stack gap={1}>
        <Typography variant="body1" fontWeight="bold">
          {t('common.id', 'ID')}
        </Typography>
        <TextField value={record?.id} />

        <Typography variant="body1" fontWeight="bold">
          {t('profiles.fields.fullName', 'Full Name')}
        </Typography>
        <TextField value={record?.full_name} />

        <Typography variant="body1" fontWeight="bold">
          {t('profiles.fields.phone', 'Phone')}
        </Typography>
        <TextField value={record?.phone} />

        <Typography variant="body1" fontWeight="bold">
          {t('profiles.fields.role', 'Role')}
        </Typography>
        <Chip label={record?.role} color={ROLE_COLORS[record?.role] || 'default'} size="small" />

        <Typography variant="body1" fontWeight="bold">
          {t('profiles.fields.institutionId', 'Institution ID')}
        </Typography>
        <TextField value={record?.institution_id || t('common.na', 'N/A')} />

        <Typography variant="body1" fontWeight="bold">
          {t('profiles.fields.joined', 'Joined')}
        </Typography>
        <TextField
          value={record?.created_at ? new Date(record.created_at).toLocaleString() : '-'}
        />
      </Stack>
    </Show>
  );
}
