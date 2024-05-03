import { useState } from "react";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import GenericButton from "../../miscellaneous components/SubmitButton";
import Input from "../../miscellaneous components/DisplayTextInput";
import CustomTextArea from "../../miscellaneous components/CustomTextArea";
import DateDisplay from "../../miscellaneous components/DateDisplay";
import GenericTopBar from "../../miscellaneous components/GenericTopBar";
import { MobileDatePicker } from "@mui/x-date-pickers";

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
  const [showDatePicker, setShowDatePicker] = useState(false);

  return (
    <>
      <GenericTopBar label={topBarLabelText} onclick={hideComponent} />
      <form className="space-y-5 w-full h-full  p-5 " onSubmit={handleSubmit}>
        <div className="flex items-center  justify-between  ">
          <div className="w-2/3 ">
            <Input
              onchange={handleChange}
              name="title"
              value={treatmentNoteData?.title || null}
              staticBottomInfo="This field is required"
              labelText="Title"
              required={true}
            />
          </div>
          <MobileDatePicker
            orientation="portrait"
            closeOnSelect={true}
            value={new Date(treatmentNoteData.date)}
            onAccept={(date) => handleDateChange(date)}
            slotProps={{
              actionBar: { actions: [] },
              toolbar: { sx: { bgcolor: "#38bdf8" } },
            }}
            label="Note Date"
          />
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          <CustomTextArea
            labelText="Subjective"
            onchange={handleChange}
            name="subjective"
            value={treatmentNoteData?.subjective || ""}
          />

          <CustomTextArea
            labelText="Objective"
            onchange={handleChange}
            name="objective"
            value={treatmentNoteData?.objective || ""}
          />

          <CustomTextArea
            labelText="Assessment"
            onchange={handleChange}
            name="assessment"
            value={treatmentNoteData?.assessment || ""}
          />

          <CustomTextArea
            labelText="Plan"
            onchange={handleChange}
            name="plan"
            value={treatmentNoteData?.plan || ""}
          />

          <CustomTextArea
            labelText="Additional Notes"
            onchange={handleChange}
            name="additional_notes"
            value={treatmentNoteData?.additional_notes || ""}
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
            <GenericButton
              text="Delete"
              type="button"
              className=" hover:bg-red-600 bg-red-500 hover:ring-red-500"
              onclick={() => {
                {
                  handleDelete(treatmentNoteData.id);
                }
              }}
            />
          )}
          <GenericButton text="Save" disable={disable} type="submit" />
        </div>
      </form>
    </>
  );
}
