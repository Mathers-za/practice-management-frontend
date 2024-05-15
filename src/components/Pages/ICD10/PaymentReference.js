import { format } from "date-fns";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";

export default function PaymentReference({ paymentsData }) {
  return (
    <>
      <div className="flex justify-between  items-center w-[100%]">
        <div className="flex  items-center">
          <IconButton aria-label="delete">
            <DeleteIcon />
          </IconButton>
          <div>
            <p>
              {format(new Date(paymentsData?.payment_date), "eee ee MMM yyyy")}{" "}
              via {paymentsData?.payment_method}
            </p>
            <p className="text-sm bg-slate-500">
              {paymentsData?.payment_reference}
            </p>
          </div>
        </div>
        <div>
          <p>{paymentsData?.amount}</p>
        </div>
      </div>
    </>
  );
}
