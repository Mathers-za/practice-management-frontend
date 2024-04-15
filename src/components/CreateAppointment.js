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
  const [showPatientPicker, setShowPatientPicker] = useState(false);
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

  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  const { createMutation } = usePostData("/appointments/createAppointment");
  const [patientName, setPatientName] = useState("");

  function handleAppointmentTypeSelect(appTypeData) {
    setAppointmentTypeDetails((prev) => ({
      ...prev,
      appoitnment_type_id: appTypeData.id,
    }));
  }

  function handlePatientPicker(patientData) {
    const fullName =
      (patientData?.first_name || "") + " " + (patientData?.last_name || "");
    setPatientName(fullName);
    setAppointment((prev) => ({ ...prev, patient_id: patientData.id }));
  }

  return (
    <>
      <form
        className="relative min-h-full border shadow-md shadow-slate-300 "
        onSubmit={async (e) => {
          e.preventDefault();
          const result = await createMutation.mutateAsync(appointment);
          await checkAndSetIcds(result.id, result.appointment_type_id);
        }}
      >
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
            icon={
              <FontAwesomeIcon
                icon="fa-regular fa-star"
                size="2xl"
                style={{ color: "#055bf0", marginRight: "30px" }}
              />
            }
            displayText={appointmentTypeDetails?.name || "Appointment Type"}
            onclick={() =>
              setShowAppointmentTypePicker(!showAppointmentTypeIcker)
            }
          />
          {showAppointmentTypeIcker && (
            <div className="  fixed left-0 top-0 bg-slate-100 bg-opacity-30 min-w-full min-h-screen z-10 flex  justify-center items-center">
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
            patientName ? (
              <div>
                <p>{patientName}</p>
                <p className="text-sm text-slate-700">Click to change</p>
              </div>
            ) : (
              "Select a Patient"
            )
          }
          onclick={() => setShowPatientPicker(!showPatientPicker)}
        />
        {showPatientPicker && (
          <div className="fixed top-0 left-0 min-w-full min-h-screen bg-white z-10 ">
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
            onclick={() => alert("hi")}
            disabled={Object.keys(appointment).length < 5}
          />
        </div>
      </form>
    </>
  );
}
