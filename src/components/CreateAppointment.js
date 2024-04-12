import { useNavigate } from "react-router-dom";
import { useFetchData, usePostData } from "../CustomHooks/serverStateHooks";
import { useEffect, useState } from "react";
import { format, add, set, parse } from "date-fns";
import PatientPicker from "./Pages/PatientPickerPage";
import { checkAndSetIcds } from "../apiRequests/apiRequests";
import GenericTopBar from "./miscellaneous components/GenericTopBar";
import DivSvgDisplayCombo from "./miscellaneous components/DivSvgLabelCombo";
import TimestartAndEndDisplay from "./miscellaneous components/TimeStartAndEndDisplay";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import AppointmentTypePicker from "./miscellaneous components/AppointmentTypePicker";
import { StaticTimePicker } from "@mui/x-date-pickers/StaticTimePicker";

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
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);

  const { formattedCurrentDate, currentTime, endTime } = setDateAndTimes();
  const [showDatePicker, setShowDatePicker] = useState(false);

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
  const [showAppointmentTypeIcker, setShowAppointmentTypePicker] =
    useState(false);
  const [appointmentTypeDetails, setAppointmentTypeDetails] = useState();
  const [showPatientPicker, setShowPatientPicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

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

  useEffect(() => {
    setAppointment((prev) => ({
      ...prev,
      appointment_type_id: appointmentTypeDetails.id,
    }));
  }, [appointmentTypeDetails]);

  function handlePatientPickerOnclick(id, patientFirstName, patientLastName) {
    setAppointment((prev) => ({
      ...prev,
      patient_id: id,
      patientFullName: patientFirstName + " " + patientLastName,
    }));
    setShowPatientPicker(false);
  }

  function handleAppointmentTypeSelect(appTypeData) {
    setAppointmentTypeDetails((prev) => ({
      ...prev,
      appoitnment_type_id: appTypeData.id,
    }));
  }

  return (
    <>
      {!showPatientPicker ? (
        <form
          className="z-10 fixed left-0 top-0 min-h-screen min-w-full bg-white"
          onSubmit={async (e) => {
            e.preventDefault();
            const result = await createMutation.mutateAsync(appointment);
            await checkAndSetIcds(result.id, result.appointment_type_id);
          }}
        >
          <GenericTopBar label="Create Appointment" />
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
          <DivSvgDisplayCombo
            displayText={
              <div>
                {" "}
                <p>{format(appointment.appointment_date, "eee dd MMM")}</p>{" "}
                <p className="text-sm text-slate-400">
                  Click to change Selected day
                </p>{" "}
              </div>
            }
            onclick={() => setShowDatePicker(!showDatePicker)}
          />
          {showDatePicker && (
            <div className="z-10 flex items-center justify-center fixed left-0 top-0 min-w-full min-h-screen bg-opacity-50 bg-gray-400">
              <DateCalendar
                value={appointment?.appointment_date}
                onChange={(value) =>
                  setAppointment((prev) => ({
                    ...prev,
                    appointment_date: value,
                  }))
                }
              />
            </div>
          )}
          <div>
            /*{" "}
            <label htmlFor="startTime">
              Start Time
              <input
                required
                onChange={handleChange}
                type="time"
                name="start_time"
                id="startTime"
                value={appointment.start_time}
              />{" "}
              */
              <DivSvgDisplayCombo
                displayText={
                  <TimestartAndEndDisplay
                    endTimeValue={appointment.end_time}
                    startTimeValue={appointment.start_time}
                    onclickStartTime={() =>
                      setShowStartTimePicker(!showStartTimePicker)
                    }
                    onclickEndTime={() =>
                      setShowEndTimePicker(!showEndTimePicker)
                    }
                  />
                }
              />
              {showStartTimePicker && (
                <div className="fixed left-0 top-0 min-w-full min-h-screen bg-slate-400 bg-opacity-50 flex items-center justify-center">
                  <div className="w-1/3 h-fit ">
                    <StaticTimePicker
                      value={appointment?.start_time || new Date()}
                      onAccept={(value) => {
                        setAppointment((prev) => ({
                          ...prev,
                          start_time: value,
                        }));
                        setShowStartTimePicker(!showStartTimePicker);
                      }}
                    />
                  </div>
                </div>
              )}
              {showEndTimePicker && (
                <div className="fixed left-0 top-0 min-w-full min-h-screen bg-slate-400 bg-opacity-50 flex items-center justify-center">
                  <div className="w-1/3 h-fit ">
                    <StaticTimePicker
                      value={appointment?.end_time || new Date()}
                      onAccept={(value) => {
                        setAppointment((prev) => ({
                          ...prev,
                          end_time: value,
                        }));
                        setShowEndTimePicker(!showEndTimePicker);
                      }}
                    />
                  </div>
                </div>
              )}
              <DivSvgDisplayCombo
                displayText={appointmentTypeDetails?.name || "Appointment Type"}
                onclick={() =>
                  setShowAppointmentTypePicker(!showAppointmentTypeIcker)
                }
              />
              {showAppointmentTypeIcker && (
                <AppointmentTypePicker
                  hideComponent={() =>
                    setShowAppointmentTypePicker(!showAppointmentTypeIcker)
                  }
                  profileId={profileId}
                  onclick={handleAppointmentTypeChange}
                />
              )}
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
