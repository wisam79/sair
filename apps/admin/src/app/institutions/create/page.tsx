'use client';

import { Create } from '@refinedev/mui';
import { Box, TextField } from '@mui/material';
import { useForm } from '@refinedev/react-hook-form';

import { BaseRecord, HttpError } from '@refinedev/core';

interface InstitutionFormValues {
  name: string;
  city: string;
}

export default function InstitutionCreate() {
  const {
    saveButtonProps,
    refineCore: { formLoading },
    register,
    formState: { errors },
  } = useForm<BaseRecord, HttpError, InstitutionFormValues>();

  return (
    <Create isLoading={formLoading} saveButtonProps={saveButtonProps}>
      <Box component="form" sx={{ display: 'flex', flexDirection: 'column' }} autoComplete="off">
        <TextField
          {...register('name', {
            required: 'This field is required',
          })}
          error={!!errors?.name}
          helperText={errors?.name?.message}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          type="text"
          label="Name"
          name="name"
        />
        <TextField
          {...register('city')}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          type="text"
          label="City"
          name="city"
        />
      </Box>
    </Create>
  );
}
