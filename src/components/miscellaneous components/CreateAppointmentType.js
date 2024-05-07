import { useState } from "react";
import Input from "./DisplayTextInput";
import { usePostData } from "../../CustomHooks/serverStateHooks";

import SubmitButton from "./SubmitButton";
import { createAppointmentTypeValidationSchema } from "../../form validation Schemas/validationSchemas";
import DisplaySingleError from "./WarningMessage";
import CancelButton from "./CancelButton";

export default function CreateAppointmentType({
  profileId,
  refetchFn,
  hideComponent,
}) {
  const [errorMessage, setErrorMessage] = useState();
  const { createMutation } = usePostData(
    `/appointmentTypes/create${profileId}`
  );

  const [appointmentTypeDataPayload, setAppointmentTypeDataPayload] = useState(
    {}
  );

  function handleChange(event) {
    const { name, value } = event.target;
    setErrorMessage();

    setAppointmentTypeDataPayload((prev) => ({
      ...prev,
      [name]: value === "" ? null : value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const cleanedData = createAppointmentTypeValidationSchema.cast(
        appointmentTypeDataPayload,
        {
          assert: false,
        }
      );

      await createAppointmentTypeValidationSchema.validate(cleanedData);
      await createMutation.mutateAsync(cleanedData);
      setAppointmentTypeDataPayload({});
      refetchFn();
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  //TODO create a reusbale cancel button. keep in mind that we dont want to trigge rsubmits whne we lcick it in the form

  return (
    <>
      <div className="w-full h-fit bg-white p-3  pt-4  font-medium  ">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className=" border-b border-slate-700 h-10 flex justify-between ">
            <h1 className="font-semibold text-lg">
              Add a new Appointment Type
            </h1>
            <p onClick={() => hideComponent()}>X</p>
          </div>

          <div className="flex gap-3">
            <Input
              labelText="Appointment Type name"
              type="text"
              name="appointment_name"
              onChange={handleChange}
              value={appointmentTypeDataPayload.appointment_name ?? ""}
              placeholder="Appointment Type name"
              required={false}
            />
            <Input
              labelText="Duration"
              required={true}
              type="number"
              onChange={handleChange}
              name="duration"
              value={appointmentTypeDataPayload.duration ?? ""}
              placeholder="Duration"
              dynamicBottomInfo="The duration of this appointment type in minutes"
            />
            <Input
              labelText="Price"
              type="number"
              name="price"
              onChange={handleChange}
              value={appointmentTypeDataPayload.price ?? ""}
              placeholder="Price"
              required={true}
              dynamicBottomInfo="If not automated Icd10 codes are set, then the appointment will default to this price"
            />
          </div>
          <div className="flex justify-between items-end">
            <CancelButton
              onclick={() => hideComponent()}
              textContent="Cancel"
            />
            <SubmitButton
              text="Save"
              disable={Object.keys(appointmentTypeDataPayload).length != 3}
            />
          </div>

          {errorMessage && <DisplaySingleError errorMessage={errorMessage} />}
        </form>
      </div>
    </>
  );
}
