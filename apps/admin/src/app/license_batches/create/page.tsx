"use client";

import { Create } from "@refinedev/mui";
import { Box, TextField, MenuItem, Autocomplete, Alert } from "@mui/material";
import { useForm } from "@refinedev/react-hook-form";
import { useSelect, useApiUrl, useCustomMutation } from "@refinedev/core";
import { supabaseClient } from "../../../providers/supabaseClient";

export default function LicenseBatchCreate() {
  const {
    saveButtonProps,
    refineCore: { formLoading, onFinish },
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const { options: routeOptions } = useSelect({
    resource: "routes",
    optionLabel: "title",
    optionValue: "id",
  });

  const { mutate } = useCustomMutation();

  const handleCustomSubmit = async (data: any) => {
    // Call the RPC to create a batch securely and generate the codes
    try {
      const { data: batchId, error } = await supabaseClient.rpc("create_license_batch", {
        p_route_id: data.route_id,
        p_batch_name: data.batch_name,
        p_quantity: Number(data.quantity),
        p_price: Number(data.price),
        p_valid_days: Number(data.valid_days),
      });

      if (error) {
        alert(`Error: ${error.message}`);
        return;
      }
      
      // Redirect back manually since we used custom mutation
      window.location.href = "/license_batches";
    } catch (e: any) {
      alert(`Error: ${e.message}`);
    }
  };

  return (
    <Create saveButtonProps={{ ...saveButtonProps, onClick: handleSubmit(handleCustomSubmit) }} isLoading={formLoading}>
      <Box component="form" sx={{ display: "flex", flexDirection: "column" }} autoComplete="off">
        <TextField
          {...register("batch_name", { required: "This field is required" })}
          error={!!(errors as any)?.batch_name}
          helperText={(errors as any)?.batch_name?.message}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          type="text"
          label="Batch Name (e.g. 'Month 5 - Route A')"
          name="batch_name"
        />

        <TextField
          select
          {...register("route_id", { required: "This field is required" })}
          error={!!(errors as any)?.route_id}
          helperText={(errors as any)?.route_id?.message}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          label="Route"
          name="route_id"
          defaultValue=""
        >
          {routeOptions?.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          {...register("quantity", { required: "This field is required", min: 1 })}
          error={!!(errors as any)?.quantity}
          helperText={(errors as any)?.quantity?.message}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          type="number"
          label="Quantity (Number of codes to generate)"
          name="quantity"
        />

        <TextField
          {...register("price", { required: "This field is required", min: 0 })}
          error={!!(errors as any)?.price}
          helperText={(errors as any)?.price?.message}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          type="number"
          label="Price (per license code)"
          name="price"
        />

        <TextField
          {...register("valid_days", { required: "This field is required", min: 1 })}
          error={!!(errors as any)?.valid_days}
          helperText={(errors as any)?.valid_days?.message}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          type="number"
          label="Valid Days (e.g. 30)"
          name="valid_days"
          defaultValue={30}
        />
        
        <Alert severity="info" sx={{ mt: 2 }}>
          Generating a batch will securely create the requested quantity of unique 8-character codes immediately.
        </Alert>
      </Box>
    </Create>
  );
}
