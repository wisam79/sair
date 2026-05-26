'use client';

import { Create } from '@refinedev/mui';
import {
  Box,
  TextField,
  FormControlLabel,
  Checkbox,
  Autocomplete,
  CircularProgress,
  Typography,
  Stack,
  Grid,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import { useForm } from '@refinedev/react-hook-form';
import { BaseRecord, HttpError, useList } from '@refinedev/core';
import { Controller } from 'react-hook-form';
import React from 'react';
import dynamic from 'next/dynamic';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';

const MapPicker = dynamic(() => import('../../../components/MapPicker'), {
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

interface DriverOption {
  id: string;
  label: string;
  vehicle: string;
}

interface FormValues {
  driver_id: string;
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

export default function RouteCreate() {
  const {
    saveButtonProps,
    refineCore: { formLoading },
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BaseRecord, HttpError, FormValues>({
    defaultValues: {
      is_active: true,
      start_lat: 33.3128,
      start_lng: 44.3615,
      end_lat: 33.34,
      end_lng: 44.4,
    },
  });

  // Fetch drivers for autocomplete
  const { data: driversData, isLoading: driversLoading } = useList({
    resource: 'drivers',
    meta: { select: 'id, vehicle_model, vehicle_plate, profiles(full_name)' },
    pagination: { pageSize: 200 },
  });

  const driverOptions: DriverOption[] = React.useMemo(() => {
    return (driversData?.data ?? []).map((d) => ({
      id: d.id as string,
      label: (d.profiles as { full_name?: string } | null)?.full_name ?? 'Unknown Driver',
      vehicle: `${(d.vehicle_model as string) ?? ''} — ${(d.vehicle_plate as string) ?? ''}`,
    }));
  }, [driversData?.data]);

  const startLat = watch('start_lat') || 33.3128;
  const startLng = watch('start_lng') || 44.3615;
  const endLat = watch('end_lat') || 33.34;
  const endLng = watch('end_lng') || 44.4;

  return (
    <Create isLoading={formLoading} saveButtonProps={saveButtonProps}>
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
                {/* Title */}
                <TextField
                  {...register('title', { required: 'عنوان خط النقل مطلوب' })}
                  error={!!errors?.title}
                  helperText={errors?.title?.message}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  label="عنوان خط النقل"
                  placeholder="مثال: الكرادة ← جامعة المنصور"
                  size="small"
                />

                {/* Driver */}
                <Controller
                  name="driver_id"
                  control={control}
                  rules={{ required: 'السائق مطلوب' }}
                  render={({ field: { onChange, value } }) => (
                    <Autocomplete<DriverOption>
                      options={driverOptions}
                      loading={driversLoading}
                      getOptionLabel={(opt) => opt.label}
                      isOptionEqualToValue={(opt, val) => opt.id === val.id}
                      value={driverOptions.find((o) => o.id === value) ?? null}
                      onChange={(_, selected) => {
                        onChange(selected?.id ?? '');
                        setValue('driver_id', selected?.id ?? '');
                      }}
                      renderOption={(props, option) => (
                        <Box component="li" {...props} key={option.id}>
                          <Stack spacing={0}>
                            <Typography fontSize={13.5} fontWeight={600}>
                              {option.label}
                            </Typography>
                            <Typography fontSize={12} color="text.secondary">
                              {option.vehicle}
                            </Typography>
                          </Stack>
                        </Box>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="السائق المعين"
                          error={!!errors?.driver_id}
                          helperText={
                            errors?.driver_id?.message ?? 'اختر السائق المسؤول عن هذا الخط'
                          }
                          size="small"
                          InputLabelProps={{ shrink: true }}
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <>
                                {driversLoading && <CircularProgress size={16} />}
                                {params.InputProps.endAdornment}
                              </>
                            ),
                          }}
                        />
                      )}
                    />
                  )}
                />

                <Divider sx={{ my: 0.5 }} />

                {/* Price (IQD) */}
                <TextField
                  {...register('price', {
                    required: 'السعر مطلوب',
                    valueAsNumber: true,
                    validate: (v) => v > 0 || 'يجب أن يكون أكبر من 0',
                  })}
                  error={!!errors?.price}
                  helperText={errors?.price?.message}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  type="number"
                  label="سعر الاشتراك (IQD)"
                  placeholder="مثال: 50000"
                  inputProps={{ min: 0, step: 500 }}
                  size="small"
                />

                {/* Capacity */}
                <TextField
                  {...register('capacity', {
                    required: 'السعة الكلية مطلوبة',
                    valueAsNumber: true,
                    validate: (v) => v >= 1 || 'يجب أن تكون 1 على الأقل',
                  })}
                  error={!!errors?.capacity}
                  helperText={errors?.capacity?.message}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  type="number"
                  label="السعة الكلية (المقاعد)"
                  placeholder="مثال: 4"
                  inputProps={{ min: 1 }}
                  size="small"
                />

                {/* Available Seats */}
                <TextField
                  {...register('available_seats', {
                    required: 'المقاعد الشاغرة مطلوبة',
                    valueAsNumber: true,
                    validate: (v) => {
                      const cap = watch('capacity');
                      return v <= cap || 'لا يمكن أن تتجاوز السعة الكلية';
                    },
                  })}
                  error={!!errors?.available_seats}
                  helperText={
                    errors?.available_seats?.message ?? 'يجب أن تكون أقل من أو تساوي السعة'
                  }
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  type="number"
                  label="المقاعد المتوفرة حالياً"
                  placeholder="مثال: 4"
                  inputProps={{ min: 0 }}
                  size="small"
                />

                {/* Active Switch */}
                <Box sx={{ mt: 1 }}>
                  <FormControlLabel
                    control={
                      <Checkbox {...register('is_active')} defaultChecked name="is_active" />
                    }
                    label="تفعيل الخط (يظهر للطلاب فوراً)"
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
                  import('../../../components/MapPicker').RouteLocationFormValues
                >
              }
              errors={
                errors as unknown as import('react-hook-form').FieldErrors<
                  import('../../../components/MapPicker').RouteLocationFormValues
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
    </Create>
  );
}
