import { useEffect, useState } from "react";
import { Stack, TextField, Button, Typography } from "@mui/material";
import { supabaseClient } from "../../config/supabaseClient";
import { useAuth } from "../../components/AuthProvider/AuthProvider";

const UserDashboard = () => {
  const [userData, setUserData] = useState(null);
  const { user } = useAuth();

  console.log("user", user);
  console.log("user data", userData);

  const getUserData = async () => {
    let { data: user_data, error } = await supabaseClient
        .from('user_data')
        .select("*")
        .eq("userID", user.id)

        if (user_data) {
            setUserData(user_data[0]);
        }
  }

  useEffect(() => {
    if (user) {
        getUserData();
    }
  }, [user]);

    return (
        <div>
            <Stack direction="row" justifyContent="flex-start">
                <Typography></Typography>
            </Stack>
        </div>
    )
}

export default UserDashboard;