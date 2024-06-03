import { useEffect, useState } from "react";
import { useFetchData, usePatchData } from "../../CustomHooks/serverStateHooks";
import PatientContactDetailsForm from "./PatientContactDetailsForm";
import { createPatientValidationSchema } from "../../form validation Schemas/validationSchemas";
import { usePatientPortalStore } from "../../zustandStore/store";

export default function UpdatePatientContactDetails() {
  const { patientId } = usePatientPortalStore();
  console.log("global patient portal id  is " + patientId);
  const { data: patientContactDetailsData } = useFetchData(
    `/patients/viewPatient${patientId}`,
    ["patientContactDetails", patientId]
  );

  const { patchMutation } = usePatchData(`/patients/update${patientId}`);
  const [errorMessage, setErrorMessage] = useState();
  const [patientInfo, setPatientInfo] = useState({});
  const [changes, setChanges] = useState();
  useEffect(() => {
    if (patientContactDetailsData) {
      setPatientInfo(patientContactDetailsData);
    }
  }, [patientContactDetailsData]);

  function handleChange(event) {
    const { name, value } = event.target;
    setPatientInfo((prev) => ({
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
    try {
      const validatedData = await createPatientValidationSchema.validate(
        changes
      );
      patchMutation.mutate(validatedData);
      setChanges({});
      setErrorMessage();
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  return (
    <>
      <PatientContactDetailsForm
        disabled={Object.keys(changes).length === 0}
        patientInfo={patientInfo}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        guidanceMessage={false}
        errorMessage={errorMessage}
        hideComponent={false}
        showTopBar={{
          label: "Patient Contact Details",
          show: true,
          showCloseOption: false,
          labeTextClassName:
            "text-black border-b border-slate-400 w-full pb-3 ",

          className: "bg-white p-4 ",
        }}
      />
    </>
  );
}
