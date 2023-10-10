import { useEffect, useState } from "react";
import { supabaseClient } from "../../config/supabaseClient";
import { useAuth } from "../../components/AuthProvider/AuthProvider";
import useUserData from "../../utils/userData";
import { Button } from "@mui/material";

import ChessBoard from "../../components/ChessBoard/ChessBoard";

const ChessPuzzlePage = () => {
  const [puzzlesInEloRange, setPuzzlesInEloRange] = useState(null);
  const { user } = useAuth();
  const { session } = useAuth();
  const userData = useUserData(user?.id);

  console.log("user data in chess puzzle page", userData);
  console.log("puzzles in elo range", puzzlesInEloRange);

  const calculateEloChange = (playerElo, puzzleDifficulty, isSolved) => {
    const K = 16; // Adjust this based on your system's K-factor

    // Calculate expected outcome (E)
    const E = 1 / (1 + Math.pow(10, (puzzleDifficulty - playerElo) / 400));

    // Calculate actual outcome (S)
    const S = isSolved ? 1 : 0;

    // Calculate Elo change
    const eloChange = K * (S - E);

    return Math.round(eloChange);
  };

  const shuffleArray = (array) => {
    // Create a shallow copy of the array
    const shuffledArray = [...array];

    // Simple Fisher-Yates shuffle algorithm
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }

    return shuffledArray;
  };

  const getPuzzlesWithinEloRange = async () => {
    const eloRange = 100;
    const playerElo = userData.current_elo;

    // Step 2: Filter puzzles by Elo range
    const { data: puzzlesWithinRange, error: puzzlesWithinRangeError } = await supabaseClient
      .from("chess_puzzles")
      .select("*")
      .gte("Rating", playerElo - eloRange)
      .lte("Rating", playerElo + eloRange)
      .limit(500);

    if (puzzlesWithinRangeError) {
      console.log("error fetching puzzles within range", puzzlesWithinRangeError);
    }

    console.log("puzzles within range", puzzlesWithinRange);

    // Step 3: Retrieve puzzles the player has already completed
    const { data: completedPuzzles, error: completedPuzzlesError } = await supabaseClient
      .from("completed_puzzles")
      .select("puzzleID")
      .eq("userID", userData.userID);

    if (completedPuzzlesError) {
      console.log("error fetching completed puzzles", completedPuzzlesError);
    }

    console.log("completed puzzles", completedPuzzles);

    // Filter out completed puzzles
    const newPuzzles = shuffleArray(puzzlesWithinRange)
      .map((puzzle) => ({
        ...puzzle,
        moves: puzzle.Moves.split(" "),
      }))
      .filter((puzzle) => !completedPuzzles.some((completedPuzzle) => completedPuzzle.puzzleID === puzzle.id));

    setPuzzlesInEloRange(newPuzzles);
  };

  const saveCompletedPuzzle = async (result, puzzleID, timeToComplete) => {
    const { data, error } = await supabaseClient
      .from("completed_puzzles")
      .insert([
        {
          completedStatus: result,
          userID: userData.userID,
          puzzleID: puzzleID,
        },
      ])
      .select();

    if (error) {
      console.log("error inserting into completed_puzzles", error);
    } else {
      console.log("success inserting into completed_puzzles", data);
    }
  };

  const updateUserElo = async (result, puzzleID, timeToComplete, currentPuzzle) => {
    let eloChange = calculateEloChange(userData.current_elo, currentPuzzle.Rating, result);
    let newElo = userData.current_elo + eloChange;

    console.log("elo change", eloChange);
    console.log("users new elo", newElo);

    // save elo history
    const { data: eloHistoryData, error: eloHistoryError } = await supabaseClient
      .from("puzzle_elo_history")
      .insert([
        {
          userID: user.id,
          elo: newElo,
        },
      ])
      .select();

    if (eloHistoryError) {
      console.log("error inserting into puzzle_elo_history", eloHistoryError);
    } else {
      console.log("success inserting into puzzle_elo_history", eloHistoryData);
    }

    console.log("userData.userID:", userData.userID);
    // update current_elo in user_data and ++ puzzles_played
    // something is not working when updating the user_data
    const { data: currentEloData, error: currentEloError } = await supabaseClient
      .from("user_data")
      .update({
        current_elo: newElo,
        puzzles_played: userData.puzzles_played + 1,
      })
      .eq("userID", userData.userID)
      .select();

    if (currentEloError) {
      console.log("error updating elo in user_data", currentEloError);
    } else {
      console.log("success updating elo in user_data", currentEloData);
    }
  };

  const updateAllUserPuzzleData = async (result, currentPuzzle, timeToComplete) => {
    await saveCompletedPuzzle(result, currentPuzzle.id, timeToComplete);
    await updateUserElo(result, currentPuzzle.id, timeToComplete, currentPuzzle);
  };

  const testUpdate = async () => {
    console.log("session", session)

    try {
      const { data, error } = await supabaseClient.from("user_data").update({ current_elo: 300 }).eq("id", 12).select();

      if (error) {
        console.error("Error updating user_data:", error);
      } else {
        console.log("Update successful. Data:", data);
      }
    } catch (e) {
      console.error("An unexpected error occurred:", e);
    }
  };

  useEffect(() => {
    if (userData && !puzzlesInEloRange) {
      getPuzzlesWithinEloRange();
    }
  }, [userData, puzzlesInEloRange]);

  return (
    <div>
      <Button variant="contained" onClick={() => testUpdate()}>
        TEST
      </Button>
      {/* <ChessBoard
        modeToSet={"puzzle"}
        puzzlesInEloRange={puzzlesInEloRange}
        setPuzzlesInEloRange={setPuzzlesInEloRange}
        updateAllUserPuzzleData={updateAllUserPuzzleData}
      /> */}
    </div>
  );
};

export default ChessPuzzlePage;
