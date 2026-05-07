import * as Sentry from '@sentry/react-native';

const SENTRY_DSN = process.env.EXPO_PUBLIC_SENTRY_DSN || '';

export const initSentry = () => {
  if (!SENTRY_DSN || __DEV__) return;

  Sentry.init({
    dsn: SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
    tracesSampleRate: 0.2,
    _experiments: {
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
    },
    integrations: [Sentry.mobileReplayIntegration(), Sentry.reactNativeTracingIntegration()],
  });
};

export const captureError = (error: Error, context?: Record<string, unknown>) => {
  if (context) {
    Sentry.setContext('error_context', context);
  }
  Sentry.captureException(error);
};

export const addBreadcrumb = (message: string, category?: string, level?: Sentry.SeverityLevel) => {
  Sentry.addBreadcrumb({ message, category, level, timestamp: Date.now() / 1000 });
};
