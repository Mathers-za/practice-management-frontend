import InvoiceColumnList from "./invoiceProgressComponents/InvoiceColumnList";

export default function PastDueInvoices() {
  return (
    <>
      <InvoiceColumnList
        leftColHeading="0-29 days"
        middleColHeading="30-59 days"
        rightColHeading="60-90 days"
        progressFlag={false}
      />
    </>
  );
}
