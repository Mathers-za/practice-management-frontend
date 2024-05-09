import styles from "./appCardStyle.module.css";
import { format } from "date-fns";
import AppointmentCardDropDown from "./AppointmentCardDropdown";
import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Chip } from "@mui/material";

export default function AppointmentCard({ appointmentData }) {
  return (
    <>
      <div className="h-fit w-full ">
        <div className="flex border-b  border-black">
          <div className="w-4/5 min-h-full pl-7 flex gap-5 py-2 items-center ">
            <div>
              <div className=" hover:bg-slate-300  size-7 rounded-full flex items-center justify-center">
                {" "}
                <FontAwesomeIcon
                  icon="fa-solid fa-ellipsis-vertical"
                  size="lg"
                  style={{ color: "#0a5ae6" }}
                />
              </div>
            </div>
            <div>
              <p>
                <Chip
                  size="small"
                  color="primary"
                  variant="filled"
                  label={appointmentData?.invoice_status || "New"}
                />{" "}
                {appointmentData.patient_first_name +
                  " " +
                  appointmentData.patient_last_name ?? ""}
              </p>
              <p className="text-sm">
                {format(
                  new Date(appointmentData.appointment_date),
                  "yyyy-MM-dd"
                )}
                , {appointmentData.start_time} - {appointmentData.end_time}
              </p>
              <p className="text-sm">
                {appointmentData?.appointment_name +
                  " " +
                  "with" +
                  " " +
                  appointmentData?.practitioner_first_name +
                  " " +
                  appointmentData?.practitioner_last_name || ""}{" "}
                at dentmaed medical centre
              </p>
            </div>
          </div>
          <div className="w-1/5 text-sm flex  min-h-full flex-col justify-center">
            {" "}
            <p>Appointment Total: R{appointmentData.total_amount}</p>
            <p>Amount paid: R{appointmentData.amount_paid}</p>
            <p> Amount Due: R{appointmentData.amount_due}</p>
          </div>
        </div>
      </div>
    </>
  );
}
