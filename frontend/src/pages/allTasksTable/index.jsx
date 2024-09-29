import React, { useState, useEffect } from "react";
import { Box, Button, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../themes";
import PageHeader from "../../components/PageHeader";
import Topbar from "../../components/global/TopBar";
import Sidebar from "../../components/global/SideBar";
import {
  fetchAllTasks,
  updateTask,
  deleteTask,
} from "../../services/tasksService"; // Import markTaskAsComplete function

const Tasks = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from API
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const fetchedTasks = await fetchAllTasks();
        setTasks(fetchedTasks);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Handle marking task as complete
  const handleCompleteTask = async (taskId) => {
    try {
      // Call the updateTask function with the task ID and the updated status
      const taskData = { status: "complete" }; // Update the status to Completed
      await updateTask(taskId, taskData); // Call the API to update the task

      // Update the local state to reflect the change
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.task_id_pk === taskId ? { ...task, status: "complete" } : task
        )
      );
    } catch (err) {
      console.error("Failed to mark task as complete:", err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId); // Call the API to delete the task

      // Update local state to remove the deleted task
      setTasks((prevTasks) =>
        prevTasks.filter((task) => task.task_id_pk !== taskId)
      );
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  };

  // Define columns according to your task data structure
  const columns = [
    {
      field: "title",
      headerName: "Title",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "description",
      headerName: "Description",
      flex: 1.5,
      cellClassName: "name-column--cell",
    },
    {
      field: "priority",
      headerName: "Priority",
      cellClassName: "name-column--cell",
    },
    { field: "status", headerName: "Status" }, // Status of the task
    {
      field: "due_date",
      headerName: "Due Date",
      headerAlign: "left",
      flex: 1,
      renderCell: (params) => {
        // Convert the due_date to a local string in EDT
        const utcDate = new Date(params.value); // Assuming the date is stored in UTC
        const edtDate = utcDate.toLocaleString("en-US", {
          timeZone: "America/New_York",
        });

        return edtDate; // Return the converted date string
      },
    },
    {
      field: "markComplete",
      headerName: "Mark As Complete",
      flex: 0.6,
      sortable: false,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleCompleteTask(params.row.task_id_pk)} // Call handleCompleteTask with task ID
          disabled={params.row.status === "Completed"} // Disable button if task is already completed
        >
          {params.row.status === "complete" ? "Completed" : "Mark as Complete"}
        </Button>
      ),
    },

    {
      field: "deleteTask",
      headerName: "Delete Task",
      flex: 0.5,
      sortable: false,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="secondary"
          onClick={() => handleDeleteTask(params.row.task_id_pk)} // Call handleDeleteTask with task ID
          // sx={{ ml: 1 }}
        >
          Delete
        </Button>
      ),
    },
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

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
            "& .MuiDataGrid-root": { border: "none" },
            "& .MuiDataGrid-cell": { border: "none !important" },
            "& .css-1jlz3st": { borderTop: "none !important" },
            "& .name-column--cell": { color: colors.greenAccent[300] },
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
            rows={tasks}
            columns={columns}
            getRowId={(row) => row.task_id_pk}
            slots={{ toolbar: GridToolbar }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Tasks;
