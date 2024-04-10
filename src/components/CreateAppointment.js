import { useNavigate } from "react-router-dom";
import { useFetchData, usePostData } from "../CustomHooks/serverStateHooks";
import { useEffect, useState } from "react";
import { format, add, set, parse } from "date-fns";
import PatientPicker from "./Pages/PatientPickerPage";
import { checkAndSetIcds } from "../apiRequests/apiRequests";

function setDateAndTimes() {
  const currentDateAndTime = new Date();
  const formattedCurrentDate = format(currentDateAndTime, "yyyy-MM-dd");

  const currentTime = format(currentDateAndTime, "HH:mm");
  const endTime = format(add(currentDateAndTime, { minutes: 30 }), "HH:mm");

  return { formattedCurrentDate, endTime, currentTime };
}

export default function CreateAppointment({
  profileId,
  calendarSelectedJsDateTimeString,
}) {
  const { data } = useFetchData(
    `/appointmentTypes/viewAll${profileId}`,
    "appTypes"
  );

  const { formattedCurrentDate, currentTime, endTime } = setDateAndTimes();

  const navigate = useNavigate();
  const [appointment, setAppointment] = useState({
    appointment_date: calendarSelectedJsDateTimeString
      ? format(calendarSelectedJsDateTimeString, "yyyy-MM-dd")
      : formattedCurrentDate,
    start_time: calendarSelectedJsDateTimeString
      ? format(calendarSelectedJsDateTimeString, "HH:mm")
      : currentTime,
    end_time: calendarSelectedJsDateTimeString
      ? format(set(calendarSelectedJsDateTimeString, { minutes: 30 }), "HH:mm")
      : null,
  });

  const [showPatientPicker, setShowPatientPicker] = useState(false);

  const { createMutation } = usePostData("/appointments/createAppointment");

  function handleChange(e) {
    const { name, value } = e.target;

    setAppointment((prev) => ({
      ...prev,

      [name]: value,
    }));

    if (name === "start_time" || name === "end_time") {
      setAppointment((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  }

  useEffect(() => {
    if (data && data.length > 0) {
      setAppointment((prev) => ({
        ...prev,
        appointment_type_id: data[0].id,
      }));
    }
  }, [data]);

  function handleAppointmentTypeChange(appointmentTypeId) {
    const selectedAppointmentType = data.find(
      (element) => element.id == appointmentTypeId
    );

    if (selectedAppointmentType) {
      setAppointment((prev) => ({
        ...prev,
        appointment_type_id: selectedAppointmentType.id,
        end_time: format(
          add(parse(prev.start_time, "HH:mm", prev.appointment_date), {
            minutes: selectedAppointmentType?.duration || 0,
          }),
          "HH:mm"
        ),
      }));
    }
  }

  function handlePatientPickerOnclick(id, patientFirstName, patientLastName) {
    setAppointment((prev) => ({
      ...prev,
      patient_id: id,
      patientFullName: patientFirstName + " " + patientLastName,
    }));
    setShowPatientPicker(false);
  }

  return (
    <>
      {!showPatientPicker ? (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const result = await createMutation.mutateAsync(appointment);
            await checkAndSetIcds(result.id, result.appointment_type_id);
          }}
        >
          {data ? (
            <select
              required={true}
              onChange={(event) =>
                handleAppointmentTypeChange(parseInt(event.target.value))
              }
              name="appointment_type_id"
              id="apptype"
            >
              {data
                ?.sort((a, b) => a.id - b.id)
                .map((appType) => {
                  return (
                    <option key={appType?.id} value={appType.id}>
                      {appType?.appointment_name}
                    </option>
                  );
                })}
            </select>
          ) : (
            <div onClick={() => navigate("createAppointmentType")}>
              No appointment types to display. Click here to create.
            </div>
          )}

          <input
            onChange={handleChange}
            type="date"
            value={appointment?.appointment_date}
            name="appointment_date"
          />

          <div>
            <label htmlFor="startTime">
              Start Time
              <input
                required
                onChange={handleChange}
                type="time"
                name="start_time"
                id="startTime"
                value={appointment.start_time}
              />
            </label>
            <label htmlFor="endTime">
              End time{" "}
              <input
                onChange={handleChange}
                type="time"
                name="end_time"
                id="endTime"
                value={appointment.end_time}
              />
            </label>
          </div>

          <div onClick={() => setShowPatientPicker(true)}>
            {appointment?.patientFullName ?? "Select Patient"}
          </div>

          <button
            type="onSubmit"
            disabled={Object.keys(appointment).length === 0}
          >
            Save
          </button>
        </form>
      ) : (
        <PatientPicker
          onclick={handlePatientPickerOnclick}
          profileId={profileId}
        />
      )}
    </>
  );
}
