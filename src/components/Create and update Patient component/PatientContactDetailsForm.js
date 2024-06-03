import GenericTopBar from "../miscellaneous components/GenericTopBar";

import DisplaySingleError from "../miscellaneous components/WarningMessage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, TextField } from "@mui/material";

export default function PatientContactDetailsForm({
  disabled = false,
  handleSubmit,
  hideComponent = false,
  handleChange,
  patientInfo,
  errorMessage,
  guidanceMessage = false,
  showTopBar = {
    label: "",
    show: false,
    onclick: "",
    showCloseOption: "",
    className: "",
    labeTextClassName: "text-white",
  },
}) {
  return (
    <>
      <form
        className="bg-white rounded-sm shadow-md shadow-black/30 "
        onSubmit={handleSubmit}
      >
        {showTopBar.show && (
          <GenericTopBar
            className={showTopBar.className}
            showCloseOption={showTopBar.showCloseOption}
            label={showTopBar.label}
            onclick={hideComponent ? hideComponent : null}
            labelTextClassName={showTopBar.labeTextClassName}
          />
        )}
        <div className="p-3 space-y-6 ">
          <div className="flex gap-3 ">
            <TextField
              fullWidth
              variant="standard"
              type="text"
              name="first_name"
              value={patientInfo?.first_name || ""}
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
              value={patientInfo?.last_name || ""}
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
              value={patientInfo?.email || ""}
              label="Email"
              onChange={handleChange}
              helperText="Email required if you wish to send notificcations to your patients/clients."
            />

            <TextField
              variant="standard"
              name="contact_number"
              type="number"
              helperText="A valid phone number ie +2771654378"
              onChange={handleChange}
              fullWidth
              label="Contact number"
              value={patientInfo?.contact_number || ""}
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
            disabled={disabled}
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
