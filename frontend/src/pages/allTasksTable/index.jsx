import React, { useState, useEffect } from "react";
import { Box, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../themes";
import PageHeader from "../../components/PageHeader";
import axios from "axios"; // Use axios or fetch for API calls
import Topbar from "../../components/global/TopBar";
import Sidebar from "../../components/global/SideBar";
import { fetchAllTasks } from "../../services/tasksService";

const Tasks = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [tasks, setTasks] = useState([]); // State to store fetched task data
  const [loading, setLoading] = useState(true); // State to track loading status
  const [error, setError] = useState(null); // State to track error status

  // Fetch data from API
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const fetchedTasks = await fetchAllTasks();
        setTasks(fetchedTasks); // Set fetched data to state
        setLoading(false); // Set loading to false once data is fetched
      } catch (err) {
        setError(err.message); // Set error message
        setLoading(false); // Set loading to false even if there's an error
      }
    };

    fetchTasks(); // Call the function to fetch data
  }, []);

  // Define columns according to your task data structure
  const columns = [
    // { field: "task_id_pk", headerName: "Task ID", flex: 0.5 }, // Unique ID for each task
    // { field: "user_id_fk", headerName: "User ID", flex: 0.5 }, // User ID foreign key
    {
      field: "title", // Assuming this field represents the task name
      headerName: "Title",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "description", // Assuming this field represents the task name
      headerName: "Description",
      flex: 1.5,
      cellClassName: "name-column--cell",
    },
    {
      field: "priority", // Assuming this field represents the task name
      headerName: "Priority",
      cellClassName: "name-column--cell",
    },
    { field: "status", headerName: "Status" }, // Status of the task (e.g., completed, pending)
    {
      field: "due_date",
      headerName: "Due Date",
      headerAlign: "left",
      flex: 1,
    },
  ];

  // Display a loading message while data is being fetched
  if (loading) {
    return <div>Loading...</div>;
  }

  // Display an error message if there is an error
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Box sx={{ display: "flex", position: "relative" }}>
      <Sidebar />
      <Box m="20px" width="100vw">
        <Topbar />
        <PageHeader title="TASKS" subTitle="List of Tasks for the User" />
        <Box
          m="40px 0 0 0"
          height="75vh"
          sx={{
            "& .MuiDataGrid-root": {
              border: "none",
            },
            "& .MuiDataGrid-cell": {
              border: "none !important",
            },
            "& .css-1jlz3st": {
              borderTop: "none !important",
            },
            "& .name-column--cell": {
              color: colors.greenAccent[300],
            },
            "& .MuiDataGrid-columnHeader": {
              backgroundColor: colors.blueAccent[700],
              borderBottom: "none !important",
            },
            "& .MuiDataGrid-virtualScroller": {
              backgroundColor: colors.primary[400],
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "none",
              backgroundColor: colors.blueAccent[700],
            },
            "& .MuiDataGrid-toolbarContainer": {
              backgroundColor: colors.blueAccent[700],
            },
            "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
              color: `${colors.grey[100]} !important`,
            },
          }}
        >
          <DataGrid
            rows={tasks} // Use fetched task data as rows
            columns={columns} // Columns defined based on task data structure
            getRowId={(row) => row.task_id_pk} // Ensure each row has a unique ID
            slots={{
              toolbar: GridToolbar,
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Tasks;
