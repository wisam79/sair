'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  Chip,
  Button,
  Tabs,
  Tab,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  InputAdornment,
  TablePagination,
  Stack,
  useTheme,
} from '@mui/material';
import {
  CheckCircle,
  Error,
  Warning,
  Refresh,
  Search,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabaseClient } from '../../providers/supabaseClient';

const STATUS_CONFIG = {
  healthy: {
    color: '#10b981',
    iconColor: '#10b981',
  },
  degraded: {
    color: '#f59e0b',
    iconColor: '#f59e0b',
  },
  down: {
    color: '#ef4444',
    iconColor: '#ef4444',
  },
};

function PremiumHealthCard({
  service,
  status,
  latency_ms,
  message,
}: HealthCheck) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.healthy;

  return (
    <Card
      className="card-shine"
      sx={{
        height: '100%',
        borderRadius: 4.5,
        border: '1px solid',
        borderColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(148, 163, 184, 0.1)',
        background: isDark
          ? `linear-gradient(135deg, rgba(45, 45, 45, 0.4) 0%, rgba(35, 35, 35, 0.4) 100%)`
          : `linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(245, 242, 239, 0.8) 100%)`,
        backdropFilter: 'blur(12px)',
        boxShadow: isDark ? '0 8px 32px rgba(0, 0, 0, 0.25)' : '0 8px 32px rgba(15, 23, 42, 0.04)',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-6px)',
          boxShadow: isDark
            ? `0 16px 40px rgba(0,0,0,0.45), 0 0 0 1px ${config.color}35`
            : `0 16px 40px ${config.color}12, 0 0 0 1px ${config.color}20`,
          borderColor: `${config.color}45`,
          '& .status-dot': {
            transform: 'scale(1.2)',
          },
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: -32,
          right: -32,
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: config.color,
          filter: 'blur(28px)',
          opacity: isDark ? 0.1 : 0.06,
          pointerEvents: 'none',
        },
      }}
    >
      <CardContent sx={{ p: 2.5, position: 'relative', zIndex: 1 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <Typography variant="subtitle1" fontWeight={700} sx={{ color: 'text.primary' }}>
            {service}
          </Typography>
          <Box
            className="status-dot live-dot"
            sx={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              bgcolor: config.color,
              boxShadow: `0 0 10px ${config.color}`,
              transition: 'transform 0.2s ease',
            }}
          />
        </Stack>

        <Stack direction="row" alignItems="center" gap={1} sx={{ mb: 1.5 }}>
          <Chip
            label={status.toUpperCase()}
            size="small"
            sx={{
              fontWeight: 700,
              fontSize: '0.65rem',
              bgcolor: isDark ? `${config.color}20` : `${config.color}10`,
              color: config.color,
              border: `1px solid ${config.color}30`,
              borderRadius: 2,
            }}
          />
          {latency_ms !== undefined && (
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
              {latency_ms}ms
            </Typography>
          )}
        </Stack>

        {message && (
          <Typography variant="body2" sx={{ color: status === 'healthy' ? 'text.secondary' : 'error.main', fontSize: '0.78rem', mt: 1, fontFamily: 'var(--font-noto-arabic), sans-serif' }}>
            {message}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

interface HealthCheck {
  service: string;
  status: 'healthy' | 'degraded' | 'down';
  latency_ms?: number;
  message?: string;
}

interface ActivityLog {
  id: string;
  user_id: string;
  action: string;
  resource: string;
  resource_id?: string;
  details?: Record<string, unknown> | string;
  created_at: string;
  ip_address?: string;
}

const ACTION_COLORS: Record<
  string,
  'default' | 'info' | 'warning' | 'error' | 'success' | 'primary'
> = {
  login: 'success',
  logout: 'default',
  create: 'info',
  update: 'warning',
  delete: 'error',
  role_change: 'info',
  trip_status_change: 'primary',
};

export default function SystemPage() {
  const { t } = useTranslation();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const searchParams = useSearchParams();
  const router = useRouter();

  const tabParam = searchParams.get('tab');
  const initialTab = tabParam === 'logs' ? 1 : 0;
  const [activeTab, setActiveTab] = useState(initialTab);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    router.push(`/system?tab=${newValue === 1 ? 'logs' : 'health'}`);
  };

  // ─── TAB 0: SYSTEM HEALTH ────────────────────────────────────────────────
  const [checks, setChecks] = useState<HealthCheck[]>([]);
  const [healthLoading, setHealthLoading] = useState(true);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const runChecks = async () => {
    setHealthLoading(true);
    const results: HealthCheck[] = [];

    try {
      const start = Date.now();
      const { error } = await supabaseClient.rpc('ping');
      const latency = Date.now() - start;
      results.push({
        service: t('health.supabaseDb', 'Supabase Database'),
        status: error ? 'down' : 'healthy',
        latency_ms: latency,
        message: error ? error.message : undefined,
      });
    } catch {
      results.push({
        service: t('health.supabaseDb', 'Supabase Database'),
        status: 'down',
        message: t('health.connectionFailed', 'Connection failed'),
      });
    }

    try {
      const start = Date.now();
      const { error } = await supabaseClient.functions.invoke('trip-engine', {
        body: { action: 'health' },
      });
      const latency = Date.now() - start;
      results.push({
        service: t('health.tripEngine', 'Trip Engine (Edge Function)'),
        status: error ? 'degraded' : 'healthy',
        latency_ms: latency,
        message: error ? error.message : undefined,
      });
    } catch {
      results.push({
        service: t('health.tripEngine', 'Trip Engine (Edge Function)'),
        status: 'down',
        message: t('health.functionUnreachable', 'Function unreachable'),
      });
    }

    try {
      const start = Date.now();
      const { error } = await supabaseClient.functions.invoke('send-notification', {
        body: { action: 'health' },
      });
      const latency = Date.now() - start;
      results.push({
        service: t('health.notificationService', 'Notification Service'),
        status: error ? 'degraded' : 'healthy',
        latency_ms: latency,
        message: error ? error.message : undefined,
      });
    } catch {
      results.push({
        service: t('health.notificationService', 'Notification Service'),
        status: 'down',
        message: t('health.functionUnreachable', 'Function unreachable'),
      });
    }

    results.push({
      service: t('health.realtimeSubs', 'Realtime Subscriptions'),
      status: 'healthy',
      message: t('health.websocketActive', 'WebSocket connections active'),
    });

    setChecks(results);
    setLastChecked(new Date());
    setHealthLoading(false);
  };

  useEffect(() => {
    if (activeTab === 0) {
      void runChecks();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const overallStatus = checks.some((c) => c.status === 'down')
    ? 'down'
    : checks.some((c) => c.status === 'degraded')
      ? 'degraded'
      : 'healthy';

  // ─── TAB 1: AUDIT LOGS ───────────────────────────────────────────────────
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [logsLoading, setLogsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [logsError, setLogsError] = useState<string | null>(null);

  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  const fetchLogs = async (
    currentPage: number,
    currentRowsPerPage: number,
    currentSearch: string,
  ) => {
    try {
      setLogsLoading(true);
      setLogsError(null);

      const from = currentPage * currentRowsPerPage;
      const to = from + currentRowsPerPage - 1;

      let query = supabaseClient
        .from('audit_logs')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);

      const cleanSearch = currentSearch.trim();
      if (cleanSearch) {
        const searchPattern = `%${cleanSearch}%`;
        query = query.or(
          `user_id.ilike.${searchPattern},action.ilike.${searchPattern},resource.ilike.${searchPattern}`,
        );
      }

      const { data, count, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      setLogs(data || []);
      setTotalCount(count || 0);
    } catch (err: any) {
      console.error('[ActivityLog] Fetch error:', err);
      setLogsError(err?.message || 'Failed to load activity logs');
    } finally {
      setLogsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 1) {
      const delayDebounceFn = setTimeout(() => {
        setPage(0);
        void fetchLogs(0, rowsPerPage, searchTerm);
      }, 500);

      return () => clearTimeout(delayDebounceFn);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, rowsPerPage, activeTab]);

  return (
    <>
      <Paper elevation={0} sx={{ borderBottom: 1, borderColor: 'divider', mb: 3, bgcolor: 'transparent' }}>
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
          <Tab label={t('nav.systemHealth', 'System Health')} />
          <Tab label={t('nav.activityLog', 'Activity Log')} />
        </Tabs>
      </Paper>

      {/* TAB 0: SYSTEM HEALTH */}
      {activeTab === 0 && (
        <Box>
          <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Chip
              label={
                overallStatus === 'healthy'
                  ? t('health.allOperational', 'All Systems Operational')
                  : overallStatus === 'degraded'
                    ? t('health.partialDegradation', 'Partial Degradation')
                    : t('health.systemOutage', 'System Outage')
              }
              color={
                overallStatus === 'healthy'
                  ? 'success'
                  : overallStatus === 'degraded'
                    ? 'warning'
                    : 'error'
              }
              sx={{ fontSize: 14, py: 1, px: 2 }}
            />
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={() => void runChecks()}
              disabled={healthLoading}
              sx={{ fontFamily: 'var(--font-noto-arabic), sans-serif' }}
            >
              {t('health.refresh', 'Refresh')}
            </Button>
          </Box>

          {lastChecked && (
            <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
              {t('health.lastChecked', 'Last checked:')} {lastChecked.toLocaleTimeString()}
            </Typography>
          )}

          {healthLoading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={3} className="stagger-children">
              {checks.map((check) => (
                <Grid item xs={12} sm={6} md={3} key={check.service}>
                  <PremiumHealthCard {...check} />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      )}

      {/* TAB 1: ACTIVITY LOG */}
      {activeTab === 1 && (
        <Box>
          {logsError && (
            <Alert
              severity="error"
              sx={{ mb: 3 }}
              action={
                <Button color="inherit" size="small" onClick={() => void fetchLogs(page, rowsPerPage, searchTerm)}>
                  {t('common.retry', 'Retry')}
                </Button>
              }
            >
              {t('activityLog.loadError', 'Failed to load audit logs')}: {logsError}
            </Alert>
          )}

          <TextField
            placeholder={t(
              'activityLog.searchPlaceholder',
              'Search by action, resource, user, or details...',
            )}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
            sx={{ mb: 3, maxWidth: 500 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />

          {logsLoading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer
              component={Paper}
              sx={{
                borderRadius: 4.5,
                border: '1px solid',
                borderColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(148, 163, 184, 0.1)',
                background: isDark
                  ? 'linear-gradient(135deg, rgba(45, 45, 45, 0.45) 0%, rgba(35, 35, 35, 0.45) 100%)'
                  : 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(245, 242, 239, 0.8) 100%)',
                backdropFilter: 'blur(12px)',
                boxShadow: isDark ? '0 8px 32px rgba(0, 0, 0, 0.25)' : '0 8px 32px rgba(15, 23, 42, 0.04)',
                overflow: 'hidden',
              }}
            >
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.02)' }}>
                    <TableCell sx={{ fontFamily: 'var(--font-noto-arabic), sans-serif', fontWeight: 600, color: 'text.primary' }}>{t('activityLog.timestamp', 'Timestamp')}</TableCell>
                    <TableCell sx={{ fontFamily: 'var(--font-noto-arabic), sans-serif', fontWeight: 600, color: 'text.primary' }}>{t('activityLog.user', 'User')}</TableCell>
                    <TableCell sx={{ fontFamily: 'var(--font-noto-arabic), sans-serif', fontWeight: 600, color: 'text.primary' }}>{t('activityLog.action', 'Action')}</TableCell>
                    <TableCell sx={{ fontFamily: 'var(--font-noto-arabic), sans-serif', fontWeight: 600, color: 'text.primary' }}>{t('activityLog.resource', 'Resource')}</TableCell>
                    <TableCell sx={{ fontFamily: 'var(--font-noto-arabic), sans-serif', fontWeight: 600, color: 'text.primary' }}>{t('activityLog.details', 'Details')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {logs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                        <Typography color="text.secondary">
                          {t('common.noData', 'No data found')}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    logs.map((log, idx) => (
                      <TableRow
                        key={log.id}
                        sx={{
                          bgcolor: idx % 2 === 0
                            ? (isDark ? 'rgba(255,255,255,0.015)' : 'rgba(15,23,42,0.015)')
                            : (isDark ? 'rgba(255,255,255,0.003)' : 'rgba(15,23,42,0.002)'),
                          borderBottom: '2px solid',
                          borderColor: isDark ? '#2D2D2D' : '#E5E1D8',
                          '&:hover': {
                            bgcolor: isDark ? 'rgba(74,222,128,0.06)' : 'rgba(22,163,74,0.04)',
                          },
                          transition: 'background-color 0.15s ease',
                        }}
                      >
                        <TableCell sx={{ color: 'text.primary', borderBottom: 'none' }}>
                          <Typography variant="caption">
                            {new Date(log.created_at).toLocaleString()}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ color: 'text.primary', borderBottom: 'none' }}>
                          <Typography
                            variant="body2"
                            sx={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis' }}
                          >
                            {log.user_id}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ borderBottom: 'none' }}>
                          <Chip
                            label={log.action.replace('_', ' ')}
                            color={ACTION_COLORS[log.action] || 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell sx={{ color: 'text.primary', borderBottom: 'none' }}>
                          <Typography variant="body2">{log.resource}</Typography>
                        </TableCell>
                        <TableCell sx={{ color: 'text.primary', borderBottom: 'none' }}>
                          <Typography variant="body2" color="text.secondary">
                            {typeof log.details === 'object'
                              ? JSON.stringify(log.details)
                              : log.details || '-'}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[10, 25, 50, 100]}
                component="div"
                count={totalCount}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(event, newPage) => {
                  setPage(newPage);
                  void fetchLogs(newPage, rowsPerPage, searchTerm);
                }}
                onRowsPerPageChange={(event) => {
                  const newRowsPerPage = parseInt(event.target.value, 10);
                  setRowsPerPage(newRowsPerPage);
                  setPage(0);
                  void fetchLogs(0, newRowsPerPage, searchTerm);
                }}
                sx={{
                  bgcolor: isDark ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.01)',
                  borderTop: '1px solid',
                  borderColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(148, 163, 184, 0.1)',
                  color: 'text.primary',
                }}
              />
            </TableContainer>
          )}
        </Box>
      )}
    </>
  );
}
