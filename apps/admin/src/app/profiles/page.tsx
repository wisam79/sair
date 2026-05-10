"use client";

import { useDataGrid, List, EditButton, ShowButton } from "@refinedev/mui";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React from "react";
import { Stack, Chip } from "@mui/material";

const ROLE_COLORS: Record<string, "default" | "primary" | "success" | "error" | "warning" | "info"> = {
  admin: "error",
  student: "primary",
  driver: "success",
};

export default function ProfileList() {
  const { dataGridProps } = useDataGrid({
    resource: "profiles",
  });

  const columns = React.useMemo<GridColDef[]>(
    () => [
      {
        field: "id",
        headerName: "ID",
        type: "string",
        minWidth: 100,
        flex: 1,
      },
      {
        field: "fullName",
        headerName: "Full Name",
        type: "string",
        minWidth: 180,
        flex: 1,
      },
      {
        field: "phone",
        headerName: "Phone",
        type: "string",
        minWidth: 150,
        flex: 1,
      },
      {
        field: "role",
        headerName: "Role",
        type: "string",
        minWidth: 120,
        flex: 0.5,
        renderCell: function render({ value }) {
          return (
            <Chip
              label={value}
              color={ROLE_COLORS[value] || "default"}
              size="small"
            />
          );
        },
      },
      {
        field: "createdAt",
        headerName: "Joined",
        minWidth: 180,
        flex: 1,
        renderCell: function render({ value }) {
          return value ? new Date(value).toLocaleDateString() : "-";
        },
      },
      {
        field: "actions",
        headerName: "Actions",
        sortable: false,
        renderCell: function render({ row }) {
          return (
            <Stack direction="row" spacing={1} alignItems="center" justifyContent="center" height="100%">
              <ShowButton hideText recordItemId={row.id} />
            </Stack>
          );
        },
        align: "center",
        headerAlign: "center",
        minWidth: 80,
      },
    ],
    []
  );

  return (
    <List>
      <DataGrid {...dataGridProps} columns={columns} autoHeight />
    </List>
  );
}
