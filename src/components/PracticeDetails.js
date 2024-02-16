import { useEffect, useState } from "react";
import TextInput from "./textInput";
import { useFetchData, usePatchData } from "../CustomHooks/serverStateHooks";

export default function PracticeDetails({ profileId }) {
  const { data, httpStatus } = useFetchData(
    `/practiceDetails/view${profileId}`,
    "practiceDetails"
  );
  const [practiceData, setPracticeData] = useState(data ?? {});
  const [changes, setChanges] = useState({});

  const { handlePatch, patchMutation } = usePatchData(
    `/practiceDetails/update${practiceData?.id}`,
    "practiceDetails"
  );

  useEffect(() => {
    if (httpStatus === 200) {
      setPracticeData(data);
    }
  }, [data]);

  function handleChange(event) {
    const { name, value } = event.target;

    setPracticeData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (value !== practiceData[name]) {
      setChanges((prev) => ({
        ...prev,
        [name]: value === "" ? null : value,
      }));
    }
  }

  return (
    <>
      <form>
        <TextInput
          type="text"
          name="practice_name"
          labelText="Practice Name"
          value={practiceData?.practice_name || ""}
          onChange={handleChange}
        />
        <TextInput
          type="text"
          name="practice_num"
          labelText="Practice Number"
          value={practiceData?.practice_num || ""}
          onChange={handleChange}
        />
        <TextInput
          type="text"
          name="practice_address"
          labelText="Practice Address"
          value={practiceData?.practice_address || ""}
          onChange={handleChange}
        />
        <TextInput
          type="text"
          name="billing_address"
          labelText="Billing Address"
          value={practiceData?.billing_address || ""}
          onChange={handleChange}
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
      </form>
    </>
  );
}
