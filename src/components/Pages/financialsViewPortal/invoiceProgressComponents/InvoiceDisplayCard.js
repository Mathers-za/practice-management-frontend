import styles from "./invoiceCard.module.css";

export default function InvoiceDisplayCard() {
  return (
    <>
      <div className={styles["card-container"]}>
        <div className={styles.left}>
          <div className={styles["dropdown-elipsis"]}>:</div>
          <div className={styles.middleContent}>
            <p>
              Daniel Mathers - 2024-07-07
              <span className={styles.invNum}>Invoice number</span>
            </p>
            <p> 2024-02-13/2024-05-04 </p>
            <div className={styles.amountsContent}>
              <p>amount paid</p> <p>amount due </p>
            </div>
          </div>
        </div>
        <div className={styles.amountDue}>amount due</div>
      </div>
    </>
  );
}
