import { Route, Routes, useNavigate } from "react-router-dom";
import Entry from "./components/Pages/Entry";
import DashBoard from "./components/Pages/Dashboard";
import axiosRequest from "./apiRequests/apiRequests";
import { useEffect, useState } from "react";
import Profile from "./components/Profile";
import PracticeDetails from "./components/PracticeDetails";
import PatientList from "./components/PatientList";
import Patient from "./components/Patient";
import { QueryClient, QueryClientProvider } from "react-query";
import CreatePatient from "./components/CreatePatient";
import AppTypeCreation from "./components/AppointmentTypes";
import CreateAppointment from "./components/CreateAppointment";
import PatientPicker from "./components/Pages/PatientPickerPage";
import PatientPortal from "./components/Pages/PatientPortal";
import MedicalAid from "./components/MedicalAid";
import AppointmentTypePortal from "./components/Pages/AppointTypePortal";
import AppointmentTypeList from "./components/AppointmentTypeList";
import AppointmentSearch from "./components/AppointmentSearch";
import AppointmentPortal from "./components/Pages/AppointmentPortal";

const queryClient = new QueryClient();

function App() {
  const [profileId, setProfileId] = useState();
  const navigate = useNavigate();
  const [patientId, setPatientId] = useState();
  const [appTypeId, setAppTypeId] = useState();

  useEffect(() => {
    async function checkSession() {
      try {
        const response = await axiosRequest("get", "/session/validate");

        if (response.data === true) {
          navigate("/", { replace: true });
        } else {
          navigate("/entry");
        }
      } catch (error) {
        console.error(error);
      }
    }

    checkSession();
  }, []);

  function setProfileIdProp(id) {
    setProfileId(id);
  }

  function setPatientIdProp(id) {
    setPatientId(id);
    console.log("patinet id in app set to " + id);
  }

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/entry" element={<Entry />} />
          <Route
            path="/"
            element={<DashBoard profileIdStateSetter={setProfileIdProp} />}
          >
            <Route path="profile" element={<Profile profileId={profileId} />} />
            <Route
              path="practice"
              element={<PracticeDetails profileId={profileId} />}
            />

            <Route
              path="patient/search"
              element={
                <PatientList
                  profileId={profileId}
                  setPatientId={setPatientIdProp}
                />
              }
            />

            <Route
              path="patientCreate"
              element={<CreatePatient profileId={profileId} />}
            />

            <Route
              path="createAppointment"
              element={<CreateAppointment profileId={profileId} />}
            />

            <Route path="patientPicker" element={<PatientPicker />} />
            <Route
              path="patientPortal"
              element={
                <PatientPortal patientId={patientId} profileId={profileId} />
              }
            >
              <Route index element={<Patient patientId={patientId} />} />
              <Route
                path="medicalAid"
                element={<MedicalAid patientId={patientId} />}
              />
            </Route>
            <Route
              path="appointmentTypePortal"
              element={<AppointmentTypePortal profileId={profileId} />}
            >
              <Route
                path="createAppointmentType"
                element={<AppTypeCreation profileId={profileId} />}
              />

              <Route
                index
                element={<AppointmentTypeList profileId={profileId} />}
              />

              <Route path="view/:id" element={<AppTypeCreation />} />
            </Route>

            <Route
              path="appointmentPortal"
              element={<AppointmentPortal profileId={profileId} />}
            />
          </Route>
        </Routes>
      </QueryClientProvider>
    </>
  );
}

export default App;
