import TextInput from "./textInput";
import {
  useFetchData,
  usePatchData,
  usePostData,
} from "../CustomHooks/serverStateHooks";
import { useEffect, useState } from "react";
import PreDefinedIcdCoding from "./PreDefinedIcd10";
import { useNavigate, useParams } from "react-router-dom";

function cleanedData(data) {
  const patchedData = {};
  for (const property in data) {
    const value = data[property];
    if (property === "appointment_name" && typeof value === "string") {
      patchedData[property] = data[property].trim();
    }
    if (property === "price" && typeof value === "string") {
      patchedData[property] = data[property].replace(".", ",");
    }
    if (property === "duration" && typeof value === "string") {
      patchedData[property] = parseInt(data[property]);
    }

    if (value === null) {
      patchedData[property] = null;
    }
  }

  return patchedData;
}

function parseDataIntoFormatForDisplay(data) {
  const newObject = {};
  for (const property in data) {
    const value = data[property];

    if (property !== "duration" && property !== "price") {
      newObject[property] = data[property];
    } else if (typeof value === "number") {
      newObject[property] = data[property].toString();
    } else if (property === "price" && value !== null) {
      newObject[property] = data[property]
        .slice(1, data[property].length + 1)
        .replace(",", ".");
    }
  }

  return newObject;
}

export default function AppTypeCreation({ profileId }) {
  //set apptype id in app.pass it from apptype portal
  const { id } = useParams();

  const appTypeId = id ? id : 0;

  const fetchEndpoint = `/appointmentTypes/view${appTypeId}`;

  const { data, httpStatus } = useFetchData(
    fetchEndpoint,
    "AppointmentTypeDataQueryKey"
  );
  const [createMode, setCreateMode] = useState(true); //if createMode is false then we can deduce that we must patch and vice versa

  const { createMutation } = usePostData(
    `/appointmentTypes/create${profileId}`
  );

  const { patchMutation } = usePatchData(`/appointmentTypes/update${id}`);
  const [appTypeData, setAppTypeData] = useState({});
  const [changes, setChanges] = useState({});

  useEffect(() => {
    if (data && httpStatus === 200) {
      //try with data. may need to utilise http state variable from useFetch Hook
      setCreateMode(false);
      const parsedData = parseDataIntoFormatForDisplay(data);

      setAppTypeData(parsedData);
    } else if (httpStatus === 204) {
      setCreateMode(true);
    }
  }, [data, httpStatus]);

  function handleChange(e) {
    const { name, value } = e.target;

    setAppTypeData((prev) => ({
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
          if (createMode === true) {
            const cleansedData = cleanedData(appTypeData);
            createMutation.mutate(cleansedData);
            setAppTypeData({});
          } else if (createMode === false) {
            const result = cleanedData(changes);
            patchMutation.mutate(result);
            setChanges({});
          }
        }}
      >
        <TextInput
          type="text"
          onChange={handleChange}
          name="appointment_name"
          value={appTypeData?.appointment_name || ""}
          labelText="App Type name"
        />
        <TextInput
          onChange={handleChange}
          name="duration"
          value={appTypeData?.duration || ""}
          labelText="Duration"
          type="number"
        />
        <TextInput
          onChange={handleChange}
          name="price"
          value={appTypeData?.price || ""}
          labelText="Price"
          type="number"
          min="0"
        />
        <hr />
        {!createMode && <PreDefinedIcdCoding appTypeId={id} />}

        <button
          type="submit"
          disabled={
            Object.keys(appTypeData).length === 0 ||
            Object.keys(changes).length === 0
          }
        >
          Save
        </button>
      </form>
    </>
  );
}
