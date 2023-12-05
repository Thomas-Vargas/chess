import { useEffect, useState } from "react";
import { Stack, TextField, Button, Typography, Paper, Divider, Grid } from "@mui/material";
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

  const formatDate = (date) => {
    const originalDate = new Date(date);
    const formattedDate = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      timeZone: "UTC", // Specify the timeZone as UTC
    }).format(originalDate);

    return formattedDate;
  };

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
    if (user && !userCompletedPuzzles && !userData) {
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
              <Typography variant="h4" textAlign="center" mb={2}>
                Player Stats
              </Typography>

              <Divider />

              <Typography variant="h5" mb={1} mt={2}>
                Current Rating: {userData.current_elo}
              </Typography>
              <Typography variant="h5" mb={1}>
                Highest Rating: {userData.highest_elo}
              </Typography>
              <Typography variant="h5" mb={1}>
                Lowest Rating: {userData.lowest_elo}
              </Typography>
              <Typography variant="h5" mb={1}>
                Puzzles Played: {userData.puzzles_played}
              </Typography>
            </Paper>
          </Stack>
        )}
        {/* graphs */}
        <Stack flex={1} height="50%">
          <Paper elevation={6} sx={{ padding: "20px" }}></Paper>
        </Stack>
      </Stack>

      <Stack direction="row" width="100%" gap={3} mt={3}>
        {/* recent puzzles */}
        {userCompletedPuzzles && (
          <Stack flex={1} height="50%">
            <Paper elevation={6} sx={{ padding: "20px" }}>
              <Typography variant="h4" textAlign="center" mb={2}>
                Recent Puzzles
              </Typography>

              <Divider />

              <Stack direction="row" mt={2} mb={1}>
                <Typography flex={1} variant="h6">Puzzle Id</Typography>
                <Typography flex={1} variant="h6">Date</Typography>
                <Typography flex={1} variant="h6">Result</Typography>
              </Stack>

              <Divider sx={{marginBottom: 2}} />

              <Grid container spacing={3} >
                {userCompletedPuzzles.map((puzzle) => (
                  <Grid item key={puzzle.PuzzleId} xs={12}>
                    <Stack direction="row">
                      <Typography flex={1}>{puzzle.PuzzleId}</Typography>
                      <Typography flex={1}>{formatDate(puzzle.timeCompleted)}</Typography>
                      <Typography flex={1}>{puzzle.completedStatus ? "true" : "false"}</Typography>
                    </Stack>
                  </Grid>
                ))}
              </Grid>
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
