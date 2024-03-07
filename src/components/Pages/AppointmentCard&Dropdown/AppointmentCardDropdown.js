import { useEffect, useRef, useState } from "react";
import styles from "./appCardDropdownStyle.module.css";
import { useNavigate } from "react-router-dom";
import PaymentPage from "../Payments/PaymentPage";
import { usePaymentsPageStore } from "../../../zustandStore/store";

export default function AppointmentCardDropDown({
  appointmentId,
  patientId,
  appointmentTypeId,
  setOverlayFlag,
}) {
  const togglePaymentsPageDisplay = usePaymentsPageStore(
    (state) => state.toggleUniquePaymentsPage
  );
  const visibilty = usePaymentsPageStore(
    (state) => state.paymentsPageDropDownStates
  );
  const paymentsPageVisbilty = visibilty[appointmentId];
  const [isOpen, setIsOpen] = useState(false);
  const dropDownRef = useRef(null);
  const navigate = useNavigate();

  console.log("appoitnmentId in appointmentDropDown is" + appointmentId);

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
                  state: { appointmentId, appointmentTypeId },
                })
              }
            >
              Create Invoice
            </div>
            <div> Manage ICD-10 codes</div>
            <div> View patient</div>
            <div onClick={() => togglePaymentsPageDisplay(appointmentId)}>
              Make a payment
            </div>
          </div>
        )}
      </div>
    </>
  );
}
