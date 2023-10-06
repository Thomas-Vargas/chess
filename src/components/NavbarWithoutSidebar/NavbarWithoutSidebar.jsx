import { Stack, Toolbar, IconButton, AppBar } from "@mui/material";

const NavbarWithoutSidebar = ({ darkModeController }) => {
  return (
      <AppBar position="fixed">
        <Toolbar style={{ backgroundColor: "#8A3324" }}>
          <Stack direction="row" width="100%" justifyContent="flex-end">
            {darkModeController}
          </Stack>
        </Toolbar>
      </AppBar>
  );
};

export default NavbarWithoutSidebar;
