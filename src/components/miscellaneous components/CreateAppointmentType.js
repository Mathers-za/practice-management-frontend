import { useEffect, useState } from "react";
import Input from "./DisplayTextInput";
import {
  useFetchData,
  usePatchData,
  usePostData,
} from "../../CustomHooks/serverStateHooks";

import SubmitButton from "./SubmitButton";
import {
  appointmentTypeValidationSchema,
  updateAppointmentTypeValidatiionSchema,
} from "../../form validation Schemas/validationSchemas";
import DisplaySingleError from "./WarningMessage";
import CancelButton from "./CancelButton";

export default function CreateAppointmentType({
  profileId,
  appointmentTypeId,
  hideComponent,
}) {
  const [errorMessage, setErrorMessage] = useState();
  const { createMutation } = usePostData(
    `/appointmentTypes/create${profileId}`,
    "viewAllAppointmentTypes"
  );
  const [apptypeData, setAppTypeData] = useState({});
  const [changes, setChanges] = useState({});
  const { data: appointmentType } = useFetchData(
    `/appointmentTypes/view${appointmentTypeId ? appointmentTypeId : 0}`
  );

  const { patchMutation } = usePatchData(
    `/appointmentTypes/update${appointmentTypeId}`
  );
  useEffect(() => {
    if (appointmentType) {
      setAppTypeData(appointmentType);
    }
  }, [appointmentType]);

  function handleChange(event) {
    const { name, value } = event.target;
    setErrorMessage();

    setAppTypeData((prev) => ({
      ...prev,
      [name]: value === "" ? null : value,
    }));

    setChanges((prev) => ({
      ...prev,
      [name]: value === "" ? null : value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (appointmentTypeId) {
      try {
        const cleanedData = updateAppointmentTypeValidatiionSchema.cast(
          changes,
          { assert: false }
        );
        await updateAppointmentTypeValidatiionSchema.validate(cleanedData);
        patchMutation.mutate(cleanedData);
        setChanges({});
      } catch (error) {
        setErrorMessage(error.message);
      }
    } else {
      try {
        const cleanedData = appointmentTypeValidationSchema.cast(apptypeData, {
          assert: false,
        });

        await appointmentTypeValidationSchema.validate(cleanedData);
        createMutation.mutate(cleanedData);
        setAppTypeData({});
      } catch (error) {
        setErrorMessage(error.message);
      }
    }
  }

  //TODO create a reusbale cancel button. keep in mind that we dont want to trigge rsubmits whne we lcick it in the form

  return (
    <>
      <div className="w-full h-fit bg-white p-3  pt-4  font-medium  ">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className=" border-b border-slate-700 h-10 flex justify-between ">
            <h1>Add a new Appointment Type</h1>
            <p onClick={() => hideComponent()}>X</p>
          </div>

          <div className="flex gap-3">
            <Input
              labelText="Appointment Type name"
              type="text"
              name="appointment_name"
              onchange={handleChange}
              value={apptypeData.appointment_name ?? ""}
              placeholder="Appointment Type name"
              required={false}
            />
            <Input
              labelText="Duration"
              required={true}
              type="number"
              onchange={handleChange}
              name="duration"
              value={apptypeData.duration ?? ""}
              placeholder="Duration"
              bottomInfo="The duration of this appointment type in minutes"
            />
            <Input
              labelText="Price"
              type="number"
              name="price"
              onchange={handleChange}
              value={apptypeData.price ?? ""}
              placeholder="Price"
              required={true}
              bottomInfo="If not automated Icd10 codes are set, then the appointment will default to this price"
            />
          </div>
          <div className="flex justify-between items-end">
            <CancelButton
              onclick={() => hideComponent()}
              textContent="Cancel"
            />
            <SubmitButton
              text="Save"
              disable={
                appointmentTypeId
                  ? Object.keys(changes).length === 0
                  : Object.keys(apptypeData).length !== 3
              }
            />
          </div>

          {errorMessage && <DisplaySingleError errorMessage={errorMessage} />}
        </form>
      </div>
    </>
  );
}
