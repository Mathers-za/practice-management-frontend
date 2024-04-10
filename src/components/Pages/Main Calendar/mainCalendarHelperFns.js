import { startOfWeek, endOfWeek, format, set } from "date-fns";
import axios from "axios";

export function getStartAndEndDatesOfCurrentWeek(dateFormat = "yyyy-MM-dd") {
  // dateFormat:datefnsformatstring
  const currentDate = new Date();
  const startOfWeekDate = format(
    startOfWeek(currentDate, { weekStartsOn: 0 }),
    dateFormat
  );
  const endOfWeekDate = format(
    endOfWeek(currentDate, { weekStartsOn: 0 }),
    dateFormat
  );

  return { startOfWeekDate, endOfWeekDate };
}

export function getCombinedDateAndTime(date, time) {
  //date:string:string|date object, time:string in HH:mm:SS format
  if (time) {
    const [hours, minutes, seconds] = time
      .split(":")
      .map((element) => parseInt(element));
    const combinedDateAndTime = set(date, { hours, minutes, seconds });
    return combinedDateAndTime;
  }
}

export async function fetchAppointmentDataForCalendar(
  profileId,
  paramsPlainObject
) {
  const { data } = axios.get(
    `http://localhost:4000/appointments/filter${profileId}`,
    { withCredentials: true, params: paramsPlainObject }
  );
  return data;
}

export async function populateEventsArrayForCalendarDisplay(
  profileId,
  startOfWeekDate,
  endOfWeekDate,
  callback
) {
  const { data: appointmentData } = await axios.get(
    `http://localhost:4000/appointments/filter${profileId}`,
    {
      withCredentials: true,
      params: {
        start_date: format(startOfWeekDate, "yyyy-MM-dd"),
        end_date: format(endOfWeekDate, "yyyy-MM-dd"),
      },
    }
  );

  const eventsArray = appointmentData.map((appointment) => {
    return {
      title: `${appointment.patient_first_name} ${appointment.patient_last_name}`,

      start: getCombinedDateAndTime(
        appointment.appointment_date,
        appointment.start_time
      ),
      end: getCombinedDateAndTime(
        appointment.appointment_date,
        appointment.end_time
      ),
      id: appointment.appointment_id,

      profileId: appointment.profile_id,
      patientId: appointment.patient_id,
      appointmentId: appointment.appointment_id,
      appointmentTypeId: appointment.apptype_id,
    };
  });
  callback(eventsArray);
}
