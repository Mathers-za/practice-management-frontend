import { useContext, useEffect, useState } from "react";
import axiosRequest from "../apiRequests/apiRequests";
import TextInput from "./textInput";
import { profileIdContext } from "./myContext";

export default function Patient({ key, profileId }) {
  const [patientInformation, setPatientInformation] = useState({
    first_name: null,
    last_name: null,
    email: null,
    contact_number: null,
  });

  const [isInitialPost, setIsInitialPost] = useState(true);

  const [changes, setChanges] = useState();

  const profileId = useContext(profileIdContext);

  useEffect(() => {
    async function getPatientData() {
      try {
        const response = await axiosRequest(
          "get",
          `/patients/viewPatient${key}`
        );

        if (response.status === 200) {
          setIsInitialPost(false);
          setPatientInformation({
            first_name: response.data.data.first_name,
            last_name: response.data.data.last_name,
            email: response.data.data.email,
            contact_number: response.data.contact_number,
            id: response.data.data.id,
          });
        }
      } catch (error) {
        console.error(error);
      }
    }
    getPatientData();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setPatientInformation((prev) => ({
      ...prev,
      [name]: value === "" ? null : value,
    }));

    value === patientInformation[name]
      ? null
      : setChanges((prev) => ({
          ...prev,
          [name]: value === "" ? null : value,
        }));
  }

  async function handlePost() {
    try {
      const response = await axiosRequest(
        "post",
        `/patients/create${profileId}`,
        patientInformation
      );

      if (response.status === 201) {
        setIsInitialPost(false);
        setChanges();
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function handlePatch() {
    try {
      const response = await axiosRequest(
        "patch",
        `/patients/update${patientInformation.id}`,
        changes
      );

      if (response.status === 201) {
        setChanges();
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <form
        onSubmit={() => {
          if (isInitialPost) {
            handlePost();
          } else if (
            !isInitialPost &&
            changes &&
            Object.keys(changes).length > 0
          ) {
            handlePatch();
          }
        }}
      >
        <TextInput
          type="text"
          name="first_name"
          value={patientInformation.first_name || ""}
          labelText="First Name"
          onChange={handleChange}
        />
        <TextInput
          type="text"
          name="last_name"
          value={patientInformation.last_name || ""}
          labelText="Last Name"
          onChange={handleChange}
        />
        <TextInput
          type="email"
          name="email"
          value={patientInformation.email || ""}
          labelText="Email"
          onChange={handleChange}
        />
        <TextInput
          type="text"
          name="contact_number"
          value={patientInformation.contact_number || ""}
          labelText="Contact number"
          onChange={handleChange}
        />
        <button type="submit">Save</button>
      </form>
    </>
  );
}
