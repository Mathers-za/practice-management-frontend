import styles from "./invoiceProgress.module.css";
import InvoiceDisplayCard from "./InvoiceDisplayCard";
import { useFetchData } from "../../../../CustomHooks/serverStateHooks";
import { useEffect, useState } from "react";
import { startOfWeek, endOfWeek } from "date-fns";
import {
  filterInvoiceData,
  formatDateYearMonthDay,
} from "./progressUtilFunctions";
import { filterPastDueInvoices } from "./progressUtilFunctions";
import { useInvoiceProgessComponent } from "../../../../zustandStore/store";

function setCountAndTotalWhenProgessFlagTrue(
  filterFunction,
  invoiceData,
  store
) {
  const leftColumn = filterFunction(invoiceData, "In progress");
  const rightColumn = filterFunction(invoiceData, "Paid");
  const middleColumn = filterFunction(invoiceData, "Sent");

  store.getLeftColCount(leftColumn?.length || 0);
  store.getMiddleColCount(middleColumn?.length || 0);
  store.getRightColCount(rightColumn?.length || 0);
  store.getRightColTotalAmount(rightColumn);
  store.getleftColTotalAmount(leftColumn);
  store.getmiddleColTotalAmount(middleColumn);
}

function setCountAndTotalWhenProgressFlagFalse(
  filterFunction,
  invoiceData,
  store
) {
  const leftColumn = filterFunction(invoiceData, 0, 30);
  const rightColumn = filterFunction(invoiceData, 61, 90);
  const middleColumn = filterFunction(invoiceData, 31, 60);

  store.getLeftColCount(leftColumn?.length || 0);
  store.getMiddleColCount(middleColumn?.length || 0);
  store.getRightColCount(rightColumn?.length || 0);
  store.getRightColTotalAmount(rightColumn);
  store.getleftColTotalAmount(leftColumn);
  store.getmiddleColTotalAmount(middleColumn);
}

export default function InvoiceColumnList({
  profileId,
  progressFlag,
  leftColHeading,
  middleColHeading,
  rightColHeading,
}) {
  const [leftColumnList, setLeftColumnList] = useState([]);
  const [middleColumnList, setMiddleColumnList] = useState([]);
  const [rightColumnList, setRightColumnList] = useState([]);

  const [searchDateCriteria, setSearchDateCriteria] = useState({
    invoice_start_date: formatDateYearMonthDay(startOfWeek(new Date())),
    invoice_end_date: formatDateYearMonthDay(endOfWeek(new Date())),
  });

  const [searchBarInput, setSearchBarInput] = useState();

  const { data: invoiceData, refetch: invoiceDataRefetch } = useFetchData(
    `/invoices/filteredView`,
    "invoiceDataInvoiceProgressPage",
    { ...searchDateCriteria, profile_id: profileId }
  );
  const store = useInvoiceProgessComponent();

  useEffect(() => {
    if (invoiceData && progressFlag) {
      setCountAndTotalWhenProgessFlagTrue(
        filterInvoiceData,
        invoiceData,
        store
      );
      setLeftColumnList(
        filterInvoiceData(invoiceData, "In progress", searchBarInput)
      );
      setMiddleColumnList(
        filterInvoiceData(invoiceData, "Sent", searchBarInput)
      );
      setRightColumnList(
        filterInvoiceData(invoiceData, "Paid", searchBarInput)
      );
    }

    if (invoiceData && !progressFlag) {
      setCountAndTotalWhenProgressFlagFalse(
        filterPastDueInvoices,
        invoiceData,
        store
      );

      setLeftColumnList(filterPastDueInvoices(invoiceData, 0, 30));
      setMiddleColumnList(filterPastDueInvoices(invoiceData, 31, 60));
      setRightColumnList(filterPastDueInvoices(invoiceData, 61, 90));
    }
  }, [invoiceData, searchBarInput, searchDateCriteria]);

  useEffect(() => {
    invoiceDataRefetch();
  }, [searchDateCriteria]);

  function handleChange(event) {
    const { name, value } = event.target;

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
      <div className={styles["invoiceProgress-invoice-container"]}>
        <div className={styles["invoiceProgress-top-bar"]}>
          <div className={styles["invoiceProgress-top-bar-topHalf"]}>
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
            {progressFlag && (
              <div className={styles["invoiceProgress-searchBar"]}>
                Search bar{" "}
                <input
                  type="text"
                  placeholder="Search"
                  value={searchBarInput ?? ""}
                  onChange={(event) => setSearchBarInput(event.target.value)}
                />
              </div>
            )}
          </div>
          <div className={styles["invoiceProgress-top-bar-bottomhalf"]}>
            {invoiceData?.length || 0} invoices found
          </div>
        </div>

        <div className={styles["invoiceProgress-invoice-status-headers"]}>
          <div className={styles["invoiceProgress-header-container"]}>
            <p className={styles["invoiceProgress-heading"]}>
              {leftColHeading}{" "}
              <div className={styles["invoiceProgress-count"]}>
                {store?.leftColCount || 0}
              </div>
            </p>
            <p>
              {" "}
              {store?.leftColTotalAmount !== 0
                ? "R" + store?.leftColTotalAmount
                : null}
            </p>
          </div>
          <div className={styles["invoiceProgress-header-container"]}>
            <p className={styles["invoiceProgress-heading"]}>
              {middleColHeading}{" "}
              <div className={styles["invoiceProgress-count"]}>
                {store?.middleColCount || 0}{" "}
              </div>
            </p>{" "}
            <p>
              {" "}
              {store?.middleColTotalAmount !== 0
                ? "R" + store?.middleColTotalAmount
                : null}
            </p>
          </div>
          <div className={styles["invoiceProgress-header-container"]}>
            <p className={styles["invoiceProgress-heading"]}>
              {" "}
              {rightColHeading}{" "}
              <div className={styles["invoiceProgress-count"]}>
                {store?.rightColCount || 0}
              </div>
            </p>{" "}
            <p>
              {store?.rightColTotalAmount !== 0
                ? "R" + store?.rightColTotalAmount
                : null}
            </p>
          </div>
        </div>
        <div
          className={styles["invoiceProgress-invoice-status-list-container"]}
        >
          <div className={styles["invoiceProgress-column"]}>
            {leftColumnList
              ? leftColumnList.map((invoice) => (
                  <InvoiceDisplayCard
                    key={invoice.invoice_id}
                    invoiceData={invoice}
                  />
                ))
              : "No Invoices Found"}
          </div>
          <div className={styles["invoiceProgress-column"]}>
            {middleColumnList
              ? middleColumnList.map((invoice) => (
                  <InvoiceDisplayCard
                    key={invoice.invoice_id}
                    invoiceData={invoice}
                  />
                ))
              : "No Invoices Found"}
          </div>
          <div className={styles["invoiceProgress-column"]}>
            {rightColumnList
              ? rightColumnList.map((invoice) => (
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
