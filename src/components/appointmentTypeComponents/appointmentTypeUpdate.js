import { useEffect, useState } from "react";
import { useFetchData, usePatchData } from "../../CustomHooks/serverStateHooks";
import { updateAppointmentTypeValidatiionSchema } from "../../form validation Schemas/validationSchemas";
import Input from "../miscellaneous components/DisplayTextInput";
import GenericButton from "../miscellaneous components/SubmitButton";
import CancelButton from "../miscellaneous components/CancelButton";
import DisplaySingleError from "../miscellaneous components/WarningMessage";
import { useAppointmentTypeAndIcdAutomationsPage } from "../../zustandStore/store";

export default function UpdateAppointmentType({
  appointmentTypeId,
  hideComponent,
}) {
  const icd10PricesTotal = useAppointmentTypeAndIcdAutomationsPage(
    (state) => state.icdPriceTotal
  );
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
    console.log("the parse float value is " + icd10PricesTotal);
  }
  return (
    <>
      <div className="w-full h-fit bg-white p-3  pt-4  font-medium  ">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <Input
            labelText="Appointment Type name"
            type="text"
            name="appointment_name"
            onChange={handleChange}
            value={displayAppointmentData.appointment_name ?? ""}
            placeholder="Appointment Type name"
            required={false}
            staticBottomInfo={"eg: intial consultation, follow-up etc"}
          />
          <div className="flex gap-3 flex-wrap  ">
            <div className="flex-1">
              <Input
                labelText="Duration"
                required={true}
                type="number"
                onChange={handleChange}
                name="duration"
                value={displayAppointmentData.duration ?? ""}
                placeholder="Duration"
                staticBottomInfo="The duration of this appointment type in minutes"
              />{" "}
            </div>
            <div className="flex-1">
              {" "}
              <Input
                labelText="Price"
                type="number"
                name="price"
                onChange={icd10PricesTotal ? null : handleChange}
                value={
                  icd10PricesTotal
                    ? icd10PricesTotal.toFixed(2)
                    : displayAppointmentData?.price ?? ""
                }
                disable={icd10PricesTotal}
                placeholder="Price"
                required={true}
                staticBottomInfo={
                  icd10PricesTotal
                    ? "Pricing for this product is automatically set according to the automated icd-10 codes and cannot be edited"
                    : "Set the price for this appointment type"
                }
              />
            </div>
          </div>

          <div className="flex justify-between items-end">
            <CancelButton textContent="Cancel" onclick={hideComponent} />
            <GenericButton
              text="Save"
              disable={Object.keys(changes).length === 0}
              type="submit"
            />
          </div>

          {errorMessage && <DisplaySingleError errorMessage={errorMessage} />}
        </form>
      </div>
    </>
  );
}
