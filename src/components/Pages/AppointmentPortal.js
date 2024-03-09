import { useEffect, useState } from "react";
import AppointmentSearch from "../AppointmentSearch";
import AppointmentCard from "./AppointmentCard&Dropdown/AppointmentCard.js";
import "./appointmentPortal.css";
import axios from "axios";
import { useAppointmentPortalStore } from "../../zustandStore/store.js";
export default function AppointmentPortal({ profileId }) {
  const [searchResultsForDisplay, setSearchResultsForDisplay] = useState([]);
  const [overlayActive, setOverlayActive] = useState(false);
  const appointmentsThathaveInvoices = useAppointmentPortalStore(
    (state) => state.appointmentsThathaveInvoices
  );
  const setAppointmentsThatHaveInvoices = useAppointmentPortalStore(
    (state) => state.setAppsThatHaveInvoices
  );
  async function setSearchResults(result) {
    setSearchResultsForDisplay(result);
    const arrayOfAppIds = result.map((result) => result.appointment_id); ///////add zustand function here to replace state

    const { data } = await axios.get(
      `http://localhost:4000/invoices/batchview`,
      {
        params: { appIds: arrayOfAppIds },
      }
    );

    setAppointmentsThatHaveInvoices(data);
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
              appointmentsWithInvoicesRef={appointmentsThathaveInvoices}
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
