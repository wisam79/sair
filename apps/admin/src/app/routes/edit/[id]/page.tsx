'use client';

import { Edit } from '@refinedev/mui';
import {
  Box,
  TextField,
  Checkbox,
  FormControlLabel,
  Stack,
  CircularProgress,
  Typography,
  Grid,
  Card,
  CardContent,
  Divider,
  Paper,
} from '@mui/material';
import { useForm } from '@refinedev/react-hook-form';
import { Controller } from 'react-hook-form';
import { BaseRecord, HttpError, useOne } from '@refinedev/core';
import React from 'react';
import dynamic from 'next/dynamic';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';

const MapPicker = dynamic(() => import('../../../../components/MapPicker'), {
  ssr: false,
  loading: () => (
    <Box
      sx={{
        height: 500,
        bgcolor: 'background.paper',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '8px',
        border: '1px dashed',
        borderColor: 'divider',
        mb: 2,
      }}
    >
      <CircularProgress size={24} />
      <Typography sx={{ ml: 1, color: 'text.secondary', fontSize: 14 }}>
        جاري تحميل الخريطة...
      </Typography>
    </Box>
  ),
});

interface FormValues {
  title: string;
  start_location: string;
  end_location: string;
  price: number;
  capacity: number;
  available_seats: number;
  is_active: boolean;
  start_lat: number;
  start_lng: number;
  end_lat: number;
  end_lng: number;
}

export default function RouteEdit() {
  const {
    saveButtonProps,
    refineCore: { queryResult, formLoading },
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BaseRecord, HttpError, FormValues>();

  const routesData = queryResult?.data?.data;
  const currentDriverId = routesData?.driver_id;

  // Fetch detailed driver profile & vehicle details
  const { data: driverData, isLoading: driverLoading } = useOne({
    resource: 'drivers',
    id: currentDriverId,
    meta: {
      select: 'id, vehicle_model, vehicle_plate, profiles(full_name)',
    },
    queryOptions: {
      enabled: !!currentDriverId,
    },
  });

  const startLat = watch('start_lat') || 33.3128;
  const startLng = watch('start_lng') || 44.3615;
  const endLat = watch('end_lat') || 33.34;
  const endLng = watch('end_lng') || 44.4;

  return (
    <Edit isLoading={formLoading} saveButtonProps={saveButtonProps}>
      <Box component="form" autoComplete="off" sx={{ mt: 1 }}>
        <Grid container spacing={3}>
          {/* Column 1: Basic & Financial Details */}
          <Grid item xs={12} lg={4}>
            <Card
              variant="outlined"
              sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
            >
              <CardContent
                sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 2.5, flexGrow: 1 }}
              >
                {/* Driver Info Display (Read Only) */}
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: 'block', mb: 0.5 }}
                  >
                    السائق المسؤول (لا يمكن تغييره بعد الإنشاء)
                  </Typography>
                  {driverLoading ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CircularProgress size={14} />
                      <Typography variant="body2" color="text.secondary">
                        جاري تحميل بيانات السائق...
                      </Typography>
                    </Box>
                  ) : driverData?.data ? (
                    <Paper
                      variant="outlined"
                      sx={{ p: 1.5, bgcolor: 'background.default', borderColor: 'divider' }}
                    >
                      <Typography variant="body2" fontWeight={600} color="text.primary">
                        {(driverData.data.profiles as { full_name?: string } | null)?.full_name ??
                          'سائق غير معروف'}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: 'block', mt: 0.25 }}
                      >
                        {(driverData.data.vehicle_model as string) || ''} —{' '}
                        {(driverData.data.vehicle_plate as string) || ''}
                      </Typography>
                    </Paper>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      سائق غير معين
                    </Typography>
                  )}
                </Box>

                {/* Title */}
                <TextField
                  {...register('title', {
                    required: 'العنوان مطلوب',
                  })}
                  error={!!errors?.title}
                  helperText={errors?.title?.message}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  label="عنوان خط النقل"
                  placeholder="مثال: الكرادة ← جامعة المنصور"
                  size="small"
                />

                <Divider sx={{ my: 0.5 }} />

                {/* Price (IQD) */}
                <TextField
                  {...register('price', {
                    required: 'السعر مطلوب',
                    valueAsNumber: true,
                    validate: (value) => value > 0 || 'يجب أن يكون أكبر من 0',
                  })}
                  error={!!errors?.price}
                  helperText={errors?.price?.message}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  type="number"
                  label="سعر الاشتراك (IQD)"
                  placeholder="مثال: 50000"
                  size="small"
                />

                {/* Capacity */}
                <TextField
                  {...register('capacity', {
                    required: 'السعة مطلوبة',
                    valueAsNumber: true,
                    validate: (value) => value >= 1 || 'يجب أن تكون 1 على الأقل',
                  })}
                  error={!!errors?.capacity}
                  helperText={errors?.capacity?.message}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  type="number"
                  label="السعة الكلية (المقاعد)"
                  placeholder="مثال: 4"
                  size="small"
                />

                {/* Available Seats */}
                <TextField
                  {...register('available_seats', {
                    required: 'المقاعد المتوفرة مطلوبة',
                    valueAsNumber: true,
                    validate: (value) => {
                      const capacity = watch('capacity');
                      return value <= capacity || 'لا يمكن أن تتجاوز السعة الكلية';
                    },
                  })}
                  error={!!errors?.available_seats}
                  helperText={
                    errors?.available_seats?.message || 'يجب أن تكون أقل من أو تساوي السعة'
                  }
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  type="number"
                  label="المقاعد المتوفرة حالياً"
                  placeholder="مثال: 4"
                  size="small"
                />

                {/* Active Switch */}
                <Box sx={{ mt: 1 }}>
                  <Controller
                    control={control}
                    name="is_active"
                    render={({ field }) => (
                      <FormControlLabel
                        control={<Checkbox {...field} checked={field.value} />}
                        label="تفعيل الخط (يظهر للطلاب)"
                      />
                    )}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Column 2: Geographical Map & Locations */}
          <Grid item xs={12} lg={8}>
            <MapPicker
              startLat={startLat}
              startLng={startLng}
              endLat={endLat}
              endLng={endLng}
              register={
                register as unknown as import('react-hook-form').UseFormRegister<
                  import('../../../../components/MapPicker').RouteLocationFormValues
                >
              }
              errors={
                errors as unknown as import('react-hook-form').FieldErrors<
                  import('../../../../components/MapPicker').RouteLocationFormValues
                >
              }
              onChangeStart={(lat: number, lng: number, address?: string) => {
                setValue('start_lat', lat, { shouldValidate: true, shouldDirty: true });
                setValue('start_lng', lng, { shouldValidate: true, shouldDirty: true });
                if (address) {
                  setValue('start_location', address, { shouldValidate: true, shouldDirty: true });
                }
              }}
              onChangeEnd={(lat: number, lng: number, address?: string) => {
                setValue('end_lat', lat, { shouldValidate: true, shouldDirty: true });
                setValue('end_lng', lng, { shouldValidate: true, shouldDirty: true });
                if (address) {
                  setValue('end_location', address, { shouldValidate: true, shouldDirty: true });
                }
              }}
            />
          </Grid>
        </Grid>
      </Box>
    </Edit>
  );
}
