import { useLocation } from "react-router-dom";
import ICD10Table from "./ICD10-Table";

export default function InvoicePortal() {
  const location = useLocation();
  const { state } = location.state;
  return (
    <>
      <ICD10Table
        appointmentId={state?.appointmentId}
        appointmentTypeId={state?.appointmentTypeId}
      />
    </>
  );
}
