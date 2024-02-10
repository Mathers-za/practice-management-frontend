import { Link, Outlet } from "react-router-dom";

export default function AppointmentTypePortal({
  profileId,
  passAppTypeIdtoParent,
}) {
  return (
    <>
      <ul>
        <li>
          <Link to="createAppointmentType">Create Appointment Type</Link>
        </li>
      </ul>

      <Outlet />
    </>
  );
}
