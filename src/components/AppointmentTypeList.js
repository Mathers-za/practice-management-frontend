import { useEffect } from "react";
import { useFetchData } from "../CustomHooks/serverStateHooks";
import { useNavigate } from "react-router-dom";

import AppointmentTypeCard from "./appointmentTypeComponents/AppointmentTypeCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAppointmentDataFromCreateAppointment } from "../zustandStore/store";

export default function AppointmentTypeList({ profileId }) {
  const navigate = useNavigate();
  const globalPracticeDetailsData = useAppointmentDataFromCreateAppointment(
    (state) => state.practiceDetails
  );
  const { data: apptypeAndIcdData } = useFetchData(
    `/appointmentTypes/getAppTypesAndThierIcds${profileId}`,
    "viewAllAppointmentTypes"
  );

  useEffect(() => {
    if (apptypeAndIcdData?.appointmentTypeData) {
      console.log(apptypeAndIcdData.appointmentTypeData);
    }
  }, [apptypeAndIcdData]);
  return (
    <>
      <div className="flex justify-center">
        <div className="w-11/12 bg-white min-h-screen  ">
          <div className="py-5 px-3 bg-purple-500 text-white mb-4 relative  ">
            {globalPracticeDetailsData?.appointment_name || "Appointment types"}
            <div className="size-10 rounded-full bg-blue-600 flex transition-all  delay-100 hover:scale-125 justify-center    hover:ring-sky-800 hover:ring-2  hover:bg-blue-500 items-center  absolute -bottom-3 right-3">
              <FontAwesomeIcon icon="fa-solid fa-plus" size="xl" />
            </div>
          </div>
          {apptypeAndIcdData &&
          apptypeAndIcdData?.appointmentTypeData.length > 0 ? (
            <div className="flex justify-around gap-2 gap-y-6 flex-wrap">
              {console.log(
                "made it here" + apptypeAndIcdData.appointmentTypeData
              )}
              {apptypeAndIcdData.appointmentTypeData.map((type) => (
                <AppointmentTypeCard
                  appointmentTypeData={type}
                  predefinedIcdcodes={apptypeAndIcdData.predefinedIcd10Data.find(
                    (arr) => {
                      return arr.some(
                        (icddata) => icddata.appointment_type_id === type.id
                      );
                    }
                  )}
                />
              ))}
            </div>
          ) : (
            <div>
              Once you create appointment types, they will be displayed here for
              you to edit.
            </div>
          )}
        </div>
      </div>
    </>
  );
}
