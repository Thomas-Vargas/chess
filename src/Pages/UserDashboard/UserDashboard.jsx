import { useEffect, useState } from "react";
import { Stack, TextField, Button, Typography } from "@mui/material";
import { supabaseClient } from "../../config/supabaseClient";
import { useAuth } from "../../components/AuthProvider/AuthProvider";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const [userData, setUserData] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  console.log("user", user);
  console.log("user data", userData);

  const getUserData = async () => {
    let { data: user_data, error } = await supabaseClient
      .from("user_data")
      .select("*")
      .eq("userID", user.id);

    if (user_data) {
      setUserData(user_data[0]);
    }
  };

  useEffect(() => {
    if (user) {
      getUserData();
    }
  }, [user]);

  return (
    <div>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-end">
        <Typography variant="h3">Welcome</Typography>
        <Button variant="contained" onClick={() => navigate('/puzzle')}>Train</Button>
      </Stack>

      <Stack direction="row" width="100%">
        <Stack flex={1}></Stack>
        <Stack flex={1}></Stack>
      </Stack>
    </div>
  );
};

export default UserDashboard;
