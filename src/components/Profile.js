import { useEffect, useRef, useState } from "react";
import TextInput from "./textInput";
import { patchDataOnly } from "../utiltyFunctions/dataHandling";

import axiosRequest from "../apiRequests/apiRequests";

export default function Profile() {
  const [profileData, setProfileData] = useState({
    first_name: null,
    last_name: null,
    profile_email: null,
    contact_num: null,
    council_reg_num: null,
  });

  const [changes, SetChanges] = useState({});

  const [intialSetting, setIntialSetting] = useState(true);

  function handleChange(event) {
    const { name, value } = event.target;

    setProfileData((prev) => ({
      ...prev,
      [name]: value === "" ? null : value,
    }));

    SetChanges((prev) => ({
      ...prev,
      [name]: value === "" ? null : value,
    }));
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axiosRequest("get", "profile/view");

        if (response.status === 200) {
          console.log("made get request");

          setProfileData({
            //pick up where you left off. you need to alter backend route and focus on sending the correct status codes which you can use in your cindtions

            first_name: response.data.data.first_name,
            last_name: response.data.data.last_name,
            profile_email: response.data.data.profile_email,
            contact_num: response.data.data.contact_num,
            council_reg_num: response.data.data.council_reg_num,
          });

          setIntialSetting(false);
        }
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
  }, []);

  async function handlePost() {
    try {
      const response = await axiosRequest(
        "post",
        "/profile/createProfile",
        profileData
      );

      if (response.status === 201) {
        console.log("profile successfully created");
      }
    } catch (error) {
      console.error(error);
    }
  }

  /*async function handlePatch() {
    const patchPayload = patchDataOnly(originalData, profileData);

    try {
      const response = await axiosRequest(
        "post",
        "/profile/updateProfile",
        patchPayload
      );
      if (response.status === 201) {
        setOriginalData(profileData);
      }

      if (response.status === 404) {
        console.log("Data not found");
      }
    } catch (error) {
      console.error(error);
    }
  }*/

  return (
    <div>
      <form onSubmit={intialSetting ? handlePost : null}>
        <TextInput
          onChange={handleChange}
          name="first_name"
          value={profileData.first_name || ""}
          type="text"
          labelText="first Name"
        />
        <TextInput
          onChange={handleChange}
          name="last_name"
          value={profileData.last_name || ""}
          type="text"
          labelText="Last Name"
        />
        <TextInput
          onChange={handleChange}
          name="profile_email"
          value={profileData.profile_email || ""}
          type="text"
          labelText="Profile Email"
        />
        <TextInput
          onChange={handleChange}
          name="contact_num"
          value={profileData.contact_num || ""}
          type="tel"
          labelText="contact Number"
        />
        <TextInput
          onChange={handleChange}
          name="council_reg_num"
          value={profileData.council_reg_num || ""}
          type="text"
          labelText="Council Registration number"
        />
        <button type="submit">Save</button>
      </form>
    </div>
  );
}
