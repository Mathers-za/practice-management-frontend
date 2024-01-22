import axios from "axios";

export default async function axiosRequest(method, endpoint, payload = null) {
  try {
    const response = await axios(endpoint, {
      baseURL: "http://localhost:4000",
      method: method,
      url: endpoint,
      withCredentials: true,
      data: payload,
    });

    return response;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
}
