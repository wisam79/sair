'use client';

import { Authenticated } from '@refinedev/core';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Stack,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import React from 'react';

import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import DirectionsBusFilledRoundedIcon from '@mui/icons-material/DirectionsBusFilledRounded';
import RouteRoundedIcon from '@mui/icons-material/RouteRounded';
import CreditScoreRoundedIcon from '@mui/icons-material/CreditScoreRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';
import AddRoadIcon from '@mui/icons-material/AddRoad';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import LayersIcon from '@mui/icons-material/Layers';
import RefreshIcon from '@mui/icons-material/Refresh';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

export interface DashboardStats {
  total_users: number;
  total_drivers: number;
  total_routes: number;
  active_routes: number;
  total_trips: number;
  active_trips: number;
  total_subscriptions: number;
  active_subscriptions: number;
  monthly_revenue: number;
}

// ─── Stat Card ───────────────────────────────────────────────────────────────
function StatCard({
  title,
  value,
  color,
  icon,
  hint,
  href,
}: {
  title: string;
  value: string | number;
  color: string;
  icon: React.ReactNode;
  hint: string;
  href?: string;
}) {
  const router = useRouter();
  return (
    <Card
      onClick={href ? () => router.push(href) : undefined}
      sx={{
        height: '100%',
        cursor: href ? 'pointer' : 'default',
        borderRadius: 4,
        border: '1px solid',
        borderColor: `${color}20`,
        boxShadow: `0 4px 24px ${color}12`,
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: `0 12px 32px ${color}22`,
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: `linear-gradient(90deg, ${color}cc, ${color}44)`,
          borderRadius: '4px 4px 0 0',
        },
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
          <Box>
            <Typography
              color="text.secondary"
              gutterBottom
              sx={{
                fontSize: '0.7rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              {title}
            </Typography>
            <Typography variant="h4" sx={{ color, fontWeight: 800, lineHeight: 1.1, mb: 0.5 }}>
              {typeof value === 'number' ? value.toLocaleString() : value}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.72rem' }}>
              {hint}
            </Typography>
          </Box>
          <Box
            sx={{
              width: 46,
              height: 46,
              minWidth: 46,
              borderRadius: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: `${color}14`,
              color,
              '& svg': { fontSize: 22 },
            }}
          >
            {icon}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

// ─── Quick Action Card ────────────────────────────────────────────────────────
function QuickAction({
  icon,
  label,
  description,
  color,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  color: string;
  onClick: () => void;
}) {
  return (
    <Card
      onClick={onClick}
      sx={{
        cursor: 'pointer',
        borderRadius: 3,
        border: '1px solid',
        borderColor: `${color}1a`,
        p: 0,
        transition: 'all 0.2s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          borderColor: `${color}40`,
          boxShadow: `0 8px 24px ${color}18`,
          '& .qa-arrow': { opacity: 1, transform: 'translateX(3px)' },
        },
      }}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box
            sx={{
              width: 40,
              height: 40,
              minWidth: 40,
              borderRadius: 2.5,
              bgcolor: `${color}14`,
              color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              '& svg': { fontSize: 20 },
            }}
          >
            {icon}
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography fontWeight={700} fontSize={13.5} noWrap>
              {label}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {description}
            </Typography>
          </Box>
          <ArrowForwardIosIcon
            className="qa-arrow"
            sx={{
              fontSize: 12,
              color: `${color}80`,
              opacity: 0,
              transition: 'opacity 0.18s, transform 0.18s',
            }}
          />
        </Stack>
      </CardContent>
    </Card>
  );
}

// ─── Greeting ────────────────────────────────────────────────────────────────
function getGreeting(t: (key: string, fallback: string) => string): string {
  const hour = new Date().getHours();
  if (hour < 12) return t('dashboard.greeting.morning', 'Good morning');
  if (hour < 17) return t('dashboard.greeting.afternoon', 'Good afternoon');
  return t('dashboard.greeting.evening', 'Good evening');
}

// ─── Dashboard Client ─────────────────────────────────────────────────────────
export default function DashboardClient({
  stats,
  onRefresh,
}: {
  stats: DashboardStats;
  onRefresh?: () => void;
}) {
  const { t } = useTranslation();
  const router = useRouter();
  const [lastRefreshed, setLastRefreshed] = React.useState(() => new Date());

  React.useEffect(() => {
    const interval = setInterval(() => {
      setLastRefreshed(new Date());
      onRefresh?.();
    }, 30_000);
    return () => clearInterval(interval);
  }, [onRefresh]);

  const greeting = getGreeting(t);

  const statCards = [
    {
      key: 'users',
      title: t('dashboard.stats.total_users', 'Total Users'),
      value: stats.total_users,
      color: '#2563eb',
      icon: <PeopleAltRoundedIcon />,
      hint: t('dashboard.stats.hint_users', 'Registered on platform'),
      href: '/profiles',
    },
    {
      key: 'drivers',
      title: t('dashboard.stats.total_drivers', 'Drivers'),
      value: stats.total_drivers,
      color: '#16a34a',
      icon: <DirectionsBusFilledRoundedIcon />,
      hint: t('dashboard.stats.hint_drivers', 'Available fleet'),
      href: '/drivers',
    },
    {
      key: 'active_routes',
      title: t('dashboard.stats.active_routes', 'Active Routes'),
      value: stats.active_routes,
      color: '#7c3aed',
      icon: <RouteRoundedIcon />,
      hint: `${t('dashboard.stats.of', 'of')} ${stats.total_routes} ${t('dashboard.stats.total', 'total')}`,
      href: '/routes',
    },
    {
      key: 'active_trips',
      title: t('dashboard.stats.active_trips', 'Live Trips'),
      value: stats.active_trips,
      color: '#ea580c',
      icon: <TrendingUpRoundedIcon />,
      hint: t('dashboard.stats.hint_trips', 'Currently in progress'),
      href: '/trips',
    },
    {
      key: 'subscriptions',
      title: t('dashboard.stats.active_subscriptions', 'Active Subs'),
      value: stats.active_subscriptions,
      color: '#9333ea',
      icon: <CreditScoreRoundedIcon />,
      hint: `${t('dashboard.stats.of', 'of')} ${stats.total_subscriptions} ${t('dashboard.stats.total', 'total')}`,
      href: '/subscriptions',
    },
    {
      key: 'revenue',
      title: t('dashboard.stats.monthly_revenue', 'Revenue (IQD)'),
      value: stats.monthly_revenue.toLocaleString(),
      color: '#d97706',
      icon: <AttachMoneyIcon />,
      hint: t('dashboard.stats.hint_revenue', 'Active subscriptions'),
      href: '/revenue',
    },
    {
      key: 'total_trips',
      title: t('dashboard.stats.total_trips', 'Total Trips'),
      value: stats.total_trips,
      color: '#0891b2',
      icon: <DirectionsBusFilledRoundedIcon />,
      hint: t('dashboard.stats.hint_total_trips', 'All-time tracked'),
      href: '/trip-archive',
    },
    {
      key: 'total_routes',
      title: t('dashboard.stats.total_routes', 'Total Routes'),
      value: stats.total_routes,
      color: '#0f766e',
      icon: <RouteRoundedIcon />,
      hint: t('dashboard.stats.hint_total_routes', 'Configured network'),
      href: '/routes',
    },
  ];

  const quickActions = [
    {
      icon: <AddRoadIcon />,
      label: t('dashboard.actions.addRoute', 'Add Route'),
      description: t('dashboard.actions.addRouteDesc', 'Create a new transport route'),
      color: '#7c3aed',
      onClick: () => router.push('/routes/create'),
    },
    {
      icon: <NotificationsActiveIcon />,
      label: t('dashboard.actions.sendNotification', 'Notify Users'),
      description: t('dashboard.actions.sendNotificationDesc', 'Send push notification'),
      color: '#ea580c',
      onClick: () => router.push('/notifications'),
    },
    {
      icon: <LayersIcon />,
      label: t('dashboard.actions.createLicenseBatch', 'License Batch'),
      description: t('dashboard.actions.createLicenseBatchDesc', 'Generate license codes'),
      color: '#2563eb',
      onClick: () => router.push('/license_batches/create'),
    },
    {
      icon: <DirectionsBusFilledRoundedIcon />,
      label: t('dashboard.actions.viewTrips', 'Live Trips'),
      description: t('dashboard.actions.viewTripsDesc', 'Monitor active trips'),
      color: '#16a34a',
      onClick: () => router.push('/trips'),
    },
  ];

  return (
    <Authenticated
      key="dashboard"
      fallback={
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <Typography color="text.secondary">{t('common.loading', 'Loading...')}</Typography>
        </Box>
      }
    >
      <Box sx={{ p: { xs: 0, sm: 0.5 } }}>
        {/* ── Hero Banner ── */}
        <Card
          sx={{
            mb: 3,
            borderRadius: 4,
            background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 50%, #0ea5e9 100%)',
            color: '#fff',
            boxShadow: '0 20px 60px rgba(37,99,235,0.3)',
            border: 'none',
            overflow: 'hidden',
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              top: -40,
              right: -40,
              width: 180,
              height: 180,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.06)',
              pointerEvents: 'none',
            },
            '&:hover': { transform: 'none' },
          }}
        >
          <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              alignItems={{ xs: 'flex-start', sm: 'center' }}
              justifyContent="space-between"
              spacing={2}
            >
              <Box>
                <Chip
                  icon={
                    <BoltRoundedIcon
                      sx={{ color: '#fff !important', fontSize: '14px !important' }}
                    />
                  }
                  label="UniRide Admin"
                  size="small"
                  sx={{
                    mb: 1.5,
                    color: '#fff',
                    bgcolor: 'rgba(255,255,255,0.15)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    fontWeight: 700,
                    fontSize: 11,
                  }}
                />
                <Typography variant="h4" fontWeight={800} sx={{ mb: 0.75, lineHeight: 1.2 }}>
                  {greeting}, Admin 👋
                </Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.8)', maxWidth: 480, fontSize: 14 }}>
                  {t(
                    'dashboard.heroDesc',
                    "Here's a snapshot of your platform. All systems running normally.",
                  )}
                </Typography>
              </Box>

              <Stack direction="row" spacing={1} alignItems="center" flexShrink={0}>
                {/* Live badge */}
                {stats.active_trips > 0 && (
                  <Chip
                    icon={
                      <FiberManualRecordIcon
                        className="live-dot"
                        sx={{ color: '#4ade80 !important', fontSize: '10px !important' }}
                      />
                    }
                    label={`${stats.active_trips} ${t('dashboard.liveTrips', 'live')}`}
                    sx={{
                      bgcolor: 'rgba(74,222,128,0.15)',
                      border: '1px solid rgba(74,222,128,0.3)',
                      color: '#4ade80',
                      fontWeight: 700,
                    }}
                    onClick={() => router.push('/trips')}
                  />
                )}
                <Tooltip title={t('common.refresh', 'Refresh data')}>
                  <IconButton
                    onClick={() => {
                      setLastRefreshed(new Date());
                      onRefresh?.();
                    }}
                    size="small"
                    sx={{
                      color: 'rgba(255,255,255,0.7)',
                      bgcolor: 'rgba(255,255,255,0.1)',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.2)', color: '#fff' },
                    }}
                  >
                    <RefreshIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Stack>

            <Typography
              variant="caption"
              sx={{ color: 'rgba(255,255,255,0.45)', mt: 2, display: 'block' }}
            >
              {t('dashboard.lastRefreshed', 'Last refreshed')}: {lastRefreshed.toLocaleTimeString()}
            </Typography>
          </CardContent>
        </Card>

        {/* ── Stat Cards ── */}
        <Grid container spacing={2.5} sx={{ mb: 3.5 }}>
          {statCards.map((item) => (
            <Grid item xs={12} sm={6} md={3} key={item.key}>
              <StatCard
                title={item.title}
                value={item.value}
                color={item.color}
                icon={item.icon}
                hint={item.hint}
                href={item.href}
              />
            </Grid>
          ))}
        </Grid>

        {/* ── Quick Actions ── */}
        <Box sx={{ mb: 1 }}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2, color: 'text.primary' }}>
            {t('dashboard.quickActions', 'Quick Actions')}
          </Typography>
          <Grid container spacing={2}>
            {quickActions.map((action) => (
              <Grid item xs={12} sm={6} md={3} key={action.label}>
                <QuickAction {...action} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Authenticated>
  );
}
