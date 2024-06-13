import { useState } from "react";
import { usePagination } from "../../CustomHooks/serverStateHooks";
import {
  useGlobalStore,
  usePatientPortalStore,
} from "../../zustandStore/store";
import AppointmentCard from "../Pages/AppointmentCardAndList/AppointmentCard";
import { Pagination, Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CreateAppointment from "../Appointment components/CreateAppointment";
import { useSetLoadingStates } from "../../CustomHooks/otherHooks";

export default function AppointmentsTab() {
  const { globalProfileData } = useGlobalStore();
  const { patientId } = usePatientPortalStore();
  const [page, setPage] = useState(1);
  const {
    data: patientAppointmentDataAndMetaData,
    refetch,
    isLoading,
  } = usePagination(
    `/appointments/viewAppointmentsByPatient${patientId}`,
    ["patientAppointments", patientId, page],
    page,
    7
  );
  const { setAppointmentTabLoadingState } = usePatientPortalStore();
  useSetLoadingStates(isLoading, setAppointmentTabLoadingState);
  const [showCreateAppointment, setShowCreateAppointment] = useState(false);

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
        <div className="absolute right-5 top-9">
          <Fab
            sx={{ zIndex: 10 }}
            onClick={() => setShowCreateAppointment(!showCreateAppointment)}
            color="primary"
            size="small"
          >
            <AddIcon />
          </Fab>
        </div>
        {showCreateAppointment && (
          <div className="fixed left-0 top-0 w-full h-screen z-10">
            <CreateAppointment
              hideComponent={() =>
                setShowCreateAppointment(!showCreateAppointment)
              }
              querykeyToInvalidate={["patientAppointments", patientId, page]}
            />
          </div>
        )}
      </div>
    </>
  );
}
