import styles from "./invoiceProgress.module.css";
import InvoiceDisplayCard from "./InvoiceDisplayCard";
import { useFetchData } from "../../../../CustomHooks/serverStateHooks";
import { useEffect, useState } from "react";
import { startOfWeek, endOfWeek, format } from "date-fns";

import {
  filterInvoiceData,
  formatDateYearMonthDay,
} from "./progressUtilFunctions";
import { filterPastDueInvoices } from "./progressUtilFunctions";
import {
  useGlobalStore,
  useInvoiceProgessComponent,
} from "../../../../zustandStore/store";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { TextField } from "@mui/material";
import Badge from "./Badge";
import CustomLinearProgressBar from "../../../miscellaneous components/CustomLinearProgressBar";

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
  progressFlag,
  leftColHeading,
  middleColHeading,
  rightColHeading,
}) {
  const [leftColumnList, setLeftColumnList] = useState([]);
  const [middleColumnList, setMiddleColumnList] = useState([]);
  const [rightColumnList, setRightColumnList] = useState([]);
  const profileId = useGlobalStore((state) => state.globalProfileData.id);
  const [searchDateCriteria, setSearchDateCriteria] = useState({
    invoice_start_date: formatDateYearMonthDay(startOfWeek(new Date())),
    invoice_end_date: formatDateYearMonthDay(endOfWeek(new Date())),
  });

  const [searchBarInput, setSearchBarInput] = useState();

  const {
    data: invoiceData,
    refetch: invoiceDataRefetch,
    isLoading,
  } = useFetchData(
    `/invoices/filteredView`,
    ["invoiceProgressPage", searchDateCriteria],
    { ...searchDateCriteria, profile_id: profileId }
  );
  const { setRefreshInvoiceData } = useInvoiceProgessComponent();
  const store = useInvoiceProgessComponent();
  function handleDateChange(date, key) {
    setSearchDateCriteria((prev) => ({
      ...prev,
      [key]: format(new Date(date), "yyyy-MM-dd"),
    }));
  }

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
      setRefreshInvoiceData(invoiceDataRefetch);
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

  return (
    <>
      <div className="w-full  h-fit p-2 min-h-full  bg-white">
        <div className="h-fit relative border shadow-md shadow-black/40 w-full mb-2 items-start justify-between flex px-3 pt-2 pb-3 ">
          <div className=" flex flex-col gap-3 ml-8  h-full w-1/3">
            <MobileDatePicker
              label="Start Date"
              onAccept={(date) => handleDateChange(date, "invoice_start_date")}
              value={new Date(searchDateCriteria.invoice_start_date)}
              format="yyyy-MM-dd"
              closeOnSelect={true}
              orientation="portrait"
              slotProps={{ textField: { variant: "standard" } }}
            />
            <MobileDatePicker
              label="End Date"
              onAccept={(date) => handleDateChange(date, "invoice_end_date")}
              value={new Date(searchDateCriteria.invoice_end_date)}
              format="yyyy-MM-dd"
              closeOnSelect={true}
              orientation="portrait"
              slotProps={{ textField: { variant: "standard" } }}
            />
            {invoiceData?.length || 0} invoices found
          </div>

          {progressFlag && (
            <div className=" w-2/3 flex justify-center ">
              <div className="">
                <h2 className="mb-2 select-none border-b  border-slate-400 ">
                  Search by name/surname, dates, or amount total/due
                </h2>
                <TextField
                  fullWidth={true}
                  type="text"
                  variant="outlined"
                  label="Search"
                  value={searchBarInput ?? ""}
                  onChange={(event) => setSearchBarInput(event.target.value)}
                />
              </div>
            </div>
          )}
          <CustomLinearProgressBar
            isLoading={isLoading}
            className="-bottom-1 left-0 w-full absolute"
          />
        </div>
        <div className="w-full flex    gap-5 ">
          <div className="bg-black w-1/3 flex items-center p-3 justify-between  text-white   ">
            <div className="relative">
              {leftColHeading}
              <div className="absolute -right-6 -top-2">
                <Badge label={store?.leftColCount || 0} />
              </div>
            </div>
            <p>
              {" "}
              {store?.leftColTotalAmount !== 0
                ? "R" + store?.leftColTotalAmount
                : null}
            </p>
          </div>
          <div className="bg-black  w-1/3 flex items-center p-3  justify-between text-white  ">
            <div className="relative">
              {middleColHeading}
              <div className="absolute -right-6 -top-2">
                <Badge label={store?.middleColCount || 0} />
              </div>
            </div>
            <p>
              {" "}
              {store?.middleColTotalAmount !== 0
                ? "R" + store?.middleColTotalAmount
                : null}
            </p>
          </div>
          <div className="bg-black  w-1/3 flex items-center p-3 justify-between  text-white   ">
            <div className="relative">
              {rightColHeading}
              <div className="absolute -right-6 -top-2">
                <Badge label={store?.rightColCount || 0} />
              </div>
            </div>
            <p>
              {" "}
              {store?.rightColTotalAmount !== 0
                ? "R" + store?.rightColTotalAmount
                : null}
            </p>
          </div>
        </div>
        <div></div>
        <div className="w-full flex  gap-5 ">
          <div className="w-1/3  h-fit  ">
            {" "}
            {leftColumnList
              ? leftColumnList.map((invoice) => (
                  <InvoiceDisplayCard
                    refetch={invoiceDataRefetch}
                    key={invoice.invoice_id}
                    invoiceData={invoice}
                  />
                ))
              : "No Invoices Found"}
          </div>
          <div className="w-1/3  h-fit ">
            {" "}
            {middleColumnList
              ? middleColumnList.map((invoice) => (
                  <InvoiceDisplayCard
                    refetch={invoiceDataRefetch}
                    key={invoice.invoice_id}
                    invoiceData={invoice}
                  />
                ))
              : "No Invoices Found"}
          </div>
          <div className="w-1/3  h-fit ">
            {rightColumnList
              ? rightColumnList.map((invoice) => (
                  <InvoiceDisplayCard
                    refetch={invoiceDataRefetch}
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
