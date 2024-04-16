import { useNavigate } from "react-router-dom";
import FullWithButton from "./FullWidthButton";
import GenericTopBar from "./GenericTopBar";
import { useAppointmentDataFromCreateAppointment } from "../../zustandStore/store";
import { format } from "date-fns";

export default function ({ onchange, onSubmit, onExit }) {
  const profileData = useAppointmentDataFromCreateAppointment(
    (state) => state.profileData
  );
  const patientData = useAppointmentDataFromCreateAppointment(
    (state) => state.patientData
  );
  const appointmentTypeData = useAppointmentDataFromCreateAppointment(
    (state) => state.appointmentTypeData
  );
  const appointmentData = useAppointmentDataFromCreateAppointment(
    (state) => state.appointmentData
  );
  //TODO finish this component

  return (
    <>
      <div className="min-w-full min-h-fit  border-slate-400 outline-slate-400 outline-offset-2 ">
        <GenericTopBar label={"Please Confirm"} onclick={() => onExit()} />
        <div>
          <p>{patientData.first_name || "" + " " + patientData.last_name}</p>
          <p>{appointmentTypeData.appointment_name}</p>
          <p>
            {format(appointmentData.appointment_date, "eee dd MMM")}{" "}
            {appointmentData.start_time}:{appointmentData.end_time}
          </p>
        </div>
        <div className="border-b bg-white hover:bg-slate-500   ">
          {" "}
          <input
            onchange={(event) => onchange(event)}
            type="checkbox"
            name="sendConfirmation"
          />{" "}
          <p>Send Confirmation email</p>
          <p>
            <span>Email:</span>
          </p>
        </div>
        <div className="border-b bg-white hover:bg-slate-500  ">
          <input
            onchange={(event) => onchange(event)}
            type="checkbox"
            name="sendReminder"
          />
          Send reminder Email 24 hours prior to appointment
        </div>
        <FullWithButton onclick={() => onclick()} />
      </div>
    </>
  );
}
