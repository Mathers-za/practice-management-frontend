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
          <div>
            <DateDisplay
              dateStringOrObject={treatmentNoteData?.date || new Date()}
              onclick={() => setShowDatePicker(!showDatePicker)}
            />
          </div>
        </div>

        {showDatePicker && (
          <div className="fixed left-0 top-0 w-full  bg-opacity-50 bg-slate-500 z-10 flex justify-center items-center">
            (
            <div>
              <StaticDatePicker
                name="date"
                value={new Date(treatmentNoteData.date)}
                onChange={(date) => handleDateChange(date)}
                onAccept={(date) => {
                  handleDateChange(date);
                  setShowDatePicker(!showDatePicker);
                }}
                slotProps={{
                  toolbar: {
                    sx: { backgroundColor: "#0369A1", color: "white" },
                  },

                  actionBar: { actions: ["cancel", "today", "accept"] },
                  layout: {
                    onCancel: () => setShowDatePicker(!showDatePicker),
                  },
                }}
              />
            </div>
            )
          </div>
        )}

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
              className="bg-red-500  hover:bg-red-600 hover:ring-red-500 "
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
