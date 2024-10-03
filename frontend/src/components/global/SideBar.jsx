import { useState, useEffect } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import { Box, colors, IconButton, Typography, useTheme } from "@mui/material";
import { Link, useLocation } from "react-router-dom"; // Import useLocation
import { tokens } from "../../themes";
import { getUserDetails } from "../../services/authService.js";

// ICONS
import HomeIcon from "@mui/icons-material/Home";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import AssignmentIcon from "@mui/icons-material/Assignment";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const [userData, setUserData] = useState({}); // State to store user data
  const location = useLocation(); // Get current location

  const Item = ({ title, to, icon }) => {
    return (
      <MenuItem
        active={selected === title}
        style={{
          color: colors.grey[100],
        }}
        onClick={() => setSelected(title)}
        icon={icon}
      >
        <Typography>{title}</Typography>
        <Link to={to} />
      </MenuItem>
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getUserDetails(); // Fetch user details
        setUserData(data); // Set user data
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchData();
  }, []);

  // Update selected state based on current location
  useEffect(() => {
    const path = location.pathname;
    switch (path) {
      case "/dashboard":
        setSelected("Dashboard");
        break;
      case "/updateUserDetails":
        setSelected("Update details");
        break;
      case "/getAllTask":
        setSelected("View All Tasks");
        break;
      case "/createTask":
        setSelected("Add Task");
        break;
      case "/tasksCalendar":
        setSelected("View Calendar");
        break;
      default:
        setSelected("Dashboard"); // Default to Dashboard or set to any appropriate value
        break;
    }
  }, [location]); // Dependency array ensures this runs on location change

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        "& .pro-sidebar-inner": {
          height: "100vh",
          background: `${colors.primary[400]} !important`,
          position: "fixed", // Fixed position
          width: isCollapsed ? "80px" : "240px", // Fluid width based on collapsed state
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {/* USER */}
          {!isCollapsed && (
            <Box mb="25px">
              <Box textAlign="center">
                <Typography
                  variant="h3"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                  Welcome Back!
                </Typography>
                <Typography variant="h4" color={colors.greenAccent[500]}>
                  {userData?.user?.name}
                </Typography>
              </Box>
            </Box>
          )}

          {/* MENU ITEMS */}
          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            <Item title="Dashboard" to="/dashboard" icon={<HomeIcon />} />
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              User
            </Typography>
            <Item
              title="Update details"
              to="/updateUserDetails"
              icon={<ManageAccountsIcon />}
            />
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Tasks
            </Typography>
            <Item
              title="View All Tasks"
              to="/getAllTask"
              icon={<AssignmentIcon />}
            />
            <Item title="Add Task" to="/createTask" icon={<LibraryAddIcon />} />
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Calendar
            </Typography>
            <Item
              title="View Calendar"
              to="/tasksCalendar"
              icon={<EditCalendarIcon />}
            />
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
