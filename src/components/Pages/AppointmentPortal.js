import AppointmentSearch from "../AppointmentSearch";

import "./appointmentPortal.css";

import { useAppointmentPortalStore } from "../../zustandStore/store.js";
export default function AppointmentPortal({ profileId }) {
  const appointmentsThathaveInvoices = useAppointmentPortalStore(
    (state) => state.appointmentsThathaveInvoices
  );
  const setAppointmentsThatHaveInvoices = useAppointmentPortalStore(
    (state) => state.setAppsThatHaveInvoices
  );

  return (
    <>
      <AppointmentSearch profileId={profileId} />
    </>
  );
}
