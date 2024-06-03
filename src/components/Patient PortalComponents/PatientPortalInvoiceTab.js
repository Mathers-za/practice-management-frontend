import { useState } from "react";
import { usePagination } from "../../CustomHooks/serverStateHooks";
import { usePatientPortalStore } from "../../zustandStore/store";
import InvoiceDisplayCard from "../Pages/financialsViewPortal/invoiceProgressComponents/InvoiceDisplayCard";
import { Pagination } from "@mui/material";

export default function PatientPortalInvoiceTab() {
  const { patientId } = usePatientPortalStore();
  const [page, setPage] = useState(1);

  const { data: paginatedInvoiceData } = usePagination(
    `/invoices/getAllInvoicesByPatient${patientId}`,
    ["patientInvoices", patientId, page],
    page,
    7
  );

  return (
    <>
      <div className="flex flex-col h-full w-full">
        {paginatedInvoiceData && paginatedInvoiceData.data.length > 0
          ? paginatedInvoiceData.data.map((invoice) => {
              return (
                <InvoiceDisplayCard
                  invoiceData={invoice}
                  queryKeyToInvalidate={["patientInvoices", patientId, page]}
                  key={invoice.invoice_id}
                />
              );
            })
          : "No invoices for this patient to show"}
        {paginatedInvoiceData && paginatedInvoiceData?.data?.length > 0 ? (
          <div className="flex-grow flex justify-end items-end">
            <Pagination
              onChange={(event, newPage) => setPage(newPage)}
              count={paginatedInvoiceData.metaData.totalPages}
            />
          </div>
        ) : null}
      </div>
    </>
  );
}
