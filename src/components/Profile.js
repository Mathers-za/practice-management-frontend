import { useEffect, useState } from "react";
import TextInput from "./textInput";
import getProfileData from "../apiRequests/profileApi";

export default function Profile() {
  const [profileData, setProfileData] = useState({});

  function handleChange(event) {
    const { name, value } = event.target;

    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  useEffect(() => {
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
    async function fetchData() {
      try {
        let data = await getProfileData();
        data = undefined;

        if (data) {
          setProfileData({
            //pick up where you left off. you need to alter backend route and focus on sending the correct status codes which you can use in your cindtions

            first_name: data.first_name,
            last_name: data.last_name,
            profile_email: data.profile_email,
            contact_num: data.contact_num,
            council_reg_num: data.council_reg_num,
          });
        } else {
          setProfileData({
            first_name: null,
            last_name: null,
            profile_email: null,
            contact_num: null,
            council_reg_num: null,
          });
        }
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
  }, []);

  return (
    <div>
      <form>
        <TextInput
          onChange={handleChange}
          name="first_name"
          value={profileData.first_name}
          type="text"
          labelText="first Name"
        />
        <TextInput
          onChange={handleChange}
          name="last_name"
          value={profileData.last_name}
          type="text"
          labelText="Last Name"
        />
        <TextInput
          onChange={handleChange}
          name="profile_email"
          value={profileData.profile_email}
          type="text"
          labelText="Profile Email"
        />
        <TextInput
          onChange={handleChange}
          name="contact_num"
          value={profileData.contact_num}
          type="text"
          labelText="contact Number"
        />
        <TextInput
          onChange={handleChange}
          name="council_reg_num"
          value={profileData.council_reg_num}
          type="text"
          labelText="Council Registration number"
        />
      </form>
    </div>
  );
}
