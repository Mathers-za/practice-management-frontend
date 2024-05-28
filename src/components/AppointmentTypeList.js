import { useEffect, useState } from "react";

import { usePagination } from "../CustomHooks/serverStateHooks";
import { Pagination } from "@mui/material";
import AppointmentTypeCard from "./appointmentTypeComponents/AppointmentTypeCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  useGlobalStore,
  useAppointmentTypeListComponenet,
} from "../zustandStore/store";
import CreateAppointmentType from "./miscellaneous components/CreateAppointmentType";

export default function AppointmentTypeList({ profileId }) {
  const [showCreateAppointmentType, setShowCreateAppointmentType] =
    useState(false);

  const [page, setPage] = useState(1);
  const globalPracticeDetailsData = useGlobalStore(
    (state) => state.practiceDetails
  );

  const { data: appTypeAndIcdData, refetch } = usePagination(
    `/appointmentTypes/getAppTypesAndThierIcds${profileId}`,
    ["appointmentTypeList", page],
    page,
    8
  );
  const setRefetchAppointmentDataGlobal = useAppointmentTypeListComponenet(
    (state) => state.setRefetchAppointmentListTypeData
  );
  useEffect(() => {
    setRefetchAppointmentDataGlobal(refetch);
  }, [refetch]);

  return (
    <>
      <div className="flex justify-center">
        <div className="w-full bg-white min-h-screen  ">
          <div className="py-5 px-3 bg-purple-500 text-white mb-4 relative  ">
            {globalPracticeDetailsData?.appointment_name || "Appointment types"}
            <div
              onClick={() =>
                setShowCreateAppointmentType(!showCreateAppointmentType)
              }
              className="size-10 rounded-full bg-blue-600 flex transition-all  delay-100 hover:scale-125 justify-center    hover:ring-sky-800 hover:ring-2  hover:bg-blue-500 items-center  absolute -bottom-3 right-3"
            >
              <FontAwesomeIcon icon="fa-solid fa-plus" size="xl" />
            </div>
          </div>
          {showCreateAppointmentType && (
            <CreateAppointmentType
              refetchFn={refetch}
              profileId={profileId}
              hideComponent={() =>
                setShowCreateAppointmentType(!showCreateAppointmentType)
              }
            />
          )}
          {appTypeAndIcdData?.data ? (
            <div className="flex  min-w-full min-h-full bg-white  gap-16 justify-center   gap-y-2 flex-wrap">
              {appTypeAndIcdData.data.appointmentTypeData
                .sort((a, b) => a.id - b.id)
                .map((type) => (
                  <div className=" w-1/4 h-fit  bg-pink-500 ">
                    <AppointmentTypeCard
                      appointmentTypeData={type}
                      predefinedIcdcodes={appTypeAndIcdData.data.predefinedIcd10Data.find(
                        (arr) => {
                          return arr.some(
                            (icdData) => icdData.appointment_type_id === type.id
                          );
                        }
                      )}
                    />
                  </div>
                ))}
            </div>
          ) : (
            <div>
              Once you create appointment types, they will be displayed here for
              you to edit.
            </div>
          )}
          <div className=" flex bg-white justify-end items-end  pb-3">
            <Pagination
              count={appTypeAndIcdData?.metaData?.totalPages}
              onChange={(event, newPageNumber) => setPage(newPageNumber)}
            />
          </div>
        </div>
      </div>
    </>
  );
}
