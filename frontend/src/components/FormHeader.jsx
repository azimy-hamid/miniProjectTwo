import { Typography, Box, useTheme } from "@mui/material";
import { tokens } from "../themes";

const FormHeader = ({ title, subTitle }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box mb="30px">
      <Typography
        variant="h2"
        color={colors.grey[100]}
        fontWeight="bold"
        sx={{ mb: "5px", textAlign: "center" }}
      >
        {title}
      </Typography>

      <Typography
        variant="h5"
        color={colors.greenAccent[400]}
        sx={{ mb: "5px", textAlign: "center" }}
      >
        {subTitle}
      </Typography>
    </Box>
  );
};

export default FormHeader;
