import { useEffect, useState } from "react";
import { useFetchData, usePatchData } from "../../CustomHooks/serverStateHooks";
import { updateAppointmentTypeValidatiionSchema } from "../../form validation Schemas/validationSchemas";

import DisplaySingleError from "../miscellaneous components/WarningMessage";
import { useAppointmentTypeAndIcdAutomationsPage } from "../../zustandStore/store";
import { Button, TextField } from "@mui/material";

export default function UpdateAppointmentType({
  appointmentTypeId,
  hideComponent,
}) {
  const { icdPriceTotal } = useAppointmentTypeAndIcdAutomationsPage();
  const { data: appointmentTypeData } = useFetchData(
    `/appointmentTypes/view${appointmentTypeId}`
  );
  const { patchMutation } = usePatchData(
    `/appointmentTypes/update${appointmentTypeId}`
  );
  const [displayAppointmentData, setDisplayAppointmentData] = useState({});

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

  async function handleSubmit(event) {
    setErrorMessage();
    event.preventDefault();

    try {
      const cleanedChangesData = updateAppointmentTypeValidatiionSchema.cast(
        changes,
        { assert: false }
      );
      await updateAppointmentTypeValidatiionSchema.validate(cleanedChangesData);
      await patchMutation.mutateAsync(cleanedChangesData);
      setChanges({});
    } catch (error) {
      setErrorMessage(error.message);
    }
    console.log("the parse float value is " + icdPriceTotal);
  }
  return (
    <>
      <div className="w-full h-fit bg-white p-3  pt-4  font-medium  ">
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
                fullWidth
                variant="standard"
                label="Duration"
                required
                type="number"
                onChange={handleChange}
                name="duration"
                value={displayAppointmentData.duration ?? ""}
                helperText="The length of the appointment"
              />
            </div>
            <div className="flex-1">
              <TextField
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
                required
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
              Save
            </Button>
          </div>

          {errorMessage && <DisplaySingleError errorMessage={errorMessage} />}
        </form>
      </div>
    </>
  );
}
