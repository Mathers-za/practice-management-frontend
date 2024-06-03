import InvoiceListDropdown from "./InvoiceListDropDown";
import { useState } from "react";
import { IconButton } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

export default function InvoiceDisplayCard({
  invoiceData,
  queryKeyToInvalidate,
}) {
  const {
    amount_due,
    amount_paid,
    total_amount,
    invoice_number,
    invoice_start_date,
    invoice_end_date,
    invoice_title,
  } = invoiceData;

  const [showDropDown, setShowDropDown] = useState(false);

  return (
    <>
      <div className="border-b w-full h-hit flex text-sm py-2 pr-4  border-black  border-l border-r ">
        <div className="w-fit  flex items-center">
          <IconButton
            onClick={() => setShowDropDown(!showDropDown)}
            size="small"
          >
            <MoreVertIcon fontSize="medium" />
          </IconButton>
        </div>
        <div className="w-full  ">
          {" "}
          <p className="flex gap-2 items-center">
            {invoice_title}
            <div className=" text-xs border-2 p-[1px] border-slate-400  rounded-md">
              {invoice_number}
            </div>
          </p>
          <p>
            {" "}
            Date: {format(new Date(invoice_start_date), "yyyy-MM-dd")}/ Due:{" "}
            {format(new Date(invoice_end_date), "yyyy-MM-dd")}
          </p>
          <div className=" flex gap-12">
            <p>Total: {total_amount}</p> <p>Paid: {amount_paid} </p>
          </div>
        </div>
        <div className="  flex  flex-col items-end  justify-center ">
          {" "}
          <p>R{amount_due ?? "0,00"}</p>
          <p>Due</p>
        </div>
        <AnimatePresence>
          {showDropDown && (
            <div className="fixed z-10 top-0 left-0 w-full h-screen bg-black/30 flex items-end">
              <motion.div
                className="w-full h-fit "
                initial={{ height: "0%" }}
                animate={{ height: "auto" }}
                exit={{ height: "0%" }}
              >
                <InvoiceListDropdown
                  querkyKeyToInvalidate={queryKeyToInvalidate}
                  hideComponent={() => setShowDropDown(!showDropDown)}
                  invoiceData={invoiceData}
                  toggleDropdown={() => setShowDropDown(!showDropDown)}
                />
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
