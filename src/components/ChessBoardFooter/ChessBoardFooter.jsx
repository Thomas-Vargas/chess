import { useState, useEffect } from "react";
import { Stack, Paper, Typography, Button, Chip, Fade, IconButton } from "@mui/material";
import CachedIcon from '@mui/icons-material/Cached';
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

const ChessBoardFooter = ({ currentPuzzle, setBoardOrientation, boardOrientation }) => {
  let delay = 1000;

  function convertCamelToSeparated(inputStr) {
    return inputStr
      .replace(/([a-z])([A-Z])/g, "$1 $2") // Insert space before uppercase letters
      .replace(/^./, (str) => str.toUpperCase()); // Capitalize the first letter
  }

  return (
    <div>
      {/* <Stack direction="row" gap={2} mt={1}>
        {currentPuzzle &&
          currentPuzzle.Themes.split(" ").map((theme) => (
            <Fade in={true} timeout={delay}>
              <Chip label={convertCamelToSeparated(theme)} />
            </Fade>
          ))}
      </Stack> */}

      {currentPuzzle && (
        <Fade in={true} timeout={delay}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mt={1} width="480px">
            <IconButton onClick={() => setBoardOrientation(boardOrientation === "white" ? "black" : "white")}>
              <CachedIcon />
            </IconButton>
            <Chip
              label="Game Review"
              component="a"
              href={currentPuzzle.GameUrl}
              variant="outlined"
              target="_blank"
              clickable
              icon={<OpenInNewIcon fontSize="small" />}
              sx={{ flexDirection: "row-reverse", paddingRight: 2 }}
            />
          </Stack>
        </Fade>
      )}
    </div>
  );
};

export default ChessBoardFooter;
