import axios from "axios";

export async function handleInvoiceStatementGeneration(
  invoiceNumber,
  appointmentId,
  patientId,
  profileId
) {
  try {
    const { data } = await axios.get(
      `http://localhost:4000/invoices/retrieveInvoiceStatement`,
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

export async function emailInvoiceStatement(
  profileId,
  appointmentId,
  patientId
) {
  await axios.post(
    `http://localhost:4000/invoices//sendInvoiceStatment`,
    { profileId, appointmentId, patientId },
    { withCredentials: true }
  );
}
