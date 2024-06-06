import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useState } from "react";
import UpdatePatientContactDetails from "../Create and update Patient component/UpdatePatientContactDetails";

export default function SendInvoiceToPatientContent({
  textContent,
  textCustomCss,
  patientEmail,
}) {
  const [showUpdatePatientPage, setShowUpdatePatientPage] = useState(false);

  return (
    <>
      <div className="flex items-center gap-5">
        <div className="flex flex-col text-start">
          <p className="m-0 p-0">{textContent}</p>

          <p className="text-xs m-0">
            {patientEmail
              ? `Patient Email: ${patientEmail}`
              : "Patient has no email"}
          </p>
        </div>
        <div>
          <IconButton
            disabled={false}
            size="small"
            onClick={() => {
              setShowUpdatePatientPage(!showUpdatePatientPage);
              console.log("fired");
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </div>
      </div>
      {showUpdatePatientPage && (
        <div className="fixed left-0 top-0 w-full bg-black/30 h-screen z-20 justify-center items-center">
          <UpdatePatientContactDetails
            hideComponent={() =>
              setShowUpdatePatientPage(!showUpdatePatientPage)
            }
            showTopBar={{
              label: "Patient Contact Derails",
              show: true,
              showCloseOption: true,
            }}
          />
        </div>
      )}
    </>
  );
}
