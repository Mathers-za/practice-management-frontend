import styles from "./appCardStyle.module.css";
import { format } from "date-fns";
import AppointmentCardDropDown from "./AppointmentCardDropdown";
import { useEffect } from "react";

export default function AppointmentCard(props) {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.left}>
          <AppointmentCardDropDown
            patientId={props.patient_id}
            appointmentId={props.appointment_id}
            appointmentTypeId={props.apptype_id}
            setOverlayFlag={props.setOverlayFlag}
            patient_first_name={props.patient_first_name}
            patient_last_name={props.patient_last_name}
            amount_due={props.amount_due}
            appointmentsWithInvoicesRef={props.appointmentsWithInvoicesRef}
          />
        </div>
        <div className={styles.middle}>
          {" "}
          <p>{props.patient_first_name + " " + props.patient_last_name}</p>{" "}
          <p>
            {" "}
            {format(new Date(props.appointment_date), "eee dd MMM yyyy")}{" "}
            {props?.start_time?.slice(0, props.start_time.length - 3)} -{" "}
            {props?.end_time?.slice(0, props.end_time.length - 3)}
          </p>
          <p>
            {props.appointment_name} With{" "}
            {props.practitioner_first_name + " " + props.practitioner_last_name}{" "}
            at {props.practice_name}
          </p>
        </div>
        <div className={styles.right}>{props.apptype_price}</div>
      </div>
    </>
  );
}
