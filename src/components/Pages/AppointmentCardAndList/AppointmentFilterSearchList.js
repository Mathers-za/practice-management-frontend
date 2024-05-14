import { useFetchData } from "../../../CustomHooks/serverStateHooks.js";
import AppointmentCard from "./AppointmentCard.js";

export default function AppointmentFilterSearchList({ params, profileId }) {
  const { data: appointmentData, refetch: refetchInAppointmentFilterList } =
    useFetchData(
      `/appointments/searchByFilter:id${profileId}`,
      ["appointmentFilterList", params],
      params
    );

  return (
    <>
      {appointmentData && appointmentData.length > 0
        ? appointmentData.map((appointment) => {
            return (
              <div key={appointment.appointment_id}>
                <AppointmentCard
                  refetchData={refetchInAppointmentFilterList}
                  appointmentData={appointment}
                />
              </div>
            );
          })
        : "No appointments to show"}
    </>
  );
}
