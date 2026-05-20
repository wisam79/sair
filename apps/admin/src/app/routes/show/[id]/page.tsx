'use client';

import { Show, TextFieldComponent as TextField } from '@refinedev/mui';
import { Typography, Stack } from '@mui/material';
import { useShow, useOne } from '@refinedev/core';
import { useTranslation } from 'react-i18next';

export default function RouteShow() {
  const { t } = useTranslation();
  const { queryResult } = useShow();
  const { data, isLoading } = queryResult;

  const record = data?.data;

  const { data: driverData, isLoading: driverIsLoading } = useOne({
    resource: 'drivers',
    id: record?.driver_id || '',
    queryOptions: {
      enabled: !!record,
    },
  });

  return (
    <Show isLoading={isLoading} title={t('routes.titles.show', 'Route Details')}>
      <Stack gap={1}>
        <Typography variant="body1" fontWeight="bold">
          {t('common.id', 'ID')}
        </Typography>
        <TextField value={record?.id} />

        <Typography variant="body1" fontWeight="bold">
          {t('routes.fields.title', 'Title')}
        </Typography>
        <TextField value={record?.title} />

        <Typography variant="body1" fontWeight="bold">
          {t('routes.fields.driver', 'Driver')}
        </Typography>
        {driverIsLoading ? (
          <Typography variant="body2">{t('common.loading', 'Loading...')}</Typography>
        ) : (
          <TextField value={driverData?.data?.license_number || record?.driver_id} />
        )}

        <Typography variant="body1" fontWeight="bold">
          {t('routes.fields.startLocation', 'Start Location')}
        </Typography>
        <TextField value={record?.start_location} />

        <Typography variant="body1" fontWeight="bold">
          {t('routes.fields.endLocation', 'End Location')}
        </Typography>
        <TextField value={record?.end_location} />

        <Typography variant="body1" fontWeight="bold">
          {t('routes.fields.price', 'Price')}
        </Typography>
        <TextField value={record?.price} />

        <Typography variant="body1" fontWeight="bold">
          {t('routes.fields.capacity', 'Capacity')}
        </Typography>
        <TextField value={record?.capacity} />

        <Typography variant="body1" fontWeight="bold">
          {t('routes.fields.availableSeats', 'Available Seats')}
        </Typography>
        <TextField value={record?.available_seats} />

        <Typography variant="body1" fontWeight="bold">
          {t('routes.fields.active', 'Active')}
        </Typography>
        <TextField value={record?.is_active ? t('common.yes', 'Yes') : t('common.no', 'No')} />
      </Stack>
    </Show>
  );
}
