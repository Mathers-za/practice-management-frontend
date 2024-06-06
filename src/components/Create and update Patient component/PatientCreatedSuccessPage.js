import { useNavigate } from "react-router-dom";
import GenericTopBar from "../miscellaneous components/GenericTopBar";
import MenuDivsWithIcon from "../miscellaneous components/MenuListDivsWithIcon";
import { useState } from "react";
import CreateAppointment from "../Appointment components/CreateAppointment";
import {
  ArrowForward,
  Info,
  AddAlarm,
  Add,
  Done,
  KeyboardArrowRight,
} from "@mui/icons-material";

export default function CreatePatientSuccessPage({
  hideComponent,
  resetCreateAppointmentFn,
}) {
  const navigate = useNavigate();
  const [showCreateAppointmentPage, setShowCreateAppointmentPage] =
    useState(false);
  return (
    <>
      <div className="h-full bg-white w-full">
        <GenericTopBar
          onclick={() => navigate("/")}
          label={"Patient successfully created"}
          showCloseOption={true}
        />
        <MenuDivsWithIcon
          iconStart={<ArrowForward />}
          text={"Go to client page"}
          onclick={() => navigate("/patientPortal/clientInfo")}
          iconEnd={<KeyboardArrowRight />}
        />
        <MenuDivsWithIcon
          text={"Add medical Aid information"}
          onclick={() => navigate("/patientPortal/clientInfo/medicalAid")}
          iconStart={<Info />}
          iconEnd={<KeyboardArrowRight />}
        />
        <MenuDivsWithIcon
          text={"Create an appointment"}
          onclick={() =>
            setShowCreateAppointmentPage(!showCreateAppointmentPage)
          }
          iconStart={<AddAlarm />}
          iconEnd={<KeyboardArrowRight />}
        />
        <MenuDivsWithIcon
          text={"Create another patient"}
          onclick={() => {
            resetCreateAppointmentFn();
            hideComponent();
          }}
          iconStart={<Add />}
          iconEnd={<KeyboardArrowRight />}
        />

        <MenuDivsWithIcon
          text={"Continue with what you were doing"}
          onclick={() => hideComponent()}
          iconStart={<Done />}
          iconEnd={<KeyboardArrowRight />}
        />
      </div>
      {showCreateAppointmentPage && (
        <div className="fixed left-0 top-0 w-full h-screen z-30">
          <div className="w-full h-full">
            <CreateAppointment
              hideComponent={() =>
                setShowCreateAppointmentPage(!showCreateAppointmentPage)
              }
            />
          </div>
        </div>
      )}
    </>
  );
}
