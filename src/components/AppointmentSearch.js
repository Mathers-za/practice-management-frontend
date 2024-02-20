import { useState } from "react";
import axios from "axios";
import { format, startOfMonth, endOfMonth } from "date-fns";

export default function AppointmentSearch({
  profileId,
  setResultsInAppPortal,
}) {
  const [searchParams, setSearchParams] = useState({
    start_date: format(startOfMonth(new Date()), "yyyy-MM-dd"),
    end_date: format(endOfMonth(new Date()), "yyyy-MM-dd"),
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
      {" "}
      <label>
        Filter By
        <select
          value={filterBy}
          onChange={(event) => {
            setFilterBy(event.target.value);
            setSearchParams({
              start_date: searchParams.start_date,
              end_date: searchParams.end_date,
            });
          }}
        >
          <option value="patients.first_name">First Name</option>
          <option value="patients.last_name">Last Name</option>
        </select>
      </label>
      <label>
        Serach by first Name or Surname
        <input
          onChange={handleChange}
          type="text"
          name={filterBy}
          placeholder="Search by Name"
          value={
            searchParams?.patients?.first_name ||
            searchParams?.patients?.last_name ||
            null
          }
        />
      </label>
      <input
        onChange={handleChange}
        type="date"
        name="start_date"
        value={searchParams?.start_date || null}
      />
      <input
        onChange={handleChange}
        type="date"
        name="end_date"
        value={searchParams?.end_date || null}
      />
      <button
        onClick={() => {
          handleFilteredSearach(profileId, searchParams);
          setSearchParams({
            start_date: searchParams.start_date,
            end_date: searchParams.end_date,
          });
        }}
      >
        {" "}
        Search{" "}
      </button>
    </>
  );
}
