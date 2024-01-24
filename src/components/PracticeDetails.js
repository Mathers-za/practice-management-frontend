import { useContext, useEffect, useState } from "react";
import TextInput from "./textInput";
import axiosRequest from "../apiRequests/apiRequests";
import { profileIdContext } from "./myContext";

export default function PracticeDetails() {
  const [practiceData, setPracticeData] = useState({
    practice_name: null,
    practice_num: null,
    practice_address: null,
    billing_address: null,
    profile_id: null,
    id: null,
  });

  const profileId = useContext(profileIdContext);

  const [changes, setChanges] = useState();

  function handleChange(event) {
    const { name, value } = event.target;

    setPracticeData((prev) => ({
      ...prev,
      [name]: value === "" ? null : value,
    }));

    setChanges((prev) => ({
      ...prev,
      [name]: value === "" ? null : value,
    }));
  }

  useEffect(() => {
    async function fetchData() {
      const response = await axiosRequest(
        "get",
        `/practiceDetails/view${profileId}`
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
      }
    }
    fetchData();
  }, []);

  async function handlePatch() {
    try {
      const response = await axiosRequest(
        "patch",
        `/PracticeDetails/update${practiceData.id}`,
        changes
      );

      if (response.status === 201) {
        console.log("Practice information updated");
        setChanges();
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
          handlePatch();
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
