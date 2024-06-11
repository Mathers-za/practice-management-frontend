import { useNavigate } from "react-router-dom";

import GenericTopBar from "./GenericTopBar";
import { useGlobalStore } from "../../zustandStore/store";
import { format } from "date-fns";
import { Button, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useEffect, useRef, useState } from "react";
import UpdatePatientContactDetails from "../Create and update Patient component/UpdatePatientContactDetails";
import { useOnSubmitButtonTextstateManager } from "../../CustomHooks/otherHooks";
import { loginFormSchema } from "../../form validation Schemas/validationSchemas";

export default function ({
  onchange,
  onsubmit,
  hideComponent,
  createMutationStateObject,
  hideCreateAppointmentComponent,
}) {
  const { globalPatientData } = useGlobalStore();

  const [showPatientContactPage, setShowPatientContactPage] = useState(false);
  const saveAndAddAnotherButtonText = useOnSubmitButtonTextstateManager(
    "Save and add another",
    undefined,
    createMutationStateObject
  );
  const saveAndReturnHomeButtonText = useOnSubmitButtonTextstateManager(
    "Save and return home",
    undefined,
    createMutationStateObject
  );
  const [isNavigateHome, setIsNavigatehome] = useState(false);
  const patientData = useGlobalStore((state) => state.globalPatientData);
  const appointmentTypeData = useGlobalStore(
    (state) => state.globalAppointmentTypeData
  );
  const appointmentData = useGlobalStore(
    (state) => state.globalAppointmentData
  );

  console.log(
    "createmuation object succes is " + createMutationStateObject.isSuccess
  );
  const isSumbutAndAddAnother = useRef(false);

  useEffect(() => {}, [isNavigateHome, createMutationStateObject.isSuccess]);

  useEffect(() => {
    if (isNavigateHome && createMutationStateObject.isSuccess) {
      setTimeout(() => {
        hideCreateAppointmentComponent();
      }, 2000);
    }
    if (isSumbutAndAddAnother.current && createMutationStateObject.isSuccess) {
      hideComponent();
    }
  }, [
    isNavigateHome,
    createMutationStateObject.isSuccess,
    isSumbutAndAddAnother,
  ]);

  return (
    <>
      <div className="lg:w-2/6 min-h-96 relative flex flex-col md:w-2/4 sm:w-3/4  border-slate-400 outline-slate-400 outline-offset-2 bg-white rounded-md shadow-lg  ">
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
          <button
            disabled={!globalPatientData?.email}
            className="border  bg-white disabled:text-slate-400 disabled:bg-white   hover:bg-slate-400 px-3 py-4  select-none flex items-center font-medium  "
          >
            <input
              disabled={!globalPatientData?.email}
              onChange={(event) => onchange(event)}
              type="checkbox"
              name="sent_confirmation"
              className="w-5 h-5 mr-4 disabled:border-slate-400"
            />
            <p>Send Confirmation email</p>
          </button>
          <button
            disabled={!globalPatientData?.email}
            className="border bg-white disabled:text-slate-400 disabled:bg-white  hover:bg-slate-400 px-3 py-4  select-none flex items-center font-medium  "
          >
            <input
              disabled={!globalPatientData?.email}
              onChange={(event) => onchange(event)}
              type="checkbox"
              name="send_reminder"
              className="w-5 h-5 mr-4 disabled:border-slate-400   "
            />
            Send reminder Email 24 hours prior to appointment
          </button>
          <div className=" flex justify-evenly items-center w-full  bg-slate-200">
            <p>
              Email:{" "}
              {globalPatientData?.email ||
                "Not Provided. Add email in order to send notfications"}
            </p>
            <IconButton
              onClick={() => setShowPatientContactPage(!showPatientContactPage)}
              color="primary"
            >
              <EditIcon color="primary" />
            </IconButton>
          </div>
        </div>

        <div className="mt-3 gap-2 mb-3 px-3 items-center  flex justify-between right-0">
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
                setIsNavigatehome(true);
                onsubmit();
              }}
            >
              {saveAndReturnHomeButtonText}
            </Button>
            <Button
              size="small"
              variant="contained"
              color="primary"
              onClick={() => {
                onsubmit();

                isSumbutAndAddAnother.current = true;
              }}
            >
              {saveAndAddAnotherButtonText}
            </Button>
          </div>
        </div>
      </div>
      {showPatientContactPage && (
        <div className="fixed left-0 top-0 w-full  h-screen flex justify-center items-center z-30">
          <div className="w-[70%] h-[48%]">
            <UpdatePatientContactDetails
              hideComponent={() =>
                setShowPatientContactPage(!showPatientContactPage)
              }
              showTopBar={{
                show: true,
                label: "Update patient contact details",
                showCloseOption: true,
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
