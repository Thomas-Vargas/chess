import { useEffect, useState } from "react";
import { Stack, Paper, Typography, Button, Fade } from "@mui/material";
import useUserData from "../../utils/userData";
import { useAuth } from "../AuthProvider/AuthProvider";
import { supabaseClient } from "../../config/supabaseClient";

const ChessBoardHeader = ({ currentPuzzle }) => {
  const [userData, setUserData] = useState(null);
  const [currentPuzzleRating, setCurrentPuzzleRating] = useState(null);
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

    if (currentPuzzle && currentPuzzleRating !== null) {
      setTimeout(() => {
        setCurrentPuzzleRating(currentPuzzle.Rating);
      }, 1000);
    } else if (currentPuzzle) {
      setCurrentPuzzleRating(currentPuzzle.Rating);
    }
  }, [currentPuzzle]);

  return (
    currentPuzzle && (
      <Stack direction="row" justifyContent="center">
        <Paper elevation={6} sx={{ width: "480px", padding: 3 }}>
          {userData && currentPuzzle ? (
            <Stack direction="row" justifyContent="space-between">
              <Fade in={true} timeout={1000}>
                <Typography variant="h6">Current Rank: {userData.current_elo}</Typography>
              </Fade>
              <Fade in={true} timeout={1000} style={{ transitionDelay: "500ms" }}>
                <Typography variant="h6">Current Puzzle: {currentPuzzleRating}</Typography>
              </Fade>
            </Stack>
          ) : (
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="h6" sx={{ visibility: "hidden" }}>
                Current Rank
              </Typography>
              <Typography variant="h6" sx={{ visibility: "hidden" }}>
                Current Puzzle:
              </Typography>
            </Stack>
          )}
        </Paper>
      </Stack>
    )
  );
};

export default ChessBoardHeader;
