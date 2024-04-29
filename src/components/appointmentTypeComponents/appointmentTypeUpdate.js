import { useEffect, useState } from "react";
import { useFetchData, usePatchData } from "../../CustomHooks/serverStateHooks";
import { updateAppointmentTypeValidatiionSchema } from "../../form validation Schemas/validationSchemas";
import Input from "../miscellaneous components/DisplayTextInput";
import SubmitButton from "../miscellaneous components/SubmitButton";
import CancelButton from "../miscellaneous components/CancelButton";
import DisplaySingleError from "../miscellaneous components/WarningMessage";

export default function UpdateAppointmentType({
  appointmentTypeId,
  hideComponent,
  icd10Total = undefined,
}) {
  const { data: appointmentTypeData } = useFetchData(
    `/appointmentTypes/view${appointmentTypeId}`
  );
  const { patchMutation } = usePatchData(
    `/appointmentTypes/update${appointmentTypeId}`,
    "viewAllAppointmentTypes"
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
  }
  return (
    <>
      <div className="w-full h-fit bg-white p-3  pt-4  font-medium  ">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <Input
            labelText="Appointment Type name"
            type="text"
            name="appointment_name"
            onchange={handleChange}
            value={displayAppointmentData.appointment_name ?? ""}
            placeholder="Appointment Type name"
            required={false}
            staticBottomInfo={"eg: intial consultation, follow-up etc"}
          />
          <div className="flex gap-3  ">
            <div className="grow">
              <Input
                labelText="Duration"
                required={true}
                type="number"
                onchange={handleChange}
                name="duration"
                value={displayAppointmentData.duration ?? ""}
                placeholder="Duration"
                staticBottomInfo="The duration of this appointment type in minutes"
              />{" "}
            </div>
            <div className="grow">
              {" "}
              <Input
                labelText="Price"
                type="number"
                name="price"
                onchange={handleChange}
                value={
                  icd10Total ? icd10Total : displayAppointmentData?.price ?? ""
                }
                disable={icd10Total}
                placeholder="Price"
                required={true}
                staticBottomInfo={
                  icd10Total
                    ? "Pricing for this product is automatically set according to the automated icd-10 codes and cannot be edited"
                    : "Set the price for this appointment type"
                }
              />
            </div>
          </div>

          <div className="flex justify-between items-end">
            <CancelButton textContent="Cancel" onclick={hideComponent} />
            <SubmitButton
              text="Save"
              disable={Object.keys(changes).length === 0}
            />
          </div>

          {errorMessage && <DisplaySingleError errorMessage={errorMessage} />}
        </form>
      </div>
    </>
  );
}
