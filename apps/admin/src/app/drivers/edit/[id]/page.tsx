'use client';

import { Edit } from '@refinedev/mui';
import {
  Box,
  TextField,
  Checkbox,
  FormControlLabel,
  Grid,
  Card,
  CardContent,
  Typography,
} from '@mui/material';
import { useForm } from '@refinedev/react-hook-form';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { BaseRecord, HttpError } from '@refinedev/core';

interface DriverEditFormValues {
  license_number: string;
  vehicle_model: string;
  vehicle_plate: string;
  capacity: number;
  is_verified: boolean;
}

export default function DriverEdit() {
  const { t } = useTranslation();
  const {
    saveButtonProps,
    refineCore: { queryResult, formLoading },
    register,
    control,
    formState: { errors },
  } = useForm<BaseRecord, HttpError, DriverEditFormValues>();

  const driverData = queryResult?.data?.data as Record<string, unknown> | undefined;
  const currentUserId = typeof driverData?.user_id === 'string' ? driverData.user_id : '';

  return (
    <Edit
      isLoading={formLoading}
      saveButtonProps={saveButtonProps}
      title={t('drivers.titles.edit', 'Edit Driver')}
    >
      <Box component="form" sx={{ mt: 2 }} autoComplete="off">
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle2" gutterBottom color="primary">
                  {t('drivers.fields.userProfile', 'User Profile')}
                </Typography>
                <TextField
                  value={currentUserId || ''}
                  margin="normal"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  label={t('drivers.fields.userProfileId', 'User Profile ID')}
                  disabled
                  helperText={t(
                    'drivers.hints.userProfileImmutable',
                    'User profile cannot be changed after creation',
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
                  InputLabelProps={{ shrink: true }}
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
                  InputLabelProps={{ shrink: true }}
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
                  InputLabelProps={{ shrink: true }}
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
                  InputLabelProps={{ shrink: true }}
                  type="number"
                  label={t('drivers.fields.capacity', 'Capacity')}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Edit>
  );
}
