"use client";

import { Create, useAutocomplete } from "@refinedev/mui";
import { Box, TextField, Autocomplete } from "@mui/material";
import { useForm } from "@refinedev/react-hook-form";
import { Controller } from "react-hook-form";

export default function TripCreate() {
  const {
    saveButtonProps,
    refineCore: { formLoading },
    register,
    control,
    formState: { errors },
  } = useForm();

  const { autocompleteProps: routeAutocompleteProps } = useAutocomplete({
    resource: "routes",
  });

  const { autocompleteProps: driverAutocompleteProps } = useAutocomplete({
    resource: "drivers",
  });

  return (
    <Create isLoading={formLoading} saveButtonProps={saveButtonProps}>
      <Box
        component="form"
        sx={{ display: "flex", flexDirection: "column" }}
        autoComplete="off"
      >
        <Controller
          control={control}
          name="route_id"
          rules={{ required: "This field is required" }}
          render={({ field }) => (
            <Autocomplete
              {...routeAutocompleteProps}
              {...field}
              onChange={(_, value) => {
                field.onChange(value?.id ?? value);
              }}
              getOptionLabel={(item) => {
                return (
                  routeAutocompleteProps?.options?.find(
                    (p) => p?.id?.toString() === (item?.id ?? item)?.toString(),
                  )?.title ?? ""
                );
              }}
              isOptionEqualToValue={(option, value) =>
                value === undefined || option?.id?.toString() === (value?.id ?? value)?.toString()
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Route"
                  margin="normal"
                  variant="outlined"
                  error={!!(errors as any)?.route_id}
                  helperText={(errors as any)?.route_id?.message}
                  required
                />
              )}
            />
          )}
        />
        
        <Controller
          control={control}
          name="driver_id"
          rules={{ required: "This field is required" }}
          render={({ field }) => (
            <Autocomplete
              {...driverAutocompleteProps}
              {...field}
              onChange={(_, value) => {
                field.onChange(value?.id ?? value);
              }}
              getOptionLabel={(item) => {
                return (
                  driverAutocompleteProps?.options?.find(
                    (p) => p?.id?.toString() === (item?.id ?? item)?.toString(),
                  )?.vehicle_plate ?? ""
                );
              }}
              isOptionEqualToValue={(option, value) =>
                value === undefined || option?.id?.toString() === (value?.id ?? value)?.toString()
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Driver (Vehicle Plate)"
                  margin="normal"
                  variant="outlined"
                  error={!!(errors as any)?.driver_id}
                  helperText={(errors as any)?.driver_id?.message || "Select the driver for this trip"}
                  required
                />
              )}
            />
          )}
        />

        <TextField
          {...register("scheduled_at", {
            required: "This field is required",
          })}
          error={!!(errors as any)?.scheduled_at}
          helperText={(errors as any)?.scheduled_at?.message}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          type="datetime-local"
          label="Scheduled At"
          name="scheduled_at"
        />
      </Box>
    </Create>
  );
}