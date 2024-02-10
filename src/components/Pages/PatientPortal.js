import { Link, Outlet } from "react-router-dom";
import PatientList from "../PatientList";

export default function PatientPortal({ patientId }) {
  //navbar
  console.log("patinetid in patient portal is " + patientId);

  return (
    <>
      <ul>
        <li>
          <Link to="medicalAid"> Medical Aid</Link>
        </li>
      </ul>
      <h1>This is the pateint portal</h1>

      <Outlet />
    </>
  );
}
