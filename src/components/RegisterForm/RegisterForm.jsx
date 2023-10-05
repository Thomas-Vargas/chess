import { useState, useEffect } from "react";
const { Stack, TextField, Button, Typography } = require("@mui/material");
import axios from "axios";

const RegisterForm = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const registerUser = () => {
    axios.post('http://localhost:5000/api/users/signup', loginData) 
        .then(result => {
            console.log("result registering user", result);
        })
        .catch(error => {
            console.log("error registering user", error);
        })
  }

  return (
    <Stack gap={3} height="100%">
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

    <Stack direction="row" justifyContent="flex-end">
      <Button variant="contained" onClick={() => registerUser()}>Submit</Button>
    </Stack>
    </Stack>
  );
};

export default RegisterForm;
