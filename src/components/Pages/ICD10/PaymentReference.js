import { format } from "date-fns";
import styles from "./paymentsReference.module.css";

export default function PaymentReference({ paymentsData }) {
  return (
    <>
      <div className={styles.card}>
        <div className={styles.left}>
          <div>Dustbin</div>
          <div className={styles.right}>
            <p>
              {format(new Date(paymentsData?.payment_date), "eee ee MMM yyyy")}{" "}
              via {paymentsData?.payment_method}
            </p>
            <p className={styles.reference}>
              {paymentsData?.payment_reference}
            </p>
          </div>
        </div>
        <p>{paymentsData?.amount}</p>
      </div>
    </>
  );
}
