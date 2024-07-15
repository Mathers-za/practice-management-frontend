import { useAppointmentPortalStore } from "../../zustandStore/store.js";
import AppointmentSearch from "../Appointment components/AppointmentSearch.js";
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
