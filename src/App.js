import { Route, Routes, useNavigate } from "react-router-dom";
import Entry from "./components/Pages/Entry";
import HomePage from "./components/Pages/HomePage";

import { useEffect } from "react";
import axios from "axios";
import IntialSetUp from "./components/login/IntialSetUp";

function App() {
  const navigate = useNavigate();
  useEffect(() => {
    async function checkSession() {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/session/validate",
          { withCredentials: true }
        );

        console.log(data);
        if (data) {
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
        <Route path="/setUp" element={<IntialSetUp />} />
      </Routes>
    </>
  );
}

export default App;
