import { useLocation } from "react-router-dom";
import ICD10Table from "./ICD10-Table";
import { useEffect, useState } from "react";
import styles from "./invoicePage.module.css";
import { checkAndSetIcds } from "../../../apiRequests/apiRequests";
import {
  useFetchData,
  usePatchData,
} from "../../../CustomHooks/serverStateHooks";
import PaymentPage from "../Payments/PaymentPage";
import { usePaymentsPageStore } from "../../../zustandStore/store";

export default function InvoicePortal() {
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
                await patchMutation.mutateAsync(mutableFinancialsData);
                refetch();
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
              onBlur={async () => {
                await patchMutation.mutateAsync(mutableFinancialsData);
                refetch();
              }}
              name="discount"
              onChange={handleChange}
              type="number"
              value={mutableFinancialsData?.discount || ""}
            />
          </div>
        </div>
        <div className={styles["bottom-menu"]}>
          <div onClick={() => handleShow(0)} className={styles["menu-item"]}>
            Medical Aid Coding
          </div>
          <div className={drop[0] ? styles.show : styles.hide}>
            <ICD10Table
              appointmentId={state?.appointmentId}
              appointmentTypeId={state?.appointmentTypeId}
              financialsDataRefetch={() => refetch()}
            />
          </div>
          <div onClick={() => handleShow(1)} className={styles["menu-item"]}>
            Invoices{" "}
          </div>
          <div className={drop[1] ? styles.show : styles.hide}>content 2</div>
          <div onClick={() => handleShow(2)} className={styles["menu-item"]}>
            Payments
          </div>
          <div className={drop[2] ? styles.show : styles.hide}>
            <div className={styles.paymentsDropDownContainer}>
              <div className={styles.paymentCard}>
                {paymentsData &&
                  paymentsData.map((payment) => (
                    <>
                      <div className={styles.makeCol}>
                        <div className={styles.paymentCardLeft}>
                          <div>del</div>
                          <div>
                            {payment?.payment_date} <br />
                            {payment?.payment_reference}
                          </div>
                        </div>
                        <div>{payment?.amount}</div>
                      </div>
                    </>
                  ))}
              </div>
              <div>
                <button
                  onClick={() => togglePaymentsPage(state.appointmentId)}
                ></button>
              </div>
            </div>

            {paymentsPageVisibilty && (
              <PaymentPage
                appointmentId={state.appointmentId}
                appointmentTypeId={state.appointmentTypeId}
              />
            )}
          </div>
          <div className={styles["amounts-container"]}>
            <div>
              {" "}
              Appointment Price <br /> R{financialsData?.total_amount}
            </div>
            <div>
              Payments <br /> R{financialsData?.amount_paid}
            </div>
            <div>
              Discount <br /> R{financialsData?.discount || "0.00"}{" "}
            </div>
            <div>
              Due <br />R{financialsData?.amount_due}
            </div>
          </div>
        </div>
        <button className={styles["create-invoice-btn"]}>Create Invoice</button>
      </div>
    </>
  );
}
