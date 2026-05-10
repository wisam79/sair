"use client";

import { useMany } from "@refinedev/core";
import { List, useDataGrid, DateField, EditButton, ShowButton } from "@refinedev/mui";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React from "react";
import { Stack } from "@mui/material";

export default function RouteList() {
  const { dataGridProps } = useDataGrid({
    resource: "routes",
  });

  const { data: driverData, isLoading: driverIsLoading } = useMany({
    resource: "drivers",
    ids: dataGridProps?.rows?.map((item: any) => item?.driverId).filter(Boolean) ?? [],
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
        field: "title",
        headerName: "Title",
        type: "string",
        minWidth: 150,
        flex: 1,
      },
      {
        field: "driverId",
        headerName: "Driver",
        type: "string",
        minWidth: 200,
        flex: 1,
        renderCell: function render({ value }) {
          if (driverIsLoading) {
            return <>Loading...</>;
          }

          const driver = driverData?.data?.find((item) => item.id === value);
          // Assuming driver has a licenseNumber or we join with profiles to get name. Let's just show license for now.
          return driver ? driver.licenseNumber : value;
        },
      },
      {
        field: "startLocation",
        headerName: "Start Location",
        type: "string",
        minWidth: 150,
        flex: 1,
      },
      {
        field: "endLocation",
        headerName: "End Location",
        type: "string",
        minWidth: 150,
        flex: 1,
      },
      {
        field: "price",
        headerName: "Price",
        type: "number",
        minWidth: 100,
        flex: 1,
      },
      {
        field: "capacity",
        headerName: "Capacity",
        type: "number",
        minWidth: 100,
        flex: 1,
      },
      {
        field: "availableSeats",
        headerName: "Available Seats",
        type: "number",
        minWidth: 100,
        flex: 1,
      },
      {
        field: "isActive",
        headerName: "Active",
        type: "boolean",
        minWidth: 100,
        flex: 1,
      },
      {
        field: "actions",
        headerName: "Actions",
        sortable: false,
        renderCell: function render({ row }) {
          return (
            <Stack direction="row" spacing={1} alignItems="center" justifyContent="center" height="100%">
              <EditButton hideText recordItemId={row.id} />
              <ShowButton hideText recordItemId={row.id} />
            </Stack>
          );
        },
        align: "center",
        headerAlign: "center",
        minWidth: 120,
      },
    ],
    [driverData?.data, driverIsLoading]
  );

  return (
    <List>
      <DataGrid {...dataGridProps} columns={columns} autoHeight />
    </List>
  );
}
