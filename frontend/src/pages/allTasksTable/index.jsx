import React, { useState, useEffect } from "react";
import { Box, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../themes";
import PageHeader from "../../components/PageHeader";
import axios from "axios"; // Use axios or fetch for API calls

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
        const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
        const response = await axios.get(
          "http://localhost:8000/task/getAllTask",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTasks(response.data.tasks); // Set fetched data to state
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
    { field: "id", headerName: "Task ID", flex: 0.5 }, // Unique ID for each task
    { field: "user_id_fk", headerName: "User ID", flex: 0.5 }, // User ID foreign key
    {
      field: "task_name", // Assuming this field represents the task name
      headerName: "Task Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "due_date",
      headerName: "Due Date",
      type: "date",
      headerAlign: "left",
    }, // Due date of the task
    { field: "status", headerName: "Status", flex: 1 }, // Status of the task (e.g., completed, pending)
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
    <Box m="20px">
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
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          rows={tasks} // Use fetched task data as rows
          columns={columns} // Columns defined based on task data structure
          getRowId={(row) => row.id} // Ensure each row has a unique ID
          slots={{
            toolbar: GridToolbar,
          }}
        />
      </Box>
    </Box>
  );
};

export default Tasks;
