import { object, ref, string } from "yup";

export const loginFormSchema = object({
  email: string("Invalid format")
    .email("Invalid Email")
    .required("Email required"),
  password: string("invalid format")
    .required("password required")
    .min(8, "Password must be a minimum of 8 characters")
    .matches(/[^a-zA-Z0-9]+/, "Password must contain atleast one symbol")
    .matches(/[A-Z]+/, "Password must contain atleast one uppercase letter")
    .matches(/[a-z]+/, "Password must contain atleast one lowercase letter"),
  password_confirm: string("Invalid format").oneOf(
    [ref("password")],
    "Passwords must match"
  ),
});
