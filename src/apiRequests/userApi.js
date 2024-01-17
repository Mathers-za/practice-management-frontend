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

export async function postData(endpoint, data) {
  try {
    const result = await axios.post(baseUrl + endpoint, data);

    return result.data;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
}
