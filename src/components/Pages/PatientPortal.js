import { Link, Outlet } from "react-router-dom";
import PatientList from "../PatientList";

export default function PatientPortal({ patientId }) {
  //navbar

  return (
    <>
      <div className=" text-white font-semibold h-16 w-full flex justify-evenly items-center bg-slate-500">
        <Link to="clientInfo">Client Information</Link>
        <Link to="treatmentNotes"> Treatment Notes</Link>
        <Link to={"patientAppointments"}>Appointments</Link>
        <Link>Invoices</Link>
      </div>

      <div className="w-full h-full bg-white overflow-auto">
        <Outlet />
      </div>
    </>
  );
}
