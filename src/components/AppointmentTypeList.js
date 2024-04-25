import { useEffect } from "react";
import { useFetchData } from "../CustomHooks/serverStateHooks";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import AppointmentTypeCard from "./appointmentTypeComponents/AppointmentTypeCard";

export default function AppointmentTypeList({ profileId }) {
  const navigate = useNavigate();

  const { data: apptypeAndIcdData } = useFetchData(
    `/appointmentTypes/getAppTypesAndThierIcds${profileId}`,
    "viewAllAppointmentTypes"
  );

  useEffect(() => {
    console.log(apptypeAndIcdData.appointmentTypeData);
  }, [apptypeAndIcdData]);
  return (
    <>
      {apptypeAndIcdData ? (
        <div className="flex justify-around gap-2 gap-y-6 flex-wrap">
          {console.log("made it here" + apptypeAndIcdData.appointmentTypeData)}
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
          Once you create appointment types, they will be displayed here for you
          to edit.
        </div>
      )}
    </>
  );
}
