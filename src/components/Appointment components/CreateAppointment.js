import { usePostData } from "../../CustomHooks/serverStateHooks";
import { useEffect, useState } from "react";
import { format, add, addMinutes, set } from "date-fns";

import { createAppointmentValidationSchema } from "../../form validation Schemas/validationSchemas";
import { checkAndSetIcds } from "../../apiRequests/apiRequests";
import GenericTopBar from "../miscellaneous components/GenericTopBar";
import DivSvgDisplayCombo from "../miscellaneous components/DivSvgLabelCombo";
import TimestartAndEndDisplay from "../miscellaneous components/TimeStartAndEndDisplay";

import AppointmentTypePicker from "../miscellaneous components/AppointmentTypePicker";
import { StaticTimePicker } from "@mui/x-date-pickers/StaticTimePicker";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import { usePatientPortalStore } from "../../zustandStore/store";
import PatientPicker from "../miscellaneous components/PatientPicker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useGlobalStore } from "../../zustandStore/store";
import AppointmentNotificationSettings from "../miscellaneous components/AppointmentNotificationSettings";
import { Button } from "@mui/material";
import CustomAlertMessage from "../miscellaneous components/CustomAlertMessage";

function getEndTimeBasedOffDuration(
  startTime,

  duration
) {
  if (startTime) {
    const [hours, minutes] = startTime.split(":").map(Number);

    const dateTimeCombined = set(new Date(), {
      hours: hours,
      minutes: minutes,
    });

    const endTime = format(
      addMinutes(dateTimeCombined, parseInt(duration)),
      "HH:mm"
    );

    return endTime;
  }
}

export default function CreateAppointment({
  calendarSelectedJsDateTimeString,
  hideComponent,
  querykeyToInvalidate,
  hideCreateAppointmentComponent,
}) {
  const setterfnForPatientIdInPatientPortalTree = usePatientPortalStore(
    (state) => state.setPatientId
  );
  const [error, setError] = useState();
  const [showNotificationSettings, setShowNotificationSettings] =
    useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showPatientPicker, setShowPatientPicker] = useState(false);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const setGlobalPatientData = useGlobalStore(
    (state) => state.setGlobalPatientData
  );
  const { globalProfileData } = useGlobalStore();

  const {
    globalPatientData,
    globalAppointmentTypeData,
    setGlobalAppointmentTypeData,
  } = useGlobalStore();
  const setGlobalAppointmentData = useGlobalStore(
    (state) => state.setGlobalAppointmentData
  );
  const [appointmentTypeSelectionDisplay, setAppointmentTypeSelectionDisplay] =
    useState("");

  const [appointment, setAppointment] = useState({
    appointment_date: calendarSelectedJsDateTimeString
      ? calendarSelectedJsDateTimeString
      : format(new Date(), "yyyy-MM-dd"),
    send_reminder: false,
    sent_confirmation: false,
    start_time: calendarSelectedJsDateTimeString
      ? format(new Date(calendarSelectedJsDateTimeString), "HH:mm")
      : format(new Date(), "HH:mm"),
  });

  useEffect(() => {
    return () => {
      setGlobalPatientData("");
      setGlobalAppointmentTypeData("");
    };
  }, []);

  useEffect(() => {
    if (!appointment?.end_time && globalAppointmentTypeData?.duration) {
      setAppointment((prev) => ({
        ...prev,
        end_time: getEndTimeBasedOffDuration(
          appointment.start_time,
          globalAppointmentTypeData.duration
        ),
      }));
    }
  }, [globalAppointmentTypeData]);

  const [showAppointmentTypeIcker, setShowAppointmentTypePicker] =
    useState(false);

  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  const { createMutation: emailNotificationMutation } = usePostData(
    `/emailNotifications/sendConfirmationEmail`
  );

  const { createMutation: createAppointmentMutation } = usePostData(
    "/appointments/createAppointment",
    querykeyToInvalidate && querykeyToInvalidate
  );

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
    setGlobalPatientData(patientData);
    setAppointment((prev) => ({ ...prev, patient_id: patientData.id }));
    setterfnForPatientIdInPatientPortalTree(patientData.id);

    setShowPatientPicker(!showPatientPicker);
  }

  function handleEmailNotificationChanges(event) {
    const { name } = event.target;

    name === "sent_confirmation" &&
      setAppointment((prev) => ({
        ...prev,
        sent_confirmation: !appointment.sent_confirmation,
      }));
    name === "send_reminder" &&
      setAppointment((prev) => ({
        ...prev,
        send_reminder: !appointment.send_reminder,
      }));
  }

  useEffect(() => {
    setGlobalAppointmentData(appointment);
  }, [appointment]);

  async function handleConfirmAndCreateButtonClick() {
    try {
      await createAppointmentValidationSchema.validate(appointment);
      setError();
      setShowNotificationSettings(!showNotificationSettings);
    } catch (error) {
      setError(error.message);
    }
  }
  useEffect(() => {
    if (createAppointmentMutation.isSuccess) {
      setAppointment({
        sent_confirmation: false,
        send_reminder: false,
        appointment_date: calendarSelectedJsDateTimeString
          ? format(calendarSelectedJsDateTimeString, "yyyy-MM-dd")
          : new Date(),
      });
      setGlobalPatientData("");
      setAppointmentTypeSelectionDisplay("");
      setError();
    }
  }, [createAppointmentMutation.isSuccess]);
  async function handleSubmission() {
    try {
      const validatedData = await createAppointmentValidationSchema.validate(
        appointment
      );

      const result = await createAppointmentMutation.mutateAsync(validatedData);
      await checkAndSetIcds(result.id, result.appointment_type_id);

      if (result.sent_confirmation) {
        emailNotificationMutation.mutate({
          profileId: globalProfileData.id,
          appointmentId: result.id,
          patientId: result.patient_id,
        });
      }
    } catch (error) {
      setError(error.message);
      setAppointmentTypeSelectionDisplay("");

      setAppointment({
        appointment_date: calendarSelectedJsDateTimeString
          ? format(calendarSelectedJsDateTimeString, "yyyy-MM-dd")
          : format(new Date(), "yyyy-MM-dd"),
        send_reminder: false,
        sent_confirmation: false,
      });
    }
  }

  return (
    <>
      <div className="relative min-h-full w-full bg-white border ">
        <GenericTopBar label="Create Appointment" onclick={hideComponent} />

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
              orientation="portrait"
              value={new Date(appointment.appointment_date) || new Date()}
              onAccept={(value) => {
                setAppointment((prev) => ({
                  ...prev,
                  appointment_date: format(new Date(value), "yyyy-MM-dd"),
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
        <DivSvgDisplayCombo
          icon={
            <FontAwesomeIcon
              icon="fa-regular fa-star"
              size="2xl"
              style={{ color: "#055bf0", marginRight: "30px" }}
            />
          }
          displayText={
            appointmentTypeSelectionDisplay || "Select an Apppointment Type"
          }
          onclick={() =>
            setShowAppointmentTypePicker(!showAppointmentTypeIcker)
          }
        />
        {showAppointmentTypeIcker && (
          <div className="  fixed left-0 top-0 bg-black bg-opacity-40  min-w-full min-h-screen z-10 flex  justify-center items-center">
            <AppointmentTypePicker
              hideComponent={() =>
                setShowAppointmentTypePicker(!showAppointmentTypeIcker)
              }
              profileId={globalProfileData.id}
              onclick={handleAppointmentTypeSelect}
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
                endTimeValue={appointment?.end_time}
                startTimeValue={appointment?.start_time}
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
                  orientation="portrait"
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
                    calendarSelectedJsDateTimeString
                      ? new Date(calendarSelectedJsDateTimeString)
                      : new Date()
                  }
                  onAccept={(value) => {
                    setAppointment((prev) => ({
                      ...prev,
                      start_time: format(new Date(value), "HH:mm"),
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
                  orientation="portrait"
                  ampm={false}
                  value={
                    appointment?.end_time ? appointment.end_time : new Date()
                  }
                  onAccept={(value) => {
                    setAppointment((prev) => ({
                      ...prev,
                      end_time: format(new Date(value), "HH:mm"),
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
            globalPatientData ? (
              <div>
                <p>
                  {globalPatientData.first_name +
                    " " +
                    (globalPatientData?.last_name || "")}
                </p>
                <p className="text-sm text-slate-700">Click to change</p>
              </div>
            ) : (
              "Select a Patient"
            )
          }
          onclick={() => setShowPatientPicker(!showPatientPicker)}
        />
        {showPatientPicker && (
          <div className="fixed top-0 left-0 w-full h-screen max-h-fit bg-white z-10 overflow-auto ">
            <PatientPicker
              showTopBar={true}
              profileId={globalProfileData.id}
              hideComponent={() => setShowPatientPicker(!showPatientPicker)}
              onclick={handlePatientPicker}
              showAddPatientButton={{
                show: true,
                actionOnSave: (responsePatientData) => {
                  setAppointment((prev) => ({
                    ...prev,
                    patient_id: responsePatientData.id,
                  }));
                  console.log("Made it here yo");
                  setShowPatientPicker(!showPatientPicker);
                  setGlobalPatientData(responsePatientData);
                  setterfnForPatientIdInPatientPortalTree(
                    responsePatientData.id
                  );
                },
              }}
            />
          </div>
        )}

        <div className="absolute bottom-0 left-0 w-full ">
          <Button
            fullWidth
            size="large"
            color="primary"
            type="button"
            onClick={handleConfirmAndCreateButtonClick}
            variant="contained"
          >
            Confirm and Create Appointment
          </Button>
        </div>
        {showNotificationSettings && (
          <div className="fixed left-0 top-0  w-full min-h-screen flex justify-center items-center bg-black bg-opacity-50 z-10 ">
            <AppointmentNotificationSettings
              hideCreateAppointmentComponent={hideCreateAppointmentComponent}
              createMutationStateObject={createAppointmentMutation}
              onchange={handleEmailNotificationChanges}
              onsubmit={handleSubmission}
              hideComponent={() =>
                setShowNotificationSettings(!showNotificationSettings)
              }
            />
          </div>
        )}
        <CustomAlertMessage
          errorFlag={error}
          successFlag={createAppointmentMutation.isSuccess}
          errorMessage={error}
          successMessage="Successfully created appointment"
        />
      </div>
    </>
  );
}
