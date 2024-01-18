import React, { useState } from "react";
import { postData } from "../../apiRequests/userApi";
import Register from "../register/Register";
import { useNavigate } from "react-router-dom";
import cookie from "js-cookie";

function validateEmail(email) {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const errorMessages = [];

  if (!email) {
    errorMessages.push("Email required");
  } else {
    const trimmedEmail = email.trim();

    if (!emailPattern.test(trimmedEmail)) {
      errorMessages.push("Please provide a valid email address");
    }
  }

  if (errorMessages.length > 0) {
    return { isValid: false, errorMessages: errorMessages };
  } else {
    return { isValid: true };
  }
}

function Login() {
  const [registered, setRegistered] = useState(true);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [validationErrorMessages, setValidationErrorMessages] = useState([]);
  const navigate = useNavigate();

  function hanldeClick() {
    setRegistered(false);
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setLoginData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setValidationErrorMessages([]);
    const verification = validateEmail(loginData.email);

    if (!verification.isValid) {
      setValidationErrorMessages(verification.errorMessages);
    } else {
      try {
        const data = await postData("/users/login", loginData);
        console.log("success");
        console.log(data);
        const sessionData = cookie.get("connect.sid");
        console.log(sessionData);

        //navigate("/homePage");
      } catch (error) {
        console.log(error);
        if (error.response.status === 401) {
          setValidationErrorMessages((prev) => [
            ...prev,
            "Email or password is incorrect",
          ]);
        } else {
          setValidationErrorMessages([
            "Unexpected Error: Please try again later",
          ]);
        }
      }
    }
  }

  return (
    <>
      {registered ? (
        <form onSubmit={handleSubmit}>
          <h1>Login Page</h1>
          <hr />
          <label htmlFor="email">
            email:{" "}
            <input
              type="text"
              required
              name="email"
              id="email"
              value={loginData.email}
              onChange={handleChange}
            />
          </label>
          Password:{" "}
          <label htmlFor="password">
            <input
              type="password"
              name="password"
              id="password"
              value={loginData.password}
              onChange={handleChange}
              required
            />
          </label>
          <button type="submit">Login</button>
          <p onClick={hanldeClick}>
            Not Registered? Click here to create an account
          </p>
          {validationErrorMessages && validationErrorMessages.length > 0 && (
            <ul>
              {validationErrorMessages.map((message, index) => {
                return <li key={index}>{message}</li>;
              })}
            </ul>
          )}
        </form>
      ) : (
        <Register />
      )}
    </>
  );
}

export default Login;
