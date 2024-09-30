import { Box, Button, TextField, Typography, useTheme } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import PageHeader from "../../components/PageHeader.jsx";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Topbar from "../../components/global/TopBar.jsx";
import Sidebar from "../../components/global/SideBar.jsx";
import PieChart from "../../components/charts/PieChart.jsx";
import { tokens } from "../../themes.js";
import BarChart from "../../components/charts/BarChart.jsx";
import CreateTaskForm from "../createTaskForm/index.jsx";
import TodayTasks from "../../components/TodayTasks.jsx";

const Dashboard = () => {
  //   const isNonMobile = useMediaQuery("(min-width:600px)");
  //   const navigate = useNavigate(); // Initialize navigate

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box sx={{ display: "flex", position: "relative" }}>
      <Sidebar />
      <Box m="20px" width="100vw">
        <Topbar />
        <PageHeader title="Dashboard" subTitle="Quick Glimpse to Everything." />

        <Box
          display="grid"
          gridTemplateColumns="repeat(12, 1fr)"
          gridAutoRows="140px"
          gap="20px"
        >
          <Box
            gridColumn="span 5"
            gridRow="span 2"
            backgroundColor={colors.primary[400]}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <PieChart />
          </Box>

          <Box
            gridColumn="span 7"
            gridRow="span 2"
            backgroundColor={colors.primary[400]}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <BarChart />
          </Box>
          {/* Row 2 */}
          <Box
            gridColumn="span 8"
            gridRow="span 3"
            backgroundColor={colors.primary[400]}
            display="flex"
            alignItems="center"
            justifyContent="center"
            sx={{
              // Ensure the content inside stays within bounds
              overflow: "auto", // Handle overflow by making content scrollable if necessary
              height: "100%", // Make sure the form takes the full height of the box
            }}
          >
            <CreateTaskForm isDashboard={true} />
          </Box>

          <Box
            gridColumn="span 4"
            gridRow="span 3"
            backgroundColor={colors.primary[400]}
            display="flex"
            alignItems="start"
            justifyContent="center"
            sx={{
              // Ensure the content inside stays within bounds
              overflow: "auto", // Handle overflow by making content scrollable if necessary
              height: "100%", // Make sure the form takes the full height of the box
            }}
          >
            <TodayTasks />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
