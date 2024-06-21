import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import HistoryIcon from "@mui/icons-material/History";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";

export default function InvoicesAndPaymentsPortalDropDownMenu({
  showComponent = false,
  onclick = undefined,
}) {
  return (
    <>
      <AnimatePresence>
        {showComponent && (
          <motion.div
            initial={{ height: "0px" }}
            animate={{ height: "auto" }}
            exit={{ height: "0px", opacity: 0 }}
            className="border-l shadow-md shadow-black/50 bg-white select-none text-nowrap border-r border-t border-slate-300"
          >
            <Link to="invoiceProgress">
              <div
                onClick={() => (onclick ? onclick() : null)}
                className="pl-2 py-2 pr-2 flex  gap-1   border-b border-slate-300 "
              >
                <AccountBalanceIcon color="warning" />
                <p>Invoice Progress</p>
              </div>
            </Link>
            <Link to="invoicePastDue">
              {" "}
              <div
                onClick={() => (onclick ? onclick() : null)}
                className="pl-2 py-2 pr-2 flex  gap-1   border-b border-slate-300  "
              >
                <HistoryIcon color="warning" />
                <p className="text-base"> Invoices Past Due</p>
              </div>
            </Link>
            <Link to="paymentsTracker">
              <div
                onClick={() => (onclick ? onclick() : null)}
                className="pl-2 py-2 pr-2 flex  gap-1   border-b border-slate-300 "
              >
                <MonetizationOnIcon color="warning" />
                <p>Payments Made</p>
              </div>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
