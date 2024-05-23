import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useEffect, useRef, useState } from "react";

import CreateAppointment from "../../Appointment components/CreateAppointment.js";
import { AnimatePresence, motion } from "framer-motion";

import MainOptionsMenu from "../../Main Options/MainOptionsMenu.js";
import {
  fetchAppointmentDataForCalendar,
  getStartAndEndDatesOfCurrentWeek,
  populateEventsArrayForCalendarDisplay,
} from "./mainCalendarHelperFns.js";
import { fetchData } from "../financialsViewPortal/paymentsList/paymentsListHelperFns.js";
import { useFetchData } from "../../../CustomHooks/serverStateHooks.js";

export default function MainCalendar({ profileId }) {
  const {} = useFetchData(`/appointments/filter${profileId}`, ["mainCalendar"]);
  const { startOfWeekDate, endOfWeekDate } =
    getStartAndEndDatesOfCurrentWeek("yyyy-MM-dd");

  const [selectedEvent, setSelectedEvent] = useState();
  const [jsDateString, setJsDateString] = useState();
  const selectEventRef = useRef();
  const [showDropDownMenu, setShowDropDownMenu] = useState(false);
  const [
    showShowAppointmentCreationComponent,
    setShowAppointmentCreationComponent,
  ] = useState(false);
  const [calendarEvents, setCalendarEvents] = useState([]);

  useEffect(() => {
    (async () => {
      await populateEventsArrayForCalendarDisplay(
        profileId,
        startOfWeekDate,
        endOfWeekDate,
        setCalendarEvents
      );
    })();
  }, []);

  function handleEmptyCellClick(dateAndTimeOfClickedCell) {
    setJsDateString(dateAndTimeOfClickedCell);
    setShowAppointmentCreationComponent(!showShowAppointmentCreationComponent);
  }
  function handleEventClick(eventId) {
    const event = calendarEvents.find(
      (event) => event.appointmentId === parseInt(eventId)
    );
    setSelectedEvent(event);
    setShowDropDownMenu(!showDropDownMenu);
  }

  async function handleDateSet(dateSetInfoObj) {
    await populateEventsArrayForCalendarDisplay(
      profileId,
      dateSetInfoObj.start,
      dateSetInfoObj.end,
      setCalendarEvents
    );
  }

  console.log(selectedEvent);

  return (
    <>
      <div>
        <FullCalendar
          plugins={[timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          events={calendarEvents && calendarEvents}
          dayHeaderFormat={{
            weekday: "short",
            month: "short",
            day: "2-digit",
          }}
          dateClick={(dateInfo) => handleEmptyCellClick(dateInfo.date)}
          headerToolbar={{
            left: "prev,next",
            center: "title",
            right: "today,timeGridWeek,timeGridDay",
          }}
          datesSet={(dateSetInfo) => {
            handleDateSet(dateSetInfo);
          }}
          eventClick={(eventInfo) => handleEventClick(eventInfo.event.id)}
          timeZone="local"
          allDaySlot={false}
        />
      </div>
      <AnimatePresence>
        {showDropDownMenu && (
          <motion.div
            initial={{ height: "0%" }}
            animate={{ height: "auto" }}
            exit={{ height: "0%" }}
            className="fixed bottom-0 left-0 w-full h-fit z-10"
          >
            <MainOptionsMenu
              hideComponent={() => setShowDropDownMenu(!showDropDownMenu)}
              profileId={profileId}
              patientId={selectedEvent.patientId}
              appointment_id={selectedEvent.appointmentId}
              appointmentTypeId={selectedEvent.appointmentTypeId}
            />
          </motion.div>
        )}
      </AnimatePresence>
      {showShowAppointmentCreationComponent && (
        <div className="z-10 fixed top-0 left-0 w-full h-screen bg-black/30 flex justify-center items-center">
          {" "}
          <div className="w-full h-full">
            <CreateAppointment
              hideComponent={() =>
                setShowAppointmentCreationComponent(
                  !showShowAppointmentCreationComponent
                )
              }
              profileId={profileId}
              calendarSelectedJsDateTimeString={jsDateString}
            />
          </div>
        </div>
      )}
    </>
  );
}
