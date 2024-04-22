import { useState } from "react";
import Login from "../login/Login";
import Register from "../register/Register";

export default function Entry() {
  const [showLoginPage, setShowLoginPage] = useState(true);
  const [showRegistrationPage, setShowRegistrationPage] = useState(false);
  return (
    <>
      {showLoginPage && (
        <Login
          hideComponent={() => {
            setShowRegistrationPage(!showRegistrationPage);
            setShowLoginPage(!showLoginPage);
          }}
        />
      )}
      {showRegistrationPage && (
        <Register
          hidecomponent={() => {
            setShowLoginPage(!showLoginPage);
            setShowRegistrationPage(!showRegistrationPage);
          }}
        />
      )}
    </>
  );
}
