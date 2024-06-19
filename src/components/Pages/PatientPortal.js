import { Link, Outlet, useNavigate } from "react-router-dom";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import { usePatientPortalStore } from "../../zustandStore/store";
import CustomLinearProgressBar from "../miscellaneous components/CustomLinearProgressBar";
import { Button, IconButton } from "@mui/material";
import { useRef, useState } from "react";
import DeletePopMessageForPatientsPortal from "../miscellaneous components/DeletePopUpForPatientsPortal";
import {
  useDeleteData,
  useDeleteDataWithParams,
} from "../../CustomHooks/serverStateHooks";
import CustomAlertMessage from "../miscellaneous components/CustomAlertMessage";

export default function PatientPortal() {
  const deletionQueryParams = useRef();
  const {
    appointmentTabLoadingState,
    invoiceTabLoadingState,
    treatmentNotesTabLoadingState,
  } = usePatientPortalStore();
  const [showOptions, setShowOptions] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { patientId } = usePatientPortalStore();
  const { deleteMutation } = useDeleteDataWithParams(
    "/patients/delete",
    "listOfPatients"
  );

  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleDeletePatient(optionsObj) {
    try {
      deletionQueryParams.current = optionsObj;
      console.log("optins obj is " + JSON.stringify(optionsObj));

      await deleteMutation.mutateAsync({
        id: optionsObj.patient_id,
        params: optionsObj,
      });
      setTimeout(() => {
        navigate("/patient/search");
      }, 2500);
    } catch (error) {
      setError(error.message);
    }
  }
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
          <CustomAlertMessage
            errorFlag={error}
            successFlag={deleteMutation.isSuccess}
            errorMessage={error}
            successMessage="Successfully deleted patient"
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
                  onClick={() => setShowDeleteModal(!showDeleteModal)}
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
            <DeletePopMessageForPatientsPortal
              showComponent={showDeleteModal}
              hideComponent={() => setShowDeleteModal(!showDeleteModal)}
              onCancel={() => setShowDeleteModal(!showDeleteModal)}
              onConfirm={handleDeletePatient}
              patient_id={patientId}
            />
          </div>
        </div>

        <div className=" w-full min-full bg-white overflow-auto">
          <Outlet />
        </div>
      </div>
    </>
  );
}
