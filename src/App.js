import ChessBoard from "./components/ChessBoard";
import { Stack } from "@mui/material";
import './App.css'

function App() {
  

  return (
    <div>
      <Stack direction="column" justifyContent="center" alignItems="center">
        <h1>Chess App</h1>
        <ChessBoard />
      </Stack>
    </div>
  );
}

export default App;
