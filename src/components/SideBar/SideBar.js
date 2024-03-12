import { Link } from "react-router-dom";

export default function SideBar() {
  return (
    <>
      <ul>
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
          <Link to="InvoiceProgress"> Invoice Progress </Link>
        </li>
      </ul>
    </>
  );
}
