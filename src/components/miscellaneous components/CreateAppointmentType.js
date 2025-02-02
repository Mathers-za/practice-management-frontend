import { useEffect, useState } from "react";

import { usePostData } from "../../CustomHooks/serverStateHooks";

import { createAppointmentTypeValidationSchema } from "../../form validation Schemas/validationSchemas";
import DisplaySingleError from "./WarningMessage";

import { TextField, Button } from "@mui/material";
import { useOnSubmitButtonTextstateManager } from "../../CustomHooks/otherHooks";
import CustomAlertMessage from "./CustomAlertMessage";
import { useGlobalStore } from "../../zustandStore/store";

export default function CreateAppointmentType({
  queryKeyToInvalidate,
  hideComponent,
  onHandleSumbitAction,
}) {
  const profileId = useGlobalStore((state) => state.globalProfileData.id);
  const [errorMessage, setErrorMessage] = useState();
  const { createMutation } = usePostData(
    `/appointmentTypes/create${profileId}`,
    queryKeyToInvalidate && queryKeyToInvalidate
  );

  const [appointmentTypeDataPayload, setAppointmentTypeDataPayload] = useState(
    {}
  );

  useEffect(() => {
    if (createMutation.isSuccess) {
      setAppointmentTypeDataPayload({});
    }
  }, [createMutation.isSuccess]);

  const submitButtonText = useOnSubmitButtonTextstateManager(
    "save",
    undefined,
    createMutation
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
    setErrorMessage("");
    try {
      const cleanedData = createAppointmentTypeValidationSchema.cast(
        appointmentTypeDataPayload,
        {
          assert: false,
        }
      );

      await createAppointmentTypeValidationSchema.validate(cleanedData);
      const response = await createMutation.mutateAsync(cleanedData);
      console.log(
        "The respons efrom create app type is " + JSON.stringify(response)
      );
      onHandleSumbitAction && onHandleSumbitAction(response);
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  return (
    <>
      <div className="w-full h-fit bg-white p-5  pt-4  font-medium pb-4  mb-6 border border-black shadow-lg shadow-black/50 ">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className=" border-b border-slate-700 h-10 flex justify-between ">
            <h1 className="font-semibold text-lg">
              Add a new Appointment Type
            </h1>
          </div>

          <div className="flex gap-3 ">
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
          <div className="flex justify-between items-end ">
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
              {submitButtonText}
            </Button>
          </div>

          <CustomAlertMessage
            errorFlag={errorMessage}
            successFlag={createMutation.isSuccess}
            errorMessage={errorMessage}
            successMessage="Successfully created appointment type"
          />
        </form>
      </div>
    </>
  );
}
