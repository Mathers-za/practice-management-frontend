import { Link, Outlet } from "react-router-dom";
import PatientList from "../PatientList";
import { useEffect } from "react";
import { useGlobalStore } from "../../zustandStore/store";

export default function PatientPortal({ patientId }) {
  return (
    <>
      <div className="relative">
        <div className=" text-white font-semibold h-16 w-full flex justify-evenly items-center bg-slate-500">
          <Link to="clientInfo">Client Information</Link>
          <Link to="treatmentNotes"> Treatment Notes</Link>
          <Link to={"patientAppointments"}>Appointments</Link>
          <Link to={"patientInvoices"}>Invoices</Link>
        </div>

        <div className=" w-full h-full bg-white overflow-auto">
          <Outlet />
        </div>
      </div>
    </>
  );
}
