import { number, object, ref, string } from "yup";
import axiosRequest from "../apiRequests/apiRequests";
import { duration } from "@mui/material";

export const loginFormSchema = object({
  email: string("Invalid format")
    .email("Invalid Email")
    .required("Email required"),
  password: string("invalid format").required("password required"),
});

export const RegisterFormSchema = object({
  email: string("Invalid format")
    .email("Invalid email")
    .required("Email required")
    .test("email", "Email Address already exists", async (value, context) => {
      try {
        const response = await axiosRequest(
          "post",
          "/users/checkEmailExistence",
          {
            email: value,
          }
        );
        console.log("the reponse in test is " + response.status);
        if (response.status === 200) {
          return true;
        }
      } catch (error) {
        return false;
      }
    }),
  password: string("Invalid format")
    .matches(/[A-Z]+/, "Password must contain atleast one uppercase letter")
    .matches(/[a-z]+/, "Password must contain atleast one lowercase letter")
    .matches(/[^a-zA-Z0-9]+/, "Password must contain atleast one symbol")
    .min(8, "Password must contain a minimum of 8 characters")
    .required("Password required"),

  password_confirm: string("Invalid format")
    .oneOf([ref("password")], "Confirmation password does not match password")
    .required("Required"),
});

export const createPatientValidationSchema = object({
  first_name: string("Invalid Format").required("First name not provided"),
  last_name: string().nullable(),
  email: string().email().nullable(),
  contact_number: string("invalid format")
    .matches(/^\+27\d{9}$/, "Invalid phone number")
    .nullable(),
});

export const createAppointmentTypeValidationSchema = object({
  appointment_name: string().required("Appointment name required"),
  duration: number("invalid format- needs to be a number")
    .positive()
    .min(0)
    .required()
    .integer("Duration must be a whole number, not a decimal"),
  price: number("Must be a valid number")
    .positive("The number must be postive")
    .required("The price is required field"),
});

export const updateAppointmentTypeValidatiionSchema = object({
  appointment_name: string().nonNullable("Appointment name cannot be empty"),
  duration: number("invalid format- needs to be a number")
    .positive("Postive value required")
    .nonNullable("Duration cannot be empty")
    .integer("Duration must be a whole number, not a decimal"),

  price: number("Must be a valid number").min(0, "").nonNullable(),
});
