import { useEffect, useState } from "react";
import TreatmentNoteForm from "./TreatmentNoteForm";
import {
  useFetchData,
  useDeleteData,
  usePatchData,
} from "../../../CustomHooks/serverStateHooks";

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

  const { deleteMutation } = useDeleteData(
    `/treatmentNotes/delete`,
    queryKeyToInValidate && queryKeyToInValidate
  );

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
    try {
      patchMutation.mutate(changes);
      setChanges({});
    } catch (error) {}
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
    deleteMutation.mutate(id);
    hideComponent();
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
      />
    </>
  );
}
