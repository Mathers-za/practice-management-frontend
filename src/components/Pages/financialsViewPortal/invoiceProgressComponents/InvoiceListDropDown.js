import styles from "./invoiceDropdown.module.css";
import { usePaymentsPageStore } from "../../../../zustandStore/store";
import PaymentPage from "../../Payments/PaymentPage";
import MenuDivsWithIcon from "../../../miscellaneous components/MenuListDivsWithIcon";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import GenericTopBar from "../../../miscellaneous components/GenericTopBar";

export default function InvoiceListDropdown({
  toggleDropdown,
  invoiceData,
  hideComponent,
}) {
  const { invoice_title, appointment_id, appointment_type_id, invoice_id } =
    invoiceData;
  const togglePaymentsPageDisplay = usePaymentsPageStore(
    (state) => state.toggleUniquePaymentsPage
  );
  const [showPaymentsPage, setShowPaymentsPage] = useState(false);
  const paymentPageVisible = usePaymentsPageStore(
    (state) => state.paymentsPageDropDownStates
  );
  const visibilty = paymentPageVisible[appointment_id];

  return (
    <>
      {visibilty && (
        <PaymentPage
          appointmentId={appointment_id}
          appointmentTypeId={appointment_type_id}
        />
      )}

      <div className="h-fit w-full text-base  ">
        <GenericTopBar
          label={invoice_title}
          className="text-base text-[#000000] p-[8px] bg-[#0EA5E9]"
          onclick={() => hideComponent()}
        />
        <MenuDivsWithIcon
          onclick={() => setShowPaymentsPage(!showPaymentsPage)}
          text="Add payment"
          iconStart={
            <FontAwesomeIcon
              icon="fa-solid fa-coins"
              size="lg"
              style={{
                color: "#0284C7",
              }}
            />
          }
        />
        <MenuDivsWithIcon
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
            hideComponent={() => setShowPaymentsPage(!showPaymentsPage)}
            appointmentId={appointment_id}
            appointmentTypeId={appointment_type_id}
          />
        </div>
      )}
    </>
  );
}
