import { useEffect, useState } from "react";
import {
  usePostData,
  useDeleteData,
  useFetchData,
  usePatchData,
} from "../../../CustomHooks/serverStateHooks";
import { format } from "date-fns";
import TextInput from "../../textInput";
import { useParams } from "react-router-dom";

export default function EditCreateTreatmentNote({ patientId }) {
  const { id } = useParams();
  const notePk = id ? id : 0;
  const [noteId, setNoteId] = useState(notePk);
  const { data, httpStatus, refetch } = useFetchData(
    `/treatmentNotes/view${noteId}`,
    "viewSpecificTreatmentNote"
  );

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
      setTreatmentNoteData(data);
      setIsCreateMode(false);
    } else {
      setIsCreateMode(true);
      setTreatmentNoteData({ date: format(new Date(), "yyyy-MM-dd") });
    }
  }, [data]);

  return (
    <>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (isCreateMode) {
            const result = await createMutation.mutateAsync(treatmentNoteData);
            setNoteId(result.id);
            setIsCreateMode(false);

            setChanges({});
          } else {
            patchMutation.mutate(changes);
            setChanges({});
          }
        }}
      >
        <TextInput
          labelText="Title"
          onChange={handleChange}
          type="text"
          name="title"
          value={treatmentNoteData?.title || null}
        />
        <TextInput
          labelText="Date of note creation"
          onChange={handleChange}
          type="date"
          name="date"
          value={
            treatmentNoteData?.date &&
            format(new Date(treatmentNoteData?.date), "yyyy-MM-dd")
          }
        />
        <TextInput
          labelText="Subjective"
          onChange={handleChange}
          type="text"
          name="subjective"
          value={treatmentNoteData?.subjective || null}
        />
        <TextInput
          labelText="Objective"
          onChange={handleChange}
          type="text"
          name="objective"
          value={treatmentNoteData?.objective || null}
        />
        <TextInput
          labelText="Assessment"
          onChange={handleChange}
          type="text"
          name="assessment"
          value={treatmentNoteData?.assessment || null}
        />
        <TextInput
          labelText="Plan"
          onChange={handleChange}
          type="text"
          name="plan"
          value={treatmentNoteData?.plan || null}
        />
        <TextInput
          labelText="Additional Notes"
          onChange={handleChange}
          type="text"
          name="additional_notes"
          value={treatmentNoteData?.additional_notes || null}
        />

        <button disabled={Object.keys(changes).length === 0} type="submit">
          {" "}
          Save{" "}
        </button>
      </form>

      <button
        onClick={() => {
          deleteMutation.mutate(treatmentNoteData.id);
        }}
      >
        Delete
      </button>
    </>
  );
}
