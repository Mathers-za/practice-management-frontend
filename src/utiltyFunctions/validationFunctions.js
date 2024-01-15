import { getUsers } from "../apiRequests/userApi";

export function validateRegistrationEmail(email, setErrors) {
  const errors = [];

  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailPattern.test(email)) {
    errors.push("please enter a vlaid email address");
  }

  const userData = getUsers();
  console.log(userData);

  if (userData.email === email) {
    errors.push("Email already exists");
  }

  setErrors((prev) => [...prev, ...errors]);
}

export function validateRegistrationPassword(
  password,
  passwordConfirm,
  setErrors
) {
  const errorMessages = [];
  const passwordPattern =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;

  if (password !== passwordConfirm) {
    errorMessages.push("Passwords do not match");
  }

  if (passwordPattern.test(password)) {
    errorMessages.push(
      "ensure your password is a minimum of 8 charcters and has atleast one of the follwing: an uppercase,lowercase,digit and special character."
    );
  }

  if (errorMessages.length > 0) {
    setErrors((prev) => [...prev, ...errorMessages]);
  }
}
