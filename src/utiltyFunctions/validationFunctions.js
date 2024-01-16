import { getUsers } from "../apiRequests/userApi";

export async function validateRegistrationEmail(email) {
  const errorMessages = [];

  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailPattern.test(email)) {
    errorMessages.push("please enter a valid email address");
  }

  const data = await getUsers();
  console.log(data);

  if (
    data.some((element) => element.email.toLowerCase() === email.toLowerCase())
  ) {
    errorMessages.push("Email address already exists");
  }

  return errorMessages;
}

export function validateRegistrationPassword(password, passwordConfirm) {
  const errorMessages = [];
  const passwordPattern =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;

  if (password !== passwordConfirm) {
    errorMessages.push("Passwords do not match");
  }

  if (!passwordPattern.test(password)) {
    errorMessages.push(
      "ensure your password is a minimum of 8 charcters and has atleast one of the follwing: an uppercase,lowercase,digit and special character."
    );
  }

  return errorMessages;
}
