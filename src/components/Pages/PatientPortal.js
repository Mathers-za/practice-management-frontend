import { Link, Outlet } from "react-router-dom";
import PatientList from "../PatientList";

export default function PatientPortal({ patientId }) {
  //navbar

  return (
    <>
      <div className=" text-white h-16 w-full flex justify-evenly items-center bg-slate-500">
        <Link to="medicalAid"> Medical Aid</Link>
        <Link to="treatmentNotes"> Treatment Notes</Link>
      </div>

      <h1>This is the pateint portal</h1>
      <div className="w-full max-w-full overflow-clip">
        <Outlet />
      </div>
    </>
  );
}
