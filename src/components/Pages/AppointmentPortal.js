import { useEffect, useRef, useState } from "react";
import AppointmentSearch from "../AppointmentSearch";
import AppointmentCard from "./AppointmentCard&Dropdown/AppointmentCard.js";
import "./appointmentPortal.css";
export default function AppointmentPortal({ profileId }) {
  const [searchResultsForDisplay, setSearchResultsForDisplay] = useState([]);
  const [overlayActive, setOverlayActive] = useState(false);

  function setSearchResults(result) {
    setSearchResultsForDisplay(result);
  }
  useEffect(() => {
    if (overlayActive) {
      document.body.classList.add("overlay-active");
    } else {
      document.body.classList.remove("overlay-active");
    }
  }, [overlayActive]);

  function setOverlayFlag() {
    setOverlayActive(!overlayActive);
  }

  return (
    <>
      <AppointmentSearch
        profileId={profileId}
        setResultsInAppPortal={setSearchResults}
      />

      {searchResultsForDisplay &&
      Object.keys(searchResultsForDisplay).length > 0 ? (
        searchResultsForDisplay.map((result) => {
          return (
            <AppointmentCard
              key={result?.appointment_id}
              {...result}
              setOverlayFlag={setOverlayFlag}
            />
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
