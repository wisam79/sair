"use client";

import { useShow, useOne } from "@refinedev/core";
import { Show, TextFieldComponent, NumberField, BooleanField } from "@refinedev/mui";
import { Typography, Stack } from "@mui/material";

export default function DriverShow() {
  const { queryResult } = useShow();
  const { data, isLoading } = queryResult;
  const record = data?.data;

  const { data: profileData, isLoading: profileIsLoading } = useOne({
    resource: "profiles",
    id: record?.user_id || "",
    queryOptions: {
      enabled: !!record?.user_id,
    },
  });

  return (
    <Show isLoading={isLoading}>
      <Stack gap={1}>
        <Typography variant="body1" fontWeight="bold">
          ID
        </Typography>
        <TextFieldComponent value={record?.id} />

        <Typography variant="body1" fontWeight="bold">
          User Profile
        </Typography>
        {profileIsLoading ? (
          <Typography variant="body2">Loading...</Typography>
        ) : (
          <TextFieldComponent value={profileData?.data?.full_name || record?.user_id} />
        )}

        <Typography variant="body1" fontWeight="bold">
          License Number
        </Typography>
        <TextFieldComponent value={record?.license_number} />

        <Typography variant="body1" fontWeight="bold">
          Vehicle Model
        </Typography>
        <TextFieldComponent value={record?.vehicle_model} />

        <Typography variant="body1" fontWeight="bold">
          Vehicle Plate
        </Typography>
        <TextFieldComponent value={record?.vehicle_plate} />

        <Typography variant="body1" fontWeight="bold">
          Capacity
        </Typography>
        <NumberField value={record?.capacity ?? ""} />

        <Typography variant="body1" fontWeight="bold">
          Verified
        </Typography>
        <BooleanField value={record?.is_verified} />
      </Stack>
    </Show>
  );
}