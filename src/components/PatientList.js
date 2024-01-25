import { useEffect, useState } from "react";
import axiosRequest from "../apiRequests/apiRequests";
import { useNavigate } from "react-router-dom";

export default function PatientList({ profileId }) {
  const [patientList, setPatientList] = useState([]);
  const [filteredList, setFilteredList] = useState();
  const [incrementByFive, setIncrementbyFive] = useState(5);

  const navigate = useNavigate();

  useEffect(() => {
    async function getAllPatients() {
      try {
        const response = await axiosRequest(
          "get",
          `/patients/viewAll${profileId}`
        );

        if (response.status === 200) {
          setPatientList(response.data.data);
        }
      } catch (error) {
        console.error(error);
      }
    }
    getAllPatients();
  }, []);

  function handleClick() {
    navigate("/patientPage");
  }

  function handleSearchBarChange(event) {
    const value = event.target.value;

    setFilteredList(
      patientList.filter((patient) => {
        return (
          patient.first_name.toLowerCase().includes(value.toLowerCase()) ||
          patient.last_name.toLowerCase().includes(value.toLowerCase())
        );
      })
    );
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

      {filteredList && filteredList.length > 0 ? (
        filteredList.slice(0, incrementByFive + 1).map((patient) => {
          return (
            <div key={patient.id} profileId={patient.profile_id}>
              {patient.first_name} {patient.last_name}
            </div>
          );
        })
      ) : (
        <div>No data. Try creating some patients</div>
      )}

      <div onClick={loadMore}>LoadMore</div>
    </>
  );
}
