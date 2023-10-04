import { Stack, Slide } from "@mui/material";
import ChessBoard from "../components/ChessBoard/ChessBoard";
import LoginCard from "../components/LoginCard/LoginCard";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../components/AuthProvider/AuthProvider";

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

  console.log(slideIn)

  return (
    <div>
      <Stack direction="row" gap={8} justifyContent="center" width="100%">
        <Slide direction="right" in={slideIn} mountOnEnter unmountOnExit timeout={{ enter: 1000, exit: 1000 }}>
          <ChessBoard />
        </Slide>
        <Slide direction="left" in={slideIn} mountOnEnter unmountOnExit timeout={{ enter: 1000, exit: 1000 }}>
          <LoginCard />
        </Slide>
      </Stack>
    </div>
  );
};

export default LandingPage;
