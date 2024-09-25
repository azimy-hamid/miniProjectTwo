import { Box, Button, TextField, Typography } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
// import axios from "axios";
import FormHeader from "../../components/FormHeader";
import { registerUser } from "../../services/authService";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { useState } from "react"; // Import useState to manage error state

const initialValues = {
  username: "",
  email: "",
  password: "",
  name: "",
  last_name: "",
};

const userSchema = yup.object().shape({
  username: yup.string().required("required"),
  email: yup.string().email("Invalid Email").required("required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("required"),
  name: yup.string().required("required"),
  last_name: yup.string().required("required"),
});

const SignupForm = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState(""); // State to store error messages

  const handleRegister = async (values) => {
    try {
      const data = await registerUser(values);
      if (data.token) {
        setErrorMessage(""); // Clear any previous errors on success
        // navigate("/dashboard");
        window.location.href = "/dashboard";
      }
    } catch (error) {
      // Extract error message from the response or set a generic message
      const errorMsg =
        error.response?.data?.registerUserError ||
        "Sign Up failed. Please try again.";
      setErrorMessage(errorMsg); // Set the error message
      console.error("Sign Up failed:", error);
    }
  };

  return (
    <Box
      sx={{
        display: "flex", // Use flexbox
        flexDirection: "column",
        justifyContent: "center", // Center horizontally
        width: "70%", // Set the width to 100%
        // maxWidth: "1000px", // Optional: Set a maximum width
        height: "100vh", // Full viewport height to center vertically
        alignItems: "center", // Center vertically
        margin: "0 auto", // Ensure box is centered
      }}
    >
      <FormHeader title="SIGN UP" subTitle="Create a New User Profile" />

      <Formik
        onSubmit={handleRegister}
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
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
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

              <TextField
                fullWidth
                variant="filled"
                type="password"
                label="Password"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.password}
                name="password"
                error={!!touched.password && !!errors.password}
                helperText={touched.password && errors.password}
                sx={{ gridColumn: "span 4" }}
              />

              <Box
                sx={{
                  gridColumn: "span 4",
                  minHeight: "20px", // Adjust this height as needed
                  mt: -1, // Optional: Adjust to move it closer to the password field
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
            <Box display="flex" justifyContent="center" mt="20px" gap="10px">
              <Button type="submit" color="secondary" variant="contained">
                Create New User
              </Button>

              <Button
                color="secondary"
                variant="outlined"
                onClick={() => navigate("/")} // Navigate to the sign-up form
              >
                Log In
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default SignupForm;
