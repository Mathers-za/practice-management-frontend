import { useState } from "react";
import AppointmentSearch from "../AppointmentSearch";
import { format } from "date-fns";
export default function AppointmentPortal({ profileId }) {
  const [searchResultsForDisplay, setSearchResultsForDisplay] = useState();

  function SetSearchResults(result) {
    setSearchResultsForDisplay(result);
    console.log("the result paased over by the search", result);
  }

  return (
    <>
      <AppointmentSearch
        profileId={profileId}
        setResultsInAppPortal={SetSearchResults}
      />

      {searchResultsForDisplay &&
      Object.keys(searchResultsForDisplay).length > 0 ? (
        searchResultsForDisplay.map((result) => {
          return (
            <div style={{ marginTop: "5px" }} key={result.id}>
              patient: {result.patient_first_name} {result.patient_last_name}{" "}
              <br />
              Practitioner: {result.practitioner_first_name}{" "}
              {result.practitioner_last_name} <br />
              Date/Time:{" "}
              {format(new Date(result.appointment_date), "eee d yyyy")} <br />
              appointment Type: {result.appointment_name}
            </div>
          );
        })
      ) : (
        <div>
          {" "}
          No data to display. Try searching by Appointment Date or Patient
          name/surname
        </div>
      )}
    </>
  );
}
