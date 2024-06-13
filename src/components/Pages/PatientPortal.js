import { Link, Outlet } from "react-router-dom";
import PatientList from "../PatientList";
import { useEffect } from "react";
import {
  useGlobalStore,
  usePatientPortalStore,
} from "../../zustandStore/store";
import CustomLinearProgressBar from "../miscellaneous components/CustomLinearProgressBar";

export default function PatientPortal() {
  const {
    appointmentTabLoadingState,
    invoiceTabLoadingState,
    treatmentNotesTabLoadingState,
  } = usePatientPortalStore();

  return (
    <>
      <div className="relative ">
        <div className=" text-black font-semibold h-16 w-full relative flex justify-evenly items-center bg-teal-500">
          <Link to="clientInfo">Client Information</Link>
          <Link to="treatmentNotes"> Treatment Notes</Link>
          <Link to={"patientAppointments"}>Appointments</Link>
          <Link to={"patientInvoices"}>Invoices</Link>
          <CustomLinearProgressBar
            isLoading={
              invoiceTabLoadingState ||
              treatmentNotesTabLoadingState ||
              appointmentTabLoadingState
            }
            className="-bottom-1 absolute left-0 w-full"
          />
        </div>

        <div className=" w-full min-full bg-white overflow-auto">
          <Outlet />
        </div>
      </div>
    </>
  );
}
