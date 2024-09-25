import { Box, Button, TextField, Typography } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/FormHeader";
import { updateUserDetails } from "../../services/authService";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { useState } from "react"; // Import useState to manage error state
import Topbar from "../../components/global/TopBar";
import Sidebar from "../../components/global/SideBar";

const initialValues = {
  username: "",
  email: "",
  name: "",
  last_name: "",
};

const userSchema = yup.object().shape({
  username: yup.string().required("required"),
  email: yup.string().email("Invalid Email").required("required"),
  name: yup.string().required("required"),
  last_name: yup.string().required("required"),
});

const UpdateUserForm = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate(); // Initialize navigate
  const [errorMessage, setErrorMessage] = useState(""); // State to store error messages

  const handleUpdate = async (values) => {
    try {
      // Here you should include the token in the request headers as per your backend requirements
      const token = localStorage.getItem("token"); // Adjust based on how you're storing the token
      const data = await updateUserDetails(values, token);
      setErrorMessage(""); // Clear any previous errors on success
      // Optionally navigate or display a success message
      window.location.href = "/dashboard"; // Adjust the navigation as needed
    } catch (error) {
      // Extract error message from the response or set a generic message
      const errorMsg =
        error.response?.data?.updateUserMessage ||
        "Update failed. Please try again.";
      setErrorMessage(errorMsg); // Set the error message
      console.error("Update failed:", error);
    }
  };

  return (
    <Box sx={{ display: "flex", position: "relative" }}>
      <Sidebar />
      <Box width="100vw">
        <Topbar />
        <Box
          m="20px"
          sx={{
            width: "70%", // Set the width to 70%
            maxWidth: "1000px", // Optional: Set a maximum width
            height: "100vh", // Full viewport height to center vertically
            display: "flex",
            flexDirection: "column",
            justifyContent: "center", // Center horizontally
            alignItems: "center", // Center vertically
            margin: "0 auto", // Ensure box is centered
          }}
        >
          <Header
            title="UPDATE USER DETAILS"
            subTitle="Update Your Information!"
          />

          <Formik
            onSubmit={handleUpdate}
            initialValues={initialValues}
            validationSchema={userSchema}
          >
            {({
              values,
              errors,
              touched,
              handleBlur,
              handleChange,
              handleSubmit,
            }) => (
              <form onSubmit={handleSubmit}>
                <Box
                  display="grid"
                  gap="30px"
                  gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                  sx={{
                    "& > div": {
                      gridColumn: isNonMobile ? undefined : "span 4",
                    },
                  }}
                >
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="Username"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.username}
                    name="username"
                    error={!!touched.username && !!errors.username}
                    helperText={touched.username && errors.username}
                    sx={{ gridColumn: "span 2" }}
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="Email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.email}
                    name="email"
                    error={!!touched.email && !!errors.email}
                    helperText={touched.email && errors.email}
                    sx={{ gridColumn: "span 2" }}
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="First Name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.name}
                    name="name"
                    error={!!touched.name && !!errors.name}
                    helperText={touched.name && errors.name}
                    sx={{ gridColumn: "span 2" }}
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="Last Name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.last_name}
                    name="last_name"
                    error={!!touched.last_name && !!errors.last_name}
                    helperText={touched.last_name && errors.last_name}
                    sx={{ gridColumn: "span 2" }}
                  />
                  {/* Error message displayed below the last name field */}
                  <Box
                    sx={{
                      gridColumn: "span 4",
                      minHeight: "20px", // Adjust this height as needed
                      mt: -1, // Optional: Adjust to move it closer to the last name field
                      ml: 1, // Optional: Small margin to align with input fields
                    }}
                  >
                    {errorMessage && (
                      <Typography variant="body2" color="error">
                        {errorMessage}
                      </Typography>
                    )}
                  </Box>
                </Box>

                <Box
                  display="flex"
                  justifyContent="center"
                  mt="20px"
                  gap="10px"
                >
                  {/* Update Button */}
                  <Button type="submit" color="secondary" variant="contained">
                    Update
                  </Button>

                  {/* Cancel Button (without submitting the form) */}
                  <Button
                    color="secondary"
                    variant="outlined"
                    onClick={() => navigate("/dashboard")} // Navigate to the dashboard
                  >
                    Cancel
                  </Button>
                </Box>
              </form>
            )}
          </Formik>
        </Box>
      </Box>
    </Box>
  );
};

export default UpdateUserForm;
