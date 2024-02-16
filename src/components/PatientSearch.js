import { useFetchData } from "../CustomHooks/serverStateHooks";
import { useEffect, useState } from "react";

export default function PatientSearch({ profileId, onclick }) {
  const { data, httpStatus, isLoading } = useFetchData(
    `/patients/viewAll${profileId}`,
    "listOfPatients"
  );

  const [input, setInput] = useState();
  const [incrementByFive, setIncrementbyFive] = useState(5);
  const [filteredList, setFilteredList] = useState([]);

  useEffect(() => {
    if (httpStatus === 200) {
      setFilteredList(data);
    }
  }, [data, httpStatus]);

  function handleSearchBarChange(event) {
    const value = event.target.value;
    setInput(value);

    if (httpStatus && data && httpStatus === 200 && data?.length > 0) {
      setFilteredList(
        data?.filter((patient) => {
          return (
            patient.first_name?.toLowerCase().includes(value.toLowerCase()) ||
            patient.last_name?.toLowerCase().includes(value.toLowerCase())
          );
        })
      );
    }
  }

  function loadMore() {
    setIncrementbyFive((prev) => prev + 5);
  }

  return (
    <>
      <input
        onChange={handleSearchBarChange}
        type="text"
        placeholder="SearchBar"
        value={input}
      />

      {filteredList && !isLoading && filteredList.length > 0 ? (
        filteredList.slice(0, incrementByFive + 1).map((patient) => (
          <div
            onClick={() => {
              onclick(patient.id, patient.first_name, patient.last_name);
            }}
            key={patient.id}
          >
            {patient.first_name} {patient.last_name} {patient.id}
          </div>
        ))
      ) : (
        <div>No data to display - try creating some patients</div>
      )}

      <div onClick={loadMore}>LoadMore</div>
    </>
  );
}
