import { Stack, Paper, Typography, Button, Chip, Fade } from "@mui/material";

const ChessBoardFooter = ({ currentPuzzle }) => {
  let delay = 1000;

  function convertCamelToSeparated(inputStr) {
    return inputStr
      .replace(/([a-z])([A-Z])/g, '$1 $2')  // Insert space before uppercase letters
      .replace(/^./, str => str.toUpperCase());  // Capitalize the first letter
  }

  return (
    <Stack direction="row" gap={2} mt={1}>
      {currentPuzzle &&
        currentPuzzle.Themes.split(" ").map((theme) => (
          <Fade in={true} timeout={delay}>
            <Chip label={convertCamelToSeparated(theme)} />
          </Fade>
        ))}
    </Stack>
  );
};

export default ChessBoardFooter;
