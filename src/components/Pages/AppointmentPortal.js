import { useState } from "react";
import AppointmentSearch from "../AppointmentSearch";

import AppointmentCard from "./AppointmentCard&Dropdown/AppointmentCard.js";

export default function AppointmentPortal({ profileId }) {
  const [searchResultsForDisplay, setSearchResultsForDisplay] = useState([]);

  function SetSearchResults(result) {
    setSearchResultsForDisplay(result);
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
          return <AppointmentCard key={result?.appointment_id} {...result} />;
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
