import { createTheme, styled } from "@mui/material/styles";
import { MobileDatePicker } from "@mui/x-date-pickers";

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
