import { useRef, useState } from "react";
import TreatmentNoteForm from "./TreatmentNoteForm";
import { usePostData } from "../../../CustomHooks/serverStateHooks";

export default function CreateTreatmentNote({
  hideComponent,
  patientId,
  queryKeyToInvalidate,
}) {
  const [treatmentNotePayload, setTreatmentNotePayload] = useState({
    date: new Date(),
  });

  const { createMutation } = usePostData(
    `/treatmentNotes/create${patientId}`,
    queryKeyToInvalidate && queryKeyToInvalidate
  );
  const createdTreatmentNoteId = useRef(null);

  function handleChange(event) {
    const { name, value } = event.target;

    setTreatmentNotePayload((prev) => ({
      ...prev,
      [name]: value === "" ? null : value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const response = await createMutation.mutateAsync(treatmentNotePayload);
    createdTreatmentNoteId.current = response.id;
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
