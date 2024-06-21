import PaymentsListItem from "./PaymentListItem";
import { useEffect, useState } from "react";
import { usePagination } from "../../../../CustomHooks/serverStateHooks";
import { formatDateYearMonthDay } from "../invoiceProgressComponents/progressUtilFunctions";

import { filterPaymentsData } from "./paymentsListHelperFns";
import { MobileDatePicker } from "@mui/x-date-pickers";
import { format } from "date-fns";
import { TextField } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import { useGlobalStore } from "../../../../zustandStore/store";
import CustomLinearProgressBar from "../../../miscellaneous components/CustomLinearProgressBar";

export default function PaymentsList() {
  const [searchDateCriteria, setSearchDateCriteria] = useState({
    start_date: formatDateYearMonthDay(new Date()),
    end_date: formatDateYearMonthDay(new Date()),
  });

  const { globalProfileData } = useGlobalStore();

  const [page, setPage] = useState(1);
  const [searchBarInput, setSearchBarInput] = useState(null);
  const [mapPaymentData, setMapPaymentData] = useState([]);
  const {
    data: paymentsData,
    isLoading,
    isPreviousData,
    isFetching,
  } = usePagination(
    `/payments/getAllProfilePayments${globalProfileData.id}`,
    ["paymentsDataList", searchDateCriteria, page],
    page,
    14,
    {
      start_date: searchDateCriteria.start_date,
      end_date: searchDateCriteria.end_date,
    }
  );

  useEffect(() => {
    setMapPaymentData(paymentsData?.data || []);
  }, [paymentsData]);

  useEffect(() => {
    if (searchBarInput) {
      setMapPaymentData(filterPaymentsData(paymentsData?.data, searchBarInput));
    }
  }, [searchBarInput, paymentsData?.data]);

  useEffect(() => {
    setMapPaymentData([]);
    setPage(1);
    setSearchBarInput("");
  }, [searchDateCriteria]);

  function handleDateChange(date, key) {
    setSearchDateCriteria((prev) => ({
      ...prev,
      [key]: format(date, "yyyy-MM-dd"),
    }));
  }

  return (
    <>
      <div className="w-full min-h-full h-fit p-2 bg-white">
        <div className="border border-slate-500 shadow-md relative shadow-black/40 rounded-sm  p-4">
          <div>
            <div className="flex ml-8  gap-5">
              <div className="w-2/4">
                <h2 className=" text-lg">Payments</h2>
                <div className="  flex gap-2 ">
                  <MobileDatePicker
                    onAccept={(date) => handleDateChange(date, "start_date")}
                    orientation="portrait"
                    closeOnSelect={true}
                    value={new Date(searchDateCriteria?.start_date)}
                    slotProps={{
                      textField: { variant: "standard" },
                      actionBar: { actions: [] },
                    }}
                    label="Start date"
                  />

                  <MobileDatePicker
                    onAccept={(date) => handleDateChange(date, "end_date")}
                    orientation="portrait"
                    closeOnSelect={true}
                    value={new Date(searchDateCriteria?.end_date)}
                    slotProps={{
                      textField: { variant: "standard" },
                      actionBar: { actions: [] },
                    }}
                    label="End date"
                  />
                </div>
              </div>

              <div className="w-2/4 ">
                <h2 className="border-b w-fit border-black pb-1 mb-2">
                  Search by name/date/appointment type or payment method
                </h2>
                <TextField
                  size="small"
                  label="Search"
                  onChange={(event) => setSearchBarInput(event.target.value)}
                  value={searchBarInput || ""}
                  variant="outlined"
                />
              </div>
            </div>
          </div>
          <div className="flex mt-4 items-end justify-between">
            <div className="ml-8">
              {paymentsData?.metadata?.totalResults ?? 0} payments found
            </div>
            <div>
              <h2 className="text-start">Pages</h2>
              <div className="mt-1">
                {" "}
                <Pagination
                  shape="rounded"
                  showFirstButton
                  showLastButton
                  variant="outlined"
                  size="small"
                  onChange={(event, page) => setPage(page)}
                  count={paymentsData?.metaData?.totalPages ?? 1}
                  color="primary"
                />
              </div>
            </div>
          </div>
          <CustomLinearProgressBar
            isLoading={isLoading || isPreviousData}
            className="-bottom-1 left-0 absolute w-full"
          />
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
