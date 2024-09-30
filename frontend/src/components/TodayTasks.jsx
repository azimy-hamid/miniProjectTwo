import { Box, Typography } from "@mui/material";
import { tokens } from "../themes.js";
import { useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { fetchAllTodayTasks } from "../services/tasksService.js";
import PageHeader from "./PageHeader.jsx";

const TodayTasks = ({ isDashboard = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const tasks = await fetchAllTodayTasks();
        setTasks(tasks); // Assuming response contains a "tasks" array
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  return (
    <Box>
      <Box
        sx={{ textAlign: "center", paddingTop: "0.5rem", marginBottom: "0" }}
      >
        <PageHeader title="Tasks For Today" />
      </Box>

      {tasks.length === 0 ? (
        <Typography variant="h5" color={colors.grey[100]}>
          No tasks for today
        </Typography>
      ) : (
        tasks.map((task, i) => (
          <Box
            key={`${task.task_id_pk}-${i}`}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.greenAccent[500]}`}
            p="15px"
          >
            {/* Task Title and Priority */}
            <Box>
              <Typography
                color={colors.greenAccent[500]}
                variant="h5"
                fontWeight="600"
              >
                {task.title}
              </Typography>

              <Typography color={colors.grey[100]} variant="body1">
                Priority: {task.priority}
              </Typography>
            </Box>

            {/* Due Date */}
            <Box color={colors.grey[100]}>
              {new Date(task.due_date).toLocaleString()}{" "}
              {/* Display task due date */}
            </Box>

            {/* Task Status */}
            <Box
              backgroundColor={
                task.status === "complete"
                  ? colors.greenAccent[500]
                  : colors.redAccent[500]
              } // Green for complete, red for incomplete
              p="5px 10px"
              borderRadius="4px"
            >
              {task.status}
            </Box>
          </Box>
        ))
      )}
    </Box>
  );
};

export default TodayTasks;
