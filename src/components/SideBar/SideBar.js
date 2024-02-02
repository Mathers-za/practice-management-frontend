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
          <Link to="createAppointmentType">Create Appointment type</Link>
        </li>
      </ul>
    </>
  );
}
