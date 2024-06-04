import { useGlobalStore } from "../../../zustandStore/store";
import { useFetchData } from "../../../CustomHooks/serverStateHooks";
import PaymentReference from "./PaymentReference";
import { useState } from "react";
import { Button } from "@mui/material";
import PaymentPage from "../Payments/PaymentPage";

export default function PaymentsListDropDownInvoicePage({
  financialsData,
  queryKeyToInvalidate,
}) {
  const { globalAppointmentData } = useGlobalStore();
  const { data: paymentsList, refetch: refetchPaymentsList } = useFetchData(
    `/payments/view${globalAppointmentData.id}`,
    ["financialData", "paymentsList", globalAppointmentData.id]
  );
  const [showPaymentsPage, setShowPaymentsPage] = useState(false);
  return (
    <>
      {" "}
      <div className="bg-white w-full flex flex-col h-fit">
        {paymentsList && paymentsList?.length > 0 ? (
          paymentsList.map((payment) => {
            return <PaymentReference paymentsData={payment} key={payment.id} />;
          })
        ) : (
          <div>No payments to Show</div>
        )}
        <Button
          size="small"
          disabled={parseFloat(financialsData.amount_due) <= 0}
          variant="contained"
          onClick={() => setShowPaymentsPage(!showPaymentsPage)}
        >
          Add Payment
        </Button>
      </div>
      {showPaymentsPage && (
        <PaymentPage
          financialData={financialsData}
          hideComponent={() => setShowPaymentsPage(!showPaymentsPage)}
          appointmentId={globalAppointmentData.id}
          queryKeyToInvalidate={queryKeyToInvalidate}
          refetch={refetchPaymentsList}
        />
      )}
    </>
  );
}
