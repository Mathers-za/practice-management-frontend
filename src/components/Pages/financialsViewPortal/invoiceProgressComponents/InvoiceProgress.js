import InvoiceColumnList from "./InvoiceColumnList";

export default function InvoiceProgressPage() {
  return (
    <>
      <InvoiceColumnList
        leftColHeading="In progress"
        middleColHeading="Sent"
        rightColHeading="Paid"
        progressFlag={true}
      />
    </>
  );
}
