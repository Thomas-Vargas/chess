import React, { useEffect, useState } from "react";
import { Paper, Stack, Typography, Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { supabaseClient } from "../../config/supabaseClient";
import { useAuth } from "../AuthProvider/AuthProvider";
import RegisterForm from "../RegisterForm/RegisterForm";

const LoginCard = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [register, setRegister] = useState(false);
  const navigate = useNavigate();

  const { user } = useAuth();

  const login = async () => {
    try {
      const { error } = await supabaseClient.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password,
      });
      if (error) throw error;
    } catch (err) {
      throw err;
    } finally {
      setLoginData({ email: "", password: "" });
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/testPage");
    }
  }, [user]);

  return (
    <Stack direction="row" justifyContent="center" mt={8}>
      <Paper sx={{ padding: "20px" }} elevation={6}>
        <Stack direction="column" justifyContent="space-between" height="100%">
          <Stack gap={3}>
            {!register ? (
              <>
                <Typography variant="h4" textAlign="center">
                  Login
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
                    onKeyDown={(e) => e.keyCode === 13 && login()}
                  />
                </Stack>
              </>
            ) : (
              <RegisterForm />
            )}
          </Stack>

          <Stack direction="row" justifyContent="space-between" width="100%">
            {!register && (
              <Button variant="contained" onClick={() => setRegister(true)}>
                Register
              </Button>
            )}
            <Button variant="contained" onClick={() => (!register ? login() : setRegister(false))}>
              {register ? "BacK" : "Submit"}
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Stack>
  );
};

export default LoginCard;
