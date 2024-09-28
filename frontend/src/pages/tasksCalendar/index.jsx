import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import { formatDate } from "@fullcalendar/core/index.js";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  useTheme,
} from "@mui/material";
import PageHeader from "../../components/PageHeader";
import { tokens } from "../../themes";
import { fetchAllTasks } from "../../services/tasksService";
import Topbar from "../../components/global/TopBar";
import Sidebar from "../../components/global/SideBar";

const Calendar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [currentEvents, setCurrentEvents] = useState([]);

  // Fetch tasks from your API when the component loads
  useEffect(() => {
    const fetchTodoTasks = async () => {
      try {
        const tasks = await fetchAllTasks();
        const events = tasks.map((task) => ({
          id: task.task_id_pk,
          title: task.title,
          start: task.due_date, // Assuming `due_date` is the field for task deadline
          allDay: true, // Assuming all tasks are all-day events; adjust if needed
        }));

        setCurrentEvents(events);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      }
    };

    fetchTodoTasks();
  }, []);

  const handleDateClick = (selected) => {
    const title = prompt("Please Enter a new Title for your Event");
    const calendarApi = selected.view.calendar;
    calendarApi.unselect();

    if (title) {
      // Send the new task to your API
      const newTask = {
        title,
        due_date: selected.startStr,
      };

      // Example: POST the new task to your API
      fetch("/api/todoTasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
      })
        .then((response) => response.json())
        .then((task) => {
          // Add the new event to FullCalendar
          calendarApi.addEvent({
            id: task.task_id_pk,
            title: task.title,
            start: task.due_date,
            allDay: true, // Assuming it's all-day; change if necessary
          });
          setCurrentEvents((prev) => [...prev, { ...task, allDay: true }]);
        })
        .catch((error) => {
          console.error("Failed to create task:", error);
        });
    }
  };

  const handleEventClick = (selected) => {
    if (
      window.confirm(
        `Are you sure you want to delete the event '${selected.event.title}'?`
      )
    ) {
      // Remove event from the calendar
      selected.event.remove();

      // Delete the task from your API
      fetch(`/api/todoTasks/${selected.event.id}`, {
        method: "DELETE",
      })
        .then(() => {
          // Update the currentEvents state to reflect the deletion
          setCurrentEvents((prev) =>
            prev.filter((event) => event.id !== selected.event.id)
          );
          console.log("Task deleted");
        })
        .catch((error) => console.error("Failed to delete task:", error));
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
          >
            <Typography variant="h5">Events</Typography>
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
                    primary={event.title}
                    secondary={
                      <Typography>
                        {formatDate(event.start, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </Typography>
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
              plugins={[
                dayGridPlugin,
                timeGridPlugin,
                interactionPlugin,
                listPlugin,
              ]}
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
              }}
              initialView="dayGridMonth"
              editable={true}
              selectable={true}
              selectMirror={true}
              dayMaxEvents={true}
              select={handleDateClick}
              eventClick={handleEventClick}
              eventsSet={(events) => {
                setCurrentEvents(events);
              }}
              events={currentEvents} // Use the current events state
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Calendar;
