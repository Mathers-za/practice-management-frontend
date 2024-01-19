import axios from "axios";

const baseUrl = "http://localhost:4000";

export async function getUsers() {
  try {
    const result = await axios.get(baseUrl + "/users/view");

    return result.data.data;
  } catch (error) {
    console.error(error.message);
  }
}

export async function postData(endpoint, payload) {
  try {
    await axios.post(baseUrl + endpoint, payload, {
      withCredentials: true,
    });
  } catch (error) {
    console.error(error.message);
    throw error;
  }
}
