import { useState } from "react";
import { usePagination } from "../../CustomHooks/serverStateHooks";
import { usePatientPortalStore } from "../../zustandStore/store";
import AppointmentCard from "../Pages/AppointmentCardAndList/AppointmentCard";
import { Pagination } from "@mui/material";

export default function AppointmentsTab() {
  const { patientId } = usePatientPortalStore();
  const [page, setPage] = useState(1);
  const { data: patientAppointmentDataAndMetaData, refetch } = usePagination(
    `/appointments/viewAppointmentsByPatient${patientId}`,
    ["patientAppointments", patientId, page],
    page,
    7
  );

  //TODO clean this code up by fighuring out how to destructure the vraibles to make it more readable

  return (
    <>
      <div className="flex flex-col h-full w-full">
        {patientAppointmentDataAndMetaData &&
        patientAppointmentDataAndMetaData.data.length > 0
          ? patientAppointmentDataAndMetaData.data.map((appointment) => {
              return (
                <div>
                  <AppointmentCard
                    key={appointment.appointment_id}
                    appointmentData={appointment}
                    refetchData={refetch}
                  />
                </div>
              );
            })
          : "No appointments for this patient to dislay"}
        {patientAppointmentDataAndMetaData?.data?.length > 0 && (
          <div className="flex-grow flex justify-end items-end ">
            <Pagination
              onChange={(event, newPageNumber) => setPage(newPageNumber)}
              count={patientAppointmentDataAndMetaData?.metaData?.totalPages}
            />
          </div>
        )}
      </div>
    </>
  );
}
