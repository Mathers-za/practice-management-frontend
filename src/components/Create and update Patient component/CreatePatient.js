import { useEffect, useState } from "react";
import { usePostData } from "../../CustomHooks/serverStateHooks";

import { createPatientValidationSchema } from "../../form validation Schemas/validationSchemas";
import { patientCreationGuidance } from "../../userGuidanceFunctions/createPatientFns";
import PatientContactDetailsForm from "./PatientContactDetailsForm";
import {
  useGlobalStore,
  usePatientPortalStore,
} from "../../zustandStore/store";
import CreatePatientSuccessPage from "./PatientCreatedSuccessPage";

export default function CreatePatient({ hideComponent, actionOnSave }) {
  const profileId = useGlobalStore((state) => state.globalProfileData.id);
  const { createMutation } = usePostData(`/patients/create${profileId}`);
  const [patientInfo, setPatientInfo] = useState({});
  const [errorMessage, setErrorMessage] = useState();
  const [guidanceMessage, setGuidanceMessage] = useState();
  const [showSuccessPage, setShowSuccessPage] = useState(false);

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
      actionOnSave
        ? actionOnSave(response)
        : setShowSuccessPage(!showSuccessPage);
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
      {showSuccessPage && (
        <div className="fixed left-0 top-0  w-full h-screen z-20">
          <div className="w-full h-full">
            <CreatePatientSuccessPage
              hideComponent={() => setShowSuccessPage(!showSuccessPage)}
              resetCreateAppointmentFn={() => {
                setGuidanceMessage();
                setPatientInfo({});
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
