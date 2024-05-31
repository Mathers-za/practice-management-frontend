import { useEffect, useState } from "react";

import {
  useFetchData,
  usePostData,
  usePatchData,
} from "../CustomHooks/serverStateHooks";
import { useQueryClient } from "react-query";
import { TextField, Checkbox, Button, FormControlLabel } from "@mui/material";
import { usePatientPortalStore } from "../zustandStore/store";

export default function MedicalAid() {
  const { patientId } = usePatientPortalStore();
  const { data, isSuccess } = useFetchData(
    `/medicalAid/view${patientId}`,
    "medicalAidData"
  );

  const [isFirstTimeCreatingPost, setIsFirstTimeCreatingPost] = useState(true);
  const { createMutation } = usePostData(
    `/medicalAid/create${patientId}`,
    "medicalAidData"
  );

  const [medAidInformation, setMedAidInformation] = useState({});
  const [changes, setChanges] = useState({});
  const { patchMutation } = usePatchData(`/medicalAid/update${data?.id}`);

  const [showDependantFields, setShowDependantFields] = useState(false);

  useEffect(() => {
    if (data && isSuccess) {
      setMedAidInformation(data);
      setIsFirstTimeCreatingPost(false);
      setShowDependantFields(data.is_dependant);
    }

    if (!data) {
      //syncing issue with patient id. this solve sthe problem. dont touch
      setMedAidInformation({});
      setShowDependantFields(false);
    }
  }, [data, patientId]);

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

  return (
    <>
      <form
        className="bg-white p-5  "
        onSubmit={(e) => {
          e.preventDefault();
          if (isFirstTimeCreatingPost) {
            createMutation.mutate(medAidInformation);
            setIsFirstTimeCreatingPost(false);
            setChanges({});
          } else {
            patchMutation.mutate(changes);
            setChanges({});
          }
        }}
      >
        <div className="space-y-6">
          <div className="border-b ">
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
            Save
          </Button>
        </div>
      </form>
    </>
  );
}
