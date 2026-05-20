'use client';
import { useLogin } from '@refinedev/core';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, TextField, Button, Typography, Paper, Alert, Container, Chip } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';

export default function LoginPage() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { mutate: login, isLoading, error } = useLogin();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login({ email, password });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background:
          'radial-gradient(circle at top, rgba(59,130,246,0.12) 0%, rgba(248,250,252,1) 38%, rgba(241,245,249,1) 100%)',
        direction: isRTL ? 'rtl' : 'ltr',
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 4,
            border: '1px solid rgba(148,163,184,0.18)',
            boxShadow: '0 24px 60px rgba(15,23,42,0.12)',
            background: 'rgba(255,255,255,0.88)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <Chip
              label={t('nav.appTitle', 'UniRide Admin')}
              sx={{
                mb: 2,
                borderRadius: 99,
                bgcolor: 'rgba(37,99,235,0.08)',
                color: 'primary.main',
              }}
            />
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
                boxShadow: '0 16px 35px rgba(37,99,235,0.35)',
              }}
            >
              <DirectionsBusIcon sx={{ color: 'white', fontSize: 36 }} />
            </Box>
            <Typography component="h1" variant="h4" fontWeight="bold" color="primary.main">
              {t('login.title', 'UniRide Admin')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {t('login.subtitle', 'Sign in to manage the platform')}
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {t('login.error', 'Invalid email or password')}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label={t('login.emailLabel', 'Email address')}
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              dir={isRTL ? 'rtl' : 'ltr'}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label={t('login.passwordLabel', 'Password')}
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              dir={isRTL ? 'rtl' : 'ltr'}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isLoading}
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                fontSize: '16px',
                fontWeight: 'bold',
                borderRadius: 99,
                boxShadow: '0 14px 30px rgba(37,99,235,0.26)',
              }}
            >
              {isLoading ? t('login.signingIn', 'Signing in...') : t('login.signIn', 'Sign in')}
            </Button>
          </Box>

          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <LockOutlinedIcon
              sx={{ fontSize: 14, color: 'text.disabled', verticalAlign: 'middle', mr: 0.5 }}
            />
            <Typography variant="caption" color="text.disabled">
              {t('login.secure', 'Secure admin access')}
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
