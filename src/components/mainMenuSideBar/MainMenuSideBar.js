import { Link } from "react-router-dom";

export default function MainMenuSideBar({ itemsArray }) {
  return (
    <>
      <div className="flex flex-col items-start px-5 max-w-full bg-cyan-400 min-h-screen sticky left-0 top-0 bottom-0   ">
        <ul className="list-none flex flex-col gap-2  ">
          <li>
            {" "}
            <Link to="profile">Profile</Link>{" "}
          </li>
          <li>
            {" "}
            <Link to="practice">Practice</Link>{" "}
          </li>
          <li>
            {" "}
            <Link to="patient/search">Patient List</Link>{" "}
          </li>

          <li>
            <Link to="patientCreate">Create Patient</Link>
          </li>

          <li>
            <Link to="createAppointment">Create appointment</Link>
          </li>
          <li>
            <Link to="appointmentTypePortal">Appointment Type Portal</Link>
          </li>
          <li>
            <Link to="appointmentPortal">View Appointments</Link>
          </li>

          <li>
            <Link to="invoiceProgress"> Invoice Progress </Link>
          </li>

          <li>
            <Link to="invoicesPastDue">Invoices Past Due</Link>
          </li>

          <li>
            <Link to="paymentsTracker">Payments Tracker</Link>
          </li>

          <li>
            <Link to="emailNotifications">
              email Notification Customization
            </Link>
          </li>
          <li>
            <Link to="calendar">Calendar</Link>
          </li>

          <li>
            <Link to="componentStyling">Custom Component styling</Link>
          </li>
        </ul>
      </div>
    </>
  );
}
