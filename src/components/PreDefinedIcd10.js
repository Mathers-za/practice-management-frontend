import {
  useDeleteData,
  useFetchData,
  usePostData,
} from "../CustomHooks/serverStateHooks";
import { useState } from "react";

function cleanData(data) {
  const cleanedPrice = data?.price.replace(".", ",") ?? null;

  const trimmedICD10Code = data?.icd10_code.trim() ?? null;
  const TrimmedProceduralCode = data?.procedural_code.trim() ?? null;
  return {
    cleanedData: {
      price: cleanedPrice,
      icd10_code: trimmedICD10Code,
      procedural_code: TrimmedProceduralCode,
    },
  };
}

export default function PreDefinedIcdCoding({ appTypeId }) {
  const { data } = useFetchData(`/predefinedIcd10/view${appTypeId}`);
  const { createMutation } = usePostData(`/predefinedIcd10/create${appTypeId}`);

  const { deleteMutation } = useDeleteData(
    `/predefinedIcd10/delete${appTypeId}`
  );

  const [preDefinedIcdInputData, setPreDefinedIcdInputData] = useState({});

  function handleIcd10Delete(id) {
    deleteMutation.mutate({ id: id });
  }

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
            const { cleanedData } = cleanData(preDefinedIcdInputData);
            console.log(
              "this is what the cleaned data looks like" + cleanedData
            );
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
                    {code.price}{" "}
                    <button onClick={deleteMutation.mutate({ id: code.id })}>
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
