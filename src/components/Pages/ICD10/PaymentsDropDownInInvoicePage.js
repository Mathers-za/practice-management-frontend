import { useGlobalStore } from "../../../zustandStore/store";
import { useFetchData } from "../../../CustomHooks/serverStateHooks";
import PaymentReference from "./PaymentReference";
import { useState } from "react";
import { Button, CircularProgress } from "@mui/material";
import PaymentPage from "../Payments/PaymentPage";

export default function PaymentsListDropDownInvoicePage({
  financialsData,
  queryKeyToInvalidate,
}) {
  const { globalAppointmentData } = useGlobalStore();
  const {
    data: paymentsList,
    refetch: refetchPaymentsList,
    isLoading,
  } = useFetchData(`/payments/view${globalAppointmentData.id}`, [
    "financialData",
    "paymentsList",
    globalAppointmentData.id,
  ]);
  const [showPaymentsPage, setShowPaymentsPage] = useState(false);
  return (
    <>
      {" "}
      <div className="bg-white w-full relative flex flex-col h-fit">
        {paymentsList && paymentsList?.length > 0 ? (
          paymentsList.map((payment) => {
            return <PaymentReference paymentsData={payment} key={payment.id} />;
          })
        ) : (
          <div className="mb-8">No payments to Show</div>
        )}
        <Button
          size="small"
          disabled={parseFloat(financialsData.amount_due) <= 0}
          variant="contained"
          onClick={() => setShowPaymentsPage(!showPaymentsPage)}
        >
          Add Payment
        </Button>
        {isLoading && (
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <CircularProgress size={20} />
          </div>
        )}
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
