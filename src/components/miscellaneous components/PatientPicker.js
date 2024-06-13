import { useEffect, useRef, useState } from "react";
import { useFetchData } from "../../CustomHooks/serverStateHooks";
import GenericTopBar from "./GenericTopBar";
import { IconButton, TextField } from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CreatePatient from "../Create and update Patient component/CreatePatient";
import { useGlobalStore } from "../../zustandStore/store";
import CustomLinearProgressBar from "./CustomLinearProgressBar";
export default function PatientPickerComponent({
  profileId,
  hideComponent,
  onclick,
  showTopBar = true,
  showAddPatientButton = {
    show: false,
    actionOnSave: false,
    hideComponent: false,
  },
}) {
  const { data: patientData, isLoading } = useFetchData(
    `/patients/viewAll${profileId}`,
    "listOfPatients"
  );
  const [forceRerender, setForceRender] = useState(false);
  const [searchBarInput, setSearchBarInput] = useState("");
  const [filteredSearch, setFilteredSearch] = useState([]);
  const [showCreatePatientPage, setShowCreatePatientPage] = useState(false);

  const showLength = useRef(10);

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
      {showTopBar && (
        <GenericTopBar label="Choose a Patient" onclick={hideComponent} />
      )}
      <div className="p-3">
        <div className=" flex gap-4">
          {showAddPatientButton.show && (
            <div className="self-center h-full">
              {" "}
              <IconButton
                onClick={() => setShowCreatePatientPage(!showCreatePatientPage)}
              >
                <PersonAddIcon />
              </IconButton>
            </div>
          )}
          <div className="w-full relative ">
            <TextField
              variant="filled"
              label="search"
              fullWidth
              value={searchBarInput || ""}
              type="text"
              name="searchBarInput"
              onChange={(event) => setSearchBarInput(event.target.value)}
              autoFocus={true}
              placeholder="Search according to name,surname,email or phone number"
            />
            <CustomLinearProgressBar
              isLoading={isLoading}
              className="absolute bottom-0 left-0 w-full"
            />
          </div>
        </div>

        <div className="mt-1 select-none  ">
          {filteredSearch.length > 0
            ? filteredSearch
                .sort((a, b) => a.first_name - b.first_name)
                .slice(0, showLength.current)
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
          {filteredSearch.length > showLength.current ? (
            <div
              onClick={() => {
                showLength.current = showLength.current + 10;
                setForceRender(!forceRerender);
              }}
              className="text-center text-lg  mt-1 hover:bg-slate-200"
            >
              Show More
            </div>
          ) : null}
        </div>
        {showCreatePatientPage && (
          <div className="fixed left-0 top-0 w-full h-screen z-20 bg-black/30 flex justify-center items-center">
            <div className="w-4/5 h-3/4 ">
              <CreatePatient
                actionOnSave={showAddPatientButton?.actionOnSave}
                hideComponent={() =>
                  setShowCreatePatientPage(!showCreatePatientPage)
                }
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
