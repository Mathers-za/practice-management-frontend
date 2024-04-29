import { useEffect, useState } from "react";
import { usePostData } from "../CustomHooks/serverStateHooks";
import TextInput from "./textInput";
import Input from "./miscellaneous components/DisplayTextInput";
import SubmitButton from "./miscellaneous components/SubmitButton";
import GenericTopBar from "./miscellaneous components/GenericTopBar";
import FullWithButton from "./miscellaneous components/FullWidthButton";
import DisplaySingleError from "./miscellaneous components/WarningMessage";
import { createPatientValidationSchema } from "../form validation Schemas/validationSchemas";
import { patientCreationGuidance } from "../userGuidanceFunctions/createPatientFns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
      <GenericTopBar label="Create a patient" onclick={hideComponent} />
      <form
        className="grid grid-cols-2 gap-x-3 gap-y-5 mt-4"
        onSubmit={handleSubmit}
      >
        <Input
          type="text"
          name="first_name"
          value={patientInfo.first_name || ""}
          labelText="First Name"
          onchange={handleChange}
          staticBottomInfo={"Required field"}
          placeholder="First Name"
          required={false}
        />
        <Input
          type="text"
          name="last_name"
          value={patientInfo.last_name || ""}
          labelText="Last Name"
          onchange={handleChange}
          placeholder="Last name"
          staticBottomInfo="The patients last name. Optional but recommended"
        />
        <Input
          type="email"
          name="email"
          value={patientInfo.email || ""}
          labelText="Email"
          onchange={handleChange}
          placeholder="Email"
          staticBottomInfo="Email required if you wish to send notificcations to your patients/clients."
        />
        <Input
          type="tel"
          name="contact_number"
          value={patientInfo.contact_number ?? ""}
          labelText="Contact number"
          onchange={handleChange}
          pattern="^\+27\d{9}$"
          placeholder="Phone number"
          staticBottomInfo="Valid phone number expected eg: +27825385432"
        />

        <div className="col-span-2 mt-3 ">
          {guidanceMessage && (
            <div className="flex gap-4 items-center px-3 py-4 col-span-2 bg-yellow-300 mb-4 rounded-md">
              <FontAwesomeIcon icon="fa-solid fa-paperclip" size="lg" />{" "}
              <p>{guidanceMessage}</p>
            </div>
          )}

          <FullWithButton
            contentText="Save"
            disabled={Object.keys(patientInfo).length === 0}
          />
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
