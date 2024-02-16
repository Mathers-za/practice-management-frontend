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

    if (value !== null) {
      setSearchParams((prev) => ({
        ...prev,

        [name]: value,
      }));
    }
  }

  return (
    <>
      <label>
        Serach by first Name or Surname
        <input
          onChange={handleChange}
          type="text"
          name="name"
          placeholder="Search by Name"
          value={searchParams?.name || null}
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
