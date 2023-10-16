import { useEffect, useState } from "react";
import { supabaseClient } from "../../config/supabaseClient";
import { useAuth } from "../../components/AuthProvider/AuthProvider";
import useUserData from "../../utils/userData";
import { Button, Typography, Stack, Fade } from "@mui/material";

import ChessBoard from "../../components/ChessBoard/ChessBoard";

const ChessPuzzlePage = () => {
  const [puzzlesInEloRange, setPuzzlesInEloRange] = useState(null);
  const [currentPuzzle, setCurrentPuzzle] = useState(null);
  const [userData, setUserData] = useState(null);
  const { user } = useAuth();
  const { session } = useAuth();
  let userDataResult = useUserData(user?.id);

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

    // Filter out completed puzzles - limit to 10 at a time so that a new array of puzzles is returned as the players elo adjusts
    const newPuzzles = shuffleArray(puzzlesWithinRange)
      .map((puzzle) => ({
        ...puzzle,
        moves: puzzle.Moves.split(" "),
      }))
      .filter((puzzle) => !completedPuzzles.some((completedPuzzle) => completedPuzzle.puzzleID === puzzle.id))
      .slice(0, 10);

    // TEST PUZZLES
    // previous puzzle causing incorrect checkmate - now fixed
    // return [{FEN: '3r1r1k/p1p2p1P/4p1p1/4P3/2n4Q/P3BK2/q5P1/nR6 b - - 2 26', moves: ['c4e3', 'h4f6', 'h8h7', 'b1h1', 'h7g8', 'h1h8'], Rating: 1193}];

    // puzzle that allows a castle, but it is not a valid move
    // return [{FEN: 'r1bq3r/ppppnkpp/2n5/b5N1/4P3/B1P5/P4PPP/RN1QK2R b KQ - 1 9', moves: ['f7f8', 'd1f3', 'f8e8', 'f3f7'], Rating: 1193}];

    return newPuzzles;
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

    // save elo history
    const { data: eloHistoryData, error: eloHistoryError } = await supabaseClient
      .from("puzzle_elo_history")
      .insert([
        {
          userID: userData.userID,
          elo: newElo,
        },
      ])
      .select();

    if (eloHistoryError) {
      console.log("error inserting into puzzle_elo_history", eloHistoryError);
    } else {
      console.log("success inserting into puzzle_elo_history", eloHistoryData);
    }

    // update user elo data
    const { data: currentEloData, error: currentEloError } = await supabaseClient
      .from("user_data")
      .update({
        current_elo: newElo,
        highest_elo: newElo > userData.highest_elo ? newElo : userData.highest_elo,
        lowest_elo: newElo < userData.lowest_elo ? newElo : userData.lowest_elo,
        puzzles_played: userData.puzzles_played + 1,
      })
      .eq("userID", userData.userID)
      .select();

    if (currentEloError) {
      console.log("error updating elo in user_data", currentEloError);
    } else {
      console.log("success updating elo in user_data", currentEloData);
      setUserData({
        ...userData,
        current_elo: newElo,
        highest_elo: newElo > userData.highest_elo ? newElo : userData.highest_elo,
        lowest_elo: newElo < userData.lowest_elo ? newElo : userData.lowest_elo,
        puzzles_played: userData.puzzles_played + 1,
      });
    }
  };

  const updateAllUserPuzzleData = async (result, currentPuzzle, timeToComplete) => {
    await saveCompletedPuzzle(result, currentPuzzle.id, timeToComplete);
    await updateUserElo(result, currentPuzzle.id, timeToComplete, currentPuzzle);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (userData && !puzzlesInEloRange) {
        let newPuzzles = await getPuzzlesWithinEloRange();
        setPuzzlesInEloRange(newPuzzles);
      }

      if (userDataResult && !userData) {
        setUserData(userDataResult);
      }
    };

    fetchData();
  }, [userData, puzzlesInEloRange, userDataResult]);

  return (
    <div>
      <Stack direction="row" justifyContent="center" width="100%">
          <ChessBoard
            modeToSet={"puzzle"}
            puzzlesInEloRange={puzzlesInEloRange}
            setPuzzlesInEloRange={setPuzzlesInEloRange}
            updateAllUserPuzzleData={updateAllUserPuzzleData}
            getPuzzlesWithinEloRange={getPuzzlesWithinEloRange}
            currentPuzzle={currentPuzzle}
            setCurrentPuzzle={setCurrentPuzzle}
            fade={true}
          />
      </Stack>
    </div>
  );
};

export default ChessPuzzlePage;
