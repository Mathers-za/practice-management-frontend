import { useNavigate } from "react-router-dom";
import { useFetchData, usePostData } from "../CustomHooks/serverStateHooks";
import { useState } from "react";
import { format, add } from "date-fns";
import PatientPicker from "./Pages/PatientPickerPage";

function setDateAndTimes() {
  const currentDate = format(new Date(), "yyyy-MM-dd");

  const currentTime = format(new Date(), "HH:mm");
  const endTime = format(add(new Date(), { minutes: 30 }), "HH:mm");

  return { currentDate, endTime, currentTime };
}

export default function CreateAppointment({ profileId }) {
  const { data } = useFetchData(
    `/appointmentTypes/viewAll${profileId}`,
    "appTypes"
  );

  const { currentDate, currentTime, endTime } = setDateAndTimes();

  const navigate = useNavigate();
  const [appointment, setAppointment] = useState({
    appointment_date: currentDate,
  });

  const [showPatientPicker, setShowPatientPicker] = useState(false);

  const { createMutation } = usePostData("/appointments/createAppointment");

  function handleChange(e) {
    const { name, value } = e.target;

    setAppointment((prev) => ({
      ...prev,

      [name]: value,
    }));
    if (name === "appointment_type_id") {
      setAppointment((prev) => ({
        ...prev,
        appointment_type_id: parseInt(value),
      }));
    }

    if (name === "start_time" || name === "end_time") {
      setAppointment((prev) => ({
        ...prev,
        [name]: value + ":00",
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
          onSubmit={(e) => {
            e.preventDefault();
            createMutation.mutate(appointment);
          }}
        >
          {data ? (
            <select
              required={true}
              onChange={handleChange}
              name="appointment_type_id"
              id="apptype"
            >
              {data?.map((appType) => {
                return (
                  <option key={appType?.id} value={parseInt(+appType?.id)}>
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
            value={appointment?.appointment_date ?? currentDate}
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
                value={currentTime}
              />
            </label>
            <label htmlFor="endTime">
              End time{" "}
              <input
                onChange={handleChange}
                type="time"
                name="end_time"
                id="endTime"
                value={appointment?.end_time ?? endTime}
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
