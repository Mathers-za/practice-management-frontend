import { Link, Outlet } from "react-router-dom";
import PatientList from "../PatientList";

export default function PatientPortal({ patientId }) {
  //navbar

  return (
    <>
      <ul>
        <li>
          <Link to="medicalAid"> Medical Aid</Link>
        </li>
        <li>
          <Link to="treatmentNotes"> Treatment Notes</Link>
        </li>
      </ul>
      <h1>This is the pateint portal</h1>
      <div className="w-full max-w-full overflow-clip">
        <Outlet />
      </div>
    </>
  );
}
