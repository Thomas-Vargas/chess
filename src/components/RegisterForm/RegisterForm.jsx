import { useState, useEffect } from "react";
const { Stack, TextField, Button, Typography } = require("@mui/material");

const RegisterForm = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const registerUser = () => {


  }

  return (
    <Stack gap={3}>
      <Typography variant="h4" textAlign="center">
        Sign Up
      </Typography>
      <Stack width="100%" gap={3}>
        <TextField
          label="email"
          value={loginData.email}
          onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
        />
        <TextField
          label="Password"
          value={loginData.password}
          type="password"
          onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
          onKeyDown={(e) => e.keyCode === 13 && registerUser()}
        />
      </Stack>
    </Stack>
  );
};

export default RegisterForm;
