import {
  useAppointmentPortalStore,
  useGlobalStore,
  usePatientPortalStore,
} from "../../../../zustandStore/store";
import PaymentPage from "../../Payments/PaymentPage";
import MenuDivsWithIcon from "../../../miscellaneous components/MenuListDivsWithIcon";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import GenericTopBar from "../../../miscellaneous components/GenericTopBar";
import {
  handleInvoiceStatementGeneration,
  emailInvoiceStatement,
} from "../../../../InvoiceApiRequestFns/invoiceApiHelperFns";
import { useNavigate } from "react-router-dom";
import { useFetchData } from "../../../../CustomHooks/serverStateHooks";

import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import UpdatePatientContactDetails from "../../../Create and update Patient component/UpdatePatientContactDetails";

export default function InvoiceListDropdown({
  invoiceData,
  hideComponent,
  refetch,
}) {
  //TODO patch sent when sent to medical aid or send to patient is clicked
  const { invoice_title, appointment_id, email, invoice_number, patient_id } =
    invoiceData;
  const setPatientIdForPatientPortal = usePatientPortalStore(
    (state) => state.setPatientId
  );

  const [showUpdatePatientPage, setShowUpdatePatientPage] = useState(false);

  const { data: financialData } = useFetchData(
    `/financials/view${appointment_id}`,
    ["financialData", "page:InvoiceDropDown", appointment_id]
  );
  const {
    globalRefetchAppointmentList,
    flagToRefreshAppointmentList,
    setGlobalRefetchAppointmentList,
    setFlagToRefreshAppointmentList,
  } = useAppointmentPortalStore();
  const { globalProfileData, globalPatientData, setGlobalPatientData } =
    useGlobalStore();
  const [showPaymentsPage, setShowPaymentsPage] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (refetch) {
      setFlagToRefreshAppointmentList(false);
      setGlobalRefetchAppointmentList(refetch);
      setGlobalPatientData({ email: email });
    }

    return () => {
      if (flagToRefreshAppointmentList) {
        globalRefetchAppointmentList();
        console.log("fired cleanup fucntion ijn invoice dropdown list");
      }
      setGlobalPatientData("");
    };
  }, [refetch]);

  return (
    <>
      <div className="h-fit w-full text-base  ">
        <GenericTopBar
          label={invoice_title}
          className="text-base text-[#000000] p-[8px] bg-[#0EA5E9]"
          onclick={hideComponent}
        />
        <MenuDivsWithIcon
          onclick={() => {
            setPatientIdForPatientPortal(patient_id);
            navigate("/patientPortal/clientInfo/patientContactDetails");
          }}
          text="View client"
          iconStart={
            <FontAwesomeIcon
              icon="fa-solid fa-user"
              size="lg"
              style={{ color: "#0284C7" }}
            />
          }
        />
        <MenuDivsWithIcon
          disabled={parseFloat(financialData?.amount_due) <= 0}
          onclick={() => setShowPaymentsPage(!showPaymentsPage)}
          text="Add payment"
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
        />
        <div className="relative">
          <MenuDivsWithIcon
            customClassName=" py-[10px] "
            disabled={!globalPatientData.email}
            onclick={async () =>
              await emailInvoiceStatement(
                globalProfileData.id,
                appointment_id,
                patient_id
              )
            }
            text={
              <>
                <div className="text-start p-0">
                  <p>Send to Client</p>{" "}
                  <p className="text-xs">
                    {globalPatientData.email
                      ? `Patient Email: ${globalPatientData.email}`
                      : "No Patient email. Add one in order to send"}
                  </p>
                </div>
              </>
            }
            iconStart={
              <FontAwesomeIcon
                icon="fa-solid fa-paper-plane"
                size="lg"
                style={{ color: "#0284C7" }}
              />
            }
          />
          <div className="absolute right-8 top-3">
            {" "}
            <IconButton
              onClick={() => setShowUpdatePatientPage(!showUpdatePatientPage)}
            >
              <EditIcon />
            </IconButton>
          </div>
        </div>

        <MenuDivsWithIcon
          text="Send to Medical Aid"
          iconStart={
            <FontAwesomeIcon
              icon="fa-regular fa-paper-plane"
              size="lg"
              style={{ color: "#0284C7" }}
            />
          }
        />
        <MenuDivsWithIcon
          text="View invoice"
          onclick={async () =>
            await handleInvoiceStatementGeneration(
              invoice_number,
              appointment_id,
              patient_id,
              globalProfileData.id
            )
          }
          iconStart={
            <FontAwesomeIcon
              icon="fa-solid fa-envelope-open-text"
              size="lg"
              style={{ color: "#0284C7" }}
            />
          }
        />
        <MenuDivsWithIcon
          text="Delete"
          iconStart={
            <FontAwesomeIcon
              icon="fa-solid fa-trash"
              size="lg"
              style={{ color: "#0284C7" }}
            />
          }
        />
      </div>

      {showPaymentsPage && (
        <div className="z-20">
          <PaymentPage
            financialData={financialData}
            queryKeyToInvalidate={[
              "financialData",
              "page:InvoiceDropDown",
              appointment_id,
            ]}
            hideComponent={() => setShowPaymentsPage(!showPaymentsPage)}
            appointmentId={appointment_id}
          />
        </div>
      )}

      {showUpdatePatientPage && (
        <div className="fixed top-0 left-0 w-full h-screen flex justify-center items-center bg-black/30 z-20">
          <div className="w-3/4">
            <UpdatePatientContactDetails
              hideComponent={() =>
                setShowUpdatePatientPage(!showUpdatePatientPage)
              }
              showTopBar={{
                show: true,
                label: "Update Patient Contact Details",
                showCloseOption: true,
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
