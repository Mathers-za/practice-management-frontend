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
import {
  useAppointmentPortalStore,
  usePaymentsPageStore,
} from "../../../zustandStore/store";
import PaymentReference from "./PaymentReference";
import { format } from "date-fns";

function invoiceCreationValidation(payloadData, financialData) {
  const invoiceErrors = [];

  for (const key in payloadData) {
    if (payloadData[key] !== null && key === "discount") {
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

      if (payloadData[key] !== null && key === "amount_total") {
        if (
          parseFloat(payloadData?.amount_due) >
          parseFloat(financialData?.amount_paid)
        ) {
          invoiceErrors(
            "The new amount cannot be less than the amount already paid"
          );
          return invoiceErrors;
        }
        if (
          payloadData?.total_amount !== null &&
          payloadData?.total_amount.includes("-")
        ) {
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

  const invoiceDataObject = useAppointmentPortalStore(
    (state) => state.appointmentsThathaveInvoices
  );

  const { patchMutation } = usePatchData(
    `/financials/update${state.appointmentId}`
  );
  const [changes, setChanges] = useState({});
  const [isErrors, setIsErrors] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const { data: paymentsData } = useFetchData(
    `/payments/view${state.appointmentId}`,
    "paymentsDataInInvoices"
  );

  const invoiceData = invoiceDataObject.hasOwnProperty(state.appointmentId)
    ? invoiceDataObject[state.appointmentId]
    : undefined;

  const { patchMutation: invoiceMutation } = usePatchData(
    `/invoices/update${state.appointmentId}`
  );

  const { createMutation } = usePostData(
    `/invoices/create${state.appointmentId}`
  );

  const togglePaymentsPage = usePaymentsPageStore(
    (state) => state.toggleUniquePaymentsPage
  );
  const visibilty = usePaymentsPageStore(
    (state) => state.paymentsPageDropDownStates
  );
  const paymentsPageVisibilty = visibilty[state.appointmentId];

  const [mutableFinancialsData, setMutableFinancialsData] = useState({});
  const [invoicePayloadChanges, setInvoicePayloadChanges] = useState({});
  const [invoicePayload, setInvoicePayload] = useState({
    invoice_start_date: format(new Date(), "yyyy-MM-dd"),
    invoice_end_date: format(new Date(), "yyyy-MM-dd"),
    paid: false,
  });

  useEffect(() => {
    if (state) {
      checkAndSetIcds(state.appointmentId, state.appointmentTypeId);
    }
  }, [state]);

  useEffect(() => {
    if (invoiceData) {
      setInvoicePayload(invoiceData);
    } else if (invoicePayload) {
      setInvoicePayload((prev) => ({
        ...prev,
        invoice_title: `${state?.patient_first_name} ${
          state?.patient_last_name ?? ""
        } - ${invoicePayload?.invoice_start_date}`,
      }));
    }

    if (financialsData) {
      setMutableFinancialsData(() => ({
        total_amount: financialsData?.total_amount,
        discount: financialsData?.discount,
      }));
    }

    if (financialsData && parseFloat(financialsData.amount_due) <= 0) {
      setInvoicePayload((prev) => ({
        ...prev,
        paid: true,
      }));
    }
  }, [financialsData]);

  function handleChange(event) {
    const { name, value, id } = event.target;

    if (id !== "invoiceData") {
      setMutableFinancialsData((prev) => ({
        ...prev,
        [name]: value === "" ? null : value,
      }));

      setChanges((prev) => ({
        ...prev,
        [name]: value === "" ? null : value,
      }));
    } else if (id === "invoiceData") {
      setInvoicePayloadChanges((prev) => ({
        ...prev,
        [name]: value === "" ? null : value,
      }));
      setInvoicePayload((prev) => ({
        ...prev,
        [name]: value === "" ? null : value,
      }));
    }
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
          <div>
            {state?.patient_first_name} {state?.patient_last_name ?? ""}
          </div>
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
                if (errors && errors.length > 0) {
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
            Invoice Name
          </div>
          <div
            className={
              drop[0] ? `${styles.show} ${styles.invoiceName}` : styles.hide
            }
          >
            <label>
              Invoice Name
              <br />
              <input
                onChange={handleChange}
                type="text"
                name="invoice_title"
                value={invoicePayload?.invoice_title ?? ""}
                id="invoiceData"
              />
            </label>
          </div>

          <div className={styles.row} onClick={() => handleShow(1)}>
            Medical Aid Coding
          </div>
          <div className={drop[1] ? styles.show : styles.hide}>
            <ICD10Table
              appointmentId={state?.appointmentId}
              appointmentTypeId={state?.appointmentTypeId}
              financialsDataRefetch={() => refetch()}
            />
          </div>
          <div className={styles.row} onClick={() => handleShow(2)}>
            Invoice Dates
          </div>
          <div
            className={
              drop[2] ? ` ${styles.invoiceDates} ${styles.show}` : styles.hide
            }
          >
            {" "}
            <div>
              <label>
                Invoice Start Date <br />
                <input
                  onChange={handleChange}
                  type="date"
                  name="invoice_start_date"
                  value={format(
                    new Date(invoicePayload?.invoice_start_date),
                    "yyyy-MM-dd"
                  )}
                  id="invoiceData"
                />
              </label>
            </div>
            <div>
              <label>
                {" "}
                Invoice End Date <br />
                <input
                  onChange={handleChange}
                  type="date"
                  name="invoice_end_date"
                  value={format(
                    new Date(invoicePayload?.invoice_end_date),
                    "yyyy-MM-dd"
                  )}
                  id="invoiceData"
                />
              </label>
            </div>
          </div>
          <div className={styles.row} onClick={() => handleShow(3)}>
            Payments
          </div>
          <div className={drop[3] ? styles.show : styles.hide}>
            {paymentsData &&
              paymentsData.map((payment) => (
                <>
                  <div>
                    <PaymentReference key={payment.id} paymentsData={payment} />
                  </div>
                </>
              ))}

            <div className={styles.addPaymentButtonPositioning}>
              <button
                disabled={parseFloat(financialsData?.amount_due) <= 0}
                className={
                  parseFloat(financialsData?.amount_due) <= 0
                    ? `${styles.addPaymentBtn} ${styles.disableBtn}`
                    : styles.addPaymentBtn
                }
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
        <button
          disabled={
            invoiceData && Object.keys(invoicePayloadChanges).length === 0
              ? true
              : false
          }
          onClick={() => {
            invoiceData
              ? invoiceMutation.mutate(invoicePayloadChanges)
              : createMutation.mutate(invoicePayload);
            setInvoicePayloadChanges({});
          }}
          className={styles["create-invoice-btn"]}
        >
          {invoiceData ? "Save Changes" : "Create Invoice"}
        </button>
        {isErrors && errorMessage ? (
          <div className={styles.errorMessage}>{errorMessage}</div>
        ) : null}
      </div>
    </>
  );
}
