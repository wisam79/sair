'use client';

import { Show } from '@refinedev/mui';
import {
  Typography,
  Stack,
  Box,
  Grid,
  Card,
  CardContent,
  Paper,
  Chip,
  Divider,
  CircularProgress,
} from '@mui/material';
import { useShow, useOne } from '@refinedev/core';
import { useTranslation } from 'react-i18next';
import dynamic from 'next/dynamic';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import MapIcon from '@mui/icons-material/Map';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import NavigationIcon from '@mui/icons-material/Navigation';

const RouteMapViewer = dynamic(() => import('../../../../components/RouteMapViewer'), {
  ssr: false,
  loading: () => (
    <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <CircularProgress size={24} />
      <Typography sx={{ ml: 1, color: 'text.secondary' }}>جاري تحميل الخريطة...</Typography>
    </Box>
  ),
});

export default function RouteShow() {
  const { t } = useTranslation();
  const { queryResult } = useShow();
  const { data, isLoading } = queryResult;

  const record = data?.data;

  const { data: driverData, isLoading: driverIsLoading } = useOne({
    resource: 'drivers',
    id: record?.driver_id || '',
    meta: {
      select: '*, profiles(full_name)',
    },
    queryOptions: {
      enabled: !!record,
      queryKey: ['drivers', record?.driver_id, 'show-profiles-join'],
    },
  });

  const driverProfile = driverData?.data?.profiles as { full_name?: string } | null;
  const driverName =
    driverProfile?.full_name ??
    driverData?.data?.license_number ??
    record?.driver_id ??
    'سائق غير معروف';

  return (
    <Show isLoading={isLoading} title={t('routes.titles.show', 'Route Details')}>
      <Grid container spacing={3} sx={{ mt: 0.5 }}>
        {/* Column 1: Details Card */}
        <Grid item xs={12} lg={4}>
          <Card
            variant="outlined"
            sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
          >
            <Box
              sx={{
                p: 2,
                bgcolor: 'background.paper',
                borderBottom: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                <DirectionsBusIcon color="primary" />
                <Typography variant="subtitle1" fontWeight={600} color="text.primary">
                  معلومات الخط الأساسية
                </Typography>
              </Stack>
            </Box>

            <CardContent sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              {/* Title */}
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: 'block', mb: 0.5 }}
                >
                  {t('routes.fields.title', 'Title')}
                </Typography>
                <Typography variant="body1" fontWeight={600} color="text.primary">
                  {record?.title}
                </Typography>
              </Box>

              {/* Route ID */}
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: 'block', mb: 0.5 }}
                >
                  {t('common.id', 'ID')}
                </Typography>
                <Typography variant="body2" fontFamily="monospace" color="text.secondary">
                  {record?.id}
                </Typography>
              </Box>

              <Divider />

              {/* Driver Info Panel */}
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: 'block', mb: 0.5 }}
                >
                  {t('routes.fields.driver', 'Driver')}
                </Typography>
                {driverIsLoading ? (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CircularProgress size={14} />
                    <Typography variant="body2" color="text.secondary">
                      {t('common.loading', 'Loading...')}
                    </Typography>
                  </Stack>
                ) : (
                  <Paper
                    variant="outlined"
                    sx={{ p: 1.5, bgcolor: 'background.default', borderColor: 'divider' }}
                  >
                    <Typography variant="body2" fontWeight={600} color="text.primary">
                      {driverName}
                    </Typography>
                    {driverData?.data && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: 'block', mt: 0.25 }}
                      >
                        {(driverData.data.vehicle_model as string) || ''} —{' '}
                        {(driverData.data.vehicle_plate as string) || ''}
                      </Typography>
                    )}
                  </Paper>
                )}
              </Box>

              <Divider />

              {/* Pricing */}
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: 'block', mb: 0.5 }}
                >
                  {t('routes.fields.price', 'Price')}
                </Typography>
                <Typography variant="body1" fontWeight={600} color="primary.main">
                  {record?.price ? `${record.price.toLocaleString()} د.ع` : '-'}
                </Typography>
              </Box>

              {/* Capacity & Available Seats */}
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: 'block', mb: 0.5 }}
                  >
                    {t('routes.fields.capacity', 'Capacity')}
                  </Typography>
                  <Typography variant="body1" fontWeight={600} color="text.primary">
                    {record?.capacity}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: 'block', mb: 0.5 }}
                  >
                    {t('routes.fields.availableSeats', 'Available Seats')}
                  </Typography>
                  <Typography variant="body1" fontWeight={600} color="text.primary">
                    {record?.available_seats}
                  </Typography>
                </Grid>
              </Grid>

              {/* Status Badge */}
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: 'block', mb: 0.5 }}
                >
                  حالة الخط
                </Typography>
                <Chip
                  label={record?.is_active ? 'نشط (ظاهر للطلاب)' : 'غير نشط'}
                  color={record?.is_active ? 'success' : 'default'}
                  size="small"
                  variant="outlined"
                  sx={{ fontWeight: 'bold' }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Column 2: Map & Location Names Card */}
        <Grid item xs={12} lg={8}>
          <Card
            variant="outlined"
            sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
          >
            <Box
              sx={{
                p: 2,
                bgcolor: 'background.paper',
                borderBottom: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                <MapIcon color="primary" />
                <Typography variant="subtitle1" fontWeight={600} color="text.primary">
                  مسار الخط الجغرافي والمحطات
                </Typography>
              </Stack>
            </Box>

            <CardContent
              sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 2.5, flexGrow: 1 }}
            >
              {/* Location Names Side-by-side */}
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 1.5,
                      display: 'flex',
                      gap: 1.5,
                      alignItems: 'center',
                      borderColor: 'divider',
                      bgcolor: 'background.default',
                    }}
                  >
                    <LocationOnIcon color="success" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        نقطة الانطلاق (البداية)
                      </Typography>
                      <Typography variant="body2" fontWeight={600} color="text.primary">
                        {record?.start_location || '-'}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 1.5,
                      display: 'flex',
                      gap: 1.5,
                      alignItems: 'center',
                      borderColor: 'divider',
                      bgcolor: 'background.default',
                    }}
                  >
                    <NavigationIcon sx={{ color: 'error.main', transform: 'rotate(90deg)' }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        نقطة الوصول (النهاية)
                      </Typography>
                      <Typography variant="body2" fontWeight={600} color="text.primary">
                        {record?.end_location || '-'}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              </Grid>

              {/* Map Viewer */}
              {record?.start_lat && record?.end_lat && (
                <Box
                  sx={{
                    flexGrow: 1,
                    minHeight: '420px',
                    borderRadius: '8px',
                    border: '1px solid',
                    borderColor: 'divider',
                    overflow: 'hidden',
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  <RouteMapViewer
                    routes={[record as any]}
                    driverNames={record?.driver_id ? { [record.driver_id]: driverName } : {}}
                    height="100%"
                  />
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Show>
  );
}
