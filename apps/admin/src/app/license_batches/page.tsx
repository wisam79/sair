"use client";

import { List, useDataGrid, DateField } from "@refinedev/mui";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React from "react";
import { useMany } from "@refinedev/core";

export default function LicenseBatchesList() {
  const { dataGridProps } = useDataGrid({
    resource: "license_batches",
    sorters: {
      initial: [
        {
          field: "created_at",
          order: "desc",
        },
      ],
    },
  });

  const { data: routesData, isLoading: routesIsLoading } = useMany({
    resource: "routes",
    ids: dataGridProps?.rows?.map((item: any) => item?.route_id).filter(Boolean) ?? [],
    queryOptions: {
      enabled: !!dataGridProps?.rows,
    },
  });

  const columns = React.useMemo<GridColDef[]>(
    () => [
      {
        field: "batch_name",
        headerName: "Batch Name",
        type: "string",
        minWidth: 150,
        flex: 1,
      },
      {
        field: "route_id",
        headerName: "Route",
        type: "string",
        minWidth: 200,
        flex: 1,
        renderCell: function render({ value }) {
          if (routesIsLoading) {
            return "Loading...";
          }
          const route = routesData?.data?.find((item) => item.id === value);
          return route ? route.title : value;
        },
      },
      {
        field: "quantity",
        headerName: "Quantity",
        type: "number",
        minWidth: 100,
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
        field: "valid_days",
        headerName: "Valid Days",
        type: "number",
        minWidth: 100,
        flex: 1,
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
    [routesData?.data, routesIsLoading]
  );

  return (
    <List>
      <DataGrid {...dataGridProps} columns={columns} autoHeight />
    </List>
  );
}
