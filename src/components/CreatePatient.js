import { useState } from "react";
import { usePostData } from "../CustomHooks/serverStateHooks";
import TextInput from "./textInput";
import Input from "./miscellaneous components/DisplayTextInput";
import SubmitButton from "./miscellaneous components/SubmitButton";
import GenericTopBar from "./miscellaneous components/GenericTopBar";
import FullWithButton from "./miscellaneous components/FullWidthButton";

export default function CreatePatient({ profileId, hideComponent }) {
  const { handlePost } = usePostData(`/patients/create${profileId}`);
  const [patientInfo, setPatientInfo] = useState({});

  function handleChange(event) {
    const { name, value } = event.target;

    setPatientInfo((prev) => ({
      ...prev,
      [name]: value === "" ? null : value,
    }));
  }

  return (
    <>
      <GenericTopBar label="Create a patient" onclick={hideComponent} />
      <form
        className="grid grid-cols-2 gap-x-3 mt-4"
        onSubmit={(event) => {
          event.preventDefault();
          handlePost(patientInfo);
          setPatientInfo({});
        }}
      >
        <Input
          type="text"
          name="first_name"
          value={patientInfo.first_name || ""}
          labelText="First Name"
          onchange={handleChange}
          required={true}
          bottomInfo="Patients First name is a required field"
          placeholder="First Name"
        />
        <Input
          type="text"
          name="last_name"
          value={patientInfo.last_name || ""}
          labelText="Last Name"
          onchange={handleChange}
          placeholder="Last name"
          bottomInfo="The patients last name"
        />
        <Input
          type="email"
          name="email"
          value={patientInfo.email || ""}
          labelText="Email"
          onchange={handleChange}
          placeholder="Email"
          bottomInfo="Email required if you wish to send notificcations to your patients/clients."
        />
        <Input
          type="tel"
          name="contact_number"
          value={patientInfo.contact_number ?? ""}
          labelText="Contact number"
          onchange={handleChange}
          pattern="^\+27\d{9}$"
          placeholder="Phone number"
          bottomInfo="Valid phone number expected eg: +27825385432"
        />
        <div className="col-span-2 ">
          <FullWithButton
            contentText="Save"
            disabled={Object.keys(patientInfo).length === 0}
          />
        </div>
      </form>
    </>
  );
}
