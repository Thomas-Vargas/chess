import { useState, useEffect, useContext, createContext, useMemo } from "react";
import { Stack, IconButton } from "@mui/material";
import { ThemeProvider, createTheme, useTheme } from "@mui/material/styles";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./components/AuthProvider/AuthProvider";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

import "./App.css";
import TestProtectedPage from "./components/TestProtectedPage/TestProtectedPage";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import LoginCard from "./components/LandingPageRegisterCard/LandingPageRegisterCard";
import ChessBoard from "./components/ChessBoard/ChessBoard";
import NavbarWithSidebar from "./components/NavbarWithSidebar/NavbarWithSidebar";
import LandingPage from "./pages/LandingPage/LandingPage";
import UserDashboard from "./pages/UserDashboard/UserDashboard";
import ChessPuzzlePage from "./pages/ChessPuzzlePage/ChessPuzzlePage";
import { useAuth } from "./components/AuthProvider/AuthProvider";
import { supabaseClient } from "./config/supabaseClient";

const ColorModeContext = createContext({ toggleColorMode: () => {} });

function Controller() {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);

  return (
    <IconButton sx={{ ml: 1 }} onClick={colorMode.toggleColorMode} color="inherit">
      {theme.palette.mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
    </IconButton>
  );
}

function App() {
  const [mode, setMode] = useState("dark");

  const { user } = useAuth();

  // console.log("user", user);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    []
  );

  // color pallete
  let biege = "#F5F5DC";
  let blackOlive = "#3B3C36";
  let burntUmber = "#8A3324";
  // offwhites
  let bone = "#E3DAC9";
  let whiteSmoke = "#F5F5F5";
  let alabaster = "#EDEAE0";
  let eggshell = "#F0EAD6"


  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: burntUmber,
          },
          background: {
            default: mode === "dark" ? blackOlive : biege,
            paper: mode === "dark" ? blackOlive : biege,
          },
          text: {
            primary: mode === "dark" ? "#fff" : "rgba(0, 0, 0, 0.87)",
          },
        },
        overrides: {
          MuiButton: {
            root: {
              color: mode === "dark" ? "#fff" : "rgba(0, 0, 0, 0.87)",
            },
          },
        },
      }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <AuthProvider>
            <Routes>
            <Route
                path="/"
                element={<NavbarWithSidebar darkModeController={<Controller />} component={<LandingPage />} />}
              />

              <Route path="/login" element={<LoginCard />} />
              
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <NavbarWithSidebar darkModeController={<Controller />} component={<UserDashboard />} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/puzzle/"
                element={
                  <ProtectedRoute>
                    <NavbarWithSidebar darkModeController={<Controller />} component={<ChessPuzzlePage />} />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
