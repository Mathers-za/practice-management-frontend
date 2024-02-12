import TextInput from "./textInput";
import {
  useFetchData,
  usePatchData,
  usePostData,
} from "../CustomHooks/serverStateHooks";
import { useEffect, useState } from "react";
import PreDefinedIcdCoding from "./PreDefinedIcd10";
import { useNavigate, useParams } from "react-router-dom";

function cleanedDataForPatching(data) {
  const patchedData = {};
  for (const property in data) {
    if (property === "appointment_name") {
      patchedData[property] = data[property] ? data[property].trim() : null;
    }
    if (property === "price") {
      patchedData[property] = data[property]
        ? data[property].replace(".", ",")
        : null;
    }
    if (property === "duration") {
      patchedData[property] = data[property]
        ? data[property] + " minutes"
        : null;
    }
  }

  return patchedData;
}

function cleanDataForPosting(data) {
  console.log("data recive din function" + data);
  //this function converts the relevant data into a format that postgres accepts

  const trimmedAppTypeName = data?.appointment_name
    ? data.appointment_name.trim()
    : null;
  const formattedPrice = data?.price
    ? data.price.replace(".", ",").padEnd(data.price.indexOf(".") + 3, "0")
    : null;
  const formattedDuration = data?.duration ? data.duration + " minutes" : null;

  return {
    cleanedData: {
      appointment_name: trimmedAppTypeName,
      duration: formattedDuration,
      price: formattedPrice,
    },
  };
}

function parseDataIntoFormatForDisplay(data) {
  //this function reformats data received from db into format that the inputs accept
  const priceToInt =
    data?.price?.slice(1, data.price.length + 1).replace(",", ".") || null;
  const formattedDuration = data?.duration?.minutes.toString() || null;

  return {
    price: priceToInt,
    appointment_name: data?.appointment_name || null,
    duration: formattedDuration,
  };
}

export default function AppTypeCreation({ profileId }) {
  //set apptype id in app.pass it from apptype portal
  const { id } = useParams();
  const navgiate = useNavigate();

  const appTypeId = id ? id : 0;
  console.log("the appointment id passed as params is" + appTypeId);

  const fetchEndpoint = `/appointmentTypes/view${appTypeId}`;
  console.log(
    "appmenttypeId endpoint created based on cdontional initlisation " +
      fetchEndpoint
  );
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
  console.log(data && data);

  useEffect(() => {
    if (data && httpStatus === 200) {
      console.log("ran data that exists- heres the apprent data" + data);
      //try with data. may need to utilise http state variable from useFetch Hook
      setCreateMode(false);
      const parsedData = parseDataIntoFormatForDisplay(data);
      console.log(parsedData);
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
            const { cleanedData } = cleanDataForPosting(appTypeData);
            createMutation.mutate(cleanedData);
            setAppTypeData({});
          } else if (createMode === false) {
            const result = cleanedDataForPatching(changes);
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
        />
        <hr />
        {!createMode && <PreDefinedIcdCoding appTypeId={id} />}

        <button
          hidden={!createMode && Object.keys(changes).length === 0}
          type="submit"
          disabled={
            Object.keys(appTypeData).length === 0 ||
            Object.keys(changes).length === 0
          }
        >
          Save
        </button>

        <button
          hidden={createMode && Object.keys(changes).length > 0}
          onClick={navgiate("/")}
        >
          Save
        </button>
      </form>
    </>
  );
}
