import { Route, Routes, useNavigate } from "react-router-dom";
import Entry from "./components/Pages/Entry";
import DashBoard from "./components/Pages/Dashboard";
import axiosRequest from "./apiRequests/apiRequests";
import { useEffect } from "react";
import Profile from "./components/Profile";
import PracticeDetails from "./components/PracticeDetails";

function App() {
  const navigate = useNavigate();
  useEffect(() => {
    async function checkSession() {
      try {
        const response = await axiosRequest("get", "/session/validate");

        if (response.data) {
          navigate("/dashboard/*", { replace: true });
        } else {
          navigate("/entry");
        }
      } catch (error) {
        console.error(error);
      }
    }

    checkSession();
  }, []);

  return (
    <>
      <Routes>
        <Route path="/entry" element={<Entry />} />
        <Route path="/dashboard/*" element={<DashBoard />} />
      </Routes>
    </>
  );
}

export default App;
