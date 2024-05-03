import { useEffect, useRef, useState } from "react";
import {
  usePostData,
  useDeleteData,
  useFetchData,
  usePatchData,
} from "../../../CustomHooks/serverStateHooks";
import { format } from "date-fns";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import { useParams } from "react-router-dom";
import CustomTextArea from "../../miscellaneous components/CustomTextArea";
import GenericTopBar from "../../miscellaneous components/GenericTopBar";
import Input from "../../miscellaneous components/DisplayTextInput";
import DateDisplay from "../../miscellaneous components/DateDisplay";

import GenericButton from "../../miscellaneous components/SubmitButton";

export default function EditCreateTreatmentNote({
  patientId,
  topBarLabelText,
  hideComponent,
}) {
  const { id } = useParams();
  const notePk = id ? id : 0;
  const [noteId, setNoteId] = useState(notePk);
  const { data } = useFetchData(
    `/treatmentNotes/view${noteId}`,
    "viewSpecificTreatmentNote"
  ); //TODO make the form ui itself resubale and then contionaly render the data/logic in a 2 separte parents ie a edit and a create
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [changes, setChanges] = useState({});

  const [isCreateMode, setIsCreateMode] = useState(false);
  const [treatmentNoteData, setTreatmentNoteData] = useState({
    date: format(new Date(), "yyyy-MM-dd"),
  });

  const { createMutation } = usePostData(
    `/treatmentNotes/create${patientId}`,
    "viewSpecificTreatmentNote"
  );

  const { deleteMutation } = useDeleteData(`/treatmentNotes/delete`);

  const { patchMutation } = usePatchData(
    `/treatmentNotes/update${noteId}`,
    "viewSpecificTreatmentNote"
  );
  function handleChange(e) {
    const { name, value } = e.target;

    setTreatmentNoteData((prev) => ({
      ...prev,
      [name]: value === "" ? null : value,
    }));

    setChanges((prev) => ({
      ...prev,
      [name]: value === "" ? null : value,
    }));
  }

  useEffect(() => {
    if (noteId !== 0) {
      setTreatmentNoteData((prev) => ({ ...prev, ...data }));
      setIsCreateMode(false);
    } else {
      setIsCreateMode(true);
      setTreatmentNoteData({ date: format(new Date(), "yyyy-MM-dd") });
    }
  }, [data]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (isCreateMode) {
      const result = await createMutation.mutateAsync(treatmentNoteData);
      setNoteId(result.id);
      setIsCreateMode(false);

      setChanges({});
    } else {
      patchMutation.mutate(changes);
      setChanges({});
    }
  }

  //TODO fix the ok button on the static date picker.

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
              staticBottomInfo="Choose a title for your note"
              labelText="Title"
            />
          </div>
          <div>
            <DateDisplay
              dateStringOrObject={treatmentNoteData.date}
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
                onChange={(value) => {
                  setTreatmentNoteData((prev) => ({
                    ...prev,
                    date: value,
                  }));
                  setChanges((prev) => ({ ...prev, date: value }));
                }}
                onAccept={(value) => {
                  setTreatmentNoteData((prev) => ({ ...prev, date: value }));
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
            value={treatmentNoteData?.subjective || null}
          />

          <CustomTextArea
            labelText="Objective"
            onchange={handleChange}
            name="objective"
            value={treatmentNoteData?.objective || null}
          />

          <CustomTextArea
            labelText="Assessment"
            onchange={handleChange}
            name="assessment"
            value={treatmentNoteData?.assessment || null}
          />

          <CustomTextArea
            labelText="Plan"
            onchange={handleChange}
            name="plan"
            value={treatmentNoteData?.plan || null}
          />

          <CustomTextArea
            labelText="Additional Notes"
            onChange={handleChange}
            name="additional_notes"
            value={treatmentNoteData?.additional_notes || null}
          />
        </div>

        <div
          className={
            isCreateMode
              ? "flex justify-end pb-3 "
              : "flex justify-between pb-3 "
          }
        >
          {!isCreateMode && (
            <GenericButton
              text="Delete"
              type="button"
              className="bg-red-500  hover:bg-red-600 hover:ring-red-500 "
              onclick={() => {
                {
                  deleteMutation.mutate(treatmentNoteData.id);
                  hideComponent();
                }
              }}
            />
          )}
          <GenericButton
            text="Save"
            disable={Object.keys(changes).length === 0}
            type="submit"
          />
        </div>
      </form>
    </>
  );
}
