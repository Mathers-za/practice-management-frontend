import {
  useDeleteData,
  useFetchData,
  usePostData,
} from "../CustomHooks/serverStateHooks";
import { useEffect, useState } from "react";
import Input from "./miscellaneous components/DisplayTextInput";
import DeleteDustbin from "./miscellaneous components/DeleteDustbin";

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
  const { data, refetch } = useFetchData(
    `/predefinedIcd10/view${appTypeId}`,
    "icd10Data"
  );
  const { createMutation } = usePostData(
    `/predefinedIcd10/create${appTypeId}`,
    "viewAllAppointmentTypes"
  );
  const { deleteMutation } = useDeleteData(
    `/predefinedIcd10/delete`,
    "viewAllAppointmentTypes"
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

  //TODO refactor this page, make a resuable add button and fix the rations of the inputs

  return (
    <>
      <div className="bg-white space-y-4">
        <div className="flex gap-5 w-full flex-1 flex-wrap">
          <div className="grow">
            <Input
              onchange={handleIcdInputChange}
              placeholder="ICD-10 code"
              type="text"
              name="icd10_code"
              value={preDefinedIcdInputData?.icd10_code ?? ""}
            />
          </div>
          <div className="flex-1">
            {" "}
            <Input
              onchange={handleIcdInputChange}
              placeholder="Procedural-Code"
              type="text"
              name="procedural_code"
              value={preDefinedIcdInputData?.procedural_code ?? ""}
            />
          </div>
          <div className="flex-1">
            <Input
              onchange={handleIcdInputChange}
              placeholder="Price"
              type="number"
              name="price"
              value={preDefinedIcdInputData?.price ?? ""}
            />
          </div>

          <button
            className="flex-1"
            disabled={Object.keys(preDefinedIcdInputData).length === 0}
            onClick={async () => {
              const cleanedData = cleanData(preDefinedIcdInputData);

              await createMutation.mutateAsync(cleanedData);
              refetch();
              setPreDefinedIcdInputData({});
            }}
          >
            Add
          </button>
        </div>

        <table className=" w-full h-fit  ">
          <tr className="h-12 ">
            <th>ICD-10 </th>
            <th>Procedural/Tariff Codes</th>
            <th>Price</th>
          </tr>
          {data && data?.length > 0 ? (
            data.map((code) => {
              return (
                <tr
                  className="h-10 gh hover:bg-slate-300 duration-100"
                  key={code.id}
                >
                  <td className="border-none">{code.icd10_code}</td>
                  <td className="border-none">{code.procedural_code}</td>
                  <td className="border-none relative ">
                    {code.price}
                    <div className=" absolute right-5 top-2 ">
                      <DeleteDustbin
                        onclick={async () => {
                          await deleteMutation.mutateAsync(code.id);
                          refetch();
                        }}
                      />
                    </div>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={3} height={"40px"}>
                create some PreDefined ICD-10 codes to see them here.
              </td>
            </tr>
          )}
        </table>
      </div>
    </>
  );
}
