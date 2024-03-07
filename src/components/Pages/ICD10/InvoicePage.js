import { useLocation } from "react-router-dom";
import ICD10Table from "./ICD10-Table";
import { useEffect, useState } from "react";
import styles from "./invoicePage.module.css";
import { checkAndSetIcds } from "../../../apiRequests/apiRequests";
import {
  useFetchData,
  usePatchData,
  usePostData,
} from "../../../CustomHooks/serverStateHooks";
import PaymentPage from "../Payments/PaymentPage";
import { usePaymentsPageStore } from "../../../zustandStore/store";
import PaymentReference from "./PaymentReference";

function invoiceCreationValidation(payloadData, financialData) {
  const invoiceErrors = [];

  for (const key in payloadData) {
    if (key === "discount") {
      if (
        parseFloat(payloadData?.discount) >
        parseFloat(financialData?.amount_due)
      ) {
        invoiceErrors.push("Discount Cananot exceed amount due");
        return invoiceErrors;
      }

      if (payloadData?.discount.includes("-")) {
        invoiceErrors.push("Please enter a valid discount amount");
      }

      if (key === "amount_total") {
        if (
          parseFloat(payloadData?.amount_due) >
          parseFloat(financialData?.amount_paid)
        ) {
          invoiceErrors(
            "The new amount cannot be less than the amount already paid"
          );
          return invoiceErrors;
        }
        if (payloadData?.total_amount.includes("-")) {
          invoiceErrors.push("Please enter a valid appointment total value");
          return invoiceErrors;
        }
      }
    }
  }
}

export default function InvoicePortal() {
  //validation functuion has been made. make sur eyou having mathcing sttae names
  const location = useLocation();
  const { state } = location;
  const [drop, setDrop] = useState(new Array(2).fill(false));
  const { data: financialsData, refetch } = useFetchData(
    `/financials/view${state.appointmentId}`,
    "financialsDataInInvoicePage"
  );
  const { patchMutation } = usePatchData(
    `/financials/update${state.appointmentId}`
  );
  const [changes, setChanges] = useState({});
  const [isErrors, setIsErrors] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const { data: paymentsData } = useFetchData(
    `/payments/view${state.appointmentId}`
  );

  const togglePaymentsPage = usePaymentsPageStore(
    (state) => state.toggleUniquePaymentsPage
  );
  const visibilty = usePaymentsPageStore(
    (state) => state.paymentsPageDropDownStates
  );
  const paymentsPageVisibilty = visibilty[state.appointmentId];

  const [mutableFinancialsData, setMutableFinancialsData] = useState({});

  useEffect(() => {
    if (state) {
      checkAndSetIcds(state.appointmentId, state.appointmentTypeId);
    }
  }, [state]);

  useEffect(() => {
    if (financialsData) {
      setMutableFinancialsData(() => ({
        total_amount: financialsData?.total_amount,
        discount: financialsData?.discount,
      }));
    }
  }, [financialsData]);

  function handleChange(event) {
    const { name, value } = event.target;

    setMutableFinancialsData((prev) => ({
      ...prev,
      [name]: value === "" ? null : value,
    }));

    setChanges((prev) => ({
      ...prev,
      [name]: value === "" ? null : value,
    }));
  }

  function handleShow(index) {
    setDrop((prev) => {
      const newState = [...prev];
      newState[index] = !drop[index];
      return newState;
    });
  }

  return (
    <>
      <div className={styles.component}>
        <div className={styles["nav-top"]}>
          <div>Patients details</div>
          <div>Close</div>
        </div>
        <div className={styles.top}>
          <div>
            Appointment Price <br />
            <input
              onBlur={async () => {
                const errors = invoiceCreationValidation(
                  changes,
                  financialsData
                );
                if (errors.length > 0) {
                  setIsErrors(true);
                  setErrorMessage(errors[0]);
                } else {
                  await patchMutation.mutateAsync(changes);
                  refetch();
                }
              }}
              onChange={handleChange}
              disabled={financialsData?.source_icd}
              type="number"
              name="total_amount"
              value={mutableFinancialsData?.total_amount}
            />
          </div>
          <div>
            Discount <br />
            <input
              disabled={parseFloat(financialsData?.amount_due) <= 0.0}
              onBlur={async () => {
                const errors = invoiceCreationValidation(
                  changes,
                  financialsData
                );
                if (errors && errors.length > 0) {
                  setIsErrors(true);
                  setErrorMessage(errors[0]);
                } else {
                  await patchMutation.mutateAsync(changes);
                  refetch();
                }
              }}
              name="discount"
              onChange={handleChange}
              type="number"
              value={mutableFinancialsData?.discount || ""}
            />
          </div>
        </div>
        <div className={styles["bottom-menu"]}>
          <div className={styles.row} onClick={() => handleShow(0)}>
            Medical Aid Coding
          </div>
          <div className={drop[0] ? styles.show : styles.hide}>
            <ICD10Table
              appointmentId={state?.appointmentId}
              appointmentTypeId={state?.appointmentTypeId}
              financialsDataRefetch={() => refetch()}
            />
          </div>
          <div className={styles.row} onClick={() => handleShow(1)}>
            Invoices{" "}
          </div>
          <div className={drop[1] ? styles.show : styles.hide}>content 2</div>
          <div className={styles.row} onClick={() => handleShow(2)}>
            Payments
          </div>
          <div className={drop[2] ? styles.show : styles.hide}>
            {paymentsData &&
              paymentsData.map((payment) => (
                <>
                  <div>
                    <PaymentReference paymentsData={payment} />
                  </div>
                </>
              ))}

            <div className={styles.addPaymentButtonPositioning}>
              <button
                className={styles.addPaymentBtn}
                onClick={() => togglePaymentsPage(state.appointmentId)}
              >
                Add Payment
              </button>
            </div>

            {paymentsPageVisibilty && (
              <PaymentPage
                appointmentId={state.appointmentId}
                appointmentTypeId={state.appointmentTypeId}
              />
            )}
          </div>

          <div className={`${styles.amounts} ${styles.row}`}>
            {" "}
            Appointment Price <br /> R{financialsData?.total_amount}
          </div>
          <div className={`${styles.amounts} ${styles.row}`}>
            Payments <br /> R{financialsData?.amount_paid}
          </div>
          <div className={`${styles.amounts} ${styles.row}`}>
            Discount <br /> R{financialsData?.discount || "0.00"}{" "}
          </div>
          <div className={`${styles.amounts} ${styles.row}`}>
            Due <br />R{financialsData?.amount_due}
          </div>
        </div>
        <button className={styles["create-invoice-btn"]}>Create Invoice</button>
        {isErrors && errorMessage ? (
          <div className={styles.errorMessage}>{errorMessage}</div>
        ) : null}
      </div>
    </>
  );
}
