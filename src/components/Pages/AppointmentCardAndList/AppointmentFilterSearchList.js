import { useEffect, useRef, useState } from "react";
import { usePagination1 } from "../../../CustomHooks/serverStateHooks.js";
import { useGlobalStore } from "../../../zustandStore/store.js";
import AppointmentCard from "./AppointmentCard.js";
import Pagination from "@mui/material/Pagination";

export default function AppointmentFilterSearchList({ params, profileId }) {
  const setGlobalApppointmentFilterResultRefetch = useGlobalStore(
    (state) => state.setGlobalRefetch
  );

  const [page, setPage] = useState(1);
  const [pageNumber, setPageNumber] = useState();

  const [appointmentData, setAppointmentData] = useState();

  const {
    data: appointmentDataAndMetaData,
    refetch: refetchInAppointmentFilterList,
  } = usePagination1(
    `/appointments/appointmentsPagination${profileId}`,
    ["appointmentsFilter", params, page],
    page,
    10,
    params
  );

  useEffect(() => {
    if (appointmentDataAndMetaData) {
      setAppointmentData(appointmentDataAndMetaData.dataChunk);
      setPageNumber(appointmentDataAndMetaData?.metaData?.totalPages);
    }
  }, [appointmentDataAndMetaData]);

  useEffect(() => {
    setGlobalApppointmentFilterResultRefetch(refetchInAppointmentFilterList);
  }, [appointmentData, refetchInAppointmentFilterList]);

  return (
    <>
      <div className="flex flex-col w-full h-full">
        {appointmentData && appointmentData.length > 0 ? (
          appointmentData.map((appointment) => {
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
              count={pageNumber}
              color="primary"
              variant="outlined"
              onChange={(event, page) => {
                setPage(page);
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
