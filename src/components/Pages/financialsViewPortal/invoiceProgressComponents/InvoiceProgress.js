import InvoiceColumnList from "./InvoiceColumnList";

export default function InvoiceProgressPage({ profileId }) {
  return (
    <>
      <InvoiceColumnList
        profileId={profileId}
        leftColHeading="In progress"
        middleColHeading="Sent"
        rightColHeading="Paid"
        progressFlag={true}
      />
    </>
  );
}
