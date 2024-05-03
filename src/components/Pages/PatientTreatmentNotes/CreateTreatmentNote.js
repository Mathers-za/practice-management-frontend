import { useState } from "react";
import TreatmentNoteForm from "./TreatmentNoteForm";
import { usePostData } from "../../../CustomHooks/serverStateHooks";

export default function CreateTreatmentNote({ hideComponent, patientId }) {
  const [treatmentNotePayload, setTreatmentNotePayload] = useState({
    date: new Date(),
  });

  const { createMutation } = usePostData(
    `/treatmentNotes/create${patientId}`,
    "treatmentNoteData"
  );

  function handleChange(event) {
    const { name, value } = event.target;

    setTreatmentNotePayload((prev) => ({
      ...prev,
      [name]: value === "" ? null : value,
    }));
  }

  function handleSubmit() {
    createMutation.mutate(treatmentNotePayload);
    hideComponent();
  }

  function handleDateChange(date) {
    setTreatmentNotePayload((prev) => ({
      ...prev,
      date: date,
    }));
  }

  return (
    <>
      <TreatmentNoteForm
        handleChange={handleChange}
        hideComponent={hideComponent}
        handleSubmit={handleSubmit}
        isPostRequestBoolean={true}
        handleDateChange={handleDateChange}
        topBarLabelText="Create patient treatment note"
        treatmentNoteData={treatmentNotePayload}
        disable={!treatmentNotePayload?.title}
      />
    </>
  );
}
