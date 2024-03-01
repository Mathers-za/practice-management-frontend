import { useLocation } from "react-router-dom";
import ICD10Table from "./ICD10-Table";
import { useState } from "react";

export default function InvoicePortal() {
  const location = useLocation();
  const { state } = location;
  const [drop, setDrop] = useState(new Array(2).fill(false));

  function handleShow(index) {
    setDrop((prev) => {
      const newState = [...prev];
      newState[index] = !drop[index];
      return newState;
    });
  }
  console.log("the state passed to invoiceportal is " + state);

  return (
    <>
      <div className="component">
        <div className="nav-top">
          <div>Patients details</div>
          <div>Close</div>
        </div>
        <div className="top">
          <div>Price to be displayed here</div>
          <div>Discount input display here</div>
        </div>
        <div className="bottom-menu">
          <div onClick={() => handleShow(0)} className="menu-item">
            Medical Aid Coding
          </div>
          <div className={drop[0] ? "show" : "hide"}>
            {" "}
            <ICD10Table
              appointmentId={state?.appointmentId}
              appointmentTypeId={state?.appointmentTypeId}
            />
          </div>
          <div onClick={() => handleShow(1)} className="menu-item">
            Invoices{" "}
          </div>
          <div className={drop[1] ? "show" : "hide"}>content 2</div>
          <div onClick={() => handleShow(2)} className="menu-item">
            Payments
          </div>
          <div className={drop[2] ? "show" : "hide"}>content 3</div>
          <div className="amounts-container">
            <div>appointment price</div>
            <div>amount payed</div>
            <div>amount due</div>
          </div>
        </div>
        <button>Create Invoice</button>
      </div>
    </>
  );
}
