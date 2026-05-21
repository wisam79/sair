'use client';

import { Refine, type I18nProvider } from '@refinedev/core';
import { RefineKbarProvider } from '@refinedev/kbar';
import { useNotificationProvider, RefineSnackbarProvider } from '@refinedev/mui';
import routerProvider from '@refinedev/nextjs-router';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { authProvider } from './authProvider';
import { dataProvider } from './dataProvider';
import { getAdminTheme } from './theme';
import { RtlProvider } from './RtlProvider';
import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import '../i18n';

// Color Mode Context
export const ColorModeContext = createContext({
  toggleColorMode: () => {},
  mode: 'light' as 'light' | 'dark',
});

export const useColorMode = () => useContext(ColorModeContext);

const I18nProviderWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t, i18n } = useTranslation();

  const refineI18nProvider: I18nProvider = React.useMemo(
    () => ({
      translate: (key: string, params?: Record<string, unknown>) => {
        return t(key, params as Record<string, string>);
      },
      changeLocale: (lang: string) => {
        void i18n.changeLanguage(lang);
      },
      getLocale: () => i18n.language,
    }),
    [t, i18n],
  );

  return (
    <Refine
      i18nProvider={refineI18nProvider}
      dataProvider={dataProvider}
      authProvider={authProvider}
      routerProvider={routerProvider}
      notificationProvider={useNotificationProvider}
      resources={[
        {
          name: 'profiles',
          list: '/profiles',
          show: '/profiles/show/:id',
          meta: { label: t('profiles.titles.list', 'Users') },
        },
        {
          name: 'drivers',
          list: '/drivers',
          create: '/drivers/create',
          edit: '/drivers/edit/:id',
          show: '/drivers/show/:id',
          meta: { label: t('drivers.titles.list', 'Drivers Management') },
        },
        {
          name: 'routes',
          list: '/routes',
          create: '/routes/create',
          edit: '/routes/edit/:id',
          show: '/routes/show/:id',
          meta: { label: t('routes.titles.list', 'Routes') },
        },
        {
          name: 'trips',
          list: '/trips',
          meta: { label: t('trips.titles.list', 'Live Trips') },
        },
        {
          name: 'subscriptions',
          list: '/subscriptions',
          meta: { label: t('subscriptions.titles.list', 'Subscriptions') },
        },
        {
          name: 'license_batches',
          list: '/license_batches',
          create: '/license_batches/create',
          meta: { label: t('license_batches.titles.list', 'License Batches') },
        },
        {
          name: 'licenses',
          list: '/licenses',
          meta: { label: t('licenses.titles.list', 'Licenses') },
        },
        {
          name: 'institutions',
          list: '/institutions',
          create: '/institutions/create',
          edit: '/institutions/edit/:id',
          show: '/institutions/show/:id',
          meta: { label: t('institutions.titles.list', 'Institutions') },
        },
        {
          name: 'driver_payouts',
          list: '/payouts',
          meta: { label: t('payouts.title', 'Payouts') },
        },
        {
          name: 'ratings',
          list: '/ratings',
          meta: { label: t('ratings.titles.list', 'Ratings') },
        },
        {
          name: 'feature_flags',
          list: '/feature-flags',
          meta: { label: t('feature_flags.titles.list', 'Feature Flags') },
        },
      ]}
      options={{
        syncWithLocation: true,
        warnWhenUnsavedChanges: true,
      }}
    >
      {children}
    </Refine>
  );
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const { i18n } = useTranslation();

  useEffect(() => {
    setMounted(true);
    const savedMode = localStorage.getItem('theme-mode');
    if (savedMode === 'light' || savedMode === 'dark') {
      setMode(savedMode);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setMode('dark');
    }

    const savedLang = localStorage.getItem('admin-lang');
    if (savedLang === 'ar' || savedLang === 'en') {
      void i18n.changeLanguage(savedLang);
      document.documentElement.lang = savedLang;
      document.documentElement.dir = savedLang === 'ar' ? 'rtl' : 'ltr';
    }
  }, [i18n]);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          const nextMode = prevMode === 'light' ? 'dark' : 'light';
          localStorage.setItem('theme-mode', nextMode);
          return nextMode;
        });
      },
      mode,
    }),
    [mode],
  );

  const lang = i18n.language?.startsWith('en') ? 'en' : 'ar';
  const isRtl = lang === 'ar';
  const theme = useMemo(() => getAdminTheme(mode, lang), [mode, lang]);

  if (!mounted) {
    return null;
  }

  return (
    <ColorModeContext.Provider value={colorMode}>
      <RtlProvider isRtl={isRtl}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <RefineKbarProvider>
            <RefineSnackbarProvider>
              <I18nProviderWrapper>{children}</I18nProviderWrapper>
            </RefineSnackbarProvider>
          </RefineKbarProvider>
        </ThemeProvider>
      </RtlProvider>
    </ColorModeContext.Provider>
  );
};
