import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MenuDivsWithIcon from "../miscellaneous components/MenuListDivsWithIcon";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  useAppointmentPortalStore,
  useGlobalStore,
  usePatientPortalStore,
} from "../../zustandStore/store";
import { format } from "date-fns";
import { useEffect, useRef, useState } from "react";
import InvoicePortal from "../Pages/InvoicePage/InvoicePage";
import ICD10Table from "../Pages/ICD10/ICD10-Table";
import PaymentPage from "../Pages/Payments/PaymentPage";
import GenericTopBar from "../miscellaneous components/GenericTopBar";
import CreateTreatmentNote from "../Pages/PatientTreatmentNotes/CreateTreatmentNote";
import { useNavigate } from "react-router-dom";
import {
  useDeleteData,
  useFetchData,
  usePostData,
} from "../../CustomHooks/serverStateHooks";
import CustomAlertMessage from "../miscellaneous components/CustomAlertMessage";
import { useOnSubmitButtonTextstateManager } from "../../CustomHooks/otherHooks";
import ConfirmChoiceModal from "../miscellaneous components/ConfirmComponent";

export default function MainOptionsMenu({ hideComponent, refetchData }) {
  const navigate = useNavigate();
  const [showInvoicePage, setShowInvoicePage] = useState(false);
  const [showIcdCodeComponent, setShowIcdCodeComponent] = useState(false);
  const [showPaymentsPage, setShowPaymentsPage] = useState(false);
  const [showTreatmentNotePage, setShowTreatmentNotePage] = useState(false);
  const [showConfirmDeletionModal, setShowConfirmDeletionModal] =
    useState(false);
  const {
    globalPatientData,
    globalAppointmentTypeData,
    globalAppointmentData,
    setGlobalPatientData,
    globalProfileData,
  } = useGlobalStore();
  const setPatientPortalPatientId = usePatientPortalStore(
    (state) => state.setPatientId
  );
  const { data: financialData } = useFetchData(
    `/financials/view${globalAppointmentData.id}`,
    ["financialData", globalAppointmentData.id]
  );
  const { createMutation } = usePostData(
    `/emailNotifications/sendCancellationEmail`
  );
  const { deleteMutation } = useDeleteData(`/appointments/delete`);
  const [error, setError] = useState("");
  const {
    globalRefetchAppointmentList,
    flagToRefreshAppointmentList,
    setFlagToRefreshAppointmentList,
    setGlobalRefetchAppointmentList,
  } = useAppointmentPortalStore();
  const deleteButtonText = useOnSubmitButtonTextstateManager(
    "Delete",
    "...Deleting",
    deleteMutation
  );

  useEffect(() => {
    return () => {
      setGlobalPatientData("");
    };
  }, []);

  useEffect(() => {
    if (refetchData) {
      setGlobalRefetchAppointmentList(refetchData);
    }
  }, [refetchData]);

  async function handleAppointmentDelete() {
    try {
      await deleteMutation.mutateAsync(globalAppointmentData.id);

      setTimeout(() => {
        refetchData();
        hideComponent();
      }, 2500);
    } catch (error) {
      setError(error.message);
    }
  }

  function handleExit() {
    hideComponent();
    if (flagToRefreshAppointmentList) {
      globalRefetchAppointmentList();
      setFlagToRefreshAppointmentList(false);
    }
  }

  return (
    <>
      <div className=" h-fit min-w-full border-b relative bg-slate-600  border-slate-500">
        <div className="h-14 pl-4 pr-3 flex font-semibold items-center justify-between  bg-sky-500">
          <p>
            {globalPatientData.first_name +
              " " +
              globalPatientData?.last_name || ""}
            .
            {format(
              new Date(globalAppointmentData?.appointment_date),
              "eee dd MMM yyyy"
            )}
            Daniel Mathers follow up appointment with Dan at Dans practice
          </p>
          <IconButton onClick={handleExit}>
            <CloseIcon color="inherit" />
          </IconButton>
        </div>

        <MenuDivsWithIcon
          text="View patient"
          onclick={() => {
            setPatientPortalPatientId(globalPatientData.id);
            navigate("/patientPortal/clientInfo/patientContactDetails");
          }}
          iconStart={
            <FontAwesomeIcon
              icon="fa-regular fa-user"
              size="xl"
              color="#0284C7"
            />
          }
        />

        <MenuDivsWithIcon
          onclick={() => setShowIcdCodeComponent(!showIcdCodeComponent)}
          text="Manage codes"
          iconStart={
            <FontAwesomeIcon
              icon="fa-regular fa-file-lines"
              size="xl"
              style={{ color: "#0284C7" }}
            />
          }
          displayText="Manage codes"
        />

        <MenuDivsWithIcon
          onclick={() => setShowInvoicePage(!showInvoicePage)}
          iconStart={
            <FontAwesomeIcon
              icon="fa-regular fa-credit-card"
              size="lg"
              style={{ color: "#0284C7" }}
            />
          }
          text="Invoice"
        />

        <div>
          <MenuDivsWithIcon
            disabled={parseFloat(financialData?.amount_due) <= 0}
            onclick={() => setShowPaymentsPage(!showPaymentsPage)}
            iconStart={
              <FontAwesomeIcon
                icon="fa-solid fa-coins"
                size="lg"
                style={{
                  color:
                    parseFloat(financialData?.amount_due) <= 0
                      ? "#94A3B8"
                      : "#0284C7",
                }}
              />
            }
            text="Add payment"
          />
        </div>
        <div>
          <MenuDivsWithIcon
            iconStart={
              <FontAwesomeIcon
                icon="fa-solid fa-xmark"
                size="lg"
                style={{ color: "#0284C7" }}
              />
            }
            text="Cancel"
            onclick={() =>
              createMutation.mutate({
                profileId: globalProfileData.id,
                appointmentId: globalAppointmentData.id,
                patientId: globalPatientData.id,
              })
            }
          />
        </div>

        <div>
          <MenuDivsWithIcon
            onclick={() => setShowTreatmentNotePage(!showTreatmentNotePage)}
            text="Add note"
            iconStart={
              <FontAwesomeIcon
                icon="fa-regular fa-comment"
                size="lg"
                style={{ color: "#0284C7" }}
              />
            }
          />
        </div>

        <div>
          <MenuDivsWithIcon
            onclick={() => setShowConfirmDeletionModal(true)}
            iconStart={
              <FontAwesomeIcon
                icon="fa-solid fa-trash"
                size="lg"
                style={{ color: "#0284C7" }}
              />
            }
            text={deleteButtonText}
          />
        </div>
        {showPaymentsPage && (
          <div>
            <PaymentPage
              queryKeyToInvalidate={["financialData", globalAppointmentData.id]}
              hideComponent={() => setShowPaymentsPage(!showPaymentsPage)}
              appointmentId={globalAppointmentData.id}
              financialData={financialData}
            />
          </div>
        )}
        {showIcdCodeComponent && (
          <div className="fixed top-0 left-0 w-full h-screen z-10 flex items-center justify-center bg-black/30">
            <div className="max-h-fit w-2/4 bg-white">
              <GenericTopBar
                label="Manage codes"
                onclick={() => setShowIcdCodeComponent(!showIcdCodeComponent)}
              />
              <div className="mt-4">
                <ICD10Table
                  queryKeyToInvalidate={[
                    "financialData",
                    globalAppointmentData.id,
                  ]}
                  appointmentTypeId={globalAppointmentTypeData.id}
                  appointmentId={globalAppointmentData.id}
                />
              </div>
            </div>
          </div>
        )}
        {showInvoicePage && (
          <div>
            <InvoicePortal
              hideComponent={() => setShowInvoicePage(!showInvoicePage)}
              financialsData={financialData}
              queryKeyToInvalidate={["financialData", globalAppointmentData.id]}
              hideTree={hideComponent}
            />
          </div>
        )}

        {showTreatmentNotePage && (
          <div className="fixed top-0 left-0 z-20 w-full h-screen bg-white overflow-auto">
            <CreateTreatmentNote
              hideComponent={() =>
                setShowTreatmentNotePage(!showTreatmentNotePage)
              }
              patientId={globalPatientData.id}
            />
          </div>
        )}
        <CustomAlertMessage
          errorFlag={error}
          successFlag={deleteMutation.isSuccess}
          errorMessage={error}
          successMessage="Appointment Successfully deleted"
        />
      </div>
      <ConfirmChoiceModal
        hideComponent={() => setShowConfirmDeletionModal(false)}
        message="Are you sure you wish to delete this appointment?"
        onAccept={handleAppointmentDelete}
        onCancel={() => setShowConfirmDeletionModal(false)}
        showComponent={showConfirmDeletionModal}
      />
    </>
  );
}
