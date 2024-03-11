import styles from "./invoiceProgress.module.css";
import InvoiceDisplayCard from "./InvoiceDisplayCard";
import { useFetchData } from "../../../../CustomHooks/serverStateHooks";
import { useEffect, useState } from "react";
import { startOfWeek, endOfWeek, format } from "date-fns";

function formatDateYearMonthDay(date) {
  return format(date, "yyyy-MM-dd");
}

function filterInvoiceData(data, invoiceStatus, searchBarInput = null) {
  let filtered = data.filter(
    (invoice) => invoice.invoice_status === invoiceStatus
  );
  if (searchBarInput) {
    filtered = filtered.filter((invoice) => {
      const invoiceValues = Object.values(invoice);
      return searchBarInput
        ? invoiceValues.some((value) =>
            value.toLowerCase().includes(searchBarInput.toLowerCase())
          )
        : false;
    });
  }
  return filtered;
}

export default function InvoiceProgressPage({ profileId }) {
  const [inProgressInvoices, setInProgressInvoices] = useState();
  const [sentInvoices, setSentInvoices] = useState();
  const [paidInvoices, setPaidInvoices] = useState();
  const [searchDateCriteria, setSearchDateCriteria] = {
    start_date: startOfWeek(new Date()),
    end_date: endOfWeek(new Date()),
  };
  const [searchBarInput, setSearchBarInput] = useState();

  const { data: invoiceData } = useFetchData(`/invoices/view${profileId}`);

  useEffect(() => {
    if (invoiceData) {
      setInProgressInvoices(
        filterInvoiceData(invoiceData, "In progress", searchBarInput)
      );
    }

    if (invoiceData) {
      setSentInvoices(filterInvoiceData(invoiceData, "Sent", searchBarInput));
    }

    if (invoiceData) {
      setPaidInvoices(invoiceData, "Paid", searchBarInput);
    }
  }, [invoiceData, searchDateCriteria]);

  function handleChange(event) {
    const { name, value, id } = event.target;
    if (searchDateCriteria.hasOwnProperty(name)) {
      setSearchDateCriteria((prev) => ({
        ...prev,
        [name]:
          value === ""
            ? formatDateYearMonthDay(startOfWeek(new Date()))
            : value,
      }));
    }
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
                value={formatDateYearMonthDay(searchDateCriteria.start_date)}
                name="start_date"
                id="searchDates"
              />
            </div>
            <div>
              <label>End Date</label> <br />{" "}
              <input
                onChange={handleChange}
                type="date"
                value={formatDateYearMonthDay(searchDateCriteria.end_date)}
                name="end_date"
                id="searchDates"
              />
            </div>
            <div className={styles.searchBar}>
              Search bar <input type="text" placeholder="Search" />
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
            {filteredInprogress
              ? filteredInprogress.map((invoice) => <InvoiceDisplayCard />)
              : "No Invoices Found"}
          </div>
          <div>
            {" "}
            {filteredSent
              ? filteredPaid.map((invoice) => <InvoiceDisplayCard />)
              : "No Invoices Found"}
          </div>
          <div>
            {filteredPaid
              ? filteredPaid.map((invoice) => <InvoiceDisplayCard />)
              : "No Invoices Found"}
          </div>
        </div>
      </div>
    </>
  );
}
