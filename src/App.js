import { Route, Routes, useNavigate } from "react-router-dom";
import Entry from "./components/login/Entry";
import DashBoard from "./components/Pages/Dashboard";
import axiosRequest from "./apiRequests/apiRequests";
import { useEffect, useRef, useState } from "react";
import Profile from "./components/Profile";
import PracticeDetails from "./components/PracticeDetails";
import PatientList from "./components/PatientList";
import Patient from "./components/Patient";
import { QueryClient, QueryClientProvider } from "react-query";

import AppTypeCreation from "./components/AppointmentTypes";

import PatientPicker from "./components/Pages/PatientPickerPage";
import PatientPortal from "./components/Pages/PatientPortal";
import MedicalAid from "./components/MedicalAid";

import AppointmentTypeList from "./components/AppointmentTypeList";
import AppointmentPortal from "./components/Pages/AppointmentPortal";
import PatientTreatmentNotesList from "./components/Pages/PatientTreatmentNotes/TreatmentNotesList";

import InvoicePortal from "./components/Pages/ICD10/InvoicePage";
import InvoiceProgressPage from "./components/Pages/financialsViewPortal/invoiceProgressComponents/InvoiceProgress";
import PastDueInvoices from "./components/Pages/financialsViewPortal/PastDueInvoices";
import PaymentsList from "./components/Pages/financialsViewPortal/paymentsList/PaymentsList";
import EmailCustomizationPage from "./components/Pages/email customizations/email customization page/EmailCustomizationPage";
import MainCalendar from "./components/Pages/Main Calendar/MainCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { library } from "@fortawesome/fontawesome-svg-core";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./mui themes/muiThemes";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import "@fontsource/inter";
import PatientPickerComponent from "./components/miscellaneous components/PatientPicker";
import ComponentView from "./tailWindSandbox/styleComponents";
import CreatePatient from "./components/Create and update Patient component/CreatePatient";
import CreateAppointment from "./components/Appointment components/CreateAppointment";
import ClientInfoPortal from "./components/Patient PortalComponents/ClientInfoPortal";
import UpdatePatientContactDetails from "./components/Create and update Patient component/UpdatePatientContactDetails";
import PatientAdditionalInformation from "./components/Patient PortalComponents/PatientAdditionalInfo";
import AppointmentsTab from "./components/Patient PortalComponents/AppointmentsTab";
import PatientPortalInvoiceTab from "./components/Patient PortalComponents/PatientPortalInvoiceTab";

const queryClient = new QueryClient();

function App() {
  const [profileId, setProfileId] = useState();
  const navigate = useNavigate();

  const [appTypeId, setAppTypeId] = useState();
  const patientIdRef = useRef(null);

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

  function setPatientIdProp(patientDataObj) {
    patientIdRef.current = patientDataObj.id;
    console.log(patientIdRef.current);
  }

  return (
    <>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <QueryClientProvider client={queryClient}>
            <Routes>
              <Route path="/entry" element={<Entry />} />
              <Route
                path="/"
                element={<DashBoard profileIdStateSetter={setProfileIdProp} />}
              >
                <Route
                  path="profile"
                  element={<Profile profileId={profileId} />}
                />
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
                    <PatientPortal
                      patientId={patientIdRef.current}
                      profileId={profileId}
                    />
                  }
                >
                  <Route
                    path="patientAppointments"
                    element={<AppointmentsTab />}
                  />
                  <Route
                    path="patientInvoices"
                    element={<PatientPortalInvoiceTab />}
                  />
                  <Route
                    path="treatmentNotes"
                    element={
                      <PatientTreatmentNotesList
                        patientId={patientIdRef.current}
                      />
                    }
                  />
                  <Route
                    index
                    element={
                      <UpdatePatientContactDetails
                        patientId={patientIdRef.current}
                      />
                    }
                  />
                  <Route path="clientInfo" element={<ClientInfoPortal />}>
                    <Route
                      index
                      element={
                        <UpdatePatientContactDetails
                          patientId={patientIdRef.current}
                        />
                      }
                    />
                    <Route
                      path="patientContactDetails"
                      element={
                        <UpdatePatientContactDetails
                          patientId={patientIdRef.current}
                        />
                      }
                    />
                    <Route
                      path="medicalAid"
                      element={<MedicalAid patientId={patientIdRef.current} />}
                    />
                    <Route
                      path="additionalInformation"
                      element={<PatientAdditionalInformation />}
                    />
                  </Route>
                </Route>
                <Route
                  path="appointmentTypePortal"
                  element={<AppointmentTypeList profileId={profileId} />}
                >
                  <Route
                    path="createAppointmentType"
                    element={<AppTypeCreation profileId={profileId} />}
                  />

                  <Route path="view/:id" element={<AppTypeCreation />} />
                </Route>

                <Route
                  path="appointmentPortal"
                  element={<AppointmentPortal profileId={profileId} />}
                />

                <Route path="invoicePortal" element={<InvoicePortal />} />

                <Route
                  path="invoiceProgress"
                  element={<InvoiceProgressPage profileId={profileId} />}
                />

                <Route
                  path="invoicesPastDue"
                  element={<PastDueInvoices profileId={profileId} />}
                />

                <Route
                  path="emailNotifications"
                  element={<EmailCustomizationPage profileId={profileId} />}
                />

                <Route
                  path="paymentsTracker"
                  element={<PaymentsList profileId={profileId} />}
                />

                <Route
                  path="calendar"
                  element={<MainCalendar profileId={profileId} />}
                />

                <Route path="componentStyling" element={<ComponentView />} />
              </Route>
            </Routes>
          </QueryClientProvider>
        </LocalizationProvider>
      </ThemeProvider>
    </>
  );
}
library.add(fab, fas, far);

export default App;
