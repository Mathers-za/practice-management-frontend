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
        <div className="flex border border-black">
          <div className=" w-1/5 min-h-full flex justify-center items-center   border-r border-inherit">
            <FontAwesomeIcon
              icon="fa-solid fa-ellipsis-vertical"
              size="lg"
              style={{ color: "#0a5ae6" }}
            />
          </div>
          <div className="w-4/5 h-full  ">
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
              {format(new Date(appointmentData.appointment_date), "yyyy-MM-dd")}
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
          <div className="1/5 flex items-center justify-center">
            {" "}
            R{appointmentData.amount_due}
          </div>
        </div>
      </div>
    </>
  );
}
