'use client';

import { Create, useAutocomplete } from '@refinedev/mui';
import {
  Box,
  TextField,
  Checkbox,
  FormControlLabel,
  Autocomplete,
  Grid,
  Card,
  CardContent,
  Typography,
} from '@mui/material';
import { useForm } from '@refinedev/react-hook-form';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { BaseRecord, HttpError } from '@refinedev/core';

interface DriverFormValues {
  user_id: string;
  license_number: string;
  vehicle_model: string;
  vehicle_plate: string;
  capacity: number;
  is_verified: boolean;
}

export default function DriverCreate() {
  const { t } = useTranslation();
  const {
    saveButtonProps,
    refineCore: { formLoading },
    register,
    control,
    formState: { errors },
  } = useForm<BaseRecord, HttpError, DriverFormValues>();

  const { autocompleteProps: profileAutocompleteProps } = useAutocomplete({
    resource: 'profiles',
  });

  return (
    <Create
      isLoading={formLoading}
      saveButtonProps={saveButtonProps}
      title={t('drivers.titles.create', 'Create Driver')}
    >
      <Box component="form" sx={{ mt: 2 }} autoComplete="off">
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle2" gutterBottom color="primary">
                  {t('drivers.fields.userProfile', 'User Profile Selection')}
                </Typography>
                <Controller
                  control={control}
                  name="user_id"
                  rules={{ required: t('validation.required', 'This field is required') }}
                  render={({ field: { onChange, value } }) => (
                    <Autocomplete
                      {...profileAutocompleteProps}
                      value={
                        profileAutocompleteProps?.options?.find(
                          (p) => p?.id?.toString() === value?.toString(),
                        ) ?? null
                      }
                      onChange={(_, newValue) => {
                        onChange(newValue?.id ?? null);
                      }}
                      getOptionLabel={(option) => {
                        return option?.full_name
                          ? `${option.full_name} (${option.phone || ''})`
                          : '';
                      }}
                      isOptionEqualToValue={(option, val) => {
                        const optionId = option?.id?.toString();
                        const valId = (val?.id ?? val)?.toString();
                        return optionId === valId;
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={t('drivers.fields.userProfile', 'User Profile')}
                          margin="normal"
                          variant="outlined"
                          error={!!errors?.user_id}
                          helperText={
                            errors?.user_id?.message ||
                            t(
                              'drivers.hints.selectProfile',
                              'Select a user profile (preferably with driver role)',
                            )
                          }
                          required
                        />
                      )}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="is_verified"
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Checkbox {...field} checked={!!field.value} />}
                      label={t('drivers.fields.isVerified', 'Is Verified')}
                      sx={{ mt: 1 }}
                    />
                  )}
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle2" gutterBottom color="secondary">
                  {t('drivers.fields.vehicleInfo', 'Vehicle Information')}
                </Typography>
                <TextField
                  {...register('vehicle_model', {
                    required: t('validation.required', 'This field is required'),
                  })}
                  error={!!errors?.vehicle_model}
                  helperText={errors?.vehicle_model?.message}
                  margin="normal"
                  fullWidth
                  label={t('drivers.fields.vehicleModel', 'Vehicle Model')}
                />
                <TextField
                  {...register('vehicle_plate', {
                    required: t('validation.required', 'This field is required'),
                  })}
                  error={!!errors?.vehicle_plate}
                  helperText={errors?.vehicle_plate?.message}
                  margin="normal"
                  fullWidth
                  label={t('drivers.fields.vehiclePlate', 'Vehicle Plate')}
                />
                <TextField
                  {...register('license_number', {
                    required: t('validation.required', 'This field is required'),
                  })}
                  error={!!errors?.license_number}
                  helperText={errors?.license_number?.message}
                  margin="normal"
                  fullWidth
                  label={t('drivers.fields.licenseNumber', 'License Number')}
                />
                <TextField
                  {...register('capacity', {
                    required: t('validation.required', 'This field is required'),
                    valueAsNumber: true,
                    validate: (value) =>
                      value >= 1 || t('validation.minCapacity', 'Capacity must be at least 1'),
                  })}
                  error={!!errors?.capacity}
                  helperText={errors?.capacity?.message}
                  margin="normal"
                  fullWidth
                  type="number"
                  label={t('drivers.fields.capacity', 'Capacity')}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Create>
  );
}
