import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import { formatDate } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  useTheme,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import PageHeader from "../../components/PageHeader";
import { tokens } from "../../themes";
import Topbar from "../../components/global/TopBar";
import Sidebar from "../../components/global/SideBar";
import {
  fetchAllTasks,
  createTask,
  deleteTask,
  updateTask,
} from "../../services/tasksService";

const Calendar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [currentEvents, setCurrentEvents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    due_date: "",
    priority: "medium",
    status: "incomplete",
  });
  const [selectedDate, setSelectedDate] = useState(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [taskToComplete, setTaskToComplete] = useState(null);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    const fetchTodoTasks = async () => {
      if (initialLoad) {
        // Only fetch tasks on initial load
        try {
          const tasks = await fetchAllTasks(); // Fetch from controller
          const events = tasks.map((task) => ({
            id: task.task_id_pk,
            title: `${task.title} (${task.priority})`,
            description: task.description,
            start: task.due_date,
            status: task.status,
            allDay: true,
          }));
          setCurrentEvents(events);
          setInitialLoad(false); // Set to false after initial load
        } catch (error) {
          console.error("Failed to fetch tasks:", error);
        }
      }
    };

    fetchTodoTasks();
  }, [initialLoad]);

  // Handle modal open/close
  const handleOpenModal = (selected) => {
    setSelectedDate(selected); // Store the selected date
    setNewTask({ ...newTask, due_date: selected.startStr }); // Prepopulate date
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateTask = () => {
    const calendarApi = selectedDate.view.calendar;
    calendarApi.unselect(); // Unselect the date after task creation

    if (newTask.title) {
      createTask(newTask)
        .then((task) => {
          const newEvent = {
            id: task.task_id_pk,
            title: `${task.title} (${task.priority})`,
            start: task.due_date,
            description: task.description,
            status: task.status,
            allDay: true,
          };

          // Add the new event to FullCalendar
          calendarApi.addEvent(newEvent);

          // Update the local state to include the new event
          setCurrentEvents((prevEvents) => [...prevEvents, newEvent]);

          setModalOpen(false); // Close modal after creation
          setInitialLoad(true);
        })
        .catch((error) => {
          console.error("Failed to create task:", error);
        });
    }
  };

  const handleOpenDeleteModal = (taskId) => {
    setTaskToDelete(taskId);
    setTaskToComplete(taskId);
    setDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setTaskToDelete(null);
    setTaskToComplete(null);
  };

  const handleDeleteTask = async () => {
    try {
      await deleteTask(taskToDelete);
      setCurrentEvents((prevEvents) =>
        prevEvents.filter((event) => event.id !== taskToDelete)
      );
      handleCloseDeleteModal();
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const handleCompleteTask = async () => {
    try {
      // Call the updateTask function with the task ID and the updated status
      const taskData = { status: "complete" }; // Update the status to Completed
      await updateTask(taskToComplete, taskData); // Call the API to update the task

      // Update the local state to reflect the change
      setCurrentEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === taskToComplete
            ? {
                ...event,
                status: "complete",
                title: `${event.title} (complete)`,
              }
            : event
        )
      );

      handleCloseDeleteModal();
    } catch (err) {
      console.error("Failed to mark task as complete:", err);
    }
  };

  return (
    <Box sx={{ display: "flex", position: "relative" }}>
      <Sidebar />
      <Box m="20px" width="100vw">
        <Topbar />
        <PageHeader
          title="CALENDAR"
          subTitle="Full Calendar Interactive Page"
        />

        <Box display="flex" justifyContent="space-between">
          {/* Calendar Sidebar */}
          <Box
            flex="1 1 20%"
            backgroundColor={colors.primary[400]}
            p="15px"
            borderRadius="4px"
            sx={{
              maxHeight: "75vh", // Limit the height of the container
              overflowY: "auto", // Enable scrolling when content overflows
            }}
          >
            <Typography variant="h3" sx={{ fontWeight: "bold" }}>
              Events
            </Typography>
            <List>
              {currentEvents.map((event) => (
                <ListItem
                  key={event.id}
                  sx={{
                    backgroundColor: colors.greenAccent[700],
                    margin: "10px 0",
                    borderRadius: "2px",
                  }}
                >
                  <ListItemText
                    primary={event.title || "No Title"}
                    secondary={
                      <>
                        {event.start && (
                          <Typography>
                            {formatDate(event.start, {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </Typography>
                        )}
                        <Typography variant="body2">
                          {event.description || "No Description"}
                        </Typography>
                        <Typography
                          variant="caption"
                          style={{
                            color:
                              event.status === "complete" ? "green" : "orange",
                          }}
                        >
                          {event.status || "Status not set"}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Box>

          {/* Calendar */}
          <Box flex={"1 1 100%"} ml="15px">
            <FullCalendar
              height="75vh"
              plugins={[dayGridPlugin, interactionPlugin, listPlugin]}
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right:
                  "dayGridDay,dayGridWeek,dayGridMonth,dayGridYear,listMonth",
              }}
              initialView="dayGridMonth"
              editable={true}
              selectable={true}
              selectMirror={true}
              dayMaxEvents={true}
              select={handleOpenModal}
              events={currentEvents}
              eventClick={(info) => {
                handleOpenDeleteModal(info.event.id);
              }}
            />
          </Box>
        </Box>

        {/* Modal for creating a new task */}
        <Dialog open={modalOpen} onClose={handleCloseModal}>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="Title"
              name="title"
              value={newTask.title}
              onChange={handleInputChange}
              fullWidth
              required
            />
            <TextField
              margin="dense"
              label="Description"
              name="description"
              value={newTask.description}
              onChange={handleInputChange}
              fullWidth
              required
            />
            <FormControl fullWidth margin="dense">
              <InputLabel id="priority-label">Priority</InputLabel>
              <Select
                labelId="priority-label"
                name="priority"
                value={newTask.priority}
                onChange={handleInputChange}
                label="Priority"
                required
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal}>Cancel</Button>
            <Button onClick={handleCreateTask}>Create</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={deleteModalOpen} onClose={handleCloseDeleteModal}>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            <Typography>
              Do you want to delete this task or mark it as complete?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteModal}>Cancel</Button>
            <Button onClick={handleDeleteTask} color="error">
              Delete
            </Button>

            <Button onClick={handleCompleteTask}>Mark As Complete</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default Calendar;
