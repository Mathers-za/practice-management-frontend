import { Route, Routes, useNavigate } from "react-router-dom";
import Entry from "./components/Pages/Entry";
import HomePage from "./components/Pages/HomePage";
import cookies from "js-cookie";
import { useEffect } from "react";

function App() {
  const navigate = useNavigate();
  const userSession = cookies.get("connect.sid.");
  console.log(userSession);
  navigate("/entry");
  /*useEffect(() => {
    if (userSession) {
      const sessionInfo = JSON.parse(userSession);

      navigate("/homePage");
    } else {
      navigate("/entry");
    }
  }, [navigate, userSession]); */

  return (
    <>
      <Routes>
        <Route path="/entry" element={<Entry />} />
        <Route path="/homePage" element={<HomePage />} />
      </Routes>
    </>
  );
}

export default App;
