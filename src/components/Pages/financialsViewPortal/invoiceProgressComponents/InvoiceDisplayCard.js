import styles from "./invoiceCard.module.css";
import { formatDateYearMonthDay } from "./progressUtilFunctions";

export default function InvoiceDisplayCard({ invoiceData }) {
  const {
    amount_due,
    amount_paid,
    total_amount,
    invoice_number,
    invoice_start_date,
    invoice_end_date,
    invoice_title,
  } = invoiceData;

  return (
    <>
      <div className={styles["card-container"]}>
        <div className={styles.left}>
          <div className={styles["dropdown-elipsis"]}>:</div>
          <div className={styles.middleContent}>
            <p>
              {invoice_title}
              <span className={styles.invNum}>{invoice_number}</span>
            </p>
            <p>
              Date: {formatDateYearMonthDay(invoice_start_date)}/Due:{" "}
              {formatDateYearMonthDay(invoice_end_date)}
            </p>
            <div className={styles.amountsContent}>
              <p>Total: R{total_amount}</p> <p>Paid: R{amount_paid}</p>
            </div>
          </div>
        </div>
        <div className={styles.amountDue}>Due: R{amount_due} </div>
      </div>
    </>
  );
}
