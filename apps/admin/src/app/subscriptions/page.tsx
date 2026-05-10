"use client";

import { useMany } from "@refinedev/core";
import { List, useDataGrid } from "@refinedev/mui";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React from "react";
import { Chip } from "@mui/material";

const STATUS_COLORS: Record<string, "default" | "primary" | "success" | "error" | "warning" | "info"> = {
  active: "success",
  pending: "warning",
  expired: "default",
  cancelled: "error",
};

export default function SubscriptionList() {
  const { dataGridProps } = useDataGrid({
    resource: "subscriptions",
  });

  const { data: studentData, isLoading: studentIsLoading } = useMany({
    resource: "profiles",
    ids: dataGridProps?.rows?.map((item: any) => item?.studentId).filter(Boolean) ?? [],
    queryOptions: {
      enabled: !!dataGridProps?.rows,
    },
  });

  const { data: routeData, isLoading: routeIsLoading } = useMany({
    resource: "routes",
    ids: dataGridProps?.rows?.map((item: any) => item?.routeId).filter(Boolean) ?? [],
    queryOptions: {
      enabled: !!dataGridProps?.rows,
    },
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
        field: "studentId",
        headerName: "Student",
        type: "string",
        minWidth: 180,
        flex: 1,
        renderCell: function render({ value }) {
          if (studentIsLoading) return <>Loading...</>;
          const student = studentData?.data?.find((item) => item.id === value);
          return student ? student.fullName : value;
        },
      },
      {
        field: "routeId",
        headerName: "Route",
        type: "string",
        minWidth: 180,
        flex: 1,
        renderCell: function render({ value }) {
          if (routeIsLoading) return <>Loading...</>;
          const route = routeData?.data?.find((item) => item.id === value);
          return route ? route.title : value;
        },
      },
      {
        field: "status",
        headerName: "Status",
        type: "string",
        minWidth: 120,
        flex: 0.5,
        renderCell: function render({ value }) {
          return (
            <Chip
              label={value}
              color={STATUS_COLORS[value] || "default"}
              size="small"
            />
          );
        },
      },
      {
        field: "startDate",
        headerName: "Start",
        minWidth: 120,
        flex: 0.5,
        renderCell: function render({ value }) {
          return value ? new Date(value).toLocaleDateString() : "-";
        },
      },
      {
        field: "endDate",
        headerName: "End",
        minWidth: 120,
        flex: 0.5,
        renderCell: function render({ value }) {
          return value ? new Date(value).toLocaleDateString() : "-";
        },
      },
    ],
    [studentData?.data, studentIsLoading, routeData?.data, routeIsLoading]
  );

  return (
    <List>
      <DataGrid {...dataGridProps} columns={columns} autoHeight />
    </List>
  );
}
