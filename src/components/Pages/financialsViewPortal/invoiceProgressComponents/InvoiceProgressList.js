import styles from "./invoiceProgress.module.css";
import InvoiceDisplayCard from "./InvoiceDisplayCard";
import { useFetchData } from "../../../../CustomHooks/serverStateHooks";
import { useEffect, useState } from "react";
import { startOfWeek, endOfWeek } from "date-fns";
import {
  filterInvoiceData,
  formatDateYearMonthDay,
} from "./progressUtilFunctions";

export default function InvoiceProgressPage({ profileId }) {
  console.log(profileId);
  const [inProgressInvoices, setInProgressInvoices] = useState([]);
  const [sentInvoices, setSentInvoices] = useState([]);
  const [paidInvoices, setPaidInvoices] = useState([]);
  const [searchDateCriteria, setSearchDateCriteria] = useState({
    invoice_start_date: formatDateYearMonthDay(startOfWeek(new Date())),
    invoice_end_date: formatDateYearMonthDay(endOfWeek(new Date())),
  });
  const [searchBarInput, setSearchBarInput] = useState("");

  const { data: invoiceData, refetch: invoiceDataRefetch } = useFetchData(
    `/invoices/filteredView`,
    "invoiceDataInvoiceProgressPage",
    { ...searchDateCriteria, profile_id: profileId }
  );

  useEffect(() => {
    if (invoiceData) {
      setInProgressInvoices(
        filterInvoiceData(invoiceData, "In progress", searchBarInput)
      );
      setSentInvoices(filterInvoiceData(invoiceData, "Sent", searchBarInput));
      setPaidInvoices(filterInvoiceData(invoiceData, "Paid", searchBarInput));
    }
  }, [invoiceData, searchBarInput]);

  useEffect(() => {
    invoiceDataRefetch();
  }, [searchDateCriteria]);

  function handleChange(event) {
    const { name, value, id } = event.target;

    setSearchDateCriteria((prev) => ({
      ...prev,
      [name]:
        value === ""
          ? formatDateYearMonthDay(startOfWeek(new Date()))
          : formatDateYearMonthDay(value),
    }));
  }

  return (
    <>
      <div className={styles["invoice-container"]}>
        <div className={styles["top-bar"]}>
          <div className={styles["top-bar-topHalf"]}>
            <p>refresh</p>
            <div>
              <label> Start Date</label> <br />{" "}
              <input
                onChange={handleChange}
                type="date"
                value={formatDateYearMonthDay(
                  searchDateCriteria.invoice_start_date
                )}
                name="invoice_start_date"
              />
            </div>
            <div>
              <label>End Date</label> <br />{" "}
              <input
                onChange={handleChange}
                type="date"
                value={formatDateYearMonthDay(
                  searchDateCriteria.invoice_end_date
                )}
                name="invoice_end_date"
              />
            </div>
            <div className={styles.searchBar}>
              Search bar{" "}
              <input
                type="text"
                placeholder="Search"
                value={searchBarInput ?? ""}
                onChange={(event) => setSearchBarInput(event.target.value)}
              />
            </div>
          </div>
          <div className={styles["top-bar-bottomhalf"]}>Number of invoices</div>
        </div>

        <div className={styles["invoice-status-headers"]}>
          <p>In progess</p>
          <p>Sent</p>
          <p>Paid</p>
        </div>
        <div className={styles["invoice-status-list-container"]}>
          <div>
            {inProgressInvoices
              ? inProgressInvoices.map((invoice) => (
                  <InvoiceDisplayCard
                    key={invoice.invoice_id}
                    invoiceData={invoice}
                  />
                ))
              : "No Invoices Found"}
          </div>
          <div>
            {" "}
            {sentInvoices
              ? sentInvoices.map((invoice) => (
                  <InvoiceDisplayCard
                    key={invoice.invoice_id}
                    invoiceData={invoice}
                  />
                ))
              : "No Invoices Found"}
          </div>
          <div>
            {paidInvoices
              ? paidInvoices.map((invoice) => (
                  <InvoiceDisplayCard
                    key={invoice.invoice_id}
                    invoiceData={invoice}
                  />
                ))
              : "No Invoices Found"}
          </div>
        </div>
      </div>
    </>
  );
}
