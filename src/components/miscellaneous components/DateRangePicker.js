import InputAdornment from "@mui/material/InputAdornment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { format } from "date-fns";

export default function CustomDatePicker({
  label,
  onchange,
  helperText,
  value,
}) {
  return (
    <>
      <MobileDatePicker
        orientation="portrait"
        view="day"
        value={value ? new Date(value) : null}
        format="yyyy-MM-dd"
        label={label}
        onChange={(value) => onchange(value)}
        closeOnSelect={true}
        sx={{
          width: "12rem",
        }}
        slotProps={{
          textField: {
            size: "small",
            helperText: helperText,
            InputProps: {
              endAdornment: (
                <InputAdornment position="end">
                  <FontAwesomeIcon icon="fa-regular fa-calendar" size="lg" />
                </InputAdornment>
              ),
            },
          },
          actionBar: { actions: [] },
        }}
      />
    </>
  );
}
