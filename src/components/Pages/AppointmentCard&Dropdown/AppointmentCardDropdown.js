import { useEffect, useRef, useState } from "react";
import styles from "./appCardDropdownStyle.module.css";
import { useNavigate } from "react-router-dom";
import PaymentPage from "../Payments/PaymentPage";

export default function AppointmentCardDropDown({
  appointmentId,
  patientId,
  appointmentTypeId,
  setOverlayFlag,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropDownRef = useRef(null);
  const navigate = useNavigate();
  const [showPaymentsPage, setShowPaymentsPage] = useState(false);

  console.log("appoitnmentId in appointmentDropDown is" + appointmentId);

  function setShowPayment() {
    setShowPaymentsPage(!showPaymentsPage);
    setOverlayFlag();
  }

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
      {showPaymentsPage && (
        <PaymentPage
          setOverlayFlag={setOverlayFlag}
          setShowPayment={setShowPayment}
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
                  state: { appointmentId, appointmentTypeId },
                })
              }
            >
              Create Invoice
            </div>
            <div> Manage ICD-10 codes</div>
            <div> View patient</div>
            <div
              onClick={() => {
                setShowPayment();
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
