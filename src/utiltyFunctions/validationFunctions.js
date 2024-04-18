import axiosRequest from "../apiRequests/apiRequests";

export async function validateRegistrationEmail(email) {
  const errorMessages = [];

  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailPattern.test(email)) {
    errorMessages.push("please enter a valid email address");
  }

  try {
    const response = await axiosRequest("get", "/users/view");

    if (response.status === 200 && response.data.data.length > 0) {
      response.data.data.some((user) => {
        if (email.toLowerCase() === user.email.toLowerCase()) {
          errorMessages.push("Email address already exists");
        }
      });
    }
  } catch (error) {
    console.error(error);
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

export class Validations {
  constructor(value) {
    this.value = value;
    this.errorArray = [];
    this.error = {
      isError: this.errorArray.length > 0 ? true : false,
      errorMessageArray: this.errorArray,
    };
  }

  min(number) {
    if (this.value.length < number) {
      this.errorArray.push(`A minimum of ${number} characters are required`);

      return this.error;
    }
  }

  max(number) {
    if (this.value.length > number) {
      this.errorArray.push(`A maximum of ${number} of characters are required`);
      return this.error;
    } else return this;
  }

  type(type) {
    if (typeof this.value !== type) {
      this.errorArray.push(`Not a valid format`);
      return this.error;
    }
    return this;
  }

  email() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.value)) {
      this.errorArray.push("Invalid Email");
      return this.error;
    }
    return this;
  }

  password() {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/;
    if (!passwordRegex.test(this.value)) {
      this.errorArray.push(
        "Password must contain at least one lowercase letter, one uppercase letter, one symbol, and be at least 8 characters long"
      );
      return this.error;
    }
    return true;
  }

  passwordConfirm(referencePassword, passwordToCompare) {
    if (passwordToCompare !== referencePassword) {
      this.errorArray.push("Passwords do not match");

      return this.error;
    }
    return this;
  }

  required() {}
}
