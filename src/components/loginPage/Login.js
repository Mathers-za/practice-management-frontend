import React, { useState } from "react";
import { loginFormSchema } from "../../form validation Schemas/validationSchemas";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import axiosRequest from "../../apiRequests/apiRequests";
import { useNavigate } from "react-router-dom";
import DisplaySingleError from "../miscellaneous components/WarningMessage";

export default function LoginForm({ hideComponent }) {
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({});

  const [errors, setErrors] = useState({});
  const [failedLoginError, setFailedLoginError] = useState();

  function handleChange(event) {
    setErrors({});
    setFailedLoginError();
    const { name, value } = event.target;

    setLoginData((prev) => ({ ...prev, [name]: value }));
    setErrors({});
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      await loginFormSchema.validate(loginData, {
        abortEarly: false,
      });

      try {
        const response = await axiosRequest("post", "/users/login", loginData);

        if (response.status === 200) {
          navigate("/", { replace: true });
        }
      } catch (error) {
        if (error.response.status === 401) {
          setFailedLoginError(
            "Email Or password is incorrect. Please try again."
          );
        }
      }
    } catch (error) {
      error.inner.forEach((err) =>
        setErrors((prev) => ({
          ...prev,
          [err.path]: err.message,
        }))
      );
    }
  }

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center  px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="flex justify-center items-center">
            <FontAwesomeIcon
              icon="fa-solid fa-user-ninja"
              size="2xl"
              style={{ color: "#7c3aed" }}
            />
          </div>

          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form
            noValidate={false}
            className="space-y-6"
            onSubmit={handleSubmit}
          >
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
                  className={
                    errors.email
                      ? "block w-full rounded-md  border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-red-500 "
                      : "block w-full rounded-md  border-0 py-1.5  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  }
                />
                {errors?.email && (
                  <p className="text-sm text-red-500">{errors.email} </p>
                )}
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
                  autoComplete="current-password"
                  className={
                    errors.password
                      ? "block w-full rounded-md  border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-red-500 "
                      : "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  }
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password}</p>
                )}
              </div>
            </div>

            <div>
              <button
                type="onsubmit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign in
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500 flex items-center justify-center">
            Dont have an account?
            <div
              onClick={() => hideComponent()}
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500 ml-1"
            >
              Click here to register
            </div>
          </p>

          {failedLoginError && (
            <div className="mt-3">
              {" "}
              <DisplaySingleError errorMessage={failedLoginError} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
