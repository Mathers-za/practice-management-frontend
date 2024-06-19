import { useEffect, useState } from "react";
import {
  useFetchData,
  usePatchData,
  usePostData,
} from "../../CustomHooks/serverStateHooks";
import {
  useClientInfoPortal,
  usePatientPortalStore,
} from "../../zustandStore/store";
import { patientAdditionalInformationValidationSchema } from "../../form validation Schemas/validationSchemas";
import {
  TextField,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Button,
  InputAdornment,
} from "@mui/material";
import defaultData from "../../DefaultData/defaultData";
import CustomAlertMessage from "../miscellaneous components/CustomAlertMessage";
import {
  useOnSubmitButtonTextstateManager,
  useSetLoadingStates,
} from "../../CustomHooks/otherHooks";

import { CalendarIcon, MobileDatePicker } from "@mui/x-date-pickers";

export default function PatientAdditionalInformation() {
  const { patientId } = usePatientPortalStore();
  const [patientAdditionalData, setPatientAdditonalData] = useState({});
  const [isPatch, setIsPatch] = useState(false);
  const { data: patientData, isLoading } = useFetchData(
    `/patientAdditionalInformation/view${patientId}`,
    ["PatientAdditionalInfo", patientId]
  );
  const [changes, setChanges] = useState({});
  const { setAdditionalInformationLoadingState } = useClientInfoPortal();
  useSetLoadingStates(isLoading, setAdditionalInformationLoadingState);
  const { patchMutation } = usePatchData(
    `/patientAdditionalInformation/update${patientId}`
  );
  const { createMutation } = usePostData(
    `/patientAdditionalInformation/create${patientId}`
  );

  const sumbitButtonText = useOnSubmitButtonTextstateManager(
    "Save",
    undefined,
    !patchMutation.isIdle ? patchMutation : createMutation
  );
  const [errors, setErrors] = useState();

  async function handleSubmit(event) {
    event.preventDefault();
    setErrors("");
    try {
      if (isPatch) {
        const validatedData =
          await patientAdditionalInformationValidationSchema.validate(changes);
        await patchMutation.mutateAsync(validatedData);
        setChanges({});
      } else {
        const validatedData =
          await patientAdditionalInformationValidationSchema.validate(
            patientAdditionalData
          );
        await createMutation.mutateAsync(validatedData);

        setIsPatch(true);
        setChanges({});
      }
    } catch (error) {
      setErrors(error.message);
    }
  }
  function handleDateChange(newDate) {
    setChanges((prev) => ({
      ...prev,
      date_of_birth: newDate,
    }));
    setPatientAdditonalData((prev) => ({
      ...prev,
      date_of_birth: newDate,
    }));
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setPatientAdditonalData((prev) => ({
      ...prev,
      [name]: value === "" ? null : value,
    }));

    setChanges((prev) => ({
      ...prev,
      [name]: value === "" ? null : value,
    }));
  }

  useEffect(() => {
    if (patientData) {
      setPatientAdditonalData(patientData);
      setIsPatch(true);
    }
  }, [patientData]);

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-5 shadow-md shadow-black/20 rounded-sm "
      >
        <div className="border-b border-black ">
          <h1 className="mb-3 text-lg">Additional patient information</h1>
        </div>
        <MobileDatePicker
          yearsPerRow={3}
          value={
            patientAdditionalData?.date_of_birth
              ? new Date(patientAdditionalData.date_of_birth)
              : null
          }
          onAccept={handleDateChange}
          views={["year", "month", "day"]}
          slotProps={{
            textField: {
              variant: "standard",
              fullWidth: true,
              InputProps: {
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarIcon />
                  </InputAdornment>
                ),
              },
            },
            actionBar: { actions: [] },
            toolbar: { sx: { bgcolor: "#38bdf8" } },
          }}
          closeOnSelect={true}
          format="yyyy-MM-dd"
          openTo="year"
          orientation="portrait"
        />

        <TextField
          sx={{ ".MuiInputBase-input": { boxShadow: "none" } }}
          multiline
          rows={3}
          onChange={handleChange}
          name="billing_address"
          fullWidth
          variant="filled"
          label="Billing Address"
          value={patientAdditionalData?.billing_address || ""}
        />
        <TextField
          sx={{ ".MuiInputBase-input": { boxShadow: "none" } }}
          multiline
          rows={3}
          variant="filled"
          label="Bio"
          helperText="Any interesting or pertinent notes you would liek to not about the patient"
          name="bio"
          onChange={handleChange}
          value={patientAdditionalData?.bio || ""}
          fullWidth
        />
        <TextField
          fullWidth
          variant="standard"
          name="initials"
          label="Initials"
          onChange={handleChange}
          value={patientAdditionalData?.initials || ""}
        />
        <FormControl fullWidth>
          <InputLabel variant="standard" id="title">
            Title
          </InputLabel>
          <Select
            variant="standard"
            name="title"
            value={patientAdditionalData?.title || ""}
            labelId="title"
            onChange={handleChange}
          >
            {defaultData?.defaultTitles.map((title) => {
              return <MenuItem value={title}>{title}</MenuItem>;
            })}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel variant="standard" id="gender">
            Gender
          </InputLabel>
          <Select
            variant="standard"
            value={patientAdditionalData?.gender || ""}
            name="gender"
            labelId="gender"
            label="gender"
            onChange={handleChange}
          >
            <MenuItem value={"Male"}>Male</MenuItem>
            <MenuItem value={"Female"}>Female</MenuItem>
            <MenuItem value={"Other"}>Other</MenuItem>
          </Select>
        </FormControl>

        <Button
          size="large"
          fullWidth
          disabled={Object.keys(changes).length === 0}
          variant="contained"
          type="submit"
          color="primary"
        >
          {sumbitButtonText}
        </Button>
        <CustomAlertMessage
          errorMessage={errors}
          successMessage={
            !patchMutation.isIdle
              ? "Successfully updated details"
              : "Successfully updated details"
          }
          errorFlag={errors}
          successFlag={
            !patchMutation.isIdle
              ? patchMutation.isSuccess
              : createMutation.isSuccess
          }
        />
      </form>
    </>
  );
}
