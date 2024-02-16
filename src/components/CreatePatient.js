import { useState } from "react";
import { usePostData } from "../CustomHooks/serverStateHooks";
import TextInput from "./textInput";

export default function CreatePatient({ profileId }) {
  const { handlePost } = usePostData(`/patients/create${profileId}`);
  const [patientInfo, setPatientInfo] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;

    setPatientInfo((prev) => ({
      ...prev,
      [name]: value === "" ? null : value,
    }));
  }

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handlePost(patientInfo);
          setPatientInfo({});
        }}
      >
        <TextInput
          type="text"
          name="first_name"
          value={patientInfo.first_name ?? ""}
          labelText="First Name"
          onChange={handleChange}
          required={true}
        />
        <TextInput
          type="text"
          name="last_name"
          value={patientInfo.last_name ?? ""}
          labelText="Last Name"
          onChange={handleChange}
        />
        <TextInput
          type="email"
          name="email"
          value={patientInfo.email ?? ""}
          labelText="Email"
          onChange={handleChange}
        />
        <TextInput
          type="text"
          name="contact_number"
          value={patientInfo.contact_number ?? ""}
          labelText="Contact number"
          onChange={handleChange}
        />
        <button disabled={Object.keys(patientInfo).length === 0} type="submit">
          Save
        </button>
      </form>
    </>
  );
}
