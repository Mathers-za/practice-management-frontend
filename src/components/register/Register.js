import React, { useState } from "react";
import {
  validateRegistrationEmail,
  validateRegistrationPassword,
} from "../../utiltyFunctions/validationFunctions";
import { postRegistrationData } from "../../apiRequests/userApi";

function Register() {
  const [errors, setErrors] = useState([]);

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

  async function handleSubmit(event) {
    event.preventDefault();
    setErrors([]);

    const emailErrors = await validateRegistrationEmail(registrationData.email);
    const passwordErrors = validateRegistrationPassword(
      registrationData.password,
      registrationData.confirmPassword
    );

    const allErrors = [...emailErrors, ...passwordErrors];
    setErrors(allErrors);
    console.log(errors.length);
    console.log(errors);

    if (allErrors.length === 0) {
      const data = await postRegistrationData(registrationData);
      console.log(data.success);
    }
  }

  return (
    <>
      <form className="container">
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

        <button type="submit" className="registerButton" onClick={handleSubmit}>
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
