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
import LoginCard from "./components/LoginCard/LoginCard";
import ChessBoard from "./components/ChessBoard/ChessBoard";
import NavbarWithSidebar from "./components/NavbarWithSidebar/NavbarWithSidebar";
import LandingPage from "./Pages/LandingPage";

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

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    []
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: "#8A3324",
          },
          darkTest: {
            main: "#3B3C36",
          },
          biege: {
            main: "#F5F5DC",
          },
          bone: {
            main: "#E3DAC9",
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
                path="/testPage"
                element={
                  <ProtectedRoute>
                    <NavbarWithSidebar darkModeController={<Controller />} component={<TestProtectedPage />} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/"
                element={<NavbarWithSidebar darkModeController={<Controller />} component={<LandingPage />} />}
              />

              <Route path="/login" element={<LoginCard />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
