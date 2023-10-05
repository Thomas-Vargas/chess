import { forwardRef, useState, useEffect } from "react";
import { Stack, Typography, Paper } from "@mui/material";

const RegisterInfoCard = forwardRef((props, ref) => {
  return (
    <Stack ref={ref} flex={1}>
      <Paper elevation={6} sx={{padding: "20px", height: "100%"}}>
        <Typography variant="h4" textAlign="center" mb={3}>Open Source Chess</Typography>
        <Typography>Details about the app.</Typography>
      </Paper>
    </Stack>
  )
});

export default RegisterInfoCard