import { useEffect, useRef, useState } from "react";
import TreatmentNoteForm from "./TreatmentNoteForm";
import { usePostData } from "../../../CustomHooks/serverStateHooks";
import { useOnSubmitButtonTextstateManager } from "../../../CustomHooks/otherHooks";
import CustomAlertMessage from "../../miscellaneous components/CustomAlertMessage";
export default function CreateTreatmentNote({
  hideComponent,
  patientId,
  queryKeyToInvalidate,
}) {
  const [treatmentNotePayload, setTreatmentNotePayload] = useState({
    date: new Date(),
  });
  const [error, setError] = useState("");
  const { createMutation } = usePostData(
    `/treatmentNotes/create${patientId}`,
    queryKeyToInvalidate && queryKeyToInvalidate
  );
  const saveButtonText = useOnSubmitButtonTextstateManager(
    "save",
    undefined,
    createMutation
  );
  const createdTreatmentNoteId = useRef(null);

  function handleChange(event) {
    const { name, value } = event.target;

    setTreatmentNotePayload((prev) => ({
      ...prev,
      [name]: value === "" ? null : value,
    }));
  }

  useEffect(() => {
    if (createMutation.isSuccess) {
      setTimeout(() => {
        hideComponent();
      }, 2000);
    }
  }, [createMutation.isSuccess]);

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const response = await createMutation.mutateAsync(treatmentNotePayload);
      createdTreatmentNoteId.current = response.id;
    } catch (error) {
      setError(error.message);
    }
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
        saveButtonText={saveButtonText}
      />
      <CustomAlertMessage
        successFlag={createMutation.isSuccess}
        errorFlag={error}
        errorMessage={error}
        successMessage="Successfully created treatment note"
      />
    </>
  );
}
