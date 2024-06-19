import { format } from "date-fns";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";

export default function PaymentReference({ paymentsData, onDelete }) {
  return (
    <>
      <div className="flex justify-between  items-center w-[100%]">
        <div className="flex  items-center">
          <IconButton onClick={() => onDelete()} aria-label="delete">
            <DeleteIcon />
          </IconButton>
          <div className="mb-2">
            <p>
              {format(new Date(paymentsData?.payment_date), "eee ee MMM yyyy")}{" "}
              via {paymentsData?.payment_method}
            </p>
            <p className="text-sm px-2  bg-slate-300 w-fit rounded-lg">
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
