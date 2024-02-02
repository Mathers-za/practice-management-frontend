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

const queryClient = new QueryClient();

function App() {
  const [profileId, setProfileId] = useState();
  const navigate = useNavigate();

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
    console.log("mounted");

    checkSession();
  }, []);

  function setProfileIdProp(id) {
    setProfileId(id);
  }

  console.log("profile id state in app", profileId);

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
              element={<PatientList profileId={profileId} />}
            />
            <Route
              path="createAppointmentType"
              element={<AppTypeCreation profileId={profileId} />}
            />
            <Route
              path="patientCreate"
              element={<CreatePatient profileId={profileId} />}
            />
            <Route
              path="view/:patientId"
              element={<Patient profileId={profileId} />}
            />
          </Route>
        </Routes>
      </QueryClientProvider>
    </>
  );
}

export default App;
