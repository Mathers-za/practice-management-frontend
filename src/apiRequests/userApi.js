import axios from "axios";

export async function getUsers() {
  try {
    const result = await axios.get("/users/view");

    return result.data;
  } catch (error) {
    console.error(error.message);
  }
}

export async function postRegistrationData(data) {
  const payload = { email: data.email, password: data.password };
  try {
    const result = await axios.post("/users/register", payload);

    return result.data;
  } catch (error) {
    console.error(error.message);
  }
}
