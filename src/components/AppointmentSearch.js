import { useRef, useState } from "react";
import axios from "axios";
import { endOfMonth, format, startOfMonth } from "date-fns";

import { Button, TextField } from "@mui/material";
import CustomDatePicker from "./miscellaneous components/DateRangePicker";

import AppointmentFilterSearchList from "../AppointmentFilterSearchList";
import { useQueryClient } from "react-query";

export default function AppointmentSearch({ profileId }) {
  const [showAppointmentList, setShowAppointmentList] = useState(false);
  const [searchParams, setSearchParams] = useState({
    start_date: format(startOfMonth(new Date()), "yyyy-MM-dd"),
    end_date: format(endOfMonth(new Date()), "yyyy-MM-dd"),
  });
  const [filter, setFilter] = useState({});

  //FIXME Bug when tring to serach once a search is already done

  async function handleSubmit() {
    setFilter(searchParams);
    setShowAppointmentList(true);
  }

  function handleSearchBarChange(event) {
    const { name, value } = event.target;
    setSearchParams((prev) => ({
      ...prev,
      [name]: value === "" ? undefined : value,
    }));
  }

  return (
    <>
      <div className=" h-full w-full   flex">
        <div className="flex flex-col justify-evenly   min-h-full min-w-72 max-w-72 bg-slate-400 p-2 space-y-4   ">
          <h1 className="text-lg  ">Appointment Search </h1>
          <div className="border-t border-b  border-black space-y-6 py-7 ">
            <h2 className="mb-2">Filter by start and end dates</h2>
            <CustomDatePicker
              label="Start Date"
              onchange={(startDate) => {
                setSearchParams((prev) => ({
                  ...prev,
                  start_date: format(new Date(startDate), "yyyy-MM-dd"),
                }));
              }}
              value={searchParams?.start_date}
            />{" "}
            <CustomDatePicker
              label="End Date"
              onchange={(endDate) => {
                setSearchParams((prev) => ({
                  ...prev,
                  end_date: format(new Date(endDate), "yyyy-MM-dd"),
                }));
              }}
              value={searchParams?.end_date}
            />
          </div>

          <div className="   space-y-4">
            <h2>Filter by patient identity</h2>

            <TextField
              fullWidth
              variant="standard"
              onChange={handleSearchBarChange}
              type="text"
              label="search"
              value={searchParams?.searchSubString || ""}
              name="searchSubString"
              helperText="Search by first name,last name, email or phone number. Search is case sensitive"
            />
          </div>
          <div className=" flex items-end h-full">
            <Button
              onClick={handleSubmit}
              variant="contained"
              size="large"
              fullWidth
              type="button"
            >
              Search
            </Button>
          </div>
        </div>
        {showAppointmentList && (
          <div className="w-full h-full">
            <AppointmentFilterSearchList
              profileId={profileId}
              params={filter}
            />
          </div>
        )}
      </div>
    </>
  );
}
