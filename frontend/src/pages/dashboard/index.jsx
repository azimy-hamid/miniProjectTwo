import { Box, Button, TextField } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import PageHeader from "../../components/PageHeader.jsx";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Topbar from "../../components/global/TopBar.jsx";
import Sidebar from "../../components/global/SideBar.jsx";

const Dashboard = () => {
  //   const isNonMobile = useMediaQuery("(min-width:600px)");
  //   const navigate = useNavigate(); // Initialize navigate

  return (
    <Box sx={{ display: "flex", position: "relative" }}>
      <Sidebar />
      <Box m="20px" width="100vw">
        <Topbar />
        <PageHeader title="Dashboard" subTitle="Quick Glimpse to Everything." />
      </Box>
    </Box>
  );
};

export default Dashboard;
