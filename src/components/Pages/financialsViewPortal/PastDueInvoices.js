import InvoiceColumnList from "./invoiceProgressComponents/InvoiceColumnList";

export default function PastDueInvoices({ profileId }) {
  return (
    <>
      <InvoiceColumnList
        profileId={profileId}
        leftColHeading="0-29 days"
        middleColHeading="30-59 days"
        rightColHeading="60-90 days"
        progressFlag={false}
      />
    </>
  );
}
