import { useEffect, useState } from "react";
import { usePostData } from "../../CustomHooks/serverStateHooks";

import GenericTopBar from "../miscellaneous components/GenericTopBar";
import FullWithButton from "../miscellaneous components/FullWidthButton";
import DisplaySingleError from "../miscellaneous components/WarningMessage";
import { createPatientValidationSchema } from "../../form validation Schemas/validationSchemas";
import { patientCreationGuidance } from "../../userGuidanceFunctions/createPatientFns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, TextField } from "@mui/material";
import { MuiTelInput } from "mui-tel-input";

export default function CreatePatient({ profileId, hideComponent }) {
  const { handlePost } = usePostData(`/patients/create${profileId}`);
  const [patientInfo, setPatientInfo] = useState({});
  const [errorMessage, setErrorMessage] = useState();
  const [guidanceMessage, setGuidanceMessage] = useState();

  useEffect(() => {
    const message = patientCreationGuidance(patientInfo);
    setGuidanceMessage(message);
  }, [patientInfo]);

  //TODO add submssion api sending logic

  function handlePhoneNumberChange(contactNumber) {
    setPatientInfo((prev) => ({ ...prev, contact_number: contactNumber }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setGuidanceMessage();
    try {
      await createPatientValidationSchema.validate(patientInfo);
    } catch (error) {
      setErrorMessage(error.message);
    }
  }
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
      <form className="bg-white  rounded-md shadow-md " onSubmit={handleSubmit}>
        <GenericTopBar label="Create a patient" onclick={hideComponent} />
        <div className="p-3 space-y-6 ">
          <div className="flex gap-3 ">
            <TextField
              fullWidth
              variant="standard"
              type="text"
              name="first_name"
              value={patientInfo.first_name || ""}
              label="First Name"
              onChange={handleChange}
              required={true}
              helperText="First name is required"
            />

            <TextField
              fullWidth
              variant="standard"
              type="text"
              name="last_name"
              value={patientInfo.last_name || ""}
              label="Last Name"
              onChange={handleChange}
              helperText="Last name optional but recommended"
            />
          </div>

          <div className="flex gap-3">
            <TextField
              fullWidth
              variant="standard"
              type="email"
              name="email"
              value={patientInfo.email || ""}
              label="Email"
              onChange={handleChange}
              helperText="Email required if you wish to send notificcations to your patients/clients."
            />

            <MuiTelInput
              fullWidth
              label="Contact number"
              name="contact_number"
              onChange={handlePhoneNumberChange}
              value={patientInfo.contact_number ?? ""}
              variant="standard"
              defaultCountry="ZA"
              onlyCountries={["ZA"]}
              disableDropdown={true}
              disableFormatting={true}
              helperText="Expected format: +27638654987"
            />
          </div>

          {guidanceMessage && (
            <div className="flex gap-4 items-center px-3 py-4 col-span-2 bg-yellow-300 mb-4 rounded-md">
              <FontAwesomeIcon icon="fa-solid fa-paperclip" size="lg" />{" "}
              <p>{guidanceMessage}</p>
            </div>
          )}

          <Button
            variant="contained"
            color="primary"
            fullWidth
            type="submit"
            disabled={Object.keys(patientInfo).length === 0}
          >
            Save
          </Button>
        </div>
      </form>

      {errorMessage && (
        <div className="mt-4  ">
          <DisplaySingleError errorMessage={errorMessage} />
        </div>
      )}
    </>
  );
}
