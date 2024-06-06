import {
  useAppointmentPortalStore,
  useGlobalStore,
  usePatientPortalStore,
  usePaymentsPageStore,
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

export default function InvoiceListDropdown({
  invoiceData,
  hideComponent,
  refetch,
}) {
  //TODO patch sent when sent to medical aid or send to patient is clicked
  const {
    invoice_title,
    appointment_id,

    invoice_number,
    patient_id,
  } = invoiceData;
  const setPatientIdForPatientPortal = usePatientPortalStore(
    (state) => state.setPatientId
  );

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
  const { globalProfileData } = useGlobalStore();
  const [showPaymentsPage, setShowPaymentsPage] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (refetch) {
      setFlagToRefreshAppointmentList(false);
      setGlobalRefetchAppointmentList(refetch);
    }

    return () => {
      if (flagToRefreshAppointmentList) {
        globalRefetchAppointmentList();
        console.log("fired cleanup fucntion ijn invoice dropdown list");
      }
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
        <MenuDivsWithIcon
          onclick={async () =>
            await emailInvoiceStatement(
              globalProfileData.id,
              appointment_id,
              patient_id
            )
          }
          text="Send to client"
          iconStart={
            <FontAwesomeIcon
              icon="fa-solid fa-paper-plane"
              size="lg"
              style={{ color: "#0284C7" }}
            />
          }
        />
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
    </>
  );
}
