import { useEffect, useState } from "react";
import { useFetchData, usePatchData } from "../../CustomHooks/serverStateHooks";
import { updateAppointmentTypeValidatiionSchema } from "../../form validation Schemas/validationSchemas";
import {
  useOnSubmitButtonTextstateManager,
  useSetLoadingStates,
} from "../../CustomHooks/otherHooks";
import { useAppointmentTypeAndIcdAutomationsPage } from "../../zustandStore/store";
import { Button, TextField } from "@mui/material";
import { updateAppointmentTypeValidationSchema } from "../../form validation Schemas/validationSchemas";
import CustomAlertMessage from "../miscellaneous components/CustomAlertMessage";

export default function UpdateAppointmentType({
  appointmentTypeId,
  hideComponent,
}) {
  const { icdPriceTotal, setApptypeEditLoadingState } =
    useAppointmentTypeAndIcdAutomationsPage();
  const { data: appointmentTypeData, isLoading } = useFetchData(
    `/appointmentTypes/view${appointmentTypeId}`
  );
  const { patchMutation } = usePatchData(
    `/appointmentTypes/update${appointmentTypeId}`
  );
  useSetLoadingStates(isLoading, setApptypeEditLoadingState);

  const [displayAppointmentData, setDisplayAppointmentData] = useState({});
  const submitButtonText = useOnSubmitButtonTextstateManager(
    "save",
    undefined,
    patchMutation
  );
  useEffect(() => {
    if (appointmentTypeData) {
      setDisplayAppointmentData(appointmentTypeData);
    }
  }, [appointmentTypeData]);
  const [changes, setChanges] = useState({});
  const [errorMessage, setErrorMessage] = useState();

  function handleChange(event) {
    const { name, value } = event.target;
    setChanges((prev) => ({
      ...prev,
      [name]: value === "" ? null : value,
    }));
    setDisplayAppointmentData((prev) => ({
      ...prev,
      [name]: value === "" ? null : value,
    }));
  }

  //TODO pottintial validation update solutions- option - 1 pass entire object instead of just chnages, option -2 try pass a varible to use for hen mthid in yup

  async function handleSubmit(event) {
    setErrorMessage();
    event.preventDefault();

    try {
      const validatedData =
        await updateAppointmentTypeValidatiionSchema.validate(changes);
      await patchMutation.mutateAsync(validatedData);
      setChanges({});
    } catch (error) {
      setErrorMessage(error.message);
    }
    console.log("the parse float value is " + icdPriceTotal);
  }
  return (
    <>
      <div className="w-full h-fit  bg-white p-3  pt-4  font-medium  ">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <TextField
            required
            fullWidth
            label="Appointment Type name"
            variant="standard"
            name="appointment_name"
            onChange={handleChange}
            value={displayAppointmentData.appointment_name ?? ""}
          />

          <div className="flex gap-3 flex-wrap  ">
            <div className="flex-1">
              <TextField
                required
                fullWidth
                variant="standard"
                label="Duration"
                type="number"
                onChange={handleChange}
                name="duration"
                value={displayAppointmentData.duration ?? ""}
                helperText="The length of the appointment"
              />
            </div>
            <div className="flex-1">
              <TextField
                required
                fullWidth
                variant="standard"
                label="Price"
                type="number"
                name="price"
                onChange={icdPriceTotal ? null : handleChange}
                value={
                  icdPriceTotal
                    ? icdPriceTotal.toFixed(2)
                    : displayAppointmentData?.price ?? ""
                }
                disabled={icdPriceTotal}
                helperText={
                  icdPriceTotal
                    ? "Pricing for this product is automatically set according to the automated icd-10 codes and cannot be edited"
                    : "Set the price for this appointment type"
                }
              />
            </div>
          </div>

          <div className="flex justify-between items-end">
            <Button
              variant="contained"
              color="inherit"
              onClick={() => hideComponent()}
              type="button"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={Object.keys(changes).length === 0}
            >
              {submitButtonText}
            </Button>
          </div>

          <CustomAlertMessage
            errorFlag={errorMessage}
            successFlag={patchMutation.isSuccess}
            errorMessage={errorMessage}
            successMessage="Successfully updated appointment type details"
          />
        </form>
      </div>
    </>
  );
}
