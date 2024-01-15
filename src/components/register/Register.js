import React, { useState } from "react";

import {
  validateRegistrationEmail,
  validateRegistrationPassword,
} from "../../utiltyFunctions/validationFunctions";
import { postRegistrationData } from "../../apiRequests/userApi";

function Register() {
  const [errors, setErrors] = [];

  const [registrationData, setRegistrationData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  function handleChange(event) {
    console.log(event);
    const { name, value } = event.target;
    setRegistrationData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    validateRegistrationEmail(registrationData.email, setErrors);
    validateRegistrationPassword(
      registrationData.password,
      registrationData.confirmPassword,
      setErrors
    );

    if (errors.length === 0) {
      const data = postRegistrationData(registrationData);
      console.log(data.success);
    }
  }

  return (
    <>
      <form>
        <h1>Register</h1>
        <hr />
        <label htmlFor="email">
          email:{" "}
          <input
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

        <button type="submit" onClick={handleSubmit}>
          Submit
        </button>
        <p>Login</p>
        {errors && errors.length > 0 ? (
          <ul>
            {errors.map((errorMessage, index) => (
              <li key={index}>{errorMessage}</li>
            ))}
          </ul>
        ) : null}
      </form>
    </>
  );
}

export default Register;
