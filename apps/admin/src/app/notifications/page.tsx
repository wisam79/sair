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
  Grid,
  Stack,
  InputAdornment,
  Divider,
  Chip,
  useTheme,
} from '@mui/material';
import { supabaseClient } from '../../providers/supabaseClient';
import { useTranslation } from 'react-i18next';
import CampaignIcon from '@mui/icons-material/Campaign';
import SendIcon from '@mui/icons-material/Send';
import TitleIcon from '@mui/icons-material/Title';
import MessageIcon from '@mui/icons-material/Message';
import GroupIcon from '@mui/icons-material/Group';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';

import { Create } from '@refinedev/mui';

export default function NotificationsPage() {
  const { t } = useTranslation();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

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
      const response = await supabaseClient.functions.invoke('send-notification', {
        body: {
          title,
          body,
          target_role: targetRole,
        },
      });

      if (response.error) {
        let errorMsg =
          response.error instanceof Error ? response.error.message : String(response.error);
        try {
          const errObj = response.error as any;
          if (errObj.context && typeof errObj.context.json === 'function') {
            const responseBody = await errObj.context.json();
            if (responseBody && responseBody.error) {
              errorMsg = responseBody.error;
            }
          }
        } catch {
          // Ignore json parsing failures and use fallback message
        }
        setResult({ success: false, message: errorMsg });
      } else {
        const responseData = response.data as Record<string, unknown> | null;
        const sentCount =
          typeof responseData?.sent_count === 'number' ? responseData.sent_count : 0;
        setResult({
          success: true,
          message: `${t('notifications.sentCount', 'Notification sent to')} ${sentCount} ${t('notifications.targetAll', 'users')}`,
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
    <Create
      title={t('notifications.title', 'Send Push Notification')}
      breadcrumb={null}
      footerButtons={null}
    >
      {result && (
        <Alert severity={result.success ? 'success' : 'error'} sx={{ mb: 4, maxWidth: '1200px' }}>
          {result.message}
        </Alert>
      )}

      <Grid container spacing={4} sx={{ maxWidth: '1200px', mt: 0.5 }}>
        {/* Column 1: Broadcast Form Card */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Title Field */}
              <TextField
                label={t('notifications.fieldTitle', 'Title')}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
                required
                size="small"
                inputProps={{ maxLength: 100 }}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <TitleIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
              />

              {/* Body Field */}
              <TextField
                label={t('notifications.fieldBody', 'Message Body')}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                fullWidth
                required
                multiline
                rows={4}
                size="small"
                inputProps={{ maxLength: 500 }}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                      <MessageIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
              />

              {/* Target Audience Field */}
              <TextField
                select
                label={t('notifications.fieldTarget', 'Target Audience')}
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                fullWidth
                size="small"
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <GroupIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
              >
                {TARGET_ROLES.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </TextField>

              <Divider sx={{ my: 0.5 }} />

              {/* Submit Button */}
              <Button
                variant="contained"
                onClick={() => {
                  void handleSend();
                }}
                disabled={sending || !title.trim() || !body.trim()}
                size="large"
                startIcon={!sending && <SendIcon />}
                fullWidth
                sx={{ py: 1.2, fontWeight: 'bold' }}
              >
                {sending ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  t('notifications.sendButton', 'Send Notification')
                )}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Column 2: Live Smartphone Preview */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Stack spacing={2} alignItems="center" sx={{ width: '100%' }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ alignSelf: 'center' }}>
              <SmartphoneIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
              <Typography variant="caption" fontWeight={600} color="text.secondary">
                معاينة حية على الهاتف (Live Device Preview)
              </Typography>
            </Stack>

            {/* Smartphone Container */}
            <Box
              sx={{
                width: '310px',
                height: '520px',
                borderRadius: '36px',
                border: '10px solid #2d2d2d',
                position: 'relative',
                boxShadow: isDark
                  ? '0 20px 40px rgba(0,0,0,0.6), inset 0 0 15px rgba(255,255,255,0.05)'
                  : '0 20px 40px rgba(15,23,42,0.1), inset 0 0 15px rgba(0,0,0,0.05)',
                overflow: 'hidden',
                background: 'linear-gradient(135deg, #1e1e1e 0%, #111111 100%)',
              }}
            >
              {/* Screen Notch / Camera punch hole */}
              <Box
                sx={{
                  position: 'absolute',
                  top: '10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '80px',
                  height: '16px',
                  borderRadius: '8px',
                  bgcolor: '#000',
                  zIndex: 10,
                }}
              />

              {/* Wallpaper & Lockscreen Content */}
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  position: 'relative',
                  background: 'linear-gradient(180deg, #16A34A 0%, #242424 60%, #161616 100%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  p: 2,
                  pt: 5,
                }}
              >
                {/* Clock */}
                <Typography
                  variant="h4"
                  fontWeight={700}
                  sx={{
                    color: '#fff',
                    opacity: 0.9,
                    mb: 0.25,
                    fontSize: '2.1rem',
                    fontFamily: 'system-ui, sans-serif',
                  }}
                >
                  09:41
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: '#fff',
                    opacity: 0.7,
                    fontWeight: 600,
                    fontSize: '9px',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    mb: 4,
                  }}
                >
                  Tuesday, May 26
                </Typography>

                {/* Live Notification Banner */}
                <Box
                  sx={{
                    width: '100%',
                    bgcolor: 'rgba(255, 255, 255, 0.12)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '16px',
                    p: 1.5,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                    direction: 'rtl',
                    textAlign: 'right',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {/* Notification App Header */}
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ mb: 1 }}
                  >
                    <Stack direction="row" spacing={0.75} alignItems="center">
                      <Box
                        sx={{
                          width: 18,
                          height: 18,
                          borderRadius: '4px',
                          bgcolor: '#16A34A',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <DirectionsBusIcon sx={{ color: '#fff', fontSize: 11 }} />
                      </Box>
                      <Typography
                        variant="caption"
                        fontWeight={700}
                        sx={{ color: '#fff', opacity: 0.9, fontSize: '10.5px' }}
                      >
                        Sair • سير
                      </Typography>
                    </Stack>
                    <Typography
                      variant="caption"
                      sx={{ color: '#fff', opacity: 0.6, fontSize: '9.5px' }}
                    >
                      الآن
                    </Typography>
                  </Stack>

                  {/* Notification Title */}
                  <Typography
                    variant="body2"
                    fontWeight={700}
                    sx={{
                      color: '#fff',
                      mb: 0.25,
                      fontSize: '12px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {title.trim() ? title : 'عنوان الإشعار يظهر هنا'}
                  </Typography>

                  {/* Notification Body */}
                  <Typography
                    variant="caption"
                    sx={{
                      color: 'rgba(255,255,255,0.85)',
                      fontSize: '10.5px',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      lineHeight: 1.35,
                    }}
                  >
                    {body.trim()
                      ? body
                      : 'محتوى رسالة التنبيه التي ستصل للمستخدمين ستظهر هنا في هذا المربع بشكل مباشر...'}
                  </Typography>

                  {/* Target Audience Chip */}
                  <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-start' }}>
                    <Chip
                      label={
                        targetRole === 'all'
                          ? 'الجميع'
                          : targetRole === 'student'
                            ? 'الطلاب فقط'
                            : 'السائقين فقط'
                      }
                      size="small"
                      sx={{
                        height: '15px',
                        fontSize: '8.5px',
                        fontWeight: 700,
                        bgcolor: 'rgba(255,255,255,0.15)',
                        color: '#fff',
                        border: 'none',
                        '& .MuiChip-label': { px: 0.8 },
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </Create>
  );
}
