import { useEffect, useState } from "react";
import TextInput from "./textInput";

import { useFetchData, usePatchData } from "../CustomHooks/serverStateHooks";

export default function Profile() {
  const { data, httpStatus, isLoading } = useFetchData(
    "/profile/view",
    "profileData"
  );

  const [profileData, setProfileData] = useState(data ?? {});
  const [changes, setChanges] = useState({});

  const { handlePatch, patchMutation } = usePatchData(
    `/profile/update${profileData?.id}`,
    "profileData"
  );

  console.log(data && data);

  useEffect(() => {
    console.log("useEffct fired", httpStatus);
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

  return (
    <>
      <div>
        <form>
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
            onClick={() => {
              handlePatch(changes);
              setChanges({});
            }}
          >
            Save
          </button>

          {isLoading && <p>...Loading Data</p>}
        </form>
      </div>
    </>
  );
}
