import { useEffect, useState } from "react";
import TextInput from "./textInput";

import { useFetchData, usePatchData } from "../CustomHooks/serverStateHooks";
import { useAppointmentDataFromCreateAppointment } from "../zustandStore/store";
import Input from "./miscellaneous components/DisplayTextInput";
import SubmitButton from "./miscellaneous components/SubmitButton";

export default function Profile() {
  const { data, httpStatus, isLoading } = useFetchData(
    "/profile/view",
    "profileData"
  );
  const setGlobalProfileData = useAppointmentDataFromCreateAppointment(
    (state) => state.setProfileData
  );

  const [profileData, setProfileData] = useState(data ?? {});
  const [changes, setChanges] = useState({});

  const { handlePatch, patchMutation } = usePatchData(
    `/profile/update${profileData?.id}`,
    "profileData"
  );

  useEffect(() => {
    if (httpStatus === 200) {
      setProfileData(data);
    }
  }, [httpStatus]);

  function handleChange(event) {
    const { name, value } = event.target;

    setProfileData((prev) => ({
      ...prev,
      [name]: value === "" ? null : value,
    }));

    if (value !== profileData[name]) {
      setChanges((prev) => ({
        ...prev,
        [name]: value === "" ? null : value,
      }));
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    await patchMutation.mutateAsync(changes);

    setChanges({});
  }

  useEffect(() => {
    if (patchMutation.isSuccess) {
      setGlobalProfileData(data);
    }
  }, [patchMutation.isSuccess, data]);

  return (
    <>
      <div>
        <form onSubmit={handleSubmit}>
          <Input
            name="first_name"
            labelText="First name"
            type="text"
            placeholder="First name"
            onchange={handleChange}
            value={profileData?.first_name || ""}
          />

          <Input
            name="last_name"
            labelText="Last name"
            type="text"
            placeholder="Last name"
            onchange={handleChange}
            value={profileData?.last_name || ""}
          />

          <Input
            name="profile_email"
            labelText="Email Address"
            type="email"
            placeholder="Email Address"
            onchange={handleChange}
            value={profileData?.profile_email || ""}
            bottomInfo={
              "The email you would like to recieve notifications on. Can be the same as your login email or different"
            }
          />

          <Input
            name="contact_num"
            labelText="Phone number"
            type="tel"
            placeholder="Phone number"
            pattern="^+27d{9}$"
            onchange={handleChange}
            value={profileData?.contact_num || ""}
            bottomInfo="A valid phone number is expected eg: +2714836849"
          />

          <Input
            name="council_reg_num"
            labelText="Registration Number"
            type="text"
            placeholder="Registration number"
            bottomInfo="Your personal professional council number"
            onchange={handleChange}
            value={profileData?.council_reg_num || ""}
          />

          <SubmitButton
            text="Save"
            disable={Object.keys(changes).length === 0}
          />
        </form>
      </div>
    </>
  );
}
