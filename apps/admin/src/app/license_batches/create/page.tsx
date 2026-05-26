'use client';

import { Create } from '@refinedev/mui';
import {
  Box,
  TextField,
  MenuItem,
  Alert,
  Grid,
  Card,
  CardContent,
  Stack,
  Typography,
  Divider,
} from '@mui/material';
import { useForm } from '@refinedev/react-hook-form';
import { useSelect, useNavigation, BaseRecord, HttpError } from '@refinedev/core';
import { supabaseClient } from '../../../providers/supabaseClient';
import React from 'react';
import CardMembershipIcon from '@mui/icons-material/CardMembership';

interface LicenseBatchFormValues {
  batch_name: string;
  route_id: string;
  quantity: number;
  price: number;
  valid_days: number;
}

export default function LicenseBatchCreate() {
  const { list } = useNavigation();
  const {
    saveButtonProps,
    refineCore: { formLoading },
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BaseRecord, HttpError, LicenseBatchFormValues>({
    defaultValues: {
      valid_days: 30,
    },
  });

  const { options: rawRouteOptions } = useSelect({
    resource: 'routes',
    optionLabel: 'title',
    optionValue: 'id',
    pagination: {
      mode: 'server',
      pageSize: 100,
    },
  });
  const routeOptions = rawRouteOptions as { label: string; value: string }[] | undefined;

  const handleCustomSubmit = async (data: LicenseBatchFormValues) => {
    try {
      const { error } = await supabaseClient.rpc('create_license_batch', {
        p_route_id: data.route_id,
        p_batch_name: data.batch_name,
        p_quantity: Number(data.quantity),
        p_price: Number(data.price),
        p_valid_days: Number(data.valid_days),
      });

      if (error) {
        alert(`Error: ${error.message}`);
        return;
      }

      // Redirect back using Refine navigation to prevent full page reload
      list('license_batches');
    } catch (e: unknown) {
      if (e instanceof Error) {
        alert(`Error: ${e.message}`);
      } else {
        alert('An unknown error occurred');
      }
    }
  };

  return (
    <Create
      saveButtonProps={{
        ...saveButtonProps,
        onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
          e.preventDefault();
          void handleSubmit(handleCustomSubmit)();
        },
      }}
      isLoading={formLoading}
    >
      <Box component="form" autoComplete="off" sx={{ mt: 1 }}>
        <Card variant="outlined" sx={{ maxWidth: '900px', mx: 'auto', mb: 3 }}>
          <Box
            sx={{
              p: 2,
              bgcolor: 'background.paper',
              borderBottom: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Stack direction="row" spacing={1.5} alignItems="center">
              <CardMembershipIcon color="primary" />
              <Typography variant="subtitle1" fontWeight={600} color="text.primary">
                إنشاء دفعة تراخيص جديدة (أكواد اشتراك الطلاب)
              </Typography>
            </Stack>
          </Box>

          <CardContent sx={{ p: 3 }}>
            <Grid container spacing={3}>
              {/* Batch Name */}
              <Grid item xs={12} md={8}>
                <TextField
                  {...register('batch_name', { required: 'اسم الدفعة مطلوب' })}
                  error={!!errors?.batch_name}
                  helperText={errors?.batch_name?.message ?? 'مثال: اشتراكات شهر مايو - خط الكرادة'}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  type="text"
                  label="اسم دفعة التراخيص"
                  name="batch_name"
                  size="small"
                />
              </Grid>

              {/* Route */}
              <Grid item xs={12} md={4}>
                <TextField
                  select
                  {...register('route_id', { required: 'يجب اختيار خط النقل' })}
                  error={!!errors?.route_id}
                  helperText={errors?.route_id?.message ?? 'اختر الخط المخصص لهذه الدفعة'}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  label="خط النقل المستهدف"
                  name="route_id"
                  defaultValue=""
                  size="small"
                >
                  {routeOptions?.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <Divider />
              </Grid>

              {/* Price */}
              <Grid item xs={12} sm={4}>
                <TextField
                  {...register('price', { required: 'السعر مطلوب', min: 0 })}
                  error={!!errors?.price}
                  helperText={errors?.price?.message ?? 'سعر الكود الواحد بالدينار العراقي'}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  type="number"
                  label="سعر الترخيص الواحد (IQD)"
                  name="price"
                  size="small"
                  inputProps={{ min: 0, step: 500 }}
                />
              </Grid>

              {/* Quantity */}
              <Grid item xs={12} sm={4}>
                <TextField
                  {...register('quantity', { required: 'الكمية مطلوبة', min: 1 })}
                  error={!!errors?.quantity}
                  helperText={errors?.quantity?.message ?? 'عدد الرموز المراد توليدها'}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  type="number"
                  label="الكمية (عدد الرموز)"
                  name="quantity"
                  size="small"
                  inputProps={{ min: 1 }}
                />
              </Grid>

              {/* Valid Days */}
              <Grid item xs={12} sm={4}>
                <TextField
                  {...register('valid_days', { required: 'صلاحية الأيام مطلوبة', min: 1 })}
                  error={!!errors?.valid_days}
                  helperText={errors?.valid_days?.message ?? 'فترة صلاحية الرمز بعد التفعيل باليوم'}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  type="number"
                  label="مدة الصلاحية باليوم"
                  name="valid_days"
                  size="small"
                  inputProps={{ min: 1 }}
                />
              </Grid>

              {/* Info Alert */}
              <Grid item xs={12} sx={{ mt: 1 }}>
                <Alert severity="info" sx={{ py: 1 }}>
                  تنبيه: عند حفظ دفعة التراخيص، سيقوم النظام تلقائياً وبشكل آمن بتوليد أكواد
                  اشتراكات فريدة مكونة من 8 أحرف بعدد الكمية المطلوبة، وربطها بالخط المحدد لتفعيلها
                  من قبل الطلاب.
                </Alert>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </Create>
  );
}
