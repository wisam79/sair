'use client';

import { useDataGrid, List, ShowButton, EditButton, DeleteButton } from '@refinedev/mui';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import React from 'react';
import { Stack, Chip, Box, Button, Typography, useTheme } from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

const ROLE_COLORS: Record<
  string,
  'default' | 'primary' | 'success' | 'error' | 'warning' | 'info'
> = {
  admin: 'error',
  student: 'primary',
  driver: 'success',
};

export default function ProfileList() {
  const { t } = useTranslation();
  const router = useRouter();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const { dataGridProps } = useDataGrid({
    resource: 'profiles',
  });

  const columns = React.useMemo<GridColDef[]>(
    () => [
      {
        field: 'id',
        headerName: t('common.id', 'ID'),
        type: 'string',
        minWidth: 100,
        flex: 1,
      },
      {
        field: 'full_name',
        headerName: t('profiles.fields.fullName', 'Full Name'),
        type: 'string',
        minWidth: 180,
        flex: 1,
      },
      {
        field: 'phone',
        headerName: t('profiles.fields.phone', 'Phone'),
        type: 'string',
        minWidth: 150,
        flex: 1,
      },
      {
        field: 'role',
        headerName: t('profiles.fields.role', 'Role'),
        type: 'string',
        minWidth: 120,
        flex: 0.5,
        renderCell: function render({ value }) {
          return <Chip label={value} color={ROLE_COLORS[value] || 'default'} size="small" />;
        },
      },
      {
        field: 'created_at',
        headerName: t('profiles.fields.joined', 'Joined'),
        minWidth: 180,
        flex: 1,
        renderCell: function render({ value }) {
          return value ? new Date(value).toLocaleDateString() : '-';
        },
      },
      {
        field: 'actions',
        headerName: t('actions.actions', 'Actions'),
        sortable: false,
        renderCell: function render({ row }) {
          return (
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              justifyContent="center"
              height="100%"
            >
              <EditButton hideText recordItemId={row.id} />
              <ShowButton hideText recordItemId={row.id} />
              <DeleteButton hideText recordItemId={row.id} />
            </Stack>
          );
        },
        align: 'center',
        headerAlign: 'center',
        minWidth: 150,
      },
    ],
    [t],
  );

  return (
    <Box sx={{ p: { xs: 0, sm: 0.5 } }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 3 }}
        spacing={2}
      >
        <Box>
          <Typography
            variant="h5"
            fontWeight={700}
            sx={{
              color: 'text.primary',
              mb: 0.5,
              fontFamily: 'var(--font-noto-arabic), sans-serif',
            }}
          >
            {t('profiles.title', 'إدارة الحسابات')}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
              fontWeight: 500,
              fontFamily: 'var(--font-noto-arabic), sans-serif',
            }}
          >
            {t('profiles.subtitle', 'عرض وتعديل حسابات الطلاب والمديرين والسائقين بالمنصة')}
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<UploadIcon />}
          onClick={() => router.push('/bulk-import')}
          sx={{
            fontFamily: 'var(--font-noto-arabic), sans-serif',
            borderRadius: 2.5,
            px: 2.5,
            py: 1,
            boxShadow: isDark
              ? '0 4px 12px rgba(74, 222, 128, 0.15)'
              : '0 4px 12px rgba(22, 163, 74, 0.15)',
            textTransform: 'none',
            fontWeight: 600,
            transition: 'all 0.2s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: isDark
                ? '0 6px 16px rgba(74, 222, 128, 0.25)'
                : '0 6px 16px rgba(22, 163, 74, 0.25)',
            },
          }}
        >
          {t('bulkImport.title', 'Bulk User Import')}
        </Button>
      </Stack>

      <Box
        sx={{
          width: '100%',
          overflowX: 'auto',
          display: 'grid',
          borderRadius: 4.5,
          border: '1px solid',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(148, 163, 184, 0.1)',
          background: isDark
            ? 'linear-gradient(135deg, rgba(45, 45, 45, 0.45) 0%, rgba(35, 35, 35, 0.45) 100%)'
            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(245, 242, 239, 0.8) 100%)',
          backdropFilter: 'blur(12px)',
          boxShadow: isDark
            ? '0 8px 32px rgba(0, 0, 0, 0.25)'
            : '0 8px 32px rgba(15, 23, 42, 0.04)',
          p: 1.5,
        }}
      >
        <DataGrid
          {...dataGridProps}
          columns={columns}
          autoHeight
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: { showQuickFilter: true },
          }}
        />
      </Box>
    </Box>
  );
}
