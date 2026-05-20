'use client';

import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  MenuItem,
  Alert,
  CircularProgress,
} from '@mui/material';
import { supabaseClient } from '../../providers/supabaseClient';
import { useTranslation } from 'react-i18next';

export default function NotificationsPage() {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [targetRole, setTargetRole] = useState('all');
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const TARGET_ROLES = [
    { value: 'all', label: t('notifications.targetAll', 'All Users') },
    { value: 'student', label: t('notifications.targetStudents', 'Students Only') },
    { value: 'driver', label: t('notifications.targetDrivers', 'Drivers Only') },
  ];

  const handleSend = async () => {
    if (!title.trim() || !body.trim()) {
      setResult({
        success: false,
        message: t('notifications.validationRequired', 'Title and body are required'),
      });
      return;
    }

    setSending(true);
    setResult(null);

    try {
      const { data, error } = await supabaseClient.functions.invoke('send-notification', {
        body: {
          title,
          body,
          targetRole: targetRole === 'all' ? undefined : targetRole,
        },
      });

      if (error) {
        setResult({ success: false, message: error.message });
      } else {
        setResult({
          success: true,
          message: `${t('notifications.sentCount', 'Notification sent to')} ${data?.sent_count || 0} ${t('notifications.targetAll', 'users')}`,
        });
        setTitle('');
        setBody('');
      }
    } catch (e: unknown) {
      setResult({
        success: false,
        message:
          e instanceof Error
            ? e.message
            : t('notifications.sendFailed', 'Failed to send notification'),
      });
    }

    setSending(false);
  };

  return (
    <Box p={3}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        {t('notifications.title', 'Send Push Notification')}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {t(
          'notifications.description',
          'Broadcast a push notification to mobile app users via Expo Push API.',
        )}
      </Typography>

      {result && (
        <Alert severity={result.success ? 'success' : 'error'} sx={{ mb: 3 }}>
          {result.message}
        </Alert>
      )}

      <Card elevation={2} sx={{ maxWidth: 600 }}>
        <CardContent>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label={t('notifications.fieldTitle', 'Title')}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              required
              inputProps={{ maxLength: 100 }}
            />

            <TextField
              label={t('notifications.fieldBody', 'Message Body')}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              fullWidth
              required
              multiline
              rows={4}
              inputProps={{ maxLength: 500 }}
            />

            <TextField
              select
              label={t('notifications.fieldTarget', 'Target Audience')}
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              fullWidth
            >
              {TARGET_ROLES.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </TextField>

            <Button
              variant="contained"
              onClick={handleSend}
              disabled={sending || !title.trim() || !body.trim()}
              size="large"
            >
              {sending ? (
                <CircularProgress size={24} />
              ) : (
                t('notifications.sendButton', 'Send Notification')
              )}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
