import styles from "./invoiceDropdown.module.css";
import { usePaymentsPageStore } from "../../../../zustandStore/store";
import PaymentPage from "../../Payments/PaymentPage";

export default function InvoiceListDropdown({ toggleDropdown, invoiceData }) {
  const { invoice_title, appointment_id, appointment_type_id, invoice_id } =
    invoiceData;
  const togglePaymentsPageDisplay = usePaymentsPageStore(
    (state) => state.toggleUniquePaymentsPage
  );
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
      <div className={styles["invDropdown-overlay"]}>
        <div className={styles["invDropdown-dropDownCard"]}>
          <div className={styles["invDropdown-title"]}>
            <p>{invoice_title}</p>{" "}
            <div className={styles["invDropdown-right-header-content"]}>
              <p>Paid</p> <p onClick={() => toggleDropdown()}>X</p>
            </div>
          </div>
          <div className={styles["invDropdown-row"]}>
            {" "}
            <p>View</p>{" "}
          </div>
          <div className={styles["invDropdown-row"]}>
            {" "}
            <p>Send</p>{" "}
          </div>
          <div className={styles["invDropdown-row"]}>
            {" "}
            <p>Send to Medical Aid</p>{" "}
          </div>
          <div className={styles["invDropdown-row"]}>
            <p>Delete</p>
          </div>
          <div
            onClick={() => {
              togglePaymentsPageDisplay(appointment_id);
            }}
            className={styles["invDropdown-row"]}
          >
            {" "}
            <p>Add a payment</p>{" "}
          </div>
          <div className={styles["invDropdown-row"]}>
            {" "}
            <p>Mark as Paid</p>{" "}
          </div>
        </div>
      </div>
    </>
  );
}
