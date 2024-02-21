import { useEffect, useRef, useState } from "react";
import "./appCardDropdownStyle.css";
import { useNavigate } from "react-router-dom";

export default function AppointmentCardDropDown({
  appointmentId,
  patientId,
  appointmentTypeId,
}) {
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
      <div className="dropdown">
        <button onClick={() => setIsOpen(!isOpen)} className="drop-btn">
          e
        </button>
        {isOpen && (
          <div className="dropdown-content" ref={dropDownRef}>
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
          </div>
        )}
      </div>
    </>
  );
}
