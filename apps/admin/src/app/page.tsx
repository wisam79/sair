import { createClient } from '../providers/supabase';
import DashboardClient from '../components/DashboardClient';
import { Box, Typography } from '@mui/material';

interface DashboardStats {
  total_users: number;
  total_drivers: number;
  total_routes: number;
  active_routes: number;
  total_trips: number;
  active_trips: number;
  total_subscriptions: number;
  active_subscriptions: number;
  monthly_revenue: number;
}

async function getStats(): Promise<DashboardStats | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc('get_dashboard_stats');

    if (error) {
      console.error('[DashboardPage] RPC error:', error);
      return null;
    }

    return data as DashboardStats;
  } catch (err) {
    console.error('[DashboardPage] Error fetching stats:', err);
    return null;
  }
}

export default async function Page() {
  try {
    const stats = await getStats();

    if (!stats) {
      return (
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          minHeight="400px"
          gap={2}
        >
          <Typography>Failed to load dashboard statistics</Typography>
          <Typography variant="caption" color="text.secondary">
            Please check your database connection and try again
          </Typography>
        </Box>
      );
    }

    return <DashboardClient stats={stats} />;
  } catch (err) {
    console.error('[DashboardPage] Error in Page component:', err);
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
        gap={2}
      >
        <Typography>An unexpected error occurred</Typography>
        <Typography variant="caption" color="text.secondary">
          Please refresh the page or contact support if the problem persists
        </Typography>
      </Box>
    );
  }
}
