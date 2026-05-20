'use client';

import { Refine, type I18nProvider } from '@refinedev/core';
import { RefineKbarProvider } from '@refinedev/kbar';
import { useNotificationProvider, RefineSnackbarProvider } from '@refinedev/mui';
import routerProvider from '@refinedev/nextjs-router';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { authProvider } from './authProvider';
import { dataProvider } from './dataProvider';
import { adminTheme } from './theme';
import { Suspense } from 'react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import '../i18n';

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
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <ThemeProvider theme={adminTheme}>
      <CssBaseline />
      <RefineKbarProvider>
        <RefineSnackbarProvider>
          <I18nProviderWrapper>{children}</I18nProviderWrapper>
        </RefineSnackbarProvider>
      </RefineKbarProvider>
    </ThemeProvider>
  );
};
