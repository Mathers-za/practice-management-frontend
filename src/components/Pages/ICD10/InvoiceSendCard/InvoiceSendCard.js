import axios from "axios";

import styles from "./invoiceSendCard.module.css";
import { useFetchData } from "../../../../CustomHooks/serverStateHooks";
import { useNavigate } from "react-router-dom";

export default function InvoiceSendCard({
  patientData,
  profileId,
  appointmentId,
  hideComponent,
}) {
  const { data: invoiceData } = useFetchData(
    `/invoices/view${appointmentId}`,
    "invDataInSendInvoices"
  );
  const navigate = useNavigate();
  async function handleInvoiceStatementGeneration(
    invoiceNumber,
    appointmentId,
    patientId,
    profileId
  ) {
    try {
      const { data } = await axios.get(
        `//localhost:4000/invoices//retrieveInvoiceStatement`,
        {
          withCredentials: true,
          params: {
            invoiceNumber: invoiceNumber,
            profileId: profileId,
            patientId: patientId,
            appointmentId: appointmentId,
          },
          responseType: "arraybuffer",
        }
      );

      const pdfBlob = new Blob([data], { type: "application/pdf" });
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, "_blank");
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <div className={styles["invSendCard-overlay"]}>
      <div className={styles["invSendCard-card"]}>
        <div className={styles["invSendCard-top-bar"]}>
          {" "}
          <p>create an invoice</p>
          <p onClick={() => hideComponent()}>X</p>{" "}
        </div>
        <p className={styles["invSendCard-patientName"]}>
          {patientData?.patient_first_Name || ""}{" "}
          {patientData?.patient_last_Name || ""}
        </p>
        <div className={styles["invSendCard-tile"]}>
          <p>img</p>
          <p>{invoiceData?.invoice_title || "Invoice successfuly created."}</p>
        </div>
        <div className={styles["invSendCard-row"]}>
          {" "}
          <p>img</p> <p>Send to Patient</p>
        </div>
        <div className={styles["invSendCard-row"]}>
          <p>img</p>
          <p>Send to Medical Aid</p>{" "}
        </div>
        <div
          onClick={() =>
            handleInvoiceStatementGeneration(
              invoiceData.invoice_number,
              invoiceData.appointment_id,
              patientData.patientId,
              profileId
            )
          }
          className={styles["invSendCard-row"]}
        >
          <p>img</p> <p>View</p>
        </div>
        <div className={styles["invSendCard-row"]}>
          <p>img</p>
          <p onClick={() => navigate("/")}>Done</p>
        </div>
      </div>
    </div>
  );
}
