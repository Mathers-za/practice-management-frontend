import { useFetchData } from "../../../CustomHooks/serverStateHooks";
import { format } from "date-fns";

import { useNavigate } from "react-router-dom";
import EditCreateTreatmentNote from "./TreatmentNotesEditCreate";
import { useRef, useState } from "react";

export default function PatientTreatmentNotesList({ patientId }) {
  //add navigattion to create treatment note page
  console.log("the patient id is " + patientId);
  const navigate = useNavigate();
  const [
    showEditAndTreatmentNoteComponent,
    setShowEditAndtreatmentNoteComponent,
  ] = useState(false);
  const treatmentNoteIdToEdit = useRef();
  const { data, httpStatus } = useFetchData(
    `/treatmentNotes/viewAll${patientId}`,
    "treatmentNoteData"
  );

  return (
    <>
      <div className="h-screen max-h-screen overflow-auto">
        <button
          onClick={() =>
            setShowEditAndtreatmentNoteComponent(
              !showEditAndTreatmentNoteComponent
            )
          }
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
                  onClick={() =>
                    setShowEditAndtreatmentNoteComponent(
                      !showEditAndTreatmentNoteComponent
                    )
                  }
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

        {showEditAndTreatmentNoteComponent && (
          <div className="fixed bg-white left-0 top-0 w-full h-screen max-h-screen overflow-auto z-10">
            {" "}
            <EditCreateTreatmentNote
              patientId={patientId}
              hideComponent={() =>
                setShowEditAndtreatmentNoteComponent(
                  !showEditAndTreatmentNoteComponent
                )
              }
              topBarLabelText="Patient treatment Note"
            />
          </div>
        )}
      </div>
    </>
  );
}
