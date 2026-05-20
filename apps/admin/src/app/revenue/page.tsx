'use client';

import { useEffect, useState } from 'react';
import { supabaseClient } from '../../providers/supabaseClient';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { AttachMoney, TrendingUp, People, Star } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

interface TopRoute {
  title: string;
  subscriptions: number;
  price: number;
  revenue: number;
}

interface AnalyticsData {
  total_trips: number;
  completed_trips: number;
  cancelled_trips: number;
  total_revenue: number;
  active_students: number;
  active_drivers: number;
  avg_rating: number;
  trips_by_status: Record<string, number>;
  top_routes: TopRoute[];
}

export default function RevenuePage() {
  const { t } = useTranslation();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabaseClient.rpc('get_analytics_summary').then(({ data: result, error: err }) => {
      if (err) {
        setError(err.message);
      } else {
        setData(result as AnalyticsData);
      }
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box p={3}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        {t('revenue.title', 'Revenue Reports')}
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Card elevation={2}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <AttachMoney color="primary" fontSize="large" />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {t('revenue.totalRevenue', 'Total Revenue')}
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {data?.total_revenue?.toLocaleString() ?? 0} IQD
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card elevation={2}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <TrendingUp color="success" fontSize="large" />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {t('revenue.completedTrips', 'Completed Trips')}
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {data?.completed_trips ?? 0}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card elevation={2}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <People color="info" fontSize="large" />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {t('revenue.activeStudents', 'Active Students')}
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {data?.active_students ?? 0}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card elevation={2}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Star color="warning" fontSize="large" />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {t('revenue.avgRating', 'Avg Rating')}
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {data?.avg_rating?.toFixed(1) ?? t('common.na', 'N/A')}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Typography variant="h6" fontWeight="bold" gutterBottom>
        {t('revenue.topRoutes', 'Top Routes by Revenue')}
      </Typography>
      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('common.route', 'Route')}</TableCell>
              <TableCell align="right">{t('routes.fields.priceIqd', 'Price (IQD)')}</TableCell>
              <TableCell align="right">{t('nav.subscriptions', 'Subscriptions')}</TableCell>
              <TableCell align="right">{t('revenue.revenueIqd', 'Revenue (IQD)')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.top_routes?.map((route, idx) => (
              <TableRow key={idx}>
                <TableCell>{route.title}</TableCell>
                <TableCell align="right">{route.price.toLocaleString()}</TableCell>
                <TableCell align="right">{route.subscriptions}</TableCell>
                <TableCell align="right">
                  <Typography fontWeight="bold">{route.revenue.toLocaleString()}</Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
