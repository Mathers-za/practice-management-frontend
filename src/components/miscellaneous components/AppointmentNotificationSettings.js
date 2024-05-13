import { useNavigate } from "react-router-dom";
import FullWithButton from "./FullWidthButton";
import GenericTopBar from "./GenericTopBar";
import { useGlobalStore } from "../../zustandStore/store";
import { format } from "date-fns";

export default function ({ onchange, onsubmit, onExit }) {
  const profileData = useGlobalStore((state) => state.profileData);
  const patientData = useGlobalStore((state) => state.patientData);
  const appointmentTypeData = useGlobalStore(
    (state) => state.appointmentTypeData
  );
  const appointmentData = useGlobalStore((state) => state.appointmentData);
  //TODO mostly done. make componenet for pathing pts once they create appoitnment
  //TODO needs error handling and validation

  return (
    <>
      <div className="w-2/6 min-h-96 relative  border-slate-400 outline-slate-400 outline-offset-2 bg-white rounded-md shadow-lg  ">
        <GenericTopBar label={"Please Confirm"} onclick={() => onExit()} />
        <div className="bg-black bg-opacity-70 text-white font-medium px-3 py-2  select-none ">
          <p>{patientData.first_name || "" + " " + patientData.last_name}</p>
          <p>{appointmentTypeData.appointment_name}</p>
          <p>
            {format(new Date(appointmentData.appointment_date), "eee dd MMM")}{" "}
            at {appointmentData.start_time} - {appointmentData.end_time}
          </p>
        </div>
        <div className="border-b  bg-white  hover:bg-slate-400 px-3 py-4  select-none flex items-center font-medium  ">
          {" "}
          <input
            onChange={(event) => onchange(event)}
            type="checkbox"
            name="sent_confirmation"
            className="w-5 h-5 mr-4 "
          />
          <p>Send Confirmation email</p>
        </div>
        <div className="border-b bg-white hover:bg-slate-400 px-3 py-4  select-none flex items-center font-medium  ">
          <input
            onChange={(event) => onchange(event)}
            type="checkbox"
            name="send_reminder"
            className="w-5 h-5 mr-4  "
          />
          Send reminder Email 24 hours prior to appointment
        </div>
        <div className="mt-3 absolute bottom-0 left-0  right-0">
          <FullWithButton contentText="Confirm and create" onclick={onsubmit} />
        </div>
      </div>
    </>
  );
}
