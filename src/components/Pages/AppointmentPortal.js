import { useEffect, useState } from "react";
import AppointmentSearch from "../AppointmentSearch";
import AppointmentCard from "./AppointmentCard&Dropdown/AppointmentCard.js";
import "./appointmentPortal.css";
import axios from "axios";
import { useAppointmentPortalStore } from "../../zustandStore/store.js";
export default function AppointmentPortal({ profileId }) {
  const appointmentsThathaveInvoices = useAppointmentPortalStore(
    (state) => state.appointmentsThathaveInvoices
  );
  const setAppointmentsThatHaveInvoices = useAppointmentPortalStore(
    (state) => state.setAppsThatHaveInvoices
  );

  return (
    <>
      <AppointmentSearch profileId={profileId} />
    </>
  );
}
