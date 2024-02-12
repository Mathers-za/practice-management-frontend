import { useState } from "react";
import axios from "axios";

export default function AppointmentSearch({
  profileId,
  setResultsInAppPortal,
}) {
  const [searchParams, setSearchParams] = useState({});
  console.log(" profileId in appointment search is " + profileId);

  async function handleFilteredSearach(profileId, searchParams) {
    try {
      console.log(searchParams);
      const result = await axios.get(
        `http://localhost:4000/appointments/filter${profileId}`,
        {
          params: searchParams,
        }
      );

      console.log(
        "the format of the resulting data from the serach is " + result.data
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
        value={searchParams?.start_Date || null}
      />
      <input
        onChange={handleChange}
        type="date"
        name="end_date"
        value={searchParams?.end_Date || searchParams?.start_Date || null}
      />

      <button
        disabled={Object.keys(searchParams).length === 0}
        onClick={() => {
          handleFilteredSearach(profileId, searchParams);
          setSearchParams({});
        }}
      >
        {" "}
        Search{" "}
      </button>
    </>
  );
}
