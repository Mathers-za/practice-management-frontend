import { useState } from "react";
import axios from "axios";
import { endOfMonth, format, startOfMonth } from "date-fns";

import { Button, Select, TextField } from "@mui/material";
import CustomDatePicker from "./miscellaneous components/DateRangePicker";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";

export default function AppointmentSearch({
  profileId,
  setResultsInAppPortal,
}) {
  const [searchParams, setSearchParams] = useState({
    start_date: startOfMonth(new Date()),
    end_date: endOfMonth(new Date()),
  });
  const [filterBy, setFilterBy] = useState("patients.first_name");

  async function handleFilteredSearach(profileId, searchParams) {
    try {
      const result = await axios.get(
        `http://localhost:4000/appointments/filter${profileId}`,
        {
          params: searchParams,
        }
      );

      setResultsInAppPortal(result.data);
    } catch (error) {
      console.error(error);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;

    setSearchParams((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  return (
    <>
      <div className="flex flex-col h-full justify-evenly  min-h-full w-64 bg-slate-400 p-2 space-y-4   ">
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
          <FormControl variant="outlined" size="small" sx={{ width: "12rem" }}>
            <InputLabel id="select">Search by</InputLabel>
            <Select
              variant="outlined"
              labelId="select"
              value={filterBy}
              label="Search by"
              onChange={(event) => {
                setFilterBy(event.target.value);
              }}
            >
              <MenuItem value={"patients.first_name"}>First Name</MenuItem>
              <MenuItem value={"patients.last_name"}>Last Name</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            variant="standard"
            onChange={handleChange}
            type="text"
            name={filterBy}
            label="search"
            value={
              searchParams?.patients?.first_name ||
              searchParams?.patients?.last_name ||
              null
            }
          />
        </div>
        <div className=" flex items-end h-full">
          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={() => {
              handleFilteredSearach(profileId, searchParams);
              setSearchParams({
                start_date: searchParams.start_date,
                end_date: searchParams.end_date,
              });
            }}
          >
            Search
          </Button>
        </div>
      </div>
    </>
  );
}
