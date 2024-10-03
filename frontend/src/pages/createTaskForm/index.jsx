import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Grid,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/FormHeader";
import { createTask } from "../../services/tasksService"; // Assuming you have this service
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Topbar from "../../components/global/TopBar";
import Sidebar from "../../components/global/SideBar";

// Initial values for the form fields
const initialValues = {
  title: "",
  description: "",
  priority: "medium", // Set default value to 'medium'
  due_date: "",
  status: "incomplete", // Set default value to 'incomplete'
};

// Validation schema for form using yup
const taskSchema = yup.object().shape({
  title: yup.string().required("Required"),
  description: yup.string().required("Required"),
  priority: yup.string().oneOf(["low", "medium", "high"]).required("Required"),
  due_date: yup.date().required("Required"),
  status: yup.string().oneOf(["incomplete", "complete"]).required("Required"),
});

const CreateTaskForm = ({ isDashboard = false }) => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleCreateTask = async (values) => {
    try {
      const response = await createTask(values);

      // Get the success message from the backend or a default one
      const successMsg =
        response?.data?.createTaskMessage || "Task created successfully!";

      setErrorMessage(""); // Clear any previous errors
      setSuccessMessage(successMsg); // Display the success message

      // After 2 seconds, redirect to "/getAllTask"
      setTimeout(() => {
        navigate("/getAllTask");
      }, 2000);
    } catch (error) {
      // Get the error message from the backend or a default one
      const errorMsg =
        error.response?.data?.createTaskMessage ||
        "Task creation failed. Please try again.";

      setSuccessMessage(""); // Clear any previous success message
      setErrorMessage(errorMsg); // Display the error message

      console.error("Task creation failed:", error);
    }
  };

  return (
    <Box sx={{ display: "flex", position: "relative", width: "100%" }}>
      {!isDashboard && <Sidebar />}
      <Box width="100vw">
        {!isDashboard && <Topbar />}
        <Box
          m="20px"
          sx={{
            width: "100%", // Ensure full width in the container
            height: isDashboard ? "auto" : "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            margin: "0 auto",
            paddingLeft: "2rem",
            paddingRight: "2rem",
          }}
        >
          {!isDashboard && (
            <Header title="CREATE TASK" subTitle="Add a new task" />
          )}

          <Formik
            onSubmit={handleCreateTask}
            initialValues={initialValues}
            validationSchema={taskSchema}
          >
            {({
              values,
              errors,
              touched,
              handleBlur,
              handleChange,
              handleSubmit,
            }) => (
              <form onSubmit={handleSubmit} style={{ width: "100%" }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      variant="filled"
                      type="text"
                      label="Title"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.title}
                      name="title"
                      error={!!touched.title && !!errors.title}
                      helperText={touched.title && errors.title}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      variant="filled"
                      type="text"
                      label="Description"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.description}
                      name="description"
                      error={!!touched.description && !!errors.description}
                      helperText={touched.description && errors.description}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      select
                      fullWidth
                      variant="filled"
                      label="Priority"
                      name="priority"
                      value={values.priority}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={!!touched.priority && !!errors.priority}
                      helperText={touched.priority && errors.priority}
                    >
                      <MenuItem value="low">Low</MenuItem>
                      <MenuItem value="medium">Medium</MenuItem>
                      <MenuItem value="high">High</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      select
                      fullWidth
                      variant="filled"
                      label="Status"
                      name="status"
                      value={values.status}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={!!touched.status && !!errors.status}
                      helperText={touched.status && errors.status}
                    >
                      <MenuItem value="incomplete">Incomplete</MenuItem>
                      <MenuItem value="complete">Complete</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      variant="filled"
                      type="datetime-local"
                      label="Due Date & Time"
                      InputLabelProps={{ shrink: true }}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.due_date}
                      name="due_date"
                      error={!!touched.due_date && !!errors.due_date}
                      helperText={touched.due_date && errors.due_date}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Box
                      sx={{
                        minHeight: "40px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "start",
                      }}
                    >
                      {errorMessage && (
                        <Typography variant="h5" color="error">
                          {errorMessage}
                        </Typography>
                      )}
                      {successMessage && (
                        <Typography variant="h6" color="success">
                          {successMessage}
                        </Typography>
                      )}
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box display="flex" justifyContent="center" gap={2}>
                      <Button
                        type="submit"
                        color="secondary"
                        variant="contained"
                      >
                        Create Task
                      </Button>
                      <Button
                        color="secondary"
                        variant="outlined"
                        onClick={() => navigate("/dashboard")}
                      >
                        Cancel
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </form>
            )}
          </Formik>
        </Box>
      </Box>
    </Box>
  );
};

export default CreateTaskForm;
