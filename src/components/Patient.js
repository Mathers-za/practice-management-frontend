import { useEffect, useState } from "react";

import TextInput from "./textInput";
import { useFetchData, usePatchData } from "../CustomHooks/serverStateHooks";

export default function Patient({ patientId }) {
  const { data, httpStatus } = useFetchData(
    `/patients/viewPatient${patientId}`,
    "patientGenInfo"
  );

  const [patientInformation, setPatientInformation] = useState(data ?? {});
  const [changes, setChanges] = useState({});

  const { handlePatch } = usePatchData(
    `/patients/update${patientInformation?.id}`,
    "patientGenInfo"
  );

  function handleChange(event) {
    const { name, value } = event.target;

    setPatientInformation((prev) => ({
      ...prev,
      [name]: value === "" ? null : value,
    }));

    if (value !== patientInformation[name]) {
      setChanges((prev) => ({
        ...prev,
        [name]: value === "" ? null : value,
      }));
    }
  }

  useEffect(() => {
    if (httpStatus === 200) {
      setPatientInformation(data);
    }
  }, [data, httpStatus]);

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handlePatch(changes);
        }}
      >
        <TextInput
          type="text"
          name="first_name"
          value={patientInformation?.first_name || ""}
          labelText="First Name"
          onChange={handleChange}
          required={true}
        />
        <TextInput
          type="text"
          name="last_name"
          value={patientInformation?.last_name || ""}
          labelText="Last Name"
          onChange={handleChange}
        />
        <TextInput
          type="email"
          name="email"
          value={patientInformation?.email || ""}
          labelText="Email"
          onChange={handleChange}
        />
        <TextInput
          type="text"
          name="contact_number"
          value={patientInformation?.contact_number || ""}
          labelText="Contact number"
          onChange={handleChange}
        />
        <button type="submit" disabled={Object.keys(changes).length === 0}>
          Save
        </button>
      </form>
    </>
  );
}
