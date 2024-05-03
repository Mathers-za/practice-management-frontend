import { useFetchData } from "../../../CustomHooks/serverStateHooks";
import { format } from "date-fns";
import CreateTreatmentNote from "./CreateTreatmentNote";

import { useRef, useState } from "react";
import EditTreatmentNote from "./EditTreatmentNotes";

export default function PatientTreatmentNotesList({ patientId }) {
  const [showCreateTreatmentNote, setShowCreateTreatmentNote] = useState(false);
  const [showPatchTreatmentNote, setShowPatchTreatmentNote] = useState(false);
  const treatmentNoteIdForEdit = useRef();
  const { data } = useFetchData(
    `/treatmentNotes/viewAll${patientId}`,
    "treatmentNoteData"
  );

  return (
    <>
      <div className="h-screen max-h-screen overflow-auto">
        <button
          onClick={() => setShowCreateTreatmentNote(!showCreateTreatmentNote)}
          type="button"
        >
          {" "}
          Add note{" "}
        </button>

        {data && Object.keys(data).length > 0 ? (
          data.map((treatmentNote) => {
            return (
              <div key={treatmentNote.id}>
                <div style={{ display: "inline-block" }}>
                  <b>
                    {format(new Date(treatmentNote.date), "eee d MMM yyyy")}
                  </b>
                  <br />
                  created on:{" "}
                  {format(new Date(treatmentNote.date), "eee d MMM yyyy")}
                </div>
                <div style={{ display: "inline-block", marginLeft: "30px" }}>
                  {treatmentNote.title}
                  <br />
                  {treatmentNote.subjective}
                  <br />
                  {treatmentNote.objective}
                </div>
                <button
                  onClick={() => {
                    treatmentNoteIdForEdit.current = treatmentNote.id;
                    setShowPatchTreatmentNote(!showPatchTreatmentNote);
                  }}
                  type="button"
                >
                  Edit
                </button>
              </div>
            );
          })
        ) : (
          <div>Create Treatment Notes in order to view them here</div>
        )}

        {showCreateTreatmentNote && (
          <div className="fixed bg-white left-0 top-0 w-full h-screen max-h-screen overflow-auto z-10">
            {" "}
            <CreateTreatmentNote
              patientId={patientId}
              hideComponent={() =>
                setShowCreateTreatmentNote(!showCreateTreatmentNote)
              }
            />
          </div>
        )}

        {showPatchTreatmentNote && (
          <div className="fixed bg-white left-0 top-0 w-full h-screen max-h-screen overflow-auto z-10">
            <EditTreatmentNote
              treatmentNoteId={treatmentNoteIdForEdit.current}
              hideComponent={() =>
                setShowPatchTreatmentNote(!showPatchTreatmentNote)
              }
            />
          </div>
        )}
      </div>
    </>
  );
}
