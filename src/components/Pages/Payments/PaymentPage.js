import styles from "./paymentPage.module.css";
import { checkAndSetIcds } from "../../../apiRequests/apiRequests";

import { useEffect, useState } from "react";
import {
  useFetchData,
  usePostData,
} from "../../../CustomHooks/serverStateHooks";
import { format } from "date-fns";
import { usePaymentsPageStore } from "../../../zustandStore/store";
import GenericTopBar from "../../miscellaneous components/GenericTopBar";

function checkForErrors(paymentPayload, data) {
  const errors = [];

  for (const property in paymentPayload) {
    if (property === "amount" && paymentPayload[property] !== null) {
      if (parseFloat(paymentPayload[property]) > parseFloat(data?.amount_due)) {
        errors.push(
          "Please enter a valid amount that does not exceed amount due"
        );
        return errors;
      }
    }

    if (
      paymentPayload[property] !== null &&
      property !== "payment_date" &&
      paymentPayload[property].includes("-")
    ) {
      errors.push("please enter a valid number");
      return errors;
    }

    if (
      paymentPayload[property] !== null &&
      paymentPayload[property].includes(".")
    ) {
      const parts = paymentPayload[property].split(".");
      if (parts[1].trim().length > 2) {
        errors.push("invalid-greater than 2 decomals");
        return errors;
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
  appointmentTypeId,
  hideComponent,
}) {
  const { data, refetch } = useFetchData(
    `/financials/view${appointmentId}`,
    "financialsData"
  );

  const togglePaymentsPage = usePaymentsPageStore(
    (state) => state.toggleUniquePaymentsPage
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
      <div className={styles["paymentPage-overlay"]}>
        <GenericTopBar onclick={hideComponent} label="Payments" />
        <div className={styles["paymentPage-top-half"]}>
          <p className={styles["paymentPage-totals"]}>totals</p>
          <div>
            <input
              disabled={parseFloat(data?.amount_due) <= 0}
              onChange={(event) => {
                handleChange(event);
              }}
              value={data?.amount_due}
              type="checkbox"
              name="amount"
            />
            <label> Paid In Full</label>
          </div>
          <div>
            <p>Appointment Total: R{data?.total_amount}</p>
            <p>Discounts: R{data?.discount}</p>
            <p>Payments: R{data?.amount_paid}</p>
            <p>Amount outstanding: R {data?.amount_due}</p>
          </div>
        </div>
        <div className={styles["paymentPage-bottom-half"]}>
          <div className={styles["paymentPage-date-input-div"]}>
            {" "}
            <label htmlFor="date">Payment Date</label>
            {<br />}
            <input
              onChange={handleChange}
              className={styles["paymentPage-date-input"]}
              type="date"
              id="date"
              name="payment_date"
              value={paymentsPayload.payment_date || ""}
            />
          </div>
          <div>
            <label htmlFor="number">Payment Amount</label>
            <div className={styles["paymentPage-inputWrapper"]}>
              <div className={styles["paymentPage-prefix"]}> ZAR </div>
              <input
                required
                onChange={handleChange}
                className={styles["paymentPage-amount"]}
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
          <div className={styles["paymentPage-button-placement"]}>
            <button onClick={() => togglePaymentsPage(appointmentId)}>
              Cancel
            </button>
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
          <div className={styles["paymentPage-errorMessages-container"]}>
            <div className={styles["paymentPage-errorMessages"]}>
              {errors[0]}
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}
