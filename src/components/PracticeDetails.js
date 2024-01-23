import { useEffect, useState } from "react";
import TextInput from "./textInput";
import axiosRequest from "../apiRequests/apiRequests";

export default function PracticeDetails({ profile_id, practiceSetupStatus }) {
  const [practiceData, setPracticeData] = useState({
    practice_name: null,
    practice_num: null,
    practice_address: null,
    billing_address: null,
    profile_id: null,
    id: null,
  });
  const [isSetupInitially, setIsSetupInitially] = useState(false);
  const [changes, setChanges] = useState();

  function handleChange(event) {
    const { name, value } = event.target;

    setPracticeData((prev) => ({
      ...prev,
      [name]: value === "" ? null : value,
    }));
  }

  useEffect(async () => {
    async function fetchData() {
      const profileId = profile_id;
      const response = await axiosRequest(
        "get",
        `/practiceDetails/view:${profileId}`
      );
      if (response.status === 200) {
        setPracticeData({
          practice_name: response.data.data.practice_name,
          practice_num: response.data.data.practice_num,
          practice_address: response.data.data.practice_address,
          billing_address: response.data.data.billing_address,
          profile_id: response.data.data.profile_id,
          id: response.data.data.id,
        });

        setIsSetupInitially(true);
      }
    }
    fetchData();
  }, []);

  async function handlePatch() {
    try {
      const response = await axiosRequest(
        "patch",
        "/PracticeDetails/update:id"
      );

      if (response.status === 201) {
        console.log("patient information updated");
        setChanges();
      }
    } catch (error) {
      console.error(error.message);
    }
  }

  async function handlePost() {
    const profileId = profile_id;

    try {
      const response = await axiosRequest(
        "post",
        `/practiceDetails/create:${profileId}`
      );

      if (response.status === 201) {
        console.log("successfully created resource");
        setChanges();
        practiceSetupStatus();
      } else {
        console.log("failed to create resourse. Error: " + response.status);
      }
    } catch (error) {
      console.error(error.message);
    }
  }

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (isSetupInitially && changes) {
            handlePatch();
          }

          if (!isSetupInitially && practiceData) {
            handlePost();
          }
        }}
      >
        <TextInput
          type="text"
          name="practice_name"
          labelText="Practice Name"
          value={practiceData.practice_name || ""}
          onChange={handleChange}
        />
        <TextInput
          type="text"
          name="practice_num"
          labelText="Practice Number"
          value={practiceData.practice_num || ""}
          onChange={handleChange}
        />
        <TextInput
          type="text"
          name="practice_address"
          labelText="Practice Address"
          value={practiceData.practice_address || ""}
          onChange={handleChange}
        />
        <TextInput
          type="text"
          name="billing_address"
          labelText="Billing Address"
          value={practiceData.billing_address || ""}
          onChange={handleChange}
        />
        <button type="submit">Save</button>
      </form>
    </>
  );
}
