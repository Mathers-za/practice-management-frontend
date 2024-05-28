import { useNavigate } from "react-router-dom";

import GenericTopBar from "./GenericTopBar";
import { useGlobalStore } from "../../zustandStore/store";
import { format } from "date-fns";
import { Button } from "@mui/material";

export default function ({ onchange, onsubmit, hideComponent }) {
  const navigate = useNavigate();
  const profileData = useGlobalStore((state) => state.globalProfileData);
  const patientData = useGlobalStore((state) => state.globalPatientData);
  const appointmentTypeData = useGlobalStore(
    (state) => state.globalAppointmentTypeData
  );
  const appointmentData = useGlobalStore(
    (state) => state.globalAppointmentData
  );
  //TODO mostly done. make componenet for pathing pts once they create appoitnment
  //TODO needs error handling and validation

  return (
    <>
      <div className="w-2/6 min-h-96 relative flex flex-col   border-slate-400 outline-slate-400 outline-offset-2 bg-white rounded-md shadow-lg  ">
        <GenericTopBar
          label={"Please Confirm"}
          onclick={() => hideComponent()}
        />

        <div className="bg-black bg-opacity-70 text-white font-medium px-3 py-2  select-none ">
          <p>{patientData?.first_name || "" + " " + patientData?.last_name}</p>
          <p>{appointmentTypeData?.appointment_name}</p>
          <p>
            {format(new Date(appointmentData?.appointment_date), "eee dd MMM")}
            at {appointmentData?.start_time} - {appointmentData.end_time}
          </p>
        </div>
        <div className=" flex-grow flex flex-col gap-4 justify-center">
          <div className="border  bg-white  hover:bg-slate-400 px-3 py-4  select-none flex items-center font-medium  ">
            {" "}
            <input
              onChange={(event) => onchange(event)}
              type="checkbox"
              name="sent_confirmation"
              className="w-5 h-5 mr-4 "
            />
            <p>Send Confirmation email</p>
          </div>
          <div className="border bg-white hover:bg-slate-400 px-3 py-4  select-none flex items-center font-medium  ">
            <input
              onChange={(event) => onchange(event)}
              type="checkbox"
              name="send_reminder"
              className="w-5 h-5 mr-4  "
            />
            Send reminder Email 24 hours prior to appointment
          </div>
        </div>

        <div className="mt-3 mb-3 px-3 items-center  flex justify-between right-0">
          <Button
            size="small"
            variant="contained"
            color="inherit"
            onClick={() => hideComponent()}
          >
            Cancel
          </Button>
          <div className="flex gap-2">
            <Button
              size="small"
              variant="contained"
              color="primary"
              onClick={() => {
                onsubmit();
                navigate("/");
              }}
            >
              Add and return home
            </Button>
            <Button
              size="small"
              variant="contained"
              color="primary"
              onClick={() => {
                onsubmit();
                hideComponent();
              }}
            >
              Add and add another
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
