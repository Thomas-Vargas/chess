import { useEffect, useState } from "react";
import { Stack, TextField, Button, Typography } from "@mui/material";
import { supabaseClient } from "../../config/supabaseClient";
import { useAuth } from "../../components/AuthProvider/AuthProvider";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [userCompletedPuzzles, setUserCmpletedPuzzles] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  console.log("user", user);
  console.log("user data", userData);
  console.log("user completed puzzles", userCompletedPuzzles);

  const getUserData = async () => {
    let { data: userData, error } = await supabaseClient.from("user_data").select("*").eq("userID", user.id);

    if (error) {
      console.error("Error fetching user data:", error);
    } else {
      setUserData(userData[0]);
    }
  };

  const getUserCompletedPuzzles = async () => {
    let { data: userCompletedPuzzles, error } = await supabaseClient
      .from("completed_puzzles")
      .select(`
        *, 
        ...chess_puzzles (*)
      `)
      .eq("userID", user.id)
      .order("timeCompleted", { ascending: false })
      .limit(10);

    if (error) {
      console.error("Error fetching user completed puzzle data:", error);
    } else {
      console.log("User completed puzzles with joined chess_puzzles data:", userCompletedPuzzles);
      setUserCmpletedPuzzles(userCompletedPuzzles);
    }
  };

  useEffect(() => {
    if (user) {
      getUserData();
      getUserCompletedPuzzles();
    }
  }, [user]);

  return (
    <div>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-end">
        <Typography variant="h3">Welcome</Typography>
        <Button variant="contained" onClick={() => navigate("/puzzle")}>
          Train
        </Button>
      </Stack>

      <Stack direction="row" width="100%">
        <Stack flex={1}></Stack>
        <Stack flex={1}></Stack>
      </Stack>
    </div>
  );
};

export default UserDashboard;
