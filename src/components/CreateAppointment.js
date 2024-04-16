import { useNavigate } from "react-router-dom";
import { useFetchData, usePostData } from "../CustomHooks/serverStateHooks";
import { useEffect, useState } from "react";
import { format, add, set, parse } from "date-fns";

import { checkAndSetIcds } from "../apiRequests/apiRequests";
import GenericTopBar from "./miscellaneous components/GenericTopBar";
import DivSvgDisplayCombo from "./miscellaneous components/DivSvgLabelCombo";
import TimestartAndEndDisplay from "./miscellaneous components/TimeStartAndEndDisplay";

import AppointmentTypePicker from "./miscellaneous components/AppointmentTypePicker";
import { StaticTimePicker } from "@mui/x-date-pickers/StaticTimePicker";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import FullWithButton from "./miscellaneous components/FullWidthButton";
import PatientPicker from "./miscellaneous components/PatientPicker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAppointmentDataFromCreateAppointment } from "../zustandStore/store";
import AppointmentNotificationSettings from "./miscellaneous components/AppointmentNotificationSettings";

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
  const [showNotificationSettings, setShowNotificationSettings] =
    useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showPatientPicker, setShowPatientPicker] = useState(false);
  const { formattedCurrentDate, currentTime, endTime } = setDateAndTimes();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const setGlobalPatientData = useAppointmentDataFromCreateAppointment(
    (state) => state.setPatientData
  );
  const setGlobalAppointmentTypeData = useAppointmentDataFromCreateAppointment(
    (state) => state.setappointmentData
  );
  const setGlobalAppointmentData = useAppointmentDataFromCreateAppointment(
    (state) => state.setAppointmentData
  );
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState({
    appointment_date: calendarSelectedJsDateTimeString
      ? format(calendarSelectedJsDateTimeString, "yyyy-MM-dd")
      : formattedCurrentDate,
  });
  const [showAppointmentTypeIcker, setShowAppointmentTypePicker] =
    useState(false);

  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [appointmentSelectionDisplay, setAppointmentTypeSelectionDisplay] =
    useState("");

  const { createMutation } = usePostData("/appointments/createAppointment");
  const [patientSelectionDisplay, setPatientSelectionDisplay] = useState("");

  function handleAppointmentTypeSelect(appTypeData) {
    setAppointment((prev) => ({
      ...prev,
      appointment_type_id: appTypeData.id,
    }));

    setAppointmentTypeSelectionDisplay(
      <div>
        <p>{appTypeData?.appointment_name || ""}</p>{" "}
        <p className="text-slate-600 text-sm">
          {appTypeData.duration} mins. {appTypeData?.price || ""}
        </p>
      </div>
    );
    setShowAppointmentTypePicker(!showAppointmentTypeIcker);
    setGlobalAppointmentTypeData(appTypeData);
  }

  function handlePatientPicker(patientData) {
    const fullName =
      (patientData?.first_name || "") + " " + (patientData?.last_name || "");
    setPatientSelectionDisplay(fullName);
    setAppointment((prev) => ({ ...prev, patient_id: patientData.id }));
    setShowPatientPicker(!showPatientPicker);
    setGlobalPatientData(patientData);
  }
  async function handleSubmission(sendConfirmation, sendReminder) {
    if (sendReminder) {
      setAppointment((prev) => ({ prev, send_reminder: true }));
    }

    if (sendConfirmation) {
      //api call
    }
    //TODO - integrate the notifications fucntionality
    const result = await createMutation.mutateAsync(appointment);
    await checkAndSetIcds(result.id, result.appointment_type_id);
  }

  return (
    <>
      <div className="relative min-h-full border shadow-md shadow-slate-300">
        <GenericTopBar label="Create Appointment" />

        <DivSvgDisplayCombo
          icon={
            <FontAwesomeIcon
              icon="fa-regular fa-calendar"
              size="2xl"
              style={{ color: "#055bf0", marginRight: "30px" }}
            />
          }
          displayText={
            <div>
              <p>{format(appointment.appointment_date, "eee dd MMM")}</p>{" "}
              <p className="text-sm text-slate-700">
                Click to change Selected day
              </p>
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
            icon={
              <FontAwesomeIcon
                icon="fa-regular fa-clock"
                size="2xl"
                style={{ color: "#055bf0", marginRight: "30px" }}
              />
            }
            displayText={
              <TimestartAndEndDisplay
                endTimeValue={appointment.end_time}
                startTimeValue={appointment.start_time}
                onclickStartTime={() =>
                  setShowStartTimePicker(!showStartTimePicker)
                }
                onclickEndTime={() => setShowEndTimePicker(!showEndTimePicker)}
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
                  value={
                    appointment?.start_time
                      ? new Date(appointment.start_time)
                      : new Date()
                  }
                  onAccept={(value) => {
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
                  value={
                    appointment?.end_time
                      ? new Date(appointment.end_time)
                      : new Date()
                  }
                  onAccept={(value) => {
                    setAppointment((prev) => ({
                      ...prev,
                      end_time: format(value, "HH:mm"),
                    }));
                    setShowEndTimePicker(!showEndTimePicker);
                  }}
                  defaultValue={new Date()}
                  slotProps={{
                    actionBar: { actions: ["cancel", "accept"] },
                    layout: {
                      onCancel: () => setShowEndTimePicker(!showEndTimePicker),
                    },
                  }}
                />
              </div>
            </div>
          )}
          <DivSvgDisplayCombo
            icon={
              <FontAwesomeIcon
                icon="fa-regular fa-star"
                size="2xl"
                style={{ color: "#055bf0", marginRight: "30px" }}
              />
            }
            displayText={
              appointmentSelectionDisplay || "Select an Apppointment Type"
            }
            onclick={() =>
              setShowAppointmentTypePicker(!showAppointmentTypeIcker)
            }
          />
          {showAppointmentTypeIcker && (
            <div className="  fixed left-0 top-0 bg-black bg-opacity-40 bg-opacity-30 min-w-full min-h-screen z-10 flex  justify-center items-center">
              <AppointmentTypePicker
                hideComponent={() =>
                  setShowAppointmentTypePicker(!showAppointmentTypeIcker)
                }
                profileId={profileId}
                onclick={handleAppointmentTypeSelect}
              />
            </div>
          )}
        </div>

        <DivSvgDisplayCombo
          icon={
            <FontAwesomeIcon
              icon="fa-regular fa-user"
              size="2xl"
              style={{ color: "#055bf0", marginRight: "30px" }}
            />
          }
          displayText={
            patientSelectionDisplay ? (
              <div>
                <p>{patientSelectionDisplay}</p>
                <p className="text-sm text-slate-700">Click to change</p>
              </div>
            ) : (
              "Select a Patient"
            )
          }
          onclick={() => setShowPatientPicker(!showPatientPicker)}
        />
        {showPatientPicker && (
          <div className="fixed top-0 left-0 min-w-full min-h-full max-h-fit bg-white z-10 overflow-y-scroll ">
            <PatientPicker
              profileId={profileId}
              hideComponent={() => setShowPatientPicker(!showPatientPicker)}
              onclick={handlePatientPicker}
            />
          </div>
        )}
        <div className="absolute bottom-0 left-0 w-full mb-1">
          <FullWithButton
            contentText="Confirm and Create Appointment"
            onclick={() => {
              setGlobalAppointmentData(appointment);
            }}
            disabled={Object.keys(appointment).length < 5}
          />
        </div>
        {showNotificationSettings && (
          <div className="fixed left-0 top-0 w-full min-h-screen bg-black bg-opacity-50">
            <AppointmentNotificationSettings onSubmit={handleSubmission} />
          </div>
        )}
      </div>
    </>
  );
}
