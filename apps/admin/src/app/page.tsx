"use client";

import { Authenticated, useLogout, useList } from "@refinedev/core";
import { Box, Card, CardContent, Typography, Grid } from "@mui/material";

interface ProfileRecord {
  id: string;
  role: string;
  fullName: string;
}

interface RouteRecord {
  id: string;
  isActive: boolean;
  price: number;
}

interface TripRecord {
  id: string;
  status: string;
}

interface SubscriptionRecord {
  id: string;
  status: string;
}

function StatCard({ title, value, color }: { title: string; value: string | number; color: string }) {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Typography color="textSecondary" gutterBottom variant="overline">
          {title}
        </Typography>
        <Typography variant="h4" sx={{ color, fontWeight: "bold" }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default function Page() {
  const { mutate: logout } = useLogout();

  const { data: routesData } = useList({ resource: "routes", pagination: { pageSize: 0 } });
  const { data: tripsData } = useList({ resource: "trips", pagination: { pageSize: 0 } });
  const { data: profilesData } = useList({ resource: "profiles", pagination: { pageSize: 0 } });
  const { data: subscriptionsData } = useList({ resource: "subscriptions", pagination: { pageSize: 0 } });

  const totalRoutes = routesData?.total ?? 0;
  const activeRoutes = routesData?.data?.filter((r: RouteRecord) => r.isActive)?.length ?? 0;
  const totalTrips = tripsData?.total ?? 0;
  const activeTrips = tripsData?.data?.filter((t: TripRecord) => t.status === "in_transit" || t.status === "driver_waiting")?.length ?? 0;
  const totalUsers = profilesData?.total ?? 0;
  const totalDrivers = profilesData?.data?.filter((p: ProfileRecord) => p.role === "driver")?.length ?? 0;
  const activeSubscriptions = subscriptionsData?.data?.filter((s: SubscriptionRecord) => s.status === "active")?.length ?? 0;
  const totalRevenue = routesData?.data?.reduce((sum: number, r: RouteRecord) => sum + (r.isActive ? r.price : 0), 0) ?? 0;

  return (
    <Authenticated key="dashboard" fallback={<div>Loading or redirecting...</div>}>
      <Box sx={{ p: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
          <Typography variant="h4" fontWeight="bold">
            UniRide Admin Dashboard
          </Typography>
          <button
            onClick={() => logout()}
            className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700"
          >
            Logout
          </button>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Total Users" value={totalUsers} color="#007AFF" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Active Drivers" value={totalDrivers} color="#34C759" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Active Routes" value={activeRoutes} color="#5856D6" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Active Trips" value={activeTrips} color="#FF9500" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Total Routes" value={totalRoutes} color="#007AFF" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Total Trips" value={totalTrips} color="#34C759" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Active Subscriptions" value={activeSubscriptions} color="#5856D6" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Revenue (IQD)" value={totalRevenue.toLocaleString()} color="#FF9500" />
          </Grid>
        </Grid>

        {activeTrips > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
              Live Trips
            </Typography>
            <Card>
              <CardContent>
                <Typography color="textSecondary">
                  {activeTrips} trip(s) currently active. View details in the Trips section.
                </Typography>
              </CardContent>
            </Card>
          </Box>
        )}
      </Box>
    </Authenticated>
  );
}
