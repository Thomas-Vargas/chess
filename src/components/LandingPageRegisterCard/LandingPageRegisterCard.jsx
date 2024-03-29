import React, { useEffect, useState, forwardRef } from "react";
import { Paper, Stack, Typography, Button, TextField, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { supabaseClient } from "../../config/supabaseClient";
import { useAuth } from "../AuthProvider/AuthProvider";
import RegisterForm from "../RegisterForm/RegisterForm";

const LandingPageRegisterCard = forwardRef((props, ref) => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [register, setRegister] = useState(true);
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
      navigate("/dashboard");
    }
  }, [user]);

  return (
    <Stack direction="row" justifyContent="center" ref={ref}>
      <Paper sx={{ padding: "20px", width: "100%", height: "100%" }} elevation={6}>
        <Stack direction="column" justifyContent="space-between" mb={3}>
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
                <Stack width="100%">
                  <Button variant="contained" onClick={() => login()}>
                    Submit
                  </Button>
                </Stack>
              </>
            ) : (
              <RegisterForm />
            )}
          </Stack>
        </Stack>

        <Divider />

        {register && (
          <Stack alignItems="center" mt={2}>
            <Typography variant="h5" mb={2}>Already a member?</Typography>

            <Button variant="contained" onClick={() => setRegister(false)}>Login</Button>
          </Stack>
        )}
        {!register && (
          <Stack alignItems="center" mt={2}>
            <Typography variant="h5" mb={2}>Sign Up Now!</Typography>

            <Button variant="contained" onClick={() => setRegister(true)}>Sign Up</Button>
          </Stack>
        )}
      </Paper>
    </Stack>
  );
});

export default LandingPageRegisterCard;
