import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { tokens } from "../themes.js";
import { useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { fetchAllTodayTasks } from "../services/tasksService.js";

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
    <Box
      sx={{
        padding: "2.5rem 1rem 0 1rem",
      }}
    >
      <Box
        sx={{
          backgroundColor: colors.greenAccent[900],
          padding: "1rem",
          textAlign: "center",
          mb: "1rem",
        }}
      >
        <Typography
          variant="h4"
          color={colors.blueAccent[500]}
          fontWeight="600"
        >
          Tasks For Today
        </Typography>
      </Box>

      {tasks.length === 0 ? (
        <Typography variant="h5" color={colors.grey[100]}>
          No tasks for today
        </Typography>
      ) : (
        <TableContainer sx={{ marginTop: "1rem", borderRadius: "8px" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{ color: colors.greenAccent[500], fontWeight: "600" }}
                >
                  Task
                </TableCell>
                <TableCell
                  sx={{ color: colors.greenAccent[500], fontWeight: "600" }}
                >
                  Priority
                </TableCell>
                <TableCell
                  sx={{ color: colors.greenAccent[500], fontWeight: "600" }}
                >
                  Due Date
                </TableCell>
                <TableCell
                  sx={{ color: colors.greenAccent[500], fontWeight: "600" }}
                >
                  Status
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks.map((task, i) => (
                <TableRow key={`${task.task_id_pk}-${i}`}>
                  <TableCell>
                    <Typography color={colors.greenAccent[500]} variant="h6">
                      {task.title}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography color={colors.grey[100]}>
                      {task.priority}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography color={colors.grey[100]}>
                      {new Date(task.due_date).toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box
                      backgroundColor={
                        task.status === "complete"
                          ? colors.greenAccent[500]
                          : colors.redAccent[500]
                      }
                      p="5px 10px"
                      borderRadius="4px"
                      textAlign="center"
                    >
                      {task.status}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default TodayTasks;
