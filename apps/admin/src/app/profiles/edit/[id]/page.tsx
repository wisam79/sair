'use client';

import { Edit } from '@refinedev/mui';
import { Box, TextField, Grid, Card, CardContent, Typography, MenuItem } from '@mui/material';
import { useForm } from '@refinedev/react-hook-form';
import { useTranslation } from 'react-i18next';
import { BaseRecord, HttpError } from '@refinedev/core';

interface ProfileEditFormValues {
  full_name: string;
  phone: string;
  role: 'student' | 'driver' | 'admin';
  institution_id?: string | null;
}

export default function ProfileEdit() {
  const { t } = useTranslation();
  const {
    saveButtonProps,
    refineCore: { formLoading },
    register,
    formState: { errors },
  } = useForm<BaseRecord, HttpError, ProfileEditFormValues>();

  return (
    <Edit
      isLoading={formLoading}
      saveButtonProps={saveButtonProps}
      title={t('profiles.titles.edit', 'Edit User')}
    >
      <Box component="form" sx={{ mt: 2 }} autoComplete="off">
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle2" gutterBottom color="primary">
                  {t('profiles.titles.show', 'User Information')}
                </Typography>

                <TextField
                  {...register('full_name', {
                    required: t('validation.required', 'This field is required'),
                  })}
                  error={!!errors?.full_name}
                  helperText={errors?.full_name?.message}
                  margin="normal"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  label={t('profiles.fields.fullName', 'Full Name')}
                />

                <TextField
                  {...register('phone', {
                    required: t('validation.required', 'This field is required'),
                  })}
                  error={!!errors?.phone}
                  helperText={errors?.phone?.message}
                  margin="normal"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  label={t('profiles.fields.phone', 'Phone')}
                />

                <TextField
                  {...register('role', {
                    required: t('validation.required', 'This field is required'),
                  })}
                  select
                  error={!!errors?.role}
                  helperText={errors?.role?.message}
                  margin="normal"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  label={t('profiles.fields.role', 'Role')}
                  defaultValue="student"
                >
                  <MenuItem value="student">{t('bulkImport.roleStudent', 'Student')}</MenuItem>
                  <MenuItem value="driver">{t('bulkImport.roleDriver', 'Driver')}</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </TextField>

                <TextField
                  {...register('institution_id')}
                  margin="normal"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  label={t('profiles.fields.institutionId', 'Institution ID')}
                  placeholder={t(
                    'routes.placeholders.uuid',
                    'Example: 550e8400-e29b-41d4-a716-446655440000',
                  )}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Edit>
  );
}
