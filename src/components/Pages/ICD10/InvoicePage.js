import { useLocation } from "react-router-dom";
import ICD10Table from "./ICD10-Table";

export default function InvoicePortal() {
  const location = useLocation();
  const { state } = location;
  console.log("the state passed to invoiceportal is " + state);
  return (
    <>
      <ICD10Table
        appointmentId={state?.appointmentId}
        appointmentTypeId={state?.appointmentTypeId}
      />
    </>
  );
}
