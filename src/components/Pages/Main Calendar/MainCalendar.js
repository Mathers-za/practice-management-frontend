import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useEffect, useRef, useState } from "react";

import CreateAppointment from "../../CreateAppointment.js";

import MainOptionsMenu from "../../Main Options/MainOptionsMenu.js";
import {
  getStartAndEndDatesOfCurrentWeek,
  populateEventsArrayForCalendarDisplay,
} from "./mainCalendarHelperFns.js";

export default function MainCalendar({ profileId }) {
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
      {showDropDownMenu && (
        <MainOptionsMenu
          profileId={profileId}
          patientId={selectedEvent.patientId}
          appointment_id={selectedEvent.appointmentId}
          appointmentTypeId={selectedEvent.appointmentTypeId}
        />
      )}
      {showShowAppointmentCreationComponent && (
        <CreateAppointment
          profileId={profileId}
          calendarSelectedJsDateTimeString={jsDateString}
        />
      )}
    </>
  );
}
