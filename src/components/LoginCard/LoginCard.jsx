import React, { useEffect, useState } from "react";
import { Paper, Stack, Typography, Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { supabaseClient } from "../../config/supabaseClient";
import { useAuth } from "../AuthProvider/AuthProvider";

const LoginCard = () => {
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

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

  // Redirect to root if the user is already logged in
  useEffect(() => {
    if (user) {
      navigate("/testPage");
    }
  }, [user]);

  return (
    <Stack direction="row" justifyContent="center" mt={8}>
      <Paper sx={{ padding: "50px" }} elevation={6}>
        <Stack>
          <Stack gap={3}>
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

            <Button variant="contained" onClick={() => login()} size="large">
              Submit
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Stack>
  );
};

export default LoginCard;
