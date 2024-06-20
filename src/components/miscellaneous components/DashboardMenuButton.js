import * as React from "react";
import Box from "@mui/material/Box";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import SearchIcon from "@mui/icons-material/Search";
import AccessAlarmsIcon from "@mui/icons-material/AccessAlarms";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import CreateAppointment from "../Appointment components/CreateAppointment";
import CreatePatient from "../Create and update Patient component/CreatePatient";
import PatientPickerComponent from "./PatientPicker";
import PatientList from "../PatientList";
import { usePatientPortalStore } from "../../zustandStore/store";
import { useNavigate } from "react-router-dom";

export default function DashboardMenuButton() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [showCreateAppointment, setShowCreateAppointment] =
    React.useState(false);
  const [showPatientSearch, setShowPatientSearch] = React.useState(false);
  const [showCreatePatient, setShowCreatePatient] = React.useState(false);
  const { setPatientId, setPatientData } = usePatientPortalStore();
  const navigate = useNavigate();
  const actions = [
    {
      icon: (
        <div
          onClick={() => {
            console.log("clicked appointment icon ");
            setShowCreateAppointment(!showCreateAppointment);
          }}
        >
          <AccessAlarmsIcon color="primary" />
        </div>
      ),
      name: "New appointment",
    },
    {
      icon: (
        <div onClick={() => setShowCreatePatient(!showCreatePatient)}>
          <PersonAddAltIcon color="primary" />
        </div>
      ),
      name: "New patient",
    },
    {
      icon: (
        <div onClick={() => setShowPatientSearch(!showPatientSearch)}>
          <SearchIcon color="primary" />
        </div>
      ),
      name: "Search patient",
    },
  ];

  function handlePatientSelection(patientObj) {
    navigate(`/patientPortal`);
    setPatientId(patientObj.id);
    setPatientData(patientObj);
    setShowPatientSearch(!showPatientSearch);
  }

  return (
    <>
      <div className="fixed right-0 bottom-0">
        <Box sx={{ height: 320, transform: "translateZ(0px)", flexGrow: 1 }}>
          <SpeedDial
            ariaLabel="Dashboard Menu Button"
            sx={{ position: "absolute", bottom: 16, right: 16 }}
            icon={<SpeedDialIcon />}
            onClose={handleClose}
            onOpen={handleOpen}
            open={open}
          >
            {actions.map((action) => (
              <SpeedDialAction
                key={action.name}
                icon={action.icon}
                tooltipTitle={action.name}
                onClick={handleClose}
              />
            ))}
          </SpeedDial>
        </Box>
      </div>
      {showCreateAppointment && (
        <div className="fixed top-0 overflow-auto  left-0 bg-black/30 z-10 flex justify-center items-center w-full h-screen">
          <CreateAppointment
            hideComponent={() =>
              setShowCreateAppointment(!showCreateAppointment)
            }
            hideCreateAppointmentComponent={() =>
              setShowCreateAppointment(!showCreateAppointment)
            }
          />
        </div>
      )}

      {showCreatePatient && (
        <div className="fixed top-0  left-0 bg-black/30 z-10 flex justify-center items-center w-full h-screen">
          <CreatePatient
            hideComponent={() => setShowCreatePatient(!showCreatePatient)}
          />
        </div>
      )}

      {showPatientSearch && (
        <div className="fixed top-0  left-0 bg-black/30 z-10 flex justify-center items-center w-full h-screen">
          <div className="bg-white w-2/3 h-2/3 overflow-auto">
            <PatientPickerComponent
              showTopBar={true}
              hideComponent={() => setShowPatientSearch(!showPatientSearch)}
              onclick={handlePatientSelection}
              showAddPatientButton={{
                show: true,
                hideComponent: () => setShowPatientSearch(!showPatientSearch),
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
