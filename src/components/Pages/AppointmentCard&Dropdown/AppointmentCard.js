import "./appCardStyle.css";
import { format } from "date-fns";
import AppointmentCardDropDown from "./AppointmentCardDropdown";

export default function AppointmentCard(props) {
  console.log("thr props in appoiuntment card is" + props.appointment_id);
  return (
    <>
      <div className="container">
        <div className="left">
          <AppointmentCardDropDown
            patientId={props.patient_id}
            appointmentId={props.appointment_id}
          />
        </div>
        <div className="middle">
          {" "}
          <p>{props.patient_first_name + " " + props.patient_last_name}</p>{" "}
          <p>
            {" "}
            {format(new Date(props.appointment_date), "eee dd MMM yyyy")}{" "}
            {props.start_time.slice(0, props.start_time.length - 3)} -{" "}
            {props.end_time.slice(0, props.end_time.length - 3)}
          </p>
          <p>
            {props.appointment_name} With{" "}
            {props.practitioner_first_name + " " + props.practitioner_last_name}{" "}
            at {props.practice_name}
          </p>
        </div>
        <div className="right">{props.apptype_price}</div>
      </div>
    </>
  );
}
