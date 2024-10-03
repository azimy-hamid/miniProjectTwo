import {
  Box,
  Button,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  colors,
  useTheme,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/FormHeader";
import { updateUserDetails, getUserDetails } from "../../services/authService"; // Assuming you'll create a getUserDetails function
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Topbar from "../../components/global/TopBar";
import Sidebar from "../../components/global/SideBar";
import { tokens } from "../../themes";

const initialValues = {
  username: "",
  email: "",
  name: "",
  last_name: "",
  password: "",
};

const userSchema = yup.object().shape({
  username: yup.string().required("required"),
  email: yup.string().email("Invalid Email").required("required"),
  name: yup.string().required("required"),
  last_name: yup.string().required("required"),
  password: yup.string().required("required"),
});

const UpdateUserForm = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [userData, setUserData] = useState({}); // State to store user data
  const [editableFields, setEditableFields] = useState({}); // State to store editable fields
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getUserDetails(); // Fetch user details
        setUserData(data); // Set user data
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchData();
  }, []);

  const handleFieldChange = (field, value) => {
    setEditableFields((prevFields) => ({
      ...prevFields,
      [field]: value,
    }));
  };

  const handleUpdateField = async (field) => {
    try {
      const values = { [field]: editableFields[field] };
      const data = await updateUserDetails(values);
      setErrorMessage("");
      window.location.href = "/dashboard";
    } catch (error) {
      const errorMsg =
        error.response?.data?.updateUserMessage ||
        "Update failed. Please try again.";
      setErrorMessage(errorMsg);
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
            width: "70%",
            maxWidth: "1000px",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            margin: "0 auto",
          }}
        >
          <Header
            title="UPDATE USER DETAILS"
            subTitle="Update Your Information!"
          />

          {/* User Details Table */}
          {userData ? (
            <TableContainer
              component={Paper}
              sx={{
                "& .MuiTableHead-root": {
                  backgroundColor: colors.blueAccent[700],
                },
                "& .MuiTableCell-head": {
                  color: colors.grey[100],
                  fontWeight: "bold",
                  backgroundColor: colors.blueAccent[700],
                },
                "& .MuiTableRow-root": {
                  backgroundColor: colors.primary[400],
                },
                "& .MuiTableCell-root": {
                  borderBottom: "none",
                  color: colors.grey[100],
                },
              }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Details</TableCell>
                    <TableCell>Current Detail</TableCell>
                    <TableCell>New Detail</TableCell>
                    <TableCell>Update Detail</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Username</TableCell>
                    <TableCell>{userData?.user?.username}</TableCell>
                    <TableCell>
                      <TextField
                        fullWidth
                        variant="standard"
                        placeholder="Update Username"
                        onChange={(e) =>
                          handleFieldChange("username", e.target.value)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        sx={{ backgroundColor: colors.blueAccent[500] }}
                        onClick={() => handleUpdateField("username")}
                      >
                        Update
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Email</TableCell>
                    <TableCell>{userData?.user?.email}</TableCell>
                    <TableCell>
                      <TextField
                        fullWidth
                        variant="standard"
                        placeholder="Update Email"
                        onChange={(e) =>
                          handleFieldChange("email", e.target.value)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        onClick={() => handleUpdateField("email")}
                        sx={{ backgroundColor: colors.blueAccent[500] }}
                      >
                        Update
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>First Name</TableCell>
                    <TableCell>{userData?.user?.name}</TableCell>
                    <TableCell>
                      <TextField
                        fullWidth
                        variant="standard"
                        placeholder="Update First Name"
                        onChange={(e) =>
                          handleFieldChange("name", e.target.value)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        onClick={() => handleUpdateField("name")}
                        sx={{ backgroundColor: colors.blueAccent[500] }}
                      >
                        Update
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Last Name</TableCell>
                    <TableCell>{userData?.user?.last_name}</TableCell>
                    <TableCell>
                      <TextField
                        fullWidth
                        variant="standard"
                        placeholder="Update Last Name"
                        onChange={(e) =>
                          handleFieldChange("last_name", e.target.value)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        onClick={() => handleUpdateField("last_name")}
                        sx={{ backgroundColor: colors.blueAccent[500] }}
                      >
                        Update
                      </Button>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>Password</TableCell>
                    <TableCell>
                      &bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;
                    </TableCell>
                    <TableCell>
                      <TextField
                        fullWidth
                        variant="standard"
                        placeholder="Update Password"
                        onChange={(e) =>
                          handleFieldChange("password", e.target.value)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        onClick={() => handleUpdateField("password")}
                        sx={{ backgroundColor: colors.blueAccent[500] }}
                      >
                        Update
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography>Loading user details...</Typography>
          )}

          <Box sx={{ minHeight: "20px", mt: -1, ml: 1 }}>
            {errorMessage && (
              <Typography variant="body2" color="error">
                {errorMessage}
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default UpdateUserForm;
