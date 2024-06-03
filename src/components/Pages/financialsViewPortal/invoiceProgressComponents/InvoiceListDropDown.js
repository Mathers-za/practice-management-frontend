import {
  useGlobalStore,
  usePatientPortalStore,
  usePaymentsPageStore,
} from "../../../../zustandStore/store";
import PaymentPage from "../../Payments/PaymentPage";
import MenuDivsWithIcon from "../../../miscellaneous components/MenuListDivsWithIcon";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import GenericTopBar from "../../../miscellaneous components/GenericTopBar";
import {
  handleInvoiceStatementGeneration,
  emailInvoiceStatement,
} from "../../../../InvoiceApiRequestFns/invoiceApiHelperFns";
import { useNavigate } from "react-router-dom";

export default function InvoiceListDropdown({
  querkyKeyToInvalidate,
  invoiceData,
  hideComponent,
}) {
  const {
    invoice_title,
    appointment_id,
    appointment_type_id,

    invoice_number,
    patient_id,
    amount_due,
  } = invoiceData;
  const setPatientIdForPatientPortal = usePatientPortalStore(
    (state) => state.setPatientId
  );
  const { globalProfileData } = useGlobalStore();
  const [showPaymentsPage, setShowPaymentsPage] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <div className="h-fit w-full text-base  ">
        <GenericTopBar
          label={invoice_title}
          className="text-base text-[#000000] p-[8px] bg-[#0EA5E9]"
          onclick={() => hideComponent()}
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
          disabled={parseFloat(amount_due) <= 0}
          onclick={() => setShowPaymentsPage(!showPaymentsPage)}
          text="Add payment"
          iconStart={
            <FontAwesomeIcon
              icon="fa-solid fa-coins"
              size="lg"
              style={{
                color: parseFloat(amount_due) <= 0 ? "#94A3B8" : "#0284C7",
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
            queryKeyToInvalidate={querkyKeyToInvalidate}
            hideComponent={() => setShowPaymentsPage(!showPaymentsPage)}
            appointmentId={appointment_id}
            appointmentTypeId={appointment_type_id}
          />
        </div>
      )}
    </>
  );
}
