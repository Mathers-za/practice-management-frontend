import { dividerClasses } from "@mui/material";
import { useFetchData } from "./CustomHooks/serverStateHooks";
import AppointmentCard from "./components/Pages/AppointmentCard&Dropdown/AppointmentCard";

export default function AppointmentFilterSearchList({ params, profileId }) {
  console.log(params);
  const { data: appointmentData } = useFetchData(
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
                <AppointmentCard appointmentData={appointment} />
              </div>
            );
          })
        : "No appointments to show"}
    </>
  );
}
