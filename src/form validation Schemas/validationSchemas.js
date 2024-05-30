import {
  Schema,
  addMethod,
  boolean,
  date,
  number,
  object,
  ref,
  string,
} from "yup";
import axiosRequest from "../apiRequests/apiRequests";

addMethod(Schema, "stripEmptyString", function () {
  return this.transform((value) => (value === "" ? undefined : value));
});

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
    .matches(/^\+27[6-8][0-9]{8}$/, "Invalid phone number")
    .nullable(),
});

export const createAppointmentTypeValidationSchema = object({
  appointment_name: string("Invalid format").required(
    "Appointment name required"
  ),
  duration: number("invalid format- needs to be a number")
    .min(0, "Duration must be 0 minutes at a minimum")

    .required("Duration is required")
    .integer("Duration must be a whole number, not a decimal"),
  price: number("Must be a valid number")
    .min(0, "Price must be a minimum of 0")
    .required("The price is required field")
    .test(
      "2Decimals",
      "Invalid price. Cannot exceed 2 decimal places",
      (value, context) => {
        const regEx = /^\d+(\.\d{1,2})?$/;
        console.log(context);
        return regEx.test(value);
      }
    ),
});

export const updateAppointmentTypeValidatiionSchema = object({
  appointment_name: string("Invalid format")
    .min(1, "A name for the appointment type is required")
    .nonNullable("A name for the appointment type is required"),
  duration: number("Invalid format")
    .transform((value) => (isNaN(value) ? null : value))

    .min(0, "Duration must be a minimum of 0")
    .nonNullable("Duration is required")
    .integer("Duration must be a whole number, not a decimal"),
  price: number("Must be a valid number")
    .min(0, "Price must be a minimum of 0")

    .transform((value) => (isNaN(value) ? null : value))
    .nonNullable("Price is required")
    .test(
      "2Decimals",
      "Invalid price. Cannot exceed 2 decimal places",
      (value) => {
        if (value) {
          const regEx = /^\d+(\.\d{1,2})?$/;

          return regEx.test(value);
        } else return true;
      }
    ),
});

export const validatepreDefinedICD10CodeCreation = object({
  icd10_code: string().nullable(),
  procedural_code: string().nullable(),
  price: number()
    .transform((value) => (isNaN(value) ? null : value))
    .nullable()
    .min(0, "Price cannot be less than 0")
    .test(
      "2Decimals",
      "Invalid price. Cannot exceed 2 decimal places",
      (value, context) => {
        if (value) {
          const regEx = /^\d+(\.\d{1,2})?$/;
          console.log(context);
          return regEx.test(value);
        } else return false;
      }
    ),
});

export const profileValidationSchema = object({
  first_name: string("invalid format").nonNullable("First name is required"),
  last_name: string("Invalid format").nullable(),
  profile_email: string("Invalid format").email("Invalid email").nullable(),
  council_reg_num: string("Invalid format").nullable(),
  profession: string("invalid format").nullable(),
  contact_num: string("invalid format")
    .matches(/^\+27[6-8][0-9]{8}$/, "Invalid phone number")
    .nullable(),
});

export const practiceDetailsValidationSchema = object({
  practice_name: string("Invalid format").nullable(),
  practice_num: string("Invalid format").nullable(),
  practice_address: string("Invalid format").nullable(),
  billing_adress: string("Invalid format").nullable(),
  bank_details: string("Invalid format").nullable(),
});

export const createAppointmentValidationSchema = object({
  patient_id: number("invalid format").required("Please select a patient"),
  appointment_type_id: number("Invalid format").required(
    "Please select an appointment type"
  ),
  end_time: string("Invalid Format").required("Please select a end time"),
  start_time: string("Invalid format").required("Please select a start time"),
  send_reminder: boolean("Invalid format").required(
    "A boolean value is expected"
  ),
  sent_confirmation: boolean("Invalid format").required(
    "A boolean value is expected"
  ),
  appointment_date: date("A valid date is required").required(
    "Please select an appointment date"
  ),
});
