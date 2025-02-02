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

import defaultData from "../DefaultData/defaultData";

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
  first_name: string("Invalid Format").notOneOf(
    [null, ""],
    "Patient first name is required"
  ),
  last_name: string().nullable(),
  email: string().email().nullable(),
  contact_number: string("invalid format")
    .matches(/^0[1-9]{1}[0-9]{8}$/, "Invalid phone number")
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
        if (typeof value === "number") {
          const regEx = /^\d+(\.\d{1,2})?$/;
          console.log(context);
          return regEx.test(value);
        }
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

    .nonNullable("Price is required")
    .test(
      "2Decimals",
      "Invalid price. Cannot exceed 2 decimal places",
      (value) => {
        if (value === undefined) {
          return true;
        }
        const regEx = /^\d+(\.\d{1,2})?$/;
        return regEx.test(value);
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
    .matches(/^0[1-9]{1}[0-9]{8}$/, "Invalid phone number")
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
});

export const createPaymentValidationSchema = object({
  amount: number("Invalid format")
    .transform((value) => (isNaN(value) ? null : value))
    .nonNullable("Payment amount cannot be empty")

    .positive("Amount cannot be zero or negative")

    .test(
      "compareWithAmountDue",
      "Payment amount cannot exceed amount due",
      function (value, context) {
        if (typeof value === "number") {
          const { amount_due } = context.options;
          return value <= amount_due;
        }
      }
    )
    .test(
      "checkPaymentAmountDecimals",
      "Invalid payment amount. Cannot exceed 2 decimal places",
      (value, context) => {
        if (typeof value === "number") {
          const regEx = /^\d+(\.\d{1,2})?$/;

          return regEx.test(value);
        }
      }
    ),
  payment_method: string()
    .oneOf(
      [
        "Card",
        "Cash",
        "EFT",
        "Medical Aid",
        "Gift",
        "Client Credit",
        "Write off",
        "Voucher",
      ],
      "Payment method selected does not meet the allowed values"
    )
    .required("A payment method is required"),
  payment_reference: string().nullable(),
  payment_date: date().nonNullable("Payment date is required"),
});

export const invoicePageFinancialsValidation = object({
  total_amount: number()
    .transform((value) => (isNaN(value) ? null : value))

    .min(0, "Price cannot be negative")

    .test(
      "newAmountCantBeLessThanAmountPaid",
      "The appointment amount cannot be less than the amount paid",
      function (value, context) {
        if (value === undefined || value === null) {
          return true;
        } else {
          const { amount_paid } = context.options;
          console.log("the amount_paid is " + typeof amount_paid);
          console.log("the value is " + typeof value);
          if (typeof value === "number") {
            return parseFloat(value) >= parseFloat(amount_paid);
          }
        }
      }
    )
    .test(
      "CheckThatbalanceIsNotNegative",
      "The appointment balance cannot be negative ie appointment total - discount - amount paid is currently negative",
      (value, context) => {
        if (value === undefined || value === null) {
          return true;
        }
        const { amount_paid, discount = 0 } = context.options;
        if (
          parseFloat(value) - parseFloat(discount) - parseFloat(amount_paid) <
          0
        ) {
          return false;
        } else return true;
      }
    )
    .test(
      "2Decimals",
      "Invalid amount.ie Cannot exceed 2 decimal places",
      (value) => {
        if (value === undefined || value === null) {
          return true;
        } else {
          if (typeof value === "number") {
            const regEx = /^\d+(\.\d{1,2})?$/;

            return regEx.test(value);
          }
        }
      }
    ),
  discount: number()
    .transform((value) => (isNaN(value) ? null : value))

    .min(0, "Price cannot be negative")

    .test(
      "compareAgainstTotalAmount",
      "The Discount cannot exceed the total appointment amount",
      function (value, context) {
        if (value === undefined || value === null) {
          return true;
        }

        const { total_amount } = context.options;
        console.log("the total amount is " + total_amount);

        if (typeof value === "number") {
          return value <= total_amount;
        }
      }
    )
    .test(
      "2Decimals",
      "Invalid amount.ie Cannot exceed 2 decimal places",
      (value, context) => {
        if (value === undefined || value === null) {
          return true;
        }
        if (typeof value === "number") {
          const regEx = /^\d+(\.\d{1,2})?$/;
          console.log(context);
          return regEx.test(value);
        }
      }
    )
    .test(
      "CheckFornegativeAmountDue",
      "The discount you are trying to add will result in a negative balance which is invalid",
      (value, context) => {
        if (value === undefined || value === null) {
          return true;
        } else {
          const { total_amount, amount_paid } = context.options;
          console.log("total amount is " + total_amount);
          console.log("amount paid is " + amount_paid);

          if (
            parseFloat(total_amount) -
              parseFloat(amount_paid) -
              parseFloat(value) <
            0
          ) {
            return false;
          } else {
            return true;
          }
        }
      }
    ),
});

export const patientAdditionalInformationValidationSchema = object({
  date_of_birth: date().nullable(),
  billing_address: string().nullable(),
  initials: string().nullable(),
  gender: string()
    .oneOf(
      ["Male", "Female", "Other"],
      "Gender selection shoulder either be Male,Female or Other"
    )
    .nullable(),
  title: string()
    .oneOf(
      defaultData.defaultTitles,
      "Title is not included in the allowed list of titles"
    )
    .nullable(),
  bio: string().nullable(),
});

export const icdCodeValidationSchema = object({
  icd10_code: string("invalid format").transform((value) =>
    value === undefined ? null : value
  ),
  procedural_code: string().nullable(),
  price: number("Invalid format")
    .transform((value) => (isNaN(value) ? null : value))

    .min(0, "Price must be a minimum of 0")
    .notOneOf(["", null], "price cannot be nothing")
    .test("decimalCheck", "Price cannot exceed 2 decimal places", (value) => {
      if (value === undefined) {
        return true;
      } else {
        const regEx = /^\d+(\.\d{1,2})?$/;

        return regEx.test(value);
      }
    }),
});
