'use client';

import { useEffect, useState } from 'react';
import { supabaseClient } from '../../providers/supabaseClient';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

interface FeatureFlag {
  id: string;
  name: string;
  enabled: boolean;
  description: string;
  updated_at: string;
}

export default function FeatureFlagsPage() {
  const { t } = useTranslation();
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    supabaseClient
      .from('feature_flags')
      .select('*')
      .order('name')
      .then(({ data, error: err }) => {
        if (err) {
          setError(err.message);
        } else {
          setFlags(data as FeatureFlag[]);
        }
        setIsLoading(false);
      });
  }, []);

  const toggleFlag = async (id: string, current: boolean) => {
    setSaving(id);
    const { error: err } = await supabaseClient
      .from('feature_flags')
      .update({ enabled: !current, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (err) {
      setError(err.message);
    } else {
      setFlags((prev) => prev.map((f) => (f.id === id ? { ...f, enabled: !current } : f)));
    }
    setSaving(null);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box p={3}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        {t('nav.featureFlags', 'Feature Flags')}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {t('featureFlags.description', 'Toggle features on/off for the mobile app in real-time.')}
      </Typography>

      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('featureFlags.flagName', 'Flag Name')}</TableCell>
              <TableCell>{t('featureFlags.description_field', 'Description')}</TableCell>
              <TableCell>{t('common.status', 'Status')}</TableCell>
              <TableCell align="right">{t('featureFlags.toggle', 'Toggle')}</TableCell>
              <TableCell>{t('featureFlags.lastUpdated', 'Last Updated')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {flags.map((flag) => (
              <TableRow key={flag.id}>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {flag.name}
                  </Typography>
                </TableCell>
                <TableCell>{flag.description}</TableCell>
                <TableCell>
                  <Chip
                    label={
                      flag.enabled
                        ? t('featureFlags.enabled', 'Enabled')
                        : t('featureFlags.disabled', 'Disabled')
                    }
                    color={flag.enabled ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <Switch
                    checked={flag.enabled}
                    onChange={() => toggleFlag(flag.id, flag.enabled)}
                    disabled={saving === flag.id}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(flag.updated_at).toLocaleDateString()}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
