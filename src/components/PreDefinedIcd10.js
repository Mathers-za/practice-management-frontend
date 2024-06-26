import {
  useBatchDeleteData,
  useFetchData,
  usePostData,
} from "../CustomHooks/serverStateHooks";
import { useEffect, useRef, useState } from "react";
import CustomAlertMessage from "./miscellaneous components/CustomAlertMessage";
import DeleteDustbin from "./miscellaneous components/DeleteDustbin";
import { useAppointmentTypeAndIcdAutomationsPage } from "../zustandStore/store";
import {
  useOnSubmitButtonTextstateManager,
  useSetLoadingStates,
} from "../CustomHooks/otherHooks";

import DisplaySingleError from "./miscellaneous components/WarningMessage";
import { Button, TextField } from "@mui/material";
import { icdCodeValidationSchema } from "../form validation Schemas/validationSchemas";

export default function PreDefinedIcdCoding({ appTypeId, hideComponent }) {
  const { data: originalICDData, isFetching } = useFetchData(
    `/predefinedIcd10/view${appTypeId}`,
    ["appointmentTypeList,icdCodes"],
    undefined,
    0
  );
  const [errorMessage, setErrorMessage] = useState();

  const {
    icd10List,
    arrayOfIcdIdsToDelete,
    arrayOfIcdsToUpdate,

    resetAll,
    updateIcdList,
    incrementTotal,
    decrementTotal,
    setPredefinedIcdComponentLoadingState,
    resetArrayOfIcdIdsToDelete,
    deleteIcdListItem,
    setIcd10List,
  } = useAppointmentTypeAndIcdAutomationsPage();
  const { createMutation } = usePostData(
    `/predefinedIcd10/batchCreate${appTypeId}`,
    ["appointmentTypeList,icdCodes"]
  );
  const { deleteMutation } = useBatchDeleteData(
    `/predefinedIcd10/batchDeletion`,
    ["appointmentTypeList,icdCodes"]
  );
  const saveButtonText = useOnSubmitButtonTextstateManager(
    "Save",
    undefined,
    !createMutation.isIdle ? createMutation : deleteMutation
  );
  const isSendingApiRequest = useRef(false);

  useEffect(() => {
    if (originalICDData && originalICDData.length > 0) {
      setIcd10List(originalICDData);
    } else setIcd10List([]);
  }, [originalICDData]);

  const [preDefinedIcdInputData, setPreDefinedIcdInputData] = useState({});
  useSetLoadingStates(isFetching, setPredefinedIcdComponentLoadingState);
  function handleIcdInputChange(e) {
    const { name, value } = e.target;
    setPreDefinedIcdInputData((prev) => {
      if (name === "price" && (value === null || value === "")) {
        const { price, ...otherProperties } = prev;
        return otherProperties;
      } else {
        return {
          ...prev,
          [name]: value === "" ? null : value,
        };
      }
    });
  }

  function handleDelete(codeObj) {
    deleteIcdListItem(codeObj.id);
    decrementTotal(codeObj?.price);
  }

  async function handleSubmit() {
    if (arrayOfIcdIdsToDelete.length > 0) {
      isSendingApiRequest.current = true;
      deleteMutation.mutate(arrayOfIcdIdsToDelete);
      resetArrayOfIcdIdsToDelete();
    }

    if (arrayOfIcdsToUpdate.length > 0) {
      isSendingApiRequest.current = true;
      createMutation.mutate(arrayOfIcdsToUpdate);
      resetAll();
    }
  }
  useEffect(() => {
    if (createMutation.isIdle || deleteMutation.isIdle) {
      setTimeout(() => {
        isSendingApiRequest.current = false;
      }, 2000);
    }
  }, [createMutation.isIdle, deleteMutation.isIdle]);

  async function addIcdToList() {
    setErrorMessage();
    console.log("runs addicd function");
    console.log(
      "predfeined icd inout data " + JSON.stringify(preDefinedIcdInputData)
    );
    try {
      const validatedData = await icdCodeValidationSchema.validate(
        preDefinedIcdInputData
      );

      updateIcdList(validatedData);

      incrementTotal(validatedData?.price);

      setPreDefinedIcdInputData({});
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  return (
    <>
      <div className="bg-white space-y-4">
        <div className="flex gap-5 w-full flex-1 flex-wrap">
          <div className="grow">
            <TextField
              label="Icd10-code"
              fullWidth
              onChange={handleIcdInputChange}
              type="text"
              name="icd10_code"
              value={preDefinedIcdInputData?.icd10_code ?? ""}
              variant="standard"
            />
          </div>
          <div className="flex-1">
            <TextField
              fullWidth
              onChange={handleIcdInputChange}
              label="Procedural-code"
              type="text"
              name="procedural_code"
              value={preDefinedIcdInputData?.procedural_code ?? ""}
              variant="standard"
            />
          </div>
          <div className="flex-1">
            <TextField
              onChange={handleIcdInputChange}
              fullWidth
              variant="standard"
              label="Price"
              type="number"
              name="price"
              value={preDefinedIcdInputData?.price ?? ""}
            />
          </div>
          <div className="self-center">
            <Button
              variant="contained"
              sx={{ height: "fit-content" }}
              color="primary"
              onClick={addIcdToList}
              disabled={Object.keys(preDefinedIcdInputData).length === 0}
            >
              Add
            </Button>
          </div>
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

        <div className="flex justify-between">
          <Button
            type="button"
            variant="contained"
            color="inherit"
            onClick={() => hideComponent()}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={
              arrayOfIcdIdsToDelete.length === 0 &&
              arrayOfIcdsToUpdate.length === 0
            }
            onClick={handleSubmit}
          >
            {saveButtonText}
          </Button>
          <CustomAlertMessage
            errorFlag={errorMessage}
            successFlag={isSendingApiRequest.current}
            errorMessage={errorMessage}
            successMessage="Success"
          />
        </div>
      </div>
    </>
  );
}
