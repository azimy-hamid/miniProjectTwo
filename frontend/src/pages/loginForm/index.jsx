import { Box, Button, TextField, Typography } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/FormHeader";
import { loginUser } from "../../services/authService";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { useState } from "react"; // Import useState to manage error state

import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const initialValues = {
  username: "",
  email: "",
  password: "",
};

const userSchema = yup.object().shape({
  username: yup.string().required("required"),
  email: yup.string().email("Invalid Email").required("required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("required"),
});

const LoginForm = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate(); // Initialize navigate
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleLogin = async (values) => {
    try {
      const data = await loginUser(values);
      if (data.token) {
        setErrorMessage(""); // Clear any previous errors on success
        // navigate("/dashboard");
        window.location.href = "/dashboard";
      }
    } catch (error) {
      // Extract error message from the response or set a generic message
      const errorMsg =
        error.response?.data?.loginUserError ||
        "Login failed. Please try again.";
      setErrorMessage(errorMsg); // Set the error message
      console.error("Login failed:", error);
    }
  };

  return (
    <Box
      m="20px"
      sx={{
        width: "70%", // Set the width to 100%
        maxWidth: "1000px", // Optional: Set a maximum width
        height: "100vh", // Full viewport height to center vertically
        display: "flex", // Use flexbox
        flexDirection: "column",
        justifyContent: "center", // Center horizontally
        alignItems: "center", // Center vertically
        margin: "0 auto", // Ensure box is centered
      }}
    >
      <Header title="LOG IN" subTitle="Log In To Manage Your Tasks!" />

      <Formik
        onSubmit={handleLogin}
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
              <Box sx={{ position: "relative", gridColumn: "span 4" }}>
                <TextField
                  fullWidth
                  variant="filled"
                  type={showPassword ? "text" : "password"}
                  label="Password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.password}
                  name="password"
                  error={!!touched.password && !!errors.password}
                  helperText={touched.password && errors.password}
                  InputProps={{
                    endAdornment: (
                      <Button
                        onClick={handleClickShowPassword}
                        sx={{
                          position: "absolute",
                          right: 0,
                          zIndex: 1,
                          backgroundColor: "transparent",
                          "&:hover": {
                            backgroundColor: "transparent",
                          },
                          "&:focus": {
                            outline: "none",
                          },
                        }}
                        disableRipple // Disable the click effect
                      >
                        {showPassword ? (
                          <VisibilityOffIcon />
                        ) : (
                          <VisibilityIcon />
                        )}
                      </Button>
                    ),
                  }}
                />
              </Box>
              {/* Error message displayed below the password field */}
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
              </Box>{" "}
            </Box>

            <Box display="flex" justifyContent="center" mt="20px" gap="10px">
              {/* Log In Button */}
              <Button type="submit" color="secondary" variant="contained">
                Log In
              </Button>

              {/* Sign Up Button (without submitting the form) */}
              <Button
                color="secondary"
                variant="outlined"
                onClick={() => navigate("/signup")} // Navigate to the sign-up form
              >
                Sign Up
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default LoginForm;
