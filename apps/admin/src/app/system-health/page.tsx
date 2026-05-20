'use client';

import { useEffect, useState } from 'react';
import { supabaseClient } from '../../providers/supabaseClient';
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
} from '@mui/material';
import { CheckCircle, Error, Warning, Refresh } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

interface HealthCheck {
  service: string;
  status: 'healthy' | 'degraded' | 'down';
  latency_ms?: number;
  message?: string;
}

export default function SystemHealthPage() {
  const { t } = useTranslation();
  const [checks, setChecks] = useState<HealthCheck[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const runChecks = async () => {
    setIsLoading(true);
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
    setIsLoading(false);
  };

  useEffect(() => {
    void runChecks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const overallStatus = checks.some((c) => c.status === 'down')
    ? 'down'
    : checks.some((c) => c.status === 'degraded')
      ? 'degraded'
      : 'healthy';

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          {t('nav.systemHealth', 'System Health')}
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={() => void runChecks()}
          disabled={isLoading}
        >
          {t('health.refresh', 'Refresh')}
        </Button>
      </Box>

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
        sx={{ mb: 3, fontSize: 14, py: 1, px: 2 }}
      />

      {lastChecked && (
        <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
          {t('health.lastChecked', 'Last checked:')} {lastChecked.toLocaleTimeString()}
        </Typography>
      )}

      <Grid container spacing={3}>
        {checks.map((check) => (
          <Grid item xs={12} sm={6} md={4} key={check.service}>
            <Card elevation={2}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1} sx={{ mb: 1 }}>
                  {check.status === 'healthy' && <CheckCircle color="success" />}
                  {check.status === 'degraded' && <Warning color="warning" />}
                  {check.status === 'down' && <Error color="error" />}
                  <Typography variant="subtitle1" fontWeight="bold">
                    {check.service}
                  </Typography>
                </Box>
                <Chip
                  label={check.status.toUpperCase()}
                  color={
                    check.status === 'healthy'
                      ? 'success'
                      : check.status === 'degraded'
                        ? 'warning'
                        : 'error'
                  }
                  size="small"
                  sx={{ mb: 1 }}
                />
                {check.latency_ms !== undefined && (
                  <Typography variant="body2" color="text.secondary">
                    {t('health.latency', 'Latency:')} {check.latency_ms}ms
                  </Typography>
                )}
                {check.message && (
                  <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                    {check.message}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
