import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "input:focus": {
            boxShadow: "none",
          },
        },
      },
    },
  },
});

export default theme;
