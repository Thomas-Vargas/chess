import { Stack, Paper, Typography, Button, Chip, Fade } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

const ChessBoardFooter = ({ currentPuzzle }) => {
  let delay = 1000;

  function convertCamelToSeparated(inputStr) {
    return inputStr
      .replace(/([a-z])([A-Z])/g, "$1 $2") // Insert space before uppercase letters
      .replace(/^./, (str) => str.toUpperCase()); // Capitalize the first letter
  }

  return (
    <div>
      <Stack direction="row" gap={2} mt={1}>
        {currentPuzzle &&
          currentPuzzle.Themes.split(" ").map((theme) => (
            <Fade in={true} timeout={delay}>
              <Chip label={convertCamelToSeparated(theme)} />
            </Fade>
          ))}
      </Stack>

      {currentPuzzle && (
        <Fade in={true} timeout={delay}>
          <Stack alignItems="center" mt={1}>
            <Chip
              label="Game Review"
              component="a"
              href={currentPuzzle.GameUrl}
              variant="outlined"
              target="_blank"
              clickable
              icon={<OpenInNewIcon fontSize="small" />} // Include the icon as an avatar
              sx={{ flexDirection: "row-reverse", paddingRight: 2 }}
            />
          </Stack>
        </Fade>
      )}
    </div>
  );
};

export default ChessBoardFooter;
