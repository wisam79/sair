'use client';

import { useShow } from '@refinedev/core';
import { Show, TextFieldComponent } from '@refinedev/mui';
import { Typography, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function InstitutionShow() {
  const { t } = useTranslation();
  const { queryResult } = useShow();
  const { data, isLoading } = queryResult;
  const record = data?.data as Record<string, unknown> | undefined;

  return (
    <Show isLoading={isLoading} title={t('institutions.titles.show', 'Institution Details')}>
      <Stack gap={1}>
        <Typography variant="body1" fontWeight="bold">
          {t('common.id', 'ID')}
        </Typography>
        <TextFieldComponent value={record?.id} />

        <Typography variant="body1" fontWeight="bold">
          {t('institutions.fields.name', 'Name')}
        </Typography>
        <TextFieldComponent value={record?.name} />

        <Typography variant="body1" fontWeight="bold">
          {t('institutions.fields.city', 'City')}
        </Typography>
        <TextFieldComponent value={record?.city} />

        <Typography variant="body1" fontWeight="bold">
          {t('institutions.fields.createdAt', 'Created At')}
        </Typography>
        <TextFieldComponent
          value={
            typeof record?.created_at === 'string' || typeof record?.created_at === 'number'
              ? new Date(record.created_at).toLocaleString()
              : '-'
          }
        />
      </Stack>
    </Show>
  );
}
