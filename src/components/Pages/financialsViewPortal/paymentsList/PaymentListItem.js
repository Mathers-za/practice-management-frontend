import styles from "./paymentListItem.module.css";
import { format } from "date-fns";

export default function PaymentsListItem({ paymentData }) {
  const fullName =
    paymentData.patient_first_name + " " + paymentData?.patient_last_name || "";

  return (
    <>
      <div className={styles.container}>
        <div className={styles.content}>
          <div>$</div>
          <div>
            {fullName} paid R{paymentData.amount} on{" "}
            {format(paymentData.payment_date, "eee dd MMM yyyy")} via{" "}
            {paymentData.payment_method} paid R 350,00 on Mon 11 Mar 2024 via
            eft.
          </div>
        </div>
        <div className={styles["payment-amount"]}>
          <p>R{paymentData.amount}</p>
        </div>
      </div>
    </>
  );
}
