import { useEffect, useState } from "react";
import TextInput from "./textInput";

import { useFetchData, usePatchData } from "../CustomHooks/serverStateHooks";
import { useAppointmentDataFromCreateAppointment } from "../zustandStore/store";

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

  useEffect(() => {
    if (patchMutation.isSuccess) {
      setGlobalProfileData(data);
    }
  }, [patchMutation.isSuccess, data]);

  return (
    <>
      <div>
        <TextInput
          onChange={handleChange}
          name="first_name"
          value={profileData?.first_name || ""}
          type="text"
          labelText="First Name"
        />
        <TextInput
          onChange={handleChange}
          name="last_name"
          value={profileData?.last_name || ""}
          type="text"
          labelText="Last Name"
        />
        <TextInput
          onChange={handleChange}
          name="profile_email"
          value={profileData?.profile_email || ""}
          type="text"
          labelText="Profile Email"
        />
        <TextInput
          onChange={handleChange}
          name="contact_num"
          value={profileData?.contact_num || ""}
          type="tel"
          labelText="Contact Number"
        />
        <TextInput
          onChange={handleChange}
          name="council_reg_num"
          value={profileData?.council_reg_num || ""}
          type="text"
          labelText="Council Registration Number"
        />
        <button
          disabled={Object.keys(changes).length === 0}
          onClick={async () => {
            await patchMutation.mutateAsync(changes);

            setChanges({});
          }}
        >
          Save
        </button>

        {isLoading && <p>...Loading Data</p>}
      </div>
    </>
  );
}
