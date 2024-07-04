import { useEffect, useState } from "react";
import Fab from "@mui/material/Fab";
import { usePagination } from "../CustomHooks/serverStateHooks";
import { Pagination } from "@mui/material";
import AppointmentTypeCard from "./appointmentTypeComponents/AppointmentTypeCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  useGlobalStore,
  useAppointmentTypeListComponenet,
} from "../zustandStore/store";
import CreateAppointmentType from "./miscellaneous components/CreateAppointmentType";
import CustomLinearProgressBar from "./miscellaneous components/CustomLinearProgressBar";
import AddIcon from "@mui/icons-material/Add";

export default function AppointmentTypeList({ profileId }) {
  const [showCreateAppointmentType, setShowCreateAppointmentType] =
    useState(false);

  const [page, setPage] = useState(1);
  const globalPracticeDetailsData = useGlobalStore(
    (state) => state.practiceDetails
  );

  const {
    data: appTypeAndIcdData,
    refetch,
    isLoading,
    isPreviousData,
  } = usePagination(
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
      <div className="flex justify-center ">
        <div className="w-full bg-white min-h-screen  ">
          <div className="py-5 px-3 bg-sky-400  text-white mb-4 relative  ">
            {globalPracticeDetailsData?.appointment_name || "Appointment types"}
            <div className="    absolute -bottom-5 right-3">
              <Fab
                size="large"
                sx={{ zIndex: 1 }}
                onClick={() =>
                  setShowCreateAppointmentType(!showCreateAppointmentType)
                }
                color="primary"
              >
                <AddIcon />
              </Fab>
            </div>
            <CustomLinearProgressBar
              isLoading={isLoading || isPreviousData}
              className="absolute bottom-0 z-0 left-0 w-full"
            />
          </div>
          {showCreateAppointmentType && (
            <div className="w-[95%] flex mx-auto">
              <CreateAppointmentType
                queryKeyToInvalidate={["appointmentTypeList", 1]}
                profileId={profileId}
                hideComponent={() =>
                  setShowCreateAppointmentType(!showCreateAppointmentType)
                }
              />
            </div>
          )}
          {appTypeAndIcdData?.data &&
          appTypeAndIcdData.data.appointmentTypeData.length > 0 ? (
            <div className="flex  min-w-full min-h-full bg-white  gap-16 justify-center   gap-y-2 flex-wrap">
              {appTypeAndIcdData.data.appointmentTypeData
                .sort((a, b) => b.id - a.id)
                .map((type) => (
                  <div className=" w-1/4 h-fit  bg-pink-500 ">
                    <AppointmentTypeCard
                      queryKeyToInvalidate={["appointmentTypeList", page]}
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
