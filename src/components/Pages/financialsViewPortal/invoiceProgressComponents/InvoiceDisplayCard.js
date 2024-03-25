import styles from "./invoiceCard.module.css";
import { formatDateYearMonthDay } from "./progressUtilFunctions";
import InvoiceListDropdown from "./InvoiceListDropDown";
import { useState } from "react";

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

  const [showDropDown, setShowDropDown] = useState(false);

  function toggleDropdown() {
    setShowDropDown(!showDropDown);
  }

  return (
    <>
      <div className={styles["invoiceCard-container"]}>
        <div className={styles["invoiceCard-left"]}>
          <div
            onClick={() => setShowDropDown(!showDropDown)}
            className={styles["invoiceCard-dropdown-elipsis"]}
          >
            :
          </div>
          {showDropDown && (
            <InvoiceListDropdown
              toggleDropdown={toggleDropdown}
              invoiceData={invoiceData}
            />
          )}
          <div className={styles["invoiceCard-middleContent"]}>
            <p>
              {invoice_title}
              <span className={styles["invoiceCard-invNum"]}>
                {invoice_number}
              </span>
            </p>
            <p>
              Date: {formatDateYearMonthDay(invoice_start_date)}/Due:{" "}
              {formatDateYearMonthDay(invoice_end_date)}
            </p>
            <div className={styles["invoiceCard-amountsContent"]}>
              <p>Total: R{total_amount}</p> <p>Paid: R{amount_paid}</p>
            </div>
          </div>
        </div>
        <div className={styles["invoiceCard-amountDue"]}>
          Due: R{amount_due}{" "}
        </div>
      </div>
    </>
  );
}
