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
} from '@mui/material';
import { useForm } from '@refinedev/react-hook-form';
import { BaseRecord, HttpError, useList } from '@refinedev/core';
import { Controller } from 'react-hook-form';
import React from 'react';

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
  } = useForm<BaseRecord, HttpError, FormValues>();

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

  return (
    <Create isLoading={formLoading} saveButtonProps={saveButtonProps}>
      <Box
        component="form"
        sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}
        autoComplete="off"
      >
        {/* Driver Autocomplete */}
        <Controller
          name="driver_id"
          control={control}
          rules={{ required: 'Driver is required' }}
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
                  label="Driver"
                  margin="normal"
                  error={!!errors?.driver_id}
                  helperText={
                    errors?.driver_id?.message ?? 'Select the driver assigned to this route'
                  }
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

        <TextField
          {...register('title', { required: 'Title is required' })}
          error={!!errors?.title}
          helperText={errors?.title?.message}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          label="Route Title"
          placeholder="e.g., Al-Karrada → Al-Mansour University"
        />

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 0 }}>
          <TextField
            {...register('start_location', { required: 'Required' })}
            error={!!errors?.start_location}
            helperText={errors?.start_location?.message}
            margin="normal"
            fullWidth
            InputLabelProps={{ shrink: true }}
            label="Start Location"
            placeholder="e.g., Al-Karrada"
          />
          <TextField
            {...register('end_location', { required: 'Required' })}
            error={!!errors?.end_location}
            helperText={errors?.end_location?.message}
            margin="normal"
            fullWidth
            InputLabelProps={{ shrink: true }}
            label="End Location"
            placeholder="e.g., Al-Mansour"
          />
        </Stack>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 0 }}>
          <TextField
            {...register('price', {
              required: 'Price is required',
              valueAsNumber: true,
              validate: (v) => v > 0 || 'Must be greater than 0',
            })}
            error={!!errors?.price}
            helperText={errors?.price?.message}
            margin="normal"
            fullWidth
            InputLabelProps={{ shrink: true }}
            type="number"
            label="Price (IQD)"
            inputProps={{ min: 0, step: 500 }}
          />
          <TextField
            {...register('capacity', {
              required: 'Capacity is required',
              valueAsNumber: true,
              validate: (v) => v >= 1 || 'At least 1',
            })}
            error={!!errors?.capacity}
            helperText={errors?.capacity?.message}
            margin="normal"
            fullWidth
            InputLabelProps={{ shrink: true }}
            type="number"
            label="Total Capacity"
            inputProps={{ min: 1 }}
          />
          <TextField
            {...register('available_seats', {
              required: 'Required',
              valueAsNumber: true,
              validate: (v) => {
                const cap = watch('capacity');
                return v <= cap || 'Cannot exceed capacity';
              },
            })}
            error={!!errors?.available_seats}
            helperText={errors?.available_seats?.message ?? 'Must be ≤ capacity'}
            margin="normal"
            fullWidth
            InputLabelProps={{ shrink: true }}
            type="number"
            label="Available Seats"
            inputProps={{ min: 0 }}
          />
        </Stack>

        <FormControlLabel
          sx={{ mt: 1 }}
          control={<Checkbox {...register('is_active')} defaultChecked name="is_active" />}
          label="Active (visible to students immediately)"
        />
      </Box>
    </Create>
  );
}
