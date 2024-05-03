import {
  useBatchDeleteData,
  useFetchData,
  usePostData,
} from "../CustomHooks/serverStateHooks";
import { useEffect, useState } from "react";
import Input from "./miscellaneous components/DisplayTextInput";
import DeleteDustbin from "./miscellaneous components/DeleteDustbin";
import { useAppointmentTypeAndIcdAutomationsPage } from "../zustandStore/store";
import GenericButton from "./miscellaneous components/SubmitButton";
import { validatepreDefinedICD10CodeCreation } from "../form validation Schemas/validationSchemas";
import DisplaySingleError from "./miscellaneous components/WarningMessage";

export default function PreDefinedIcdCoding({ appTypeId }) {
  const { data: originalICDData } = useFetchData(
    `/predefinedIcd10/view${appTypeId}`,
    "icd10Data",
    undefined,
    0
  );
  const [errorMessage, setErrorMessage] = useState();

  const {
    icd10List,
    arrayOfIcdIdsToDelete,
    arrayOfIcdsToUpdate,
    copyOfOrginalIcdData,
    resetAll,
    updateIcdList,
    incrementTotal,
    decrementTotal,

    resetArrayOfIcdIdsToDelete,
    deleteIcdListItem,
    setIcd10List,
  } = useAppointmentTypeAndIcdAutomationsPage();
  const { createMutation } = usePostData(
    `/predefinedIcd10/batchCreate${appTypeId}`,
    "icd10Data"
  );
  const { deleteMutation } = useBatchDeleteData(
    `/predefinedIcd10/batchDeletion`
  );
  console.log("orginal icd data " + JSON.stringify(copyOfOrginalIcdData));
  console.log("active icd10data " + JSON.stringify(icd10List));
  console.log("array of icds to update " + JSON.stringify(arrayOfIcdsToUpdate));

  useEffect(() => {
    if (originalICDData && originalICDData.length > 0) {
      setIcd10List(originalICDData);
    } else setIcd10List([]);
  }, [originalICDData]);

  const [preDefinedIcdInputData, setPreDefinedIcdInputData] = useState({});

  function handleIcdInputChange(e) {
    const { name, value } = e.target;

    setPreDefinedIcdInputData((prev) => ({
      ...prev,
      [name]: value === "" ? null : value,
    }));
  }

  function handleDelete(codeObj) {
    deleteIcdListItem(codeObj.id);
    decrementTotal(codeObj?.price);
  }

  async function handleSubmit() {
    if (arrayOfIcdIdsToDelete.length > 0) {
      deleteMutation.mutate(arrayOfIcdIdsToDelete);
      resetArrayOfIcdIdsToDelete();
    }

    if (arrayOfIcdsToUpdate.length > 0) {
      createMutation.mutate(arrayOfIcdsToUpdate);
      resetAll();
    }
  }

  async function addIcdToList() {
    setErrorMessage();
    try {
      const cleanedData = validatepreDefinedICD10CodeCreation.cast(
        preDefinedIcdInputData,
        { assert: false }
      );
      const validatedData = await validatepreDefinedICD10CodeCreation.validate(
        cleanedData
      );

      updateIcdList(validatedData);

      incrementTotal(validatedData?.price);

      setPreDefinedIcdInputData({});
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  console.log(arrayOfIcdIdsToDelete);

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
            onClick={addIcdToList}
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
          {icd10List && icd10List.length > 0 ? (
            icd10List.map((code) => {
              return (
                <tr
                  className="h-10 gh hover:bg-slate-300 duration-100"
                  key={code?.id}
                >
                  <td className="border-none">{code?.icd10_code}</td>
                  <td className="border-none">{code?.procedural_code}</td>
                  <td className="border-none relative ">
                    {code?.price}
                    <div className=" absolute right-5 top-2 ">
                      <DeleteDustbin onclick={() => handleDelete(code)} />
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

        {errorMessage && <DisplaySingleError errorMessage={errorMessage} />}
        <div className="flex justify-end">
          <GenericButton
            text="Save"
            onclick={handleSubmit}
            disable={
              arrayOfIcdIdsToDelete.length === 0 &&
              arrayOfIcdsToUpdate.length === 0
            }
            type="submit"
          />
        </div>
      </div>
    </>
  );
}
