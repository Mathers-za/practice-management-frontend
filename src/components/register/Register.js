import React, { useState } from "react";
import {
  validateRegistrationEmail,
  validateRegistrationPassword,
} from "../../utiltyFunctions/validationFunctions.js";

import axiosRequest from "../../apiRequests/apiRequests.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Register({ hidecomponent }) {
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

  async function handleSubmit() {
    const emailErrors = await validateRegistrationEmail(registrationData.email);
    const passwordErrors = validateRegistrationPassword(
      registrationData.password,
      registrationData.confirmPassword
    );
    console.log(passwordErrors);
    setErrors([...emailErrors, ...passwordErrors]);

    if (emailErrors.length === 0 && passwordErrors.length === 0) {
      try {
        const response = await axiosRequest(
          "post",
          "/users/register",
          registrationData
        );

        if (response.status === 201) {
          console.log("user created");
        }
      } catch (error) {
        console.error(error);
      }
      console.log("Post was a success");
      setRegistered(true);
    }
  }

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="flex justify-center">
            <FontAwesomeIcon
              icon="fa-solid fa-user-ninja"
              size="2xl"
              style={{ color: "#7c3aed" }}
            />
          </div>

          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Create an account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  onChange={handleChange}
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  onChange={handleChange}
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current_password"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password_confirm"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Confirm Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  onChange={handleChange}
                  id="password_confirm"
                  name="password_confirm"
                  type="password"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign in
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500 flex items-center justify-center">
            Already Registered?
            <div
              onClick={() => hidecomponent()}
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500 ml-1"
            >
              Click here to Login
            </div>
          </p>
        </div>
      </div>
    </>
  );
}
