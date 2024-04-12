import { Link } from "react-router-dom";

export default function MainMenuSideBar({ itemsArray }) {
  return (
    <>
      <div className=" px-5 max-w-full bg-cyan-400 min-h-screen sticky left-0 top-0 bottom-0   ">
        <ul className="list-none flex flex-col grow ">
          <Link to="profile">
            <li className="hover:bg-gray-500 hover:text-white hover:cursor-pointer">
              Profile
            </li>
          </Link>
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
