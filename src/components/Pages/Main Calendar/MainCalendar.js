import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";

import { useEffect, useState } from "react";

import CreateAppointment from "../../Appointment components/CreateAppointment.js";
import { AnimatePresence, motion } from "framer-motion";

import MainOptionsMenu from "../../Main Options/MainOptionsMenu.js";
import {
  getCombinedDateAndTime,
  getStartAndEndDatesOfCurrentWeek,
} from "./mainCalendarHelperFns.js";
import { useGlobalStore } from "../../../zustandStore/store.js";
import { useFetchData } from "../../../CustomHooks/serverStateHooks.js";

export default function MainCalendar({ profileId }) {
  const { startOfWeekDate, endOfWeekDate } =
    getStartAndEndDatesOfCurrentWeek("yyyy-MM-dd");
  const [searchDates, setSearchDates] = useState({
    start_date: startOfWeekDate,
    end_date: endOfWeekDate,
  });

  const { data: appointmentData } = useFetchData(
    `/appointments/filter${profileId}`,
    ["mainCalendar", searchDates],
    searchDates
  );

  const {
    setGlobalAppointmentData,
    setGlobalPatientData,
    setGlobalAppointmentTypeData,
    setGlobalFinancialData,
    setGlobalInvoiceData,
  } = useGlobalStore();

  const [selectedEvent, setSelectedEvent] = useState();
  const [jsDateString, setJsDateString] = useState();

  const [showDropDownMenu, setShowDropDownMenu] = useState(false);
  const [
    showShowAppointmentCreationComponent,
    setShowAppointmentCreationComponent,
  ] = useState(false);
  const [calendarEvents, setCalendarEvents] = useState([]);

  useEffect(() => {
    if (appointmentData) {
      const calendarEventsArray = appointmentData.map((appointment) => {
        return {
          title: `${appointment.patient_first_name} ${
            appointment.patient_last_name || ""
          }`,

          id: appointment.appointment_id,

          start: getCombinedDateAndTime(
            appointment.appointment_date,
            appointment.start_time
          ),

          end: getCombinedDateAndTime(
            appointment.appointment_date,
            appointment.end_time
          ),

          appointmentData: appointment,
        };
      });

      setCalendarEvents(calendarEventsArray);
    }
  }, [appointmentData]);

  function handleEmptyCellClick(dateAndTimeOfClickedCell) {
    setJsDateString(dateAndTimeOfClickedCell);
    setShowAppointmentCreationComponent(!showShowAppointmentCreationComponent);
  }
  function handleEventClick(eventId) {
    const event = calendarEvents.find(
      (event) => event.id === parseInt(eventId)
    );
    setGlobalAppointmentData({
      appointment_date: event.appointmentData.appointment_date,
      start_time: event.appointmentData.start_time,
      end_time: event.appointmentData.end_time,
      id: event.appointmentData.appointment_id,
    });
    setGlobalFinancialData({
      amount_due: event.appointmentData.amount_due,
      total_amount: event.appointmentData.total_amount,
      amount_paid: event.appointmentData.amount_paid,
    });

    setGlobalPatientData({
      first_name: event.appointmentData.patient_first_name,
      last_name: event.appointmentData.patient_last_name,
      id: event.appointmentData.patient_id,
    });

    setGlobalAppointmentTypeData({
      appointment_name: event.appointmentData.appointment_name,
      id: event.appointmentData.apptype_id,
    });

    setGlobalInvoiceData({
      invoice_status: event.appointmentData.invoice_status,
      invoice_title: event.appointmentData.invoice_title,
    });

    setSelectedEvent(event);
    setShowDropDownMenu(!showDropDownMenu);
  }

  async function handleDateSet(dateSetInfoObj) {
    setSearchDates({
      start_date: dateSetInfoObj.startStr,
      end_date: dateSetInfoObj.endStr,
    });
  }

  function handleEventCssCustomization(eventInfo) {
    const amountDue = eventInfo.event.extendedProps.appointmentData.amount_due;
    console.log(amountDue);

    return (
      <div
        className={`flex h-full ${
          parseFloat(amountDue) <= 0 ? "bg-green-500" : null
        } w-full gap-1 px-1 text-xs m-0 p-0 text-white  `}
      >
        <p>{eventInfo.timeText}</p>
        <p> {eventInfo.event.title}</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white p-3 ">
        <FullCalendar
          eventContent={(eventInfo) => handleEventCssCustomization(eventInfo)}
          displayEventEnd={true}
          displayEventTime={true}
          buttonHints={true}
          eventColor="#0284C7"
          nowIndicator={true}
          plugins={[timeGridPlugin, interactionPlugin, dayGridPlugin]}
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
              queryKeyToInvalidate={["mainCalendar", searchDates]}
              hideComponent={() => setShowDropDownMenu(!showDropDownMenu)}
              profileId={profileId}
              patientId={selectedEvent.appointmentData.patient_id}
              appointment_id={selectedEvent.appointmentData.appointment_id}
              appointmentTypeId={selectedEvent.appointmentData.apptype_id}
            />
          </motion.div>
        )}
      </AnimatePresence>
      {showShowAppointmentCreationComponent && (
        <div className="z-10 fixed top-0 left-0 w-full h-screen bg-black/30 flex justify-center items-center">
          {" "}
          <div className="w-full h-full">
            <CreateAppointment
              querykeyToInvalidate={["mainCalendar", searchDates]}
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
