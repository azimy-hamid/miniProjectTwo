import { Box, useTheme } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import PageHeader from "../../components/PageHeader.jsx";
import Topbar from "../../components/global/TopBar.jsx";
import Sidebar from "../../components/global/SideBar.jsx";
import PieChart from "../../components/charts/PieChart.jsx";
import { tokens } from "../../themes.js";
import BarChart from "../../components/charts/BarChart.jsx";
import CreateTaskForm from "../createTaskForm/index.jsx";
import TodayTasks from "../../components/TodayTasks.jsx";

const Dashboard = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)"); // Check for non-mobile screen size
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box sx={{ display: "flex", position: "relative" }}>
      <Sidebar />
      <Box m="20px" width="100vw">
        <Topbar />
        <PageHeader title="Dashboard" subTitle="Quick Glimpse at Everything." />

        <Box
          display="grid"
          gridTemplateColumns={isNonMobile ? "repeat(12, 1fr)" : "1fr"} // Adjust columns based on screen size
          gridAutoRows="140px"
          gap="20px"
        >
          <Box
            gridColumn={isNonMobile ? "span 5" : "span 1"} // Adjust for mobile
            gridRow="span 2"
            backgroundColor={colors.primary[400]}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <PieChart />
          </Box>

          <Box
            gridColumn={isNonMobile ? "span 7" : "span 1"} // Adjust for mobile
            gridRow="span 2"
            backgroundColor={colors.primary[400]}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <BarChart />
          </Box>

          <Box
            gridColumn={isNonMobile ? "span 7" : "span 1"} // Adjust for mobile
            gridRow="span 3"
            backgroundColor={colors.primary[400]}
            display="flex"
            alignItems="center"
            justifyContent="center"
            sx={{
              overflow: "auto", // Make content scrollable if necessary
              height: "100%",
            }}
          >
            <CreateTaskForm isDashboard={true} />
          </Box>

          <Box
            gridColumn={isNonMobile ? "span 5" : "span 1"} // Adjust for mobile
            gridRow="span 3"
            backgroundColor={colors.primary[400]}
            display="flex"
            alignItems="start"
            justifyContent="center"
            sx={{
              overflow: "auto", // Make content scrollable if necessary
              height: "100%",
            }}
          >
            <TodayTasks isDashboard={true} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
