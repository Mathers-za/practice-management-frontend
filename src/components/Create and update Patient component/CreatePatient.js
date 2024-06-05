import { useEffect, useState } from "react";
import { usePostData } from "../../CustomHooks/serverStateHooks";

import { createPatientValidationSchema } from "../../form validation Schemas/validationSchemas";
import { patientCreationGuidance } from "../../userGuidanceFunctions/createPatientFns";
import PatientContactDetailsForm from "./PatientContactDetailsForm";
import {
  useGlobalStore,
  usePatientPortalStore,
} from "../../zustandStore/store";

export default function CreatePatient({ hideComponent, actionOnSave }) {
  const profileId = useGlobalStore((state) => state.globalProfileData.id);
  const { createMutation } = usePostData(`/patients/create${profileId}`);
  const [patientInfo, setPatientInfo] = useState({});
  const [errorMessage, setErrorMessage] = useState();
  const [guidanceMessage, setGuidanceMessage] = useState();

  useEffect(() => {
    const message = patientCreationGuidance(patientInfo);
    setGuidanceMessage(message);
  }, [patientInfo]);

  //TODO add submssion api sending logic

  async function handleSubmit(event) {
    event.preventDefault();
    setGuidanceMessage();
    try {
      const validatedData = await createPatientValidationSchema.validate(
        patientInfo
      );
      const response = await createMutation.mutateAsync(validatedData);
      setErrorMessage();
      actionOnSave && actionOnSave(response);
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  //TODO add pathing once patient is created
  async function handleChange(event) {
    const { name, value } = event.target;
    setErrorMessage();

    setPatientInfo((prev) => ({
      ...prev,
      [name]: value === "" ? null : value,
    }));
  }

  return (
    <>
      <PatientContactDetailsForm
        errorMessage={errorMessage}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        patientInfo={patientInfo}
        guidanceMessage={guidanceMessage}
        hideComponent={hideComponent}
        showTopBar={{
          label: "Create a new patient",
          show: true,
          showCloseOption: true,
        }}
      />
    </>
  );
}
