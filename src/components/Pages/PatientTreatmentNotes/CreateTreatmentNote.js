import { useRef, useState } from "react";
import TreatmentNoteForm from "./TreatmentNoteForm";
import { usePostData } from "../../../CustomHooks/serverStateHooks";
import EditTreatmentNote from "./EditTreatmentNotes";

export default function CreateTreatmentNote({ hideComponent, patientId }) {
  const [treatmentNotePayload, setTreatmentNotePayload] = useState({
    date: new Date(),
  });
  const [showEditForm, setShowEditForm] = useState(false);
  const { createMutation } = usePostData(
    `/treatmentNotes/create${patientId}`,
    "treatmentNoteData"
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
    setShowEditForm(!showEditForm);
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
      {showEditForm && (
        <div className="fixed left-0 top-0 w-full z-10 bg-white h-screen overflow-auto">
          {" "}
          <EditTreatmentNote
            treatmentNoteId={createdTreatmentNoteId.current}
            hideComponent={hideComponent}
          />
        </div>
      )}
    </>
  );
}
