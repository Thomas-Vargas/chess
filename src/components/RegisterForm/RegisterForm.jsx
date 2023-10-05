import { useState, useEffect } from "react";
import axios from "axios";
import { Stack, TextField, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthProvider/AuthProvider";
import { supabaseClient } from "../../config/supabaseClient";

const RegisterForm = () => {
  const [registerData, setregisterData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const { user } = useAuth();

  //need to test this new client side signup
  const registerUser = async () => {
    try {
      // Sign user up
      const { data: signUpData, error: signUpError } = await supabaseClient.auth.signUp({
        email: registerData.email,
        password: registerData.password,
      });

      if (signUpError) {
        console.error("Error signing user up:", signUpError);
        return;
      }

      // Initialize user data row
      const { data: userData, error: userError } = await supabaseClient
        .from("user_data")
        .insert([
          {
            userID: signUpData.user.id,
            current_elo: 800,
            lowest_elo: 800,
            highest_elo: 800,
            puzzles_played: 0,
          },
        ])
        .select();

      if (userError) {
        console.error("Error inserting new user into user_data table:", userError);
        return;
      }

      // Sign in after successful signup
      const { user: signedInUser, error: signInError } = await supabaseClient.auth.signInWithCredentials({
        email: registerData.email,
        password: registerData.password,
      });

      if (signInError) {
        console.error("Error signing user in:", signInError);
        return;
      }

      // probably want to comment these out
      console.log("User signed up:", signUpData);
      console.log("User data initialized:", userData);
      console.log("User signed in:", signedInUser);
    } catch (error) {
      console.error("Unexpected error in registering user:", error);
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/testPage");
    }
  }, [user]);

  return (
    <Stack gap={3} height="100%">
      <Typography variant="h4" textAlign="center">
        Sign Up
      </Typography>
      <Stack width="100%" gap={3}>
        <TextField
          label="email"
          value={registerData.email}
          onChange={(e) => setregisterData({ ...registerData, email: e.target.value })}
        />
        <TextField
          label="Password"
          value={registerData.password}
          type="password"
          onChange={(e) => setregisterData({ ...registerData, password: e.target.value })}
          onKeyDown={(e) => e.keyCode === 13 && registerUser()}
        />
      </Stack>

      <Stack direction="row" justifyContent="flex-end">
        <Button variant="contained" onClick={() => registerUser()}>
          Submit
        </Button>
      </Stack>
    </Stack>
  );
};

export default RegisterForm;
