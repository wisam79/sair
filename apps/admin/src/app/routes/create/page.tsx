"use client";

import { Create } from "@refinedev/mui";
import { Box, TextField, Checkbox, FormControlLabel } from "@mui/material";
import { useForm } from "@refinedev/react-hook-form";

export default function RouteCreate() {
  const {
    saveButtonProps,
    refineCore: { formLoading },
    register,
    formState: { errors },
  } = useForm();

  return (
    <Create isLoading={formLoading} saveButtonProps={saveButtonProps}>
      <Box
        component="form"
        sx={{ display: "flex", flexDirection: "column" }}
        autoComplete="off"
      >
        <TextField
          {...register("driverId", {
            required: "This field is required",
          })}
          error={!!(errors as any)?.driverId}
          helperText={(errors as any)?.driverId?.message}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          type="text"
          label="Driver ID"
          name="driverId"
        />
        <TextField
          {...register("title", {
            required: "This field is required",
          })}
          error={!!(errors as any)?.title}
          helperText={(errors as any)?.title?.message}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          type="text"
          label="Title"
          name="title"
        />
        <TextField
          {...register("startLocation", {
            required: "This field is required",
          })}
          error={!!(errors as any)?.startLocation}
          helperText={(errors as any)?.startLocation?.message}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          type="text"
          label="Start Location"
          name="startLocation"
        />
        <TextField
          {...register("endLocation", {
            required: "This field is required",
          })}
          error={!!(errors as any)?.endLocation}
          helperText={(errors as any)?.endLocation?.message}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          type="text"
          label="End Location"
          name="endLocation"
        />
        <TextField
          {...register("price", {
            required: "This field is required",
            valueAsNumber: true,
          })}
          error={!!(errors as any)?.price}
          helperText={(errors as any)?.price?.message}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          type="number"
          label="Price"
          name="price"
        />
        <TextField
          {...register("capacity", {
            required: "This field is required",
            valueAsNumber: true,
          })}
          error={!!(errors as any)?.capacity}
          helperText={(errors as any)?.capacity?.message}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          type="number"
          label="Capacity"
          name="capacity"
        />
        <TextField
          {...register("availableSeats", {
            required: "This field is required",
            valueAsNumber: true,
          })}
          error={!!(errors as any)?.availableSeats}
          helperText={(errors as any)?.availableSeats?.message}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          type="number"
          label="Available Seats"
          name="availableSeats"
        />
        <FormControlLabel
          control={
            <Checkbox
              {...register("isActive")}
              defaultChecked={true}
              name="isActive"
            />
          }
          label="Is Active"
        />
      </Box>
    </Create>
  );
}
