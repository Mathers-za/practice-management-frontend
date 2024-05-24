import axios from "axios";

export default async function axiosRequest(
  method,
  endpoint,
  payload = null,
  params = null
) {
  try {
    const response = await axios(endpoint, {
      baseURL: "http://localhost:4000",
      method: method,
      url: endpoint,
      withCredentials: true,
      data: payload && payload,
      params: params && params,
    });

    return response;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
}

async function checkAndSetIcds(appointmentId, appointmentTypeId) {
  const result1 = await axiosRequest("get", `/icd10Codes/view${appointmentId}`);

  const result2 = await axiosRequest(
    "get",
    `/predefinedIcd10/view${appointmentTypeId}`
  );

  if (result1.status === 200) {
    return;
  }

  if (result2.status === 200 && result1.status !== 200) {
    result2.data.forEach(async (code) => {
      await axiosRequest(`post`, `/icd10Codes/create${appointmentId}`, {
        icd_10_code: code.icd10_code,
        procedural_codes: code.procedural_code,
        price: code.price,
      });
    });
  }
}

export { checkAndSetIcds };
