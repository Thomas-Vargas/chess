import { useEffect, useState } from "react";
import { Stack, TextField, Button, Typography, Paper } from "@mui/material";
import { supabaseClient } from "../../config/supabaseClient";
import { useAuth } from "../../components/AuthProvider/AuthProvider";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const [userCompletedPuzzles, setUserCmpletedPuzzles] = useState(null);
  const [userData, setUserData] = useState(null);
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
      .select(
        `
        *, 
        ...chess_puzzles (*)
      `
      )
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
      {userData && (
        <Stack direction="row" justifyContent="space-between" alignItems="flex-end">
          <Typography variant="h3">{userData.username}</Typography>
          <Button variant="contained" onClick={() => navigate("/puzzle")}>
            Train
          </Button>
        </Stack>
      )}

      <Stack direction="row" width="100%" gap={3} mt={3}>
        {/* player stats */}
        {userData && (
          <Stack flex={1} height="50%">
            <Paper elevation={6} sx={{ padding: "20px" }}>
              <Typography variant="h5" mb={1}>Current Rating: {userData.current_elo}</Typography>
              <Typography variant="h5" mb={1}>Highest Rating: {userData.highest_elo}</Typography>
              <Typography variant="h5" mb={1}>Lowest Rating: {userData.lowest_elo}</Typography>
              <Typography variant="h5" mb={1}>Puzzles Played: {userData.puzzles_played}</Typography>
            </Paper>
          </Stack>
        )}
        {/* graphs */}
        <Stack flex={1} height="50%">
          <Paper elevation={6} sx={{ padding: "20px" }}></Paper>
        </Stack>
      </Stack>

      <Stack direction="row" width="100%" gap={3} mt={3}>
        {/* player stats */}
        {userCompletedPuzzles && (
          <Stack flex={1} height="50%">
            <Paper elevation={6} sx={{ padding: "20px" }}>

            </Paper>
          </Stack>
        )}
        {/* graphs */}
        <Stack flex={1} height="50%">
          <Paper elevation={6} sx={{ padding: "20px" }}></Paper>
        </Stack>
      </Stack>
    </div>
  );
};

export default UserDashboard;
