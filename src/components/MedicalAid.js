import { useEffect, useState } from "react";

import {
  useFetchData,
  usePostData,
  usePatchData,
} from "../CustomHooks/serverStateHooks";
import { useQueryClient } from "react-query";
import { TextField, Checkbox, Button } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";

export default function MedicalAid({ patientId }) {
  const queryClient = useQueryClient();
  const { data, httpStatus, isSuccess } = useFetchData(
    `/medicalAid/view${patientId}`,
    "medicalAidData"
  );

  const [isFirstTimeCreatingPost, setIsFirstTimeCreatingPost] = useState(false);
  const { createMutation } = usePostData(
    `/medicalAid/create${patientId}`,
    "medicalAidData"
  );

  const [medAidInformation, setMedAidInformation] = useState({});
  const [changes, setChanges] = useState({});
  const { patchMutation } = usePatchData(
    `/medicalAid/update${data?.id}`,
    "medicalAidData"
  );

  const [showDependantFields, setShowDependantFields] = useState(false);

  useEffect(() => {
    if (!data) {
      setIsFirstTimeCreatingPost(true);
      setMedAidInformation({});
    }

    queryClient.invalidateQueries("medicalAidData"); // had to inlcude this in order to sync patient Id prop. patient id was not syncng in medicalAid and thus displaying data of previous id
    if (data) {
      setMedAidInformation(data);
      setIsFirstTimeCreatingPost(false);
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
          <Checkbox
            onChange={(event) => {
              setShowDependantFields(!showDependantFields);
              handleChange(event);
            }}
            size="medium"
            defaultChecked={false}
            name="dependant"
            value={medAidInformation.dependant}
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
