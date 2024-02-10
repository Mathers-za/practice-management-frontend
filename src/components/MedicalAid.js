import { useEffect, useState } from "react";
import TextInput from "./textInput";
import {
  useFetchData,
  usePostData,
  usePatchData,
} from "../CustomHooks/serverStateHooks";
import { useQueryClient } from "react-query";

export default function MedicalAid({ patientId }) {
  const queryClient = useQueryClient();
  const { data, httpStatus, isSuccess } = useFetchData(
    `/medicalAid/view${patientId}`,
    "medicalAidData"
  );
  console.log(
    "the patinet id in medical aid is (should match with other 2) " + patientId
  );

  const [isFirstTimeCreatingPost, setIsFirstTimeCreatingPost] = useState(false);
  const { createMutation } = usePostData(
    `/medicalAid/create${patientId}`,
    "medicalAidData"
  );

  const [medAidInformation, setMedAidInformation] = useState({});
  const [changes, setChanges] = useState({});
  const { patchMutation } = usePatchData(
    `/medicalAid/update${data?.id}`,
    "medicalAidData"
  );

  useEffect(() => {
    if (!data) {
      setIsFirstTimeCreatingPost(true);
      setMedAidInformation({});
    }
    console.log("makes it this far");
    queryClient.invalidateQueries("medicalAidData"); // had to inlcude this in order to sync patient Id prop. patient id was not syncng in medicalAid and thus displaying data of previous id
    if (data) {
      setMedAidInformation(data);
      setIsFirstTimeCreatingPost(false);
    }
  }, [data, patientId]);

  function handleChange(e) {
    const { name, value } = e.target;
    setMedAidInformation((prev) => ({
      ...prev,
      [name]: value === "" ? null : value,
    }));

    setChanges((prev) => ({
      ...prev,
      [name]: value === "" ? null : value,
    }));
  }

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (isFirstTimeCreatingPost) {
            createMutation.mutate(medAidInformation);
            setIsFirstTimeCreatingPost(false);
            setChanges({});
          } else {
            patchMutation.mutate(changes);
            setChanges({});
          }
        }}
      >
        <TextInput
          onChange={handleChange}
          name="gov_id"
          value={medAidInformation?.gov_id || ""}
          labelText="ID Number"
        />
        <TextInput
          onChange={handleChange}
          name="medaid_name"
          value={medAidInformation?.medaid_name || ""}
          labelText="Medical Aid Name"
        />
        <TextInput
          onChange={handleChange}
          name="medaid_scheme"
          value={medAidInformation?.medaid_scheme || ""}
          labelText="Scheme Name"
        />
        <TextInput
          onChange={handleChange}
          name="medaid_number"
          value={medAidInformation?.medaid_number || ""}
          labelText="Medical Aid Number"
        />
        <TextInput
          onChange={handleChange}
          name="mainmem_name"
          value={medAidInformation?.mainmem_name || ""}
          labelText="Main Mmeber First Name"
        />
        <TextInput
          onChange={handleChange}
          name="mainmem_surname"
          value={medAidInformation?.mainmem_surname || ""}
          labelText="main Member Last Name"
        />
        <TextInput
          onChange={handleChange}
          name="mainmem_gov_id"
          value={medAidInformation?.mainmem_gov_id || ""}
          labelText="Main Member ID Number"
        />
        <button disabled={Object.keys(changes).length === 0} type="submit">
          {" "}
          Save
        </button>
      </form>
    </>
  );
}
