import { Link } from "react-router-dom";

export default function MainMenuSideBar({ itemsArray }) {
  return (
    <>
      <div className="min-w-full bg-cyan-400 min-h-screen  sticky left-0 top-0 bottom-0 flex flex-col flex-wrap justify-center   ">
        <Link
          className="grow  flex items-center pl-3  hover:bg-slate-400"
          to="profile"
        >
          Profile
        </Link>{" "}
        <Link
          className="flex-auto flex items-center  pl-3  hover:bg-slate-400"
          to="practice"
        >
          Practice
        </Link>{" "}
        <Link
          className="flex-auto min-w-full flex items-center   pl-3  hover:bg-slate-400 box-border "
          to="patient/search"
        >
          Patient List
        </Link>{" "}
        <Link
          className="flex-auto min-w-full flex items-center  pl-3  hover:bg-slate-400"
          to="patientCreate"
        >
          Create Patient
        </Link>
        <Link
          className="flex-auto min-w-full flex items-center   pl-3  hover:bg-slate-400"
          to="createAppointment"
        >
          Create appointment
        </Link>
        <Link
          className="flex-auto min-w-full flex items-center   pl-3  hover:bg-slate-400"
          to="appointmentTypePortal"
        >
          Appointment Type Portal
        </Link>
        <Link
          className="flex-auto min-w-full flex items-center   pl-3  hover:bg-slate-400"
          to="appointmentPortal"
        >
          View Appointments
        </Link>
        <Link
          className="flex-auto min-w-full  flex items-center  pl-3  hover:bg-slate-400"
          to="invoiceProgress"
        >
          {" "}
          Invoice Progress{" "}
        </Link>
        <Link
          className="flex-auto min-w-full  flex items-center  pl-3  hover:bg-slate-400"
          to="invoicesPastDue"
        >
          Invoices Past Due
        </Link>
        <Link
          className="flex-auto min-w-full  flex items-center  pl-3  hover:bg-slate-400"
          to="paymentsTracker"
        >
          Payments Tracker
        </Link>
        <Link
          className="flex-auto min-w-full flex items-center   pl-3  hover:bg-slate-400"
          to="emailNotifications"
        >
          email Notification Customization
        </Link>
        <Link
          className="flex-auto min-w-full flex items-center   pl-3  hover:bg-slate-400"
          to="calendar"
        >
          Calendar
        </Link>
        <Link
          className="flex-auto min-w-full  flex items-center  pl-3  hover:bg-slate-400"
          to="componentStyling"
        >
          Custom Component styling
        </Link>
      </div>
    </>
  );
}
