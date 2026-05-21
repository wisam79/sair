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
} from '@mui/material';
import { Save } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const DEFAULT_SETTINGS = {
  appName: 'Sair',
  defaultLanguage: 'ar',
  maintenanceMode: false,
  allowNewRegistrations: true,
  maxTripCapacity: 50,
  licenseCodeLength: 8, // Correct default is 8
  sessionTimeoutMinutes: 60,
  enablePushNotifications: true,
  enableChat: true,
  enableRatings: true,
};

export default function SettingsPage() {
  const { t } = useTranslation();
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

  return (
    <Box p={3}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        {t('settings.title', 'Settings & Configuration')}
      </Typography>
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
            <Typography variant="h6">{t('settings.sectionGeneral', 'General')}</Typography>
            <TextField
              label={t('settings.fieldAppName', 'App Name')}
              value={settings.appName}
              onChange={(e) => setSettings({ ...settings, appName: e.target.value })}
              fullWidth
            />

            <FormControl fullWidth>
              <InputLabel>{t('settings.fieldDefaultLang', 'Default Language')}</InputLabel>
              <Select
                value={settings.defaultLanguage}
                label={t('settings.fieldDefaultLang', 'Default Language')}
                onChange={(e) => setSettings({ ...settings, defaultLanguage: e.target.value })}
              >
                <MenuItem value="ar">{t('settings.langArabic', 'Arabic')}</MenuItem>
                <MenuItem value="en">{t('settings.langEnglish', 'English')}</MenuItem>
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
            />

            <Divider />
            <Typography variant="h6">{t('settings.sectionFeatures', 'Features')}</Typography>

            <FormControlLabel
              control={
                <Switch
                  checked={settings.enablePushNotifications}
                  onChange={(e) =>
                    setSettings({ ...settings, enablePushNotifications: e.target.checked })
                  }
                />
              }
              label={t('settings.fieldPushNotif', 'Push Notifications')}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={settings.enableChat}
                  onChange={(e) => setSettings({ ...settings, enableChat: e.target.checked })}
                />
              }
              label={t('settings.fieldChat', 'In-App Chat')}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={settings.enableRatings}
                  onChange={(e) => setSettings({ ...settings, enableRatings: e.target.checked })}
                />
              }
              label={t('settings.fieldRatings', 'Trip Ratings')}
            />

            <Divider />
            <Typography variant="h6">{t('settings.sectionSecurity', 'Security')}</Typography>

            <FormControlLabel
              control={
                <Switch
                  checked={settings.maintenanceMode}
                  onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                  color="warning"
                />
              }
              label={t('settings.fieldMaintenance', 'Maintenance Mode')}
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
              label={t('settings.fieldRegistrations', 'Allow New Registrations')}
            />

            <Divider />
            <Typography variant="h6">{t('settings.sectionLimits', 'Limits')}</Typography>

            <TextField
              type="number"
              label={t('settings.fieldMaxCapacity', 'Max Trip Capacity')}
              value={settings.maxTripCapacity}
              onChange={(e) =>
                setSettings({ ...settings, maxTripCapacity: Number(e.target.value) })
              }
              fullWidth
            />

            <TextField
              type="number"
              label={t('settings.fieldCodeLength', 'License Code Length')}
              value={settings.licenseCodeLength}
              onChange={(e) =>
                setSettings({ ...settings, licenseCodeLength: Number(e.target.value) })
              }
              fullWidth
            />

            <Button
              variant="contained"
              onClick={handleSave}
              startIcon={<Save />}
              size="large"
              sx={{ mt: 2 }}
            >
              {t('settings.saveButton', 'Save Settings')}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
