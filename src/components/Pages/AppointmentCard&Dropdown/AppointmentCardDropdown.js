import { useEffect, useRef, useState } from "react";
import styles from "./appCardDropdownStyle.module.css";
import { useNavigate } from "react-router-dom";
import PaymentPage from "../Payments/PaymentPage";
import { usePaymentsPageStore } from "../../../zustandStore/store";
import { useFetchData } from "../../../CustomHooks/serverStateHooks";

export default function AppointmentCardDropDown({
  appointmentId,
  patientId,
  appointmentTypeId,
  setOverlayFlag,
  patient_first_name,
  patient_last_name,
}) {
  const togglePaymentsPageDisplay = usePaymentsPageStore(
    (state) => state.toggleUniquePaymentsPage
  );
  const visibilty = usePaymentsPageStore(
    (state) => state.paymentsPageDropDownStates
  );

  const { data: invoiceData } = useFetchData(`/invoices/view${appointmentId}`);

  const [disable, setDisable] = useState(false);

  const { data: financialData } = useFetchData(
    `/financials/view${appointmentId}`,
    "financialsInAppdropdown"
  );

  const paymentsPageVisbilty = visibilty[appointmentId];
  const [isOpen, setIsOpen] = useState(false);
  const dropDownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (financialData && parseFloat(financialData.amount_due) <= 0) {
      setDisable(true);
    }
  }, [financialData]);

  useEffect(() => {
    function handleOutsideClick(event) {
      if (dropDownRef.current && !dropDownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <>
      {paymentsPageVisbilty && (
        <PaymentPage
          setOverlayFlag={setOverlayFlag}
          appointmentId={appointmentId}
          appointmentTypeId={appointmentTypeId}
        />
      )}
      ;
      <div className={styles.dropdown}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={styles["drop-btn"]}
        >
          e
        </button>
        {isOpen && (
          <div className={styles["dropdown-content"]} ref={dropDownRef}>
            <div
              onClick={() =>
                navigate("/invoicePortal", {
                  state: {
                    appointmentId,
                    appointmentTypeId,
                    patient_first_name,
                    patient_last_name,
                    invoiceData,
                  },
                })
              }
            >
              {invoiceData ? "Edit Invoice" : "Create Invoice"}
            </div>
            <div> Manage ICD-10 codes</div>
            <div> View patient</div>
            <div
              className={disable && styles.disablePayment}
              onClick={() => {
                if (!disable) {
                  togglePaymentsPageDisplay(appointmentId);
                }
              }}
            >
              Make a payment
            </div>
          </div>
        )}
      </div>
    </>
  );
}
