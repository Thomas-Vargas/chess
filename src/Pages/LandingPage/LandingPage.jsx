import { Stack, Slide, Typography, Fade } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../../components/AuthProvider/AuthProvider";

import ChessBoard from "../../components/ChessBoard/ChessBoard";
import LandingPageRegisterCard from "../../components/LandingPageRegisterCard/LandingPageRegisterCard";
import RegisterInfoCard from "../../components/RegisterInfoCard/RegisterInfoCard";

const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  // State to control the initial state of Slide components
  const [slideIn, setSlideIn] = useState(false);

  useEffect(() => {
    if (user) {
      navigate("/testPage");
    }
  }, [user]);

  // UseEffect to set the initial state when the component mounts
  useEffect(() => {
    setSlideIn(true);
  }, []);

  console.log(slideIn);

  return (
    <div style={{ overflow: "hidden" }}>
      <Fade in={slideIn} style={{ transformOrigin: "0 0 0" }} {...(slideIn ? { timeout: 2000 } : {})}>
        <Typography variant="h3" textAlign="center">
          Open Source Chess
        </Typography>
      </Fade>
      <Stack direction="row" gap={8} justifyContent="center" width="100%" height="100%" padding="20px">
        <Slide direction="right" in={slideIn} mountOnEnter unmountOnExit timeout={{ enter: 1000, exit: 1000 }}>
          <ChessBoard />
        </Slide>

        <Stack gap={3} width="30%" mt={8}>
          <Slide direction="top" in={slideIn} mountOnEnter unmountOnExit timeout={{ enter: 1000, exit: 1000 }}>
            <RegisterInfoCard />
          </Slide>
          <Slide direction="left" in={slideIn} mountOnEnter unmountOnExit timeout={{ enter: 1000, exit: 1000 }}>
            <LandingPageRegisterCard />
          </Slide>
        </Stack>
      </Stack>
    </div>
  );
};

export default LandingPage;
