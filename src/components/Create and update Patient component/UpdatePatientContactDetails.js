import { useEffect, useState } from "react";
import { useFetchData, usePatchData } from "../../CustomHooks/serverStateHooks";
import PatientContactDetailsForm from "./PatientContactDetailsForm";
import { createPatientValidationSchema } from "../../form validation Schemas/validationSchemas";
import {
  useClientInfoPortal,
  useGlobalStore,
  usePatientPortalStore,
} from "../../zustandStore/store";
import {
  useOnSubmitButtonTextstateManager,
  useSetLoadingStates,
} from "../../CustomHooks/otherHooks";
import CustomAlertMessage from "../miscellaneous components/CustomAlertMessage";

export default function UpdatePatientContactDetails({
  showTopBar = {
    label: "Patient Contact Details",
    show: true,
    showCloseOption: false,
    labeTextClassName: "text-black border-b border-slate-400 w-full pb-3 ",

    className: "bg-white p-4 ",
  },
  hideComponent = false,
}) {
  const { patientId } = usePatientPortalStore();
  console.log("global patient portal id  is " + patientId);
  const { data: patientContactDetailsData, isLoading } = useFetchData(
    `/patients/viewPatient${patientId}`,
    ["patientContactDetails", patientId]
  );
  const setterFnForPatientDataInCreateAppointmentTree = useGlobalStore(
    (state) => state.setGlobalPatientData
  );
  const { setPatientContactDetailsPageLoadingState } = useClientInfoPortal();

  useSetLoadingStates(isLoading, setPatientContactDetailsPageLoadingState);
  const { patchMutation } = usePatchData(`/patients/update${patientId}`);
  const [errorMessage, setErrorMessage] = useState();
  const [patientInfo, setPatientInfo] = useState({});
  const [changes, setChanges] = useState({});
  const saveButtonText = useOnSubmitButtonTextstateManager(
    "save",
    undefined,
    patchMutation
  );
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
      const { data: response } = await patchMutation.mutateAsync(validatedData);

      setterFnForPatientDataInCreateAppointmentTree(response);
      setChanges({});
      setErrorMessage();
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  return (
    <>
      <PatientContactDetailsForm
        saveButtonText={saveButtonText}
        disabled={Object.keys(changes).length === 0}
        patientInfo={patientInfo}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        guidanceMessage={false}
        errorMessage={errorMessage}
        hideComponent={hideComponent}
        showTopBar={showTopBar}
      />
      <CustomAlertMessage
        errorFlag={errorMessage}
        successFlag={patchMutation.isSuccess}
        errorMessage={errorMessage}
        successMessage="Successfully updated"
      />
    </>
  );
}
