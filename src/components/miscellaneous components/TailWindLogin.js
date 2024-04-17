import React, { useState } from "react";

import Register from "../register/Register";

import axiosRequest from "../../apiRequests/apiRequests";
import { useNavigate } from "react-router-dom";

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

export default function TailWindLogin() {
  const navigate = useNavigate();
  const [registered, setRegistered] = useState(true);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [validationErrorMessages, setValidationErrorMessages] = useState([]);

  function handleClick() {
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
        const response = await axiosRequest("post", "/users/login", loginData);

        if (response.status === 200) {
          console.log("successfully logged in");
          navigate("/", { replace: true });
        }
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
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-10 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            alt="Your Company"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
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
                <div className="text-sm">
                  <a
                    href="#"
                    className="font-semibold text-indigo-600 hover:text-indigo-500"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="mt-2">
                <input
                  onChange={handleChange}
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
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
            Dont have an account?
            <div className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500 ml-1">
              Click here to register
            </div>
          </p>
        </div>
      </div>
    </>
  );
}
