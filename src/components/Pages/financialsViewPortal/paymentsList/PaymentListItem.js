import { format } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function PaymentsListItem({ paymentData }) {
  const fullName =
    paymentData.patient_first_name +
    " " +
    (paymentData.patient_last_name || "");

  return (
    <>
      <div className="border mt-2 rounded-sm border-slate-500 px-6 py-3">
        <div className="flex justify-evenly">
          <div className="mr-3">
            <FontAwesomeIcon
              icon="fa-solid fa-dollar-sign"
              style={{ color: "#0284C7" }}
            />
          </div>
          <div className="w-full">
            {fullName} paid R{paymentData.amount} on{" "}
            {format(paymentData.payment_date, "eee dd MMM yyyy")} via{" "}
            {paymentData.payment_method}
          </div>
          <div className="w-fit">
            <p>R{paymentData.amount}</p>
          </div>
        </div>
      </div>
    </>
  );
}
