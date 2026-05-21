'use client';

import React from 'react';
import { useGetIdentity } from '@refinedev/core';
import { AppBar, Avatar, IconButton, Stack, Toolbar, Typography, useTheme } from '@mui/material';
import { HamburgerMenu } from '@refinedev/mui';
import TranslateIcon from '@mui/icons-material/Translate';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useTranslation } from 'react-i18next';
import { useColorMode } from '../providers/AppProvider';

export const Header: React.FC = () => {
  const theme = useTheme();
  const { mode, toggleColorMode } = useColorMode();
  const { data: user } = useGetIdentity<{
    name: string;
    avatar: string;
  }>();

  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'ar' ? 'en' : 'ar';
    void i18n.changeLanguage(nextLang);
    document.documentElement.lang = nextLang;
    document.documentElement.dir = nextLang === 'ar' ? 'rtl' : 'ltr';
  };

  const isDark = mode === 'dark';

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: isDark ? 'rgba(17, 24, 39, 0.8)' : 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${theme.palette.divider}`,
        color: theme.palette.text.primary,
        zIndex: theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar>
        <HamburgerMenu />
        <Stack
          direction="row"
          width="100%"
          justifyContent="flex-end"
          alignItems="center"
          gap="12px"
        >
          {/* Language Toggle */}
          <IconButton onClick={toggleLanguage} color="inherit">
            <TranslateIcon sx={{ fontSize: 20 }} />
            <Typography variant="body2" sx={{ ml: 1, fontWeight: 700 }}>
              {i18n.language === 'ar' ? 'EN' : 'عربي'}
            </Typography>
          </IconButton>

          {/* Theme Toggle */}
          <IconButton onClick={toggleColorMode} color="inherit">
            {isDark ? (
              <LightModeIcon sx={{ fontSize: 20 }} />
            ) : (
              <DarkModeIcon sx={{ fontSize: 20 }} />
            )}
          </IconButton>

          {/* User Profile */}
          <Stack direction="row" gap="12px" alignItems="center">
            {user?.name && (
              <Typography
                sx={{
                  display: {
                    xs: 'none',
                    sm: 'inline-block',
                  },
                  fontWeight: 600,
                }}
                variant="subtitle2"
                color="text.primary"
              >
                {user?.name}
              </Typography>
            )}
            <Avatar
              src={user?.avatar}
              alt={user?.name}
              sx={{
                width: 36,
                height: 36,
                border: `2px solid ${theme.palette.primary.main}`,
              }}
            >
              {user?.name?.charAt(0) || 'A'}
            </Avatar>
          </Stack>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};
