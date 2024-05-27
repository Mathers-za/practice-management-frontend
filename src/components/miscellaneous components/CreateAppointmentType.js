import { useState } from "react";

import { usePostData } from "../../CustomHooks/serverStateHooks";

import SubmitButton from "./SubmitButton";
import { createAppointmentTypeValidationSchema } from "../../form validation Schemas/validationSchemas";
import DisplaySingleError from "./WarningMessage";
import CancelButton from "./CancelButton";
import { TextField, Button } from "@mui/material";

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
            <TextField
              fullWidth
              variant="standard"
              name="appointment_name"
              onChange={handleChange}
              label="Appointment Type name"
              value={appointmentTypeDataPayload.appointment_name || ""}
              required={true}
            />
            <TextField
              fullWidth
              labelText="Duration"
              required={true}
              type="number"
              onChange={handleChange}
              name="duration"
              value={appointmentTypeDataPayload.duration ?? ""}
              label="Duration"
              variant="standard"
            />

            <TextField
              fullWidth
              labelText="Price"
              type="number"
              name="price"
              onChange={handleChange}
              value={appointmentTypeDataPayload.price ?? ""}
              label="Price"
              required={true}
              variant="standard"
            />
          </div>
          <div className="flex justify-between items-end">
            <Button
              type="button"
              onClick={() => hideComponent()}
              variant="contained"
              color="inherit"
            >
              Cancel
            </Button>
            <Button
              color="primary"
              variant="contained"
              type="submit"
              disabled={Object.keys(appointmentTypeDataPayload).length != 3}
            >
              Save
            </Button>
          </div>

          {errorMessage && <DisplaySingleError errorMessage={errorMessage} />}
        </form>
      </div>
    </>
  );
}
