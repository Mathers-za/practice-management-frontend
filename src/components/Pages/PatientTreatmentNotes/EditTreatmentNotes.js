import { useEffect, useState } from "react";
import TreatmentNoteForm from "./TreatmentNoteForm";
import {
  useFetchData,
  useDeleteData,
  usePatchData,
} from "../../../CustomHooks/serverStateHooks";
import { useOnSubmitButtonTextstateManager } from "../../../CustomHooks/otherHooks";
import CustomAlertMessage from "../../miscellaneous components/CustomAlertMessage";

export default function EditTreatmentNote({
  hideComponent,
  treatmentNoteId,
  queryKeyToInValidate,
}) {
  const [changes, setChanges] = useState({});
  const [treatmentNoteData, setTreatmentNoteData] = useState({});

  const { data: treatmentNote } = useFetchData(
    `/treatmentNotes/view${treatmentNoteId}`,
    "treatmentNoteEditData"
  );

  const { patchMutation } = usePatchData(
    `/treatmentNotes/update${treatmentNoteId}`,
    queryKeyToInValidate && queryKeyToInValidate
  );
  const [error, setError] = useState(false);
  const saveButtonText = useOnSubmitButtonTextstateManager(
    "Save",
    undefined,
    patchMutation
  );

  const { deleteMutation } = useDeleteData(
    `/treatmentNotes/delete`,
    queryKeyToInValidate && queryKeyToInValidate
  );
  const deleteButtonText = useOnSubmitButtonTextstateManager(
    "delete",
    undefined,
    deleteMutation
  );
  useEffect(() => {
    if (deleteMutation.isSuccess) {
      setTimeout(() => {
        hideComponent();
      }, 2000);
    }
  }, [deleteMutation.isSuccess]);
  useEffect(() => {
    if (treatmentNote) {
      setTreatmentNoteData(treatmentNote);
    }
  }, [treatmentNote]);

  function handleChange(event) {
    const { name, value } = event.target;

    setTreatmentNoteData((prev) => ({
      ...prev,
      [name]: value === "" ? null : value,
    }));

    setChanges((prev) => ({
      ...prev,
      [name]: value === "" ? null : value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setError("");
    try {
      patchMutation.mutate(changes);
      setChanges({});
    } catch (error) {
      setError(error);
    }
  }

  function handleDateChange(date) {
    setTreatmentNoteData((prev) => ({
      ...prev,
      date: date,
    }));

    setChanges((prev) => ({
      ...prev,
      date: date,
    }));
  }

  function handleDelete(id) {
    setError("");
    try {
      deleteMutation.mutate(id);
    } catch (error) {
      setError(error.message);
    }
  }
  return (
    <>
      <TreatmentNoteForm
        handleChange={handleChange}
        disable={Object.keys(changes).length === 0}
        handleDateChange={handleDateChange}
        hideComponent={hideComponent}
        handleDelete={handleDelete}
        handleSubmit={handleSubmit}
        topBarLabelText="Edit patient treatment note"
        treatmentNoteData={treatmentNoteData}
        isPostRequestBoolean={false}
        saveButtonText={saveButtonText}
        deleteButtonText={deleteButtonText}
      />
      <CustomAlertMessage
        errorFlag={error}
        errorMessage={error}
        successFlag={patchMutation.isSuccess}
        successMessage="Successfully updated treatment note"
      />
      <CustomAlertMessage
        errorFlag={error}
        errorMessage={error}
        successFlag={deleteMutation.isSuccess}
        successMessage="Successfully deleted treatment note"
      />
    </>
  );
}
