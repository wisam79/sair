import { Redirect } from 'expo-router';
import React from 'react';

import { useAuthStore } from '@/stores';

export default function Index() {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Redirect href="/onboarding" />;
  }

  return <Redirect href="/(tabs)" />;
}
