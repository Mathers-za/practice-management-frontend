import axios from "axios";

export default async function axiosRequest(method, endpoint, data, params) {
  try {
    const response = await axios(endpoint, {
      baseURL: "http://localhost:4000",
      method,
      url: endpoint,
      withCredentials: true,
      data,
      params,
    });

    return response;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
}

async function checkAndSetIcds(appointmentId, appointmentTypeId) {
  const icd10Data = await axiosRequest(
    "get",
    `/icd10Codes/view${appointmentId}`
  );

  const predefinedICD10Data = await axiosRequest(
    "get",
    `/predefinedIcd10/view${appointmentTypeId}`
  );

  if (icd10Data.status === 200) {
    return;
  } else if (predefinedICD10Data.status === 200) {
    predefinedICD10Data.data.forEach(async (code) => {
      await axiosRequest(`post`, `/icd10Codes/create${appointmentId}`, {
        icd_10_code: code.icd10_code,
        procedural_codes: code.procedural_code,
        price: code.price,
      });
    });
  }
}

export { checkAndSetIcds };
