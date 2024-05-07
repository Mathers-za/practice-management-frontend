import { useEffect, useState } from "react";
import { useFetchData } from "../../CustomHooks/serverStateHooks";
import GenericTopBar from "./GenericTopBar";
import { TextField } from "@mui/material";

export default function PatientPicker({ profileId, hideComponent, onclick }) {
  const { data: patientData } = useFetchData(
    `/patients/viewAll${profileId}`,
    "listOfPatients"
  );

  const [searchBarInput, setSearchBarInput] = useState("");
  const [filteredSearch, setFilteredSearch] = useState([]);
  const [showLength, setShowLength] = useState(10);

  useEffect(() => {
    if (patientData) {
      setFilteredSearch(patientData);
    }
  }, [patientData]);
  useEffect(() => {
    if (searchBarInput && patientData) {
      const filteredList = patientData.filter((patient) => {
        return Object.values(patient).some((value) => {
          if (value && value !== null && typeof value !== "boolean") {
            return value
              .toString()
              .toLowerCase()
              .includes(searchBarInput.toLowerCase());
          } else return false;
        });
      });
      setFilteredSearch(filteredList);
    }
  }, [searchBarInput]);

  return (
    <>
      <GenericTopBar label="Choose a Patient" onclick={hideComponent} />
      <div className="p-3 overflow-y-scroll ">
        <TextField
          variant="filled"
          label="search"
          fullWidth
          value={searchBarInput || ""}
          type="text"
          name="searchBarInput"
          onChange={(event) => setSearchBarInput(event.target.value)}
          autoFocus={true}
          helperText=" Search according to name,surname,email or phone number"
        />

        <div className="mt-6 select-none overflow-y-scroll ">
          {filteredSearch.length > 0
            ? filteredSearch
                .sort((a, b) => a.first_name - b.first_name)
                .slice(0, showLength)
                .map((patient) => (
                  <div
                    key={patient.id}
                    className="border-b group border-slate-300 flex  items-center font-semibold px-3 py-2 hover:bg-slate-100 ease-in-out duration-[20ms]"
                    onClick={() => onclick(patient)}
                  >
                    {patient?.first_name || ""} {patient?.last_name || ""}
                    <p className="text-xs ml-1 hidden  text-slate-500 group-hover:block ">{`${
                      patient?.contact_number || ""
                    }/${patient?.email}`}</p>
                  </div>
                ))
            : "No content to display. Please create a patient"}
          {filteredSearch.length > showLength ? (
            <div
              onClick={() => setShowLength((prev) => prev + 10)}
              className="text-center text-lg hover:bg-slate-200"
            >
              Load More //FIXME async problem with this. fix with useref and
              force render
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}
