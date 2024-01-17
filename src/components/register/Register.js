import React, { useState } from "react";
import {
  validateRegistrationEmail,
  validateRegistrationPassword,
} from "../../utiltyFunctions/validationFunctions";
import { postData } from "../../apiRequests/userApi";
import Login from "../login/Login";

function Register() {
  const [errors, setErrors] = useState([]);
  const [registered, setRegistered] = useState(false);

  const [registrationData, setRegistrationData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;
    setRegistrationData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleClick() {
    setRegistered(true);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErrors([]);

    const emailErrors = await validateRegistrationEmail(registrationData.email);
    const passwordErrors = validateRegistrationPassword(
      registrationData.password,
      registrationData.confirmPassword
    );

    setErrors([...emailErrors, ...passwordErrors]);

    if (emailErrors.length === 0 && passwordErrors.length === 0) {
      await postData("/users/register", registrationData);
      console.log("Post was a success");
      setRegistered(true);
    }
  }

  return (
    <>
      {!registered ? (
        <form className="container" onSubmit={handleSubmit}>
          <h1>Register</h1>
          <hr />
          <label htmlFor="email">
            email:{" "}
            <input
              className="textBox"
              type="email"
              required
              placeholder="Please enter your email address"
              name="email"
              value={registrationData.email}
              onChange={handleChange}
            />
          </label>
          <label htmlFor="password">
            Password:{" "}
            <input
              className="passwordBox"
              type="password"
              name="password"
              required
              value={registrationData.password}
              onChange={handleChange}
            />
          </label>
          <label htmlFor="confirmPassword">
            Confirm Password:{" "}
            <input
              type="password"
              required
              name="confirmPassword"
              value={registrationData.passwordConfirm}
              onChange={handleChange}
            />
          </label>

          <button type="submit" className="registerButton">
            Submit
          </button>
          <p onClick={handleClick}>Already registered? CLick here to login</p>
          {errors && errors.length > 0 ? (
            <ul>
              {errors.map((errorMessage, index) => (
                <li key={index}>{errorMessage}</li>
              ))}
            </ul>
          ) : null}
        </form>
      ) : (
        <Login />
      )}
    </>
  );
}

export default Register;
