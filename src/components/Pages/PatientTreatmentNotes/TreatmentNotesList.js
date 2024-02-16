import { useFetchData } from "../../../CustomHooks/serverStateHooks";
import { format } from "date-fns";

import { useNavigate } from "react-router-dom";

export default function PatientTreatmentNotesList({ patientId }) {
  //add navigattion to create treatment note page
  const navigate = useNavigate();

  const { data, httpStatus } = useFetchData(
    `/treatmentNotes/viewAll${patientId}`,
    "treatmentNoteData"
  );

  return (
    <>
      <button
        onClick={() => navigate("/patientPortal/createTreatmentNote")}
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
                <b>{format(new Date(treatmentNote.date), "eee d MMM yyyy")}</b>
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
                  navigate(
                    `/patientPortal/editTreatmentNote/${treatmentNote.id}`
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
    </>
  );
}
