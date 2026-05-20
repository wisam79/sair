'use client';

import { useEffect, useState } from 'react';
import { supabaseClient } from '../../providers/supabaseClient';
import { Box, Typography, Paper, Alert, CircularProgress } from '@mui/material';

interface ConnectionResults {
  profiles: number;
  trips: number;
  drivers: number;
  routes: number;
  audit_logs: number;
  currentUser: { id: string; email: string | undefined; role: string | undefined } | null;
}

export default function ConnectionTestPage() {
  const [results, setResults] = useState<ConnectionResults>({
    profiles: 0,
    trips: 0,
    drivers: 0,
    routes: 0,
    audit_logs: 0,
    currentUser: null,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const {
          data: { user },
        } = await supabaseClient.auth.getUser();

        const currentUser = user
          ? { id: user.id, email: user.email, role: user.app_metadata?.role as string | undefined }
          : null;

        const [profilesRes, tripsRes, driversRes, routesRes, logsRes] = await Promise.all([
          supabaseClient.from('profiles').select('*', { count: 'exact', head: true }),
          supabaseClient.from('trips').select('*', { count: 'exact', head: true }),
          supabaseClient.from('drivers').select('*', { count: 'exact', head: true }),
          supabaseClient.from('routes').select('*', { count: 'exact', head: true }),
          supabaseClient.from('audit_logs').select('*', { count: 'exact', head: true }),
        ]);

        setResults({
          profiles: profilesRes.count ?? 0,
          trips: tripsRes.count ?? 0,
          drivers: driversRes.count ?? 0,
          routes: routesRes.count ?? 0,
          audit_logs: logsRes.count ?? 0,
          currentUser,
        });
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }
    void fetchData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Database Connection Test
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Error: {error}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6">Current Session:</Typography>
        <pre>{JSON.stringify(results.currentUser, null, 2)}</pre>

        <Typography variant="h6" sx={{ mt: 3 }}>
          Record Counts:
        </Typography>
        <ul>
          <li>Profiles: {results.profiles}</li>
          <li>Drivers: {results.drivers}</li>
          <li>Routes: {results.routes}</li>
          <li>Trips: {results.trips}</li>
          <li>Audit Logs: {results.audit_logs}</li>
        </ul>

        {results.profiles === 0 && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            Warning: No profiles found. If you are logged in, this might be due to RLS policies
            blocking your access or an empty database.
          </Alert>
        )}
      </Paper>
    </Box>
  );
}
