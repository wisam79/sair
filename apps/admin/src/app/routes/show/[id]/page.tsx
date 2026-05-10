"use client";

import { Show, TextFieldComponent as TextField } from "@refinedev/mui";
import { Typography, Stack } from "@mui/material";
import { useShow, useOne } from "@refinedev/core";

export default function RouteShow() {
  const { queryResult } = useShow();
  const { data, isLoading } = queryResult;

  const record = data?.data;

  const { data: driverData, isLoading: driverIsLoading } = useOne({
    resource: "drivers",
    id: record?.driverId || "",
    queryOptions: {
      enabled: !!record,
    },
  });

  return (
    <Show isLoading={isLoading}>
      <Stack gap={1}>
        <Typography variant="body1" fontWeight="bold">
          ID
        </Typography>
        <TextField value={record?.id} />
        
        <Typography variant="body1" fontWeight="bold">
          Title
        </Typography>
        <TextField value={record?.title} />
        
        <Typography variant="body1" fontWeight="bold">
          Driver
        </Typography>
        {driverIsLoading ? <>Loading...</> : <TextField value={driverData?.data?.licenseNumber || record?.driverId} />}
        
        <Typography variant="body1" fontWeight="bold">
          Start Location
        </Typography>
        <TextField value={record?.startLocation} />
        
        <Typography variant="body1" fontWeight="bold">
          End Location
        </Typography>
        <TextField value={record?.endLocation} />
        
        <Typography variant="body1" fontWeight="bold">
          Price
        </Typography>
        <TextField value={record?.price} />
        
        <Typography variant="body1" fontWeight="bold">
          Capacity
        </Typography>
        <TextField value={record?.capacity} />
        
        <Typography variant="body1" fontWeight="bold">
          Available Seats
        </Typography>
        <TextField value={record?.availableSeats} />
        
        <Typography variant="body1" fontWeight="bold">
          Is Active
        </Typography>
        <TextField value={record?.isActive ? "Yes" : "No"} />
      </Stack>
    </Show>
  );
}
