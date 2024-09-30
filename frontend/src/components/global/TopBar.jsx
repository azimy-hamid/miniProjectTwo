import { Box, IconButton, useTheme, Menu, MenuItem } from "@mui/material";
import { useContext, useState } from "react";
import { ColorModeContext, tokens } from "../../themes";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { useNavigate } from "react-router-dom"; // Import for navigation
import { logout, deleteUser } from "../../services/authService";

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const navigate = useNavigate(); // For navigation after logout

  const handleLogout = () => {
    logout(); // Call your logout function
    // navigate("/"); // Redirect to login page or wherever you want
    window.location.href = "/";
  };
  // temp handler
  const handleMenuClose = () => {
    setAnchorEl(null); // Close the menu
  };

  // Navigation handlers
  const handleProfileNavigation = () => {
    navigate("/updateUserDetails"); // Navigate to the Profile page
    handleMenuClose(); // Close the dropdown after navigation
  };

  const handleDeleteProfileNavigation = () => {
    deleteUser();
    logout();
    window.location.href = "/";
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget); // Set anchor for the dropdown
  };

  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      {/* Search Bar */}
      <Box
        display="flex"
        backgroundColor={colors.primary[400]}
        borderRadius="3px"
      >
        <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
        <IconButton type="button" sx={{ p: 1 }}>
          <SearchOutlinedIcon />
        </IconButton>
      </Box>

      {/* Icons */}
      <Box display="flex">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>

        <IconButton>
          <NotificationsOutlinedIcon />
        </IconButton>

        <IconButton onClick={handleProfileClick}>
          <PersonOutlinedIcon />
        </IconButton>

        <IconButton onClick={handleLogout}>
          {" "}
          {/* Logout button */}
          <LogoutIcon />
        </IconButton>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleProfileNavigation}>Profile</MenuItem>
        <MenuItem onClick={handleDeleteProfileNavigation}>
          Delete Profile
        </MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </Box>
  );
};

export default Topbar;
