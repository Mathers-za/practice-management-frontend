import { useEffect, useState } from "react";
import TextInput from "./textInput";
import axiosRequest from "../apiRequests/apiRequests";

export default function Profile() {
  const [profileData, setProfileData] = useState({
    first_name: null,
    last_name: null,
    profile_email: null,
    contact_num: null,
    council_reg_num: null,
  });

  const [changes, SetChanges] = useState();

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
            first_name: response.data.data.first_name,
            last_name: response.data.data.last_name,
            profile_email: response.data.data.profile_email,
            contact_num: response.data.data.contact_num,
            council_reg_num: response.data.data.council_reg_num,
            user_id: response.data.data.user_id,
            id: response.data.data.id,
          });
        }
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
  }, []);

  async function handlePatch() {
    const id = profileData.id;
    console.log(id);

    try {
      const response = await axiosRequest(
        "patch",
        `/profile/update${id}`,
        changes
      );

      if (response.status === 201) {
        console.log(response.status);
        console.log(response.data.message);
        SetChanges();
      } else {
        console.log("failed to update record");
      }
    } catch (error) {
      console.error(error.message);
    }
  }

  return (
    <>
      <div>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            handlePatch();
          }}
        >
          <TextInput
            onChange={handleChange}
            name="first_name"
            value={profileData.first_name || ""}
            type="text"
            labelText="First Name"
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
            labelText="Contact Number"
          />
          <TextInput
            onChange={handleChange}
            name="council_reg_num"
            value={profileData.council_reg_num || ""}
            type="text"
            labelText="Council Registration Number"
          />
          <button type="submit">Save</button>
        </form>
      </div>
    </>
  );
}
