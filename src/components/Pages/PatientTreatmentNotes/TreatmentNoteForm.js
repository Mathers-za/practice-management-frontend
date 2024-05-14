import GenericTopBar from "../../miscellaneous components/GenericTopBar";
import { CalendarIcon, MobileDatePicker } from "@mui/x-date-pickers";

import { Button, InputAdornment, TextField } from "@mui/material";

export default function TreatmentNoteForm({
  treatmentNoteData,
  handleChange,
  handleSubmit,
  handleDelete,
  handleDateChange,
  topBarLabelText,
  hideComponent,
  isPostRequestBoolean,
  disable,
}) {
  return (
    <>
      <GenericTopBar label={topBarLabelText} onclick={hideComponent} />
      <form className="space-y-5 w-full h-full  p-5 " onSubmit={handleSubmit}>
        <div className="flex items-center  justify-between  ">
          <div className="w-2/3 ">
            <TextField
              fullWidth
              variant="standard"
              onChange={handleChange}
              name="title"
              value={treatmentNoteData?.title || null}
              label="Title"
              helperText="Field required"
              required={true}
            />
          </div>

          <MobileDatePicker
            orientation="portrait"
            closeOnSelect={true}
            value={new Date(treatmentNoteData.date)}
            onAccept={(date) => handleDateChange(date)}
            slotProps={{
              textField: {
                InputProps: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarIcon />
                    </InputAdornment>
                  ),
                },
              },
              actionBar: { actions: [] },
              toolbar: { sx: { bgcolor: "#38bdf8" } },
            }}
            label="Note Date"
          />
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          <TextField
            multiline
            rows={8}
            label="Subjective"
            onChange={handleChange}
            name="subjective"
            value={treatmentNoteData?.subjective || ""}
            sx={{ ".MuiInputBase-input": { boxShadow: "none" } }}
          />
          <TextField
            multiline
            rows={8}
            label="Objective"
            onChange={handleChange}
            name="objective"
            value={treatmentNoteData?.objective || ""}
            sx={{ ".MuiInputBase-input": { boxShadow: "none" } }}
          />
          <TextField
            multiline
            rows={8}
            label="Assessment"
            onChange={handleChange}
            name="assessment"
            value={treatmentNoteData?.assessment || ""}
            sx={{ ".MuiInputBase-input": { boxShadow: "none" } }}
          />
          <TextField
            multiline
            rows={8}
            label="Plan"
            onChange={handleChange}
            name="plan"
            value={treatmentNoteData?.plan || ""}
            sx={{ ".MuiInputBase-input": { boxShadow: "none" } }}
          />
          <TextField
            multiline
            rows={8}
            label="Additional Notes"
            onChange={handleChange}
            name="additional_notes"
            value={treatmentNoteData?.additional_notes || ""}
            sx={{ ".MuiInputBase-input": { boxShadow: "none" } }}
          />
        </div>

        <div
          className={
            isPostRequestBoolean
              ? "flex justify-end pb-3 "
              : "flex justify-between pb-3 "
          }
        >
          {!isPostRequestBoolean && (
            <Button
              variant="contained"
              color="error"
              type="button"
              onClick={() => {
                handleDelete(treatmentNoteData.id);
              }}
            >
              Delete
            </Button>
          )}
          <Button variant="contained" disabled={disable} type="submit">
            Save
          </Button>
        </div>
      </form>
    </>
  );
}
