import { useEffect, useRef, useState } from "react";
import {
  usePagination,
  usePagination1,
} from "../../../CustomHooks/serverStateHooks.js";
import { useGlobalStore } from "../../../zustandStore/store.js";
import AppointmentCard from "./AppointmentCard.js";
import Pagination from "@mui/material/Pagination";
import CustomLinearProgressBar from "../../miscellaneous components/CustomLinearProgressBar.js";

export default function AppointmentFilterSearchList({ params, profileId }) {
  const setGlobalApppointmentFilterResultRefetch = useGlobalStore(
    (state) => state.setGlobalRefetch
  );

  const [page, setPage] = useState(1);

  const {
    data: appointmentData,
    refetch: refetchInAppointmentFilterList,
    isLoading,
    isFetching,
    isPreviousData,
  } = usePagination(
    `/appointments/appointmentsPagination${profileId}`,
    ["appointmentsFilter", params, page],
    page,
    10,
    params
  );

  useEffect(() => {
    console.log("isloading is " + isLoading);
  }, [isLoading]);

  useEffect(() => {
    setGlobalApppointmentFilterResultRefetch(refetchInAppointmentFilterList);
  }, [appointmentData, refetchInAppointmentFilterList]);

  return (
    <>
      <div className="flex  flex-col w-full relative h-full">
        {appointmentData?.data?.length > 0 ? (
          appointmentData.data.map((appointment) => {
            return (
              <div key={appointment.appointment_id}>
                <AppointmentCard
                  refetchData={refetchInAppointmentFilterList}
                  appointmentData={appointment}
                />
              </div>
            );
          })
        ) : (
          <div className="pl-4">No appointments to show</div>
        )}
        <div className=" flex-grow flex justify-end items-end  mt-4 mr-3 mb-2">
          <div className="flex gap-3">
            <h2 className="self-start">Pages</h2>
            <Pagination
              shape="rounded"
              count={appointmentData?.metaData?.totalPages}
              color="primary"
              variant="outlined"
              onChange={(event, page) => {
                setPage(page);
              }}
            />
          </div>
        </div>
        <CustomLinearProgressBar
          className="top-0 absolute left-0 w-full"
          isLoading={isLoading || isPreviousData}
        />
      </div>
    </>
  );
}
