"use client";

import { Show, TextFieldComponent as TextField } from "@refinedev/mui";
import { Typography, Stack, Chip } from "@mui/material";
import { useShow } from "@refinedev/core";

const ROLE_COLORS: Record<string, "default" | "primary" | "success" | "error" | "warning" | "info"> = {
  admin: "error",
  student: "primary",
  driver: "success",
};

export default function ProfileShow() {
  const { queryResult } = useShow();
  const { data, isLoading } = queryResult;
  const record = data?.data;

  return (
    <Show isLoading={isLoading}>
      <Stack gap={1}>
        <Typography variant="body1" fontWeight="bold">
          ID
        </Typography>
        <TextField value={record?.id} />

        <Typography variant="body1" fontWeight="bold">
          Full Name
        </Typography>
        <TextField value={record?.fullName} />

        <Typography variant="body1" fontWeight="bold">
          Phone
        </Typography>
        <TextField value={record?.phone} />

        <Typography variant="body1" fontWeight="bold">
          Role
        </Typography>
        <Chip
          label={record?.role}
          color={ROLE_COLORS[record?.role] || "default"}
          size="small"
        />

        <Typography variant="body1" fontWeight="bold">
          Institution ID
        </Typography>
        <TextField value={record?.institutionId || "N/A"} />

        <Typography variant="body1" fontWeight="bold">
          Joined
        </Typography>
        <TextField value={record?.createdAt ? new Date(record.createdAt).toLocaleString() : "-"} />
      </Stack>
    </Show>
  );
}
