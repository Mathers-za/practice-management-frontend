import { useEffect, useRef, useState } from "react";
import {
  useDeleteData,
  useFetchData,
} from "../../../CustomHooks/serverStateHooks";
import styles from "./ICDTable.module.css";
import CodeLineItem from "./LineItemSelection";

import { Button, IconButton } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import CustomLinearProgressBar from "../../miscellaneous components/CustomLinearProgressBar";
import { useIcd10Component } from "../../../zustandStore/store";
import CustomAlertMessage from "../../miscellaneous components/CustomAlertMessage";
//TODO add tailwind styles to table. its currenlty using styles

export default function ICD10Table({
  appointmentId,
  appointmentTypeId,

  queryKeyToInvalidate = "",
}) {
  const codeDataToEdit = useRef(null);
  const {
    data: ICD10Data,
    refetch: refetchIcd10Data,
    isLoading,
    isRefetching,
  } = useFetchData(`/icd10Codes/view${appointmentId}`, [
    "financialsControl,page,icd10Table,fetchIcd10Data",
  ]);

  const { deleteMutation } = useDeleteData(
    `/icd10Codes/delete`,
    queryKeyToInvalidate && queryKeyToInvalidate
  );

  const { data: predefinedICDCData } = useFetchData(
    `/predefinedIcd10/view${appointmentTypeId}`,
    "predefinedICDData"
  );

  const {
    isSuccessfullMutation,
    error,
    successfullMutationFeedbackMessage,
    setIsSuccessfullMutation,
    setError,
    setSuccessfullMutationFeedbackMessage,
  } = useIcd10Component();

  console.log("issucces global is " + isSuccessfullMutation); //TODO instead of this ugly use effect have a a handle dlete function
  useEffect(() => {
    let timeoutId = "";
    if (deleteMutation.isSuccess) {
      setIsSuccessfullMutation(true);
      setError(deleteMutation.error);
      setSuccessfullMutationFeedbackMessage("Code deleted");
      timeoutId = setTimeout(() => {
        deleteMutation.reset();
        setIsSuccessfullMutation(false);
      }, 2000);
      refetchIcd10Data();
    }

    return () => clearTimeout(timeoutId);
  }, [deleteMutation.isSuccess]);

  const [codesForMapping, setCodesForMapping] = useState();

  const [showLineItem, setShowLineItem] = useState(false);

  useEffect(() => {
    if (ICD10Data) {
      setCodesForMapping(ICD10Data);
    } else if (!ICD10Data && !predefinedICDCData) {
      setCodesForMapping([]);
    }
  }, [ICD10Data, predefinedICDCData]);

  return (
    <>
      <div className="w-full h-fit bg-white relative  ">
        <div className=" flex flex-col items-center  space-y-2 justify-center p-3">
          <table className="w-11/12  table-fixed ">
            <tr className="h-12">
              <th>ICD10-Code</th>
              <th>Procedural-Code</th>
              <th>Price</th>
            </tr>
            {codesForMapping && Object.keys(codesForMapping).length > 0 ? (
              codesForMapping
                .sort((a, b) => a.id - b.id)
                .map((code) => {
                  return (
                    <tr className="h-9">
                      <td>{code?.icd_10_code}</td>
                      <td>{code?.procedural_codes}</td>
                      <td>
                        <div className="flex w-full border-none items-center h-full">
                          <p className="w-11/12">{code?.price}</p>
                          <IconButton
                            sx={{
                              "&.MuiButtonBase-root": { padding: "0px" },
                            }}
                            onClick={() => {
                              setShowLineItem(true);
                              codeDataToEdit.current = code;
                            }}
                            color="secondary"
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            onClick={() => deleteMutation.mutate(code.id)}
                            color="error"
                            sx={{
                              "&.MuiButtonBase-root": { padding: "0px" },
                            }}
                          >
                            <Delete />
                          </IconButton>
                        </div>
                      </td>
                    </tr>
                  );
                })
            ) : (
              <tr>
                <td className={styles.noData} colSpan="3">
                  No data to display
                </td>
              </tr>
            )}
          </table>
          <div className="self-end">
            <Button
              variant="contained"
              onClick={() => {
                setShowLineItem(true);

                codeDataToEdit.current = undefined;
              }}
            >
              Add
            </Button>
          </div>
        </div>
        {showLineItem && (
          <div className="fixed w-full h-screen top-0 left-0 z-20  bg-black/40 flex justify-center items-center">
            <CodeLineItem
              refetchIcd10TableData={refetchIcd10Data}
              codeData={codeDataToEdit.current}
              hideComponent={() => setShowLineItem(!showLineItem)}
              QueryKeyToInvalidate={queryKeyToInvalidate}
            />
          </div>
        )}
        <CustomAlertMessage
          errorFlag={error}
          successFlag={isSuccessfullMutation}
          errorMessage={error}
          successMessage={successfullMutationFeedbackMessage}
        />
        <CustomLinearProgressBar isLoading={isLoading || isRefetching} />
      </div>
    </>
  );
}
