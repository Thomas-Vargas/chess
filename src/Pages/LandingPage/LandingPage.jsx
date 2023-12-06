import { Stack, Slide, Typography, Fade } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../../components/AuthProvider/AuthProvider";
import { supabaseClient } from "../../config/supabaseClient";

import ChessBoard from "../../components/ChessBoard/ChessBoard";
import LandingPageRegisterCard from "../../components/LandingPageRegisterCard/LandingPageRegisterCard";
import RegisterInfoCard from "../../components/RegisterInfoCard/RegisterInfoCard";
import NavbarWithoutSidebar from "../../components/NavbarWithoutSidebar/NavbarWithoutSidebar";

const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  // State to control the initial state of Slide components
  const [slideIn, setSlideIn] = useState(false);
  const [currentPuzzle, setCurrentPuzzle] = useState(null);
  const [boardOrientation, setBoardOrientation] = useState(null);
  const [samplePuzzles, setSamplePuzzles] = useState(null);

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user]);

  // UseEffect to set the initial state when the component mounts
  useEffect(() => {
    setSlideIn(true);
    getSamplePuzzles();
  }, []);

  const generateRandomPuzzleID = () => {
    // Generate a random decimal between 0 (inclusive) and 1 (exclusive)
    const randomDecimal = Math.random();

    // Scale and shift the random decimal to fit the range [1, 103628]
    const randomNumber = Math.floor(randomDecimal * 103628) + 1;

    return randomNumber;
  };

  const getSamplePuzzles = async () => {
    // only 5 puzzles for now
    const puzzleCount = 5;
    const randomPuzzles = [];

    while (randomPuzzles.length < puzzleCount) {
      let randomID = generateRandomPuzzleID();

      const { data: selectedPuzzle, error: puzzleError } = await supabaseClient
        .from("chess_puzzles")
        .select("*")
        .eq("id", randomID);

      if (!puzzleError && selectedPuzzle && selectedPuzzle.length > 0) {
        randomPuzzles.push(selectedPuzzle[0]);
      } else {
        console.error("Error fetching puzzle:", puzzleError);
      }
    }

    console.log("random puzzles", randomPuzzles);

    const reformattedPuzzles = randomPuzzles.map((puzzle) => {
      return { ...puzzle, moves: puzzle.Moves.split(" ") };
    });
    setSamplePuzzles(reformattedPuzzles);
  };

  return (
    <div style={{ height: "100%", overflow: "hidden" }}>
      <div style={{ overflow: "" }}>
        <Fade in={slideIn} style={{ transformOrigin: "0 0 0" }} {...(slideIn ? { timeout: 2000 } : {})}>
          <Typography variant="h3" textAlign="center">
            Open Source Chess
          </Typography>
        </Fade>
        <Stack direction="row" gap={8} justifyContent="center" padding="20px">
          <Slide direction="right" in={slideIn} mountOnEnter unmountOnExit timeout={{ enter: 1000, exit: 1000 }}>
            <ChessBoard
              sampleMode={true}
              modeToSet={"puzzle"}
              currentPuzzle={currentPuzzle}
              setCurrentPuzzle={setCurrentPuzzle}
              boardOrientation={boardOrientation}
              setBoardOrientation={setBoardOrientation}
              puzzlesInEloRange={samplePuzzles}
              setPuzzlesInEloRange={setSamplePuzzles}
              fade={true}
            />
          </Slide>

          <Stack gap={3} width="30%">
            <Slide direction="down" in={slideIn} mountOnEnter unmountOnExit timeout={{ enter: 1000, exit: 1000 }}>
              <RegisterInfoCard />
            </Slide>
            <Slide direction="left" in={slideIn} mountOnEnter unmountOnExit timeout={{ enter: 1000, exit: 1000 }}>
              <LandingPageRegisterCard />
            </Slide>
          </Stack>
        </Stack>
      </div>
    </div>
  );
};

export default LandingPage;
