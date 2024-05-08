import { useState } from "react";
import axios from "axios";
import { endOfMonth, format, startOfMonth } from "date-fns";

import { Button, Select, TextField } from "@mui/material";
import CustomDatePicker from "./miscellaneous components/DateRangePicker";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import AppointmentFilterSearchList from "../AppointmentFilterSearchList";
import { useQueryClient } from "react-query";

export default function AppointmentSearch({ profileId }) {
  const [showAppointmentList, setShowAppointmentList] = useState(false);
  const [searchParams, setSearchParams] = useState({
    start_date: format(startOfMonth(new Date()), "yyyy-MM-dd"),
    end_date: format(endOfMonth(new Date()), "yyyy-MM-dd"),
  });

  const queryClient = useQueryClient();

  const [searchBarInput, setSearchBarInput] = useState("");
  const [selectedOption, setSelectedOption] = useState("patient.first_name");

  function handleSubmit() {
    setShowAppointmentList(!!showAppointmentList);
    queryClient.invalidateQueries("appointmentFilterList");
  }

  function handleSearchBarChange(event) {
    const { value } = event.target;

    setSearchBarInput(value);

    setSearchParams((prev) => ({
      ...prev,
      [selectedOption]: value,
    }));
  }

  return (
    <>
      <div className=" h-full w-full flex">
        <div className="flex flex-col justify-evenly h-full w-80 bg-slate-400 p-2 space-y-4   ">
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
            <FormControl
              variant="outlined"
              size="small"
              sx={{ width: "12rem" }}
            >
              <InputLabel id="select">Search by</InputLabel>
              <Select
                value={selectedOption}
                variant="outlined"
                labelId="select"
                label="Search by"
                onChange={(event) => {
                  setSearchBarInput();
                  setSelectedOption(event.target.value);
                  setSearchParams((prev) => ({
                    start_date: prev.start_date,
                    end_date: prev.end_date,
                  }));
                }}
              >
                <MenuItem value={"patients.first_name"}>First Name</MenuItem>
                <MenuItem value={"patients.last_name"}>Last Name</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              variant="standard"
              onChange={handleSearchBarChange}
              type="text"
              label="search"
              value={searchBarInput || ""}
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
              params={searchParams}
            />
          </div>
        )}
      </div>
    </>
  );
}
