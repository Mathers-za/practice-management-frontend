export async function checkAndSetInvoiceStatusToPaidOnFullPayment(
  invoiceStatus,
  amountDue,
  patchCallbackFn
) {
  if (
    (invoiceStatus && invoiceStatus === "In progress") ||
    invoiceStatus === "Sent"
  ) {
    if (parseFloat(amountDue) <= 0) {
      patchCallbackFn({ invoice_status: "Paid" });
    }
  } else if (!invoiceStatus) {
    return;
  }
}
