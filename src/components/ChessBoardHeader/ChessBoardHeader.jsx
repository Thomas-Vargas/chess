import { useEffect, useState } from "react";
import { Stack, Paper, Typography, Button } from "@mui/material";
import useUserData from "../../utils/userData";
import { useAuth } from "../AuthProvider/AuthProvider";
import { supabaseClient } from "../../config/supabaseClient";

const ChessBoardHeader = ({ currentPuzzle }) => {
  const [userData, setUserData] = useState(null);
  const { user } = useAuth();
  let userDataResult = useUserData(user?.id);

  const fetchUserData = async (userID) => {
    try {
      const { data, error } = await supabaseClient.from("user_data").select("*").eq("userID", userID);

      if (error) {
        console.error("Error fetching user data:", error);
      } else {
        setUserData(data[0]);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    if (userDataResult) {
      setUserData(userDataResult);
    }
  }, [userDataResult]);

  useEffect(() => {
    setTimeout(() => {
        fetchUserData(user.id);
    }, 1000);
  }, [currentPuzzle]);

  return (
    <Stack mb={2}>
      <Paper elevation={6} sx={{ width: "100%", padding: 3 }}>
        {userData && (
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="h6">Current Rank: {userData.current_elo}</Typography>
            <Typography variant="h6">Current Puzzle: {currentPuzzle.Rating}</Typography>
          </Stack>
        )}
      </Paper>
    </Stack>
  );
};

export default ChessBoardHeader;
