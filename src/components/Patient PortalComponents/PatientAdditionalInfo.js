import { useEffect, useState } from "react";
import { useFetchData } from "../../CustomHooks/serverStateHooks";
import { usePatientPortalStore } from "../../zustandStore/store";
import { TextField } from "@mui/material";
import { MobileDatePicker } from "@mui/x-date-pickers";

export default function PatientAdditionalInformation() {
  const { patientId } = usePatientPortalStore();
  const [patientExtraInfo, setPatientExtraInfo] = useState({});
  const [isPatch, setIsPatch] = useState(false);
  const { data: patientAddionalData } = useFetchData(
    `/patientAdditionalInformation/view${patientId}`,
    ["PatientAdditionalInfo", patientId]
  );
  //TODO finish this page

  useEffect(() => {
    if (patientAddionalData) {
      setPatientExtraInfo(patientExtraInfo);
      setIsPatch(true);
    }
  }, [patientAddionalData]);

  return (
    <>
      <MobileDatePicker
        slotProps={{ textField: { variant: "standard", fullWidth } }}
        onChange={(newDate) =>
          setPatientExtraInfo((prev) => ({ ...prev, date_of_birth: newDate }))
        }
      />
      <TextField
        multiline
        onChange={handleChange}
        name="billing_address"
        fullWidth
        label="Billing Address"
        value={patientAddionalData?.billing_address || ""}
      />
      <TextField
        multiline
        name="bio"
        onChange={handleChange}
        value={patientAddionalData?.bio || ""}
        fullWidth
      />
      <FormControl fullWidth>
        <InputLabel id="title">Age</InputLabel>
        <Select id="title" value={age} label="Title" onChange={handleChange}>
          <MenuItem value={"Dr."}>Dr.</MenuItem>
          <MenuItem value={"Mr."}>Mr.</MenuItem>
          <MenuItem value={"Mrs."}>Mrs.</MenuItem>
          <MenuItem value={"Miss"}>Miss</MenuItem>
          <MenuItem value={"Ms."}>Ms.</MenuItem>
          <MenuItem value={"Master"}>Master</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel id="title">Age</InputLabel>
        <Select id="title" value={age} label="Title" onChange={handleChange}>
          <MenuItem value={"Male"}>Male</MenuItem>
          <MenuItem value={"Female"}>Female</MenuItem>
          <MenuItem value={"Apache attack helicopter"}>
            Apache attack helicopter
          </MenuItem>
        </Select>
      </FormControl>
      <TextField
        onChange={handleChange}
        variant="standard"
        name="gender"
        fullWidth
      />
    </>
  );
}
