import {
  useDeleteData,
  useFetchData,
  usePostData,
} from "../CustomHooks/serverStateHooks";
import { useEffect, useState } from "react";

function cleanData(data) {
  const newObject = {};

  for (const property in data) {
    const value = data[property];

    if (property === "price" && typeof value === "string") {
      newObject[property] = data[property].replace(",", ".");
    } else {
      newObject[property] = data[property];
    }
  }
  return newObject;
}

export default function PreDefinedIcdCoding({ appTypeId }) {
  const { data } = useFetchData(
    `/predefinedIcd10/view${appTypeId}`,
    "icd10Data"
  );
  const { createMutation } = usePostData(
    `/predefinedIcd10/create${appTypeId}`,
    "icd10Data"
  );
  const { deleteMutation } = useDeleteData(
    `/predefinedIcd10/delete`,
    "icd10Data"
  );

  const [preDefinedIcdInputData, setPreDefinedIcdInputData] = useState({});

  useEffect(() => {
    if (data) {
    }
  }, [data]);

  function handleIcdInputChange(e) {
    const { name, value } = e.target;

    setPreDefinedIcdInputData((prev) => ({
      ...prev,
      [name]: value === "" ? null : value,
    }));
  }

  return (
    <>
      <div>
        <div>
          <input
            onChange={handleIcdInputChange}
            placeholder="ICD-10 code"
            type="text"
            name="icd10_code"
            value={preDefinedIcdInputData?.icd10_code ?? ""}
          />
          <input
            onChange={handleIcdInputChange}
            placeholder="Procedural-Code"
            type="text"
            name="procedural_code"
            value={preDefinedIcdInputData?.procedural_code ?? ""}
          />
          <input
            onChange={handleIcdInputChange}
            placeholder="Price"
            type="number"
            name="price"
            value={preDefinedIcdInputData?.price ?? ""}
          />
        </div>
        <button
          disabled={Object.keys(preDefinedIcdInputData).length === 0}
          onClick={() => {
            const cleanedData = cleanData(preDefinedIcdInputData);

            createMutation.mutate(cleanedData);
            setPreDefinedIcdInputData({});
          }}
        >
          Add
        </button>
        <table>
          <tr>
            <th>ICD-10 </th>
            <th>Procedural-Code</th>
            <th>Price</th>
          </tr>
          {data && data?.length > 0 ? (
            data.map((code) => {
              return (
                <tr key={code.id}>
                  <td>{code.icd10_code}</td>
                  <td>{code.procedural_code}</td>
                  <td>
                    {code.price}
                    <button
                      type="button"
                      onClick={() => deleteMutation.mutate(code.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td>create some PreDefined ICD-10 codes to see them here.</td>
            </tr>
          )}
        </table>
      </div>
    </>
  );
}
