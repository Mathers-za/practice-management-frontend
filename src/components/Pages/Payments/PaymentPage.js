import styles from "./paymentPage.module.css";
import { checkAndSetIcds } from "../../../apiRequests/apiRequests";

import { useEffect, useState } from "react";
import {
  useFetchData,
  usePostData,
} from "../../../CustomHooks/serverStateHooks";
import { format } from "date-fns";

function checkForErrors(paymentPayload, data) {
  const errors = [];

  for (const property in paymentPayload) {
    if (property === "amount") {
      if (parseFloat(paymentPayload[property]) > parseFloat(data?.amount_due)) {
        errors.push(
          "Please enter a valid amount that does not exceed amount due"
        );
        return errors;
      }

      if (paymentPayload[property].includes("-")) {
        errors.push("please enter a valid number");
        return errors;
      }

      if (paymentPayload[property].includes(".")) {
        const parts = paymentPayload[property].split(".");
        if (parts[1].trim().length > 2) {
          errors.push("invalid-greater than 2 decomals");
          return errors;
        }
      }
    }
  }
}

function cleanAmount(payload) {
  const cleanedAmount = payload.amount.replace(",", ".");
  return { ...payload, amount: cleanedAmount };
}

export default function PaymentPage({
  appointmentId,
  setShowPayment,
  appointmentTypeId,
}) {
  const { data, refetch } = useFetchData(
    `/financials/view${appointmentId}`,
    "financialsData"
  );

  const [paymentsPayload, setPaymentsPayload] = useState({
    amount: "0,00",
    payment_method: "Card",
    payment_reference: null,
    payment_date: format(new Date(), "yyyy-MM-dd"),
  });
  const [isErrors, setIsErrors] = useState(false);
  const [errors, setErrors] = useState([]);

  const { createMutation, isSuccess } = usePostData(
    `/payments/create${appointmentId}`
  );

  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    const runCheckAndSetIcds = async () => {
      await checkAndSetIcds(appointmentId, appointmentTypeId);
    };
    runCheckAndSetIcds();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setPaymentsPayload((prev) => ({
      ...prev,
      [name]: value === "" ? null : value,
    }));

    if (isChecked) {
      setPaymentsPayload((prev) => ({
        ...prev,
        amount: data?.amount_due,
      }));
    }
  }

  return (
    <>
      <div className={styles.overlay}>
        <div className={styles["top-nav"]}>
          <p>Payments</p>
          <p onClick={() => setShowPayment()}>Close</p>
        </div>
        <div className={styles["top-half"]}>
          <p className={styles.totals}>totals</p>
          <div>
            <input
              onChange={(event) => {
                setIsChecked(true);
                handleChange(event);
              }}
              value={data?.amount_due}
              type="checkbox"
              name="amount"
            />
            <label> Paid In Full</label>
          </div>
          <div>
            <p>Appointment Totall: {data?.total_amount}</p>
            <p>Discounts: {data?.discount}</p>
            <p>Payments: {data?.amount_paid}</p>
            <p>
              {" "}
              Amount outstanding:{" "}
              {data?.discount
                ? data?.amount_due - data?.discount
                : data?.amount_due}
            </p>
          </div>
        </div>
        <div className={styles["bottom-half"]}>
          <div className={styles["date-input-div"]}>
            {" "}
            <label htmlFor="date">Payment Date</label>
            {<br />}
            <input
              onChange={handleChange}
              className={styles["date-input"]}
              type="date"
              id="date"
              name="payment_date"
              value={paymentsPayload.payment_date || ""}
            />
          </div>
          <div>
            <label htmlFor="number">Payment Amount</label>
            <div className={styles.inputWrapper}>
              <div className={styles.prefix}> ZAR </div>
              <input
                required
                onChange={handleChange}
                className={styles.amount}
                type="number"
                id="number"
                name="amount"
                value={paymentsPayload?.amount || ""}
                disabled={isChecked}
              />
            </div>
          </div>
          <div>
            <label htmlFor="reference">Reference</label>
            <input
              name="payment_reference"
              onChange={handleChange}
              type="text"
              id="reference"
              value={paymentsPayload?.payment_reference || ""}
            />
          </div>
          <div>
            <label htmlFor="method">Payment Method</label>
            {<br />}
            <select
              onChange={handleChange}
              name="payment_method"
              value={paymentsPayload?.payment_method}
              id="method"
            >
              <option value="Card">Card</option>
              <option value="Cash">Cash</option>
              <option value="EFT">EFT</option>
              <option value="Medical Aid">Medical AId</option>
            </select>
          </div>
          <div className={styles["button-placement"]}>
            <button onClick={() => setShowPayment()}>Cancel</button>
            <button
              disabled={Object.keys(paymentsPayload).length === 0}
              onClick={async () => {
                const result = checkForErrors(paymentsPayload, data);
                if (result && result.length > 0) {
                  setErrors([...result]);
                  setIsErrors(true);
                  setPaymentsPayload((prev) => ({
                    ...prev,
                    amount: null,
                  }));
                  setTimeout(() => {
                    setErrors([]);
                  }, [2000]);
                } else {
                  if (errors.length === 0) {
                    const result = cleanAmount(paymentsPayload);
                    await createMutation.mutateAsync(result);
                    refetch();
                  }
                }
              }}
            >
              Add payment
            </button>
          </div>
        </div>
        {isErrors ? (
          <div className={styles["errorMessages-container"]}>
            <div className={styles.errorMessages}>{errors[0]}</div>
          </div>
        ) : null}
      </div>
    </>
  );
}
