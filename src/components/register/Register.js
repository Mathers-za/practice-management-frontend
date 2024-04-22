import React, { useState } from "react";

import axiosRequest from "../../apiRequests/apiRequests.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { RegisterFormSchema } from "../../form validation Schemas/validationSchemas.js";

export default function Register({ hidecomponent }) {
  const [errors, setErrors] = useState({});

  const [registrationData, setRegistrationData] = useState({});

  function handleChange(event) {
    setErrors({});
    const { name, value } = event.target;
    setRegistrationData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      await RegisterFormSchema.validate(registrationData, {
        abortEarly: false,
      });
      try {
        const response = await axiosRequest(
          "post",
          "/users/register",
          registrationData
        );

        if (response.status === 201) {
          console.log("user created");
        }
        hidecomponent();
      } catch (error) {
        console.error(error);
      }
    } catch (error) {
      console.log("the error in test");
      console.error(error.inner);
      error.inner.forEach((err) => {
        if (!errors[err.path]) {
          setErrors((prev) => ({
            ...prev,
            [err.path]: err.message,
          }));
        }
      });
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
                    errors?.email
                      ? "block w-full rounded-md  border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-red-500 "
                      : "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  }
                />
              </div>
              {errors?.email ? (
                <p className="text-sm text-red-500">{errors.email}</p>
              ) : null}
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
                  className={
                    errors?.password
                      ? "block w-full rounded-md  border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-red-500 "
                      : "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  }
                />
                {errors?.password ? (
                  <p className="text-sm text-red-500">{errors.password}</p>
                ) : null}
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
                  className={
                    errors?.password_confirm
                      ? "block w-full rounded-md  border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-red-500 "
                      : "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  }
                />
                {errors?.password_confirm ? (
                  <p className="text-sm text-red-500">
                    {errors.password_confirm}
                  </p>
                ) : null}
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
