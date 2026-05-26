'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Tabs,
  Tab,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
} from '@mui/material';
import { Save } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabaseClient } from '../../providers/supabaseClient';

const DEFAULT_SETTINGS = {
  appName: 'Sair',
  defaultLanguage: 'ar',
  maintenanceMode: false,
  allowNewRegistrations: true,
  maxTripCapacity: 50,
  licenseCodeLength: 8,
  sessionTimeoutMinutes: 60,
  enablePushNotifications: true,
  enableChat: true,
  enableRatings: true,
};

interface FeatureFlag {
  id: string;
  name: string;
  enabled: boolean;
  description: string;
  updated_at: string;
}

export default function SettingsPage() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const router = useRouter();

  const tabParam = searchParams.get('tab');
  const initialTab = tabParam === 'flags' ? 1 : 0;
  const [activeTab, setActiveTab] = useState(initialTab);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    router.push(`/settings?tab=${newValue === 1 ? 'flags' : 'general'}`);
  };

  // ─── TAB 0: GENERAL SETTINGS ─────────────────────────────────────────────
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedSettings = localStorage.getItem('sair_settings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (e) {
        console.error('Failed to parse settings from localStorage', e);
      }
    }
  }, []);

  const handleSave = () => {
    try {
      localStorage.setItem('sair_settings', JSON.stringify(settings));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      console.error('Failed to save settings to localStorage', e);
    }
  };

  // ─── TAB 1: FEATURE FLAGS ────────────────────────────────────────────────
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [flagsLoading, setFlagsLoading] = useState(true);
  const [flagsError, setFlagsError] = useState<string | null>(null);
  const [savingFlagId, setSavingFlagId] = useState<string | null>(null);

  useEffect(() => {
    if (activeTab === 1) {
      setFlagsLoading(true);
      supabaseClient
        .from('feature_flags')
        .select('*')
        .order('name')
        .then(({ data, error: err }) => {
          if (err) {
            setFlagsError(err.message);
          } else {
            setFlags(data as FeatureFlag[]);
          }
          setFlagsLoading(false);
        });
    }
  }, [activeTab]);

  const toggleFlag = async (id: string, current: boolean) => {
    setSavingFlagId(id);
    const { error: err } = await supabaseClient
      .from('feature_flags')
      .update({ enabled: !current, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (err) {
      setFlagsError(err.message);
    } else {
      setFlags((prev) => prev.map((f) => (f.id === id ? { ...f, enabled: !current } : f)));
    }
    setSavingFlagId(null);
  };

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
          <Tab label={t('settings.title', 'Settings')} />
          <Tab label={t('nav.featureFlags', 'Feature Flags')} />
        </Tabs>
      </Paper>

      {/* TAB 0: GENERAL SETTINGS */}
      {activeTab === 0 && (
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {t('settings.description', 'Manage application-wide settings and feature toggles.')}
          </Typography>

          {saved && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {t('settings.saved', 'Settings saved successfully!')}
            </Alert>
          )}

          <Card elevation={2} sx={{ maxWidth: 700 }}>
            <CardContent>
              <Box display="flex" flexDirection="column" gap={3}>
                <Typography variant="h6" sx={{ fontFamily: 'var(--font-noto-arabic), sans-serif' }}>{t('settings.sectionGeneral', 'General')}</Typography>
                <TextField
                  label={t('settings.fieldAppName', 'App Name')}
                  value={settings.appName}
                  onChange={(e) => setSettings({ ...settings, appName: e.target.value })}
                  fullWidth
                  InputProps={{ style: { fontFamily: 'var(--font-noto-arabic), sans-serif' } }}
                  InputLabelProps={{ style: { fontFamily: 'var(--font-noto-arabic), sans-serif' } }}
                />

                <FormControl fullWidth>
                  <InputLabel sx={{ fontFamily: 'var(--font-noto-arabic), sans-serif' }}>{t('settings.fieldDefaultLang', 'Default Language')}</InputLabel>
                  <Select
                    value={settings.defaultLanguage}
                    label={t('settings.fieldDefaultLang', 'Default Language')}
                    onChange={(e) => setSettings({ ...settings, defaultLanguage: e.target.value })}
                    sx={{ fontFamily: 'var(--font-noto-arabic), sans-serif' }}
                  >
                    <MenuItem value="ar" sx={{ fontFamily: 'var(--font-noto-arabic), sans-serif' }}>{t('settings.langArabic', 'Arabic')}</MenuItem>
                    <MenuItem value="en" sx={{ fontFamily: 'var(--font-noto-arabic), sans-serif' }}>{t('settings.langEnglish', 'English')}</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  type="number"
                  label={t('settings.fieldSessionTimeout', 'Session Timeout (minutes)')}
                  value={settings.sessionTimeoutMinutes}
                  onChange={(e) =>
                    setSettings({ ...settings, sessionTimeoutMinutes: Number(e.target.value) })
                  }
                  fullWidth
                  InputProps={{ style: { fontFamily: 'var(--font-noto-arabic), sans-serif' } }}
                  InputLabelProps={{ style: { fontFamily: 'var(--font-noto-arabic), sans-serif' } }}
                />

                <Divider />
                <Typography variant="h6" sx={{ fontFamily: 'var(--font-noto-arabic), sans-serif' }}>{t('settings.sectionFeatures', 'Features')}</Typography>

                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.enablePushNotifications}
                      onChange={(e) =>
                        setSettings({ ...settings, enablePushNotifications: e.target.checked })
                      }
                    />
                  }
                  label={<Typography sx={{ fontFamily: 'var(--font-noto-arabic), sans-serif' }}>{t('settings.fieldPushNotif', 'Push Notifications')}</Typography>}
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.enableChat}
                      onChange={(e) => setSettings({ ...settings, enableChat: e.target.checked })}
                    />
                  }
                  label={<Typography sx={{ fontFamily: 'var(--font-noto-arabic), sans-serif' }}>{t('settings.fieldChat', 'In-App Chat')}</Typography>}
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.enableRatings}
                      onChange={(e) => setSettings({ ...settings, enableRatings: e.target.checked })}
                    />
                  }
                  label={<Typography sx={{ fontFamily: 'var(--font-noto-arabic), sans-serif' }}>{t('settings.fieldRatings', 'Trip Ratings')}</Typography>}
                />

                <Divider />
                <Typography variant="h6" sx={{ fontFamily: 'var(--font-noto-arabic), sans-serif' }}>{t('settings.sectionSecurity', 'Security')}</Typography>

                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.maintenanceMode}
                      onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                      color="warning"
                    />
                  }
                  label={<Typography sx={{ fontFamily: 'var(--font-noto-arabic), sans-serif' }}>{t('settings.fieldMaintenance', 'Maintenance Mode')}</Typography>}
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.allowNewRegistrations}
                      onChange={(e) =>
                        setSettings({ ...settings, allowNewRegistrations: e.target.checked })
                      }
                    />
                  }
                  label={<Typography sx={{ fontFamily: 'var(--font-noto-arabic), sans-serif' }}>{t('settings.fieldRegistrations', 'Allow New Registrations')}</Typography>}
                />

                <Divider />
                <Typography variant="h6" sx={{ fontFamily: 'var(--font-noto-arabic), sans-serif' }}>{t('settings.sectionLimits', 'Limits')}</Typography>

                <TextField
                  type="number"
                  label={t('settings.fieldMaxCapacity', 'Max Trip Capacity')}
                  value={settings.maxTripCapacity}
                  onChange={(e) =>
                    setSettings({ ...settings, maxTripCapacity: Number(e.target.value) })
                  }
                  fullWidth
                  InputProps={{ style: { fontFamily: 'var(--font-noto-arabic), sans-serif' } }}
                  InputLabelProps={{ style: { fontFamily: 'var(--font-noto-arabic), sans-serif' } }}
                />

                <TextField
                  type="number"
                  label={t('settings.fieldCodeLength', 'License Code Length')}
                  value={settings.licenseCodeLength}
                  onChange={(e) =>
                    setSettings({ ...settings, licenseCodeLength: Number(e.target.value) })
                  }
                  fullWidth
                  InputProps={{ style: { fontFamily: 'var(--font-noto-arabic), sans-serif' } }}
                  InputLabelProps={{ style: { fontFamily: 'var(--font-noto-arabic), sans-serif' } }}
                />

                <Button
                  variant="contained"
                  onClick={handleSave}
                  startIcon={<Save />}
                  size="large"
                  sx={{ mt: 2, fontFamily: 'var(--font-noto-arabic), sans-serif' }}
                >
                  {t('settings.saveButton', 'Save Settings')}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      )}

      {/* TAB 1: FEATURE FLAGS */}
      {activeTab === 1 && (
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {t('featureFlags.description', 'Toggle features on/off for the mobile app in real-time.')}
          </Typography>

          {flagsError && <Alert severity="error" sx={{ mb: 3 }}>{flagsError}</Alert>}

          {flagsLoading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper} elevation={2}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontFamily: 'var(--font-noto-arabic), sans-serif', fontWeight: 600 }}>{t('featureFlags.flagName', 'Flag Name')}</TableCell>
                    <TableCell sx={{ fontFamily: 'var(--font-noto-arabic), sans-serif', fontWeight: 600 }}>{t('featureFlags.description_field', 'Description')}</TableCell>
                    <TableCell sx={{ fontFamily: 'var(--font-noto-arabic), sans-serif', fontWeight: 600 }}>{t('common.status', 'Status')}</TableCell>
                    <TableCell align="right" sx={{ fontFamily: 'var(--font-noto-arabic), sans-serif', fontWeight: 600 }}>{t('featureFlags.toggle', 'Toggle')}</TableCell>
                    <TableCell sx={{ fontFamily: 'var(--font-noto-arabic), sans-serif', fontWeight: 600 }}>{t('featureFlags.lastUpdated', 'Last Updated')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {flags.map((flag) => (
                    <TableRow key={flag.id}>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium" sx={{ fontFamily: 'var(--font-noto-arabic), sans-serif' }}>
                          {flag.name}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ fontFamily: 'var(--font-noto-arabic), sans-serif' }}>{flag.description}</TableCell>
                      <TableCell>
                        <Chip
                          label={
                            flag.enabled
                              ? t('featureFlags.enabled', 'Enabled')
                              : t('featureFlags.disabled', 'Disabled')
                          }
                          color={flag.enabled ? 'success' : 'default'}
                          size="small"
                          sx={{ fontFamily: 'var(--font-noto-arabic), sans-serif' }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Switch
                          checked={flag.enabled}
                          onChange={() => void toggleFlag(flag.id, flag.enabled)}
                          disabled={savingFlagId === flag.id}
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
          )}
        </Box>
      )}
    </>
  );
}
