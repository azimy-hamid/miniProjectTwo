import { Typography, Box, useTheme } from "@mui/material";
import { tokens } from "../themes";

const PageHeader = ({ title, subTitle }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box mb="30px">
      <Typography variant="h2" color={colors.grey[100]} fontWeight="bold">
        {title}
      </Typography>

      <Typography variant="h5" color={colors.greenAccent[400]}>
        {subTitle}
      </Typography>
    </Box>
  );
};

export default PageHeader;
