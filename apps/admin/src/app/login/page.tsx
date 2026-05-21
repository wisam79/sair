'use client';

import { useLogin } from '@refinedev/core';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  Container,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import TranslateIcon from '@mui/icons-material/Translate';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useColorMode } from '../../providers/AppProvider';

export default function LoginPage() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language?.startsWith('ar') || false;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { mutate: login, isLoading, error } = useLogin();
  const { mode, toggleColorMode } = useColorMode();
  const isDark = mode === 'dark';

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login({ email, password });
  };

  const toggleLanguage = () => {
    const nextLang = i18n.language?.startsWith('ar') ? 'en' : 'ar';
    void i18n.changeLanguage(nextLang);
    localStorage.setItem('admin-lang', nextLang);
    document.documentElement.lang = nextLang;
    document.documentElement.dir = nextLang === 'ar' ? 'rtl' : 'ltr';
  };

  return (
    <Box
      className={isDark ? 'grid-pattern-dark' : 'grid-pattern'}
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: isDark ? '#06060a' : '#f8fafc',
        position: 'relative',
        p: 2,
        direction: isRTL ? 'rtl' : 'ltr',
        overflow: 'hidden',
      }}
    >
      {/* ── Floating Orbs ── */}
      <Box
        className="float-slow"
        sx={{
          position: 'absolute',
          top: '15%',
          left: '10%',
          width: 220,
          height: 220,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(59,130,246,${isDark ? 0.2 : 0.12}) 0%, transparent 70%)`,
          filter: 'blur(45px)',
          pointerEvents: 'none',
        }}
      />
      <Box
        className="float-medium"
        sx={{
          position: 'absolute',
          bottom: '15%',
          right: '12%',
          width: 280,
          height: 280,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(139,92,246,${isDark ? 0.18 : 0.1}) 0%, transparent 70%)`,
          filter: 'blur(50px)',
          pointerEvents: 'none',
        }}
      />
      <Box
        className="float-fast"
        sx={{
          position: 'absolute',
          top: '45%',
          right: '28%',
          width: 140,
          height: 140,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(6,182,212,${isDark ? 0.15 : 0.08}) 0%, transparent 70%)`,
          filter: 'blur(35px)',
          pointerEvents: 'none',
        }}
      />

      {/* ── Corner Decorations ── */}
      <Box
        sx={{
          position: 'absolute',
          top: 60,
          left: isRTL ? 'auto' : 40,
          right: isRTL ? 40 : 'auto',
          opacity: 0.12,
          color: isDark ? '#60a5fa' : '#3b82f6',
          fontSize: 24,
          fontWeight: 200,
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        +
      </Box>
      <Box
        sx={{
          position: 'absolute',
          bottom: 40,
          right: isRTL ? 'auto' : 40,
          left: isRTL ? 40 : 'auto',
          opacity: 0.12,
          color: isDark ? '#8b5cf6' : '#7c3aed',
          fontSize: 24,
          fontWeight: 200,
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        +
      </Box>
      <Box
        sx={{
          position: 'absolute',
          top: 60,
          right: isRTL ? 'auto' : 90,
          left: isRTL ? 90 : 'auto',
          opacity: 0.06,
          color: isDark ? '#06b6d4' : '#0891b2',
          fontSize: 12,
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        ●
      </Box>

      {/* ── Floating Settings Controls ── */}
      <Box
        sx={{
          position: 'absolute',
          top: 24,
          right: isRTL ? 'auto' : 24,
          left: isRTL ? 24 : 'auto',
          display: 'flex',
          gap: 1.5,
          zIndex: 10,
        }}
      >
        {/* Language switcher */}
        <Tooltip title={isRTL ? 'Switch to English' : 'التحويل إلى العربية'}>
          <IconButton
            onClick={toggleLanguage}
            size="small"
            sx={{
              bgcolor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.6)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
              borderRadius: 2,
              px: 1.5,
              py: 0.8,
              gap: 0.8,
              color: isDark ? '#a1a1aa' : '#52525b',
              backdropFilter: 'blur(12px)',
              transition: 'all 0.25s ease',
              '&:hover': {
                bgcolor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.9)',
                color: isDark ? '#fff' : '#000',
                borderColor: isDark ? 'rgba(59,130,246,0.3)' : 'rgba(59,130,246,0.2)',
              },
            }}
          >
            <TranslateIcon sx={{ fontSize: 16 }} />
            <Typography variant="caption" fontWeight={700} sx={{ fontSize: '0.75rem' }}>
              {isRTL ? 'EN' : 'عر'}
            </Typography>
          </IconButton>
        </Tooltip>

        {/* Theme toggle */}
        <Tooltip title={isDark ? 'الوضع النهاري' : 'الوضع الليلي'}>
          <IconButton
            onClick={toggleColorMode}
            size="small"
            sx={{
              bgcolor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.6)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
              borderRadius: 2,
              p: 0.8,
              color: isDark ? '#a1a1aa' : '#52525b',
              backdropFilter: 'blur(12px)',
              transition: 'all 0.35s ease',
              '&:hover': {
                bgcolor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.9)',
                color: isDark ? '#fff' : '#000',
                borderColor: isDark ? 'rgba(59,130,246,0.3)' : 'rgba(59,130,246,0.2)',
                '& svg': { transform: 'rotate(180deg)' },
              },
              '& svg': { transition: 'transform 0.4s cubic-bezier(0.4,0,0.2,1)' },
            }}
          >
            {isDark ? (
              <LightModeIcon sx={{ fontSize: 18 }} />
            ) : (
              <DarkModeIcon sx={{ fontSize: 18 }} />
            )}
          </IconButton>
        </Tooltip>
      </Box>

      {/* ── Login Card ── */}
      <Container maxWidth="xs" sx={{ zIndex: 1 }}>
        <Paper
          elevation={0}
          className="page-enter border-glow"
          sx={{
            p: { xs: 3.5, sm: 5 },
            borderRadius: 6,
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(148,163,184,0.12)'}`,
            boxShadow: isDark
              ? '0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)'
              : '0 4px 32px rgba(15,23,42,0.08), inset 0 1px 0 rgba(255,255,255,0.9)',
            background: isDark ? 'rgba(10, 15, 30, 0.82)' : 'rgba(255, 255, 255, 0.78)',
            backdropFilter: 'blur(24px) saturate(1.4)',
            transition:
              'background-color 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease',
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
            <Chip
              icon={
                <AutoAwesomeIcon
                  sx={{
                    fontSize: '14px !important',
                    color: isDark ? '#fbbf24 !important' : '#d97706 !important',
                  }}
                />
              }
              label={t('nav.appTitle', 'UniRide Admin')}
              size="small"
              sx={{
                mb: 2.5,
                borderRadius: 99,
                height: 36,
                boxShadow: 'none',
                color: isDark ? '#93c5fd' : '#3b82f6',
                bgcolor: isDark ? 'rgba(59,130,246,0.1)' : 'rgba(59,130,246,0.06)',
                border: `1px solid ${isDark ? 'rgba(59,130,246,0.15)' : 'rgba(59,130,246,0.1)'}`,
                fontWeight: 700,
                px: 1,
                '& .MuiChip-label': { fontSize: '0.8rem' },
              }}
            />
            <Box
              className="logo-pulse"
              sx={{
                width: 68,
                height: 68,
                borderRadius: 4,
                background: 'linear-gradient(135deg, #3b82f6 0%, #7c3aed 50%, #2563eb 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2.5,
                position: 'relative',
                boxShadow: '0 20px 50px rgba(59,130,246,0.35)',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  inset: -3,
                  borderRadius: 5,
                  background: 'linear-gradient(135deg, #3b82f6, #8b5cf6, #06b6d4)',
                  zIndex: -1,
                  opacity: 0.4,
                  filter: 'blur(8px)',
                },
              }}
            >
              <DirectionsBusIcon sx={{ color: 'white', fontSize: 34 }} />
            </Box>
            <Typography
              component="h1"
              variant="h5"
              fontWeight={800}
              sx={{
                mb: 1,
                ...(isDark
                  ? {
                      background: 'linear-gradient(135deg, #ffffff 0%, #93c5fd 50%, #c4b5fd 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }
                  : { color: 'text.primary' }),
              }}
            >
              {t('login.title', 'UniRide Admin')}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              align="center"
              sx={{ fontSize: '0.85rem' }}
            >
              {t('login.subtitle', 'Sign in to manage the platform')}
            </Typography>
          </Box>

          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                borderRadius: 3,
                fontWeight: 600,
              }}
            >
              {t('login.error', 'Invalid email or password')}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
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
              sx={{
                '& .MuiOutlinedInput-root.Mui-focused': {
                  boxShadow: `0 0 0 3px rgba(59,130,246,${isDark ? '0.15' : '0.1'})`,
                },
              }}
              slotProps={{
                htmlInput: {
                  style: {
                    direction: 'ltr',
                    textAlign: isRTL ? 'right' : 'left',
                  },
                },
              }}
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
              sx={{
                '& .MuiOutlinedInput-root.Mui-focused': {
                  boxShadow: `0 0 0 3px rgba(59,130,246,${isDark ? '0.15' : '0.1'})`,
                },
              }}
              slotProps={{
                htmlInput: {
                  style: {
                    direction: 'ltr',
                    textAlign: isRTL ? 'right' : 'left',
                  },
                },
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isLoading}
              sx={{
                mt: 4,
                mb: 2.5,
                py: 1.6,
                fontSize: '15px',
                fontWeight: 800,
                borderRadius: 99,
                background: 'linear-gradient(135deg, #3b82f6 0%, #7c3aed 50%, #2563eb 100%)',
                backgroundSize: '200% 200%',
                boxShadow: isDark
                  ? '0 8px 24px rgba(59,130,246,0.3)'
                  : '0 8px 24px rgba(59,130,246,0.2)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'linear-gradient(135deg, #60a5fa 0%, #8b5cf6 50%, #3b82f6 100%)',
                  backgroundSize: '200% 200%',
                  boxShadow: isDark
                    ? '0 12px 32px rgba(59,130,246,0.45)'
                    : '0 12px 32px rgba(59,130,246,0.3)',
                  transform: 'translateY(-1px)',
                },
                '&:active': {
                  transform: 'translateY(0)',
                },
                '&.Mui-disabled': {
                  background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
                },
              }}
            >
              {isLoading ? t('login.signingIn', 'Signing in...') : t('login.signIn', 'Sign in')}
            </Button>
          </Box>

          <Box
            sx={{
              mt: 3,
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
              <LockOutlinedIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
              <Typography variant="caption" color="text.disabled" fontWeight={600}>
                {t('login.secure', 'Secure admin access')}
              </Typography>
            </Box>
            <Typography
              variant="caption"
              color="text.disabled"
              sx={{ fontSize: '0.6rem', opacity: 0.6 }}
            >
              v2.0 — {t('login.poweredBy', 'Powered by UniRide')}
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
