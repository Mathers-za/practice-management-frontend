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
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import FullWithButton from "./miscellaneous components/FullWidthButton";

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
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);

  const { formattedCurrentDate, currentTime, endTime } = setDateAndTimes();
  const [showDatePicker, setShowDatePicker] = useState(false);

  const navigate = useNavigate();
  const [appointment, setAppointment] = useState({
    appointment_date: calendarSelectedJsDateTimeString
      ? format(calendarSelectedJsDateTimeString, "yyyy-MM-dd")
      : formattedCurrentDate,
  });
  const [showAppointmentTypeIcker, setShowAppointmentTypePicker] =
    useState(false);
  const [appointmentTypeDetails, setAppointmentTypeDetails] = useState();
  const [showPatientPicker, setShowPatientPicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  const { createMutation } = usePostData("/appointments/createAppointment");

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
          className=""
          onSubmit={async (e) => {
            e.preventDefault();
            const result = await createMutation.mutateAsync(appointment);
            await checkAndSetIcds(result.id, result.appointment_type_id);
          }}
        >
          <GenericTopBar label="Create Appointment" />

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
            <div className="fixed left-0 top-0 min-w-full h-screen z-10 bg-slate-300 bg-opacity-50 flex items-center justify-center ">
              <StaticDatePicker
                value={appointment?.appointment_date || new Date()}
                onAccept={(value) => {
                  setAppointment((prev) => ({
                    ...prev,
                    appointment_date: value,
                  }));
                  setShowDatePicker(!showDatePicker);
                }}
                autoFocus={true}
                slotProps={{
                  actionBar: { actions: ["cancel", "today", "accept"] },
                }}
              />
            </div>
          )}
          <div>
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
                    ampm={false}
                    slotProps={{
                      actionBar: {
                        actions: ["cancel", "accept"],
                      },
                      layout: {
                        onCancel: () =>
                          setShowStartTimePicker(!showStartTimePicker),
                      },
                    }}
                    value={appointment?.start_time || new Date()}
                    onAccept={(value) => {
                      alert(value);
                      setAppointment((prev) => ({
                        ...prev,
                        start_time: format(value, "HH:mm"),
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
                      alert(value);
                      setAppointment((prev) => ({
                        ...prev,
                        end_time: format(value, "HH:mm"),
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
                onclick={handleAppointmentTypeSelect}
              />
            )}
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

      <DivSvgDisplayCombo
        displayText="Pick a patient"
        onclick={() => alert("yo")}
      />
      <FullWithButton
        contentText="Confirm and Create Appointment"
        onclick={() => alert("hi")}
        disabled={Object.keys(appointment).length < 5}
      />
    </>
  );
}
