'use client';

import { useMany, useInvalidate } from '@refinedev/core';
import { List, useDataGrid } from '@refinedev/mui';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';
import {
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Tabs,
  Tab,
  Paper,
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Rating,
  Stack,
  useTheme,
} from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import {
  DollarSign,
  TrendingUp as TrendingUpIcon,
  Users as UsersIcon,
  Star as StarIcon,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabaseClient } from '../../providers/supabaseClient';

function PremiumStatCard({
  title,
  value,
  color,
  icon,
  hint,
}: {
  title: string;
  value: string | number;
  color: string;
  icon: React.ReactNode;
  hint: string;
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Card
      className="card-shine"
      sx={{
        height: '100%',
        borderRadius: 4.5,
        border: '1px solid',
        borderColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(148, 163, 184, 0.1)',
        background: isDark
          ? 'linear-gradient(135deg, rgba(45, 45, 45, 0.45) 0%, rgba(35, 35, 35, 0.45) 100%)'
          : 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(245, 242, 239, 0.8) 100%)',
        backdropFilter: 'blur(12px)',
        boxShadow: isDark ? '0 8px 32px rgba(0, 0, 0, 0.25)' : '0 8px 32px rgba(15, 23, 42, 0.04)',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-6px)',
          boxShadow: isDark
            ? `0 16px 40px rgba(0,0,0,0.45), 0 0 0 1px ${color}35`
            : `0 16px 40px ${color}12, 0 0 0 1px ${color}20`,
          borderColor: `${color}45`,
          '& .icon-box': {
            transform: 'scale(1.1) rotate(5deg)',
            bgcolor: isDark ? `${color}25` : `${color}15`,
            boxShadow: `0 6px 20px ${color}30`,
          },
          '&::after': {
            opacity: isDark ? 0.22 : 0.15,
            transform: 'scale(1.25)',
          },
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: -32,
          right: -32,
          width: 96,
          height: 96,
          borderRadius: '50%',
          background: color,
          filter: 'blur(32px)',
          opacity: isDark ? 0.12 : 0.07,
          zIndex: 0,
          transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
          pointerEvents: 'none',
        },
      }}
    >
      <CardContent sx={{ p: 2.5, position: 'relative', zIndex: 1 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
          <Box sx={{ flex: 1 }}>
            <Typography
              color="text.secondary"
              gutterBottom
              sx={{
                fontSize: '0.68rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="h4"
              className="count-animate"
              sx={{
                color: isDark ? '#fff' : 'text.primary',
                fontWeight: 800,
                lineHeight: 1.1,
                mb: 0.5,
                fontSize: '1.8rem',
              }}
            >
              {value}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: 'text.secondary', fontSize: '0.73rem', fontWeight: 500 }}
            >
              {hint}
            </Typography>
          </Box>
          <Box
            className="icon-box"
            sx={{
              width: 46,
              height: 46,
              borderRadius: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: isDark ? `${color}18` : `${color}08`,
              color: color,
              border: `1px solid ${color}18`,
              boxShadow: `0 4px 16px ${color}15`,
              '& svg': { width: 22, height: 22 },
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            {icon}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

const PAYOUT_COLORS: Record<string, 'default' | 'success' | 'error' | 'warning'> = {
  pending: 'warning',
  completed: 'success',
  rejected: 'error',
};

interface TopRoute {
  title: string;
  subscriptions: number;
  price: number;
  revenue: number;
}

interface AnalyticsData {
  total_trips: number;
  completed_trips: number;
  cancelled_trips: number;
  total_revenue: number;
  active_students: number;
  active_drivers: number;
  avg_rating: number;
  trips_by_status: Record<string, number>;
  top_routes: TopRoute[];
}

export default function FinancePage() {
  const { t } = useTranslation();
  const theme = useTheme();
  const isThemeDark = theme.palette.mode === 'dark';
  const searchParams = useSearchParams();
  const router = useRouter();
  const invalidate = useInvalidate();

  const tabParam = searchParams.get('tab');

  // Decide active tab based on query param
  let initialTab = 0;
  if (tabParam === 'payouts') initialTab = 1;
  else if (tabParam === 'ratings') initialTab = 2;

  const [activeTab, setActiveTab] = useState(initialTab);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    let tabStr = 'revenue';
    if (newValue === 1) tabStr = 'payouts';
    else if (newValue === 2) tabStr = 'ratings';
    router.push(`/finance?tab=${tabStr}`);
  };

  // ─── TABS 1: REVENUE ───────────────────────────────────────────────────────
  const [revenueData, setRevenueData] = useState<AnalyticsData | null>(null);
  const [revenueLoading, setRevenueLoading] = useState(true);
  const [revenueError, setRevenueError] = useState<string | null>(null);

  useEffect(() => {
    if (activeTab === 0) {
      setRevenueLoading(true);
      supabaseClient.rpc('get_analytics_summary').then(({ data: result, error: err }) => {
        if (err) {
          setRevenueError(err.message);
        } else {
          setRevenueData(result as AnalyticsData);
        }
        setRevenueLoading(false);
      });
    }
  }, [activeTab]);

  // ─── TABS 2: PAYOUTS ───────────────────────────────────────────────────────
  const { dataGridProps: payoutsGridProps } = useDataGrid({
    resource: 'driver_payouts',
    queryOptions: {
      enabled: activeTab === 1,
    },
  });

  const [payoutDialogOpen, setPayoutDialogOpen] = useState(false);
  const [selectedPayout, setSelectedPayout] = useState<any>(null);
  const [payoutActionType, setPayoutActionType] = useState<'completed' | 'rejected'>('completed');
  const [referenceNote, setReferenceNote] = useState('');
  const [payoutSubmitting, setPayoutSubmitting] = useState(false);
  const [payoutError, setPayoutError] = useState<string | null>(null);

  const payoutDriverIds = React.useMemo(() => {
    return (
      payoutsGridProps?.rows
        ?.map((item: { driver_id?: string }) => item?.driver_id)
        .filter((id): id is string => typeof id === 'string') ?? []
    );
  }, [payoutsGridProps?.rows]);

  const { data: driverData, isLoading: driverIsLoading } = useMany({
    resource: 'drivers',
    ids: payoutDriverIds,
    meta: {
      select: '*, profiles(full_name, phone)',
    },
    queryOptions: {
      enabled: activeTab === 1 && payoutDriverIds.length > 0,
    },
  });

  const handleOpenPayoutDialog = (payout: any, type: 'completed' | 'rejected') => {
    setSelectedPayout(payout);
    setPayoutActionType(type);
    setReferenceNote('');
    setPayoutError(null);
    setPayoutDialogOpen(true);
  };

  const handleClosePayoutDialog = () => {
    setPayoutDialogOpen(false);
    setSelectedPayout(null);
    setReferenceNote('');
    setPayoutError(null);
  };

  const handlePayoutConfirm = async () => {
    if (!selectedPayout) return;

    if (!referenceNote.trim()) {
      setPayoutError(t('validation.required', 'This field is required'));
      return;
    }

    setPayoutSubmitting(true);
    setPayoutError(null);

    try {
      const { error } = await supabaseClient.rpc('process_payout', {
        p_payout_id: selectedPayout.id,
        p_new_status: payoutActionType,
        p_reference_note: referenceNote.trim(),
      });

      if (error) {
        setPayoutError(error.message);
      } else {
        await invalidate({
          resource: 'driver_payouts',
          invalidates: ['list'],
        });
        handleClosePayoutDialog();
      }
    } catch (err: any) {
      setPayoutError(err?.message || t('errors.unknown', 'An unknown error occurred'));
    } finally {
      setPayoutSubmitting(false);
    }
  };

  const payoutColumns = React.useMemo<GridColDef[]>(
    () => [
      { field: 'id', headerName: t('common.id', 'ID'), type: 'string', minWidth: 100, flex: 1 },
      {
        field: 'driver_id',
        headerName: t('payouts.fields.driverId', 'Driver'),
        type: 'string',
        minWidth: 220,
        flex: 1.2,
        renderCell: function render({ value }) {
          if (driverIsLoading) {
            return <>{t('common.loading', 'Loading...')}</>;
          }

          const driver = driverData?.data?.find((item) => item.id === value);
          const profile = driver?.profiles as { full_name?: string; phone?: string } | null;
          return profile
            ? `${profile.full_name} (${profile.phone || driver?.license_number || ''})`
            : value;
        },
      },
      {
        field: 'amount',
        headerName: t('payouts.fields.amountIqd', 'Amount (IQD)'),
        type: 'number',
        minWidth: 150,
        flex: 1,
        renderCell: ({ value }) => (value ? Number(value).toLocaleString() : '-'),
      },
      {
        field: 'status',
        headerName: t('common.status', 'Status'),
        minWidth: 120,
        flex: 0.5,
        renderCell: ({ value }) => {
          const valStr = typeof value === 'string' ? value : '';
          return (
            <Chip
              label={
                valStr
                  ? t(`payouts.status.${valStr}`, valStr.charAt(0).toUpperCase() + valStr.slice(1))
                  : '-'
              }
              color={PAYOUT_COLORS[valStr] || 'default'}
              size="small"
            />
          );
        },
      },
      {
        field: 'reference_note',
        headerName: t('payouts.fields.reference', 'Reference'),
        type: 'string',
        minWidth: 200,
        flex: 1,
      },
      {
        field: 'created_at',
        headerName: t('payouts.fields.requested', 'Requested'),
        minWidth: 160,
        flex: 1,
        renderCell: ({ value }) =>
          typeof value === 'string' || typeof value === 'number'
            ? new Date(value).toLocaleDateString()
            : '-',
      },
      {
        field: 'updated_at',
        headerName: t('payouts.fields.updated', 'Updated'),
        minWidth: 160,
        flex: 1,
        renderCell: ({ value }) =>
          typeof value === 'string' || typeof value === 'number'
            ? new Date(value).toLocaleDateString()
            : '-',
      },
      {
        field: 'actions',
        headerName: t('actions.actions', 'Actions'),
        type: 'actions',
        minWidth: 120,
        flex: 0.5,
        renderCell: ({ row }) => {
          if (row.status !== 'pending') return null;
          return (
            <Box display="flex" gap={1}>
              <Tooltip title={t('actions.approve', 'Approve')}>
                <IconButton
                  color="success"
                  size="small"
                  onClick={() => handleOpenPayoutDialog(row, 'completed')}
                >
                  <CheckCircleOutlineIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title={t('actions.reject', 'Reject')}>
                <IconButton
                  color="error"
                  size="small"
                  onClick={() => handleOpenPayoutDialog(row, 'rejected')}
                >
                  <HighlightOffIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          );
        },
      },
    ],
    [driverData?.data, driverIsLoading, t],
  );

  // ─── TABS 3: RATINGS ───────────────────────────────────────────────────────
  const { dataGridProps: ratingsGridProps } = useDataGrid({
    resource: 'ratings',
    sorters: { initial: [{ field: 'created_at', order: 'desc' }] },
    queryOptions: {
      enabled: activeTab === 2,
    },
  });

  const studentIds = React.useMemo(() => {
    return (
      ratingsGridProps?.rows
        ?.map((item: { student_id?: string }) => item?.student_id)
        .filter((id): id is string => typeof id === 'string') ?? []
    );
  }, [ratingsGridProps?.rows]);

  const driverIds = React.useMemo(() => {
    return (
      ratingsGridProps?.rows
        ?.map((item: { driver_id?: string }) => item?.driver_id)
        .filter((id): id is string => typeof id === 'string') ?? []
    );
  }, [ratingsGridProps?.rows]);

  const profileIds = React.useMemo(() => {
    return Array.from(new Set([...studentIds, ...driverIds]));
  }, [studentIds, driverIds]);

  const { data: profileData, isLoading: profilesLoading } = useMany({
    resource: 'profiles',
    ids: profileIds,
    queryOptions: {
      enabled: activeTab === 2 && profileIds.length > 0,
      queryKey: ['profiles', profileIds],
    },
  });

  const tripIds = React.useMemo(() => {
    return (
      ratingsGridProps?.rows
        ?.map((item: { trip_id?: string }) => item?.trip_id)
        .filter((id): id is string => typeof id === 'string') ?? []
    );
  }, [ratingsGridProps?.rows]);

  const { data: tripData, isLoading: tripsLoading } = useMany({
    resource: 'trips',
    ids: tripIds,
    meta: {
      select: 'id, scheduled_at, routes(title)',
    },
    queryOptions: {
      enabled: activeTab === 2 && tripIds.length > 0,
      queryKey: ['trips', tripIds, 'routes-join'],
    },
  });

  const ratingColumns = React.useMemo<GridColDef[]>(
    () => [
      { field: 'id', headerName: t('common.id', 'ID'), type: 'string', minWidth: 100, flex: 1 },
      {
        field: 'trip_id',
        headerName: t('ratings.fields.trip', 'Trip'),
        type: 'string',
        minWidth: 250,
        flex: 1.5,
        renderCell: function render({ value }) {
          if (tripsLoading) return <>{t('common.loading', 'Loading...')}</>;
          const trip = tripData?.data?.find((item) => item.id === value);
          if (!trip) return value;
          const route = trip.routes as { title?: string } | null;
          const time = trip.scheduled_at ? new Date(trip.scheduled_at).toLocaleString() : '';
          return route?.title ? `${route.title} (${time})` : time || value;
        },
      },
      {
        field: 'student_id',
        headerName: t('ratings.fields.student', 'Student'),
        type: 'string',
        minWidth: 180,
        flex: 1,
        renderCell: function render({ value }) {
          if (profilesLoading) return <>{t('common.loading', 'Loading...')}</>;
          const profile = profileData?.data?.find((item) => item.id === value);
          return profile ? profile.full_name : value;
        },
      },
      {
        field: 'driver_id',
        headerName: t('ratings.fields.driver', 'Driver'),
        type: 'string',
        minWidth: 180,
        flex: 1,
        renderCell: function render({ value }) {
          if (profilesLoading) return <>{t('common.loading', 'Loading...')}</>;
          const profile = profileData?.data?.find((item) => item.id === value);
          return profile ? profile.full_name : value;
        },
      },
      {
        field: 'rating',
        headerName: t('ratings.fields.rating', 'Rating'),
        minWidth: 180,
        flex: 1,
        renderCell: ({ value }) => <Rating value={value} readOnly precision={1} size="small" />,
      },
      {
        field: 'comment',
        headerName: t('ratings.fields.comment', 'Comment'),
        type: 'string',
        minWidth: 250,
        flex: 1,
        renderCell: ({ value }) => value || '-',
      },
      {
        field: 'created_at',
        headerName: t('ratings.fields.date', 'Date'),
        minWidth: 160,
        flex: 1,
        renderCell: ({ value }) => (value ? new Date(value).toLocaleDateString() : '-'),
      },
    ],
    [profileData?.data, profilesLoading, tripData?.data, tripsLoading, t],
  );

  return (
    <>
      <Paper
        elevation={0}
        sx={{ borderBottom: 1, borderColor: 'divider', mb: 3, bgcolor: 'transparent' }}
      >
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          textColor="primary"
          indicatorColor="primary"
          sx={{
            '& .MuiTab-root': {
              fontFamily: 'var(--font-noto-arabic), sans-serif',
              fontWeight: 600,
            },
          }}
        >
          <Tab label={t('revenue.title', 'Revenue Reports')} />
          <Tab label={t('payouts.title', 'Driver Payouts')} />
          <Tab label={t('ratings.title', 'Ratings & Reviews')} />
        </Tabs>
      </Paper>

      {/* TAB 0: REVENUE */}
      {activeTab === 0 && (
        <Box>
          {revenueLoading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
              <CircularProgress />
            </Box>
          ) : revenueError ? (
            <Alert severity="error">{revenueError}</Alert>
          ) : (
            <Box>
              <Grid container spacing={3} sx={{ mb: 4 }} className="stagger-children">
                <Grid item xs={12} sm={6} md={3}>
                  <PremiumStatCard
                    title={t('revenue.totalRevenue', 'Total Revenue')}
                    value={`${revenueData?.total_revenue?.toLocaleString() ?? 0} ${t('common.iqd', 'د.ع')}`}
                    color="#C2703E"
                    icon={<DollarSign />}
                    hint={t('revenue.totalRevenueHint', 'إجمالي الإيرادات المحصلة')}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <PremiumStatCard
                    title={t('revenue.completedTrips', 'Completed Trips')}
                    value={revenueData?.completed_trips ?? 0}
                    color="#16a34a"
                    icon={<TrendingUpIcon />}
                    hint={t('revenue.completedTripsHint', 'الرحلات الناجحة المكتملة')}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <PremiumStatCard
                    title={t('revenue.activeStudents', 'Active Students')}
                    value={revenueData?.active_students ?? 0}
                    color="#7c3aed"
                    icon={<UsersIcon />}
                    hint={t('revenue.activeStudentsHint', 'المشتركون النشطون حالياً')}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <PremiumStatCard
                    title={t('revenue.avgRating', 'Avg Rating')}
                    value={revenueData?.avg_rating?.toFixed(1) ?? t('common.na', 'N/A')}
                    color="#f59e0b"
                    icon={<StarIcon />}
                    hint={t('revenue.avgRatingHint', 'متوسط تقييم الطلاب للرحلات')}
                  />
                </Grid>
              </Grid>

              <Typography
                variant="h6"
                fontWeight="bold"
                gutterBottom
                sx={{
                  fontFamily: 'var(--font-noto-arabic), sans-serif',
                  color: 'text.primary',
                  mb: 2,
                }}
              >
                {t('revenue.topRoutes', 'Top Routes by Revenue')}
              </Typography>
              <TableContainer
                component={Paper}
                sx={{
                  borderRadius: 4.5,
                  border: '1px solid',
                  borderColor: isThemeDark
                    ? 'rgba(255, 255, 255, 0.05)'
                    : 'rgba(148, 163, 184, 0.1)',
                  background: isThemeDark
                    ? 'linear-gradient(135deg, rgba(45, 45, 45, 0.45) 0%, rgba(35, 35, 35, 0.45) 100%)'
                    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(245, 242, 239, 0.8) 100%)',
                  backdropFilter: 'blur(12px)',
                  boxShadow: isThemeDark
                    ? '0 8px 32px rgba(0, 0, 0, 0.25)'
                    : '0 8px 32px rgba(15, 23, 42, 0.04)',
                  overflow: 'hidden',
                }}
              >
                <Table>
                  <TableHead>
                    <TableRow
                      sx={{ bgcolor: isThemeDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.02)' }}
                    >
                      <TableCell
                        sx={{
                          fontFamily: 'var(--font-noto-arabic), sans-serif',
                          fontWeight: 600,
                          color: 'text.primary',
                        }}
                      >
                        {t('common.route', 'Route')}
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          fontFamily: 'var(--font-noto-arabic), sans-serif',
                          fontWeight: 600,
                          color: 'text.primary',
                        }}
                      >
                        {t('routes.fields.priceIqd', 'Price (IQD)')}
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          fontFamily: 'var(--font-noto-arabic), sans-serif',
                          fontWeight: 600,
                          color: 'text.primary',
                        }}
                      >
                        {t('nav.subscriptions', 'Subscriptions')}
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          fontFamily: 'var(--font-noto-arabic), sans-serif',
                          fontWeight: 600,
                          color: 'text.primary',
                        }}
                      >
                        {t('revenue.revenueIqd', 'Revenue (IQD)')}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {revenueData?.top_routes?.map((route, idx) => (
                      <TableRow
                        key={idx}
                        sx={{
                          bgcolor:
                            idx % 2 === 0
                              ? isThemeDark
                                ? 'rgba(255,255,255,0.015)'
                                : 'rgba(15,23,42,0.015)'
                              : isThemeDark
                                ? 'rgba(255,255,255,0.003)'
                                : 'rgba(15,23,42,0.002)',
                          borderBottom: '2px solid',
                          borderColor: isThemeDark ? '#2D2D2D' : '#E5E1D8',
                          '&:hover': {
                            bgcolor: isThemeDark ? 'rgba(74,222,128,0.06)' : 'rgba(22,163,74,0.04)',
                          },
                          transition: 'background-color 0.15s ease',
                        }}
                      >
                        <TableCell
                          sx={{
                            fontFamily: 'var(--font-noto-arabic), sans-serif',
                            color: 'text.primary',
                            borderBottom: 'none',
                          }}
                        >
                          {route.title}
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            fontFamily: 'var(--font-noto-arabic), sans-serif',
                            color: 'text.primary',
                            borderBottom: 'none',
                          }}
                        >
                          {route.price.toLocaleString()}
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            fontFamily: 'var(--font-noto-arabic), sans-serif',
                            color: 'text.primary',
                            borderBottom: 'none',
                          }}
                        >
                          {route.subscriptions}
                        </TableCell>
                        <TableCell align="right" sx={{ borderBottom: 'none' }}>
                          <Typography
                            fontWeight="bold"
                            sx={{
                              fontFamily: 'var(--font-noto-arabic), sans-serif',
                              color: 'primary.main',
                            }}
                          >
                            {route.revenue.toLocaleString()}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </Box>
      )}

      {/* TAB 1: PAYOUTS */}
      {activeTab === 1 && (
        <List breadcrumb={null} title="">
          <DataGrid
            {...payoutsGridProps}
            columns={payoutColumns}
            autoHeight
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: { showQuickFilter: true },
            }}
          />
        </List>
      )}

      {/* TAB 2: RATINGS */}
      {activeTab === 2 && (
        <List breadcrumb={null} title="">
          <DataGrid
            {...ratingsGridProps}
            columns={ratingColumns}
            autoHeight
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: { showQuickFilter: true },
            }}
          />
        </List>
      )}

      {/* Payout Confirmation Dialog */}
      <Dialog open={payoutDialogOpen} onClose={handleClosePayoutDialog} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontFamily: 'var(--font-noto-arabic), sans-serif' }}>
          {payoutActionType === 'completed'
            ? t('payouts.dialog.approveTitle', 'Approve Payout Request')
            : t('payouts.dialog.rejectTitle', 'Reject Payout Request')}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {selectedPayout && (
              <Box sx={{ p: 1.5, bgcolor: 'action.hover', borderRadius: 1 }}>
                <div
                  style={{
                    fontSize: '0.85rem',
                    color: 'text.secondary',
                    fontFamily: 'var(--font-noto-arabic), sans-serif',
                  }}
                >
                  {t('payouts.fields.amountIqd', 'Amount (IQD)')}:
                  <strong style={{ marginLeft: 4, color: 'text.primary' }}>
                    {Number(selectedPayout.amount).toLocaleString()} د.ع
                  </strong>
                </div>
              </Box>
            )}

            <TextField
              label={
                payoutActionType === 'completed'
                  ? t('payouts.fields.reference', 'Reference Note / Transaction ID')
                  : t('payouts.fields.rejectReason', 'Reason for Rejection')
              }
              value={referenceNote}
              onChange={(e) => setReferenceNote(e.target.value)}
              error={!!payoutError && payoutError === t('validation.required')}
              helperText={payoutError}
              fullWidth
              multiline
              rows={2}
              size="small"
              autoFocus
              InputProps={{
                style: { fontFamily: 'var(--font-noto-arabic), sans-serif' },
              }}
              InputLabelProps={{
                style: { fontFamily: 'var(--font-noto-arabic), sans-serif' },
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={handleClosePayoutDialog}
            disabled={payoutSubmitting}
            sx={{ fontFamily: 'var(--font-noto-arabic), sans-serif' }}
          >
            {t('actions.cancel', 'Cancel')}
          </Button>
          <Button
            onClick={handlePayoutConfirm}
            variant="contained"
            color={payoutActionType === 'completed' ? 'success' : 'error'}
            disabled={payoutSubmitting}
            sx={{ fontFamily: 'var(--font-noto-arabic), sans-serif' }}
          >
            {payoutSubmitting
              ? t('common.loading', 'Loading...')
              : payoutActionType === 'completed'
                ? t('actions.save', 'Approve')
                : t('actions.reject', 'Reject')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
