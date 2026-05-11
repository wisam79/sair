"use client";

import { List, useDataGrid, DateField } from "@refinedev/mui";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React from "react";
import { Chip } from "@mui/material";

export default function LicensesList() {
  const { dataGridProps } = useDataGrid({
    resource: "licenses",
    sorters: {
      initial: [
        {
          field: "created_at",
          order: "desc",
        },
      ],
    },
  });

  const columns = React.useMemo<GridColDef[]>(
    () => [
      {
        field: "code",
        headerName: "Code",
        type: "string",
        minWidth: 150,
        flex: 1,
      },
      {
        field: "status",
        headerName: "Status",
        type: "string",
        minWidth: 120,
        flex: 1,
        renderCell: function render({ value }) {
          let color: "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" = "default";
          if (value === "active") color = "success";
          if (value === "used") color = "default";
          if (value === "revoked") color = "error";
          return <Chip size="small" label={value} color={color} />;
        },
      },
      {
        field: "valid_days",
        headerName: "Valid Days",
        type: "number",
        minWidth: 100,
        flex: 1,
      },
      {
        field: "used_at",
        headerName: "Used At",
        minWidth: 200,
        flex: 1,
        renderCell: function render({ value }) {
          if (!value) return "-";
          return <DateField value={value} />;
        },
      },
      {
        field: "created_at",
        headerName: "Created At",
        minWidth: 200,
        flex: 1,
        renderCell: function render({ value }) {
          return <DateField value={value} />;
        },
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
