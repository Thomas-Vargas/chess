import { useEffect, useState } from "react";
import { supabaseClient } from "../../config/supabaseClient";
import { useAuth } from "../../components/AuthProvider/AuthProvider";
import useUserData from "../../utils/userData";

import ChessBoard from "../../components/ChessBoard/ChessBoard";

const ChessPuzzlePage = () => {
  const [puzzlesInEloRange, setPuzzlesInEloRange] = useState(null);
  const { user } = useAuth();
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
        .insert([{
            completedStatus: result,
            userID: userData.userID,
            puzzleID: puzzleID,
        }])
        .select();

        if (error) {
            console.log("error inserting into completed_puzzles", error);
        } else {
            console.log("success inserting into completed_puzzles", data);
        }
  }

  const updateUserElo = async (result, puzzleID, timeToComplete, currentPuzzle) => {
    let eloChange = calculateEloChange(userData.current_elo, currentPuzzle.Rating, result);
    let newElo;

    // save elo history
    const { data: eloHistoryData, error: eloHistoryError } = await supabaseClient
        .from("puzzle_elo_history")
        .insert([{
            userID: user.id,
            elo: newElo
        }])

    if (eloHistoryError) {
        console.log("error inserting into puzzle_elo_history", eloHistoryError);
    } else {
        console.log("success inserting into puzzle_elo_history", eloHistoryData);
    }

    // update current_elo in user_data and ++ puzzles_played
    const { data: currentEloData, error: currentEloError } = await supabaseClient
        .from('user_data')
        .update({ current_elo: newElo })
        .eq('userID', userData.userID)
        .select()

        if (currentEloError) {
            console.log("error updating elo in user_data", currentEloError);
        } else {
            console.log("success updating elo in user_data", currentEloData);
        }
  }
 
  const updateAllPuzzleData = async (result, puzzleID, timeToComplete, currentPuzzle) => {
    await saveCompletedPuzzle(result, puzzleID, timeToComplete);
    await updateUserElo(result, puzzleID, timeToComplete, currentPuzzle);
  }

  useEffect(() => {
    if (userData && !puzzlesInEloRange) {
      getPuzzlesWithinEloRange();
    }
  }, [userData, puzzlesInEloRange]);

  return (
    <div>
      <ChessBoard
        modeToSet={"puzzle"}
        puzzlesInEloRange={puzzlesInEloRange}
        setPuzzlesInEloRange={setPuzzlesInEloRange}
      />
    </div>
  );
};

export default ChessPuzzlePage;
