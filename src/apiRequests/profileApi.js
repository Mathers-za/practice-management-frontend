import axios from "axios";

const baseUrl = "http://localHost:4000";

export default async function getProfileData() {
  try {
    const { data } = await axios.get(baseUrl + "/profile/view", {
      withCredentials: true,
    });

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
