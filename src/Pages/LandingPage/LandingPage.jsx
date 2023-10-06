import { Stack, Slide, Typography, Fade } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../../components/AuthProvider/AuthProvider";

import ChessBoard from "../../components/ChessBoard/ChessBoard";
import LandingPageRegisterCard from "../../components/LandingPageRegisterCard/LandingPageRegisterCard";
import RegisterInfoCard from "../../components/RegisterInfoCard/RegisterInfoCard";
import NavbarWithoutSidebar from "../../components/NavbarWithoutSidebar/NavbarWithoutSidebar";

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
            <ChessBoard />
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
