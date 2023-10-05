import { Stack, Toolbar, IconButton,  } from "@mui/material";

const Navbar = ({ darkModeController }) => {
  return (
    <AppBar position="fixed">
      <Toolbar style={{ backgroundColor: "primary" }}>
        <Stack direction="row" width="100%" justifyContent="flex-end">
          {darkModeController}
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
