import { Route, Routes, useNavigate } from "react-router-dom";
import Entry from "./components/Pages/Entry";
import HomePage from "./components/Pages/HomePage";
import axiosRequest from "./apiRequests/apiRequests";
import { useEffect } from "react";
import InitialSetUpPage from "./components/Pages/initialSetUpPage";

function App() {
  const navigate = useNavigate();
  useEffect(() => {
    async function checkSession() {
      try {
        const response = await axiosRequest("get", "/session/validate");

        if (response.data) {
          navigate("/setup", { replace: true });
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
        <Route path="/" element={<HomePage />} />
        <Route path="/setup" element={<InitialSetUpPage />} />
      </Routes>
    </>
  );
}

export default App;
