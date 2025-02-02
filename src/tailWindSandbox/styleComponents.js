import DisplaySingleError from "../components/miscellaneous components/WarningMessage";
import SubmitButton from "../components/miscellaneous components/SubmitButton";

import GenericTopBar from "../components/miscellaneous components/GenericTopBar";

import FullWithButton from "../components/miscellaneous components/FullWidthButton";

import { useGlobalStore } from "../zustandStore/store";

import LoginForm from "../components/loginPage/Login";
import AppointmentTypeCard from "../components/appointmentTypeComponents/AppointmentTypeCard";

import CreateAppointmentType from "../components/miscellaneous components/CreateAppointmentType";

import CustomDatePicker from "../components/miscellaneous components/DateRangePicker";

export default function ComponentView() {
  const globalProfileData = useGlobalStore((state) => state.profileData);
  return (
    <>
      <div className="flex flex-col gap-3">
        <DisplaySingleError error={"You Beast you little rat "} />
        <SubmitButton text={"Save"} onclick={() => alert("hello Dad")} />

        <GenericTopBar label="Warren" onclick={() => alert("Hello dad")} />
        <div className="min-w-full min-h-full  justify-center flex   flex-col items-center gap-5 ">
          <FullWithButton
            contentText={"Hey there "}
            onclick={() => alert("hi")}
          />

          <div>{globalProfileData.first_name}</div>
        </div>
        <LoginForm />

        <div className="min-h-fit">
          <AppointmentTypeCard
            appointmentTypeData={{
              appointment_name: "Intial consultation",
              price: 500,
              duration: 45,
            }}
            preDefinedIcdData={[
              {
                procedural_code: "4637",
                price: 500,
              },
              {
                icd_10: "hekosd",
                procedural_code: "4637",
                price: 400,
              },
              { price: 500 },
            ]}
          />
        </div>
        <div>
          <CreateAppointmentType profileId={2} />
        </div>
        <CustomDatePicker />
      </div>
    </>
  );
}
