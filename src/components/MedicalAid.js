import { useEffect, useRef, useState } from "react";

import {
  useFetchData,
  usePostData,
  usePatchData,
} from "../CustomHooks/serverStateHooks";

import { TextField, Checkbox, Button, FormControlLabel } from "@mui/material";
import {
  useClientInfoPortal,
  usePatientPortalStore,
} from "../zustandStore/store";
import {
  useOnSubmitButtonTextstateManager,
  useSetLoadingStates,
} from "../CustomHooks/otherHooks";
import CustomAlertMessage from "./miscellaneous components/CustomAlertMessage";

export default function MedicalAid() {
  const [isPatch, setIsPatch] = useState(false);
  const { patientId } = usePatientPortalStore();
  const { data, isSuccess, isLoading } = useFetchData(
    `/medicalAid/view${patientId}`,
    ["medicalAidData", patientId]
  );

  const { createMutation } = usePostData(`/medicalAid/create${patientId}`, [
    "medicalAidData",
    patientId,
  ]); //TODO there seems to be an issue where the first time medical aid is posted, when is depdant is clicked it doesnt change the request to true. Fix it
  //TODO not in this folder but you do need to add some user feedback when invoices are sent
  const [medAidInformation, setMedAidInformation] = useState({});
  const { setMedicalAidLoadingState } = useClientInfoPortal();
  const [changes, setChanges] = useState({});
  const { patchMutation } = usePatchData(`/medicalAid/update${data?.id}`);
  const [error, setError] = useState(false);
  const [showDependantFields, setShowDependantFields] = useState(false);
  const saveButtonText = useOnSubmitButtonTextstateManager(
    "save",
    undefined,
    !patchMutation.isIdle ? patchMutation : createMutation
  );
  useSetLoadingStates(isLoading, setMedicalAidLoadingState);

  useEffect(() => {
    if (data && isSuccess) {
      setMedAidInformation(data);
      setIsPatch(true);
      setShowDependantFields(data.is_dependant);
    }

    if (!data && isSuccess) {
      //syncing issue with patient id. this solve sthe problem. dont touch
      setMedAidInformation({});
      setShowDependantFields(false);
      setIsPatch(false);
    }
  }, [data, isSuccess]);

  function handleChange(e) {
    const { name, value } = e.target;
    setMedAidInformation((prev) => ({
      ...prev,
      [name]: value === "" ? null : value,
    }));

    setChanges((prev) => ({
      ...prev,
      [name]: value === "" ? null : value,
    }));
  }
  function handleSubmit(event) {
    event.preventDefault();

    try {
      if (!isPatch) {
        createMutation.mutate(medAidInformation);
        setIsPatch(true);
        setChanges({});
      } else {
        patchMutation.mutate(changes);
        setChanges({});
      }
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <>
      <form
        className="bg-white p-5    shadow-md shadow-black/20 rounded-sm   "
        onSubmit={handleSubmit}
      >
        <div className="space-y-6">
          <div className="border-b border-black ">
            <h1 className="mb-3 text-lg">Medical Aid</h1>
          </div>{" "}
          <TextField
            variant="standard"
            fullWidth
            onChange={handleChange}
            name="gov_id"
            value={medAidInformation?.gov_id || ""}
            label="ID number"
          />
          <TextField
            variant="standard"
            fullWidth
            onChange={handleChange}
            name="medaid_name"
            value={medAidInformation?.medaid_name || ""}
            label="Medical Aid Name"
            helperText="Medical-aid name"
          />
          <TextField
            variant="standard"
            fullWidth
            onChange={handleChange}
            name="medaid_scheme"
            value={medAidInformation?.medaid_scheme || ""}
            label="Scheme Name"
          />
          <TextField
            variant="standard"
            fullWidth
            onChange={handleChange}
            name="medaid_number"
            value={medAidInformation?.medaid_number || ""}
            label="Medical Aid Number"
          />
          <FormControlLabel
            label="Patient is a dependant"
            control={
              <Checkbox
                onChange={(event) => {
                  setShowDependantFields(!showDependantFields);
                  setChanges((prev) => ({
                    ...prev,
                    is_dependant: event.target.checked,
                  }));
                  setMedAidInformation((prev) => ({
                    ...prev,
                    is_dependant: event.target.checked,
                  }));
                }}
                checked={showDependantFields ? showDependantFields : false}
                size="medium"
                name="dependant"
                value={medAidInformation.dependant}
              />
            }
          />
        </div>

        {showDependantFields && (
          <div className="space-y-6 mt-3">
            <TextField
              variant="standard"
              fullWidth
              onChange={handleChange}
              name="mainmem_name"
              value={medAidInformation?.mainmem_name || ""}
              label="Main Mmeber First Name"
            />
            <TextField
              variant="standard"
              fullWidth
              onChange={handleChange}
              name="mainmem_surname"
              value={medAidInformation?.mainmem_surname || ""}
              label="main Member Last Name"
            />
            <TextField
              variant="standard"
              fullWidth
              onChange={handleChange}
              name="mainmem_gov_id"
              value={medAidInformation?.mainmem_gov_id || ""}
              label="Main Member ID Number"
            />
          </div>
        )}

        <div className="mt-4">
          <Button
            type="submit"
            fullWidth
            disabled={Object.keys(changes).length === 0}
            size="large"
            variant="contained"
          >
            {saveButtonText}
          </Button>
        </div>

        <CustomAlertMessage
          errorFlag={error}
          successFlag={
            !patchMutation.isIdle
              ? patchMutation.isSuccess
              : createMutation.isSuccess
          }
          errorMessage={error}
          successMessage={"Successfully updated"}
          severityOnError="error"
          severityOnSuccess="success"
        />
      </form>
    </>
  );
}
