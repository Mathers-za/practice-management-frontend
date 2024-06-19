import { Link, Outlet } from "react-router-dom";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import { usePatientPortalStore } from "../../zustandStore/store";
import CustomLinearProgressBar from "../miscellaneous components/CustomLinearProgressBar";
import { Button, IconButton } from "@mui/material";
import { useState } from "react";

export default function PatientPortal() {
  const {
    appointmentTabLoadingState,
    invoiceTabLoadingState,
    treatmentNotesTabLoadingState,
  } = usePatientPortalStore();
  const [showOptions, setShowOptions] = useState(false);
  return (
    <>
      <div className="relative ">
        <div className=" text-black font-semibold h-16 w-full relative flex justify-evenly items-center bg-teal-500">
          <Link to="clientInfo">Client Information</Link>
          <Link to="treatmentNotes"> Treatment Notes</Link>
          <Link to={"patientAppointments"}>Appointments</Link>
          <Link to={"patientInvoices"}>Invoices</Link>
          <CustomLinearProgressBar
            isLoading={
              invoiceTabLoadingState ||
              treatmentNotesTabLoadingState ||
              appointmentTabLoadingState
            }
            className="-bottom-1 absolute left-0 w-full"
          />
          <div className="absolute left-0 top-0">
            <div className=" flex items-center">
              <IconButton
                size="small"
                onClick={() => setShowOptions(!showOptions)}
              >
                <MoreVertIcon fontSize="small" />
              </IconButton>
              {showOptions && (
                <Button
                  size="small"
                  sx={{
                    fontSize: "10px",
                    paddingX: "5px",
                    textAlign: "center",

                    paddingBottom: "0px",

                    display: "flex",
                    verticalAlign: "center",
                  }}
                  color="error"
                  variant="contained"
                >
                  Delete Patient
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className=" w-full min-full bg-white overflow-auto">
          <Outlet />
        </div>
      </div>
    </>
  );
}
