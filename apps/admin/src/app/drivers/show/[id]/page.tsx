'use client';

import { useShow, useOne } from '@refinedev/core';
import { Show } from '@refinedev/mui';
import { Typography, Stack, Grid, Card, CardContent, Divider, Box, Chip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Person, DriveEta, AirlineSeatReclineNormal, VerifiedUser } from '@mui/icons-material';

export default function DriverShow() {
  const { t } = useTranslation();
  const { queryResult } = useShow();
  const { data, isLoading } = queryResult;
  const record = data?.data;

  const { data: profileData, isLoading: profileIsLoading } = useOne({
    resource: 'profiles',
    id: record?.user_id || '',
    queryOptions: {
      enabled: !!record?.user_id,
    },
  });

  return (
    <Show isLoading={isLoading} title={t('drivers.titles.show', 'Driver Details')}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Person sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">
                  {t('drivers.fields.userProfile', 'User Profile')}
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />

              <Stack spacing={2}>
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    {t('profiles.fields.fullName', 'Full Name')}
                  </Typography>
                  <Typography variant="body1">
                    {profileIsLoading
                      ? t('common.loading', 'Loading...')
                      : profileData?.data?.full_name || record?.user_id}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="textSecondary">
                    {t('profiles.fields.phone', 'Phone')}
                  </Typography>
                  <Typography variant="body1">
                    {profileIsLoading
                      ? t('common.loading', 'Loading...')
                      : profileData?.data?.phone || '-'}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="textSecondary">
                    {t('drivers.fields.verified', 'Verification Status')}
                  </Typography>
                  <Box sx={{ mt: 0.5 }}>
                    <Chip
                      label={
                        record?.is_verified
                          ? t('drivers.fields.verified', 'Verified')
                          : t('drivers.fields.notVerified', 'Not Verified')
                      }
                      color={record?.is_verified ? 'success' : 'warning'}
                      variant="outlined"
                      size="small"
                      icon={<VerifiedUser />}
                    />
                  </Box>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <DriveEta sx={{ mr: 1, color: 'secondary.main' }} />
                <Typography variant="h6">
                  {t('drivers.fields.vehicleInfo', 'Vehicle Information')}
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />

              <Stack spacing={2}>
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    {t('drivers.fields.vehicleModel', 'Vehicle Model')}
                  </Typography>
                  <Typography variant="body1">{record?.vehicle_model}</Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="textSecondary">
                    {t('drivers.fields.vehiclePlate', 'Vehicle Plate')}
                  </Typography>
                  <Typography variant="body1" sx={{ fontFamily: 'monospace', letterSpacing: 1 }}>
                    {record?.vehicle_plate}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="textSecondary">
                    {t('drivers.fields.licenseNumber', 'License Number')}
                  </Typography>
                  <Typography variant="body1">{record?.license_number}</Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="textSecondary">
                    {t('drivers.fields.capacity', 'Passenger Capacity')}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AirlineSeatReclineNormal
                      sx={{ mr: 1, fontSize: 'small', color: 'text.secondary' }}
                    />
                    <Typography variant="body1">{record?.capacity}</Typography>
                  </Box>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="caption" color="textSecondary">
                {t('common.id', 'Internal ID')}
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: 'monospace', color: 'text.secondary' }}>
                {record?.id}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Show>
  );
}
