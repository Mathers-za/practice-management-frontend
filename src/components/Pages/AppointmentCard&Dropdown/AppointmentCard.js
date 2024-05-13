import { format } from "date-fns";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Chip } from "@mui/material";
import MainOptionsMenu from "../../Main Options/MainOptionsMenu";
import { motion, AnimatePresence } from "framer-motion";
import { useGlobalStore } from "../../../zustandStore/store";

export default function AppointmentCard({ appointmentData }) {
  const [chipProperties, setChipProperties] = useState();
  const {
    setGlobalAppointmentData,
    setGlobalPatientData,
    setGlobalAppointmentTypeData,
    globalAppointmentData,
  } = useGlobalStore();

  function handleOptionsClick() {
    setGlobalAppointmentData({
      appointment_date: appointmentData.appointment_date,
      start_time: appointmentData.start_time,
      end_time: appointmentData.end_time,
    });

    setGlobalPatientData({
      first_name: appointmentData.patient_first_name,
      last_name: appointmentData.patient_last_name,
      id: appointmentData.patient_id,
    });

    setGlobalAppointmentTypeData({
      appointment_name: appointmentData.appointment_name,
    });

    setShowOptionsMenu(!showOptionsMenu);
  }

  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  function getChipProperties(invoiceStatus) {
    const properties = {};
    if (invoiceStatus) {
      switch (invoiceStatus) {
        case "In progress":
          properties.color = "warning";
          properties.label = "Invoice created";

          break;
        case "Paid":
          properties.color = "success";
          properties.label = "Invoice Paid";
          break;
        case "Sent":
          properties.color = "secondary";
          properties.label = "Invoice Sent";
          break;
      }
    } else {
      properties.color = "primary";
      properties.label = "new";
    }
    return properties;
  }

  useEffect(() => {
    if (appointmentData) {
      setChipProperties(getChipProperties(appointmentData.invoice_status));
    }
  }, [appointmentData]);

  return (
    <>
      <div className="h-fit w-full ">
        <div className="flex border-b  border-black">
          <div className="w-4/5 min-h-full pl-7 flex gap-5 py-2 items-center ">
            <div>
              <div
                onClick={handleOptionsClick}
                className=" hover:bg-slate-300  size-7 rounded-full flex items-center justify-center"
              >
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
                  color={chipProperties?.color}
                  variant="filled"
                  label={chipProperties?.label}
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
      <AnimatePresence>
        {showOptionsMenu && (
          <div className="fixed left-0 top-0 z-10 bg-black/20 w-full h-screen flex items-end">
            <motion.div
              className="w-full h-full"
              initial={{ height: "0%" }}
              animate={{ height: "50%" }}
              exit={{ height: "0%" }}
            >
              <MainOptionsMenu
                hideComponent={() => setShowOptionsMenu(!showOptionsMenu)}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
