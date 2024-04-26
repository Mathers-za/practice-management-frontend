import { useState } from "react";
import Input from "./DisplayTextInput";
import { usePostData } from "../../CustomHooks/serverStateHooks";

import SubmitButton from "./SubmitButton";
import { appointmentTypeValidationSchema } from "../../form validation Schemas/validationSchemas";
import DisplaySingleError from "./WarningMessage";

export default function CreateAppointmentType({ profileId, hideComponent }) {
  const [errorMessage, setErrorMessage] = useState();
  const { createMutation } = usePostData(
    `/appointmentTypes/create${profileId}`
  );
  const [postRequestPayload, setPostRequestPayload] = useState({});

  function handleChange(event) {
    const { name, value } = event.target;

    setPostRequestPayload((prev) => ({
      ...prev,
      [name]: value === "" ? null : value,
    }));
  } //TODO make a resubale cancel button
  //TODO make a reusable close x button for the top right corner of the screen
  //TODO test this compoenent thorughly and then itegrate it into the appointment lits page when teh ad dbutton is clicked

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const cleanedData =
        appointmentTypeValidationSchema.cast(postRequestPayload);
      await appointmentTypeValidationSchema.validate(cleanedData);
      createMutation.mutate(cleanedData);
      setPostRequestPayload({});
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

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
              value={postRequestPayload.appointment_name ?? ""}
              placeholder="Appointment Type name"
              required={true}
            />
            <Input
              labelText="Duration"
              required={true}
              type="number"
              onchange={handleChange}
              name="duration"
              value={postRequestPayload.duration ?? ""}
              placeholder="Duration"
              bottomInfo="The duration of this appointment type in minutes"
            />
            <Input
              labelText="Price"
              type="number"
              name="price"
              onchange={handleChange}
              value={postRequestPayload.price ?? ""}
              placeholder="Price"
              required={true}
              bottomInfo="If not automated Icd10 codes are set, then the appointment will default to this price"
            />
          </div>
          <div className="flex justify-between items-end">
            <SubmitButton text="Cancel" />
            <SubmitButton
              text="Save"
              disable={Object.keys(postRequestPayload).length !== 3}
            />
          </div>

          {errorMessage && <DisplaySingleError errorMessage={errorMessage} />}
        </form>
      </div>
    </>
  );
}
