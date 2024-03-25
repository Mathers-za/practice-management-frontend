import styles from "./paymentsList.module.css";
import PaymentsListItem from "./PaymentListItem";
import { useEffect, useState } from "react";
import { usePagination } from "../../../../CustomHooks/serverStateHooks";
import { formatDateYearMonthDay } from "../invoiceProgressComponents/progressUtilFunctions";
import axios from "axios";

async function fetchData(pageInt, pageSizeInt, filterCriteriaObj) {
  const response = await axios.get(
    `http://localhost:4000/payments/filterview`,
    {
      params: {
        page: pageInt,
        pageSize: pageSizeInt,
        filterCriteria: filterCriteriaObj,
      },
      withCredentials: true,
    }
  );

  return response.data;
}

export default function PaymentsList({ profileId }) {
  const [searchDateCriteria, setSearchDateCriteria] = useState({
    start_date: formatDateYearMonthDay(new Date()),
    end_date: formatDateYearMonthDay(new Date()),
  });

  const [page, setPage] = useState(1);
  const [searchBarInput, setSearchBarInput] = useState(null);
  const [mapPaymentData, setMapPaymentData] = useState([]);
  const {
    data: paymentsData,
    refetch: refetchPaymentsData,
    metadata,
  } = usePagination("paymentData", page, () =>
    fetchData(page, 14, { ...searchDateCriteria, profile_id: profileId })
  );

  useEffect(() => {
    setMapPaymentData(paymentsData?.data || []);
  }, [paymentsData]);

  useEffect(() => {
    if (searchBarInput) {
      function filterPaymentsData(paymentsData) {
        const filteredData = paymentsData.filter((payment) => {
          const values = Object.values(payment);
          return values.some((value) => {
            if (value === null || value === undefined) {
              return false;
            } else if (typeof value !== "string") {
              return value
                .toString()
                .toLowerCase()
                .includes(searchBarInput.toLowerCase());
            } else {
              return value
                .toLocaleLowerCase()
                .includes(searchBarInput.toLocaleLowerCase());
            }
          });
        });
        return filteredData;
      }
      setMapPaymentData(filterPaymentsData(paymentsData?.data));
    }
  }, [searchBarInput, paymentsData?.data]);

  useEffect(() => {
    setMapPaymentData([]);
    refetchPaymentsData();
    setPage(1);

    setSearchBarInput("");
  }, [searchDateCriteria]);

  function handleChange(event) {
    const { name, value } = event.target;

    setSearchDateCriteria((prev) => ({
      ...prev,
      [name]: value === "" ? formatDateYearMonthDay(new Date()) : value,
    }));
  }

  return (
    <>
      <div className={styles["invoice-container"]}>
        <div className={styles["top-bar"]}>
          <div className={styles["top-half"]}>
            <div className={styles["top-half-content-left"]}>
              <h2>Payments</h2>
              <div>
                <label>Start Date</label> <br />
                <input
                  onChange={handleChange}
                  type="date"
                  name="start_date"
                  value={searchDateCriteria.start_date}
                />
              </div>
              <div>
                <label> End Date</label> <br />
                <input
                  onChange={handleChange}
                  type="date"
                  name="end_date"
                  value={searchDateCriteria.end_date}
                />
              </div>
            </div>
            <div className={styles["top-half-content-right"]}>
              <label>Search</label>
              <input
                onChange={(event) => setSearchBarInput(event.target.value)}
                className={styles.searchBar}
                type="text"
                value={searchBarInput || ""}
              />
            </div>
          </div>
          <div className={styles["bottom-half"]}>
            <div>
              {paymentsData?.metadata?.totalResults ?? 0} payments found
            </div>
            <div className={styles.pageNav}>
              <button
                disabled={!paymentsData?.data}
                onClick={() => {
                  setPage((prev) => Math.max(prev - 1, 1));
                }}
              >
                prev page
              </button>
              {page} of {paymentsData?.metadata?.totalPages ?? 1}
              <button
                disabled={!paymentsData?.data}
                onClick={() => {
                  setPage((prev) =>
                    Math.min(prev + 1, paymentsData?.metadata?.totalPages)
                  );
                }}
              >
                next page
              </button>
            </div>
          </div>
        </div>
        {mapPaymentData && mapPaymentData.length > 0
          ? mapPaymentData
              .sort((a, b) => a.payment_id - b.payment_id)
              .map((payment) => {
                return (
                  <PaymentsListItem
                    key={payment.payment_id}
                    paymentData={payment}
                  />
                );
              })
          : "No payments found"}
      </div>
    </>
  );
}
