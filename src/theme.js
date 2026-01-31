import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
      dark: "#0d47a1",
      light: "#e3f2fd",
    },
    background: {
      default: "#f5f9ff",
    },
  },
  typography: {
    fontFamily: "Roboto, Arial",
  },
});

export default theme;
