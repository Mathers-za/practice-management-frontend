import { useEffect, useRef, useState } from "react";
import AppointmentSearch from "../AppointmentSearch";
import AppointmentCard from "./AppointmentCard&Dropdown/AppointmentCard.js";

export default function AppointmentPortal({ profileId }) {
  const [searchResultsForDisplay, setSearchResultsForDisplay] = useState([]);

  function setSearchResults(result) {
    setSearchResultsForDisplay(result);
  }
  useEffect(() => {
    console.log(
      "serach results for display to be passed down to appointment card is " +
        searchResultsForDisplay
    );
  }, [searchResultsForDisplay]);

  return (
    <>
      <AppointmentSearch
        profileId={profileId}
        setResultsInAppPortal={setSearchResults}
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
